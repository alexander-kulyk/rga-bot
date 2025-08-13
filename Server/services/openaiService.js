//core
import axios from 'axios';
//helpers
import { getRelevantChunks } from '../helpers/getRelevantChunks.js';

//  Send prompt to OpenAI and return the answer
const askOpenAI = async (documentContent, question, topK = 10) => {
  const relevantChunks = await getRelevantChunks(
    documentContent,
    question,
    topK
  );

  const prompt = `
Use ONLY the following excerpts to answer. If you don’t know, say so:

${relevantChunks.join('\n\n')}

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

    return {
      id: response.data.id,
      created: response.data.created,
      model: response.data.model,
      message: response.data.choices[0].message,
      usage: {
        prompt_tokens: response.data.usage.prompt_tokens,
        completion_tokens: response.data.usage.completion_tokens,
        total_tokens: response.data.usage.total_tokens,
      },
    };
  } catch (err) {
    console.error('OpenAI request failed:', err.response?.data || err.message);
    throw new Error('AI request failed');
  }
};

export default askOpenAI;
