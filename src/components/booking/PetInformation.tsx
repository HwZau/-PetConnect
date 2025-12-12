import React from "react";
import { CONSTANTS } from "../../utils";

interface PetInformationProps {
  petInfo?: any[];
  onPetInfoChange?: (petIndex: number, field: string, value: string) => void;
  onAddPet?: () => void;
  onRemovePet?: (petIndex: number) => void;
  errors?: Record<string, string>;
}

const PetInformation: React.FC<PetInformationProps> = ({
  petInfo,
  onPetInfoChange,
  onAddPet,
  onRemovePet,
  errors,
}) => {
  const getPetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dog: "Chó",
      cat: "Mèo",
    };
    return labels[type] || "Khác";
  };

  const getSizeLabel = (size: string) => {
    const labels: Record<string, string> = {
      small: "Nhỏ",
      medium: "Trung bình",
      large: "Lớn",
    };
    return labels[size] || size;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          2. Thông Tin Thú Cưng
        </h2>
        <button
          type="button"
          onClick={onAddPet}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="font-medium">Thêm thú cưng</span>
        </button>
      </div>

      <div className="space-y-6">
        {petInfo?.map((pet: any, index: number) => (
          <div key={index} className="relative">
            {/* Pet card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  {pet.petName || `Thú cưng ${index + 1}`}
                </h3>
              </div>
              {(petInfo?.length || 0) > 1 && (
                <button
                  type="button"
                  onClick={() => onRemovePet?.(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Xóa thú cưng này"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Pet information form */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {/* Row 1: Pet Name and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên thú cưng
                  </label>
                  <input
                    type="text"
                    value={pet.petAge || ""}
                    onChange={(e) =>
                      onPetInfoChange?.(index, "petAge", e.target.value)
                    }
                    placeholder="Nhập tên thú cưng"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại thú cưng
                  </label>
                  <select
                    value={pet.petType}
                    onChange={(e) =>
                      onPetInfoChange?.(index, "petType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Chọn loại thú cưng</option>
                    {CONSTANTS.PET.TYPES.map((type) => (
                      <option key={type} value={type}>
                        {getPetTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                  {errors?.[`petType_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`petType_${index}`]}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Size, Age, Weight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kích thước
                  </label>
                  <select
                    value={pet.petSize || ""}
                    onChange={(e) =>
                      onPetInfoChange?.(index, "petSize", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Chọn kích thước</option>
                    {CONSTANTS.PET.SIZES.map((size) => (
                      <option key={size} value={size}>
                        {getSizeLabel(size)}
                      </option>
                    ))}
                  </select>
                  {errors?.[`petSize_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`petSize_${index}`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tuổi
                  </label>
                  <input
                    type="text"
                    value={pet.petType || ""}
                    onChange={(e) =>
                      onPetInfoChange?.(index, "petType", e.target.value)
                    }
                    placeholder="VD: 2 tuổi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="text"
                    value={pet.petWeight || ""}
                    onChange={(e) =>
                      onPetInfoChange?.(index, "petWeight", e.target.value)
                    }
                    placeholder="VD: 5kg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetInformation;
