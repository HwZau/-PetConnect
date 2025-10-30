import React, { useState, useCallback } from 'react';
import type { ReactNode, ChangeEvent } from 'react';
import Modal from '../../ui/Modal';
import { AiOutlineUser, AiOutlineDollar, AiOutlineCalendar, AiOutlineCreditCard, AiOutlineTransaction, AiOutlineFileText } from 'react-icons/ai'; 
import { FiUsers, FiHardDrive } from 'react-icons/fi'; 

// --- INTERFACES ---

interface PaymentFormData {
  title: string;
  customer: string;
  customerName: string;
  freelancer: string;
  freelancerName: string;
  service: string;
  serviceName: string;
  amount: number;
  method: string;
  type: string;
  date: string;
  note: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  customers: Array<{ id: string; name: string; }>;
  freelancers: Array<{ id: string; name: string; }>;
  services: Array<{ id: string; name: string; price: number; }>;
}

// --- FORM INPUT COMPONENT (TÁCH BIỆT VÀ DÙNG MEMO) ---

interface FormInputProps {
    label: string;
    name: keyof PaymentFormData;
    type?: string;
    icon?: ReactNode;
    error?: string;
    formData: PaymentFormData;
    // Union type cho handler chung
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    // Handler riêng cho select khi cần logic đặc biệt
    handleSelectChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    children?: ReactNode;
    readOnly?: boolean;
    className?: string;
    [key: string]: any;
}

