// // pages/industries/IndustryForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { ViewBadge, ViewTrendingBadge } from '../../components/common/FormPageUtils';
// import { industryService } from '../../services/industry.service';
// import { subIndustryService } from '../../services/subIndustry.service';
// import { showSuccess, showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';
// import { useAuth } from '../../context/AuthContext';

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const IndustryForm = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { id } = useParams();
//     const { user } = useAuth();
//     const userId = user?.id;

//     const [mode, setMode] = useState('add'); // 'add' | 'edit' | 'view'
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState(null);
//     const [userNameCache, setUserNameCache] = useState({});
//     const [pageLoading, setPageLoading] = useState(false);
//     const [subIndustries, setSubIndustries] = useState([]);

//     // Determine mode from URL
//     useEffect(() => {
//         const path = location.pathname;
//         if (path.includes('/view/')) {
//             setMode('view');
//         } else if (path.includes('/edit/')) {
//             setMode('edit');
//         } else {
//             setMode('add');
//         }
//     }, [location.pathname]);

//     // Fetch users for display names
//     useEffect(() => {
//         const loadUsers = async () => {
//             try {
//                 const users = await fetchUsers();
//                 const userMap = {};
//                 Object.keys(users).forEach(id => {
//                     userMap[id] = users[id].name;
//                 });
//                 setUserNameCache(userMap);
//             } catch (error) {
//                 console.error('Failed to load users:', error);
//             }
//         };
//         loadUsers();
//     }, []);

//     // Fetch sub-industries to check if industry has children
//     useEffect(() => {
//         const loadSubIndustries = async () => {
//             try {
//                 const r = await subIndustryService.getAll({ limit: 1000 });
//                 const rawData = r.data?.data || r.data?.results || r.data || [];
//                 const subs = Array.isArray(rawData) ? rawData : [];
//                 setSubIndustries(subs);
//             } catch (error) {
//                 console.error('Failed to load sub-industries:', error);
//             }
//         };
//         loadSubIndustries();
//     }, []);

//     // Fetch data for edit/view modes
//     useEffect(() => {
//         const fetchData = async () => {
//             if ((mode === 'edit' || mode === 'view') && id) {
//                 setPageLoading(true);
//                 try {
//                     let item = location.state?.item;

//                     if (!item) {
//                         const response = await industryService.getById(id);
//                         item = response.data;
//                     }

//                     // Normalize the data
//                     const normalizedData = {
//                         id: item.id || item._id,
//                         name: item.name || "",
//                         slug: item.slug || "",
//                         icon: item.icon || null,
//                         is_status: item.is_status !== undefined ? item.is_status : true,
//                         is_trending: item.is_trending || false,
//                         status: item.status !== undefined ? item.status : true,
//                         created_at: item.created_at || item.createdAt || null,
//                         updated_at: item.updated_at || item.updatedAt || null,
//                         created_by: item.created_by || null,
//                         updated_by: item.updated_by || null,
//                     };

//                     setData(normalizedData);
//                 } catch (error) {
//                     console.error('Fetch error:', error);
//                     showError("Failed to load industry data");
//                     navigate('/industries');
//                 } finally {
//                     setPageLoading(false);
//                 }
//             }
//         };
//         fetchData();
//     }, [id, mode, location.state, navigate]);

//     // Helper to get full image URL
//     const getFullImageUrl = (value) => {
//         if (!value) return null;
//         if (value.startsWith('http') || value.startsWith('data:image')) {
//             return value;
//         }
//         if (value.startsWith('/uploads/')) {
//             return `${API_BASE_URL}${value}`;
//         }
//         return value;
//     };

//     // Get user name with caching
//     const getUserNameCached = (userId) => {
//         if (!userId) return "-";
//         return userNameCache[userId] || `User ${userId}`;
//     };

