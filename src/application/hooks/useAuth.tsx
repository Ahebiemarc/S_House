import { useEffect, useState, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import AuthService from "../../infrastructure/api/auth.api";
import axios from "axios";

// Types
type UserProps = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}
interface User {
  
  user: UserProps;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const userData = await AuthService.getMe(storedToken);
        setUser(userData);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const { token: newToken } = await AuthService.login({ username, password });
      await AsyncStorage.setItem("token", newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      const userData = await AuthService.getMe(newToken);
      setUser(userData);
      setToken(newToken);
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { message } = await AuthService.register({ username, email, password });
      setUser(null);
      setToken(null);
      Alert.alert(message);
    } catch (error: any) {
      console.error("Register error:", error);
      Alert.alert("Registration Failed", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("token");
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      if (token) {
        const userData = await AuthService.getMe(token);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser l'auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
