import React, { useMemo } from "react";
import type { DateTimeSelectionProps } from "../../types";
import { getAllTimeSlots } from "../../utils";

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  dateTimeData,
  onDateTimeChange,
  errors,
}) => {
  // Get time slots from utility function (uses PickUpTime enum)
  const timeSlots = getAllTimeSlots();

  // Get current date and time in Vietnam timezone (UTC+7)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentHour = now.getHours();

  // Get min date for date picker (today) - format as YYYY-MM-DD in local timezone
  const minDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Selected date
  const selectedDate = dateTimeData?.date || dateTimeData?.selectedDate || "";

  // Parse selected date correctly (avoid timezone issues)
  const selectedDateObj = useMemo(() => {
    if (!selectedDate) return null;
    const [year, month, day] = selectedDate.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  }, [selectedDate]);

  // Check if selected date is today
  const isToday = useMemo(() => {
    if (!selectedDateObj) return false;
    return (
      selectedDateObj.getFullYear() === today.getFullYear() &&
      selectedDateObj.getMonth() === today.getMonth() &&
      selectedDateObj.getDate() === today.getDate()
    );
  }, [selectedDateObj, today]);

  // Function to check if a time slot is disabled
  const isTimeSlotDisabled = (slotValue: string): boolean => {
    if (!isToday) return false;

    // Map slot to start hour
    const slotHours: Record<string, number> = {
      Slot1: 8, // 8:00 AM
      Slot2: 10, // 10:00 AM
      Slot3: 12, // 12:00 PM
      Slot4: 14, // 2:00 PM
      Slot5: 16, // 4:00 PM
    };

    const slotStartHour = slotHours[slotValue];
    return slotStartHour !== undefined && currentHour >= slotStartHour;
  };

  // Filter available time slots
  const availableTimeSlots = useMemo(() => {
    return timeSlots.map((slot) => ({
      ...slot,
      disabled: isTimeSlotDisabled(slot.value),
    }));
  }, [timeSlots, isToday, currentHour]);

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
            value={selectedDate}
            onChange={(e) => onDateTimeChange?.("date", e.target.value)}
            min={minDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors?.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
          {selectedDate && (
            <p className="text-xs text-gray-500 mt-1">
              📅{" "}
              {new Date(selectedDate).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khung giờ đón/trả
          </label>
          <select
            value={dateTimeData?.time || dateTimeData?.selectedTime || ""}
            onChange={(e) => onDateTimeChange?.("time", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={!selectedDate}
          >
            <option value="">
              {!selectedDate ? "Vui lòng chọn ngày trước" : "Chọn khung giờ"}
            </option>
            {availableTimeSlots.map((slot) => (
              <option
                key={slot.value}
                value={slot.value}
                disabled={slot.disabled}
              >
                {slot.label}
                {slot.disabled ? " (Đã qua)" : ""}
              </option>
            ))}
          </select>
          {errors?.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
          )}
          {isToday && (
            <p className="text-xs text-yellow-600 mt-1">
              ⚠️ Một số khung giờ đã qua không thể chọn
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
