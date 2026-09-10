// // pages/jobs/JobSubCategoryForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { ViewBadge, ViewTrendingBadge } from '../../components/common/FormPageUtils';
// import { jobSubCategoryService } from '../../services/jobSubCategory.service';
// import { jobCategoryService } from '../../services/jobCategory.service';
// import { showSuccess, showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';
// import { useAuth } from '../../context/AuthContext';

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const JobSubCategoryForm = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { id } = useParams();
//     const { user } = useAuth();
//     const userId = user?.id;

//     const [mode, setMode] = useState('add'); // 'add' | 'edit' | 'view'
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState(null);
//     const [parentCategories, setParentCategories] = useState([]);
//     const [userNameCache, setUserNameCache] = useState({});
//     const [pageLoading, setPageLoading] = useState(false);

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

//     // Fetch parent categories
//     useEffect(() => {
//         const fetchParentCategories = async () => {
//             try {
//                 const r = await jobCategoryService.getAll({ limit: 1000 });
//                 const rawData = r.data?.data || r.data?.results || r.data || [];
//                 const categories = Array.isArray(rawData) ? rawData : [];
//                 setParentCategories(categories);
//             } catch (error) {
//                 console.error("Failed to fetch parent categories:", error);
//             }
//         };
//         fetchParentCategories();
//     }, []);

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

//     // Fetch data for edit/view modes
//     useEffect(() => {
//         const fetchData = async () => {
//             if ((mode === 'edit' || mode === 'view') && id) {
//                 setPageLoading(true);
//                 try {
//                     let item = location.state?.item;

//                     if (!item) {
//                         const response = await jobSubCategoryService.getById(id);
//                         item = response.data;
//                     }

//                     // Normalize the data
//                     const normalizedData = {
//                         id: item.id || item._id,
//                         name: item.name || "",
//                         category_id: item.category_id || "",
//                         JobCategory: item.JobCategory || null,
//                         parent_category_name: item.JobCategory?.category_name || item.JobCategory?.name || "",
//                         icon: item.icon || null,
//                         image: item.image || null,
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
//                     showError("Failed to load job sub-category data");
//                     navigate('/job-subcategories');
//                 } finally {
//                     setPageLoading(false);
//                 }
//             }
//         };
//         fetchData();
//     }, [id, mode, location.state, navigate]);

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

//     // Get full image URL helper
//     const getFullImageUrl = (value) => {
//         if (!value) return null;
//         if (value.startsWith("http") || value.startsWith("data:image")) {
//             return value;
//         }
//         if (value.startsWith("/uploads/")) {
//             return `${API_BASE_URL}${value}`;
//         }
//         return value;
//     };

//     // Define fields for the form
//     const getFields = () => {
//         const categoryOptions = parentCategories.map(cat => ({
//             value: cat.id || cat._id,
//             label: cat.category_name || cat.name || ""
//         }));

//         // Base fields (common for all modes)
//         const baseFields = [
//             {
//                 name: "name",
//                 label: "Sub Category Name",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. Frontend Development",
//                 help: "Enter a unique name for the sub category",
//                 viewRender: (value) => <span className="font-medium text-lg">{value}</span>
//             },
//             {
//                 name: "category_id",
//                 label: "Parent Category",
//                 type: "select",
//                 required: true,
//                 options: categoryOptions,
//                 placeholder: "Select parent category",
//                 help: "Select the parent job category",
//                 viewRender: (value, row) => row?.parent_category_name || value || '—'
//             },
//             {
//                 name: "icon",
//                 label: "Sub Category Icon",
//                 type: "file",
//                 required: false,
//                 accept: "image/*",
//                 maxSize: 5,
//                 help: "Upload an icon for the sub category (PNG, JPG, SVG) - Max 5MB",
//                 placeholder: "Click or drag to upload icon",
//                 viewRender: (value) => {
//                     if (!value) return '—';
//                     const url = getFullImageUrl(value);
//                     return (
//                         <div className="relative group">
//                             <img
//                                 src={url}
//                                 alt="Sub category icon"
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
//                 name: "image",
//                 label: "Sub Category Image",
//                 type: "file",
//                 required: false,
//                 accept: "image/*",
//                 maxSize: 5,
//                 help: "Upload a banner image for the sub category (PNG, JPG) - Max 5MB",
//                 placeholder: "Click or drag to upload image",
//                 viewRender: (value) => {
//                     if (!value) return '—';
//                     const url = getFullImageUrl(value);
//                     return (
//                         <div className="relative group">
//                             <img
//                                 src={url}
//                                 alt="Sub category image"
//                                 className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
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
//                 help: "Trending sub categories will be highlighted in the listing",
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
//             requiredMessage: 'Sub category name is required',
//             minLength: 2,
//             minLengthMessage: 'Sub category name must be at least 2 characters',
//             maxLength: 50,
//             maxLengthMessage: 'Sub category name must be at most 50 characters',
//             custom: (value) => {
//                 // Will check in submit handler
//                 return null;
//             }
//         },
//         category_id: {
//             required: true,
//             requiredMessage: 'Please select a parent category'
//         }
//     });

