import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import { cleanEnv, str, email } from 'envalid';

const env = cleanEnv(process.env, {
  GOOGLE_GENAI_API_KEY: str(),
  GOOGLE_GENAI_MODEL: str(),
  GMAIL_APP_USER: str(),
  GMAIL_APP_PASSWORD: str(),
  DESTINATION_EMAIL_ADDRESS: email(),
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
    text,
  });
}

async function main() {
  try {
    const aiText = await getGoogleGenAIResponse('What is the meaning of life?');
    await sendEmail('GoogleGenAI Response', aiText);
    console.log('Email sent successfully.');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
