// socketService.ts

import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from './root.api';
import { AppMessage } from '../../domain/interface/Message.interface';


let socket: Socket | null = null; // Initialiser à null
export const initSocket = (token?: string): Socket => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(SOCKET_URL, {
    auth: { token }, // Décommentez si vous utilisez l'authentification par token pour les sockets
    transports: ['websocket'], // Forcer le transport websocket pour éviter les problèmes de polling
    reconnectionAttempts: 5, // Nombre de tentatives de reconnexion
    timeout: 10000, // Délai d'attente avant échec de connexion
  });

  socket.on('connect', () => {
    console.log('Socket connecté:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket déconnecté:', reason);
    if (reason === 'io server disconnect') {
      // le serveur a déconnecté manuellement le socket
      socket?.connect(); // Tenter de se reconnecter
    }
    // sinon, la reconnexion automatique est gérée par socket.io-client
  });

  socket.on('connect_error', (error) => {
    console.error('Erreur de connexion Socket:', error);
  });

  return socket;
};


export const getSocket = (): Socket => {
    if (!socket) {
      console.log("Socket non initialisé. Appel de initSocket().");
      return initSocket(); // Ou levez une erreur si l'initialisation explicite est requise
    }
    return socket;
  };
  
  export const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      console.log('Socket déconnecté explicitement.');
    }
};

export const joinChatRoom = (chatId: string) => {
    if (socket?.connected) {
      socket.emit('joinChat', chatId);
    } else {
      console.error('Socket non connecté pour joinChatRoom. Tentative de connexion/reconnexion...');
      // Vous pourriez vouloir mettre en file d'attente l'émission ou la réessayer après reconnexion.
    }
};


export const leaveChatRoom = (chatId: string) => {
    if (socket?.connected) {
      socket.emit('leaveChat', chatId);
    } else {
      console.error('Socket non connecté pour leaveChatRoom.');
    }
};
  
export const sendMessageSocket = (chatId: string, text: string, senderId: string, receiverId?: string) => {
    if (socket?.connected) {
      socket.emit('sendMessage', { chatId, text, senderId, receiverId });
      console.log('Socket sendMessage:', text);
    } else {
      console.error('Socket non connecté pour sendMessageSocket.');
      // Gérer l'échec d'envoi, peut-être sauvegarder localement et réessayer.
    }
};
  
  export const onNewMessageReceived = (callback: (message: AppMessage) => void) => {
    if (socket) {
      socket.off('newMessageReceived'); // Éviter les auditeurs multiples
      socket.on('newMessageReceived', (message: AppMessage) => {
        callback(message);
      });
    } else {
      console.error('Socket non initialisé pour onNewMessageReceived');
    }
};
  
export const offNewMessageReceived = () => {
      if (socket) {
          socket.off('newMessageReceived');
      }
};
  
export const onMessageError = (callback: (error: any) => void) => {
    if (socket) {
      socket.off('messageError');
      socket.on('messageError', (errorData: any) => {
        callback(errorData);
      });
    } else {
      console.error('Socket non initialisé pour onMessageError');
    }
};