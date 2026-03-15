import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../services/admin/adminService";
import FreelancerModal from "../../components/admin/modal/FreelancerModal";
import type { FreelancerFormData } from "../../components/admin/modal/FreelancerModal";
import { showSuccess, showError } from "../../utils/toastUtils";
import { useSettings } from "../../contexts/SettingsContext";
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHome } from "react-icons/fa";

interface Service {
  id: string;
  title: string;
  description?: string;
  type: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  freelancerId?: string;
}

interface Review {
  userName?: string;
  date?: string;
  rating?: number;
  comment?: string;
}

interface FreelancerDetail {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  avatarUrl?: string | null;
  services: Service[];
  reviewsReceived: Review[];
  subtitle?: string;
  status?: string;
  experience?: string;
  rating?: number;
  jobsCompleted?: number;
  region?: string;
  servicePrice?: string;
}

const FreelancerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useSettings();

  const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editInitial, setEditInitial] = useState<Partial<FreelancerFormData> | undefined>(undefined);

  const loadFreelancer = useCallback(async (forceId?: string) => {
    const uid = forceId || id;
    if (!uid) return;
    setLoading(true);
    try {
      const userResp = await adminService.getUserById(uid);
      if (userResp.success && userResp.data) {
        const data = userResp.data as any;
        setFreelancer({
          id: String(data.id || ""),
          name: String(data.name || ""),
          email: String(data.email || ""),
          phoneNumber: String(data.phoneNumber || data.phone || "N/A"),
          address: String(data.address || data.subtitle || "N/A"),
          role: String(data.role || "Freelancer"),
          avatarUrl: (data.avatar || data.avatarUrl) as string | null,
          services: (data.services || []) as Service[],
          reviewsReceived: (data.reviewsReceived || []) as Review[],
          subtitle: data.subtitle as string | undefined,
          status: data.status as string | undefined,
          experience: data.experience as string | undefined,
          rating: data.rating as number | undefined,
          jobsCompleted: data.jobsCompleted as number | undefined,
          region: data.region as string | undefined,
          servicePrice: data.servicePrice as string | undefined,
        });
        return;
      }

      const resp = await adminService.getFreelancerById(uid);
      if (resp.success && resp.data) {
        const data = resp.data as any;
        setFreelancer({
          id: String(data.id || ""),
          name: String(data.name || ""),
          email: String(data.email || ""),
          phoneNumber: String(data.phoneNumber || data.phone || "N/A"),
          address: String(data.address || "N/A"),
          role: String(data.role || "Freelancer"),
          avatarUrl: (data.avatar || data.avatarUrl) as string | null,
          services: (data.services || []) as Service[],
          reviewsReceived: (data.reviewsReceived || []) as Review[],
          subtitle: data.subtitle as string | undefined,
          status: data.status as string | undefined,
          experience: data.experience as string | undefined,
          rating: data.rating as number | undefined,
          jobsCompleted: data.jobsCompleted as number | undefined,
          region: data.region as string | undefined,
          servicePrice: data.servicePrice as string | undefined,
        });
      } else {
        showError(resp.message || "Không thể tải hồ sơ freelancer");
        setFreelancer(null);
      }
    } catch (err) {
      console.error(err);
      showError("Lỗi khi lấy dữ liệu freelancer");
      setFreelancer(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadFreelancer(); }, [id, loadFreelancer]);

  const openEdit = () => {
    if (!freelancer) return;
    setEditInitial({
      name: freelancer.name,
      email: freelancer.email,
      phoneNumber: freelancer.phoneNumber,
      address: freelancer.address,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (data: FreelancerFormData) => {
    if (!freelancer) return;
    try {
      const payload: Partial<Record<string, unknown>> = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        role: freelancer.role,
      };
      const res = await adminService.updateUser(freelancer.id, payload as any);
      if (res.success) {
        showSuccess('Cập nhật freelancer thành công');
        setIsEditOpen(false);
        await loadFreelancer(freelancer.id);
      } else {
        showError(res.error || res.message || 'Lỗi khi cập nhật');
      }
    } catch (err) {
      console.error(err);
      showError('Lỗi khi cập nhật freelancer');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Hồ sơ không tồn tại</h2>
        <p className="text-gray-500 mb-4">Hồ sơ freelancer đã bị xóa hoặc không tồn tại.</p>
        <button onClick={() => navigate('/admin/freelancers')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Quay lại Danh sách
        </button>
      </div>
    );
  }

  return (
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <img 
          src={freelancer.avatarUrl || 'https://i.pravatar.cc/150?u=' + freelancer.id} 
          alt={freelancer.name} 
          className="w-40 h-40 rounded-2xl object-cover shadow-lg" 
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{freelancer.name}</h1>
          <p className="text-gray-500 mb-4">{freelancer.subtitle || 'Freelancer'}</p>
          
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {freelancer.rating && (
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
                <FaStar /> {freelancer.rating.toFixed(1)} sao
              </span>
            )}
            {freelancer.status && (
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                freelancer.status === 'Active' ? 'bg-green-100 text-green-800' :
                freelancer.status === 'Busy' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {freelancer.status}
              </span>
            )}
            {freelancer.region && (
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <FaMapMarkerAlt /> {freelancer.region}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {freelancer.experience && <div>Kinh nghiệm: <strong>{freelancer.experience}</strong></div>}
            {freelancer.jobsCompleted && <div>Công việc hoàn thành: <strong>{freelancer.jobsCompleted}</strong></div>}
            {freelancer.servicePrice && <div>Giá dịch vụ: <strong>{freelancer.servicePrice}</strong></div>}
            <div>Vai trò: <strong>{freelancer.role}</strong></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Services & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services */}
          <div className={`p-6 rounded-2xl shadow-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-bold mb-4">Dịch vụ</h2>
            {freelancer.services && freelancer.services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {freelancer.services.map((service: Service, idx: number) => (
                  <div key={service.id || idx} className={`p-4 rounded-lg border-2 ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <p className="font-semibold">{service.title || 'Dịch vụ'}</p>
                    {service.description && <p className="text-sm text-gray-600 mt-1">{service.description}</p>}
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{service.type}</span>
                      <span className="font-bold text-green-600">${service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Chưa có dịch vụ nào</p>
            )}
          </div>

          {/* Reviews */}
          <div className={`p-6 rounded-2xl shadow-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-bold mb-4">Đánh giá nhận được</h2>
            {freelancer.reviewsReceived && freelancer.reviewsReceived.length > 0 ? (
              <div className="space-y-4">
                {freelancer.reviewsReceived.map((review: Review, idx: number) => (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 border-yellow-500 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{review.userName || 'Khách hàng'}</p>
                        <p className="text-sm text-gray-500">{review.date || 'N/A'}</p>
                      </div>
                      {review.rating ? (
                        <div className="flex gap-1">
                          {[...Array(5)].map((_: unknown, i: number) => (
                            <FaStar key={i} className={i < (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm">{review.comment || 'Không có nhận xét'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Chưa có đánh giá nào</p>
            )}
          </div>
        </div>

        {/* Right Panel - Contact Info */}
        <div className={`p-6 rounded-2xl shadow-md h-fit ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-xl font-bold mb-6">Thông tin liên hệ</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Email</p>
                <p className="font-semibold">{freelancer.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FaPhone className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Số điện thoại</p>
                <p className="font-semibold">{freelancer.phoneNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FaHome className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Địa chỉ</p>
                <p className="font-semibold">{freelancer.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-2">
            <button 
              onClick={() => navigate('/admin/freelancers')} 
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Quay lại
            </button>
            <button 
              onClick={openEdit} 
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      <FreelancerModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={editInitial}
        title="Chỉnh sửa Freelancer"
        submitLabel="Lưu thay đổi"
      />
    </div>
  );
};

export default FreelancerDetailPage;
