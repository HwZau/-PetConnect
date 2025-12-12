import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../services/admin/adminService";
import { useSettings } from "../../contexts/SettingsContext";

const PaymentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useSettings();
  const [payment, setPayment] = React.useState<any>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const formatVnd = (value?: number | string) => {
    if (value === null || value === undefined || value === '') return '—';
    const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(num)) return '—';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };
  const normalizeStatus = (s?: any) => {
    if (s === null || s === undefined) return undefined;
    const t = String(s).trim().toLowerCase();
    if (t.includes('success')) return 'Success';
    if (t.includes('pending')) return 'Pending';
    if (t.includes('failed')) return 'Failed';
    if (t.includes('cancel')) return 'Cancelled';
    return String(s);
  };

  React.useEffect(() => {
    const load = async () => {
      if (!id) return;
      console.log('[PaymentDetailPage] loading id=', id);
      setLoading(true);
      // If id looks like a synthetic booking id (ends with -p), skip getPaymentById
      if (id.endsWith("-p")) {
        const bookingId = id.replace(/-p$/, "");
        // try get payment by booking id
        const pByBooking = await adminService.getPaymentByBookingId(bookingId).catch(() => ({ success: false }));
        if (pByBooking && pByBooking.success && pByBooking.data) {
          const pd = pByBooking.data as any;
          const mapped: any = {
            id: pd.paymentId || pd.id,
            bookingId: pd.bookingId,
            amount: Number(pd.amount ?? 0),
            platformFee: Number(pd.commissionAmount ?? pd.platformFee ?? 0),
            method: pd.method,
            status: normalizeStatus(pd.status),
            date: pd.createdAt,
            transactionId: pd.transactionId || pd.txId,
            notes: pd.notes,
            customer: pd.customerName || pd.customer || undefined,
            freelancer: pd.freelancerName || pd.freelancer || undefined,
          };
          console.log('[PaymentDetailPage] getPaymentByBookingId response pd=', pd, 'mapped=', mapped);

          // If payment doesn't include customer/freelancer names, fetch booking to populate them
          if ((!mapped.customer || !mapped.freelancer) && mapped.bookingId) {
            const bookingResp: any = await adminService.getBookingById(mapped.bookingId).catch(() => null);
            if (bookingResp && bookingResp.success && bookingResp.data) {
              const b = bookingResp.data as any;
              mapped.customer = mapped.customer || b.customerName || b.customer || '—';
              mapped.freelancer = mapped.freelancer || b.freelancerName || b.freelancer || '—';
            }
          }

          setPayment(mapped);
          const sresp = await adminService.getPaymentStatusByBookingId(bookingId).catch(() => ({ success: false }));
          if (sresp && (sresp as any).success && (sresp as any).data) {
            setStatus((sresp as any).data.status || null);
          }
          setLoading(false);
          return;
        }
        // fallback: try to fetch booking and construct
        const bResp = await adminService.getBookingById(bookingId).catch(() => ({ success: false }));
        if (bResp && bResp.success && bResp.data) {
          const b = (bResp.data as any);
          const petNames = ((b.pets || []).map((p: any) => p.petName).filter(Boolean)).join(', ');
          const constructed = {
            id: `${bookingId}-p`,
            title: `Payment for ${petNames || bookingId.substring(0,8)}`,
            bookingId: bookingId,
            customerId: b.customerId || '',
            customer: b.customerName || '—',
            freelancer: b.freelancerName || '—',
            service: b.service || '—',
            amount: b.totalPrice || 0,
            platformFee: 0,
            status: 'Pending',
            date: b.bookingDate || b.createdAt,
          };
          setPayment(constructed);
          const sresp = await adminService.getPaymentStatusByBookingId(bookingId).catch(() => ({ success: false }));
          if (sresp && (sresp as any).success && (sresp as any).data) {
            setStatus((sresp as any).data.status || null);
          }
          setLoading(false);
          return;
        }
        setLoading(false);
        return;
      }

      // First try: treat `id` as real paymentId
      let resp = await adminService.getPaymentById(id).catch(() => ({ success: false }));
      if (resp && resp.success && resp.data) {
        // Normalize backend payment shape to local UI shape
        const pd = resp.data as any;
        const mapped: any = {
          id: pd.paymentId || pd.id,
          bookingId: pd.bookingId,
          amount: Number(pd.amount ?? 0),
          platformFee: Number(pd.commissionAmount ?? pd.platformFee ?? 0),
          method: pd.method,
          status: normalizeStatus(pd.status),
          date: pd.createdAt,
          transactionId: pd.transactionId || pd.txId,
          notes: pd.notes,
        };
        console.log('[PaymentDetailPage] getPaymentById response pd=', pd, 'mapped=', mapped);

        if (mapped.bookingId) {
          const bookingResp: any = await adminService.getBookingById(mapped.bookingId).catch(() => null);
          if (bookingResp && bookingResp.success && bookingResp.data) {
            const b = bookingResp.data as any;
            mapped['customer'] = b.customerName || b.customer || '—';
            mapped['freelancer'] = b.freelancerName || b.freelancer || '—';
          }
        }

        setPayment(mapped);
        // Try to fetch status by bookingId
        const bookingId = pd.bookingId || pd.bookingId;
        if (bookingId) {
          const sresp = await adminService.getPaymentStatusByBookingId(bookingId).catch(() => ({ success: false }));
          if (sresp && (sresp as any).success && (sresp as any).data) {
            setStatus((sresp as any).data.status || null);
          }
        }
      } else {
        // If paymentId lookup failed (e.g., synthetic id like `${bookingId}-p`), try as bookingId
        let bookingId = id;
        if (bookingId.endsWith("-p")) bookingId = bookingId.replace(/-p$/, "");

        // Try get payment by booking id
        const pByBooking = await adminService.getPaymentByBookingId(bookingId).catch(() => ({ success: false }));
        if (pByBooking && pByBooking.success && pByBooking.data) {
          const pd = pByBooking.data as any;
          const mapped: any = {
            id: pd.paymentId || pd.id,
            bookingId: pd.bookingId,
            amount: Number(pd.amount ?? 0),
            platformFee: Number(pd.commissionAmount ?? pd.platformFee ?? 0),
            method: pd.method,
            status: normalizeStatus(pd.status),
            date: pd.createdAt,
            transactionId: pd.transactionId || pd.txId,
            notes: pd.notes,
          };
          if (mapped.bookingId) {
            const bookingResp2: any = await adminService.getBookingById(mapped.bookingId).catch(() => null);
            if (bookingResp2 && bookingResp2.success && bookingResp2.data) {
              const b = bookingResp2.data as any;
              mapped['customer'] = b.customerName || b.customer || '—';
              mapped['freelancer'] = b.freelancerName || b.freelancer || '—';
            }
          }
          console.log('[PaymentDetailPage] pByBooking pd=', pd, 'mapped=', mapped);
          setPayment(mapped);
          const sresp = await adminService.getPaymentStatusByBookingId(bookingId).catch(() => ({ success: false }));
          if (sresp && (sresp as any).success && (sresp as any).data) {
            setStatus((sresp as any).data.status || null);
          }
        } else {
          // As last resort, fetch booking and construct a payment-like object
          const bResp = await adminService.getBookingById(bookingId).catch(() => ({ success: false }));
          if (bResp && bResp.success && bResp.data) {
            const b = (bResp.data as any);
            const petNames = ((b.pets || []).map((p: any) => p.petName).filter(Boolean)).join(', ');
            const constructed = {
              id: `${bookingId}-p`,
              title: `Payment for ${petNames || bookingId.substring(0,8)}`,
              bookingId: bookingId,
              customerId: b.customerId || '',
              customer: b.customerName || '—',
              freelancer: b.freelancerName || '—',
              service: b.service || '—',
              amount: b.totalPrice || 0,
              platformFee: 0,
              status: 'Pending',
              date: b.bookingDate || b.createdAt,
            };
            console.log('[PaymentDetailPage] constructed payment from booking b=', b, 'constructed=', constructed);
            setPayment(constructed);
            const sresp = await adminService.getPaymentStatusByBookingId(bookingId).catch(() => ({ success: false }));
            if (sresp && (sresp as any).success && (sresp as any).data) {
              setStatus((sresp as any).data.status || null);
            }
          }
        }
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!payment) return <div className="p-6">Không tìm thấy giao dịch.</div>;

  return (
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <button onClick={() => navigate(-1)} className="mb-4 px-3 py-2 bg-gray-200 rounded">Quay lại</button>
      <h2 className="text-2xl font-bold mb-4">Chi tiết giao dịch</h2>
      <div className="rounded-2xl p-6 shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">ID</div>
            <div className="font-semibold">{payment.id}</div>
          </div>

          {payment.title ? (
            <div>
              <div className="text-sm text-gray-500">Tiêu đề</div>
              <div className="font-semibold">{payment.title}</div>
            </div>
          ) : null}

          {payment.bookingId ? (
            <div>
              <div className="text-sm text-gray-500">Booking ID</div>
              <div className="font-semibold">{payment.bookingId}</div>
            </div>
          ) : null}

          {(status ?? payment.status) ? (
            <div>
              <div className="text-sm text-gray-500">Trạng thái (backend)</div>
              <div className="font-semibold">{status ?? payment.status}</div>
            </div>
          ) : null}

          {payment.customer ? (
            <div>
              <div className="text-sm text-gray-500">Khách hàng</div>
              <div className="font-semibold">{payment.customer}</div>
            </div>
          ) : null}

          {payment.freelancer ? (
            <div>
              <div className="text-sm text-gray-500">Freelancer</div>
              <div className="font-semibold">{payment.freelancer}</div>
            </div>
          ) : null}

          {payment.amount !== undefined && payment.amount !== null ? (
            <div>
              <div className="text-sm text-gray-500">Số tiền</div>
              <div className="font-semibold">{formatVnd(payment.amount)}</div>
            </div>
          ) : null}

          {payment.platformFee !== undefined && payment.platformFee !== null ? (
            <div>
              <div className="text-sm text-gray-500">Phí nền tảng</div>
              <div className="font-semibold">{formatVnd(payment.platformFee)}</div>
            </div>
          ) : null}

          {(payment.transactionId || payment.notes) ? (
            <div className="col-span-2">
              <div className="text-sm text-gray-500">Ghi chú / Transaction ID</div>
              <div className="font-semibold">{payment.transactionId || payment.notes}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailPage;
