# 💳 PETCONNECT PAYMENT FLOW - CHI TIẾT TỪNG BƯỚC

## TIMING & SEQUENCE FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER BOOKING TO PAYMENT COMPLETE                     │
└─────────────────────────────────────────────────────────────────────────────┘

TIME          CUSTOMER              FRONTEND              BACKEND              DATABASE
────────────────────────────────────────────────────────────────────────────────

14:00:00  ┌─ Browse Services
          │  Click "Book Now"     
          │
          └────────────────────────→ BookingPage.tsx
                                   Load service details
                                   Show form

14:00:15  ┌─ Fill booking form
          │ - Select Pet: Max
          │ - Date: 2026-03-22
          │ - Time: 08:00 AM
          │ - Special Notes: "shy"
          │
          └────────────────────────→ Validation check
                                   Calculate price
                                   Show summary: 350,000 VND

14:00:30  ┌─ Click "Proceed"        
          │
          └────────────────────────→ POST /api/v1/bookings/create
                                   {
                                     freelancerId: "...",
                                     serviceId: "...",
                                     petIds: ["..."],
                                     scheduledDate: "2026-03-22",
                                     timeSlot: "morning",
                                     totalAmount: 350000
                                   }
                                                        ───────────→ CREATE Booking
                                                                    status: "pending"
                                                                    paymentStatus: "unpaid"
                                                                    _id: "booking-456"

                                   ← Response with bookingId
                           
                           Navigate to /payment

14:00:45  [QR CODE PAGE LOADED]     Display payment methods
          See 2 options:
          📱 MoMo
          🏦 TPBank

14:01:00  ┌─ Click MoMo             
          │
          └────────────────────────→ handleCreatePayment()
                                   POST /api/v1/payments/create
                                   {
                                     bookingId: "booking-456",
                                     method: 2,
                                     returnUrl: "...",
                                     description: "Pet Grooming"
                                   }
                                                        ───────────→ CREATE Payment
                                                                    bookingId: "booking-456"
                                                                    userId: "customer-789"
                                                                    amount: 350000
                                                                    method: 2
                                                                    qrData: "/images/qr-codes/qr-momo.png"
                                                                    status: "pending"
                                                                    adminApprovalStatus: "pending"
                                                                    _id: "payment-123"

                                   ← Response:
                                   {
                                     paymentId: "payment-123",
                                     qrData: "/images/qr-codes/qr-momo.png",
                                     amount: 350000,
                                     methodName: "MoMo",
                                     accountNumber: "0834339521",
                                     recipientName: "Nguyễn Hữu Giàu"
                                   }

                           Display QR code
                           Start countdown: 120s timer

14:01:15  ┌─ See QR code
          │ See account details:
          │ • Recipient: Nguyễn Hữu Giàu
          │ • Account: 0834339521
          │ • Amount: 350,000 VND
          │ • Timer: 118s
          │
          │ Open MoMo App
          │ → Camera
          │ → Scan QR
          │ → Confirm transfer
          │ → Enter PIN
          │ → SUCCESS ✓

14:01:30  [CUSTOMER TRANSFERRED]    Pending status check...

          Frontend starts polling:
          checkPaymentStatus() every 3 seconds
                                   GET /api/v1/payments/status/booking-456
                                                        ───────────→ Query Payment
                                                                    Find: status, adminApprovalStatus
                                                                    Still: status="pending"
                                                                    Still: adminApprovalStatus="pending"

                           response.status = "pending"
                           Countdown continues: 90s

14:02:00  [FRONTEND POLLING...]     checkPaymentStatus()
          Countdown: 60s              GET /api/v1/payments/status/booking-456
                                                        ───────────→ Still "pending"
                                                                    (waiting for MoMo to confirm)

