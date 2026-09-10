import { formatNumber } from "../../utils/helpers";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = "purple",
  change,
  changeLabel = "vs last month",
  onClick,
}) => {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      text: "text-[#2c0eee]",
      icon: "bg-blue-100",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      icon: "bg-green-100",
      border: "border-green-200",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      icon: "bg-orange-100",
      border: "border-orange-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      icon: "bg-purple-100",
      border: "border-purple-200",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      icon: "bg-red-100",
      border: "border-red-200",
    },
  };
  const c = colors[color] || colors.purple;
  const isPositive = change >= 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col">
        {Icon && (
          <div className={`${c.icon} p-3 rounded-xl w-fit mb-4`}>
            <Icon className={c.text} size={28} />
          </div>
        )}
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {formatNumber(value)}
        </p>

        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>

        {change !== undefined && change !== null && (
          <p
            className={`text-sm mt-2 font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%{" "}
            <span className="text-gray-400 font-normal">{changeLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
