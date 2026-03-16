const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }

      // Allow Railway domains
      if (origin.includes('railway.app')) {
        return callback(null, true);
      }

      // Allow specific frontend URL if set
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    // Allow Railway domains
    if (origin.includes('railway.app')) {
      return callback(null, true);
    }

    // Allow specific frontend URL if set
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Response helpers (standardize response shape)
app.use(require('./middleware/apiResponse'));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PetConnect')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/user', require('./routes/users')); // Alias for .NET-style endpoints
app.use('/api/v1/pets', require('./routes/pets'));
app.use('/api/v1/pet', require('./routes/pets')); // Alias for .NET-style endpoints
app.use('/api/v1/services', require('./routes/services'));
app.use('/api/v1/service', require('./routes/services')); // Alias for .NET-style endpoints
app.use('/api/v1/bookings', require('./routes/bookings'));
app.use('/api/v1/booking', require('./routes/bookings')); // Alias for .NET-style endpoints
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/payment', require('./routes/payments')); // Alias for .NET-style endpoints
app.use('/api/v1/freelancers', require('./routes/freelancers'));
app.use('/api/v1/freelancer', require('./routes/freelancers')); // Alias for frontend compatibility
app.use('/api/v1/events', require('./routes/events'));
app.use('/api/v1/community', require('./routes/community'));
app.use('/api/v1/notifications', require('./routes/notifications'));
app.use('/api/v1/upload', require('./routes/upload'));
app.use('/api/v1/cloudinary', require('./routes/cloudinary'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Root health check
app.get('/', (req, res) => {
  res.json({ message: 'PetConnect API is running. Use /api/* endpoints.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = parseInt(process.env.PORT, 10) || 8080;

// Start server for Railway deployment
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Local MongoDB'}`);
});

module.exports = { app, server, io };