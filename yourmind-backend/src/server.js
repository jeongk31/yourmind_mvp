const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const chatController = require('./controllers/chatController');
const locationController = require('./controllers/locationController');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow Vercel frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://yourmind-mvp.vercel.app',
    'https://yourmind-mvp-git-main-jeongk31.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.post('/api/chat/send', chatController.sendMessage);
app.post('/api/chat/start', chatController.startConversation);
app.get('/api/location/address', locationController.getAddressFromCoords);
app.get('/api/location/search', locationController.searchLocations);
app.get('/api/location/nearby-facilities', locationController.searchNearbyFacilities);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'YourMind Backend is running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
}); 