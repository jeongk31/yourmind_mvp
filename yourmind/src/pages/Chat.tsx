import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  Card,
  CardContent,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Drawer,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Send as SendIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Summarize as SummarizeIcon,
  Download as DownloadIcon,
  Psychology as PsychologyIcon,
  Favorite as FavoriteIcon,
  Group as GroupIcon,
  Straighten as StraightenIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ChatSession } from '../lib/supabase';
import { apiService } from '../utils/api';
import { ChatService } from '../services/chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  riskLevel?: {
    level: 'low' | 'moderate' | 'high' | 'unknown';
    requiresImmediateAttention: boolean;
    message: string;
  };
}

interface AIMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  systemPrompt: string;
}

interface Test {
  id: string;
  name: string;
  description: string;
  questions: string[];
  scoringMethod: string;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<ChatSession | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const [riskMessage, setRiskMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modeSelectionOpen, setModeSelectionOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<AIMode | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentTab, setCurrentTab] = useState(0); // 0: Default, 1: Modes, 2: Tests

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI Modes
  const aiModes: AIMode[] = [
    {
      id: 'default',
      name: '기본 상담사',
      description: '전문적이고 따뜻한 AI 상담사',
      icon: <PsychologyIcon />,
      systemPrompt: `당신은 "유어마인드"의 AI 상담사입니다. 따뜻하고 전문적인 심리 상담을 제공하는 것이 목표입니다.

상담사로서의 역할:
1. 공감적이고 따뜻한 태도로 응답하세요
2. 사용자의 감정을 인정하고 이해한다는 것을 표현하세요
3. 전문적이면서도 접근하기 쉬운 언어를 사용하세요
4. 위험한 상황(자해, 타해 등)이 감지되면 즉시 전문가 상담을 권유하세요
5. 구체적이고 실용적인 조언을 제공하세요
6. 상담의 경계를 유지하되, 따뜻한 지지를 제공하세요

응답 스타일:
- 한국어로 응답하세요
- 존댓말을 사용하되 너무 딱딱하지 않게 하세요
- 사용자의 감정을 반영하는 표현을 사용하세요
- 필요시 적절한 질문을 통해 더 깊은 대화를 이끌어내세요
- 위험 신호가 감지되면 즉시 전문가 상담을 강력히 권유하세요
- 마크다운 형식(**굵게**, ## 제목 등)을 사용하지 마세요
- 특수문자나 포맷팅 없이 일반 텍스트로만 응답하세요

주의사항:
- 의학적 진단이나 처방을 하지 마세요
- 약물 복용에 대한 구체적인 조언을 하지 마세요
- 심각한 정신 건강 문제의 경우 전문가 상담을 권유하세요
- 개인정보나 민감한 정보를 요구하지 마세요`
    },
    {
      id: 'friendly',
      name: '친구같은',
      description: '편안하고 친근한 친구처럼 대화',
      icon: <GroupIcon />,
      systemPrompt: `당신은 사용자의 친한 친구입니다. 편안하고 친근한 태도로 대화하세요.

친구로서의 역할:
1. 편안하고 친근한 말투를 사용하세요
2. 공감하고 위로해주세요
3. 솔직하고 진정성 있는 대화를 나누세요
4. 필요시 조언을 해주되, 강요하지 마세요
5. 함께 웃고 함께 슬퍼해주세요

응답 스타일:
- 친구처럼 편하게 대화하세요
- 존댓말과 반말을 적절히 섞어서 사용하세요
- 이모티콘을 적절히 사용해도 됩니다
- 솔직하고 진정성 있는 반응을 보여주세요
- 마크다운 형식(**굵게**, ## 제목 등)을 사용하지 마세요
- 특수문자나 포맷팅 없이 일반 텍스트로만 응답하세요

주의사항:
- 위험한 상황이 감지되면 진지하게 대응하세요
- 전문적인 도움이 필요한 경우 조언해주세요`
    },
    {
      id: 'direct',
      name: '직설적인',
      description: '솔직하고 직접적인 조언',
      icon: <StraightenIcon />,
      systemPrompt: `당신은 솔직하고 직접적인 상담사입니다. 핵심을 짚어주고 실용적인 조언을 제공하세요.

직설적 상담사로서의 역할:
1. 핵심 문제를 정확히 파악하고 지적하세요
2. 솔직하고 직접적인 피드백을 제공하세요
3. 실용적이고 구체적인 해결책을 제시하세요
4. 감정적 위로보다는 실질적인 도움에 집중하세요
5. 현실적이고 가능한 조언을 해주세요

응답 스타일:
- 솔직하고 직접적으로 말하세요
- 핵심을 짚어주세요
- 실용적인 조언을 제공하세요
- 감정적이기보다는 논리적으로 접근하세요
- 마크다운 형식(**굵게**, ## 제목 등)을 사용하지 마세요
- 특수문자나 포맷팅 없이 일반 텍스트로만 응답하세요

주의사항:
- 너무 냉정하지 않게 하세요
- 위험한 상황은 여전히 진지하게 다루세요`
    },
    {
      id: 'realistic',
      name: '현실적인',
      description: '현실적이고 실용적인 관점',
      icon: <TrendingUpIcon />,
      systemPrompt: `당신은 현실적이고 실용적인 상담사입니다. 현실을 직시하고 실현 가능한 해결책을 제시하세요.

현실적 상담사로서의 역할:
1. 현실을 직시하고 인정하세요
2. 실현 가능한 목표와 해결책을 제시하세요
3. 단계적이고 구체적인 접근 방법을 제안하세요
4. 장기적인 관점에서 조언하세요
5. 현실적인 기대치를 설정하도록 도와주세요

응답 스타일:
- 현실적이고 실용적으로 접근하세요
- 구체적이고 실현 가능한 조언을 제공하세요
- 단계별 접근 방법을 제시하세요
- 장기적인 관점을 유지하세요
- 마크다운 형식(**굵게**, ## 제목 등)을 사용하지 마세요
- 특수문자나 포맷팅 없이 일반 텍스트로만 응답하세요

주의사항:
- 너무 비관적이지 않게 하세요
- 희망을 주되 현실적이게 하세요`
    },
    {
      id: 'f_tendency',
      name: 'F성향을 위한',
      description: '감정적이고 공감적인 접근',
      icon: <FavoriteIcon />,
      systemPrompt: `당신은 F성향(감정형) 사람들을 위한 상담사입니다. 감정적이고 공감적인 접근을 하세요.

F성향 상담사로서의 역할:
1. 감정에 집중하고 공감하세요
2. 관계와 인간관계를 중요시하세요
3. 가치와 의미를 중시하는 관점을 제공하세요
4. 조화와 평화를 추구하는 조언을 하세요
5. 개인의 가치관과 감정을 존중하세요

응답 스타일:
- 감정적이고 공감적으로 접근하세요
- 관계와 인간관계를 중시하는 관점을 제공하세요
- 가치와 의미를 중요시하세요
- 조화롭고 평화로운 해결책을 제시하세요
- 마크다운 형식(**굵게**, ## 제목 등)을 사용하지 마세요
- 특수문자나 포맷팅 없이 일반 텍스트로만 응답하세요

주의사항:
- 너무 감정적이지 않게 하세요
- 현실적인 부분도 고려하세요`
    }
  ];

