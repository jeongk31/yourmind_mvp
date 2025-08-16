const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5001/api';

async function testAPI() {
  console.log('🧪 Testing YourMind Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test start conversation
    console.log('2. Testing start conversation...');
    const startResponse = await fetch(`${API_BASE_URL}/chat/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const startData = await startResponse.json();
    console.log('✅ Start conversation:', startData);
    console.log('');

    if (startData.success && startData.sessionId) {
      // Test send message (without OpenAI API key, this will fail but we can test the endpoint)
      console.log('3. Testing send message...');
      const sendResponse = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '안녕하세요, 테스트 메시지입니다.',
          sessionId: startData.sessionId,
        }),
      });
      const sendData = await sendResponse.json();
      console.log('✅ Send message response:', sendData);
      console.log('');

      // Test get conversation history
      console.log('4. Testing get conversation history...');
      const historyResponse = await fetch(`${API_BASE_URL}/chat/history/${startData.sessionId}`);
      const historyData = await historyResponse.json();
      console.log('✅ Conversation history:', historyData);
      console.log('');

      // Test clear conversation
      console.log('5. Testing clear conversation...');
      const clearResponse = await fetch(`${API_BASE_URL}/chat/clear/${startData.sessionId}`, {
        method: 'DELETE',
      });
      const clearData = await clearResponse.json();
      console.log('✅ Clear conversation:', clearData);
      console.log('');
    }

    console.log('🎉 All API tests completed!');
    console.log('\n📝 Note: OpenAI API calls will fail without a valid API key.');
    console.log('   To test with real GPT-4 responses, add your OpenAI API key to the .env file.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAPI(); 