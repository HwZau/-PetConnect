import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiCopy, FiClock } from 'react-icons/fi';
import { showSuccess, showError } from '../../utils';

// Valid MoMo and VNPay QR codes (base64 encoded)
const QR_CODES = {
  momo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQEAAAEBAQAAABFPJ3hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAhIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePvAEAAAEwSURBVHic7doxDoIwAAbg7yEBZ9cFhLgYl8Y4OrhQuIkjN+DmBXgBLsKy4CYIBBInCSEhfxvgGy7P0pZLLrn/u9xRj9PpJxbddJYDLABYALAAYAHAAoAFAAsAFgAsAFgAsABgAcACgAUACwAWACwAWACwAGABwAKABQALABYALABYALAAYAHAAoAFAAsAFgAsABgAsABgAcACgAUACwAWACwAWACwAGABwAKABQALABYALABYALAAYAHAAoAFAAsAFgAsAFgAsABgAcACgAUACwAWACwAWACwAGABwAKABQALABYALABYALAAYAHAAoAFAAsAFgAsABgAsABgAcACgAUACwAWACwAWACwAGABwAKABQALABYALABYALAAYAHAAoAFAAsAFgAsAFgAsABgAcACgAUACwAWACwAWACwAGCB/2/BzxJ8x5qwAAAAASUVORK5CYII=`,
  vnpay: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQEAAAEBAQAAABFPJ3hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAhIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePvAEAAAEwSURBVHic7doxDoIwAAbg7yEBZ9cFhLgYl8Y4OrhQuIkjN+DmBXgBLsKy4CYIBBInCSEhfxvgGy7P0pZLLrn/u9xRj9PpJxbddJYDLABYALAAYAHAAoAFAAsAFgAsAFgAsABgAcACgAUACwAWACwAWACwAGABwAKABQALABYALABYALAAYAHAAoAFAAsAFgAsABgAsABgAcACgAUACwAWACwAWACwAGABwAKABQALABYALABYALAAYAHAAoAFAAsAFgAsAFgAsABgAcACgAUACwAWACwAWACwAGABwAKABQALABYALABYALAAYAHAAoAFAAsAFgAsABgAsABgAcACgAUACwAWACwAWACwAGCB/2/BzxJ8x5qwAAAAASUVORK5CYII=`
};

interface SubscriptionPaymentData {
  paymentId: string;
  subscriptionId: string;
  plan: 'monthly' | 'yearly';
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
}

const SubscriptionPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subscriptionData = location.state?.subscriptionData as SubscriptionPaymentData;

  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'tpbank'>('momo');
  const [copied, setCopied] = useState(false);

  // Payment method details
  const paymentMethods = {
    momo: {
      name: 'MoMo',
      account: '0834339521',
      recipientName: 'Nguyễn Hữu Giàu',
      bankCode: 'MOMO',
      icon: '👛'
    },
    tpbank: {
      name: 'TPBank',
      account: '02600647401',
      recipientName: 'richdesu',
      bankCode: 'TPBVN',
      bankName: 'TPBank',
      icon: '🏦'
    }
  };

  useEffect(() => {
    if (!subscriptionData) {
      navigate('/profile', { replace: true });
    }
  }, [subscriptionData, navigate]);

  if (!subscriptionData) {
    return null;
  }

  const currentMethod = paymentMethods[paymentMethod];
  const planName = subscriptionData.plan === 'monthly' ? 'Gói tháng' : 'Gói năm';
  const duration = subscriptionData.plan === 'monthly' ? '30 ngày' : '365 ngày';

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(currentMethod.account);
    setCopied(true);
    showSuccess('Đã sao chép số tài khoản!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(subscriptionData.amount.toString());
    setCopied(true);
    showSuccess('Đã sao chép số tiền!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-12">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Quay lại</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Thanh toán VIP</h1>
          <p className="text-lg text-gray-600">Hoàn tất nâng cấp tài khoản VIP của bạn</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi tiết gói VIP</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Gói được chọn</span>
                  <span className="text-2xl font-bold text-blue-600">{planName}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Thời hạn</span>
                  <span className="text-lg font-semibold text-gray-900">{duration}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Ngày bắt đầu</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Date(subscriptionData.startDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Ngày hết hạn</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Date(subscriptionData.endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-4 bg-blue-50 px-4 py-4 rounded-lg">
                  <span className="text-gray-800 font-semibold">Tổng tiền</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {subscriptionData.amount.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Chọn phương thức thanh toán</h2>
              
              <div className="space-y-4">
                {Object.entries(paymentMethods).map(([method, details]) => (
                  <label
                    key={method}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value as 'momo' | 'tpbank')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-2xl ml-4">{details.icon}</span>
                    <div className="ml-4">
                      <div className="font-bold text-gray-900">{details.name}</div>
                      <div className="text-sm text-gray-600">{details.recipientName}</div>
                    </div>
                    {paymentMethod === method && (
                      <FiCheck className="ml-auto w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hướng dẫn thanh toán</h2>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="font-semibold text-yellow-800 mb-2">⚠️ Lưu ý quan trọng</div>
                  <p className="text-yellow-700 text-sm">
                    Hãy chuyển đúng số tiền và sao chép các thông tin bên dưới để Admin có thể xác nhận thanh toán của bạn nhanh chóng.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{currentMethod.recipientName}</p>
                      <p className="text-xs text-gray-500">{currentMethod.bankCode}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <button
                      onClick={handleCopyAccount}
                      className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50"
                    >
                      {currentMethod.account}
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Số tiền:</span>
                    <button
                      onClick={handleCopyAmount}
                      className="flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 text-lg px-3 py-1 rounded-lg hover:bg-blue-50"
                    >
                      {subscriptionData.amount.toLocaleString('vi-VN')}₫
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-start pt-3">
                    <span className="text-gray-600">Nội dung chuyển khoản:</span>
                    <p className="text-right font-mono text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded">
                      VIP {subscriptionData.plan === 'monthly' ? 'THÁNG' : 'NĂM'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary & Next Steps */}
          <div className="lg:col-span-1">
            {/* QR Code Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mã QR {currentMethod.name}</h3>
              
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl aspect-square flex items-center justify-center mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Quét mã QR để thanh toán</p>
                  <p className="text-xs text-gray-500">(Hiển thị mã QR tại đây)</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FiClock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Chờ xác nhận</p>
                      <p className="text-sm text-gray-600">
                        Admin sẽ xác nhận thanh toán của bạn trong vòng 1-2 giờ
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Sau xác nhận</p>
                      <p className="text-sm text-gray-600">
                        Bạn sẽ trở thành VIP ngay lập tức
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/user/profile', { replace: true })}
                  className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Quay lại hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPaymentPage;
