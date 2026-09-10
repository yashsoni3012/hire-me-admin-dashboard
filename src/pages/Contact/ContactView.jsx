
// // pages/Contact/ContactView.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//     MdEdit,
//     MdArrowBack,
//     MdPerson,
//     MdEmail,
//     MdPhone,
//     MdSubject,
//     MdMessage,
//     MdAssignment,
//     MdPriorityHigh,
//     MdCheckCircle,
//     MdAccessTime,
//     MdPersonAdd,
// } from 'react-icons/md';
// import Button from '../../components/common/Button';
// import { contactService } from '../../services/contact.service';
// import { showSuccess, showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';

// const ContactView = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const [contact, setContact] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [updating, setUpdating] = useState(false);
//     const [remarks, setRemarks] = useState('');
//     const [showRemarksInput, setShowRemarksInput] = useState(false);

//     // Status badge colors
//     const statusColors = {
//         new: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
//         in_progress: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
//         resolved: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
//         closed: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
//     };

//     const priorityColors = {
//         low: 'bg-gray-100 text-gray-600',
//         medium: 'bg-blue-100 text-blue-600',
//         high: 'bg-orange-100 text-orange-600',
//         urgent: 'bg-red-100 text-red-600',
//     };

//     const loadContact = async () => {
//         setLoading(true);
//         try {
//             const response = await contactService.getById(id);
//             setContact(response.data || response);
//             setRemarks(response.data?.admin_remarks || '');
//         } catch (error) {
//             console.error('Load error:', error);
//             showError(error.message || 'Failed to load contact');
//             navigate('/contact');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadContact();
//     }, [id]);

//     const handleStatusChange = async (newStatus) => {
//         setUpdating(true);
//         try {
//             await contactService.updateStatus(id, newStatus);
//             showSuccess(`Status updated to ${newStatus.replace('_', ' ')}`);
//             loadContact();
//         } catch (error) {
//             showError(error.message || 'Failed to update status');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const handleAssign = async () => {
//         // For demo, assigning to current admin (ID: 1)
//         setUpdating(true);
//         try {
//             await contactService.assign(id, 1);
//             showSuccess('Assigned to admin successfully');
//             loadContact();
//         } catch (error) {
//             showError(error.message || 'Failed to assign');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const handleResolve = async () => {
//         setUpdating(true);
//         try {
//             await contactService.resolve(id);
//             showSuccess('Contact marked as resolved');
//             loadContact();
//         } catch (error) {
//             showError(error.message || 'Failed to resolve');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const handleAddRemarks = async () => {
//         if (!remarks.trim()) {
//             showError('Please enter remarks');
//             return;
//         }
//         setUpdating(true);
//         try {
//             await contactService.addRemarks(id, remarks);
//             showSuccess('Remarks added successfully');
//             setShowRemarksInput(false);
//             loadContact();
//         } catch (error) {
//             showError(error.message || 'Failed to add remarks');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="flex flex-col items-center gap-4">
//                     <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
//                     <p className="text-gray-500 text-sm">Loading...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!contact) {
//         return (
//             <div className="text-center py-12">
//                 <p className="text-gray-500">Contact not found</p>
//                 <Button
//                     variant="secondary"
//                     className="mt-4"
//                     onClick={() => navigate('/contact')}
//                 >
//                     Back to Contacts
//                 </Button>
//             </div>
//         );
//     }

//     const statusStyle = statusColors[contact.status] || statusColors.new;

