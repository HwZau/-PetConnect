import React from "react";
import type { DateTimeSelectionProps } from "../../types";

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  dateTimeData,
  onDateTimeChange,
  errors,
}) => {
  const timeSlots = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        3. Chọn Ngày & Giờ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày
          </label>
          <input
            type="date"
            value={dateTimeData?.date || dateTimeData?.selectedDate || ""}
            onChange={(e) => onDateTimeChange?.("date", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors?.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giờ
          </label>
          <select
            value={dateTimeData?.time || dateTimeData?.selectedTime || ""}
            onChange={(e) => onDateTimeChange?.("time", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Chọn giờ</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors?.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
          )}
        </div>
      </div>

      {/* Recurring Service */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="recurring"
          checked={dateTimeData?.recurringService || false}
          onChange={(e) =>
            onDateTimeChange?.("recurringService", e.target.checked)
          }
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="recurring" className="text-sm text-gray-700">
          Dịch vụ định kỳ
        </label>
      </div>

      {dateTimeData?.recurringService && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tần suất
          </label>
          <select
            value={dateTimeData.frequency || ""}
            onChange={(e) => onDateTimeChange?.("frequency", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Chọn tần suất</option>
            <option value="daily">Hàng ngày</option>
            <option value="weekly">Hàng tuần</option>
            <option value="monthly">Hàng tháng</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
