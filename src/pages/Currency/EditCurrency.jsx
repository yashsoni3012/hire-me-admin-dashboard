// // pages/currencies/EditCurrency.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { currencyService } from '../../services/currency.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditCurrency = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   // Fetch currency data
//   useEffect(() => {
//     const fetchCurrency = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await currencyService.getById(id);
//         const data = response?.data || response;
         
//         if (data) {
//           // ─── Determine status ────────────────────────────────────
//           let isActive = false;
//           if (data.is_status !== undefined && data.is_status !== null) {
//             isActive = data.is_status === true || data.is_status === 1 || data.is_status === "1" || data.is_status === "true";
//           } else if (data.status !== undefined && data.status !== null) {
//             isActive = data.status === true || data.status === 1 || data.status === "1" || data.status === "true" || data.status === "active";
//           }

//           // ─── Determine is_default ────────────────────────────────
//           let isDefault = false;
//           if (data.is_default !== undefined && data.is_default !== null) {
//             isDefault = data.is_default === true || data.is_default === 1 || data.is_default === "1" || data.is_default === "true";
//           }

//           const formData = {
//             currency_name: data.currency_name || data.name || "",
//             currency_code: data.currency_code || data.code || "",
//             currency_symbol: data.currency_symbol || data.symbol || "",
//             display_order: data.display_order || 0,
//             is_default: isDefault,
//             status: isActive ? "active" : "inactive",
//           };
//           console.log('Form data prepared:', formData);
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("Currency not found");
//           navigate('/currencies');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load currency data");
//         navigate('/currencies');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchCurrency();
//     }
//   }, [id, navigate]);

//   // Form fields configuration
//   const fields = [
//     {
//       name: "currency_name",
//       label: "Currency Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. US Dollar, Euro, Indian Rupee",
//       help: "Enter the full name of the currency",
//     },
//     {
//       name: "currency_code",
//       label: "Currency Code",
//       type: "text",
//       required: true,
//       placeholder: "e.g. USD, EUR, INR",
//       help: "Enter the 3-letter currency code",
//       maxLength: 3,
//     },
//     {
//       name: "currency_symbol",
//       label: "Currency Symbol",
//       type: "text",
//       required: true,
//       placeholder: "e.g. $, €, ₹",
//       help: "Enter the currency symbol (special characters only)",
//       maxLength: 10,
//     },
//     {
//       name: "display_order",
//       label: "Display Order",
//       type: "number",
//       required: false,
//       placeholder: "e.g. 0, 1, 2",
//       help: "Order in which currency should appear (0 = first)",
//       min: 0,
//       step: 1,
//     },
//     {
//       name: "is_default",
//       label: "Set as Default Currency",
//       type: "checkbox",
//       color: "text-green-500 focus:ring-green-500",
//       help: "Note: This field is managed by the system",
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
//   ];

//   // ─── Validation rules ──────────────────────────────────────────
//   const validationRules = {
//     currency_name: {
//       required: true,
//       requiredMessage: "Currency name is required",
//       minLength: 2,
//       minLengthMessage: "Currency name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Currency name must be at most 100 characters",
//     },
//     currency_code: {
//       required: true,
//       requiredMessage: "Currency code is required",
//       minLength: 3,
//       minLengthMessage: "Currency code must be exactly 3 characters",
//       maxLength: 3,
//       maxLengthMessage: "Currency code must be exactly 3 characters",
//       pattern: /^[A-Z]{3}$/,
//       patternMessage: "Currency code must be 3 uppercase letters (e.g., USD, EUR, INR)",
//     },
//     currency_symbol: {
//       required: true,
//       requiredMessage: "Currency symbol is required",
//       maxLength: 10,
//       maxLengthMessage: "Currency symbol must be at most 10 characters",
//       pattern: /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?£€¥₹₽₩₦₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿]+$/,
//       patternMessage: "Currency symbol must contain only special characters (e.g., $, €, ₹, £)",
//       custom: (value) => {
//         if (value && /[a-zA-Z0-9]/.test(value)) {
//           return "Currency symbol should be a special character (e.g., $, €, ₹, £)";
//         }
//         return null;
//       }
//     },
//     display_order: {
//       required: false,
//       min: 0,
//       minMessage: "Display order must be 0 or greater",
//       custom: (value) => {
//         if (value && value !== "" && !Number.isInteger(Number(value))) {
//           return "Display order must be a whole number";
//         }
//         return null;
//       }
//     },
//   };

