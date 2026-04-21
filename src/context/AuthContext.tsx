import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { RegisterRequest } from '../services/authService';

export interface User {
  id: number;
  full_name: string;
  email: string;
  business_name?: string;
  avatar?: string;
  productIds?: number[];
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  register: (userData: RegisterRequest) => Promise<void>;
  login: (userData: { email: string } & Partial<User>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addProductToUser: (productId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('expogen_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Migration for old user data format
        if (parsedUser && !parsedUser.full_name && (parsedUser as any).name) {
          parsedUser.full_name = (parsedUser as any).name;
          delete (parsedUser as any).name;
        }
        if (parsedUser && !parsedUser.business_name && (parsedUser as any).company) {
          parsedUser.business_name = (parsedUser as any).company;
          delete (parsedUser as any).company;
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user', error);
      }
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      const newUser = await authService.register(userData);
      const userWithProducts: User = {
        ...newUser,
        productIds: []
      };
      setUser(userWithProducts);
      localStorage.setItem('expogen_user', JSON.stringify(userWithProducts));

      // Update in all users list too
      const usersJson = localStorage.getItem('expogen_all_users');
      let users: any[] = [];
      try {
        users = usersJson ? JSON.parse(usersJson) : [];
        // Migration
        users = users.map(u => {
          if (!u.full_name && u.name) u.full_name = u.name;
          if (!u.business_name && u.company) u.business_name = u.company;
          return u;
        });
      } catch (e) {
        console.error('Failed to parse users list', e);
      }

      if (!users.find(u => u.email === userWithProducts.email)) {
        users.push(userWithProducts);
        localStorage.setItem('expogen_all_users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  }, []);

  const login = useCallback((userData: { email: string } & Partial<User>) => {
    // Legacy local simulation
    const usersJson = localStorage.getItem('expogen_all_users');
    let users: any[] = [];
    try {
      users = usersJson ? JSON.parse(usersJson) : [];
      // Migration
      users = users.map(u => {
        if (!u.full_name && u.name) u.full_name = u.name;
        if (!u.business_name && u.company) u.business_name = u.company;
        return u;
      });
    } catch (e) {
      console.error('Failed to parse users list', e);
    }

    let existingUser = users.find((u) => u.email === userData.email);
    
    if (!existingUser) {
      // If user doesn't exist, create a new local profile
      existingUser = {
        full_name: userData.full_name || userData.email.split('@')[0],
        business_name: userData.business_name,
        ...userData,
        id: Math.floor(Math.random() * 10000) + 1,
        productIds: []
      } as User;
      users.push(existingUser);
      localStorage.setItem('expogen_all_users', JSON.stringify(users));
    }
    
    setUser(existingUser);
    localStorage.setItem('expogen_user', JSON.stringify(existingUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('expogen_user');
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('expogen_user', JSON.stringify(updatedUser));
      
      // Update in all users list too
      const usersJson = localStorage.getItem('expogen_all_users');
      let users: any[] = [];
      try {
        users = usersJson ? JSON.parse(usersJson) : [];
        // Migration
        users = users.map(u => {
          if (!u.full_name && u.name) u.full_name = u.name;
          if (!u.business_name && u.company) u.business_name = u.company;
          return u;
        });
      } catch (e) {
        console.error('Failed to parse users list', e);
      }

      const index = users.findIndex((u) => u.id === prevUser.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('expogen_all_users', JSON.stringify(users));
      } else {
        // If user wasn't in the list for some reason, add them
        users.push(updatedUser);
        localStorage.setItem('expogen_all_users', JSON.stringify(users));
      }
      
      return updatedUser;
    });
  }, []);

  const addProductToUser = useCallback((productId: number) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const productIds = prevUser.productIds || [];
      if (!productIds.includes(productId)) {
        const updatedUser = { ...prevUser, productIds: [...productIds, productId] };
        
        // Update localStorage
        localStorage.setItem('expogen_user', JSON.stringify(updatedUser));
        
        const usersJson = localStorage.getItem('expogen_all_users');
        let users: any[] = [];
        try {
          users = usersJson ? JSON.parse(usersJson) : [];
          // Migration
          users = users.map(u => {
            if (!u.full_name && u.name) u.full_name = u.name;
            if (!u.business_name && u.company) u.business_name = u.company;
            return u;
          });
        } catch (e) {
          console.error('Failed to parse users list', e);
        }

        const index = users.findIndex((u) => u.id === prevUser.id);
        if (index !== -1) {
          users[index] = updatedUser;
          localStorage.setItem('expogen_all_users', JSON.stringify(users));
        }
        
        return updatedUser;
      }
      return prevUser;
    });
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    addProductToUser
  }), [user, isLoading, register, login, logout, updateProfile, addProductToUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
