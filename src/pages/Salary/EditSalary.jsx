// // pages/EditSalary.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { salaryService } from '../../services/salary.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditSalary = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   useEffect(() => {
//     const fetchSalary = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await salaryService.getById(id);
//         const data = response?.data || response;
        
//         if (data && data.id) {
//           const formData = {
//             label: data.label || "",
//             amount: data.amount || 0,
//             display_order: data.display_order || 1,
//             status: data.status === 1 ? "active" : "inactive",
//           };
//           setInitialData(formData);
//           setEditItem(data);
//           console.log('✅ Form data loaded:', formData);
//         } else {
//           showError("Salary option not found");
//           navigate('/salary');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load Salary option data");
//         navigate('/salary');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchSalary();
//     }
//   }, [id, navigate]);

//   const fields = [
//     {
//       name: "label",
//       label: "Salary Label",
//       type: "text",
//       required: true,
//       placeholder: "e.g. ₹5 Lakh, ₹10 Lakh, ₹15 Lakh",
//       help: "Enter the salary range label",
//     },
//     {
//       name: "amount",
//       label: "Amount (in INR)",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 500000",
//       help: "Enter the salary amount in INR",
//       min: 0,
//       step: 10000,
//     },
//     {
//       name: "display_order",
//       label: "Display Order",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 1",
//       help: "Lower numbers appear first in dropdown",
//       min: 1,
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

//   const validationRules = {
//     label: {
//       required: true,
//       requiredMessage: "Label is required",
//       minLength: 2,
//       minLengthMessage: "Label must be at least 2 characters",
//       maxLength: 255,
//       maxLengthMessage: "Label must be at most 255 characters",
//     },
//     amount: {
//       required: true,
//       requiredMessage: "Amount is required",
//       min: 0,
//       minMessage: "Amount must be 0 or greater",
//     },
//     display_order: {
//       required: true,
//       requiredMessage: "Display order is required",
//       min: 1,
//       minMessage: "Display order must be 1 or greater",
//     },
//   };

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const submitData = {
//         label: formData.label.trim(),
//         amount: parseFloat(formData.amount) || 0,
//         display_order: parseInt(formData.display_order) || 1,
//         status: formData.status === "active" ? 1 : 0,
//       };

//       await salaryService.update(id, submitData);
//       showSuccess("Salary option updated successfully");
//       navigate('/salary');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update Salary option");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await salaryService.delete(id);
//       showSuccess("Salary option deleted successfully");
//       navigate('/salary');
//     } catch (error) {
//       console.error('Delete error:', error);
//       showError(error.message || "Failed to delete Salary option");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading Salary option data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Salary Option"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/salary"
//       breadcrumb={`Editing: ${editItem?.label || 'Salary Option'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditSalary;

// pages/EditSalary.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdAttachMoney,
  MdLabel,
  MdSort,
  MdFlag,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
  MdCurrencyRupee,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { salaryService } from "../../services/salary.service";
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

// ─── Format INR helper ──────────────────────────────────────────
const formatINR = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `₹${num.toLocaleString("en-IN")}`;
};

// ─── Main Component ─────────────────────────────────────────────
const EditSalary = () => {
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
    label: "",
    amount: "",
    display_order: 1,
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // ─── Fetch salary data ───────────────────────────────────────
  useEffect(() => {
    const fetchSalary = async () => {
      setFetchLoading(true);
      try {
        const response = await salaryService.getById(id);
        const data = response?.data || response;

        if (data && data.id) {
          setFormValues({
            label: data.label || "",
            amount: data.amount || 0,
            display_order: data.display_order || 1,
            status: data.status === 1 ? "active" : "inactive",
          });
          setEditItem(data);
        } else {
          showError("Salary option not found");
          navigate("/salary");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load Salary option data");
        navigate("/salary");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchSalary();
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

    if (!formValues.label?.trim()) {
      newErrors.label = "Label is required";
    } else if (formValues.label.trim().length < 2) {
      newErrors.label = "Label must be at least 2 characters";
    } else if (formValues.label.trim().length > 255) {
      newErrors.label = "Label must be at most 255 characters";
    }

    const amountNum = parseFloat(formValues.amount);
    if (
      formValues.amount === "" ||
      formValues.amount === null ||
      formValues.amount === undefined
    ) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amountNum)) {
      newErrors.amount = "Amount must be a valid number";
    } else if (amountNum < 0) {
      newErrors.amount = "Amount must be 0 or greater";
    }

    const orderNum = parseInt(formValues.display_order);
    if (
      formValues.display_order === "" ||
      formValues.display_order === null ||
      formValues.display_order === undefined
    ) {
      newErrors.display_order = "Display order is required";
    } else if (isNaN(orderNum)) {
      newErrors.display_order = "Display order must be a valid number";
    } else if (orderNum < 1) {
      newErrors.display_order = "Display order must be 1 or greater";
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
        label: formValues.label.trim(),
        amount: parseFloat(formValues.amount) || 0,
        display_order: parseInt(formValues.display_order) || 1,
        status: formValues.status === "active" ? 1 : 0,
      };

      await salaryService.update(id, submitData);
      showSuccess("Salary option updated successfully");
      navigate("/salary");
    } catch (error) {
      console.error("Submit error:", error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          "Failed to update Salary option"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await salaryService.delete(id);
      showSuccess("Salary option deleted successfully");
      setShowDeleteDialog(false);
      navigate("/salary");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this salary option because it is being used in other records."
        );
      } else {
        showError(message || "Failed to delete Salary option");
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
          <p className="text-sm text-slate-400">
            Loading Salary option data...
          </p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.label?.trim() || "Salary Option";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const amountDisplay = formatINR(formValues.amount);

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Label */}
              <div className="sm:col-span-2">
                <FieldLabel required>Salary Label</FieldLabel>
                <div className="relative">
                  <MdLabel
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="label"
                    value={formValues.label}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.label
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. ₹5 Lakh, ₹10 Lakh, ₹15 Lakh"
                  />
                </div>
                {errors.label ? (
                  <p className="text-xs text-red-500 mt-1">{errors.label}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Enter the salary range label.
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <FieldLabel required>Amount (in INR)</FieldLabel>
                <div className="relative">
                  <MdCurrencyRupee
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="amount"
                    value={formValues.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="10000"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.amount
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. 500000"
                  />
                </div>
                {errors.amount ? (
                  <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Formatted: <span className="font-semibold">{amountDisplay}</span>
                  </p>
                )}
              </div>

              {/* Display Order */}
              <div>
                <FieldLabel required>Display Order</FieldLabel>
                <div className="relative">
                  <MdSort
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="display_order"
                    value={formValues.display_order}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.display_order
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. 1"
                  />
                </div>
                {errors.display_order ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.display_order}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Lower numbers appear first in dropdown.
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
                Active salary options are visible in the dropdown.
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
              onClick={() => navigate("/salary")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Salary Options
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/salary")}
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
              {loading ? "Updating..." : "Update Salary Option"}
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
                  {initials || <MdAttachMoney size={24} />}
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
                  <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MdCurrencyRupee size={11} />
                    {amountDisplay}
                  </span>
                  <span className="text-xs text-white/70">ID: #{id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdLabel size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Label</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.label || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCurrencyRupee
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Amount
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {amountDisplay}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdSort size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Display Order
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.display_order || "—"}
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
                      layoutId="edit-salary-tab-underline"
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
              Delete Salary Option
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/salary")}
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
                {loading ? "Updating..." : "Update Salary Option"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/salary")}
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
        title="Delete Salary Option"
        message="Delete this salary option? This action cannot be undone."
      />
    </div>
  );
};

export default EditSalary;