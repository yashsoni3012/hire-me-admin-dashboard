// // pages/subscription-coupons/AddSubscriptionCoupon.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { subscriptionCouponService } from '../../services/subscriptionCoupon.service';
// import { showSuccess, showError } from '../../utils/toast';

// const AddSubscriptionCoupon = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // ─── Helper: Get today's date in YYYY-MM-DD format ──────────
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Form fields configuration
//   const fields = [
//     {
//       name: "coupon_code",
//       label: "Coupon Code",
//       type: "text",
//       required: true,
//       placeholder: "e.g. SUMMER20, WELCOME10",
//       help: "Enter a unique coupon code (will be converted to uppercase)",
//     },
//     {
//       name: "title",
//       label: "Title",
//       type: "text",
//       required: true,
//       placeholder: "e.g. Summer Sale 20% Off",
//       help: "Enter a descriptive title for the coupon",
//     },
//     {
//       name: "discount_type",
//       label: "Discount Type",
//       type: "select",
//       required: true,
//       options: [
//         { value: "percentage", label: "Percentage (%)" },
//         { value: "fixed", label: "Fixed Amount (₹)" },
//       ],
//       placeholder: "Select discount type",
//       help: "Choose whether discount is percentage or fixed amount",
//     },
//     {
//       name: "discount_value",
//       label: "Discount Value",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 20",
//       help: "Enter the discount value",
//       min: 0,
//       step: 0.01,
//     },
//     {
//       name: "minimum_amount",
//       label: "Minimum Amount",
//       type: "number",
//       required: false,
//       placeholder: "e.g. 100",
//       help: "Minimum order amount to apply this coupon (0 for no minimum)",
//       min: 0,
//       step: 0.01,
//     },
//     {
//       name: "max_discount",
//       label: "Maximum Discount",
//       type: "number",
//       required: false,
//       placeholder: "e.g. 500",
//       help: "Maximum discount amount (leave empty for unlimited)",
//       min: 0,
//       step: 0.01,
//     },
//     // ─── Valid From Field ─────────────────────────────────────────
//     {
//       name: "valid_from",
//       label: "Valid From",
//       type: "date",
//       required: false,
//       min: getTodayDate(),
//       help: "Date from which the coupon is valid (cannot be in the past)",
//     },
//     // ─── Valid To Field ───────────────────────────────────────────
//     {
//       name: "valid_to",
//       label: "Valid To",
//       type: "date",
//       required: false,
//       min: getTodayDate(),
//       help: "Date until which the coupon is valid (cannot be in the past)",
//     },
//     {
//       name: "usage_limit",
//       label: "Usage Limit",
//       type: "number",
//       required: false,
//       placeholder: "e.g. 100",
//       help: "Total number of times this coupon can be used (leave empty for unlimited)",
//       min: 1,
//       step: 1,
//     },
//     {
//       name: "per_company_limit",
//       label: "Per Company Limit",
//       type: "number",
//       required: false,
//       placeholder: "e.g. 1",
//       help: "Number of times a single company can use this coupon",
//       min: 1,
//       step: 1,
//     },
//     {
//       name: "is_trending",
//       label: "Mark as Trending",
//       type: "checkbox",
//       color: "text-yellow-500 focus:ring-yellow-500",
//       help: "Trending coupons will be highlighted",
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
//     coupon_code: {
//       required: true,
//       requiredMessage: "Coupon code is required",
//       minLength: 3,
//       minLengthMessage: "Coupon code must be at least 3 characters",
//       maxLength: 50,
//       maxLengthMessage: "Coupon code must be at most 50 characters",
//       pattern: /^[A-Za-z0-9_\-]+$/,
//       patternMessage: "Coupon code can only contain letters, numbers, underscores and hyphens",
//     },
//     title: {
//       required: true,
//       requiredMessage: "Title is required",
//       minLength: 3,
//       minLengthMessage: "Title must be at least 3 characters",
//       maxLength: 100,
//       maxLengthMessage: "Title must be at most 100 characters",
//     },
//     discount_type: {
//       required: true,
//       requiredMessage: "Please select a discount type",
//     },
//     discount_value: {
//       required: true,
//       requiredMessage: "Discount value is required",
//       min: 0,
//       minMessage: "Discount value must be greater than or equal to 0",
//       custom: (value) => {
//         const numValue = parseFloat(value);
//         if (isNaN(numValue) || numValue < 0) {
//           return "Please enter a valid discount value";
//         }
//         return null;
//       },
//     },
//     // ─── Valid From Date Validation ──────────────────────────────
//     valid_from: {
//       required: false,
//       custom: (value, formValues) => {
//         if (value && value.trim() !== "") {
//           const selectedDate = new Date(`${value}T00:00:00`);
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
          
