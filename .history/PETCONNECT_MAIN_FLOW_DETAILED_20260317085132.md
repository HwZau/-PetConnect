# 🚀 PETCONNECT MAIN FLOW - DETAILED SLIDES

## Complete Breakdown of Pet Booking to Payment to Service Execution

---

# SLIDE 4A: BOOKING PHASE - Customer Discovers & Books Service

### Opening (30 seconds)
"Chúng ta bắt đầu từ khoảnh khắc customer mở ứng dụng. Họ cần dịch vụ cho thú cưng của mình. Hôm nay chúng ta trace từng step gì xảy ra."

### Discovery - Tìm Dịch Vụ (1.5 minutes)

"Customer Linh mở app chiều thứ 5. Cô ấy cần dịch vụ grooming cho chó Max trước thứ 7.

Linh thấy home screen:
- Featured section: 'Top Grooming Services This Week'
- Recommended services (based on her pet preferences)
- Categories: Grooming, Walking, Sitting, Training
- Search bar with filters

Click 'Grooming' category → See list:
- Service 1: 'Professional Grooming - 4.9⭐ - 350k - 2km away'
- Service 2: 'Quick Bath & Trim - 4.7⭐ - 200k - 5km away'
- Service 3: 'Luxury Spa Treatment - 4.8⭐ - 500k - 8km away'

Backend query (MongoDB):
```
db.services.find({
  category: 'grooming',
  location: 'District 1',
  isActive: true
})
.sort({ rating: -1 })
.limit(20)
```

Linh click on Service 1 'Professional Grooming' by freelancer Minh.

Freelancer profile show:
- Name: Minh Ng. (4.9⭐ rating)
- Total reviews: 345
- Years experience: 3 years
- Certifications: ✅ Professional Groomer
- Response time: Typically 15 minutes
- Photo gallery: Before/after grooming photos
- Availability: Next available Saturday 8am-12pm"

### Booking Form - Chọn Chi Tiết (1.5 minutes)

"Linh click 'Schedule Booking'.

Form appear:

**Select Pet:**
Dropdown show: Max (Labrador, 5 yrs old)
(Linh already added Max to her account)

**Select Service:**
Original: Professional Grooming (350k)

**Date & Time:**
Calendar widget open.
Linh select: Saturday, March 22
Time slot: Morning (8am-12pm)
Duration: 3 hours (assumed for grooming service)

**Special Instructions:**
Text field: 'Max is shy. Please be gentle. He's afraid of hairdryer.'

**Location:**
Confirm pickup address: '123 Nguyen Hue, District 1, HCMC'
Or: 'Freelancer will come to your home'

**Summary Screen:**
┌──────────────────────────┐
│ Booking Summary          │
├──────────────────────────┤
│ Service: Professional    │
│ Grooming                 │
│ Freelancer: Minh         │
│ Pet: Max (Labrador)      │
│ Date: Sat, Mar 22        │
│ Time: 8:00am - 12:00pm   │
│ Duration: 3 hours        │
│ Service fee: 350,000 VND │
│ Platform fee (20%):      │
│ 70,000 VND              │
│ Total: 420,000 VND       │
└──────────────────────────┘

Click [CONFIRM BOOKING]"

### Backend Booking Creation (1 minute)

"Server receive booking request:
```javascript
POST /api/v1/bookings/create
{
  freelancerId: 'minh-123',
  serviceId: 'grooming-service-456',
  customerId: 'linh-789',
  petIds: ['max-pet-001'],
  scheduledDate: '2026-03-22',
  timeSlot: 'morning-8am',
  specialInstructions: 'Max is shy...',
  serviceAmount: 350000,
  platformFee: 70000,
  totalAmount: 420000
}
```

Database insert:
```
INSERT INTO bookings VALUES (
  id: 'BOOKING_20260317_001',
  freelancerId: 'minh-123',
  customerId: 'linh-789',
  serviceId: 'grooming-service-456',
  petIds: ['max-pet-001'],
  scheduledDate: '2026-03-22T08:00:00Z',
  status: 'pending_payment',
  serviceAmount: 350000,
  platformFee: 70000,
  totalAmount: 420000,
  createdAt: '2026-03-17T15:30:00Z'
)
```

Event published:
```
Topic: bookings.created
{
  bookingId: 'BOOKING_20260317_001',
  freelancerId: 'minh-123',
  customerId: 'linh-789',
  amount: 420000,
  timestamp: '2026-03-17T15:30:00Z'
}
```

On Linh's screen:
✅ 'Booking created successfully'
'Your booking is ready for payment. Complete payment to confirm.'
[PROCEED TO PAYMENT]

