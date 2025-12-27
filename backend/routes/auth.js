import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { validateEmail, sanitizeInput } from '../utils/validator.js';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/signup
router.post('/signup', authLimiter, async (req, res) => {
  try {
    const { name, email, password, year } = req.body;
    
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email. Must be @jaduniv.edu.in' });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({
      name: sanitizeInput(name),
      email,
      password,
      year
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      year: user.year,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      year: user.year,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;