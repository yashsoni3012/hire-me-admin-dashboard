// import { useState } from 'react';
// import axios from 'axios';
// import Input from '../../components/common/Input';
// import Button from '../../components/common/Button';
// import { showSuccess, showError } from '../../utils/toast';
// import { useAuth } from '../../context/AuthContext';
// import {
//   MdSettings,
//   MdSecurity,
//   MdNotifications,
//   MdLock,
// } from 'react-icons/md';

// const tabs = [
//   { id: 'general', label: 'General', icon: MdSettings },
//   { id: 'security', label: 'Security', icon: MdSecurity },
//   { id: 'notifications', label: 'Notifications', icon: MdNotifications },
//   { id: 'reset-password', label: 'Reset Password', icon: MdLock },
// ];

// const Settings = () => {
//   const { token } = useAuth(); // Get the JWT token from AuthContext
//   const [activeTab, setActiveTab] = useState('general');
//   const [saving, setSaving] = useState(false);
//   const [general, setGeneral] = useState({
//     app_name: 'CareerAI',
//     support_email: 'support@careerai.in',
//     contact_phone: '+91 98765 43210',
//     timezone: 'Asia/Kolkata',
//   });
//   const [security, setSecurity] = useState({
//     session_timeout: '60',
//     max_login_attempts: '5',
//     require_2fa: false,
//   });
//   const [notifs, setNotifs] = useState({
//     email_new_user: true,
//     email_new_job: false,
//     email_new_application: true,
//   });
//   // Reset Password state – 3 fields
//   const [resetData, setResetData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [resetLoading, setResetLoading] = useState(false);
//   const [resetError, setResetError] = useState(null);

//   const save = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     await new Promise((r) => setTimeout(r, 800));
//     showSuccess('Settings saved');
//     setSaving(false);
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setResetError(null);

//     const { currentPassword, newPassword, confirmPassword } = resetData;

//     // Validations
//     if (!currentPassword || !newPassword || !confirmPassword) {
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

//     setResetLoading(true);
//     try {
//       const response = await axios.post(
//         'https://apidata.hiremejobs.in/user/reset-password',
//         {
//           currentPassword,
//           newPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Send the JWT token for authentication
//           },
//         }
//       );

//       if (response.data.success) {
//         showSuccess(response.data.message || 'Password reset successfully');
//         // Clear fields on success
//         setResetData({
//           currentPassword: '',
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
//                 className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
//                   activeTab === t.id
//                     ? 'border-[#2c0eee] text-[#2c0eee] bg-blue-50/50'
//                     : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 <Icon size={16} />
//                 {t.label}
//               </button>
//             );
//           })}
//         </div>

//         <div className="p-6">
//           {/* General Tab */}
//           {activeTab === 'general' && (
//             <form onSubmit={save} className="space-y-5">
//               <div className="grid grid-cols-2 gap-4">
//                 <Input
//                   label="Application Name"
//                   value={general.app_name}
//                   onChange={(e) =>
//                     setGeneral({ ...general, app_name: e.target.value })
//                   }
//                 />
//                 <Input
//                   label="Support Email"
//                   type="email"
//                   value={general.support_email}
//                   onChange={(e) =>
//                     setGeneral({ ...general, support_email: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <Input
//                   label="Contact Phone"
//                   value={general.contact_phone}
//                   onChange={(e) =>
//                     setGeneral({ ...general, contact_phone: e.target.value })
//                   }
//                 />
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Timezone
//                   </label>
//                   <select
//                     value={general.timezone}
//                     onChange={(e) =>
//                       setGeneral({ ...general, timezone: e.target.value })
//                     }
//                     className="input-field"
//                   >
//                     <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
//                     <option value="UTC">UTC</option>
//                     <option value="America/New_York">America/New_York</option>
//                   </select>
//                 </div>
//               </div>
//               <Button type="submit" loading={saving}>
//                 Save General Settings
//               </Button>
//             </form>
//           )}

//           {/* Security Tab */}
//           {activeTab === 'security' && (
//             <form onSubmit={save} className="space-y-5">
//               <div className="grid grid-cols-2 gap-4">
//                 <Input
//                   label="Session Timeout (minutes)"
//                   type="number"
//                   value={security.session_timeout}
//                   onChange={(e) =>
//                     setSecurity({
//                       ...security,
//                       session_timeout: e.target.value,
//                     })
//                   }
//                 />
//                 <Input
//                   label="Max Login Attempts"
//                   type="number"
//                   value={security.max_login_attempts}
//                   onChange={(e) =>
//                     setSecurity({
//                       ...security,
//                       max_login_attempts: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
//                 <input
//                   type="checkbox"
//                   checked={security.require_2fa}
//                   onChange={(e) =>
//                     setSecurity({
//                       ...security,
//                       require_2fa: e.target.checked,
//                     })
//                   }
//                   className="rounded"
//                 />
//                 <div>
//                   <p className="text-sm font-medium text-gray-800">
//                     Require Two-Factor Authentication
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     All admin users must enable 2FA to log in
//                   </p>
//                 </div>
//               </label>
//               <Button type="submit" loading={saving}>
//                 Save Security Settings
//               </Button>
//             </form>
//           )}

