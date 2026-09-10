// import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { toggleSidebar } from "../../redux/slices/uiSlice";
// import { menuItems } from "../../config/menu";
// import {
//   MdDashboard,
//   MdPeople,
//   MdWork,
//   MdCategory,
//   MdBusiness,
//   MdApartment,
//   MdSchool,
//   MdSubdirectoryArrowRight,
//   MdArticle,
//   MdImage,
//   MdNotifications,
//   MdSettings,
//   MdSecurity,
//   MdLock,
//   MdLanguage,
//   MdLocationCity,
//   MdClose,
//   MdViewModule,
//   MdLibraryBooks,
//   MdAssignment,
//   MdSupervisorAccount,
//   MdCardGiftcard,
//   MdLocalOffer,
//   MdWorkOutline,
//   MdBusinessCenter,
//   MdCheckCircle,
// } from "react-icons/md";

// const iconMap = {
//   MdDashboard,
//   MdBusinessCenter,
//   MdCheckCircle,
//   MdPeople,
//   MdWorkOutline,
//   MdWork,
//   MdCategory,
//   MdBusiness,
//   MdLocationCity,
//   MdApartment,
//   MdArticle,
//   MdImage,
//   MdNotifications,
//   MdSettings,
//   MdSecurity,
//   MdLock,
//   MdViewModule,
//   MdLanguage,
//   MdSchool,
//   MdSubdirectoryArrowRight,
//   MdLibraryBooks,
//   MdAssignment,
//   MdSupervisorAccount,
//   MdCardGiftcard,
//   MdLocalOffer,
// };

// const Sidebar = () => {
//   const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
//   const dispatch = useDispatch();

//   return (
//     <>
//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-20 bg-black/50 lg:hidden"
//           onClick={() => dispatch(toggleSidebar())}
//         />
//       )}

//       <aside
//         className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-[#0f172a] transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 lg:w-16"} overflow-hidden`}
//       >
//         {/* Logo */}
//         <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 min-w-[64px]">
//           <div className="w-8 h-8 bg-[#2c0eee] rounded-lg flex items-center justify-center flex-shrink-0">
//             <span className="text-gray-200 font-bold text-sm">C</span>
//           </div>
//           {sidebarOpen && (
//             <span className="text-gray-200 font-semibold text-lg whitespace-nowrap">
//               CareerAI
//             </span>
//           )}
//           {sidebarOpen && (
//             <button
//               onClick={() => dispatch(toggleSidebar())}
//               className="ml-auto text-gray-200 hover:text-gray-200 lg:hidden"
//             >
//               <MdClose size={20} />
//             </button>
//           )}
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
//           {menuItems.map((group) => (
//             <div key={group.group}>
//               {sidebarOpen && (
//                 <p className="px-3 mb-1 text-[10px] font-semibold text-gray-200 uppercase tracking-wider whitespace-nowrap">
//                   {group.group}
//                 </p>
//               )}
//               <ul className="space-y-0.5">
//                 {group.items.map((item) => {
//                   const Icon = iconMap[item.icon];
//                   return (
//                     <li key={item.path}>
//                       <NavLink
//                         to={item.path}
//                         className={({ isActive }) =>
//                           `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 group ${
//                             isActive
//                               ? "bg-[#2c0eee] text-gray-200"
//                               : "text-gray-200 hover:bg-white/10 hover:text-gray-200"
//                           }`
//                         }
//                         title={!sidebarOpen ? item.label : ""}
//                       >
//                         {Icon && <Icon size={20} className="flex-shrink-0" />}
//                         {sidebarOpen && (
//                           <span className="text-sm font-medium whitespace-nowrap">
//                             {item.label}
//                           </span>
//                         )}
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="p-3 border-t border-white/10">
//           <div className="flex items-center gap-3 px-2">
//             <div className="w-8 h-8 rounded-full bg-[#2c0eee] flex items-center justify-center text-gray-200 text-xs font-bold flex-shrink-0">
//               SA
//             </div>
//             {sidebarOpen && (
//               <div className="min-w-0">
//                 <p className="text-sm font-medium text-gray-200 truncate">
//                   Super Admin
//                 </p>
//                 <p className="text-xs text-gray-200 truncate">
//                   admin@careerai.in
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;



