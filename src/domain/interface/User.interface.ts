import { Asset } from "react-native-image-picker";



export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string | null; // L'avatar peut être une URL ou null/undefined
}

// Données pour la mise à jour du profil (champs textuels)
export interface UserProfileUpdateData {
  username?: string;
  email?: string;
  password?: string;
  avatar?: Asset
}


  