Simultaneously, Freelancer Minh get notification:
'⏰ New booking request! Professional Grooming on Saturday 8am. Max (Labrador). Customer: Linh. Booking pending payment.'

Minh see 2 hours window to respond before booking auto-cancel if payment not received."

---

# SLIDE 4B: PAYMENT PROCESSING - QR Code & Money Transfer

### Opening (20 seconds)
"Tiếp theo là phần payment - đây là critical part. Customer phải transfer tiền, system phải verify tiền real."

### QR Code Generation & Display (1.5 minutes)

"Linh click [PROCEED TO PAYMENT].

Screen show:
```
┌─────────────────────────────────────┐
│ COMPLETE YOUR PAYMENT               │
├─────────────────────────────────────┤
│ Service: Professional Grooming       │
│ Amount: 350,000 VND                 │
│                                     │
│ [QR CODE IMAGE HERE]                │
│                                     │
│ MoMo Transfer Details:              │
│ Account: 0834339521                 │
│ Name: Nguyễn Hữu Giàu               │
│ Amount: 420,000 VND                 │
│                                     │
│ ⏱️  Timer: 120 seconds remaining   │
│ 119, 118, 117...                    │
│                                     │
│ Transfer after scanning QR?         │
│ [HELP] [CANCEL]                     │
└─────────────────────────────────────┘
```

Backend process:
1. Generate payment request through VNPAY/RayOS:
```javascript
const paymentRequest = {
  orderId: 'BOOKING_20260317_001',
  amount: 420000,
  description: 'Pet Grooming Service - Max',
  paymentMethod: 'momo',
  callbackUrl: 'https://petconnect.vn/api/payment/callback',
  timeoutSeconds: 120
};

const response = await paymentGateway.createPayment(paymentRequest);
// Returns: { qrCode: 'data:image/png;base64,...', expiresIn: 120 }
```

2. QR code rendered on frontend
3. Countdown timer start (120 seconds = urgency factor)
4. WebSocket connection open (watch for payment confirmation)"

### Customer Scans QR & Transfers (1.5 minutes)

"Linh grab phone with MoMo app already open.

Action sequence:

1️⃣ Open MoMo app
2️⃣ Tap [Scan QR] button
3️⃣ Point camera at screen showing QR
4️⃣ MoMo recognize QR code (2 seconds)
5️⃣ Transfer form populate:

┌────────────────────────────┐
│ MoMo TRANSFER FORM          │
├────────────────────────────┤
│ Recipient: Nguyễn Hữu Giàu │
│ Account: 0834339521        │
│ Amount: 420,000            │
│ Description: Pet Connect - │
│ ORDER_20260317_001         │
│ Fee: 1,000 VND             │
│ Total: 421,000 VND         │
│                            │
│ [CONFIRM] [CANCEL]         │
└────────────────────────────┘

6️⃣ Linh tap [CONFIRM]
7️⃣ MoMo prompt: 'Enter your PIN'
8️⃣ Linh enter 6-digit PIN
9️⃣ MoMo process transfer (3 seconds)
🔟 Success screen:

┌────────────────────────────┐
│ ✅ TRANSFER SUCCESSFUL      │
│                            │
│ Recipient: Nguyễn Hữu Giàu │
│ Amount: 420,000 VND        │
│ Reference: MOD171503ABC123 │
│ Time: 15:32:45             │
│                            │
│ [CLOSE]                    │
└────────────────────────────┘
```

During this time, MoMo backend processed:
- Debit Linh's MoMo account: 421,000 VND
- Credit PetConnect business account: 421,000 VND
- Generate transaction reference: MOD171503ABC123"

### Payment Detection - Webhook vs Polling (1.5 minutes)

"Back on PetConnect app, Linh's screen still show QR + timer (counting down...).

Behind the scenes, two mechanisms work:

**Option 1: Webhook (Ideal)**
MoMo server call PetConnect API:
```
POST /api/v1/payments/webhook
{
  orderId: 'BOOKING_20260317_001',
  status: 'PAID',
  amount: 420000,
  referenceNo: 'MOD171503ABC123',
  paidAt: '2026-03-17T15:32:45Z',
  signature: 'hmac_sha256(...)'  // verify authenticity
}
```

Backend verify:
1. Signature valid? (HMAC with secret key) ✅
2. Amount match? (420k = 420k) ✅
3. Order exist? (BOOKING_20260317_001 in DB) ✅

If all pass:
```
UPDATE bookings
SET status = 'payment_received',
    paymentReference = 'MOD171503ABC123',
    paymentReceivedAt = NOW()
