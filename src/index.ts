import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL;
const gmailUser = process.env.GMAIL_APP_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
const destinationEmail = process.env.DESTINATION_EMAIL_ADDRESS;

async function main() {
  if (!apiKey || !modelName || !gmailUser || !gmailAppPassword || !destinationEmail) {
    if (!apiKey) console.error('Missing GEMINI_API_KEY in .env');
    if (!modelName) console.error('Missing GEMINI_MODEL in .env');
    if (!gmailUser) console.error('Missing GMAIL_APP_USER in .env');
    if (!gmailAppPassword) console.error('Missing GMAIL_APP_PASSWORD in .env');
    if (!destinationEmail) console.error('Missing DESTINATION_EMAIL_ADDRESS in .env');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'What is the meaning of life?',
    });
    const aiText = response.text;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const mailOptions = {
      from: gmailUser,
      to: destinationEmail,
      subject: 'Gemini AI Response',
      text: aiText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('Error sending email:', error);
      }
      console.log('Email sent:', info.response);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
