import React, { useState, useCallback } from 'react';
import type { ReactNode, ChangeEvent } from 'react'; 
import Modal from '../../ui/Modal';

import { AiOutlineUser, AiOutlineEnvironment, AiOutlineStar } from 'react-icons/ai';

// --- INTERFACES ---

export interface FreelancerFormData {
  name: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
}

interface FreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FreelancerFormData) => void;
  services?: Array<{ id: string; name: string; price: number; }>;
  initialData?: Partial<FreelancerFormData>;
  title?: string;
  submitLabel?: string;
}

// --- FORM INPUT COMPONENT (MEMOIZED) ---

interface FormInputProps {
    label: string;
    name: keyof FreelancerFormData;
    type?: string;
    icon?: ReactNode;
    error?: string;
    formData: FreelancerFormData;
    // Kiểu dữ liệu WIDER: Bao gồm HTMLTextAreaElement để tương thích với FormInput (Fixes TS2322)
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSelectChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    children?: ReactNode;
    readOnly?: boolean;
  className?: string;
  [key: string]: unknown;
}
const FormInput = React.memo((props: FormInputProps) => {
  const {
    label,
    name,
    type = 'text',
    icon,
    error,
    formData,
    handleInputChange,
    handleSelectChange,
    children,
    ...rest
  } = props;

  const onChangeHandler = type === 'select' && handleSelectChange ? handleSelectChange : handleInputChange;
  const value = formData[name];

  // Build safe props by removing any externally provided value/onChange
  const safeRest = { ...rest } as Record<string, unknown>;
  delete safeRest.value;
  delete safeRest.onChange;
  const customClasses = String(safeRest.className ?? '');

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">{label}</label>
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`}>
            {icon}
          </div>
        )}

        {type === 'select' ? (
          <select
            {...safeRest}
            name={name}
            value={value}
            onChange={onChangeHandler as React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
            className={`w-full rounded-xl pl-9 pr-4 py-2 border appearance-none bg-white text-gray-900 ${customClasses}
              ${error ? 'border-red-500' : 'border-gray-200'} 
              hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 
              outline-none transition-colors cursor-pointer
              bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7.5l3 3 3-3" stroke="%23666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')] 
              bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat
            `}
          >
            {children}
          </select>
        ) : (
          <input
            {...safeRest}
            type={type}
            name={name}
            value={value}
            onChange={onChangeHandler as React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
            className={`w-full rounded-xl ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2 border text-gray-900 ${customClasses}
              ${error ? 'border-red-500' : 'border-gray-200'} 
              focus:ring-2 focus:ring-green-100 focus:border-green-500 
              outline-none transition-colors
            `}
          />
        )}

      </div>
      {error && <p className="mt-1 text-xs text-red-500 text-left">{error}</p>}
    </div>
  );
});

// --- FREELANCER MODAL COMPONENT ---

const initialData: FreelancerFormData = {
  name: '',
  email: '',
  password: '',
  phoneNumber: '',
  address: '',
};

const FreelancerModal = ({ isOpen, onClose, onSubmit, initialData: init, title, submitLabel }: FreelancerModalProps) => {
  const [formData, setFormData] = useState<FreelancerFormData>({ ...initialData, ...(init || {}) });
  const [errors, setErrors] = useState<Partial<Record<keyof FreelancerFormData, string>>>({});
  
  // Update form data when modal opens with initialData (edit mode)
  React.useEffect(() => {
    if (isOpen) {
      if (init) {
        setFormData({ ...initialData, ...init });
      } else {
        setFormData(initialData);
      }
      setErrors({});
    }
  }, [isOpen, init]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FreelancerFormData, string>> = {};

    if (!formData.name.trim()) { newErrors.name = 'Vui lòng nhập họ tên'; }
    if (!formData.email || !formData.email.trim()) { newErrors.email = 'Vui lòng nhập email'; } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Email không hợp lệ'; }
    
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) { newErrors.phoneNumber = 'Vui lòng nhập số điện thoại'; } 
    else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) { newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10 số)'; }

    if (!formData.address || !formData.address.trim()) { newErrors.address = 'Vui lòng nhập địa chỉ'; }

    // Password is required only in create mode (when !init)
    if (!init && (!formData.password || !formData.password.trim())) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, init]);

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
  }, [formData, validateForm, onSubmit, handleResetAndClose]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FreelancerFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title={title || "Thêm Freelancer Mới"}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          
          <FormInput
            label="Họ và Tên"
            name="name"
            placeholder="Nhập họ và tên"
            icon={<AiOutlineUser />}
            error={errors.name}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="email@example.com"
            icon={<AiOutlineUser />}
            error={errors.email}
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <FormInput
            label="Số điện thoại"
            name="phoneNumber"
            type="tel"
            placeholder="0123456789"
            icon={<AiOutlineUser />}
            error={errors.phoneNumber}
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <FormInput
            label="Địa chỉ"
            name="address"
            type="text"
            placeholder="Nhập địa chỉ"
            icon={<AiOutlineEnvironment />}
            error={errors.address}
            formData={formData}
            handleInputChange={handleInputChange}
          />

          {/* Password field - only required in create mode */}
          {!init && (
            <FormInput
              label="Mật khẩu"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              icon={<AiOutlineStar />}
              error={errors.password}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
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
            {submitLabel || 'Thêm Freelancer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FreelancerModal;
