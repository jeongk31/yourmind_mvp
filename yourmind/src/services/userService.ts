import { supabase } from '../lib/supabase';
import { UserProfile } from '../lib/supabase';

export interface CreateUserProfileData {
  userId: string;
  name: string;
  avatarColor: string;
}

export interface UpdateUserProfileData {
  name?: string;
  avatarColor?: string;
}

export class UserService {
  // Create a new user profile
  static async createProfile(data: CreateUserProfileData): Promise<{ data: UserProfile | null; error: any }> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: data.userId,
          name: data.name,
          avatar_color: data.avatarColor,
        }
      ])
      .select()
      .single();

    return { data: profile, error };
  }

  // Get user profile
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
}
