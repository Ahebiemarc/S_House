// api/post.api.ts

import { LogBox } from 'react-native';
import { PostData } from '../../domain/interface/Post.interface';
import { API } from './root.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostService = {
  // GET : tous les posts
  getAll: async () => {
    const res = await API.get('/posts');
    return res.data;
  },

  // GET : post par ID
  getById: async (id: string) => {
    const res = await API.get(`/posts/${id}`);
    return res.data;
  },

  // GET : post par ID
  getByUser: async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await API.get(`/posts/user`, {
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    return res.data;
  },

  // GET : posts par propriété
  getByProperty: async (property: string) => {
    const res = await API.get(`/posts/property/${property}`);
    return res.data;
  },

  // GET : posts par type
  getByType: async (type: string) => {
    const res = await API.get(`/posts/type/${type}`);
    return res.data;
  },

  // GET : recherche par input (par exemple ?query=text)
  search: async (query: string) => {
    const res = await API.get(`/posts/search/input`, {
      params: { query },
    });
    return res.data;
  },

  // POST : créer un post (avec images)
  add: async (data: PostData, images: any[]) => {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

   // Ajouter les champs textuels du post
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'object') {
        formData.append(key, value.toString());
      }
    });

    // Ajouter les images comme fichiers (dans le champ "images")
    images.forEach((file) => {
      formData.append("images", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });
    

    const res = await API.post('/posts', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    

    return res.data;
    
  },

  // PUT : modifier un post
  update: async (id: string, data: PostData, images: any[]) => {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((img, index) => {
      formData.append('img', {
        uri: img.uri,
        name: img.name || `photo_${index}.jpg`,
        type: img.type || 'image/jpeg',
      });
    });

    const res = await API.put(`/posts/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  },

  // DELETE : supprimer un post
  remove: async (id: string) => {
    const token = await AsyncStorage.getItem('token');
    const res = await API.delete(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};

export default PostService;
