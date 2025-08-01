//services
import askOpenAI from '../services/openaiService.js';
//modules
import getChunkModel from '../models/manualChunkSchema.js';

const askController = async (req, res) => {
  const { question } = req.body;

  const ManualChunk = getChunkModel('dfUserManualChunks');

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const documentContent = await ManualChunk.find(
      {},
      '-createdAt -updatedAt -metadata'
    ).lean();

    const answer = await askOpenAI(documentContent, question);
    return res.json({ answer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default askController;
