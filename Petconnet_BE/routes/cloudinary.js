const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, imagesDir);
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, videosDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, basename + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Upload to local storage
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Determine file type and path
    let filePath;
    if (req.file.mimetype.startsWith('image/')) {
      filePath = `/uploads/images/${req.file.filename}`;
    } else if (req.file.mimetype.startsWith('video/')) {
      filePath = `/uploads/videos/${req.file.filename}`;
    } else {
      filePath = `/uploads/${req.file.filename}`;
    }

    // Create full URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const fileUrl = `${baseUrl}${filePath}`;

    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: filePath
    });
  } catch (error) {
    console.error('Local upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Upload base64 image
router.post('/upload-base64', auth, async (req, res) => {
  try {
    const { base64, filename = 'image.png' } = req.body;

    if (!base64) {
      return res.status(400).json({ message: 'No base64 data provided' });
    }

    // Decode base64 and save to file
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(filename) || '.png';
    const basename = path.basename(filename, extension);
    const finalFilename = basename + '-' + uniqueSuffix + extension;

    const filePath = path.join(imagesDir, finalFilename);
    fs.writeFileSync(filePath, buffer);

    const fullUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/uploads/images/${finalFilename}`;

    res.json({
      message: 'Image uploaded successfully',
      url: fullUrl,
      filename: finalFilename,
      path: `/uploads/images/${finalFilename}`
    });
  } catch (error) {
    console.error('Base64 upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Upload video
router.post('/upload-video', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Video is already saved by multer, just return the URL
    const filePath = `/uploads/videos/${req.file.filename}`;
    const fileUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}${filePath}`;

    res.json({
      message: 'Video uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: filePath
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Upload base64 video
router.post('/upload-base64-video', auth, async (req, res) => {
  try {
    const { base64, filename = 'video.mp4' } = req.body;

    if (!base64) {
      return res.status(400).json({ message: 'No base64 video data provided' });
    }

    // Decode base64 and save to file
    const base64Data = base64.replace(/^data:video\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(filename) || '.mp4';
    const basename = path.basename(filename, extension);
    const finalFilename = basename + '-' + uniqueSuffix + extension;

    const filePath = path.join(videosDir, finalFilename);
    fs.writeFileSync(filePath, buffer);

    const fullUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/uploads/videos/${finalFilename}`;

    res.json({
      message: 'Video uploaded successfully',
      url: fullUrl,
      filename: finalFilename,
      path: `/uploads/videos/${finalFilename}`
    });
  } catch (error) {
    console.error('Base64 video upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Delete video by filename
router.delete('/video/:filename', auth, async (req, res) => {
  try {
    const filePath = path.join(videosDir, req.params.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Video deleted successfully' });
    } else {
      res.status(404).json({ message: 'Video file not found' });
    }
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Delete video by public ID (for compatibility)
router.delete('/video/public/:filename', auth, async (req, res) => {
  try {
    const filePath = path.join(videosDir, req.params.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Video deleted successfully' });
    } else {
      res.status(404).json({ message: 'Video file not found' });
    }
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Delete file by filename
router.delete('/:filename', auth, async (req, res) => {
  try {
    // Try to find file in images or uploads directory
    let filePath = path.join(imagesDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, req.params.filename);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Delete file by public ID (for compatibility)
router.delete('/public/:filename', auth, async (req, res) => {
  try {
    // Try to find file in images or uploads directory
    let filePath = path.join(imagesDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, req.params.filename);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Get file info by filename
router.get('/:filename', auth, async (req, res) => {
  try {
    // Try to find file in images or uploads directory
    let filePath = path.join(imagesDir, req.params.filename);
    let fileType = 'image';

    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, req.params.filename);
      fileType = 'file';
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(videosDir, req.params.filename);
      fileType = 'video';
    }

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fullUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/uploads/${fileType === 'image' ? 'images' : fileType === 'video' ? 'videos' : ''}/${req.params.filename}`;

      res.json({
        filename: req.params.filename,
        url: fullUrl,
        type: fileType,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get file by public ID (for compatibility)
router.get('/public/:filename', auth, async (req, res) => {
  try {
    // Try to find file in images or uploads directory
    let filePath = path.join(imagesDir, req.params.filename);
    let fileType = 'image';

    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, req.params.filename);
      fileType = 'file';
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(videosDir, req.params.filename);
      fileType = 'video';
    }

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fullUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/uploads/${fileType === 'image' ? 'images' : fileType === 'video' ? 'videos' : ''}/${req.params.filename}`;

      res.json({
        filename: req.params.filename,
        url: fullUrl,
        type: fileType,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transformed URL (for compatibility - return original URL)
router.get('/url/:filename', auth, async (req, res) => {
  try {
    // For local files, just return the original URL
    // Try to find file in images or uploads directory
    let filePath = path.join(imagesDir, req.params.filename);
    let dir = 'images';

    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, req.params.filename);
      dir = '';
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(videosDir, req.params.filename);
      dir = 'videos';
    }

    if (fs.existsSync(filePath)) {
      const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/uploads/${dir ? dir + '/' : ''}${req.params.filename}`;
      res.json({ url });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Get URL error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video by filename
router.get('/video/:filename', auth, async (req, res) => {
  try {
    const filePath = path.join(videosDir, req.params.filename);

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/uploads/videos/${req.params.filename}`;

      res.json({
        filename: req.params.filename,
        url: url,
        type: 'video',
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all uploads (list files from local directories)
router.get('/', auth, async (req, res) => {
  try {
    const uploads = [];

    // Read images directory
    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir);
      imageFiles.forEach(filename => {
        const filePath = path.join(imagesDir, filename);
        const stats = fs.statSync(filePath);
        uploads.push({
          filename,
          url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/uploads/images/${filename}`,
          type: 'image',
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        });
      });
    }

    // Read videos directory
    if (fs.existsSync(videosDir)) {
      const videoFiles = fs.readdirSync(videosDir);
      videoFiles.forEach(filename => {
        const filePath = path.join(videosDir, filename);
        const stats = fs.statSync(filePath);
        uploads.push({
          filename,
          url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/uploads/videos/${filename}`,
          type: 'video',
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        });
      });
    }

    res.json({ uploads });
  } catch (error) {
    console.error('Get uploads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;