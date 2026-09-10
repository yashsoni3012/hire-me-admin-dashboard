// pages/Contact/ContactEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdPerson,
  MdEmail,
  MdPhone,
  MdSubject,
  MdMessage,
  MdPriorityHigh,
  MdAssignment,
  MdLock,
  MdPersonAdd,
  MdRefresh,
  MdCheckCircle,
  MdErrorOutline,
  MdFlag,
  MdInfoOutline,
} from "react-icons/md";
import { contactService } from "../../services/contact.service";
import userService from "../../services/user.service";
import { showSuccess, showError } from "../../utils/toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

// ─── Status pill ────────────────────────────────────────────────
const STATUS_STYLES = {
  new: {
    pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    icon: MdInfoOutline,
  },
  in_progress: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: MdRefresh,
  },
  resolved: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  closed: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    icon: MdErrorOutline,
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.new;
  const Icon = style.icon;
  const label = status
    ? status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Unknown";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {label}
    </span>
  );
};

// ─── Priority pill ──────────────────────────────────────────────
const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  medium: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  high: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  urgent: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const PriorityPill = ({ priority }) => {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  const label = priority
    ? priority.charAt(0).toUpperCase() + priority.slice(1)
    : "Medium";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      <MdPriorityHigh size={13} />
      {label}
    </span>
  );
};

