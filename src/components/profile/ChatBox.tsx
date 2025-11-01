import React, { useState } from "react";
import { FaPaperPlane, FaTimes, FaImage, FaSmile } from "react-icons/fa";

interface Message {
  id: string;
  text: string;
  sender: "user" | "freelancer";
  timestamp: Date;
}

interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

interface ChatBoxProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedFreelancer?: Freelancer | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  isOpen = false,
  onClose,
  selectedFreelancer,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi có thể giúp gì cho bạn? 🐾",
      sender: "freelancer",
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Cảm ơn bạn! Tôi sẽ sắp xếp lịch chăm sóc thú cưng cho bạn ngay. 😊",
        sender: "freelancer",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg border border-gray-300 p-8 text-center">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          Chọn Freelancer để chat
        </h3>
        <p className="text-sm text-gray-500">
          Chọn một freelancer từ danh sách bên dưới để bắt đầu trò chuyện
        </p>
      </div>
    );
  }

  const freelancerInfo = selectedFreelancer || {
    id: "1",
    name: "Nguyễn Văn A",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
    online: true,
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={freelancerInfo.avatar}
              alt={freelancerInfo.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            {freelancerInfo.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-bold">{freelancerInfo.name}</h3>
            <p className="text-xs text-teal-100">
              {freelancerInfo.online ? "Đang hoạt động" : "Offline"}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              } rounded-2xl px-4 py-2 shadow-sm`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-teal-100" : "text-gray-400"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
        <div className="flex items-center gap-2 mb-2">
          <button className="text-gray-400 hover:text-teal-600 transition-colors p-2">
            <FaImage />
          </button>
          <button className="text-gray-400 hover:text-teal-600 transition-colors p-2">
            <FaSmile />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-3 rounded-full hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
