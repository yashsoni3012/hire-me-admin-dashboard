// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { departmentService } from '../../services/department.service';
// import { showSuccess, showError } from '../../utils/toast';

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const EditDepartment = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   // Get full image URL helper
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (value.startsWith("http") || value.startsWith("data:image")) {
//       return value;
//     }
//     if (value.startsWith("/uploads/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     if (value.startsWith("uploads/")) {
//       return `${API_BASE_URL}/${value}`;
//     }
//     if (value.startsWith("/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     if (!value.includes("/") && !value.includes("http") && !value.startsWith("data:")) {
//       return `${API_BASE_URL}/uploads/${value}`;
//     }
//     return value;
//   };

//   // Fetch department data
//   useEffect(() => {
//     const fetchDepartment = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await departmentService.getById(id);
//         const data = response?.data || response;
        
//         if (data) {
//           const formData = {
//             department_name: data.department_name || data.name || "",
//             icon: data.icon || null,
//             status: data.is_status === true ? "active" : "inactive",
//             is_trending: data.is_trending || false,
//           };
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("Department not found");
//           navigate('/departments');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load department data");
//         navigate('/departments');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchDepartment();
//     }
//   }, [id, navigate]);

//   // Form fields configuration
//   const fields = [
//     {
//       name: "department_name",
//       label: "Department Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. Engineering, Marketing, HR",
//       help: "Enter the full name of the department",
//     },
//     {
//       name: "icon",
//       label: "Department Icon",
//       type: "file",
//       required: false,
//       accept: "image/*",
//       maxSize: 5,
//       help: "Upload a department icon (PNG, JPG, SVG) - Max 5MB",
//       placeholder: "Click or drag to upload image",
//       existingImage: editItem?.icon ? getFullImageUrl(editItem.icon) : null
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "radio",
//       options: [
//         { value: "active", label: "Active" },
//         { value: "inactive", label: "Inactive" },
//       ],
//       color: "text-blue-600 focus:ring-blue-500",
//     },
//     {
//       name: "is_trending",
//       label: "Mark as Trending",
//       type: "checkbox",
//       color: "text-yellow-500 focus:ring-yellow-500",
//       help: "Trending departments will be highlighted in the listing",
//     },
//   ];

//   // Validation rules
//   const validationRules = {
//     department_name: {
//       required: true,
//       requiredMessage: "Department name is required",
//       minLength: 2,
//       minLengthMessage: "Department name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Department name must be at most 100 characters",
//     },
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const submitData = {
//         department_name: formData.department_name.trim(),
//         status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//       };

//       // Handle icon file upload
//       if (formData.iconFile instanceof File) {
//         submitData.iconFile = formData.iconFile;
//       } else if (editItem && editItem.icon) {
//         submitData.icon = editItem.icon;
//       }

//       await departmentService.update(id, submitData);
//       showSuccess("Department updated successfully");
      
//       // Redirect to departments list page
//       navigate('/departments');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update department");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await departmentService.delete(id);
//       showSuccess("Department deleted successfully");
      
//       // Redirect to departments list page
//       navigate('/departments');
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this department because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete department");
//       }
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading department data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Department"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/departments"
//       breadcrumb={`Editing: ${editItem?.department_name || editItem?.name || 'Department'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditDepartment;

// pages/departments/EditDepartment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdWarning,
  MdClose,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdPerson,
  MdBusiness,
  MdTrendingUp,
  MdCloudUpload,
} from 'react-icons/md';
import { departmentService } from '../../services/department.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Helper: Get full image URL ──────────────────────────────
const getFullImageUrl = (value) => {
  if (!value) return null;
  if (value.startsWith("http") || value.startsWith("data:image")) return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_BASE_URL}/${value}`;
  if (value.startsWith("/")) return `${API_BASE_URL}${value}`;
  if (!value.includes("/") && !value.includes("http") && !value.startsWith("data:")) {
    return `${API_BASE_URL}/uploads/${value}`;
  }
  return value;
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
const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    department_name: '',
    icon: null,
    status: 'active',
    is_trending: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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

  // ─── Fetch department data ─────────────────────────────────────
  useEffect(() => {
    const fetchDepartment = async () => {
      setFetchLoading(true);
      try {
        const response = await departmentService.getById(id);
        const data = response?.data || response;

        if (data) {
          setEditItem(data);
          const formData = {
            department_name: data.department_name || data.name || '',
            icon: data.icon || null,
            status: data.is_status === true ? 'active' : 'inactive',
            is_trending: data.is_trending || false,
          };
          setFormValues(formData);
          if (data.icon) {
            setImagePreview(getFullImageUrl(data.icon));
          }
        } else {
          showError('Department not found');
          navigate('/departments');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load department data');
        navigate('/departments');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchDepartment();
    }
  }, [id, navigate]);

  // ─── Helper: get user name ────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    return userNameCache[userId] || `User ${userId}`;
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

  const handleFileChange = (e) => {
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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
      setFormValues((prev) => ({ ...prev, icon: URL.createObjectURL(file) }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormValues((prev) => ({ ...prev, icon: null }));
    const fileInput = document.getElementById('icon-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────────
  const validateField = (name, value) => {
    if (name === 'department_name') {
      if (!value || !value.trim()) return 'Department name is required';
      if (value.trim().length < 2) return 'Department name must be at least 2 characters';
      if (value.trim().length > 100) return 'Department name must be at most 100 characters';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const error = validateField('department_name', formValues.department_name);
    if (error) {
      newErrors.department_name = error;
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
        department_name: formValues.department_name.trim(),
        status: formValues.status === 'active',
        is_trending: formValues.is_trending || false,
      };

      if (imageFile instanceof File) {
        submitData.iconFile = imageFile;
      } else if (editItem?.icon) {
        submitData.icon = editItem.icon;
      }

      await departmentService.update(id, submitData);
      showSuccess('Department updated successfully');
      navigate('/departments');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || 'Failed to update department');
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await departmentService.delete(id);
      showSuccess('Department deleted successfully');
      navigate('/departments');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || '';
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError('Cannot delete this department because it is being used in other records.');
      } else {
        showError(message || 'Failed to delete department');
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate('/departments');

  // ─── Render helper for fields ──────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, color } = field;
    const value = formValues[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;

    const commonClass = `w-full px-3.5 py-2.5 border ${hasError ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    let inputElement;
    switch (type) {
      case 'file':
        inputElement = (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Department icon preview"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="icon-upload"
                />
                <label
                  htmlFor="icon-upload"
                  className="px-4 py-2 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium inline-flex items-center gap-2"
                >
                  <MdCloudUpload size={16} />
                  {imagePreview ? 'Change Image' : 'Choose Image'}
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
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading department data...</p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const departmentName = formValues.department_name?.trim() || 'Department';
  const status = formValues.status || 'active';
  const isTrending = formValues.is_trending || false;
  const createdDate = editItem.created_at ? formatDate(editItem.created_at) : '—';
  const updatedDate = editItem.updated_at ? formatDate(editItem.updated_at) : '—';

  const initials = departmentName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Field definitions ────────────────────────────────────
  const fields = [
    {
      name: 'department_name',
      label: 'Department Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Engineering, Marketing, HR',
      help: 'Enter the full name of the department',
    },
    {
      name: 'icon',
      label: 'Department Icon',
      type: 'file',
      required: false,
      placeholder: 'Click or drag to upload image',
      help: 'Upload a department icon (PNG, JPG, SVG) - Max 5MB',
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
      help: 'Trending departments will be highlighted in the listing',
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
              <p className="text-[11px] text-slate-400 leading-tight">Departments</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Edit: {departmentName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete department"
              title="Delete department"
            >
              <MdDelete size={19} />
            </button>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdSave size={16} />
              )}
              {loading ? 'Updating...' : 'Update Department'}
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
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Department Icon"
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdBusiness size={24} />}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {departmentName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">ID: #{editItem.id}</span>
                  {editItem.created_at && (
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
            <MdCloudUpload size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Icon</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {imagePreview ? 'Uploaded' : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Created By</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {editItem.created_by ? getUserNameCached(editItem.created_by) : '—'}
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
                      layoutId="edit-department-tab-underline"
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
                {activeTab === 'overview' && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {fields.map((field) => (
                        <div
                          key={field.name}
                          className={field.type === 'checkbox' || field.type === 'radio' || field.type === 'file' ? 'sm:col-span-2' : ''}
                        >
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
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
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 shadow-sm shadow-blue-600/20"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          'Update Department'
                        )}
                      </button>
                    </div>
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
                          let value = editItem?.[field.name] ?? '—';
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
        <button
          type="button"
          onClick={handleBack}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>

      {/* ─── Delete Confirmation Dialog ──────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Department"
        message={`Delete department "${departmentName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EditDepartment;