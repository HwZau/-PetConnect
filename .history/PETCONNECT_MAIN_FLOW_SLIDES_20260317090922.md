# 🎬 PETCONNECT MAIN FLOW - DETAILED SLIDES
## Payment & Transaction Flow Broken Down

---

# SLIDE 4.1: STEP 1 - CUSTOMER BOOKS SERVICE & CREATES PAYMENT

## Frontend: Customer Booking Process

### UI Flow
```
Customer Browse Services 
    ↓
Click Service 
    ↓
View Freelancer Profile
    ↓
Click "Book Now"
    ↓
Fill Booking Form (Pet, Date, Time)
    ↓
Review Total Price
    ↓
Click "Proceed to Payment"
    ↓
[Navigate to Payment Page]
```

### Frontend Code - Booking Form
```typescript
// File: Petconnet_FE/src/pages/booking/BookingPage.tsx

const handleProceedToPayment = async () => {
  try {
    setIsProcessing(true);
    
    // Validate booking data
    if (!selectedService || !selectedPet || !bookingDate || !timeSlot) {
      showError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Create booking record
    const bookingPayload = {
      freelancerId: selectedService.freelancerId,
      serviceId: selectedService.id,
      petIds: [selectedPet.id],
      scheduledDate: bookingDate,
      timeSlot: timeSlot,
      specialInstructions: instructions,
      totalAmount: calculateTotal(),
    };

    const response = await apiClient.post(
      '/api/v1/bookings/create',
      bookingPayload
    );

    if (response.success) {
      // Save booking ID for payment
      sessionStorage.setItem('bookingId', response.data.bookingId);
      
      // Navigate to payment
      navigate('/payment', {
        state: {
          bookingId: response.data.bookingId,
          amount: calculateTotal(),
          freelancerName: selectedService.freelancerName,
          serviceName: selectedService.name
        }
      });
    }
  } catch (error) {
    showError(error.message);
  } finally {
    setIsProcessing(false);
  }
};
```

### Backend: Booking Creation
```javascript
// File: Petconnet_BE/routes/bookings.js

router.post('/create', auth, async (req, res) => {
  try {
    const {
      freelancerId,
      serviceId,
      petIds,
      scheduledDate,
      timeSlot,
      specialInstructions,
      totalAmount
    } = req.body;

    // Validate freelancer exists
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.role !== 'Freelancer') {
      return res.status(404).json({ 
        message: 'Freelancer not found' 
      });
    }

    // Create booking
    const booking = new Booking({
      customerId: req.user._id,
      freelancerId,
      serviceId,
      petIds,
      scheduledDate: new Date(scheduledDate),
      timeSlot,
      specialInstructions,
      totalAmount,
      status: 'pending',  // Waiting for payment
      paymentStatus: 'unpaid'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      bookingId: booking._id,
      totalAmount: booking.totalAmount,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});
```

### Database: Booking Model
```javascript
// File: Petconnet_BE/models/Booking.js

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  petIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  specialInstructions: String,
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Booking', bookingSchema);
```

---

# SLIDE 4.2: STEP 2 - PAYMENT METHOD SELECTION & QR GENERATION

## Choosing Payment Method

### Frontend: Payment Page
```typescript
// File: Petconnet_FE/src/pages/payment/PaymentPage.tsx

const [paymentMethod, setPaymentMethod] = useState<number>(2); // Default: MoMo

const handlePaymentMethodSelect = (method: number) => {
  setPaymentMethod(method);
  // 2 = MoMo, 3 = TPBank (VNPay)
};

const handleCreatePayment = async () => {
  try {
    setIsProcessing(true);

    const bookingId = sessionStorage.getItem('bookingId');
    
    // Prepare payment creation request
    const paymentRequest = {
      bookingId,
      method: paymentMethod, // 2 or 3
      returnUrl: `${window.location.origin}/payment/success`,
      description: `Pet Service Booking - ${bookingInfo.serviceName}`
    };

    // Call backend to create payment
    const response = await paymentService.createPayment(paymentRequest);

    if (response.success) {
      setPaymentData(response);
      setQrCodeImage(response.qrData); // Display QR code
      setCountdownTimer(120); // 2-minute timer
    }
  } catch (error) {
    showError('Failed to create payment');
  } finally {
    setIsProcessing(false);
  }
};
```