//     // Submit handler for add/edit
//     const handleSubmit = async (formData) => {
//         setLoading(true);

//         try {
//             // Validate category_id
//             if (!formData.category_id || formData.category_id === '') {
//                 showError('Please select a parent category');
//                 setLoading(false);
//                 return;
//             }

//             const submitData = {
//                 name: formData.name,
//                 category_id: parseInt(formData.category_id),
//                 is_status: formData.status === "active",
//                 is_trending: formData.is_trending || false,
//             };

//             // Handle icon file
//             if (formData.iconFile instanceof File) {
//                 submitData.iconFile = formData.iconFile;
//             } else if (mode === 'edit' && data?.icon) {
//                 submitData.icon = data.icon;
//             }

//             // Handle image file
//             if (formData.imageFile instanceof File) {
//                 submitData.imageFile = formData.imageFile;
//             } else if (mode === 'edit' && data?.image) {
//                 submitData.image = data.image;
//             }

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
//             const allData = await jobSubCategoryService.getAll({ limit: 1000 });
//             const existingItems = allData.data?.data || allData.data?.results || allData.data || [];
//             const duplicate = existingItems.some(item =>
//                 (item.name || "").toLowerCase() === formData.name.toLowerCase() &&
//                 (mode === 'add' || item.id !== id)
//             );

//             // if (duplicate) {
//             //     showError('This sub category name already exists');
//             //     setLoading(false);
//             //     return;
//             // }

//             if (mode === 'edit') {
//                 await jobSubCategoryService.update(id, submitData);
//                 showSuccess("Sub category updated successfully");
//             } else {
//                 await jobSubCategoryService.create(submitData);
//                 showSuccess("Sub category created successfully");
//             }

//             navigate('/job-subcategories');
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
//         try {
//             await jobSubCategoryService.delete(id);
//             showSuccess("Sub category deleted successfully");
//             navigate('/job-subcategories');
//         } catch (error) {
//             console.error('Delete error:', error);
//             showError(error?.response?.data?.message || error?.message || "Failed to delete");
//             throw error;
//         }
//     };

//     // Prepare initial data
//     const getInitialData = () => {
//         if (mode === 'add') {
//             return {
//                 name: "",
//                 category_id: "",
//                 icon: null,
//                 image: null,
//                 status: "active",
//                 is_trending: false
//             };
//         }

//         if (data) {
//             // Base initial data (common for all modes)
//             const initialData = {
//                 name: data.name || "",
//                 category_id: data.category_id || "",
//                 icon: data.icon || null,
//                 image: data.image || null,
//                 status: data.is_status ? "active" : "inactive",
//                 is_trending: data.is_trending || false,
//                 parent_category_name: data.parent_category_name || "",
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
//             category_id: "",
//             icon: null,
//             image: null,
//             status: "active",
//             is_trending: false
//         };
//     };

//     // Get title based on mode
//     const getTitle = () => {
//         if (mode === 'view') return 'Job Sub Category Details';
//         if (mode === 'edit') return 'Edit Job Sub Category';
//         return 'Add New Job Sub Category';
//     };

//     // Get submit label
//     const getSubmitLabel = () => {
//         if (mode === 'edit') return 'Update Sub Category';
//         return 'Create Sub Category';
//     };

//     // Handle loading state
//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-3 text-gray-500">Loading sub category data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // If view/edit mode and data not loaded, show error
//     if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Job sub category not found</p>
//                     <button
//                         onClick={() => navigate('/job-subcategories')}
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
//             navigateTo="/job-subcategories"
//             submitLabel={getSubmitLabel()}
//             editLabel="Edit Sub Category"
//             deleteLabel="Delete Sub Category"
//             loading={loading}
//             showDelete={mode !== 'add'}
//             showEdit={mode === 'view'}
//             enableEditMode={mode === 'view'}
//             breadcrumb={mode === 'view' ? 'Viewing sub category details' : mode === 'edit' ? 'Updating sub category' : 'Creating new sub category'}
//             onEdit={() => navigate(`/job-subcategories/edit/${id}`, { state: { item: data } })}
//         />
//     );
// };

