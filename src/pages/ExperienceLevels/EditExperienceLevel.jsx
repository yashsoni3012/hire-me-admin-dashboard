// // pages/experience-levels/EditExperienceLevel.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { experienceLevelService } from '../../services/experienceLevel.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditExperienceLevel = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   // ─── Fetch experience level data ──────────────────────────────
//   useEffect(() => {
//     const fetchExperienceLevel = async () => {
//       setFetchLoading(true);
//       try {
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
//           const formData = {
//             name: data.name || "",
//             min_year: data.min_year || "",
//             max_year: data.max_year || "",
//             status: data.is_status ? "active" : "inactive",
//             is_trending: data.is_trending || false,
//           };
//           console.log('Form data prepared:', formData);
//           setInitialData(formData);
//           setEditItem(data);
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
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchExperienceLevel();
//     }
//   }, [id, navigate]);

//   // ─── Form fields configuration ──────────────────────────────────
//   const fields = [
//     {
//       name: "name",
//       label: "Experience Level Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. Fresher, Junior, Senior, Lead",
//       help: "Enter the experience level name",
//     },
//     {
//       name: "min_year",
//       label: "Minimum Years",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 0, 1, 2",
//       help: "Enter the minimum years of experience (must be 0 or greater)",
//       min: 0,
//       step: 1,
//     },
//     {
//       name: "max_year",
//       label: "Maximum Years",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 1, 3, 5",
//       help: "Enter the maximum years of experience (must be greater than minimum years)",
//       min: 0,
//       step: 1,
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
//       help: "Trending experience levels will be highlighted in the listing",
//     },
//   ];

//   // ─── Validation rules with proper validation ───────────────────
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: "Experience level name is required",
//       minLength: 2,
//       minLengthMessage: "Experience level name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Experience level name must be at most 100 characters",
//     },
//     min_year: {
//       required: true,
//       requiredMessage: "Minimum years is required",
//       min: 0,
//       minMessage: "Minimum years must be 0 or greater",
//       custom: (value, formValues) => {
//         const minVal = parseInt(value);
//         const maxVal = parseInt(formValues?.max_year);
        
//         // Check if min_year is a valid number
//         if (isNaN(minVal)) {
//           return "Minimum years must be a valid number";
//         }
        
//         // Check if min_year is less than 0
//         if (minVal < 0) {
//           return "Minimum years cannot be negative";
//         }
        
//         // Check if max_year is provided and valid
//         if (formValues?.max_year && formValues.max_year !== "") {
//           if (isNaN(maxVal)) {
//             return "Maximum years must be a valid number";
//           }
//           if (minVal > maxVal) {
//             return "Minimum years cannot be greater than maximum years";
//           }
//           if (minVal === maxVal) {
//             return "Minimum and maximum years cannot be equal. Please provide a valid range.";
//           }
//         }
        
//         // Check if min_year exceeds a reasonable limit (e.g., 50 years)
//         if (minVal > 50) {
//           return "Minimum years cannot exceed 50 years";
//         }
        
//         return null;
//       },
//     },
//     max_year: {
//       required: true,
//       requiredMessage: "Maximum years is required",
//       min: 0,
//       minMessage: "Maximum years must be 0 or greater",
//       custom: (value, formValues) => {
//         const maxVal = parseInt(value);
//         const minVal = parseInt(formValues?.min_year);
        
//         // Check if max_year is a valid number
//         if (isNaN(maxVal)) {
//           return "Maximum years must be a valid number";
//         }
        
//         // Check if max_year is less than 0
//         if (maxVal < 0) {
//           return "Maximum years cannot be negative";
//         }
        
//         // Check if min_year is provided and valid
//         if (formValues?.min_year && formValues.min_year !== "") {
//           if (isNaN(minVal)) {
//             return "Minimum years must be a valid number";
//           }
//           if (maxVal < minVal) {
//             return "Maximum years cannot be less than minimum years";
//           }
//           if (maxVal === minVal) {
//             return "Minimum and maximum years cannot be equal. Please provide a valid range.";
//           }
//         }
        
//         // Check if max_year exceeds a reasonable limit (e.g., 50 years)
//         if (maxVal > 50) {
//           return "Maximum years cannot exceed 50 years";
//         }
        
//         // Check if the range is too large (e.g., more than 30 years)
//         if (minVal !== undefined && !isNaN(minVal) && (maxVal - minVal) > 30) {
//           return "Experience range cannot exceed 30 years. Please narrow the range.";
//         }
        
//         return null;
//       },
//     },
//   };