//     // Get status value
//     const getStatusValue = (row) => {
//         if (row?.is_status !== undefined) {
//             return row.is_status;
//         }
//         if (row?.status !== undefined) {
//             return row.status === 1 || row.status === true;
//         }
//         return true;
//     };

//     // Check if industry has sub-industries
//     const getSubIndustryCount = (industryId) => {
//         return subIndustries.filter((sub) => {
//             const parentId = sub.Industry?.id ?? sub.industry_id;
//             return String(parentId) === String(industryId);
//         }).length;
//     };

//     // Define fields for the form
//     const getFields = () => {
//         // Base fields (common for all modes)
//         const baseFields = [
//             {
//                 name: "name",
//                 label: "Industry Name",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. Technology",
//                 help: "Enter a unique name for the industry",
//                 viewRender: (value) => <span className="font-medium text-lg">{value}</span>
//             },
//             {
//                 name: "icon",
//                 label: "Industry Icon",
//                 type: "file",
//                 required: false,
//                 accept: "image/*",
//                 maxSize: 5,
//                 help: "Upload an icon for the industry (PNG, JPG, SVG) - Max 5MB",
//                 placeholder: "Click or drag to upload icon",
//                 viewRender: (value) => {
//                     if (!value) return '—';
//                     const url = getFullImageUrl(value);
//                     return (
//                         <div className="relative group">
//                             <img
//                                 src={url}
//                                 alt="Industry icon"
//                                 className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                                 onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.parentElement.innerHTML = '<span class="text-gray-400">Invalid image</span>';
//                                 }}
//                             />
//                             <button
//                                 onClick={() => window.open(url, '_blank')}
//                                 className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//                             >
//                                 <span className="text-sm">View</span>
//                             </button>
//                         </div>
//                     );
//                 }
//             },
//             {
//                 name: "status",
//                 label: "Status",
//                 type: "radio",
//                 options: [
//                     { value: "active", label: "Active" },
//                     { value: "inactive", label: "Inactive" },
//                 ],
//                 color: "text-[#2c0eee] focus:ring-[#4529f7]",
//                 viewRender: () => {
//                     const isActive =
//                         data?.is_status === true ||
//                         data?.is_status === 1 ||
//                         data?.is_status === "1" ||
//                         data?.is_status === "true";

//                     return <ViewBadge active={isActive} />;
//                 }
//             },
//             {
//                 name: "is_trending",
//                 label: "Mark as Trending",
//                 type: "checkbox",
//                 color: "text-yellow-500 focus:ring-yellow-500",
//                 help: "Trending industries will be highlighted in the listing",
//                 viewRender: (value) => <ViewTrendingBadge isTrending={value} />
//             }
//         ];

//         // ═══════════════════════════════════════════════════════════
//         // 🔹 ONLY ADD AUDIT FIELDS IN VIEW MODE
//         // ═══════════════════════════════════════════════════════════
//         if (mode === 'view') {
//             const auditFields = [
//                 {
//                     name: "created_by",
//                     label: "Created By",
//                     type: "text",
//                     disabled: true,
//                     viewRender: (value) => {
//                         const name = getUserNameCached(value);
//                         return name !== "-" ? name : "System";
//                     }
//                 },
//                 {
//                     name: "updated_by",
//                     label: "Updated By",
//                     type: "text",
//                     disabled: true,
//                     viewRender: (value) => {
//                         if (!value) return '—';
//                         const name = getUserNameCached(value);
//                         return name !== "-" ? name : "System";
//                     }
//                 },
//                 {
//                     name: "created_at",
//                     label: "Created At",
//                     type: "text",
//                     disabled: true,
//                     viewRender: (value) => value ? formatDate(value) : '—'
//                 },
//                 {
//                     name: "updated_at",
//                     label: "Updated At",
//                     type: "text",
//                     disabled: true,
//                     viewRender: (value) => value ? formatDate(value) : '—'
//                 }
//             ];

//             return [...baseFields, ...auditFields];
//         }

