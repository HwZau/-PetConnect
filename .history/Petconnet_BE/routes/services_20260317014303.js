const express = require('express');
const Service = require('../models/Service');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category, search, nearby } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query).populate('freelancer', 'name email avatarUrl');
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      'grooming',
      'training',
      'boarding',
      'walking',
      'veterinary',
      'other'
    ];
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('freelancer', 'name email avatarUrl');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ service });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service (Freelancers only)
router.post('/create', auth, async (req, res) => {
  try {
    console.log('Creating service with data:', req.body);
    console.log('User:', req.user._id);

    const service = new Service({
      ...req.body,
      freelancer: req.user._id
    });

    await service.save();
    await service.populate('freelancer', 'name email avatarUrl');

    res.status(201).json({ service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service
router.put('/update/:id', auth, async (req, res) => {
  try {
    console.log('Updating service:', req.params.id);
    console.log('Update data:', req.body);

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check ownership
    if (service.freelancer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('freelancer', 'name email avatarUrl');

    console.log('Service updated successfully:', updatedService);
    res.json({ service: updatedService });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete service
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check ownership
    if (service.freelancer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search services
router.get('/search', async (req, res) => {
  try {
    const { q, category, location } = req.query;
    let query = { isActive: true };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const services = await Service.find(query).populate('freelancer', 'name email avatarUrl location');
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby services
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in km

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    // This is a simplified implementation
    // In production, you'd use MongoDB's geospatial queries
    const services = await Service.find({ isActive: true })
      .populate('freelancer', 'name email avatarUrl location')
      .limit(20);

    // Filter services by distance (simplified)
    const nearbyServices = services.filter(service => {
      if (!service.freelancer.location) return false;
      // Simple distance calculation (not accurate for large distances)
      const distance = Math.sqrt(
        Math.pow(service.freelancer.location.lat - parseFloat(lat), 2) +
        Math.pow(service.freelancer.location.lng - parseFloat(lng), 2)
      ) * 111; // Rough km conversion

      return distance <= parseFloat(radius);
    });

    res.json({ services: nearbyServices });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;