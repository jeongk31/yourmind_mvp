import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Psychology as PsychologyIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Recommend as RecommendIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { label: '홈', path: '/', icon: <PsychologyIcon /> },
    { label: 'AI 상담', path: '/chat', icon: <ChatIcon /> },
    { label: '추천', path: '/recommendations', icon: <RecommendIcon /> },
    { label: '프로필', path: '/profile', icon: <PersonIcon /> },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate('/')}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            <PsychologyIcon />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #6B73FF 30%, #FF6B9D 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            유어마인드
          </Typography>
        </Box>

        {/* Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.main',
                  },
                  borderRadius: 2,
                  px: 2,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="primary"
            aria-label="menu"
            sx={{ ml: 'auto' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* User Avatar */}
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            width: 36,
            height: 36,
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate('/profile')}
        >
          <PersonIcon />
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 