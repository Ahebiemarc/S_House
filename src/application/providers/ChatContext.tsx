import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
    useCallback,
    useRef,
  } from 'react';
  import {
    IMessage as GiftedChatMessage,
    GiftedChat,
  } from 'react-native-gifted-chat';
  import {
    disconnectSocket,
    getSocket,
    initSocket,
    joinChatRoom,
    leaveChatRoom,
    offNewMessageReceived,
    onMessageError,
    onNewMessageReceived,
    sendMessageSocket,
  } from '../../infrastructure/api/socketService';
  import {
    createChatAPI,
    fetchChatsAPI,
    markChatAsReadAPI,
  } from '../../infrastructure/api/chats.api';
  import {
    fetchChatMessagesAPI,
  } from '../../infrastructure/api/message.api';
  import { AppChat, AppMessage } from '../../domain/interface/Message.interface';
  import { UserProps } from '../../domain/interface/User.interface';
  import { useAuth } from './AuthContext';
  import { Alert } from 'react-native';
  
  interface ChatContextType {
    chats: AppChat[];
    setChats: React.Dispatch<React.SetStateAction<AppChat[]>>;
    currentChatMessages: GiftedChatMessage[];
    loadChats: () => Promise<void>;
    loadMessagesForChat: (chatId: string, receiver: UserProps) => Promise<void>;
    sendMessage: (chatId: string, text: string, receiverId: string) => void;
    setCurrentChatIdAndReceiver: (
      chatId: string | null,
      receiver?: UserProps | null
    ) => void;
    isLoadingChats: boolean;
    isLoadingMessages: boolean;
    currentChatReceiver: UserProps | null;
    findOrCreateChatWithUser: (
      recipientId: string,
      recipientProfile: UserProps
    ) => Promise<AppChat | null>;
  }
  
  const ChatContext = createContext<ChatContextType | undefined>(undefined);
  
  const mapAppMessageToGiftedMessage = (
    appMessage: AppMessage,
    currentUserId: string,
    receiver?: UserProps | null
  ): GiftedChatMessage => {
    let giftedUser = appMessage.user;
    if (!giftedUser) {
      if (appMessage.senderId === currentUserId) {
        giftedUser = { _id: currentUserId, name: 'Vous' };
      } else if (receiver && appMessage.senderId === receiver.id) {
        giftedUser = {
          _id: receiver.id,
          name: receiver.username,
          avatar: receiver.avatar,
        };
      } else {
        giftedUser = {
          _id: appMessage.senderId,
          name: `Utilisateur ${appMessage.senderId.substring(0, 5)}`,
        };
      }
    }
    return {
      _id: appMessage._id,
      text: appMessage.text,
      createdAt: new Date(appMessage.createdAt),
      user: giftedUser,
    };
  };
  
  export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, token, loading: authIsLoading } = useAuth();
  
    const [chats, setChats] = useState<AppChat[]>([]);
    const [currentChatMessages, setCurrentChatMessages] = useState<GiftedChatMessage[]>([]);
    const [_currentChatId, _setCurrentChatId] = useState<string | null>(null);
    const [_currentChatReceiver, _setCurrentChatReceiver] = useState<UserProps | null>(null);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
    const currentChatIdRef = useRef(_currentChatId);
    const currentChatReceiverRef = useRef(_currentChatReceiver);
  
    useEffect(() => {
      currentChatIdRef.current = _currentChatId;
    }, [_currentChatId]);
  
    useEffect(() => {
      currentChatReceiverRef.current = _currentChatReceiver;
    }, [_currentChatReceiver]);
  
    /*useEffect(() => {
      if (user?.user && token && !authIsLoading) {
        initSocket(token);
      } else if ((!user?.user || !token) && !authIsLoading) {
        disconnectSocket();
      }
    }, [user?.user, token, authIsLoading]);*/

    useEffect(() => {
        if (user && token && !authIsLoading) {
            console.log("ChatContext: Authentification prête, initialisation du socket.");
            initSocket(token);
        } else if ((!user || !token) && !authIsLoading) {
            console.log("ChatContext: Utilisateur déconnecté ou token manquant, déconnexion du socket.");
            disconnectSocket();
        }
      }, [token]);
  
    useEffect(() => {
      const socketInstance = getSocket();
      if (user?.user && socketInstance?.connected) {
        const handleNewMessage = (newMessage: AppMessage) => {
          if (!user?.user) return;
  
          if (newMessage.chatId === currentChatIdRef.current) {
            setCurrentChatMessages(prevMessages =>
              GiftedChat.append(prevMessages,[mapAppMessageToGiftedMessage(newMessage, user.user.id, currentChatReceiverRef.current)])
            );
            markChatAsReadAPI(newMessage.chatId);
          }
  
          setChats(prevChats => {
            const chatExists = prevChats.some(chat => chat.id === newMessage.chatId);
            let updatedChats;
            if (chatExists) {
              updatedChats = prevChats.map(chat =>
                chat.id === newMessage.chatId
                  ? {
                      ...chat,
                      lastMessage: newMessage.text,
                      lastMessageAt: newMessage.createdAt,
                      unreadCount:
                        chat.id === currentChatIdRef.current
                          ? 0
                          : (chat.unreadCount || 0) + 1,
                    }
                  : chat
              );
            } else {
              updatedChats = [...prevChats];
            }
            return updatedChats.sort((a, b) =>
              new Date(b.lastMessageAt || b.createdAt).getTime() -
              new Date(a.lastMessageAt || a.createdAt).getTime()
            );
          });
        };
  
        const handleMessageError = (error: any) => {
          Alert.alert("Erreur Socket", "Un problème est survenu avec la connexion de messagerie.");
        };
  
        onNewMessageReceived(handleNewMessage);
        onMessageError(handleMessageError);
  
        return () => {
          offNewMessageReceived();
        };
      }
    }, [user?.user]);
  
    useEffect(() => {
      const socketInstance = getSocket();
      if (user?.user && socketInstance?.connected && _currentChatId) {
        joinChatRoom(_currentChatId);
        return () => {
          leaveChatRoom(_currentChatId);
        };
      }
    }, [user?.user, _currentChatId]);
  
    const setCurrentChatIdAndReceiver = useCallback(
      (chatId: string | null, receiver: UserProps | null = null) => {
        _setCurrentChatId(chatId);
        _setCurrentChatReceiver(receiver);
      },
      []
    );
  
    const loadChats = useCallback(async () => {
        if (!user?.user) return;
        setIsLoadingChats(true);
        try {
          const fetchedChats = await fetchChatsAPI(user.user.id);

          if (fetchedChats.length === 0) {
            return;
          }
      
          if (!Array.isArray(fetchedChats)) {
            console.error("fetchChatsAPI did not return an array:", fetchedChats);
            Alert.alert("Erreur", "Format inattendu des conversations.");
            return;
          }
      
          // Filtrer ou log les chats sans receiver pour éviter erreurs
          const validChats = fetchedChats.filter(chat => {
            if (!chat.receiver || !chat.receiver.username) {
              console.warn("Chat sans receiver ou receiver.username :", chat);
              return false;
            }
            return true;
          });
      
          setChats(validChats);
        } catch (error) {
          console.error("Erreur lors de la récupération des chats :", error);
          Alert.alert("Erreur", "Impossible de charger les conversations.");
        } finally {
          setIsLoadingChats(false);
        }
      }, [user?.user]);
      
  
    const loadMessagesForChat = useCallback(
      async (chatId: string, receiver: UserProps) => {
        if (!user?.user) return;
        setIsLoadingMessages(true);
        try {
          const fetchedAppMessages = await fetchChatMessagesAPI(
            chatId,
            receiver,
            user.user.id
          );
          setCurrentChatMessages(
            fetchedAppMessages
              .map(m => mapAppMessageToGiftedMessage(m, user.user.id, receiver))
              .reverse()
          );
          await markChatAsReadAPI(chatId);
          setChats(prev =>
            prev.map(c =>
              c.id === chatId ? { ...c, unreadCount: 0 } : c
            )
          );
        } catch (error) {
          Alert.alert("Erreur", "Impossible de charger les messages.");
          setCurrentChatMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      },
      [user?.user]
    );
  
    const sendMessage = useCallback(
      (chatId: string, text: string, receiverId: string) => {
        console.log("-----", receiverId);
        
        if (!user?.user) return;
        sendMessageSocket(chatId, text, user.user.id, receiverId); // ✅ Correct
      },
      [user?.user]
    );
  
    const findOrCreateChatWithUser = useCallback(
      async (
        recipientId: string,
        recipientProfile: UserProps
      ): Promise<AppChat | null> => {
        if (!user?.user) {
          Alert.alert("Erreur", "Vous devez être connecté pour démarrer une conversation.");
          return null;
        }
        const existingChat = chats.find(chat =>
          chat.userIDs.includes(user.user.id) &&
          chat.userIDs.includes(recipientId)
        );
        if (existingChat) return existingChat;
  
        try {
          const newOrExistingChat = await createChatAPI(
            recipientId,
            user.user.id
          );
          setChats(prevChats => {
            const alreadyIn = prevChats.some(c => c.id === newOrExistingChat.id);
            if (alreadyIn) {
              return prevChats.map(c =>
                c.id === newOrExistingChat.id ? newOrExistingChat : c
              );
            }
            return [...prevChats, newOrExistingChat].sort((a, b) =>
              new Date(b.lastMessageAt || b.createdAt).getTime() -
              new Date(a.lastMessageAt || a.createdAt).getTime()
            );
          });
          return newOrExistingChat;
        } catch (error) {
          Alert.alert("Erreur de Chat", "Impossible de démarrer la conversation.");
          return null;
        }
      },
      [user?.user, chats]
    );
  
    return (
      <ChatContext.Provider
        value={{
          chats,
          setChats,
          currentChatMessages,
          loadChats,
          loadMessagesForChat,
          sendMessage,
          setCurrentChatIdAndReceiver,
          isLoadingChats,
          isLoadingMessages,
          currentChatReceiver: _currentChatReceiver,
          findOrCreateChatWithUser,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
};
  
export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
      throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
  