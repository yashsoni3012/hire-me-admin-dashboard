// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import roleService from '../../services/role.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditRole = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   // Fetch role data
//   useEffect(() => {
//     const fetchRole = async () => {
//       setFetchLoading(true);
//       try {
//         console.log(`Fetching role with ID: ${id}`);
//         const response = await roleService.getById(id);
//         console.log('Role response:', response);
//         const data = response?.data || response;
        
//         if (data) {
//           const formData = {
//             role_name: data.role_name || "",
//             status: data.status || "active",
//           };
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("Role not found");
//           navigate('/roles');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load role data");
//         navigate('/roles');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchRole();
//     }
//   }, [id, navigate]);

//   // Form fields configuration
//   const fields = [
//     {
//       name: "role_name",
//       label: "Role Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. moderator, editor, viewer",
//       help: "Enter a unique role name",
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
//     role_name: {
//       required: true,
//       requiredMessage: "Role name is required",
//       minLength: 2,
//       minLengthMessage: "Role name must be at least 2 characters",
//       maxLength: 50,
//       maxLengthMessage: "Role name must be at most 50 characters",
//       pattern: /^[a-zA-Z0-9\s_\-]+$/,
//       patternMessage: "Role name can only contain letters, numbers, spaces, underscores, and hyphens",
//     },
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       await roleService.update(id, formData);
//       showSuccess("Role updated successfully");
      
//       // Redirect to roles list page
//       navigate('/roles');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update role");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await roleService.delete(id);
//       showSuccess("Role deleted successfully");
      
//       // Redirect to roles list page
//       navigate('/roles');
//     } catch (error) {
//       console.error('Delete error:', error);
//       showError(error.message || "Failed to delete role");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading role data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Role"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/roles"
//       breadcrumb={`Editing: ${editItem?.role_name || 'Role'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditRole;

// pages/roles/EditRole.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdAdminPanelSettings,
  MdFlag,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
  MdBadge,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import roleService from "../../services/role.service";
import { showSuccess, showError } from "../../utils/toast";

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
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdInfoOutline },
  { id: "status", label: "Status", icon: MdFlag },
];

// ─── Main Component ─────────────────────────────────────────────
const EditRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    role_name: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // ─── Fetch role data ─────────────────────────────────────────
  useEffect(() => {
    const fetchRole = async () => {
      setFetchLoading(true);
      try {
        const response = await roleService.getById(id);
        const data = response?.data || response;

        if (data) {
          setFormValues({
            role_name: data.role_name || "",
            status: data.status || "active",
          });
          setEditItem(data);
        } else {
          showError("Role not found");
          navigate("/roles");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load role data");
        navigate("/roles");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchRole();
    }
  }, [id, navigate]);

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.role_name?.trim()) {
      newErrors.role_name = "Role name is required";
    } else if (formValues.role_name.trim().length < 2) {
      newErrors.role_name = "Role name must be at least 2 characters";
    } else if (formValues.role_name.trim().length > 50) {
      newErrors.role_name = "Role name must be at most 50 characters";
    } else if (!/^[a-zA-Z0-9\s_\-]+$/.test(formValues.role_name.trim())) {
      newErrors.role_name =
        "Role name can only contain letters, numbers, spaces, underscores, and hyphens";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setActiveTab("overview");
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
      const submitData = {
        role_name: formValues.role_name.trim(),
        status: formValues.status,
      };

      await roleService.update(id, submitData);
      showSuccess("Role updated successfully");
      navigate("/roles");
    } catch (error) {
      console.error("Submit error:", error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          "Failed to update role"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await roleService.delete(id);
      showSuccess("Role deleted successfully");
      setShowDeleteDialog(false);
      navigate("/roles");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this role because it is being used in other records."
        );
      } else {
        showError(message || "Failed to delete role");
      }
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Loading state ───────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading role data...</p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.role_name?.trim() || "Role";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <FieldLabel required>Role Name</FieldLabel>
                <div className="relative">
                  <MdBadge
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="role_name"
                    value={formValues.role_name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.role_name
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. moderator, editor, viewer"
                  />
                </div>
                {errors.role_name ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.role_name}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Letters, numbers, spaces, underscores, and hyphens only.
                  </p>
                )}
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
                Active roles can be assigned to users.
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
              onClick={() => navigate("/roles")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Roles
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/roles")}
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
              {loading ? "Updating..." : "Update Role"}
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
                  {initials || <MdAdminPanelSettings size={24} />}
                </div>
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
                  <span className="text-xs text-white/70">ID: #{id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBadge size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Role Name
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.role_name || "—"}
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
            <MdAdminPanelSettings
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Type</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                Role
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdInfoOutline
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">ID</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                #{id}
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
                      layoutId="edit-role-tab-underline"
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
              Delete Role
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/roles")}
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
                {loading ? "Updating..." : "Update Role"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/roles")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>

      {/* ─── Delete Confirmation Dialog ─────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Role"
        message="Delete this role? This action cannot be undone."
      />
    </div>
  );
};

export default EditRole;