// import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { toggleSidebar } from "../../redux/slices/uiSlice";
// import { menuItems } from "../../config/menu";
// import HireMeLogo from "../../assets/logo.png"
// import {
//   MdDashboard,
//   MdPeople,
//   MdWork,
//   MdCategory,
//   MdBusiness,
//   MdApartment,
//   MdSchool,
//   MdSubdirectoryArrowRight,
//   MdArticle,
//   MdImage,
//   MdNotifications,
//   MdSettings,
//   MdSecurity,
//   MdLock,
//   MdClose,
//   MdViewModule, MdLocationCity, MdLanguage,
//   MdLibraryBooks,
//   MdAssignment,
//   MdSupervisorAccount, MdTimeline,
//   MdCardGiftcard,
//   MdLocalOffer, MdWorkOutline, MdAdUnits, MdReceipt, MdAttachMoney, MdRateReview, MdCheckCircle, MdBusinessCenter, MdSubscript, MdPayments, MdExtension, MdDescription,
// } from "react-icons/md";
// import { useAuth } from "../../context/AuthContext";

// const iconMap = {
//   MdDashboard,
//   MdPeople, MdAdUnits, MdReceipt, MdSubscript, MdPayments, MdExtension, MdDescription, MdAttachMoney, MdRateReview, MdCheckCircle, MdBusinessCenter,
//   MdWork, MdTimeline,
//   MdCategory,
//   MdBusiness,
//   MdApartment,
//   MdArticle,
//   MdImage,
//   MdNotifications,
//   MdSettings,
//   MdSecurity,
//   MdLock,
//   MdViewModule, MdLanguage, MdLocationCity,
//   MdSchool,
//   MdSubdirectoryArrowRight,
//   MdLibraryBooks,
//   MdAssignment,
//   MdSupervisorAccount,
//   MdCardGiftcard,
//   MdLocalOffer, MdWorkOutline
// };

// const Sidebar = () => {
//   const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
//   const dispatch = useDispatch();
//   const { user } = useAuth();

//   // Get user initials for avatar fallback
//   const getUserInitials = () => {
//     if (!user) return "U";
//     const name = user.name || "";
//     if (name.length === 0) return user.email?.charAt(0).toUpperCase() || "U";
//     const parts = name.trim().split(" ");
//     if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
//     return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
//   };

//   // Get avatar URL or fallback
//   const avatarUrl = user?.image
//     ? `https://apidata.hiremejobs.in/uploads/${user.image}` // adjust base URL if needed
//     : null;

//   return (
//     <>
//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-20 bg-black/50 lg:hidden"
//           onClick={() => dispatch(toggleSidebar())}
//         />
//       )}

//       <aside
//         className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-[#F4F5FA] transition-all duration-300 ${sidebarOpen ? "w-68" : "w-0 lg:w-16"} overflow-hidden`}
//       >
//         {/* Logo */}
//       <div className="flex justify-center bg-white border-b border-[#4529f7]">
//           <div className="w-full h-16 rounded-xl flex items-center justify-center overflow-hidden ">
//             <img 
//               src={HireMeLogo} 
//               alt="Hire Me Logo" 
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
//           {menuItems.map((group, index) => (
//             <div key={index}>
//               {sidebarOpen && (
//                 <p className="px-3 mb-1 text-[10px] font-semibold text-gray-200 uppercase tracking-wider whitespace-nowrap">
//                   {group.group}
//                 </p>
//               )}
//               <ul className="space-y-0.5">
//                 {group.items.map((item) => {
//                   const Icon = iconMap[item.icon];
//                   return (
//                     <li key={item.path}>
//                       <NavLink
//                         to={item.path}
//                         className={({ isActive }) =>
//                           `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors duration-150 group ${isActive
//                             ? "bg-[#2c0eee] text-gray-200"
//                             : "text-gray-200 hover:bg-white/10 hover:text-gray-200"
//                           }`
//                         }
//                         title={!sidebarOpen ? item.label : ""}
//                       >
//                         {Icon && <Icon size={20} className="flex-shrink-0" />}
//                         {sidebarOpen && (
//                           <span className="text-sm font-medium whitespace-nowrap">
//                             {item.label}
//                           </span>
//                         )}
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           ))}
//         </nav>

//         {/* Footer - User Info */}
//         <div className="p-3 border-t border-white/10">
//           <div className="flex items-center gap-3 px-2">

