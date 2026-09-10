// // pages/experience-levels/AddExperienceLevel.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { experienceLevelService } from '../../services/experienceLevel.service';
// import { showSuccess, showError } from '../../utils/toast';

// const AddExperienceLevel = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // ─── Form fields configuration ──────────────────────────────────
//   const fields = [
//     {
//       name: "name",
//       label: "Experience Level Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. Fresher, Junior, Senior, Lead",
//       help: "Enter the experience level name",
//     },
//     {
//       name: "min_year",
//       label: "Minimum Years",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 0, 1, 2",
//       help: "Enter the minimum years of experience (must be 0 or greater)",
//       min: 0,
//       step: 1,
//     },
//     {
//       name: "max_year",
//       label: "Maximum Years",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 1, 3, 5",
//       help: "Enter the maximum years of experience (must be greater than minimum years)",
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
//     {
//       name: "is_trending",
//       label: "Mark as Trending",
//       type: "checkbox",
//       color: "text-yellow-500 focus:ring-yellow-500",
//       help: "Trending experience levels will be highlighted in the listing",
//     },
//   ];

//   // ─── Validation rules with proper validation ───────────────────
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: "Experience level name is required",
//       minLength: 2,
//       minLengthMessage: "Experience level name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Experience level name must be at most 100 characters",
//     },
//     min_year: {
//       required: true,
//       requiredMessage: "Minimum years is required",
//       min: 0,
//       minMessage: "Minimum years must be 0 or greater",
//       custom: (value, formValues) => {
//         const minVal = parseInt(value);
//         const maxVal = parseInt(formValues?.max_year);
        
//         // Check if min_year is a valid number
//         if (isNaN(minVal)) {
//           return "Minimum years must be a valid number";
//         }
        
//         // Check if min_year is less than 0
//         if (minVal < 0) {
//           return "Minimum years cannot be negative";
//         }
        
//         // Check if max_year is provided and valid
//         if (formValues?.max_year && formValues.max_year !== "") {
//           if (isNaN(maxVal)) {
//             return "Maximum years must be a valid number";
//           }
//           if (minVal > maxVal) {
//             return "Minimum years cannot be greater than maximum years";
//           }
//           if (minVal === maxVal) {
//             return "Minimum and maximum years cannot be equal. Please provide a valid range.";
//           }
//         }
        
//         // Check if min_year exceeds a reasonable limit (e.g., 50 years)
//         if (minVal > 50) {
//           return "Minimum years cannot exceed 50 years";
//         }
        
//         return null;
//       },
//     },
//     max_year: {
//       required: true,
//       requiredMessage: "Maximum years is required",
//       min: 0,
//       minMessage: "Maximum years must be 0 or greater",
//       custom: (value, formValues) => {
//         const maxVal = parseInt(value);
//         const minVal = parseInt(formValues?.min_year);
        
//         // Check if max_year is a valid number
//         if (isNaN(maxVal)) {
//           return "Maximum years must be a valid number";
//         }
        
//         // Check if max_year is less than 0
//         if (maxVal < 0) {
//           return "Maximum years cannot be negative";
//         }
        
//         // Check if min_year is provided and valid
//         if (formValues?.min_year && formValues.min_year !== "") {
//           if (isNaN(minVal)) {
//             return "Minimum years must be a valid number";
//           }
//           if (maxVal < minVal) {
//             return "Maximum years cannot be less than minimum years";
//           }
//           if (maxVal === minVal) {
//             return "Minimum and maximum years cannot be equal. Please provide a valid range.";
//           }
//         }
        
//         // Check if max_year exceeds a reasonable limit (e.g., 50 years)
//         if (maxVal > 50) {
//           return "Maximum years cannot exceed 50 years";
//         }
        
//         // Check if the range is too large (e.g., more than 30 years)
//         if (minVal !== undefined && !isNaN(minVal) && (maxVal - minVal) > 30) {
//           return "Experience range cannot exceed 30 years. Please narrow the range.";
//         }
        
//         return null;
//       },
//     },
//   };

//   // ─── Initial data ──────────────────────────────────────────────
//   const initialData = {
//     name: "",
//     min_year: "",
//     max_year: "",
//     status: "active",
//     is_trending: false,
//   };

//   // ─── Handle form submission ─────────────────────────────────────
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       // Parse years with proper validation
//       const minYear = parseInt(formData.min_year);
//       const maxYear = parseInt(formData.max_year);
      
//       // Extra validation before submission (should already be caught by validation rules)
//       if (isNaN(minYear) || minYear < 0) {
//         showError("Minimum years must be a valid number greater than or equal to 0");
//         setLoading(false);
//         return;
//       }
      
//       if (isNaN(maxYear) || maxYear < 0) {
//         showError("Maximum years must be a valid number greater than or equal to 0");
//         setLoading(false);
//         return;
//       }
      
//       if (minYear > maxYear) {
//         showError("Minimum years cannot be greater than maximum years");
//         setLoading(false);
//         return;
//       }
      
//       if (minYear === maxYear) {
//         showError("Minimum and maximum years cannot be equal. Please provide a valid range.");
//         setLoading(false);
//         return;
//       }

//       const submitData = {
//         name: formData.name.trim(),
//         min_year: minYear,
//         max_year: maxYear,
//         is_status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//       };

//       await experienceLevelService.create(submitData);
//       showSuccess("Experience level created successfully");
      
