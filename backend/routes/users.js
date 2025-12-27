import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { sanitizeInput } from '../utils/validator.js';

const router = express.Router();

// @route   GET /api/users/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @route   GET /api/users/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'name profilePic year');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePic year');
    
    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
  try {
    const { bio } = req.body;
    
    const updateData = {};
    if (bio !== undefined) updateData.bio = sanitizeInput(bio);
    if (req.file) updateData.profilePic = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/search
router.get('/search/query', protect, async (req, res) => {
  try {
    const { q } = req.query;
    
    const users = await User.find({
      name: { $regex: q, $options: 'i' },
      _id: { $ne: req.user._id }
    })
      .select('name profilePic year')
      .limit(10);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;