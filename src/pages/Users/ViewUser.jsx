// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import userService from '../../services/user.service';
// import { showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// // A record only counts as "updated" if updatedAt is meaningfully later
// // than createdAt. Most backends set updatedAt = createdAt on insert, so
// // without this check the view page falsely shows an "Updated At" value.
// const wasActuallyUpdated = (createdAt, updatedAt) => {
//   if (!createdAt || !updatedAt) return false;
//   const created = new Date(createdAt).getTime();
//   const updated = new Date(updatedAt).getTime();
//   if (Number.isNaN(created) || Number.isNaN(updated)) return false;
//   return updated - created > 2000; // 2s tolerance for insert-time drift
// };

// const ViewUser = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const getImageUrl = (path) => {
//     if (!path) return null;
//     if (path.startsWith("http://") || path.startsWith("https://")) return path;
//     return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
//   };

//   // Fetch a single role's name by its ID.
//   // Tries a direct /role/:id endpoint first, falls back to fetching the
//   // full role list and matching client-side.
//   const fetchRoleName = async (roleId) => {
//     if (!roleId) return "No Role";

//     try {
//       const res = await axios.get(`${API_BASE}/role/${roleId}`);
//       const role = res.data?.data || res.data;
//       if (role?.role_name || role?.name) {
//         return role.role_name || role.name;
//       }
//     } catch (err) {
//       // Single-role endpoint may not exist or may 404 — fall back below.
//     }

//     try {
//       const res = await axios.get(`${API_BASE}/role`);
//       const list = Array.isArray(res.data?.data)
//         ? res.data.data
//         : Array.isArray(res.data)
//         ? res.data
//         : [];

//       const numericId = typeof roleId === 'string' ? parseInt(roleId, 10) : roleId;
//       const match = list.find((r) => {
//         const rId = typeof r.id === 'string' ? parseInt(r.id, 10) : r.id;
//         return rId === numericId;
//       });

//       return match?.role_name || match?.name || `Role ${roleId}`;
//     } catch (err) {
//       return `Role ${roleId}`;
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const response = await userService.getById(id);
//         const result = response?.data || response;
//         const data = result?.data || result;

//         if (data && data.id) {
//           const roleName = await fetchRoleName(data.role_id);

//           // Only show updatedAt if the record was genuinely edited
//           const updated = wasActuallyUpdated(data.createdAt, data.updatedAt)
//             ? data.updatedAt
//             : null;

//           const formData = {
//             name: data.name || "",
//             email: data.email || "",
//             mobile: data.mobile || null,
//             image: data.image || null,
//             role_name: roleName,
//             role_id: data.role_id,
//             status: data.status || "inactive",
//             created_at: data.createdAt || null,
//             updated_at: updated,
//             reset_token: data.reset_token ? "Set" : "Not Set",
//             otp: data.otp ? "Set" : "Not Set",
//           };

//           setInitialData(formData);
//           setViewData(data);
//         } else {
//           showError("User not found");
//           navigate('/users');
//         }
//       } catch (error) {
//         showError(error.message || "Failed to load user data");
//         navigate('/users');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       loadData();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/users/edit/${id}`);
//   };

