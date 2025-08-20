import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AvatarColorPicker from './AvatarColorPicker';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [avatarColor, setAvatarColor] = useState('#3B82F6');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Auto-detect location using browser geolocation
  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        setError('브라우저가 위치 정보를 지원하지 않습니다.');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use Naver Maps API to get address from coordinates
      const address = await getAddressFromCoords(latitude, longitude);
      if (address) {
        setLocation(address);
      }
    } catch (err) {
      console.error('Location detection failed:', err);
      setError('위치를 자동으로 감지할 수 없습니다. 수동으로 입력해주세요.');
    } finally {
      setLocationLoading(false);
    }
  };

  // Get address from coordinates using backend API
  const getAddressFromCoords = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(`https://yourmind-mvp.onrender.com/api/location/address?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error('Failed to get address');
      }

      const data = await response.json();
      return data.address || null;
    } catch (err) {
      console.error('Error getting address:', err);
      return null;
    }
  };

  // Search locations using backend API
  const searchLocations = async (query: string) => {
    if (!query || query.length < 2) {
      setLocationOptions([]);
      return;
    }

    try {
      const response = await fetch(`https://yourmind-mvp.onrender.com/api/location/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data = await response.json();
      if (data.addresses && data.addresses.length > 0) {
        const options = data.addresses.map((addr: any) => addr.displayAddress);
        setLocationOptions(options);
      } else {
        setLocationOptions([]);
      }
    } catch (err) {
      console.error('Error searching locations:', err);
      setLocationOptions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword || !name.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (name.trim().length < 2) {
      setError('이름은 최소 2자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp(name.trim(), email, password, avatarColor, phone.trim(), location.trim());
      
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 450,
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              유어마인드
            </Typography>
            <Typography variant="h6" color="text.secondary">
              회원가입
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              placeholder="홍길동"
            />

            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              placeholder="example@email.com"
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              placeholder="비밀번호"
            />

            <TextField
              fullWidth
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              placeholder="비밀번호 확인"
            />

            <TextField
              fullWidth
              label="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              disabled={loading}
              placeholder="010-1234-5678"
            />

            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                위치
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={locationOptions}
                  value={location}
                  onChange={(_, newValue) => setLocation(newValue || '')}
                  onInputChange={(_, newInputValue) => {
                    setLocation(newInputValue);
                    searchLocations(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="위치를 검색하거나 자동 감지하세요"
                      disabled={loading}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <LocationOnIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      {option}
                    </Box>
                  )}
                />
                <IconButton
                  onClick={detectLocation}
                  disabled={locationLoading || loading}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {locationLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <MyLocationIcon />
                  )}
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                위치 버튼을 클릭하여 현재 위치를 자동으로 감지하거나, 검색창에 주소를 입력하세요
              </Typography>
            </Box>

            <Box sx={{ mt: 3, mb: 3 }}>
              <AvatarColorPicker
                selectedColor={avatarColor}
                onColorSelect={setAvatarColor}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
              }}
            >
              {loading ? <CircularProgress size={24} /> : '회원가입'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                이미 계정이 있으신가요?{' '}
                <Link
                  href="/signin"
                  sx={{
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  로그인하기
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default SignUp;
