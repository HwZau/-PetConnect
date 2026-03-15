// file: DashboardPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom"; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { ChartEvent, LegendItem, TooltipItem, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AiOutlineDollar, AiOutlineUser, AiOutlineFileText, AiOutlineProfile } from "react-icons/ai";
import StatCard from "../../components/admin/StatCard";
import JobCardDashboard from "../../components/admin/JobCardDashboard";
import { useSettings } from "../../contexts/SettingsContext";
import { useAdminDashboard } from "../../hooks";
import { useEffect } from "react";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Historical data for different periods
const historicalData = {
  3: {
    months: ['Tháng 8', 'Tháng 9', 'Tháng 10'],
    revenue: [41, 45, 48.3],
    freelancers: [225, 235, 247],
    customers: [1600, 1720, 1834]
  },
  6: {
    months: ['Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10'],
    revenue: [38, 42, 35, 41, 45, 48.3],
    freelancers: [180, 195, 210, 225, 235, 247],
    customers: [1200, 1350, 1450, 1600, 1720, 1834]
  },
  12: {
    months: ['T11/24', 'T12', 'T1/25', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'],
    revenue: [25, 28, 30, 32, 35, 36, 38, 42, 35, 41, 45, 48.3],
    freelancers: [120, 135, 150, 160, 170, 175, 180, 195, 210, 225, 235, 247],
    customers: [800, 900, 950, 1000, 1100, 1150, 1200, 1350, 1450, 1600, 1720, 1834]
  }
};

// Growth Chart Component
const GrowthChart: React.FC = () => {
  const [period, setPeriod] = React.useState(6);
  const [visibleDatasets, setVisibleDatasets] = React.useState({
    revenue: true,
    freelancers: true,
    customers: true
  });

  // Get data for current period
  const currentData = historicalData[period as keyof typeof historicalData];
  
  const data = {
    labels: currentData.months,
    datasets: [
      {
        label: 'Doanh Thu (Triệu VNĐ)',
        data: currentData.revenue,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
        hidden: !visibleDatasets.revenue,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Số Freelancers',
        data: currentData.freelancers,
        borderColor: '#6366F1',
        backgroundColor: '#6366F1',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1',
        hidden: !visibleDatasets.freelancers,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Khách Hàng Hoạt Động',
        data: currentData.customers,
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1',
        hidden: !visibleDatasets.customers,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    maintainAspectRatio: false,
    animation: {
      duration: 750
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Doanh Thu (Triệu VNĐ)',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value: number) => value + 'M'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Số lượng',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        // Typed legend click handler
        onClick: (_evt: ChartEvent, legendItem: LegendItem) => {
          const index = legendItem.datasetIndex ?? -1;
          const type = index === 0 ? 'revenue' : index === 1 ? 'freelancers' : 'customers';
          setVisibleDatasets(prev => ({
            ...prev,
            [type]: !prev[type as keyof typeof visibleDatasets]
          }));
        },
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            const y = context.parsed?.y ?? context.parsed ?? 0;
            if (context.datasetIndex === 0) {
              label += String(y) + 'M VNĐ';
            } else {
              // y may be number
              label += Number(y).toLocaleString();
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="h-full relative">
      <div className="absolute right-0 top-0 z-10">
        <select 
          className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-100 bg-white"
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
        >
          <option value={3}>3 tháng gần đây</option>
          <option value={6}>6 tháng gần đây</option>
          <option value={12}>12 tháng gần đây</option>
        </select>
      </div>
      <div className="h-full pt-10">
  <Line data={data} options={options as ChartOptions<'line'>} />
      </div>
    </div>
  );
};
import TransactionCard from "../../components/admin/TransactionCard"; // Giữ nguyên

const DashboardPage: React.FC = () => {
  const navigate = useNavigate(); 
  const { theme } = useSettings();
  const { stats, recentBookings, recentTransactions, fetchDashboardData } = useAdminDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  // Map incoming (possibly-English) job status values to the Vietnamese literals
  // that `JobCardDashboard` now expects.
  type JobStatusVi = "Đang Chờ" | "Đã Hoàn Thành" | "Đang Xử Lý" | "Đã Giao" | "Đã Hủy";
  const toJobStatus = (s: unknown): JobStatusVi => {
    const ss = String(s);
    switch (ss) {
      case "Completed":
        return "Đã Hoàn Thành";
      case "In Progress":
        return "Đang Xử Lý";
      case "Assigned":
        return "Đã Giao";
      case "Cancelled":
        return "Đã Hủy";
      case "Pending":
      default:
        return "Đang Chờ";
    }
  };

  type TransactionStatus = "Success" | "Pending" | "Failed";
  const toTransactionStatus = (s: unknown): TransactionStatus => {
    const allowed = ["Success", "Pending", "Failed"] as const;
    const ss = String(s);
    return (allowed as readonly string[]).includes(ss) ? (ss as TransactionStatus) : "Pending";
  };
    
  const handleViewAllJobs = () => {
    navigate("/admin/jobs"); // Chuyển hướng đến trang JobsPage
  };

    // recentBookings provided by useAdminDashboard (fetched on mount)
    const recentJobs = (recentBookings || []).map((b) => ({
      id: b.bookingId || b.id || Math.random(),
      title: `${b.pets?.[0]?.petName ?? 'Pet'} - ${b.customerName ?? ''}`,
      client: b.customerName ?? '',
      status: b.status ?? 'Pending',
      date: b.bookingDate ? String(b.bookingDate) : '',
      price: b.totalPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalPrice) : '',
    }));

    // recentTransactions provided by useAdminDashboard
    const recentTx = (recentTransactions || []).map((t) => ({
      id: (t.paymentId || t.transactionId || (t as any).id) ? String((t.paymentId || t.transactionId || (t as any).id)) : String(Math.random()),
      title: t.title || 'Thanh toán',
      customer: (t as any).customerName || (t as any).customer || '',
      amount: t.amount != null ? String(t.amount) : '',
      status: t.status || 'Pending',
      date: (t as any).createdAt || (t as any).date || '',
      freelancer: (t as any).freelancerName || (t as any).freelancer || '',
      service: t.service || '',
      method: t.method || '',
      platformFee: typeof t.platformFee === 'number' ? String(t.platformFee) : '',
    }));

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex-1">
        <main className="p-6 ">
          <h2 className="text-3xl font-bold mb-2">Tổng Quan Dashboard</h2>
          <p className="mb-6 text-gray-500">Chào mừng trở lại! Dưới đây là hoạt động hôm nay của thị trường thú cưng.</p>

          {/* STAT CARDS (Giữ nguyên) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Tổng Freelancers" value={String(stats.totalFreelancers ?? 0)} delta={`${stats.growthRate ? (stats.growthRate > 0 ? '+' : '') + stats.growthRate + '% so với tháng trước' : ''}`} icon={<AiOutlineUser />} />
            <StatCard title="Khách Hàng Hoạt Động" value={String(stats.totalCustomers ?? 0)} delta="" icon={<AiOutlineFileText />} />
            <StatCard title="Công Việc Đang Thực Hiện" value={String(stats.activeJobs ?? 0)} delta="" icon={<AiOutlineProfile />} />
            <StatCard title="Tổng Doanh Thu" value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue ?? 0)} delta="" icon={<AiOutlineDollar />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUMN 1: Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-xl">
              <h3 className="font-bold text-xl mb-3">Tăng Trưởng Doanh Thu & Hoạt Động</h3>
              <div className="h-[400px] overflow-hidden">
                <div className="h-full w-full">
                  <GrowthChart />
                </div>
              </div>
            </div>

            {/* COLUMN 2: Recent Job Requests - ĐÃ CẬP NHẬT SỬ DỤNG CARD ĐƠN GIẢN */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}  rounded-2xl p-5 shadow-xl`}>
        <div className="flex justify-between items-center mb-4 pb-2 ">
          <h3 className="font-bold text-xl">Yêu Cầu Công Việc Gần Đây</h3>
                    {/* NÚT XEM TẤT CẢ */}
                    <button 
                        onClick={handleViewAllJobs} 
                        className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
            Xem Tất Cả &rarr;
                    </button>
                </div>
              <div className="space-y-4">
                {recentJobs.map((j) => (
                  <JobCardDashboard
                    key={j.id}
                    title={j.title}
                    client={j.client}
                    status={toJobStatus(j.status)}
                    date={j.date}
                    price={j.price}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RECENT TRANSACTIONS (Giữ nguyên) */}
          <h3 className="font-bold text-xl mt-8 mb-4">Giao Dịch Gần Đây</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTx.map((t) => (
              <TransactionCard
                key={t.id}
                title={t.title}
                customer={t.customer}
                amount={t.amount}
                status={toTransactionStatus(t.status)}
                date={t.date}
                freelancer={t.freelancer}
                service={t.service}
                method={t.method}
                platformFee={t.platformFee}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;