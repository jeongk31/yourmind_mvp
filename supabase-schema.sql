-- Create users table for user profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT '새로운 상담',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  risk_level JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (true);

-- Create policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own chat sessions" ON chat_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own chat sessions" ON chat_sessions
  FOR DELETE USING (true);

-- Create policies for chat_messages
CREATE POLICY "Users can view messages from their sessions" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Users can insert messages to their sessions" ON chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update messages from their sessions" ON chat_messages
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete messages from their sessions" ON chat_messages
  FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at 
  BEFORE UPDATE ON chat_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get session summary
CREATE OR REPLACE FUNCTION get_session_summary(session_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  summary TEXT;
BEGIN
  SELECT string_agg(
    CASE 
      WHEN sender = 'user' THEN '사용자: ' || substring(content, 1, 50)
      ELSE 'AI: ' || substring(content, 1, 50)
    END || CASE WHEN length(content) > 50 THEN '...' ELSE '' END,
    E'\n'
  ) INTO summary
  FROM chat_messages 
  WHERE session_id = session_uuid 
  ORDER BY timestamp ASC 
  LIMIT 3;
  
  RETURN COALESCE(summary, '');
END;
$$ LANGUAGE plpgsql;