WHERE id = 'BOOKING_20260317_001'
```

Publish event:
```
Topic: payments.received
{
  bookingId: 'BOOKING_20260317_001',
  amount: 420000,
  reference: 'MOD171503ABC123',
  timestamp: NOW()
}
```

**Option 2: Polling (Fallback)**
If webhook fail, frontend poll every 3 seconds:
```javascript
// Client-side polling
const checkPaymentStatus = async () => {
  const response = await fetch(
    '/api/v1/bookings/BOOKING_20260317_001/payment-status'
  );
  const { status } = await response.json();
  
  if (status === 'payment_received') {
    // Show success
  }
};

setInterval(checkPaymentStatus, 3000);
```

Webhook typically take 2-5 seconds. Polling detect within 3-6 seconds if webhook fail."

### Real-Time UI Update (1 minute)

"Payment detected (via webhook or polling).

On Linh's screen - instant update:
- QR code fade out
- Timer stop
- Large green checkmark ✅ appear
- Message: 'Payment received! Your booking is confirmed.'

Receipt generated:
```
Booking Receipt
───────────────
Booking ID: BOOKING_20260317_001
Service: Professional Grooming
Amount: 350,000 VND
Platform Fee: 70,000 VND
Total Paid: 420,000 VND
Reference: MOD171503ABC123
Date: March 17, 2026, 15:32 UTC+7

Freelancer: Minh (4.9⭐)
Pet: Max (Labrador)
Date: Saturday, March 22, 2026, 8:00am
Location: 123 Nguyen Hue, District 1

[DOWNLOAD RECEIPT] [SHARE] [BACK]
```

On Freelancer Minh's screen - notification received:
'💚 Payment confirmed! Booking BOOKING_20260317_001 ready for your service. Wednesday 8am, Max (Labrador). [ACCEPT] [DECLINE]'

Minh have 30 minutes to accept/decline (SLA)."

---

# SLIDE 4C: ADMIN APPROVAL - Verification Step

### Opening (20 seconds)
"Tiền đã nhận, nhưng chúng ta cần thêm một layer verification. Admin sẽ check payment legitimate trước khi confirm booking."

### Payment Appears in Admin Dashboard (1.5 minutes)

"Admin Trang open /admin/payment-approval dashboard.

Dashboard show:

```
┌─────────────────────────────────────────┐
│ ADMIN: PAYMENT APPROVAL DASHBOARD       │
├─────────────────────────────────────────┤
│ 📊 Pending Approvals: 5 payments        │
│ 💰 Total amount pending: 2,100,000 VND  │
│                                         │
│ Filter: [All] [Today] [This Week]       │
│ Status: [All] [Pending] [Approved]      │
│                                         │
│ PENDING PAYMENTS:                       │
│ ┌─────────────────────────────────────┐ │
│ │ #1 Professional Grooming            │ │
│ │ Amount: 420,000 VND                 │ │
│ │ Customer: Linh | Pet: Max           │ │
│ │ Freelancer: Minh (4.9⭐)            │ │
│ │ Payment Ref: MOD171503ABC123        │ │
│ │ Received: 2 minutes ago             │ │
│ │ Status: 🟡 PENDING REVIEW           │ │
│ │ [VIEW DETAILS] [APPROVE] [REJECT]   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [More payments...]                      │
└─────────────────────────────────────────┘
```

Admin notice: Payment #1 from Linh for grooming.

Backend stored payment data:
```
SELECT * FROM payments
WHERE id = 'PAYMENT_20260317_001'
AND status = 'received';

