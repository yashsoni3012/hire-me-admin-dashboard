// pages/Contact/ContactView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdPerson,
  MdEmail,
  MdPhone,
  MdSubject,
  MdMessage,
  MdAssignment,
  MdPriorityHigh,
  MdCheckCircle,
  MdAccessTime,
  MdPersonAdd,
  MdHistory,
  MdInfo,
} from 'react-icons/md';
import { contactService } from '../../services/contact.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  new: {
    pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dot: 'bg-blue-500',
    icon: MdInfo,
  },
  in_progress: {
    pill: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    dot: 'bg-yellow-500',
    icon: MdAccessTime,
  },
  resolved: {
    pill: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    dot: 'bg-green-500',
    icon: MdCheckCircle,
  },
  closed: {
    pill: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
    dot: 'bg-gray-500',
    icon: MdCancel,
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.new;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {status ? status.replace('_', ' ') : 'New'}
    </span>
  );
};

// ─── Priority styles ──────────────────────────────────────────
const PRIORITY_STYLES = {
  low: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  medium: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  high: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  urgent: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const PriorityBadge = ({ priority }) => {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      <MdPriorityHigh size={13} />
      {priority || 'Medium'}
    </span>
  );
};

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{children}</label>
);

const ReadOnlyValue = ({ children }) => (
  <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
    {children || '—'}
  </div>
);

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: MdInfo },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const ContactView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const loadContact = async () => {
    setLoading(true);
    try {
      const response = await contactService.getById(id);
      const data = response.data || response;
      setContact(data);
    } catch (error) {
      console.error('Load error:', error);
      showError(error.message || 'Failed to load contact');
      navigate('/contact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await contactService.updateStatus(id, newStatus);
      showSuccess(`Status updated to ${newStatus.replace('_', ' ')}`);
      loadContact();
    } catch (error) {
      showError(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async () => {
    setUpdating(true);
    try {
      await contactService.assign(id, 1);
      showSuccess('Assigned to admin successfully');
      loadContact();
    } catch (error) {
      showError(error.message || 'Failed to assign');
    } finally {
      setUpdating(false);
    }
  };

  const handleResolve = async () => {
    setUpdating(true);
    try {
      await contactService.resolve(id);
      showSuccess('Contact marked as resolved');
      loadContact();
    } catch (error) {
      showError(error.message || 'Failed to resolve');
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => navigate('/contact');

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading contact details...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
          <p className="text-slate-600 font-medium">Contact not found</p>
          <button
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MdArrowBack size={16} />
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  // ─── Compute hero data ────────────────────────────────────
  const fullName = contact.name || 'Unnamed Contact';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const status = contact.status || 'new';
  const priority = contact.priority || 'medium';
  const assignedTo = contact.assigned_to ? `Admin ${contact.assigned_to}` : 'Unassigned';
  const createdDate = contact.created_at ? formatDate(contact.created_at) : '—';

  // ─── Render tab content ──────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* ─── Action Buttons ────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-wrap items-center gap-3">
                {contact.status === 'new' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
                  >
                    {updating ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdAccessTime size={16} />
                    )}
                    Start Processing
                  </button>
                )}
                {contact.status === 'in_progress' && (
                  <button
                    type="button"
                    onClick={handleResolve}
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-emerald-600/20 transition-colors disabled:opacity-50"
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <MdPersonAdd size={16} />
                    Assign to Me
                  </button>
                )}
              </div>
            </div>

            {/* ─── Contact Information ──────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdPerson size={16} />
                  Contact Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <ReadOnlyValue>{contact.name}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <ReadOnlyValue>
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Mobile</FieldLabel>
                    <ReadOnlyValue>
                      <a href={`tel:${contact.mobile}`} className="hover:text-blue-600">
                        {contact.mobile}
                      </a>
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Subject</FieldLabel>
                    <ReadOnlyValue>{contact.subject}</ReadOnlyValue>
                  </div>
                </div>
                <div>
                  <FieldLabel>Message</FieldLabel>
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {contact.message}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Admin Remarks (view only) ────────────────────── */}
            {contact.admin_remarks && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MdMessage size={16} />
                    Admin Remarks
                  </h2>
                </div>
                <div className="p-6">
                  <div className="text-sm text-slate-700 whitespace-pre-wrap bg-purple-50 p-4 rounded-lg border border-purple-100">
                    {contact.admin_remarks}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdAccessTime size={16} />
                  Timeline
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>{contact.created_at ? formatDate(contact.created_at) : '—'}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated</FieldLabel>
                  <ReadOnlyValue>{contact.updated_at ? formatDate(contact.updated_at) : '—'}</ReadOnlyValue>
                </div>
                {contact.resolved_at && (
                  <div>
                    <FieldLabel>Resolved At</FieldLabel>
                    <div className="text-sm text-emerald-700 py-2 px-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                      <MdCheckCircle size={16} className="text-emerald-500" />
                      {formatDate(contact.resolved_at)}
                    </div>
                  </div>
                )}
                <div>
                  <FieldLabel>Status History</FieldLabel>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-slate-500">Current:</span>
                    <StatusPill status={status} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ──────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">Contact</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/contact/edit/${id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
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
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52">
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdPerson size={22} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {fullName}
                  </h1>
                  <StatusPill status={status} />
                  <PriorityBadge priority={priority} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdEmail size={12} /> {contact.email}
                  </span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdPhone size={12} /> {contact.mobile}
                  </span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdAssignment size={12} /> {assignedTo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdInfo size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {status.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPriorityHigh size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Priority</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">{priority}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPersonAdd size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Assigned To</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{assignedTo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAccessTime size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Created</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{createdDate}</p>
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
                    active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="contact-view-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
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
          onClick={handleBack}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Back to Contacts
        </button>
      </div>
    </div>
  );
};

export default ContactView;