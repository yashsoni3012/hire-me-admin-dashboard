// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { showSuccess, showError, showInfo } from '../../utils/toast';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// const AddUser = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [roles, setRoles] = useState([]);
//   const [loadingRoles, setLoadingRoles] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [password, setPassword] = useState('');

//   const getToken = () => localStorage.getItem('token');

//   // Load roles
//   useEffect(() => {
//     const loadRoles = async () => {
//       try {
//         const token = getToken();
//         const response = await fetch(`${API_BASE}/role`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        
//         const result = await response.json();
//         const roleData = result.data || result || [];
//         setRoles(Array.isArray(roleData) ? roleData : []);
//       } catch (err) {
//         console.error("Load roles error:", err);
//         showError("Failed to load roles");
//       } finally {
//         setLoadingRoles(false);
//       }
//     };
//     loadRoles();
//   }, []);

//   // Form fields configuration - with custom password field
//   const getFormFields = () => {
//     const roleOptions = roles.map(role => ({
//       value: role.id,
//       label: role.role_name || role.name || `Role ${role.id}`
//     }));

//     return [
//       {
//         name: "name",
//         label: "Full Name",
//         type: "text",
//         required: true,
//         placeholder: "John Doe",
//         help: "Enter the user's full name",
//       },
//       {
//         name: "email",
//         label: "Email",
//         type: "email",
//         required: true,
//         placeholder: "john@example.com",
//         help: "Enter the user's email address",
//       },
//       {
//         name: "mobile",
//         label: "Mobile",
//         type: "text",
//         required: true,
//         placeholder: "9876543210",
//         help: "Enter the user's mobile number",
//       },
//       {
//         name: "password",
//         label: "Password",
//         type: "custom",
//         required: true,
//         placeholder: "Enter password",
//         help: "Enter a strong password",
//         render: (field, value, onChange) => (
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name={field.name}
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 onChange(e);
//               }}
//               placeholder={field.placeholder}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12"
//               required={field.required}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//             </button>
//           </div>
//         )
//       },
//       {
//         name: "role_id",
//         label: "Role",
//         type: "select",
//         required: true,
//         options: roleOptions,
//         placeholder: "Select Role",
//         help: "Select the user's role",
//       },
//       {
//         name: "image",
//         label: "Profile Image",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload a profile image (PNG, JPG) - Max 5MB",
//         placeholder: "Click or drag to upload image"
//       },
//     ];
//   };

//   // Validation rules - Only required validations
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: "Name is required",
//     },
//     email: {
//       required: true,
//       requiredMessage: "Email is required",
//     },
//     mobile: {
//       required: true,
//       requiredMessage: "Mobile number is required",
//     },
//     password: {
//       required: true,
//       requiredMessage: "Password is required",
//       customValidation: (value) => {
//         if (!value || value.length < 1) {
//           return "Password is required";
//         }
//         return null;
//       }
//     },
//     role_id: {
//       required: true,
//       requiredMessage: "Please select a role",
//     },
//   };

//   const initialData = {
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     role_id: "",
//     image: null,
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const token = getToken();
//       console.log('Submitting form data:', formData);

//       // Build payload for /user/register endpoint
//       const payload = {
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         mobile: formData.mobile?.trim() || "",
//         password: formData.password || password,
//         role_id: parseInt(formData.role_id),
//         image: null,
//       };

//       console.log('Sending payload to /user/register:', payload);

//       const response = await fetch(`${API_BASE}/user/register`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('✅ User registered successfully:', result);
//         showSuccess(result.message || "User created successfully");
//         navigate('/users');
//       } else {
//         const errorData = await response.json();
//         console.error('Registration failed:', errorData);
//         showError(errorData.message || "Failed to create user");
//       }

//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || "Failed to create user. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadingRoles) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading roles...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <FormPage
//       title="Add User"
//       mode="add"
//       fields={getFormFields()}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       loading={loading}
//       submitLabel="Create User"
//       navigateTo="/users"
//       breadcrumb="Create a new user account"
//     />
//   );
// };

// export default AddUser;