Result:
id: PAYMENT_20260317_001
bookingId: BOOKING_20260317_001
donorId: linh-789
freelancerId: minh-123
amount: 420000
paymentReference: MOD171503ABC123
paymentMethod: momo
status: 'received'
receivedAt: 2026-03-17T15:32:45Z
approvedAt: NULL
approvedBy: NULL
```

Admin click [VIEW DETAILS] to see full information."

### Admin Verification Checklist (1.5 minutes)

"Detail view open:

```
┌────────────────────────────────────────┐
│ PAYMENT DETAILS & VERIFICATION          │
├────────────────────────────────────────┤
│                                        │
│ TRANSACTION INFO:                      │
│ ─────────────────────────────────────  │
│ Payment ID: PAYMENT_20260317_001       │
│ Reference: MOD171503ABC123             │
│ Amount: 420,000 VND                    │
│ Method: MoMo Transfer                  │
│ Time: 2026-03-17 15:32:45              │
│ Status: RECEIVED                       │
│                                        │
│ BOOKING DETAILS:                       │
│ ─────────────────────────────────────  │
│ Service: Professional Grooming         │
│ Pet: Max (Labrador)                    │
│ Date: 2026-03-22 08:00                 │
│ Location: 123 Nguyen Hue, Dist 1       │
│ Special notes: Max is shy, gentle      │
│                                        │
│ CUSTOMER INFO:                         │
│ ─────────────────────────────────────  │
│ Name: Linh Ng.                         │
│ Account: Active (verified) ✅          │
│ Phone: [verified]                      │
│ Previous bookings: 5 (all successful)  │
│ Rating history: 4.8/5 average          │
│ Payment history: 100% on-time          │
│                                        │
│ FREELANCER INFO:                       │
│ ─────────────────────────────────────  │
│ Name: Minh                             │
│ Account: Active (verified) ✅          │
│ Certificates: ✅ Professional Groomer  │
│ Background check: ✅ Passed            │
│ Rating: 4.9/5 (345 reviews)            │
│ Satisfaction: 98%                      │
│ Fraud incidents: None                  │
│                                        │
│ PAYMENT VERIFICATION:                  │
│ ─────────────────────────────────────  │
│ ☑️ MoMo reference valid?              │
│ ☑️ Customer account legitimate?       │
│ ☑️ Freelancer account legitimate?     │
│ ☑️ Booking amount reasonable?         │
│ ☑️ No fraud patterns detected?        │
│ ☑️ No duplicate transaction?          │
│ ☑️ Customer/Freelancer never disputed?│
│                                        │
│ RECOMMENDATION: ✅ SAFE TO APPROVE     │
│                                        │
│ [APPROVE] [REQUEST MORE INFO] [REJECT] │
└────────────────────────────────────────┘
```

Admin review checklist:
1. ✅ Is customer real? (verified account, history)
2. ✅ Is freelancer real? (verified, certificates)
3. ✅ Is amount reasonable? (350k for 3-hour grooming - yes)
4. ✅ Does MoMo reference exist? (MOD171503ABC123 - can verify on MoMo)
5. ✅ Any fraud/dispute patterns? (No)
6. ✅ Same people doing duplicate bookings? (No)

All pass. Admin confident payment is legitimate."

### Admin Approves Payment (1 minute)

"Admin click [APPROVE] button.

Confirmation dialog:
'Approve payment MOD171503ABC123 for 420k? This will confirm Minh's booking with Linh for March 22.'

Admin click [YES, APPROVE]

Backend execute:
```javascript
POST /api/v1/payments/PAYMENT_20260317_001/approve
{
  approvedBy: 'trang-admin-123',
  approvalNote: 'Verified customer & freelancer, amount reasonable'
}

UPDATE payments
SET status = 'approved',
    approvedBy = 'trang-admin-123',
    approvalDate = NOW()
WHERE id = 'PAYMENT_20260317_001'

UPDATE bookings
SET status = 'confirmed',
    confirmedAt = NOW()
WHERE id = 'BOOKING_20260317_001'
```

Events published:
```
Topic: payments.approved
{ paymentId: 'PAYMENT_20260317_001', approvalTime: NOW() }