14:02:30  [FRONTEND POLLING...]     checkPaymentStatus()
          Countdown: 30s              GET /api/v1/payments/status/booking-456
          ⚠️  Warning shows!                            ───────────→ Query Payment
                                                                    
                                                                    [BACKEND WEBHOOK RECEIVED]
                                                                    MoMo confirms transfer OK
                                                                    Reference: 20260317ABC123
                                                                    
                                                                    UPDATE Payment:
                                                                    status: "completed"
                                                                    transactionId: "20260317ABC123"
                                                                    completedAt: 2026-03-17T14:02:40Z

                           ← Response:
                           {
                             status: "completed",
                             adminApprovalStatus: "pending"
                           }

                           Display: "💚 Thanh toán được ghi nhận"
                           Show: "Chờ admin xác nhận"
                           Keep polling...

14:03:00  [WAITING FOR ADMIN]       Polling continues
          Countdown: 0s              Every 3s check:
          Timer ended               GET /api/v1/payments/status/booking-456
          Page shows:                                ───────────→ Query Payment
          - Amount: 350,000 VND                      status: "completed"
          - Status: "Chờ admin"                      adminApprovalStatus: "pending"
          - QR Code displayed
          - "Admin will confirm..."

────────────────────────────────────────────────────────────────────────────────
                            ADMIN DASHBOARD (Parallel)
────────────────────────────────────────────────────────────────────────────────

14:02:45  [ADMIN SEES NOTIFICATION]
          AdminPaymentsPage loads      GET /api/v1/payments/getall
          Pending count shows: 1                    ───────────→ Query all payments
                                                                  where: status="completed"
                                                                  AND adminApprovalStatus="pending"
                                                                  
                                                                  Returns: [payment-123]

          Shows payment card:
          - Customer: Anh Tú
          - Method: MoMo (0834339521)
          - Amount: 350,000 VND
          - Status: PENDING
          - [✓ Approve] [✗ Reject] buttons

14:04:00  [ADMIN REVIEWS]
          Checks details:
          - Customer verified? YES
          - Transaction ID valid? YES
          - Amount correct? YES
          
          Clicks [✓ Approve]          PUT /api/v1/payments/payment-123/admin/approve
                                      {
                                        adminUserId: "admin-234"
                                      }
                                                        ───────────→ UPDATE Payment:
                                                                    adminApprovalStatus: "approved"
                                                                    status: "completed"
                                                                    approvedBy: "admin-234"
                                                                    approvalDate: 2026-03-17T14:04:05Z

                                                                    UPDATE Booking:
                                                                    status: "confirmed"
                                                                    paymentStatus: "paid"

                                                                    TRIGGER: sendNotifications()
                                                                    
                                      ← Response: "Approved successfully"

          Shows: "✅ Approved"
          Removes from pending list

────────────────────────────────────────────────────────────────────────────────
                        NOTIFICATIONS TRIGGERED
────────────────────────────────────────────────────────────────────────────────

14:04:05                              Backend: sendNotifications()
                                      
                                      1. Query Customer info
                                         customerEmail: "atu@example.com"
                                         customerName: "Anh Tú"
                                      
                                      2. Query Freelancer info
                                         freelancerEmail: "linh@example.com"
                                         freelancerName: "Ms. Linh"
                                      
                                      3. Send Email to Customer:
                                         Template: booking-confirmed-customer
                                         Subject: "✅ Your pet service booking is confirmed!"
                                         Body includes:
                                         - Freelancer: Ms. Linh
                                         - Pet: Max
                                         - Date: March 22, Saturday
                                         - Time: 8:00 AM
                                         - Amount: 350,000 VND
                                         
                                         Queue: Email Service
                                         Status: QUEUED → SENT (15 seconds)
                                      
                                      4. Send Email to Freelancer:
                                         Subject: "💼 You have a new booking!"
                                         Body includes:
                                         - Customer: Anh Tú
                                         - Pet: Max
                                         - Special notes: "shy"
                                         - Your earnings: 280,000 VND (80% after fee)
                                         - Date/Time confirmed
                                         
                                         Queue: Email Service
                                         Status: QUEUED → SENT (20 seconds)
                                      
                                      5. Save Notification record:
                                         For Freelancer ID:
                                         title: "New Booking Confirmed! 💼"
                                         body: "Anh Tú's Max needs Pet Grooming"
                                         type: "booking_confirmed"
                                         status: "unread"
                                      
                                      6. Push notification to Freelancer app
                                         Status: SENT

14:04:10  [CUSTOMER APP UPDATES]     Frontend polling detects change:
                                      GET /api/v1/payments/status/booking-456
                                      
                                      Response:
                                      {
                                        status: "completed",
                                        adminApprovalStatus: "approved"
                                      }

          ✅ PAYMENT APPROVED!
          Show: "✅ Thanh toán thành công!"
          Show: "Booking confirmed with Ms. Linh"
          Show: Freelancer details
          
          Email received in inbox:
          "✅ Your pet service booking is confirmed!"

14:04:15  [FREELANCER APP]           
          Push notification arrives: 
          "💼 New Booking Confirmed!"
          "Anh Tú's Max needs Pet Grooming"
          
          Open app → See new booking
          Details:
          - Customer: Anh Tú
          - Pet: Max (Labrador)
          - Special: "shy - use gentle techniques"
          - Date: March 22, Saturday
          - Time: 8:00 AM
          - Location: District 1
          
          Email received:
          "💼 You have a new booking confirmed!"
          Earnings: 280,000 VND

────────────────────────────────────────────────────────────────────────────────
                            FINAL STATES
────────────────────────────────────────────────────────────────────────────────

DATABASE STATE:

Booking:
{
  _id: "booking-456",
  customerId: "customer-789",
  freelancerId: "freelancer-234",
  serviceId: "service-567",
  petIds: ["pet-890"],
  scheduledDate: "2026-03-22T08:00:00Z",
  timeSlot: "morning",
  totalAmount: 350000,
  specialInstructions: "shy",
  status: "confirmed",           ← CHANGED from pending
  paymentStatus: "paid",         ← CHANGED from unpaid
  createdAt: "2026-03-17T14:00:30Z",
  updatedAt: "2026-03-17T14:04:05Z"
}

Payment:
{
  _id: "payment-123",
  bookingId: "booking-456",
  userId: "customer-789",
  amount: 350000,
  currency: "VND",
  paymentMethod: "MoMo",
  method: 2,
  accountNumber: "0834339521",
  recipientName: "Nguyễn Hữu Giàu",
  qrData: "/images/qr-codes/qr-momo.png",
  status: "completed",           ← CHANGED from pending
  adminApprovalStatus: "approved",    ← CHANGED from pending
  transactionId: "20260317ABC123",
  approvedBy: "admin-234",
  approvalDate: "2026-03-17T14:04:05Z",
  completedAt: "2026-03-17T14:02:40Z",
  createdAt: "2026-03-17T14:01:00Z",
  updatedAt: "2026-03-17T14:04:05Z"
}

Notification (Freelancer):
{
  _id: "notif-111",
  userId: "freelancer-234",
  title: "New Booking Confirmed! 💼",
  body: "Anh Tú's Max needs Pet Grooming on March 22",
  type: "booking_confirmed",
  status: "unread",
  relatedId: "booking-456",
  createdAt: "2026-03-17T14:04:05Z"
}
```

---

## DETAILED API CALL SEQUENCE

### 1️⃣ CREATE BOOKING
```
REQUEST:
POST /api/v1/bookings/create
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "freelancerId": "freelancer-234",
  "serviceId": "service-567",
  "petIds": ["pet-890"],
  "scheduledDate": "2026-03-22T08:00:00Z",
  "timeSlot": "morning",
  "specialInstructions": "shy, use gentle techniques",
  "totalAmount": 350000
}

PROCESSING:
1. Auth middleware validates token
2. Find freelancer - verify exists and role="Freelancer"
3. Validate service exists
4. Validate pet belongs to customer
5. Create booking document
6. Save to database
7. Return response