//       navigate('/experience-levels');
//     } catch (error) {
//       console.error('Submit error:', error);
//       const errorMessage = error?.response?.data?.message || 
//                           error?.message || 
//                           "Failed to create experience level";
//       showError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormPage
//       title="Add Experience Level"
//       mode="add"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       loading={loading}
//       submitLabel="Create"
//       navigateTo="/experience-levels"
//       breadcrumb="Create a new experience level"
//     />
//   );
// };

// export default AddExperienceLevel;

// pages/experience-levels/AddExperienceLevel.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdFlag,
  MdInfoOutline,
  MdTimeline,
  MdWorkHistory,
  MdDateRange,
} from "react-icons/md";
import { experienceLevelService } from "../../services/experienceLevel.service";
import { showSuccess, showError } from "../../utils/toast";

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
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdInfoOutline },
  { id: "range", label: "Experience Range", icon: MdTimeline },
  { id: "status", label: "Status & Flags", icon: MdFlag },
];

// ─── Main Component ─────────────────────────────────────────────
const AddExperienceLevel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: "",
    min_year: "",
    max_year: "",
    status: "active",
    is_trending: false,
  });

  const [errors, setErrors] = useState({});

  // ─── Handlers ────────────────────────────────────────────────
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

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formValues.name?.trim()) {
      newErrors.name = "Experience level name is required";
    } else if (formValues.name.trim().length < 2) {
      newErrors.name = "Experience level name must be at least 2 characters";
    } else if (formValues.name.trim().length > 100) {
      newErrors.name = "Experience level name must be at most 100 characters";
    }

    // Min year validation
    const minVal = parseInt(formValues.min_year);
    if (
      formValues.min_year === "" ||
      formValues.min_year === null ||
      formValues.min_year === undefined
    ) {
      newErrors.min_year = "Minimum years is required";
    } else if (isNaN(minVal)) {
      newErrors.min_year = "Minimum years must be a valid number";
    } else if (minVal < 0) {
      newErrors.min_year = "Minimum years cannot be negative";
    } else if (minVal > 50) {
      newErrors.min_year = "Minimum years cannot exceed 50 years";
    }

    // Max year validation
    const maxVal = parseInt(formValues.max_year);
    if (
      formValues.max_year === "" ||
      formValues.max_year === null ||
      formValues.max_year === undefined
    ) {
      newErrors.max_year = "Maximum years is required";
    } else if (isNaN(maxVal)) {
      newErrors.max_year = "Maximum years must be a valid number";
    } else if (maxVal < 0) {
      newErrors.max_year = "Maximum years cannot be negative";
    } else if (maxVal > 50) {
      newErrors.max_year = "Maximum years cannot exceed 50 years";
    }

    // Cross-field validation
    if (!newErrors.min_year && !newErrors.max_year) {
      if (minVal > maxVal) {
        newErrors.min_year =
          "Minimum years cannot be greater than maximum years";
      } else if (minVal === maxVal) {
        newErrors.max_year =
          "Minimum and maximum years cannot be equal. Please provide a valid range.";
      } else if (maxVal - minVal > 30) {
        newErrors.max_year =
          "Experience range cannot exceed 30 years. Please narrow the range.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) {
        setActiveTab("overview");
      } else {
        setActiveTab("range");
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
      const minYear = parseInt(formValues.min_year);
      const maxYear = parseInt(formValues.max_year);

      const submitData = {
        name: formValues.name.trim(),
        min_year: minYear,
        max_year: maxYear,
        is_status: formValues.status === "active",
        is_trending: formValues.is_trending || false,
      };

      await experienceLevelService.create(submitData);
      showSuccess("Experience level created successfully");
      navigate("/experience-levels");
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create experience level";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.name?.trim() || "New Experience Level";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const minYearNum = parseInt(formValues.min_year);
  const maxYearNum = parseInt(formValues.max_year);
  const rangeDisplay =
    !isNaN(minYearNum) && !isNaN(maxYearNum)
      ? `${minYearNum} – ${maxYearNum} yrs`
      : "—";

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <FieldLabel required>Experience Level Name</FieldLabel>
                <div className="relative">
                  <MdWorkHistory
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
                    placeholder="e.g. Fresher, Junior, Senior, Lead"
                  />
                </div>
                {errors.name ? (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Enter the experience level name, e.g. "Junior".
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "range":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel required>Minimum Years</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="min_year"
                    value={formValues.min_year}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.min_year
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. 0, 1, 2"
                  />
                </div>
                {errors.min_year ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.min_year}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Must be 0 or greater and not exceed 50.
                  </p>
                )}
              </div>

              <div>
                <FieldLabel required>Maximum Years</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="max_year"
                    value={formValues.max_year}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.max_year
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. 1, 3, 5"
                  />
                </div>
                {errors.max_year ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.max_year}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Must be greater than minimum and not exceed 50.
                  </p>
                )}
              </div>

              {/* Range preview */}
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <MdTimeline className="text-blue-500" size={18} />
                  <span className="text-sm text-slate-600">
                    Experience Range:
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {rangeDisplay}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-xl">
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
                Active experience levels are visible in the listing.
              </p>
            </div>

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
                Trending experience levels are highlighted in the listing.
              </p>
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
              onClick={() => navigate("/experience-levels")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Experience Levels
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/experience-levels")}
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
              {loading ? "Creating..." : "Create Experience Level"}
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
              {/* Icon / avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdTimeline size={24} />}
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
                  <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MdTimeline size={11} />
                    {rangeDisplay}
                  </span>
                  <span className="text-xs text-white/70">New Experience Level</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdWorkHistory
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Name</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.name || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdTimeline size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Range</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {rangeDisplay}
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
                      layoutId="add-experience-level-tab-underline"
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
          onClick={() => navigate("/experience-levels")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddExperienceLevel;