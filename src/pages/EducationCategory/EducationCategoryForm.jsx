// // pages/education/EducationCategoryForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { ViewBadge, ViewTrendingBadge } from '../../components/common/FormPageUtils';
// import { educationCategoryService } from '../../services/educationCategory.service';
// import { educationSubCategoryService } from '../../services/educationSubCategory.service';
// import { showSuccess, showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';
// import { useAuth } from '../../context/AuthContext';

// const EducationCategoryForm = () => {
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
//     const [subCategories, setSubCategories] = useState([]);

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

//     // Fetch sub-categories to check if category has children
//     useEffect(() => {
//         const loadSubCategories = async () => {
//             try {
//                 const r = await educationSubCategoryService.getAll({ limit: 1000 });
//                 const rawData = r.data?.data || r.data?.results || r.data || [];
//                 const subs = Array.isArray(rawData) ? rawData : [];
//                 setSubCategories(subs);
//             } catch (error) {
//                 console.error('Failed to load sub-categories:', error);
//             }
//         };
//         loadSubCategories();
//     }, []);

//     // Fetch data for edit/view modes
//     useEffect(() => {
//         const fetchData = async () => {
//             if ((mode === 'edit' || mode === 'view') && id) {
//                 setPageLoading(true);
//                 try {
//                     let item = location.state?.item;

//                     if (!item) {
//                         const response = await educationCategoryService.getById(id);
//                         item = response.data;
//                     }

//                     // Normalize the data
//                     const normalizedData = {
//                         id: item.id || item._id,
//                         name: item.name || "",
//                         status: item.status || "active",
//                         is_status: item.status === "active",
//                         is_trending: item.is_trending || false,
//                         created_at: item.created_at || item.createdAt || null,
//                         updated_at: item.updated_at || item.updatedAt || null,
//                         created_by: item.created_by || null,
//                         updated_by: item.updated_by || null,
//                     };

//                     setData(normalizedData);
//                 } catch (error) {
//                     console.error('Fetch error:', error);
//                     showError("Failed to load education category data");
//                     navigate('/education-categories');
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
//             return row.status === "active";
//         }
//         return true;
//     };

//     // Check if category has sub-categories
//     const getSubCategoryCount = (categoryId) => {
//         return subCategories.filter((sub) => {
//             const parentId = sub.education_id || sub.EducationCategory?.id;
//             return String(parentId) === String(categoryId);
//         }).length;
//     };

//     // Define fields for the form
//     const getFields = () => {
//         // Base fields (common for all modes)
//         const baseFields = [
//             {
//                 name: "name",
//                 label: "Category Name",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. Computer Science",
//                 help: "Enter a unique name for the category",
//                 viewRender: (value) => <span className="font-medium text-lg">{value}</span>
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
//                 help: "Trending categories will be highlighted in the listing",
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
//             requiredMessage: 'Category name is required',
//             minLength: 2,
//             minLengthMessage: 'Category name must be at least 2 characters',
//             maxLength: 50,
//             maxLengthMessage: 'Category name must be at most 50 characters',
//             custom: (value) => {
//                 // Will check in submit handler
//                 return null;
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
//             const allData = await educationCategoryService.getAll({ limit: 1000 });
//             const existingItems = allData.data?.data || allData.data?.results || allData.data || [];
//             const duplicate = existingItems.some(item =>
//                 item.name.toLowerCase() === formData.name.toLowerCase() &&
//                 (mode === 'add' || item.id !== id)
//             );

//             // if (duplicate) {
//             //     showError('This category name already exists');
//             //     setLoading(false);
//             //     return;
//             // }

//             if (mode === 'edit') {
//                 await educationCategoryService.update(id, submitData);
//                 showSuccess("Category updated successfully");
//             } else {
//                 await educationCategoryService.create(submitData);
//                 showSuccess("Category created successfully");
//             }