//           {/* Notifications Tab */}
//           {activeTab === 'notifications' && (
//             <form onSubmit={save} className="space-y-3">
//               {[
//                 {
//                   key: 'email_new_user',
//                   label: 'New User Registration',
//                   desc: 'Notify when a new user registers',
//                 },
//                 {
//                   key: 'email_new_job',
//                   label: 'New Job Post',
//                   desc: 'Notify when a new job is posted',
//                 },
//                 {
//                   key: 'email_new_application',
//                   label: 'New Application',
//                   desc: 'Notify when someone applies for a job',
//                 },
//               ].map((n) => (
//                 <label
//                   key={n.key}
//                   className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={notifs[n.key]}
//                     onChange={(e) =>
//                       setNotifs({ ...notifs, [n.key]: e.target.checked })
//                     }
//                     className="rounded"
//                   />
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">
//                       {n.label}
//                     </p>
//                     <p className="text-xs text-gray-500">{n.desc}</p>
//                   </div>
//                 </label>
//               ))}
//               <Button type="submit" loading={saving}>
//                 Save Notification Settings
//               </Button>
//             </form>
//           )}

//           {/* Reset Password Tab – 3 fields */}
//           {activeTab === 'reset-password' && (
//             <form onSubmit={handleResetPassword} className="space-y-5">
//               {resetError && (
//                 <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                   {resetError}
//                 </div>
//               )}
//               <div className="space-y-4">
//                 <Input
//                   label="Current Password"
//                   type="password"
//                   placeholder="Enter your current password"
//                   value={resetData.currentPassword}
//                   onChange={(e) =>
//                     setResetData({
//                       ...resetData,
//                       currentPassword: e.target.value,
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

//   // Default active tab is 'profile'
//   const [activeTab, setActiveTab] = useState('profile');

//   // Reset Password state
//   const [resetData, setResetData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [resetLoading, setResetLoading] = useState(false);
//   const [resetError, setResetError] = useState(null);

//   // Handle password reset
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setResetError(null);

//     const { currentPassword, newPassword, confirmPassword } = resetData;

//     if (!currentPassword || !newPassword || !confirmPassword) {
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

//     setResetLoading(true);
//     try {
//       const response = await axios.post(
//         'https://apidata.hiremejobs.in/user/reset-password',
//         {
//           currentPassword,
//           newPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         showSuccess(response.data.message || 'Password reset successfully');
//         setResetData({
//           currentPassword: '',
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
//                 className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
//                   activeTab === t.id
//                     ? 'border-[#2c0eee] text-[#2c0eee] bg-blue-50/50'
//                     : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
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
//                   label="Current Password"
//                   type="password"
//                   placeholder="Enter your current password"
//                   value={resetData.currentPassword}
//                   onChange={(e) =>
//                     setResetData({
//                       ...resetData,
//                       currentPassword: e.target.value,
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


import { useState } from 'react';
import axios from 'axios';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { MdPerson, MdLock } from 'react-icons/md';

const tabs = [
  { id: 'profile', label: 'Profile', icon: MdPerson },
  { id: 'reset-password', label: 'Reset Password', icon: MdLock },
];

const Settings = () => {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  // Reset Password state
  const [resetData, setResetData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);

  // Handle password reset with the exact payload expected by the API
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError(null);

    const { oldPassword, newPassword, confirmPassword } = resetData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setResetError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('New password and confirm password do not match');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters');
      return;
    }
    if (!user?.email) {
      setResetError('User email not found. Please login again.');
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
        'https://apidata.hiremejobs.in/user/reset-password/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess(response.data.message || 'Password reset successfully');
        setResetData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setResetError(null);
      } else {
        showError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'An error occurred';
      setResetError(errorMsg);
      showError(errorMsg);
    } finally {
      setResetLoading(false);
    }
  };

  // Role mapping
  const getRoleName = (roleId) => {
    const roles = {
      1: 'Super Admin',
      2: 'Admin',
      3: 'Manager',
      4: 'User',
    };
    return roles[roleId] || `Role ${roleId}`;
  };

  // Avatar URL
  const avatarUrl = user?.image
    ? `https://apidata.hiremejobs.in/uploads/${user.image}`
    : null;

  return (
    <div className="max-w-7xl space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === t.id
                  ? 'border-[#2c0eee] text-[#2c0eee] bg-blue-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || 'User'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-[#2c0eee] text-2xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user?.name || 'User'}
                  </h3>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    {user?.name || '—'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    {user?.email || '—'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Mobile Number
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    {user?.mobile || '—'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    {getRoleName(user?.role_id)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    User ID
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    {user?.id || '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reset Password Tab */}
          {activeTab === 'reset-password' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {resetError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {resetError}
                </div>
              )}
              <div className="space-y-4">
                <Input
                  label="Old Password"
                  type="password"
                  placeholder="Enter your current password"
                  value={resetData.oldPassword}
                  onChange={(e) =>
                    setResetData({
                      ...resetData,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password (min 6 characters)"
                  value={resetData.newPassword}
                  onChange={(e) =>
                    setResetData({ ...resetData, newPassword: e.target.value })
                  }
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter your new password"
                  value={resetData.confirmPassword}
                  onChange={(e) =>
                    setResetData({
                      ...resetData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button type="submit" loading={resetLoading}>
                Change Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;