//           if (selectedDate < today) {
//             return "Valid from date cannot be in the past";
//           }
//         }
//         return null;
//       },
//     },
//     // ─── Valid To Date Validation ────────────────────────────────
//     valid_to: {
//       required: false,
//       custom: (value, formValues) => {
//         if (value && value.trim() !== "") {
//           const selectedDate = new Date(`${value}T00:00:00`);
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
          
//           if (selectedDate < today) {
//             return "Valid to date cannot be in the past";
//           }
          
//           // Check if valid_to is before valid_from
//           const validFrom = formValues?.valid_from;
//           if (validFrom && validFrom.trim() !== "") {
//             const fromDate = new Date(`${validFrom}T00:00:00`);
//             if (selectedDate < fromDate) {
//               return "Valid to date must be after or equal to valid from date";
//             }
//           }
//         }
//         return null;
//       },
//     },
//   };

//   // Initial data
//   const initialData = {
//     coupon_code: "",
//     title: "",
//     discount_type: "percentage",
//     discount_value: "",
//     minimum_amount: "",
//     max_discount: "",
//     valid_from: "",
//     valid_to: "",
//     usage_limit: "",
//     per_company_limit: "1",
//     is_trending: false,
//     status: "active",
//   };

//   // ─── Handle form submission ──────────────────────────────────
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       // ─── Extra validation for dates ──────────────────────────
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       // Check valid_from
//       if (formData.valid_from) {
//         const validFromDate = new Date(`${formData.valid_from}T00:00:00`);
//         if (validFromDate < today) {
//           showError("Valid from date cannot be in the past");
//           setLoading(false);
//           return;
//         }
//       }

//       // Check valid_to
//       if (formData.valid_to) {
//         const validToDate = new Date(`${formData.valid_to}T00:00:00`);
//         if (validToDate < today) {
//           showError("Valid to date cannot be in the past");
//           setLoading(false);
//           return;
//         }

//         // Check if valid_to is before valid_from
//         if (formData.valid_from) {
//           const validFromDate = new Date(`${formData.valid_from}T00:00:00`);
//           if (validToDate < validFromDate) {
//             showError("Valid to date must be after or equal to valid from date");
//             setLoading(false);
//             return;
//           }
//         }
//       }

//       const submitData = {
//         coupon_code: formData.coupon_code.trim().toUpperCase(),
//         title: formData.title.trim(),
//         discount_type: formData.discount_type || "percentage",
//         discount_value: parseFloat(formData.discount_value) || 0,
//         minimum_amount: parseFloat(formData.minimum_amount) || 0,
//         max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
//         valid_from: formData.valid_from || null,
//         valid_to: formData.valid_to || null,
//         usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
//         per_company_limit: parseInt(formData.per_company_limit) || 1,
//         is_trending: formData.is_trending || false,
//         status: formData.status === "active",
//       };

//       console.log('Submitting coupon data:', submitData);
//       await subscriptionCouponService.create(submitData);
//       showSuccess("Coupon created successfully");
      
//       navigate('/subscription-coupons');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to create coupon");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormPage
//       title="Add Coupon"
//       mode="add"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       loading={loading}
//       submitLabel="Create"
//       navigateTo="/subscription-coupons"
//       breadcrumb="Create a new subscription coupon"
//     />
//   );
// };

// export default AddSubscriptionCoupon;

// pages/subscription-coupons/AddSubscriptionCoupon.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdCheckCircle,
  MdErrorOutline,
  MdDateRange,
  MdInfo,
  MdAssignment,
  MdAttachMoney,
  MdLocalOffer,
  MdTrendingUp,
  MdPerson,
  MdHistory,
} from 'react-icons/md';
import { subscriptionCouponService } from '../../services/subscriptionCoupon.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';

