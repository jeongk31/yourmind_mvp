import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Psychology as PsychologyIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/userService';
import { ChatService } from '../services/chatService';
import AvatarColorPicker from '../components/auth/AvatarColorPicker';
import LocationMap from '../components/LocationMap';

interface SessionRecord {
  id: string;
  date: Date;
  title: string;
  summary?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAvatarColor, setEditAvatarColor] = useState('#3B82F6');

  // Load user sessions
  useEffect(() => {
    const loadUserSessions = async () => {
      if (!user) return;
      
      try {
        const { data: userSessions } = await ChatService.getSessions(user.id);
        if (userSessions) {
          const formattedSessions = userSessions.map(session => ({
            id: session.id,
            date: new Date(session.created_at),
            title: session.title,
          }));
          setSessions(formattedSessions);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserSessions();
  }, [user]);

  // Initialize edit form
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
      setEditLocation(user.location || '');
      setEditAvatarColor(user.avatar_color);
    }
  }, [user]);

  const handleEditProfile = async () => {
    if (!user) return;

    try {
      // Update user profile with all fields
      const { error } = await UserService.updateProfile(user.id, {
        name: editName,
        phone: editPhone,
        location: editLocation,
        avatarColor: editAvatarColor,
      });

      if (error) {
        console.error('Failed to update profile:', error);
        // You might want to show an error message to the user
      } else {
        // Update local user data
        const updatedUser = {
          ...user,
          name: editName,
          phone: editPhone,
          location: editLocation,
          avatar_color: editAvatarColor,
        };
        localStorage.setItem('yourmind_user', JSON.stringify(updatedUser));
        window.location.reload(); // Refresh to show updated data
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }

    setEditDialogOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLevelColor = (level: number) => {
    if (level < 30) return 'success';
    if (level < 70) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 4 }}>
        {/* Profile Card */}
        <Box>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 3,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  {user?.name || '사용자'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {user?.email}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label="활성 사용자"
                    color="success"
                    variant="outlined"
                    sx={{ fontSize: '1rem', py: 1 }}
                  />
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{user?.email || '이메일 정보 없음'}</Typography>
                  </Box>
                  {user?.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{user.location}</Typography>
                    </Box>
                  )}
                  {user?.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{user.phone}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      가입일: {user?.created_at ? formatDate(new Date(user.created_at)) : '날짜 정보 없음'}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  프로필 수정
                </Button>
              </CardContent>
            </Card>
            
            {/* Location Map */}
            {user?.location && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Box sx={{ mt: 3 }}>
                  <LocationMap location={user.location} />
                </Box>
              </motion.div>
            )}
          </motion.div>
        </Box>

        {/* Right Column */}
        <Box>
          {/* Mental Health Assessment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" fontWeight={600}>
                    정신 건강 상태
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      스트레스 수준
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={user?.stress_level || 0}
                      color={getLevelColor(user?.stress_level || 0) as any}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {user?.stress_level || 0}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      불안 수준
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={user?.anxiety_level || 0}
                      color={getLevelColor(user?.anxiety_level || 0) as any}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {user?.anxiety_level || 0}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      우울 수준
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={user?.depression_level || 0}
                      color={getLevelColor(user?.depression_level || 0) as any}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {user?.depression_level || 0}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Session History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" fontWeight={600}>
                    상담 기록 ({sessions.length}회)
                  </Typography>
                </Box>

                {loading ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1">로딩 중...</Typography>
                  </Box>
                ) : sessions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1">상담 기록이 없습니다.</Typography>
                  </Box>
                ) : (
                  <List>
                    {sessions.map((session, index) => (
                      <React.Fragment key={session.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <PsychologyIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {formatDate(session.date)}
                                </Typography>
                                <Chip
                                  label={session.title}
                                  color="primary"
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {session.summary || '상담 내용 없음'}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < sessions.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">프로필 수정</Typography>
            <IconButton onClick={() => setEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="이름"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <TextField
              fullWidth
              label="전화번호"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
            <TextField
              fullWidth
              label="위치"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
            />
            <AvatarColorPicker
              selectedColor={editAvatarColor}
              onColorSelect={(color) => setEditAvatarColor(color)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
          <Button onClick={handleEditProfile} variant="contained">저장</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 