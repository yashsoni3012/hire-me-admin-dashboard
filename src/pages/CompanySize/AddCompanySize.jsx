// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { showSuccess, showError } from '../../utils/toast';

// const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// // Helper: Extract size from name
// const extractSizeFromName = (name) => {
//   if (!name) return 0;

//   const trimmedName = name.trim();
//   const lowerName = trimmedName.toLowerCase();

//   if (lowerName.includes("immediate") || lowerName.includes("0 day")) {
//     return 0;
//   }

//   const rangeMatch = trimmedName.match(/(\d+)\s*[-–—]\s*(\d+)/);
//   if (rangeMatch) {
//     return parseInt(rangeMatch[2]);
//   }

//   const plusMatch = trimmedName.match(/(\d+)\s*\+/);
//   if (plusMatch) {
//     return parseInt(plusMatch[1]);
//   }

//   const upToMatch = trimmedName.match(/(?:up to|upto|less than|under)\s*(\d+)/i);
//   if (upToMatch) {
//     return parseInt(upToMatch[1]);
//   }

//   const moreThanMatch = trimmedName.match(/(?:more than|over|above)\s*(\d+)/i);
//   if (moreThanMatch) {
//     return parseInt(moreThanMatch[1]);
//   }

//   const numberMatch = trimmedName.match(/\d+/);
//   if (numberMatch) {
//     return parseInt(numberMatch[0]);
//   }

//   return 0;
// };

// const AddCompanySize = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const token = localStorage.getItem("token");

//   // Helper: Get current user from localStorage
//   const getCurrentUser = () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       return user || null;
//     } catch {
//       return null;
//     }
//   };

//   const currentUser = getCurrentUser();
//   const currentUserId = currentUser?.id || 1;

//   // Form fields configuration
//   const fields = [
//     {
//       name: "company_size_name",
//       label: "Company Size Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. 1-10 employees, 50-100 employees",
//       help: "Enter the company size name",
//     },
//     {
//       name: "company_size_slug",
//       label: "Slug (URL identifier)",
//       type: "text",
//       required: false,
//       placeholder: "auto-generated if empty",
//       help: "Enter a URL-friendly slug or leave empty for auto-generation",
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
//       help: "Trending company sizes will be highlighted",
//     },
//   ];

//   // Validation rules
//   const validationRules = {
//     company_size_name: {
//       required: true,
//       requiredMessage: "Company size name is required",
//       minLength: 2,
//       minLengthMessage: "Company size name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Company size name must be at most 100 characters",
//     },
//   };

//   // Initial data
//   const initialData = {
//     company_size_name: "",
//     company_size_slug: "",
//     status: "active",
//     is_trending: false,
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const slug = formData.company_size_slug.trim() || 
//         formData.company_size_name.trim().toLowerCase().replace(/\s+/g, "-");

//       const payload = {
//         name: formData.company_size_name.trim(),
//         slug: slug,
//         is_status: formData.status === "active",
//         status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//         size: extractSizeFromName(formData.company_size_name.trim()),
//         created_by: currentUserId,
//         updated_by: currentUserId,
//       };

//       const response = await fetch(`${API_BASE}/company-sizes`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || `HTTP error ${response.status}`);
//       }

//       showSuccess("Company size created successfully");
//       navigate('/company-sizes');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || "Failed to create company size");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormPage
//       title="Add Company Size"
//       mode="add"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       loading={loading}
//       submitLabel="Create"
//       navigateTo="/company-sizes"
//       breadcrumb="Create a new company size"
//     />
//   );
// };

// export default AddCompanySize;

// pages/company-sizes/AddCompanySize.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdGroups,
  MdLink,
  MdFlag,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdBusiness,
} from "react-icons/md";
import { showSuccess, showError } from "../../utils/toast";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// ─── Helper: Extract size from name ─────────────────────────────
const extractSizeFromName = (name) => {
  if (!name) return 0;

  const trimmedName = name.trim();
  const lowerName = trimmedName.toLowerCase();

  if (lowerName.includes("immediate") || lowerName.includes("0 day")) {
    return 0;
  }

  const rangeMatch = trimmedName.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (rangeMatch) {
    return parseInt(rangeMatch[2]);
  }

  const plusMatch = trimmedName.match(/(\d+)\s*\+/);
  if (plusMatch) {
    return parseInt(plusMatch[1]);
  }

  const upToMatch = trimmedName.match(
    /(?:up to|upto|less than|under)\s*(\d+)/i
  );
  if (upToMatch) {
    return parseInt(upToMatch[1]);
  }

  const moreThanMatch = trimmedName.match(
    /(?:more than|over|above)\s*(\d+)/i
  );
  if (moreThanMatch) {
    return parseInt(moreThanMatch[1]);
  }

  const numberMatch = trimmedName.match(/\d+/);
  if (numberMatch) {
    return parseInt(numberMatch[0]);
  }

  return 0;
};

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const Toggle = ({ checked, onChange, name }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked || false}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
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

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdGroups },
  { id: "status", label: "Status & Flags", icon: MdFlag },
];

