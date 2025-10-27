import React from "react";

interface TransactionCardProps {
  title: string;
  customer?: string;
  amount?: string;
  status?: "Success" | "Pending" | "Failed";
  date?: string;
}

const statusStyle = {
  Success: "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Failed: "bg-red-50 text-red-700",
};

const TransactionCard: React.FC<TransactionCardProps> = ({ title, customer, amount, status = "Success", date }) => {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-gray-500">{customer}</div>
        </div>
        <div className="text-sm text-gray-600">{amount}</div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className={`text-xs px-2 py-1 rounded ${statusStyle[status]}`}>{status}</div>
        <div className="text-xs text-gray-400">{date}</div>
      </div>
    </div>
  );
};

export default TransactionCard;
