'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: number;
  nombre: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = Cookies.get('token');
    const savedUserRole = Cookies.get('user_role');
    const savedUserName = Cookies.get('user_name');
    const savedUserEmail = Cookies.get('user_email');
    const savedUserId = Cookies.get('user_id');

    if (savedToken && savedUserRole && savedUserName && savedUserEmail && savedUserId) {
      setUser({
        id: parseInt(savedUserId),
        nombre: savedUserName,
        email: savedUserEmail,
        role: savedUserRole as 'CUSTOMER' | 'ADMIN'
      });
      setToken(savedToken);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    
    // Store in Cookies for client and server middleware access
    Cookies.set('token', newToken, { expires: 1 });
    Cookies.set('user_role', newUser.role, { expires: 1 });
    Cookies.set('user_name', newUser.nombre, { expires: 1 });
    Cookies.set('user_email', newUser.email, { expires: 1 });
    Cookies.set('user_id', newUser.id.toString(), { expires: 1 });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Remove cookies
    Cookies.remove('token');
    Cookies.remove('user_role');
    Cookies.remove('user_name');
    Cookies.remove('user_email');
    Cookies.remove('user_id');

    // Force redirection to login and clear caches
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
