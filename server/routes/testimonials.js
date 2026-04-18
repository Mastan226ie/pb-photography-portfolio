import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { protect } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

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

// @desc    Create a testimonial (Public - Feedback Submission)
// @route   POST /api/testimonials/public
// @access  Public
router.post('/public', async (req, res) => {
  const { name, role, email, content, rating } = req.body;

  try {
    const testimonial = new Testimonial({
      name: name || 'Anonymous',
      role: role || 'Client',
      email: email,
      image: "https://ui-avatars.com/api/?name=" + encodeURIComponent(name || 'Anonymous') + "&background=f59e0b&color=fff",
      content,
      rating: rating || 5,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      visible: false // Admin must approve
    });

    const createdTestimonial = await testimonial.save();

    // Send email notification to admin
    try {
      await sendEmail({
        email: process.env.CONTACT_EMAIL || 'zenitsuko1326@gmail.com',
        subject: `New Client Feedback from ${name}`,
        message: `You have received new feedback:\n\nName: ${name}\nRole/Event: ${role}\nEmail: ${email}\nRating: ${rating} Stars\nContent: ${content}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #f59e0b;">New Portfolio Feedback</h2>
            <p><strong>Client Name:</strong> ${name}</p>
            <p><strong>Event/Role:</strong> ${role}</p>
            <p><strong>Email Address:</strong> ${email}</p>
            <p><strong>Rating:</strong> ${rating} / 5 Stars</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><strong>Feedback Content:</strong></p>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; font-style: italic;">"${content}"</p>
            <p style="font-size: 12px; color: #777;">Note: This feedback is hidden from the public gallery until you approve it in the Admin Panel.</p>
          </div>
        `
      });

      // Send confirmation email to the CLIENT
      await sendEmail({
        email: email,
        subject: `Feedback Shared - PB Photography`,
        message: `Hi ${name},\n\nThank you for sharing your experience! We value your feedback and it helps us improve our photography services.\n\nBest Regards,\nPB Photography Team`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #f59e0b;">We Value Your Feedback!</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you so much for taking the time to share your feedback with <strong>PB Photography</strong>. Your support and words mean a lot to our team!</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #666; font-style: italic;">"${content.length > 50 ? content.substring(0, 50) + '...' : content}"</p>
            </div>
            <p>Once our team reviews and approves your submission, it will be proudly featured in our Client Feedback gallery.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">Warm Regards,<br /><strong>PB Photography Team</strong><br />Vijayawada, India</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Testimonial Email notification failed:', error);
    }

    res.status(201).json(createdTestimonial);
  } catch (error) {
    res.status(400).json({ message: 'Invalid testimonial data' });
  }
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
