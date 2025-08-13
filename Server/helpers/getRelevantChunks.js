//core
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from 'langchain/document';

export const getRelevantChunks = async (
  documentContent,
  question,
  topK = 10
) => {
  const docs = documentContent.map(
    (doc) =>
      new Document({ pageContent: doc.pageContent, metadata: doc.metadata })
  );
  const vectors = documentContent.map((doc) => doc.embedding);

  const store = new MemoryVectorStore(new OpenAIEmbeddings());
  await store.addVectors(vectors, docs);

  const relevantDocs = await store.similaritySearch(question, topK);

  const topChunks = relevantDocs.map((doc) => doc.pageContent);

  return topChunks;
};
