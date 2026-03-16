# 🚂 Deploy PetConnect to Railway

Hướng dẫn deploy full-stack app lên Railway.

## 📋 Yêu cầu
- Tài khoản [Railway](https://railway.app)
- GitHub repository

## 🚀 Các bước deploy

### 1. Chuẩn bị code
Code đã được cấu hình sẵn cho Railway deployment.

### 2. Tạo Railway Project
1. Truy cập [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Chọn "Deploy from GitHub repo"
4. Connect GitHub và chọn repository của bạn

### 3. Deploy Backend
1. Trong Railway project, tạo service mới: **Add → Database → MongoDB**
2. Railway sẽ tự động tạo MongoDB database
3. Tạo service mới: **Add → Empty Service**
4. Chọn folder `Petconnet_BE` để deploy
5. Cấu hình Environment Variables:

```
MONGODB_URI=${{MongoDB.MONGODB_URL}}
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app-name.railway.app
```

### 4. Deploy Frontend
1. Tạo service mới: **Add → Empty Service**
2. Chọn folder `Petconnet_FE` để deploy
3. Cấu hình Environment Variables:

```
VITE_API_BASE_URL=https://your-backend-service-name.railway.app/api/v1
VITE_WS_URL=wss://your-backend-service-name.railway.app
VITE_PAYMENT_SUCCESS_URL=https://your-frontend-service-name.railway.app/payment-success
VITE_PAYMENT_FAILURE_URL=https://your-frontend-service-name.railway.app/payment-failure
```

### 5. Cập nhật CORS (Backend)
Sau khi có domain, cập nhật `FRONTEND_URL` trong backend environment variables với domain thật của frontend.

## 🔧 Environment Variables Chi tiết

### Backend (.env)
```
MONGODB_URI=mongodb://mongo:your-mongodb-connection-string
JWT_SECRET=your-256-bit-secret-key-here
FRONTEND_URL=https://your-frontend-app.railway.app
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-app.railway.app/api/v1
VITE_WS_URL=wss://your-backend-app.railway.app
VITE_PAYMENT_SUCCESS_URL=https://your-frontend-app.railway.app/payment-success
VITE_PAYMENT_FAILURE_URL=https://your-frontend-app.railway.app/payment-failure
```

## 📱 Truy cập ứng dụng
- **Frontend**: `https://your-frontend-service-name.railway.app`
- **Backend API**: `https://your-backend-service-name.railway.app/api/v1`

## 🐛 Troubleshooting

### Backend không start
- Kiểm tra MongoDB connection string
- Đảm bảo JWT_SECRET được set
- Check logs trong Railway dashboard

### Frontend không load
- Kiểm tra VITE_API_BASE_URL có đúng backend URL không
- Đảm bảo backend đã deploy thành công

### CORS errors
- Cập nhật FRONTEND_URL trong backend với domain thật
- Restart backend service

### WebSocket không kết nối
- Đảm bảo VITE_WS_URL có đúng backend URL
- Check backend logs cho WebSocket connections

## 💰 Railway Pricing
- **Hobby Plan**: Free (512MB RAM, 1GB disk)
- **Pro Plan**: $5/month (8GB RAM, 32GB disk)

## 🔄 Redeploy
Khi push code lên GitHub, Railway sẽ tự động redeploy.

## 📞 Support
Nếu gặp vấn đề, check Railway docs hoặc tạo issue trên GitHub.