import express from 'express';
import Friend from '../models/Friend.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/friends/request/:id
router.post('/request/:id', protect, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }
    
    const existingRequest = await Friend.findOne({
      $or: [
        { requester: req.user._id, recipient: req.params.id },
        { requester: req.params.id, recipient: req.user._id }
      ]
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }
    
    const friendRequest = await Friend.create({
      requester: req.user._id,
      recipient: req.params.id
    });
    
    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/friends/requests
router.get('/requests', protect, async (req, res) => {
  try {
    const requests = await Friend.find({
      recipient: req.user._id,
      status: 'pending'
    }).populate('requester', 'name profilePic year');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/friends/accept/:id
router.put('/accept/:id', protect, async (req, res) => {
  try {
    const friendRequest = await Friend.findOne({
      _id: req.params.id,
      recipient: req.user._id,
      status: 'pending'
    });
    
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    friendRequest.status = 'accepted';
    await friendRequest.save();
    
    // Add to friends list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { friends: friendRequest.requester }
    });
    await User.findByIdAndUpdate(friendRequest.requester, {
      $push: { friends: req.user._id }
    });
    
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/friends/reject/:id
router.put('/reject/:id', protect, async (req, res) => {
  try {
    const friendRequest = await Friend.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id, status: 'pending' },
      { status: 'rejected' }
    );
    
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;