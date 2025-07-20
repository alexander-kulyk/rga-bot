import {
  fetchAllPageContents,
  fetchAllWikiPages,
  createWikiChunks,
  saveChunksToFile,
} from '../helpers/index.js';

const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE) || 500;

/**
 * Get all wiki pages from Azure DevOps
 */
export const getWikiPages = async (req, res) => {
  try {
    const subPages = await fetchAllWikiPages();

    res.json({
      success: true,
      data: subPages,
      count: subPages.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching wiki pages:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wiki pages',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Fetch all wiki content and create chunks
 */
export const fetchAndChunkWikiContent = async (req, res) => {
  try {
    console.log('🚀 Starting wiki content fetch and chunking process...');

    // Step 1: Fetch all wiki pages
    const subPages = await fetchAllWikiPages();

    // Step 2: Fetch content for all pages
    const pageContents = await fetchAllPageContents(subPages);

    // Step 3: Create chunks from the content
    const chunks = createWikiChunks(pageContents, CHUNK_SIZE);

    // Step 4: Save chunks to file
    await saveChunksToFile(chunks);

    res.json({
      success: true,
      message: 'Wiki content fetched and chunked successfully',
      statistics: {
        totalPages: subPages.length,
        pagesWithContent: pageContents.length,
        totalChunks: chunks.length,
        chunkSize: CHUNK_SIZE,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error in fetch-and-chunk process:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch and chunk wiki content',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
