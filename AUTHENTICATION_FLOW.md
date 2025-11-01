# Authentication Flow - PawNest

## Tổng quan

Hệ thống authentication đã được setup hoàn chỉnh với flow như sau:

```
User Login → API /login → Get Token → API /user/profile/me → Set User Context → Update UI
```

## Cấu trúc

### 1. **authService** (`src/services/auth/authService.ts`)

Service xử lý tất cả API calls liên quan đến authentication:

```typescript
authService.login(credentials); // Đăng nhập, trả về token
authService.getProfile(); // Lấy thông tin user từ /user/profile/me
authService.register(data); // Đăng ký
authService.logout(); // Đăng xuất
```

### 2. **UserContext** (`src/contexts/UserContext.tsx`)

Global state management cho user:

- Tự động fetch user profile khi app khởi động (nếu có token)
- Sync user data với localStorage
- Hiển thị loading state khi đang kiểm tra authentication

```typescript
const { user, setUser } = useContext(UserContext);
```

### 3. **useAuth Hook** (`src/hooks/useAuth.ts`)

Custom hook cung cấp các function authentication:

```typescript
const {
  user, // User object hiện tại
  isAuthenticated, // Boolean check đã login chưa
  isAdmin, // Boolean check có phải admin không
  login, // Function đăng nhập
  register, // Function đăng ký
  logout, // Function đăng xuất
  refreshUser, // Function refresh user data
} = useAuth();
```

## Flow chi tiết

### Login Flow

1. **User nhập thông tin** → `LoginPage.tsx`
2. **Call `login()` function** từ `useAuth` hook
3. **Step 1**: Call API `/login` với credentials
   - API trả về `{ token, user }`
   - Save token vào localStorage
4. **Step 2**: Call API `/user/profile/me` để lấy full profile
   - Sử dụng token vừa nhận được
5. **Step 3**: Set user vào Context
   - Update UI tự động
   - Save user vào localStorage
6. **Navigate** đến trang home hoặc admin dashboard

### Register Flow

1. **User nhập thông tin đăng ký** → `RegisterPage.tsx`
2. **Call `register()` function** từ `useAuth` hook
3. **Step 1**: Call API `/register` với user data
   - API trả về `{ token, user }`
   - Save token vào localStorage
4. **Step 2**: Call API `/user/profile/me` để lấy full profile
5. **Step 3**: Set user vào Context và navigate về home

### Logout Flow

1. **User click logout button**
2. **Call `logout()` function** từ `useAuth` hook
3. Call API `/logout`
4. Clear user từ Context
5. Clear localStorage (token + user)
6. Navigate về trang chủ

### Auto-login on App Start

1. **App khởi động** → `UserContext` được mount
2. **Check localStorage** có token không?
3. Nếu có token:
   - Call API `/user/profile/me`
   - Nếu success → Set user vào Context
   - Nếu fail → Clear localStorage
4. Hiển thị loading spinner trong lúc check
5. Khi xong → Render app

## Sử dụng trong Components

### Navbar

```typescript
// src/components/common/Navbar.tsx
const { user, logout } = useAuth();

// Hiển thị user info nếu đã login
{
  user ? (
    <div>
      <img src={user.avatarUrl} />
      <span>{user.name}</span>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  ) : (
    <button onClick={() => navigate("/login")}>Đăng nhập</button>
  );
}
```

### Protected Routes

```typescript
// Trong component cần authentication
const { isAuthenticated, user } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}

// Hoặc check role
if (user?.role !== "admin") {
  return <Navigate to="/" />;
}
```

### Profile Page

```typescript
const { user, refreshUser } = useAuth();

// Refresh user data khi cần
const handleUpdateProfile = async () => {
  // ... update API call
  await refreshUser(); // Refresh data từ server
};
```

## API Endpoints được sử dụng

```
POST /login              → Đăng nhập, trả về token
POST /register           → Đăng ký, trả về token
POST /logout             → Đăng xuất
GET  /user/profile/me    → Lấy thông tin user hiện tại (cần token)
```

## localStorage Keys

```
token: string           → JWT token
user: string (JSON)     → User object đã stringify
```

## Type Definitions

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatarUrl?: string;
  role: "Customer" | "Freelancer" | "admin";
  isActive: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  password: string;
  confirmPassword: string;
}
```

## Testing

Để test authentication flow:

1. **Test Login**:

   ```
   Email: customer@example.com
   Password: [your-password]
   ```

2. **Check Console**: Xem log của API responses
3. **Check localStorage**: Mở DevTools → Application → Local Storage
4. **Check Network**: Xem API calls trong Network tab

## Troubleshooting

### User không được set sau khi login

- Check API response có đúng format không
- Check token có được save vào localStorage không
- Check API `/user/profile/me` có trả về đúng data không

### Auto-login không hoạt động

- Check token trong localStorage còn valid không
- Check API `/user/profile/me` có được call không
- Xem Console có error gì không

### Logout không clear data

- Check `authService.logout()` có được call không
- Check localStorage có được clear không
- Check Context `setUser(null)` có được gọi không

## Best Practices

1. **Luôn dùng `useAuth` hook** thay vì trực tiếp access Context
2. **Không lưu sensitive data** vào localStorage ngoài token
3. **Handle token expiration** bằng cách check API response
4. **Refresh token** nếu API support
5. **Clear data khi logout** đầy đủ
6. **Show loading states** khi đang fetch data

## Next Steps

- [ ] Implement refresh token mechanism
- [ ] Add token expiration handling
- [ ] Add "Remember Me" functionality
- [ ] Implement social login (Google, Facebook)
- [ ] Add two-factor authentication
- [ ] Implement password strength indicator
- [ ] Add email verification flow