//   const fields = [
//     {
//       name: "name",
//       label: "Full Name",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "email",
//       label: "Email",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-600">{value}</span>
//       ),
//     },
//     {
//       name: "mobile",
//       label: "Mobile",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "image",
//       label: "Profile Image",
//       type: "file",
//       readonly: true,
//       viewRender: (value) => {
//         if (!value) return <span className="text-gray-400">No image</span>;
//         const fullUrl = getImageUrl(value);
//         return (
//           <div className="relative group inline-block">
//             <img
//               src={fullUrl}
//               alt="Profile"
//               className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
//               onError={(e) => {
//                 e.target.style.display = 'none';
//               }}
//             />
//             <button
//               onClick={() => window.open(fullUrl, '_blank')}
//               className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white"
//               title="Click to view image"
//             >
//               <span className="text-xs">View</span>
//             </button>
//           </div>
//         );
//       },
//     },
//     {
//       name: "role_name",
//       label: "Role",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
//           {value || "User"}
//         </span>
//       ),
//     },
//     // {
//     //   name: "status",
//     //   label: "Status",
//     //   type: "text",
//     //   readonly: true,
//     //   viewRender: (value) => (
//     //     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//     //       value === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
//     //     }`}>
//     //       <span className={`w-1.5 h-1.5 rounded-full ${value === "active" ? "bg-green-500" : "bg-gray-400"}`} />
//     //       {value === "active" ? "Active" : "Inactive"}
//     //     </span>
//     //   ),
//     // },
//     {
//       name: "created_at",
//       label: "Created At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
//     {
//       name: "updated_at",
//       label: "Updated At",
//       type: "text",
//       readonly: true,
//       // updated_at is already null unless it was a genuine edit
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
//     // {
//     //   name: "reset_token",
//     //   label: "Reset Token",
//     //   type: "text",
//     //   readonly: true,
//     //   viewRender: (value) => (
//     //     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//     //       value === "Set" ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"
//     //     }`}>
//     //       <span className={`w-1.5 h-1.5 rounded-full ${value === "Set" ? "bg-yellow-500" : "bg-gray-400"}`} />
//     //       {value}
//     //     </span>
//     //   ),
//     // },
//     // {
//     //   name: "otp",
//     //   label: "OTP",
//     //   type: "text",
//     //   readonly: true,
//     //   viewRender: (value) => (
//     //     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//     //       value === "Set" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"
//     //     }`}>
//     //       <span className={`w-1.5 h-1.5 rounded-full ${value === "Set" ? "bg-blue-500" : "bg-gray-400"}`} />
//     //       {value}
//     //     </span>
//     //   ),
//     // },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading user details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="User Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/users"
//       breadcrumb={`Viewing: ${viewData?.name || 'User'}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit User"
//       cancelLabel="Back to Users"
//     />
//   );
// };

// export default ViewUser;

// pages/users/ViewUser.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdPerson,
  MdEmail,
  MdPhone,
  MdAdminPanelSettings,
  MdFlag,
  MdCheckCircle,
  MdErrorOutline,
  MdDateRange,
  MdInfoOutline,
  MdImage,
  MdPhoto,
  MdVpnKey,
  MdLock,
  MdShield,
} from "react-icons/md";
import { showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import userService from "../../services/user.service";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
  </label>
);

// ─── Status pill ────────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    icon: MdErrorOutline,
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.inactive;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ─── Record token pill ──────────────────────────────────────────
const TokenPill = ({ label, isSet, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    yellow: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  const style = isSet
    ? colorMap[color]
    : "bg-slate-100 text-slate-500 ring-1 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {isSet ? <MdLock size={12} /> : <MdErrorOutline size={12} />}
      {label}
    </span>
  );
};

// ─── Helpers ────────────────────────────────────────────────────
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

// A record only counts as "updated" if updatedAt is meaningfully later
// than createdAt. Most backends set updatedAt = createdAt on insert, so
// without this check the view page falsely shows an "Updated At" value.
const wasActuallyUpdated = (createdAt, updatedAt) => {
  if (!createdAt || !updatedAt) return false;
  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(created) || Number.isNaN(updated)) return false;
  return updated - created > 2000; // 2s tolerance for insert-time drift
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdInfoOutline },
  { id: "account", label: "Account", icon: MdShield },
  { id: "metadata", label: "Metadata", icon: MdDateRange },
];

