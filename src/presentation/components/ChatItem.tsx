// Importer les dépendances nécessaires
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// Assurez-vous d'importer 'react-native-gesture-handler' au début de votre fichier d'entrée (index.js ou App.js)
import 'react-native-gesture-handler';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { Alert } from 'react-native';

// Définitions de Types TypeScript
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'sent' | 'received';
  deleted?: boolean;
  originalText?: string;
  edited?: boolean;
}

interface Chat {
  id: string;
  userName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  messages: Message[];
}





const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD: number = -SCREEN_WIDTH * 0.2;

// Props pour ChatItem
interface ChatItemProps {
    item: Chat;
    onPress: () => void;
    onDelete: (id: string) => void;
}

// Composant pour un élément de chat avec fonctionnalité de swipe
// Composant pour un élément de chat avec fonctionnalité de swipe
const ChatItem: React.FC<ChatItemProps> = ({ item, onPress, onDelete }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const gestureState = useRef(new Animated.Value(State.UNDETERMINED)).current;


    const onGestureEvent = Animated.event<PanGestureHandlerGestureEvent>(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const { translationX: transX } = event.nativeEvent;

            const springBack = () => {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 40,
                    friction: 7,
                }).start();
            };

            if (transX < SWIPE_THRESHOLD) {
                // Swiped enough to trigger action
                Alert.alert(
                    "Supprimer la conversation", // Delete conversation
                    "Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.", // Are you sure you want to delete this conversation? This action is irreversible.
                    [
                        { 
                            text: "Annuler", // Cancel
                            onPress: springBack, 
                            style: "cancel" 
                        },
                        {
                            text: "Supprimer", // Delete
                            onPress: () => {
                                Animated.timing(translateX, {
                                    toValue: -SCREEN_WIDTH,
                                    duration: 200,
                                    useNativeDriver: true,
                                }).start(() => {
                                    onDelete(item.id); // This will remove the item from FlatList data
                                });
                            },
                            style: "destructive"
                        }
                    ],
                    { 
                        cancelable: true, 
                        onDismiss: springBack // If dismissed without choosing an option (e.g. Android back button), spring back.
                    }
                );
            } else {
                // Not swiped enough, spring back
                springBack();
            }
        }
        // Set the value of the Animated.Value node
        gestureState.setValue(event.nativeEvent.state);
    };

    const animatedStyle = {
        transform: [{ translateX }],
    };

    return (
        <PanGestureHandler
            activeOffsetX={[-10, 10]} // Allows a small vertical movement without triggering horizontal swipe
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
        >
            <Animated.View style={styles.chatItemOuterContainer}>
                {/* Container for Delete button (background) */}
                <View style={styles.deleteActionContainer}>
                    <Icon name="trash-outline" size={24} color="#FFF" />
                    <Text style={styles.deleteActionText}>Supprimer</Text> 
                </View>

                {/* Chat item content (this moves) */}
                <Animated.View style={[styles.chatItemInnerContainer, animatedStyle]}>
                    <TouchableOpacity
                        style={styles.chatItemTouchable}
                        onPress={onPress}
                        activeOpacity={0.7}
                    >
                        <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                        <View style={styles.chatItemTextContainer}>
                            <Text style={styles.chatUserName}>{item.userName}</Text>
                            <Text style={styles.chatLastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                        </View>
                        <Text style={styles.chatTime}>{item.time}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </PanGestureHandler>
    );
};


 // Styles
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFFFF', // White background for safe area
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

  export default ChatItem;