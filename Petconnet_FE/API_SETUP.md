# API Setup Documentation

## 🚀 Overview

Dự án đã được setup với Axios để quản lý API calls một cách professional và hiệu quả. Bao gồm:

- ✅ **Axios Client** với interceptors
- ✅ **Custom Hooks** cho React components
- ✅ **TypeScript** support đầy đủ
- ✅ **Environment variables** configuration
- ✅ **File upload** với progress tracking
- ✅ **Error handling** tự động
- ✅ **Request cancellation**

---

## 📁 File Structure

```
src/
├── config/
│   └── api.ts              # API endpoints và constants
├── services/
│   ├── apiClient.ts        # Main Axios client
│   └── authService.ts      # Authentication service
├── hooks/
│   ├── useApi.ts          # Custom hooks cho API
│   └── index.ts           # Export tất cả hooks
├── examples/
│   └── apiUsage.tsx       # Ví dụ sử dụng
└── .env                   # Environment variables
```

---

## 🛠️ Setup

### 1. Environment Variables

Tạo file `.env` trong root folder:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_MAX_FILE_SIZE=5242880
```

### 2. API Client Features

- **Auto authentication**: Tự động thêm Bearer token
- **Request/Response interceptors**: Xử lý lỗi tự động
- **File upload**: Support single/multiple files
- **Progress tracking**: Theo dõi upload progress
- **Request cancellation**: Cancel requests khi cần

---

## 💻 Usage Examples

### Basic API Calls

```typescript
import { apiClient } from "../services/apiClient";
import { API_ENDPOINTS } from "../config/api";

// GET request
const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);

// POST request
const response = await apiClient.post(API_ENDPOINTS.PETS.CREATE, {
  name: "Buddy",
  type: "dog",
});

// File upload
const response = await apiClient.uploadFile(API_ENDPOINTS.UPLOAD.AVATAR, file, {
  userId: "123",
});
```

### Using Custom Hooks

```typescript
import { useApi, useFileUpload } from "../hooks";

function UserProfile() {
  // Auto-fetch data on mount
  const { data, loading, error, refetch } = useApi(
    API_ENDPOINTS.USERS.PROFILE,
    { immediate: true }
  );

  // Update profile
  const { execute: updateProfile } = useApi(API_ENDPOINTS.USERS.UPDATE);

  const handleUpdate = async () => {
    const result = await updateProfile("PUT", { name: "New Name" });
    if (result.success) {
      refetch();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
```

### File Upload with Progress

```typescript
function FileUpload() {
  const { upload, loading, progress, error } = useFileUpload(
    API_ENDPOINTS.UPLOAD.AVATAR
  );

  const handleUpload = async (file: File) => {
    const result = await upload(file, { category: "avatar" });
    if (result.success) {
      console.log("Upload successful!");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {loading && <div>Progress: {progress}%</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

---

## 🎯 API Endpoints

Tất cả endpoints được define trong `src/config/api.ts`:

```typescript
import { API_ENDPOINTS } from "../config/api";

// Authentication
API_ENDPOINTS.AUTH.LOGIN; // /auth/login
API_ENDPOINTS.AUTH.REGISTER; // /auth/register

// Users
API_ENDPOINTS.USERS.PROFILE; // /users/profile
API_ENDPOINTS.USERS.UPDATE; // /users/profile

// Pets
API_ENDPOINTS.PETS.LIST; // /pets
API_ENDPOINTS.PETS.DETAIL("123"); // /pets/123

// File Upload
API_ENDPOINTS.UPLOAD.AVATAR; // /upload/avatar
```

---

## 🔧 Advanced Features

### Request Cancellation

```typescript
const cancelToken = apiClient.createCancelToken();

// Make request with cancel token
apiClient.get("/api/data", {}, { cancelToken: cancelToken.token });

// Cancel request
cancelToken.cancel("User canceled");
```

### Custom Headers

```typescript
// Set global header
apiClient.setHeader("X-Custom-Header", "value");

// Remove header
apiClient.removeHeader("X-Custom-Header");
```

### Error Handling

```typescript
const response = await apiClient.get("/api/data");

if (response.success) {
  console.log("Data:", response.data);
} else {
  console.error("Error:", response.error);
}
```

---

## 🚨 Error Handling

API Client tự động xử lý:

- **401 Unauthorized**: Tự động clear token và redirect về login
- **Network errors**: Hiển thị message thân thiện
- **Timeout**: Tự động retry hoặc show error
- **Validation errors**: Parse và hiển thị chi tiết

---

## 🔐 Authentication

```typescript
// Set token (tự động save vào localStorage)
apiClient.setToken("your-jwt-token");

// Clear token
apiClient.clearToken();

// Get current token
const token = apiClient.getToken();
```

---

## 📝 Best Practices

1. **Sử dụng useApi hook** thay vì gọi apiClient trực tiếp trong components
2. **Define endpoints** trong `API_ENDPOINTS` thay vì hardcode
3. **Handle loading states** để UX tốt hơn
4. **Show error messages** cho user
5. **Cancel requests** khi component unmount
6. **Use TypeScript** để type safety

---

## 🎉 Ready to Use!

API setup đã hoàn tất! Bạn có thể:

- ✅ Gọi API với `apiClient`
- ✅ Sử dụng hooks `useApi`, `useFileUpload`
- ✅ Upload files với progress tracking
- ✅ Handle errors tự động
- ✅ Manage authentication tokens

Xem thêm examples trong `src/examples/apiUsage.tsx`!
