import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No image uploaded');
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;
