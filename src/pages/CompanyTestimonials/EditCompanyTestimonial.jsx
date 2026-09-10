// // pages/EditCompanyTestimonial.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { companyTestimonialService } from '../../services/companyTestimonial.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditCompanyTestimonial = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   // Fetch testimonial data
//   useEffect(() => {
//     const fetchTestimonial = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await companyTestimonialService.getById(id);
//         const data = response?.data || response;
        
//         if (data && data.id) {
//           const formData = {
//             name: data.name || "",
//             email: data.email || "",
//             rating: data.rating?.toString() || "",
//             description: data.description || "",
//             image: data.image || "", // Include existing image
//             status: data.is_status ? "active" : "inactive",
//           };
//           setInitialData(formData);
//           setEditItem(data);
//           console.log('✅ Form data loaded:', formData);
//         } else {
//           showError("Testimonial not found");
//           navigate('/company-testimonials');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load testimonial data");
//         navigate('/company-testimonials');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchTestimonial();
//     }
//   }, [id, navigate]);

//   // Form fields configuration - INCLUDES IMAGE FIELD
//   const fields = [
//     {
//       name: "name",
//       label: "Client Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. John Doe",
//       help: "Enter the client's full name",
//     },
//     {
//       name: "email",
//       label: "Client Email",
//       type: "email",
//       required: true,
//       placeholder: "e.g. john@example.com",
//       help: "Enter the client's email address",
//     },
//     {
//       name: "rating",
//       label: "Rating",
//       type: "select",
//       required: true,
//       options: [
//         { value: "1", label: "⭐ 1 Star" },
//         { value: "1.5", label: "⭐ 1.5 Stars" },
//         { value: "2", label: "⭐⭐ 2 Stars" },
//         { value: "2.5", label: "⭐⭐ 2.5 Stars" },
//         { value: "3", label: "⭐⭐⭐ 3 Stars" },
//         { value: "3.5", label: "⭐⭐⭐ 3.5 Stars" },
//         { value: "4", label: "⭐⭐⭐⭐ 4 Stars" },
//         { value: "4.5", label: "⭐⭐⭐⭐ 4.5 Stars" },
//         { value: "5", label: "⭐⭐⭐⭐⭐ 5 Stars" },
//       ],
//       placeholder: "Select rating",
//       help: "Select the rating for this testimonial",
//     },
//     {
//       name: "description",
//       label: "Testimonial",
//       type: "textarea",
//       required: true,
//       placeholder: "Write the testimonial here...",
//       help: "Enter the client's testimonial",
//       rows: 4,
//     },
//     {
//       name: "image",  // IMAGE FIELD - FormPage handles file upload
//       label: "Client Image",
//       type: "file",
//       accept: "image/*",
//       maxSize: 5,
//       help: "Upload a photo of the client (JPG, PNG, WebP). Leave empty to keep current.",
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "radio",
//       options: [
//         { value: "active", label: "Active" },
//         { value: "inactive", label: "Inactive" },
//       ],
//       color: "text-purple-600 focus:ring-purple-500",
//     },
//   ];

//   // Validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: "Client name is required",
//       minLength: 2,
//       minLengthMessage: "Client name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Client name must be at most 100 characters",
//     },
//     email: {
//       required: true,
//       requiredMessage: "Client email is required",
//       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//       patternMessage: "Please enter a valid email address",
//     },
//     rating: {
//       required: true,
//       requiredMessage: "Rating is required",
//     },
//     description: {
//       required: true,
//       requiredMessage: "Testimonial is required",
//       minLength: 10,
//       minLengthMessage: "Testimonial must be at least 10 characters",
//       maxLength: 500,
//       maxLengthMessage: "Testimonial must be at most 500 characters",
//     },
//   };

