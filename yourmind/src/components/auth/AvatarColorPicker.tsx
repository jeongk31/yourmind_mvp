import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface AvatarColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const avatarColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
];

const AvatarColorPicker: React.FC<AvatarColorPickerProps> = ({ selectedColor, onColorSelect }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        아바타 색상을 선택해주세요
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {avatarColors.map((color) => (
          <Tooltip key={color} title={color} arrow>
            <IconButton
              onClick={() => onColorSelect(color)}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: color,
                border: selectedColor === color ? '3px solid #1E293B' : '2px solid transparent',
                '&:hover': {
                  backgroundColor: color,
                  border: '3px solid #1E293B',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {selectedColor === color && (
                <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default AvatarColorPicker;
