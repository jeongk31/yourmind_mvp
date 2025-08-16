# YourMind Backend API

AI 상담 서비스 "유어마인드"의 백엔드 API 서버입니다. GPT-4를 활용한 심리 상담 기능을 제공합니다.

## 🚀 주요 기능

- **GPT-4 기반 AI 상담**: OpenAI의 GPT-4 모델을 활용한 전문적인 심리 상담
- **대화 기록 관리**: 세션별 대화 기록 저장 및 관리
- **위험도 분석**: 자해, 자살 등 위험 신호 자동 감지
- **RESTful API**: 표준 HTTP API 엔드포인트 제공

## 🛠 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Model**: OpenAI GPT-4
- **Security**: Helmet, CORS
- **Logging**: Morgan

## 📋 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
```

`.env` 파일을 편집하여 다음 변수들을 설정하세요:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## 📡 API 엔드포인트

### 1. 상담 시작
```http
POST /api/chat/start
```

**응답:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123",
  "message": "새로운 상담이 시작되었습니다. 어떤 고민이 있으신가요?",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. 메시지 전송
```http
POST /api/chat/send
Content-Type: application/json

{
  "message": "요즘 너무 스트레스가 많아요",
  "sessionId": "session_1234567890_abc123"
}
```

**응답:**
```json
{
  "success": true,
  "response": "스트레스를 많이 받고 계시는군요. 어떤 일들이 가장 힘드신지 말씀해 주세요.",
  "sessionId": "session_1234567890_abc123",
  "riskLevel": {
    "level": "low",
    "message": "일반적인 상담 상황입니다.",
    "requiresImmediateAttention": false
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. 대화 기록 조회
```http
GET /api/chat/history/:sessionId
```

**응답:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123",
  "messages": [
    {
      "role": "user",
      "content": "요즘 너무 스트레스가 많아요",
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    {
      "role": "assistant",
      "content": "스트레스를 많이 받고 계시는군요...",
      "timestamp": "2024-01-15T10:30:05.000Z"
    }
  ],
  "messageCount": 2
}
```

### 4. 대화 기록 삭제
```http
DELETE /api/chat/clear/:sessionId
```

**응답:**
```json
{
  "success": true,
  "message": "Conversation history cleared"
}
```

### 5. 서버 상태 확인
```http
GET /api/health
```

**응답:**
```json
{
  "status": "OK",
  "message": "YourMind Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔒 보안 기능

### 위험도 분석
시스템은 자동으로 다음 위험 신호들을 감지합니다:

**높은 위험도:**
- 자살 관련 표현
- 자해 의도
- 타인에 대한 폭력 의도

**중간 위험도:**
- 우울감 표현
- 절망감
- 고립감

### 응답 예시
```json
{
  "riskLevel": {
    "level": "high",
    "message": "위험 신호가 감지되었습니다. 즉시 전문가 상담을 권유합니다.",
    "requiresImmediateAttention": true
  }
}
```

## 🧠 AI 상담사 특징

- **공감적 응답**: 사용자의 감정을 이해하고 공감하는 응답
- **전문적 조언**: 심리학적 지식을 바탕으로 한 실용적인 조언
- **안전한 경계**: 의학적 진단이나 처방을 하지 않음
- **위험 신호 감지**: 자해, 자살 등 위험 신호 자동 감지 및 전문가 상담 권유

## 🔧 개발 환경

### 환경 변수
- `PORT`: 서버 포트 (기본값: 5000)
- `NODE_ENV`: 실행 환경 (development/production)
- `FRONTEND_URL`: 프론트엔드 URL (CORS 설정용)
- `OPENAI_API_KEY`: OpenAI API 키

### 로그
- Morgan을 사용한 HTTP 요청 로그
- 에러 로그 및 디버그 정보

## 📝 주의사항

1. **API 키 보안**: OpenAI API 키는 절대 공개하지 마세요
2. **프로덕션 환경**: 실제 서비스에서는 데이터베이스 사용을 권장합니다
3. **위험 신호**: 높은 위험도가 감지되면 즉시 전문가 상담을 권유하세요
4. **개인정보**: 민감한 개인정보는 안전하게 처리하세요

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**YourMind Backend** - AI와 함께하는 따뜻한 마음 상담 🧠💙 