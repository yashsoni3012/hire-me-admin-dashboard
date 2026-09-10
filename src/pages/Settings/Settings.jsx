// import { useState } from 'react';
// import axios from 'axios';
// import Input from '../../components/common/Input';
// import Button from '../../components/common/Button';
// import { showSuccess, showError } from '../../utils/toast';
// import { useAuth } from '../../context/AuthContext';
// import { MdPerson, MdLock } from 'react-icons/md';

// const tabs = [
//   { id: 'profile', label: 'Profile', icon: MdPerson },
//   { id: 'reset-password', label: 'Reset Password', icon: MdLock },
// ];

// const Settings = () => {
//   const { token, user } = useAuth();

//   const [activeTab, setActiveTab] = useState('profile');

//   // Reset Password state
//   const [resetData, setResetData] = useState({
//     oldPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [resetLoading, setResetLoading] = useState(false);
//   const [resetError, setResetError] = useState(null);

//   // Handle password reset with the exact payload expected by the API
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setResetError(null);

//     const { oldPassword, newPassword, confirmPassword } = resetData;

//     if (!oldPassword || !newPassword || !confirmPassword) {
//       setResetError('All fields are required');
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setResetError('New password and confirm password do not match');
//       return;
//     }
//     if (newPassword.length < 6) {
//       setResetError('New password must be at least 6 characters');
//       return;
//     }
//     if (!user?.email) {
//       setResetError('User email not found. Please login again.');
//       return;
//     }

//     setResetLoading(true);
//     try {
//       // Payload exactly as shown in Postman: email, oldPassword, newPassword, confirmPassword
//       const payload = {
//         email: user.email,
//         oldPassword: oldPassword,
//         newPassword: newPassword,
//         confirmPassword: confirmPassword,
//       };

//       const response = await axios.patch(
//         'https://apidata.hiremejobs.in/user/reset-password/',
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         showSuccess(response.data.message || 'Password reset successfully');
//         setResetData({
//           oldPassword: '',
//           newPassword: '',
//           confirmPassword: '',
//         });
//         setResetError(null);
//       } else {
//         showError(response.data.message || 'Failed to reset password');
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || err.message || 'An error occurred';
//       setResetError(errorMsg);
//       showError(errorMsg);
//     } finally {
//       setResetLoading(false);
//     }
//   };

//   // Role mapping
//   const getRoleName = (roleId) => {
//     const roles = {
//       1: 'Super Admin',
//       2: 'Admin',
//       3: 'Manager',
//       4: 'User',
//     };
//     return roles[roleId] || `Role ${roleId}`;
//   };

//   // Avatar URL
//   const avatarUrl = user?.image
//     ? `https://apidata.hiremejobs.in/uploads/${user.image}`
//     : null;

//   return (
//     <div className="max-w-7xl space-y-4">
//       <h2 className="text-xl font-bold text-gray-900">Settings</h2>

//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//         {/* Tab Navigation */}
//         <div className="flex border-b border-gray-100 overflow-x-auto">
//           {tabs.map((t) => {
//             const Icon = t.icon;
//             return (
//               <button
//                 key={t.id}
//                 onClick={() => setActiveTab(t.id)}
//                 className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === t.id
//                   ? 'border-[#2c0eee] text-[#2c0eee] bg-blue-50/50'
//                   : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                   }`}
//               >
//                 <Icon size={16} />
//                 {t.label}
//               </button>
//             );
//           })}
//         </div>

//         <div className="p-6">
//           {/* Profile Tab */}
//           {activeTab === 'profile' && (
//             <div className="space-y-6">
//               <div className="flex items-center gap-6">
//                 {avatarUrl ? (
//                   <img
//                     src={avatarUrl}
//                     alt={user?.name || 'User'}
//                     className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//                   />
//                 ) : (
//                   <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-[#2c0eee] text-2xl font-bold">
//                     {user?.name?.charAt(0) || 'U'}
//                   </div>
//                 )}
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900">
//                     {user?.name || 'User'}
//                   </h3>
//                   <p className="text-gray-500">{user?.email}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Full Name
//                   </label>
//                   <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
//                     {user?.name || '—'}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Email Address
//                   </label>
//                   <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
//                     {user?.email || '—'}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Mobile Number
//                   </label>
//                   <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
//                     {user?.mobile || '—'}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Role
//                   </label>
//                   <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
//                     {getRoleName(user?.role_id)}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     User ID
//                   </label>
//                   <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
//                     {user?.id || '—'}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Reset Password Tab */}
//           {activeTab === 'reset-password' && (
//             <form onSubmit={handleResetPassword} className="space-y-5">
//               {resetError && (
//                 <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                   {resetError}
//                 </div>
//               )}
//               <div className="space-y-4">
//                 <Input
//                   label="Old Password"
//                   type="password"
//                   placeholder="Enter your current password"
//                   value={resetData.oldPassword}
//                   onChange={(e) =>
//                     setResetData({
//                       ...resetData,
//                       oldPassword: e.target.value,
//                     })
//                   }
//                   required
//                 />
//                 <Input
//                   label="New Password"
//                   type="password"
//                   placeholder="Enter your new password (min 6 characters)"
//                   value={resetData.newPassword}
//                   onChange={(e) =>
//                     setResetData({ ...resetData, newPassword: e.target.value })
//                   }
//                   required
//                 />
//                 <Input
//                   label="Confirm New Password"
//                   type="password"
//                   placeholder="Re-enter your new password"
//                   value={resetData.confirmPassword}
//                   onChange={(e) =>
//                     setResetData({
//                       ...resetData,
//                       confirmPassword: e.target.value,
//                     })
//                   }
//                   required
//                 />
//               </div>
//               <Button type="submit" loading={resetLoading}>
//                 Change Password
//               </Button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

