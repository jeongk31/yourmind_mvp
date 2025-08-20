const axios = require('axios');

// Test Naver Dynamic Map API specifically
async function testDynamicMapAPI() {
  console.log('🧪 Testing Naver Dynamic Map API...\n');

  const NAVER_CLIENT_ID = 'earsawm8y0';
  const NAVER_CLIENT_SECRET = 'Ya3IFwI0dF1EKOO7TC5hJiuGDmePAPv5TVI4DvPn';

  console.log('Using API Keys:');
  console.log('Client ID:', NAVER_CLIENT_ID);
  console.log('Client Secret:', NAVER_CLIENT_SECRET);
  console.log('');

  // Test 1: Dynamic Map JavaScript API
  try {
    console.log('1. Testing Dynamic Map JavaScript API...');
    const response = await axios.get(
      'https://openapi.naver.com/v1/map/staticmap.bin',
      {
        params: {
          clientId: NAVER_CLIENT_ID,
          clientSecret: NAVER_CLIENT_SECRET,
          url: 'https://map.naver.com',
          width: 500,
          height: 300,
          level: 10,
          lat: 37.5665,
          lng: 126.9780
        }
      }
    );

    console.log('✅ Dynamic Map JavaScript API Success:');
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
  } catch (error) {
    console.log('❌ Dynamic Map JavaScript API Failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Alternative Geocoding endpoint
  try {
    console.log('2. Testing Alternative Geocoding...');
    const response = await axios.get(
      'https://openapi.naver.com/v1/map/geocode',
      {
        params: {
          query: '강남구',
          coordinate: '126.9780,37.5665'
        },
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    console.log('✅ Alternative Geocoding Success:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Alternative Geocoding Failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Check API subscription status
  try {
    console.log('3. Testing API Subscription Status...');
    const response = await axios.get(
      'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=126.9780,37.5665&orders=legalcode&output=json',
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    console.log('✅ API Subscription Active:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ API Subscription Issue:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.errorCode === '210') {
      console.log('\n🔍 Troubleshooting:');
      console.log('1. Check if Maps API is activated in Naver Cloud Platform');
      console.log('2. Verify Application settings (Web Service URL)');
      console.log('3. Check API usage limits and billing');
      console.log('4. Ensure Dynamic Map service is subscribed');
    }
  }

  console.log('\n🎯 Dynamic Map API Test completed!');
}

// Run the test
testDynamicMapAPI().catch(console.error);
