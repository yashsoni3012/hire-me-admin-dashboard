// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { stateService } from '../../services/state.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditState = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [editItem, setEditItem] = useState(null);

//   const fields = [
//     {
//       name: "name",
//       label: "State Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. Rajasthan, Gujarat",
//       help: "Enter the full name of the state",
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
//       help: "Trending states will be highlighted in the listing",
//     },
//   ];

//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: "State name is required",
//       minLength: 2,
//       minLengthMessage: "State name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "State name must be at most 100 characters",
//     },
//   };

//   useEffect(() => {
//     const fetchState = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await stateService.getById(id);
//         const data = response?.data || response;

//         if (data) {
//           const formData = {
//             name: data.name || "",
//             status: data.is_status ? "active" : "inactive",
//             is_trending: data.is_trending || false,
//           };
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("State not found");
//           navigate('/states');
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load state data");
//         navigate('/states');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchState();
//     }
//   }, [id, navigate]);

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const submitData = {
//         name: formData.name.trim(),
//         status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//       };

//       await stateService.update(id, submitData);
//       showSuccess("State updated successfully");
//       navigate('/states');
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(
//         error.message || error?.response?.data?.message || "Failed to update state"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await stateService.delete(id);
//       showSuccess("State deleted successfully");
//       navigate('/states');
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError(
//           "Cannot delete this state because it is being used in other records."
//         );
//       } else {
//         showError(message || "Failed to delete state");
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
//           <p className="text-sm text-gray-400">Loading state data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit State"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/states"
//       breadcrumb={`Editing: ${editItem?.name || 'State'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditState;

// pages/states/EditState.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  MdLocationOn,
  MdTrendingUp,
} from "react-icons/md";
import { stateService } from "../../services/state.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import ConfirmDialog from "../../components/common/ConfirmDialog";

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    icon: MdCheckCircle,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    dot: "bg-slate-400",
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
  <label
    className={`relative inline-flex items-center ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
  >
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
  { id: "overview", label: "Overview", icon: MdInfo },
  { id: "activity", label: "Activity", icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const EditState = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    name: "",
    status: "active",
    is_trending: false,
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
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  // ─── Fetch state data ──────────────────────────────────────────
  useEffect(() => {
    const fetchState = async () => {
      setFetchLoading(true);
      try {
        const response = await stateService.getById(id);
        const data = response?.data || response;

        if (data) {
          const formData = {
            name: data.name || "",
            status: data.is_status ? "active" : "inactive",
            is_trending: data.is_trending || false,
          };
          setInitialData(formData);
          setFormValues(formData);
          setEditItem(data);
        } else {
          showError("State not found");
          navigate("/states");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load state data");
        navigate("/states");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchState();
    }
  }, [id, navigate]);

  // ─── Helper: get user name ────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return "—";
    return userNameCache[userId] || `User ${userId}`;
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────────
  const validateField = (name, value) => {
    if (name === "name") {
      if (!value || !value.trim()) return "State name is required";
      if (value.trim().length < 2)
        return "State name must be at least 2 characters";
      if (value.trim().length > 100)
        return "State name must be at most 100 characters";
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const nameError = validateField("name", formValues.name);
    if (nameError) {
      newErrors.name = nameError;
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
      showError("Please fix validation errors");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: formValues.name.trim(),
        status: formValues.status === "active",
        is_trending: formValues.is_trending || false,
      };

      await stateService.update(id, submitData);
      showSuccess("State updated successfully");
      navigate("/states");
    } catch (error) {
      console.error("Submit error:", error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          "Failed to update state",
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await stateService.delete(id);
      showSuccess("State deleted successfully");
      navigate("/states");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this state because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete state");
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate("/states");

  // ─── Render helper for fields ──────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, color } =
      field;
    const value = formValues[name] ?? "";
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;
    const isViewMode = false; // This is edit mode

    const commonClass = `w-full px-3.5 py-2.5 border ${hasError ? "border-red-500" : "border-slate-300"} rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    let inputElement;
    switch (type) {
      case "radio":
        inputElement = (
          <div className="flex flex-wrap gap-4 pt-1.5">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={String(value) === String(opt.value)}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500 ${color || ""}`}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
        break;
      case "checkbox":
        inputElement = (
          <div className="flex items-center gap-3 pt-1.5">
            <Toggle
              name={name}
              checked={Boolean(value)}
              onChange={handleInputChange}
            />
            <span className="text-sm text-slate-600">
              {value ? "Enabled" : "Disabled"}
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
            className={commonClass}
          />
        );
    }

    return (
      <div key={name} className="mb-4">
        <FieldLabel required={required}>{label}</FieldLabel>
        {inputElement}
        {help && !hasError && (
          <p className="mt-1 text-xs text-slate-400">{help}</p>
        )}
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
          <p className="text-sm text-slate-400">Loading state data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const stateName = formValues.name?.trim() || "State";
  const status = formValues.status || "active";
  const isTrending = formValues.is_trending || false;
  const createdDate = editItem?.created_at
    ? formatDate(editItem.created_at)
    : "—";
  const updatedDate = editItem?.updated_at
    ? formatDate(editItem.updated_at)
    : "—";

  const initials = stateName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  // ─── Field definitions ──────────────────────────────────────
  const fields = [
    {
      name: "name",
      label: "State Name",
      type: "text",
      required: true,
      placeholder: "e.g. Maharashtra",
      help: "Enter the full state name",
    },
    {
      name: "status",
      label: "Status",
      type: "radio",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      color: "text-[#2c0eee] focus:ring-[#4529f7]",
    },
    {
      name: "is_trending",
      label: "Mark as Trending",
      type: "checkbox",
      color: "text-yellow-500 focus:ring-yellow-500",
      help: "Trending states will be highlighted in the listing",
    },
  ];

  const auditFields = [
    { name: "created_by", label: "Created By" },
    { name: "updated_by", label: "Updated By" },
    { name: "created_at", label: "Created At" },
    { name: "updated_at", label: "Updated At" },
  ];

  // ─── Main render ──────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar (light header) ─────────────────── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Back button */}
            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} />
            </button>

            {/* Page title */}
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">States</p>

              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Edit: {stateName}
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Delete */}
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete state"
              title="Delete state"
            >
              <MdDelete size={19} />
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={handleBack}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors"
            >
              <MdCancel size={16} />
              Cancel
            </button>

            {/* Update */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdSave size={16} />
              )}

              {loading ? "Updating..." : "Update State"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero (dark gradient) ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
         <div className="relative h-44 sm:h-52 bg-gradient-to-l from-[#0f2747] to-[#64748b]">
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
                    {stateName}
                  </h1>
                  <StatusPill status={status} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">ID: #{id}</span>
                  {editItem?.created_at && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70">
                        Created: {createdDate}
                      </span>
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
            <MdTrendingUp size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Trending
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {isTrending ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Created By
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {editItem?.created_by
                  ? getUserNameCached(editItem.created_by)
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdHistory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Last Updated
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {updatedDate}
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
                    active
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="edit-state-tab-underline"
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
                {activeTab === "overview" && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {fields.map((field) => (
                        <div
                          key={field.name}
                          className={
                            field.type === "checkbox" || field.type === "radio"
                              ? "sm:col-span-2"
                              : ""
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
                          "Update State"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === "activity" && (
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
                          let value = editItem?.[field.name] ?? "—";
                          if (
                            field.name === "created_by" ||
                            field.name === "updated_by"
                          ) {
                            value = value ? getUserNameCached(value) : "—";
                          } else if (
                            field.name === "created_at" ||
                            field.name === "updated_at"
                          ) {
                            value = value ? formatDate(value) : "—";
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
        title="Delete State"
        message={`Delete state "${stateName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EditState;
