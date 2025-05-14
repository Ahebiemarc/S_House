import { API } from "./root.api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Service pour la gestion des chats
const ChatService = {
  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem("token");
  },

  // Récupérer tous les chats de l'utilisateur connecté
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
  },
};

export default ChatService;
