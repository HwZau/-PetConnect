// file: PaymentsPage.tsx - Updated with API Integration
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/admin/StatCard";
import TransactionCard from "../../components/admin/TransactionCard";
import { AiOutlineDollarCircle, AiOutlineLineChart, AiOutlineSwap, AiOutlineDownload, AiOutlineFilePdf, AiOutlineCalendar, AiOutlineUser } from "react-icons/ai";
import FiltersPanel from "../../components/admin/FiltersPanel";
import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useAdminPayments } from "../../hooks/useAdmin";
import html2pdf from "html2pdf.js";
import { showSuccess, showError } from "../../utils/toastUtils";

const ITEMS_PER_PAGE = 6;

const PaymentsPage: React.FC = () => {
  const { theme } = useSettings();
  const navigate = useNavigate();
  const { payments, loading, error, fetchPayments } = useAdminPayments();

  // Fetch all payments on mount with large page size for client-side pagination
  React.useEffect(() => {
    fetchPayments({ page: 1, pageSize: 1000 });
  }, [fetchPayments]);

  const handleExportPdf = () => {
    try {
      // Calculate totals
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const totalFees = payments.reduce((sum, p) => sum + (p.platformFee || 0), 0);
      
      // Create HTML content with proper Vietnamese support
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="text-align: center; margin-bottom: 10px;">Báo Cáo Giao Dịch</h1>
          <p style="text-align: center; margin-bottom: 20px; color: #666;">Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Tổng doanh thu:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}</p>
            <p style="margin: 5px 0;"><strong>Phí nền tảng:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalFees)}</p>
            <p style="margin: 5px 0;"><strong>Tổng giao dịch:</strong> ${payments.length}</p>
            <p style="margin: 5px 0;"><strong>Doanh thu ròng:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue - totalFees)}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background: #2c3e50; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Tiêu đề</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Khách hàng</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Freelancer</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Số tiền</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Phí</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Trạng thái</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Ngày</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map((p, idx) => `
                <tr style="background: ${idx % 2 === 0 ? '#fff' : '#f9f9f9'};">
                  <td style="padding: 10px; border: 1px solid #ddd;">${p.title}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${p.customer}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${p.freelancer}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.amount || 0)}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.platformFee || 0)}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    <span style="padding: 4px 8px; border-radius: 3px; ${
                      p.status === 'Success' ? 'background: #d4edda; color: #155724;' :
                      p.status === 'Pending' ? 'background: #fff3cd; color: #856404;' :
                      p.status === 'Failed' ? 'background: #f8d7da; color: #721c24;' :
                      'background: #e2e3e5; color: #383d41;'
                    }">
                      ${p.status === 'Success' ? 'Thành công' : p.status === 'Pending' ? 'Chờ' : p.status === 'Failed' ? 'Lỗi' : 'Hủy'}
                    </span>
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${new Date(p.date).toLocaleDateString('vi-VN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      
      // Create a temporary div to hold the HTML
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      
      // Configure and export using html2pdf
      const opt = {
        margin: 10,
        filename: `payments_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape' as const, unit: 'mm', format: 'a4' }
      };
      
      html2pdf().set(opt).from(element).save();
      showSuccess('PDF xuất thành công!');
    } catch (err) {
      showError('Lỗi xuất PDF: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleExportCsv = () => {
    try {
      const header = ['Tiêu đề', 'Khách hàng', 'Freelancer', 'Dịch vụ', 'Số tiền (VND)', 'Phí nền tảng (VND)', 'Phương thức', 'Trạng thái', 'Ngày'];
      
      // Map status to Vietnamese display names
      const statusMap: { [key: string]: string } = {
        'Success': 'Thành công',
        'Pending': 'Chờ',
        'Failed': 'Lỗi',
        'Cancelled': 'Hủy'
      };
      
      const rows = payments.map(p => [
        p.title || 'N/A',
        p.customer || 'N/A',
        p.freelancer || 'N/A',
        p.service || 'N/A',
        p.amount || 0,
        p.platformFee || 0,
        p.method || 'Unknown',
        statusMap[p.status] || p.status,
        new Date(p.date).toLocaleDateString('vi-VN')
      ]);
      
      // Create CSV with proper encoding for Vietnamese characters
      const csvContent = [
        header.map(h => `"${h}"`).join(','),
        ...rows.map(r => r.map(c => `"${String(c)}"`).join(','))
      ].join('\n');
      
      // Add BOM for UTF-8 encoding to handle Vietnamese characters properly in Excel
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `payments_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('CSV xuất thành công!');
    } catch (err) {
      showError('Lỗi xuất CSV: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Kiểu cho bộ lọc trang Payments
  type PaymentsFilter = {
    status: string
    method: string
    type: string
    amountRange: string
    dateRange: string
    userType: string
  }

  const [filter, setFilter] = useState<PaymentsFilter>({
    status: "All",
    method: "All",
    type: "All",
    amountRange: "All",
    dateRange: "All",
    userType: "All"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  // LOGIC LỌC - Use API data
  const filteredTransactions = payments.filter(t => {
    if (filter.status !== "All" && t.status !== filter.status) return false;
    if (filter.method !== "All" && t.method !== filter.method) return false;
    if (filter.type !== "All" && t.type !== filter.type) return false;
    if (filter.amountRange !== "All") {
      const amount = t.amount;
      if (filter.amountRange === "Low" && amount > 500000) return false;
      if (filter.amountRange === "Medium" && (amount <= 500000 || amount > 1500000)) return false;
      if (filter.amountRange === "High" && amount <= 1500000) return false;
    }
    if (filter.userType !== "All" && t.method !== filter.userType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${t.title} ${t.customer} ${t.freelancer} ${t.service} ${t.method}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Tính toán số liệu thống kê
  const totalRevenue = payments
    .filter(t => t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0) / 1000000;

  const totalFees = payments
    .filter(t => t.status === "Success")
    .reduce((sum, t) => sum + t.platformFee, 0) / 1000;

  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700 disabled:bg-gray-700' : 'bg-white disabled:bg-gray-100'} disabled:text-gray-400 transition-colors`}
      >
        Trang Trước
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors ${currentPage === index + 1 ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700 disabled:bg-gray-700' : 'bg-white disabled:bg-gray-100'} disabled:text-gray-400 transition-colors`}
      >
        Trang Sau
      </button>
    </div>
  );

  return (
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      {/* HERO / PAGE HEADER */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl p-6 shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold">Quản Lý Giao Dịch</h2>
              <p className="opacity-90 mt-1">Tổng quan doanh thu, phí và hoạt động thanh toán trên Pet Connect.</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="bg-white/10 px-3 py-2 rounded-lg">
                  <div className="text-sm opacity-90">Tổng doanh thu (tháng)</div>
                  <div className="text-2xl font-semibold">{totalRevenue.toFixed(1)}M ₫</div>
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-lg">
                  <div className="text-sm opacity-90">Phí nền tảng</div>
                  <div className="text-2xl font-semibold">{totalFees.toFixed(0)}K ₫</div>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <div className="text-sm opacity-90">Giao dịch hôm nay</div>
              <div className="text-2xl font-semibold">{payments.filter(t => t.date === new Date().toLocaleDateString('vi-VN')).length || 0}</div>
            </div>
          </div>
          {/* small sparkline / decorative svg */}
          <div className="mt-6 opacity-80">
            <svg viewBox="0 0 200 40" className="w-full h-10">
              <polyline fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" points="0,30 20,20 40,22 60,10 80,12 100,6 120,8 140,4 160,2 180,8 200,6" />
            </svg>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-2xl p-5 shadow-md flex flex-col gap-3 justify-between`}>
          <div>
            <h3 className="text-lg font-semibold">Tổng quan nhanh</h3>
            <p className="text-sm text-gray-500">Những con số chính và trạng thái hệ thống</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500">Thành công</div>
              <div className="font-semibold text-green-600">{payments.filter(t => t.status === 'Success').length}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500">Đang chờ</div>
              <div className="font-semibold text-amber-500">{payments.filter(t => t.status === 'Pending').length}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500">Thất bại</div>
              <div className="font-semibold text-red-500">{payments.filter(t => t.status === 'Failed').length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng Doanh Thu (Triệu)"
          value={`${totalRevenue.toFixed(1)}M ₫`}
          delta="+15% so với tháng trước"
          icon={<AiOutlineLineChart />}
        />
        <StatCard
          title="Tổng Phí Nền Tảng (Nghìn)"
          value={`${totalFees.toFixed(0)}K ₫`}
          delta="+20% so với tháng trước"
          icon={<AiOutlineDollarCircle />}
        />
        <StatCard
          title="Giao Dịch Đang Chờ"
          value={payments.filter(t => t.status === 'Pending').length}
          delta="Cần xác nhận"
          icon={<AiOutlineSwap />}
        />
        <StatCard
          title="Giao Dịch Thành Công"
          value={payments.filter(t => t.status === 'Success').length}
          delta="+5% so với tuần trước"
          icon={<AiOutlineDollarCircle />}
        />
      </div>

      {/* ACTIONS */}
      <div className="mb-6 flex items-center justify-end gap-2">
        <button 
          onClick={() => handleExportCsv()} 
          className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white'} px-4 py-2 border rounded-xl hover:bg-gray-50 flex items-center gap-2`}
        >
          <AiOutlineDownload /> Xuất CSV
        </button>
        <button 
          onClick={() => handleExportPdf()} 
          className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white'} px-4 py-2 border rounded-xl hover:bg-gray-50 flex items-center gap-2`}
        >
          <AiOutlineFilePdf /> Xuất PDF
        </button>
      </div>

      {/* FILTER */}
      <FiltersPanel
        fields={[
          { key: 'status', label: 'Trạng Thái', type: 'select', icon: <AiOutlineLineChart />, options: [{ value: 'Success', label: 'Thành Công' }, { value: 'Pending', label: 'Đang Chờ' }, { value: 'Failed', label: 'Thất Bại' }, { value: 'Cancelled', label: 'Đã Hủy' }] },
          { key: 'method', label: 'Phương Thức', type: 'select', icon: <AiOutlineDollarCircle />, options: [{ value: 'CreditCard', label: 'Credit Card' }, { value: 'BankTransfer', label: 'Chuyển Khoản' }, { value: 'Wallet', label: 'Ví Điện Tử' }, { value: 'VNPay', label: 'VNPay' }, { value: 'MoMo', label: 'MoMo' }] },
          { key: 'type', label: 'Loại Giao Dịch', type: 'select', icon: <AiOutlineSwap />, options: [{ value: 'Payment', label: 'Thanh Toán Dịch Vụ' }, { value: 'Refund', label: 'Hoàn Tiền/Rút Tiền' }, { value: 'Fee', label: 'Phí Nền Tảng' }] },
          { key: 'amountRange', label: 'Khoảng Tiền', type: 'select', icon: <AiOutlineDollarCircle />, options: [{ value: 'Low', label: 'Dưới 500K' }, { value: 'Medium', label: '500K - 1.5M' }, { value: 'High', label: 'Trên 1.5M' }] },
          { key: 'dateRange', label: 'Ngày Giao Dịch', type: 'select', icon: <AiOutlineCalendar />, options: [{ value: 'Today', label: 'Hôm nay' }, { value: 'This Week', label: 'Tuần này' }, { value: 'This Month', label: 'Tháng này' }] },
          { key: 'userType', label: 'Người Dùng', type: 'select', icon: <AiOutlineUser />, options: [{ value: 'Customer', label: 'Khách Hàng' }, { value: 'Freelancer', label: 'Freelancer' }] },
        ]}
        values={filter}
        onChange={(next: PaymentsFilter) => { setFilter(next); setCurrentPage(1); }}
        onReset={() => setFilter({ status: "All", method: "All", type: "All", amountRange: "All", dateRange: "All", userType: "All" })}
      />

      <h3 className="text-xl font-bold mb-4">Danh Sách Giao Dịch ({filteredTransactions.length})</h3>

      {/* DANH SÁCH TRANSACTION CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && currentTransactions.length > 0 ? (
          currentTransactions.map((t) => (
              <TransactionCard
              key={t.id}
              title={t.title}
              customer={t.customer}
              freelancer={t.freelancer}
              service={t.service}
              method={t.method}
              date={t.date}
                amount={t.amount}
                platformFee={t.platformFee}
              status={t.status}
              onView={() => navigate(`/admin/payments/${t.id}`)}
            />
          ))
        ) : loading ? (
          <div className="md:col-span-3 text-center py-10">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="md:col-span-3 text-center py-10 rounded-2xl shadow-md px-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'} rounded-2xl py-6`}>
              {error ? `Lỗi: ${error}` : "Không tìm thấy giao dịch nào phù hợp với bộ lọc."}
            </div>
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default PaymentsPage;
