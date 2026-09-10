// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { showSuccess, showError } from '../../utils/toast';

// // Use the correct API base URL
// const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// const EditUser = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [roles, setRoles] = useState([]);
//   const [loadingRoles, setLoadingRoles] = useState(true);

//   // Get token from localStorage
//   const getToken = () => localStorage.getItem('token');

//   // Get full image URL helper
//   const getImageUrl = (path) => {
//     if (!path) return null;
//     if (path.startsWith("http://") || path.startsWith("https://")) return path;
//     return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
//   };

//   // Helper: read a fetch Response body safely, whether it's JSON or plain text.
//   // Returns { raw, json } so callers can inspect whichever is useful.
//   const readResponseBody = async (response) => {
//     const raw = await response.text();
//     let json = null;
//     try {
//       json = raw ? JSON.parse(raw) : null;
//     } catch (e) {
//       // Not JSON — that's fine, caller falls back to raw text.
//     }
//     return { raw, json };
//   };

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
//       } finally {
//         setLoadingRoles(false);
//       }
//     };
//     loadRoles();
//   }, []);

//   // Fetch user data
//   useEffect(() => {
//     const fetchUser = async () => {
//       setFetchLoading(true);
//       try {
//         const token = getToken();

//         const response = await fetch(`${API_BASE}/user/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error('User not found');
//           }
//           throw new Error(`HTTP error ${response.status}`);
//         }

//         const result = await response.json();
//         const data = result.data || result;

//         if (data && data.id) {
//           const formData = {
//             name: data.name || "",
//             email: data.email || "",
//             mobile: data.mobile || "",
//             role_id: data.role_id || "",
//             image: data.image || null,
//           };
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           console.error('No data or missing ID:', data);
//           showError("User not found");
//           navigate('/users');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load user data");
//         navigate('/users');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchUser();
//     }
//   }, [id, navigate]);

//   // Form fields configuration
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
//         required: false,
//         placeholder: "9876543210",
//         help: "Enter the user's mobile number",
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
//         placeholder: "Click or drag to upload image",
//         existingImage: editItem?.image ? getImageUrl(editItem.image) : null
//       },
//     ];
//   };

//   // Validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: "Name is required",
//       minLength: 2,
//       minLengthMessage: "Name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Name must be at most 100 characters",
//     },
//     email: {
//       required: true,
//       requiredMessage: "Email is required",
//       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//       patternMessage: "Please enter a valid email address",
//     },
//     role_id: {
//       required: true,
//       requiredMessage: "Please select a role",
//     },
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const token = getToken();

//       // Validate role_id parses to a real number before sending —
//       // catches a bad/empty select value early instead of round-tripping
//       // to the server for a 500.
//       const roleIdNum = parseInt(formData.role_id, 10);
//       if (Number.isNaN(roleIdNum)) {
//         showError("Please select a valid role");
//         setLoading(false);
//         return;
//       }

//       const formPayload = new FormData();
//       formPayload.append("name", formData.name.trim());
//       formPayload.append("email", formData.email.trim());
//       formPayload.append("mobile", formData.mobile?.trim() || "");
//       formPayload.append("role_id", String(roleIdNum));

//       if (formData.imageFile instanceof File) {
//         formPayload.append("image", formData.imageFile);
//       }

//       console.log('Submitting update for user ID:', id);
//       console.log('Payload:', Object.fromEntries(formPayload));

//       // NOTE: Do NOT set 'Content-Type' manually when sending FormData —
//       // the browser sets it automatically with the correct multipart boundary.
//       const response = await fetch(`${API_BASE}/user/${id}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formPayload,
//       });

//       const { raw, json } = await readResponseBody(response);

//       if (!response.ok) {
//         // Log everything the server sent back so the real cause is visible —
//         // this is what was missing before (error.response doesn't exist on
//         // fetch errors, only on axios errors).
//         console.error('Update failed. Status:', response.status);
//         console.error('Update failed. Raw body:', raw);
//         console.error('Update failed. Parsed body:', json);

//         // Try to surface the most specific message the API gives us.
//         // Many validation libs (Joi/Zod/express-validator) return an
//         // `errors` array with per-field details — show those if present.
//         let errorMessage = json?.message || json?.error || raw || `HTTP error ${response.status}`;
//         if (Array.isArray(json?.errors) && json.errors.length > 0) {
//           const details = json.errors
//             .map((e) => e.message || e.msg || JSON.stringify(e))
//             .join('; ');
//           errorMessage = `${errorMessage}: ${details}`;
//         }

//         throw new Error(errorMessage);
//       }

//       console.log('Update response:', json);
//       showSuccess("User updated successfully");
//       navigate('/users');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || "Failed to update user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       const token = getToken();
//       const response = await fetch(`${API_BASE}/user/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const { raw, json } = await readResponseBody(response);
//         console.error('Delete failed:', response.status, raw);
//         throw new Error(json?.message || `HTTP error ${response.status}`);
//       }

//       showSuccess("User deleted successfully");
//       navigate('/users');
//     } catch (error) {
//       console.error('Delete error:', error);
//       showError(error.message || "Failed to delete user");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (fetchLoading || loadingRoles) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit User"
//       mode="edit"
//       fields={getFormFields()}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/users"
//       breadcrumb={`Editing: ${editItem?.name || 'User'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditUser;

