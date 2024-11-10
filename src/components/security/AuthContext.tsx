import React, { createContext, ReactNode, useContext, useState } from "react";
import { apiClient } from "@/api/ApiClient";
import { basicAuthApi } from "@/api/HelloWorldApiService";

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
  // makeAuthenticatedRequest: (url: string) => Promise<unknown>;
  // sessionId: string | null;
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
  // const [sessionId, setSessionId] = useState<string | null>(null);

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

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const baToken = "Basic " + window.btoa(username + ":" + password);
    try {
      const response = await basicAuthApi(baToken);
      if (response.status == 200) {
        setIsAuthenticated(true);
        setUsername(username);
        setToken(baToken);

        apiClient.interceptors.request.use((config) => {
          config.headers.Authorization = baToken;
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
    // setSessionId(null);
    // Cookies.remove("sessionId");
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
        // makeAuthenticatedRequest,
        // sessionId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// const login = async (username: string, password: string): Promise<boolean> => {
//   try {
//     const response = await axiosInstance.post(
//       "/auth/basic",
//       { username, password },
//       { withCredentials: true }
//     );
//     // Update authentication state and session info
//     setIsAuthenticated(true);
//     setUsername(response.data.username || username);
//     return true;
//   } catch (error) {
//     console.error("Login failed", error);
//     setIsAuthenticated(false);
//     setUsername(null);
//     // setSessionId(null);
//     return false;
//   }
// };

// const makeAuthenticatedRequest = async (url: string): Promise<unknown> => {
//   try {
//     const response = await apiClient.get(url, { withCredentials: true });
//     return response.data;
//   } catch (error) {
//     // TypeScript adjustment: Ensure error has a response property
//     if (
//       axios.isAxiosError(error) &&
//       error.response &&
//       error.response.status === 401
//     ) {
//       // Handle unauthorized error by logging out
//       logout();
//     } else {
//       console.error("Authenticated request failed", error);
//     }
//     throw error;
//   }
// };
