import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

interface LocationMapProps {
  location?: string;
  className?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ location = "서울특별시 강남구", className }) => {
  // Dummy coordinates for Seoul, Gangnam
  const dummyLat = 37.5665;
  const dummyLng = 126.9780;

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        backgroundColor: '#f8f9fa',
        border: '1px solid #e0e0e0'
      }}
      className={className}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight={600}>
          위치 정보
        </Typography>
      </Box>
      
      {/* Map Placeholder */}
      <Box
        sx={{
          width: '100%',
          height: 200,
          backgroundColor: '#e3f2fd',
          borderRadius: 1,
          border: '2px dashed #2196f3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Map-like background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(45deg, #e3f2fd 25%, transparent 25%),
              linear-gradient(-45deg, #e3f2fd 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #e3f2fd 75%),
              linear-gradient(-45deg, transparent 75%, #e3f2fd 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />
        
        {/* Location marker */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2
          }}
        >
          <LocationIcon 
            sx={{ 
              fontSize: 40, 
              color: 'error.main',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} 
          />
        </Box>
        
        {/* Coordinates text */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '4px 8px',
            borderRadius: 1,
            fontSize: '12px',
            color: 'text.secondary',
            zIndex: 2
          }}
        >
          {dummyLat.toFixed(4)}, {dummyLng.toFixed(4)}
        </Box>
      </Box>
      
      {/* Location details */}
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          현재 위치:
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {location}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          📍 서울특별시 강남구 테헤란로 123
        </Typography>
      </Box>
    </Paper>
  );
};

export default LocationMap;
