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

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
