# 📁 Types Directory Structure

Hệ thống **TypeScript interfaces** được tổ chức có cấu trúc để dễ dàng maintain và sử dụng.

## 🎯 Mục tiêu tổ chức

- **Separation of Concerns**: Tách biệt business logic và UI components
- **Reusability**: Types có thể tái sử dụng ở nhiều nơi
- **Maintainability**: Dễ tìm kiếm và chỉnh sửa
- **Scalability**: Dễ mở rộng khi thêm tính năng mới

## 📂 Cấu trúc thư mục

```
types/
├── domains/           # 🏢 Business Domain Interfaces
│   ├── payment.ts     # Thanh toán, giao dịch, hóa đơn
│   ├── freelancer.ts  # Thông tin freelancer, dịch vụ
│   ├── events.ts      # Sự kiện, filter, categories
│   ├── community.ts   # Bài viết, comment, thành viên
│   ├── booking.ts     # Đặt chỗ, thú cưng, dịch vụ
│   └── profile.ts     # Hồ sơ người dùng, preferences
├── components/        # 🧩 React Component Props
│   ├── common.ts      # Props chung cho tất cả components
│   ├── payment.ts     # Props cho payment components
│   ├── freelancer.ts  # Props cho freelancer components
│   ├── events.ts      # Props cho event components
│   ├── community.ts   # Props cho community components
│   ├── booking.ts     # Props cho booking components
│   └── profile.ts     # Props cho profile components
└── index.ts          # 📤 Entry point - export tất cả types
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

## 🧩 COMPONENTS - React Component Props

**Mục đích**: Chứa các interface cho **props của React components**.

### Cấu trúc Props Interface:

```typescript
// Tất cả component props đều extend BaseComponentProps
interface BaseComponentProps {
  className?: string;
  id?: string;
  "data-testid"?: string;
}

// Ví dụ: Props cho PaymentMethodSelector component
interface PaymentMethodSelectorProps extends BaseComponentProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  availableMethods: PaymentMethod[];
  isLoading?: boolean;
}
```

## 📤 INDEX.TS - Entry Point

File này export **tất cả types** để dễ dàng import:

```typescript
// Import organized types
import type {
  PaymentMethod, // từ domains/payment.ts
  PaymentMethodSelectorProps, // từ components/payment.ts
} from "@/types";

// Hoặc import specific domain
import type { UserProfile } from "@/types/domains/profile";
import type { UserProfileCardProps } from "@/types/components/profile";
```

## 🔄 Migration Guide

### Trước khi tổ chức:

```typescript
// Scattered interfaces trong component files
// payment/PaymentMethodSelector.tsx
interface Props {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

// profile/UserCard.tsx
interface UserCardProps {
  user: any; // ❌ Không type-safe
}
```

### Sau khi tổ chức:

```typescript
// Organized imports
import type { PaymentMethod, PaymentMethodSelectorProps } from "@/types";

// Component với type-safe props
const PaymentMethodSelector: FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  // ✅ Type-safe, intellisense hoạt động
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

### 2. Tạo Component Props

```typescript
// types/components/[domain].ts
import type { NewEntity } from "../domains/[domain]";
import type { BaseComponentProps } from "./common";

export interface NewComponentProps extends BaseComponentProps {
  entity: NewEntity;
  onEntityChange: (entity: NewEntity) => void;
}
```

### 3. Sử dụng trong Component

```typescript
// components/NewComponent.tsx
import type { NewComponentProps } from "@/types/components/[domain]";

const NewComponent: FC<NewComponentProps> = ({
  entity,
  onEntityChange,
  className,
}) => {
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

### Tìm Component Props:

```typescript
// components/[feature-area].ts
components/payment.ts    → PaymentMethodSelectorProps, PaymentCardFormProps
components/freelancer.ts → FreelancerListProps, FreelancerCardProps
components/booking.ts    → BookingSummaryProps, PetSelectorProps
```

## 🚀 Kết quả đạt được

- **Type Safety**: Đảm bảo type-safe trong toàn bộ app
- **Developer Experience**: IntelliSense và auto-completion tốt hơn
- **Code Quality**: Giảm bugs liên quan đến data types
- **Maintainability**: Dễ maintain và refactor
- **Onboarding**: Developer mới dễ hiểu structure

---

**📝 Lưu ý**: Khi thêm feature mới, hãy theo cấu trúc này để duy trì consistency!
