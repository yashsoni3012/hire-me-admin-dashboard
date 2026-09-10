import React from "react";

const StatusFilter = ({
  activeFilter,
  onFilterChange,
  counts = { all: 0, active: 0, inactive: 0 },
  className = "",
}) => {
  const filters = [
    { key: "all", label: "All", count: counts.all || 0 },
    { key: "active", label: "Active", count: counts.active || 0 },
    { key: "inactive", label: "Inactive", count: counts.inactive || 0 },
  ];

  return (
    <div
      className={`flex items-center gap-1 bg-gray-100 rounded-lg p-1 ${className}`}
    >
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`
            px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
            flex items-center gap-2
            ${
              activeFilter === filter.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }
          `}
        >
          {filter.label}
          <span
            className={`
            text-xs px-1.5 py-0.5 rounded-full
            ${
              activeFilter === filter.key
                ? "bg-gray-100 text-gray-600"
                : "bg-gray-200 text-gray-500"
            }
          `}
          >
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