Topic: bookings.confirmed
{ bookingId: 'BOOKING_20260317_001', confirmedAt: NOW() }
```

Dashboard update:
Payment #1 status: 🟡 PENDING → ✅ APPROVED
Timestamp: Now showing admin name and approval time

Toast notification (top right):
'✅ Payment approved successfully'

Simultaneously, notifications cascade..."

---

# SLIDE 4D: SERVICE EXECUTION - Day of Work

### Opening (20 seconds)
"Việc tốt nhất phải xảy ra: Minh đến đúng giờ, service Max tốt, Linh hài lòng."

### Day Before - Freelancer Confirmation (1 minute)

"Friday evening (day before booking):

Minh check app - reminder notification:
'⏰ Reminder: You have a service tomorrow!
- Customer: Linh
- Pet: Max (Labrador)
- Time: Saturday 8:00am
- Location: 123 Nguyen Hue, District 1
- Duration: 3 hours
- Earning: 280,000 VND (after platform fee)
- Special: Max is shy, be gentle

[NAVIGATE TO LOCATION] [CONTACT CUSTOMER] [CONFIRM ATTENDANCE]'

Minh click [CONFIRM ATTENDANCE] to lock in.

Backend update booking status from 'confirmed' → 'freelancer_confirmed'"

### Day Of - Freelancer Arrives (1.5 minutes)

"Saturday 7:50am:

Minh start driving to Linh's address (123 Nguyen Hue).

On Minh's app - live GPS map showing:
- Route to destination
- ETA: 8 minutes
- Traffic: Light
- Distance: 3.2 km

On Linh's app - real-time tracking enabled:
'Minh is on the way! 📍 3km away. ETA: 8 minutes'

Status update in real-time to Linh's home screen.

8:00am - Minh arrive.

Minh knock door. Linh open. Quick greeting:
'Hi Linh! Ready for Max's grooming?'

Linh show Max. Minh assess:
- Breed: Labrador ✓
- Size: Medium ✓
- Temperament: Shy (as noted) ✓
- Current condition: Needs grooming ✓

Minh take baseline photo (before photo) for documentation.

Minh start service:
- Setup grooming station (in Linh's home or with portable equipment)
- Pet wash & dry (30 min)
- Hair trim & style (60 min)
- Final touch & clean up (30 min)

During service, Minh take progress photos:
- Photo 1: Washing stage
- Photo 2: Drying stage
- Photo 3: Trimming stage

Upload to app in real-time. Linh get push notification:
'Minh is giving Max a bath!' + photo
'Minh is trimming Max's hair!' + photo"

### Service Completion & Rating (1.5 minutes)

"11:00am - Service complete.

Max look transformed! Well-groomed, happy.

Minh take final after photo (professional quality).

Minh mark in app:
'Service completed - all tasks finished'

Select rating (self-rating):
'Difficulty level: Easy | Cooperation: Excellent'

Upload final photos (3 professional after photos).

Linh receive notification:
'✅ Service complete! Minh finished Max's grooming. [VIEW PHOTOS]'

Linh open app - see photo gallery:
- Before photos (shaggy Max)
- Progress photos (grooming in progress)
- After photos (pristine Max)
- Timeline: '8:00 Arrived → 9:30 Wash complete → 10:30 Trim complete → 11:00 Finished'

Linh very happy with result. Tap [RATE THIS SERVICE].

Rating form open:
```
┌──────────────────────────────┐
│ HOW WAS YOUR SERVICE?        │
├──────────────────────────────┤
│                              │
│ Star rating:                 │
│ ⭐⭐⭐⭐⭐ (5 stars)            │
│                              │
│ Comment:                     │
│ 'Minh was very gentle with   │
│  Max! He's shy but Minh took │
│  time to calm him. Max never │
│  seemed scared. Great work!' │
│                              │
│ Would you book again?        │
│ [YES - 92% likely] [NO]      │
│                              │
│ [SUBMIT RATING]              │
└──────────────────────────────┘
```

Linh submit 5-star review.

Backend update:
```
INSERT INTO reviews VALUES (
  id: UUID(),
  bookingId: 'BOOKING_20260317_001',
  customerId: 'linh-789',
  freelancerId: 'minh-123',
  rating: 5,
  comment: 'Minh was very gentle...',
  createdAt: NOW()
)

UPDATE freelancers
SET totalRating = totalRating + 5,
    reviewCount = reviewCount + 1,
    avgRating = totalRating / reviewCount
WHERE id = 'minh-123'
-- Result: Minh's rating 4.9 → 4.91
```

Minh get notification:
'💚 Linh gave you 5⭐ stars! \"Minh was very gentle with Max...\" Nice work!'

On Minh's app - earnings show:
'Booking complete! Earned: 280,000 VND (after 20% platform fee)
Pending withdrawal (available Monday)'

Booking status final: 'completed'"

---

# SLIDE 4E: SETTLEMENT - Money Withdrawal

### Opening (20 seconds)
"Cuối cùng, Minh muốn rút tiền kiếm được. Chúng ta trace quy trình withdrawal."

### Freelancer Views Earnings (1.5 minutes)

"Monday evening (3 days later):

Minh open app, check [Earnings] tab.

Screen show:
```
┌─────────────────────────────────────┐
│ MY EARNINGS                         │
├─────────────────────────────────────┤
│ This Month: 4,200,000 VND           │
│ Available to Withdraw: 2,100,000    │
│ Pending (in escrow): 2,100,000      │
│                                     │
│ RECENT BOOKINGS:                    │
│ ├─ Professional Grooming (Sat)      │
│ │  Amount: 350,000                  │
│ │  + Platform fee: N/A              │
│ │  = Your earnings: 280,000 ✅      │
│ │  Status: Ready to withdraw        │
│ │                                   │
│ ├─ Dog Walking (Sunday)             │
│ │  Amount: 200,000                  │
│ │  = Your earnings: 160,000 ✅      │
│ │  Status: Ready to withdraw        │
│ │                                   │
│ └─ Pet Sitting (Mon - ongoing)      │
│   Amount: 500,000                   │
│   = Your earnings: 400,000 ⏳      │
│   Status: In progress, completed   │
│            withdrawable Wed         │
│                                     │
│ [WITHDRAW MONEY]                    │
└─────────────────────────────────────┘
```

Currently available: 280,000 + 160,000 = 440,000 VND

Minh click [WITHDRAW MONEY].

Withdrawal form:
```
┌────────────────────────────────────┐
│ WITHDRAW EARNINGS                  │
├────────────────────────────────────┤
│                                    │
│ Available balance: 440,000 VND     │
│                                    │
│ Amount to withdraw:                │
│ [____________] VND                 │
│ (Default: All = 440,000)           │
│                                    │
│ Bank account:                      │
│ [Select account ▼]                 │
│ └─ Vietcombank                     │
│    Account: 123456...789           │
│    Name: Minh Ng.                  │
│    [EDIT] [ADD NEW]                │
│                                    │
│ Withdrawal fee: 2,000 VND (0.5%)   │
│ You will receive: 438,000 VND      │
│ Processing time: 1 business day    │
│                                    │
│ [CONFIRM WITHDRAWAL]               │
└────────────────────────────────────┘
```

Minh enter amount 440,000 (all).
Select bank: Vietcombank (existing account).
Click [CONFIRM WITHDRAWAL]."

### Platform & Admin Review (1 minute)

"Backend process withdrawal request:
```javascript
POST /api/v1/freelancers/minh-123/withdrawal
{
  amount: 440000,
  bankAccount: 'vietcombank-123456789',
  requestedAt: NOW()
}

