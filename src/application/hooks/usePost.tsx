//hooks/PostContext.tsx

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Property, Type } from '../../domain/enum/post';
import { PostData } from '../../domain/interface/Post.interface';
import PostService from '../../infrastructure/api/post.api';

// Interface pour la structure des fichiers image attendue par PostService
// Il est préférable de rendre name et type obligatoires pour des téléchargements robustes
export interface ImageFile {
  uri: string;
  name: string; 
  type: string; // ex: 'image/jpeg', 'image/png'
}

// Interface définissant la structure de la valeur du contexte
interface PostDataContextType {
  postData: PostData;
  updatePostData: <K extends keyof PostData>(key: K, value: PostData[K]) => void;
  setCoordinates: (coords: { latitude: number; longitude: number }) => void;
  setImages: (uris: string[]) => void; // Pour les URIs d'aperçu local
  clearPostData: () => void; // Pour réinitialiser postData

  // Méthodes API
  getAllPosts: () => Promise<PostData[]>;
  getPostById: (id: string) => Promise<PostData>;
  getPostByUser: () => Promise<PostData[]>;
  getPostsByProperty: (property: Property) => Promise<PostData[]>;
  getPostsByType: (type: string) => Promise<PostData[]>;
  searchPosts: (query: string) => Promise<PostData[]>;
  // addPost utilise postData du contexte et les fichiers image fournis
  addPost: (imageFiles: ImageFile[]) => Promise<any>; 
  // updatePost utilise postData du contexte et les fichiers image fournis
  updatePost: (id: string, imageFiles: ImageFile[]) => Promise<any>; 
  removePost: (id: string) => Promise<any>;
  // Aide pour charger un post dans l'état du contexte pour l'édition
  loadPostForEditing: (id: string) => Promise<void>; 
}

// Création du contexte
const PostContext = createContext<PostDataContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte PostData
export const usePostData = (): PostDataContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostData doit être utilisé à l\'intérieur d\'un PostProvider');
  }
  return context;
};

// Props pour le composant fournisseur
interface PostProviderProps {
  children: ReactNode;
}

// État initial pour postData, conforme à l'interface PostData
// Assurez-vous que Type et Property sont correctement importés et accessibles ici
// Si Type ou Property sont vides, Object.keys(...)[0] pourrait causer une erreur.
// Il est plus sûr de fournir des valeurs par défaut valides ou de gérer ce cas.
const initialPostData: PostData = {
  title: '',
  price: '',
  address: '',
  desc: '',
  city: '',
  bedroom: '',
  bathroom: '',
  latitude: null,
  longitude: null,
  // Assurez-vous que Type et Property ont au moins une clé, sinon cela échouera.
  // Si Type ou Property peuvent être vides, vous devrez gérer cela différemment.
  type: (Object.keys(Type)[0] as keyof typeof Type) || 'defaultTypeKey', // Fournir une clé par défaut si vide
  property: (Object.keys(Property)[0] as keyof typeof Property) || 'defaultPropertyKey', // Fournir une clé par défaut si vide
  images: [], // Initialiser comme un tableau vide de chaînes (pour les URIs)
};


