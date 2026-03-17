# 📝 DEPLOYMENT REFERENCE CARD

**Save this document! You'll need it during deployment.**

---

## 🔑 CREDENTIALS TO GATHER

Before starting deployment, collect these:

### GitHub
```
Username: _________________________
Email: _____________________________
Repo URL: __________________________
(Create at https://github.com/new)
```

### MongoDB Atlas
```
Cluster Name: _______________________
Connection String: _________________
________________
Username: ___________________________
Password: ___________________________
Whitelist IP: ✓ 0.0.0.0/0
```

### Render
```
Account Email: ______________________
Password: ___________________________
```

### Cloudinary (Optional - for image uploads)
```
Cloud Name: _________________________
API Key: ____________________________
API Secret: _________________________
```

### Email Service (Optional - for notifications)
```
SMTP Host: __________________________
SMTP Port: __________________________
Email: ______________________________
Password: ___________________________
```

---

## 🌐 URLS TO SAVE AFTER DEPLOYMENT

### After creating services on Render, save these URLs:

```
Backend Service URL:
https://_________________________.onrender.com

Frontend Service URL:
https://_________________________.onrender.com

API Base URL:
https://_________________________.onrender.com/api/v1

WebSocket URL:
https://_________________________.onrender.com
```

---

## 🔧 ENVIRONMENT VARIABLES CHECKLIST

### Backend Service - Add to Render:

```
□ MONGO_URI = _________________________
□ PORT = 5000
□ NODE_ENV = production
□ FRONTEND_URL = _____________________
□ JWT_SECRET = ________________________
□ CLOUDINARY_CLOUD_NAME = ____________
□ CLOUDINARY_API_KEY = ________________
□ CLOUDINARY_API_SECRET = _____________
□ MOMO_PARTNER_CODE = __________________
□ MOMO_ACCESS_KEY = ____________________
□ MOMO_SECRET_KEY = ____________________
```

### Frontend Service - Add to Render:

```
□ VITE_API_BASE_URL = __________________
□ VITE_SOCKET_URL = ____________________
```

---

## 📝 LOCAL .ENV FILES TO UPDATE

### Petconnet_BE/.env

Copy exactly as it is, verify values:

```bash
# Copy this template, fill in your values, save as Petconnet_BE/.env

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/petconnect?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
JWT_SECRET=your-secret-key-min-32-characters-long_12345678
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=12345678901234567890
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz123456
MOMO_PARTNER_CODE=MOMO123456
MOMO_ACCESS_KEY=access_key_here
MOMO_SECRET_KEY=secret_key_here
```

### Petconnet_FE/.env

```bash
# Copy this template, fill in your values, save as Petconnet_FE/.env

VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
VITE_SOCKET_URL=https://your-backend.onrender.com
```

---

## 📋 COMMAND REFERENCE

### Fix & Test Frontend
```bash
# Navigate to frontend
cd d:\Pawnet\Petconnet_FE

# Install deps
npm install

# Auto-fix eslint
npx eslint . --fix

# Build test
npm run build

# Should see: ✓ dist/ folder created
```

### Git Commands
```bash
# Check status
cd d:\Pawnet
git status

# Stage changes
git add .

# Commit
git commit -m "Deploy to Render"

# Push
git push origin main

# Verify (check GitHub website)
```

### Backend Start (Local Testing)
```bash
cd d:\Pawnet\Petconnet_BE
npm run dev
# Should see: "Server running on port 5000"
```

### Frontend Start (Local Testing)
```bash
cd d:\Pawnet\Petconnet_FE
npm run dev
# Should see: "VITE v... ready in ... ms"
# Open: http://localhost:5173
```

---

## ✅ DEPLOYMENT STEPS CHECKLIST

### Step 1: Preparation (Offline)
```
□ Collected all credentials
□ Have GitHub account
□ Have Render account
□ Have MongoDB Atlas connection string
□ Environment files locally configured
```

