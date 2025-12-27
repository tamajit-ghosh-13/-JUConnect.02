import express from 'express';
import Post from '../models/Post.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   DELETE /api/admin/posts/:id
router.delete('/posts/:id', protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;