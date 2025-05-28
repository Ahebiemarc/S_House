// src/application/contexts/useUser.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Ajustez le chemin vers votre useAuth
import {  User, UserProfileUpdateData } from '../../domain/interface/User.interface';
import UserService from '../../infrastructure/api/user.api';
import { Asset } from 'react-native-image-picker';

interface UserContextType {
  currentUser: User | null; // L'utilisateur actuellement modifiable
  isLoading: boolean;
  error: string | null;
  updateUserProfile: (
    data: UserProfileUpdateData,
    avatarFile?: Asset
  ) => Promise<boolean>; // Retourne true si succès
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user: authUser, refreshUser } = useAuth(); // Supposons que useAuth expose refreshUser()
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authUser?.user) {
      setCurrentUser(authUser as User); // Initialise currentUser avec les données de useAuth
    } else {
      setCurrentUser(null);
    }
  }, [authUser]);

  const clearError = () => {
    setError(null);
  };

  const updateUserProfile = useCallback(
    async (data: UserProfileUpdateData, avatarFile?: Asset): Promise<boolean> => {
      if (!currentUser?.user || !currentUser.user.id) {
        setError("Utilisateur non identifié pour la mise à jour.");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Préparation des données pour le service.

        const updatedUserDataFromApi = await UserService.update(currentUser.user.id, data, avatarFile);

        if (updatedUserDataFromApi) {
          // Mettre à jour l'état local de UserProvider
          setCurrentUser(updatedUserDataFromApi as User);

          // Tenter de rafraîchir l'utilisateur dans AuthProvider
          if (refreshUser) {
            await refreshUser(); // Cette fonction dans AuthProvider devrait re-fetch l'utilisateur
          } else {
            console.warn("useAuth ne fournit pas de fonction refreshUser. L'état de useAuth().user pourrait être obsolète.");
          }
          setIsLoading(false);
          return true;
        } else {
          throw new Error("Les données utilisateur mises à jour n'ont pas été retournées par l'API.");
        }
      } catch (e: any) {
        console.error("Erreur lors de la mise à jour du profil:", e);
        setError(e.message || "Erreur lors de la mise à jour du profil.");
        setIsLoading(false);
        return false;
      }
    },
    [currentUser, refreshUser]
  );

  return (
    <UserContext.Provider value={{ currentUser, isLoading, error, updateUserProfile, clearError }}>
      {children}
    </UserContext.Provider>
  );
};