//         // For add and edit modes - return only base fields (no audit fields)
//         return baseFields;
//     };

//     // Validation rules
//     const getValidationRules = (existingData) => ({
//         name: {
//             required: true,
//             requiredMessage: 'Industry name is required',
//             minLength: 2,
//             minLengthMessage: 'Industry name must be at least 2 characters',
//             maxLength: 50,
//             maxLengthMessage: 'Industry name must be at most 50 characters',
//             custom: (value) => {
//                 // Check uniqueness
//                 return null; // Will check in submit handler
//             }
//         }
//     });

//     // Submit handler for add/edit
//     const handleSubmit = async (formData) => {
//         setLoading(true);

//         try {
//             const submitData = {
//                 name: formData.name,
//                 status: formData.status,
//                 is_trending: formData.is_trending || false,
//             };

//             // ═══════════════════════════════════════════════════════════
//             // 🔹 SET created_by AND updated_by
//             // ═══════════════════════════════════════════════════════════
//             if (mode === 'edit') {
//                 // For edit: only set updated_by
//                 submitData.updated_by = userId;
//             } else {
//                 // For create: set both created_by and updated_by
//                 submitData.created_by = userId;
//                 submitData.updated_by = userId;
//             }

//             // Check for duplicate name
//             const allData = await industryService.getAll({ limit: 1000 });
//             const existingItems = allData.data?.data || allData.data?.results || allData.data || [];
//             const duplicate = existingItems.some(item =>
//                 item.name.toLowerCase() === formData.name.toLowerCase() &&
//                 (mode === 'add' || item.id !== id)
//             );

//             // if (duplicate) {
//             //     showError('This industry name already exists');
//             //     setLoading(false);
//             //     return;
//             // }

//             if (formData.iconFile instanceof File) {
//                 submitData.iconFile = formData.iconFile;
//             } else if (mode === 'edit' && data?.icon) {
//                 submitData.icon = data.icon;
//             }

//             if (mode === 'edit') {
//                 await industryService.update(id, submitData);
//                 showSuccess("Industry updated successfully");
//             } else {
//                 await industryService.create(submitData);
//                 showSuccess("Industry created successfully");
//             }

//             navigate('/industries');
//         } catch (error) {
//             console.error('Submit error:', error);
//             const errorMessage = error?.message ||
//                 error?.response?.data?.message ||
//                 "Failed to save";
//             showError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete handler
//     const handleDelete = async () => {
//         // Check if industry has sub-industries
//         const childCount = getSubIndustryCount(id);
//         if (childCount > 0) {
//             showError("Cannot delete this industry because it has sub-industries linked to it.");
//             throw new Error("Industry has sub-industries");
//         }

//         try {
//             await industryService.delete(id);
//             showSuccess("Industry deleted successfully");
//             navigate('/industries');
//         } catch (error) {
//             console.error('Delete error:', error);
//             const message = error?.response?.data?.message || error?.message || "";
//             if (/sub[-_ ]?industr|child|foreign\s*key|constraint/i.test(message)) {
//                 showError("Cannot delete this industry because it has sub-industries linked to it.");
//             } else {
//                 showError(message || "Failed to delete industry");
//             }
//             throw error;
//         }
//     };

//     // Prepare initial data
//     const getInitialData = () => {
//         if (mode === 'add') {
//             return {
//                 name: "",
//                 icon: null,
//                 status: "active",
//                 is_trending: false
//             };
//         }

//         if (data) {
//             // Base initial data (common for all modes)
//             const initialData = {
//                 name: data.name || "",
//                 icon: data.icon || null,
//                 status: data.is_status !== undefined ? (data.is_status ? "active" : "inactive") : "active",
//                 is_trending: data.is_trending || false,
//                 slug: data.slug || "",
//             };

