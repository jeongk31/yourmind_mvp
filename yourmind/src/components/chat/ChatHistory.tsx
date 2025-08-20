import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Chat as ChatIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { ChatService } from '../../services/chatService';
import { ChatSession } from '../../lib/supabase';

interface ChatHistoryProps {
  onSessionSelect: (sessionId: string) => void;
  currentSessionId?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSessionSelect, currentSessionId }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await ChatService.getSessions(user.id);
      
      if (error) {
        setError('채팅 기록을 불러올 수 없습니다.');
        console.error('Error loading sessions:', error);
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      setError('채팅 기록을 불러올 수 없습니다.');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (sessionId: string) => {
    onSessionSelect(sessionId);
  };

  const handleDeleteClick = (session: ChatSession, event: React.MouseEvent) => {
    event.stopPropagation();
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;

    try {
      const { error } = await ChatService.deleteSession(sessionToDelete.id);
      
      if (error) {
        setError('세션을 삭제할 수 없습니다.');
        console.error('Error deleting session:', error);
      } else {
        setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
        if (currentSessionId === sessionToDelete.id) {
          onSessionSelect(''); // Clear current session
        }
      }
    } catch (err) {
      setError('세션을 삭제할 수 없습니다.');
      console.error('Error deleting session:', err);
    } finally {
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          채팅 기록
        </Typography>
        <Typography variant="body2" color="text.secondary">
          이전 상담 기록을 확인하세요
        </Typography>
      </Box>

      {sessions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            아직 채팅 기록이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            새로운 상담을 시작해보세요
          </Typography>
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          <AnimatePresence>
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  disablePadding
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: currentSessionId === session.id ? 'primary.light' : 'transparent',
                    '&:hover': {
                      backgroundColor: currentSessionId === session.id ? 'primary.light' : 'action.hover',
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSessionClick(session.id)}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight={500}>
                            {session.title || '새로운 상담'}
                          </Typography>
                          {currentSessionId === session.id && (
                            <Chip
                              label="현재"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(session.created_at)}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton
                      onClick={(e) => handleDeleteClick(session, e)}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'error.main',
                          backgroundColor: 'error.light',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>채팅 기록 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            "{sessionToDelete?.title || '새로운 상담'}" 세션을 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatHistory;
