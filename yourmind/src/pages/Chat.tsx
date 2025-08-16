import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { apiService } from '../utils/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  riskLevel?: {
    level: 'low' | 'moderate' | 'high' | 'unknown';
    message: string;
    requiresImmediateAttention: boolean;
  };
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [riskMessage, setRiskMessage] = useState<string | null>(null);
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial counseling questions - memoized with useCallback
  const initialQuestions = useCallback(() => [
    {
      id: 'welcome',
      text: '안녕하세요, 만나서 반가워요. 저는 오늘 당신의 이야기를 들어줄 상담 AI예요.',
      sender: 'ai' as const,
      timestamp: new Date(),
    },
    {
      id: 'reason',
      text: '혹시 오늘 저를 찾아온 이유나 계기가 있을까요?',
      sender: 'ai' as const,
      timestamp: new Date(),
    },
    {
      id: 'mood',
      text: '지금 이 순간 기분을 한 단어로 표현하면 어떤가요?',
      sender: 'ai' as const,
      timestamp: new Date(),
    }
  ], []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome questions
  useEffect(() => {
    if (messages.length === 0) {
      setMessages(initialQuestions());
    }
  }, [messages.length, initialQuestions]);

  const startNewChat = async () => {
    try {
      setIsTyping(true);
      const response = await apiService.startConversation();
      
      if (response.success) {
        setSessionId(response.sessionId);
        setMessages(initialQuestions()); // Show initial questions for new chat
        setError(null);
        setRiskMessage(null);
        setShowRiskAlert(false);
      } else {
        setError('새로운 상담을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('새로운 상담을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await apiService.sendMessage(inputText, sessionId);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        riskLevel: response.riskLevel,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Show risk alert if needed
      if (response.riskLevel.requiresImmediateAttention) {
        setRiskMessage(response.riskLevel.message);
        setShowRiskAlert(true);
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('메시지를 전송할 수 없습니다. 잠시 후 다시 시도해주세요.');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <Container maxWidth="md" sx={{ py: 4, height: 'calc(100vh - 120px)' }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Risk Alert */}
      <Snackbar
        open={showRiskAlert}
        autoHideDuration={10000}
        onClose={() => setShowRiskAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="warning" 
          onClose={() => setShowRiskAlert(false)}
          sx={{ width: '100%' }}
        >
          {riskMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    AI 상담사
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    전문적인 상담과 따뜻한 위로를 제공합니다
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Button onClick={startNewChat} color="primary" title="새 상담 시작" disabled={isTyping}>
                  <CircularProgress size={20} color="inherit" />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Messages */}
        <Paper
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.default',
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {message.sender === 'user' ? 'U' : 'AI'}
                    </Box>
                    <Box>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                          color: message.sender === 'user' ? 'white' : 'text.primary',
                          borderRadius: 2,
                          boxShadow: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.text}
                        </Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        {message.timestamp.toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Box sx={{ bgcolor: 'primary.main', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      AI
                    </Box>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            animation: 'typing 1.4s infinite ease-in-out',
                            '&:nth-of-type(1)': { animationDelay: '0s' },
                            '&:nth-of-type(2)': { animationDelay: '0.2s' },
                            '&:nth-of-type(3)': { animationDelay: '0.4s' },
                            '@keyframes typing': {
                              '0%, 60%, 100%': { transform: 'translateY(0)' },
                              '30%': { transform: 'translateY(-10px)' },
                            },
                          }}
                        />
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            animation: 'typing 1.4s infinite ease-in-out',
                            animationDelay: '0.2s',
                          }}
                        />
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            animation: 'typing 1.4s infinite ease-in-out',
                            animationDelay: '0.4s',
                          }}
                        />
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="고민을 자유롭게 말씀해 주세요..."
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                sx={{
                  borderRadius: 3,
                  minWidth: 48,
                  height: 40,
                }}
              >
                <SendIcon />
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Enter로 전송, Shift+Enter로 줄바꿈
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Chat; 