// pages/users/AddUser.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLock,
  MdAdminPanelSettings,
  MdImage,
  MdCloudUpload,
  MdClose,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
  MdPhoto,
  MdShield,
  MdVpnKey,
} from "react-icons/md";
import { showSuccess, showError } from "../../utils/toast";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdPerson },
  { id: "security", label: "Security & Role", icon: MdShield },
  { id: "media", label: "Profile Image", icon: MdImage },
];

// ─── Main Component ─────────────────────────────────────────────
const AddUser = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role_id: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const getToken = () => localStorage.getItem("token");

  // ─── Load roles ──────────────────────────────────────────────
  useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE}/role`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const result = await response.json();
        const roleData = result.data || result || [];
        setRoles(Array.isArray(roleData) ? roleData : []);
      } catch (err) {
        console.error("Load roles error:", err);
        showError("Failed to load roles");
      } finally {
        setLoadingRoles(false);
      }
    };
    loadRoles();
  }, []);

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Please upload a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("Image size must be less than 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (formValues.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formValues.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formValues.mobile?.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10,15}$/.test(formValues.mobile.trim())) {
      newErrors.mobile = "Mobile number must be 10-15 digits";
    }

    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formValues.role_id) {
      newErrors.role_id = "Please select a role";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name || newErrors.email || newErrors.mobile) {
        setActiveTab("overview");
      } else if (newErrors.password || newErrors.role_id) {
        setActiveTab("security");
      }
      showError(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const token = getToken();
      const payload = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        mobile: formValues.mobile?.trim() || "",
        password: formValues.password,
        role_id: parseInt(formValues.role_id),
        image: null,
      };

      const response = await fetch(`${API_BASE}/user/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        showSuccess(result.message || "User created successfully");
        navigate("/users");
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showError(error.message || "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading state ───────────────────────────────────────────
  if (loadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading roles...</p>
        </div>
      </div>
    );
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.name?.trim() || "New User";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const roleOptions = roles.map((role) => ({
    value: String(role.id),
    label: role.role_name || role.name || `Role ${role.id}`,
  }));

  const selectedRoleLabel =
    roleOptions.find((o) => o.value === formValues.role_id)?.label || "—";

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="sm:col-span-2">
                <FieldLabel required>Full Name</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.name
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name ? (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Enter the user's full name.
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <FieldLabel required>Email</FieldLabel>
                <div className="relative">
                  <MdEmail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <FieldLabel required>Mobile</FieldLabel>
                <div className="relative">
                  <MdPhone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="mobile"
                    value={formValues.mobile}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.mobile
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-5 max-w-2xl">
            {/* Password */}
            <div>
              <FieldLabel required>Password</FieldLabel>
              <div className="relative">
                <MdLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  } bg-white`}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5">
                  Minimum 6 characters. Use a mix of letters, numbers and
                  symbols.
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <FieldLabel required>Role</FieldLabel>
              <div className="relative">
                <MdAdminPanelSettings
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <select
                  name="role_id"
                  value={formValues.role_id}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                    errors.role_id
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  } bg-white`}
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role_id ? (
                <p className="text-xs text-red-500 mt-1">{errors.role_id}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5">
                  Select the role that defines this user's permissions.
                </p>
              )}
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-5">
            <div>
              <FieldLabel>Profile Image</FieldLabel>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <MdPhoto size={28} className="text-slate-300" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                    <MdCloudUpload size={16} />
                    {imagePreview ? "Change image" : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
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
                    PNG, JPG – Max 5MB. Optional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/users")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Users · New
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/users")}
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
              {loading ? "Creating..." : "Create User"}
            </button>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar / image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={heroName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdPerson size={24} />}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  {formValues.role_id && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-400/20 text-indigo-200 ring-1 ring-indigo-400/30">
                      <MdAdminPanelSettings size={12} />
                      {selectedRoleLabel}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {formValues.email && (
                    <span className="text-xs text-white/70">
                      {formValues.email}
                    </span>
                  )}
                  {formValues.mobile && (
                    <span className="text-xs text-white/70">
                      • {formValues.mobile}
                    </span>
                  )}
                  <span className="text-xs text-white/50">New User</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Name</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.name || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdEmail size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Email</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.email || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAdminPanelSettings
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Role</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {selectedRoleLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdVpnKey size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Password
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.password
                  ? `• ${formValues.password.length} chars`
                  : "Not set"}
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
                      layoutId="add-user-tab-underline"
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

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddUser;