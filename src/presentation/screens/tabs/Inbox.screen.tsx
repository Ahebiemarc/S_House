//screens/tabs/inbox.screen.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ListRenderItem,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import 'react-native-gesture-handler';
import ChatItem from '../../components/ChatItem';
import { StyleSheet } from 'react-native';
import { TabStackScreenProps } from '../../../domain/types/route.types';
import { AppChat, Chat } from '../../../domain/interface/Message.interface';
import ProtectedRoute from '../../../application/routes/Protected.route';
import { useAuth } from '../../../application/providers/AuthContext';
import { useChat } from '../../../application/providers/ChatContext';

const defautProfile = require('../../../presentation/assets/images/defautProfile.png');



// Props pour ChatScreen
type InboxScreenProps = TabStackScreenProps<'Inbox'>;



const { width: SCREEN_WIDTH } = Dimensions.get('window');


// Écran de la liste des Chats (ChatScreen)

const Inbox: React.FC<InboxScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { chats, loadChats, isLoadingChats, setChats: setContextChats, setCurrentChatIdAndReceiver } = useChat();
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    if (user) { // Charger les chats seulement si l'utilisateur est authentifié
      loadChats();
    }
  }, [loadChats, user]);

  const handleRefresh = useCallback(async () => {
    if (user) {
      await loadChats();
    }
  }, [loadChats, user]);

  const filteredChats = chats.length > 0
  ? chats.filter(chat =>
      chat.receiver.username.toLowerCase().includes(searchText.toLowerCase())
    )
  : [];

  const handleDeleteChat = useCallback(async (chatId: string) => {
    // Implémentez la logique de suppression de chat via apiService et mettez à jour le contexte
    console.log(`Tentative de suppression du chat : ${chatId}`);
    // Exemple : await deleteChatAPI(chatId); loadChats();
    setContextChats(prevChats => prevChats.filter(chat => chat.id !== chatId)); // Mise à jour optimiste
  }, [setContextChats /*, deleteChatAPI, loadChats */]);

  const renderChatItem: ({ item }: { item: AppChat }) => any = ({ item }) => {
    if (!item?.receiver) return null;
  
    return (
      <ChatItem
        item={item}
        onPress={() => {
          if (!user) return;
          setCurrentChatIdAndReceiver(item.id, item.receiver);
          navigation.navigate('MessageScreen', {
            chatId: item.id,
            userName: item.receiver.username,
            userAvatar: item.receiver.avatar!,
            receiverId: item.receiver.id,
          });
        }}
        onDelete={() => handleDeleteChat(item.id)}
      />
    );
  };
  

  if (isLoadingChats && chats.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>Chargement des conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.chatScreenContainer}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatHeaderTitle}>Boîte de réception</Text>
        </View>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {filteredChats.length > 0 ? (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item: AppChat) => item.id}
            style={styles.chatList}
            refreshControl={
              <RefreshControl refreshing={isLoadingChats} onRefresh={handleRefresh} colors={["#007AFF"]}/>
            }
          />
        ) : (
          <View style={styles.emptyChatContainer}>
            <Icon name="chatbubbles-outline" size={60} color="#B0B0B0" />
            <Text style={styles.emptyChatMessage}>
              {searchText !== '' ? 'Aucune conversation ne correspond.' : 'Aucune conversation pour le moment.'}
            </Text>
            {searchText !== '' && <Text style={styles.emptyChatSubMessage}>Essayez un autre terme de recherche.</Text>}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};


   // Styles
  const styles = StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF', // White background for safe area
      },
      // Styles for ChatScreen
      chatScreenContainer: {
        flex: 1,
        backgroundColor: '#F7F7F7', // Very light gray for chat screen background
      },
      chatHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        backgroundColor: '#FFFFFF', // White background for header
      },
      chatHeaderTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
      },
      searchContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFFFFF', // White background for search bar
        marginHorizontal: 16,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.00,
        elevation: 1,
      },
      searchIcon: {
        marginRight: 8,
      },
      searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000000',
      },
      filterButton: {
        marginLeft: 8,
        padding: 5,
      },
      chatList: {
        flex: 1,
      },
      // Styles for ChatItem (Swipe)
      chatItemOuterContainer: {
        backgroundColor: '#FF3B30', // Background color for delete action
        justifyContent: 'center',
        // marginBottom: 1, // If you want a small visual separator
      },
      deleteActionContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: SCREEN_WIDTH * 0.3, // Width of the delete area
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center icon and text
        paddingRight: 10, // Some space on the right
      },
      deleteActionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
      },
      chatItemInnerContainer: {
        backgroundColor: '#FFFFFF', // Background of the chat item itself
      },
      chatItemTouchable: { // Formerly chatItemContainer
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
      },
      chatAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
      },
      chatItemTextContainer: {
        flex: 1,
      },
      chatUserName: {
        fontSize: 17,
        fontWeight: '600', // Semi-bold
        color: '#000000',
      },
      chatLastMessage: {
        fontSize: 15,
        color: '#8E8E93', // Gray for last message
        marginTop: 2,
      },
      chatTime: {
        fontSize: 13,
        color: '#8E8E93', // Gray for time
        marginLeft: 10,
      },
      emptyChatContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      emptyChatMessage: {
        fontSize: 18,
        color: '#8E8E93',
        marginTop: 10,
        textAlign: 'center',
      },
      emptyChatSubMessage: {
        fontSize: 14,
        color: '#AAAAAA',
        marginTop: 5,
        textAlign: 'center',
      },
      centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

      
    });
  
//export default Inbox;


export default function ProtectedInbox(props: InboxScreenProps) {
    return (
      <ProtectedRoute>
        <Inbox {...props} />
      </ProtectedRoute>
    );
}