// ─── Helper: Get today's date in YYYY-MM-DD format ──────────
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
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

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const ReadOnlyValue = ({ children }) => (
  <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
    {children || '—'}
  </div>
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
  { id: 'overview', label: 'Overview', icon: MdAssignment },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const AddSubscriptionCoupon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formValues, setFormValues] = useState({
    coupon_code: '',
    title: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_amount: '',
    max_discount: '',
    valid_from: '',
    valid_to: '',
    usage_limit: '',
    per_company_limit: '1',
    is_trending: false,
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ─── Handlers ──────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case 'coupon_code':
        if (!value || !value.trim()) return 'Coupon code is required';
        if (value.trim().length < 3) return 'Coupon code must be at least 3 characters';
        if (value.trim().length > 50) return 'Coupon code must be at most 50 characters';
        if (!/^[A-Za-z0-9_\-]+$/.test(value.trim())) {
          return 'Coupon code can only contain letters, numbers, underscores and hyphens';
        }
        return null;
      case 'title':
        if (!value || !value.trim()) return 'Title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        if (value.trim().length > 100) return 'Title must be at most 100 characters';
        return null;
      case 'discount_type':
        if (!value) return 'Please select a discount type';
        return null;
      case 'discount_value':
        if (!value && value !== 0) return 'Discount value is required';
        const numVal = parseFloat(value);
        if (isNaN(numVal) || numVal < 0) return 'Please enter a valid discount value';
        return null;
      case 'valid_from':
        if (value) {
          const selectedDate = new Date(`${value}T00:00:00`);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) return 'Valid from date cannot be in the past';
        }
        return null;
      case 'valid_to':
        if (value) {
          const selectedDate = new Date(`${value}T00:00:00`);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) return 'Valid to date cannot be in the past';
          if (formValues.valid_from) {
            const fromDate = new Date(`${formValues.valid_from}T00:00:00`);
            if (selectedDate < fromDate) return 'Valid to date must be after or equal to valid from date';
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

    // Required fields
    ['coupon_code', 'title', 'discount_type', 'discount_value'].forEach((field) => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Optional fields with validation
    ['valid_from', 'valid_to'].forEach((field) => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched
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
        coupon_code: formValues.coupon_code.trim().toUpperCase(),
        title: formValues.title.trim(),
        discount_type: formValues.discount_type || 'percentage',
        discount_value: parseFloat(formValues.discount_value) || 0,
        minimum_amount: parseFloat(formValues.minimum_amount) || 0,
        max_discount: formValues.max_discount ? parseFloat(formValues.max_discount) : null,
        valid_from: formValues.valid_from || null,
        valid_to: formValues.valid_to || null,
        usage_limit: formValues.usage_limit ? parseInt(formValues.usage_limit) : null,
        per_company_limit: parseInt(formValues.per_company_limit) || 1,
        is_trending: formValues.is_trending || false,
        status: formValues.status === 'active',
      };

      await subscriptionCouponService.create(submitData);
      showSuccess('Coupon created successfully');
      navigate('/subscription-coupons');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render helpers ──────────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, min, max, step, color } = field;
    const value = formValues[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;

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
            <option value="">{placeholder || 'Select option'}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
        break;
      case 'checkbox':
        inputElement = (
          <div className="flex items-center gap-3 pt-1.5">
            <input
              type="checkbox"
              name={name}
              checked={Boolean(value)}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${color || ''}`}
            />
            <span className="text-sm text-slate-600">{label}</span>
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
            max={max}
            step={step}
            className={commonClass}
          />
        );
        break;
      case 'date':
        inputElement = (
          <input
            type="date"
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
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
        {type !== 'checkbox' && type !== 'radio' && (
          <FieldLabel required={required}>{label}</FieldLabel>
        )}
        {inputElement}
        {help && !hasError && <p className="mt-1 text-xs text-slate-400">{help}</p>}
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  };

  // ─── Compute hero data ────────────────────────────────────
  const couponCode = formValues.coupon_code || 'New Coupon';
  const title = formValues.title || '';
  const discountType = formValues.discount_type || 'percentage';
  const discountValue = parseFloat(formValues.discount_value || 0);
  const discountDisplay = discountType === 'percentage' ? `${discountValue}%` : `₹${discountValue.toFixed(2)}`;
  const minAmount = parseFloat(formValues.minimum_amount || 0);
  const maxDiscount = formValues.max_discount ? parseFloat(formValues.max_discount) : null;
  const validFrom = formValues.valid_from ? formatDate(formValues.valid_from) : '-';
  const validTo = formValues.valid_to ? formatDate(formValues.valid_to) : '-';
  const isTrending = formValues.is_trending || false;
  const status = formValues.status || 'inactive';

  const initials = couponCode
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Main render ──────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/subscription-coupons')}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">Subscription Coupons</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Add New Coupon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate('/subscription-coupons')}
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
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
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
          <div className="relative h-44 sm:h-52">
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Icon placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdLocalOffer size={22} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {couponCode}
                  </h1>
                  {isTrending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdTrendingUp size={12} />
                      Trending
                    </span>
                  )}
                  <StatusPill status={status} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">{title || 'No title yet'}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">{discountDisplay} discount</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">
                    {validFrom} → {validTo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Discount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{discountDisplay}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Min Amount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {minAmount > 0 ? `₹${minAmount.toFixed(2)}` : 'None'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Max Discount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {maxDiscount !== null && maxDiscount > 0 ? `₹${maxDiscount.toFixed(2)}` : 'Unlimited'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Valid Until</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{validTo}</p>
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
                    active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="add-coupon-tab-underline"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ─── All form fields ───────────────────────────── */}
                    {[
                      { name: 'coupon_code', label: 'Coupon Code', type: 'text', required: true, placeholder: 'e.g. SUMMER20, WELCOME10', help: 'Enter a unique coupon code (will be converted to uppercase)' },
                      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g. Summer Sale 20% Off', help: 'Enter a descriptive title for the coupon' },
                      { name: 'discount_type', label: 'Discount Type', type: 'select', required: true, options: [{ value: 'percentage', label: 'Percentage (%)' }, { value: 'fixed', label: 'Fixed Amount (₹)' }], placeholder: 'Select discount type', help: 'Choose whether discount is percentage or fixed amount' },
                      { name: 'discount_value', label: 'Discount Value', type: 'number', required: true, placeholder: 'e.g. 20', help: 'Enter the discount value', min: 0, step: 0.01 },
                      { name: 'minimum_amount', label: 'Minimum Amount', type: 'number', required: false, placeholder: 'e.g. 100', help: 'Minimum order amount to apply this coupon (0 for no minimum)', min: 0, step: 0.01 },
                      { name: 'max_discount', label: 'Maximum Discount', type: 'number', required: false, placeholder: 'e.g. 500', help: 'Maximum discount amount (leave empty for unlimited)', min: 0, step: 0.01 },
                      { name: 'valid_from', label: 'Valid From', type: 'date', required: false, help: 'Date from which the coupon is valid (cannot be in the past)' },
                      { name: 'valid_to', label: 'Valid To', type: 'date', required: false, help: 'Date until which the coupon is valid (cannot be in the past)' },
                      { name: 'usage_limit', label: 'Usage Limit', type: 'number', required: false, placeholder: 'e.g. 100', help: 'Total number of times this coupon can be used (leave empty for unlimited)', min: 1, step: 1 },
                      { name: 'per_company_limit', label: 'Per Company Limit', type: 'number', required: false, placeholder: 'e.g. 1', help: 'Number of times a single company can use this coupon', min: 1, step: 1 },
                      { name: 'is_trending', label: 'Mark as Trending', type: 'checkbox', color: 'text-yellow-500 focus:ring-yellow-500', help: 'Trending coupons will be highlighted' },
                      { name: 'status', label: 'Status', type: 'radio', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }], color: 'text-blue-600 focus:ring-blue-500' },
                    ].map((field) => (
                      <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-6 max-w-xl">
                    <div>
                      <FieldLabel>Created By</FieldLabel>
                      <ReadOnlyValue>—</ReadOnlyValue>
                    </div>
                    <div>
                      <FieldLabel>Created At</FieldLabel>
                      <ReadOnlyValue>—</ReadOnlyValue>
                    </div>
                    <div>
                      <FieldLabel>Last Updated By</FieldLabel>
                      <ReadOnlyValue>—</ReadOnlyValue>
                    </div>
                    <div>
                      <FieldLabel>Last Updated At</FieldLabel>
                      <ReadOnlyValue>—</ReadOnlyValue>
                    </div>
                    <p className="text-sm text-slate-400 italic">No activity yet — this coupon is being created.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate('/subscription-coupons')}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddSubscriptionCoupon;