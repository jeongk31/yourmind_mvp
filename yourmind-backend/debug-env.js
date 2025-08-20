require('dotenv').config();

console.log('🔍 Environment Variables Debug:');
console.log('NAVER_CLIENT_ID:', process.env.NAVER_CLIENT_ID);
console.log('NAVER_CLIENT_SECRET:', process.env.NAVER_CLIENT_SECRET);
console.log('NAVER_CLIENT_SECRET length:', process.env.NAVER_CLIENT_SECRET?.length);
console.log('NAVER_CLIENT_SECRET first 10 chars:', process.env.NAVER_CLIENT_SECRET?.substring(0, 10));
console.log('NAVER_CLIENT_SECRET last 10 chars:', process.env.NAVER_CLIENT_SECRET?.substring(process.env.NAVER_CLIENT_SECRET?.length - 10));

// Test the exact API call
const axios = require('axios');

async function testAPI() {
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

  console.log('\n🧪 Testing API call with exact values:');
  console.log('Headers being sent:');
  console.log('X-NCP-APIGW-API-KEY-ID:', NAVER_CLIENT_ID);
  console.log('X-NCP-APIGW-API-KEY:', NAVER_CLIENT_SECRET);

  try {
    const response = await axios.get(
      'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=126.9780,37.5665&orders=legalcode&output=json',
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    console.log('✅ API call successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ API call failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }
}

testAPI();
