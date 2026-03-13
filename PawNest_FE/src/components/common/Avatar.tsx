import React from "react";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "User",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-32 h-32 text-4xl",
  };

  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getColorFromName = (name: string): string => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ];

    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={(e) => {
          // If image fails to load, hide it and show initials
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const initialsDiv = document.createElement("div");
            initialsDiv.className = `${
              sizeClasses[size]
            } rounded-full flex items-center justify-center font-semibold text-white ${getColorFromName(
              name
            )} ${className}`;
            initialsDiv.textContent = getInitials(name);
            parent.appendChild(initialsDiv);
          }
        }}
      />
    );
  }

  return (
    <div
      className={`${
        sizeClasses[size]
      } rounded-full flex items-center justify-center font-semibold text-white ${getColorFromName(
        name
      )} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