//   // ─── Handle form submission ──────────────────────────────────
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       // ─── Extra validation for symbol ──────────────────────────
//       const symbol = formData.currency_symbol.trim();
//       if (/[a-zA-Z0-9]/.test(symbol)) {
//         showError("Currency symbol must be a special character only (e.g., $, €, ₹, £)");
//         setLoading(false);
//         return;
//       }

//       // ─── Parse display_order ────────────────────────────────────
//       const displayOrder = formData.display_order !== "" && formData.display_order !== null && formData.display_order !== undefined 
//         ? parseInt(formData.display_order) 
//         : 0;

//       // ─── Parse is_default - convert to integer (0 or 1) ──────
//       const isDefault = formData.is_default ? 1 : 0;

//       const submitData = {
//         currency_name: formData.currency_name.trim(),
//         currency_code: formData.currency_code.trim().toUpperCase(),
//         currency_symbol: symbol,
//         display_order: displayOrder,
//         is_default: isDefault, // Send as integer (0 or 1)
//         status: formData.status === "active" ? 1 : 0,
//       };

//       console.log('Updating currency data:', submitData);
//       await currencyService.update(id, submitData);
//       showSuccess("Currency updated successfully");
      
//       navigate('/currencies');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update currency");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Handle delete ──────────────────────────────────────────
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await currencyService.delete(id);
//       showSuccess("Currency deleted successfully");
//       navigate('/currencies');
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this currency because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete currency");
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
//           <p className="text-sm text-gray-400">Loading currency data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Currency"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/currencies"
//       breadcrumb={`Editing: ${editItem?.currency_name || 'Currency'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditCurrency;

