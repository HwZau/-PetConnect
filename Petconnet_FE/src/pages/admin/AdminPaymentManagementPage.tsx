import React, { useState, useEffect } from 'react';
import { useAdminPayments } from '../../hooks/useAdmin';
import { showSuccess, showError } from '../../utils/toastUtils';
import { FiCheck, FiX, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { apiClient } from '../../services/apiClient';
import './AdminPaymentManagement.css';

const AdminPaymentManagementPage: React.FC = () => {
  const { payments, loading, fetchPayments } = useAdminPayments();
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Fetch payments on mount
  useEffect(() => {
    fetchPayments({ page: 1, pageSize: 100 });
  }, []);

  // Filter payments based on admin approval status
  const filteredPayments = payments.filter((p: any) => {
    if (filter === 'all') return true;
    const status = p.adminApprovalStatus || 'pending';
    return status === filter;
  });

  // Handle approve payment
  const handleApprovePayment = async (paymentId: string) => {
    try {
      setApproving(paymentId);
      const response = await apiClient.put(
        `/payments/${paymentId}/admin/approve`,
        {}
      );

      if (response.data) {
        showSuccess('Xác nhận thanh toán thành công!');
        await fetchPayments({ page: 1, pageSize: 100 });
      }
    } catch (error: any) {
      console.error('Approve error:', error);
      showError(error.response?.data?.message || 'Lỗi khi xác nhận thanh toán');
    } finally {
      setApproving(null);
    }
  };

  // Handle reject payment
  const handleRejectPayment = async (paymentId: string) => {
    if (!rejectionReason.trim()) {
      showError('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setRejecting(paymentId);
      const response = await apiClient.put(
        `/payments/${paymentId}/admin/reject`,
        { reason: rejectionReason }
      );

      if (response.data) {
        showSuccess('Từ chối thanh toán thành công!');
        setRejectionReason('');
        setSelectedPaymentId(null);
        await fetchPayments({ page: 1, pageSize: 100 });
      }
    } catch (error: any) {
      console.error('Reject error:', error);
      showError(error.response?.data?.message || 'Lỗi khi từ chối thanh toán');
    } finally {
      setRejecting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
      default:
        return '#f59e0b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã xác nhận';
      case 'rejected':
        return 'Đã từ chối';
      case 'pending':
      default:
        return 'Chờ xác nhận';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-payment-container">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="admin-payment-container">
      {/* Header */}
      <div className="payment-header">
        <h1>Quản Lý Xác Nhận Thanh Toán</h1>
        <button
          className="refresh-btn"
          onClick={() => fetchPayments({ page: 1, pageSize: 100 })}
        >
          <FiRefreshCw /> Làm tươi
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' && 'Tất cả'}
            {tab === 'pending' && 'Chờ xác nhận'}
            {tab === 'approved' && 'Đã xác nhận'}
            {tab === 'rejected' && 'Đã từ chối'}
            <span className="count">({
              tab === 'all'
                ? payments.length
                : payments.filter((p: any) => (p.adminApprovalStatus || 'pending') === tab).length
            })</span>
          </button>
        ))}
      </div>

      {/* Payment List */}
      <div className="payment-list">
        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <FiAlertCircle size={48} />
            <p>Không có thanh toán nào</p>
          </div>
        ) : (
          filteredPayments.map((payment: any) => (
            <div key={payment._id} className="payment-card">
              {/* Card Header */}
              <div className="payment-card-header">
                <div className="payment-info">
                  <h3>{payment.userId?.name || 'Unknown'}</h3>
                  <p className="payment-id">ID: {payment._id?.slice(-8)}</p>
                </div>
                <div
                  className="status-badge"
                  style={{
                    backgroundColor: getStatusColor(payment.adminApprovalStatus || 'pending'),
                    color: 'white'
                  }}
                >
                  {getStatusLabel(payment.adminApprovalStatus || 'pending')}
                </div>
              </div>

              {/* Card Body */}
              <div className="payment-card-body">
                <div className="row">
                  <div className="col">
                    <label>Số tiền</label>
                    <p className="amount">{formatCurrency(payment.amount || 0)}</p>
                  </div>
                  <div className="col">
                    <label>Phương thức</label>
                    <p>{
                      payment.paymentMethod === 2 ? 'MoMo' :
                      payment.paymentMethod === 3 ? 'TPBank' :
                      'Khác'
                    }</p>
                  </div>
                  <div className="col">
                    <label>Trạng thái</label>
                    <p>{payment.status || 'pending'}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <label>Khách hàng</label>
                    <p>{payment.userId?.email || 'N/A'}</p>
                  </div>
                  <div className="col">
                    <label>Order Code</label>
                    <p>{payment.orderCode || 'N/A'}</p>
                  </div>
                  <div className="col">
                    <label>Ngày tạo</label>
                    <p>{new Date(payment.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                {/* Rejection reason if exists */}
                {payment.rejectionReason && (
                  <div className="rejection-reason">
                    <label>Lý do từ chối:</label>
                    <p>{payment.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              {(payment.adminApprovalStatus || 'pending') === 'pending' && (
                <div className="payment-card-actions">
                  <button
                    className="btn btn-approve"
                    onClick={() => handleApprovePayment(payment._id)}
                    disabled={approving === payment._id}
                  >
                    <FiCheck /> {approving === payment._id ? 'Đang xử lý...' : 'Xác nhận'}
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => setSelectedPaymentId(payment._id)}
                  >
                    <FiX /> Từ chối
                  </button>
                </div>
              )}

              {/* Rejection Modal */}
              {selectedPaymentId === payment._id && (
                <div className="rejection-modal">
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    rows={4}
                  />
                  <div className="modal-actions">
                    <button
                      className="btn btn-cancel"
                      onClick={() => {
                        setSelectedPaymentId(null);
                        setRejectionReason('');
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn btn-submit"
                      onClick={() => handleRejectPayment(payment._id)}
                      disabled={rejecting === payment._id}
                    >
                      {rejecting === payment._id ? 'Đang xử lý...' : 'Từ chối'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPaymentManagementPage;
