import React, { useState } from "react";
import { showError } from "../../utils/toast";

const SwitchButton = ({
  value = false,
  onToggle,
  type = "status", // 'status' | 'trending'
  size = "md", // 'sm' | 'md' | 'lg'
  disabled = false,
  className = "",
}) => {
  const [loading, setLoading] = useState(false);

  const isActive = value === true || value === 1 || value === "active";

  const handleToggle = async () => {
    if (loading || disabled) return;

    setLoading(true);
    try {
      await onToggle?.(!isActive);
    } catch (err) {
      showError(err?.message || "Toggle failed");
    } finally {
      setLoading(false);
    }
  };

  // Sizes
  const sizes = {
    sm: {
      wrapper: "w-10 h-5",
      thumb: "w-4 h-4",
      move: "translate-x-5",
    },
    md: {
      wrapper: "w-12 h-6",
      thumb: "w-5 h-5",
      move: "translate-x-6",
    },
    lg: {
      wrapper: "w-14 h-7",
      thumb: "w-6 h-6",
      move: "translate-x-7",
    },
  };

  // Colors
  const colors = {
    status: {
      on: "bg-green-500",
      off: "bg-gray-300",
    },
    trending: {
      on: "bg-yellow-400",
      off: "bg-gray-300",
    },
  };

  const sizeStyle = sizes[size] || sizes.md;
  const color = colors[type] || colors.status;

  return (
    <button
      onClick={handleToggle}
      disabled={loading || disabled}
      className={`
        relative inline-flex items-center rounded-full
        transition-all duration-300 ease-in-out
        ${sizeStyle.wrapper}
        ${isActive ? color.on : color.off}
        ${loading || disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Thumb */}
      <span
        className={`
          absolute left-1
          rounded-full bg-white shadow-md
          transform transition-all duration-300 ease-in-out
          ${sizeStyle.thumb}
          ${isActive ? sizeStyle.move : "translate-x-0"}
        `}
      />
    </button>
  );
};

export default SwitchButton;
