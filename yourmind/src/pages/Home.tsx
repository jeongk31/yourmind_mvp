import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Psychology as PsychologyIcon,
  Group as GroupIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import LocationMap from '../components/LocationMap';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const chatServices = {
    modes: [
      {
        id: 'friendly',
        name: '친구같은',
        description: '편안하고 친근한 친구처럼 대화하세요.',
        icon: <GroupIcon sx={{ fontSize: 40 }} />,
        color: '#10B981',
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      },
      {
        id: 'teacher',
        name: '선생님같은',
        description: '지혜롭고 가르치는 듯한 조언을 받아보세요.',
        icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
        color: '#3B82F6',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      },
      {
        id: 'f_empathy',
        name: 'F를위한 공감형',
        description: '감정적이고 공감적인 접근으로 상담받으세요.',
        icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
        color: '#EF4444',
        gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      },
      {
        id: 'rational',
        name: '이성적인',
        description: '논리적이고 분석적인 관점에서 조언받으세요.',
        icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
        color: '#8B5CF6',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      },
    ],
    tests: [
      {
        id: 'phq9',
        name: 'PHQ-9 우울증 테스트',
        description: '9개 문항으로 구성된 우울증 선별 도구입니다.',
        timeEstimate: '약 5-10분',
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        color: '#6366F1',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      },
      {
        id: 'gad7',
        name: 'GAD-7 불안장애 테스트',
        description: '7개 문항으로 구성된 불안장애 선별 도구입니다.',
        timeEstimate: '약 3-7분',
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        color: '#EC4899',
        gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      },
      {
        id: 'cssrs',
        name: 'C-SSRS 자살위험 테스트',
        description: '자살 사고와 행동을 평가하는 전문 도구입니다.',
        timeEstimate: '약 5-8분',
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        color: '#DC2626',
        gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      },
    ],
  };

  const handleServiceClick = (serviceId: string) => {
    navigate('/chat', { state: { selectedService: serviceId } });
  };

  const features = [
    {
      icon: '💬',
      title: 'AI 상담',
      description: '24시간 언제든지 AI와 대화하며 고민을 털어놓을 수 있습니다.',
      color: 'primary',
    },
    {
      icon: '🧠',
      title: '전문적 분석',
      description: 'AI가 당신의 상태를 분석하여 전문적인 조언을 제공합니다.',
      color: 'secondary',
    },
    {
      icon: '⭐',
      title: '맞춤 추천',
      description: '상황에 맞는 정신과나 상담사를 추천해드립니다.',
      color: 'success',
    },
    {
      icon: '🔒',
      title: '완전한 비밀',
      description: '모든 대화는 암호화되어 안전하게 보관됩니다.',
      color: 'info',
    },
    {
      icon: '⚡',
      title: '즉시 상담',
      description: '대기 시간 없이 바로 상담을 시작할 수 있습니다.',
      color: 'warning',
    },
    {
      icon: '💙',
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
        initial={{ opacity: 0, y: 30 }}
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
            <Typography 
              variant="h1" 
              sx={{ 
                mb: 2, 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                textShadow: '0 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              유어마인드
            </Typography>
            {user ? (
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 700,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                안녕하세요, <span style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{user.name}님!</span>
              </Typography>
            ) : (
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 300,
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                  opacity: 0.9,
                }}
              >
                AI와 함께하는 따뜻한 심리 상담
              </Typography>
            )}
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3, 
                fontWeight: 300,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                opacity: 0.9,
              }}
            >
              AI와 함께하는 따뜻한 심리 상담
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              언제든지, 어디서든 편안하게 고민을 나누세요
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/chat"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                border: '2px solid white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              기본 상담 시작하기
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Chat Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}>
          상담 서비스
        </Typography>
        
        {/* AI Modes - Horizontal Cards */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 600, color: 'secondary.main' }}>
            AI 모드
          </Typography>
          <Grid container spacing={2}>
            {chatServices.modes.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={service.id}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      background: service.gradient,
                      color: 'white',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px) rotate(1deg)',
                        transition: 'all 0.3s ease-in-out',
                      },
                    }}
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                      }}
                    />
                    <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ mr: 2, opacity: 0.9 }}>
                          {service.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {service.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                        {service.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'white',
                            color: service.color,
                          },
                        }}
                      >
                        선택하기
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tests - Vertical Cards with Icons */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 600, color: 'error.main' }}>
            심리 테스트
          </Typography>
          <Grid container spacing={3}>
            {chatServices.tests.map((service, index) => (
              <Grid item xs={12} md={4} key={service.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      border: `2px solid ${service.color}`,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 15px 30px rgba(0,0,0,0.1)`,
                        transition: 'all 0.3s ease-in-out',
                      },
                    }}
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <Box
                      sx={{
                        height: 80,
                        background: service.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="20" cy="20" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        }}
                      />
                      <Box sx={{ color: 'white', fontSize: '2rem', position: 'relative', zIndex: 1 }}>
                        {service.icon}
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: service.color }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {service.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', fontWeight: 500 }}>
                        ⏱️ {service.timeEstimate}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        sx={{
                          background: service.gradient,
                          color: 'white',
                          '&:hover': {
                            background: service.color,
                          },
                        }}
                      >
                        테스트 시작
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
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
              <Box
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: 3,
                  },
                }}
              >
                <Box sx={{ mb: 2, fontSize: '3rem' }}>{feature.icon}</Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </motion.div>

      {/* Location Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}>
            서비스 위치
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <LocationMap location="서울특별시 강남구" />
          </Box>
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
        <Box
          sx={{
            background: 'linear-gradient(45deg, #FF6B9D 30%, #6B73FF 90%)',
            color: 'white',
            textAlign: 'center',
            py: 6,
            borderRadius: 2,
          }}
        >
          <Box sx={{ px: 3 }}>
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
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Home; 