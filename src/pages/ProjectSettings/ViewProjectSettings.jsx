// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import ProjectSettingFormPage from '../../components/common/ProjectSettingFormPage';
// import { projectSettingService } from '../../services/projectSetting.service';
// import { showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// // Coerce various truthy/falsy representations to a real boolean
// const toBool = (val, fallback = false) => {
//   if (val === undefined || val === null || val === '') return fallback;
//   if (val === true || val === 1 || val === '1' || val === 'true') return true;
//   if (val === false || val === 0 || val === '0' || val === 'false') return false;
//   return Boolean(val);
// };

// const ViewProjectSettings = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return '-';
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // ─── Fetch project setting data ────────────────────────────────────
//   useEffect(() => {
//     const fetchSetting = async () => {
//       setLoading(true);
//       try {
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((uid) => {
//           userMap[uid] = users[uid].name;
//         });
//         setUserNameCache(userMap);

//         let item = location.state?.item;

//         if (!item) {
//           const response = await projectSettingService.getById(id);
//           item = response?.data?.data || response?.data || response;
//         }

//         console.log('📥 Fetched item:', item);

//         if (item) {
//           // Shape matches what ProjectSettingFormPage expects in view/edit mode:
//           // is_public as boolean, status as 'active'/'inactive' string.
//           const normalized = {
//             setting_group: item.setting_group || '',
//             setting_key: item.setting_key || '',
//             setting_value:
//               item.setting_value !== undefined && item.setting_value !== null
//                 ? String(item.setting_value)
//                 : '',
//             value_type: item.value_type || 'string',
//             description: item.description || '',
//             is_public: toBool(item.is_public, false),
//             // display_order: item.display_order ?? 0,
//             status: toBool(item.status ?? item.is_status, true) ? 'active' : 'inactive',
//           };

//           setInitialData(normalized);
//           setViewData(item);
//         } else {
//           showError('Project setting not found');
//           navigate('/project-settings');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || 'Failed to load project setting data');
//         navigate('/project-settings');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchSetting();
//     }
//   }, [id, location.state, navigate]);

//   const handleEdit = () => {
//     navigate(`/project-settings/edit/${id}`, { state: { item: viewData } });
//   };

//   // ─── Audit trail rows, passed in as extraViewFields ────────────────
//   const extraViewFields = viewData
//     ? [
//         {
//           label: 'Created By',
//           value: viewData.createdBy?.name || getUserNameCached(viewData.created_by),
//         },
//         {
//           label: 'Updated By',
//           value: viewData.updatedBy?.name || getUserNameCached(viewData.updated_by),
//         },
//         {
//           label: 'Created At',
//           value: viewData.created_at || viewData.createdAt ? formatDate(viewData.created_at || viewData.createdAt) : '—',
//         },
//         {
//           label: 'Updated At',
//           value: viewData.updated_at || viewData.updatedAt ? formatDate(viewData.updated_at || viewData.updatedAt) : '—',
//         },
//       ]
//     : [];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading project setting details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <ProjectSettingFormPage
//       mode="view"
//       initialData={initialData}
//       onEdit={handleEdit}
//       navigateTo="/project-settings"
//       title="Project Setting Details"
//       breadcrumb={`Viewing: ${viewData?.setting_key || 'Project Setting'}`}
//       showEdit={true}
//       editLabel="Edit Setting"
//       cancelLabel="Back to Settings"
//       extraViewFields={extraViewFields}
//     />
//   );
// };

// export default ViewProjectSettings;

// pages/project-settings/ViewProjectSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdSettings,
  MdCategory,
  MdKey,
  MdDescription,
  MdCode,
  MdNumbers,
  MdToggleOn,
  MdUploadFile,
  MdPublic,
  MdLock,
  MdInfoOutline,
  MdPhoto,
  MdSort,
  MdCheckCircle,
  MdTextFields,
  MdHistory,
  MdPerson,
  MdAccessTime,
  MdUpdate,
} from "react-icons/md";
import { projectSettingService } from "../../services/projectSetting.service";
import { showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

// ─── Helpers ────────────────────────────────────────────────────
const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// Coerce various truthy/falsy representations to a real boolean
const toBool = (val, fallback = false) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false")
    return false;
  return Boolean(val);
};

const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

const isImagePath = (path) => {
  if (!path) return false;
  return /\.(jpe?g|png|gif|webp|svg|bmp)$/i.test(path);
};

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <p className="block text-[12px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
    {children}
  </p>
);

const ReadOnlyField = ({ label, value, mono = false, className = "" }) => (
  <div className={className}>
    <FieldLabel>{label}</FieldLabel>
    <p
      className={`text-sm text-slate-800 break-words ${
        mono ? "font-mono" : ""
      }`}
    >
      {value === undefined || value === null || value === "" ? (
        <span className="text-slate-400">—</span>
      ) : (
        value
      )}
    </p>
  </div>
);