// Fournisseur du contexte
export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [postData, setPostData] = useState<PostData>(initialPostData);

  // Fonction de mise à jour générique pour les champs de postData
  const updatePostData = useCallback(<K extends keyof PostData>(key: K, value: PostData[K]) => {
    setPostData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }, []);

  // Fonction pour mettre à jour spécifiquement les coordonnées
  const setCoordinates = useCallback((coords: { latitude: number; longitude: number }) => {
    setPostData((prevData) => ({
      ...prevData,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));
  }, []);

  // Fonction pour mettre à jour le tableau des URIs d'images (pour l'aperçu local)
  const setImages = useCallback((uris: string[]) => {
    setPostData((prevData) => ({
      ...prevData,
      images: uris,
    }));
  }, []);

  // Fonction pour réinitialiser postData à son état initial
  const clearPostData = useCallback(() => {
    setPostData(initialPostData);
  }, []);

  // --- Fonctions du Service API ---

  // Récupérer tous les posts
  const getAllPosts = useCallback(async (): Promise<PostData[]> => {
    try {
      const posts = await PostService.getAll();
      //console.log(posts);
      
      return posts;
    } catch (error) {
      console.error("Erreur lors de la récupération de tous les posts:", error);
      throw error; // Propage l'erreur pour que le composant appelant puisse la gérer
    }
  }, []);

  // Récupérer un post par son ID
  const getPostById = useCallback(async (id: string): Promise<PostData> => {
    try {
      const post = await PostService.getById(id);
      return post;
    } catch (error) {
      console.error(`Erreur lors de la récupération du post avec l'ID ${id}:`, error);
      throw error;
    }
  }, []);

  // Récupérer les posts de l'user
  const getPostByUser = useCallback(async (): Promise<PostData[]> => {
    try {
      const post = await PostService.getByUser();
      return post;
    } catch (error) {
      console.error(`Erreur lors de la récupération des post de l'utilsateur:`, error);
      throw error;
    }
  }, []);

  

  // Récupérer les posts par propriété
  const getPostsByProperty = useCallback(async (property: Property): Promise<PostData[]> => {
    try {
      //console.log(property);
      
      const posts = await PostService.getByProperty(property);
      return posts;
    } catch (error){
      console.error(`Erreur lors de la récupération des posts par propriété ${property}:`, error);
      throw error;
    }
  }, []);

  // Récupérer les posts par type
  const getPostsByType = useCallback(async (type: string): Promise<PostData[]> => {
    try {
      const posts = await PostService.getByType(type);
      return posts;
    } catch (error) {
      console.error(`Erreur lors de la récupération des posts par type ${type}:`, error);
      throw error;
    }
  }, []);

  // Rechercher des posts
  const searchPosts = useCallback(async (query: string): Promise<PostData[]> => {
    try {
      const posts = await PostService.search(query);
      return posts;
    } catch (error) {
      console.error(`Erreur lors de la recherche de posts avec la requête "${query}":`, error);
      throw error;
    }
  }, []);

  /**
   * Ajoute un nouveau post en utilisant le postData actuel du contexte et les fichiers image fournis.
   * La propriété 'images' dans postData (string[]) est typiquement pour les URIs/aperçus locaux.
   * Le paramètre 'imageFiles' (ImageFile[]) est pour les téléchargements réels de fichiers.
   */
  const addPost = useCallback(async (imageFiles: ImageFile[]): Promise<any> => {
    try {
      
      const result = await PostService.add(postData, imageFiles);
      // Optionnel: effacer les données du formulaire après une soumission réussie
      // clearPostData(); 
      return result;
    } catch (error) {
      console.error("Erreur lors de l'ajout du post:", error);
      throw error;
    }
  }, [postData]); // clearPostData a été retiré des dépendances pour éviter les problèmes de closure si non mémoisé

  /**
   * Met à jour un post existant en utilisant le postData actuel du contexte et de nouveaux fichiers image.
   */
  const updatePost = useCallback(async (id: string, imageFiles: ImageFile[]): Promise<any> => {
    try {
      // Ses `images: string[]` (URIs locaux) seront envoyées.
      // Les `imageFiles` sont pour les téléchargements de fichiers nouveaux/mis à jour.
      const result = await PostService.update(id, postData, imageFiles);
      // effacer les données du formulaire après une mise à jour réussie
      clearPostData();
      return result;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du post ${id}:`, error);
      throw error;
    }
  }, [postData]); // clearPostData a été retiré des dépendances

  // Supprimer un post par son ID
  const removePost = useCallback(async (id: string): Promise<any> => {
    try {
      const result = await PostService.remove(id);
      return result;
    } catch (error) {
      console.error(`Erreur lors de la suppression du post ${id}:`, error);
      throw error;
    }
  }, []);

  /**
   * Fonction utilitaire pour récupérer un post par ID et charger ses données
   * dans l'état postData du contexte. Utile pour remplir un formulaire d'édition.
   */
  const loadPostForEditing = useCallback(async (id: string): Promise<void> => {
    try {
      const fetchedPost = await PostService.getById(id);

      setPostData({
        ...initialPostData, // Commence avec les valeurs par défaut pour s'assurer que toutes les clés sont présentes
        ...fetchedPost,     // Écrase avec les données récupérées
        images: fetchedPost.images || [], // S'assure que images est un tableau
      });
    } catch (error) {
      console.error(`Erreur lors du chargement du post ${id} pour édition:`, error);
      throw error;
    }
  }, []); // initialPostData est stable, donc pas besoin de le lister comme dépendance s'il est défini en dehors du composant.


  // Valeurs fournies par le contexte à ses consommateurs
  const value: PostDataContextType = {
    postData,
    updatePostData,
    setCoordinates,
    setImages,
    clearPostData,
    getAllPosts,
    getPostById,
    getPostByUser,
    getPostsByProperty,
    getPostsByType,
    searchPosts,
    addPost,
    updatePost,
    removePost,
    loadPostForEditing,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};
