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
  // Narrow status values with runtime guards so we avoid unchecked casts.
  type JobStatus = "Pending" | "Completed" | "In Progress" | "Assigned" | "Cancelled";
  const toJobStatus = (s: unknown): JobStatus => {
    const allowed = ["Pending", "Completed", "In Progress", "Assigned", "Cancelled"] as const;
    const ss = String(s);
    return (allowed as readonly string[]).includes(ss) ? (ss as JobStatus) : "Pending";
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

    // Dữ liệu mock cho Recent Job Requests (Đã chuyển sang cấu trúc đơn giản)
    const recentJobs = [
        { 
            id: 1, 
            title: "Chăm Sóc Tai Nhỏ - Buddy", 
            client: "Nguyễn Thị Lan Anh", 
            status: "Pending", 
            date: "2 giờ trước", 
            price: "300,000₫" 
        },
        { 
            id: 2, 
            title: "Tắm Rửa & Cắt Tỉa - Mimi", 
            client: "Trần Văn Minh", 
            status: "Completed", 
            date: "1 ngày trước", 
            price: "450,000₫" 
        },
        { 
            id: 3, 
            title: "Huấn Luyện Cơ Bản - Kiki", 
            client: "Lê Văn Hải", 
            status: "In Progress", 
            date: "11/10/2025", 
            price: "800,000₫" 
        },
    ];

    // Dữ liệu mock cho Transaction Card (Giữ nguyên)
    const recentTransactions = [
        { id: 1, title: "Thanh toán Dịch vụ", customer: "Nguyễn Thị Lan", amount: "$120", status: "Success", date: "12/01/2025", freelancer: "Trần Văn B", service: "Cắt Tỉa", method: "Thẻ", platformFee: "$12" },
        { id: 2, title: "Yêu cầu rút tiền", customer: "Trần Văn Minh", amount: "$45", status: "Pending", date: "12/02/2025", freelancer: "Trần Văn Minh", service: "Rút tiền", method: "Chuyển khoản", platformFee: "$0" },
        { id: 3, title: "Thanh toán Dịch vụ", customer: "Võ Thị Mai", amount: "$200", status: "Failed", date: "12/03/2025", freelancer: "Lê Thị C", service: "Giữ Hộ", method: "Ví Điện Tử", platformFee: "$20" },
    ];

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex-1">
        <main className="p-6 ">
          <h2 className="text-3xl font-bold mb-2">Tổng Quan Dashboard</h2>
          <p className="mb-6 text-gray-500">Chào mừng trở lại! Dưới đây là hoạt động hôm nay của thị trường thú cưng.</p>

          {/* STAT CARDS (Giữ nguyên) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Tổng Freelancers" value="247" delta="+12% so với tháng trước" icon={<AiOutlineUser />} />
            <StatCard title="Khách Hàng Hoạt Động" value="1,834" delta="+8% so với tháng trước" icon={<AiOutlineFileText />} />
            <StatCard title="Công Việc Đang Thực Hiện" value="89" delta="-3% so với tuần trước" icon={<AiOutlineProfile />} />
            <StatCard title="Tổng Doanh Thu" value="$48,392" delta="+22% so với tháng trước" icon={<AiOutlineDollar />} />
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
          <h3 className="font-bold text-xl">{t('Yêu Cầu Công Việc Gần Đây','Recent Job Requests')}</h3>
                    {/* NÚT XEM TẤT CẢ */}
                    <button 
                        onClick={handleViewAllJobs} 
                        className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
            {t('Xem Tất Cả','View All')} &rarr;
                    </button>
                </div>
              <div className="space-y-4">
                {recentJobs.map((j) => (
                    // Sử dụng JobCardDashboard với props đơn giản
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
            {recentTransactions.map((t) => (
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