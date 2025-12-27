import express from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';
import { sanitizeInput } from '../utils/validator.js';

const router = express.Router();

// @route   GET /api/events
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .populate('creator', 'name profilePic')
      .populate('attendees', 'name profilePic');
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/events
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    const event = await Event.create({
      creator: req.user._id,
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      date,
      location: sanitizeInput(location),
      attendees: [req.user._id]
    });
    
    await event.populate('creator', 'name profilePic');
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/events/:id/rsvp
router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const alreadyAttending = event.attendees.includes(req.user._id);
    
    if (alreadyAttending) {
      event.attendees = event.attendees.filter(id => id.toString() !== req.user._id.toString());
    } else {
      event.attendees.push(req.user._id);
    }
    
    await event.save();
res.json({ attending: !alreadyAttending, attendeesCount: event.attendees.length });
} catch (error) {
res.status(500).json({ message: error.message });
}
});
export default router;