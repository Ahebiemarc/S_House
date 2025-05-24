
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import 'react-native-gesture-handler';
import ChatItem from '../../components/ChatItem';
import { StyleSheet } from 'react-native';
import { TabStackScreenProps } from '../../../domain/types/route.types';
import { Chat } from '../../../domain/interface/Message';
import ProtectedRoute from '../../../application/routes/Protected.route';


// Props pour ChatScreen
type ChatScreenProps = TabStackScreenProps<'Inbox'>;



// Données factices pour la démonstration
const initialChatsData: Chat[] = [
  {
    id: '1',
    userName: 'Nick Mack',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'When is a good time to call?',
    time: '10:30 AM',
    messages: [
      { id: 'm1', text: 'Hey Samantha!', sender: 'Nick Mack', timestamp: '10:25 AM', status: 'read', type: 'received' },
      { id: 'm2', text: 'Hi', sender: 'Samantha', timestamp: '10:26 AM', status: 'sent', type: 'sent' },
      { id: 'm3', text: 'When is a good time to call?', sender: 'Nick Mack', timestamp: '10:30 AM', status: 'delivered', type: 'received' },
    ],
  },
  {
    id: '2',
    userName: 'Robert Woods',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    lastMessage: 'She said you were going to...',
    time: 'Just now',
    messages: [
        { id: 'm1', text: 'She said you were going to...', sender: 'Robert Woods', timestamp: '11:00 AM', status: 'read', type: 'received' },
    ],
  },
  {
    id: '3',
    userName: 'Christine Smith',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    lastMessage: 'To made and greater made...',
    time: '2h',
    messages: [
        { id: 'm1', text: 'To made and greater made...', sender: 'Christine Smith', timestamp: '09:00 AM', status: 'read', type: 'received' },
    ],
  },
  
];


const { width: SCREEN_WIDTH } = Dimensions.get('window');


// Écran de la liste des Chats (ChatScreen)
const Inbox: React.FC<ChatScreenProps> = ({ navigation }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [chats, setChats] = useState<Chat[]>(initialChatsData);
  
    const filteredChats = chats.filter(chat =>
      chat.userName.toLowerCase().includes(searchText.toLowerCase())
    );
  
    // Simplified: Alert is now handled within ChatItem
    const handleDeleteChat = useCallback((chatId: string) => {
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      // Here, you would also call your API to delete the chat from the server
      // console.log(`Chat with ID: ${chatId} marked for deletion from state.`);
    }, []);
  
    const renderChatItem: ListRenderItem<Chat> = ({ item }) => (
      <ChatItem
          item={item}
          onPress={() => navigation.navigate('MessageScreen',  {
              chatId: item.id,
              userName: item.userName,
              userAvatar: item.avatar,
              initialMessages: item.messages,
          })}
          onDelete={handleDeleteChat}
      />
    );
  
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.chatScreenContainer}>
          <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderTitle}>Inbox</Text>
          </View>
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher quelque chose" // Rechercher quelque chose
              placeholderTextColor="#8E8E93"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.filterButton}>
               <Icon name="options-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          {filteredChats.length > 0 ? (
              <FlatList
                data={filteredChats}
                renderItem={renderChatItem}
                keyExtractor={(item: Chat) => item.id}
                style={styles.chatList}
              />
          ) : (
              <View style={styles.emptyChatContainer}>
                  <Icon name="chatbubbles-outline" size={60} color="#B0B0B0" />
                  <Text style={styles.emptyChatMessage}>Aucune conversation pour le moment.</Text> 
                  {searchText !== '' && <Text style={styles.emptyChatSubMessage}>Essayez une autre recherche.</Text>} 
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
    
      
    });
  
//export default Inbox;


export default function ProtectedInbox(props: ChatScreenProps) {
    return (
      <ProtectedRoute>
        <Inbox {...props} />
      </ProtectedRoute>
    );
}
