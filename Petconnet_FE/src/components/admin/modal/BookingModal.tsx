import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";

export type BookingFormData = {
  pickupTime: string;
  bookingDate: string;
  serviceIds: string[];
  freelancerId: string;
  petIds: string[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void | Promise<void>;
  services?: { id: string; name: string }[];
  freelancers?: { id: string; name: string }[];
  pets?: { id: string; name: string }[];
}

const BookingModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, services = [], freelancers = [], pets = [] }) => {
  const [pickupTime, setPickupTime] = useState("Slot1");
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [serviceIds, setServiceIds] = useState<string[]>(services.length ? [services[0].id] : []);
  const [freelancerId, setFreelancerId] = useState<string>(freelancers.length ? freelancers[0].id : "");
  const [petIds, setPetIds] = useState<string[]>(pets.length ? [pets[0].id] : []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ pickupTime, bookingDate, serviceIds, freelancerId, petIds });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div aria-hidden className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-lg z-10">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-bold">Tạo Đặt Lịch Mới</Dialog.Title>
            <button onClick={onClose} className="text-gray-500"><AiOutlineClose /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày</label>
              <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full px-3 py-2 rounded-md border" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Khung giờ</label>
              <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="w-full px-3 py-2 rounded-md border">
                <option value="Slot1">8:00 - 10:00</option>
                <option value="Slot2">10:00 - 12:00</option>
                <option value="Slot3">12:00 - 14:00</option>
                <option value="Slot4">14:00 - 16:00</option>
                <option value="Slot5">16:00 - 18:00</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Service IDs (comma-separated)</label>
              <input value={serviceIds.join(",")} onChange={e => setServiceIds(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="service-id-1,service-id-2" className="w-full px-3 py-2 rounded-md border" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Freelancer ID</label>
              <select value={freelancerId} onChange={e => setFreelancerId(e.target.value)} className="w-full px-3 py-2 rounded-md border">
                <option value="">-- Chọn freelancer --</option>
                {freelancers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pet IDs (comma-separated)</label>
              <input value={petIds.join(",")} onChange={e => setPetIds(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="pet-id-1,pet-id-2" className="w-full px-3 py-2 rounded-md border" />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Tạo</button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default BookingModal;
