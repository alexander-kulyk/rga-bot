//core
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const parentPath = process.env.AZURE_DEVOPS_PARENT_PATH;
const organizationName = process.env.ORGANIZATION_NAME;
const projectName = process.env.PROJECT_NAME;
const PAT = process.env.AZURE_DEVOPS_PAT;
const projectId = process.env.PROJECT_ID;

// Validate required environment variables
if (!PAT) {
  throw new Error('AZURE_DEVOPS_PAT environment variable is required');
}

/**
 * Fetches all wiki pages from Azure DevOps
 * @returns {Promise<Array>} Array of wiki page objects
 */
export const fetchAllWikiPages = async () => {
  try {
    console.log('🔍 Fetching wiki pages batch...');

    // First, get all pages using pagesbatch API
    const batchResponse = await axios.post(
      `https://dev.azure.com/${organizationName}/${projectName}/_apis/wiki/wikis/${projectId}/pagesbatch?api-version=7.1-preview.1`,
      { top: 100 },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(':' + PAT).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const allPages = batchResponse.data.value || [];
    console.log(`📄 Found ${allPages.length} total pages`);

    // Filter subpages under the parent path
    const subPages = allPages.filter(
      (page) =>
        page.path.startsWith(parentPath + '/') && page.path !== parentPath
    );

    console.log(`📁 Found ${subPages.length} subpages under ${parentPath}`);

    return subPages;
  } catch (error) {
    console.error('❌ Error fetching wiki pages batch:', error.message);
    throw error;
  }
};

/**
 * Fetches content for a specific wiki page
 * @param {string} pagePath - The path of the wiki page
 * @returns {Promise<Object>} Page content object with path and content
 */
export const fetchPageContent = async (pagePath) => {
  try {
    const response = await axios.get(
      `https://dev.azure.com/${organizationName}/${projectName}/_apis/wiki/wikis/${projectName}.wiki/pages`,
      {
        params: {
          path: pagePath,
          includeContent: true,
          'api-version': '7.1-preview.1',
        },
        headers: {
          Authorization: `Basic ${Buffer.from(':' + PAT).toString('base64')}`,
          Accept: 'application/json',
        },
      }
    );

    return {
      path: pagePath,
      content: response.data.content || '',
    };
  } catch (error) {
    console.warn(`❌ Failed to fetch content for ${pagePath}:`, error.message);
    return {
      path: pagePath,
      content: '',
    };
  }
};

/**
 * Fetches content for all pages with rate limiting
 * @param {Array} subPages - Array of page objects to fetch content for
 * @returns {Promise<Array>} Array of page content objects
 */
export const fetchAllPageContents = async (subPages) => {
  const pageContents = [];
  const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 5; // Process 5 pages at a time to avoid rate limiting
  const DELAY_MS = parseInt(process.env.DELAY_MS) || 1000; // 1 second delay between batches

  console.log(`🔄 Fetching content for ${subPages.length} pages...`);

  for (let i = 0; i < subPages.length; i += BATCH_SIZE) {
    const batch = subPages.slice(i, i + BATCH_SIZE);
    console.log(
      `📥 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
        subPages.length / BATCH_SIZE
      )}`
    );

    const batchPromises = batch.map((page) => fetchPageContent(page.path));
    const batchResults = await Promise.all(batchPromises);

    pageContents.push(...batchResults.filter((result) => result.content));

    // Add delay between batches (except for the last batch)
    if (i + BATCH_SIZE < subPages.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log(
    `✅ Successfully fetched content for ${pageContents.length} pages`
  );
  return pageContents;
};
