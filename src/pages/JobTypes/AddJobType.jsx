// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import jobTypeService from '../../services/jobType.service';
// import { showSuccess, showError } from '../../utils/toast';

// // Helper to get current user ID
// const getCurrentUserId = () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user.id) return parseInt(user.id);
//     const userId = localStorage.getItem("userId");
//     if (userId) return parseInt(userId);
//   } catch (e) {
//     console.warn("Could not get user ID from localStorage, using default 1");
//   }
//   return 1;
// };

// const AddJobType = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // Form fields configuration
//   const fields = [
//     {
//       name: "name",
//       label: "Job Type Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. Full Time, Part Time, Contract",
//       help: "Enter the job type name",
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
//       help: "Trending job types will be highlighted",
//     },
//   ];

//   // Validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: "Job type name is required",
//       minLength: 2,
//       minLengthMessage: "Job type name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Job type name must be at most 100 characters",
//     },
//   };

//   // Initial data
//   const initialData = {
//     name: "",
//     status: "active",
//     is_trending: false,
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const userId = getCurrentUserId();
//       const payload = {
//         name: formData.name.trim(),
//         status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//         created_by: userId,
//       };

//       await jobTypeService.create(payload);
//       showSuccess("Job type created successfully");
      
//       // Redirect to job types list page
//       navigate('/job-types');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to create job type");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormPage
//       title="Add Job Type"
//       mode="add"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       loading={loading}
//       submitLabel="Create"
//       navigateTo="/job-types"
//       breadcrumb="Create a new job type"
//     />
//   );
// };

// export default AddJobType;

// pages/job-types/AddJobType.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdWork,
  MdTrendingUp,
  MdCategory,
} from 'react-icons/md';
import jobTypeService from '../../services/jobType.service';
import { showSuccess, showError } from '../../utils/toast';

// Helper to get current user ID
const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) return parseInt(user.id);
    const userId = localStorage.getItem('userId');
    if (userId) return parseInt(userId);
  } catch (e) {
    console.warn('Could not get user ID from localStorage, using default 1');
  }
  return 1;
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
const AddJobType = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: '',
    status: 'active',
    is_trending: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    if (name === 'name') {
      if (!value || !value.trim()) return 'Job type name is required';
      if (value.trim().length < 2) return 'Job type name must be at least 2 characters';
      if (value.trim().length > 100) return 'Job type name must be at most 100 characters';
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

  // ─── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Please fix validation errors');
      return;
    }

    setLoading(true);
    try {
      const userId = getCurrentUserId();
      const payload = {
        name: formValues.name.trim(),
        status: formValues.status === 'active',
        is_trending: formValues.is_trending || false,
        created_by: userId,
      };

      await jobTypeService.create(payload);
      showSuccess('Job type created successfully');
      navigate('/job-types');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || 'Failed to create job type');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/job-types');

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

  // ─── Compute hero data ────────────────────────────────────
  const jobTypeName = formValues.name?.trim() || 'New Job Type';
  const status = formValues.status || 'active';
  const isTrending = formValues.is_trending || false;

  const initials = jobTypeName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Field definitions ────────────────────────────────────
  const fields = [
    {
      name: 'name',
      label: 'Job Type Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Full Time, Part Time, Contract',
      help: 'Enter the job type name',
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
      help: 'Trending job types will be highlighted',
    },
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
              <p className="text-[11px] text-slate-400 leading-tight">Job Types</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Add New Job Type
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
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
              {loading ? 'Creating...' : 'Create Job Type'}
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
                  {initials || <MdWork size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {jobTypeName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/50">New Job Type</span>
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
            <MdTrendingUp size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Trending</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {isTrending ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Name</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {jobTypeName}
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
                      layoutId="add-job-type-tab-underline"
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
                            Creating...
                          </span>
                        ) : (
                          'Create Job Type'
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
                          <MdInfo size={16} />
                          No Activity Yet
                        </h2>
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-slate-500">
                          This job type hasn't been created yet. Once created, activity details will appear here.
                        </p>
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
    </div>
  );
};

export default AddJobType;