//   // Handle form submission - INCLUDES IMAGE HANDLING
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const submitData = {
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         description: formData.description.trim(),
//         rating: parseFloat(formData.rating),
//         is_status: formData.status === "active",
//       };

//       // Handle image
//       if (formData.imageFile instanceof File) {
//         submitData.imageFile = formData.imageFile;
//         console.log('📸 New image file selected:', formData.imageFile.name);
//       } else if (formData.image && typeof formData.image === 'string' && formData.image.trim() !== '') {
//         // Keep existing image
//         submitData.image = formData.image;
//         console.log('🖼️ Keeping existing image');
//       } else {
//         // No image - set to null to remove
//         submitData.image = null;
//         console.log('🗑️ Removing image');
//       }

//       console.log('📤 Updating testimonial ID:', id);
//       console.log('📤 Submit data:', submitData);

//       await companyTestimonialService.update(id, submitData);
//       showSuccess("Testimonial updated successfully");
//       navigate('/company-testimonials');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update testimonial");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await companyTestimonialService.delete(id);
//       showSuccess("Testimonial deleted successfully");
//       navigate('/company-testimonials');
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this testimonial because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete testimonial");
//       }
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading testimonial data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Testimonial"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/company-testimonials"
//       breadcrumb={`Editing: ${editItem?.name || 'Testimonial'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditCompanyTestimonial;

// pages/company-testimonials/EditCompanyTestimonial.jsx
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
  MdEmail,
  MdStar,
  MdImage,
  MdCloudUpload,
  MdMessage,
} from 'react-icons/md';
import { companyTestimonialService } from '../../services/companyTestimonial.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://apidata.hiremejobs.in';

