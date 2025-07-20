/**
 * Text processing utilities for wiki content
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE) || 500; // Maximum characters per chunk

/**
 * Creates text chunks from content with specified maximum size
 * @param {string} text - The text content to chunk
 * @param {number} maxChunkSize - Maximum characters per chunk
 * @returns {string[]} Array of text chunks
 */
export const createTextChunks = (text, maxChunkSize = CHUNK_SIZE) => {
  if (!text || text.length <= maxChunkSize) {
    return [text || ''];
  }

  const chunks = [];
  let currentChunk = '';
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length + 1 <= maxChunkSize) {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        // Handle very long sentences by splitting them
        const words = sentence.split(' ');
        for (const word of words) {
          if (currentChunk.length + word.length + 1 <= maxChunkSize) {
            currentChunk += (currentChunk ? ' ' : '') + word;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = word;
          }
        }
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.length > 0 ? chunks : [''];
};

/**
 * Creates wiki chunks from page contents
 * @param {Array} pageContents - Array of page content objects
 * @param {number} chunkSize - Maximum size for each chunk
 * @returns {Array} Array of wiki chunks with metadata
 */
export const createWikiChunks = (pageContents, chunkSize = CHUNK_SIZE) => {
  console.log('🔪 Creating chunks from page contents...');

  const allChunks = [];

  for (const pageContent of pageContents) {
    if (!pageContent.content || pageContent.content.trim().length === 0) {
      continue;
    }

    const chunks = createTextChunks(pageContent.content, chunkSize);

    chunks.forEach((chunk, index) => {
      if (chunk.trim()) {
        allChunks.push({
          path: pageContent.path,
          chunkIndex: index,
          chunk: chunk.trim(),
        });
      }
    });
  }

  console.log(
    `📦 Created ${allChunks.length} chunks from ${pageContents.length} pages`
  );
  return allChunks;
};