//     return (
//         <div className="max-w-7xl px-4 py-6">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => navigate('/contact')}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                         <MdArrowBack size={20} />
//                     </button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
//                         <p className="text-sm text-gray-500">View and manage inquiry</p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="primary"
//                         icon={MdEdit}
//                         onClick={() => navigate(`/contact/edit/${id}`)}
//                     >
//                         Edit
//                     </Button>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="space-y-6">
//                 {/* Status & Priority Card */}
//                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
//                     <div className="flex flex-wrap items-center gap-6">
//                         <div className="flex items-center gap-3">
//                             <span className="text-sm font-medium text-gray-500">Status</span>
//                             <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
//                                 <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
//                                 {contact.status?.replace('_', ' ') || 'New'}
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <span className="text-sm font-medium text-gray-500">Priority</span>
//                             <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${priorityColors[contact.priority] || priorityColors.medium}`}>
//                                 {contact.priority || 'Medium'}
//                             </span>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <span className="text-sm font-medium text-gray-500">Assigned To</span>
//                             <span className="text-sm text-gray-700">
//                                 {contact.assigned_to ? `Admin ${contact.assigned_to}` : 'Unassigned'}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
//                     <div className="flex flex-wrap items-center gap-3">
//                         {contact.status === 'new' && (
//                             <Button
//                                 variant="primary"
//                                 size="sm"
//                                 onClick={() => handleStatusChange('in_progress')}
//                                 loading={updating}
//                             >
//                                 Start Processing
//                             </Button>
//                         )}
//                         {contact.status === 'in_progress' && (
//                             <Button
//                                 variant="success"
//                                 size="sm"
//                                 onClick={handleResolve}
//                                 loading={updating}
//                             >
//                                 <MdCheckCircle className="mr-2" size={16} />
//                                 Mark as Resolved
//                             </Button>
//                         )}
//                         {!contact.assigned_to && (
//                             <Button
//                                 variant="secondary"
//                                 size="sm"
//                                 onClick={handleAssign}
//                                 loading={updating}
//                             >
//                                 <MdPersonAdd className="mr-2" size={16} />
//                                 Assign to Me
//                             </Button>
//                         )}
//                         <Button
//                             variant="secondary"
//                             size="sm"
//                             onClick={() => setShowRemarksInput(!showRemarksInput)}
//                         >
//                             Add Remarks
//                         </Button>
//                     </div>

//                     {/* Remarks Input */}
//                     {showRemarksInput && (
//                         <div className="mt-4 pt-4 border-t border-gray-100">
//                             <textarea
//                                 value={remarks}
//                                 onChange={(e) => setRemarks(e.target.value)}
//                                 placeholder="Enter admin remarks..."
//                                 className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 border-gray-200"
//                                 rows={3}
//                             />
//                             <div className="flex items-center gap-2 mt-2">
//                                 <Button
//                                     size="sm"
//                                     onClick={handleAddRemarks}
//                                     loading={updating}
//                                 >
//                                     Save Remarks
//                                 </Button>
//                                 <Button
//                                     variant="secondary"
//                                     size="sm"
//                                     onClick={() => {
//                                         setShowRemarksInput(false);
//                                         setRemarks(contact.admin_remarks || '');
//                                     }}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Contact Details */}
//                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                     <div className="p-6 border-b border-gray-100">
//                         <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
//                     </div>
//                     <div className="p-6 space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</label>
//                                 <div className="flex items-center gap-2 mt-1 text-gray-800">
//                                     <MdPerson className="text-gray-400" size={18} />
//                                     <span>{contact.name}</span>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
//                                 <div className="flex items-center gap-2 mt-1 text-gray-800">
//                                     <MdEmail className="text-gray-400" size={18} />
//                                     <a href={`mailto:${contact.email}`} className="text-purple-600 hover:underline">
//                                         {contact.email}
//                                     </a>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mobile</label>
//                                 <div className="flex items-center gap-2 mt-1 text-gray-800">
//                                     <MdPhone className="text-gray-400" size={18} />
//                                     <a href={`tel:${contact.mobile}`} className="hover:text-purple-600">
//                                         {contact.mobile}
//                                     </a>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</label>
//                                 <div className="flex items-center gap-2 mt-1 text-gray-800">
//                                     <MdSubject className="text-gray-400" size={18} />
//                                     <span>{contact.subject}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div>
//                             <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</label>
//                             <div className="mt-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
//                                 <p className="text-gray-700 text-sm whitespace-pre-wrap">{contact.message}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Admin Remarks */}
//                 {contact.admin_remarks && (
//                     <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                         <div className="p-6 border-b border-gray-100">
//                             <h2 className="text-lg font-semibold text-gray-900">Admin Remarks</h2>
//                         </div>
//                         <div className="p-6">
//                             <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
//                                 <p className="text-gray-700 text-sm whitespace-pre-wrap">{contact.admin_remarks}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Timestamps */}
//                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Created At</label>
//                             <div className="flex items-center gap-2 mt-1 text-gray-700">
//                                 <MdAccessTime className="text-gray-400" size={16} />
//                                 <span>{formatDate(contact.created_at)}</span>
//                             </div>
//                         </div>
//                         <div>
//                             <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Updated At</label>
//                             <div className="flex items-center gap-2 mt-1 text-gray-700">
//                                 <MdAccessTime className="text-gray-400" size={16} />
//                                 <span>{formatDate(contact.updated_at)}</span>
//                             </div>
//                         </div>
//                         {contact.resolved_at && (
//                             <div>
//                                 <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resolved At</label>
//                                 <div className="flex items-center gap-2 mt-1 text-green-700">
//                                     <MdCheckCircle className="text-green-500" size={16} />
//                                     <span>{formatDate(contact.resolved_at)}</span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactView;