RESPONSE (201 Created):
{
  "success": true,
  "bookingId": "booking-456",
  "totalAmount": 350000,
  "message": "Booking created successfully"
}

STATUS CODES:
✓ 201 - Booking created
✗ 400 - Invalid data
✗ 404 - Freelancer/Service/Pet not found
✗ 401 - Unauthorized
✗ 500 - Server error
```

### 2️⃣ CREATE PAYMENT
```
REQUEST:
POST /api/v1/payments/create
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "bookingId": "booking-456",
  "method": 2,
  "returnUrl": "https://petconnect.vn/payment/success",
  "description": "Pet Grooming Service"
}

PROCESSING:
1. Auth middleware validates token → customer-789
2. Find booking by ID
3. Verify booking status = "pending"
4. Select QR code image based on method:
   - method=2 → qrCodes.MOMO_QR
   - method=3 → qrCodes.TPBANK_QR
5. Create payment record
6. Save to database
7. Return payment details

RESPONSE (201 Created):
{
  "paymentId": "payment-123",
  "bookingId": "booking-456",
  "method": 2,
  "methodName": "MoMo",
  "accountNumber": "0834339521",
  "recipientName": "Nguyễn Hữu Giàu",
  "qrData": "/images/qr-codes/qr-momo.png",
  "amount": 350000,
  "status": "pending"
}

DATABASE CHANGE:
Collection: payments
Insert: {
  _id: ObjectId("payment-123"),
  bookingId: ObjectId("booking-456"),
  userId: ObjectId("customer-789"),
  amount: 350000,
  paymentMethod: "MoMo",
  method: 2,
  qrData: "/images/qr-codes/qr-momo.png",
  status: "pending",
  adminApprovalStatus: "pending",
  createdAt: ISODate("2026-03-17T14:01:00.000Z"),
  updatedAt: ISODate("2026-03-17T14:01:00.000Z")
}
```

### 3️⃣ POLL PAYMENT STATUS (Frontend - Every 3 seconds)
```
REQUEST:
GET /api/v1/payments/status/booking-456
Authorization: Bearer {customer_token}

PROCESSING:
1. Auth middleware validates token
2. Find payment where bookingId = "booking-456"
3. Select only: status, adminApprovalStatus, amount
4. Return to frontend

RESPONSE (200 OK):
First call (14:01:30):
{
  "paymentId": "payment-123",
  "status": "pending",
  "adminApprovalStatus": "pending",
  "amount": 350000
}

Later call (14:02:40 - after MoMo webhook):
{
  "paymentId": "payment-123",
  "status": "completed",
  "adminApprovalStatus": "pending",
  "amount": 350000
}

Final call (14:04:10 - after admin approval):
{
  "paymentId": "payment-123",
  "status": "completed",
  "adminApprovalStatus": "approved",
  "amount": 350000
}
```

### 4️⃣ ADMIN APPROVE PAYMENT
```
REQUEST:
PUT /api/v1/payments/payment-123/admin/approve
Authorization: Bearer {admin_token}
Content-Type: application/json

{}

PROCESSING:
1. Auth middleware validates token → admin-234
2. Check user.role === "Admin" → verify
3. Find payment by ID
4. Update payment:
   - Set adminApprovalStatus = "approved"
   - Set approvedBy = admin-234
   - Set approvalDate = now
5. Find booking and update:
   - Set status = "confirmed"
   - Set paymentStatus = "paid"
6. Trigger sendNotifications()
   - Get customer and freelancer info
   - Send emails
   - Create notification records
   - Send push notifications
7. Log action
8. Return updated payment

RESPONSE (200 OK):
{
  "message": "Payment approved successfully",
  "payment": {
    "_id": "payment-123",
    "status": "completed",
    "adminApprovalStatus": "approved",
    "approvedBy": "admin-234",
    "approvalDate": "2026-03-17T14:04:05Z"
  }
}

