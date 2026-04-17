import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import albumRoutes from './routes/albums.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contacts.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Validate environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CLIENT_URL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName] || process.env[varName].includes('CHANGE_ME'));

if (missingEnvVars.length > 0) {
  console.error('\nMISSING ENVIRONMENT VARIABLES:');
  missingEnvVars.forEach(v => console.error(`   - ${v}`));
  console.error('\nPlease update your .env file to continue.\n');
  process.exit(1);
}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Static folders
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes placeholders
app.get('/', (req, res) => {
  res.send('PB Photography API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/upload', uploadRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
