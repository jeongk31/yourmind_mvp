import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import { Search as SearchIcon, LocationOn as LocationIcon, Phone as PhoneIcon, Email as EmailIcon } from '@mui/icons-material';

interface Professional {
  id: string;
  name: string;
  type: 'psychiatrist' | 'counselor';
  specialty: string[];
  location: string;
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  price: string;
  availability: string;
  description: string;
  image?: string;
}

const Recommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const theme = useTheme();

  const professionals: Professional[] = [
    {
      id: '1',
      name: '김정신의원',
      type: 'psychiatrist',
      specialty: ['우울증', '불안장애', '수면장애'],
      location: '서울시 강남구 역삼동',
      phone: '02-1234-5678',
      website: 'www.kimpsychiatry.com',
      rating: 4.8,
      reviewCount: 127,
      price: '초진 50,000원 / 재진 30,000원',
      availability: '평일 09:00-18:00, 토요일 09:00-13:00',
      description: '20년 경력의 정신건강의학과 전문의. 우울증, 불안장애, 수면장애 등 다양한 정신건강 문제를 전문적으로 진료합니다.',
    },
    {
      id: '2',
      name: '이상담심리상담소',
      type: 'counselor',
      specialty: ['가족상담', '부부상담', '청소년상담'],
      location: '서울시 서초구 서초동',
      phone: '02-2345-6789',
      website: 'www.leecounseling.com',
      rating: 4.9,
      reviewCount: 89,
      price: '50분 80,000원',
      availability: '평일 10:00-19:00, 토요일 10:00-17:00',
      description: '가족상담 전문가로서 15년간 다양한 가족 문제를 해결해왔습니다. 따뜻하고 전문적인 상담을 제공합니다.',
    },
    {
      id: '3',
      name: '박마음정신과',
      type: 'psychiatrist',
      specialty: ['ADHD', '자폐스펙트럼', '학습장애'],
      location: '서울시 마포구 합정동',
      phone: '02-3456-7890',
      website: 'www.parkmind.com',
      rating: 4.7,
      reviewCount: 156,
      price: '초진 60,000원 / 재진 35,000원',
      availability: '평일 08:30-17:30',
      description: '아동청소년 정신건강 전문의. ADHD, 자폐스펙트럼, 학습장애 등 발달장애 진단과 치료를 전문으로 합니다.',
    },
    {
      id: '4',
      name: '최심리상담센터',
      type: 'counselor',
      specialty: ['트라우마', 'PTSD', '스트레스관리'],
      location: '서울시 종로구 종로동',
      phone: '02-4567-8901',
      website: 'www.choipsychology.com',
      rating: 4.6,
      reviewCount: 73,
      price: '60분 100,000원',
      availability: '평일 09:00-18:00, 토요일 09:00-15:00',
      description: '트라우마 전문 상담사. EMDR, 인지행동치료 등 다양한 치료 기법을 활용하여 효과적인 상담을 제공합니다.',
    },
    {
      id: '5',
      name: '정우울정신과',
      type: 'psychiatrist',
      specialty: ['우울증', '양극성장애', '조현병'],
      location: '서울시 송파구 문정동',
      phone: '02-5678-9012',
      website: 'www.jungdepression.com',
      rating: 4.5,
      reviewCount: 203,
      price: '초진 55,000원 / 재진 32,000원',
      availability: '평일 09:00-18:00, 토요일 09:00-14:00',
      description: '정신의학 전문의로서 우울증, 양극성장애, 조현병 등 심각한 정신질환의 진단과 치료를 전문으로 합니다.',
    },
    {
      id: '6',
      name: '한마음심리상담',
      type: 'counselor',
      specialty: ['직장상담', '커리어상담', '스트레스관리'],
      location: '서울시 영등포구 여의도동',
      phone: '02-6789-0123',
      website: 'www.hanmind.com',
      rating: 4.8,
      reviewCount: 95,
      price: '50분 90,000원',
      availability: '평일 10:00-19:00, 토요일 10:00-16:00',
      description: '직장인 전문 상담사. 업무 스트레스, 인간관계, 커리어 고민 등 직장 관련 문제를 전문적으로 상담합니다.',
    },
  ];

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.specialty.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !locationFilter || prof.location.includes(locationFilter);
    const matchesType = activeTab === 0 ? prof.type === 'psychiatrist' : prof.type === 'counselor';
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
          전문가 추천
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          AI 상담 결과를 바탕으로 최적의 전문가를 추천해드립니다
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              placeholder="전문가명 또는 전문분야로 검색"
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
            <TextField
              placeholder="지역 검색"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: { xs: '100%', md: 200 } }}
            />
          </Box>
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
        {filteredProfessionals.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                검색 결과가 없습니다.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                다른 검색어를 시도해보세요.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredProfessionals.map((prof, index) => (
            <Card key={prof.id}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  {/* Avatar and Basic Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: prof.type === 'psychiatrist' ? 'primary.main' : 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        borderRadius: '50%',
                      }}
                    >
                      {prof.type === 'psychiatrist' ? <EmailIcon /> : <EmailIcon />}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        {prof.name}
                      </Typography>
                      <Chip
                        label={prof.type === 'psychiatrist' ? '정신과 의사' : '심리상담사'}
                        color={prof.type === 'psychiatrist' ? 'primary' : 'secondary'}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={prof.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary">
                          ({prof.reviewCount})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Details */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {prof.specialty.map((spec, idx) => (
                        <Chip key={idx} label={spec} variant="outlined" size="small" />
                      ))}
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {prof.description}
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">{prof.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">{prof.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">{prof.availability}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">{prof.price}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
                    <Button variant="contained" fullWidth>
                      예약하기
                    </Button>
                    {prof.website && (
                      <Button
                        variant="outlined"
                        startIcon={<EmailIcon />}
                        fullWidth
                        onClick={() => window.open(`https://${prof.website}`, '_blank')}
                      >
                        웹사이트
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Recommendations; 