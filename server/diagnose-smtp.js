import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const diagnoseSMTP = async () => {
  console.log('--- SMTP DIAGNOSIS (GMAIL SERVICE) ---');
  console.log('User:', process.env.SMTP_USER);
  console.log('Pass:', process.env.SMTP_PASS ? '********' : 'MISSING');
  console.log('Target:', process.env.CONTACT_EMAIL || 'zenitsuko1326@gmail.com');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: `"PB Photography System" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'zenitsuko1326@gmail.com',
      subject: '✨ SMTP Diagnosis Successful',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b;">Success!</h1>
          <p>This email confirms that your <strong>Nodemailer Gmail Service</strong> is correctly configured.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });
    console.log('\n✅ SUCCESS!');
    console.log('Response:', info.response);
    console.log('Message ID:', info.messageId);
    console.log('\nPlease check your inbox (and Spam folder) at:', process.env.CONTACT_EMAIL || 'zenitsuko1326@gmail.com');
  } catch (error) {
    console.error('\n❌ FAILURE!');
    console.error(error);
  }
};

diagnoseSMTP();
