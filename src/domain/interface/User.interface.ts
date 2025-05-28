import { Asset } from "react-native-image-picker";



/*export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string | null; // L'avatar peut être une URL ou null/undefined
}*/

export type UserProps = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}
export interface User {
  
  user: UserProps;
}

// Données pour la mise à jour du profil (champs textuels)
export interface UserProfileUpdateData {
  username?: string;
  email?: string;
  password?: string;
  avatar?: Asset
}


  