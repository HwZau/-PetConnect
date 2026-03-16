# 🚀 Deploy PetConnect to Render

Hướng dẫn deploy full-stack app lên Render (thay thế Railway).

## 📋 Chuẩn bị

### 1. Repo Structure
```
PetConnect/
├── Petconnet_BE/     # Backend (Node.js)
│   ├── package.json
│   ├── server.js
│   └── ...
├── Petconnet_FE/     # Frontend (React/Vite)
│   ├── package.json
│   ├── index.html
│   └── ...
└── README.md
```

### 2. Kiểm tra Scripts
**Backend (`Petconnet_BE/package.json`):**
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

**Frontend (`Petconnet_FE/package.json`):**
```json
{
  "scripts": {
    "build": "npm run build",
    "preview": "npm run preview"
  }
}
```

## 🚀 Deploy Steps

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Bước 2: Deploy Backend (Web Service)

1. **Truy cập [Render Dashboard](https://dashboard.render.com)**
2. **Click "New" → "Web Service"**
3. **Connect GitHub repo** `HwZau/-PetConnect`
4. **Cấu hình:**
   - **Name:** `petconnect-backend`
   - **Root Directory:** `Petconnet_BE`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb://your-mongodb-connection-string
   JWT_SECRET=petconnect-production-secret-key-2024
   FRONTEND_URL=https://your-frontend-app.onrender.com
   ```
6. **Click "Create Web Service"**

### Bước 3: Deploy Frontend (Static Site)

1. **Trong Render Dashboard, click "New" → "Static Site"**
2. **Connect cùng GitHub repo** `HwZau/-PetConnect`
3. **Cấu hình:**
   - **Name:** `petconnect-frontend`
   - **Root Directory:** `Petconnet_FE`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend-app.onrender.com/api/v1
   VITE_WS_URL=wss://your-backend-app.onrender.com
   VITE_PAYMENT_SUCCESS_URL=https://your-frontend-app.onrender.com/payment-success
   VITE_PAYMENT_FAILURE_URL=https://your-frontend-app.onrender.com/payment-failure
   ```
5. **Click "Create Static Site"**

### Bước 4: Thêm Database (MongoDB)

1. **Click "New" → "MongoDB"**
2. **Cấu hình:**
   - **Name:** `petconnect-db`
   - **Database:** `PetConnect`
3. **Copy connection string** và paste vào backend environment variables

### Bước 5: Cập nhật URLs

Sau khi deploy xong, bạn sẽ có:

- **Backend URL:** `https://petconnect-backend.onrender.com`
- **Frontend URL:** `https://petconnect-frontend.onrender.com`
- **Database URL:** MongoDB connection string

**Cập nhật Frontend Environment Variables:**
```
VITE_API_BASE_URL=https://petconnect-backend.onrender.com/api/v1
VITE_WS_URL=wss://petconnect-backend.onrender.com
```

**Cập nhật Backend Environment Variables:**
```
FRONTEND_URL=https://petconnect-frontend.onrender.com
```

## 🔧 Troubleshooting

### Backend không start
- Check logs trong Render dashboard
- Đảm bảo `MONGODB_URI` đúng
- Đảm bảo `JWT_SECRET` được set

### Frontend build fail
- Check build logs
- Đảm bảo `VITE_API_BASE_URL` đúng format
- Đảm bảo `dist` folder được tạo

### CORS errors
- Cập nhật `FRONTEND_URL` trong backend
- Restart backend service

### WebSocket không kết nối
- Đảm bảo `VITE_WS_URL` có `wss://` protocol
- Check backend WebSocket logs

## 💰 Render Pricing

- **Free Tier:** 750 giờ/tháng, sleep after 15 phút inactive
- **Paid Plans:** Từ $7/tháng trở lên

## 🔄 Redeploy

Khi push code mới lên GitHub, Render sẽ tự động redeploy.

## 📞 Support

Check Render docs: https://docs.render.com