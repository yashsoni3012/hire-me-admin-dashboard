// import { formatNumber } from "../../utils/helpers";

// const StatsCard = ({
//   title,
//   value,
//   icon: Icon,
//   color = "purple",
//   change,
//   changeLabel = "vs last month",
//   onClick,
// }) => {
//   const colors = {
//     blue: {
//       bg: "bg-blue-50",
//       text: "text-[#2c0eee]",
//       icon: "bg-blue-100",
//       border: "border-blue-200",
//     },
//     green: {
//       bg: "bg-green-50",
//       text: "text-green-600",
//       icon: "bg-green-100",
//       border: "border-green-200",
//     },
//     orange: {
//       bg: "bg-orange-50",
//       text: "text-orange-600",
//       icon: "bg-orange-100",
//       border: "border-orange-200",
//     },
//     purple: {
//       bg: "bg-purple-50",
//       text: "text-purple-600",
//       icon: "bg-purple-100",
//       border: "border-purple-200",
//     },
//     red: {
//       bg: "bg-red-50",
//       text: "text-red-600",
//       icon: "bg-red-100",
//       border: "border-red-200",
//     },
//   };
//   const c = colors[color] || colors.purple;
//   const isPositive = change >= 0;

//   return (
//     <div
//       onClick={onClick}
//       className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
//     >
//       <div className="flex flex-col">
//         {Icon && (
//           <div className={`${c.icon} p-3 rounded-xl w-fit mb-4`}>
//             <Icon className={c.text} size={28} />
//           </div>
//         )}
//         <p className="text-3xl font-bold text-gray-900 mt-1">
//           {formatNumber(value)}
//         </p>

//         <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>

//         {change !== undefined && change !== null && (
//           <p
//             className={`text-sm mt-2 font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}
//           >
//             {isPositive ? "↑" : "↓"} {Math.abs(change)}%{" "}
//             <span className="text-gray-400 font-normal">{changeLabel}</span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StatsCard;

// components/dashboard/StatsCard.jsx
import { formatNumber } from "../../utils/helpers";

const StatsCard = ({ title, value, icon: Icon, footer, onClick }) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={`group relative bg-white rounded-sm border border-gray-100 p-5 shadow-sm transition-all duration-200 ${
        onClick ? "cursor-pointer" : ""
      } hover:bg-[#2C0EEE] hover:border-[#2C0EEE] hover:shadow-lg hover:shadow-[#2C0EEE]/25 ${
        onClick ? "hover:-translate-y-0.5" : ""
      }`}
    >
      <div className="flex items-start gap-3">
      
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 tracking-wide uppercase transition-colors duration-200 group-hover:text-white/80">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums transition-colors duration-200 group-hover:text-white">
            {formatNumber(value)}
          </p>
        </div>
          {Icon && (
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2C0EEE] flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-white/20 group-hover:text-white">
            <Icon size={18} />
          </div>
        )}
      </div>
      {/* {footer && (
        <div className="mt-3 pt-2 border-t border-gray-100 transition-colors duration-200 group-hover:border-white/20">
          <p className="text-xs text-gray-400 transition-colors duration-200 group-hover:text-white/70">
            {footer}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default StatsCard;