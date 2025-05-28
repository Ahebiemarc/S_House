import { AppMessage, BackendChat, BackendMessage } from "../../domain/interface/Message.interface";
import {  UserProps } from "../../domain/interface/User.interface";
import { API } from "./root.api";
import AsyncStorage from '@react-native-async-storage/async-storage';

/*const MessageService = {
  // Ajouter un message
  addMessage: async (chatId: string, text: string) => {
    const token = await AsyncStorage.getItem("token");
    const response = await API.post(
      `/messages/${chatId}`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Mettre à jour un message
  updateMessage: async (id: string, newText: string) => {
    const token = await AsyncStorage.getItem("token");
    const response = await API.put(
      `/messages/${id}`,
      { text: newText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Supprimer un message
  deleteMessage: async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    const response = await API.delete(`/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default MessageService;*/




// Transforme les données d'un message du backend vers le format AppMessage du frontend
const transformBackendMessageToAppMessage = (backendMessage: BackendMessage, chatReceiver?: UserProps, currentUserId?: string): AppMessage => {
  let giftedChatUser;
  if (currentUserId && backendMessage.senderId === currentUserId) {
      giftedChatUser = { _id: backendMessage.senderId, name: 'Vous' /* avatar: currentUser.avatar */ };
  } else if (chatReceiver && backendMessage.senderId === chatReceiver.id) {
      giftedChatUser = { _id: chatReceiver.id, name: chatReceiver.username, avatar: chatReceiver.avatar };
  } else {
      giftedChatUser = { _id: backendMessage.senderId, name: `Utilisateur ${backendMessage.senderId.substring(0,5)}` };
  }

  return {
      _id: backendMessage.id,
      text: backendMessage.text, // Supposant que le backend envoie le texte déchiffré pour les requêtes GET
      createdAt: backendMessage.createdAt,
      senderId: backendMessage.senderId,
      chatId: backendMessage.chatId,
      user: giftedChatUser,
  };
};


// Récupère les messages pour un chat spécifique
export const fetchChatMessagesAPI = async (chatId: string, chatReceiver: UserProps, currentUserId: string): Promise<AppMessage[]> => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await API.get<BackendChat>(`/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}`}
    });
    const backendChat = response.data;
    if (backendChat && backendChat.messages) {
      return backendChat.messages.map(msg => transformBackendMessageToAppMessage(msg, chatReceiver, currentUserId));
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des messages du chat:', error);
    throw error;
  }
};
