import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface PageLoaderProps {
  text?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  text = "Đang tải trang...",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <LoadingSpinner size="xl" text={text} />
        <div className="mt-8 text-sm text-gray-500 max-w-md mx-auto">
          <p>Vui lòng đợi trong giây lát...</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
