// AI Model Configuration for Mental FLAN-T5
// This configuration will use a local or cloud-based Mental FLAN-T5 model

// Mental FLAN-T5 system prompt for counseling
const COUNSELING_SYSTEM_PROMPT = `당신은 "유어마인드"의 AI 상담사입니다. 따뜻하고 전문적인 심리 상담을 제공하는 것이 목표입니다.

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
- 개인정보나 민감한 정보를 요구하지 마세요

이제 상담을 시작하겠습니다. 어떤 고민이 있으신가요?`;

// AI Model Configuration
const AI_CONFIG = {
  model: 'Mental-FLAN-T5',
  maxTokens: 1000,
  temperature: 0.7,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1
};

// Function to generate AI response using Mental FLAN-T5
async function generateResponse(messages, systemPrompt) {
  try {
    // For now, we'll use a mock response to simulate Mental FLAN-T5
    // In production, this would connect to the actual Mental FLAN-T5 API or local model
    
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    
    // Simple response generation logic (replace with actual Mental FLAN-T5 API call)
    let response = '';
    
    if (lastUserMessage.includes('안녕') || lastUserMessage.includes('hello')) {
      response = '안녕하세요! 오늘 어떤 고민이 있으신가요? 편하게 말씀해주세요.';
    } else if (lastUserMessage.includes('스트레스') || lastUserMessage.includes('stress')) {
      response = '스트레스를 느끼고 계시는군요. 어떤 상황에서 스트레스를 받고 계신지 자세히 말씀해주세요. 함께 해결책을 찾아보겠습니다.';
    } else if (lastUserMessage.includes('우울') || lastUserMessage.includes('depression')) {
      response = '우울한 감정을 느끼고 계시는군요. 이런 감정이 언제부터 시작되었는지, 어떤 일이 있었는지 이야기해주세요. 전문가의 도움이 필요할 수도 있습니다.';
    } else if (lastUserMessage.includes('불안') || lastUserMessage.includes('anxiety')) {
      response = '불안한 마음이 드시는군요. 어떤 것에 대해 불안을 느끼고 계신지, 언제부터 이런 감정이 있었는지 말씀해주세요.';
    } else {
      response = '말씀해주신 내용을 잘 들었습니다. 더 자세한 상황이나 감정에 대해 이야기해주시면, 함께 생각해보고 도움을 드릴 수 있을 것 같습니다.';
    }
    
    return response;
    
  } catch (error) {
    console.error('Mental FLAN-T5 response generation error:', error);
    throw new Error('AI 응답 생성 중 오류가 발생했습니다.');
  }
}

module.exports = {
  COUNSELING_SYSTEM_PROMPT,
  AI_CONFIG,
  generateResponse
};
