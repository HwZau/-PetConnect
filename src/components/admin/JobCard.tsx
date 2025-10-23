import React from "react";

interface JobCardProps {
  title: string;
  client?: string;
  status?: string;
  date?: string;
  price?: string;
}

const statusClasses: Record<string, string> = {
  Pending: "bg-yellow-50 text-yellow-800",
  Assigned: "bg-blue-50 text-blue-800",
  "In Progress": "bg-indigo-50 text-indigo-800",
  Completed: "bg-green-50 text-green-800",
  Cancelled: "bg-red-50 text-red-800",
};

const JobCard: React.FC<JobCardProps> = ({ title, client, status = "Pending", date, price }) => {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">{title}</div>
          {client && <div className="text-xs text-gray-500">{client}</div>}
        </div>
        <div className={`text-xs px-2 py-1 rounded ${statusClasses[status] || "bg-gray-50 text-gray-700"}`}>
          {status}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div>{date}</div>
        <div className="font-medium">{price}</div>
      </div>

      <div className="mt-3">
        <button className="px-3 py-1 bg-green-600 text-white rounded">View Details</button>
      </div>
    </div>
  );
};

export default JobCard;
