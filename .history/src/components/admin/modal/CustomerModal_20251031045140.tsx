import React, { useState, useCallback } from 'react';
// Sửa lỗi TS: Thêm 'type' cho các import chỉ là kiểu dữ liệu
import type { ReactNode, ChangeEvent, FormEvent } from 'react'; 
import Modal from '../../ui/Modal';
import { useSettings } from '../../../contexts/SettingsContext';
import { AiOutlineUser, AiOutlineEnvironment, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { FaDog } from 'react-icons/fa';

// --- INTERFACES ---

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  region: string;
  petName: string;
  petType: string;
  petBreed: string;
  petAge: string;
  petGender: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  petTypes: Array<{ id: string; name: string; }>;
  petBreeds: Array<{ id: string; name: string; petTypeId: string; }>;
}

// --- FORM INPUT COMPONENT (TÁCH BIỆT VÀ DÙNG MEMO) ---

// FIX: Mở rộng type để bao gồm HTMLTextAreaElement (giải quyết lỗi TS2322)
type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface FormInputProps {
    label: string;
    name: keyof CustomerFormData;
    type?: string;
    icon?: ReactNode;
    error?: string;
    formData: CustomerFormData;
    handleInputChange: (e: ChangeEvent<InputElement>) => void; // Sử dụng type đã mở rộng
    // Dùng cho logic phức tạp (ví dụ: thay đổi PetType)
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void; 
  children?: ReactNode;
  disabled?: boolean;
  [key: string]: unknown;
}

