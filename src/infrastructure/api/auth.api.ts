import { API } from "./root.api";
import { LoginData, RegisterData } from "../../domain/interface/Auth.interface";


// Service d'authentification
const AuthService = {
    register: async (data: RegisterData) => {
      const response = await API.post("/auth/register", data);
      return response.data; // Token ou user retourné par ton backend
    },
  
    login: async (data: LoginData) => {
      const response = await API.post("/auth/login", data);
      return response.data; // Token ou user retourné
    },
  
    getMe: async (token: string) => {
      const response = await API.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Info utilisateur
    },
  };
  
  export default AuthService;
  