//screens/Message.screen.tsx
import React, { useState, useEffect, useRef, useCallback, FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send, SystemMessage, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';

import Colors from '../../application/utils/constants/Color';
import messageData from '../assets/data/messages.json';
import ChatMessageBox from '../components/ChatMessageBox';
import ReplyMessageBar from '../components/ReplyMessageBar';
import { RootStackScreenProps } from '../../domain/types/route.types';
import ProtectedRoute from '../../application/routes/Protected.route';
import { useAuth } from '../../application/providers/AuthContext';
import { useChat } from '../../application/providers/ChatContext';
import { UserProps } from '../../domain/interface/User.interface';

const defautProfile = require('../assets/images/defautProfile.png');



type Props = RootStackScreenProps<'MessageScreen'>;

const MessageScreen: FC<Props> = ({ navigation, route }) => {
  const { chatId, userName, userAvatar, receiverId } = route.params;
  const { user: currentUser } = useAuth();
  const {
      currentChatMessages,
      loadMessagesForChat,
      sendMessage,
      setCurrentChatIdAndReceiver,
      isLoadingMessages,
      currentChatReceiver,
    } = useChat();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const insets = useSafeAreaInsets();
  const swipeableRowRef = useRef<Swipeable | null>(null);

  /*useEffect(() => {
    const chatMessages = messageData.map((message) => ({
      _id: message.id,
      text: message.msg,
      createdAt: new Date(message.date),
      user: {
        _id: message.from,
        name: message.from ? 'You' : 'Bot',
      },
    }));

    setMessages([
      ...chatMessages,
      {
        _id: 0,
        system: true,
        text: 'All your base are belong to us',
        createdAt: new Date(),
        user: {
          _id: 0,
          name: 'Bot',
        },
      },
    ]);
  }, []);*/

  useEffect(() => {
      const receiverProfile: UserProps = {
          id: receiverId,
          username: userName,
          avatar: userAvatar ? userAvatar : defautProfile,
      };
      setCurrentChatIdAndReceiver(chatId, receiverProfile);
      loadMessagesForChat(chatId, receiverProfile);
  
      return () => {
        setCurrentChatIdAndReceiver(null, null);
      };
  }, [chatId, userName, userAvatar, receiverId]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Image source={userAvatar ? { uri: userAvatar  } : defautProfile } style={styles.avatar} />
          <Text style={styles.userName}>{userName}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userName, userAvatar]);

  /*const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);*/

  const onSend = useCallback((newMessages: IMessage[] = []) => {
        if (!currentUser || !currentChatReceiver) {
          console.warn(
            'Utilisateur ou destinataire non défini, impossible d\'envoyer le message.'
          );
          return;
        }
        const messageText = newMessages[0].text;
        sendMessage(chatId, messageText, currentChatReceiver.id);
      },
      [chatId, currentUser, sendMessage, currentChatReceiver]
  );

  const updateRowRef = useCallback(
    (ref: any) => {
      if (ref && replyMessage && ref.props.children.props.currentMessage?._id === replyMessage._id) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  const dismissKeyboard = () => Keyboard. dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
        <ImageBackground
          source={require('../../presentation/assets/images/pattern.png')}
          style={{ flex: 1, backgroundColor: Colors.background }}>
          <GiftedChat
            messages={[...currentChatMessages].sort((a, b) => {
              const dateA = typeof a.createdAt === 'number' ? a.createdAt : a.createdAt.getTime();
              const dateB = typeof b.createdAt === 'number' ? b.createdAt : b.createdAt.getTime();
              return dateB - dateA;
            })}
            onSend={(messages) => onSend(messages)}
            //user={{ _id: 1 }}
            //inverted={false}
            timeTextStyle={{
              left: {
                color: '#888', // Messages de l’autre
                fontSize: 10,
              },
              right: {
                color: '#888', // Tes messages
                fontSize: 10,
              },
            }}
            user={{
              _id: currentUser?.user.id || 'fallback-user-id-giftedchat',
              name: currentUser?.user.username,
              avatar: currentUser?.user.avatar,
            }}
            //onInputTextChanged={setText}
            bottomOffset={insets.bottom}
            textInputProps={styles.composer}
            placeholder="Écrivez un message..."
            maxComposerHeight={100}
            renderAvatar={null}
            alwaysShowSend
            renderSystemMessage={(props) => (
              <SystemMessage {...props} textStyle={{ color: Colors.gray }} />
            )}
            renderBubble={(props) => (
              <Bubble
                {...props}
                textStyle={{ right: { color: '#000' } }}
                wrapperStyle={{
                  left: { backgroundColor: '#fff' },
                  right: { backgroundColor: Colors.lightGreen },
                }}
              />
            )}
            renderSend={(props) => (
              <View style={styles.sendContainer}>
                  <Send {...props}>
                    <Ionicons name="send" color={Colors.primary} size={28} style={{marginBottom:10}} />
                  </Send>
              </View>
            )}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                containerStyle={{ backgroundColor: Colors.background,  }}
                renderActions={() => (
                  <View style={styles.addIconContainer}>
                    <Ionicons name="add" color={Colors.primary} size={28} />
                  </View>
                )}
              />
            )}
            renderChatFooter={() => (
              <ReplyMessageBar message={replyMessage} clearReply={() => setReplyMessage(null)} />
            )}
            onLongPress={(context, message) => setReplyMessage(message)}
            renderMessage={(props) => (
              <ChatMessageBox
                {...props}
                setReplyOnSwipeOpen={setReplyMessage}
                updateRowRef={updateRowRef}
              />
            )}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  composer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
    color: "#000",
  },
  sendContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 14,
  },
  addIconContainer: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    left: 5,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  backButton: {
    marginLeft: Platform.OS === 'ios' ? 0 : 0,
    padding: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Platform.OS === 'ios' ? 0 : 10,
  },
});

//export default MessageScreen;

export default function ProtectedMessageScreen(props: Props) {
    return (
      <ProtectedRoute>
        <MessageScreen {...props} />
      </ProtectedRoute>
    );
}
