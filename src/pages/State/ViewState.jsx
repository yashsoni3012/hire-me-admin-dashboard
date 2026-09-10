// // pages/skills/ViewSkill.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import skillsService from '../../services/skills.service';
// import { showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// const ViewSkill = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});

//   // Get user name from user ID - show ID if name not found
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     // If name exists in cache, return it, otherwise return the ID
//     return userNameCache[userId] || userId;
//   };

//   // Fetch skill data
//   useEffect(() => {
//     const fetchSkill = async () => {
//       setLoading(true);

//       try {
//         // ==========================================
//         // 1. Fetch users for Created By / Updated By
//         // ==========================================
//         const users = await fetchUsers();
//         console.log("Users API:", users);

//         const userMap = {};

//         // Handle both array and object responses
//         if (Array.isArray(users)) {
//           users.forEach(user => {
//             userMap[String(user.id)] = user.name;
//           });
//         } else {
//           Object.keys(users || {}).forEach(userId => {
//             userMap[String(userId)] = users[userId]?.name;
//           });
//         }

//         console.log("User Map:", userMap);
//         setUserNameCache(userMap);

//         // ==========================================
//         // 2. Fetch skill by ID
//         // ==========================================
//         const response = await skillsService.getById(id);
//         console.log("Skill API response:", response);

//         const result = response?.data || response;
//         const data = result?.data || result;
//         console.log("Extracted skill data:", data);

//         if (data && data.id) {
//           // ==========================================
//           // 3. Determine status
//           // ==========================================
//           let isActive = false;

//           if (data.is_status !== undefined && data.is_status !== null) {
//             isActive = data.is_status === true || data.is_status === 1 || data.is_status === "1" || data.is_status === "true";
//           } else if (data.status !== undefined && data.status !== null) {
//             isActive = data.status === true || data.status === 1 || data.status === "1" || data.status === "true" || data.status === "active";
//           }

//           // ==========================================
//           // 4. Prepare form data
//           // ==========================================
//           const formData = {
//             skill_name: data.skill_name || data.name || "",
//             status: isActive ? "active" : "inactive",
//             is_trending: data.is_trending === true || data.is_trending === 1 || data.is_trending === "1",
//             // ─── Store user IDs for mapping ──────────────────────
//             created_by: data.created_by || null,
//             updated_by: data.updated_by || null,
//             created_at: data.created_at || data.createdAt || null,
//             updated_at: data.updated_at || data.updatedAt || null,
//           };

//           console.log("Skill Form Data:", formData);
//           setInitialData(formData);
//           setViewData(data);

//         } else {
//           showError("Skill not found");
//           navigate("/skills");
//         }

//       } catch (error) {
//         console.error("Fetch skill error:", error);
//         showError(error.message || "Failed to load skill data");
//         navigate("/skills");

//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchSkill();
//     }
//   }, [id, navigate]);

//   // Edit skill
//   const handleEdit = () => {
//     navigate(`/skills/edit/${id}`);
//   };

//   // ==========================================
//   // Form fields
//   // ==========================================
//   const fields = [
//     {
//       name: "skill_name",
//       label: "Skill Name",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//           value === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
//         }`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${value === "active" ? "bg-green-500" : "bg-gray-400"}`} />
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
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//           value ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"
//         }`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-yellow-500" : "bg-gray-400"}`} />
//           {value ? "Trending" : "Not Trending"}
//         </span>
//       ),
//     },
//     // ==========================================
//     // Created By - shows ID if name not found
//     // ==========================================
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
//     // ==========================================
//     // Created At
//     // ==========================================
//     {
//       name: "created_at",
//       label: "Created At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
//     // ==========================================
//     // Updated By - shows ID if name not found
//     // ==========================================
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
//     // ==========================================
//     // Updated At
//     // ==========================================
//     {
//       name: "updated_at",
//       label: "Updated At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
//   ];

//   // ==========================================
//   // Loading
//   // ==========================================
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading skill details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   // ==========================================
//   // View Page
//   // ==========================================
//   return (
//     <FormPage
//       title="Skill Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/skills"
//       breadcrumb={`Viewing: ${viewData?.skill_name || viewData?.name || "Skill"}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Skill"
//       cancelLabel="Back to Skills"
//     />
//   );
// };

// export default ViewSkill;

// pages/states/ViewState.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdPerson,
  MdLocationOn,
  MdTrendingUp,
} from 'react-icons/md';
import { stateService } from '../../services/state.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

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
const ViewState = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [stateData, setStateData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  // ─── Fetch users for audit names ────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[id] = users[id].name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);

  // ─── Fetch state data ──────────────────────────────────────────
  useEffect(() => {
    const fetchState = async () => {
      setLoading(true);
      try {
        const response = await stateService.getById(id);
        const data = response?.data || response;

        if (data) {
          setStateData({
            id: data.id,
            name: data.name || '',
            is_status: data.is_status !== undefined ? data.is_status : true,
            is_trending: data.is_trending || false,
            created_by: data.created_by || null,
            updated_by: data.updated_by || null,
            created_at: data.created_at || null,
            updated_at: data.updated_at || null,
          });
        } else {
          showError('State not found');
          navigate('/states');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load state data');
        navigate('/states');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchState();
    }
  }, [id, navigate]);

  // ─── Helper: get user name ────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    return userNameCache[userId] || `User ${userId}`;
  };

  const handleBack = () => navigate('/states');
  const handleEdit = () => {
    navigate(`/states/edit/${id}`);
  };

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading state details...</p>
        </div>
      </div>
    );
  }

  if (!stateData) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const stateName = stateData.name || 'State';
  const status = stateData.is_status ? 'active' : 'inactive';
  const isTrending = stateData.is_trending || false;
  const createdDate = stateData.created_at ? formatDate(stateData.created_at) : '—';
  const updatedDate = stateData.updated_at ? formatDate(stateData.updated_at) : '—';

  const initials = stateName
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
                <FieldLabel>State Name</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-lg">{stateName}</span>
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
              <div>
                <FieldLabel>ID</FieldLabel>
                <ReadOnlyValue>#{stateData.id}</ReadOnlyValue>
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
                    {stateData.created_by ? getUserNameCached(stateData.created_by) : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>{createdDate}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated By</FieldLabel>
                  <ReadOnlyValue>
                    {stateData.updated_by ? getUserNameCached(stateData.updated_by) : '—'}
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
     {/* ─── Sticky action bar (light header) ─────────────────── */}
<div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

    {/* Left side */}
    <div className="flex items-center gap-3 min-w-0">

      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
        aria-label="Back"
      >
        <MdArrowBack size={19} />
      </button>

      {/* Divider */}
      <div className="hidden sm:block h-7 w-px bg-slate-200" />

      {/* Page title */}
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400 leading-tight">
          States
        </p>

        <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
          {stateName}
        </p>
      </div>
    </div>

    {/* Right side */}
    <div className="flex items-center gap-2 flex-shrink-0">

      {/* Edit button */}
      <button
        type="button"
        onClick={handleEdit}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-all duration-200"
      >
        <MdEdit size={16} />
        <span className="hidden xs:inline sm:inline">
          Edit State
        </span>
      </button>
    </div>

  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero (dark gradient) ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
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
                  {initials || <MdLocationOn size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {stateName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">ID: #{stateData.id}</span>
                  {stateData.created_at && (
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
                {stateData.created_by ? getUserNameCached(stateData.created_by) : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdHistory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Last Updated</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {updatedDate}
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
                      layoutId="view-state-tab-underline"
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
          Back to States
        </button>
      </div>
    </div>
  );
};

export default ViewState;