// pages/users/EditUser.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdPerson,
  MdEmail,
  MdPhone,
  MdAdminPanelSettings,
  MdImage,
  MdCloudUpload,
  MdClose,
  MdPhoto,
  MdShield,
  MdDelete,
  MdInfoOutline,
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
const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [editItem, setEditItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    mobile: "",
    role_id: "",
  });

  const [errors, setErrors] = useState({});

  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const getToken = () => localStorage.getItem("token");

  // Get full image URL helper
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Helper: read a fetch Response body safely, whether it's JSON or plain text.
  // Returns { raw, json } so callers can inspect whichever is useful.
  const readResponseBody = async (response) => {
    const raw = await response.text();
    let json = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch (e) {
      // Not JSON — that's fine, caller falls back to raw text.
    }
    return { raw, json };
  };

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

  // ─── Fetch user data ─────────────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      setFetchLoading(true);
      try {
        const token = getToken();

        const response = await fetch(`${API_BASE}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error("User not found");
          throw new Error(`HTTP error ${response.status}`);
        }

        const result = await response.json();
        const data = result.data || result;

        if (data && data.id) {
          setFormValues({
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            role_id: data.role_id != null ? String(data.role_id) : "",
          });
          setExistingImage(data.image ? getImageUrl(data.image) : null);
          setEditItem(data);
        } else {
          console.error("No data or missing ID:", data);
          showError("User not found");
          navigate("/users");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load user data");
        navigate("/users");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id, navigate]);

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
    // reset input so selecting the same file again re-triggers onChange
    e.target.value = "";
  };

  const handleImageRemove = () => {
    // Clears the newly picked file and falls back to the existing image
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
    } else if (formValues.name.trim().length > 100) {
      newErrors.name = "Name must be at most 100 characters";
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

    if (!formValues.role_id) {
      newErrors.role_id = "Please select a role";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name || newErrors.email || newErrors.mobile) {
        setActiveTab("overview");
      } else if (newErrors.role_id) {
        setActiveTab("security");
      }
      showError(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const token = getToken();

      // Validate role_id parses to a real number before sending —
      // catches a bad/empty select value early instead of round-tripping
      // to the server for a 500.
      const roleIdNum = parseInt(formValues.role_id, 10);
      if (Number.isNaN(roleIdNum)) {
        showError("Please select a valid role");
        setLoading(false);
        return;
      }

      const formPayload = new FormData();
      formPayload.append("name", formValues.name.trim());
      formPayload.append("email", formValues.email.trim());
      formPayload.append("mobile", formValues.mobile?.trim() || "");
      formPayload.append("role_id", String(roleIdNum));

      if (imageFile instanceof File) {
        formPayload.append("image", imageFile);
      }

      // NOTE: Do NOT set 'Content-Type' manually when sending FormData —
      // the browser sets it automatically with the correct multipart boundary.
      const response = await fetch(`${API_BASE}/user/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      const { raw, json } = await readResponseBody(response);

      if (!response.ok) {
        console.error("Update failed. Status:", response.status);
        console.error("Update failed. Raw body:", raw);
        console.error("Update failed. Parsed body:", json);

        let errorMessage =
          json?.message || json?.error || raw || `HTTP error ${response.status}`;
        if (Array.isArray(json?.errors) && json.errors.length > 0) {
          const details = json.errors
            .map((e) => e.message || e.msg || JSON.stringify(e))
            .join("; ");
          errorMessage = `${errorMessage}: ${details}`;
        }

        throw new Error(errorMessage);
      }

      showSuccess(json?.message || "User updated successfully");
      navigate("/users");
    } catch (error) {
      console.error("Submit error:", error);
      showError(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const { raw, json } = await readResponseBody(response);
        console.error("Delete failed:", response.status, raw);
        throw new Error(json?.message || `HTTP error ${response.status}`);
      }

      showSuccess("User deleted successfully");
      navigate("/users");
    } catch (error) {
      console.error("Delete error:", error);
      showError(error.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // ─── Loading state ───────────────────────────────────────────
  if (fetchLoading || loadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.name?.trim() || editItem?.name || "User";
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

  const displayedImage = imagePreview || existingImage;

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
                  {displayedImage ? (
                    <img
                      src={displayedImage}
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
                    {displayedImage ? "Change image" : "Upload image"}
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
                      Remove new image
                    </button>
                  )}
                  <p className="text-xs text-slate-500">
                    PNG, JPG – Max 5MB. Optional.
                    {existingImage && !imagePreview && " Current image shown."}
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
                Users · Edit
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleteLoading}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <MdDelete size={16} />
              Delete
            </button>
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
              {loading ? "Updating..." : "Update User"}
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
                {displayedImage ? (
                  <img
                    src={displayedImage}
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
                  <span className="text-xs text-white/50">
                    ID #{editItem?.id ?? id}
                  </span>
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
            <MdPhone size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Mobile</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.mobile || "—"}
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
                      layoutId="edit-user-tab-underline"
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

        {/* Mobile-only actions */}
        <div className="sm:hidden mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
          >
            <MdCancel size={16} />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleteLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <MdDelete size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* ─── Delete confirmation modal ─────────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <MdDelete size={20} className="text-red-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-800">
                    Delete user?
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    This will permanently remove{" "}
                    <span className="font-medium text-slate-700">
                      {heroName}
                    </span>
                    . This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-red-600/20 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdDelete size={16} />
                  )}
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditUser;