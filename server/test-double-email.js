import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const testDoubleEmail = async () => {
  console.log('--- TESTING DOUBLE EMAIL SEND ---');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log('Sending Email 1 (Admin Notification)...');
    const info1 = await transporter.sendMail({
      from: `"Admin System" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'zenitsuko1326@gmail.com',
      subject: 'Double Test - Email 1',
      text: 'Notification to Admin',
    });
    console.log('✅ Email 1 Sent:', info1.messageId);

    console.log('\nSending Email 2 (Client Confirmation)...');
    const info2 = await transporter.sendMail({
      from: `"PB Photography" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'zenitsuko1326@gmail.com', // testing to same for now
      subject: 'Double Test - Email 2',
      text: 'Confirmation to Client',
    });
    console.log('✅ Email 2 Sent:', info2.messageId);

  } catch (error) {
    console.error('\n❌ DOUBLE SEND FAILURE!');
    console.error(error);
  }
};

testDoubleEmail();
