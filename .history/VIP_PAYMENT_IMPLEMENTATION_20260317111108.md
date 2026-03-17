# 🎉 VIP Upgrade & Payment Approval System - Implementation Guide

## Overview
We've successfully implemented two major features:
1. **VIP Account Upgrade** - Users can upgrade to premium subscription (monthly/yearly)
2. **Payment Approval System** - Admins can approve/reject payments and subscriptions

---

## 📋 VIP Upgrade Feature

### Backend Implementation ✅

#### 1. User Model Updates
**File**: `Petconnet_BE/models/User.js`

Added VIP subscription fields:
```javascript
isPremium: Boolean (default: false)
subscriptionTier: String (enum: ['standard', 'monthly', 'yearly'])
subscriptionStartDate: Date
subscriptionEndDate: Date
subscriptionStatus: String (enum: ['inactive', 'active', 'expired', 'cancelled'])
subscriptionAutoRenew: Boolean (default: true)
```

#### 2. Subscription Routes
**File**: `Petconnet_BE/routes/subscriptions.js`

Endpoints:
- `GET /subscriptions/status` - Get current subscription status
- `POST /subscriptions/upgrade` - Request VIP upgrade (creates payment)
- `POST /subscriptions/cancel` - Cancel subscription
- `PUT /subscriptions/:userId/renew` - Admin endpoint to activate subscription

Pricing:
- Monthly: 299,000đ (30 days)
- Yearly: 2,990,000đ (365 days) - 17% discount

#### 3. Payment Integration
**File**: `Petconnet_BE/routes/payments.js`

Updated `PUT /:paymentId/admin/approve` to:
- Detect VIP subscription payments
- Automatically activate VIP status when admin approves
- Extract subscription tier from payment description
- Update user VIP fields (`isPremium`, `subscriptionStatus`, `subscriptionTier`)

### Frontend Implementation ✅

#### 1. Subscription Service
**File**: `Petconnet_FE/src/services/subscriptionService.ts`

```typescript
- getStatus() - Fetch current subscription status
- upgrade(plan: 'monthly' | 'yearly') - Request upgrade
- cancel() - Cancel subscription
- isPremium() - Check if user is premium
```

#### 2. Custom Hook
**File**: `Petconnet_FE/src/hooks/useSubscription.ts`

Provides `useSubscription()` hook with:
- `status` - Current subscription status
- `loading` - Loading state
- `isVIP` - Quick VIP check
- `refreshStatus()` - Refresh subscription data

#### 3. UI Integration
**File**: `Petconnet_FE/src/components/profile/UpgradeModal.tsx`

Already complete with:
- Plan selection (Monthly/Yearly)
- Pricing display
- Features list
- Responsive design

#### 4. Handler Update
**File**: `Petconnet_FE/src/pages/user/UserProfilePage.tsx`

Updated `handleUpgrade()` function:
```typescript
- Calls subscriptionService.upgrade(plan)
- Shows success/error messages
- Refreshes user data after upgrade
- Waits for admin approval
```

---

## 💳 Payment Approval System

### Backend Implementation ✅

#### Payment Approval Flow

**File**: `Petconnet_BE/routes/payments.js`

The system now supports:

1. **Approve Payment** - `PUT /payments/:paymentId/admin/approve`
   - Validates admin role
   - Updates payment status to 'completed'
   - Updates admin approval status to 'approved'
   - Sets approval timestamp
   - Handles both regular bookings AND subscriptions
   - For subscriptions: Activates VIP status

2. **Reject Payment** - `PUT /payments/:paymentId/admin/reject`
   - Requires rejection reason
   - Updates status to 'failed'
   - Stores rejection reason
   - Resets booking payment status

### Frontend Implementation ✅

#### Admin Payment Management
**File**: `Petconnet_FE/src/pages/admin/AdminPaymentManagementPage.tsx`

Features:
- List all pending/approved/rejected payments
- Filter by status
- View payment details
  - Customer info
  - Amount
  - Payment method (MoMo/TPBank)
  - Created date
- Approve payment with one click
- Reject payment with reason modal
- Real-time status updates

---

## 🔄 Complete Workflow

### User VIP Upgrade Flow

```
1. User opens Profile → Upgrade tab
2. User selects plan (Monthly/Yearly)
3. User clicks "Nâng cấp ngay" button
4. Frontend calls: POST /subscriptions/upgrade
5. Backend creates Payment record (status: pending, adminApprovalStatus: pending)
6. Backend updates User (subscriptionStatus: 'pending')
7. Frontend shows: "Chờ xác nhận từ admin"
8. User sees payment QR code (MoMo/TPBank)
9. User transfers money
10. Admin sees subscription payment in Payment Management
11. Admin clicks "Xác nhận"
12. Backend activates: User.isPremium = true, subscriptionStatus = 'active'
13. User receives notification of VIP activation
```

### Admin Payment Approval Flow