// pages/settings/Settings.jsx
import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdPerson,
  MdLock,
  MdEmail,
  MdPhone,
  MdAdminPanelSettings,
  MdBadge,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
  MdVpnKey,
  MdShield,
} from "react-icons/md";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const ReadOnlyField = ({ label, value, icon: Icon, className = "" }) => (
  <div className={className}>
    <p className="block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </p>
    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
      {Icon && <Icon size={16} className="text-slate-400 flex-shrink-0" />}
      <span className="text-sm text-slate-800 truncate">
        {value === undefined || value === null || value === "" ? (
          <span className="text-slate-400">—</span>
        ) : (
          value
        )}
      </span>
    </div>
  </div>
);

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "profile", label: "Profile", icon: MdPerson },
  { id: "reset-password", label: "Reset Password", icon: MdLock },
];

// ─── Role mapping ────────────────────────────────────────────────
const getRoleName = (roleId) => {
  const roles = {
    1: "Super Admin",
    2: "Admin",
    3: "Manager",
    4: "User",
  };
  return roles[roleId] || (roleId ? `Role ${roleId}` : "—");
};

// ─── Main Component ─────────────────────────────────────────────
const Settings = () => {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  // Reset Password state
  const [resetData, setResetData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle password reset with the exact payload expected by the API
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError(null);

    const { oldPassword, newPassword, confirmPassword } = resetData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setResetError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 6) {
      setResetError("New password must be at least 6 characters");
      return;
    }
    if (!user?.email) {
      setResetError("User email not found. Please login again.");
      return;
    }

    setResetLoading(true);
    try {
      // Payload exactly as shown in Postman: email, oldPassword, newPassword, confirmPassword
      const payload = {
        email: user.email,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };

      const response = await axios.patch(
        `${API_BASE}/user/reset-password/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess(response.data.message || "Password reset successfully");
        setResetData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setResetError(null);
      } else {
        showError(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "An error occurred";
      setResetError(errorMsg);
      showError(errorMsg);
    } finally {
      setResetLoading(false);
    }
  };

  // ─── Hero helpers ────────────────────────────────────────────
  const userName = user?.name || "User";
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const roleLabel = getRoleName(user?.role_id);

  const avatarUrl = user?.image
    ? user.image.startsWith("http")
      ? user.image
      : `${API_BASE}/uploads/${user.image}`
    : null;

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ReadOnlyField
                label="Full Name"
                value={user?.name}
                icon={MdPerson}
              />
              <ReadOnlyField
                label="Email Address"
                value={user?.email}
                icon={MdEmail}
              />
              <ReadOnlyField
                label="Mobile Number"
                value={user?.mobile}
                icon={MdPhone}
              />
              <ReadOnlyField
                label="Role"
                value={roleLabel}
                icon={MdAdminPanelSettings}
              />
              <ReadOnlyField
                label="User ID"
                value={user?.id}
                icon={MdBadge}
                className="sm:col-span-2"
              />
            </div>

          
          </div>
        );

      case "reset-password":
        return (
          <form
            onSubmit={handleResetPassword}
            className="space-y-5 max-w-xl"
            autoComplete="off"
          >
            {resetError && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-200 rounded-lg">
                <MdErrorOutline
                  size={16}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-red-700 leading-relaxed">
                  {resetError}
                </p>
              </div>
            )}

            {/* Old Password */}
            <div>
              <FieldLabel required>Old Password</FieldLabel>
              <div className="relative">
                <MdLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={resetData.oldPassword}
                  onChange={(e) =>
                    setResetData({
                      ...resetData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showOld ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <FieldLabel required>New Password</FieldLabel>
              <div className="relative">
                <MdVpnKey
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter your new password (min 6 characters)"
                  value={resetData.newPassword}
                  onChange={(e) =>
                    setResetData({
                      ...resetData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showNew ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Minimum 6 characters. Use a mix of letters, numbers and
                symbols.
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <FieldLabel required>Confirm New Password</FieldLabel>
              <div className="relative">
                <MdLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={resetData.confirmPassword}
                  onChange={(e) =>
                    setResetData({
                      ...resetData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={resetLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
              >
                {resetLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdShield size={16} />
                )}
                {resetLoading ? "Updating..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setResetData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })
                }
                disabled={resetLoading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  // ─── Main render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Account
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Settings
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium flex-shrink-0">
            <MdCheckCircle size={13} className="text-emerald-500" />
            Signed in
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdPerson size={24} />}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {userName}
                  </h1>
                  {user?.role_id && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-400/20 text-indigo-200 ring-1 ring-indigo-400/30">
                      <MdAdminPanelSettings size={12} />
                      {roleLabel}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {user?.email && (
                    <span className="text-xs text-white/70">{user.email}</span>
                  )}
                  {user?.mobile && (
                    <span className="text-xs text-white/70">
                      • {user.mobile}
                    </span>
                  )}
                  {user?.id && (
                    <span className="text-xs text-white/50">
                      ID #{user.id}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Name</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {user?.name || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdEmail size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Email</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {user?.email || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAdminPanelSettings
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Role</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {roleLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPhone size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Mobile</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {user?.mobile || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ───────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-200 px-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="settings-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;