// pages/Contact/ContactView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdEdit,
  MdPerson,
  MdEmail,
  MdPhone,
  MdSubject,
  MdMessage,
  MdAssignment,
  MdPriorityHigh,
  MdCheckCircle,
  MdErrorOutline,
  MdAccessTime,
  MdPersonAdd,
  MdFlag,
  MdInfoOutline,
  MdAdd,
  MdSend,
  MdClose,
} from "react-icons/md";
import { contactService } from "../../services/contact.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";

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
    icon: MdAssignment,
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

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdInfoOutline },
  { id: "actions", label: "Actions", icon: MdFlag },
  { id: "metadata", label: "Metadata", icon: MdAccessTime },
];

// ─── Main Component ─────────────────────────────────────────────
const ContactView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [showRemarksInput, setShowRemarksInput] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Load contact ────────────────────────────────────────────
  const loadContact = async () => {
    setLoading(true);
    try {
      const response = await contactService.getById(id);
      const data = response.data || response;
      setContact(data);
      setRemarks(data?.admin_remarks || "");
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load contact");
      navigate("/contact");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ─── Handlers ────────────────────────────────────────────────
  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await contactService.updateStatus(id, newStatus);
      showSuccess(`Status updated to ${newStatus.replace("_", " ")}`);
      loadContact();
    } catch (error) {
      showError(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async () => {
    setUpdating(true);
    try {
      await contactService.assign(id, 1);
      showSuccess("Assigned to admin successfully");
      loadContact();
    } catch (error) {
      showError(error.message || "Failed to assign");
    } finally {
      setUpdating(false);
    }
  };

  const handleResolve = async () => {
    setUpdating(true);
    try {
      await contactService.resolve(id);
      showSuccess("Contact marked as resolved");
      loadContact();
    } catch (error) {
      showError(error.message || "Failed to resolve");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddRemarks = async () => {
    if (!remarks.trim()) {
      showError("Please enter remarks");
      return;
    }
    setUpdating(true);
    try {
      await contactService.addRemarks(id, remarks);
      showSuccess("Remarks added successfully");
      setShowRemarksInput(false);
      loadContact();
    } catch (error) {
      showError(error.message || "Failed to add remarks");
    } finally {
      setUpdating(false);
    }
  };

  // ─── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading contact details...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center">
          <p className="text-slate-500">Contact not found</p>
          <button
            onClick={() => navigate("/contact")}
            className="mt-3 text-purple-600 hover:underline text-sm font-medium"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = contact.name?.trim() || "Contact Inquiry";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const statusLabel = contact.status
    ? contact.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "New";

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <FieldLabel>Name</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={contact.name || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <FieldLabel>Email</FieldLabel>
                <div className="relative">
                  <MdEmail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={contact.email || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <FieldLabel>Mobile</FieldLabel>
                <div className="relative">
                  <MdPhone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={contact.mobile || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <FieldLabel>Subject</FieldLabel>
                <div className="relative">
                  <MdSubject
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={contact.subject || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <FieldLabel>Message</FieldLabel>
                <div className="relative">
                  <MdMessage
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />
                  <textarea
                    value={contact.message || ""}
                    disabled
                    rows={4}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "actions":
        return (
          <div className="space-y-6 max-w-2xl">
            {/* Status / Priority / Assigned summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel>Status</FieldLabel>
                <div className="pt-1.5">
                  <StatusPill status={contact.status} />
                </div>
              </div>
              <div>
                <FieldLabel>Priority</FieldLabel>
                <div className="pt-1.5">
                  <PriorityPill priority={contact.priority} />
                </div>
              </div>
              <div>
                <FieldLabel>Assigned To</FieldLabel>
                <div className="pt-1.5 text-sm text-slate-700">
                  {contact.assigned_to
                    ? `Admin ${contact.assigned_to}`
                    : "Unassigned"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100">
              <FieldLabel>Available Actions</FieldLabel>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {contact.status === "new" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("in_progress")}
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
                  >
                    {updating ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdAssignment size={16} />
                    )}
                    Start Processing
                  </button>
                )}

                {contact.status === "in_progress" && (
                  <button
                    type="button"
                    onClick={handleResolve}
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-emerald-600/20 transition-colors disabled:opacity-50"
                  >
                    {updating ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdCheckCircle size={16} />
                    )}
                    Mark as Resolved
                  </button>
                )}

                {!contact.assigned_to && (
                  <button
                    type="button"
                    onClick={handleAssign}
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updating ? (
                      <span className="w-3.5 h-3.5 border-2 border-slate-400/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdPersonAdd size={16} />
                    )}
                    Assign to Me
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowRemarksInput((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                  {showRemarksInput ? (
                    <>
                      <MdClose size={16} />
                      Close Remarks
                    </>
                  ) : (
                    <>
                      <MdAdd size={16} />
                      Add Remarks
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Remarks Input */}
            <AnimatePresence initial={false}>
              {showRemarksInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-slate-100">
                    <FieldLabel>Admin Remarks</FieldLabel>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter admin remarks..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-y bg-white"
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={handleAddRemarks}
                        disabled={updating}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-purple-600/20 transition-colors disabled:opacity-50"
                      >
                        {updating ? (
                          <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <MdSend size={16} />
                        )}
                        Save Remarks
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowRemarksInput(false);
                          setRemarks(contact.admin_remarks || "");
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                      >
                        <MdClose size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current Admin Remarks */}
            {contact.admin_remarks && (
              <div className="pt-4 border-t border-slate-100">
                <FieldLabel>Current Admin Remarks</FieldLabel>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mt-1">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {contact.admin_remarks}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case "metadata":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Created At</FieldLabel>
                <div className="relative">
                  <MdAccessTime
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      contact.created_at ? formatDate(contact.created_at) : "—"
                    }
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated At</FieldLabel>
                <div className="relative">
                  <MdAccessTime
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      contact.updated_at ? formatDate(contact.updated_at) : "—"
                    }
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {contact.resolved_at && (
                <div>
                  <FieldLabel>Resolved At</FieldLabel>
                  <div className="relative">
                    <MdCheckCircle
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formatDate(contact.resolved_at)}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
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
              onClick={() => navigate("/contact")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">Contact</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {contact.subject || "Contact Details"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdArrowBack size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={() => navigate(`/contact/edit/${id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-purple-600/20 transition-colors"
            >
              <MdEdit size={16} />
              Edit
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
                  <StatusPill status={contact.status} />
                  <PriorityPill priority={contact.priority} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">{contact.email}</span>
                  {contact.mobile && (
                    <span className="text-xs text-white/70">
                      • {contact.mobile}
                    </span>
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
                {statusLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPriorityHigh
              size={16}
              className="text-slate-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Priority
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {contact.priority || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPersonAdd size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Assigned To
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {contact.assigned_to
                  ? `Admin ${contact.assigned_to}`
                  : "Unassigned"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAccessTime size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Created
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {contact.created_at ? formatDate(contact.created_at) : "—"}
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
                      ? "text-purple-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="contact-view-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-purple-600 rounded-full"
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

        {/* Mobile-only back button */}
        <button
          type="button"
          onClick={() => navigate("/contact")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdArrowBack size={16} />
          Back to Contacts
        </button>
      </div>
    </div>
  );
};

export default ContactView;