INSERT INTO withdrawal_requests VALUES (
  id: 'WR_20260317_001',
  freelancerId: 'minh-123',
  amount: 440000,
  fee: 2000,
  netAmount: 438000,
  bankAccount: 'vietcombank-123456789',
  status: 'pending_admin_review',
  requestedAt: NOW()
)

UPDATE freelancer_balances
SET available = available - 440000,  -- Hold money
    pending = pending + 440000
WHERE freelancerId = 'minh-123'
```

Event published:
```
Topic: withdrawals.requested
{ withdrawalId: 'WR_20260317_001', amount: 440000 }
```

Admin dashboard alert:
'New withdrawal request: 440k from Minh (Freelancer ID: minh-123). [REVIEW]'

Admin Trang review:
- Is freelancer legitimate? ✅ Verified, 4.91⭐ rating
- Is amount reasonable? ✅ 440k from 2 completed services
- Is bank account valid? ✅ Name match 'Minh Ng.'
- Any fraud patterns? ✅ None (regular withdrawals)
- Last withdrawal? (2 weeks ago, 1M, successful)

Admin click [APPROVE WITHDRAWAL].

Backend execute payment:
```javascript
// Call bank API to transfer
const bankTransfer = await bankAPI.transfer({
  recipientBank: 'vietcombank',
  accountNumber: '123456789',
  accountName: 'Minh Ng.',
  amount: 438000,
  reference: 'WITHDRAWN_VIA_PETCONNECT'
});

UPDATE withdrawal_requests
SET status = 'completed',
    completedAt = NOW(),
    bankReferenceNo = bankTransfer.refNo
WHERE id = 'WR_20260317_001'

UPDATE freelancer_balances
SET pending = pending - 440000,
    withdrawn = withdrawn + 440000
WHERE freelancerId = 'minh-123'
```"

### Freelancer Receives Money (1 minute)

"Tuesday morning (1 business day later):

Minh check bank account - 438,000 VND appear! ✅

Minh get notification on PetConnect:
'✅ Withdrawal approved! 438,000 VND transferred to your Vietcombank account.
Reference: WITHDRAWN_VIA_PETCONNECT
Expected arrival: Today
Bank reference: VCB_TRF_20260318_001'

Transaction receipt:
```
WITHDRAWAL RECEIPT
──────────────────
Withdrawal ID: WR_20260317_001
Platform: PetConnect
Amount requested: 440,000 VND
Platform fee: 2,000 VND (0.5%)
Net received: 438,000 VND

Source:
- Professional Grooming: 280,000 VND
- Dog Walking: 160,000 VND

Destination:
- Bank: Vietcombank
- Account: 123456...789
- Name: Minh Ng.

Processing time: 1 business day
Status: ✅ Completed

Transaction Date: March 18, 2026
Processed by: PetConnect Payments Team
```

Minh very happy! Earned 440k in 2 days. Platform fee minimal (0.5% for withdrawal).

On Minh's profile, earnings stats update:
'Total earnings (lifetime): 4,200,000 VND
Withdrawn (lifetime): 3,760,000 VND
Available: 440,000 VND'

Minh ready to take more bookings. Network effect: satisfied customer + happy freelancer = word of mouth → more customers → more freelancers."

---

# SLIDE 4F: FULL FLOW DIAGRAM & TIMING

### Timeline Visualization (2 minutes)

"Toàn bộ flow từ booking đến settlement:

```
Monday (Day 1)
├─ 15:30 - Linh book & pay (420k)
├─ 15:32 - Payment received from MoMo
├─ 15:33 - Admin approve payment
├─ 15:34 - Minh get notification (booking confirmed)
└─ 15:35 - System ready

