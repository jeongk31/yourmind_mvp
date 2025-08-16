const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Start a new conversation
router.post('/start', chatController.startConversation);

// Send a message and get AI response
router.post('/send', chatController.sendMessage);

// Get conversation history
router.get('/history/:sessionId', chatController.getConversationHistory);

// Clear conversation history
router.delete('/clear/:sessionId', chatController.clearConversation);

module.exports = router; 