//core
import {
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
} from 'langchain/text_splitter';
//other
import getFileOptionsModel from '../models/fileOptionsSchema.js';
import getChunkModel from '../models/manualChunkSchema.js';
import { getExtractedText } from './getExtractedText.js';
import createVectors from './createVectors.js';

// Load and extract plain text from DOCX, PDF, or Excel files
const loadDocx = async (buffer, fileName) => {
  const collName = fileName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

  const ChunkModel = getChunkModel(collName);
  const FileOptionsModel = getFileOptionsModel();

  // const splitter = new RecursiveCharacterTextSplitter({
  //   chunkSize: 1000, // target ~1000 characters per chunk
  //   chunkOverlap: 200, // 200 characters overlap between neighbors
  //   separators: ['\n\n', '\n', ' ', ''],
  // });

  const splitter = new TokenTextSplitter({
    encodingName: 'cl100k_base', // Encoding for OpenAI's models
    chunkSize: 500, // target ~500 tokens per chunk
    chunkOverlap: 50,
  });

  try {
    const extractedText = await getExtractedText(buffer, fileName);

    const splittedDocument = await splitter.createDocuments([extractedText]);

    const documentsWithVectors = await createVectors(splittedDocument);

    await FileOptionsModel.insertMany({
      name: collName,
      isDefault: false,
      tags: [],
    });

    await ChunkModel.insertMany(
      documentsWithVectors.map((doc, i) => ({
        pageContent: doc.pageContent,
        embedding: doc.embedding,
        metadata: doc.metadata,
      }))
    );
  } catch (err) {
    console.error(`Error reading or parsing ${fileName}:`, err);
    throw new Error('Failed to load document');
  }
};

export default loadDocx;