DATABASE CHANGES:
1. payments collection:
   UPDATE where _id="payment-123"
   SET {
     adminApprovalStatus: "approved",
     approvedBy: ObjectId("admin-234"),
     approvalDate: ISODate("2026-03-17T14:04:05Z"),
     updatedAt: ISODate("2026-03-17T14:04:05Z")
   }

2. bookings collection:
   UPDATE where _id="booking-456"
   SET {
     status: "confirmed",
     paymentStatus: "paid",
     updatedAt: ISODate("2026-03-17T14:04:05Z")
   }

3. notifications collection:
   INSERT {
     userId: ObjectId("freelancer-234"),
     title: "New Booking Confirmed! 💼",
     body: "Anh Tú's Max needs Pet Grooming",
     type: "booking_confirmed",
     status: "unread",
     relatedId: ObjectId("booking-456"),
     createdAt: ISODate("2026-03-17T14:04:05Z")
   }
```

---

## ALTERNATIVE: ADMIN REJECT PAYMENT

```
REQUEST:
PUT /api/v1/payments/payment-123/admin/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Transfer from unverified account - suspected fraud"
}

PROCESSING:
1. Auth middleware validates token → admin-234
2. Check user.role === "Admin"
3. Find payment by ID
4. Validate reason provided
5. Update payment:
   - Set status = "failed"
   - Set adminApprovalStatus = "rejected"
   - Set rejectionReason = reason
   - Set approvedBy = admin-234
   - Set approvalDate = now
6. Find booking and update:
   - Set status = "pending"
   - Set paymentStatus = "unpaid"
7. Create refund:
   - Log refund transaction
   - Send money back to customer's MoMo
8. Send notifications:
   - Email to customer: "Payment rejected - reason: ..."
   - Email to freelancer: "Booking cancelled - payment rejected"
9. Delete notification from freelancer app
10. Log action

RESPONSE (200 OK):
{
  "message": "Payment rejected",
  "payment": {
    "_id": "payment-123",
    "status": "failed",
    "adminApprovalStatus": "rejected",
    "rejectionReason": "Transfer from unverified account - suspected fraud"
  }
}

DATABASE CHANGES:
1. payments collection:
   SET {
     status: "failed",
     adminApprovalStatus: "rejected",
     rejectionReason: "...",
     approvedBy: ObjectId("admin-234"),
     approvalDate: ISODate("2026-03-17T14:04:05Z")
   }

2. bookings collection:
   UPDATE where _id="booking-456"
   SET {
     status: "pending",
     paymentStatus: "unpaid"
   }

3. refunds collection:
   INSERT {
     paymentId: ObjectId("payment-123"),
     customerId: ObjectId("customer-789"),
     amount: 350000,
     reason: "admin_rejected",
     status: "processing",
     refundDate: ISODate("2026-03-17T14:04:05Z")
   }
```

---

## BACKEND WEBHOOK FLOW (When MoMo Confirms)

```
EXTERNAL: MoMo Server (2026-03-17 14:02:40)
├─ Detects successful transfer from customer's account
├─ Transaction ID: 20260317ABC123
├─ Amount: 350,000 VND
└─ Sends webhook to backend

REQUEST (from MoMo):
POST /api/v1/payments/momo-webhook
Content-Type: application/json
X-Signature: {signature}

{
  "transactionId": "20260317ABC123",
  "accountNumber": "0834339521",
  "amount": 350000,
  "messageWithTransactionId": "transfer 350000 VND",
  "when": "2026-03-17 14:02:40",
  "status": "success"
}

BACKEND PROCESSING:
1. Verify signature (security check)
2. Find payment where accountNumber matches
3. Validate amount matches
4. UPDATE payment:
   SET {
     status: "completed",
     transactionId: "20260317ABC123",
     completedAt: ISODate("2026-03-17T14:02:40Z")
   }
5. Send acknowledgment to MoMo
6. Log transaction

RESPONSE:
{
  "status": 200,
  "message": "Webhook processed successfully"
}