### Payment Method UI
```typescript
// Display payment options to customer

const paymentMethods = [
  {
    id: 2,
    name: 'MoMo',
    icon: '📱',
    account: '0834339521',
    holderName: 'Nguyễn Hữu Giàu',
    description: 'Instant transfer via MoMo app'
  },
  {
    id: 3,
    name: 'TPBank',
    icon: '🏦',
    account: '02600647401',
    holderName: 'richdesu',
    description: 'Traditional bank transfer'
  }
];

return (
  <div className="payment-methods">
    {paymentMethods.map(method => (
      <div
        key={method.id}
        onClick={() => handlePaymentMethodSelect(method.id)}
        className={`method-card ${paymentMethod === method.id ? 'selected' : ''}`}
      >
        <span>{method.icon} {method.name}</span>
        <p>{method.description}</p>
      </div>
    ))}
  </div>
);
```

### Backend: QR Code Generation
```javascript
// File: Petconnet_BE/routes/payments.js

const qrCodes = require('../config/qrCodes');

router.post('/create', auth, async (req, res) => {
  try {
    const { bookingId, method, returnUrl, description } = req.body;

    // Get booking info
    const booking = await Booking.findById(bookingId)
      .populate('customerId', 'email name')
      .populate('freelancerId', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Map payment methods
    const paymentMethods = {
      2: {
        name: 'MoMo',
        bankCode: 'MOMO',
        account: '0834339521',
        recipientName: 'Nguyễn Hữu Giàu'
      },
      3: {
        name: 'TPBank',
        bankCode: 'TPBVN',
        bankName: 'TPBANK',
        account: '02600647401',
        recipientName: 'richdesu'
      }
    };

    const methodDetails = paymentMethods[method];
    if (!methodDetails) {
      return res.status(400).json({ 
        message: 'Unsupported payment method' 
      });
    }

    // Get QR code image path
    let qrData = '';
    if (method === 2) {
      qrData = qrCodes.MOMO_QR;  // '/images/qr-codes/qr-momo.png'
    } else if (method === 3) {
      qrData = qrCodes.TPBANK_QR;  // '/images/qr-codes/qr-tpbank.png'
    }

    // Create payment record
    const payment = new Payment({
      bookingId,
      userId: req.user._id,
      amount: booking.totalAmount,
      paymentMethod: methodDetails.name,
      method,
      accountNumber: methodDetails.account,
      recipientName: methodDetails.recipientName,
      qrData,
      status: 'pending',
      description
    });

    await payment.save();

    res.status(201).json({
      paymentId: payment._id,
      bookingId,
      method,
      methodName: methodDetails.name,
      accountNumber: methodDetails.account,
      recipientName: methodDetails.recipientName,
      qrData,  // Image path: '/images/qr-codes/qr-momo.png'
      amount: booking.totalAmount,
      status: 'pending'
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});
```

### QR Code Config
```javascript
// File: Petconnet_BE/config/qrCodes.js

module.exports = {
  MOMO_QR: '/images/qr-codes/qr-momo.png',
  TPBANK_QR: '/images/qr-codes/qr-tpbank.png'
};
```

---

# SLIDE 4.3: STEP 3 - QR CODE DISPLAY & COUNTDOWN TIMER