//   // ─── Handle form submission ─────────────────────────────────────
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       // Parse years with proper validation
//       const minYear = parseInt(formData.min_year);
//       const maxYear = parseInt(formData.max_year);
      
//       // Extra validation before submission
//       if (isNaN(minYear) || minYear < 0) {
//         showError("Minimum years must be a valid number greater than or equal to 0");
//         setLoading(false);
//         return;
//       }
      
//       if (isNaN(maxYear) || maxYear < 0) {
//         showError("Maximum years must be a valid number greater than or equal to 0");
//         setLoading(false);
//         return;
//       }
      
//       if (minYear > maxYear) {
//         showError("Minimum years cannot be greater than maximum years");
//         setLoading(false);
//         return;
//       }
      
//       if (minYear === maxYear) {
//         showError("Minimum and maximum years cannot be equal. Please provide a valid range.");
//         setLoading(false);
//         return;
//       }

//       const submitData = {
//         name: formData.name.trim(),
//         min_year: minYear,
//         max_year: maxYear,
//         is_status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//         status: formData.status === "active", // Also send status for compatibility
//       };

//       console.log('Submitting update data:', submitData);
//       await experienceLevelService.update(id, submitData);
//       showSuccess("Experience level updated successfully");
      
//       navigate('/experience-levels');
//     } catch (error) {
//       console.error('Submit error:', error);
//       console.error('Error response:', error.response);
//       const errorMessage = error?.response?.data?.message || 
//                           error?.message || 
//                           "Failed to update experience level";
//       showError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Handle delete ──────────────────────────────────────────────
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await experienceLevelService.delete(id);
//       showSuccess("Experience level deleted successfully");
//       navigate('/experience-levels');
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this experience level because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete experience level");
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
//           <p className="text-sm text-gray-400">Loading experience level data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Experience Level"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/experience-levels"
//       breadcrumb={`Editing: ${editItem?.name || 'Experience Level'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditExperienceLevel;

