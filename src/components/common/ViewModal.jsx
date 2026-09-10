// import { MdClose } from "react-icons/md";

// const ViewModal = ({ isOpen, onClose, title = "View Details", children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
//           >
//             <MdClose size={20} />
//           </button>
//         </div>

//         {/* Scrollable Content */}
//         <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable row inside ViewModal
// export const ViewRow = ({ label, value }) => (
//   <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
//     <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide sm:w-44 shrink-0 pt-0.5">
//       {label}
//     </span>
//     <span className="text-sm text-gray-800 break-all">{value ?? "—"}</span>
//   </div>
// );

// // Status badge helper used inside ViewModal
// export const ViewBadge = ({ active, activeLabel = "Active", inactiveLabel = "Inactive" }) => (
//   <span
//     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
//       active ? "bg-blue-50 text-[#2c0eee]" : "bg-gray-100 text-gray-500"
//     }`}
//   >
//     {active ? activeLabel : inactiveLabel}
//   </span>
// );

// export default ViewModal;



import { MdClose } from "react-icons/md";

const ViewModal = ({ isOpen, onClose, title = "View Details", children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col animate-modal-slide">
        {/* Header */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4529f7] via-[#4529f7] to-pink-500 rounded-t-2xl" />
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 scrollbar-thin">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable row inside ViewModal
export const ViewRow = ({ label, value, className = "" }) => (
  <div className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-gray-100 last:border-0 ${className}`}>
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-44 shrink-0 pt-0.5">
      {label}
    </span>
    <span className="text-sm text-gray-800 break-all">{value ?? "—"}</span>
  </div>
);

// Status badge helper used inside ViewModal
export const ViewBadge = ({ active, activeLabel = "Active", inactiveLabel = "Inactive" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${active
        ? "bg-green-50 text-green-700"
        : "bg-gray-100 text-gray-500"
      }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? "bg-green-500" : "bg-gray-400"}`} />
    {active ? activeLabel : inactiveLabel}
  </span>
);

// Trending badge helper
export const ViewTrendingBadge = ({ isTrending }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isTrending
        ? "bg-yellow-50 text-yellow-700"
        : "bg-gray-100 text-gray-500"
      }`}
  >
    {isTrending ? "⭐ Trending" : "Not Trending"}
  </span>
);

export default ViewModal;