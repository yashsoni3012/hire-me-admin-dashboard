// // pages/cities/AddCity.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { cityService } from '../../services/city.service';
// import { stateService } from '../../services/state.service';
// import { showSuccess, showError } from '../../utils/toast';

// const AddCity = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [states, setStates] = useState([]);
//   const [loadingStates, setLoadingStates] = useState(true);
//   const [isStateSelected, setIsStateSelected] = useState(false);

//   // Load states for dropdown
//   useEffect(() => {
//     const loadStates = async () => {
//       try {
//         const r = await stateService.getAll({ limit: 1000 });
//         const rawData = r.data?.data || r.data?.results || r.data || [];
//         const statesList = Array.isArray(rawData) ? rawData : [];
//         // Filter only active states
//         const activeStates = statesList.filter(
//           state => state.is_status === true || state.is_status === 1
//         );
//         setStates(activeStates);
//       } catch (error) {
//         console.error('Load states error:', error);
//         showError('Failed to load states');
//       } finally {
//         setLoadingStates(false);
//       }
//     };
//     loadStates();
//   }, []);

//   // ─── Handle form data changes ──────────────────────────────────
//   // NOTE: FormPage does NOT call an onFormChange prop internally (it isn't
//   // wired up there), so we can't rely on that callback. Instead we catch the
//   // change event as it bubbles up through React's synthetic event system by
//   // listening on a wrapper div around <FormPage />. This lets us detect the
//   // State <select> changing without modifying FormPage itself.
//   const handleFormAreaChange = (e) => {
//     if (e.target.tagName === 'SELECT') {
//       setIsStateSelected(!!e.target.value);
//     }
//   };

//   // ─── Form fields configuration ──────────────────────────────────
//   const getFormFields = () => {
//     const stateOptions = states.map(state => ({
//       value: state.id || state._id,
//       label: state.name || state.state_name || "",
//     }));

//     return [
//       // ─── State Field (appears first) ──────────────────────────────
//       {
//         name: "state_id",
//         label: "State",
//         type: "select",
//         required: true,
//         options: stateOptions,
//         placeholder: "Select a state first",
//         help: "Select the state this city belongs to",
//       },
//       // ─── City Name Field (enabled only after state is selected) ──
//       {
//         name: "name",
//         label: "City Name",
//         type: "text",
//         required: true,
//         placeholder: isStateSelected ? "e.g. Surat, Ahmedabad" : "Please select a state first",
//         help: "Enter the full name of the city",
//         disabled: !isStateSelected,
//       },
//       {
//         name: "image",
//         label: "City Image",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload a city image (PNG, JPG, SVG) - Max 5MB",
//         placeholder: "Click or drag to upload image",
//         disabled: !isStateSelected,
//       },
//       {
//         name: "status",
//         label: "Status",
//         type: "radio",
//         options: [
//           { value: "active", label: "Active" },
//           { value: "inactive", label: "Inactive" },
//         ],
//         color: "text-blue-600 focus:ring-blue-500",
//         disabled: !isStateSelected,
//       },
//       {
//         name: "is_trending",
//         label: "Mark as Trending",
//         type: "checkbox",
//         color: "text-yellow-500 focus:ring-yellow-500",
//         help: "Trending cities will be highlighted in the listing",
//         disabled: !isStateSelected,
//       },
//     ];
//   };

//   // ─── Validation rules ──────────────────────────────────────────
//   const getValidationRules = () => {
//     const rules = {
//       state_id: {
//         required: true,
//         requiredMessage: 'Please select a state first',
//       },
//     };

//     // ─── Only validate city name if state is selected ──────────────
//     if (isStateSelected) {
//       rules.name = {
//         required: true,
//         requiredMessage: 'City name is required',
//         minLength: 2,
//         minLengthMessage: 'City name must be at least 2 characters',
//         maxLength: 100,
//         maxLengthMessage: 'City name must be at most 100 characters',
//       };
//     }

//     return rules;
//   };

//   // ─── Initial data ──────────────────────────────────────────────
//   const initialData = {
//     state_id: "",
//     name: "",
//     image: null,
//     status: "active",
//     is_trending: false,
//   };

//   // ─── Handle form submission ──────────────────────────────────
//   const handleSubmit = async (formData) => {
//     // ─── Prevent submission if no state is selected ────────────
//     if (!formData.state_id) {
//       showError("Please select a state first before adding a city");
//       return;
//     }

//     // ─── Prevent submission if city name is empty ──────────────
//     if (!formData.name || formData.name.trim() === '') {
//       showError("City name is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const submitData = {
//         name: formData.name.trim(),
//         state_id: parseInt(formData.state_id),
//         status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//       };

//       if (formData.imageFile instanceof File) {
//         submitData.imageFile = formData.imageFile;
//       }

//       await cityService.create(submitData);
//       showSuccess("City created successfully");
//       navigate("/cities", { replace: true });
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(
//         error?.response?.data?.message ||
//         error.message ||
//         "Failed to create city"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadingStates) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading states...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div onChange={handleFormAreaChange}>
//       <FormPage
//         title="Add City"
//         mode="add"
//         fields={getFormFields()}
//         initialData={initialData}
//         validationRules={getValidationRules()}
//         onSubmit={handleSubmit}
//         loading={loading}
//         submitLabel="Create"
//         navigateTo="/cities"
//         breadcrumb="Create a new city"
//       />
//     </div>
//   );
// };

// export default AddCity;

// pages/cities/AddCity.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdInfo,
  MdLocationOn,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdCloudUpload,
} from 'react-icons/md';
import { cityService } from '../../services/city.service';
import { stateService } from '../../services/state.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';

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
  { id: 'activity', label: 'Activity', icon: MdInfo }, // Placeholder for add mode
];

// ─── Main Component ──────────────────────────────────────────
const AddCity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    state_id: '',
    name: '',
    image: null,
    status: 'active',
    is_trending: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const isStateSelected = !!formValues.state_id;

  // ─── Load states ──────────────────────────────────────────────
  useEffect(() => {
    const loadStates = async () => {
      try {
        const r = await stateService.getAll({ limit: 1000 });
        const rawData = r.data?.data || r.data?.results || r.data || [];
        const statesList = Array.isArray(rawData) ? rawData : [];
        // Filter only active states
        const activeStates = statesList.filter(
          (state) => state.is_status === true || state.is_status === 1
        );
        setStates(activeStates);
      } catch (error) {
        console.error('Load states error:', error);
        showError('Failed to load states');
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

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
      setFormValues((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormValues((prev) => ({ ...prev, image: null }));
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case 'state_id':
        if (!value) return 'Please select a state first';
        return null;
      case 'name':
        if (!isStateSelected) return null; // only validate if state is selected
        if (!value || !value.trim()) return 'City name is required';
        if (value.trim().length < 2) return 'City name must be at least 2 characters';
        if (value.trim().length > 100) return 'City name must be at most 100 characters';
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const stateError = validateField('state_id', formValues.state_id);
    if (stateError) {
      newErrors.state_id = stateError;
      isValid = false;
    }

    if (isStateSelected) {
      const nameError = validateField('name', formValues.name);
      if (nameError) {
        newErrors.name = nameError;
        isValid = false;
      }
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
        name: formValues.name.trim(),
        state_id: parseInt(formValues.state_id),
        status: formValues.status === 'active',
        is_trending: formValues.is_trending || false,
      };

      if (imageFile instanceof File) {
        submitData.imageFile = imageFile;
      }

      await cityService.create(submitData);
      showSuccess('City created successfully');
      navigate('/cities', { replace: true });
    } catch (error) {
      console.error('Submit error:', error);
      showError(error?.response?.data?.message || error.message || 'Failed to create city');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/cities');

  // ─── Render helper for fields ──────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, disabled, color } = field;
    const value = formValues[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;

    const commonClass = `w-full px-3.5 py-2.5 border ${hasError ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white ${disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`;

    let inputElement;

    switch (type) {
      case 'select':
        inputElement = (
          <select
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
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

      case 'file':
        inputElement = (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="City preview"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200"
                  />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {!disabled && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`px-4 py-2 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium inline-flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <MdCloudUpload size={16} />
                    Choose Image
                  </label>
                  <p className="mt-1 text-xs text-slate-400">PNG, JPG, SVG (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>
        );
        break;

      case 'radio':
        inputElement = (
          <div className="flex flex-wrap gap-4 pt-1.5">
            {options.map((opt) => (
              <label key={opt.value} className={`flex items-center gap-2 text-sm ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={String(value) === String(opt.value)}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={disabled}
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
              disabled={disabled}
            />
            <span className={`text-sm ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>
              {value ? 'Enabled' : 'Disabled'}
            </span>
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
            disabled={disabled}
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
  if (loadingStates) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading states...</p>
        </div>
      </div>
    );
  }

  // ─── Compute hero data ────────────────────────────────────
  const selectedStateName = states.find((s) => String(s.id || s._id) === String(formValues.state_id))?.name || '—';
  const cityName = formValues.name?.trim() || 'New City';
  const status = formValues.status || 'active';
  const isTrending = formValues.is_trending || false;

  const initials = cityName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Field definitions ────────────────────────────────────
  const stateOptions = states.map((state) => ({
    value: state.id || state._id,
    label: state.name || state.state_name || '',
  }));

  const fields = [
    {
      name: 'state_id',
      label: 'State',
      type: 'select',
      required: true,
      options: [{ value: '', label: 'Select a state first' }, ...stateOptions],
      placeholder: 'Select a state first',
      help: 'Select the state this city belongs to',
      disabled: false,
    },
    {
      name: 'name',
      label: 'City Name',
      type: 'text',
      required: true,
      placeholder: isStateSelected ? 'e.g. Surat, Ahmedabad' : 'Please select a state first',
      help: 'Enter the full name of the city',
      disabled: !isStateSelected,
    },
    {
      name: 'image',
      label: 'City Image',
      type: 'file',
      required: false,
      placeholder: 'Click or drag to upload image',
      help: 'Upload a city image (PNG, JPG, SVG) - Max 5MB',
      disabled: !isStateSelected,
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
      disabled: !isStateSelected,
    },
    {
      name: 'is_trending',
      label: 'Mark as Trending',
      type: 'checkbox',
      color: 'text-yellow-500 focus:ring-yellow-500',
      help: 'Trending cities will be highlighted in the listing',
      disabled: !isStateSelected,
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
              <p className="text-[11px] text-slate-400 leading-tight">Cities</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Add New City
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
              {loading ? 'Creating...' : 'Create City'}
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
                  {initials || <MdLocationOn size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {cityName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">State: {selectedStateName}</span>
                  <span className="text-xs text-white/50">New City</span>
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
            <MdLocationOn size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">State</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {selectedStateName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCloudUpload size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Image</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {imagePreview ? 'Uploaded' : 'Not set'}
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
                      layoutId="add-city-tab-underline"
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
                            Creating...
                          </span>
                        ) : (
                          'Create City'
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
                          This city hasn't been created yet. Once created, activity details will appear here.
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

export default AddCity;