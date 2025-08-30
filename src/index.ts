import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL;
const gmailUser = process.env.GMAIL_APP_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
const destinationEmail = process.env.DESTINATION_EMAIL_ADDRESS;

function checkEnv() {
  let missing = false;
  if (!apiKey) { console.error('Missing GEMINI_API_KEY in .env'); missing = true; }
  if (!modelName) { console.error('Missing GEMINI_MODEL in .env'); missing = true; }
  if (!gmailUser) { console.error('Missing GMAIL_APP_USER in .env'); missing = true; }
  if (!gmailAppPassword) { console.error('Missing GMAIL_APP_PASSWORD in .env'); missing = true; }
  if (!destinationEmail) { console.error('Missing DESTINATION_EMAIL_ADDRESS in .env'); missing = true; }
  if (missing) process.exit(1);
}

async function getGeminiResponse(prompt: string): Promise<string> {
  if (!modelName) {
    throw new Error('GEMINI_MODEL is undefined');
  }
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
  });
  if (!response.text) {
    throw new Error('No response text from Gemini API');
  }
  return response.text;
}

async function sendEmail(subject: string, text: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  await transporter.sendMail({
    from: gmailUser,
    to: destinationEmail,
    subject,
    text,
  });
}

async function main() {
  checkEnv();
  try {
    const aiText = await getGeminiResponse('What is the meaning of life?');
    await sendEmail('Gemini AI Response', aiText);
    console.log('Email sent successfully.');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
