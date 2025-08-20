const axios = require('axios');

// Naver Maps API configuration
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// Get address from coordinates (reverse geocoding)
const getAddressFromCoords = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const response = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&orders=legalcode&output=json`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const region = result.region;
      const address = `${region.area1.name} ${region.area2.name} ${region.area3.name}`;
      
      res.json({ address });
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    res.status(500).json({ error: 'Failed to get address from coordinates' });
  }
};

// Search locations (geocoding)
const searchLocations = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters long' });
    }

    const response = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    if (response.data.addresses && response.data.addresses.length > 0) {
      const addresses = response.data.addresses.slice(0, 5).map(addr => ({
        roadAddress: addr.roadAddress,
        jibunAddress: addr.jibunAddress,
        displayAddress: addr.roadAddress || addr.jibunAddress
      }));
      
      res.json({ addresses });
    } else {
      res.json({ addresses: [] });
    }
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
};

// Search nearby mental health facilities
const searchNearbyFacilities = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters, default 5km

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Search for 정신과 (psychiatry clinics)
    const psychiatryResponse = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-place/v1/search?query=정신과&coordinate=${lng},${lat}&radius=${radius}&category=HP8&display=20`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    // Search for 심리상담 (psychological counseling)
    const counselingResponse = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-place/v1/search?query=심리상담&coordinate=${lng},${lat}&radius=${radius}&display=20`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
        },
      }
    );

    // Combine and process results
    const facilities = [];

    // Process psychiatry results
    if (psychiatryResponse.data.places) {
      psychiatryResponse.data.places.forEach(place => {
        facilities.push({
          id: place.id,
          name: place.name,
          type: 'psychiatrist',
          address: place.address,
          roadAddress: place.roadAddress,
          phone: place.tel,
          category: place.category,
          distance: place.distance,
          coordinates: {
            lat: parseFloat(place.y),
            lng: parseFloat(place.x)
          }
        });
      });
    }

    // Process counseling results
    if (counselingResponse.data.places) {
      counselingResponse.data.places.forEach(place => {
        facilities.push({
          id: place.id,
          name: place.name,
          type: 'counselor',
          address: place.address,
          roadAddress: place.roadAddress,
          phone: place.tel,
          category: place.category,
          distance: place.distance,
          coordinates: {
            lat: parseFloat(place.y),
            lng: parseFloat(place.x)
          }
        });
      });
    }

    // Sort by distance and remove duplicates
    const uniqueFacilities = facilities.filter((facility, index, self) => 
      index === self.findIndex(f => f.id === facility.id)
    );

    uniqueFacilities.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.json({ 
      facilities: uniqueFacilities.slice(0, 20), // Return top 20 closest facilities
      totalCount: uniqueFacilities.length,
      searchLocation: { lat: parseFloat(lat), lng: parseFloat(lng) }
    });

  } catch (error) {
    console.error('Error searching nearby facilities:', error);
    res.status(500).json({ error: 'Failed to search nearby facilities' });
  }
};

module.exports = {
  getAddressFromCoords,
  searchLocations,
  searchNearbyFacilities,
};
