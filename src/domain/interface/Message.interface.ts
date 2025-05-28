// Définitions de Types TypeScript
import { IMessage as GiftedChatMessage } from 'react-native-gifted-chat';
import { User, UserProps } from './User.interface';

interface ReplyToInfo {
  messageId: string;
  sender: string;
  text: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'sent' | 'received';
  deleted?: boolean;
  originalText?: string;
  edited?: boolean;
  replyTo?: ReplyToInfo | null; // Informations sur le message auquel on répond
}
  
  export  interface Chat {
    id: string;
    userName: string;
    avatar: string;
    lastMessage: string;
    time: string;
    messages: Message[];
  }





// Structure interne d'un message dans l'application
export interface AppMessage {
  _id: string; // ID du message
  text: string;
  createdAt: string; // Date au format ISO string
  senderId: string;
  chatId: string;
  user?: GiftedChatMessage['user']; // Pour utilisation directe avec GiftedChat
}

// Structure interne d'un chat dans l'application
export interface AppChat {
  id: string; // ID du chat (correspond à _id du modèle Chat backend)
  receiver: UserProps; // L'autre utilisateur dans le chat
  lastMessage?: string; // Texte déchiffré du dernier message
  lastMessageAt?: string; // Timestamp ISO du dernier message
  unreadCount: number;
  userIDs: string[]; // IDs des utilisateurs dans le chat
  createdAt: string; // Date de création au format ISO string
  // Les messages ne sont pas stockés ici ; ils sont récupérés à la demande pour MessageScreen
}

// Structure d'un chat provenant du backend (simplifiée, basée sur votre contrôleur)
export interface BackendChat {
    id: string;
    userIDs: string[];
    seenBy: string[];
    createdAt: string;
    updatedAt: string;
    messages: BackendMessage[];
    lastMessage: string | null; // Dernier message chiffré
    receiver?: { // Ajouté par vos contrôleurs getChats/getChat
        id: string;
        username: string;
        avatar: string | null;
    };
    // Ajout potentiel si l'API de création de chat renvoie directement les infos des utilisateurs
    users?: { id: string; username: string; avatar?: string | null; }[];
}

// Structure d'un message provenant du backend (simplifiée)
export interface BackendMessage {
    id: string;
    chatId: string;
    senderId: string;
    text: string; // Texte déchiffré (selon la logique de votre contrôleur pour getChats/getChat)
    createdAt: string;
}