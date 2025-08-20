import React, { useState } from 'react';
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
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Psychology as PsychologyIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Recommend as RecommendIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, signOut } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navItems = [
    { label: '홈', path: '/', icon: <PsychologyIcon /> },
    { label: 'AI 상담', path: '/chat', icon: <ChatIcon /> },
    { label: '추천', path: '/recommendations', icon: <RecommendIcon /> },
    { label: '프로필', path: '/profile', icon: <PersonIcon /> },
  ];

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    handleProfileMenuClose();
  };

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
              background: 'linear-gradient(45deg, #2563EB 30%, #10B981 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            유어마인드
          </Typography>
        </Box>

        {/* Navigation - Only show if user is authenticated */}
        {user && !isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? 'white' : 'text.secondary',
                  backgroundColor: location.pathname === item.path ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: location.pathname === item.path ? 'primary.dark' : 'primary.light',
                    color: location.pathname === item.path ? 'white' : 'primary.main',
                  },
                  borderRadius: 2,
                  px: 2,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {user && isMobile && (
          <IconButton
            color="primary"
            aria-label="menu"
            sx={{ ml: 'auto' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Auth Buttons or User Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={handleProfileMenuOpen}
              >
                {user.email?.charAt(0).toUpperCase() || <PersonIcon />}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  프로필
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  설정
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  로그아웃
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/signin')}
                sx={{ color: 'text.secondary' }}
              >
                로그인
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{ borderRadius: 2 }}
              >
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 