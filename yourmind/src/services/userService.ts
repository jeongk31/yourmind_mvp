import { supabase } from '../lib/supabase';
import { UserProfile, User } from '../lib/supabase';

export interface CreateUserProfileData {
  name: string;
  email: string;
  password: string;
  avatarColor: string;
  phone?: string;
  location?: string;
}

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  phone?: string;
  location?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class UserService {
  // Simple hash function (in production, use bcrypt or similar)
  private static hashPassword(password: string): string {
    // This is a simple hash for demo purposes
    // In production, use proper hashing like bcrypt
    return btoa(password + 'yourmind_salt');
  }

  private static verifyPassword(password: string, hash: string): boolean {
    const hashedInput = this.hashPassword(password);
    return hashedInput === hash;
  }

  // Create a new user profile
  static async createProfile(data: CreateUserProfileData): Promise<{ data: UserProfile | null; error: any }> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          name: data.name,
          email: data.email,
          password_hash: this.hashPassword(data.password),
          avatar_color: data.avatarColor,
          phone: data.phone,
          location: data.location,
        }
      ])
      .select()
      .single();

    return { data: profile, error };
  }

  // Get user profile by email
  static async getProfileByEmail(email: string): Promise<{ data: UserProfile | null; error: any }> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    return { data: profile, error };
  }

  // Verify user login
  static async verifyLogin(email: string, password: string): Promise<{ data: UserProfile | null; error: any }> {
    const { data: profile, error } = await this.getProfileByEmail(email);
    
    if (error) {
      return { data: null, error: { message: '로그인 중 오류가 발생했습니다.' } };
    }

    if (!profile) {
      return { data: null, error: { message: '등록되지 않은 이메일입니다.' } };
    }

    if (!this.verifyPassword(password, profile.password_hash)) {
      return { data: null, error: { message: '비밀번호가 올바르지 않습니다.' } };
    }

    return { data: profile, error: null };
  }

  // Get user profile by ID
  static async getProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data: profile, error };
  }

  // Update user profile
  static async updateProfile(userId: string, data: UpdateUserProfileData): Promise<{ data: UserProfile | null; error: any }> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password_hash = this.hashPassword(data.password);
    if (data.avatarColor) updateData.avatar_color = data.avatarColor;
    if (data.phone) updateData.phone = data.phone;
    if (data.location) updateData.location = data.location;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    return { data: profile, error };
  }

  // Delete user profile (cascade will handle related data)
  static async deleteProfile(userId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    return { error };
  }

  // Check if email already exists
  static async checkEmailExists(email: string): Promise<{ exists: boolean; error: any }> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();

    return { exists: !!data, error };
  }
}
