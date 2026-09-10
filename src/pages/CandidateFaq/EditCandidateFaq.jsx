// // pages/EditCandidateFaq.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { candidateFaqService } from '../../services/candidateFaq.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditCandidateFaq = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   useEffect(() => {
//     const fetchFaq = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await candidateFaqService.getById(id);
//         const data = response?.data || response;
        
//         if (data && data.id) {
//           const formData = {
//             question: data.question || "",
//             answer: data.answer || "",
//             order: data.order || 0,
//             is_trending: data.is_trending || false,
//             status: data.is_status ? "active" : "inactive",
//           };
//           setInitialData(formData);
//           setEditItem(data);
//           console.log('✅ Form data loaded:', formData);
//         } else {
//           showError("FAQ not found");
//           navigate('/candidate-faq');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load FAQ data");
//         navigate('/candidate-faq');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchFaq();
//     }
//   }, [id, navigate]);

//   const fields = [
//     {
//       name: "question",
//       label: "Question",
//       type: "text",
//       required: true,
//       placeholder: "e.g. How do I create a profile?",
//       help: "Enter the frequently asked question",
//     },
//     {
//       name: "answer",
//       label: "Answer",
//       type: "textarea",
//       required: true,
//       placeholder: "Write the answer here...",
//       help: "Enter the detailed answer",
//       rows: 4,
//     },
//     {
//       name: "order",
//       label: "Display Order",
//       type: "number",
//       required: true,
//       placeholder: "e.g. 1",
//       help: "Lower numbers appear first",
//       min: 0,
//     },
//     {
//       name: "is_trending",
//       label: "Mark as Trending",
//       type: "checkbox",
//       help: "Check to mark this FAQ as trending",
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
//     question: {
//       required: true,
//       requiredMessage: "Question is required",
//       minLength: 5,
//       minLengthMessage: "Question must be at least 5 characters",
//       maxLength: 255,
//       maxLengthMessage: "Question must be at most 255 characters",
//     },
//     answer: {
//       required: true,
//       requiredMessage: "Answer is required",
//       minLength: 10,
//       minLengthMessage: "Answer must be at least 10 characters",
//     },
//     order: {
//       required: true,
//       requiredMessage: "Order is required",
//       min: 0,
//       minMessage: "Order must be 0 or greater",
//     },
//   };

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const submitData = {
//         question: formData.question.trim(),
//         answer: formData.answer.trim(),
//         order: parseInt(formData.order) || 0,
//         is_trending: formData.is_trending || false,
//         is_status: formData.status === "active",
//       };

//       await candidateFaqService.update(id, submitData);
//       showSuccess("FAQ updated successfully");
//       navigate('/candidate-faq');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update FAQ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await candidateFaqService.delete(id);
//       showSuccess("FAQ deleted successfully");
//       navigate('/candidate-faq');
//     } catch (error) {
//       console.error('Delete error:', error);
//       showError(error.message || "Failed to delete FAQ");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading FAQ data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Candidate FAQ"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/candidate-faq"
//       breadcrumb={`Editing: ${editItem?.question || 'FAQ'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditCandidateFaq;

// pages/EditCandidateFaq.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdHelpOutline,
  MdQuestionAnswer,
  MdFormatListNumbered,
  MdFlag,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { candidateFaqService } from "../../services/candidateFaq.service";
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
      {status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Unknown"}
    </span>
  );
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdQuestionAnswer },
  { id: "status", label: "Status & Flags", icon: MdFlag },
];

