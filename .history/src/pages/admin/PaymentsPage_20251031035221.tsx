// file: PaymentsPage.tsx
import React, { useState } from "react";
// Loại bỏ AdminHeader và AdminSidebar theo các phiên bản làm việc trước
import StatCard from "../../components/admin/StatCard";
import TransactionCard from "../../components/admin/TransactionCard";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AiOutlineDollarCircle, AiOutlineLineChart, AiOutlineSwap, AiOutlineDownload, AiOutlineFilePdf, AiOutlineCalendar, AiOutlineUser } from "react-icons/ai";
import FiltersPanel from "../../components/admin/FiltersPanel";
import PaymentModal from "../../components/admin/modal/PaymentModal";
import type { PaymentFormData } from "../../components/admin/modal/PaymentModal";
import { useSearch } from "../../contexts/SearchContext";
import { useSettings } from "../../contexts/SettingsContext";

const ITEMS_PER_PAGE = 6;

// Định nghĩa kiểu dữ liệu chi tiết cho giao dịch
type UserType = "Customer" | "Freelancer";

interface Transaction {
  id: number;
  title: string;
  customer: string;
  freelancer: string;
  service: string;
  method: string;
  amount: string;
  platformFee: string;
  status: "Success" | "Pending" | "Failed"; // Kiểu chuỗi literal cho TransactionCard
  type: "Payment" | "Refund" | "Fee";
  date: string;
  userType: UserType;
  totalAmount: number;
}

const PaymentsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language, theme } = useSettings();
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en);

  const handleCreatePayment = (data: PaymentFormData) => {
    console.log('Creating payment:', data);
    // Create new transaction from form data
    const newTransaction: Transaction = {
      id: allTransactions.length + 1,
      title: `Thanh toán ${data.service} - ${data.customerName}`,
      customer: data.customerName,
      freelancer: data.freelancerName || 'N/A',
      service: data.service,
  method: data.method,
      amount: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(Number(data.amount))
        .replace('₫', '')
        .trim() + '₫',
      platformFee: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(Number(data.amount) * 0.05)
        .replace('₫', '')
        .trim() + '₫',
      status: 'Pending',
      type: 'Payment',
      date: new Date().toLocaleDateString('vi-VN'),
      userType: 'Customer',
      totalAmount: Number(data.amount)
    };

    // TODO: Send to API
    console.log('New transaction:', newTransaction);
    setIsModalOpen(false);
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

  // Mock data for the entire page
  const mockData = {
    customers: [
      { id: '1', name: 'Nguyễn Thị Lan Anh' },
      { id: '2', name: 'Trần Văn Minh' },
      { id: '3', name: 'Võ Thị Mai' },
      { id: '4', name: 'Phạm Văn Lợi' },
      { id: '5', name: 'Trịnh Quang Hùng' },
      { id: '6', name: 'Bùi Thị Yến' },
      { id: '7', name: 'Ngô Văn Phát' },
      { id: '8', name: 'Lê Văn Tám' }
    ],
    freelancers: [
      { id: '1', name: 'Nguyễn Văn A' },
      { id: '2', name: 'Trần Văn A' },
      { id: '3', name: 'Lê Thị B' }
    ],
    services: [
      { id: '1', name: 'Grooming', price: 1200000 },
      { id: '2', name: 'Sitting', price: 500000 },
      { id: '3', name: 'Training', price: 300000 },
      { id: '4', name: 'Medical', price: 750000 }
    ]
  };

  // Dữ liệu giả định đầy đủ chi tiết
  const allTransactions: Transaction[] = [
    { id: 1, title: "Thanh toán Dịch vụ Buddy", customer: "Nguyễn Thị Lan Anh", freelancer: "Nguyễn Văn A", service: "Grooming", method: "Credit Card", amount: "1,200,000₫", platformFee: "60,000₫", status: "Success", date: "10/10/2025", type: "Payment", userType: "Customer", totalAmount: 1200000 },
    { id: 2, title: "Hoàn tiền cho Mimi", customer: "Trần Văn Minh", freelancer: "Trần Văn A", service: "Sitting", method: "Bank Transfer", amount: "500,000₫", platformFee: "0₫", status: "Success", date: "09/10/2025", type: "Refund", userType: "Customer", totalAmount: 500000 },
    { id: 3, title: "Phí dịch vụ Rex (tháng 10)", customer: "Võ Thị Mai", freelancer: "Lê Thị B", service: "Training", method: "Wallet", amount: "80,000₫", platformFee: "80,000₫", status: "Pending", date: "11/10/2025", type: "Fee", userType: "Freelancer", totalAmount: 80000 },
    { id: 4, title: "Thanh toán Dịch vụ Kitty", customer: "Phạm Văn Lợi", freelancer: "Phạm Văn Lợi", service: "Sitting", method: "Credit Card", amount: "1,500,000₫", platformFee: "75,000₫", status: "Failed", date: "13/10/2025", type: "Payment", userType: "Customer", totalAmount: 1500000 },
    { id: 5, title: "Rút tiền hoa hồng (Freelancer A)", customer: "N/A", freelancer: "Nguyễn Văn A", service: "N/A", method: "Bank Transfer", amount: "4,000,000₫", platformFee: "5,000₫", status: "Success", date: "14/10/2025", type: "Refund", userType: "Freelancer", totalAmount: 4000000 },
    { id: 6, title: "Thanh toán Vệ sinh chuồng", customer: "Trịnh Quang Hùng", freelancer: "Lê Thị B", service: "Grooming", method: "Wallet", amount: "500,000₫", platformFee: "25,000₫", status: "Success", date: "05/10/2025", type: "Payment", userType: "Customer", totalAmount: 500000 },
    { id: 7, title: "Phí dịch vụ Gấu (tháng 10)", customer: "Bùi Thị Yến", freelancer: "Lê Thị B", service: "Grooming", method: "Wallet", amount: "55,000₫", platformFee: "55,000₫", status: "Pending", date: "15/10/2025", type: "Fee", userType: "Freelancer", totalAmount: 55000 },
    { id: 8, title: "Thanh toán Huấn luyện", customer: "Ngô Văn Phát", freelancer: "Nguyễn Văn A", service: "Training", method: "Credit Card", amount: "300,000₫", platformFee: "15,000₫", status: "Success", date: "16/10/2025", type: "Payment", userType: "Customer", totalAmount: 300000 },
    { id: 9, title: "Thanh toán cho dịch vụ Khác", customer: "Lê Văn Tám", freelancer: "Trần Văn A", service: "Medical", method: "Bank Transfer", amount: "750,000₫", platformFee: "37,500₫", status: "Success", date: "17/10/2025", type: "Payment", userType: "Customer", totalAmount: 750000 },
    { id: 10, title: "Rút tiền hoa hồng (Freelancer B)", customer: "N/A", freelancer: "Lê Thị B", service: "N/A", method: "Bank Transfer", amount: "1,500,000₫", platformFee: "5,000₫", status: "Success", date: "18/10/2025", type: "Refund", userType: "Freelancer", totalAmount: 1500000 },
    ];

  // LOGIC LỌC
  const filteredTransactions = allTransactions.filter(t => {
    if (filter.status !== "All" && t.status !== filter.status as Transaction['status']) return false;
    if (filter.method !== "All" && t.method !== filter.method) return false;
    if (filter.type !== "All" && t.type !== filter.type as Transaction['type']) return false;
    if (filter.amountRange !== "All") {
      const amount = t.totalAmount;
      if (filter.amountRange === "Low" && amount > 500000) return false;
      if (filter.amountRange === "Medium" && (amount <= 500000 || amount > 1500000)) return false;
      if (filter.amountRange === "High" && amount <= 1500000) return false;
    }
    if (filter.userType !== "All" && t.userType !== filter.userType as Transaction['userType']) return false;
    // Search query filter (title, customer, freelancer, service) from header search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${t.title} ${t.customer} ${t.freelancer} ${t.service} ${t.method}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // LOGIC PHÂN TRANG (6 mục/trang)
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Tính toán số liệu thống kê (Đã sửa lỗi parseInt)
  const totalRevenue = allTransactions
    .filter(t => t.status === "Success" && t.type === "Payment")
    .reduce((sum, t) => sum + t.totalAmount, 0) / 1000000;

  const totalFees = allTransactions
    .filter(t => t.status === "Success" && t.platformFee !== "0₫")
    .map(t => {
      const cleanedFee = t.platformFee.replace(/[.,₫]/g, '');
      return parseInt(cleanedFee) || 0;
    })
    .reduce((sum, fee) => sum + fee, 0) / 1000;

  // UI Phân trang (Giữ nguyên)
  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-xl bg-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        Trang Trước
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors ${currentPage === index + 1 ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-xl bg-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        Trang Sau
      </button>
    </div>
  );

  // Export CSV helper
  const exportCsv = (rows: Transaction[]) => {
    if (!rows || rows.length === 0) return;
    const headers = ["id","title","customer","freelancer","service","method","amount","platformFee","status","type","date","userType","totalAmount"];
    // Prepend UTF-8 BOM so Excel/other apps detect UTF-8 and show Vietnamese characters properly
    const csv = ['\uFEFF' + headers.join(',')]
      .concat(rows.map(r => headers.map(h => {
        const rowRecord = r as unknown as Record<string, unknown>;
        const v = rowRecord[h];
        if (v === null || v === undefined) return '""';
        // escape quotes
        const s = String(v).replace(/"/g, '""');
        return `"${s}"`;
      }).join(',')))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    a.download = `payments-${now.toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportPdf = async (rows: Transaction[]) => {
    if (!rows || rows.length === 0) return;

    // Ensure the Google Noto Sans font is available for correct Vietnamese rendering
    if (!document.getElementById('noto-font')) {
      const link = document.createElement('link');
      link.id = 'noto-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap';
      document.head.appendChild(link);
      try {
        // wait for font to load (best-effort)
        const fonts = (document as unknown as { fonts?: { load: (spec: string) => Promise<unknown> } }).fonts;
        await fonts?.load('16px "Noto Sans"');
      } catch (fontErr) {
        // ignore font load failure; browser will fallback (log debug)
        console.debug('Noto Sans font load failed', fontErr);
      }
    }

    // Build an offscreen HTML table with the rows so the browser (which supports the webfont) renders Vietnamese correctly
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '1000px';
    container.style.padding = '20px';
    container.style.background = '#ffffff';
    container.style.fontFamily = "'Noto Sans', sans-serif";

    const headerHtml = `<h2 style="font-size:18px;margin:0 0 12px 0">Báo cáo Thanh toán</h2>`;
    const tableStyle = 'border-collapse:collapse;width:100%';
    const thStyle = 'border:1px solid #ddd;padding:6px 8px;background:#f7f7f7;text-align:left;font-size:12px';
    const tdStyle = 'border:1px solid #ddd;padding:6px 8px;font-size:12px';

    const headers = ['ID','Khách hàng','Dịch vụ','Số tiền','Trạng thái','Ngày'];

    let html = `${headerHtml}<table style="${tableStyle}"><thead><tr>`;
    headers.forEach(h => { html += `<th style="${thStyle}">${h}</th>`; });
    html += `</tr></thead><tbody>`;
    rows.forEach(r => {
      html += '<tr>';
      html += `<td style="${tdStyle}">${r.id}</td>`;
      html += `<td style="${tdStyle}">${r.customer}</td>`;
      html += `<td style="${tdStyle}">${r.service}</td>`;
      html += `<td style="${tdStyle}">${r.amount}</td>`;
      html += `<td style="${tdStyle}">${r.status}</td>`;
      html += `<td style="${tdStyle}">${r.date}</td>`;
      html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const typedPdf = pdf as unknown as { getImageProperties: (dataUrl: string) => { width: number; height: number } };
      const imgProps = typedPdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`payments_${Date.now()}.pdf`);
    } catch (err) {
      // fallback: still try simple text PDF (may not render Vietnamese correctly)
  console.error(err);
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      doc.text('Báo cáo Thanh toán (Không thể render HTML)', 40, 40);
      doc.save(`payments_${Date.now()}.pdf`);
    } finally {
      document.body.removeChild(container);
    }
  };


  return (
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      {/* HERO / PAGE HEADER */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl p-6 shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold">{t('Quản Lý Giao Dịch', 'Payments Management')}</h2>
              <p className="opacity-90 mt-1">{t('Tổng quan doanh thu, phí và hoạt động thanh toán trên PawNest.', 'Overview of revenue, fees and payment activity on PawNest.')}</p>
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
              <div className="text-2xl font-semibold">{allTransactions.filter(t => t.date === new Date().toLocaleDateString('vi-VN')).length || 0}</div>
              <div className="mt-4 flex items-center gap-2">
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="px-3 py-2 bg-white text-green-600 rounded-lg font-medium hover:scale-105 transition-transform"
                >
                  {t('+ Tạo Giao Dịch Mới', '+ Create Transaction')}
                </button>
              </div>

              <PaymentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePayment}
                customers={Array.from(new Set(
                  allTransactions
                    .filter(t => t.customer !== 'N/A')
                    .map(t => ({ id: t.id.toString(), name: t.customer }))
                ))}
                freelancers={Array.from(new Set(
                  allTransactions
                    .filter(t => t.freelancer !== 'N/A')
                    .map(t => ({ id: t.id.toString(), name: t.freelancer }))
                ))}
                services={mockData.services}
              />
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
            <h3 className="text-lg font-semibold">{t('Tổng quan nhanh', 'Quick Overview')}</h3>
            <p className="text-sm text-gray-500">{t('Những con số chính và trạng thái hệ thống', 'Key numbers and system status')}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500">Thành công</div>
              <div className="font-semibold text-green-600">{allTransactions.filter(t => t.status === 'Success').length}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500">Đang chờ</div>
              <div className="font-semibold text-amber-500">{allTransactions.filter(t => t.status === 'Pending').length}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500">Thất bại</div>
              <div className="font-semibold text-red-500">{allTransactions.filter(t => t.status === 'Failed').length}</div>
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
          value={allTransactions.filter(t => t.status === 'Pending').length}
          delta="Cần xác nhận"
          icon={<AiOutlineSwap />}
        />
        <StatCard
          title="Giao Dịch Thành Công"
          value={allTransactions.filter(t => t.status === 'Success').length}
          delta="+5% so với tuần trước"
          icon={<AiOutlineDollarCircle />}
        />
      </div>

      {/* ACTIONS */}
      <div className="mb-6 flex items-center justify-end gap-2">
        <button onClick={() => exportCsv(filteredTransactions)} className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white'} px-4 py-2 border rounded-xl hover:bg-gray-50 flex items-center gap-2`}><AiOutlineDownload /> {t('Xuất CSV','Export CSV')}</button>
        <button onClick={() => exportPdf(filteredTransactions)} className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white'} px-4 py-2 border rounded-xl hover:bg-gray-50 flex items-center gap-2`}><AiOutlineFilePdf /> {t('Xuất PDF','Export PDF')}</button>
      </div>
{/* FILTER */}
      <FiltersPanel
        fields={[
          { key: 'status', label: 'Trạng Thái', type: 'select', icon: <AiOutlineLineChart />, options: [{ value: 'Success', label: 'Thành Công' }, { value: 'Pending', label: 'Đang Chờ' }, { value: 'Failed', label: 'Thất Bại' }] },
          { key: 'method', label: 'Phương Thức', type: 'select', icon: <AiOutlineDollarCircle />, options: [{ value: 'Credit Card', label: 'Credit Card' }, { value: 'Bank Transfer', label: 'Chuyển Khoản' }, { value: 'Wallet', label: 'Ví Điện Tử' }] },
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

      {/* DANH SÁCH TRANSACTION CARD (ĐÃ SỬA: Truyền đủ các props chi tiết) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTransactions.length > 0 ? (
          currentTransactions.map((t) => (
            <TransactionCard
              key={t.id}
              title={t.title}
              customer={t.customer} // Khách hàng
              freelancer={t.freelancer} // Props mới
              service={t.service} // Props mới
              method={t.method} // Props mới
              date={t.date} // Thời gian
              amount={t.amount} // Tổng tiền giao dịch
              platformFee={t.platformFee} // Props mới
              status={t.status} // Props đã được Type Check chính xác
            />
          ))
        ) : (
          <div className="md:col-span-3 text-center py-10 bg-white rounded-2xl text-gray-500 shadow-md">
            Không tìm thấy giao dịch nào phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default PaymentsPage;