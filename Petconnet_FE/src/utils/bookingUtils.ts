import { PickUpTime, BookingStatus, PickUpStatus } from "../types";

/**
 * Booking utility functions
 */

// Convert PickUpTime enum to display text
export const getPickUpTimeLabel = (slot: PickUpTime | string): string => {
  const timeLabels: Record<string, string> = {
    Slot1: "8:00 AM - 10:00 AM",
    Slot2: "10:00 AM - 12:00 PM",
    Slot3: "12:00 PM - 2:00 PM",
    Slot4: "2:00 PM - 4:00 PM",
    Slot5: "4:00 PM - 6:00 PM",
  };
  return timeLabels[slot] || slot;
};

// Convert BookingStatus enum to Vietnamese
export const getBookingStatusLabel = (
  status: BookingStatus | string
): string => {
  const statusLabels: Record<string, string> = {
    Pending: "Đang chờ",
    Confirmed: "Đã xác nhận",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };
  return statusLabels[status] || status;
};

// Convert PickUpStatus enum to Vietnamese
export const getPickUpStatusLabel = (status: PickUpStatus | string): string => {
  const statusLabels: Record<string, string> = {
    NotPickedUp: "Chưa đón",
    PickedUp: "Đã đón",
    Delivered: "Đã giao",
  };
  return statusLabels[status] || status;
};

// Get status color for UI
export const getBookingStatusColor = (
  status: BookingStatus | string
): string => {
  const colors: Record<string, string> = {
    Pending: "text-yellow-600 bg-yellow-100",
    Confirmed: "text-blue-600 bg-blue-100",
    Completed: "text-green-600 bg-green-100",
    Cancelled: "text-red-600 bg-red-100",
  };
  return colors[status] || "text-gray-600 bg-gray-100";
};

// Get pickup status color for UI
export const getPickUpStatusColor = (status: PickUpStatus | string): string => {
  const colors: Record<string, string> = {
    NotPickedUp: "text-gray-600 bg-gray-100",
    PickedUp: "text-blue-600 bg-blue-100",
    Delivered: "text-green-600 bg-green-100",
  };
  return colors[status] || "text-gray-600 bg-gray-100";
};

// Get all time slots
export const getAllTimeSlots = (): Array<{
  value: PickUpTime;
  label: string;
}> => {
  return [
    { value: PickUpTime.Slot1, label: getPickUpTimeLabel(PickUpTime.Slot1) },
    { value: PickUpTime.Slot2, label: getPickUpTimeLabel(PickUpTime.Slot2) },
    { value: PickUpTime.Slot3, label: getPickUpTimeLabel(PickUpTime.Slot3) },
    { value: PickUpTime.Slot4, label: getPickUpTimeLabel(PickUpTime.Slot4) },
    { value: PickUpTime.Slot5, label: getPickUpTimeLabel(PickUpTime.Slot5) },
  ];
};
