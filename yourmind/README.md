# 유어마인드 (YourMind)

AI와 함께하는 따뜻한 마음 상담 서비스

## 🧠 프로젝트 소개

유어마인드는 정신과를 가기 꺼려하거나 어려워하는 사람들을 위한 AI 기반 고민상담 웹 애플리케이션입니다. ChatGPT의 장점을 극대화하고 전문성과 감성적인 위로를 더한 진정한 정서적 동반자이자 상담자로서의 AI 서비스를 제공합니다.

## 🎯 타겟 사용자

- 정신과를 가기 꺼려하거나 어려워하는 사람들
- 정신과를 가야하나 말아야하나 고민중인 사람들
- 남들에게 고민을 말하기 꺼려하는 사람들
- 효율적이고 효과적인 상담을 원하는 사람들
- 학생, 초년사회생, 직장인
- 갱년기 여성, 수험생 등

## ✨ 주요 기능

### 1. AI 상담
- 24시간 언제든지 AI와 대화하며 고민을 털어놓을 수 있습니다
- 전문적인 상담과 따뜻한 위로를 제공합니다
- 대화 내용을 바탕으로 정신 건강 상태를 분석합니다

### 2. 전문가 추천
- AI 상담 결과를 바탕으로 최적의 정신과 의사나 상담사를 추천합니다
- 지역별, 전문분야별 검색 및 필터링 기능
- 상세한 정보와 후기, 비용 정보 제공

### 3. 개인 프로필 관리
- 상담 기록 및 정신 건강 상태 추적
- 스트레스, 불안, 우울 수준 시각화
- 개인정보 관리 및 수정

### 4. 상담 요약 및 공유
- AI와의 대화를 요약하여 전문가에게 전송
- 상담사와의 연계를 위한 정보 제공
- 개인정보 보호 및 암호화

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material Icons
- **Font**: Pretendard (한글 최적화 폰트)

## 🚀 시작하기

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 8.0.0 이상

### 설치 및 실행

1. 저장소 클론
```bash
git clone [repository-url]
cd yourmind
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm start
```

4. 브라우저에서 확인
```
http://localhost:3000
```

### 빌드

프로덕션용 빌드:
```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── Header.tsx      # 네비게이션 헤더
├── pages/              # 페이지 컴포넌트
│   ├── Home.tsx        # 메인 랜딩 페이지
│   ├── Chat.tsx        # AI 상담 페이지
│   ├── Profile.tsx     # 사용자 프로필 페이지
│   └── Recommendations.tsx # 전문가 추천 페이지
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── App.tsx             # 메인 앱 컴포넌트
└── index.tsx           # 앱 진입점
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #6B73FF (차분한 파란색)
- **Secondary**: #FF6B9D (따뜻한 핑크색)
- **Background**: #F8F9FF (연한 파란색 배경)
- **Text**: #2C3E50 (진한 회색)

### 타이포그래피
- **Font Family**: Pretendard (한글 최적화)
- **Weights**: 300, 400, 500, 600, 700

### 컴포넌트 스타일
- **Border Radius**: 16px (카드), 12px (버튼)
- **Shadows**: 0 4px 20px rgba(0, 0, 0, 0.08)
- **Spacing**: 8px 단위 시스템

## 🔒 개인정보 보호

- 모든 대화 내용은 암호화되어 안전하게 보관됩니다
- 사용자 동의 없이 제3자에게 정보를 제공하지 않습니다
- 상담 요약 정보는 전문가 연계 목적으로만 사용됩니다

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**유어마인드** - AI와 함께하는 따뜻한 마음 상담 🧠💙