// ─── Constants ──────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdSettings },
  { id: "value", label: "Value & Type", icon: MdCode },
  { id: "visibility", label: "Visibility", icon: MdPublic },
  { id: "audit", label: "Audit Trail", icon: MdHistory },
];

const VALUE_TYPE_LABELS = {
  string: "String",
  number: "Number",
  boolean: "Boolean",
  json: "JSON",
  file: "File",
};

const getTypeIcon = (type) => {
  switch (type) {
    case "number":
      return MdNumbers;
    case "boolean":
      return MdToggleOn;
    case "json":
      return MdCode;
    case "file":
      return MdUploadFile;
    default:
      return MdTextFields;
  }
};

// ─── Main Component ─────────────────────────────────────────────
const ViewProjectSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [initialData, setInitialData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // ─── Fetch project setting data ────────────────────────────────
  useEffect(() => {
    const fetchSetting = async () => {
      setLoading(true);
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((uid) => {
          userMap[uid] = users[uid].name;
        });
        setUserNameCache(userMap);

        let item = location.state?.item;

        if (!item) {
          const response = await projectSettingService.getById(id);
          item = response?.data?.data || response?.data || response;
        }

        console.log("📥 Fetched item:", item);

        if (item) {
          // Shape matches what the form expects:
          // is_public as boolean, status as 'active'/'inactive' string.
          const normalized = {
            setting_group: item.setting_group || "",
            setting_key: item.setting_key || "",
            setting_value:
              item.setting_value !== undefined && item.setting_value !== null
                ? String(item.setting_value)
                : "",
            value_type: item.value_type || "string",
            description: item.description || "",
            is_public: toBool(item.is_public, false),
            status: toBool(item.status ?? item.is_status, true)
              ? "active"
              : "inactive",
          };

          setInitialData(normalized);
          setViewData(item);
        } else {
          showError("Project setting not found");
          navigate("/project-settings");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load project setting data");
        navigate("/project-settings");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSetting();
    }
  }, [id, location.state, navigate]);

  const handleEdit = () => {
    navigate(`/project-settings/edit/${id}`, { state: { item: viewData } });
  };

  // ─── Loading state ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">
            Loading project setting details...
          </p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroKey = initialData.setting_key?.trim() || "Setting";
  const heroGroup = initialData.setting_group?.trim() || "—";
  const TypeIcon = getTypeIcon(initialData.value_type);
  const typeLabel =
    VALUE_TYPE_LABELS[initialData.value_type] || initialData.value_type;
  const statusLabel = initialData.status === "active" ? "Active" : "Inactive";

  const createdBy =
    viewData?.createdBy?.name || getUserNameCached(viewData?.created_by);
  const updatedBy =
    viewData?.updatedBy?.name || getUserNameCached(viewData?.updated_by);
  const createdAt =
    viewData?.created_at || viewData?.createdAt
      ? formatDate(viewData?.created_at || viewData?.createdAt)
      : "—";
  const updatedAt =
    viewData?.updated_at || viewData?.updatedAt
      ? formatDate(viewData?.updated_at || viewData?.updatedAt)
      : "—";

  const fileUrl =
    initialData.value_type === "file" && initialData.setting_value
      ? getFileUrl(initialData.setting_value)
      : null;

  // ─── Render Value display (dynamic by type) ──────────────────
  const renderValueDisplay = () => {
    const { value_type, setting_value } = initialData;

    if (value_type === "boolean") {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
            toBool(setting_value, false)
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-slate-100 text-slate-600 ring-slate-200"
          }`}
        >
          <MdToggleOn size={13} />
          {toBool(setting_value, false) ? "True" : "False"}
        </span>
      );
    }

    if (value_type === "json") {
      let pretty = setting_value;
      try {
        pretty = JSON.stringify(JSON.parse(setting_value), null, 2);
      } catch {
        // leave as-is if not parseable
      }
      return (
        <pre className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap break-words">
          {pretty || "—"}
        </pre>
      );
    }

    if (value_type === "file") {
      if (!fileUrl) {
        return <p className="text-sm text-slate-400">No file uploaded</p>;
      }
      return (
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {isImagePath(fileUrl) ? (
              <img
                src={fileUrl}
                alt="File preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <MdUploadFile size={26} className="text-slate-400" />
            )}
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
            >
              {setting_value}
            </a>
            <p className="text-xs text-slate-500">Stored file path</p>
          </div>
        </div>
      );
    }

    // string / number
    return (
      <p
        className={`text-sm text-slate-800 break-words ${
          value_type === "number" ? "font-mono" : ""
        }`}
      >
        {setting_value || <span className="text-slate-400">—</span>}
      </p>
    );
  };

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ReadOnlyField
              label="Setting Group"
              value={initialData.setting_group}
              mono
            />
            <ReadOnlyField
              label="Setting Key"
              value={initialData.setting_key}
              mono
            />
            <ReadOnlyField
              label="Description"
              value={initialData.description}
              className="sm:col-span-2"
            />
          </div>
        );

      case "value":
        return (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel>Value Type</FieldLabel>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
                  <MdCode size={12} />
                  {typeLabel}
                </span>
              </div>
            </div>

            <div>
              <FieldLabel>Setting Value</FieldLabel>
              {renderValueDisplay()}
            </div>
          </div>
        );

      case "visibility":
        return (
          <div className="space-y-5 max-w-2xl">
            {/* is_public */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    initialData.is_public
                      ? "bg-blue-50 text-blue-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {initialData.is_public ? (
                    <MdPublic size={18} />
                  ) : (
                    <MdLock size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    Public Setting
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {initialData.is_public
                      ? "This setting is visible to public APIs and clients."
                      : "This setting is private and only available server-side."}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 flex-shrink-0 ${
                  initialData.is_public
                    ? "bg-blue-50 text-blue-700 ring-blue-200"
                    : "bg-slate-100 text-slate-600 ring-slate-200"
                }`}
              >
                {initialData.is_public ? "Public" : "Private"}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    initialData.status === "active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <MdCheckCircle size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">Status</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {initialData.status === "active"
                      ? "This setting is currently active and applied at runtime."
                      : "This setting is inactive and ignored by the application."}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 flex-shrink-0 ${
                  initialData.status === "active"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-slate-100 text-slate-600 ring-slate-200"
                }`}
              >
                {statusLabel}
              </span>
            </div>

          
          </div>
        );

      case "audit":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                <MdPerson size={18} />
              </div>
              <div className="min-w-0">
                <FieldLabel>Created By</FieldLabel>
                <p className="text-sm text-slate-800 break-words">
                  {createdBy || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                <MdUpdate size={18} />
              </div>
              <div className="min-w-0">
                <FieldLabel>Updated By</FieldLabel>
                <p className="text-sm text-slate-800 break-words">
                  {updatedBy || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                <MdAccessTime size={18} />
              </div>
              <div className="min-w-0">
                <FieldLabel>Created At</FieldLabel>
                <p className="text-sm text-slate-800 break-words">
                  {createdAt}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                <MdAccessTime size={18} />
              </div>
              <div className="min-w-0">
                <FieldLabel>Updated At</FieldLabel>
                <p className="text-sm text-slate-800 break-words">
                  {updatedAt}
                </p>
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
              onClick={() => navigate("/project-settings")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Project Settings · View
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroKey}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/project-settings")}
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
              Edit Setting
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
              {/* Type icon block */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                  <TypeIcon size={32} />
                </div>
              </div>

              {/* Key + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-mono truncate max-w-full">
                    {heroKey}
                  </h1>
                  {initialData.value_type && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-400/20 text-indigo-200 ring-1 ring-indigo-400/30">
                      <MdCode size={12} />
                      {typeLabel}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${
                      initialData.status === "active"
                        ? "bg-emerald-400/20 text-emerald-200 ring-emerald-400/30"
                        : "bg-slate-400/20 text-slate-200 ring-slate-400/30"
                    }`}
                  >
                    <MdCheckCircle size={12} />
                    {statusLabel}
                  </span>
                  {initialData.is_public && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-400/20 text-blue-200 ring-1 ring-blue-400/30">
                      <MdPublic size={12} />
                      Public
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70 font-mono">
                    {heroGroup}
                  </span>
                  {viewData?.display_order !== undefined &&
                    viewData?.display_order !== null && (
                      <span className="text-xs text-white/50">
                        • Order {viewData.display_order}
                      </span>
                    )}
                  <span className="text-xs text-white/50">ID #{id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Group</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {initialData.setting_group || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCode size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Type</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {typeLabel || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdSort size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Display Order
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {viewData?.display_order === undefined ||
                viewData?.display_order === null
                  ? "—"
                  : viewData.display_order}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            {initialData.is_public ? (
              <MdPublic size={16} className="text-slate-400 flex-shrink-0" />
            ) : (
              <MdLock size={16} className="text-slate-400 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Visibility
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {initialData.is_public ? "Public" : "Private"}
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
                      layoutId="view-project-setting-tab-underline"
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

        {/* Mobile-only edit button */}
        <button
          type="button"
          onClick={handleEdit}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
        >
          <MdEdit size={16} />
          Edit Setting
        </button>
      </div>
    </div>
  );
};

export default ViewProjectSettings;