// ─── Main Component ──────────────────────────────────────────────
const EditCandidateFaq = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Form state ────────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    question: "",
    answer: "",
    order: 0,
    is_trending: false,
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // ─── Fetch FAQ data ────────────────────────────────────────────
  useEffect(() => {
    const fetchFaq = async () => {
      setFetchLoading(true);
      try {
        const response = await candidateFaqService.getById(id);
        const data = response?.data || response;

        if (data && data.id) {
          setFormValues({
            question: data.question || "",
            answer: data.answer || "",
            order: data.order || 0,
            is_trending: data.is_trending || false,
            status: data.is_status ? "active" : "inactive",
          });
          setEditItem(data);
        } else {
          showError("FAQ not found");
          navigate("/candidate-faq");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load FAQ data");
        navigate("/candidate-faq");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchFaq();
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

  // ─── Validation ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.question?.trim()) {
      newErrors.question = "Question is required";
    } else if (formValues.question.trim().length < 5) {
      newErrors.question = "Question must be at least 5 characters";
    } else if (formValues.question.trim().length > 255) {
      newErrors.question = "Question must be at most 255 characters";
    }

    if (!formValues.answer?.trim()) {
      newErrors.answer = "Answer is required";
    } else if (formValues.answer.trim().length < 10) {
      newErrors.answer = "Answer must be at least 10 characters";
    }

    if (formValues.order === "" || formValues.order === null) {
      newErrors.order = "Order is required";
    } else {
      const orderNum = parseInt(formValues.order);
      if (isNaN(orderNum) || orderNum < 0) {
        newErrors.order = "Order must be 0 or greater";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.question || newErrors.answer || newErrors.order) {
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
        question: formValues.question.trim(),
        answer: formValues.answer.trim(),
        order: parseInt(formValues.order) || 0,
        is_trending: formValues.is_trending || false,
        is_status: formValues.status === "active",
      };

      await candidateFaqService.update(id, submitData);
      showSuccess("FAQ updated successfully");
      navigate("/candidate-faq");
    } catch (error) {
      console.error("Submit error:", error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          "Failed to update FAQ"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await candidateFaqService.delete(id);
      showSuccess("FAQ deleted successfully");
      setShowDeleteDialog(false);
      navigate("/candidate-faq");
    } catch (error) {
      console.error("Delete error:", error);
      showError(error.message || "Failed to delete FAQ");
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
          <p className="text-sm text-slate-400">Loading FAQ data...</p>
        </div>
      </div>
    );
  }

  if (!editItem) {
    return null;
  }

  // ─── Hero helpers ──────────────────────────────────────────────
  const heroQuestion = formValues.question?.trim() || "Candidate FAQ";
  const initials = "FAQ";

  // ─── Render tab content ────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel required>Question</FieldLabel>
                <div className="relative">
                  <MdHelpOutline
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="question"
                    value={formValues.question}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.question
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. How do I create a profile?"
                  />
                </div>
                {errors.question ? (
                  <p className="text-xs text-red-500 mt-1">{errors.question}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Enter the frequently asked question.
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <FieldLabel required>Answer</FieldLabel>
                <textarea
                  name="answer"
                  value={formValues.answer}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all resize-y bg-white ${
                    errors.answer
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                  placeholder="Write the answer here..."
                />
                {errors.answer ? (
                  <p className="text-xs text-red-500 mt-1">{errors.answer}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Enter the detailed answer.
                  </p>
                )}
              </div>

              <div>
                <FieldLabel required>Display Order</FieldLabel>
                <div className="relative">
                  <MdFormatListNumbered
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="order"
                    value={formValues.order}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.order
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="e.g. 1"
                  />
                </div>
                {errors.order ? (
                  <p className="text-xs text-red-500 mt-1">{errors.order}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Lower numbers appear first.
                  </p>
                )}
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
                Active FAQs are visible on the public site.
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
                Trending FAQs are highlighted in the listing.
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
              onClick={() => navigate("/candidate-faq")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Candidate FAQ
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroQuestion}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/candidate-faq")}
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
              {loading ? "Updating..." : "Update FAQ"}
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
                  {initials}
                </div>
              </div>

              {/* Question + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold text-white truncate max-w-full">
                    {heroQuestion}
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
                  <span className="text-xs text-white/70">ID: #{id}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">
                    Order: {formValues.order}
                  </span>
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
            <MdFormatListNumbered
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Order</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.order}
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
            <MdInfoOutline
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Answer Length
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.answer?.length || 0} chars
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
                      layoutId="edit-candidate-faq-tab-underline"
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
              Delete FAQ
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/candidate-faq")}
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
                {loading ? "Updating..." : "Update FAQ"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/candidate-faq")}
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
        title="Delete Candidate FAQ"
        message="Delete this FAQ? This action cannot be undone."
      />
    </div>
  );
};

export default EditCandidateFaq;