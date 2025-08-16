import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Psychology as PsychologyIcon,
  Chat as ChatIcon,
  Recommend as RecommendIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI 상담',
      description: '24시간 언제든지 AI와 대화하며 고민을 털어놓을 수 있습니다.',
      color: 'primary',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: '전문적 분석',
      description: 'AI가 당신의 상태를 분석하여 전문적인 조언을 제공합니다.',
      color: 'secondary',
    },
    {
      icon: <RecommendIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: '맞춤 추천',
      description: '상황에 맞는 정신과나 상담사를 추천해드립니다.',
      color: 'success',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: '완전한 비밀',
      description: '모든 대화는 암호화되어 안전하게 보관됩니다.',
      color: 'info',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: '즉시 상담',
      description: '대기 시간 없이 바로 상담을 시작할 수 있습니다.',
      color: 'warning',
    },
    {
      icon: <EmojiIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: '따뜻한 위로',
      description: '인간적인 감성으로 따뜻한 위로와 공감을 제공합니다.',
      color: 'error',
    },
  ];

  const targetUsers = [
    '정신과를 가기 꺼려하는 분들',
    '정신과를 가야하나 말아야하나 고민중인 분들',
    '남들에게 고민을 말하기 꺼려하는 분들',
    '효율적이고 효과적인 상담을 원하는 분들',
    '학생, 초년사회생, 직장인',
    '갱년기 여성, 수험생',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            color: 'white',
            mb: 6,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3,
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h1" sx={{ mb: 2, fontWeight: 700 }}>
              유어마인드
            </Typography>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 300 }}>
              AI와 함께하는 따뜻한 마음 상담
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              언제든지, 어디서든 편안하게 고민을 나누세요
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/chat')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              상담 시작하기
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}>
          서비스 특징
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4, mb: 8 }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </motion.div>

      {/* Target Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
            이런 분들에게 추천합니다
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {targetUsers.map((user, index) => (
              <Chip
                key={index}
                label={user}
                variant="outlined"
                sx={{
                  fontSize: '1rem',
                  py: 1,
                  px: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Card
          sx={{
            background: 'linear-gradient(45deg, #FF6B9D 30%, #6B73FF 90%)',
            color: 'white',
            textAlign: 'center',
            py: 6,
          }}
        >
          <CardContent>
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
              지금 바로 시작해보세요
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              AI와의 대화를 통해 마음의 평화를 찾아보세요
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/chat')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              무료 상담 시작하기
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Home; 