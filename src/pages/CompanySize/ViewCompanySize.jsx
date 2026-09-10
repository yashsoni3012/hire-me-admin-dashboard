// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import { showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE =
//   import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// // Helper: Extract size from name
// const extractSizeFromName = (name) => {
//   if (!name) return 0;

//   const trimmedName = name.trim();
//   const lowerName = trimmedName.toLowerCase();

//   if (lowerName.includes("immediate") || lowerName.includes("0 day")) {
//     return 0;
//   }

//   const rangeMatch = trimmedName.match(/(\d+)\s*[-–—]\s*(\d+)/);
//   if (rangeMatch) {
//     return parseInt(rangeMatch[2]);
//   }

//   const plusMatch = trimmedName.match(/(\d+)\s*\+/);
//   if (plusMatch) {
//     return parseInt(plusMatch[1]);
//   }

//   const upToMatch = trimmedName.match(
//     /(?:up to|upto|less than|under)\s*(\d+)/i,
//   );
//   if (upToMatch) {
//     return parseInt(upToMatch[1]);
//   }

//   const moreThanMatch = trimmedName.match(/(?:more than|over|above)\s*(\d+)/i);
//   if (moreThanMatch) {
//     return parseInt(moreThanMatch[1]);
//   }

//   const numberMatch = trimmedName.match(/\d+/);
//   if (numberMatch) {
//     return parseInt(numberMatch[0]);
//   }

//   return 0;
// };

// const normalizeCompanySizeData = (payload) => {
//   if (!payload || typeof payload !== "object") return null;

//   const nested =
//     payload.data &&
//     typeof payload.data === "object" &&
//     !Array.isArray(payload.data)
//       ? payload.data
//       : payload;

//   const data =
//     nested.data &&
//     typeof nested.data === "object" &&
//     !Array.isArray(nested.data)
//       ? nested.data
//       : nested;

//   if (
//     !data ||
//     (data.id === undefined &&
//       data.name === undefined &&
//       data.company_size_name === undefined &&
//       data.company_size_slug === undefined)
//   ) {
//     return null;
//   }

//   return {
//     id: data.id ?? data._id ?? null,
//     name: data.name || data.company_size_name || "",
//     slug: data.slug || data.company_size_slug || "",
//     size:
//       data.size ??
//       extractSizeFromName(data.name || data.company_size_name || ""),
//     is_status:
//       data.is_status === true ||
//       data.is_status === "true" ||
//       data.is_status === 1 ||
//       data.status === true ||
//       data.status === "active",
//     is_trending:
//       data.is_trending === true ||
//       data.is_trending === "true" ||
//       data.is_trending === 1 ||
//       data.is_trending === "1",
//     created_by: data.created_by ?? null,
//     updated_by: data.updated_by ?? null,
//     created_at: data.created_at || data.createdAt || null,
//     updated_at: data.updated_at || data.updatedAt || null,
//   };
// };

// const ViewCompanySize = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});
//   const token = localStorage.getItem("token");

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     const key = String(userId);
//     return userNameCache[key] || `User ${userId}`;
//   };

//   // Fetch company size data
//   useEffect(() => {
//     let isMounted = true;

//     const fetchCompanySize = async () => {
//       setLoading(true);
//       try {
//         const users = await fetchUsers().catch(() => ({}));
//         const userMap = {};
//         Object.keys(users || {}).forEach((key) => {
//           userMap[String(key)] = users[key]?.name ?? users[key];
//         });
//         if (isMounted) setUserNameCache(userMap);

//         const headers = { Accept: "application/json" };
//         if (token) {
//           headers.Authorization = `Bearer ${token}`;
//         }

