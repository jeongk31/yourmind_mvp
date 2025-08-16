# 🧠 YourMind - AI Counseling Service

AI와 함께하는 따뜻한 마음 상담 서비스

## 🌟 Live Demo

- **Frontend**: [https://yourmind.vercel.app](https://yourmind.vercel.app)
- **Backend API**: [https://yourmind-backend.onrender.com](https://yourmind-backend.onrender.com)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- OpenAI API Key

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/yourmind.git
cd yourmind
```

2. **Install frontend dependencies**
```bash
cd yourmind
npm install
```

3. **Install backend dependencies**
```bash
cd ../yourmind-backend
npm install
```

4. **Set up environment variables**
```bash
# Backend (.env)
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here

# Frontend (.env.local)
REACT_APP_API_URL=http://localhost:5001/api
```

5. **Start the services**
```bash
# Terminal 1 - Backend
cd yourmind-backend
npm run dev

# Terminal 2 - Frontend  
cd yourmind
npm start
```

6. **Open your browser**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5001](http://localhost:5001)

## 🏗️ Project Structure

```
yourmind/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions & API service
│   └── App.tsx            # Main app component
├── public/                 # Static assets
└── package.json            # Frontend dependencies

yourmind-backend/
├── src/                    # Backend source code
│   ├── config/            # Configuration files
│   ├── controllers/       # API controllers
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── .env                   # Environment variables
└── package.json           # Backend dependencies
```

## 🚀 Deployment

### Render (Backend)
1. Connect your GitHub repo to [Render.com](https://render.com)
2. Create a new Web Service
3. Set environment variables
4. Deploy automatically

### Vercel (Frontend)
1. Connect your GitHub repo to [Vercel.com](https://vercel.com)
2. Import project with Create React App preset
3. Set environment variables
4. Deploy automatically

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://yourmind.vercel.app
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://yourmind-backend.onrender.com/api
REACT_APP_ENVIRONMENT=production
```

## 📡 API Endpoints

- `GET /` - Root endpoint (health check)
- `GET /api/health` - Health check
- `POST /api/chat/start` - Start new conversation
- `POST /api/chat/send` - Send message
- `GET /api/chat/history/:sessionId` - Get conversation history
- `DELETE /api/chat/clear/:sessionId` - Clear conversation

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Framer Motion** - Animations
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **OpenAI GPT-4** - AI counseling
- **Helmet** - Security
- **CORS** - Cross-origin requests

## 🎯 Features

- ✅ **AI Counseling** - GPT-4 powered conversations
- ✅ **Risk Assessment** - Automatic danger signal detection
- ✅ **Conversation History** - Session-based chat management
- ✅ **Professional Recommendations** - Counselor/psychiatrist suggestions
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Real-time Chat** - Instant AI responses

## 🔒 Security Features

- **Input Validation** - Sanitized user inputs
- **CORS Protection** - Controlled cross-origin access
- **Helmet Security** - HTTP headers protection
- **Environment Variables** - Secure API key storage
- **Rate Limiting** - API abuse prevention

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Responsive tablet layouts
- **Desktop Experience** - Full-featured desktop interface
- **Touch Friendly** - Mobile-optimized interactions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - GPT-4 API
- **Material-UI** - Beautiful components
- **Framer Motion** - Smooth animations
- **React Community** - Amazing framework

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**YourMind** - AI와 함께하는 따뜻한 마음 상담 🧠💙

*Made with ❤️ for mental health awareness* 