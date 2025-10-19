import React from "react";

interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

interface PaymentCardFormProps {
  cardData: CardData;
  onCardDataChange: (field: string, value: string) => void;
  isVisible: boolean;
}

const PaymentCardForm: React.FC<PaymentCardFormProps> = ({
  cardData,
  onCardDataChange,
  isVisible,
}) => {
  if (!isVisible) return null;

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19) return;
    }

    if (field === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length > 5) return;
    }

    if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 3) return;
    }

    onCardDataChange(field, formattedValue);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin thẻ</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số thẻ
          </label>
          <input
            type="text"
            value={cardData.cardNumber}
            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày hết hạn
            </label>
            <input
              type="text"
              value={cardData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              placeholder="MM/YY"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              value={cardData.cvv}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
              placeholder="123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên chủ thẻ
          </label>
          <input
            type="text"
            value={cardData.cardHolder}
            onChange={(e) =>
              handleInputChange("cardHolder", e.target.value.toUpperCase())
            }
            placeholder="NGUYEN VAN A"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentCardForm;