## Frontend: QR Code Display
```typescript
// File: Petconnet_FE/src/pages/payment/PaymentSuccessPage.tsx

const PaymentSuccessPage = () => {
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(120);
  const [isExpired, setIsExpired] = useState(false);

  // Display QR code image
  useEffect(() => {
    if (paymentDetail?.qrData) {
      // qrData could be: '/images/qr-codes/qr-momo.png' or base64
      
      if (paymentDetail.qrData.startsWith('/')) {
        // It's a URL path - use directly
        setQrCodeUrl(paymentDetail.qrData);
      } else if (paymentDetail.qrData.startsWith('data:')) {
        // It's a data URL - use directly
        setQrCodeUrl(paymentDetail.qrData);
      } else {
        // Try to generate QR code from text
        QRCode.toDataURL(paymentDetail.qrData)
          .then(url => setQrCodeUrl(url))
          .catch(() => setQrCodeUrl(null));
      }
    }
  }, [paymentDetail]);

  // Countdown timer
  useEffect(() => {
    if (countdownSeconds > 0) {
      const timer = setTimeout(() => {
        setCountdownSeconds(countdownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExpired(true);
    }
  }, [countdownSeconds]);

  // Poll for payment status every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const bookingId = new URLSearchParams(window.location.search).get('bookingId');
      const response = await paymentService.checkPaymentStatus(bookingId);
      
      if (response?.status === 'completed') {
        // Payment confirmed, navigate to success
        navigate('/booking/confirmed');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="payment-page">
      {/* Countdown Timer */}
      <div className={`timer-box ${countdownSeconds <= 30 ? 'warning' : ''}`}>
        <span>⏳ {countdownSeconds}s</span>
        {countdownSeconds <= 30 && (
          <span className="warning-text">⚠️ Sắp hết thời gian</span>
        )}
      </div>

      {/* QR Code Display */}
      <div className="qr-section">
        <h3>Scan QR Code to Pay</h3>
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="QR code payment"
            className="qr-image"
          />
        ) : (
          <div className="loading">Generating QR code...</div>
        )}
      </div>

      {/* Payment Info */}
      <div className="payment-info">
        <div className="info-row">
          <span>Amount:</span>
          <span className="amount">{formatVND(paymentDetail?.amount)}</span>
        </div>
        <div className="info-row">
          <span>Method:</span>
          <span>{paymentDetail?.methodName}</span>
        </div>
        <div className="info-row">
          <span>Account:</span>
          <span>{paymentDetail?.accountNumber}</span>
        </div>
        <div className="info-row">
          <span>Recipient:</span>
          <span>{paymentDetail?.recipientName}</span>
        </div>
      </div>

      {/* Status Messages */}
      {isExpired && (
        <div className="alert alert-warning">
          ⏰ Payment link expired. Please create new payment.
        </div>
      )}

      {paymentDetail?.status === 'completed' && (
        <div className="alert alert-success">
          ✅ Payment confirmed! Processing booking...
        </div>
      )}
    </div>
  );
};
```

### Payment Check API
```javascript
// File: Petconnet_BE/routes/payments.js

router.get('/status/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({ bookingId })
      .select('status adminApprovalStatus amount');

    if (!payment) {
      return res.status(404).json({ 
        message: 'Payment not found' 
      });
    }

    res.json({
      paymentId: payment._id,
      status: payment.status,
      adminApprovalStatus: payment.adminApprovalStatus,
      amount: payment.amount
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
```

---

# SLIDE 4.4: STEP 4 - CUSTOMER TRANSFERS MONEY (MoMo)

## Real-World Customer Action

### MoMo App Flow (Customer's Phone)

```
1. Customer sees QR code on screen
2. Open MoMo app → tap [QR Scanner]
3. Point camera at screen
4. MoMo recognize QR
5. Transfer form shows:
   ├─ Recipient: Nguyễn Hữu Giàu
   ├─ Account: 0834339521
   ├─ Amount: 350,000 VND
   ├─ Message: 'Pet Connect - BookingID'
   └─ Fee: 1,000 VND
6. Enter MoMo PIN
7. Confirm & Process
8. Success: 'Transfer OK. Ref: 20260317ABC123'
```