// export default JobSubCategoryForm;

// pages/jobs/JobSubCategoryForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdEdit,
  MdCategory,
  MdSubdirectoryArrowRight,
  MdImage,
  MdCloudUpload,
  MdClose,
  MdFlag,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
  MdPerson,
  MdDateRange,
  MdPhoto,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { jobSubCategoryService } from "../../services/jobSubCategory.service";
import { jobCategoryService } from "../../services/jobCategory.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const Toggle = ({ checked, onChange, name }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked || false}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
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

// ─── Image URL helper ──────────────────────────────────────────
const getFullImageUrl = (value) => {
  if (!value) return null;
  if (typeof value === "object") {
    return getFullImageUrl(
      value.url || value.uri || value.path || value.image || value.icon
    );
  }
  if (typeof value !== "string") return null;
  if (value.startsWith("http") || value.startsWith("data:image") || value.startsWith("blob:"))
    return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_BASE_URL}/${value}`;
  return value;
};

// ─── Main Component ─────────────────────────────────────────────
const JobSubCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id;

  const [mode, setMode] = useState("add"); // add | edit | view
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [data, setData] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: "",
    category_id: "",
    icon: "",
    image: "",
    status: "active",
    is_trending: false,
    parent_category_name: "",
    created_by: null,
    updated_by: null,
    created_at: null,
    updated_at: null,
  });

  // File handling
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconRemoved, setIconRemoved] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [errors, setErrors] = useState({});

  // ─── Determine mode from URL ─────────────────────────────────
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/view/")) setMode("view");
    else if (path.includes("/edit/")) setMode("edit");
    else setMode("add");
  }, [location.pathname]);

  // Reset UI on mode/id change
  useEffect(() => {
    setActiveTab("overview");
  }, [mode, id]);

  // ─── Fetch parent categories ─────────────────────────────────
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const r = await jobCategoryService.getAll({ limit: 1000 });
        const rawData = r.data?.data || r.data?.results || r.data || [];
        const categories = Array.isArray(rawData) ? rawData : [];
        setParentCategories(categories);
      } catch (error) {
        console.error("Failed to fetch parent categories:", error);
      }
    };
    fetchParentCategories();
  }, []);

  // ─── Fetch users ──────────────────────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((uid) => {
          userMap[uid] = users[uid].name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  // ─── Fetch data for edit/view ────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if ((mode === "edit" || mode === "view") && id) {
        setFetchLoading(true);
        try {
          let item = location.state?.item;
          if (!item) {
            const response = await jobSubCategoryService.getById(id);
            item = response.data;
          }

          if (!item) throw new Error("Sub category not found");

          setFormValues({
            name: item.name || "",
            category_id: item.category_id || "",
            icon: item.icon || "",
            image: item.image || "",
            status:
              item.is_status === true ||
              item.is_status === 1 ||
              item.is_status === "1" ||
              item.is_status === "true"
                ? "active"
                : "inactive",
            is_trending: item.is_trending || false,
            parent_category_name:
              item.JobCategory?.category_name ||
              item.JobCategory?.name ||
              "",
            created_by: item.created_by || null,
            updated_by: item.updated_by || null,
            created_at: item.created_at || item.createdAt || null,
            updated_at: item.updated_at || item.updatedAt || null,
          });

          if (item.icon) setIconPreview(getFullImageUrl(item.icon));
          if (item.image) setImagePreview(getFullImageUrl(item.image));

          setData(item);
        } catch (error) {
          console.error("Fetch error:", error);
          showError("Failed to load job sub-category data");
          navigate("/job-subcategories");
        } finally {
          setFetchLoading(false);
        }
      }
    };
    fetchData();
  }, [id, mode, location.state, navigate]);

  // ─── User name helper ────────────────────────────────────────
  const getUserNameCached = (uid) => {
    if (!uid) return "—";
    if (user?.id && Number(user.id) === Number(uid)) return "You";
    return userNameCache[uid] || `User ${uid}`;
  };

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleIconFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
      setIconRemoved(false);
    }
  };

  const handleIconRemove = () => {
    setIconFile(null);
    setIconPreview(null);
    setIconRemoved(true);
    setFormValues((prev) => ({ ...prev, icon: "" }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageRemoved(false);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(true);
    setFormValues((prev) => ({ ...prev, image: "" }));
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.name?.trim()) {
      newErrors.name = "Sub category name is required";
    } else if (formValues.name.trim().length < 2) {
      newErrors.name = "Sub category name must be at least 2 characters";
    } else if (formValues.name.trim().length > 50) {
      newErrors.name = "Sub category name must be at most 50 characters";
    }

    if (!formValues.category_id) {
      newErrors.category_id = "Please select a parent category";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setActiveTab("overview");
      showError(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") return;
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        name: formValues.name.trim(),
        category_id: parseInt(formValues.category_id),
        is_status: formValues.status === "active",
        is_trending: formValues.is_trending || false,
      };

      // Icon
      if (iconFile instanceof File) {
        submitData.iconFile = iconFile;
      } else if (mode === "edit" && !iconRemoved && formValues.icon) {
        submitData.icon = formValues.icon;
      } else if (mode === "edit" && iconRemoved) {
        submitData.icon = null;
      }

      // Image
      if (imageFile instanceof File) {
        submitData.imageFile = imageFile;
      } else if (mode === "edit" && !imageRemoved && formValues.image) {
        submitData.image = formValues.image;
      } else if (mode === "edit" && imageRemoved) {
        submitData.image = null;
      }

      // Audit
      if (mode === "edit") {
        submitData.updated_by = userId;
      } else {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      if (mode === "edit") {
        await jobSubCategoryService.update(id, submitData);
        showSuccess("Sub category updated successfully");
      } else {
        await jobSubCategoryService.create(submitData);
        showSuccess("Sub category created successfully");
      }

      navigate("/job-subcategories");
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to save";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await jobSubCategoryService.delete(id);
      showSuccess("Sub category deleted successfully");
      setShowDeleteDialog(false);
      navigate("/job-subcategories");
    } catch (error) {
      console.error("Delete error:", error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete"
      );
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Tabs ────────────────────────────────────────────────────
  const TABS = (() => {
    const base = [
      { id: "overview", label: "Overview", icon: MdInfoOutline },
      { id: "media", label: "Media", icon: MdImage },
      { id: "status", label: "Status & Flags", icon: MdFlag },
    ];
    if (mode === "view") {
      base.push({ id: "metadata", label: "Metadata", icon: MdPerson });
    }
    return base;
  })();

  // ─── Loading states ──────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading sub category data...</p>
        </div>
      </div>
    );
  }

  if ((mode === "view" || mode === "edit") && !data && !fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center">
          <p className="text-slate-500">Job sub category not found</p>
          <button
            onClick={() => navigate("/job-subcategories")}
            className="mt-3 text-blue-600 hover:underline text-sm font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.name?.trim() || "New Sub Category";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const isViewMode = mode === "view";

  // ─── Parent category options ─────────────────────────────────
  const categoryOptions = parentCategories.map((cat) => ({
    value: String(cat.id || cat._id),
    label: cat.category_name || cat.name || "",
  }));

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel required>Sub Category Name</FieldLabel>
                <div className="relative">
                  <MdSubdirectoryArrowRight
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.name
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="e.g. Frontend Development"
                  />
                </div>
                {errors.name ? (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Enter a unique name for the sub category.
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <FieldLabel required>Parent Category</FieldLabel>
                <div className="relative">
                  <MdCategory
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="category_id"
                    value={formValues.category_id}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.category_id
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                  >
                    <option value="">Select parent category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category_id ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.category_id}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Select the parent job category.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "media":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Icon */}
            <div>
              <FieldLabel>Sub Category Icon</FieldLabel>
              <div className="flex flex-col items-start gap-3">
                <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Icon"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <MdPhoto size={28} className="text-slate-300" />
                  )}
                </div>
                {!isViewMode && (
                  <>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                      <MdCloudUpload size={16} />
                      {iconPreview ? "Change icon" : "Upload icon"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconFileChange}
                        className="hidden"
                      />
                    </label>
                    {iconPreview && (
                      <button
                        type="button"
                        onClick={handleIconRemove}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                      >
                        <MdClose size={14} />
                        Remove icon
                      </button>
                    )}
                    <p className="text-xs text-slate-500">
                      PNG, JPG, SVG – Max 5MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Image */}
            <div>
              <FieldLabel>Sub Category Image</FieldLabel>
              <div className="flex flex-col items-start gap-3">
                <div className="w-full sm:w-56 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <MdImage size={28} className="text-slate-300" />
                  )}
                </div>
                {!isViewMode && (
                  <>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                      <MdCloudUpload size={16} />
                      {imagePreview ? "Change image" : "Upload image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                      >
                        <MdClose size={14} />
                        Remove image
                      </button>
                    )}
                    <p className="text-xs text-slate-500">
                      PNG, JPG – Max 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-xl">
            <div>
              <FieldLabel required>Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {["active", "inactive"].map((status) => (
                  <label
                    key={status}
                    className={`flex items-center gap-2.5 ${
                      isViewMode ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formValues.status === status}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Active sub categories are visible in the listing.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Trending</FieldLabel>
              <div className="flex items-center gap-3 pt-0.5">
                <Toggle
                  name="is_trending"
                  checked={formValues.is_trending}
                  onChange={handleInputChange}
                />
                <span className="text-sm text-slate-600">
                  {formValues.is_trending
                    ? "Marked as trending"
                    : "Not trending"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Trending sub categories are highlighted in the listing.
              </p>
            </div>
          </div>
        );

      case "metadata":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Created By</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={getUserNameCached(formValues.created_by)}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated By</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={getUserNameCached(formValues.updated_by)}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Created At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      formValues.created_at
                        ? formatDate(formValues.created_at)
                        : "—"
                    }
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
                    value={
                      formValues.updated_at
                        ? formatDate(formValues.updated_at)
                        : "—"
                    }
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

  // ─── Title / action label ────────────────────────────────────
  const actionLabel =
    mode === "view"
      ? "Edit Sub Category"
      : mode === "edit"
      ? "Update Sub Category"
      : "Create Sub Category";

  // ─── Main render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/job-subcategories")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Job Sub Categories
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/job-subcategories")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdCancel size={16} />
              {mode === "view" ? "Back" : "Cancel"}
            </button>

            {mode === "view" ? (
              <button
                type="button"
                onClick={() =>
                  navigate(`/job-subcategories/edit/${id}`, {
                    state: { item: data },
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
              >
                <MdEdit size={16} />
                Edit Sub Category
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdSave size={16} />
                )}
                {loading
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update Sub Category"
                  : "Create Sub Category"}
              </button>
            )}
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
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Icon / avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt={heroName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdCategory size={24} />}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  <StatusPill status={formValues.status} />
                  {formValues.is_trending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdTrendingUp size={12} />
                      Trending
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {formValues.parent_category_name && (
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MdCategory size={11} />
                      {formValues.parent_category_name}
                    </span>
                  )}
                  {mode !== "add" && (
                    <span className="text-xs text-white/70">ID: #{id}</span>
                  )}
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
              <p className="text-[10px] text-slate-500 leading-tight">
                Parent
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.parent_category_name ||
                  (formValues.category_id
                    ? categoryOptions.find(
                        (opt) => opt.value === String(formValues.category_id)
                      )?.label || "—"
                    : "—")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdFlag size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {formValues.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdTrendingUp
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Trending
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_trending ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdImage size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Media</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {[iconPreview ? "Icon" : null, imagePreview ? "Image" : null]
                  .filter(Boolean)
                  .join(" + ") || "None"}
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
                      layoutId="job-subcategory-tab-underline"
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

        {/* ─── Actions ────────────────────────────────────────────── */}
        {mode !== "add" && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdDelete size={16} />
                  Delete Sub Category
                </button>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={() => navigate("/job-subcategories")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdCancel size={16} />
                  {mode === "view" ? "Back" : "Cancel"}
                </button>

                {mode === "view" ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/job-subcategories/edit/${id}`, {
                        state: { item: data },
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors w-full sm:w-auto"
                  >
                    <MdEdit size={16} />
                    Edit Sub Category
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
                  >
                    {loading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdSave size={16} />
                    )}
                    {loading ? "Saving..." : "Update Sub Category"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/job-subcategories")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          {mode === "view" ? "Back" : "Cancel"}
        </button>
      </div>

      {/* ─── Delete Confirmation Dialog ─────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Job Sub Category"
        message="Delete this sub category? This action cannot be undone."
      />
    </div>
  );
};

export default JobSubCategoryForm;