//             // ═══════════════════════════════════════════════════════════
//             // 🔹 ONLY ADD AUDIT FIELDS IN VIEW MODE
//             // ═══════════════════════════════════════════════════════════
//             if (mode === 'view') {
//                 initialData.created_by = data.created_by;
//                 initialData.updated_by = data.updated_by;
//                 initialData.created_at = data.created_at;
//                 initialData.updated_at = data.updated_at;
//             }

//             return initialData;
//         }

//         return {
//             name: "",
//             icon: null,
//             status: "active",
//             is_trending: false
//         };
//     };

//     // Get title based on mode
//     const getTitle = () => {
//         if (mode === 'view') return 'Industry Details';
//         if (mode === 'edit') return 'Edit Industry';
//         return 'Add New Industry';
//     };

//     // Get submit label
//     const getSubmitLabel = () => {
//         if (mode === 'edit') return 'Update Industry';
//         return 'Create Industry';
//     };

//     // Handle loading state
//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-3 text-gray-500">Loading industry data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // If view/edit mode and data not loaded, show error
//     if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Industry not found</p>
//                     <button
//                         onClick={() => navigate('/industries')}
//                         className="mt-3 text-[#2c0eee] hover:underline"
//                     >
//                         Go back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <FormPage
//             title={getTitle()}
//             mode={mode}
//             fields={getFields()}
//             initialData={getInitialData()}
//             validationRules={getValidationRules(data)}
//             onSubmit={handleSubmit}
//             onDelete={handleDelete}
//             navigateTo="/industries"
//             submitLabel={getSubmitLabel()}
//             editLabel="Edit Industry"
//             deleteLabel="Delete Industry"
//             loading={loading}
//             showDelete={mode !== 'add'}
//             showEdit={mode === 'view'}
//             enableEditMode={mode === 'view'}
//             breadcrumb={mode === 'view' ? 'Viewing industry details' : mode === 'edit' ? 'Updating industry' : 'Creating new industry'}
//             onEdit={() => navigate(`/industries/edit/${id}`, { state: { item: data } })}
//         />
//     );
// };

// export default IndustryForm;

