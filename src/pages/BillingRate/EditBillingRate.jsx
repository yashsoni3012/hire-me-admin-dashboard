// // pages/billing-rates/EditBillingRate.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { billingRateService } from '../../services/billingRate.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditBillingRate = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   // Fetch billing rate data
//   useEffect(() => {
//     const fetchBillingRate = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await billingRateService.getById(id);
//         console.log('Billing rate response:', response);
        
//         // Handle different response structures
//         const result = response?.data || response;
//         const data = result?.data || result;
//         console.log('Extracted data:', data);
        
//         if (data && data.id) {
//           // ─── Determine status ────────────────────────────────────
//           let isActive = false;
//           if (data.is_status !== undefined && data.is_status !== null) {
//             isActive = data.is_status === true || data.is_status === 1 || data.is_status === "1" || data.is_status === "true";
//           } else if (data.status !== undefined && data.status !== null) {
//             isActive = data.status === true || data.status === 1 || data.status === "1" || data.status === "true" || data.status === "active";
//           }

//           const formData = {
//             display_text: data.display_text || "",
//             amount: data.amount || "",
//             display_order: data.display_order || 0,
//             status: isActive ? "active" : "inactive",
//           };
//           console.log('Form data prepared:', formData);
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("Billing rate not found");
//           navigate('/billing-rates');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load billing rate data");
//         navigate('/billing-rates');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchBillingRate();
//     }
//   }, [id, navigate]);

//   // Form fields configuration
//   const fields = [
//     {
//       name: "display_text",
//       label: "Display Text",
//       type: "text",
//       required: true,
//       placeholder: "e.g. Hourly Rate, Daily Rate, Monthly Rate",
//       help: "Enter the display text for this billing rate",
//     },
//     {
//       name: "amount",
//       label: "Amount",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 50, 100, 200",
//       help: "Enter the amount for this billing rate",
//       min: 0,
//       step: 0.01,
//     },
//     {
//       name: "display_order",
//       label: "Display Order",
//       type: "number",
//       required: false,
//       placeholder: "e.g. 0, 1, 2",
//       help: "Order in which billing rate should appear (0 = first)",
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
//   ];

//   // Validation rules
//   const validationRules = {
//     display_text: {
//       required: true,
//       requiredMessage: "Display text is required",
//       minLength: 2,
//       minLengthMessage: "Display text must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Display text must be at most 100 characters",
//     },
//     amount: {
//       required: true,
//       requiredMessage: "Amount is required",
//       min: 0,
//       minMessage: "Amount must be greater than or equal to 0",
//       custom: (value) => {
//         const numValue = parseFloat(value);
//         if (isNaN(numValue) || numValue < 0) {
//           return "Please enter a valid amount";
//         }
//         return null;
//       },
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

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       // ─── Parse display_order ────────────────────────────────────
//       const displayOrder = formData.display_order !== "" && formData.display_order !== null && formData.display_order !== undefined 
//         ? parseInt(formData.display_order) 
//         : 0;

//       const submitData = {
//         display_text: formData.display_text.trim(),
//         amount: parseFloat(formData.amount),
//         display_order: displayOrder,
//         status: formData.status === "active",
//       };

//       console.log('Updating billing rate data:', submitData);
//       await billingRateService.update(id, submitData);
//       showSuccess("Billing rate updated successfully");
      
//       navigate('/billing-rates');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update billing rate");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await billingRateService.delete(id);
//       showSuccess("Billing rate deleted successfully");
//       navigate('/billing-rates');
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this billing rate because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete billing rate");
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
//           <p className="text-sm text-gray-400">Loading billing rate data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Billing Rate"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/billing-rates"
//       breadcrumb={`Editing: ${editItem?.display_text || 'Billing Rate'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditBillingRate;

