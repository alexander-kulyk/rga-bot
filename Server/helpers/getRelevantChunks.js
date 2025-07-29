//core
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';

export const getRelevantChunks = async (
  documentContent,
  question,
  topK = 10
) => {
  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002',
    batchSize: 20,
  });

  const store = await MemoryVectorStore.fromDocuments(
    documentContent,
    embeddings
  );

  const relevantDocs = await store.similaritySearch(question, topK);

  const topChunks = relevantDocs.map((doc) => doc.pageContent);

  return topChunks;
};
