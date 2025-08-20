import { supabase } from '../lib/supabase';
import { ChatSession, ChatMessage } from '../lib/supabase';

export interface CreateSessionData {
  title: string;
  userId: string;
}

export interface SaveMessageData {
  sessionId: string;
  content: string;
  sender: 'user' | 'ai';
  riskLevel?: {
    level: 'low' | 'moderate' | 'high' | 'unknown';
    requiresImmediateAttention: boolean;
    message: string;
  };
}

export class ChatService {
  // Create a new chat session
  static async createSession(data: CreateSessionData): Promise<{ data: ChatSession | null; error: any }> {
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert([
        {
          user_id: data.userId,
          title: data.title,
        }
      ])
      .select()
      .single();

    return { data: session, error };
  }

  // Get all chat sessions for a user
  static async getSessions(userId: string): Promise<{ data: ChatSession[] | null; error: any }> {
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: sessions, error };
  }

  // Get a specific chat session
  static async getSession(sessionId: string): Promise<{ data: ChatSession | null; error: any }> {
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    return { data: session, error };
  }

  // Save a message to a session
  static async saveMessage(data: SaveMessageData): Promise<{ data: ChatMessage | null; error: any }> {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          session_id: data.sessionId,
          content: data.content,
          sender: data.sender,
          risk_level: data.riskLevel,
        }
      ])
      .select()
      .single();

    return { data: message, error };
  }

  // Get all messages for a session
  static async getMessages(sessionId: string): Promise<{ data: ChatMessage[] | null; error: any }> {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    return { data: messages, error };
  }

  // Update session title
  static async updateSessionTitle(sessionId: string, title: string): Promise<{ data: ChatSession | null; error: any }> {
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', sessionId)
      .select()
      .single();

    return { data: session, error };
  }

  // Delete a session and all its messages
  static async deleteSession(sessionId: string): Promise<{ error: any }> {
    // First delete all messages in the session
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);

    if (messagesError) {
      return { error: messagesError };
    }

    // Then delete the session
    const { error: sessionError } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    return { error: sessionError };
  }

  // Get session summary (first few messages for preview)
  static async getSessionSummary(sessionId: string): Promise<{ data: string | null; error: any }> {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('content, sender')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true })
      .limit(3);

    if (error) {
      return { data: null, error };
    }

    if (!messages || messages.length === 0) {
      return { data: null, error: null };
    }

    // Create a summary from the first few messages
    const summary = messages
      .map(msg => `${msg.sender === 'user' ? '사용자' : 'AI'}: ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`)
      .join('\n');

    return { data: summary, error: null };
  }
}
