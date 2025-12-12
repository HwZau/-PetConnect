import { useState, useEffect } from "react";
import { FaTimes, FaDog, FaCat } from "react-icons/fa";

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (petId: string, petData: PetFormData) => void;
  petData: {
    petId: string;
    petName: string;
    species: string;
    breed: string;
  } | null;
}

export interface PetFormData {
  petName: string;
  species: string;
  breed: string;
}

const EditPetModal = ({
  isOpen,
  onClose,
  onSave,
  petData,
}: EditPetModalProps) => {
  const [formData, setFormData] = useState<PetFormData>({
    petName: "",
    species: "",
    breed: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PetFormData, string>>
  >({});

  const speciesOptions = [
    {
      value: "Dog",
      label: "Chó",
      icon: FaDog,
      color: "from-orange-400 to-amber-400",
    },
    {
      value: "Cat",
      label: "Mèo",
      icon: FaCat,
      color: "from-purple-400 to-pink-400",
    },
  ];

  useEffect(() => {
    if (petData) {
      setFormData({
        petName: petData.petName,
        species: petData.species,
        breed: petData.breed,
      });
    }
  }, [petData]);

  if (!isOpen || !petData) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof PetFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSpeciesSelect = (species: string) => {
    setFormData((prev) => ({ ...prev, species }));
    if (errors.species) {
      setErrors((prev) => ({ ...prev, species: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PetFormData, string>> = {};

    if (!formData.petName.trim()) {
      newErrors.petName = "Vui lòng nhập tên thú cưng";
    }
    if (!formData.species) {
      newErrors.species = "Vui lòng chọn loại thú cưng";
    }
    if (!formData.breed.trim()) {
      newErrors.breed = "Vui lòng nhập giống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(petData.petId, formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <FaDog className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Chỉnh sửa thú cưng</h2>
                  <p className="text-teal-100 text-sm">
                    Cập nhật thông tin thú cưng của bạn
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Species Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Loại thú cưng <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {speciesOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.species === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSpeciesSelect(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-teal-500 bg-teal-50 shadow-md scale-105"
                          : "border-gray-200 hover:border-teal-300 hover:bg-teal-50/50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${option.color} rounded-full flex items-center justify-center`}
                      >
                        <Icon className="text-white text-xl" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {option.label}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.species && (
                <p className="text-red-500 text-xs mt-2">{errors.species}</p>
              )}
            </div>

            {/* Pet Name */}
            <div>
              <label
                htmlFor="petName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Tên thú cưng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="petName"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.petName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-teal-500 focus:ring-teal-200"
                }`}
                placeholder="Ví dụ: Milu, Cún con..."
              />
              {errors.petName && (
                <p className="text-red-500 text-xs mt-1">{errors.petName}</p>
              )}
            </div>

            {/* Breed */}
            <div>
              <label
                htmlFor="breed"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Giống <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.breed
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-teal-500 focus:ring-teal-200"
                }`}
                placeholder="Ví dụ: Poodle, Corgi..."
              />
              {errors.breed && (
                <p className="text-red-500 text-xs mt-1">{errors.breed}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                Cập nhật
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPetModal;
