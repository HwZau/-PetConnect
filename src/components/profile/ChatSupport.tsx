import React, { useState } from "react";
import { FaCommentDots } from "react-icons/fa";

const ChatSupport: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="bg-orange-100 rounded-lg shadow p-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-center">
          <FaCommentDots className="mr-2 text-orange-500" />
          Cần hỗ trợ?
        </h2>
        <p className="text-sm text-gray-600 my-3">
          Chúng tôi luôn sẵn sàng giúp đỡ bạn giải quyết các thắc mắc
        </p>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-full bg-white text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-md transition-colors"
        >
          Liên hệ hỗ trợ
        </button>
      </div>

      {/* Chat dialog would go here */}
    </div>
  );
};

export default ChatSupport;
