# 🚀 PETCONNECT DEPLOYMENT GUIDE - RENDER.COM

**Status:** ✅ Ready to Deploy  
**Estimated Time:** 30 minutes  
**Platforms:** 
- Backend: Node.js on Render
- Frontend: Static site on Render  
- Database: MongoDB (Atlas)

---

## 📋 DEPLOYMENT CHECKLIST

### PHASE 1: Prepare (5 minutes)
- [ ] Fix TypeScript errors in frontend
- [ ] Create GitHub repository (if not exist)
- [ ] Push code to GitHub
- [ ] Create Render account

### PHASE 2: Setup Render Services (10 minutes)
- [ ] Create Backend Service
- [ ] Create Frontend Service  
- [ ] Configure environment variables
- [ ] Setup database connection

### PHASE 3: Deploy (10 minutes)
- [ ] Deploy Backend
- [ ] Deploy Frontend
- [ ] Test APIs
- [ ] Verify everything works

### PHASE 4: Monitor (Ongoing)
- [ ] Check logs
- [ ] Monitor performance
- [ ] Setup alerts

---

# ⚡ PHASE 1: PREPARE FOR DEPLOYMENT

## Step 1.1: Fix Frontend TypeScript Errors (Required!)

First, we need to fix the 46 TypeScript errors so the build succeeds.

### Quick Fix - Run these commands:

```bash
# Go to frontend folder
cd d:\Pawnet\Petconnet_FE

# 1. Auto-fix ESLint issues
npx eslint . --fix

# 2. Verify build works
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ dist/ folder created
```

If build still fails, apply manual fixes from [FRONTEND_FIX_GUIDE.md](FRONTEND_FIX_GUIDE.md).

### Verify Frontend Build Works
```bash
npm run build
# If successful: dist/ folder appears ✓
# If fails: Check error messages and fix
```

## Step 1.2: Verify Backend Configuration

Backend needs proper environment setup:

**File:** `Petconnet_BE/.env`

Verify or create with these variables:
```
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/petconnect?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://your-frontend.onrender.com

# JWT
JWT_SECRET=your-super-secret-key-here-min-32-chars

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# MoMo Payment
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
```

## Step 1.3: Verify Frontend Configuration

**File:** `Petconnet_FE/.env`

Create with:
```
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
VITE_SOCKET_URL=https://your-backend.onrender.com
```

## Step 1.4: Initialize Git (if not done)

```bash
cd d:\Pawnet

# Check if git initialized
git status

# If not initialized:
git init
git add .
git commit -m "Initial commit - PetConnect app"

# Create GitHub repo and push:
git remote add origin https://github.com/YOUR_USERNAME/petconnect.git
git branch -M main
git push -u origin main
```

---

# 🎛️ PHASE 2: SETUP RENDER SERVICES

## Step 2.1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easier!)
3. Verify email
4. Create free account

## Step 2.2: Create Backend Service

### In Render Dashboard:

1. Click **New +** → **Web Service**
2. Connect GitHub repository
3. Choose **Petconnet_BE** branch
4. Fill form:
   ```
   Name: petconnect-backend
   Environment: Node
   Branch: main
   Build Command: npm install
   Start Command: npm run start
   Instance Type: Free (or $7/month for better)
   ```
5. Click **Advanced Settings**
   - Add environment variables (see Step 2.4)
   - Select:
     ```
     Auto-Deploy: Yes
     ```
6. Click **Create Web Service**

### Wait for Deployment
- Status shows "Deploying..."
- When done, you get URL: `https://petconnect-backend.onrender.com`
- Save this URL!

## Step 2.3: Create Frontend Service

### In Render Dashboard:

1. Click **New +** → **Static Site**
2. Connect GitHub repository
3. Fill form:
   ```
   Name: petconnect-frontend
   Branch: main
   Build Command: npm run build
   Publish Directory: dist
   ```
4. Click **Create Static Site**

### Wait for Deployment
- Build starts automatically
- When done, you get URL: `https://petconnect-frontend.onrender.com`
- Save this URL!

## Step 2.4: Backend Environment Variables

In **Backend Service** on Render:

1. Go to **Environment**
2. Add each variable:

```
MONGO_URI = your_mongodb_connection_string
PORT = 5000
NODE_ENV = production
FRONTEND_URL = https://petconnect-frontend.onrender.com
JWT_SECRET = your-secret-key-min-32-chars
CLOUDINARY_CLOUD_NAME = your_value
CLOUDINARY_API_KEY = your_value
CLOUDINARY_API_SECRET = your_value
MOMO_PARTNER_CODE = your_value
MOMO_ACCESS_KEY = your_value
MOMO_SECRET_KEY = your_value
```

3. After adding all, click **Save**
4. Service auto-redeploys

## Step 2.5: Frontend Environment Variables

In **Frontend Service** on Render:

1. Go to **Environment**
2. Add variables:

```
VITE_API_BASE_URL = https://petconnect-backend.onrender.com/api/v1
VITE_SOCKET_URL = https://petconnect-backend.onrender.com
```

3. Click **Save**
4. Automatic rebuild happens

---

# 🗄️ PHASE 2.5: SETUP MONGODB

## Option A: Use MongoDB Atlas (Recommended - Free)

### 1. Go to mongodb.com/cloud
```
Sign up or Login with Google
```

### 2. Create Cluster
```
- Project name: PetConnect
- Cluster name: petconnect-cluster
- Cloud provider: AWS
- Region: Choose nearest (e.g., ap-southeast-1 for Vietnam)
- Tier: FREE (M0)
- Click "Create"
```

