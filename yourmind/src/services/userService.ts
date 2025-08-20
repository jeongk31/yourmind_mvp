import { supabase } from '../lib/supabase';
import { UserProfile, User } from '../lib/supabase';

export interface CreateUserProfileData {
  name: string;
  email: string;
  avatarColor: string;
}

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  avatarColor?: string;
}

export interface LoginData {
  email: string;
}

export class UserService {
  // Create a new user profile
  static async createProfile(data: CreateUserProfileData): Promise<{ data: UserProfile | null; error: any }> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          name: data.name,
          email: data.email,
          avatar_color: data.avatarColor,
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
    if (data.avatarColor) updateData.avatar_color = data.avatarColor;

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
