import axios from 'axios';

// Test the wiki endpoints
const BASE_URL = 'http://localhost:5002/api/wiki';

async function testWikiEndpoints() {
  try {
    console.log('🧪 Testing Wiki API endpoints...\n');

    // Test 1: Fetch wiki pages
    console.log('1. Testing /pages endpoint...');
    try {
      const pagesResponse = await axios.get(`${BASE_URL}/pages`);
      console.log(
        `✅ Pages endpoint working - Found ${pagesResponse.data.count} pages`
      );
    } catch (error) {
      console.log(`❌ Pages endpoint failed: ${error.message}`);
    }

    // Test 2: Fetch and chunk wiki content
    console.log('\n2. Testing /fetch-and-chunk endpoint...');
    try {
      const chunkResponse = await axios.post(`${BASE_URL}/fetch-and-chunk`);
      console.log(`✅ Fetch-and-chunk completed successfully:`);
      console.log(
        `   - Total pages: ${chunkResponse.data.statistics.totalPages}`
      );
      console.log(
        `   - Pages with content: ${chunkResponse.data.statistics.pagesWithContent}`
      );
      console.log(
        `   - Total chunks: ${chunkResponse.data.statistics.totalChunks}`
      );
    } catch (error) {
      console.log(`❌ Fetch-and-chunk failed: ${error.message}`);
    }

    // Test 3: Get saved chunks
    console.log('\n3. Testing /chunks endpoint...');
    try {
      const chunksResponse = await axios.get(`${BASE_URL}/chunks`);
      console.log(
        `✅ Chunks endpoint working - Found ${chunksResponse.data.count} chunks`
      );
    } catch (error) {
      console.log(`❌ Chunks endpoint failed: ${error.message}`);
    }

    // Test 4: Search in chunks
    console.log('\n4. Testing /chunks/search endpoint...');
    try {
      const searchResponse = await axios.get(
        `${BASE_URL}/chunks/search?query=SignalR&limit=5`
      );
      console.log(
        `✅ Search endpoint working - Found ${searchResponse.data.count} matching chunks`
      );
    } catch (error) {
      console.log(`❌ Search endpoint failed: ${error.message}`);
    }
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Wait a bit for server to start, then run tests
setTimeout(testWikiEndpoints, 2000);