//         const response = await fetch(`${API_BASE}/company-sizes/${id}`, {
//           headers,
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error ${response.status}`);
//         }

//         const result = await response.json();
//         const data = normalizeCompanySizeData(result);

//         if (data && (data.id !== null || data.name || data.slug)) {
//           const formData = {
//             company_size_name: data.name || "",
//             company_size_slug: data.slug || "",
//             size: data.size ?? 0,
//             status: data.is_status ? "active" : "inactive",
//             is_trending: data.is_trending || false,
//             created_by: data.created_by ?? "-",
//             updated_by: data.updated_by ?? "-",
//             created_at: data.created_at || null,
//             updated_at: data.updated_at || null,
//           };

//           if (isMounted) {
//             setInitialData(formData);
//             setViewData(data);
//           }
//         } else {
//           showError("Company size not found");
//           if (isMounted) navigate("/company-sizes");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load company size data");
//         if (isMounted) navigate("/company-sizes");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     if (id) {
//       fetchCompanySize();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [id, navigate, token]);

//   const handleEdit = () => {
//     navigate(`/company-sizes/edit/${id}`);
//   };

//   // Form fields configuration - view only
//   const fields = [
//     {
//       name: "company_size_name",
//       label: "Company Size",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "company_size_slug",
//       label: "Slug",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-500 text-sm">{value || "—"}</span>
//       ),
//     },
//     {
//       name: "size",
//       label: "Size",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-600">{value || "—"}</span>
//       ),
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span
//           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//             value === "active"
//               ? "bg-green-50 text-green-700"
//               : "bg-gray-100 text-gray-500"
//           }`}
//         >
//           <span
//             className={`w-1.5 h-1.5 rounded-full ${
//               value === "active" ? "bg-green-500" : "bg-gray-400"
//             }`}
//           />
//           {value === "active" ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//     {
//       name: "is_trending",
//       label: "Trending",
//       type: "checkbox",
//       readonly: true,
//       viewRender: (value) => (
//         <span
//           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//             value ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"
//           }`}
//         >
//           <span
//             className={`w-1.5 h-1.5 rounded-full ${
//               value ? "bg-yellow-500" : "bg-gray-400"
//             }`}
//           />
//           {value ? "Trending" : "Not Trending"}
//         </span>
//       ),
//     },
//     {
//       name: "created_by",
//       label: "Created By",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const name = getUserNameCached(value);
//         return <span className="text-gray-600">{name}</span>;
//       },
//     },
//     {
//       name: "updated_by",
//       label: "Updated By",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const name = getUserNameCached(value);
//         return <span className="text-gray-600">{name}</span>;
//       },
//     },
//     {
//       name: "created_at",
//       label: "Created At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (value ? formatDate(value) : "—"),
//     },
//     {
//       name: "updated_at",
//       label: "Updated At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (value ? formatDate(value) : "—"),
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">
//             Loading company size details...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Company Size Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/company-sizes"
//       breadcrumb={`Viewing: ${viewData?.name || viewData?.company_size_name || "Company Size"}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Company Size"
//       cancelLabel="Back to Company Sizes"
//     />
//   );
// };

// export default ViewCompanySize;


// pages/company-sizes/ViewCompanySize.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdPerson,
  MdTrendingUp,
  MdBusiness,
} from "react-icons/md";
import { showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// ─── Helper: Extract size from name ──────────────────────────────
const extractSizeFromName = (name) => {
  if (!name) return 0;

  const trimmedName = name.trim();
  const lowerName = trimmedName.toLowerCase();

  if (lowerName.includes("immediate") || lowerName.includes("0 day")) {
    return 0;
  }

  const rangeMatch = trimmedName.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (rangeMatch) {
    return parseInt(rangeMatch[2]);
  }

  const plusMatch = trimmedName.match(/(\d+)\s*\+/);
  if (plusMatch) {
    return parseInt(plusMatch[1]);
  }

  const upToMatch = trimmedName.match(
    /(?:up to|upto|less than|under)\s*(\d+)/i,
  );
  if (upToMatch) {
    return parseInt(upToMatch[1]);
  }

  const moreThanMatch = trimmedName.match(/(?:more than|over|above)\s*(\d+)/i);
  if (moreThanMatch) {
    return parseInt(moreThanMatch[1]);
  }

  const numberMatch = trimmedName.match(/\d+/);
  if (numberMatch) {
    return parseInt(numberMatch[0]);
  }

  return 0;
};

const normalizeCompanySizeData = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  const nested =
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
      ? payload.data
      : payload;

  const data =
    nested.data &&
    typeof nested.data === "object" &&
    !Array.isArray(nested.data)
      ? nested.data
      : nested;

  if (
    !data ||
    (data.id === undefined &&
      data.name === undefined &&
      data.company_size_name === undefined &&
      data.company_size_slug === undefined)
  ) {
    return null;
  }

  return {
    id: data.id ?? data._id ?? null,
    name: data.name || data.company_size_name || "",
    slug: data.slug || data.company_size_slug || "",
    size:
      data.size ??
      extractSizeFromName(data.name || data.company_size_name || ""),
    is_status:
      data.is_status === true ||
      data.is_status === "true" ||
      data.is_status === 1 ||
      data.status === true ||
      data.status === "active",
    is_trending:
      data.is_trending === true ||
      data.is_trending === "true" ||
      data.is_trending === 1 ||
      data.is_trending === "1",
    created_by: data.created_by ?? null,
    updated_by: data.updated_by ?? null,
    created_at: data.created_at || data.createdAt || null,
    updated_at: data.updated_at || data.updatedAt || null,
  };
};

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
    icon: MdCheckCircle,
  },
  inactive: {
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
    dot: 'bg-slate-400',
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
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

const TrendingBadge = ({ trending }) => {
  if (!trending) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
      <MdTrendingUp size={12} />
      Trending
    </span>
  );
};

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
  </label>
);