### Frontend: Detect Payment Completed
```typescript
// File: Petconnet_FE/src/pages/payment/PaymentSuccessPage.tsx

// Poll for payment status (every 3 seconds)
const checkPaymentStatus = async () => {
  try {
    const bookingId = sessionStorage.getItem('bookingId');
    const response = await apiClient.get(
      `/api/v1/payments/status/${bookingId}`
    );

    if (response.success) {
      const { status, adminApprovalStatus } = response.data;

      // Payment received, waiting for admin approval
      if (status === 'completed' && adminApprovalStatus === 'pending') {
        setPaymentStatus('completed');
        showMessage('💚 Thanh toán được ghi nhận, chờ admin xác nhận');
        return;
      }

      // Payment approved by admin
      if (status === 'completed' && adminApprovalStatus === 'approved') {
        setPaymentStatus('approved');
        showMessage('✅ Thanh toán thành công!');
        setTimeout(() => navigate('/booking/confirmed'), 2000);
        return;
      }

      // Payment rejected
      if (adminApprovalStatus === 'rejected') {
        setPaymentStatus('rejected');
        showError(`❌ Thanh toán bị từ chối: ${response.data.rejectionReason}`);
        return;
      }
    }
  } catch (error) {
    console.error('Status check error:', error);
  }
};

// Call this every 3 seconds
useEffect(() => {
  const interval = setInterval(checkPaymentStatus, 3000);
  return () => clearInterval(interval);
}, []);
```

---

# SLIDE 4.5: STEP 5 - BACKEND RECORDS TRANSACTION

## Database: Payment Record Created

### Payment Model with Status Fields
```javascript
// File: Petconnet_BE/models/Payment.js

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'VND'
  },
  paymentMethod: String,  // 'MoMo' or 'TPBank'
  method: Number,  // 2 or 3
  accountNumber: String,
  recipientName: String,
  qrData: String,  // '/images/qr-codes/qr-momo.png'

  // Transaction status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },

  // Admin approval status
  adminApprovalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: Date,

  transactionId: String,  // MoMo reference: '20260317ABC123'
  completedAt: Date,
  description: String,
  
  timestamps: true
});
```

### Transaction Flow
```
Timeline:

14:00 - Customer Book Service
  └─ Booking created, status = 'pending'

14:02 - Payment Created
  └─ Payment record created, status = 'pending'
  └─ QR code generated

14:05 - Customer Transfer Money
  └─ MoMo process transfer
  └─ Backend detect callback (webhook or polling)

14:06 - Payment Completed
  └─ UPDATE payments SET status = 'completed'
  └─ Payment.adminApprovalStatus still = 'pending' (awaiting admin)

14:07 - Admin Reviews
  └─ Admin see payment in dashboard

14:08 - Admin Approves
  └─ UPDATE payments SET adminApprovalStatus = 'approved'
  └─ Booking status → 'confirmed'

14:09 - Freelancer Notified
  └─ Notification sent: 'New booking confirmed!'
```

---

# SLIDE 4.6: STEP 6 - ADMIN REVIEW & APPROVAL

## Admin Dashboard

### Frontend: Admin Payment Dashboard
```typescript
// File: Petconnet_FE/src/pages/admin/PaymentsPage.tsx

const PaymentsPage = () => {
  const { payments, loading, error, fetchPayments } = useAdminPayments();
  const [filter, setFilter] = useState('Pending');

  // Filter payments by status
  const filteredPayments = payments.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return p.adminApprovalStatus === 'pending' && p.status === 'completed';
    if (filter === 'Approved') return p.adminApprovalStatus === 'approved';
    if (filter === 'Rejected') return p.adminApprovalStatus === 'rejected';
  });

  const handleApprovePayment = async (paymentId) => {
    try {
      const response = await apiClient.put(
        `/api/v1/payments/${paymentId}/admin/approve`,
        {}
      );

      if (response.success) {
        showSuccess('Payment approved!');
        await fetchPayments();
      }
    } catch (error) {
      showError('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (paymentId, reason) => {
    try {
      const response = await apiClient.put(
        `/api/v1/payments/${paymentId}/admin/reject`,
        { reason }
      );

      if (response.success) {
        showSuccess('Payment rejected');
        await fetchPayments();
      }
    } catch (error) {
      showError('Failed to reject payment');
    }
  };

  return (
    <div className="admin-payments">
      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={filter === tab ? 'active' : ''}
          >
            {tab} ({payments.filter(p => 
              tab === 'All' ? true : 
              tab === 'Pending' ? p.adminApprovalStatus === 'pending' :
              tab === 'Approved' ? p.adminApprovalStatus === 'approved' :
              p.adminApprovalStatus === 'rejected'
            ).length})
          </button>
        ))}
      </div>

      {/* Payment Cards */}
      <div className="payment-cards">
        {filteredPayments.map(payment => (
          <PaymentCard
            key={payment._id}
            payment={payment}
            onApprove={() => handleApprovePayment(payment._id)}
            onReject={(reason) => handleRejectPayment(payment._id, reason)}
          />
        ))}
      </div>
    </div>
  );
};
```

