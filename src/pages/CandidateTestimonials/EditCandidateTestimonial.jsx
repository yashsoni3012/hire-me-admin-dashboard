// // pages/candidate-testimonials/EditCandidateTestimonial.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import { candidateTestimonialService } from "../../services/candidateTestimonial.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { useAuth } from "../../context/AuthContext";

// const EditCandidateTestimonial = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { user } = useAuth();
//   const userId = user?.id || 1;
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
//         const response = await candidateTestimonialService.getById(id);
//         const data = response?.data || response;

//         if (data) {
//           // NOTE: `image` is left as the raw path string (e.g. "/uploads/x.jpg").
//           // FormPage itself turns this into a full preview URL internally
//           // (via its own getFullImageUrl + imagePreviews init in useEffect) —
//           // don't pre-resolve it here, matching EditBanner.jsx's pattern.
//           const formData = {
//             name: data.name || "",
//             email: data.email || "",
//             image: data.image || "",
//             rating: data.rating?.toString() || "",
//             description: data.description || "",
//             status: data.is_status ? "active" : "inactive",
//           };
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("Testimonial not found");
//           navigate("/candidate-testimonials");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load testimonial data");
//         navigate("/candidate-testimonials");
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchTestimonial();
//     }
//   }, [id, navigate]);

//   // ─── Form fields configuration ──────────────────────────────────────
//   // NOTE: "image" uses FormPage's own built-in file-upload UI (no custom
//   // render — FormPage doesn't support that prop, it's silently ignored).
//   const fields = [
//     {
//       name: "name",
//       label: "Candidate Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. John Doe",
//       help: "Enter the candidate's full name",
//     },
//     {
//       name: "email",
//       label: "Candidate Email",
//       type: "email",
//       required: true,
//       placeholder: "e.g. john@example.com",
//       help: "Enter the candidate's email address",
//     },
//     {
//       name: "image",
//       label: "Candidate Image",
//       type: "file",
//       required: false,
//       accept: "image/*",
//       maxSize: 5,
//       help: "Upload a candidate image (JPEG, PNG, GIF, WEBP, AVIF, SVG) - Max 5MB",
//       placeholder: "Click or drag to upload image",
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
//       help: "Enter the candidate's testimonial",
//       rows: 4,
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
//     name: {
//       required: true,
//       requiredMessage: "Candidate name is required",
//       minLength: 2,
//       minLengthMessage: "Candidate name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Candidate name must be at most 100 characters",
//     },
//     email: {
//       required: true,
//       requiredMessage: "Candidate email is required",
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

//   // ─── Handle form submission ────────────────────────────────────────
//   // formData here is what FormPage builds internally — it already
//   // includes `imageFile` (a real File) when a new one was picked via
//   // FormPage's own file input. Read it from there, not local state.
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const submitData = {
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         description: formData.description.trim(),
//         rating: parseFloat(formData.rating),
//         is_status: formData.status === "active",
//         updated_by: userId,
//       };

//       if (formData.imageFile instanceof File) {
//         // New file selected — send it
//         submitData.imageFile = formData.imageFile;
//         console.log("📤 Sending new file:", formData.imageFile.name);
//       } else if (formData.image) {
//         // No new file — keep the existing image path as-is
//         submitData.image = formData.image;
//       } else {
//         // User removed the image via FormPage's "remove" (X) button
//         submitData.image = null;
//       }

//       console.log("📤 Submitting update:", {
//         ...submitData,
//         imageFile: submitData.imageFile
//           ? `File: ${submitData.imageFile.name}`
//           : undefined,
//       });

//       await candidateTestimonialService.update(id, submitData);
//       showSuccess("Testimonial updated successfully");
//       navigate("/candidate-testimonials");
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(
//         error.message ||
//           error?.response?.data?.message ||
//           "Failed to update testimonial",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await candidateTestimonialService.delete(id);
//       showSuccess("Testimonial deleted successfully");
//       navigate("/candidate-testimonials");
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError(
//           "Cannot delete this testimonial because it is being used in other records.",
//         );
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
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
//       title="Edit Candidate Testimonial"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/candidate-testimonials"
//       breadcrumb={`Editing: ${editItem?.name || "Testimonial"}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditCandidateTestimonial;

// pages/candidate-testimonials/EditCandidateTestimonial.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdPerson,
  MdEmail,
  MdStar,
  MdStarHalf,
  MdStarBorder,
  MdImage,
  MdCloudUpload,
  MdClose,
  MdFlag,
  MdCheckCircle,
  MdErrorOutline,
  MdRateReview,
  MdInfoOutline,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { candidateTestimonialService } from "../../services/candidateTestimonial.service";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

// ─── Status pill ────────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
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
      {status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Unknown"}
    </span>
  );
};

// ─── Star rating render ─────────────────────────────────────────
const renderStars = (rating, size = 20) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= fullStars) {
      stars.push(
        <MdStar key={i} className="text-yellow-400 inline" size={size} />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <MdStarHalf key={i} className="text-yellow-400 inline" size={size} />
      );
    } else {
      stars.push(
        <MdStarBorder
          key={i}
          className="text-slate-300 inline"
          size={size}
        />
      );
    }
  }
  return stars;
};

