# PetConnect - Local Development Setup

This guide will help you set up and run the PetConnect application locally for development.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation)
- Git

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd Pawnet
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd Petconnet_BE
   npm install

   # Frontend
   cd ../Petconnet_FE
   npm install
   ```

3. **Start MongoDB:**
   ```bash
   net start MongoDB
   ```

4. **Start development servers:**
   ```bash
   # Option 1: Use the automated script (Windows)
   start-dev.bat

   # Option 2: Manual start
   # Terminal 1 - Backend
   cd Petconnet_BE
   npm run dev

   # Terminal 2 - Frontend
   cd Petconnet_FE
   npm run dev
   ```

## Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5002
- **MongoDB:** mongodb://localhost:27017/PetConnect

## Environment Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/PetConnect
JWT_SECRET=petconnect-local-development-secret-key-2024
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5002/api/v1
VITE_WS_URL=ws://localhost:5002
VITE_PAYMENT_SUCCESS_URL=http://localhost:5173/payment-success
VITE_PAYMENT_FAILURE_URL=http://localhost:5173/payment-failure
```

## Features Available Locally

- ✅ User authentication (register/login)
- ✅ Profile management (customer/freelancer)
- ✅ Pet management
- ✅ Service listings
- ✅ Booking system
- ✅ Community posts
- ✅ WebSocket real-time features
- ✅ **Local file uploads** (images/videos stored in `Petconnet_BE/uploads/`)
- ✅ Payment processing (mock/local)

## File Storage

The application now uses local file storage instead of Cloudinary:

- **Images**: Stored in `Petconnet_BE/uploads/images/`
- **Videos**: Stored in `Petconnet_BE/uploads/videos/`
- **Other files**: Stored in `Petconnet_BE/uploads/`

Files are accessible via: `http://localhost:5173/uploads/[type]/[filename]`

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `net start MongoDB`
- Check if port 5002 is available
- Check backend logs for errors

### Frontend won't connect to backend
- Verify backend is running on port 5002
- Check CORS settings in backend
- Check API_BASE_URL in frontend .env

### WebSocket not connecting
- Ensure backend WebSocket is enabled
- Check VITE_WS_URL in frontend .env
- Check browser console for connection errors

### Database connection issues
- Ensure MongoDB is running
- Check MONGODB_URI in backend .env
- Verify database name is correct

## Development Notes

- All API calls are configured for local development
- WebSocket is enabled for real-time features
- CORS is configured for localhost origins
- No production deployments or external services required
- All data is stored locally in MongoDB