// pages/experience-levels/EditExperienceLevel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  MdTimeline,
} from 'react-icons/md';
import { experienceLevelService } from '../../services/experienceLevel.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';
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
const EditExperienceLevel = () => {
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
    name: '',
    min_year: '',
    max_year: '',
    status: 'active',
    is_trending: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ─── Fetch users for audit names ────────────────────────────
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

  // ─── Fetch experience level data ───────────────────────────
  useEffect(() => {
    const fetchExperienceLevel = async () => {
      setFetchLoading(true);
      try {
        const response = await experienceLevelService.getById(id);

        let data = response?.data || response;
        if (response?.data?.data) {
          data = response.data.data;
        }

        if (data && data.id) {
          setEditItem(data);
          setFormValues({
            name: data.name || '',
            min_year: data.min_year ?? '',
            max_year: data.max_year ?? '',
            status: data.is_status ? 'active' : 'inactive',
            is_trending: data.is_trending || false,
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
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchExperienceLevel();
    }
  }, [id, navigate]);

  // ─── Helper: get user name ────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    const key = String(userId);
    return userNameCache[key] || `User ${userId}`;
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
  const validateField = (name, value, allValues) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) return 'Experience level name is required';
        if (value.trim().length < 2) return 'Experience level name must be at least 2 characters';
        if (value.trim().length > 100) return 'Experience level name must be at most 100 characters';
        return null;

      case 'min_year': {
        if (value === '' || value === null || value === undefined) {
          return 'Minimum years is required';
        }
        const minVal = parseInt(value);
        const maxVal = parseInt(allValues?.max_year);

        if (isNaN(minVal)) return 'Minimum years must be a valid number';
        if (minVal < 0) return 'Minimum years cannot be negative';
        if (minVal > 50) return 'Minimum years cannot exceed 50 years';

        if (allValues?.max_year && allValues.max_year !== '') {
          if (isNaN(maxVal)) return 'Maximum years must be a valid number';
          if (minVal > maxVal) return 'Minimum years cannot be greater than maximum years';
          if (minVal === maxVal) return 'Minimum and maximum years cannot be equal. Please provide a valid range.';
        }
        return null;
      }

      case 'max_year': {
        if (value === '' || value === null || value === undefined) {
          return 'Maximum years is required';
        }
        const maxVal = parseInt(value);
        const minVal = parseInt(allValues?.min_year);

        if (isNaN(maxVal)) return 'Maximum years must be a valid number';
        if (maxVal < 0) return 'Maximum years cannot be negative';
        if (maxVal > 50) return 'Maximum years cannot exceed 50 years';

        if (allValues?.min_year && allValues.min_year !== '') {
          if (isNaN(minVal)) return 'Minimum years must be a valid number';
          if (maxVal < minVal) return 'Maximum years cannot be less than minimum years';
          if (maxVal === minVal) return 'Minimum and maximum years cannot be equal. Please provide a valid range.';
          if (!isNaN(minVal) && (maxVal - minVal) > 30) {
            return 'Experience range cannot exceed 30 years. Please narrow the range.';
          }
        }
        return null;
      }

      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ['name', 'min_year', 'max_year'].forEach((field) => {
      const error = validateField(field, formValues[field], formValues);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

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
      const minYear = parseInt(formValues.min_year);
      const maxYear = parseInt(formValues.max_year);

      // Extra validation before submission
      if (isNaN(minYear) || minYear < 0) {
        showError('Minimum years must be a valid number greater than or equal to 0');
        setLoading(false);
        return;
      }
      if (isNaN(maxYear) || maxYear < 0) {
        showError('Maximum years must be a valid number greater than or equal to 0');
        setLoading(false);
        return;
      }
      if (minYear > maxYear) {
        showError('Minimum years cannot be greater than maximum years');
        setLoading(false);
        return;
      }
      if (minYear === maxYear) {
        showError('Minimum and maximum years cannot be equal. Please provide a valid range.');
        setLoading(false);
        return;
      }

      const submitData = {
        name: formValues.name.trim(),
        min_year: minYear,
        max_year: maxYear,
        is_status: formValues.status === 'active',
        is_trending: formValues.is_trending || false,
        status: formValues.status === 'active',
      };

      await experienceLevelService.update(id, submitData);
      showSuccess('Experience level updated successfully');
      navigate('/experience-levels');
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update experience level';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await experienceLevelService.delete(id);
      showSuccess('Experience level deleted successfully');
      navigate('/experience-levels');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || '';
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError('Cannot delete this experience level because it is being used in other records.');
      } else {
        showError(message || 'Failed to delete experience level');
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate('/experience-levels');

  // ─── Render helper for fields ──────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, color, min, step } = field;
    const value = formValues[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;

    const commonClass = `w-full px-3.5 py-2.5 border ${hasError ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    let inputElement;
    switch (type) {
      case 'number':
        inputElement = (
          <input
            type="number"
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            min={min}
            step={step}
            className={commonClass}
          />
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
          <p className="text-sm text-slate-400">Loading experience level data...</p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const levelName = formValues.name?.trim() || 'Experience Level';
  const status = formValues.status || 'active';
  const isTrending = formValues.is_trending || false;
  const minYear = formValues.min_year !== '' ? formValues.min_year : '—';
  const maxYear = formValues.max_year !== '' ? formValues.max_year : '—';
  const rangeDisplay = `${minYear} – ${maxYear} yrs`;
  const createdDate = editItem.created_at ? formatDate(editItem.created_at) : '—';
  const updatedDate = editItem.updated_at ? formatDate(editItem.updated_at) : '—';

  const initials = levelName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Field definitions ────────────────────────────────────
  const fields = [
    {
      name: 'name',
      label: 'Experience Level Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Fresher, Junior, Senior, Lead',
      help: 'Enter the experience level name',
    },
    {
      name: 'min_year',
      label: 'Minimum Years',
      type: 'number',
      required: true,
      placeholder: 'e.g. 0, 1, 2',
      help: 'Enter the minimum years of experience (must be 0 or greater)',
      min: 0,
      step: 1,
    },
    {
      name: 'max_year',
      label: 'Maximum Years',
      type: 'number',
      required: true,
      placeholder: 'e.g. 1, 3, 5',
      help: 'Enter the maximum years of experience (must be greater than minimum years)',
      min: 0,
      step: 1,
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
      help: 'Trending experience levels will be highlighted in the listing',
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
              <p className="text-[11px] text-slate-400 leading-tight">Experience Levels</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Edit: {levelName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete experience level"
              title="Delete experience level"
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
              {loading ? 'Updating...' : 'Update Level'}
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
            <MdTimeline size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Range</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {minYear} – {maxYear}
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
                      layoutId="edit-exp-level-tab-underline"
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
                          className={field.type === 'checkbox' || field.type === 'radio' ? 'sm:col-span-2' : ''}
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
                          'Update Level'
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

      {/* ─── Delete Confirmation Dialog ──────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Experience Level"
        message={`Delete experience level "${levelName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EditExperienceLevel;