Friday (Day 5)
├─ 19:00 - Minh get reminder notification
└─ 19:01 - Minh confirm attendance

Saturday (Day 6)
├─ 08:00 - Minh arrive
├─ 11:00 - Service complete
├─ 11:05 - Linh rate 5⭐
└─ 11:06 - Minh notified of rating

Monday (Day 8)
├─ 18:00 - Minh request withdrawal (440k)
└─ 18:01 - Admin approve

Tuesday (Day 9)
├─ 09:00 - Money appear in Minh's bank
├─ 09:01 - Minh get confirmation notification
└─ 09:02 - Ready for next booking!

Total journey: 9 days from booking to settlement
```

**Money Flow Diagram:**
```
Linh's account
     ↓ -420k
  MoMo
     ↓ +420k
PetConnect account
     ├─ Linh's deposit: 350k (waiting for service)
     ├─ Platform fee: 70k (collected immediately)
     │
     └─ After service verified:
        ├─ Minh earning (80%): 280k (held in platform)
        └─ Platform keep: 70k (20%)

After service complete & rated:
PetConnect account
     ├─ Hold funds ready to transfer
     └─ Minh request withdrawal: 280k
        
After admin approval:
PetConnect account
     ├─ Release to Minh's bank: 438k (280+160 from other booking)
     └─ Fee (0.5%): 2k (platform keeps)

Minh's bank account
     ↑ +438k
  
Net flow:
- Linh paid: 420k (service + platform fee)
- Minh earned: 280k (80% of service)
- Platform revenue this booking: 70k + 2k fee = 72k
- Platform take: 17% (72 / 420)
```"

### Success Metrics (1 minute)

"Tracking success of this flow:

**Quantitative Metrics:**
✅ Payment success rate: 98.5% (2 failed out of 200)
✅ Admin approval time: Average 2 minutes
✅ Service execution success: 99.2% (1 cancelled out of 150)
✅ Customer satisfaction: 4.8/5 average rating
✅ Freelancer satisfaction: 4.7/5 average rating
✅ Withdrawal processing time: < 24 hours
✅ Money in freezing incidents: 0

**Qualitative Metrics:**
✅ Trust established: Customer willing to book again
✅ Repeat rate: 65% of customers book again
✅ Freelancer retention: 85% continue after first booking
✅ Dispute rate: 2.1% (very low)
✅ Fraud incidents: 0 detected

**Key Learning:**
The flow work because:
1. Clear step-by-step process familiar to users
2. Real-time feedback at each stage
3. Admin oversight prevent fraud
4. Photo documentation create accountability
5. Ratings & reviews build network effects
6. Payment security (QR + admin check) build trust"

---

# SLIDE 4G: EDGE CASES & ERROR HANDLING

### Opening (20 seconds)
"Không phải lúc nào mọi thứ diễn ra smooth. Chúng ta talk về edge cases - điều gì xảy ra khi có vấn đề."

### Scenario 1: Payment Not Received (Timeout) (1.5 minutes)

"⏰ Tiền đếm xuống: 60, 59, 58...

Nếu countdown đến 0 mà payment chưa receive:
- QR code expire
- Payment status stay 'pending'
- Booking automatically cancel

Linh get notification:
'❌ Payment not received within 2 minutes. Booking cancelled.
Your payment deadline: [time]
Want to try again?
[PAY NOW] [CANCEL BOOKING]'

Backend:
```
UPDATE bookings
SET status = 'cancelled',
    cancelReason = 'payment_timeout'
WHERE id = 'BOOKING_20260317_001'
AND status = 'pending_payment'
AND createdAt < (NOW() - INTERVAL 120 SECONDS)
```

If Linh click [PAY NOW]:
- New QR code generated (new 120 second countdown)
- Booking can proceed

If Linh click [CANCEL BOOKING]:
- Booking deleted
- Minh notification cancelled
- Clearing complete"

### Scenario 2: Payment Received But Booking Not Confirmed (1.5 minutes)

"What if payment come through but Minh don't confirm attendance?

Saturday 7:45am - Minh NOT online.
No confirmation from Minh about showing up.

Linh try to contact Minh (in-app message) - no response.

8:00am approaching - Linh worried.

Admin monitor:
- Booking time 8:00am
- Current time: 7:55am
- Freelancer confirmation: Missing

Alert system trigger:
- Auto notification to Minh: 'URGENT: You have booking in 5 minutes at 123 Nguyen Hue!'
- If Minh not respond in 3 minutes, system can:
  Option A: Assign backup freelancer (if available)
  Option B: Allow customer to cancel & get refund

If Minh not show at all:
- Booking status: 'no_show'
- Refund issued to Linh immediately (420k back to MoMo)
- Minh penalized (3 no-shows = account suspended)
- Rating impact: -1 no-show = 0.3⭐ deduction"

### Scenario 3: Service Quality Issue (Dispute) (1.5 minutes)

"11:30am - After service, Linh unhappy.

She notice: Minh cut Max's hair too short. Max look different.

Linh click [REPORT ISSUE] instead of [RATE].

Payment still in escrow (not yet released to Minh).

Dispute form:
```
┌────────────────────────────────────┐
│ REPORT ISSUE                       │
├────────────────────────────────────┤
│ What happened?                     │
│ [Hair too short, not what I want]  │
│                                    │
│ Severity: [High ▼]                │
│                                    │
│ Photos of issue:                   │
│ [Upload photos showing hair]       │
│                                    │
│ Resolution wanted:                 │
│ [Partial refund / Full refund /    │
│  Free redo / Other]                │
│                                    │
│ [SUBMIT DISPUTE]                   │
└────────────────────────────────────┘
```

Dispute created. Admin notified immediately.

Backend:
```
INSERT INTO disputes VALUES (
  id: 'DISPUTE_20260321_001',
  bookingId: 'BOOKING_20260317_001',
  initiatedBy: 'linh-789',
  reason: 'service_quality_issue',
  severity: 'high',
  status: 'open',
  createdAt: NOW()
)

UPDATE payments
SET status = 'disputed',  -- Hold payment
    refund_initiated = false
WHERE bookingId = 'BOOKING_20260317_001'
```

Minh get notification:
'⚠️ Dispute raised on your service (Professional Grooming).
Reason: Hair cut too short.
Customer requested: Partial refund
[VIEW DISPUTE] [RESPOND]'

Minh can respond with:
- 'Hair follow standard grooming practice, Max not damaged'
- Or offer partial refund to settle

Admin review evidence:
- Before photo: Fluffy Max
- After photo: Short-haired Max
- Freelancer skill level: Professional
- Customer expectation: Maybe unclear

Admin decision:
'Minh followed standard grooming. Hair will grow back in 4-6 months. 
However, customer expectation not met. 
Decision: 50% refund (210k) to customer, 50% (210k) to Minh'

Settlement:
- Linh refund: 210k
- Minh gets: 210k (instead of 280k)
- Platform lose: 70k (fee not earned)"

### Scenario 4: Freelancer Cancel Last Minute (1 minute)

"Saturday 7:45am - Minh message Linh:
'I'm sorry, I have emergency. Cannot come today. Very sorry.'

Linh angry - no warning, no backup service.

Cancel booking immediately. Refund issued (full 420k back to MoMo).

Minh get notification:
'Your booking was cancelled by customer due to your last-minute cancellation. Impact: -1 cancellation (penalty).
Your rating: 4.9 → 4.85 (0.05 deduction)'

System track this:
- 3rd cancellation in month = Automatic account suspension 1 week
- 5th cancellation = Permanent ban from platform

Minh lose this earning opportunity. Customer upset, but at least get refunded quickly (within 24 hours)."

---

# SUMMARY: MAIN FLOW METRICS

```
A complete booking → service → payment cycle:

SPEED:
- Booking creation: 30 seconds
- Payment processing: 2-5 seconds (webhook)
- Admin approval: 1-2 minutes
- Service day: 3 hours (typical grooming)
- Settlement: < 24 hours

SECURITY:
- Fraud detection: Multi-layer (customer verify, freelancer verify, payment reference check)
- Dispute resolution: Admin mediation + escrow hold
- Refund process: Automated within 24-48 hours

CUSTOMER SATISFACTION:
- Success rate: 98.5%
- Average rating given: 4.8/5
- Repeat booking rate: 65%
- NPS score: +67 (very positive)

FREELANCER SATISFACTION:
- Earning transparency: 100% (all fees disclosed)
- Payment reliability: 99.9% (never missed payment)
- Support available: 24/7 (in-app support)
- Average earning per booking: 280k - 400k VND
- Repeat booking rate: 85%

PLATFORM ECONOMICS:
- Revenue per transaction: 70k platform fee (20%)
- + Withdrawal fee: 2k (0.5%)
- Total per booking: 72k revenue
- Operating cost per transaction: ~8k
- Profit margin per transaction: 88% (64k / 72k)
```

---

*This detailed breakdown of Main Flow across 7 Slides (4A-4G) provides deep understanding of every step, edge cases, error handling, and business metrics. Perfect for technical & business presentations.*
