import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL;

async function main() {
  if (!apiKey || !modelName) {
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY in .env');
    }
    if (!modelName) {
      console.error('Missing GEMINI_MODEL in .env');
    }
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'What is the meaning of life?',
    });
    console.log(response.text);
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
