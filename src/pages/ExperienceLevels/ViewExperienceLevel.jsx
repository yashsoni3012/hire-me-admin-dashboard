// // pages/experience-levels/ViewExperienceLevel.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { experienceLevelService } from '../../services/experienceLevel.service';
// import { showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// // ─── Helper: Parse API date format ──────────────────────────────
// const parseApiDate = (dateString) => {
//   if (!dateString) return null;
  
//   if (dateString instanceof Date) return dateString;
//   if (typeof dateString === 'string' && dateString.includes('T')) {
//     const d = new Date(dateString);
//     if (!isNaN(d)) return d;
//   }
  
//   const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i);
//   if (match) {
//     let [_, day, month, year, hours, minutes, seconds, ampm] = match;
//     hours = parseInt(hours);
//     if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
//     if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
//     return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, parseInt(minutes), parseInt(seconds));
//   }
  
//   const d = new Date(dateString);
//   return !isNaN(d) ? d : null;
// };

// // ─── Helper: Format date with time ──────────────────────────────
// const formatDateTime = (date) => {
//   if (!date) return '—';
  
//   const parsed = typeof date === 'string' ? parseApiDate(date) : date;
//   if (!parsed || isNaN(parsed)) return '—';
  
//   return parsed.toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
// };

// const ViewExperienceLevel = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // ─── Format experience range ────────────────────────────────────
//   const formatExperienceRange = (min, max) => {
//     if (min === 0 && max === 0) return "Fresher";
//     if (min === max) return `${min} year${min > 1 ? 's' : ''}`;
//     return `${min} - ${max} years`;
//   };

//   // ─── Fetch experience level data ──────────────────────────────
//   useEffect(() => {
//     const fetchExperienceLevel = async () => {
//       setLoading(true);
//       try {
//         // ─── Fetch users for names ──────────────────────────────
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach(id => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);

//         // ─── Fetch experience level ──────────────────────────────
//         console.log(`Fetching experience level with ID: ${id}`);
//         const response = await experienceLevelService.getById(id);
//         console.log('Raw response:', response);
        
//         // ─── Handle different response structures ────────────────
//         let data = response?.data || response;
        
//         // If response has a data property with the actual data
//         if (response?.data?.data) {
//           data = response.data.data;
//         }
        
//         console.log('Extracted data:', data);
        
//         if (data && data.id) {
//           // ─── Parse dates ─────────────────────────────────────────
//           const createdAt = data.created_at || data.createdAt || null;
//           const updatedAt = data.updated_at || data.updatedAt || null;

//           const formData = {
//             name: data.name || "",
//             min_year: data.min_year || 0,
//             max_year: data.max_year || 0,
//             status: data.is_status ? "active" : "inactive",
//             is_trending: data.is_trending || false,
//             // ─── Audit Fields ──────────────────────────────────────
//             created_by: data.created_by || "-",
//             updated_by: data.updated_by || "-",
//             created_at: createdAt,
//             updated_at: updatedAt,
//           };
//           console.log('Form data prepared:', formData);
//           setInitialData(formData);
//           setViewData(data);
//         } else {
//           console.error('No data or missing ID:', data);
//           showError("Experience level not found");
//           navigate('/experience-levels');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         console.error('Error response:', error.response);
//         console.error('Error status:', error.response?.status);
//         console.error('Error data:', error.response?.data);
//         showError(error.message || "Failed to load experience level data");
//         navigate('/experience-levels');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchExperienceLevel();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/experience-levels/edit/${id}`);
//   };

//   // ─── Form fields configuration - view only ─────────────────────
//   const fields = [
//     {
//       name: "name",
//       label: "Experience Level",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "experience_range",
//       label: "Experience Range",
//       type: "text",
//       readonly: true,
//       viewRender: (value, formData) => {
//         const min = formData?.min_year || 0;
//         const max = formData?.max_year || 0;
//         return (
//           <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
//             {formatExperienceRange(min, max)}
//           </span>
//         );
//       },
//     },
//     {
//       name: "min_year",
//       label: "Minimum Years",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-600">{value} year{value > 1 ? 's' : ''}</span>
//       ),
//     },
//     {
//       name: "max_year",
//       label: "Maximum Years",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-600">{value} year{value > 1 ? 's' : ''}</span>
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
//             value
//               ? "bg-yellow-50 text-yellow-700"
//               : "bg-gray-100 text-gray-500"
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
//     // ─── Audit: Created By (Same as Department) ──────────────────
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
//     // ─── Audit: Created At ──────────────────────────────────────
//     {
//       name: "created_at",
//       label: "Created At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         if (!value) return <span className="text-gray-400">—</span>;
//         return (
//           <div className="flex flex-col">
//             <span className="text-gray-700">{formatDateTime(value)}</span>
//           </div>
//         );
//       },
//     },
//     // ─── Audit: Updated By (Same as Department) ──────────────────
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
//     // ─── Audit: Updated At ──────────────────────────────────────
//     {
//       name: "updated_at",
//       label: "Updated At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         if (!value) return <span className="text-gray-400">—</span>;
//         return (
//           <div className="flex flex-col">
//             <span className="text-gray-700">{formatDateTime(value)}</span>
//           </div>
//         );
//       },
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading experience level details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Experience Level Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/experience-levels"
//       breadcrumb={`Viewing: ${viewData?.name || 'Experience Level'}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Experience Level"
//       cancelLabel="Back to Experience Levels"
//     />
//   );
// };

