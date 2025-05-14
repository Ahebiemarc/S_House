// Définitions de Types TypeScript
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