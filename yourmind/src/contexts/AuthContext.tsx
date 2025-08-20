import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, User } from '../lib/supabase';
import { UserService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, avatarColor: string) => Promise<{ error: any }>;
  signIn: (email: string) => Promise<{ error: any }>;
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

  const signUp = async (name: string, email: string, avatarColor: string) => {
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
        avatarColor,
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

  const signIn = async (email: string) => {
    try {
      // Get user profile by email
      const { data: profile, error } = await UserService.getProfileByEmail(email);

      if (error) {
        return { error: { message: '로그인 중 오류가 발생했습니다.' } };
      }

      if (!profile) {
        return { error: { message: '등록되지 않은 이메일입니다.' } };
      }

      // Convert UserProfile to User format
      const userData: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar_color: profile.avatar_color,
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