const ReadOnlyValue = ({ children }) => (
  <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
    {children || '—'}
  </div>
);

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: MdInfo },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const ViewCompanySize = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [companySizeData, setCompanySizeData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const token = localStorage.getItem("token");

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    const key = String(userId);
    return userNameCache[key] || `User ${userId}`;
  };

  // ─── Fetch company size data ─────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const fetchCompanySize = async () => {
      setLoading(true);
      try {
        const users = await fetchUsers().catch(() => ({}));
        const userMap = {};
        Object.keys(users || {}).forEach((key) => {
          userMap[String(key)] = users[key]?.name ?? users[key];
        });
        if (isMounted) setUserNameCache(userMap);

        const headers = { Accept: "application/json" };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}/company-sizes/${id}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const result = await response.json();
        const data = normalizeCompanySizeData(result);

        if (data && (data.id !== null || data.name || data.slug)) {
          if (isMounted) setCompanySizeData(data);
        } else {
          showError("Company size not found");
          if (isMounted) navigate("/company-sizes");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load company size data");
        if (isMounted) navigate("/company-sizes");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchCompanySize();
    }

    return () => {
      isMounted = false;
    };
  }, [id, navigate, token]);

  const handleEdit = () => {
    navigate(`/company-sizes/edit/${id}`);
  };

  const handleBack = () => navigate('/company-sizes');

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading company size details...</p>
        </div>
      </div>
    );
  }

  if (!companySizeData) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const companySizeName = companySizeData.name || 'Company Size';
  const slug = companySizeData.slug || '';
  const size = companySizeData.size ?? 0;
  const status = companySizeData.is_status ? 'active' : 'inactive';
  const isTrending = companySizeData.is_trending || false;
  const createdDate = companySizeData.created_at ? formatDate(companySizeData.created_at) : '—';
  const updatedDate = companySizeData.updated_at ? formatDate(companySizeData.updated_at) : '—';

  const initials = companySizeName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Render tab content ──────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Company Size</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-lg">{companySizeName}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Slug</FieldLabel>
                <ReadOnlyValue>
                  <span className="text-sm text-slate-500">{slug || '—'}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Size</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-semibold text-slate-900 text-lg">{size}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <ReadOnlyValue>
                  <StatusPill status={status} />
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Trending</FieldLabel>
                <ReadOnlyValue>
                  {isTrending ? <TrendingBadge trending={true} /> : 'No'}
                </ReadOnlyValue>
              </div>
           
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdHistory size={16} />
                  Audit Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <FieldLabel>Created By</FieldLabel>
                  <ReadOnlyValue>
                    {companySizeData.created_by ? getUserNameCached(companySizeData.created_by) : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>{createdDate}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated By</FieldLabel>
                  <ReadOnlyValue>
                    {companySizeData.updated_by ? getUserNameCached(companySizeData.updated_by) : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated At</FieldLabel>
                  <ReadOnlyValue>{updatedDate}</ReadOnlyValue>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ──────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar (light) ───────────────────────── */}
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
              <p className="text-[11px] text-slate-400 leading-tight">Company Sizes</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {companySizeName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
            >
              <MdEdit size={16} />
              Edit Company Size
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero (fixed dark gradient) ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdBusiness size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {companySizeName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">Size: {size}</span>
                  {slug && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70">Slug: {slug}</span>
                    </>
                  )}
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">ID: #{companySizeData.id}</span>
                  {companySizeData.created_at && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70">Created: {createdDate}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip (light) ────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdInfo size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Size</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {size}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdTrendingUp size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Trending</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {isTrending ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Created By</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {companySizeData.created_by ? getUserNameCached(companySizeData.created_by) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs (light theme) ───────────────────────────────── */}
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
                    active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="view-company-size-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
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
          Back to Company Sizes
        </button>
      </div>
    </div>
  );
};

export default ViewCompanySize;