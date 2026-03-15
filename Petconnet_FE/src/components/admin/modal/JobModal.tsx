import React, { type ReactNode, useState, useCallback, type ChangeEvent } from 'react';
import Modal from '../../ui/Modal';
import { AiOutlineUser, AiOutlineEnvironment, AiOutlineCalendar, AiOutlineDollar } from 'react-icons/ai';
import { FaDog } from 'react-icons/fa';

// --- INTERFACES ---

export interface JobFormData {
  title: string;
  customer: string;
  pet: string;
  petType: string;
  serviceType: string;
  date: string;
  time: string;
  location: string;
  price: string;
  freelancer: string;
  note: string;
}

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
  customers: Array<{ id: string; name: string; }>; // List of customers
  freelancers: Array<{ id: string; name: string; }>; // List of freelancers
  services: Array<{ id: string; name: string; price: number; }>;
}

// --- FORM INPUT COMPONENT (TÁCH BIỆT VÀ DÙNG MEMO) ---

interface FormInputProps {
    label: string;
    name: keyof JobFormData;
    type?: string;
    icon?: ReactNode;
    error?: string;
    formData: JobFormData;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSelectChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    children?: ReactNode;
    readOnly?: boolean;
  className?: string;
  [key: string]: unknown;
}

// Simple FormInput component used by JobModal
const FormInput = ({
  label,
  name,
  type = 'text',
  icon,
  error,
  formData,
  handleInputChange,
  handleSelectChange,
  children,
  readOnly,
  className,
  ...props
}: FormInputProps) => {
  // Remove any externally passed value/onChange so our controlled value stays stable
  const rest = { ...props } as Record<string, unknown>;
  delete rest.value;
  delete rest.onChange;

  const commonClasses = `w-full rounded-xl ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2 border ${className || ''}`;

  const onChange = type === 'select' && handleSelectChange ? handleSelectChange : handleInputChange;
  const customClasses = String(rest.className ?? '');

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        )}
        {type === 'select' ? (
          <select
            {...rest}
            name={name}
            value={formData[name]}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
            className={`${commonClasses} ${customClasses} ${error ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-green-200 focus:border-green-500 appearance-none cursor-pointer`}
          >
            {children}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            {...rest}
            name={name}
            value={formData[name] as string}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
            className={`${commonClasses} ${customClasses} ${error ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-green-200 focus:border-green-500 min-h-[100px]`}
          />
        ) : (
          <input
            {...rest}
            type={type}
            name={name}
            value={formData[name]}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
            readOnly={readOnly}
            className={`${commonClasses} ${customClasses} ${error ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-green-200 focus:border-green-500`}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};


// --- JOB MODAL COMPONENT ---

const initialData: JobFormData = {
  title: '',
  customer: '',
  pet: '',
  petType: '',
  serviceType: '',
  date: '',
  time: '',
  location: '',
  price: '',
  freelancer: '',
  note: '',
};

const JobModal = ({ isOpen, onClose, onSubmit, customers, freelancers, services }: JobModalProps) => {
  const [formData, setFormData] = useState<JobFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  // Bọc hàm validate bằng useCallback
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) { newErrors.title = 'Vui lòng nhập tiêu đề công việc'; }
    if (!formData.customer) { newErrors.customer = 'Vui lòng chọn khách hàng'; }
    if (!formData.serviceType) { newErrors.serviceType = 'Vui lòng chọn loại dịch vụ'; }
    if (!formData.date) { newErrors.date = 'Vui lòng chọn ngày'; }
    if (!formData.time) { newErrors.time = 'Vui lòng chọn giờ'; }
    if (!formData.location.trim()) { newErrors.location = 'Vui lòng nhập địa chỉ'; }
    if (!formData.price.trim() || isNaN(Number(formData.price))) { newErrors.price = 'Vui lòng nhập giá hợp lệ'; }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Bọc hàm submit bằng useCallback
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData(initialData);
      setErrors({});
      onClose();
    }
  }, [formData, validateForm, onSubmit, onClose]);

  // Bọc hàm handler chung bằng useCallback
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof JobFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  // Handler riêng cho trường ServiceType (có logic điền giá)
  const handleServiceTypeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    const service = services.find(s => s.id === serviceId);

    // Cập nhật serviceType và price
    setFormData(prev => ({ 
        ...prev, 
        serviceType: serviceId, 
        price: service ? service.price.toString() : '' // Tự động điền giá
    }));

    // Clear lỗi liên quan
    setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        if (updatedErrors.serviceType) delete updatedErrors.serviceType;
        if (updatedErrors.price) delete updatedErrors.price;
        return updatedErrors;
    });
  }, [services]);

  const handleCustomerChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    setFormData(prev => ({ ...prev, customer: customerId }));
    if (errors.customer) { setErrors(prev => ({ ...prev, customer: undefined })); }
  }, [errors.customer]);
  
  const handleFreelancerChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const freelancerId = e.target.value;
    setFormData(prev => ({ ...prev, freelancer: freelancerId }));
    if (errors.freelancer) { setErrors(prev => ({ ...prev, freelancer: undefined })); }
  }, [errors.freelancer]);


  // --- JSX RENDER ---
  return (
    <Modal isOpen={isOpen} onClose={() => { setFormData(initialData); setErrors({}); onClose(); }} title="Tạo Công Việc Mới">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          
          {/* Cột trái */}
          <div>
            <FormInput
              label="Tiêu đề công việc"
              name="title"
              placeholder="VD: Chăm sóc Buddy - Dịch vụ Grooming"
              icon={<AiOutlineUser />}
              error={errors.title}
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            <FormInput
              label="Khách hàng"
              name="customer"
              type="select"
              icon={<AiOutlineUser />}
              error={errors.customer}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleCustomerChange} // Dùng handler riêng
            >
              <option value="" className="text-gray-500">Chọn khách hàng</option>
              {customers.map(c => (
                <option key={c.id} value={c.id} className="text-gray-900">{c.name}</option>
              ))}
            </FormInput>

            <FormInput
              label="Tên thú cưng"
              name="pet"
              placeholder="Nhập tên thú cưng"
              icon={<FaDog />}
              error={errors.pet}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Loại thú cưng"
              name="petType"
              type="select"
              icon={<FaDog />}
              error={errors.petType}
              formData={formData}
              handleInputChange={handleInputChange}
            >
              <option value="" className="text-gray-500">Chọn loại thú cưng</option>
              <option value="dog" className="text-gray-900">Chó</option>
              <option value="cat" className="text-gray-900">Mèo</option>
              <option value="other" className="text-gray-900">Khác</option>
            </FormInput>

            <FormInput
              label="Loại dịch vụ"
              name="serviceType"
              type="select"
              icon={<AiOutlineUser />}
              error={errors.serviceType}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleServiceTypeChange} // Dùng handler riêng
            >
              <option value="" className="text-gray-500">Chọn loại dịch vụ (Tự động điền giá)</option>
              {services.map(service => (
                <option key={service.id} value={service.id} className="text-gray-900">
                  {service.name} - {service.price.toLocaleString()}₫
                </option>
              ))}
            </FormInput>
          </div>

          {/* Cột phải */}
          <div>
            <FormInput
              label="Ngày"
              name="date"
              type="date"
              icon={<AiOutlineCalendar />}
              error={errors.date}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Giờ"
              name="time"
              type="time"
              icon={<AiOutlineCalendar />}
              error={errors.time}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Địa chỉ"
              name="location"
              placeholder="Nhập địa chỉ chi tiết"
              icon={<AiOutlineEnvironment />}
              error={errors.location}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Giá dịch vụ (VNĐ)"
              name="price"
              type="number"
              placeholder="VD: 500000"
              icon={<AiOutlineDollar />}
              error={errors.price}
              formData={formData}
              handleInputChange={handleInputChange}
              readOnly // Giữ readonly vì giá được tự động điền
              className="bg-gray-50 cursor-not-allowed" // Thêm class để báo hiệu readOnly
            />

            <FormInput
              label="Freelancer"
              name="freelancer"
              type="select"
              icon={<AiOutlineUser />}
              error={errors.freelancer}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleFreelancerChange}
            >
              <option value="" className="text-gray-500">Chọn Freelancer (không bắt buộc)</option>
              {freelancers.map(f => (
                <option key={f.id} value={f.id} className="text-gray-900">{f.name}</option>
              ))}
            </FormInput>
          </div>
        </div>

        {/* Ghi chú - Full width */}
        <div className="mt-2">
            <FormInput
                label="Ghi chú chi tiết"
                name="note"
                type="textarea"
                placeholder="Nhập ghi chú thêm nếu có..."
                icon={<AiOutlineCalendar />} // Dùng lại icon calendar cho note
                error={errors.note}
                formData={formData}
                handleInputChange={handleInputChange}
            />
        </div>

        {/* Thanh hành động */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => { setFormData(initialData); setErrors({}); onClose(); }} // Reset state khi hủy
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition duration-150"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium shadow-md hover:bg-green-700 transition duration-150"
          >
            Tạo Công Việc
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JobModal;