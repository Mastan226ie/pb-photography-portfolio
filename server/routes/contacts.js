import express from 'express';
import Contact from '../models/Contact.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Submit a contact form (public)
// @route   POST /api/contacts
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, phone, eventType, message } = req.body;

  const contact = new Contact({
    name,
    email,
    phone,
    eventType,
    message
  });

  const createdContact = await contact.save();
  res.status(201).json(createdContact);
});

// @desc    Fetch all contact submissions (admin)
// @route   GET /api/contacts
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Mark contact as read
// @route   PATCH /api/contacts/:id/read
// @access  Private/Admin
router.patch('/:id/read', protect, async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.read = true;
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

// @desc    Delete a contact submission
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

export default router;