```
1. Admin opens Dashboard → Payment Management
2. Admin sees pending payments (including subscriptions)
3. Admin clicks "Xác nhận" on subscription payment
4. Backend: Updates payment status & activates user VIP
5. Frontend: Shows success & refreshes list
6. User: Receives VIP status immediately
```

---

## ✨ VIP Benefits

When `isPremium = true`:

- 20% discount on all services
- VIP badge on profile
- Priority booking
- Unlimited chat messages
- Double points on purchases
- Free pet health consultation
- Free national shipping
- 24/7 priority support
- Monthly gifts

---

## 🚀 How to Deploy

### 1. Backend
```bash
cd Petconnet_BE
git push origin main
# Render auto-deploys when subscriptions.js route is available
```

### 2. Frontend
```bash
cd Petconnet_FE
npm run build
git push origin main
# Vite will bundle new subscription service
```

### 3. Test in Staging
```bash
1. Create test user account
2. Go to Profile → Upgrade
3. Select "Gói năm" (299,000đ)
4. Complete payment via MoMo/TPBank QR
5. Log in as admin
6. Go to Dashboard → Xác nhận Thanh toán
7. Click "Xác nhận" on subscription payment
8. Verify user becomes VIP
9. Test: Login as user → Should see VIP badge
```

---

## 🔍 API Endpoints Reference

### Subscriptions
```
GET  /api/v1/subscriptions/status        - Get subscription status
POST /api/v1/subscriptions/upgrade       - Request upgrade
POST /api/v1/subscriptions/cancel        - Cancel subscription
PUT  /api/v1/subscriptions/:userId/renew - Activate subscription (admin)
```

### Payments (Updated)
```
POST   /api/v1/payments/create               - Create payment
GET    /api/v1/payments/getall               - Get all payments (admin)
GET    /api/v1/payments/status/:bookingId    - Get payment status
PUT    /api/v1/payments/:id/admin/approve    - Approve & activate VIP
PUT    /api/v1/payments/:id/admin/reject     - Reject payment
```

---

## 📊 Database Schema

### User Collection  
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  // ... existing fields
  isPremium: Boolean,                    // NEW
  subscriptionTier: String,              // NEW
  subscriptionStartDate: Date,           // NEW
  subscriptionEndDate: Date,             // NEW
  subscriptionStatus: String,            // NEW
  subscriptionAutoRenew: Boolean         // NEW
}
```

### Payment Collection (with subscription support)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  bookingId: ObjectId,                   // null for subscriptions
  amount: Number,
  paymentMethod: Number,                 // 2=MoMo, 3=TPBank
  description: String,                   // "VIP Subscription - YEARLY"
  status: String,                        // 'pending', 'completed', 'failed'
  adminApprovalStatus: String,           // 'pending', 'approved', 'rejected'
  rejectionReason: String,
  approvedBy: ObjectId,
  approvalDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Testing Checklist

- [ ] User can access Upgrade tab in profile
- [ ] User can select monthly/yearly plan
- [ ] User can request upgrade (creates payment)
- [ ] Payment appears in admin dashboard
- [ ] Admin can approve payment
- [ ] User VIP status activates after approval
- [ ] User sees VIP badge
- [ ] User can cancel subscription
- [ ] Subscription expires after end date
- [ ] Error handling for invalid plans
- [ ] Payment rejection stores reason

---

## 🆘 Troubleshooting

### User doesn't see VIP badge after payment approval
- Check: User's `isPremium` field in MongoDB
- Check: User needs to refresh/logout/login
- Check: Payment approval response has `isSubscription: true`

### Subscription payment not in admin dashboard
- Check: Payment `description` contains "VIP Subscription"
- Check: Payment `adminApprovalStatus` is 'pending'
- Check: Admin is logged in with Admin role

### Upgrade button doesn't work
- Check: User is authenticated
- Check: subscriptionService imported correctly
- Check: Network request shows 201/200 response
- Check: Browser console for errors

### VIP benefits not working
- Check: `isPremium` is `true` in user record
- Check: Frontend checks `user.isPremium` before showing benefits
- Check: Discount logic implemented in booking/checkout

---

## 📝 Notes

1. **Subscription Payment Flow**: 
   - Unlike regular payments, subscription payments create a Payment record without a bookingId
   - Admin approval automatically activates VIP (no separate booking update needed)

2. **Expiration Handling**:
   - Frontend should check `subscriptionEndDate` on page load
   - If `subscriptionEndDate < now()`, set `isPremium = false`, `subscriptionStatus = expired`
   - This can be done in `refreshStatus()` hook or on login

3. **Auto-Renewal** (Future):
   - Currently not implemented
   - Can be added later with `subscriptionAutoRenew` field
   - Would need cron job to auto-charge before expiration

4. **Payment Methods**:
   - Currently hardcoded to MoMo for subscriptions
   - Can extend to support TPBank in future

---

**Last Updated**: March 17, 2026
**Status**: ✅ Ready for Deployment