//             navigate('/education-categories');
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
//         // Check if category has sub-categories
//         const childCount = getSubCategoryCount(id);
//         if (childCount > 0) {
//             showError(`Cannot delete this category because it has ${childCount} sub-categor${childCount === 1 ? "y" : "ies"} linked to it.`);
//             throw new Error("Category has sub-categories");
//         }

//         try {
//             await educationCategoryService.delete(id);
//             showSuccess("Category deleted successfully");
//             navigate('/education-categories');
//         } catch (error) {
//             console.error('Delete error:', error);
//             const message = error?.response?.data?.message || error?.message || "";
//             if (/sub[-_ ]?categor|child|foreign\s*key|constraint/i.test(message)) {
//                 showError("Cannot delete this category because it has sub-categories linked to it.");
//             } else {
//                 showError(message || "Failed to delete category");
//             }
//             throw error;
//         }
//     };

//     // Prepare initial data
//     const getInitialData = () => {
//         if (mode === 'add') {
//             return {
//                 name: "",
//                 status: "active",
//                 is_trending: false
//             };
//         }

//         if (data) {
//             // Base initial data (common for all modes)
//             const initialData = {
//                 name: data.name || "",
//                 status: data.is_status ? "active" : "inactive",
//                 is_trending: data.is_trending || false,
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
//             status: "active",
//             is_trending: false
//         };
//     };

//     // Get title based on mode
//     const getTitle = () => {
//         if (mode === 'view') return 'Education Category Details';
//         if (mode === 'edit') return 'Edit Education Category';
//         return 'Add New Education Category';
//     };

//     // Get submit label
//     const getSubmitLabel = () => {
//         if (mode === 'edit') return 'Update Category';
//         return 'Create Category';
//     };

//     // Handle loading state
//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-3 text-gray-500">Loading category data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // If view/edit mode and data not loaded, show error
//     if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Education category not found</p>
//                     <button
//                         onClick={() => navigate('/education-categories')}
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
//             navigateTo="/education-categories"
//             submitLabel={getSubmitLabel()}
//             editLabel="Edit Category"
//             deleteLabel="Delete Category"
//             loading={loading}
//             showDelete={mode !== 'add'}
//             showEdit={mode === 'view'}
//             enableEditMode={mode === 'view'}
//             breadcrumb={mode === 'view' ? 'Viewing category details' : mode === 'edit' ? 'Updating category' : 'Creating new category'}
//             onEdit={() => navigate(`/education-categories/edit/${id}`, { state: { item: data } })}
//         />
//     );
// };

// export default EducationCategoryForm;