// ─── Full image URL helper ──────────────────────────────────────
const getFullImageUrl = (value) => {
  if (!value || typeof value !== "string") return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("data:")) return value;
  if (value.startsWith("blob:")) return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("/")) return `${API_BASE_URL}${value}`;
  return `${API_BASE_URL}/uploads/${value}`;
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdInfoOutline },
  { id: "status", label: "Status & Rating", icon: MdFlag },
];

// ─── Main Component ──────────────────────────────────────────────
const EditCandidateTestimonial = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id || 1;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Form state ────────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    image: "",
    rating: "",
    description: "",
    status: "active",
  });

  // File handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [errors, setErrors] = useState({});

  // ─── Fetch testimonial data ───────────────────────────────────
  useEffect(() => {
    const fetchTestimonial = async () => {
      setFetchLoading(true);
      try {
        const response = await candidateTestimonialService.getById(id);
        const data = response?.data || response;

        if (data) {
          setFormValues({
            name: data.name || "",
            email: data.email || "",
            image: data.image || "",
            rating: data.rating?.toString() || "",
            description: data.description || "",
            status: data.is_status ? "active" : "inactive",
          });
          setImagePreview(data.image ? getFullImageUrl(data.image) : null);
          setEditItem(data);
        } else {
          showError("Testimonial not found");
          navigate("/candidate-testimonials");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load testimonial data");
        navigate("/candidate-testimonials");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchTestimonial();
    }
  }, [id, navigate]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(true);
    setFormValues((prev) => ({ ...prev, image: "" }));
  };

  // ─── Validation ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.name?.trim()) {
      newErrors.name = "Candidate name is required";
    } else if (formValues.name.trim().length < 2) {
      newErrors.name = "Candidate name must be at least 2 characters";
    } else if (formValues.name.trim().length > 100) {
      newErrors.name = "Candidate name must be at most 100 characters";
    }

    if (!formValues.email?.trim()) {
      newErrors.email = "Candidate email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formValues.rating) {
      newErrors.rating = "Rating is required";
    }

    if (!formValues.description?.trim()) {
      newErrors.description = "Testimonial is required";
    } else if (formValues.description.trim().length < 10) {
      newErrors.description = "Testimonial must be at least 10 characters";
    } else if (formValues.description.trim().length > 500) {
      newErrors.description = "Testimonial must be at most 500 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.rating) {
        setActiveTab("status");
      } else {
        setActiveTab("overview");
      }
      showError(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  // ─── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        description: formValues.description.trim(),
        rating: parseFloat(formValues.rating),
        is_status: formValues.status === "active",
        updated_by: userId,
      };

      if (imageFile instanceof File) {
        submitData.imageFile = imageFile;
      } else if (imageRemoved) {
        submitData.image = null;
      } else if (formValues.image) {
        submitData.image = formValues.image;
      }

      await candidateTestimonialService.update(id, submitData);
      showSuccess("Testimonial updated successfully");
      navigate("/candidate-testimonials");
    } catch (error) {
      console.error("Submit error:", error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          "Failed to update testimonial"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await candidateTestimonialService.delete(id);
      showSuccess("Testimonial deleted successfully");
      setShowDeleteDialog(false);
      navigate("/candidate-testimonials");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this testimonial because it is being used in other records."
        );
      } else {
        showError(message || "Failed to delete testimonial");
      }
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Loading state ─────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">
            Loading testimonial data...
          </p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Hero helpers ──────────────────────────────────────────────
  const heroName = formValues.name?.trim() || "Candidate Testimonial";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const ratingNum = parseFloat(formValues.rating) || 0;

  // ─── Render tab content ────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Candidate Name */}
              <div>
                <FieldLabel required>Candidate Name</FieldLabel>
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
                    placeholder="e.g. John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <FieldLabel required>Candidate Email</FieldLabel>
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
                    placeholder="e.g. john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Image */}
              <div className="sm:col-span-2">
                <FieldLabel>Candidate Image</FieldLabel>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Candidate"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <MdImage size={28} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                      <MdCloudUpload size={16} />
                      {imagePreview ? "Change image" : "Upload image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                      >
                        <MdClose size={14} />
                        Remove image
                      </button>
                    )}
                    <p className="text-xs text-slate-500">
                      JPEG, PNG, GIF, WEBP, AVIF, SVG – Max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <FieldLabel required>Testimonial</FieldLabel>
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all resize-y bg-white ${
                    errors.description
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                  placeholder="Write the testimonial here..."
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.description ? (
                    <p className="text-xs text-red-500">
                      {errors.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Max 500 characters.
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    {formValues.description?.length || 0} / 500
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-xl">
            {/* Rating */}
            <div>
              <FieldLabel required>Rating</FieldLabel>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(ratingNum, 24)}
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {ratingNum ? `${ratingNum} / 5` : "No rating"}
                  </span>
                </div>
                <div className="relative">
                  <MdStar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    name="rating"
                    value={formValues.rating}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.rating
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                  >
                    <option value="">Select rating</option>
                    <option value="1">⭐ 1 Star</option>
                    <option value="1.5">⭐ 1.5 Stars</option>
                    <option value="2">⭐⭐ 2 Stars</option>
                    <option value="2.5">⭐⭐ 2.5 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                    <option value="3.5">⭐⭐⭐ 3.5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="4.5">⭐⭐⭐⭐ 4.5 Stars</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  </select>
                </div>
                {errors.rating && (
                  <p className="text-xs text-red-500">{errors.rating}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="pt-4 border-t border-slate-100">
              <FieldLabel required>Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {["active", "inactive"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formValues.status === status}
                      onChange={handleInputChange}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Active testimonials are visible on the public site.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/candidate-testimonials")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Candidate Testimonials
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/candidate-testimonials")}
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
              {loading ? "Updating..." : "Update Testimonial"}
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
              {/* Avatar */}
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
                    {initials || <MdRateReview size={24} />}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  <StatusPill status={formValues.status} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-0.5">
                    {renderStars(ratingNum, 14)}
                  </div>
                  <span className="text-xs text-white/80">
                    {ratingNum || 0} / 5
                  </span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">ID: #{id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdFlag size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {formValues.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdStar size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Rating</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {ratingNum || 0} / 5
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdEmail size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Email
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.email || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdImage size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Image</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {imagePreview ? "Uploaded ✓" : "None"}
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
                      layoutId="edit-candidate-testimonial-tab-underline"
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

        {/* ─── Actions ────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
            >
              <MdDelete size={16} />
              Delete Testimonial
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/candidate-testimonials")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
              >
                <MdCancel size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdSave size={16} />
                )}
                {loading ? "Updating..." : "Update Testimonial"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/candidate-testimonials")}
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
        title="Delete Candidate Testimonial"
        message="Delete this testimonial? This action cannot be undone."
      />
    </div>
  );
};

export default EditCandidateTestimonial;