import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostData } from '../../domain/interface/Post.interface';

type FavoritesContextType = {
  favorites: PostData[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (post: PostData) => void;
  reloadFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = 'FAVORITES_POSTS';

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<PostData[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    if (json) {
      setFavorites(JSON.parse(json));
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(post => post.id === id);
  };

  const toggleFavorite = async (post: PostData) => {
    let updatedFavorites;
    if (isFavorite(post.id!)) {
      updatedFavorites = favorites.filter(p => p.id !== post.id);
    } else {
      updatedFavorites = [...favorites, post];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, reloadFavorites: loadFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
