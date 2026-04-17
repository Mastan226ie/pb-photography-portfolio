import express from 'express';
import Contact from '../models/Contact.js';
import { protect } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// @desc    Submit a contact form (public)
// @route   POST /api/contacts
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, phone, eventType, message } = req.body;

  try {
    const contact = new Contact({
      name,
      email,
      phone,
      eventType,
      message
    });
    const createdContact = await contact.save();

    // Send emails in parallel for better performance and reliability
    const adminEmailPromise = sendEmail({
      email: process.env.CONTACT_EMAIL || 'zenitsuko1326@gmail.com',
      subject: `New Contact Inquiry from ${name}`,
      message: `You have a new inquiry:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nEvent Type: ${eventType}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #f59e0b; border-radius: 10px;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">New Contact Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${eventType || 'N/A'}</td></tr>
          </table>
          <p><strong>Message:</strong></p>
          <div style="background: #fdf6e7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">${message}</div>
          <p style="font-size: 11px; color: #999; margin-top: 20px;">Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    const clientEmailPromise = sendEmail({
      email: email,
      subject: `Confirmation: We've received your inquiry - PB Photography`,
      message: `Hi ${name},\n\nThank you for reaching out! We have received your inquiry regarding a ${eventType} session. We will review the details and get back to you shortly.\n\nBest Regards,\nPB Photography Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #f59e0b;">Thank You for Reaching Out!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>We've received your request for a <strong>${eventType}</strong> photography session. We're excited to learn more about your story!</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 14px; color: #666;"><strong>Summary of your inquiry:</strong></p>
            <p style="margin: 5px 0; font-style: italic;">"${message.length > 100 ? message.substring(0, 100) + '...' : message}"</p>
          </div>
          <p>Our team will review your details and contact you via email or phone within the next 24-48 hours.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Best Regards,<br /><strong>PB Photography Team</strong><br />Vijayawada, India</p>
        </div>
      `
    });

    // Wait for all email attempts to finish
    await Promise.allSettled([adminEmailPromise, clientEmailPromise]);

    res.status(201).json(createdContact);
  } catch (error) {
    console.error('Core inquiry processing failed:', error);
    res.status(500).json({ message: 'Server error while processing inquiry' });
  }
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
