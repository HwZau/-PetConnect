# 🎯 RENDER DEPLOYMENT - QUICK COMMAND REFERENCE

## 📋 STEP-BY-STEP COMMANDS TO RUN

### STEP 1: FIX FRONTEND (On Your Computer)

```bash
# Navigate to frontend
cd d:\Pawnet\Petconnet_FE

# Install latest dependencies
npm install

# Auto-fix ESLint issues
npx eslint . --fix

# Verify build works
npm run build

# Check output:
# You should see: "dist/" folder created ✓
```

**If build fails:** 
- Read error message
- Go to [FRONTEND_FIX_GUIDE.md](FRONTEND_FIX_GUIDE.md)
- Apply manual fixes
- Run `npm run build` again

---

### STEP 2: VERIFY ENVIRONMENT FILES

**Backend:** `d:\Pawnet\Petconnet_BE\.env`
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/petconnect
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app-frontend.onrender.com
JWT_SECRET=your-secret-key-at-least-32-characters-long
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Frontend:** `d:\Pawnet\Petconnet_FE\.env`
```
VITE_API_BASE_URL=https://your-app-backend.onrender.com/api/v1
VITE_SOCKET_URL=https://your-app-backend.onrender.com
```

**Note:** Replace `your-app-backend` and `your-app-frontend` AFTER creating services on Render

---

### STEP 3: COMMIT & PUSH TO GITHUB

```bash
# From project root: d:\Pawnet
cd d:\Pawnet

# Check git status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Prepare for Render deployment"

# Push to GitHub
git push origin main

# Verify success (check GitHub website)
```

**If you don't have GitHub yet:**
```bash
# Create GitHub repo first at https://github.com/new
# Then:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/petconnect.git
git push -u origin main
```

---

### STEP 4: CREATE RENDER ACCOUNT

1. Go to **https://render.com**
2. Click **Sign Up**
3. Choose **Sign up with GitHub** (easier!)
4. Authorize render.com to access your repos
5. Verify email

---

### STEP 5: CREATE BACKEND SERVICE ON RENDER

**In Render Dashboard:**

1. Click **New +** (top right)
2. Select **Web Service**
3. Authorize GitHub (if needed)
4. Search for: `petconnect` or your repo name
5. Click to connect repo
6. Fill the form:

```
Service Name: petconnect-backend
Environment: Node
Build Command: npm install
Start Command: npm run start
Instance Type: Free (or $7/month Starter)
Region: Singapore (closest to Vietnam)
```

7. Click **Advanced Settings**
8. Set:
   - Auto-deploy: Yes
   - Root Directory: Petconnet_BE

9. Scroll down, click **Create Web Service**

**Wait for:**
- Status: "Deploying..."
- Then: "Deployed" (✓)
- Get your URL: `https://petconnect-backend-xxxx.onrender.com`

---

### STEP 6: ADD BACKEND ENVIRONMENT VARIABLES

**In Backend Service:**

1. Click **Environment** (left sidebar)
2. Click **Add Environment Variable**
3. Add each:

```
Key: MONGO_URI
Value: mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/petconnect

Key: PORT
Value: 5000

Key: NODE_ENV
Value: production

Key: FRONTEND_URL
Value: https://petconnect-frontend-xxxx.onrender.com

Key: JWT_SECRET
Value: your-secret-key-min-32-chars

Key: CLOUDINARY_CLOUD_NAME
Value: your_value

Key: CLOUDINARY_API_KEY
Value: your_value

Key: CLOUDINARY_API_SECRET
Value: your_value
```

4. After each one, press **Add**
5. When done, service auto-redeploys

**Wait for green checkmark** ✓

---

### STEP 7: CREATE FRONTEND SERVICE ON RENDER

**In Render Dashboard:**

1. Click **New +** (top right)
2. Select **Static Site** (NOT Web Service!)
3. Connect your repo (same as backend)
4. Fill form:

```
Site Name: petconnect-frontend
Branch: main
Build Command: npm run build
Publish Directory: dist
```

5. Click **Create Static Site**

**Wait for:**
- Build to complete
- Status: "Live" (✓)
- Get your URL: `https://petconnect-frontend-xxxx.onrender.com`

---

### STEP 8: ADD FRONTEND ENVIRONMENT VARIABLES

**In Frontend Service:**

1. Click **Environment** (left sidebar)
2. Add:

```
Key: VITE_API_BASE_URL
Value: https://petconnect-backend-xxxx.onrender.com/api/v1

Key: VITE_SOCKET_URL
Value: https://petconnect-backend-xxxx.onrender.com
```

3. After adding, service auto-rebuilds

**Wait for green checkmark** ✓

---

### STEP 9: UPDATE .env FILES WITH ACTUAL RENDER URLS

Now that you have your Render URLs, update your `.env` files:

**Local: `Petconnet_BE/.env`**
```
# Update FRONTEND_URL with your actual Render URL
FRONTEND_URL=https://petconnect-frontend-abc123.onrender.com
```

