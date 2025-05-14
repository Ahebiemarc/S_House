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
import messageData from '../../presentation/assets/data/messages.json';
import ChatMessageBox from '../components/ChatMessageBox';
import ReplyMessageBar from '../components/ReplyMessageBar';
import { RootStackScreenProps } from '../../domain/types/route.types';
import ProtectedRoute from '../../application/routes/Protected.route';

type Props = RootStackScreenProps<'MessageScreen'>;

const MessageScreen: FC<Props> = ({ navigation, route }) => {
  const { chatId, userName, userAvatar } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const insets = useSafeAreaInsets();
  const swipeableRowRef = useRef<Swipeable | null>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <Text style={styles.userName}>{userName}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
      ),
      /*headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="call-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="videocam-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ),*/
    });
  }, [navigation, userName, userAvatar]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

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

  const dismissKeyboard = () => Keyboard.dismiss();

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
            messages={messages}
            onSend={onSend}
            user={{ _id: 1 }}
            onInputTextChanged={setText}
            bottomOffset={insets.bottom}
            textInputProps={styles.composer}
            maxComposerHeight={100}
            renderAvatar={null}
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
                {text === '' ? (
                  <>
                    <Ionicons name="camera-outline" color={Colors.primary} size={28} />
                    <Ionicons name="mic-outline" color={Colors.primary} size={28} />
                  </>
                ) : (
                  <Send {...props}>
                    <Ionicons name="send" color={Colors.primary} size={28} style={{marginBottom:10}} />
                  </Send>
                )}
              </View>
            )}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                containerStyle={{ backgroundColor: Colors.background }}
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
