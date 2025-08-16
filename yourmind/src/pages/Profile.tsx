import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Edit as EditIcon,
  Psychology as PsychologyIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface UserProfile {
  name: string;
  age: number;
  gender: string;
  location: string;
  phone: string;
  email: string;
  joinDate: Date;
  totalSessions: number;
  currentMood: string;
  stressLevel: number;
  anxietyLevel: number;
  depressionLevel: number;
}

interface SessionRecord {
  id: string;
  date: Date;
  duration: number;
  summary: string;
  mood: string;
  recommendations: string[];
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '김상담',
    age: 28,
    gender: '여성',
    location: '서울시 강남구',
    phone: '010-1234-5678',
    email: 'counseling@example.com',
    joinDate: new Date('2024-01-15'),
    totalSessions: 12,
    currentMood: '보통',
    stressLevel: 65,
    anxietyLevel: 45,
    depressionLevel: 30,
  });

  const [sessions] = useState<SessionRecord[]>([
    {
      id: '1',
      date: new Date('2024-03-15'),
      duration: 45,
      summary: '직장 스트레스와 인간관계에 대한 상담을 진행했습니다.',
      mood: '스트레스',
      recommendations: ['호흡 운동', '시간 관리', '경계 설정'],
    },
    {
      id: '2',
      date: new Date('2024-03-10'),
      duration: 30,
      summary: '수면 문제와 불안감에 대한 상담을 진행했습니다.',
      mood: '불안',
      recommendations: ['수면 위생', '명상', '규칙적인 운동'],
    },
    {
      id: '3',
      date: new Date('2024-03-05'),
      duration: 60,
      summary: '가족 관계와 소통 문제에 대한 상담을 진행했습니다.',
      mood: '우울',
      recommendations: ['감정 표현 연습', '가족 상담', '자기 돌봄'],
    },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);

  const handleEditSave = () => {
    setProfile(editProfile);
    setEditDialogOpen(false);
  };

  const handleEditCancel = () => {
    setEditProfile(profile);
    setEditDialogOpen(false);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case '스트레스': return 'warning';
      case '불안': return 'error';
      case '우울': return 'info';
      case '보통': return 'success';
      default: return 'default';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 70) return 'error';
    if (level >= 50) return 'warning';
    return 'success';
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
                  {profile.name.charAt(0)}
                </Avatar>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  {profile.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {profile.age}세, {profile.gender}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={`현재 기분: ${profile.currentMood}`}
                    color={getMoodColor(profile.currentMood) as any}
                    variant="outlined"
                    sx={{ fontSize: '1rem', py: 1 }}
                  />
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  프로필 수정
                </Button>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{profile.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{profile.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{profile.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      가입일: {profile.joinDate.toLocaleDateString('ko-KR')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
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
                      value={profile.stressLevel}
                      color={getLevelColor(profile.stressLevel) as any}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {profile.stressLevel}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      불안 수준
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={profile.anxietyLevel}
                      color={getLevelColor(profile.anxietyLevel) as any}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {profile.anxietyLevel}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      우울 수준
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={profile.depressionLevel}
                      color={getLevelColor(profile.depressionLevel) as any}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {profile.depressionLevel}%
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
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" fontWeight={600}>
                    상담 기록 ({profile.totalSessions}회)
                  </Typography>
                </Box>

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
                                {session.date.toLocaleDateString('ko-KR')}
                              </Typography>
                              <Chip
                                label={session.mood}
                                color={getMoodColor(session.mood) as any}
                                size="small"
                              />
                              <Typography variant="body2" color="text.secondary">
                                ({session.duration}분)
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {session.summary}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {session.recommendations.map((rec, idx) => (
                                  <Chip
                                    key={idx}
                                    label={rec}
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                  />
                                ))}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < sessions.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">프로필 수정</Typography>
            <IconButton onClick={handleEditCancel}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="이름"
              value={editProfile.name}
              onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="나이"
              type="number"
              value={editProfile.age}
              onChange={(e) => setEditProfile({ ...editProfile, age: parseInt(e.target.value) })}
            />
            <TextField
              fullWidth
              label="성별"
              value={editProfile.gender}
              onChange={(e) => setEditProfile({ ...editProfile, gender: e.target.value })}
            />
            <TextField
              fullWidth
              label="지역"
              value={editProfile.location}
              onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
            />
            <TextField
              fullWidth
              label="전화번호"
              value={editProfile.phone}
              onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={editProfile.email}
              onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>취소</Button>
          <Button onClick={handleEditSave} variant="contained">저장</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 