### Payment Card Component
```typescript
// File: Petconnet_FE/src/components/admin/PaymentCard.tsx

const PaymentCard = ({ payment, onApprove, onReject }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleSubmitReject = () => {
    if (!rejectReason.trim()) {
      showError('Please provide rejection reason');
      return;
    }
    onReject(rejectReason);
    setShowRejectModal(false);
  };

  return (
    <div className={`payment-card ${payment.adminApprovalStatus}`}>
      {/* Header */}
      <div className="card-header">
        <span className={`badge badge-${payment.adminApprovalStatus}`}>
          {payment.adminApprovalStatus}
        </span>
        <span className="amount">{formatVND(payment.amount)}</span>
      </div>

      {/* Payment Details */}
      <div className="card-body">
        <div className="detail-row">
          <span className="label">Customer:</span>
          <span>{payment.userId.name}</span>
        </div>
        <div className="detail-row">
          <span className="label">Method:</span>
          <span>{payment.paymentMethod}</span>
        </div>
        <div className="detail-row">
          <span className="label">Account:</span>
          <span>{payment.accountNumber} - {payment.recipientName}</span>
        </div>
        <div className="detail-row">
          <span className="label">Booking:</span>
          <span>{payment.bookingId}</span>
        </div>
        <div className="detail-row">
          <span className="label">Status:</span>
          <span>{payment.status}</span>
        </div>
      </div>

      {/* Actions */}
      {payment.adminApprovalStatus === 'pending' && (
        <div className="card-actions">
          <button
            onClick={onApprove}
            className="btn btn-success"
          >
            ✓ Xác Nhận
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="btn btn-danger"
          >
            ✗ Từ Chối
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <Modal onClose={() => setShowRejectModal(false)}>
          <h3>Reject Payment</h3>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
            rows={4}
          />
          <div className="modal-actions">
            <button onClick={() => setShowRejectModal(false)}>Cancel</button>
            <button onClick={handleSubmitReject}>Confirm Reject</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
```

### Backend: Admin Approve Endpoint
```javascript
// File: Petconnet_BE/routes/payments.js

// Admin: Approve payment
router.put('/:paymentId/admin/approve', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin only.' 
      });
    }

    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ 
        message: 'Payment not found' 
      });
    }

    // Update payment approval status
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      {
        adminApprovalStatus: 'approved',
        status: 'completed',
        completedAt: new Date(),
        approvedBy: req.user._id,
        approvalDate: new Date()
      },
      { new: true }
    ).populate(['userId', 'bookingId']);

    // Update booking status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    // Send notification to freelancer
    // ... notification logic here ...

    console.log('Payment approved:', {
      paymentId: req.params.paymentId,
      adminId: req.user._id,
      timestamp: new Date()
    });

    res.json({
      message: 'Payment approved successfully',
      payment: updatedPayment
    });

  } catch (error) {
    console.error('Payment approve error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Reject payment
router.put('/:paymentId/admin/reject', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin only.' 
      });
    }

    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ 
        message: 'Rejection reason is required' 
      });
    }

    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ 
        message: 'Payment not found' 
      });
    }

    // Update payment with rejection
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      {
        adminApprovalStatus: 'rejected',
        status: 'failed',
        rejectionReason: reason,
        approvedBy: req.user._id,
        approvalDate: new Date()
      },
      { new: true }
    ).populate(['userId', 'bookingId']);

    // Update booking back to pending
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    // Refund to customer (cancel booking)
    // ... refund logic here ...

    console.log('Payment rejected:', {
      paymentId: req.params.paymentId,
      reason,
      adminId: req.user._id
    });

    res.json({
      message: 'Payment rejected',
      payment: updatedPayment
    });

  } catch (error) {
    console.error('Payment reject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
```

---

# SLIDE 4.7: STEP 7 - CUSTOMER & FREELANCER NOTIFICATIONS

## Email Notifications

