import { API } from './root.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfileUpdateData } from '../../domain/interface/User.interface';
import { Asset } from 'react-native-image-picker';

const UserService = {
  // PUT : mise à jour d'un utilisateur
  update: async (id: string, data: UserProfileUpdateData, avatar?: Asset) => {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    // Ajouter les autres données de l'utilisateur
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Ajouter l'image si elle existe
    if (avatar) {
      formData.append('avatar', {
        uri: avatar.uri,
        name: avatar.fileName || `photo.jpg`,
        type: avatar.type || 'image/jpeg',
      });
    }

    const res = await API.put(`/users/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  },

  // DELETE : suppression d’un utilisateur
  delete: async (id: string) => {
    const token = await AsyncStorage.getItem('token');
    const res = await API.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};

export default UserService;
