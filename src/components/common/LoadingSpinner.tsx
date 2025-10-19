import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text = "Đang tải...",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="flex items-center space-x-2">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="border-4 border-purple-200 border-t-purple-600 rounded-full w-full h-full"></div>
        </div>
        <div
          className={`${sizeClasses[size]} animate-spin`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="border-4 border-blue-200 border-t-blue-600 rounded-full w-full h-full"></div>
        </div>
        <div
          className={`${sizeClasses[size]} animate-spin`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="border-4 border-pink-200 border-t-pink-600 rounded-full w-full h-full"></div>
        </div>
      </div>

      <div
        className={`${textSizes[size]} font-medium text-gray-600 animate-pulse`}
      >
        {text}
      </div>

      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