// pages/currencies/EditCurrency.jsx
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
  MdAttachMoney,
  MdStar,
  MdTrendingUp,
} from 'react-icons/md';
import { currencyService } from '../../services/currency.service';
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
const EditCurrency = () => {
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
    currency_name: '',
    currency_code: '',
    currency_symbol: '',
    display_order: 0,
    is_default: false,
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  // ─── Fetch currency data ─────────────────────────────────────
  useEffect(() => {
    const fetchCurrency = async () => {
      setFetchLoading(true);
      try {
        const response = await currencyService.getById(id);
        const data = response?.data || response;

        if (data) {
          // Determine status
          let isActive = false;
          if (data.is_status !== undefined && data.is_status !== null) {
            isActive = data.is_status === true || data.is_status === 1 || data.is_status === '1' || data.is_status === 'true';
          } else if (data.status !== undefined && data.status !== null) {
            isActive = data.status === true || data.status === 1 || data.status === '1' || data.status === 'true' || data.status === 'active';
          }

          // Determine is_default
          let isDefault = false;
          if (data.is_default !== undefined && data.is_default !== null) {
            isDefault = data.is_default === true || data.is_default === 1 || data.is_default === '1' || data.is_default === 'true';
          }

          setEditItem(data);
          const formData = {
            currency_name: data.currency_name || data.name || '',
            currency_code: data.currency_code || data.code || '',
            currency_symbol: data.currency_symbol || data.symbol || '',
            display_order: data.display_order || 0,
            is_default: isDefault,
            status: isActive ? 'active' : 'inactive',
          };
          setFormValues(formData);
        } else {
          showError('Currency not found');
          navigate('/currencies');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load currency data');
        navigate('/currencies');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchCurrency();
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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case 'currency_name':
        if (!value || !value.trim()) return 'Currency name is required';
        if (value.trim().length < 2) return 'Currency name must be at least 2 characters';
        if (value.trim().length > 100) return 'Currency name must be at most 100 characters';
        return null;
      case 'currency_code':
        if (!value || !value.trim()) return 'Currency code is required';
        if (value.trim().length !== 3) return 'Currency code must be exactly 3 characters';
        if (!/^[A-Z]{3}$/i.test(value.trim())) {
          return 'Currency code must be 3 letters (e.g., USD, EUR, INR)';
        }
        return null;
      case 'currency_symbol':
        if (!value || !value.trim()) return 'Currency symbol is required';
        if (value.trim().length > 10) return 'Currency symbol must be at most 10 characters';
        if (/[a-zA-Z0-9]/.test(value.trim())) {
          return 'Currency symbol should be a special character (e.g., $, €, ₹, £)';
        }
        return null;
      case 'display_order':
        if (value !== '' && value !== null && value !== undefined) {
          const num = Number(value);
          if (!Number.isInteger(num) || num < 0) {
            return 'Display order must be 0 or a positive whole number';
          }
        }
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const fieldsToValidate = ['currency_name', 'currency_code', 'currency_symbol'];
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    const displayError = validateField('display_order', formValues.display_order);
    if (displayError) {
      newErrors.display_order = displayError;
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
      const symbol = formValues.currency_symbol.trim();
      if (/[a-zA-Z0-9]/.test(symbol)) {
        showError('Currency symbol must be a special character only (e.g., $, €, ₹, £)');
        setLoading(false);
        return;
      }

      const displayOrder = formValues.display_order !== '' && formValues.display_order !== null && formValues.display_order !== undefined
        ? parseInt(formValues.display_order)
        : 0;

      const isDefault = formValues.is_default ? 1 : 0;

      const submitData = {
        currency_name: formValues.currency_name.trim(),
        currency_code: formValues.currency_code.trim().toUpperCase(),
        currency_symbol: symbol,
        display_order: displayOrder,
        is_default: isDefault,
        status: formValues.status === 'active' ? 1 : 0,
      };

      await currencyService.update(id, submitData);
      showSuccess('Currency updated successfully');
      navigate('/currencies');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || 'Failed to update currency');
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await currencyService.delete(id);
      showSuccess('Currency deleted successfully');
      navigate('/currencies');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || '';
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError('Cannot delete this currency because it is being used in other records.');
      } else {
        showError(message || 'Failed to delete currency');
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate('/currencies');

  // ─── Render helper for fields ──────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, color, min, step, maxLength } = field;
    const value = formValues[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;

    const commonClass = `w-full px-3.5 py-2.5 border ${hasError ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    let inputElement;
    switch (type) {
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
      default:
        inputElement = (
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            maxLength={maxLength}
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
          <p className="text-sm text-slate-400">Loading currency data...</p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const currencyName = formValues.currency_name?.trim() || 'Currency';
  const currencyCode = formValues.currency_code?.trim().toUpperCase() || '---';
  const currencySymbol = formValues.currency_symbol?.trim() || '¤';
  const status = formValues.status || 'active';
  const isDefault = formValues.is_default || false;
  const displayOrder = formValues.display_order ?? 0;
  const createdDate = editItem.created_at ? formatDate(editItem.created_at) : '—';
  const updatedDate = editItem.updated_at ? formatDate(editItem.updated_at) : '—';

  const initials = currencyName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Field definitions ────────────────────────────────────
  const fields = [
    {
      name: 'currency_name',
      label: 'Currency Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. US Dollar, Euro, Indian Rupee',
      help: 'Enter the full name of the currency',
    },
    {
      name: 'currency_code',
      label: 'Currency Code',
      type: 'text',
      required: true,
      placeholder: 'e.g. USD, EUR, INR',
      help: 'Enter the 3-letter currency code',
      maxLength: 3,
    },
    {
      name: 'currency_symbol',
      label: 'Currency Symbol',
      type: 'text',
      required: true,
      placeholder: 'e.g. $, €, ₹',
      help: 'Enter the currency symbol (special characters only)',
      maxLength: 10,
    },
    {
      name: 'display_order',
      label: 'Display Order',
      type: 'number',
      required: false,
      placeholder: 'e.g. 0, 1, 2',
      help: 'Order in which currency should appear (0 = first)',
      min: 0,
      step: 1,
    },
    {
      name: 'is_default',
      label: 'Set as Default Currency',
      type: 'checkbox',
      color: 'text-green-500 focus:ring-green-500',
      help: 'Note: This field is managed by the system',
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
              <p className="text-[11px] text-slate-400 leading-tight">Currencies</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Edit: {currencyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete currency"
              title="Delete currency"
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
              {loading ? 'Updating...' : 'Update Currency'}
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
                  {initials || <MdAttachMoney size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {currencyName}
                  </h1>
                  <StatusPill status={status} />
                  {isDefault && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-400/20 text-green-300 ring-1 ring-green-400/30">
                      <MdStar size={12} />
                      Default
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">Code: {currencyCode}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">Symbol: {currencySymbol}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">Order: {displayOrder}</span>
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
            <MdStar size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Default</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {isDefault ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Symbol</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {currencySymbol || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCheckCircle size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Code</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {currencyCode}
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
                      layoutId="edit-currency-tab-underline"
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
                          'Update Currency'
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
        title="Delete Currency"
        message={`Delete currency "${currencyName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EditCurrency;