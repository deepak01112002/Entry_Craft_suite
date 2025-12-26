import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  getCurrentPassword: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredPassword = (): string => {
  const stored = localStorage.getItem('adminPassword');
  return stored || 'admin@123'; // Default password
};

const setStoredPassword = (password: string): void => {
  localStorage.setItem('adminPassword', password);
};

const STATIC_CREDENTIALS = {
  username: 'admin',
  get password() {
    return getStoredPassword();
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (username: string, password: string): boolean => {
    if (username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (oldPassword !== STATIC_CREDENTIALS.password) {
      return false; // Old password doesn't match
    }
    if (newPassword.trim().length === 0) {
      return false; // New password cannot be empty
    }
    setStoredPassword(newPassword);
    return true;
  };

  const getCurrentPassword = (): string => {
    return STATIC_CREDENTIALS.password;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword, getCurrentPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
