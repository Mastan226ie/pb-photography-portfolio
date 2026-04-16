import express from 'express';
import Album from '../models/Album.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

// @desc    Fetch all albums
// @route   GET /api/albums
// @access  Public
router.get('/', async (req, res) => {
  const albums = await Album.find({}).sort({ order: 1 });
  res.json(albums);
});

// @desc    Fetch single album
// @route   GET /api/albums/:id
// @access  Public
router.get('/:id', async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (album) {
    res.json(album);
  } else {
    res.status(404).json({ message: 'Album not found' });
  }
});

// @desc    Create an album
// @route   POST /api/albums
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { title, description, coverImage, photos } = req.body;

  const album = new Album({
    title: title || 'New Album',
    description: description || 'Album description',
    coverImage: coverImage || '/uploads/placeholder.jpg',
    photos: photos || [],
    order: (await Album.countDocuments()) + 1
  });

  const createdAlbum = await album.save();
  res.status(201).json(createdAlbum);
});

// @desc    Update an album
// @route   PUT /api/albums/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { title, description, coverImage, photos, order } = req.body;

  const album = await Album.findById(req.params.id);

  if (album) {
    album.title = title || album.title;
    album.description = description || album.description;
    album.coverImage = coverImage || album.coverImage;
    album.photos = photos || album.photos;
    album.order = order !== undefined ? order : album.order;

    const updatedAlbum = await album.save();
    res.json(updatedAlbum);
  } else {
    res.status(404).json({ message: 'Album not found' });
  }
});

// @desc    Delete an album
// @route   DELETE /api/albums/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (album) {
    await album.deleteOne();
    res.json({ message: 'Album removed' });
  } else {
    res.status(404).json({ message: 'Album not found' });
  }
});

// @desc    Upload photo to an album
// @route   POST /api/albums/:id/upload
// @access  Private/Admin
router.post('/:id/upload', protect, upload.single('image'), async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (album) {
    const imageUrl = `/uploads/${req.file.filename}`;
    album.photos.push(imageUrl);
    await album.save();
    res.status(201).json({ message: 'Photo uploaded', url: imageUrl });
  } else {
    res.status(404).json({ message: 'Album not found' });
  }
});

export default router;
