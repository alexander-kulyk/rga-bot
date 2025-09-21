//services
import askOpenAI from '../services/openaiService.js';
//modules
import getChunkModel from '../models/manualChunkSchema.js';
import getModelConfigsModel from '../models/modelConfigs.js';

const askController = async (req, res) => {
  const { question, collectionName } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!collectionName || !collectionName.trim()) {
    return res
      .status(400)
      .json({ error: 'Oops! You need to select a document first' });
  }

  const ManualChunk = getChunkModel(collectionName);
  const ModelConfigs = getModelConfigsModel();

  try {
    const documentContent = await ManualChunk.find(
      {},
      '-createdAt -updatedAt -metadata'
    ).lean();

    const configs = await ModelConfigs.find({}).sort({ createdAt: -1 });

    const result = await askOpenAI(documentContent, question, 10, configs[0]);

    return res.json({
      message: result.message.content,
      id: result.id,
      created: result.created,
      model: result.model,
      usage: result.usage,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default askController;
