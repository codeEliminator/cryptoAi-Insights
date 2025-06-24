import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../configs/AppConfig';

const useGemini = async (prompt: string) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
};

export default useGemini;