  // Psychological Tests
  const psychologicalTests: Test[] = [
    {
      id: 'phq9',
      name: 'PHQ-9 우울증 테스트',
      description: '9개 문항으로 구성된 우울증 선별 도구',
      questions: [
        '기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈나요?',
        '평소에 하던 일에 대한 흥미가 없어지거나 즐거움을 느끼지 못했나요?',
        '잠들기 어렵거나 자주 깨거나, 너무 많이 잤나요?',
        '피곤하다고 느끼거나 기운이 없었나요?',
        '식욕이 없거나 너무 많이 먹었나요?',
        '자신에 대해 나쁘게 느끼거나, 실패자라고 느끼거나, 자신이나 가족을 실망시켰다고 느꼈나요?',
        '신문을 읽거나 TV를 보는 것과 같은 일에 집중하기 어려웠나요?',
        '다른 사람들이 눈치챌 정도로 천천히 움직이거나 말했나요? 아니면 반대로 평소보다 더 많이 움직이거나 말했나요?',
        '죽는 것이 좋겠다고 생각하거나, 어떻게든 자신을 해치고 싶다고 생각했나요?'
      ],
      scoringMethod: '각 문항 0-3점, 총점 0-27점. 10점 이상 시 우울증 가능성 높음'
    },
    {
      id: 'gad7',
      name: 'GAD-7 불안장애 테스트',
      description: '7개 문항으로 구성된 불안장애 선별 도구',
      questions: [
        '긴장하거나, 불안하거나, 가장자리에 앉아있는 것 같은 느낌',
        '걱정하거나 걱정할 일이 너무 많음',
        '걱정을 멈추거나 통제하기 어려움',
        '너무 걱정해서 가만히 앉아있기 어려움',
        '걱정이나 긴장 때문에 쉽게 짜증이 남',
        '걱정 때문에 무언가가 갑자기 일어날 것 같은 두려움',
        '평소보다 더 쉽게 놀라거나 깜짝 놀람'
      ],
      scoringMethod: '각 문항 0-3점, 총점 0-21점. 10점 이상 시 불안장애 가능성 높음'
    },
    {
      id: 'cssrs',
      name: 'C-SSRS 자살위험 테스트',
      description: '자살 사고와 행동을 평가하는 도구',
      questions: [
        '죽고 싶다는 생각이 들었나요?',
        '자신을 해치고 싶다는 생각이 들었나요?',
        '자살에 대해 생각해본 적이 있나요?',
        '자살 계획을 세워본 적이 있나요?',
        '자살을 시도해본 적이 있나요?',
        '자살을 시도할 의도가 있나요?',
        '자살을 시도할 수단을 가지고 있나요?'
      ],
      scoringMethod: '각 문항에 대한 응답을 바탕으로 자살 위험도를 평가합니다. 긍정적 응답 시 즉시 전문가 상담 필요'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial counseling questions - memoized with useCallback
  const initialQuestions = useCallback(() => [
    {
      id: 'welcome',
      text: '안녕하세요, 만나서 반가워요. 저는 오늘 당신의 이야기를 들어줄 상담 AI예요.',
      sender: 'ai' as const,
      timestamp: new Date(),
    },
    {
      id: 'reason',
      text: '혹시 오늘 저를 찾아온 이유나 계기가 있을까요?',
      sender: 'ai' as const,
      timestamp: new Date(),
    },
    {
      id: 'mood',
      text: '지금 이 순간 기분을 한 단어로 표현하면 어떤가요?',
      sender: 'ai' as const,
      timestamp: new Date(),
    }
  ], []);

  // Load chat sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await ChatService.getSessions(user.id);
      
      if (error) {
        console.error('Error loading sessions:', error);
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load messages for a session
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await ChatService.getMessages(sessionId);
      
      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          riskLevel: msg.risk_level,
        }));
        setMessages(formattedMessages);
      } else {
        setMessages(initialQuestions());
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  }, [initialQuestions]);

  // Start new chat
  const startNewChat = () => {
    setModeSelectionOpen(true);
  };

  const handleModeSelection = (mode: AIMode | null, test: Test | null) => {
    setSelectedMode(mode);
    setSelectedTest(test);
    setModeSelectionOpen(false);
    
    // Clear current session and messages
    setSessionId(null);
    setCurrentSession(null);
    setMessages([]);
    
    // Set initial messages based on selection
    if (test) {
      // Start with test introduction
      const testIntro: Message = {
        id: 'test-intro',
        text: `안녕하세요! ${test.name}를 시작하겠습니다.\n\n${test.description}\n\n이 테스트는 ${test.questions.length}개의 질문으로 구성되어 있습니다. 각 질문에 솔직하게 답변해주시면 됩니다.\n\n준비되셨다면 "시작"이라고 말씀해주세요.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([testIntro]);
    } else if (mode) {
      // Start with mode-specific greeting
      const modeIntro: Message = {
        id: 'mode-intro',
        text: `안녕하세요! ${mode.name} 모드로 상담을 시작하겠습니다.\n\n${mode.description}\n\n어떤 고민이 있으신가요?`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([modeIntro]);
    } else {
      // Default mode
      const defaultIntro: Message = {
        id: 'default-intro',
        text: '안녕하세요! 저는 오늘 당신의 이야기를 들어줄 상담 AI예요.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([defaultIntro]);
    }
  };

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Initialize chat with welcome questions if no session
  useEffect(() => {
    if (messages.length === 0 && !sessionId) {
      setMessages(initialQuestions());
    }
  }, [messages.length, sessionId, initialQuestions]);

  // Handle session selection
  const handleSessionSelect = async (session: ChatSession) => {
    setCurrentSession(session);
    setSessionId(session.id);
    await loadSessionMessages(session.id);
    setSidebarOpen(false);
  };

  // Handle session title edit
  const handleEditTitle = async () => {
    if (!editingSession || !newTitle.trim()) return;

    try {
      const { error } = await ChatService.updateSessionTitle(editingSession.id, newTitle.trim());
      
      if (error) {
        console.error('Error updating title:', error);
        return;
      }

      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === editingSession.id ? { ...s, title: newTitle.trim() } : s
      ));
      
      if (currentSession?.id === editingSession.id) {
        setCurrentSession(prev => prev ? { ...prev, title: newTitle.trim() } : null);
      }

      setEditDialogOpen(false);
      setEditingSession(null);
      setNewTitle('');
    } catch (err) {
      console.error('Error updating title:', err);
    }
  };

  // Handle session deletion
  const handleDeleteSession = async (session: ChatSession) => {
    try {
      const { error } = await ChatService.deleteSession(session.id);
      
      if (error) {
        console.error('Error deleting session:', error);
        return;
      }

      // Update local state
      setSessions(prev => prev.filter(s => s.id !== session.id));
      
      // If deleted session was current, start new chat
      if (currentSession?.id === session.id) {
        setCurrentSession(null);
        setSessionId('');
        setMessages(initialQuestions());
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      let currentSessionId = sessionId;

      // If no session exists yet, create one first
      if (!currentSessionId) {
        const sessionNumber = sessions.length + 1;
        const title = selectedTest ? `${selectedTest.name} - 채팅 ${sessionNumber}` : 
                     selectedMode ? `${selectedMode.name} - 채팅 ${sessionNumber}` : 
                     `채팅 ${sessionNumber}`;

        // Create new session in Supabase
        const { data: session, error } = await ChatService.createSession({
          title,
          userId: user.id,
        });

        if (error) {
          console.error('Error creating session:', error);
          throw new Error('세션을 생성할 수 없습니다.');
        }

        if (session) {
          setSessionId(session.id);
          setCurrentSession(session);
          currentSessionId = session.id;

          // Start backend conversation
          await apiService.startConversation();

          // Refresh sessions list
          await loadSessions();
        }
      }

      // Determine the system prompt based on selected mode
      let systemPrompt = aiModes[0].systemPrompt; // Default
      if (selectedMode) {
        systemPrompt = selectedMode.systemPrompt;
      } else if (selectedTest) {
        // Test-specific system prompt
        systemPrompt = `당신은 ${selectedTest.name}를 진행하는 전문 상담사입니다.

테스트 진행 방법:
1. ${selectedTest.questions.length}개의 질문을 순서대로 하나씩 진행합니다
2. 각 질문에 대해 사용자의 응답을 듣고 적절한 반응을 보여주세요
3. 테스트가 완료되면 결과를 해석하고 권장사항을 제공하세요
4. 위험한 응답이 감지되면 즉시 전문가 상담을 권유하세요

${selectedTest.scoringMethod}

응답 스타일:
- 따뜻하고 전문적인 태도로 응답하세요
- 마크다운 형식(**굵게**, ## 제목 등)을 사용하지 마세요
- 특수문자나 포맷팅 없이 일반 텍스트로만 응답하세요`;
      }

      // Send to backend for AI response with custom system prompt
      const response = await apiService.sendMessage(inputText, currentSessionId || '', systemPrompt);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        riskLevel: response.riskLevel,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save messages to Supabase if we have a session
      if (currentSessionId) {
        await ChatService.saveMessage({
          sessionId: currentSessionId,
          content: inputText,
          sender: 'user',
        });

        await ChatService.saveMessage({
          sessionId: currentSessionId,
          content: response.response,
          sender: 'ai',
          riskLevel: response.riskLevel,
        });
      }

      // Show risk alert if needed
      if (response.riskLevel.requiresImmediateAttention) {
        setRiskMessage(response.riskLevel.message);
        setShowRiskAlert(true);
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('메시지를 전송할 수 없습니다. 잠시 후 다시 시도해주세요.');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGenerateSummary = async () => {
    if (messages.length === 0) return;
    
    setSummaryLoading(true);
    setSummaryDialogOpen(true);
    
    try {
      // Create a summary prompt
      const conversationText = messages
        .map(msg => `${msg.sender === 'user' ? '사용자' : 'AI'}: ${msg.text}`)
        .join('\n');
      
      const summaryPrompt = `다음 대화를 요약해주세요. 요약 후에 다음 항목들을 점수로 평가해주세요:

대화 내용:
${conversationText}

다음 형식으로만 응답해주세요 (마크다운이나 특수문자 사용하지 마세요):

요약: [대화 내용 요약]

스트레스수준: [1-10점]
우울감수준: [1-10점]
불안감수준: [1-10점]
전반적심리상태: [1-10점]

권장사항: [상황에 맞는 조언]`;

      // Send to backend for summary
      const response = await apiService.sendMessage(summaryPrompt, sessionId || '');
      
      // Parse the response and format it properly
      const formattedSummary = formatSummaryResponse(response.response);
      setSummary(formattedSummary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('요약을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const formatSummaryResponse = (response: string): string => {
    try {
      // Extract scores using regex
      const stressMatch = response.match(/스트레스수준:\s*(\d+)/);
      const depressionMatch = response.match(/우울감수준:\s*(\d+)/);
      const anxietyMatch = response.match(/불안감수준:\s*(\d+)/);
      const overallMatch = response.match(/전반적심리상태:\s*(\d+)/);
      
      // Extract summary and recommendations
      const summaryMatch = response.match(/요약:\s*([\s\S]*?)(?=\n스트레스수준:|$)/);
      const recommendationMatch = response.match(/권장사항:\s*([\s\S]*?)$/);
      
      const stress = stressMatch ? parseInt(stressMatch[1]) : 5;
      const depression = depressionMatch ? parseInt(depressionMatch[1]) : 5;
      const anxiety = anxietyMatch ? parseInt(anxietyMatch[1]) : 5;
      const overall = overallMatch ? parseInt(overallMatch[1]) : 5;
      const summary = summaryMatch ? summaryMatch[1].trim() : '요약을 생성할 수 없습니다.';
      const recommendation = recommendationMatch ? recommendationMatch[1].trim() : '권장사항을 생성할 수 없습니다.';
      
      // Create formatted summary with bold headers
      return `**대화 요약**

${summary}

**심리 상태 점수**

스트레스 수준: ${stress}/10
우울감 수준: ${depression}/10
불안감 수준: ${anxiety}/10
전반적인 심리 상태: ${overall}/10

**권장사항**

${recommendation}`;
    } catch (error) {
      console.error('Error formatting summary:', error);
      return response; // Return original response if parsing fails
    }
  };

  const handleDownloadPDF = () => {
    if (!summary) return;
    
    // Create a simple PDF-like download using browser print functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>채팅 요약 - 유어마인드</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 25px; }
              .section-title { font-weight: bold; font-size: 18px; color: #2563EB; margin-bottom: 10px; }
              .score-item { margin-bottom: 15px; }
              .score-bar { 
                display: flex; 
                align-items: center; 
                gap: 10px; 
                margin-bottom: 8px; 
              }
              .score-label { min-width: 120px; }
              .score-bar-container { 
                flex: 1; 
                height: 20px; 
                background: #f0f0f0; 
                border-radius: 10px; 
                overflow: hidden; 
              }
              .score-bar-fill { 
                height: 100%; 
                border-radius: 10px; 
                transition: width 0.3s; 
              }
              .score-number { font-weight: bold; min-width: 30px; }
              .stress { background: linear-gradient(90deg, #10B981, #34D399); }
              .depression { background: linear-gradient(90deg, #F59E0B, #FBBF24); }
              .anxiety { background: linear-gradient(90deg, #EF4444, #F87171); }
              .overall { background: linear-gradient(90deg, #8B5CF6, #A78BFA); }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>채팅 요약</h1>
              <p>유어마인드 AI 상담사</p>
              <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
            </div>
            
            <div class="section">
              <div class="section-title">대화 요약</div>
              <div>${summary.split('**대화 요약**')[1]?.split('**심리 상태 점수**')[0]?.trim() || '요약을 생성할 수 없습니다.'}</div>
            </div>
            
            <div class="section">
              <div class="section-title">심리 상태 점수</div>
              ${generateScoreBarsHTML()}
            </div>
            
            <div class="section">
              <div class="section-title">권장사항</div>
              <div>${summary.split('**권장사항**')[1]?.trim() || '권장사항을 생성할 수 없습니다.'}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateScoreBarsHTML = () => {
    const scores = extractScoresFromSummary(summary);
    return `
      <div class="score-item">
        <div class="score-bar">
          <div class="score-label">스트레스 수준</div>
          <div class="score-bar-container">
            <div class="score-bar-fill stress" style="width: ${scores.stress * 10}%"></div>
          </div>
          <div class="score-number">${scores.stress}/10</div>
        </div>
      </div>
      <div class="score-item">
        <div class="score-bar">
          <div class="score-label">우울감 수준</div>
          <div class="score-bar-container">
            <div class="score-bar-fill depression" style="width: ${scores.depression * 10}%"></div>
          </div>
          <div class="score-number">${scores.depression}/10</div>
        </div>
      </div>
      <div class="score-item">
        <div class="score-bar">
          <div class="score-label">불안감 수준</div>
          <div class="score-bar-container">
            <div class="score-bar-fill anxiety" style="width: ${scores.anxiety * 10}%"></div>
          </div>
          <div class="score-number">${scores.anxiety}/10</div>
        </div>
      </div>
      <div class="score-item">
        <div class="score-bar">
          <div class="score-label">전반적인 심리 상태</div>
          <div class="score-bar-container">
            <div class="score-bar-fill overall" style="width: ${scores.overall * 10}%"></div>
          </div>
          <div class="score-number">${scores.overall}/10</div>
        </div>
      </div>
    `;
  };

  const extractScoresFromSummary = (summaryText: string | null) => {
    if (!summaryText) {
      return {
        stress: 5,
        depression: 5,
        anxiety: 5,
        overall: 5,
      };
    }
    
    const stressMatch = summaryText.match(/스트레스 수준:\s*(\d+)/);
    const depressionMatch = summaryText.match(/우울감 수준:\s*(\d+)/);
    const anxietyMatch = summaryText.match(/불안감 수준:\s*(\d+)/);
    const overallMatch = summaryText.match(/전반적인 심리 상태:\s*(\d+)/);
    
    return {
      stress: stressMatch ? parseInt(stressMatch[1]) : 5,
      depression: depressionMatch ? parseInt(depressionMatch[1]) : 5,
      anxiety: anxietyMatch ? parseInt(anxietyMatch[1]) : 5,
      overall: overallMatch ? parseInt(overallMatch[1]) : 5,
    };
  };

  // Simple date formatting function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderScoreBars = () => {
    const scores = extractScoresFromSummary(summary);
    
    const getScoreColor = (score: number) => {
      if (score <= 3) return '#10B981'; // Green for low
      if (score <= 6) return '#F59E0B'; // Yellow for medium
      return '#EF4444'; // Red for high
    };

    const getScoreLabel = (score: number) => {
      if (score <= 3) return '낮음';
      if (score <= 6) return '보통';
      return '높음';
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Stress Level */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ minWidth: 120, fontSize: '0.9rem' }}>
            스트레스 수준
          </Typography>
          <Box sx={{ flex: 1, height: 20, bgcolor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                height: '100%',
                width: `${scores.stress * 10}%`,
                bgcolor: getScoreColor(scores.stress),
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 60 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {scores.stress}/10
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              ({getScoreLabel(scores.stress)})
            </Typography>
          </Box>
        </Box>

        {/* Depression Level */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ minWidth: 120, fontSize: '0.9rem' }}>
            우울감 수준
          </Typography>
          <Box sx={{ flex: 1, height: 20, bgcolor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                height: '100%',
                width: `${scores.depression * 10}%`,
                bgcolor: getScoreColor(scores.depression),
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 60 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {scores.depression}/10
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              ({getScoreLabel(scores.depression)})
            </Typography>
          </Box>
        </Box>

        {/* Anxiety Level */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ minWidth: 120, fontSize: '0.9rem' }}>
            불안감 수준
          </Typography>
          <Box sx={{ flex: 1, height: 20, bgcolor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                height: '100%',
                width: `${scores.anxiety * 10}%`,
                bgcolor: getScoreColor(scores.anxiety),
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 60 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {scores.anxiety}/10
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              ({getScoreLabel(scores.anxiety)})
            </Typography>
          </Box>
        </Box>

        {/* Overall Mental State */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ minWidth: 120, fontSize: '0.9rem' }}>
            전반적인 심리 상태
          </Typography>
          <Box sx={{ flex: 1, height: 20, bgcolor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                height: '100%',
                width: `${scores.overall * 10}%`,
                bgcolor: getScoreColor(scores.overall),
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 60 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {scores.overall}/10
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              ({getScoreLabel(scores.overall)})
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              채팅 기록
            </Typography>
            <IconButton onClick={() => setSidebarOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={startNewChat}
            disabled={isTyping}
            sx={{ mb: 2 }}
          >
            새 채팅
          </Button>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {sessions.map((session) => (
                <ListItem
                  key={session.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: currentSession?.id === session.id ? '#3B82F6' : 'transparent',
                    '&:hover': {
                      backgroundColor: currentSession?.id === session.id ? '#1D4ED8' : '#EFF6FF',
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSessionSelect(session)}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body1" 
                            fontWeight={500}
                            sx={{
                              color: currentSession?.id === session.id ? 'white' : 'text.primary'
                            }}
                          >
                            {session.title}
                          </Typography>
                          {currentSession?.id === session.id && (
                            <Chip
                              label="현재"
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                color: 'white',
                                borderColor: 'white',
                                '& .MuiChip-label': {
                                  color: 'white'
                                }
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="caption" 
                          sx={{
                            color: currentSession?.id === session.id ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                          }}
                        >
                          {formatDate(session.created_at || '')}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSession(session);
                          setNewTitle(session.title);
                          setEditDialogOpen(true);
                        }}
                        sx={{ 
                          color: currentSession?.id === session.id ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                          '&:hover': {
                            color: currentSession?.id === session.id ? 'white' : 'primary.main'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session);
                        }}
                        sx={{ 
                          color: currentSession?.id === session.id ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                          '&:hover': { 
                            color: currentSession?.id === session.id ? 'white' : 'error.main' 
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {sessions.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                아직 채팅 기록이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                새로운 상담을 시작해보세요
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="md" sx={{ py: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Risk Alert */}
          <Snackbar
            open={showRiskAlert}
            autoHideDuration={10000}
            onClose={() => setShowRiskAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              severity="warning" 
              onClose={() => setShowRiskAlert(false)}
              sx={{ width: '100%' }}
            >
              {riskMessage}
            </Alert>
          </Snackbar>

          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <IconButton onClick={() => setSidebarOpen(true)}>
                <MenuIcon />
              </IconButton>
              
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  AI 상담사
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentSession ? currentSession.title : '새로운 상담'}
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<SummarizeIcon />}
                onClick={handleGenerateSummary}
                disabled={isTyping || messages.length === 0}
                size="small"
              >
                채팅 요약
              </Button>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={startNewChat}
                disabled={isTyping}
                size="small"
              >
                새 채팅
              </Button>
            </Box>

            {/* Messages */}
            <Paper
              sx={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: message.sender === 'user' ? (user?.avatar_color || 'secondary.main') : 'primary.main',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            flexShrink: 0, // Prevent squishing
                            minWidth: 32, // Ensure minimum width
                            minHeight: 32, // Ensure minimum height
                          }}
                        >
                          {message.sender === 'user' ? (user?.name?.charAt(0).toUpperCase() || 'U') : 'AI'}
                        </Box>
                        <Box>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                              color: message.sender === 'user' ? 'white' : 'text.primary',
                              borderRadius: 2,
                              boxShadow: 1,
                            }}
                          >
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                              {message.text}
                            </Typography>
                          </Paper>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: 'block' }}
                          >
                            {message.timestamp.toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ bgcolor: 'primary.main', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, minWidth: 32, minHeight: 32 }}>
                          AI
                        </Box>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                animation: 'typing 1.4s infinite ease-in-out',
                                '&:nth-of-type(1)': { animationDelay: '0s' },
                                '&:nth-of-type(2)': { animationDelay: '0.2s' },
                                '&:nth-of-type(3)': { animationDelay: '0.4s' },
                                '@keyframes typing': {
                                  '0%, 60%, 100%': { transform: 'translateY(0)' },
                                  '30%': { transform: 'translateY(-10px)' },
                                },
                              }}
                            />
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                animation: 'typing 1.4s infinite ease-in-out',
                                animationDelay: '0.2s',
                              }}
                            />
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                animation: 'typing 1.4s infinite ease-in-out',
                                animationDelay: '0.4s',
                              }}
                            />
                          </Box>
                        </Paper>
                      </Box>
                    </Box>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="고민을 자유롭게 말씀해 주세요..."
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    sx={{
                      borderRadius: 3,
                      minWidth: 48,
                      height: 40,
                    }}
                  >
                    <SendIcon />
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Enter로 전송, Shift+Enter로 줄바꿈
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Edit Title Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>채팅 제목 수정</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="제목"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
          <Button onClick={handleEditTitle} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog
        open={summaryDialogOpen}
        onClose={() => setSummaryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SummarizeIcon color="primary" />
            <Typography variant="h6">채팅 요약</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {summaryLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              {summary && (
                <Box>
                  {/* Summary Section */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      mb: 2,
                      mt: 1,
                    }}
                  >
                    대화 요약
                  </Typography>
                  <Typography
                    sx={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    {summary.split('**대화 요약**')[1]?.split('**심리 상태 점수**')[0]?.trim() || '요약을 생성할 수 없습니다.'}
                  </Typography>

                  {/* Scores Section */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    심리 상태 점수
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {renderScoreBars()}
                  </Box>

                  {/* Recommendations Section */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    권장사항
                  </Typography>
                  <Typography
                    sx={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                    }}
                  >
                    {summary.split('**권장사항**')[1]?.trim() || '권장사항을 생성할 수 없습니다.'}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSummaryDialogOpen(false)}>
            닫기
          </Button>
          <Button onClick={handleDownloadPDF} variant="contained" startIcon={<DownloadIcon />}>
            PDF로 다운로드
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mode Selection Dialog */}
      <Dialog
        open={modeSelectionOpen}
        onClose={() => setModeSelectionOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>새로운 상담 시작</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
              <Tab label="기본" />
              <Tab label="모드" />
              <Tab label="테스트" />
            </Tabs>
          </Box>
          
          {currentTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                기본 상담사
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                전문적이고 따뜻한 AI 상담사와 자유롭게 대화하세요.
              </Typography>
              <Button
                variant="contained"
                startIcon={<PsychologyIcon />}
                onClick={() => handleModeSelection(null, null)}
                fullWidth
              >
                기본 상담 시작
              </Button>
            </Box>
          )}
          
          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                AI 모드 선택
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                원하는 스타일의 AI 상담사를 선택하세요.
              </Typography>
              <Grid container spacing={2}>
                {aiModes.slice(1).map((mode) => (
                  <Grid item xs={12} sm={6} key={mode.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4 }
                      }}
                      onClick={() => handleModeSelection(mode, null)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {mode.icon}
                          <Typography variant="h6">{mode.name}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {mode.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                심리 테스트
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                전문적인 심리 테스트를 AI와 함께 진행하세요.
              </Typography>
              <Grid container spacing={2}>
                {psychologicalTests.map((test) => (
                  <Grid item xs={12} key={test.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4 }
                      }}
                      onClick={() => handleModeSelection(null, test)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PsychologyIcon />
                          <Typography variant="h6">{test.name}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {test.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {test.questions.length}개 문항 • {test.scoringMethod}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModeSelectionOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat; 