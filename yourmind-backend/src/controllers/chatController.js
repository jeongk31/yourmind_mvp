const { openai, COUNSELING_SYSTEM_PROMPT } = require('../config/openai');

// In-memory storage for conversation history (in production, use a database)
const conversationHistory = new Map();

const chatController = {
  // Send a message and get AI response
  async sendMessage(req, res) {
    try {
      const { message, sessionId, systemPrompt } = req.body;

      if (!message || !sessionId) {
        return res.status(400).json({
          error: 'Message and sessionId are required'
        });
      }

      // Get or create conversation history for this session
      if (!conversationHistory.has(sessionId)) {
        const promptToUse = systemPrompt || COUNSELING_SYSTEM_PROMPT;
        conversationHistory.set(sessionId, [
          {
            role: 'system',
            content: promptToUse
          }
        ]);
      } else if (systemPrompt) {
        // Update system prompt if provided
        const conversation = conversationHistory.get(sessionId);
        if (conversation.length > 0 && conversation[0].role === 'system') {
          conversation[0].content = systemPrompt;
        }
      }

      const conversation = conversationHistory.get(sessionId);

      // Add user message to conversation
      conversation.push({
        role: 'user',
        content: message
      });

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: conversation,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const aiResponse = completion.choices[0].message.content;

      // Add AI response to conversation
      conversation.push({
        role: 'assistant',
        content: aiResponse
      });

      // Keep conversation history manageable (last 20 messages)
      if (conversation.length > 20) {
        const systemMessage = conversation[0];
        const recentMessages = conversation.slice(-19);
        conversationHistory.set(sessionId, [systemMessage, ...recentMessages]);
      }

      // Analyze message for risk assessment
      const riskLevel = await analyzeRiskLevel(message, aiResponse);

      res.json({
        success: true,
        response: aiResponse,
        sessionId,
        riskLevel,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({
        error: 'Failed to process message',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Start a new conversation
  async startConversation(req, res) {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize conversation with system prompt
      conversationHistory.set(sessionId, [
        {
          role: 'system',
          content: COUNSELING_SYSTEM_PROMPT
        }
      ]);

      res.json({
        success: true,
        sessionId,
        message: '새로운 상담이 시작되었습니다. 어떤 고민이 있으신가요?',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Start conversation error:', error);
      res.status(500).json({
        error: 'Failed to start conversation'
      });
    }
  },

  // Get conversation history
  async getConversationHistory(req, res) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          error: 'SessionId is required'
        });
      }

      const conversation = conversationHistory.get(sessionId);

      if (!conversation) {
        return res.status(404).json({
          error: 'Conversation not found'
        });
      }

      // Filter out system messages and return user/assistant messages
      const messages = conversation
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date().toISOString()
        }));

      res.json({
        success: true,
        sessionId,
        messages,
        messageCount: messages.length
      });

    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({
        error: 'Failed to get conversation history'
      });
    }
  },

  // Clear conversation history
  async clearConversation(req, res) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          error: 'SessionId is required'
        });
      }

      conversationHistory.delete(sessionId);

      res.json({
        success: true,
        message: 'Conversation history cleared'
      });

    } catch (error) {
      console.error('Clear conversation error:', error);
      res.status(500).json({
        error: 'Failed to clear conversation'
      });
    }
  }
};

// Helper function to analyze risk level
async function analyzeRiskLevel(userMessage, aiResponse) {
  try {
    const riskKeywords = [
      '자살', '죽고 싶다', '살고 싶지 않다', '끝내고 싶다',
      '자해', '자신을 해치고 싶다', '칼', '약물 과다 복용',
      '타인을 해치고 싶다', '폭력', '살인', '죽이고 싶다'
    ];

    const message = (userMessage + ' ' + aiResponse).toLowerCase();
    
    const hasRiskKeywords = riskKeywords.some(keyword => 
      message.includes(keyword.toLowerCase())
    );

    if (hasRiskKeywords) {
      return {
        level: 'high',
        message: '위험 신호가 감지되었습니다. 즉시 전문가 상담을 권유합니다.',
        requiresImmediateAttention: true
      };
    }

    // Check for moderate risk indicators
    const moderateKeywords = [
      '우울', '절망', '희망이 없다', '의미가 없다',
      '고립', '외로움', '아무도 이해하지 못한다'
    ];

    const hasModerateKeywords = moderateKeywords.some(keyword => 
      message.includes(keyword.toLowerCase())
    );

    if (hasModerateKeywords) {
      return {
        level: 'moderate',
        message: '정신 건강에 대한 관심이 필요할 수 있습니다.',
        requiresImmediateAttention: false
      };
    }

    return {
      level: 'low',
      message: '일반적인 상담 상황입니다.',
      requiresImmediateAttention: false
    };

  } catch (error) {
    console.error('Risk analysis error:', error);
    return {
      level: 'unknown',
      message: '위험도 분석 중 오류가 발생했습니다.',
      requiresImmediateAttention: false
    };
  }
}

module.exports = chatController; 