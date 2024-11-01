import React, { createContext, ReactNode, useContext, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function login(email: string, password: string): boolean {
    if (email === "gulshangk1134@gmail.com" && password === "gillu123") {
      setIsAuthenticated(true);
      return true;
    } else {
      setIsAuthenticated(false);
      return false;
    }
  }

  function logout() {
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