// export default ViewExperienceLevel;

// pages/experience-levels/ViewExperienceLevel.jsx
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
  MdTrendingUp,
  MdTimeline,
} from 'react-icons/md';
import { experienceLevelService } from '../../services/experienceLevel.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

// ─── Helper: Parse API date format ──────────────────────────────
const parseApiDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  if (typeof dateString === 'string' && dateString.includes('T')) {
    const d = new Date(dateString);
    if (!isNaN(d)) return d;
  }
  const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i);
  if (match) {
    let [_, day, month, year, hours, minutes, seconds, ampm] = match;
    hours = parseInt(hours);
    if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, parseInt(minutes), parseInt(seconds));
  }
  const d = new Date(dateString);
  return !isNaN(d) ? d : null;
};

// ─── Helper: Format date with time ──────────────────────────────
const formatDateTime = (date) => {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseApiDate(date) : date;
  if (!parsed || isNaN(parsed)) return '—';
  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
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
const ViewExperienceLevel = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  // Get user name with caching — coerce key to string so numeric IDs match
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    const key = String(userId);
    return userNameCache[key] || `User ${userId}`;
  };

  // ─── Format experience range ───────────────────────────────
  const formatExperienceRange = (min, max) => {
    if (min === 0 && max === 0) return 'Fresher';
    if (min === max) return `${min} year${min > 1 ? 's' : ''}`;
    return `${min} - ${max} years`;
  };

  // ─── Fetch experience level data ──────────────────────────
  useEffect(() => {
    const fetchExperienceLevel = async () => {
      setLoading(true);
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users || {}).forEach((uid) => {
          userMap[uid] = users[uid]?.name ?? users[uid];
        });
        setUserNameCache(userMap);

        const response = await experienceLevelService.getById(id);
        let data = response?.data || response;
        if (response?.data?.data) {
          data = response.data.data;
        }

        if (data && data.id) {
          const createdAt = data.created_at || data.createdAt || null;
          const updatedAt = data.updated_at || data.updatedAt || null;

          setLevelData({
            id: data.id,
            name: data.name || '',
            min_year: data.min_year || 0,
            max_year: data.max_year || 0,
            status: data.is_status ? 'active' : 'inactive',
            is_trending: data.is_trending || false,
            created_by: data.created_by || null,
            updated_by: data.updated_by || null,
            created_at: createdAt,
            updated_at: updatedAt,
          });
        } else {
          showError('Experience level not found');
          navigate('/experience-levels');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load experience level data');
        navigate('/experience-levels');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperienceLevel();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/experience-levels/edit/${id}`);
  };

  const handleBack = () => navigate('/experience-levels');

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading experience level details...</p>
        </div>
      </div>
    );
  }

  if (!levelData) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const levelName = levelData.name || 'Experience Level';
  const status = levelData.status || 'inactive';
  const isTrending = levelData.is_trending || false;
  const minYear = levelData.min_year ?? 0;
  const maxYear = levelData.max_year ?? 0;
  const rangeDisplay = formatExperienceRange(minYear, maxYear);
  const createdDate = levelData.created_at ? formatDateTime(levelData.created_at) : '—';
  const updatedDate = levelData.updated_at ? formatDateTime(levelData.updated_at) : '—';

  const initials = levelName
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
                <FieldLabel>Experience Level</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-lg">{levelName}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Experience Range</FieldLabel>
                <ReadOnlyValue>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {rangeDisplay}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Minimum Years</FieldLabel>
                <ReadOnlyValue>
                  {minYear} year{minYear > 1 ? 's' : ''}
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Maximum Years</FieldLabel>
                <ReadOnlyValue>
                  {maxYear} year{maxYear > 1 ? 's' : ''}
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
                    {levelData.created_by ? getUserNameCached(levelData.created_by) : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>{createdDate}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated By</FieldLabel>
                  <ReadOnlyValue>
                    {levelData.updated_by ? getUserNameCached(levelData.updated_by) : '—'}
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
              <p className="text-[11px] text-slate-400 leading-tight">Experience Levels</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {levelName}
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
              Edit Level
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
                  {initials || <MdTimeline size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {levelName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">{rangeDisplay}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">ID: #{levelData.id}</span>
                  {levelData.created_at && (
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
            <MdTimeline size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Range</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {rangeDisplay}
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
                {levelData.created_by ? getUserNameCached(levelData.created_by) : '—'}
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
                      layoutId="view-exp-level-tab-underline"
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
          Back to Experience Levels
        </button>
      </div>
    </div>
  );
};

export default ViewExperienceLevel;