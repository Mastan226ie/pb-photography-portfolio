import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all testimonials (public - only visible)
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find({ visible: true }).sort({ createdAt: -1 });
  res.json(testimonials);
});

// @desc    Fetch all testimonials (admin - all)
// @route   GET /api/testimonials/all
// @access  Private/Admin
router.get('/all', protect, async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  res.json(testimonials);
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { name, role, image, content, rating, date, visible } = req.body;

  const testimonial = new Testimonial({
    name,
    role,
    image,
    content,
    rating,
    date,
    visible: visible !== undefined ? visible : true
  });

  const createdTestimonial = await testimonial.save();
  res.status(201).json(createdTestimonial);
});

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { name, role, image, content, rating, date, visible } = req.body;

  const testimonial = await Testimonial.findById(req.params.id);

  if (testimonial) {
    testimonial.name = name || testimonial.name;
    testimonial.role = role || testimonial.role;
    testimonial.image = image || testimonial.image;
    testimonial.content = content || testimonial.content;
    testimonial.rating = rating || testimonial.rating;
    testimonial.date = date || testimonial.date;
    testimonial.visible = visible !== undefined ? visible : testimonial.visible;

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } else {
    res.status(404).json({ message: 'Testimonial not found' });
  }
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (testimonial) {
    await testimonial.deleteOne();
    res.json({ message: 'Testimonial removed' });
  } else {
    res.status(404).json({ message: 'Testimonial not found' });
  }
});

export default router;
