const express = require('express');
const Event = require('../models/Event');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { upcoming, category, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };

    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }

    if (category) {
      query.category = category;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email avatarUrl')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.find({
      isActive: true,
      startDate: { $gte: new Date() }
    })
    .populate('organizer', 'name email avatarUrl')
    .sort({ startDate: 1 })
    .limit(10);

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatarUrl')
      .populate('attendees.user', 'name email avatarUrl');

    if (!event || !event.isActive) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user._id,
      currentAttendees: 0
    });

    await event.save();
    await event.populate('organizer', 'name email avatarUrl');

    res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('organizer', 'name email avatarUrl');

    res.json({ event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join event
router.post('/:id/join', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already joined
    const alreadyJoined = event.attendees.some(attendee =>
      attendee.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    // Check capacity
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push({
      user: req.user._id,
      joinedAt: new Date()
    });
    event.currentAttendees += 1;

    await event.save();
    await event.populate('attendees.user', 'name email avatarUrl');

    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave event
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find and remove attendee
    const attendeeIndex = event.attendees.findIndex(attendee =>
      attendee.user.toString() === req.user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'Not attending this event' });
    }

    event.attendees.splice(attendeeIndex, 1);
    event.currentAttendees -= 1;

    await event.save();
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;