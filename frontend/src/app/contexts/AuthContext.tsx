"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserData, getUserData, getAuthUserId, isAuthenticated, migrateFromLocalStorage, logout, setAuthUserId } from '../utils/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserData | null;
  userId: string | null;
  login: (userId: string, userData: UserData) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Migra dados do localStorage para cookies se existirem
    migrateFromLocalStorage();
    
    // Verifica se o usuário está logado
    const authenticated = isAuthenticated();
    const userData = getUserData();
    const authUserId = getAuthUserId();

    setIsLoggedIn(authenticated);
    setUser(userData);
    setUserId(authUserId || null);
    setLoading(false);
  }, []);

  const handleLogin = (newUserId: string, userData: UserData) => {
    setAuthUserId(newUserId, userData);
    setUserId(newUserId);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setUserId(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    userId,
    login: handleLogin,
    logout: handleLogout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook para verificar se o usuário tem determinado tipo
export function useAuthCheck(requiredType?: string) {
  const { isLoggedIn, user, loading } = useAuth();
  
  const hasAccess = isLoggedIn && (!requiredType || user?.tipo_usuario === requiredType);
  
  return {
    isLoggedIn,
    user,
    hasAccess,
    loading,
  };
}