### Step 2: Frontend Build
```
□ npm install (Petconnet_FE)
□ npx eslint . --fix (Petconnet_FE)
□ npm run build succeeds (Petconnet_FE)
□ dist/ folder created (Petconnet_FE)
```

### Step 3: Git & GitHub
```
□ Code committed locally
□ Code pushed to GitHub (git push origin main)
□ GitHub shows latest code
```

### Step 4: Render Backend Service
```
□ Created Web Service
□ Connected GitHub repo
□ Service name: petconnect-backend
□ Environment: Node
□ Auto-deploy: On
□ All env variables added
□ Status: "Deployed" (green checkmark)
□ URL copied: https://...onrender.com
```

### Step 5: Render Frontend Service
```
□ Created Static Site (NOT Web Service!)
□ Connected GitHub repo
□ Service name: petconnect-frontend
□ Build: npm run build
□ Publish: dist
□ All env variables added
□ Status: "Deployed" (green checkmark)
□ URL copied: https://...onrender.com
```

### Step 6: Testing
```
□ Backend API responds (curl test)
□ Frontend loads (browser test)
□ No 404 errors
□ No CORS errors
□ API can connect to database
```

### Step 7: Integration Test
```
□ Login works
□ Browse services works
□ Book service works
□ Payment QR displays
□ Admin approval works
□ Notifications sent
```

---

## 🚨 ERROR QUICK REFERENCE

### If frontend build fails:
```
1. Check error message
2. cd Petconnet_FE
3. npm install
4. npm run build (run locally)
5. Fix errors shown
6. git push origin main
7. Render will retry
```

### If backend won't start:
```
1. Check Render logs
2. Look for: "Connected to MongoDB"
3. If connection fails:
   - Check MONGO_URI in Render env vars
   - Check MongoDB Atlas whitelist (0.0.0.0/0)
   - Test MONGO_URI locally
4. Restart service from Render dashboard
```

### If frontend shows blank:
```
1. Browser → F12 (Developer Tools)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify VITE_API_BASE_URL set correctly
5. Clear browser cache (Ctrl+Shift+Delete)
6. Hard refresh (Ctrl+F5)
```

### If API calls fail:
```
1. Check backend logs (Render → Logs)
2. Verify frontend env vars:
   VITE_API_BASE_URL = backend_url/api/v1
3. Verify backend CORS allows frontend URL
4. Test with curl:
   curl https://your-backend.onrender.com/health
```

---

## 🎯 QUICK LINKS

| Service | Link |
|---------|------|
| GitHub | https://github.com/new |
| Render | https://render.com |
| MongoDB Atlas | https://mongodb.com/cloud |
| Cloudinary | https://cloudinary.com |

---

## 📞 SUPPORT DOCUMENTS

| Document | Purpose |
|----------|---------|
| [RENDER_SUMMARY.md](RENDER_SUMMARY.md) | Overview & checklist |
| [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) | Detailed steps |
| [RENDER_QUICK_START.md](RENDER_QUICK_START.md) | Command reference |
| [FRONTEND_FIX_GUIDE.md](FRONTEND_FIX_GUIDE.md) | Fix TypeScript errors |
| [TEST_REPORT.md](TEST_REPORT.md) | Build/test results |

---

## 🎉 AFTER DEPLOYMENT

Save these for later:

```
Your App URLs:
Frontend: ___________________________
Backend: ____________________________
API: ________________________________

Admin Credentials:
Email: ______________________________
Password: ___________________________

Customer Test Account:
Email: ______________________________
Password: ___________________________

Database:
Connection: _________________________
Username: ___________________________
```

---

## 📅 TIMELINE

| Task | Time | Status |
|------|------|--------|
| Fix Frontend | 5 min | □ |
| Push Code | 5 min | □ |
| Create Backend Service | 5 min | □ |
| Create Frontend Service | 5 min | □ |
| Add Env Variables | 5 min | □ |
| Wait for Deploy | 3-5 min | □ |
| Test Everything | 10 min | □ |
| **TOTAL** | **~40 min** | |

---

*Deployment reference card - Print or bookmark this page*
