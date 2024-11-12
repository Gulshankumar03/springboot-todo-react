import React, { createContext, ReactNode, useContext, useState } from "react";
import { apiClient } from "@/api/ApiClient";
import { jwtAuthApi } from "@/api/AuthApiService";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  signup: (username: string, password: string) => Promise<boolean>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const signup = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      await apiClient.post("/api/auth/signup", {
        username,
        password,
      });
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    }
  };

  // const login = async (
  //   username: string,
  //   password: string
  // ): Promise<boolean> => {
  //   const baToken = "Basic " + window.btoa(username + ":" + password);
  //   try {
  //     const response = await basicAuthApi(baToken);
  //     if (response.status == 200) {
  //       setIsAuthenticated(true);
  //       setUsername(username);
  //       setToken(baToken);

  //       apiClient.interceptors.request.use((config) => {
  //         config.headers.Authorization = baToken;
  //         return config;
  //       });

  //       return true;
  //     } else {
  //       logout();
  //       return false;
  //     }
  //   } catch (error) {
  //     logout();
  //     return false;
  //     console.log(error);
  //   }
  // };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await jwtAuthApi(username, password);

      if (response.status == 200) {

        const jwtToken = "Bearer " + response.data.token;
        
        setIsAuthenticated(true);
        setUsername(username);
        setToken(jwtToken);

        apiClient.interceptors.request.use((config) => {
          config.headers.Authorization = jwtToken;
          return config;
        });

        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
      console.log(error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        token,
        setIsAuthenticated,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