### Email to Customer (After Approval)
```
Subject: ✅ Your pet service booking is confirmed!

Dear Anh Tú,

Great news! Your booking has been confirmed.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: Pet Grooming (3 hours)
Freelancer: Ms. Linh (Rating: 4.9/5)
Your Pet: Max (Labrador)
Date: Saturday, March 22, 2026
Time: 8:00 AM - 11:00 AM
Location: District 1, Nguyen Hue Street
Total Amount: 350,000 VND

What Happens Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Freelancer will call you 1 hour before
2. She will arrive at scheduled time
3. Real-time tracking available in app
4. After service, you can rate & review

Questions? Contact us: support@petconnect.vn
```

### Email to Freelancer (When Booking Confirmed)
```
Subject: 💼 You have a new booking confirmed!

Dear Ms. Linh,

Excitement time! You have a new pet grooming booking.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Customer: Anh Tú
Pet: Max (Labrador, 5 years old)
Service: Full Grooming
Date: Saturday, March 22, 2026, 8:00 AM
Duration: 3 hours
Location: District 1, Nguyen Hue Street
Payment: 350,000 VND

Important Notes:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Max is a bit shy - please be gentle
• Use hypoallergenic shampoo
• Call customer 1 hour before

Your Earnings:
280,000 VND (after 20% platform fee)
```

### Backend: Send Notifications
```javascript
// File: Petconnet_BE/routes/payments.js

async function sendNotifications(payment, booking) {
  try {
    const customer = await User.findById(booking.customerId);
    const freelancer = await User.findById(booking.freelancerId);

    // Send email to customer
    await emailService.send({
      to: customer.email,
      subject: '✅ Your pet service booking is confirmed!',
      template: 'booking-confirmed-customer',
      data: {
        customerName: customer.name,
        serviceName: booking.serviceId.name,
        freelancerName: freelancer.name,
        petName: booking.petIds[0].name,
        scheduledDate: booking.scheduledDate,
        timeSlot: booking.timeSlot,
        amount: booking.totalAmount
      }
    });

    // Send email to freelancer
    await emailService.send({
      to: freelancer.email,
      subject: '💼 You have a new booking confirmed!',
      template: 'booking-confirmed-freelancer',
      data: {
        freelancerName: freelancer.name,
        customerName: customer.name,
        petName: booking.petIds[0].name,
        specialInstructions: booking.specialInstructions,
        amount: booking.totalAmount * 0.8,  // 80% after fee
        scheduledDate: booking.scheduledDate
      }
    });

    // Push notification to freelancer app
    await notificationService.push({
      userId: freelancer._id,
      title: 'New Booking Confirmed! 💼',
      body: `${customer.name}'s ${booking.petIds[0].name} needs ${booking.serviceId.name}`,
      data: { bookingId: booking._id }
    });

    console.log('Notifications sent:', {
      paymentId: payment._id,
      customerId: customer._id,
      freelancerId: freelancer._id
    });

  } catch (error) {
    console.error('Notification send error:', error);
  }
}
```

---

# SLIDE 4.8: PAYMENT STATUS DIAGRAM

## Complete Status Flow

```
                    CUSTOMER BOOKS SERVICE
                            ↓
                    Booking created
                    status = 'pending'
                            ↓
                    ┌───────────────────┐
                    │  PAYMENT CREATED  │
                    │ status = 'pending'│
                    │  QR code shown    │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │  CUSTOMER PAYS    │
                    │  Scan QR & Transfer
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │ PAYMENT COMPLETED │
                    │ status='completed'│
                    │ admin approval=   │
                    │ 'pending'         │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
          ┌─────────│  ADMIN REVIEWS    │───────┐
          │         │  Dashboard        │       │
          │         └──────────────────┘       │
          │                                    │
    [APPROVE]                            [REJECT]
          │                                    │
    ┌─────▼────────────────┐        ┌─────────▼──────────┐
    │ PAYMENT APPROVED     │        │ PAYMENT REJECTED   │
    │ status='completed'   │        │ status='failed'    │
    │ admin='approved'     │        │ admin='rejected'   │
    │ Booking confirmed    │        │ Booking cancelled  │
    │ Freelancer notified  │        │ Full refund issued │
    └──────────────────────┘        └────────────────────┘
             │
             ↓
    SERVICE EXECUTION
    (Freelancer arrives)
             ↓
    SERVICE COMPLETED
    (Photos, review)
             ↓
    FREELANCER WITHDRAWAL
    REQUEST (Next Monday)
