//core
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import mammoth from 'mammoth';
//other
import getChunkModel from '../models/manualChunkSchema.js';

// Load and extract plain text from the DOCX file

const loadDocx = async (buffer, fileName) => {
  const collName = fileName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

  const ChunkModel = getChunkModel(collName);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // target ~1000 characters per chunk
    chunkOverlap: 200, // 200 characters overlap between neighbors
    separators: ['\n\n', '\n', ' ', ''],
  });

  try {
    const result = await mammoth.extractRawText({ buffer });
    const docs = await splitter.createDocuments([result.value]);
    await ChunkModel.insertMany(
      docs.map((doc, i) => ({
        pageContent: doc.pageContent,
        metadata: doc.metadata,
      }))
    );
  } catch (err) {
    console.error(`Error reading or parsing ${filePath}:`, err);
    throw new Error('Failed to load document');
  }
};

export default loadDocx;