DATABASE UPDATE:
payments collection:
WHERE accountNumber="0834339521" AND amount=350000
UPDATE SET {
  status: "completed",
  transactionId: "20260317ABC123",
  completedAt: ISODate("2026-03-17T14:02:40Z")
}
```

---

## ERROR SCENARIOS

### Scenario A: Payment Link Expires (120 seconds)
```
Timeline:
14:01:00 - Payment created, countdown starts (120s)
14:03:00 - Timer reaches 0, page shows: "⏰ Payment link expired"

Frontend stops polling when:
- countdownSeconds <= 0 AND status still "pending"

Show message:
"Your payment link has expired. Please create a new payment link."

Button: [Try Again] → Creates new payment record

Backend cleanup (optional):
- Mark old payment as "expired"
- Keep for audit trail
- Create new payment record
```

### Scenario B: Customer Sends Wrong Amount
```
Customer transfers: 340,000 VND instead of 350,000 VND

MoMo webhook:
{
  amount: 340000,  // ≠ expected 350000
  status: "success"
}

Backend receives:
- Cannot match payment record (amount mismatch)
- Flag as suspicious
- Log error
- Notify admin: "Mismatched payment received"

Admin sees:
- New payment record with wrong amount
- Cannot approve
- Must reject with reason: "Amount mismatch"
- Refund initiated automatically
```

### Scenario C: Customer Tries to Pay Twice
```
Timeline:
14:01:00 - First payment created (payment-123)
14:01:05 - Customer clicks "Try Again" by mistake
           Second payment created (payment-124)

Frontend detects:
- Query payments for same bookingId
- Multiple active payments exist
- Show warning: "Payment already in progress"
- Lock payment buttons

Admin sees:
- Two payments for same booking
- Only one should be active
- Reject second payment as duplicate
- Refund second payment
```

### Scenario D: Admin Typo - Reject Then Regret
```
14:04:00 - Admin accidentally clicks [Reject]
14:04:01 - Payment rejected

Admin cannot undo rejection via UI.

Resolution:
- Re-approve process:
  1. Customer creates new payment record
  2. Admin approves new one
  3. Original rejected payment stays in history for audit

OR

- Manual override (Admin-only):
  - Contact platform dev
  - Direct database update with audit log
```

---

## NOTIFICATION CASCADE

```
┌─ Admin Approves Payment ─────────────────────────────────────┐
│                                                              │
├─→ Update Payment status="completed", admin="approved"       │
│                                                              │
├─→ Update Booking status="confirmed", paymentStatus="paid"   │
│                                                              │
├─→ TRIGGER: sendNotifications()                              │
│   │                                                          │
│   ├─→ Query Customer Record                                 │
│   │   {name: "Anh Tú", email: "atu@example.com"}           │
│   │                                                          │
│   ├─→ Query Freelancer Record                               │
│   │   {name: "Ms. Linh", email: "linh@example.com"}         │
│   │                                                          │
│   ├─→ Query Service Details                                 │
│   │   {name: "Pet Grooming", duration: 180 minutes}         │
│   │                                                          │
│   ├─→ Query Pet Details                                     │
│   │   {name: "Max", breed: "Labrador"}                      │
│   │                                                          │
│   ├─→ EMAIL SERVICE                                         │
│   │   ├─ Send to customer: booking-confirmed-customer       │
│   │   │  Subject: "✅ Your pet service booking confirmed"   │
│   │   │  Queue: QUEUED → SENT (15-20s)                     │
│   │   │                                                     │
│   │   ├─ Send to freelancer: booking-confirmed-freelancer  │
│   │   │  Subject: "💼 New booking confirmed!"               │
│   │   │  Queue: QUEUED → SENT (20-25s)                     │
│   │   │                                                     │
│   │   └─ Log: Email sent timestamp                          │
│   │                                                          │
│   ├─→ NOTIFICATION SERVICE                                  │
│   │   ├─ Create notification doc for freelancer:            │
│   │   │  {                                                  │
│   │   │    userId: "freelancer-234",                        │
│   │   │    type: "booking_confirmed",                       │
│   │   │    title: "New Booking Confirmed! 💼",             │
│   │   │    body: "Anh Tú's Max needs Pet Grooming",        │
│   │   │    status: "unread",                                │
│   │   │    relatedId: "booking-456"                         │
│   │   │  }                                                  │
│   │   │                                                     │
│   │   ├─ Send Push notification to freelancer:              │
│   │   │  - Notification Server sends to FCM/APN             │
│   │   │  - Freelancer gets push on phone                    │
│   │   │  - Tap → Open app → See booking details             │
│   │   │                                                     │
│   │   └─ Update notification to "sent"                      │
│   │                                                          │
│   └─→ LOG: All notifications sent successfully              │
│       timestamp: 2026-03-17T14:04:05Z                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## REAL-TIME STATUS UPDATES