// pages/billing-rates/EditBillingRate.jsx
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
} from 'react-icons/md';
import { billingRateService } from '../../services/billingRate.service';
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
const EditBillingRate = () => {
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
    display_text: '',
    amount: '',
    display_order: 0,
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

  // ─── Fetch billing rate data ─────────────────────────────────
  useEffect(() => {
    const fetchBillingRate = async () => {
      setFetchLoading(true);
      try {
        const response = await billingRateService.getById(id);
        const result = response?.data || response;
        const data = result?.data || result;

        if (data && data.id) {
          setEditItem(data);
          // Determine status
          let isActive = false;
          if (data.is_status !== undefined && data.is_status !== null) {
            isActive = data.is_status === true || data.is_status === 1 || data.is_status === '1' || data.is_status === 'true';
          } else if (data.status !== undefined && data.status !== null) {
            isActive = data.status === true || data.status === 1 || data.status === '1' || data.status === 'true' || data.status === 'active';
          }

          const formData = {
            display_text: data.display_text || '',
            amount: data.amount || '',
            display_order: data.display_order ?? 0,
            status: isActive ? 'active' : 'inactive',
          };
          setFormValues(formData);
        } else {
          showError('Billing rate not found');
          navigate('/billing-rates');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load billing rate data');
        navigate('/billing-rates');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchBillingRate();
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
      case 'display_text':
        if (!value || !value.trim()) return 'Display text is required';
        if (value.trim().length < 2) return 'Display text must be at least 2 characters';
        if (value.trim().length > 100) return 'Display text must be at most 100 characters';
        return null;
      case 'amount':
        if (!value && value !== 0) return 'Amount is required';
        const numVal = parseFloat(value);
        if (isNaN(numVal) || numVal < 0) return 'Please enter a valid amount';
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

    const fieldsToValidate = ['display_text', 'amount'];
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    const displayOrderError = validateField('display_order', formValues.display_order);
    if (displayOrderError) {
      newErrors.display_order = displayOrderError;
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
      const displayOrder = formValues.display_order !== '' && formValues.display_order !== null && formValues.display_order !== undefined
        ? parseInt(formValues.display_order)
        : 0;

      const submitData = {
        display_text: formValues.display_text.trim(),
        amount: parseFloat(formValues.amount) || 0,
        display_order: displayOrder,
        status: formValues.status === 'active',
      };

      await billingRateService.update(id, submitData);
      showSuccess('Billing rate updated successfully');
      navigate('/billing-rates');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || 'Failed to update billing rate');
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await billingRateService.delete(id);
      showSuccess('Billing rate deleted successfully');
      navigate('/billing-rates');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || '';
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError('Cannot delete this billing rate because it is being used in other records.');
      } else {
        showError(message || 'Failed to delete billing rate');
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate('/billing-rates');

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
          <p className="text-sm text-slate-400">Loading billing rate data...</p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const displayText = formValues.display_text?.trim() || 'Billing Rate';
  const amount = formValues.amount ? parseFloat(formValues.amount).toFixed(2) : '0.00';
  const status = formValues.status || 'active';
  const displayOrder = formValues.display_order ?? 0;
  const createdDate = editItem.created_at ? formatDate(editItem.created_at) : '—';
  const updatedDate = editItem.updated_at ? formatDate(editItem.updated_at) : '—';

  const initials = displayText
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Field definitions ────────────────────────────────────
  const fields = [
    {
      name: 'display_text',
      label: 'Display Text',
      type: 'text',
      required: true,
      placeholder: 'e.g. Hourly Rate, Daily Rate, Monthly Rate',
      help: 'Enter the display text for this billing rate',
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      placeholder: 'e.g. 50, 100, 200',
      help: 'Enter the amount for this billing rate',
      min: 0,
      step: 0.01,
    },
    {
      name: 'display_order',
      label: 'Display Order',
      type: 'number',
      required: false,
      placeholder: 'e.g. 0, 1, 2',
      help: 'Order in which billing rate should appear (0 = first)',
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
              <p className="text-[11px] text-slate-400 leading-tight">Billing Rates</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Edit: {displayText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete billing rate"
              title="Delete billing rate"
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
              {loading ? 'Updating...' : 'Update Billing Rate'}
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
                    {displayText}
                  </h1>
                  <StatusPill status={status} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">Amount: ₹{amount}</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
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
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Amount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                ₹{amount}
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
                      layoutId="edit-billing-rate-tab-underline"
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
                          className={field.type === 'radio' ? 'sm:col-span-2' : ''}
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
                          'Update Billing Rate'
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
        title="Delete Billing Rate"
        message={`Delete billing rate "${displayText}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EditBillingRate;