import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Rating,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  LocationOn as LocationIcon, 
  Phone as PhoneIcon, 
  Email as EmailIcon,
  MyLocation as MyLocationIcon,
  Map as MapIcon,
  Close as CloseIcon,
  Directions as DirectionsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../utils/api';

interface Facility {
  id: string;
  name: string;
  type: 'psychiatrist' | 'counselor';
  address: string;
  roadAddress: string;
  phone: string;
  category: string;
  distance: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface SearchLocation {
  lat: number;
  lng: number;
}

const Recommendations: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState<SearchLocation | null>(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Auto-detect current location on component mount
  useEffect(() => {
    detectCurrentLocation();
  }, []);

  // Detect current location using browser geolocation
  const detectCurrentLocation = async () => {
    setLoading(true);
    setError('');
    
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
      const location = { lat: latitude, lng: longitude };
      
      setCurrentLocation(location);
      
      // Get address from coordinates
      const addressResponse = await apiService.getAddressFromCoords(latitude, longitude);
      if (addressResponse.address) {
        setLocationAddress(addressResponse.address);
      }
      
      // Search for nearby facilities
      await searchNearbyFacilities(latitude, longitude);
      
    } catch (err) {
      console.error('Location detection failed:', err);
      setError('위치를 자동으로 감지할 수 없습니다. 수동으로 검색해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Search nearby facilities using backend API
  const searchNearbyFacilities = async (lat: number, lng: number) => {
    try {
      const response = await apiService.searchNearbyFacilities(lat, lng, 5000);
      setFacilities(response.facilities || []);
    } catch (err) {
      console.error('Error searching facilities:', err);
      setError('주변 시설을 검색할 수 없습니다.');
    }
  };

  // Filter facilities based on search term and active tab
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = !searchTerm || 
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTab === 0 ? facility.type === 'psychiatrist' : facility.type === 'counselor';
    
    return matchesSearch && matchesType;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setShowMap(true);
  };

  const handleDirections = (facility: Facility) => {
    const { lat, lng } = facility.coordinates;
    const url = `https://map.naver.com/v5/directions/${lng},${lat}`;
    window.open(url, '_blank');
  };

  const formatDistance = (distance: string) => {
    const meters = parseFloat(distance);
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
          주변 전문가 찾기
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          현재 위치 기반으로 가까운 정신건강 전문가를 찾아보세요
        </Typography>
      </Box>

      {/* Location and Search */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: '100%', md: 300 } }}>
              <LocationIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                {locationAddress || '위치를 감지하는 중...'}
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={16} /> : <MyLocationIcon />}
              onClick={detectCurrentLocation}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? '감지 중...' : '위치 새로고침'}
            </Button>

            <TextField
              fullWidth
              placeholder="시설명 또는 주소로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab 
            label="정신과 의사" 
            icon={<EmailIcon />} 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            label="심리상담사" 
            icon={<EmailIcon />} 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
        </Tabs>
      </Box>

      {/* Results */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {loading ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                주변 시설을 검색하고 있습니다...
              </Typography>
            </CardContent>
          </Card>
        ) : filteredFacilities.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                {searchTerm ? '검색 결과가 없습니다.' : '주변에 전문가가 없습니다.'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? '다른 검색어를 시도해보세요.' : '검색 반경을 늘리거나 다른 지역을 확인해보세요.'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredFacilities.map((facility, index) => (
            <Card key={facility.id} sx={{ cursor: 'pointer' }} onClick={() => handleFacilityClick(facility)}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  {/* Avatar and Basic Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: facility.type === 'psychiatrist' ? 'primary.main' : 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        borderRadius: '50%',
                        color: 'white',
                      }}
                    >
                      {facility.type === 'psychiatrist' ? <EmailIcon /> : <EmailIcon />}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        {facility.name}
                      </Typography>
                      <Chip
                        label={facility.type === 'psychiatrist' ? '정신과 의사' : '심리상담사'}
                        color={facility.type === 'psychiatrist' ? 'primary' : 'secondary'}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="primary" fontWeight={600}>
                        {formatDistance(facility.distance)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Details */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">{facility.roadAddress || facility.address}</Typography>
                      </Box>
                      {facility.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography variant="body2">{facility.phone}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      startIcon={<MapIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFacilityClick(facility);
                      }}
                    >
                      지도 보기
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DirectionsIcon />}
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirections(facility);
                      }}
                    >
                      길찾기
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Map Dialog */}
      <Dialog 
        open={showMap} 
        onClose={() => setShowMap(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedFacility?.name}
            </Typography>
            <IconButton onClick={() => setShowMap(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedFacility && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedFacility.roadAddress || selectedFacility.address}
              </Typography>
              {selectedFacility.phone && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  전화: {selectedFacility.phone}
                </Typography>
              )}
              <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                거리: {formatDistance(selectedFacility.distance)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                지도 기능은 네이버 지도에서 확인하실 수 있습니다.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMap(false)}>닫기</Button>
          {selectedFacility && (
            <Button 
              variant="contained" 
              startIcon={<DirectionsIcon />}
              onClick={() => {
                handleDirections(selectedFacility);
                setShowMap(false);
              }}
            >
              길찾기
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recommendations; 