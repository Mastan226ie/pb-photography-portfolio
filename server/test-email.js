import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const sendEmailTest = async () => {
  console.log('Testing email with config:');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);
  console.log('Pass:', process.env.SMTP_PASS ? '********' : 'MISSING');
  console.log('To:', process.env.CONTACT_EMAIL);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, // 587
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test PB Photography" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'zenitsuko1326@gmail.com',
      subject: 'NodeMailer Test',
      text: 'This is a test email to verify SMTP configuration.',
    });
    console.log('SUCCESS!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('FAILURE!');
    console.error(error);
  }
};

sendEmailTest();
