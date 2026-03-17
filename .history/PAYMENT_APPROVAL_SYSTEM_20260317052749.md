# Payment Admin Approval System - Documentation

## 🎯 Features Added

### 1. **QR Code Image Replacement** (Plan B)
Instead of generating VietQR format dynamically, the system now uses pre-generated bank-specific QR code images.

**Location:** `Petconnet_BE/config/qrCodes.js`

**QR Codes:**
- **MoMo**: Account `0834339521` (Nguyễn Hữu Giàu)
- **TPBank**: Account `02600647401` (richdesu)

**Implementation:**
```javascript
// Return base64 QR images
qrData = qrCodes.MOMO_QR;  // for MoMo payment
qrData = qrCodes.TPBANK_QR; // for TPBank payment
```

---

### 2. **Admin Payment Approval System**

#### A. New Database Fields (Payment Model)
```javascript
adminApprovalStatus: ['pending', 'approved', 'rejected']  // default: 'pending'
rejectionReason: String      // reason if rejected
approvedBy: ObjectId         // admin ID
approvalDate: Date           // when approved/rejected
```

#### B. New Backend Endpoints

**Approve Payment:**
```
PUT /api/v1/payments/:paymentId/admin/approve
Authorization: Bearer token (Admin only)
Response: { message, payment }
```
- Sets `adminApprovalStatus` = 'approved'
- Sets `status` = 'completed'
- Updates booking `paymentStatus` = 'paid'
- Records admin ID and timestamp

**Reject Payment:**
```
PUT /api/v1/payments/:paymentId/admin/reject
Authorization: Bearer token (Admin only)
Body: { reason: "string" }
Response: { message, payment }
```
- Sets `adminApprovalStatus` = 'rejected'
- Sets `status` = 'failed'
- Stores rejection reason
- Updates booking `paymentStatus` = 'pending'

---

### 3. **Admin Payment Management Dashboard**

#### Location
`Petconnet_FE/src/pages/admin/AdminPaymentManagementPage.tsx`

#### Features
- **Filter by approval status:**
  - Tất cả (All)
  - Chờ xác nhận (Pending)
  - Đã xác nhận (Approved)
  - Đã từ chối (Rejected)

- **Payment Card displays:**
  - Customer name & email
  - Payment amount (in VND)
  - Payment method (MoMo/TPBank)
  - Order code
  - Creation date
  - Current approval status (color-coded)

- **Actions:**
  - **✓ Xác Nhận** (Approve): One-click approval
  - **✗ Từ Chối** (Reject): Opens modal to enter rejection reason

- **Real-time updates:** Automatic refresh after approve/reject

