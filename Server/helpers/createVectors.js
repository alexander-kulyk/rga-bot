import { OpenAIEmbeddings } from '@langchain/openai';

const createVectors = async (documentContent) => {
  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002',
    batchSize: 20,
  });

  const vectors = await embeddings.embedDocuments(
    documentContent.map((doc) => doc.pageContent)
  );

  const documentsWithVectors = documentContent.map((doc, index) => ({
    ...doc,
    embedding: vectors[index],
  }));

  return documentsWithVectors;
};

export default createVectors;
