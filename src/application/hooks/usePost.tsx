//hooks/PostContext.tsx

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Property, Type } from '../../domain/enum/post';
import { PostData } from '../../domain/interface/Post.interface';
import PostService from '../../infrastructure/api/post.api';
import { Asset } from 'react-native-image-picker';

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
  setImages: (uris: Asset[]) => void; // Pour les URIs d'aperçu local
  clearPostData: () => void; // Pour réinitialiser postData

  // Méthodes API
  getAllPosts: () => Promise<PostData[]>;
  getPostById: (id: string) => Promise<PostData>;
  getPostByUser: () => Promise<PostData[]>;
  getPostsByProperty: (property: Property) => Promise<PostData[]>;
  getPostsByType: (type: string) => Promise<PostData[]>;
  searchPosts: (query: string) => Promise<PostData[]>;
  // addPost utilise postData du contexte et les fichiers image fournis
  addPost: () => Promise<any>; 
  // updatePost utilise postData du contexte et les fichiers image fournis
  updatePost: (id: string) => Promise<any>; 
  loadPostForEditing: (id: string) => Promise<void>; // *** AJOUTÉ ***
  removePost: (id: string) => Promise<any>; // Ajout de removePost

  loading: boolean;
  error: string | null;
  currentEditingPostId: string | null; // Pour savoir si on est en mode édition
  setCurrentEditingPostId: (id: string | null) => void; // Pour définir l'ID du post en édition 
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

const initialPostDataState: PostData = {
  // id: undefined, // id sera défini lors du chargement pour édition
  title: '', price: '', address: '', desc: '', city: '', bedroom: '', bathroom: '',
  latitude: null, longitude: null,
  type: Object.keys(Type)[0] as keyof typeof Type || 'BUY',
  property: Object.keys(Property)[0] as keyof typeof Property || 'HOUSE',
  images: [],
};


// Fournisseur du contexte
export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [postData, setPostData] = useState<PostData>(initialPostDataState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEditingPostId, setCurrentEditingPostId] = useState<string | null>(null);

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
  const setImages = useCallback((uris: Asset[]) => {
    setPostData((prevData) => ({
      ...prevData,
      images: uris,
    }));
  }, []);

  // Fonction pour réinitialiser postData à son état initial
  const clearPostData = useCallback(() => {
    setPostData(initialPostDataState);
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

  /*const addPost = useCallback(async (imageFiles: ImageFile[]): Promise<any> => {
    try {
      
      const result = await PostService.add(postData, imageFiles);
      // Optionnel: effacer les données du formulaire après une soumission réussie
      // clearPostData(); 
      return result;
    } catch (error) {
      console.error("Erreur lors de l'ajout du post:", error);
      throw error;
    }
  }, [postData]); // clearPostData a été retiré des dépendances pour éviter les problèmes de closure si non mémoisé*/

  const addPost = async (): Promise<any> => {
    setLoading(true); setError(null);
    try {
      const { images: imageAssets, id, ...restOfData } = postData; // Exclure id si présent
      const dataToSend = {
        ...restOfData,
        price: parseFloat(postData.price) || 0,
        bedroom: parseInt(postData.bedroom, 10) || 0,
        bathroom: parseInt(postData.bathroom, 10) || 0,
      };
      const response = await PostService.add(dataToSend, imageAssets);
      setLoading(false);
      // clearPostData(); // Optionnel: réinitialiser après succès
      return response;
    } catch (e: any) {
      console.error("Erreur addPost:", e); setError(e.message || 'Erreur création.'); setLoading(false); throw e;
    }
  };

  /**
   * Met à jour un post existant en utilisant le postData actuel du contexte et de nouveaux fichiers image.
   */
  // *** NOUVEAU: Implémentation de updatePost ***
  const updatePost = async (postId: string): Promise<any> => {
    if (!postId) {
        setError("ID du post manquant pour la mise à jour.");
        throw new Error("ID du post manquant pour la mise à jour.");
    }
    setLoading(true); setError(null);
    try {
      const { images: imageAssets, id, ...restOfData } = postData; // Exclure id du payload principal
      const dataToSend = {
        ...restOfData,
        price: parseFloat(postData.price) || 0,
        bedroom: parseInt(postData.bedroom, 10) || 0,
        bathroom: parseInt(postData.bathroom, 10) || 0,
      };
      // Note: La gestion des images pour la mise à jour peut être complexe.
      // Faut-il envoyer toutes les images (Asset[]) ou seulement les nouvelles ?
      // Votre API doit gérer si une image est une URL existante ou un nouveau fichier.
      // Ici, on envoie toutes les images de `postData.images` comme si elles étaient à (ré)uploader.
      const response = await PostService.update(postId, dataToSend, imageAssets);
      setLoading(false);
      // clearPostData(); // Optionnel: réinitialiser après succès
      return response;
    } catch (e: any) {
      console.error(`Erreur updatePost (ID: ${postId}):`, e); setError(e.message || 'Erreur mise à jour.'); setLoading(false); throw e;
    }
  };

  /**
   * Fonction utilitaire pour récupérer un post par ID et charger ses données
   * dans l'état postData du contexte. Utile pour remplir un formulaire d'édition.
   */
  // *** NOUVEAU: Implémentation de loadPostForEditing ***
  const loadPostForEditing = async (postId: string): Promise<void> => {
    setLoading(true); setError(null); setCurrentEditingPostId(postId);
    try {
      const fetchedPost = await PostService.getById(postId); // Assurez-vous que getById retourne PostData
      if (fetchedPost) {
        // Transformer les images si elles sont des strings (URLs) en Asset[] pour le picker
        // Si votre API retourne déjà des Asset[], cette étape n'est pas nécessaire.
        // Pour la simulation, je suppose que fetchedPost.images est déjà Asset[] ou compatible.
        const imagesAsAssets: Asset[] = (fetchedPost.images || []).map((img: any, index: number) => {
            if (typeof img === 'string') { // Si c'est une URL
                return { uri: img, fileName: `image_${index}.jpg`, type: 'image/jpeg' }; // Créez un Asset basique
            }
            return img; // Si c'est déjà un objet Asset-like
        });

        setPostData({
          ...initialPostDataState, // Base pour les champs non présents
          ...fetchedPost,
          id: postId, // S'assurer que l'ID est bien celui du post édité
          // Convertir les champs numériques en string pour les inputs
          price: String(fetchedPost.price || ''),
          bedroom: String(fetchedPost.bedroom || ''),
          bathroom: String(fetchedPost.bathroom || ''),
          images: imagesAsAssets,
        });
      } else {
        throw new Error("Post non trouvé");
      }
      setLoading(false);
    } catch (e: any) {
      console.error(`Erreur loadPostForEditing (ID: ${postId}):`, e);
      setError(e.message || `Erreur chargement post ${postId}.`);
      setLoading(false);
      setCurrentEditingPostId(null);
      throw e;
    }
  };

  const removePost = async (id: string): Promise<any> => {
    setLoading(true); setError(null);
    try {
      const response = await PostService.remove(id); setLoading(false); return response;
    } catch (e: any) { setError(e.message || `Erreur suppression post ${id}.`); setLoading(false); throw e; }
  };


  const value: PostDataContextType = {
    postData, updatePostData, setCoordinates, setImages, clearPostData, searchPosts, getPostsByProperty, getPostsByType,
    addPost, updatePost, getAllPosts, getPostById, getPostByUser, loadPostForEditing, removePost,
    loading, error, currentEditingPostId, setCurrentEditingPostId,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};