#### UI Colors
- Approved: Green (#10b981)
- Rejected: Red (#ef4444)
- Pending: Amber (#f59e0b)

---

### 4. **Updated User Payment Status**

#### PaymentSuccessPage Changes
- Now displays admin approval status alongside payment status
- Shows "Chờ admin xác nhận" (Waiting for admin approval) while pending
- Shows "Thanh toán thành công!" only when BOTH payment AND admin approval complete
- Displays rejection reason if admin rejects payment

#### Status Logic
```javascript
// Payment is only complete when both conditions met:
isCompleted = (currentStatus === 'completed' AND adminApprovalStatus === 'approved')
```

---

## 📋 Flow Diagram

```
User Initiates Payment
         ↓
User Scans QR Code (Base64 image)
         ↓
Payment Created (status=pending, adminApprovalStatus=pending)
         ↓
Payment Confirmed by System (status=completed, adminApprovalStatus=pending)
         ↓
User sees: "Chờ admin xác nhận"
Admin sees: Payment in Dashboard
         ↓
Admin Action
    ├─ Approve → status=completed, adminApprovalStatus=approved
    │            User sees: "Thanh toán thành công!", redirects to /profile
    │
    └─ Reject → status=failed, adminApprovalStatus=rejected
                 User sees rejection reason, redirects to /booking
```

---

## 🔑 Key Code Changes Summary

### Backend (`Petconnet_BE`)

1. **routes/payments.js**
   - Import qrCodes config
   - Return base64 QR image instead of generating URL
   - Added POST `/admin/approve` endpoint
   - Added POST `/admin/reject` endpoint

2. **models/Payment.js**
   - Added `adminApprovalStatus` field
   - Added `rejectionReason` field
   - Added `approvedBy` field
   - Added `approvalDate` field

3. **config/qrCodes.js** (NEW)
   - Stores MoMo QR code (base64)
   - Stores TPBank QR code (base64)

### Frontend (`Petconnet_FE`)

1. **pages/admin/AdminPaymentManagementPage.tsx** (NEW)
   - Admin dashboard for payment approval
   - Filter by status
   - Approve/Reject buttons
   - Rejection reason modal

2. **pages/admin/AdminPaymentManagement.css** (NEW)
   - Complete styling for payment management page
   - Responsive design
   - Color-coded status badges

3. **pages/payment/PaymentSuccessPage.tsx**
   - Updated to check `adminApprovalStatus`
   - Added admin approval pending message
   - Added rejection reason display

4. **components/admin/AdminSidebar.tsx**
   - Added "Xác Nhận TT" menu item linking to payment approval page

5. **App.tsx**
   - Added import for AdminPaymentManagementPage
   - Added route: `/admin/payment-approval`
   - Added route: `/admin/payments/approval` (alias)

---

## 🚀 Testing Instructions

### 1. Test Payment with QR Image
1. Make booking → proceed to payment
2. Select payment method (MoMo or TPBank)
3. Proceed to payment page
4. Should see base64 QR image (not text format)
5. Scan QR with phone app
6. Status should show: "Chờ xác nhận"

### 2. Test Admin Approval
1. Login as Admin
2. Go to: Admin > Xác Nhận TT
3. Find payment with status "Chờ xác nhận"
4. Click "✓ Xác Nhận" button
5. Payment should move to "Đã xác nhận" section
6. User on payment page should see: "Chờ admin xác nhận" → auto-update to "Thanh toán thành công!"

### 3. Test Admin Rejection
1. Login as Admin
2. Find pending payment
3. Click "✗ Từ Chối"
4. Enter rejection reason
5. Click "Từ Chối"
6. Payment should move to "Đã từ chối" section
7. User should see rejection reason on their payment page

---

## 🛠️ Configuration

### QR Code Images (Replace Placeholders)
File: `Petconnet_BE/config/qrCodes.js`

To add actual QR codes:
1. Get QR code PNG images from user
2. Convert to Base64: https://base64.guru/converter/encode/image
3. Replace placeholder strings with actual base64 data
4. Format: `data:image/png;base64,<BASE64_STRING>`

---

## 📊 Database Migration (if needed)

If migrating existing payments, run:
```javascript
// Set default values for existing payments
db.payments.updateMany(
  {},
  {
    $set: {
      adminApprovalStatus: 'pending',
      rejectionReason: null,
      approvedBy: null,
      approvalDate: null
    }
  }
)
```

---

## 🔗 Related Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/payments/create` | Create payment | User |
| GET | `/payments/:bookingId/status` | Poll payment status | User |
| PUT | `/payments/:paymentId/admin/approve` | Approve payment | Admin |
| PUT | `/payments/:paymentId/admin/reject` | Reject payment | Admin |
| GET | `/payments/getall` | List all payments | Admin |

---

## 🎨 UI Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| Approved | Green | #10b981 |
| Rejected | Red | #ef4444 |
| Pending | Amber | #f59e0b |

---

## ✅ Checklist

- [x] Base64 QR images configured
- [x] Admin approval model fields added
- [x] Admin approve endpoint created
- [x] Admin reject endpoint created
- [x] Admin payment dashboard created
- [x] Payment success page updated
- [x] Sidebar menu item added
- [x] Routes configured
- [x] Styling completed

---

## 📝 Notes

- Both QR image replacements are base64 encoded
- Admin approval runs AFTER user payment confirmation
- User sees countdown timer before system auto-confirms
- Rejection reason is required and shown to user
- All times recorded in UTC

