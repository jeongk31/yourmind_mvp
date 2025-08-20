# Supabase Setup Guide for YourMind

This guide will help you set up Supabase for authentication and chat history storage in your YourMind application.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `yourmind-app`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

Create a `.env` file in your `yourmind` directory:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to execute the SQL

### 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production URL when ready
3. Go to **Authentication** → **Providers**
4. Enable **Email** provider
5. Configure email templates if needed

## 🔧 Database Schema

The setup creates two main tables:

### `chat_sessions`
- `id`: Unique session identifier
- `user_id`: References the authenticated user
- `title`: Session title (defaults to "새로운 상담")
- `created_at`: Session creation timestamp
- `updated_at`: Last update timestamp

### `chat_messages`
- `id`: Unique message identifier
- `session_id`: References the chat session
- `content`: Message content
- `sender`: Either 'user' or 'ai'
- `timestamp`: Message timestamp
- `risk_level`: JSON field for risk assessment data

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic user association**: Messages are automatically linked to authenticated users
- **Cascade deletes**: Deleting a session removes all associated messages

## 🚀 Deployment Setup

### For Vercel Deployment

1. Go to your Vercel project settings
2. Add environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### For Production

1. Update your Supabase project settings:
   - **Site URL**: Your production domain
   - **Redirect URLs**: Add your production URLs
2. Update environment variables in your deployment platform

## 📱 Features Included

### Authentication
- ✅ Email/password sign up
- ✅ Email/password sign in
- ✅ Password reset
- ✅ Protected routes
- ✅ User session management

### Chat History
- ✅ Save chat sessions
- ✅ Load previous conversations
- ✅ Delete chat sessions
- ✅ Session titles and timestamps
- ✅ Message persistence

### Security
- ✅ Row Level Security
- ✅ User data isolation
- ✅ Secure API endpoints
- ✅ JWT token management

## 🔍 Testing the Setup

1. Start your development server: `npm start`
2. Navigate to `/signup` to create an account
3. Sign in and go to `/chat`
4. Send some messages
5. Check your Supabase dashboard to see the data

## 🛠️ Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env` file
   - Ensure variables start with `REACT_APP_`

2. **"Invalid API key"**
   - Verify your anon key in Supabase dashboard
   - Check for extra spaces or characters

3. **"RLS policy violation"**
   - Ensure user is authenticated
   - Check database policies are set up correctly

4. **"Cannot read property 'user' of null"**
   - User is not authenticated
   - Check AuthProvider setup

### Debug Steps

1. Check browser console for errors
2. Verify Supabase connection in Network tab
3. Check Supabase dashboard logs
4. Test authentication flow step by step

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Supabase Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🔄 Next Steps

After setup, you can:

1. **Customize email templates** in Supabase dashboard
2. **Add social authentication** (Google, GitHub, etc.)
3. **Set up real-time subscriptions** for live chat updates
4. **Add analytics** to track usage
5. **Implement backup strategies** for chat data

---

**Need help?** Check the Supabase documentation or create an issue in your project repository.