// ─── Main Component ─────────────────────────────────────────────
const ViewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Fetch role name ─────────────────────────────────────────
  const fetchRoleName = async (roleId) => {
    if (!roleId) return "No Role";

    try {
      const res = await axios.get(`${API_BASE}/role/${roleId}`);
      const role = res.data?.data || res.data;
      if (role?.role_name || role?.name) {
        return role.role_name || role.name;
      }
    } catch (err) {
      // Single-role endpoint may not exist or may 404 — fall back below.
    }

    try {
      const res = await axios.get(`${API_BASE}/role`);
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      const numericId =
        typeof roleId === "string" ? parseInt(roleId, 10) : roleId;
      const match = list.find((r) => {
        const rId = typeof r.id === "string" ? parseInt(r.id, 10) : r.id;
        return rId === numericId;
      });

      return match?.role_name || match?.name || `Role ${roleId}`;
    } catch (err) {
      return `Role ${roleId}`;
    }
  };

  // ─── Load user data ──────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await userService.getById(id);
        const result = response?.data || response;
        const data = result?.data || result;

        if (data && data.id) {
          const roleName = await fetchRoleName(data.role_id);

          // Only show updatedAt if the record was genuinely edited
          const updated = wasActuallyUpdated(data.createdAt, data.updatedAt)
            ? data.updatedAt
            : null;

          setUserData({
            id: data.id,
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || null,
            image: data.image || null,
            role_name: roleName,
            role_id: data.role_id,
            status: data.status || "inactive",
            created_at: data.createdAt || null,
            updated_at: updated,
            reset_token: data.reset_token ? "Set" : "Not Set",
            otp: data.otp ? "Set" : "Not Set",
          });
        } else {
          showError("User not found");
          navigate("/users");
        }
      } catch (error) {
        showError(error.message || "Failed to load user data");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleEdit = () => navigate(`/users/edit/${id}`);
  const handleBack = () => navigate("/users");

  // ─── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = userData.name?.trim() || "User";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const imageUrl = getImageUrl(userData.image);
  const createdDate = userData.created_at
    ? formatDate(userData.created_at)
    : "—";
  const updatedDate = userData.updated_at
    ? formatDate(userData.updated_at)
    : "—";

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <FieldLabel>Full Name</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={userData.name}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <FieldLabel>Email</FieldLabel>
                <div className="relative">
                  <MdEmail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={userData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <FieldLabel>Mobile</FieldLabel>
                <div className="relative">
                  <MdPhone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={userData.mobile || "—"}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <FieldLabel>Role</FieldLabel>
                <div className="pt-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                    <MdAdminPanelSettings size={13} />
                    {userData.role_name || "User"}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <FieldLabel>Status</FieldLabel>
                <div className="pt-1.5">
                  <StatusPill status={userData.status} />
                </div>
              </div>

              {/* Profile Image */}
              <div className="sm:col-span-2">
                <FieldLabel>Profile Image</FieldLabel>
                {imageUrl ? (
                  <div className="relative group inline-block">
                    <img
                      src={imageUrl}
                      alt={heroName}
                      className="w-28 h-28 rounded-xl object-cover border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      onClick={() => window.open(imageUrl, "_blank")}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-medium"
                      title="Click to view image"
                    >
                      View
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-28 h-28 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <MdPhoto className="text-slate-400" size={32} />
                    </div>
                    <span className="text-sm text-slate-400">No image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Role ID */}
              <div>
                <FieldLabel>Role ID</FieldLabel>
                <div className="relative">
                  <MdAdminPanelSettings
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={userData.role_id ?? "—"}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <FieldLabel>Status</FieldLabel>
                <div className="pt-1.5">
                  <StatusPill status={userData.status} />
                </div>
              </div>

              {/* Reset Token */}
              <div>
                <FieldLabel>Reset Token</FieldLabel>
                <div className="pt-1.5">
                  <TokenPill
                    label={userData.reset_token}
                    isSet={userData.reset_token === "Set"}
                    color="yellow"
                  />
                </div>
              </div>

              {/* OTP */}
              <div>
                <FieldLabel>OTP</FieldLabel>
                <div className="pt-1.5">
                  <TokenPill
                    label={userData.otp}
                    isSet={userData.otp === "Set"}
                    color="blue"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "metadata":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Created At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={createdDate}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={updatedDate}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>User ID</FieldLabel>
                <div className="relative">
                  <MdVpnKey
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={`#${userData.id}`}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
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
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">Users</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdCancel size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
            >
              <MdEdit size={16} />
              Edit User
            </button>
          </div>
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
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={heroName}
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
                    {heroName}
                  </h1>
                  <StatusPill status={userData.status} />
                  {userData.role_name && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-400/20 text-indigo-200 ring-1 ring-indigo-400/30">
                      <MdAdminPanelSettings size={12} />
                      {userData.role_name}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {userData.email && (
                    <span className="text-xs text-white/70">
                      {userData.email}
                    </span>
                  )}
                  {userData.mobile && (
                    <span className="text-xs text-white/70">
                      • {userData.mobile}
                    </span>
                  )}
                  <span className="text-xs text-white/50">
                    ID: #{userData.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAdminPanelSettings
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Role</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {userData.role_name || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdFlag size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {userData.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Created
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {createdDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdImage size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Image</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {imageUrl ? "Available" : "None"}
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
                      layoutId="view-user-tab-underline"
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

        {/* Mobile-only back button */}
        <button
          type="button"
          onClick={handleBack}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Back to Users
        </button>
      </div>
    </div>
  );
};

export default ViewUser;