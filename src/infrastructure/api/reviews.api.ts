//services/reviews.api.ts
import { API } from './root.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReviewData } from '../../domain/interface/Review.interface';

const ReviewService = {
  // 🔍 Obtenir une review par ID
  get: async (id: string) => {
    const res = await API.get(`/reviews/${id}`);
    return res.data;
  },

  // 🔍 Obtenir toutes les reviews pour un post spécifique
  getAllByPost: async (postId: string) => {
    console.log(postId);
    const res = await API.get(`/reviews/post/${postId}`);
    return res.data;
  },

  // 🔍 Obtenir toutes les reviews de l'utilisateur courant
  getAllByUser: async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await API.get(`/reviews/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // ➕ Ajouter une review pour un post
  add: async (postId: string, review: ReviewData) => {
    const token = await AsyncStorage.getItem('token');
    const res = await API.post(`/reviews/${postId}`, review, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // ✏️ Mettre à jour une review
  update: async (id: string, review: ReviewData) => {
    const token = await AsyncStorage.getItem('token');
    const res = await API.put(`/reviews/${id}`, review, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // ❌ Supprimer une review
  delete: async (id: string) => {
    const token = await AsyncStorage.getItem('token');
    const res = await API.delete(`/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};

export default ReviewService;