### Frontend Polling vs Webhooks

**Current Implementation: POLLING**
```javascript
// Every 3 seconds
setInterval(() => {
  GET /api/v1/payments/status/booking-456
  if (response.status === "completed" && admin="approved") {
    // Show success message
  }
}, 3000);
```

**Pros:**
- Simple HTTP requests
- No WebSocket complexity
- Serverless-friendly

**Cons:**
- 3-second delay possible
- Extra server load (100 requests/day per user)
- Not real-time

**Alternative: WebSocket for Real-Time**
```javascript
// File: Petconnet_FE/src/hooks/useWebSocket.ts

socket.on('payment:status-updated', (data) => {
  if (data.adminApprovalStatus === 'approved') {
    // Instant update, no delay
    navigate('/booking/confirmed');
  }
});

// Backend emits when admin approves
socket.to(customerId).emit('payment:status-updated', {
  status: "completed",
  adminApprovalStatus: "approved"
});
```

---

## DATABASE INDEXES (Performance)

```javascript
// Petconnet_BE/models/Payment.js

paymentSchema.index({ bookingId: 1 });              // Find by booking
paymentSchema.index({ userId: 1 });                // Find user's payments
paymentSchema.index({ status: 1 });                // Filter by status
paymentSchema.index({ adminApprovalStatus: 1 });   // Admin dashboard
paymentSchema.index({ createdAt: -1 });            // Sort by date
paymentSchema.index({ 
  status: 1, 
  adminApprovalStatus: 1 
});  // Compound: find pending admin approvals

// Query example for admin:
Payment.find({
  status: "completed",
  adminApprovalStatus: "pending"
}).sort({ createdAt: -1 });
// Uses: { status: 1, adminApprovalStatus: 1 } index
// Time: ~1ms for 10,000 records
```

---

## SUMMARY TABLE

| Event | Time | Who | Action | Database Change | Response |
|-------|------|-----|--------|-----------------|----------|
| 1. Book | 14:00:30 | Customer | POST /bookings/create | CREATE Booking (pending) | bookingId |
| 2. Choose Method | 14:01:00 | Customer | POST /payments/create | CREATE Payment (pending) | qrData, paymentId |
| 3. Transfer Money | 14:01:15 | Customer | Scan QR in MoMo | None | - |
| 4. MoMo Confirms | 14:02:40 | MoMo | Webhook callback | UPDATE Payment (completed) | 200 OK |
| 5. Frontend Detect | 14:02:40 | Frontend | GET /payments/status | None | status=completed |
| 6. Admin Sees | 14:02:45 | Admin | GET /payments/getall | None | List pending |
| 7. Admin Approve | 14:04:00 | Admin | PUT /payments/{id}/admin/approve | UPDATE Payment (approved), UPDATE Booking (confirmed) | Emails + Push |
| 8. Notifications | 14:04:05 | Backend | Email Service | CREATE Notification | Customer & Freelancer notified |
| 9. App Update | 14:04:10 | Frontend | Polling detects | None | Show confirmed ✅ |

---

*Phần chi tiết này bao gồm timing chính xác, database state changes, API sequences, error handling, và notification flows.*
*Suitable cho technical documentation, debugging, API testing, và team training.*
