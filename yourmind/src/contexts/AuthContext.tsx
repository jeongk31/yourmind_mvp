import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../lib/supabase';
import { UserService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string, avatarColor: string, phone?: string, location?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    // This will be implemented when we add session management
  };

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('yourmind_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('yourmind_user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (name: string, email: string, password: string, avatarColor: string, phone?: string, location?: string) => {
    try {
      // Check if email already exists
      const { exists, error: checkError } = await UserService.checkEmailExists(email);
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        return { error: { message: '이메일 확인 중 오류가 발생했습니다.' } };
      }

      if (exists) {
        return { error: { message: '이미 사용 중인 이메일입니다.' } };
      }

      // Create new user profile
      const { data: profile, error } = await UserService.createProfile({
        name,
        email,
        password,
        avatarColor,
        phone,
        location,
      });

      if (error) {
        return { error: { message: '회원가입 중 오류가 발생했습니다.' } };
      }

      if (profile) {
        // Convert UserProfile to User format
        const userData: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar_color: profile.avatar_color,
          location: profile.location,
          phone: profile.phone,
          stress_level: profile.stress_level,
          anxiety_level: profile.anxiety_level,
          depression_level: profile.depression_level,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };

        // Store user in localStorage
        localStorage.setItem('yourmind_user', JSON.stringify(userData));
        setUser(userData);
      }

      return { error: null };
    } catch (err) {
      return { error: { message: '회원가입 중 오류가 발생했습니다.' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Verify user login with password
      const { data: profile, error } = await UserService.verifyLogin(email, password);

      if (error) {
        return { error };
      }

      if (!profile) {
        return { error: { message: '로그인 정보가 올바르지 않습니다.' } };
      }

      // Convert UserProfile to User format
      const userData: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar_color: profile.avatar_color,
        location: profile.location,
        phone: profile.phone,
        stress_level: profile.stress_level,
        anxiety_level: profile.anxiety_level,
        depression_level: profile.depression_level,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      };

      // Store user in localStorage
      localStorage.setItem('yourmind_user', JSON.stringify(userData));
      setUser(userData);

      return { error: null };
    } catch (err) {
      return { error: { message: '로그인 중 오류가 발생했습니다.' } };
    }
  };

  const signOut = async () => {
    // Remove user from localStorage
    localStorage.removeItem('yourmind_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
