const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Single file upload
router.post('/single', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Multiple files upload
router.post('/multiple', auth, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    }));

    res.json({
      message: 'Files uploaded successfully',
      files
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Avatar upload
router.post('/avatar', auth, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No avatar uploaded' });
    }

    // Update user's avatar URL
    const User = require('../models/User');
    User.findByIdAndUpdate(req.user._id, {
      avatarUrl: `/uploads/${req.file.filename}`
    });

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Pet photo upload
router.post('/pet-photo', auth, upload.single('petPhoto'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No pet photo uploaded' });
    }

    res.json({
      message: 'Pet photo uploaded successfully',
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;