// pages/education/EducationCategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdWarning,
  MdClose,
  MdCategory,
  MdTrendingUp,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdPerson,
} from 'react-icons/md';
import { educationCategoryService } from '../../services/educationCategory.service';
import { educationSubCategoryService } from '../../services/educationSubCategory.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';

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
const EducationCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id;

  const [mode, setMode] = useState('add'); // 'add' | 'edit' | 'view'
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: '',
    status: 'active',
    is_trending: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ─── Determine mode from URL ──────────────────────────────
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/view/')) setMode('view');
    else if (path.includes('/edit/')) setMode('edit');
    else setMode('add');
  }, [location.pathname]);

  // ─── Fetch users for display names ──────────────────────────
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

  // ─── Fetch sub-categories to check if category has children ──
  useEffect(() => {
    const loadSubCategories = async () => {
      try {
        const r = await educationSubCategoryService.getAll({ limit: 1000 });
        const rawData = r.data?.data || r.data?.results || r.data || [];
        const subs = Array.isArray(rawData) ? rawData : [];
        setSubCategories(subs);
      } catch (error) {
        console.error('Failed to load sub-categories:', error);
      }
    };
    loadSubCategories();
  }, []);

  // ─── Fetch data for edit/view modes ──────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if ((mode === 'edit' || mode === 'view') && id) {
        setPageLoading(true);
        try {
          let item = location.state?.item;
          if (!item) {
            const response = await educationCategoryService.getById(id);
            item = response.data;
          }

          const normalizedData = {
            id: item.id || item._id,
            name: item.name || '',
            status: item.status || 'active',
            is_status: item.status === 'active',
            is_trending: item.is_trending || false,
            created_at: item.created_at || item.createdAt || null,
            updated_at: item.updated_at || item.updatedAt || null,
            created_by: item.created_by || null,
            updated_by: item.updated_by || null,
          };
          setData(normalizedData);
          setFormValues({
            name: normalizedData.name,
            status: normalizedData.is_status ? 'active' : 'inactive',
            is_trending: normalizedData.is_trending,
          });
        } catch (error) {
          console.error('Fetch error:', error);
          showError('Failed to load education category data');
          navigate('/education-categories');
        } finally {
          setPageLoading(false);
        }
      }
    };
    fetchData();
  }, [id, mode, location.state, navigate]);

  // ─── Helper: get user name ────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    return userNameCache[userId] || `User ${userId}`;
  };

  // ─── Helper: check if category has sub-categories ────────────
  const getSubCategoryCount = (categoryId) => {
    return subCategories.filter((sub) => {
      const parentId = sub.education_id || sub.EducationCategory?.id;
      return String(parentId) === String(categoryId);
    }).length;
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) return 'Category name is required';
        if (value.trim().length < 2) return 'Category name must be at least 2 characters';
        if (value.trim().length > 50) return 'Category name must be at most 50 characters';
        return null;
      default:
        return null;
    }
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
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formValues).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  // ─── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Please fix validation errors');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: formValues.name.trim(),
        status: formValues.status,
        is_trending: formValues.is_trending || false,
      };

      // Check for duplicate name (skip if editing same name)
      const allData = await educationCategoryService.getAll({ limit: 1000 });
      const existingItems = allData.data?.data || allData.data?.results || allData.data || [];
      const duplicate = existingItems.some(
        (item) =>
          item.name.toLowerCase() === formValues.name.trim().toLowerCase() &&
          (mode === 'add' || String(item.id) !== String(id))
      );
      // if (duplicate) {
      //   showError('This category name already exists');
      //   setLoading(false);
      //   return;
      // }

      if (mode === 'edit') {
        submitData.updated_by = userId;
        await educationCategoryService.update(id, submitData);
        showSuccess('Category updated successfully');
      } else {
        submitData.created_by = userId;
        submitData.updated_by = userId;
        await educationCategoryService.create(submitData);
        showSuccess('Category created successfully');
      }

      navigate('/education-categories');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    // Check if category has sub-categories
    const childCount = getSubCategoryCount(id);
    if (childCount > 0) {
      showError(
        `Cannot delete this category because it has ${childCount} sub-categor${childCount === 1 ? 'y' : 'ies'} linked to it.`
      );
      setShowDeleteDialog(false);
      return;
    }

    setDeleteLoading(true);
    try {
      await educationCategoryService.delete(id);
      showSuccess('Category deleted successfully');
      navigate('/education-categories');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || '';
      if (/sub[-_ ]?categor|child|foreign\s*key|constraint/i.test(message)) {
        showError('Cannot delete this category because it has sub-categories linked to it.');
      } else {
        showError(message || 'Failed to delete category');
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate('/education-categories');

  // ─── Render helper for fields ──────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, color } = field;
    const value = formValues[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;
    const isViewMode = mode === 'view';

    if (isViewMode) {
      // Display as read-only value
      let displayValue = value;
      if (name === 'status') {
        displayValue = <StatusPill status={value} />;
      } else if (name === 'is_trending') {
        displayValue = value ? <TrendingBadge trending={true} /> : 'No';
      }
      return (
        <div key={name} className="mb-4">
          <FieldLabel>{label}</FieldLabel>
          <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
            {displayValue || '—'}
          </div>
        </div>
      );
    }

    const commonClass = `w-full px-3.5 py-2.5 border ${hasError ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    let inputElement;
    switch (type) {
      case 'select':
        inputElement = (
          <select
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={commonClass}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
      <div className="flex items-center justify-center min-h-screen bg-[#0f1b3d]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading category data...</p>
        </div>
      </div>
    );
  }

  // ─── Compute hero data ────────────────────────────────────
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  const categoryName = formValues.name?.trim() || 'New Category';
  const status = formValues.status || 'active';
  const isTrending = formValues.is_trending || false;
  const subCount = data?.id ? getSubCategoryCount(data.id) : 0;
  const createdDate = data?.created_at ? formatDate(data.created_at) : '—';
  const updatedDate = data?.updated_at ? formatDate(data.updated_at) : '—';

  const initials = categoryName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Define field configurations ────────────────────────────
  const fields = [
    {
      name: 'name',
      label: 'Category Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Computer Science',
      help: 'Enter a unique name for the category',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'radio',
      required: false,
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
      help: 'Trending categories will be highlighted in the listing',
    },
  ];

  const auditFields = [
    { name: 'created_by', label: 'Created By' },
    { name: 'updated_by', label: 'Updated By' },
    { name: 'created_at', label: 'Created At' },
    { name: 'updated_at', label: 'Updated At' },
  ];

  // ─── Main render ──────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16">
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
              <p className="text-[11px] text-slate-400 leading-tight">Education Categories</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {isViewMode ? categoryName : isEditMode ? `Edit: ${categoryName}` : 'Add New Category'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isViewMode ? (
              <>
                {mode !== 'add' && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteDialog(true)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete category"
                    title="Delete category"
                  >
                    <MdDelete size={19} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/education-categories/edit/${id}`, { state: { item: data } })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-purple-600/20 transition-colors"
                >
                  <MdSave size={16} />
                  Edit Category
                </button>
              </>
            ) : (
              <>
                {!isAddMode && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteDialog(true)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete category"
                    title="Delete category"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-purple-600/20 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdSave size={16} />
                  )}
                  {loading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-[#111c3d] via-[#17275a] to-[#243b80]">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar / Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/20">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdCategory size={24} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {categoryName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {subCount > 0 && (
                    <span className="text-xs text-white/70">
                      {subCount} sub-categor{subCount === 1 ? 'y' : 'ies'}
                    </span>
                  )}
                  {isViewMode && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70">ID: #{data?.id || id}</span>
                      {data?.created_at && (
                        <>
                          <span className="text-xs text-white/70">•</span>
                          <span className="text-xs text-white/70">Created: {formatDate(data.created_at)}</span>
                        </>
                      )}
                    </>
                  )}
                  {/* {isAddMode && (
                    <span className="text-xs text-white/50">New Category</span>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mt-4">
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
          {/* <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Sub-categories</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {subCount}
              </p>
            </div>
          </div> */}
          {/* <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Created By</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {data?.created_by ? getUserNameCached(data.created_by) : '—'}
              </p>
            </div>
          </div> */}
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
                    active ? 'text-purple-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="education-category-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-purple-600 rounded-full"
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
                {activeTab === 'overview' && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {fields.map((field) => (
                        <div
                          key={field.name}
                          className={field.type === 'checkbox' || field.type === 'radio' ? 'sm:col-span-2' : ''}
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
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 shadow-sm shadow-purple-600/20"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </span>
                          ) : isEditMode ? (
                            'Update Category'
                          ) : (
                            'Create Category'
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                )}

                {activeTab === 'activity' && (
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
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only cancel button */}
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

      {/* ─── Delete Confirmation Dialog ──────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Category"
        message={`Delete category "${categoryName}"? This action cannot be undone.${subCount > 0 ? ` It has ${subCount} sub-categor${subCount === 1 ? 'y' : 'ies'} linked.` : ''}`}
      />
    </div>
  );
};

export default EducationCategoryForm;