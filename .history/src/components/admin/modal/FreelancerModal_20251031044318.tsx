import React, { useState, useCallback } from 'react';
import type { ReactNode, ChangeEvent } from 'react'; 
import Modal from '../../ui/Modal';
import { useSettings } from '../../../contexts/SettingsContext';
import { AiOutlineUser, AiOutlineDollar, AiOutlineEnvironment, AiOutlineStar } from 'react-icons/ai';

// --- INTERFACES ---

export interface FreelancerFormData {
  name: string;
  subtitle: string;
  experience: string;
  serviceType: string;
  region: string;
  pricePerHour: string;
}

interface FreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FreelancerFormData) => void;
  services: Array<{ id: string; name: string; price: number; }>;
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
  subtitle: '',
  experience: '',
  serviceType: '',
  region: '',
  pricePerHour: '',
};

const FreelancerModal = ({ isOpen, onClose, onSubmit, services }: FreelancerModalProps) => {
  const [formData, setFormData] = useState<FreelancerFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FreelancerFormData, string>>>({});
  

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FreelancerFormData, string>> = {};

    if (!formData.name.trim()) { newErrors.name = 'Vui lòng nhập họ tên'; }
    if (!formData.subtitle.trim()) { newErrors.subtitle = 'Vui lòng nhập chuyên môn'; }
    if (!formData.experience) { newErrors.experience = 'Vui lòng chọn kinh nghiệm'; }
    if (!formData.serviceType) { newErrors.serviceType = 'Vui lòng chọn loại dịch vụ'; }
    if (!formData.region) { newErrors.region = 'Vui lòng chọn khu vực'; }

    const priceNum = Number(formData.pricePerHour);
    if (!formData.pricePerHour || isNaN(priceNum) || priceNum <= 0) {
      newErrors.pricePerHour = 'Vui lòng nhập giá hợp lệ';
    }

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
  }, [formData, validateForm, onSubmit, handleResetAndClose]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FreelancerFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleServiceTypeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    const service = services.find(s => s.id === serviceId);

    setFormData(prev => ({
      ...prev,
      serviceType: serviceId,
      pricePerHour: service ? service.price.toString() : ''
    }));

    setErrors(prevErrors => {
      const updated = { ...prevErrors };
      if (updated.serviceType) delete updated.serviceType;
      if (updated.pricePerHour) delete updated.pricePerHour;
      return updated;
    });
  }, [services]);

  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title="Thêm Freelancer Mới">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
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
              label="Chuyên môn"
              name="subtitle"
              placeholder="VD: Chuyên gia chăm sóc chó"
              icon={<AiOutlineStar />}
              error={errors.subtitle}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Kinh nghiệm"
              name="experience"
              type="select"
              icon={<AiOutlineStar />}
              error={errors.experience}
              formData={formData}
              handleInputChange={handleInputChange}
            >
              <option value="">Chọn kinh nghiệm</option>
              <option value="1">Dưới 1 năm</option>
              <option value="1-3">1-3 năm</option>
              <option value="3-5">3-5 năm</option>
              <option value="5+">Trên 5 năm</option>
            </FormInput>
          </div>

          <div>
            <FormInput
              label="Loại dịch vụ"
              name="serviceType"
              type="select"
              icon={<AiOutlineUser />}
              error={errors.serviceType}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleServiceTypeChange}
            >
              <option value="">Chọn loại dịch vụ (Tự động điền giá)</option>
              {services.map(s => (
                <option key={s.id} value={s.id} className="text-gray-900">
                  {s.name} - {s.price.toLocaleString()}₫/giờ
                </option>
              ))}
            </FormInput>

            <FormInput
              label={t('Khu vực','Region')}
              name="region"
              type="select"
              icon={<AiOutlineEnvironment />}
              error={errors.region}
              formData={formData}
              handleInputChange={handleInputChange}
            >
              <option value="">{t('Chọn khu vực','Select region')}</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP.HCM">TP.HCM</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </FormInput>

            <FormInput
              label={t('Giá dịch vụ (VNĐ/giờ)','Service Price (VND/hr)')}
              name="pricePerHour"
              type="number"
              placeholder={t('VD: 200000','e.g. 200000')}
              icon={<AiOutlineDollar />}
              error={errors.pricePerHour}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition duration-150"
          >
            {t('Hủy','Cancel')}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium shadow-md hover:bg-green-700 transition duration-150"
          >
            {t('Thêm Freelancer','Add Freelancer')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FreelancerModal;
