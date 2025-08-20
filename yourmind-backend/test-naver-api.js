const axios = require('axios');

// Test Naver Maps API directly
async function testNaverAPI() {
  console.log('🧪 Testing Naver Dynamic Map API...\n');

  const NAVER_CLIENT_ID = 'earsawm8y0';
  const NAVER_CLIENT_SECRET = 'Ya3IFwI0dF1EKOO7TC5hJiuGDmePAPv5TVI4DvPn';

  console.log('Using API Keys:');
  console.log('Client ID:', NAVER_CLIENT_ID);
  console.log('Client Secret:', NAVER_CLIENT_SECRET);
  console.log('');

  // Test 1: Reverse Geocoding (Dynamic Map API)
  try {
    console.log('1. Testing Reverse Geocoding (Dynamic Map)...');
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

  // Test 2: Geocoding (Dynamic Map API)
  try {
    console.log('2. Testing Geocoding (Dynamic Map)...');
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

  // Test 3: Place Search (Dynamic Map API)
  try {
    console.log('3. Testing Place Search (Dynamic Map)...');
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

  console.log('\n🎯 Dynamic Map API Test completed!');
}

// Run the test
testNaverAPI().catch(console.error);