```

---

# SLIDE 4.9: PAYMENT STATUS TRANSITIONS

## Database State Changes

### State 1: Payment Pending
```javascript
{
  _id: "payment-123",
  bookingId: "booking-456",
  userId: "customer-789",
  amount: 350000,
  paymentMethod: "MoMo",
  qrData: "/images/qr-codes/qr-momo.png",
  
  status: "pending",  // ← Money not yet transferred
  adminApprovalStatus: "pending",  // ← Admin not yet reviewed
  
  createdAt: "2026-03-17T14:00:00Z"
}
```

### State 2: Money Transferred, Awaiting Admin
```javascript
{
  _id: "payment-123",
  bookingId: "booking-456",
  userId: "customer-789",
  amount: 350000,
  paymentMethod: "MoMo",
  transactionId: "20260317ABC123",  // ← Reference from MoMo
  
  status: "completed",  // ← Money arrived at our account
  adminApprovalStatus: "pending",  // ← Still awaiting admin review
  
  completedAt: "2026-03-17T14:06:00Z"
}
```

### State 3: Admin Approved
```javascript
{
  _id: "payment-123",
  bookingId: "booking-456",
  userId: "customer-789",
  amount: 350000,
  paymentMethod: "MoMo",
  transactionId: "20260317ABC123",
  
  status: "completed",  // Money received ✓
  adminApprovalStatus: "approved",  // ← Admin confirmed ✓
  approvedBy: "admin-234",
  approvalDate: "2026-03-17T14:08:00Z",
  
  completedAt: "2026-03-17T14:06:00Z"
}
```

### State 4: Admin Rejected
```javascript
{
  _id: "payment-123",
  bookingId: "booking-456",
  userId: "customer-789",
  amount: 350000,
  paymentMethod: "MoMo",
  transactionId: "20260317ABC123",
  
  status: "failed",  // ← Payment rejected
  adminApprovalStatus: "rejected",
  rejectionReason: "Transfer from stolen account",
  approvedBy: "admin-234",
  approvalDate: "2026-03-17T14:08:00Z",
  
  completedAt: "2026-03-17T14:06:00Z"
}
```

---

# KEY TAKEAWAYS

## Summary of Main Flow

| Step | Component | Action | Status |
|------|-----------|--------|--------|
| 1 | **Frontend** | Customer books service | Booking: pending |
| 2 | **Frontend** | Select payment method | - |
| 2 | **Backend** | Create payment record | Payment: pending |
| 3 | **Frontend** | Display QR code + timer | Countdown: 120s |
| 4 | **Frontend** | Poll for payment status | Every 3 seconds |
| 5 | **External** | Customer transfers money | MoMo API |
| 5 | **Backend** | Record transaction | Payment: completed |
| 6 | **Frontend** | Show "Waiting admin" msg | Status: pending admin |
| 7 | **Admin** | Review in dashboard | Decision pending |
| 8 | **Backend** | Approve payment | Payment: approved |
| 9 | **Backend** | Update booking | Booking: confirmed |
| 10 | **Backend** | Send notifications | Email + Push |
| 11 | **Freelancer** | Receive booking | In their app |

## Code Integration Points

1. **Frontend Payment Service** → Calls `/api/v1/payments/create`
2. **Backend Payment Route** → Creates Payment document + returns QR
3. **Frontend Polling** → Calls `/api/v1/payments/status/{bookingId}` every 3s
4. **Admin Dashboard** → Lists pending payments from database
5. **Admin Action** → Calls `/api/v1/payments/{id}/admin/approve` or `reject`
6. **Backend Update** → Updates Payment + Booking + sends notifications

---

*These 9 detailed slides show the complete payment flow from code perspective.*
*Each slide has real Frontend (TypeScript/React), Backend (Node.js), and Database code examples.*
*Ready for developer training, investor tech deep-dives, and system documentation.*
