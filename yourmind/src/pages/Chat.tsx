import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ChatService } from '../services/chatService';
import { ChatSession } from '../lib/supabase';
import { apiService } from '../utils/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  riskLevel?: {
    level: 'low' | 'moderate' | 'high' | 'unknown';
    requiresImmediateAttention: boolean;
    message: string;
  };
}

const Chat: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [riskMessage, setRiskMessage] = useState<string | null>(null);
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ChatSession | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Load chat sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await ChatService.getSessions(user.id);
      
      if (error) {
        console.error('Error loading sessions:', error);
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load messages for a session
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await ChatService.getMessages(sessionId);
      
      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          riskLevel: msg.risk_level,
        }));
        setMessages(formattedMessages);
      } else {
        setMessages(initialQuestions());
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  }, [initialQuestions]);

  // Start new chat
  const startNewChat = useCallback(async () => {
    if (!user) return;

    try {
      setIsTyping(true);
      const response = await apiService.startConversation();
      
      if (response.success) {
        const sessionNumber = sessions.length + 1;
        const title = `채팅 ${sessionNumber}`;
        
        // Create new session in Supabase
        const { data: session, error } = await ChatService.createSession({
          title,
          userId: user.id,
        });

        if (error) {
          console.error('Error creating session:', error);
          return;
        }

        if (session) {
          setSessionId(session.id);
          setCurrentSession(session);
          setMessages(initialQuestions());
          await loadSessions(); // Refresh sessions list
        }
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('새로운 상담을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsTyping(false);
    }
  }, [user, sessions.length, initialQuestions, loadSessions]);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Initialize chat with welcome questions if no session
  useEffect(() => {
    if (messages.length === 0 && !sessionId) {
      setMessages(initialQuestions());
    }
  }, [messages.length, sessionId, initialQuestions]);

  // Handle session selection
  const handleSessionSelect = async (session: ChatSession) => {
    setCurrentSession(session);
    setSessionId(session.id);
    await loadSessionMessages(session.id);
    setSidebarOpen(false);
  };

  // Handle session title edit
  const handleEditTitle = async () => {
    if (!editingSession || !newTitle.trim()) return;

    try {
      const { error } = await ChatService.updateSessionTitle(editingSession.id, newTitle.trim());
      
      if (error) {
        console.error('Error updating title:', error);
        return;
      }

      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === editingSession.id ? { ...s, title: newTitle.trim() } : s
      ));
      
      if (currentSession?.id === editingSession.id) {
        setCurrentSession(prev => prev ? { ...prev, title: newTitle.trim() } : null);
      }

      setEditDialogOpen(false);
      setEditingSession(null);
      setNewTitle('');
    } catch (err) {
      console.error('Error updating title:', err);
    }
  };

  // Handle session deletion
  const handleDeleteSession = async (session: ChatSession) => {
    try {
      const { error } = await ChatService.deleteSession(session.id);
      
      if (error) {
        console.error('Error deleting session:', error);
        return;
      }

      // Update local state
      setSessions(prev => prev.filter(s => s.id !== session.id));
      
      // If deleted session was current, start new chat
      if (currentSession?.id === session.id) {
        setCurrentSession(null);
        setSessionId('');
        setMessages(initialQuestions());
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping || !user) return;

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
      let currentSessionId = sessionId;

      // If no session exists yet, create one first
      if (!currentSessionId) {
        const sessionNumber = sessions.length + 1;
        const title = `채팅 ${sessionNumber}`;
        
        // Create new session in Supabase
        const { data: session, error } = await ChatService.createSession({
          title,
          userId: user.id,
        });

        if (error) {
          console.error('Error creating session:', error);
          throw new Error('세션을 생성할 수 없습니다.');
        }

        if (session) {
          setSessionId(session.id);
          setCurrentSession(session);
          currentSessionId = session.id;
          
          // Start backend conversation
          await apiService.startConversation();
          
          // Refresh sessions list
          await loadSessions();
        }
      }

      // Send to backend for AI response
      const response = await apiService.sendMessage(inputText, currentSessionId);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        riskLevel: response.riskLevel,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save messages to Supabase if we have a session
      if (currentSessionId) {
        await ChatService.saveMessage({
          sessionId: currentSessionId,
          content: inputText,
          sender: 'user',
        });

        await ChatService.saveMessage({
          sessionId: currentSessionId,
          content: response.response,
          sender: 'ai',
          riskLevel: response.riskLevel,
        });
      }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '오늘';
    } else if (diffDays === 2) {
      return '어제';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              채팅 기록
            </Typography>
            <IconButton onClick={() => setSidebarOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={startNewChat}
            disabled={isTyping}
            sx={{ mb: 2 }}
          >
            새 채팅
          </Button>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {sessions.map((session) => (
                <ListItem
                  key={session.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: currentSession?.id === session.id ? '#3B82F6' : 'transparent',
                    '&:hover': {
                      backgroundColor: currentSession?.id === session.id ? '#1D4ED8' : '#EFF6FF',
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSessionSelect(session)}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body1" 
                            fontWeight={500}
                            sx={{
                              color: currentSession?.id === session.id ? 'white' : 'text.primary'
                            }}
                          >
                            {session.title}
                          </Typography>
                          {currentSession?.id === session.id && (
                            <Chip
                              label="현재"
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                color: 'white',
                                borderColor: 'white',
                                '& .MuiChip-label': {
                                  color: 'white'
                                }
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="caption" 
                          sx={{
                            color: currentSession?.id === session.id ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                          }}
                        >
                          {formatDate(session.created_at)}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSession(session);
                          setNewTitle(session.title);
                          setEditDialogOpen(true);
                        }}
                        sx={{ 
                          color: currentSession?.id === session.id ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                          '&:hover': {
                            color: currentSession?.id === session.id ? 'white' : 'primary.main'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session);
                        }}
                        sx={{ 
                          color: currentSession?.id === session.id ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                          '&:hover': { 
                            color: currentSession?.id === session.id ? 'white' : 'error.main' 
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {sessions.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                아직 채팅 기록이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                새로운 상담을 시작해보세요
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="md" sx={{ py: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={() => setSidebarOpen(true)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      AI 상담사
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentSession ? currentSession.title : '새로운 상담'}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  onClick={startNewChat}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={isTyping}
                >
                  새 채팅
                </Button>
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
                            bgcolor: message.sender === 'user' ? (userProfile?.avatar_color || 'secondary.main') : 'primary.main',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            flexShrink: 0, // Prevent squishing
                            minWidth: 32, // Ensure minimum width
                            minHeight: 32, // Ensure minimum height
                          }}
                        >
                          {message.sender === 'user' ? (userProfile?.name?.charAt(0).toUpperCase() || 'U') : 'AI'}
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
                        <Box sx={{ bgcolor: 'primary.main', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, minWidth: 32, minHeight: 32 }}>
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
      </Box>

      {/* Edit Title Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>채팅 제목 수정</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="제목"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
          <Button onClick={handleEditTitle} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat; 