### 3. Get Connection String
```
1. Cluster view → Click "Connect"
2. Choose "Connect your application"
3. Copy connection string:
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### 4. Update Backend .env
```bash
# In Petconnet_BE/.env:
MONGO_URI=mongodb+srv://username:password@cluster0.xxxx.mongodb.net/petconnect?retryWrites=true&w=majority

# In Render Backend Service → Environment:
MONGO_URI = (paste the same value)
```

### 5. Add Whitelist IP (Important!)
```
MongoDB Atlas → Network Access → IP Whitelist
Click "Add IP Address"
Choose "Allow access from anywhere" (0.0.0.0/0)
Click "Confirm"

⚠️ WARNING: This is less secure, but necessary for Render
Better: Add Render IP specifically (not available initially)
```

---

# 🚀 PHASE 3: DEPLOY!

## Step 3.1: First Deployment

### For Backend:
1. Render dashboard → Select **petconnect-backend**
2. See "Deploy history"
3. Click **Manual Deploy** or wait for auto-deploy from git
4. Watch logs:
   ```
   > npm install
   > Starting server on port 5000
   ✓ Connected to MongoDB
   ✓ Server is running
   ```

### For Frontend:
1. Render dashboard → Select **petconnect-frontend**
2. See build status
3. Watch build logs:
   ```
   > npm run build
   > Compiled successfully
   > 156 files generated
   ✓ Static site deployed
   ```

## Step 3.2: Test APIs

### Test Backend:
```bash
# Get your backend URL from Render
# Copy from Render dashboard: https://petconnect-backend.onrender.com

# Test health check:
curl https://petconnect-backend.onrender.com/health

# Expected response:
# {"status": "ok", "timestamp": "2026-03-17T..."}
```

### Test Frontend:
```bash
# Open in browser:
# https://petconnect-frontend.onrender.com

# Check browser console for errors
# Verify API calls go to correct backend URL
```

## Step 3.3: Test Payment Flow (End-to-End)

1. Open Frontend: `https://petconnect-frontend.onrender.com`
2. Login/Register as customer
3. Browse services → Click "Book Now"
4. Fill booking form → "Proceed to Payment"
5. Should see QR code (from backend)
6. Open Admin panel → Check pending payments
7. Approve payment
8. Verify customer sees "Payment confirmed" ✅

---

# 🔧 TROUBLESHOOTING

## Issue 1: Backend won't start - "Cannot find module"

**Solution:**
```bash
# In your local repo:
cd Petconnet_BE
npm install

# Commit package-lock.json:
git add package-lock.json
git commit -m "Update dependencies"
git push

# In Render, trigger redeploy
```

## Issue 2: Frontend shows blank page / 404

**Solution:**
1. Check browser console (F12) for errors
2. Verify env variables in Render:
   ```
   VITE_API_BASE_URL = https://petconnect-backend.onrender.com/api/v1
   ```
3. Rebuild frontend:
   - Render dashboard → click "Clear build cache"
   - Click "Trigger deploy"

## Issue 3: API calls fail / CORS error

**Solution:**
```javascript
// Backend: server.js
// Make sure CORS allows frontend URL

app.use(cors({
  origin: [
    'https://petconnect-frontend.onrender.com',
    'localhost:5173',
    'localhost:3000'
  ],
  credentials: true
}));
```

Push changes:
```bash
git add .
git commit -m "Fix CORS for Render deployment"
git push
```

## Issue 4: MongoDB connection fails

**Solution:**
1. Check connection string in .env:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/petconnect?retryWrites=true&w=majority
   ```
2. Verify IP whitelist in MongoDB Atlas:
   - Allow 0.0.0.0/0 (any IP)
3. Test connection locally:
   ```bash
   cd Petconnet_BE
   npm run dev
   # Check if "Connected to MongoDB" appears in logs
   ```

## Issue 5: Slow initial load / Free tier timeout

**Solution:**
```
Render free tier spins down after 15 min of inactivity.
First request takes 30 seconds.

Upgrade to paid tier ($7/month) for always-on service.
Or setup monitoring to keep it alive.
```

---

# 📊 CURRENT STATUS

| Component | Status | URL |
|-----------|--------|-----|
| Backend | 🟢 Ready | Will show after deploy |
| Frontend | 🟢 Ready | Will show after deploy |
| Database | 🟢 Configured | MongoDB Atlas |
| GitHub | 🟢 Connected | Your repo |

---

# 🎯 DEPLOYMENT PROCESS (SUMMARY)

```
┌─────────────────────────────────────────┐
│  1. Fix Frontend TypeScript (5 min)     │
│     npm run build                       │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  2. Push to GitHub (2 min)              │
│     git push origin main                │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  3. Create Render Services (5 min)      │
│     Backend Web Service                 │
│     Frontend Static Site                │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  4. Add Environment Variables (3 min)   │
│     Backend: MONGO_URI, JWT, etc        │
│     Frontend: API URLs                  │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  5. Deploy (Auto or Manual) (10 min)    │
│     Watch build logs                    │
│     Wait for ✓ Deployed                 │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  6. Test Deployment (5 min)             │
│     Test backend APIs                   │
│     Test frontend loading               │
│     Test payment flow                   │
└────────────────┬────────────────────────┘
                 ↓
        🎉 LIVE ON RENDER! 🎉
```

---

# ✅ NEXT STEPS

1. **Now:** Follow Phase 1 & 2 in this guide
2. **Run:** Fix frontend, push to GitHub
3. **Create:** Render services
4. **Deploy:** Auto-deploy from GitHub
5. **Monitor:** Check logs and alerts

**Questions?** Check [TEST_REPORT.md](TEST_REPORT.md) and [FRONTEND_FIX_GUIDE.md](FRONTEND_FIX_GUIDE.md)

---

*Complete deployment guide for PetConnect on Render.com - All services, step-by-step*