// ─── Helper: Get full image URL ──────────────────────────────
const getFullImageUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http') || value.startsWith('data:image')) return value;
  if (value.startsWith('/uploads/')) return `${API_BASE_URL}${value}`;
  if (value.startsWith('uploads/')) return `${API_BASE_URL}/${value}`;
  if (value.startsWith('/')) return `${API_BASE_URL}${value}`;
  if (!value.includes('/') && !value.includes('http') && !value.startsWith('data:')) {
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

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: MdInfo },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const EditCompanyTestimonial = () => {
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
    email: '',
    rating: '',
    description: '',
    image: '',
    status: 'active',
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

  // ─── Fetch testimonial data ─────────────────────────────────
  useEffect(() => {
    const fetchTestimonial = async () => {
      setFetchLoading(true);
      try {
        const response = await companyTestimonialService.getById(id);
        const data = response?.data || response;

        if (data && data.id) {
          setEditItem(data);
          const formData = {
            name: data.name || '',
            email: data.email || '',
            rating: data.rating?.toString() || '',
            description: data.description || '',
            image: data.image || '',
            status: data.is_status ? 'active' : 'inactive',
          };
          setFormValues(formData);
          if (data.image) {
            setImagePreview(getFullImageUrl(data.image));
          }
        } else {
          showError('Testimonial not found');
          navigate('/company-testimonials');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load testimonial data');
        navigate('/company-testimonials');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchTestimonial();
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
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormValues((prev) => ({ ...prev, image: '' }));
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
      case 'name':
        if (!value || !value.trim()) return 'Client name is required';
        if (value.trim().length < 2) return 'Client name must be at least 2 characters';
        if (value.trim().length > 100) return 'Client name must be at most 100 characters';
        return null;
      case 'email':
        if (!value || !value.trim()) return 'Client email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        return null;
      case 'rating':
        if (!value) return 'Rating is required';
        return null;
      case 'description':
        if (!value || !value.trim()) return 'Testimonial is required';
        if (value.trim().length < 10) return 'Testimonial must be at least 10 characters';
        if (value.trim().length > 500) return 'Testimonial must be at most 500 characters';
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ['name', 'email', 'rating', 'description'].forEach((field) => {
      const error = validateField(field, formValues[field]);
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
      const submitData = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        description: formValues.description.trim(),
        rating: parseFloat(formValues.rating),
        is_status: formValues.status === 'active',
      };

      // Handle image: new file | keep existing | remove
      if (imageFile instanceof File) {
        submitData.imageFile = imageFile;
      } else if (
        formValues.image &&
        typeof formValues.image === 'string' &&
        formValues.image.trim() !== ''
      ) {
        submitData.image = formValues.image;
      } else {
        submitData.image = null;
      }

      await companyTestimonialService.update(id, submitData);
      showSuccess('Testimonial updated successfully');
      navigate('/company-testimonials');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || 'Failed to update testimonial');
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await companyTestimonialService.delete(id);
      showSuccess('Testimonial deleted successfully');
      navigate('/company-testimonials');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || '';
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError('Cannot delete this testimonial because it is being used in other records.');
      } else {
        showError(message || 'Failed to delete testimonial');
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate('/company-testimonials');

  // ─── Render helper for fields ──────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, color, rows } = field;
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
      case 'textarea':
        inputElement = (
          <textarea
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={rows || 4}
            placeholder={placeholder}
            className={`${commonClass} resize-y`}
          />
        );
        break;
      case 'file':
        inputElement = (
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Client preview"
                    className="w-20 h-20 object-cover rounded-full border-2 border-slate-200 shadow-sm"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-slate-100 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <MdImage size={26} className="text-slate-400" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
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
      default:
        inputElement = (
          <input
            type={type || 'text'}
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
          <div className="w-9 h-9 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading testimonial data...</p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const clientName = formValues.name?.trim() || 'Testimonial';
  const email = formValues.email?.trim() || '';
  const rating = formValues.rating || '—';
  const status = formValues.status || 'active';
  const createdDate = editItem.created_at ? formatDate(editItem.created_at) : '—';
  const updatedDate = editItem.updated_at ? formatDate(editItem.updated_at) : '—';

  const initials = clientName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Field definitions ────────────────────────────────────
  const fields = [
    {
      name: 'name',
      label: 'Client Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. John Doe',
      help: "Enter the client's full name",
    },
    {
      name: 'email',
      label: 'Client Email',
      type: 'email',
      required: true,
      placeholder: 'e.g. john@example.com',
      help: "Enter the client's email address",
    },
    {
      name: 'rating',
      label: 'Rating',
      type: 'select',
      required: true,
      options: [
        { value: '1', label: '⭐ 1 Star' },
        { value: '1.5', label: '⭐ 1.5 Stars' },
        { value: '2', label: '⭐⭐ 2 Stars' },
        { value: '2.5', label: '⭐⭐ 2.5 Stars' },
        { value: '3', label: '⭐⭐⭐ 3 Stars' },
        { value: '3.5', label: '⭐⭐⭐ 3.5 Stars' },
        { value: '4', label: '⭐⭐⭐⭐ 4 Stars' },
        { value: '4.5', label: '⭐⭐⭐⭐ 4.5 Stars' },
        { value: '5', label: '⭐⭐⭐⭐⭐ 5 Stars' },
      ],
      placeholder: 'Select rating',
      help: 'Select the rating for this testimonial',
    },
    {
      name: 'description',
      label: 'Testimonial',
      type: 'textarea',
      required: true,
      placeholder: 'Write the testimonial here...',
      help: "Enter the client's testimonial",
      rows: 4,
    },
    {
      name: 'image',
      label: 'Client Image',
      type: 'file',
      help: 'Upload a photo of the client (JPG, PNG, WebP). Leave empty to keep current.',
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
              <p className="text-[11px] text-slate-400 leading-tight">Company Testimonials</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Edit: {clientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete testimonial"
              title="Delete testimonial"
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
              {loading ? 'Updating...' : 'Update Testimonial'}
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
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Client preview"
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdPerson size={24} />}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {clientName}
                  </h1>
                  <StatusPill status={status} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {email && (
                    <span className="text-xs text-white/70 flex items-center gap-1">
                      <MdEmail size={12} /> {email}
                    </span>
                  )}
                  {rating !== '—' && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <MdStar size={12} /> {rating} stars
                      </span>
                    </>
                  )}
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
              <p className="text-[10px] text-slate-500 leading-tight">Rating</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {rating}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdImage size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Photo</p>
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
                      layoutId="edit-testimonial-tab-underline"
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
                          className={
                            field.type === 'textarea' ||
                            field.type === 'file' ||
                            field.type === 'radio' ||
                            field.name === 'description' ||
                            field.name === 'image'
                              ? 'sm:col-span-2'
                              : ''
                          }
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
                          'Update Testimonial'
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
        title="Delete Testimonial"
        message={`Delete testimonial from "${clientName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EditCompanyTestimonial;