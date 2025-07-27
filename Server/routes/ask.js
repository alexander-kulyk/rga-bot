//core
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';
import express from 'express';
import axios from 'axios';
import path from 'path';
import 'dotenv/config';
//modules
import ManualChunk from '../models/manualChunkSchema.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = express.Router();

// 1. Load and extract plain text from the DOCX file
const loadDocx = async (filePath) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // target ~1000 characters per chunk
    chunkOverlap: 200, // 200 characters overlap between neighbors
    separators: ['\n\n', '\n', ' ', ''],
  });

  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const docs = await splitter.createDocuments([result.value]);

    await ManualChunk.insertMany(
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

// 2. Send prompt to OpenAI and return the answer
const askOpenAI = async (documentContent, question, topK = 20) => {
  const embeddings = new OpenAIEmbeddings();

  const store = await MemoryVectorStore.fromDocuments(
    documentContent,
    embeddings
  );
  // 3) Пошук найбільш схожих документів
  const relevantDocs = await store.similaritySearch(question, topK);
  // Повертаємо лише текст чанків
  const topChunks = relevantDocs.map((doc) => doc.pageContent);

  const prompt = `
Use ONLY the following excerpts to answer. If you don’t know, say so:

${topChunks.join('\n\n')}

Question: ${question}
Answer:
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a technical multilingual assistant. Always detect and respond in the language used in the question. Only answer based on the provided documentation. If the answer cannot be found, say "respond with an equivalent of "I do not know" in the question\'s language.". Do not make assumptions or fabricate information. Your tone should be concise, neutral, and professional. Respond in Markdown format if appropriate. Use bullet points or numbered lists where helpful. Do not include any disclaimers or introductions.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('OpenAI request failed:', err.response?.data || err.message);
    throw new Error('AI request failed');
  }
};

router.post('/', async (req, res) => {
  const { question } = req.body;
  console.log('question', question);
  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    // Adjust the path to your DOCX file
    // const documentContent = await loadDocx(
    //   path.join(__dirname, '../userManual.docx')
    // );

    const documentContent = await ManualChunk.find(
      {},
      '-createdAt -updatedAt -metadata'
    ).lean();

    const answer = await askOpenAI(documentContent, question);
    return res.json({ answer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
