import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { sanitizeInput } from '../utils/validator.js';

const router = express.Router();

// @route   GET /api/posts/feed
router.get('/feed', protect, apiLimiter, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const friendIds = [...req.user.friends, req.user._id];
    
    const posts = await Post.find({ author: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name profilePic year');
    
    const total = await Post.countDocuments({ author: { $in: friendIds } });
    
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + posts.length < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    
    const post = await Post.create({
      author: req.user._id,
      content: sanitizeInput(content),
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    
    await post.populate('author', 'name profilePic year');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const alreadyLiked = post.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
      
      // Emit real-time notification
      const io = req.app.get('io');
      io.to(post.author.toString()).emit('notification', {
        type: 'like',
        from: req.user._id,
        post: post._id
      });
    }
    
    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/posts/:id/comments
router.get('/:id/comments', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id, parentComment: null })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePic');
    
    const replies = await Comment.find({ post: req.params.id, parentComment: { $ne: null } })
      .populate('author', 'name profilePic');
    
    res.json({ comments, replies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    
    const comment = await Comment.create({
      post: req.params.id,
      author: req.user._id,
      content: sanitizeInput(content),
      parentComment: parentComment || null
    });
    
    await comment.populate('author', 'name profilePic');
    
    // Emit real-time notification
    const post = await Post.findById(req.params.id);
    const io = req.app.get('io');
    io.to(post.author.toString()).emit('notification', {
      type: 'comment',
      from: req.user._id,
      post: post._id
    });
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/posts/search
router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    
    const posts = await Post.find({ 
      content: { $regex: q, $options: 'i' } 
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'name profilePic year');
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;