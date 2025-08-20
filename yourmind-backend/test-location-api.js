const axios = require('axios');

// Test Naver Maps API integration
async function testLocationAPI() {
  console.log('🧪 Testing Naver Maps API Integration...\n');

  const baseURL = 'http://localhost:5001';
  
  // Test 1: Health check
  try {
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Address from coordinates (Seoul coordinates)
  try {
    console.log('\n2. Testing address from coordinates...');
    const addressResponse = await axios.get(`${baseURL}/api/location/address?lat=37.5665&lng=126.9780`);
    console.log('✅ Address lookup passed:', addressResponse.data);
  } catch (error) {
    console.log('❌ Address lookup failed:', error.response?.data || error.message);
  }

  // Test 3: Location search
  try {
    console.log('\n3. Testing location search...');
    const searchResponse = await axios.get(`${baseURL}/api/location/search?query=강남구`);
    console.log('✅ Location search passed:', searchResponse.data);
  } catch (error) {
    console.log('❌ Location search failed:', error.response?.data || error.message);
  }

  // Test 4: Nearby facilities search
  try {
    console.log('\n4. Testing nearby facilities search...');
    const facilitiesResponse = await axios.get(`${baseURL}/api/location/nearby-facilities?lat=37.5665&lng=126.9780&radius=5000`);
    console.log('✅ Nearby facilities search passed:', {
      totalCount: facilitiesResponse.data.totalCount,
      facilitiesCount: facilitiesResponse.data.facilities?.length || 0,
      mock: facilitiesResponse.data.mock || false
    });
  } catch (error) {
    console.log('❌ Nearby facilities search failed:', error.response?.data || error.message);
  }

  console.log('\n🎯 Test completed!');
}

// Run the test
testLocationAPI().catch(console.error);
