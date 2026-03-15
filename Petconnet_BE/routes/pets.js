const express = require('express');
const Pet = require('../models/Pet');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all pets
router.get('/getall', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ status: 'active' }).populate('owner', 'name email');
    return res.apiSuccess(pets, 'Pets retrieved successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Get pet by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'name email');
    if (!pet) {
      return res.apiError('Pet not found', 404);
    }
    return res.apiSuccess(pet, 'Pet retrieved successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Get user's pets
router.get('/user/:userId/pets', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.params.userId, status: 'active' });
    return res.apiSuccess(pets, 'Pets retrieved successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Create pet
router.post('/create', auth, async (req, res) => {
  try {
    const pet = new Pet({
      ...req.body,
      owner: req.user._id
    });

    await pet.save();
    await pet.populate({
      path: 'owner',
      select: 'name email',
      options: { strictPopulate: false }
    });

    return res.apiSuccess(pet, 'Pet created successfully', 201);
  } catch (error) {
    console.error('Error creating pet:', error);
    return res.apiError('Server error');
  }
});

// Update pet
router.put('/update/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.apiError('Pet not found', 404);
    }

    // Check ownership
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.apiError('Not authorized', 403);
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email');

    return res.apiSuccess(updatedPet, 'Pet updated successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Delete pet
router.delete('/remove/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.apiError('Pet not found', 404);
    }

    // Check ownership
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.apiError('Not authorized', 403);
    }

    await Pet.findByIdAndDelete(req.params.id);
    return res.apiSuccess(null, 'Pet deleted successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Edit pet (alias for update)
router.put('/edit/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.apiError('Pet not found', 404);
    }

    // Check ownership
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.apiError('Not authorized', 403);
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email');

    return res.apiSuccess(updatedPet, 'Pet updated successfully');
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Add pet (alias for create)
router.post('/add/:id', auth, async (req, res) => {
  try {
    const pet = new Pet({
      ...req.body,
      owner: req.params.id
    });

    await pet.save();
    await pet.populate('owner', 'name email');

    return res.apiSuccess(pet, 'Pet created successfully', 201);
  } catch (error) {
    return res.apiError('Server error');
  }
});

// Add pet to user (alternative endpoint)
router.post('/:userId', auth, async (req, res) => {
  try {
    // Check if user can add pet for this user
    if (req.params.userId !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.apiError('Not authorized', 403);
    }

    const pet = new Pet({
      ...req.body,
      owner: req.params.userId
    });

    await pet.save();
    await pet.populate({
      path: 'owner',
      select: 'name email',
      options: { strictPopulate: false }
    });

    return res.apiSuccess(pet, 'Pet created successfully', 201);
  } catch (error) {
    console.error('Error adding pet to user:', error);
    return res.apiError('Server error');
  }
});

module.exports = router;