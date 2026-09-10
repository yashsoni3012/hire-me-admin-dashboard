import React, { useState } from "react";
import { showSuccess, showError } from "../../utils/toast";

const Switch = ({
  value,
  onToggle,
  label = "",
  type = "status", // 'status' or 'trending'
  loading = false,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading || loading) return;

    setIsLoading(true);
    try {
      await onToggle(!value);
    } catch (error) {
      console.error("Toggle error:", error);
      showError(error.message || "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  // Trending: Yellow, Status: Green
  const activeColor = type === "trending" ? "bg-yellow-400" : "bg-green-500";
  const inactiveColor = type === "trending" ? "bg-gray-200" : "bg-gray-200";
  const activeTextColor =
    type === "trending" ? "text-yellow-800" : "text-green-700";
  const inactiveTextColor = "text-gray-500";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleToggle}
        disabled={isLoading || loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          value ? activeColor : inactiveColor
        } ${isLoading || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={value ? "Click to deactivate" : "Click to activate"}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      {label && (
        <span
          className={`text-sm font-medium ${value ? activeTextColor : inactiveTextColor}`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Switch;