const FormInput = React.memo(({
  label,
  name,
  type = 'text',
  icon,
  error,
  formData,
  handleInputChange,
  children,
  onChange, // Prop onChange riêng
  ...props
}: FormInputProps) => {

  const isSelect = type === 'select';
  const value = formData[name];
    
  // Chọn handler: Nếu là select và có handler riêng, dùng handler riêng. Nếu không, dùng handler chung.
  const finalHandler = isSelect && onChange ? onChange : handleInputChange;

  // Build safeProps by removing any externally provided value/onChange
  const safeProps = { ...props } as Record<string, unknown>;
  delete safeProps.value;
  delete safeProps.onChange;
  const customClasses = String(safeProps.className ?? '');

  return (
    <div className="mb-4">
      {/* Tối ưu UI: Căn trái label, màu chữ đậm */}
      <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {isSelect ? (
          <select
            {...safeProps}
            name={name}
            value={value}
            onChange={finalHandler as React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
            disabled={props.disabled}
            // Tối ưu UI: Màu chữ đen, custom arrow, focus xanh lá
            className={`w-full rounded-xl ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2 border appearance-none bg-white text-gray-900 ${customClasses}
              ${error ? 'border-red-500' : 'border-gray-200'} 
              ${props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-colors cursor-pointer'}
              bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7.5l3 3 3-3" stroke="%23666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')] 
              bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat
            `}
          >
            {children}
          </select>
        ) : (
          <input
            {...safeProps}
            type={type}
            name={name}
            value={value}
            onChange={finalHandler as React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
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
}, (prevProps, nextProps) => {
    // Tối ưu hóa render
    return (
        prevProps.label === nextProps.label &&
        prevProps.type === nextProps.type &&
        prevProps.error === nextProps.error &&
        prevProps.formData[prevProps.name] === nextProps.formData[nextProps.name] &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.onChange === nextProps.onChange
    );
});


// --- CUSTOMER MODAL COMPONENT ---

const initialData: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  region: '',
  petName: '',
  petType: '',
  petBreed: '',
  petAge: '',
  petGender: '',
};

const CustomerModal = ({ isOpen, onClose, onSubmit, petTypes, petBreeds }: CustomerModalProps) => {
  const [formData, setFormData] = useState<CustomerFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  

  // Bọc hàm validate bằng useCallback
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};

    if (!formData.name.trim()) { newErrors.name = 'Vui lòng nhập họ tên'; }
    if (!formData.email.trim()) { newErrors.email = 'Vui lòng nhập email'; } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Email không hợp lệ'; }
    
    if (!formData.phone.trim()) { newErrors.phone = 'Vui lòng nhập số điện thoại'; } 
    // Giữ regex kiểm tra 10 số như yêu cầu ban đầu
    else if (!/^[0-9]{10}$/.test(formData.phone)) { newErrors.phone = 'Số điện thoại không hợp lệ (10 số)'; }

    if (!formData.region) { newErrors.region = 'Vui lòng chọn khu vực'; }
    if (formData.petName && !formData.petType) { newErrors.petType = 'Vui lòng chọn loại thú cưng'; }
    if (formData.petName && !formData.petGender) { newErrors.petGender = 'Vui lòng chọn giới tính thú cưng'; }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleResetAndClose = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    onClose();
  }, [onClose]);

  // Bọc hàm submit bằng useCallback
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleResetAndClose();
    }
  }, [formData, validateForm, onSubmit, handleResetAndClose]);

  // Handler chung cho Input/Select (đã mở rộng type)
  const handleInputChange = useCallback((e: ChangeEvent<InputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof CustomerFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  // Handler riêng cho PetType: khi thay đổi PetType, reset PetBreed
  const handlePetTypeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(e); // Gọi handler chung để cập nhật petType
    setFormData(prev => ({ ...prev, petBreed: '' })); // Reset petBreed
    
    if (errors.petBreed) {
      setErrors(prev => ({ ...prev, petBreed: undefined }));
    }
  }, [handleInputChange, errors.petBreed]);


  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title="Thêm Khách Hàng Mới">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          
          {/* Cột trái: Thông tin khách hàng */}
          <div>
            <h4 className="font-bold text-lg text-gray-700 mb-4  pb-2">Thông tin Khách hàng</h4>
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
              icon={<AiOutlineMail />}
              error={errors.email}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Số điện thoại"
              name="phone"
              type="tel" // Đổi type="number" thành "tel" cho SĐT
              placeholder="0123456789"
              icon={<AiOutlinePhone />}
              error={errors.phone}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Khu vực"
              name="region"
              type="select"
              icon={<AiOutlineEnvironment />}
              error={errors.region}
              formData={formData}
              handleInputChange={handleInputChange}
            >
              <option value="">Chọn khu vực</option>
              <option value="Hà Nội" className="text-gray-900">Hà Nội</option>
              <option value="TP.HCM" className="text-gray-900">TP.HCM</option>
              <option value="Đà Nẵng" className="text-gray-900">Đà Nẵng</option>
              <option value="Hải Phòng" className="text-gray-900">Hải Phòng</option>
              <option value="Cần Thơ" className="text-gray-900">Cần Thơ</option>
            </FormInput>
          </div>

          {/* Cột phải: Thông tin thú cưng */}
          <div>
            <h4 className="font-bold text-lg text-gray-700 mb-4  pb-2">Thông tin Thú cưng (Tùy chọn)</h4>
            
            <FormInput
              label="Tên thú cưng"
              name="petName"
              placeholder="Nhập tên thú cưng"
              icon={<FaDog />}
              error={errors.petName}
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
              onChange={handlePetTypeChange} // Sử dụng handler riêng
            >
              <option value="">Chọn loại thú cưng</option>
              {petTypes.map(type => (
                <option key={type.id} value={type.id} className="text-gray-900">
                  {type.name}
                </option>
              ))}
            </FormInput>

            <FormInput
              label="Giống thú cưng"
              name="petBreed"
              type="select"
              icon={<FaDog />}
              error={errors.petBreed}
              formData={formData}
              handleInputChange={handleInputChange}
              disabled={!formData.petType}
            >
              <option value="">Chọn giống</option>
              {formData.petType && petBreeds
                .filter(breed => breed.petTypeId === formData.petType)
                .map(breed => (
                  <option key={breed.id} value={breed.id} className="text-gray-900">
                    {breed.name}
                  </option>
                ))
              }
            </FormInput>

            <FormInput
              label="Tuổi (năm)"
              name="petAge"
              type="number"
              placeholder="Nhập tuổi"
              icon={<FaDog />}
              error={errors.petAge}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <FormInput
              label="Giới tính"
              name="petGender"
              type="select"
              icon={<FaDog />}
              error={errors.petGender}
              formData={formData}
              handleInputChange={handleInputChange}
            >
              <option value="">Chọn giới tính</option>
              <option value="male" className="text-gray-900">Đực</option>
              <option value="female" className="text-gray-900">Cái</option>
            </FormInput>
          </div>
        </div>

        {/* Thanh hành động */}
        <div className="mt-6 pt-4  border-gray-100 flex justify-end gap-3">
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
            Thêm Khách Hàng
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;