**Local: `Petconnet_FE/.env`**
```
# Update URLs with your actual Render URLs  
VITE_API_BASE_URL=https://petconnect-backend-xyz789.onrender.com/api/v1
VITE_SOCKET_URL=https://petconnect-backend-xyz789.onrender.com
```

Then commit:
```bash
cd d:\Pawnet
git add .
git commit -m "Update Render URLs in env files"
git push origin main
```

---

### STEP 10: TEST DEPLOYMENT

**Test Backend:**
```bash
# Open browser or terminal
curl https://your-backend-url.onrender.com/health

# Should see:
# {"status":"ok","timestamp":"..."}
```

**Test Frontend:**
```bash
# Open in browser:
https://your-frontend-url.onrender.com

# Check:
1. Page loads without 404
2. No errors in browser console (F12)
3. Can navigate to different pages
```

**Test API Connection:**
```bash
# In browser console (F12):
console.log(process.env.VITE_API_BASE_URL)

# Should show your backend URL
```

---

### STEP 11: TEST PAYMENT FLOW

1. **Open Frontend:** `https://your-frontend-url.onrender.com`
2. **Login:** Create account and login
3. **Book Service:** 
   - Browse services
   - Click "Book Now"
   - Fill booking form
   - Click "Proceed to Payment"
4. **See QR Code:** Should display payment QR code
5. **Admin Approval:**
   - Open admin panel
   - Go to Payments
   - See pending payment
   - Click Approve
6. **Verify Success:**
   - Customer sees "Payment Confirmed"
   - Booking shows as "Confirmed"

---

## 🔍 MONITORING & LOGS

### View Backend Logs:

1. Render Dashboard → **petconnect-backend**
2. Click **Logs** tab
3. See in real-time:
   ```
   ...
   > npm start
   > node server.js
   listening on port 5000
   MongoDB connected ✓
   ```

### View Frontend Logs:

1. Render Dashboard → **petconnect-frontend**
2. Click **Logs** tab
3. See build output:
   ```
   ...
   > npm run build
   > vite build
   ✓ built in 12.5s
   ```

### Check Service Status:

```bash
# Backend health check
curl -i https://your-backend.onrender.com/health

# Frontend status (should be 200)
curl -i https://your-frontend.onrender.com

# Check API connectivity
curl https://your-backend.onrender.com/api/v1/health
```

---

## 🆘 QUICK TROUBLESHOOTING

### Frontend shows blank page:
```bash
# 1. Check env variables in Render (correct URLs?)
# 2. Clear browser cache (Ctrl+Shift+Delete)
# 3. Check browser console (F12 → Console)
# 4. Force rebuild:
#    Render → Frontend Service → Settings → "Clear build cache"
#    Then "Trigger deploy"
```

### Backend errors in logs:
```bash
# 1. Check MONGO_URI is correct
# 2. Check MongoDB Atlas IP whitelist allows 0.0.0.0/0
# 3. Check all required env variables are set
# 4. Rebuild backend:
#    Render → Backend Service → "Clear build cache"
#    Then "Trigger deploy"
```

### CORS errors:
```
Error: "Access to XMLHttpRequest has been blocked by CORS policy"

Solution:
1. Backend (server.js) CORS middleware correct?
2. Add frontend URL to CORS origin:
   origin: 'https://your-frontend.onrender.com'
3. Push to GitHub
4. Auto-redeploy
```

### MongoDB connection timeout:
```
Error: "connection timeout"

Solution:
1. Check MongoDB Atlas network access
2. Add IP: 0.0.0.0/0 (allow all)
3. Test locally with same MONGO_URI
4. Restart backend service
```

---

## 📊 FINAL URLS

After deployment, you'll have:

```
🌐 Frontend:  https://petconnect-frontend-xxxx.onrender.com
🖥️  Backend:   https://petconnect-backend-xxxx.onrender.com
🗄️  Database:  MongoDB Atlas (your cluster)
📱 API Base:  https://petconnect-backend-xxxx.onrender.com/api/v1
```

Save these URLs!

---

## ✅ DEPLOYMENT COMPLETE CHECKLIST

- [ ] Frontend TypeScript errors fixed
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend service created
- [ ] Backend environment variables set
- [ ] Frontend service created
- [ ] Frontend environment variables set
- [ ] Backend shows "Deployed" ✓
- [ ] Frontend shows "Deployed" ✓
- [ ] Backend API responds (curl test)
- [ ] Frontend loads (browser test)
- [ ] Payment flow works (end-to-end test)
- [ ] Logs can be viewed

---

## 🎉 YOU'RE LIVE!

Your app is now deployed on Render and accessible from anywhere!

**Share your URLs:**
- Frontend: `https://petconnect-frontend-xxxx.onrender.com`
- API Docs: `https://petconnect-backend-xxxx.onrender.com/api/docs`

---

*Quick reference guide for Render deployment - Run commands in order*
