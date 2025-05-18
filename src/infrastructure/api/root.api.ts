import axios from "axios";
import { Platform } from "react-native";

//export const API_URL = " http://127.0.0.1:5000/api";
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://127.0.0.1:5000/api';

//export const IMG_URL = Platform.OS === 'android' ?  "http://10.0.2.2:5000" : "http://localhost:5000";




// Créer une instance Axios pour centraliser l'URL de base
export const API = axios.create({
    baseURL: API_URL, // À adapter !
    withCredentials: true, // super important pour envoyer/recevoir les cookies
    timeout: 10000, // 10 secondes de timeout
  });
  
  // Ajouter un interceptor pour gérer les erreurs automatiquement
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Erreur venant du serveur (4xx ou 5xx)
        console.error("API Response Error:", error.response.data);
        return Promise.reject(error.response.data);
      } else if (error.request) {
        // Pas de réponse du serveur
        console.error("API No Response:", error.request);
        return Promise.reject({ message: "No response from server" });
      } else {
        // Erreur de configuration
        console.error("API Config Error:", error.message);
        return Promise.reject({ message: "Something went wrong" });
      }
    }
  );