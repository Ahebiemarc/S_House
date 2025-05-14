import { API } from "./root.api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessageService = {
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

export default MessageService;
