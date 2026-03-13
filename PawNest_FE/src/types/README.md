# 📁 Types Directory Structure

Hệ thống **TypeScript interfaces** được tổ chức có cấu trúc để dễ dàng maintain và sử dụng.

## 🎯 Mục tiêu tổ chức

- **Separation of Concerns**: Tách biệt business logic và UI components
- **Reusability**: Types có thể tái sử dụng ở nhiều nơi
- **Maintainability**: Dễ tìm kiếm và chỉnh sửa
- **Scalability**: Dễ mở rộng khi thêm tính năng mới
- **Component Colocation**: Component props được định nghĩa trong chính component đó

## 📂 Cấu trúc thư mục

```
types/
├── domains/           # 🏢 Business Domain Interfaces (Entity Data)
│   ├── payment.ts     # Thanh toán, giao dịch, hóa đơn
│   ├── freelancer.ts  # Thông tin freelancer, dịch vụ
│   ├── events.ts      # Sự kiện, filter, categories
│   ├── community.ts   # Bài viết, comment, thành viên
│   ├── booking.ts     # Đặt chỗ, thú cưng, dịch vụ
│   ├── profile.ts     # Hồ sơ người dùng, preferences
│   └── PostCategory.ts # Enum categories cho posts
└── index.ts          # 📤 Entry point - export tất cả domain types

components/
└── [component-folder]/
    └── Component.tsx  # Component props được định nghĩa ở đây
```

## ⚠️ Thay đổi quan trọng

**Component Props không còn trong types/**

- ❌ **Cũ**: Props được định nghĩa trong `types/components/`
- ✅ **Mới**: Props được định nghĩa trực tiếp trong file component

**Ví dụ:**

```typescript
// ❌ Cũ: types/components/payment.ts
export interface PaymentCardFormProps { ... }

// ✅ Mới: components/payment/PaymentCardForm.tsx
interface PaymentCardFormProps { ... }
export const PaymentCardForm = (props: PaymentCardFormProps) => { ... }
```

## 🏢 DOMAINS - Business Logic Interfaces

**Mục đích**: Chứa các interface mô tả **dữ liệu business**, không liên quan đến UI.

### 💰 payment.ts

```typescript
// Dữ liệu thanh toán
interface PaymentMethod { ... }
interface Transaction { ... }
interface PromoCode { ... }
```

### 👥 freelancer.ts

```typescript
// Dữ liệu freelancer
interface FreelancerProfile { ... }
interface Review { ... }
interface Skill { ... }
```

### 📅 events.ts

```typescript
// Dữ liệu sự kiện
interface Event { ... }
interface EventCategory { ... }
interface EventFilter { ... }
```

### 💬 community.ts

```typescript
// Dữ liệu cộng đồng
interface Post { ... }
interface Comment { ... }
interface CommunityMember { ... }
```

### 📋 booking.ts

```typescript
// Dữ liệu đặt chỗ
interface BookingRequest { ... }
interface Pet { ... }
interface ServiceOption { ... }
```

### 👤 profile.ts

```typescript
// Dữ liệu người dùng
interface UserProfile { ... }
interface UserPreferences { ... }
interface Certification { ... }
```

## 📤 INDEX.TS - Entry Point

File này export **tất cả domain types** để dễ dàng import:

```typescript
// Import domain types
import type {
  PaymentMethod,
  Transaction,
  UserProfile,
  BookingRequest,
} from "@/types";

// Hoặc import specific domain
import type { UserProfile } from "@/types/domains/profile";
```

## 🔄 Migration Guide

### Trước khi tổ chức:

```typescript
// Props trong types/components/
// types/components/payment.ts
export interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}
```

### Sau khi tổ chức:

```typescript
// Props trực tiếp trong component
// components/payment/PaymentMethodSelector.tsx
import type { PaymentMethod } from "@/types";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) => {
  // ✅ Type-safe, props gần với component
};
```

## 🛠️ Cách sử dụng

### 1. Tạo Business Interface (Domain)

```typescript
// types/domains/[domain].ts
export interface NewEntity {
  id: string;
  name: string;
  // ... other business fields
}
```

### 2. Tạo Component với Props

```typescript
// components/[feature]/NewComponent.tsx
import type { NewEntity } from "@/types";

// Props định nghĩa trực tiếp trong component
interface NewComponentProps {
  entity: NewEntity;
  onEntityChange: (entity: NewEntity) => void;
  className?: string;
}

const NewComponent = ({
  entity,
  onEntityChange,
  className,
}: NewComponentProps) => {
  // Component logic
};
```

## ✅ Best Practices

### ✅ Nên làm:

- Tạo interface trong **domain** cho business data
- Tạo interface trong **components** cho React props
- Sử dụng `BaseComponentProps` cho tất cả component props
- Import với `import type` để tree-shaking tốt hơn
- Đặt tên interface rõ ràng: `UserProfile`, `PaymentMethodSelectorProps`

### ❌ Không nên làm:

- Tạo inline interface trong component files
- Mix business logic và UI props trong cùng 1 interface
- Sử dụng `any` type
- Tạo interface quá generic không rõ mục đích

## 🔍 Tìm kiếm Types

### Tìm Business Interface:

```typescript
// domains/[business-area].ts
domains/payment.ts    → PaymentMethod, Transaction, PromoCode
domains/freelancer.ts → FreelancerProfile, Review, Skill
domains/booking.ts    → Pet, ServiceOption, BookingRequest
```

## ✅ Best Practices

### ✅ Nên làm:

- Tạo interface trong **domains/** cho business entity data
- Tạo interface props **trực tiếp trong component** cho React props
- Import với `import type` để tree-shaking tốt hơn
- Đặt tên interface rõ ràng: `UserProfile`, `PaymentMethod`
- Sử dụng enum cho các giá trị cố định

### ❌ Không nên làm:

- Tạo component props trong types/components (folder này đã bị xóa)
- Mix business logic và UI props trong domain interfaces
- Sử dụng `any` type
- Export component props ra ngoài nếu không cần thiết

## 🔍 Tìm kiếm Types

### Tìm Business Entity Interface:

```typescript
// domains/[business-area].ts
domains/payment.ts     → PaymentMethod, Transaction, PromoCode, CardData
domains/freelancer.ts  → FreelancerProfile, Review, FreelancerService
domains/booking.ts     → Pet, ServiceOption, BookingRequest, TimeSlot
domains/profile.ts     → UserProfile, Certification, Availability
domains/community.ts   → Post, Comment, CommunityMember
domains/events.ts      → Event, EventCategory, FilterState
domains/PostCategory.ts → PostCategory enum
```

### Tìm Component Props:

Component props giờ được định nghĩa trực tiếp trong file component:

```typescript
// Xem trong file component tương ứng
components / payment / PaymentCardForm.tsx;
components / booking / ServiceSelection.tsx;
components / profile / UserProfileCard.tsx;
```

## 🚀 Kết quả đạt được

- **Type Safety**: Đảm bảo type-safe trong toàn bộ app
- **Developer Experience**: IntelliSense và auto-completion tốt hơn
- **Code Quality**: Giảm bugs liên quan đến data types
- **Maintainability**: Dễ maintain và refactor
- **Component Colocation**: Props gần với component, dễ tìm và sửa
- **Onboarding**: Developer mới dễ hiểu structure

---

**📝 Lưu ý**: Khi thêm feature mới, hãy theo cấu trúc này để duy trì consistency!
