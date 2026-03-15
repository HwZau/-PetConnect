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
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="border-4 border-teal-200 border-t-teal-600 rounded-full w-full h-full"></div>
      </div>

      <div className={`${textSizes[size]} font-medium text-gray-600`}>
        {text}
      </div>
    </div>
  );
};

export default LoadingSpinner;