const FormInput = React.memo(({ 
    label, 
    name, 
    type = 'text',
    icon,
    error,
    formData,
    handleInputChange,
    handleSelectChange,
    children,
    ...props 
}: FormInputProps) => {

  // Prevent parent-passed `value` or `onChange` from overriding controlled input
  const { value: _v, onChange: _oc, ...rest } = props;
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">{label}</label> 
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 ${type === 'textarea' ? 'top-4 translate-y-0' : 'top-1/2 -translate-y-1/2'} text-gray-400`}>
            {icon}
          </div>
        )}
        {type === 'select' ? (
          <select
            name={name}
            value={formData[name]}
            // Sử dụng 'as any' để tránh lỗi Type Mismatch, đảm bảo handler là đúng
            onChange={handleInputChange as any} 
            className={`w-full rounded-xl pl-9 pr-4 py-2 border appearance-none bg-white text-gray-900 ${props.className || ''}
              ${error ? 'border-red-500' : 'border-gray-200'} 
              hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 
              outline-none transition-colors cursor-pointer
              bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7.5l3 3 3-3" stroke="%23666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')] 
              bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat
            `}
            {...rest}
          >
            {children}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange as any} // SỬA LỖI: Dùng 'as any'
            className={`w-full rounded-xl ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2 border text-gray-900 ${props.className || ''}
              ${error ? 'border-red-500' : 'border-gray-200'} 
              focus:ring-2 focus:ring-green-100 focus:border-green-500 
              outline-none min-h-[100px] transition-colors
            `}
            {...rest}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange as any} // SỬA LỖI: Dùng 'as any'
            className={`w-full rounded-xl ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2 border text-gray-900 ${props.className || ''}
              ${error ? 'border-red-500' : 'border-gray-200'} 
              focus:ring-2 focus:ring-green-100 focus:border-green-500 
              outline-none transition-colors
            `}
            {...rest}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 text-left">{error}</p>}
    </div>
  );
}, (prevProps, nextProps) => {
  // Logic so sánh props tối ưu của React.memo
  return (
    prevProps.label === nextProps.label &&
    prevProps.type === nextProps.type &&
    prevProps.error === nextProps.error &&
    prevProps.formData[prevProps.name] === nextProps.formData[nextProps.name] &&
    prevProps.readOnly === nextProps.readOnly
  );
});


// --- PAYMENT MODAL COMPONENT ---

const initialData: PaymentFormData = {
  title: '',
  customer: '',
  customerName: '',
  freelancer: '',
  freelancerName: '',
  service: '',
  serviceName: '',
  amount: 0,
  method: '',
  type: '',
  date: '',
  note: '',
};

const PaymentModal = ({ isOpen, onClose, onSubmit, customers, freelancers, services }: PaymentModalProps) => {
  const [formData, setFormData] = useState<PaymentFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({});

  // Bọc tất cả hàm xử lý bằng useCallback để giữ hàm ổn định
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};
    if (!formData.title.trim()) { newErrors.title = 'Vui lòng nhập tiêu đề giao dịch'; }
    if (!formData.customer) { newErrors.customer = 'Vui lòng chọn khách hàng'; }
    if (formData.amount <= 0) { newErrors.amount = 'Vui lòng nhập số tiền hợp lệ'; }
    if (!formData.method) { newErrors.method = 'Vui lòng chọn phương thức thanh toán'; }
    if (!formData.type) { newErrors.type = 'Vui lòng chọn loại giao dịch'; }
    if (!formData.date) { newErrors.date = 'Vui lòng chọn ngày'; }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleResetAndClose = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleResetAndClose();
    }
  }, [formData, onSubmit, validateForm, handleResetAndClose]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
        let newValue: string | number = value;
        if (name === 'amount' && (e.target as HTMLInputElement).type === 'number') {
            const numValue = parseInt(value);
            newValue = isNaN(numValue) ? 0 : numValue;
        }
        return { ...prev, [name]: newValue };
    });

    if (errors[name as keyof PaymentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleCustomerChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({ 
      ...prev, 
      customer: customerId, 
      customerName: customer ? customer.name : ''
    }));
    if (errors.customer) { setErrors(prev => ({ ...prev, customer: undefined })); }
  }, [customers, errors.customer]);

  const handleFreelancerChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const freelancerId = e.target.value;
    const freelancer = freelancers.find(f => f.id === freelancerId);
    setFormData(prev => ({ 
      ...prev, 
      freelancer: freelancerId, 
      freelancerName: freelancer ? freelancer.name : ''
    }));
    if (errors.freelancer) { setErrors(prev => ({ ...prev, freelancer: undefined })); }
  }, [freelancers, errors.freelancer]);

  const handleServiceChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    const service = services.find(s => s.id === serviceId);

    setFormData(prev => ({ 
      ...prev, 
      service: serviceId, 
      serviceName: service ? service.name : '',
      amount: service ? service.price : 0
    }));

    setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        if (updatedErrors.service) delete updatedErrors.service;
        if (updatedErrors.amount) delete updatedErrors.amount;
        return updatedErrors;
    });
  }, [services]);

  // --- JSX RENDER ---
  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title="Tạo Giao Dịch Mới">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          
          {/* Cột trái: Chi tiết Giao dịch & Đối tác */}
          <div>
            <FormInput
              label="Tiêu đề giao dịch"
              name="title"
              placeholder="VD: Thanh toán dịch vụ Grooming"
              icon={<AiOutlineFileText />}
              error={errors.title}
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            <FormInput
              label="Khách hàng"
              name="customer"
              type="select"
              icon={<FiUsers />}
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
              label="Freelancer thực hiện"
              name="freelancer"
              type="select"
              icon={<AiOutlineUser />}
              error={errors.freelancer}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleFreelancerChange} // Dùng handler riêng
            >
              <option value="" className="text-gray-500">Chọn Freelancer (Không bắt buộc)</option>
              {freelancers.map(f => (
                <option key={f.id} value={f.id} className="text-gray-900">{f.name}</option> 
              ))}
            </FormInput>

            <FormInput
              label="Dịch vụ"
              name="service"
              type="select"
              icon={<FiHardDrive />}
              error={errors.service}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleServiceChange} // Dùng handler riêng
            >
              <option value="">Chọn dịch vụ (Tự động điền giá)</option>
              {services.map(s => (
                <option key={s.id} value={s.id} className="text-gray-900">{s.name} - {s.price.toLocaleString()}₫</option> 
              ))}
            </FormInput>
          </div>

          {/* Cột phải: Tài chính & Thời gian */}
          <div>
            
            <FormInput
              label="Số tiền (VNĐ)"
              name="amount"
              type="number"
              placeholder="VD: 500000"
              icon={<AiOutlineDollar />}
              error={errors.amount}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Phương thức thanh toán"
              name="method"
              type="select"
              icon={<AiOutlineCreditCard />}
              error={errors.method}
              formData={formData}
              handleInputChange={handleInputChange}
            >
              <option value="">Chọn phương thức</option>
              <option value="Credit Card" className="text-gray-900">Credit Card</option> 
              <option value="Bank Transfer" className="text-gray-900">Chuyển khoản</option> 
              <option value="Wallet" className="text-gray-900">Ví điện tử</option> 
              <option value="Cash" className="text-gray-900">Tiền mặt</option> 
            </FormInput>

            <FormInput
              label="Loại giao dịch"
              name="type"
              type="select"
              icon={<AiOutlineTransaction />}
              error={errors.type}
              formData={formData}
              handleInputChange={handleInputChange}
            >
              <option value="">Chọn loại giao dịch</option>
              <option value="Payment" className="text-gray-900">Thanh toán dịch vụ (Thu)</option>
              <option value="Refund" className="text-gray-900">Hoàn tiền/Rút tiền (Chi)</option> 
              <option value="Fee" className="text-gray-900">Phí nền tảng (Chi)</option> 
              <option value="Deposit" className="text-gray-900">Đặt cọc (Thu)</option> 
            </FormInput>

            <FormInput
              label="Ngày giao dịch"
              name="date"
              type="date"
              icon={<AiOutlineCalendar />}
              error={errors.date}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>

        {/* Ghi chú - Full width */}
        <div className="mt-2">
            <FormInput
                label="Ghi chú chi tiết"
                name="note"
                type="textarea"
                placeholder="Nhập ghi chú thêm nếu có..."
                icon={<AiOutlineFileText />}
                error={errors.note}
                formData={formData}
                handleInputChange={handleInputChange}
            />
        </div>

        {/* Thanh hành động */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition duration-150"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium shadow-md hover:bg-green-700 transition duration-150"
          >
            Tạo Giao Dịch
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;