// pages/industries/IndustryForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdPerson,
  MdTrendingUp,
  MdBusiness,
  MdImage,
  MdCloudUpload,
  MdOpenInNew,
} from 'react-icons/md';
import { industryService } from '../../services/industry.service';
import { subIndustryService } from '../../services/subIndustry.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const API_BASE_URL = 'https://apidata.hiremejobs.in';

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
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const Toggle = ({ checked, onChange, name, disabled }) => (
  <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
    <input
      type="checkbox"
      name={name}
      checked={checked || false}
      onChange={onChange}
      disabled={disabled}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
  </label>
);

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: MdInfo },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const IndustryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id;

  const [mode, setMode] = useState('add');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [subIndustries, setSubIndustries] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: '',
    icon: null,
    status: 'active',
    is_trending: false,
    slug: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  // ─── Determine mode from URL ──────────────────────────────
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/view/')) setMode('view');
    else if (path.includes('/edit/')) setMode('edit');
    else setMode('add');
  }, [location.pathname]);

  // ─── Fetch users ────────────────────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users || {}).forEach((uid) => {
          userMap[uid] = users[uid]?.name ?? users[uid];
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);

  // ─── Fetch sub-industries ──────────────────────────────────
  useEffect(() => {
    const loadSubIndustries = async () => {
      try {
        const r = await subIndustryService.getAll({ limit: 1000 });
        const rawData = r.data?.data || r.data?.results || r.data || [];
        const subs = Array.isArray(rawData) ? rawData : [];
        setSubIndustries(subs);
      } catch (error) {
        console.error('Failed to load sub-industries:', error);
      }
    };
    loadSubIndustries();
  }, []);

  // ─── Fetch data for edit/view ──────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if ((mode === 'edit' || mode === 'view') && id) {
        setPageLoading(true);
        try {
          let item = location.state?.item;
          if (!item) {
            const response = await industryService.getById(id);
            item = response.data;
          }

          const normalizedData = {
            id: item.id || item._id,
            name: item.name || '',
            slug: item.slug || '',
            icon: item.icon || null,
            is_status: item.is_status !== undefined ? item.is_status : true,
            is_trending: item.is_trending || false,
            status: item.status !== undefined ? item.status : true,
            created_at: item.created_at || item.createdAt || null,
            updated_at: item.updated_at || item.updatedAt || null,
            created_by: item.created_by || null,
            updated_by: item.updated_by || null,
          };
          setData(normalizedData);
          setFormValues({
            name: normalizedData.name,
            icon: normalizedData.icon,
            status: normalizedData.is_status ? 'active' : 'inactive',
            is_trending: normalizedData.is_trending,
            slug: normalizedData.slug,
          });
          if (normalizedData.icon) {
            setIconPreview(getFullImageUrl(normalizedData.icon));
          }
        } catch (error) {
          console.error('Fetch error:', error);
          showError('Failed to load industry data');
          navigate('/industries');
        } finally {
          setPageLoading(false);
        }
      }
    };
    fetchData();
  }, [id, mode, location.state, navigate]);

  // ─── Helpers ────────────────────────────────────────────────
  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith('http') || value.startsWith('data:image')) return value;
    if (value.startsWith('/uploads/')) return `${API_BASE_URL}${value}`;
    return value;
  };

  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    const key = String(userId);
    return userNameCache[key] || `User ${userId}`;
  };

  const getSubIndustryCount = (industryId) => {
    return subIndustries.filter((sub) => {
      const parentId = sub.Industry?.id ?? sub.industry_id;
      return String(parentId) === String(industryId);
    }).length;
  };

  // ─── Handlers ──────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        showError('Please upload a valid image file (JPEG, PNG, GIF, WEBP, SVG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result);
      reader.readAsDataURL(file);
      setIconFile(file);
    }
  };

  const handleRemoveIcon = () => {
    setIconPreview(null);
    setIconFile(null);
    setFormValues((prev) => ({ ...prev, icon: null }));
    const el = document.getElementById('icon-upload');
    if (el) el.value = '';
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────
  const validateField = (name, value) => {
    if (name === 'name') {
      if (!value || !value.trim()) return 'Industry name is required';
      if (value.trim().length < 2) return 'Industry name must be at least 2 characters';
      if (value.trim().length > 50) return 'Industry name must be at most 50 characters';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const error = validateField('name', formValues.name);
    if (error) {
      newErrors.name = error;
      isValid = false;
    }

    setErrors(newErrors);
    const allTouched = {};
    Object.keys(formValues).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  // ─── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Please fix validation errors');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: formValues.name,
        status: formValues.status,
        is_trending: formValues.is_trending || false,
      };

      if (mode === 'edit') {
        submitData.updated_by = userId;
      } else {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      if (iconFile instanceof File) {
        submitData.iconFile = iconFile;
      } else if (mode === 'edit' && data?.icon) {
        submitData.icon = data.icon;
      }

      if (mode === 'edit') {
        await industryService.update(id, submitData);
        showSuccess('Industry updated successfully');
      } else {
        await industryService.create(submitData);
        showSuccess('Industry created successfully');
      }

      navigate('/industries');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error?.message || error?.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────
  const handleDelete = async () => {
    const childCount = getSubIndustryCount(id);
    if (childCount > 0) {
      showError('Cannot delete this industry because it has sub-industries linked to it.');
      setShowDeleteDialog(false);
      return;
    }

    setDeleteLoading(true);
    try {
      await industryService.delete(id);
      showSuccess('Industry deleted successfully');
      navigate('/industries');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || '';
      if (/sub[-_ ]?industr|child|foreign\s*key|constraint/i.test(message)) {
        showError('Cannot delete this industry because it has sub-industries linked to it.');
      } else {
        showError(message || 'Failed to delete industry');
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate('/industries');

  // ─── Render helper for fields ──────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, color } = field;
    const value = formValues[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;
    const isViewMode = mode === 'view';

    // ─── View mode ──────────────────────────────────────────
    if (isViewMode) {
      let display = value || '—';
      if (name === 'status') {
        display = <StatusPill status={value} />;
      } else if (name === 'is_trending') {
        display = value ? <TrendingBadge trending={true} /> : 'No';
      } else if (name === 'icon' && iconPreview) {
        display = (
          <div className="relative group inline-block">
            <img
              src={iconPreview}
              alt="Industry icon"
              className="w-20 h-20 rounded-lg object-cover border border-slate-200 shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <button
              onClick={() => window.open(iconPreview, '_blank')}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
            >
              <MdOpenInNew size={16} />
            </button>
          </div>
        );
      }
      return (
        <div key={name} className="mb-4">
          <FieldLabel>{label}</FieldLabel>
          <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
            {display}
          </div>
        </div>
      );
    }

    const commonClass = `w-full px-3.5 py-2.5 border ${hasError ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    let inputElement;
    switch (type) {
      case 'file':
        inputElement = (
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              {iconPreview ? (
                <div className="relative group">
                  <img
                    src={iconPreview}
                    alt={label}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <MdImage size={26} className="text-slate-400" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="hidden"
                  id="icon-upload"
                />
                <label
                  htmlFor="icon-upload"
                  className="px-4 py-2 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium inline-flex items-center gap-2"
                >
                  <MdCloudUpload size={16} />
                  {iconPreview ? 'Change Image' : 'Choose Image'}
                </label>
                <p className="mt-1 text-xs text-slate-400">PNG, JPG, SVG (Max 5MB)</p>
              </div>
            </div>
          </div>
        );
        break;
      case 'radio':
        inputElement = (
          <div className="flex flex-wrap gap-4 pt-1.5">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={String(value) === String(opt.value)}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500 ${color || ''}`}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
        break;
      case 'checkbox':
        inputElement = (
          <div className="flex items-center gap-3 pt-1.5">
            <Toggle
              name={name}
              checked={Boolean(value)}
              onChange={handleInputChange}
            />
            <span className="text-sm text-slate-600">{value ? 'Enabled' : 'Disabled'}</span>
          </div>
        );
        break;
      default:
        inputElement = (
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={commonClass}
          />
        );
    }

    return (
      <div key={name} className="mb-4">
        <FieldLabel required={required}>{label}</FieldLabel>
        {inputElement}
        {help && !hasError && <p className="mt-1 text-xs text-slate-400">{help}</p>}
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  };

  // ─── Loading state ─────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading industry data...</p>
        </div>
      </div>
    );
  }

  if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
          <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Industry not found</p>
          <button
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <MdArrowBack size={16} />
            Back to Industries
          </button>
        </div>
      </div>
    );
  }

  // ─── Compute hero data ─────────────────────────────────────
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  const industryName = formValues.name?.trim() || 'New Industry';
  const status = formValues.status || 'active';
  const isTrending = formValues.is_trending || false;
  const slug = formValues.slug || '';
  const subCount = data?.id ? getSubIndustryCount(data.id) : 0;
  const createdDate = data?.created_at ? formatDate(data.created_at) : '—';
  const updatedDate = data?.updated_at ? formatDate(data.updated_at) : '—';

  const initials = industryName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Fields ────────────────────────────────────────────────
  const fields = [
    {
      name: 'name',
      label: 'Industry Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Technology',
      help: 'Enter a unique name for the industry',
    },
    {
      name: 'icon',
      label: 'Industry Icon',
      type: 'file',
      help: 'Upload an icon for the industry (PNG, JPG, SVG) - Max 5MB',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'radio',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      color: 'text-[#2c0eee] focus:ring-[#4529f7]',
    },
    {
      name: 'is_trending',
      label: 'Mark as Trending',
      type: 'checkbox',
      color: 'text-yellow-500 focus:ring-yellow-500',
      help: 'Trending industries will be highlighted in the listing',
    },
  ];

  const auditFields = [
    { name: 'created_by', label: 'Created By' },
    { name: 'updated_by', label: 'Updated By' },
    { name: 'created_at', label: 'Created At' },
    { name: 'updated_at', label: 'Updated At' },
  ];

  // ─── Render tab content ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.type === 'file' ||
                    field.type === 'checkbox' ||
                    field.type === 'radio'
                      ? 'sm:col-span-2'
                      : ''
                  }
                >
                  {renderField(field)}
                </div>
              ))}
            </div>
            {!isViewMode && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 px-4 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : isEditMode ? (
                    'Update Industry'
                  ) : (
                    'Create Industry'
                  )}
                </button>
              </div>
            )}
          </form>
        );

      case 'activity':
        if (!isViewMode) return null;
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
                {auditFields.map((field) => {
                  let value = data?.[field.name] ?? '—';
                  if (field.name === 'created_by' || field.name === 'updated_by') {
                    value = value ? getUserNameCached(value) : '—';
                  } else if (field.name === 'created_at' || field.name === 'updated_at') {
                    value = value ? formatDate(value) : '—';
                  }
                  return (
                    <div key={field.name}>
                      <FieldLabel>{field.label}</FieldLabel>
                      <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                        {value}
                      </div>
                    </div>
                  );
                })}
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
      {/* ─── Sticky action bar ───────────────────────────────── */}
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
              <p className="text-[11px] text-slate-400 leading-tight">Industries</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {isViewMode ? industryName : isEditMode ? `Edit: ${industryName}` : 'Add New Industry'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isViewMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Delete industry"
                  title="Delete industry"
                >
                  <MdDelete size={19} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/industries/edit/${id}`, { state: { item: data } })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-colors"
                >
                  <MdSave size={16} />
                  Edit Industry
                </button>
              </>
            ) : (
              <>
                {!isAddMode && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteDialog(true)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete industry"
                    title="Delete industry"
                  >
                    <MdDelete size={19} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleBack}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                >
                  <MdCancel size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdSave size={16} />
                  )}
                  {loading ? 'Saving...' : isEditMode ? 'Update Industry' : 'Create Industry'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero (fixed dark gradient) ─────────────────── */}
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
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt="Industry icon"
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdBusiness size={24} />}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {industryName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {subCount > 0 && (
                    <span className="text-xs text-white/70">
                      {subCount} sub-industr{subCount === 1 ? 'y' : 'ies'}
                    </span>
                  )}
                  {slug && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70 font-mono">{slug}</span>
                    </>
                  )}
                  {isViewMode && data?.id && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70">ID: #{data.id}</span>
                    </>
                  )}
                  {createdDate && createdDate !== '—' && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70">Created: {createdDate}</span>
                    </>
                  )}
                  {isAddMode && (
                    <span className="text-xs text-white/50">New Industry</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ─────────────────────────────── */}
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
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Sub-industries</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {subCount}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Created By</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {data?.created_by ? getUserNameCached(data.created_by) : 'System'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-200 px-2">
            {TABS.map((tab) => {
              if (tab.id === 'activity' && !isViewMode) return null;
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="industry-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-indigo-600 rounded-full"
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

        {/* Mobile-only cancel */}
        {!isViewMode && (
          <button
            type="button"
            onClick={handleBack}
            className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
          >
            <MdCancel size={16} />
            Cancel
          </button>
        )}
      </div>

      {/* ─── Delete Confirmation Dialog ──────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Industry"
        message={`Delete industry "${industryName}"? This action cannot be undone.${subCount > 0 ? ` It has ${subCount} sub-industr${subCount === 1 ? 'y' : 'ies'} linked.` : ''}`}
      />
    </div>
  );
};

export default IndustryForm;