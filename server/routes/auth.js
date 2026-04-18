import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Set token and expiry on user model
  user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password/${resetToken}`;

  const message = `You are receiving this email because a password reset was requested for your account. Please click the link below to reset your password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message: message,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link will expire in 15 minutes.</p>`
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    res.status(500).json({ message: 'Email could not be sent' });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
router.put('/reset-password/:resetToken', async (req, res) => {
  // Get hashed token
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetToken,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  // Set new password
  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.status(200).json({
    _id: user._id,
    email: user.email,
    token: generateToken(user._id),
  });
});

export default router;
