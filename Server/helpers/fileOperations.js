import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_CHUNKS_FILE = path.join(__dirname, '../wikiChunks/wiki_chunks.json');

/**
 * Saves chunks to JSON file
 * @param {Array} chunks - Array of chunk objects to save
 * @param {string} filePath - Optional custom file path (defaults to wiki_chunks.json)
 * @returns {Promise<void>}
 */
export const saveChunksToFile = async (chunks, filePath = WIKI_CHUNKS_FILE) => {
  try {
    console.log(`💾 Saving ${chunks.length} chunks to ${filePath}...`);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // Write chunks to file with proper formatting
    await fs.writeFile(filePath, JSON.stringify(chunks, null, 2), 'utf8');

    console.log(`✅ Successfully saved chunks to ${filePath}`);
  } catch (error) {
    console.error('❌ Error saving chunks to file:', error.message);
    throw error;
  }
};

/**
 * Reads chunks from JSON file
 * @param {string} filePath - Optional custom file path (defaults to wiki_chunks.json)
 * @returns {Promise<Array>} Array of chunk objects
 */
export const readChunksFromFile = async (filePath = WIKI_CHUNKS_FILE) => {
  try {
    const chunksData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(chunksData);
  } catch (error) {
    console.error('❌ Error reading chunks from file:', error.message);
    throw error;
  }
};

/**
 * Checks if chunks file exists
 * @param {string} filePath - Optional custom file path (defaults to wiki_chunks.json)
 * @returns {Promise<boolean>} True if file exists, false otherwise
 */
export const chunksFileExists = async (filePath = WIKI_CHUNKS_FILE) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};