//             {sidebarOpen && (
//               <div className="min-w-0">
//                 <p className="text-sm font-medium text-gray-200 truncate">
//                   {user?.name || "User"}
//                 </p>
//                 <p className="text-xs text-gray-200 truncate">
//                   {user?.email || "No email"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slices/uiSlice";
import { menuItems } from "../../config/menu";
import HireMeLogo from "../../assets/HiremeLogoWhite.png"
// import HireMeLogo from "../../assets/Logo.png"
import {
  MdDashboard,
  MdPeople,
  MdWork,
  MdCategory,
  MdBusiness,
  MdApartment,
  MdSchool,
  MdSubdirectoryArrowRight,
  MdArticle,
  MdImage,
  MdNotifications,
  MdSettings,
  MdSecurity,
  MdLock,
  MdClose,
  MdViewModule, MdLocationCity, MdLanguage,
  MdLibraryBooks,
  MdAssignment, MdMarkEmailUnread,
  MdSupervisorAccount, MdTimeline,
  MdCardGiftcard,
  MdLocalOffer, MdWorkOutline, MdAdUnits, MdReceipt, MdAttachMoney, MdRateReview, MdCheckCircle, MdBusinessCenter, MdSubscript, MdPayments, MdExtension, MdDescription,
  MdKeyboardArrowDown, MdWeb, MdQuestionAnswer, MdFormatQuote,MdHelpOutline ,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const iconMap = {
  MdDashboard, MdWeb, MdQuestionAnswer, MdFormatQuote,MdHelpOutline ,
  MdPeople, MdAdUnits, MdReceipt, MdSubscript, MdPayments, MdExtension, MdDescription, MdAttachMoney, MdRateReview, MdCheckCircle, MdBusinessCenter,
  MdWork, MdTimeline,
  MdCategory,
  MdBusiness,
  MdApartment,
  MdArticle,
  MdImage,
  MdNotifications,
  MdSettings,
  MdSecurity,
  MdLock,
  MdViewModule, MdLanguage, MdLocationCity,
  MdSchool,
  MdSubdirectoryArrowRight,
  MdLibraryBooks,
  MdAssignment,
  MdSupervisorAccount, MdMarkEmailUnread,
  MdCardGiftcard,
  MdLocalOffer, MdWorkOutline
};

const Sidebar = () => {
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const location = useLocation();

  // Tracks which dropdown groups are expanded, keyed by label
  const [openGroups, setOpenGroups] = useState({});

  // Auto-expand a group if the current route matches one of its children
  useEffect(() => {
    const matched = {};
    menuItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) => location.pathname.startsWith(child.path));
        if (isChildActive) matched[item.label] = true;
      }
    });
    if (Object.keys(matched).length) {
      setOpenGroups((prev) => ({ ...prev, ...matched }));
    }
  }, [location.pathname]);

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.name || "";
    if (name.length === 0) return user.email?.charAt(0).toUpperCase() || "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Get avatar URL or fallback
  const avatarUrl = user?.image
    ? `https://apidata.hiremejobs.in/uploads/${user.image}` // adjust base URL if needed
    : null;

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors duration-150 group ${isActive
      ? "bg-[#F61D25] text-gray-200"
      : "text-gray-200 hover:bg-white/10 hover:text-gray-200"
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col h-screen bg-black transition-all duration-300 ${sidebarOpen ? "w-[272px]" : "w-0 lg:w-16"} overflow-hidden`}
      >
        {/* Logo */}
        <div className="flex justify-center bg-black ">
          <div className="w-full h-16 rounded-xl flex items-center justify-center overflow-hidden ">
            <img
              src={HireMeLogo}
              alt="Hire Me Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-4 space-y-6 px-2">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon];

              // --- Dropdown group (has children) ---
              if (item.children && item.children.length) {
                const isOpen = !!openGroups[item.label];
                const isGroupActive = item.children.some((child) =>
                  location.pathname.startsWith(child.path)
                );

                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.label)}
                      title={!sidebarOpen ? item.label : ""}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors duration-150 group ${isGroupActive
                        ? "text-gray-200"
                        : "text-gray-200 hover:bg-white/10 hover:text-gray-200"
                        }`}
                    >
                      {Icon && <Icon size={20} className="flex-shrink-0" />}
                      {sidebarOpen && (
                        <>
                          <span className="text-sm font-medium whitespace-nowrap flex-1 text-left">
                            {item.label}
                          </span>
                          <MdKeyboardArrowDown
                            size={18}
                            className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </>
                      )}
                    </button>

                    {/* Sub-menu */}
                    {sidebarOpen && isOpen && (
                      <ul className="mt-0.5 ml-4 pl-3 border-l border-gray-300 space-y-0.5 max-h-64 overflow-y-auto">
                        {item.children.map((child) => {
                          const ChildIcon = iconMap[child.icon];
                          return (
                            <li key={child.path}>
                              <NavLink to={child.path} className={linkClasses}>
                                {ChildIcon && (
                                  <ChildIcon size={18} className="flex-shrink-0" />
                                )}
                                <span className="text-sm font-medium whitespace-nowrap">
                                  {child.label}
                                </span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              // --- Direct link (no children) ---
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={linkClasses}
                    title={!sidebarOpen ? item.label : ""}
                  >
                    {Icon && <Icon size={20} className="flex-shrink-0" />}
                    {sidebarOpen && (
                      <span className="text-sm font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - User Info */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">

            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-200 truncate">
                  {user?.email || "No email"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;