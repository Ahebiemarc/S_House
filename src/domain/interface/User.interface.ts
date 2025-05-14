export interface UserUpdateData {
    name?: string;
    email?: string;
    phone?: string;
    //avatar: string;
    [key: string]: any; // pour permettre d'autres propriétés dynamiques
  }
  