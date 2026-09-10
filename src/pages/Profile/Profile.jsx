// import { useState } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import Input from '../../components/common/Input'
// import Button from '../../components/common/Button'
// import authService from '../../services/auth.service'
// import { showSuccess, showError } from '../../utils/toast'
// import { getInitials } from '../../utils/helpers'
// import { MdPerson, MdLock } from 'react-icons/md'

// const Profile = () => {
//   const { user } = useAuth()
//   const [activeTab, setActiveTab] = useState('profile')
//   const [saving, setSaving] = useState(false)
//   const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '', phone: user?.phone || '' })
//   const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm_password: '' })

//   const handleProfileSave = async (e) => {
//     e.preventDefault(); setSaving(true)
//     try { await authService.updateProfile(form); showSuccess('Profile updated') }
//     catch { showError('Failed to update profile') } finally { setSaving(false) }
//   }

//   const handlePasswordChange = async (e) => {
//     e.preventDefault()
//     if (pwForm.new_password !== pwForm.confirm_password) { showError('Passwords do not match'); return }
//     setSaving(true)
//     try { await authService.changePassword(pwForm); showSuccess('Password changed'); setPwForm({ old_password: '', new_password: '', confirm_password: '' }) }
//     catch { showError('Failed to change password') } finally { setSaving(false) }
//   }

//   return (
//     <div className="max-w-2xl space-y-4">
//       <h2 className="text-xl font-bold text-gray-900">My Profile</h2>

//       {/* Avatar Card */}
//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
//         <div className="w-20 h-20 rounded-full bg-[#2c0eee] flex items-center justify-center text-white text-2xl font-bold">
//           {getInitials(`${form.first_name} ${form.last_name}`)}
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">{form.first_name} {form.last_name}</h3>
//           <p className="text-gray-500">{form.email}</p>
//           <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-[#2c0eee] capitalize">{user?.role || 'Admin'}</span>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//         <div className="flex border-b border-gray-100">
//           {[{ id: 'profile', label: 'Profile Info', icon: MdPerson }, { id: 'password', label: 'Change Password', icon: MdLock }].map(t => {
//             const Icon = t.icon
//             return (
//               <button key={t.id} onClick={() => setActiveTab(t.id)}
//                 className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === t.id ? 'border-[#2c0eee] text-[#2c0eee] bg-blue-50/50' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
//                 <Icon size={16} />{t.label}
//               </button>
//             )
//           })}
//         </div>

//         <div className="p-6">
//           {activeTab === 'profile' && (
//             <form onSubmit={handleProfileSave} className="space-y-5">
//               <div className="grid grid-cols-2 gap-4">
//                 <Input label="First Name" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
//                 <Input label="Last Name" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
//               </div>
//               <Input label="Email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
//               <Input label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
//               <Button type="submit" loading={saving}>Save Changes</Button>
//             </form>
//           )}

//           {activeTab === 'password' && (
//             <form onSubmit={handlePasswordChange} className="space-y-5">
//               <Input label="Current Password" type="password" required value={pwForm.old_password} onChange={e => setPwForm({...pwForm, old_password: e.target.value})} />
//               <Input label="New Password" type="password" required value={pwForm.new_password} onChange={e => setPwForm({...pwForm, new_password: e.target.value})} />
//               <Input label="Confirm New Password" type="password" required value={pwForm.confirm_password} onChange={e => setPwForm({...pwForm, confirm_password: e.target.value})} />
//               <Button type="submit" loading={saving}>Change Password</Button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile

// pages/profile/Profile.jsx
import { useState } from "react";
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
  MdErrorOutline,
  MdInfoOutline,
  MdSave,
  MdVpnKey,
  MdShield,
  MdCheckCircle,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/auth.service";