// ─── Main Component ──────────────────────────────────────────────
const AddCompanySize = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Get current user ──────────────────────────────────────────
  const getCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user || null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || 1;
  const token = localStorage.getItem("token");

  // ─── Form state ────────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    company_size_name: "",
    company_size_slug: "",
    status: "active",
    is_trending: false,
  });

  const [errors, setErrors] = useState({});

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

  // ─── Validation ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.company_size_name?.trim()) {
      newErrors.company_size_name = "Company size name is required";
    } else if (formValues.company_size_name.trim().length < 2) {
      newErrors.company_size_name =
        "Company size name must be at least 2 characters";
    } else if (formValues.company_size_name.trim().length > 100) {
      newErrors.company_size_name =
        "Company size name must be at most 100 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus first tab if error is on overview
      if (newErrors.company_size_name) {
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
      const name = formValues.company_size_name.trim();
      const slug =
        formValues.company_size_slug.trim() ||
        name.toLowerCase().replace(/\s+/g, "-");

      const payload = {
        name,
        slug,
        is_status: formValues.status === "active",
        status: formValues.status === "active",
        is_trending: formValues.is_trending || false,
        size: extractSizeFromName(name),
        created_by: currentUserId,
        updated_by: currentUserId,
      };

      const response = await fetch(`${API_BASE}/company-sizes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error ${response.status}`);
      }

      showSuccess("Company size created successfully");
      navigate("/company-sizes");
    } catch (error) {
      console.error("Submit error:", error);
      showError(error.message || "Failed to create company size");
    } finally {
      setLoading(false);
    }
  };

  // ─── Hero helpers ──────────────────────────────────────────────
  const heroName =
    formValues.company_size_name?.trim() || "New Company Size";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  // ─── Render tab content ────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel required>Company Size Name</FieldLabel>
                <div className="relative">
                  <MdGroups
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="company_size_name"
                    value={formValues.company_size_name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.company_size_name
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. 1-10 employees, 50-100 employees"
                    required
                  />
                </div>
                {errors.company_size_name ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.company_size_name}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Enter the company size range, e.g. "1-10 employees".
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <FieldLabel>Slug (URL identifier)</FieldLabel>
                <div className="relative">
                  <MdLink
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="company_size_slug"
                    value={formValues.company_size_slug}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    placeholder="auto-generated if empty"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Leave empty to auto-generate from the name.
                </p>
              </div>
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-xl">
            {/* Status */}
            <div>
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
                Active company sizes are visible in the listing.
              </p>
            </div>

            {/* Trending */}
            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Trending</FieldLabel>
              <div className="flex items-center gap-3 pt-0.5">
                <Toggle
                  name="is_trending"
                  checked={formValues.is_trending}
                  onChange={handleInputChange}
                />
                <span className="text-sm text-slate-600">
                  {formValues.is_trending
                    ? "Marked as trending"
                    : "Not trending"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Trending company sizes are highlighted in the listing.
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
              onClick={() => navigate("/company-sizes")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Company Sizes
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/company-sizes")}
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
              {loading ? "Creating..." : "Create Company Size"}
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
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdGroups size={24} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  <StatusPill status={formValues.status} />
                  {formValues.is_trending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdTrendingUp size={12} />
                      Trending
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">New Company Size</span>
                  {formValues.company_size_slug && (
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                      /{formValues.company_size_slug}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdGroups
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Name</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.company_size_name || "—"}
              </p>
            </div>
          </div>
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
            <MdTrendingUp
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Trending
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_trending ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Extracted Size
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {extractSizeFromName(formValues.company_size_name) || "—"}
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
                      layoutId="add-company-size-tab-underline"
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
          onClick={() => navigate("/company-sizes")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddCompanySize;