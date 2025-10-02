import React from "react";
import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";

interface Pet {
  id: string;
  name: string;
  type: string;
  status: string;
  avatar?: string;
  color: string;
}

interface UserPetsProps {
  pets: Pet[];
}

const UserPets: React.FC<UserPetsProps> = ({ pets }) => {
  // Sử dụng hình ảnh cố định từ Unsplash thay vì ngẫu nhiên
  const getPetImage = (petType: string) => {
    // Map pet types to fixed Unsplash images
    const petImageMap: Record<string, string> = {
      "Golden Retriever":
        "https://images.unsplash.com/photo-1561495376-dc9c7c5b8726?auto=format&fit=crop&w=200&h=200",
      "Persian Cat":
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=200&h=200",
      Cockatiel:
        "https://images.unsplash.com/photo-1591198936750-16d8e25ab88a?auto=format&fit=crop&w=200&h=200",
      Husky:
        "https://images.unsplash.com/photo-1605568082656-fa4e3ba28d29?auto=format&fit=crop&w=200&h=200",
      Rabbit:
        "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=200&h=200",
    };

    // Default image if type not in map
    return (
      petImageMap[petType] ||
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=200&h=200"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaPaw className="mr-2 text-orange-500" />
          Thú cưng của tôi
        </h2>
        <Link to="/pets" className="text-sm text-orange-500 hover:underline">
          Xem thêm
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className={`${pet.color} rounded-lg p-4`}>
            <div className="flex items-center mb-3">
              <img
                src={pet.avatar || getPetImage(pet.type)}
                alt={pet.name}
                className="h-10 w-10 rounded-full object-cover mr-3"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=200&h=200";
                }}
              />
              <div>
                <h3 className="font-medium">{pet.name}</h3>
                <p className="text-xs text-gray-600">{pet.type}</p>
              </div>
            </div>
            <div className="flex items-center text-xs">
              <div className="bg-white px-2 py-1 rounded-full shadow-sm">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  <span>{pet.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPets;