import { showSuccess, showError } from "../../utils/toast";
import { getInitials } from "../../utils/helpers";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const TextInput = ({
  label,
  required,
  icon: Icon,
  error,
  hint,
  rightSlot,
  className = "",
  ...props
}) => (
  <div className={className}>
    <FieldLabel required={required}>{label}</FieldLabel>
    <div className="relative">
      {Icon && (
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? "pl-10" : "pl-3.5"} ${
          rightSlot ? "pr-12" : "pr-4"
        } py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        } bg-white`}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}
    </div>
    {error ? (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    ) : hint ? (
      <p className="text-xs text-slate-500 mt-1.5">{hint}</p>
    ) : null}
  </div>
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
  { id: "profile", label: "Profile Info", icon: MdPerson },
  { id: "password", label: "Change Password", icon: MdLock },
];

// ─── Main Component ─────────────────────────────────────────────
const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [pwError, setPwError] = useState(null);

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [pwForm, setPwForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ─── Handlers (logic unchanged) ──────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile(form);
      showSuccess("Profile updated");
    } catch {
      showError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(null);
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("Passwords do not match");
      showError("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword(pwForm);
      showSuccess("Password changed");
      setPwForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch {
      setPwError("Failed to change password");
      showError("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // ─── Hero helpers ────────────────────────────────────────────
  const fullName = `${form.first_name} ${form.last_name}`.trim() || "User";
  const initials =
    getInitials(`${form.first_name} ${form.last_name}`) ||
    (fullName[0]?.toUpperCase() ?? "U");
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Admin";

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form
            onSubmit={handleProfileSave}
            className="space-y-5 max-w-2xl"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextInput
                label="First Name"
                required
                icon={MdPerson}
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                placeholder="John"
              />
              <TextInput
                label="Last Name"
                required
                icon={MdPerson}
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                placeholder="Doe"
              />
              <TextInput
                label="Email"
                type="email"
                required
                icon={MdEmail}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                className="sm:col-span-2"
              />
              <TextInput
                label="Phone"
                icon={MdPhone}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="9876543210"
                className="sm:col-span-2"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdSave size={16} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

       
          </form>
        );

      case "password":
        return (
          <form
            onSubmit={handlePasswordChange}
            className="space-y-5 max-w-xl"
            autoComplete="off"
          >
            {pwError && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-200 rounded-lg">
                <MdErrorOutline
                  size={16}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-red-700 leading-relaxed">
                  {pwError}
                </p>
              </div>
            )}

            <TextInput
              label="Current Password"
              type={showOld ? "text" : "password"}
              required
              icon={MdLock}
              value={pwForm.old_password}
              onChange={(e) =>
                setPwForm({ ...pwForm, old_password: e.target.value })
              }
              placeholder="Enter your current password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showOld ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              }
            />

            <TextInput
              label="New Password"
              type={showNew ? "text" : "password"}
              required
              icon={MdVpnKey}
              value={pwForm.new_password}
              onChange={(e) =>
                setPwForm({ ...pwForm, new_password: e.target.value })
              }
              placeholder="Enter your new password (min 6 characters)"
              hint="Minimum 6 characters. Use a mix of letters, numbers and symbols."
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showNew ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              }
            />

            <TextInput
              label="Confirm New Password"
              type={showConfirm ? "text" : "password"}
              required
              icon={MdLock}
              value={pwForm.confirm_password}
              onChange={(e) =>
                setPwForm({ ...pwForm, confirm_password: e.target.value })
              }
              placeholder="Re-enter your new password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              }
            />

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdShield size={16} />
                )}
                {saving ? "Updating..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPwForm({
                    old_password: "",
                    new_password: "",
                    confirm_password: "",
                  });
                  setPwError(null);
                }}
                disabled={saving}
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
                My Profile
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
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {fullName}
                  </h1>
                  {user?.role && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-400/20 text-indigo-200 ring-1 ring-indigo-400/30 capitalize">
                      <MdAdminPanelSettings size={12} />
                      {roleLabel}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {form.email && (
                    <span className="text-xs text-white/70">
                      {form.email}
                    </span>
                  )}
                  {form.phone && (
                    <span className="text-xs text-white/70">
                      • {form.phone}
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
                {fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdEmail size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Email</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {form.email || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPhone size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Phone</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {form.phone || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBadge size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Role</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {roleLabel}
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
                      layoutId="profile-tab-underline"
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

export default Profile;