#!/usr/bin/env node

/**
 * Manual script to trigger wiki content fetching and chunking
 * Usage: node scripts/update-wiki-chunks.js
 */

import axios from 'axios';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5002';
const WIKI_API = `${SERVER_URL}/api/wiki`;

async function updateWikiChunks() {
  console.log('🚀 Starting wiki chunks update process...\n');

  try {
    console.log('📡 Triggering fetch-and-chunk process...');

    const response = await axios.post(
      `${WIKI_API}/fetch-and-chunk`,
      {},
      {
        timeout: 300000, // 5 minutes timeout
      }
    );

    if (response.data.success) {
      console.log('✅ Wiki chunks updated successfully!\n');
      console.log('📊 Statistics:');
      console.log(`   • Total pages: ${response.data.statistics.totalPages}`);
      console.log(
        `   • Pages with content: ${response.data.statistics.pagesWithContent}`
      );
      console.log(
        `   • Total chunks created: ${response.data.statistics.totalChunks}`
      );
      console.log(
        `   • Chunk size: ${response.data.statistics.chunkSize} characters`
      );
      console.log(`   • Completed at: ${response.data.timestamp}\n`);

      // Verify chunks were saved
      console.log('🔍 Verifying saved chunks...');
      const chunksResponse = await axios.get(`${WIKI_API}/chunks`);

      if (chunksResponse.data.success) {
        console.log(
          `✅ Verification successful - ${chunksResponse.data.count} chunks available`
        );
      } else {
        console.log(
          '❌ Verification failed - chunks may not have been saved properly'
        );
      }
    } else {
      console.error('❌ Update failed:', response.data.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error updating wiki chunks:');

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(
        `   Message: ${error.response.data?.message || error.message}`
      );
    } else if (error.request) {
      console.error('   No response received from server');
      console.error('   Make sure the server is running on', SERVER_URL);
    } else {
      console.error(`   ${error.message}`);
    }

    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Process interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Process terminated');
  process.exit(0);
});

// Run the update
updateWikiChunks();