// ─── Main Component ──────────────────────────────────────────────
const ContactEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
    status: "new",
    priority: "medium",
    assigned_to: null,
    admin_remarks: "",
  });

  const [errors, setErrors] = useState({});

  // ─── Load contact ──────────────────────────────────────────────
  const loadContact = async () => {
    setLoading(true);
    try {
      const response = await contactService.getById(id);
      const data = response.data || response;
      setFormData({
        name: data.name || "",
        email: data.email || "",
        mobile: data.mobile || "",
        subject: data.subject || "",
        message: data.message || "",
        status: data.status || "new",
        priority: data.priority || "medium",
        assigned_to: data.assigned_to || null,
        admin_remarks: data.admin_remarks || "",
      });
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load contact");
      navigate("/contact");
    } finally {
      setLoading(false);
    }
  };

  // ─── Load users ────────────────────────────────────────────────
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await userService.getAll({ limit: 100 });
      let userList = [];
      if (response.data?.data) {
        userList = response.data.data;
      } else if (response.data) {
        userList = response.data;
      } else if (Array.isArray(response)) {
        userList = response;
      }
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (error) {
      console.error("Load users error:", error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadContact();
    loadUsers();
  }, [id]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only admin fields are editable
    const adminFields = ["status", "priority", "assigned_to", "admin_remarks"];
    if (!adminFields.includes(name)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const updateData = {
        status: formData.status,
        priority: formData.priority,
        assigned_to: formData.assigned_to || null,
        admin_remarks: formData.admin_remarks || "",
      };
      await contactService.update(id, updateData);
      showSuccess("Contact updated successfully");
      navigate("/contact");
    } catch (error) {
      console.error("Update error:", error);
      showError(error.message || "Failed to update contact");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await contactService.delete(id);
      showSuccess("Contact deleted successfully");
      navigate("/contact");
    } catch (error) {
      console.error("Delete error:", error);
      showError(error.message || "Failed to delete contact");
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // ─── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading contact...</p>
        </div>
      </div>
    );
  }

  // ─── Hero helpers ──────────────────────────────────────────────
  const heroName = formData.name?.trim() || "Contact Inquiry";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  // ─── Status & priority options ────────────────────────────────
  const statusOptions = [
    { value: "new", label: "New" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // ─── Main render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/contact")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">Contact</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {formData.subject || "Edit Inquiry"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdCancel size={16} />
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-purple-600/20 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdSave size={16} />
              )}
              {saving ? "Updating..." : "Update Contact"}
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
         <div className="relative h-44 sm:h-52 bg-gradient-to-r from-[#0d1731] via-[#172858] to-[#263d82]">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/20">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdPerson size={24} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  <StatusPill status={formData.status} />
                  <PriorityPill priority={formData.priority} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">{formData.email}</span>
                  {formData.mobile && (
                    <span className="text-xs text-white/70">• {formData.mobile}</span>
                  )}
                  <span className="text-xs text-white/50">ID: #{id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAssignment size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formData.status?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPriorityHigh size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Priority</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {formData.priority || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPersonAdd size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Assigned To</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formData.assigned_to
                  ? users.find((u) => (u.id || u._id) === formData.assigned_to)
                      ?.name ||
                    users.find((u) => (u.id || u._id) === formData.assigned_to)
                      ?.email ||
                    "User"
                  : "Unassigned"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdLock size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Admin Remarks</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formData.admin_remarks ? "Yes" : "None"}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Form ───────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-5 sm:p-7 space-y-8">
              {/* Section: User Information (Read-Only) */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MdPerson className="text-purple-500" size={18} />
                  <h3 className="text-sm font-semibold text-slate-700">
                    User Information
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    Read-Only
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <div className="relative">
                      <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={formData.name}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <div className="relative">
                      <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Mobile</FieldLabel>
                    <div className="relative">
                      <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={formData.mobile}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Subject</FieldLabel>
                    <div className="relative">
                      <MdSubject className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={formData.subject}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel>Message</FieldLabel>
                    <div className="relative">
                      <MdMessage className="absolute left-3 top-3 text-slate-400" size={18} />
                      <textarea
                        value={formData.message}
                        disabled
                        rows={4}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600 cursor-not-allowed resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* Section: Admin Management (Editable) */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MdFlag className="text-purple-500" size={18} />
                  <h3 className="text-sm font-semibold text-slate-700">
                    Admin Management
                  </h3>
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                    Editable
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel required>Status</FieldLabel>
                    <div className="relative">
                      <MdAssignment className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                          errors.status
                            ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        } bg-white`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.status && (
                      <p className="text-xs text-red-500 mt-1">{errors.status}</p>
                    )}
                  </div>

                  <div>
                    <FieldLabel required>Priority</FieldLabel>
                    <div className="relative">
                      <MdPriorityHigh className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                          errors.priority
                            ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        } bg-white`}
                      >
                        {priorityOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.priority && (
                      <p className="text-xs text-red-500 mt-1">{errors.priority}</p>
                    )}
                  </div>

                  <div>
                    <FieldLabel>Assign To</FieldLabel>
                    <div className="relative">
                      <MdPersonAdd className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        name="assigned_to"
                        value={formData.assigned_to || ""}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none bg-white"
                      >
                        <option value="">Unassigned</option>
                        {loadingUsers ? (
                          <option value="" disabled>Loading users...</option>
                        ) : (
                          users.map((user) => (
                            <option
                              key={user.id || user._id}
                              value={user.id || user._id}
                            >
                              {user.name || user.username || user.email || `User ${user.id || user._id}`}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    {users.length === 0 && !loadingUsers && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MdRefresh size={12} className="inline" />
                        No users available. Click refresh to reload.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>Admin Remarks</FieldLabel>
                    <textarea
                      name="admin_remarks"
                      value={formData.admin_remarks}
                      onChange={handleChange}
                      placeholder="Internal admin notes..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-y bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Actions ────────────────────────────────────────── */}
            <div className="px-5 sm:px-7 py-4 bg-slate-50/50 border-t border-slate-200 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdDelete size={16} />
                  Delete
                </button>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                  >
                    <MdCancel size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-purple-600/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
                  >
                    {saving ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdSave size={16} />
                    )}
                    {saving ? "Updating..." : "Update Contact"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/contact")}
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
        title="Delete Contact"
        message="Delete this contact inquiry? This action cannot be undone."
      />
    </div>
  );
};

export default ContactEdit;