const axios = require('axios');

// Test Naver Maps API with new credentials
async function testNewAPI() {
  console.log('🧪 Testing Naver Maps API with New Credentials...\n');

  const NAVER_CLIENT_ID = '3fttsepzj2';
  const NAVER_CLIENT_SECRET = 'lvrNVpw1c29tQUcBFyfNJ6jxPINDKbAo1cFUQVTS';

  console.log('Using New API Keys:');
  console.log('Client ID:', NAVER_CLIENT_ID);
  console.log('Client Secret:', NAVER_CLIENT_SECRET);
  console.log('');

  // Test 1: Reverse Geocoding
  try {
    console.log('1. Testing Reverse Geocoding...');
    const response = await axios.get(
      'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=126.9780,37.5665&orders=legalcode&output=json',
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    console.log('✅ Reverse Geocoding Success:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Reverse Geocoding Failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Geocoding
  try {
    console.log('2. Testing Geocoding...');
    const response = await axios.get(
      'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=강남구',
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    console.log('✅ Geocoding Success:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Geocoding Failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Place Search
  try {
    console.log('3. Testing Place Search...');
    const response = await axios.get(
      'https://naveropenapi.apigw.ntruss.com/map-place/v1/search?query=정신과&coordinate=126.9780,37.5665&radius=5000&display=5',
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    console.log('✅ Place Search Success:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Place Search Failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n🎯 New API Credentials Test completed!');
}

// Run the test
testNewAPI().catch(console.error);
