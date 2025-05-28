import axios from "axios";
import { AppChat, BackendChat } from "../../domain/interface/Message.interface";
import { User, UserProps } from "../../domain/interface/User.interface";
import { API } from "./root.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "./user.api";

// Service pour la gestion des chats
const ChatService = {
  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem("token");
  },

  /*// Récupérer tous les chats de l'utilisateur connecté
  getChats: async () => {
    const token = await ChatService.getToken();
    const res = await API.get("/chats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Récupérer un chat spécifique par ID
  getChat: async (chatId: string) => {
    const token = await ChatService.getToken();
    const res = await API.get(`/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Créer une nouvelle conversation
  addChat: async (receiverId: string) => {
    const token = await ChatService.getToken();
    const res = await API.post(
      "/chats",
      { receiverId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },

  // Marquer un chat comme lu
  readChat: async (chatId: string) => {
    const token = await ChatService.getToken();
    const res = await API.put(
      `/chats/read/${chatId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },*/
};

//export default ChatService;


/*// Transforme les données d'un chat du backend vers le format AppChat du frontend
export const transformBackendChatToAppChat = async  (
  backendChat: BackendChat,
  currentUserId: string
): AppChat | null => {
  let receiverProfile: UserProps | null = null;

  // Receiver direct
  if (backendChat.userIDs) {
    const apiOtherProfile : UserProps = await UserService.getUserById(backendChat.userIDs[1]);
    receiverProfile = {
      id: apiOtherProfile.id,
      username: apiOtherProfile.username,
      avatar: apiOtherProfile.avatar || undefined,
    };
  }
  // Receiver via users
  else if (Array.isArray(backendChat.users)) {
    const otherUser = backendChat.users.find(u => u.id !== currentUserId);
    if (otherUser?.id && otherUser?.username) {
      receiverProfile = {
        id: otherUser.id,
        username: otherUser.username,
        avatar: otherUser.avatar || undefined,
      };
    }
  }
  // Receiver via userIDs → rejeté maintenant (plus de fallback faux)
  if (!receiverProfile) {
    console.log("Chat ignoré (receiver introuvable):", backendChat);
    return null;
  }

  const messages = Array.isArray(backendChat.messages) ? backendChat.messages : [];
  const seenBy = Array.isArray(backendChat.seenBy) ? backendChat.seenBy : [];

  const unreadCount = seenBy.includes(currentUserId)
    ? 0
    : messages.filter(m => m.senderId !== currentUserId && !seenBy.includes(currentUserId)).length;

  return {
    id: backendChat.id,
    receiver: receiverProfile,
    lastMessage: backendChat.lastMessage || '',
    lastMessageAt: messages[0]?.createdAt || backendChat.updatedAt,
    unreadCount,
    userIDs: backendChat.userIDs || [],
    createdAt: backendChat.createdAt,
  };
};
*/




// Récupère la liste des chats pour l'utilisateur actuel
export const fetchChatsAPI = async (currentUserId: string): Promise<AppChat[]> => {
  try {
    const token = await ChatService.getToken();
    const response = await API.get<BackendChat[]>('/chats', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const backendChats = Array.isArray(response.data) ? response.data : [response.data];

    const appChats: AppChat[] = [];

    for (const chat of backendChats) {
      const transformedChat = await transformBackendChatToAppChat(chat, currentUserId);
      if (transformedChat) {
        appChats.push(transformedChat);
      }
    }

    return appChats;
  } catch (error) {
    console.error('Erreur lors de la récupération des chats:', error);
    throw error;
  }
};



export const transformBackendChatToAppChat = async (
  chat: BackendChat,
  currentUserId: string
): Promise<AppChat | null> => {
  if (!chat || !chat.userIDs || chat.userIDs.length < 2) {
    console.log('Chat invalide : données insuffisantes');
    return null;
  }

  const receiverId = chat.userIDs.find(id => id !== currentUserId);

  if (!receiverId) {
    console.warn('Chat ignoré (receiver introuvable):', chat);
    return null;
  }

  try {
    const receiver: UserProps | null = await UserService.getUserById(receiverId);
    if (!receiver) {
      console.warn('Receiver non trouvé:', receiverId);
      return null;
    }


    return {
      id: chat.id,
      lastMessage: chat.lastMessage ?? '',
      receiver,
      unreadCount: 0,
      createdAt: chat.createdAt,
      userIDs: chat.userIDs
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du receiver:', error);
    return null;
  }
};



// Marque un chat comme lu
export const markChatAsReadAPI = async (chatId: string): Promise<void> => {
  try {
    const token = await ChatService.getToken();
    await API.put(`/chats/read/${chatId}`, {
      headers: { Authorization: `Bearer ${token}`}
    } );
  } catch (error) {
    console.error('Erreur lors du marquage du chat comme lu:', error);
    throw error;
  }
};

// Crée un nouveau chat avec un destinataire
/*export const createChatAPI = async (recipientId: string): Promise<AppChat> => {
  try {
      const response = await API.post<BackendChat>('/chats', { recipientId });
      // Simuler currentUserId pour la transformation, car il n'est pas directement disponible ici
      // Idéalement, l'API de création de chat renverrait aussi les informations du 'receiver'
      const currentUserIdPlaceholder = "NEEDS_ACTUAL_USER_ID"; // Vous devrez peut-être passer l'ID utilisateur actuel
      return transformBackendChatToAppChat(response.data, currentUserIdPlaceholder);
  } catch (error) {
      console.error('Erreur lors de la création du chat:', error);
      throw error;
  }
};*/

export const createChatAPI = async (
  recipientId: string,
  currentUserId: string
): Promise<AppChat> => {
  try {
    const token = await ChatService.getToken();
    const response = await API.post<BackendChat>('/chats', { recipientId }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const appChat = await transformBackendChatToAppChat(response.data, currentUserId); // Ajout de await ici

    if (!appChat) {
      throw new Error("Chat invalide : le receiver est manquant ou mal formé.");
    }

    return appChat;
  } catch (error) {
    console.error('Erreur lors de la création du chat:', error);
    throw error;
  }
};



