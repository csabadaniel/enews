
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import { cleanEnv, str, email } from 'envalid';

function cleanCodeBlockMarkers(text: string): string {
  // Remove leading/trailing code block markers like ```html and ```
  return text.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
}

const env = cleanEnv(process.env, {
  GOOGLE_GENAI_API_KEY: str(),
  GOOGLE_GENAI_MODEL: str(),
  GMAIL_APP_USER: str(),
  GMAIL_APP_PASSWORD: str(),
  DESTINATION_EMAIL_ADDRESS: email(),
  EMAIL_SUBJECT: str(),
  GOOGLE_GENAI_PROMPT: str(),
});

async function getGoogleGenAIResponse(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GENAI_API_KEY });
  const response = await ai.models.generateContent({
    model: env.GOOGLE_GENAI_MODEL,
    contents: prompt,
  });
  if (!response.text) {
    throw new Error('No response text from GoogleGenAI API');
  }
  return response.text;
}

async function sendEmail(subject: string, text: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL_APP_USER,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: env.GMAIL_APP_USER,
    to: env.DESTINATION_EMAIL_ADDRESS,
    subject,
    html: text,
  });
}

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const aiTextRaw = await getGoogleGenAIResponse(env.GOOGLE_GENAI_PROMPT);
    const aiText = cleanCodeBlockMarkers(aiTextRaw);
    await sendEmail(env.EMAIL_SUBJECT, aiText);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully.' }),
    };
  } catch (err: any) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
