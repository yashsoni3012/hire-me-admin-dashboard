import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdEdit,
  MdCheckCircle,
  MdVerified,
  MdLanguage,
  MdCategory,
  MdGroups,
  MdReceiptLong,
  MdDescription,
  MdImage,
  MdHistory,
  MdApartment,
  MdPerson,
  MdCreditCard,
  MdPermIdentity,
  MdOpenInNew,
  MdWhatshot,
  MdErrorOutline,
  MdPauseCircle,
  MdBlock,
  MdPayments,
  MdWork,
  MdSearch,
  MdLocationOn,
  MdOutlineFilterList,
  MdInbox,
  MdAccessTime,
  MdAttachMoney,
  MdSchool,
  MdStar,
  MdBusinessCenter,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
  MdLock,
} from "react-icons/md";
import companyService from "../../services/company.service";
import { showError, showSuccess } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

const JOBS_PER_PAGE = 10;

// ─── Helpers ────────────────────────────────────────────────────
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path}`;
};

const isImageFile = (path) => {
  if (!path) return false;
  const exts = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
    ".avif",
  ];
  return exts.some((ext) => path.toLowerCase().endsWith(ext));
};

const getFileName = (path) => {
  if (!path) return "Document";
  return path.split("/").pop() || "Document";
};

const parseApiDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  if (typeof dateString === "string" && dateString.includes("T")) {
    const d = new Date(dateString);
    if (!isNaN(d)) return d;
  }
  const match = dateString.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i,
  );
  if (match) {
    let [_, day, month, year, hours, minutes, seconds, ampm] = match;
    hours = parseInt(hours);
    if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hours,
      parseInt(minutes),
      parseInt(seconds),
    );
  }
  const d = new Date(dateString);
  return !isNaN(d) ? d : null;
};

const formatSalary = (min, max, type) => {
  if (!min && !max) return "—";
  const format = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "—";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num}`;
  };
  const suffix = type === "annual" ? "/yr" : type === "monthly" ? "/mo" : "";
  if (min && max) return `${format(min)} - ${format(max)}${suffix}`;
  return `${format(min || max)}${suffix}`;
};

// ─── Status styles ──────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  pending: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: MdPauseCircle,
  },
  blocked: {
    pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
    icon: MdBlock,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    icon: MdErrorOutline,
  },
};

const GENERIC_STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  open: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  live: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  published: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  trial: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  draft: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  paused: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  expired: "bg-red-50 text-red-700 ring-1 ring-red-200",
  cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
  closed: "bg-red-50 text-red-700 ring-1 ring-red-200",
  blocked: "bg-red-50 text-red-700 ring-1 ring-red-200",
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

const GenericStatusPill = ({ status }) => {
  const key = (status || "").toLowerCase();
  const style =
    GENERIC_STATUS_STYLES[key] ||
    "bg-slate-100 text-slate-500 ring-1 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${style}`}
    >
      {status || "Unknown"}
    </span>
  );
};

// ─── Completion ring ────────────────────────────────────────────
const CompletionRing = ({ percentage = 0, size = 60, strokeWidth = 5 }) => {
  const clamped = Math.min(100, Math.max(0, Number(percentage) || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
      title={`Profile ${clamped}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-white/25"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className="stroke-emerald-400"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold text-white">{clamped}%</span>
      </div>
    </div>
  );
};

// ─── Shared pieces ──────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
  </label>
);

const ReadOnlyValue = ({ children }) => (
  <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
    {children || "—"}
  </div>
);

const RichTextViewer = ({ value }) => {
  const [editorMode, setEditorMode] = useState("text");
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100 px-2 py-1.5">
        {["text", "html"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setEditorMode(mode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              editorMode === mode
                ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {mode === "text" ? "Text" : "HTML"}
          </button>
        ))}
      </div>
      {editorMode === "text" ? (
        <div className="p-4 max-w-2xl">
          {value ? (
            <div
              className="prose prose-sm max-w-none text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </div>
      ) : (
        <pre className="whitespace-pre-wrap break-words p-4 font-mono text-xs text-slate-700 bg-slate-950/5 min-h-[120px]">
          {value || ""}
        </pre>
      )}
    </div>
  );
};

const SectionLoading = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-slate-400">{label}</p>
  </div>
);

const SectionEmpty = ({ icon: Icon = MdInbox, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-1">
      <Icon size={22} className="text-slate-400" />
    </div>
    <p className="text-sm font-semibold text-slate-600">{title}</p>
    {subtitle && <p className="text-xs text-slate-400 max-w-sm">{subtitle}</p>}
  </div>
);

const SectionError = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
      <MdErrorOutline size={22} className="text-red-400" />
    </div>
    <p className="text-sm font-semibold text-slate-600">
      Couldn't load this section
    </p>
    <p className="text-xs text-slate-400 max-w-sm">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
      >
        Try again
      </button>
    )}
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-2 text-sm">
    <span className="text-slate-400 flex-shrink-0">{label}</span>
    <span className="text-slate-700 font-medium text-right truncate">
      {value ?? "—"}
    </span>
  </div>
);

const QuickStat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5">
    <Icon size={16} className="text-slate-400 flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-[10px] text-slate-500 leading-tight">{label}</p>
      <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
    </div>
  </div>
);

const MiniStat = ({ label, value, color, bg }) => (
  <div className={`rounded-lg ${bg} px-3 py-2 text-center`}>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
    <p className="text-[10px] text-slate-500">{label}</p>
  </div>
);

const IndexBadge = ({ index }) => (
  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0 ring-1 ring-slate-200">
    {index}
  </div>
);

// ─── Pagination ─────────────────────────────────────────────────
const Pagination = ({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  loading,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i += 1) pages.push(i);
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-2 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{start}</span>
        {" – "}
        <span className="font-semibold text-slate-700">{end}</span>
        {" of "}
        <span className="font-semibold text-slate-700">{total}</span> jobs
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <MdChevronLeft size={16} />
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            disabled={loading}
            className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed ${
              p === currentPage
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <MdChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── Tabs ────────────────────────────────────────────────────────
const TOP_TABS = [
  { id: "profile", label: "Profile", icon: MdApartment },
  { id: "subscription", label: "Subscription History", icon: MdPayments },
  { id: "jobs", label: "Jobs", icon: MdWork },
  { id: "search-history", label: "Search History", icon: MdSearch },
];

const PROFILE_SUB_TABS = [
  { id: "overview", label: "Overview", icon: MdApartment },
  { id: "relations", label: "Relations", icon: MdCategory },
  { id: "documents", label: "Documents", icon: MdDescription },
  { id: "media", label: "Media", icon: MdImage },
  { id: "activity", label: "Activity", icon: MdHistory },
];

// ─── Subscription History Section ───────────────────────────────
const SubscriptionHistorySection = ({ state, onRetry }) => {
  const { loading, error, items } = state;
  const [expandedId, setExpandedId] = useState(null);

  if (loading)
    return <SectionLoading label="Loading subscription history..." />;
  if (error) return <SectionError message={error} onRetry={onRetry} />;
  if (!items.length)
    return (
      <SectionEmpty
        icon={MdPayments}
        title="No subscription history"
        subtitle="This company hasn't purchased or activated any subscription plan yet."
      />
    );

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-4">
      {items.map((sub, idx) => {
        const planName =
          sub.SubscriptionPlan?.plan_name || sub.plan_name || "—";
        const companyName =
          sub.Company?.company_name || sub.company_name || "—";
        const status = sub.subscription_status || "—";
        const type = sub.subscription_type || "—";
        const startDate = sub.start_date;
        const expiryDate = sub.expiry_date;
        const isTrial = sub.is_trial;
        const autoRenew = sub.auto_renew;
        const cancelReason = sub.cancel_reason;
        const cancelledAt = sub.cancelled_at;
        const createdAt = sub.created_at;
        const updatedAt = sub.updated_at;
        const isStatus = sub.is_status;
        const createdBy = sub.created_by;
        const updatedBy = sub.updated_by;
        const previousPlan = sub.PreviousSubscriptionPlan?.plan_name || null;
        const nextPlan = sub.NextSubscriptionPlan?.plan_name || null;
        const isExpanded = expandedId === (sub.id || idx);

        return (
          <div
            key={sub.id || idx}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggleExpand(sub.id || idx)}
              className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-slate-50/60 transition-colors"
            >
              <IndexBadge index={idx + 1} />
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MdPayments size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Plan
                  </p>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {planName}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Company
                  </p>
                  <p className="text-sm text-slate-700 truncate">
                    {companyName}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Type
                  </p>
                  <p className="text-sm text-slate-700">{type}</p>
                </div>
                <div className="min-w-0 flex items-center gap-2">
                  <GenericStatusPill status={status} />
                  {isTrial && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                      Trial
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end flex-shrink-0">
                <p className="text-[11px] text-slate-400">Start</p>
                <p className="text-xs font-medium text-slate-700">
                  {startDate ? formatDate(parseApiDate(startDate)) : "—"}
                </p>
              </div>
              <div className="hidden md:flex flex-col items-end flex-shrink-0">
                <p className="text-[11px] text-slate-400">Expiry</p>
                <p className="text-xs font-medium text-slate-700">
                  {expiryDate ? formatDate(parseApiDate(expiryDate)) : "—"}
                </p>
              </div>
              <MdOpenInNew
                size={16}
                className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-100"
                >
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Subscription
                      </h4>
                      <div className="space-y-2">
                        <DetailRow label="ID" value={sub.id} />
                        <DetailRow label="Type" value={type} />
                        <DetailRow
                          label="Status"
                          value={<GenericStatusPill status={status} />}
                        />
                        <DetailRow
                          label="Trial"
                          value={isTrial ? "Yes" : "No"}
                        />
                        <DetailRow
                          label="Auto Renew"
                          value={autoRenew ? "Enabled" : "Disabled"}
                        />
                        <DetailRow
                          label="Active"
                          value={isStatus ? "Yes" : "No"}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Plan & Company
                      </h4>
                      <div className="space-y-2">
                        <DetailRow label="Current Plan" value={planName} />
                        <DetailRow
                          label="Previous Plan"
                          value={previousPlan || "—"}
                        />
                        <DetailRow label="Next Plan" value={nextPlan || "—"} />
                        <DetailRow label="Company" value={companyName} />
                        <DetailRow
                          label="Company User ID"
                          value={sub.Company?.company_user_id}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Dates & Audit
                      </h4>
                      <div className="space-y-2">
                        <DetailRow
                          label="Start Date"
                          value={
                            startDate
                              ? formatDate(parseApiDate(startDate))
                              : "—"
                          }
                        />
                        <DetailRow
                          label="Expiry Date"
                          value={
                            expiryDate
                              ? formatDate(parseApiDate(expiryDate))
                              : "—"
                          }
                        />
                        <DetailRow
                          label="Created At"
                          value={
                            createdAt
                              ? formatDate(parseApiDate(createdAt))
                              : "—"
                          }
                        />
                        <DetailRow
                          label="Updated At"
                          value={
                            updatedAt
                              ? formatDate(parseApiDate(updatedAt))
                              : "—"
                          }
                        />
                        <DetailRow label="Created By" value={createdBy} />
                        <DetailRow label="Updated By" value={updatedBy} />
                      </div>
                    </div>
                  </div>
                  {(cancelReason || cancelledAt) && (
                    <div className="px-5 pb-5">
                      <div className="rounded-lg bg-red-50/60 border border-red-100 p-3.5">
                        <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
                          Cancellation
                        </h4>
                        <div className="space-y-1.5">
                          {cancelReason && (
                            <p className="text-sm text-slate-700">
                              <span className="font-medium text-slate-500">
                                Reason:
                              </span>{" "}
                              {cancelReason}
                            </p>
                          )}
                          {cancelledAt && (
                            <p className="text-sm text-slate-700">
                              <span className="font-medium text-slate-500">
                                Cancelled At:
                              </span>{" "}
                              {formatDate(parseApiDate(cancelledAt))}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

// ─── Jobs Section ───────────────────────────────────────────────
const JobsSection = ({
  state,
  pagination,
  onPageChange,
  onRetry,
  onViewJob,
}) => {
  const { loading, error, items } = state;
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const startIndex =
    ((pagination?.page || 1) - 1) * (pagination?.limit || JOBS_PER_PAGE);

  return (
    <div>
      {loading ? (
        <SectionLoading label="Loading jobs..." />
      ) : error ? (
        <SectionError message={error} onRetry={onRetry} />
      ) : !items.length ? (
        <SectionEmpty
          icon={MdWork}
          title="No jobs posted yet"
          subtitle="Jobs posted by this company will show up here."
        />
      ) : (
        <div className="space-y-4">
          {items.map((job, idx) => {
            const title = job.title || "Untitled role";
            const status = job.job_status || "—";
            const companyName = job.Company?.company_name || "—";
            const salary = formatSalary(
              job.salary_min,
              job.salary_max,
              job.salary_type,
            );
            const experience =
              job.experience_min && job.experience_max
                ? `${job.experience_min}-${job.experience_max} yrs`
                : job.experience_min
                  ? `${job.experience_min}+ yrs`
                  : "—";
            const jobType = job.posting_type || "—";
            const isTrending = job.is_trending;
            const publishedAt = job.published_at || job.created_at;
            const expiryDate = job.expiry_date;
            const viewCount = job.view_count || 0;
            const applicationCount = job.application_count || 0;
            const shortlistedCount = job.shortlisted_count || 0;
            const interviewCount = job.interview_count || 0;
            const selectedCount = job.selected_count || 0;
            const rejectedCount = job.rejected_count || 0;

            const skills =
              job.JobSkills?.map((s) => s.Skill?.skill_name).filter(Boolean) ||
              [];
            const locations =
              job.JobLocations?.map(
                (l) => l.location_name || l.Location?.location_name,
              ).filter(Boolean) || [];
            const perks =
              job.JobPerkBenefits?.map((p) => p.PerksBenefit?.name).filter(
                Boolean,
              ) || [];
            const industries =
              job.JobIndustries?.map((i) => i.SubIndustry?.name).filter(
                Boolean,
              ) || [];
            const functionsRoles =
              job.JobFunctionsRoles?.map((f) => f.FunctionRole?.name).filter(
                Boolean,
              ) || [];
            const educations =
              job.JobEducations?.map(
                (e) => e.EducationSubCategory?.name,
              ).filter(Boolean) || [];

            const isExpanded = expandedId === (job.id || idx);
            const displayIndex = startIndex + idx + 1;

            return (
              <div
                key={job.id || idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(job.id || idx)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-slate-50/60 transition-colors"
                >
                  <IndexBadge index={displayIndex} />
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MdWork size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1">
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Job Title
                      </p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {title}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Company
                      </p>
                      <p className="text-sm text-slate-700 truncate">
                        {companyName}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Salary
                      </p>
                      <p className="text-sm text-slate-700 truncate">
                        {salary}
                      </p>
                    </div>
                    <div className="min-w-0 flex items-center gap-2">
                      <GenericStatusPill status={status} />
                      {isTrending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700 ring-1 ring-orange-200">
                          <MdWhatshot size={10} />
                          Trending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-end flex-shrink-0">
                    <p className="text-[11px] text-slate-400">Exp.</p>
                    <p className="text-xs font-medium text-slate-700">
                      {experience}
                    </p>
                  </div>
                  <div className="hidden md:flex flex-col items-end flex-shrink-0">
                    <p className="text-[11px] text-slate-400">Posted</p>
                    <p className="text-xs font-medium text-slate-700">
                      {publishedAt
                        ? formatDate(parseApiDate(publishedAt))
                        : "—"}
                    </p>
                  </div>
                  <MdOpenInNew
                    size={16}
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100"
                    >
                      <div className="p-5 space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <QuickStat
                            icon={MdAttachMoney}
                            label="Salary"
                            value={salary}
                          />
                          <QuickStat
                            icon={MdAccessTime}
                            label="Experience"
                            value={experience}
                          />
                          <QuickStat
                            icon={MdBusinessCenter}
                            label="Job Type"
                            value={jobType}
                          />
                          <QuickStat
                            icon={MdVisibility}
                            label="Views"
                            value={viewCount}
                          />
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Application Stats
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <MiniStat
                              label="Total"
                              value={applicationCount}
                              color="text-blue-600"
                              bg="bg-blue-50"
                            />
                            <MiniStat
                              label="Shortlisted"
                              value={shortlistedCount}
                              color="text-amber-600"
                              bg="bg-amber-50"
                            />
                            <MiniStat
                              label="Interview"
                              value={interviewCount}
                              color="text-purple-600"
                              bg="bg-purple-50"
                            />
                            <MiniStat
                              label="Selected"
                              value={selectedCount}
                              color="text-emerald-600"
                              bg="bg-emerald-50"
                            />
                            <MiniStat
                              label="Rejected"
                              value={rejectedCount}
                              color="text-red-600"
                              bg="bg-red-50"
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Job Description
                          </h4>
                          <RichTextViewer value={job.job_description || ""} />
                        </div>

                        {skills.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-medium ring-1 ring-indigo-200"
                                >
                                  <MdStar size={11} />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {locations.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                              Locations
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {locations.map((loc, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium"
                                >
                                  <MdLocationOn size={11} />
                                  {loc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {perks.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                              Perks & Benefits
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {perks.map((perk, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium ring-1 ring-emerald-200"
                                >
                                  <MdCheckCircle size={11} />
                                  {perk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {educations.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                Education
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {educations.map((edu, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium"
                                  >
                                    <MdSchool size={11} />
                                    {edu}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {industries.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                Industry
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {industries.map((ind, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium"
                                  >
                                    {ind}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {functionsRoles.length > 0 && (
                            <div className="sm:col-span-2">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                Function / Role
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {functionsRoles.map((fn, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-medium ring-1 ring-purple-200"
                                  >
                                    <MdBusinessCenter size={11} />
                                    {fn}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                          <DetailRow
                            label="Published"
                            value={
                              publishedAt
                                ? formatDate(parseApiDate(publishedAt))
                                : "—"
                            }
                          />
                          <DetailRow
                            label="Expires"
                            value={
                              expiryDate
                                ? formatDate(parseApiDate(expiryDate))
                                : "—"
                            }
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => onViewJob?.(job.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
                          >
                            <MdOpenInNew size={16} />
                            View Full Job
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && items.length > 0 && pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={onPageChange}
          loading={loading}
        />
      )}
    </div>
  );
};

// ─── Search History Section (list only) ─────────────────────────
const SearchHistorySection = ({ state, onRetry }) => {
  const { loading, error, items } = state;

  if (loading) return <SectionLoading label="Loading search history..." />;
  if (error) return <SectionError message={error} onRetry={onRetry} />;
  if (!items.length)
    return (
      <SectionEmpty
        icon={MdSearch}
        title="No search history"
        subtitle="Search keywords used for this company will appear here."
      />
    );

  return (
    <div className="space-y-2">
      {items.map((entry, idx) => {
        const keyword = entry.search_keyword || "—";
        const resultCount = entry.result_count;
        const searchedAt = entry.created_at;
        const searchType = entry.search_type;

        return (
          <div
            key={entry.id || idx}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50/60 transition-colors"
          >
            <IndexBadge index={idx + 1} />

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MdSearch size={16} className="text-blue-600" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {keyword}
              </p>
              {searchType && (
                <p className="text-[11px] text-slate-400 mt-0.5 truncate capitalize">
                  {searchType}
                </p>
              )}
            </div>

            <span className="text-[11px] text-slate-400 flex-shrink-0">
              {searchedAt ? formatDate(parseApiDate(searchedAt)) : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────
const ViewCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNameCache, setUserNameCache] = useState({});
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [activeProfileTab, setActiveProfileTab] = useState("overview");

  const [subscriptionState, setSubscriptionState] = useState({
    loading: false,
    loaded: false,
    items: [],
    error: null,
  });

  const [jobsState, setJobsState] = useState({
    loading: false,
    loaded: false,
    items: [],
    error: null,
  });
  const [jobsPagination, setJobsPagination] = useState({
    page: 1,
    limit: JOBS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });

  const [searchHistoryState, setSearchHistoryState] = useState({
    loading: false,
    loaded: false,
    items: [],
    error: null,
  });

  // ─── Is this company approved? (drives tab visibility) ─────────
  const isApproved = viewData?.company_status === "active";

  // ─── Load users ──────────────────────────────────────────────
  const loadUsers = async () => {
    try {
      const users = await fetchUsers();
      setUserNameCache(users);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId]?.name || `User ${userId}`;
  };

  const getCreatedByName = (row) =>
    !row ? "-" : row.created_by ? getUserNameCached(row.created_by) : "-";
  const getUpdatedByName = (row) =>
    !row ? "-" : row.updated_by ? getUserNameCached(row.updated_by) : "-";

  // ─── Approve / status ────────────────────────────────────────
  const handleCompanyStatusChange = async (id, newStatus) => {
    const prevData = viewData;
    setViewData({ ...viewData, company_status: newStatus });
    setInitialData({ ...initialData, company_status: newStatus });
    setStatusUpdatingId(id);

    try {
      await companyService.update(id, {
        company_status: newStatus,
        updated_by: viewData?.updated_by || 1,
      });
      showSuccess(
        newStatus === "active"
          ? "Company approved successfully"
          : "Company approval removed",
      );
      const response = await companyService.getById(id);
      const data = response?.data || response;
      if (data) {
        setViewData(data);
        setInitialData((prev) => ({
          ...prev,
          company_status: data.company_status || newStatus,
        }));
      }
    } catch (err) {
      setViewData(prevData);
      setInitialData((prev) => ({
        ...prev,
        company_status: prevData?.company_status || prev?.company_status,
      }));
      showError(err.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleToggleApprove = () => {
    if (!viewData?.id) return;
    const nextStatus =
      viewData.company_status === "active" ? "pending" : "active";
    handleCompanyStatusChange(viewData.id, nextStatus);
  };

  // ─── Fetch company ───────────────────────────────────────────
  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        await loadUsers();
        const response = await companyService.getById(id);
        const data = response?.data || response;

        if (data) {
          const createdAt = data.created_at
            ? parseApiDate(data.created_at)
            : null;
          const updatedAt = data.updated_at
            ? parseApiDate(data.updated_at)
            : null;

          const formData = {
            id: data.id || "",
            company_name: data.company_name || "",
            profile_type: data.profile_type || "company",
            slug: data.slug || "",
            website: Array.isArray(data.website)
              ? data.website.join(", ")
              : data.website || "",
            founded_year: data.founded_year || "",
            about_company: data.about_company || "",
            gst_number: data.gst_number || "",
            company_user_email:
              data.CompanyUser?.company_user_email ||
              data.CompanyUser?.email ||
              data.company_user_email ||
              "-",
            company_user_id:
              data.company_user_id || data.CompanyUser?.company_user_id || "-",
            industry_name:
              data.Industries?.[0]?.industry_name ||
              data.Industry?.industry_name ||
              data.industry_name ||
              "-",
            industry_id:
              data.industry_id ||
              data.Industries?.[0]?.industry_id ||
              data.Industry?.industry_id ||
              "-",
            company_size_name:
              data.CompanySize?.company_size_name ||
              data.company_size_name ||
              "-",
            logo: data.logo || null,
            banner_image: data.banner_image || null,
            company_status: data.company_status || "inactive",
            is_trending: data.is_trending || false,
            profile_completion: data.profile_completion ?? 0,
            profile_completion_percentage:
              data.profile_completion_percentage ??
              data.profile_completion ??
              0,
            last_completion_calculated_at:
              data.last_completion_calculated_at || null,
            company_register_document_type:
              data.company_register_document_type || "-",
            company_register_document: data.company_register_document || null,
            company_pan_card: data.company_pan_card || "-",
            company_pan_card_image: data.company_pan_card_image || null,
            owner_adharcard: data.owner_adharcard || "-",
            owner_adharcard_image: data.owner_adharcard_image || null,
            industries: data.Industries || [],
            subIndustries: data.SubIndustries || [],
            created_by: data.created_by || null,
            updated_by: data.updated_by || null,
            created_at: createdAt,
            updated_at: updatedAt,
          };

          setInitialData(formData);
          setViewData(data);
        } else {
          showError("Company not found");
          navigate("/companies");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load company data");
        navigate("/companies");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id, navigate]);

  // ─── Fetch subscription history ──────────────────────────────
  const fetchSubscriptionHistory = async () => {
    setSubscriptionState((s) => ({ ...s, loading: true, error: null }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/company-subscriptions?company_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      const data = json.data || json || [];
      setSubscriptionState({
        loading: false,
        loaded: true,
        items: Array.isArray(data) ? data : [],
        error: null,
      });
    } catch (err) {
      console.error("Subscription history fetch error:", err);
      setSubscriptionState({
        loading: false,
        loaded: true,
        items: [],
        error: err.message || "Failed to load subscription history",
      });
    }
  };

  // ─── Fetch jobs (paginated) ──────────────────────────────────
  const fetchJobs = async (page = 1) => {
    setJobsState((s) => ({ ...s, loading: true, error: null }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/jobs?company_id=${id}&page=${page}&limit=${JOBS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const json = await res.json();
      const data = json.data || json || [];
      const pag = json.pagination || {};

      setJobsState({
        loading: false,
        loaded: true,
        items: Array.isArray(data) ? data : [],
        error: null,
      });

      setJobsPagination({
        page: pag.page || page,
        limit: pag.limit || JOBS_PER_PAGE,
        total: pag.total || data.length,
        totalPages: pag.totalPages || 1,
      });
    } catch (err) {
      console.error("Jobs fetch error:", err);
      setJobsState({
        loading: false,
        loaded: true,
        items: [],
        error: err.message || "Failed to load jobs",
      });
    }
  };

  const handleJobsPageChange = (newPage) => {
    if (newPage < 1 || newPage > jobsPagination.totalPages) return;
    if (newPage === jobsPagination.page) return;
    setJobsPagination((p) => ({ ...p, page: newPage }));
    fetchJobs(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Fetch candidate-search-logs ─────────────────────────────
  const fetchSearchHistory = async () => {
    setSearchHistoryState((s) => ({ ...s, loading: true, error: null }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/candidate-search-logs?company_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      const data = json.data || json || [];
      setSearchHistoryState({
        loading: false,
        loaded: true,
        items: Array.isArray(data) ? data : [],
        error: null,
      });
    } catch (err) {
      console.error("Search history fetch error:", err);
      setSearchHistoryState({
        loading: false,
        loaded: true,
        items: [],
        error: err.message || "Failed to load search history",
      });
    }
  };

  // Lazy-load data for whichever top-level tab is active (only relevant once approved)
  useEffect(() => {
    if (!id || !isApproved) return;
    if (activeTab === "subscription" && !subscriptionState.loaded) {
      fetchSubscriptionHistory();
    }
    if (activeTab === "jobs" && !jobsState.loaded) {
      fetchJobs(1);
    }
    if (activeTab === "search-history" && !searchHistoryState.loaded) {
      fetchSearchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, id, isApproved]);

  // ─── Gate: force Profile tab whenever the company isn't approved ─
  // Runs on mount, on status changes (Approve/un-approve), and whenever
  // activeTab changes, so a non-Profile tab can never stay selected
  // for a company that isn't active.
  useEffect(() => {
    if (!isApproved && activeTab !== "profile") {
      setActiveTab("profile");
    }
  }, [isApproved, activeTab]);

  const handleEdit = () => navigate(`/companies/edit/${id}`);
  const handleViewJob = (jobId) => {
    if (!jobId) return;
    navigate(`/jobs/view/${jobId}`);
  };

  // ─── Render helpers ──────────────────────────────────────────
  const renderDocPreview = (path, alt, size = "w-28 h-20") => {
    if (!path)
      return (
        <div
          className={`${size} rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400`}
        >
          No image
        </div>
      );
    const fullUrl = getImageUrl(path);
    const fileName = getFileName(path);
    const isImage = isImageFile(path);
    return (
      <div className={`relative group ${size} flex-shrink-0`}>
        {isImage ? (
          <img
            src={fullUrl}
            alt={alt}
            className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-2">
            <MdDescription size={24} className="text-slate-400" />
            <span className="text-[10px] text-slate-500 text-center truncate w-full mt-1">
              {fileName}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => window.open(fullUrl, "_blank")}
          className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <span className="text-white text-xs font-medium flex items-center gap-1">
            <MdOpenInNew size={13} /> {isImage ? "View" : "Open"}
          </span>
        </button>
      </div>
    );
  };

  const renderImage = (
    path,
    alt,
    className = "w-24 h-24 object-cover rounded-lg",
  ) => {
    if (!path) return <span className="text-gray-400">No image</span>;
    const fullUrl = getImageUrl(path);
    const isImage = isImageFile(path);
    const fileName = getFileName(path);
    if (!isImage) {
      return (
        <div className="relative group inline-block">
          <div
            className={`${className} border border-gray-200 shadow-sm bg-slate-50 flex flex-col items-center justify-center p-4`}
          >
            <MdDescription size={32} className="text-slate-400" />
            <span className="text-xs text-slate-500 text-center truncate w-full mt-2">
              {fileName}
            </span>
          </div>
          <button
            onClick={() => window.open(fullUrl, "_blank")}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
            title="Open document"
          >
            <span className="text-xs flex items-center gap-1">
              <MdOpenInNew size={14} /> Open
            </span>
          </button>
        </div>
      );
    }
    return (
      <div className="relative group inline-block">
        <img
          src={fullUrl}
          alt={alt}
          className={`${className} border border-gray-200 shadow-sm`}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <button
          onClick={() => window.open(fullUrl, "_blank")}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
          title="View full image"
        >
          <span className="text-xs">View</span>
        </button>
      </div>
    );
  };

  // ─── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!initialData || !viewData) return null;

  const completionPct =
    parseInt(initialData.profile_completion_percentage) || 0;
  const heroName = initialData.company_name?.trim() || "Unnamed Company";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const approved = viewData.company_status === "active";
  const isTogglingThisCompany = statusUpdatingId === viewData?.id;

  // Only show Profile tab until the company is approved; unlock the rest once active
  const visibleTopTabs = approved
    ? TOP_TABS
    : TOP_TABS.filter((tab) => tab.id === "profile");

  // ─── Main render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/companies")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Companies
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleToggleApprove}
              disabled={isTogglingThisCompany}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                approved
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {approved ? (
                <MdVerified size={18} />
              ) : (
                <MdCheckCircle size={18} />
              )}
              {isTogglingThisCompany
                ? "Updating..."
                : approved
                  ? "Approved"
                  : "Approve"}
            </button>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
            >
              <MdEdit size={18} />
              Edit Company
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52">
            {initialData.banner_image ? (
              <img
                src={getImageUrl(initialData.banner_image)}
                alt="Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
                {initialData.logo ? (
                  <img
                    src={getImageUrl(initialData.logo)}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdApartment size={22} />}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  {initialData.is_trending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdWhatshot size={12} />
                      Trending
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <StatusPill status={initialData.company_status} />
                  <span className="text-xs text-white/70 capitalize">
                    {initialData.profile_type || "company"}
                  </span>
                  {initialData.website && (
                    <a
                      href={
                        initialData.website.startsWith("http")
                          ? initialData.website
                          : `https://${initialData.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
                    >
                      <MdLanguage size={13} />
                      Website
                      <MdOpenInNew size={11} />
                    </a>
                  )}
                </div>
              </div>

              <div className="hidden sm:block">
                <CompletionRing percentage={completionPct} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Approval hint banner — only while not yet approved */}
        {!approved && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <MdLock size={16} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Subscription History, Jobs</span>{" "}
              and <span className="font-semibold">Search History</span> unlock
              automatically once you approve this company.
            </p>
          </div>
        )}

        {/* Top-level Tabs */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex w-full border-b border-slate-200 bg-slate-50/60">
            {visibleTopTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}

                  {active && (
                    <motion.span
                      layoutId="view-company-top-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
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
                {/* Profile */}
                {activeTab === "profile" && (
                  <div>
                    <div className="flex overflow-x-auto gap-1 border-b border-slate-200 mb-6 -mt-1">
                      {PROFILE_SUB_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeProfileTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveProfileTab(tab.id)}
                            className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors ${
                              active
                                ? "text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            <Icon size={15} />
                            {tab.label}
                            {active && (
                              <motion.span
                                layoutId="view-company-profile-sub-tab-underline"
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

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProfileTab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        {/* Overview */}
                        {activeProfileTab === "overview" && (
                          <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div className="sm:col-span-2">
                                <FieldLabel>Company name</FieldLabel>
                                <ReadOnlyValue>
                                  {initialData.company_name}
                                </ReadOnlyValue>
                              </div>
                              <div>
                                <FieldLabel>Slug</FieldLabel>
                                <ReadOnlyValue>
                                  {initialData.slug || "—"}
                                </ReadOnlyValue>
                              </div>
                              <div>
                                <FieldLabel>Website</FieldLabel>
                                <ReadOnlyValue>
                                  {initialData.website ? (
                                    <a
                                      href={initialData.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {initialData.website}
                                    </a>
                                  ) : (
                                    "—"
                                  )}
                                </ReadOnlyValue>
                              </div>
                              <div>
                                <FieldLabel>Founded year</FieldLabel>
                                <ReadOnlyValue>
                                  {initialData.founded_year || "—"}
                                </ReadOnlyValue>
                              </div>
                              <div>
                                <FieldLabel>GST number</FieldLabel>
                                <ReadOnlyValue>
                                  {initialData.gst_number || "—"}
                                </ReadOnlyValue>
                              </div>
                            </div>

                            <div>
                              <FieldLabel>About company</FieldLabel>
                              <RichTextViewer
                                value={initialData.about_company || ""}
                              />
                            </div>

                            <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div>
                                <FieldLabel>Company status</FieldLabel>
                                <StatusPill
                                  status={initialData.company_status}
                                />
                              </div>
                              <div>
                                <FieldLabel>Trending</FieldLabel>
                                <div className="flex items-center gap-3 pt-1.5">
                                  <span className="text-sm text-slate-600">
                                    {initialData.is_trending
                                      ? "Shown in trending companies"
                                      : "Not marked as trending"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Relations */}
                        {activeProfileTab === "relations" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="sm:col-span-2">
                              <FieldLabel>Company user</FieldLabel>
                              <div className="flex items-center gap-2.5 text-sm text-slate-700 py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
                                <MdPerson
                                  size={16}
                                  className="text-slate-400"
                                />
                                {initialData.company_user_email || "—"}
                                <span className="ml-auto text-[11px] text-slate-400">
                                  Read-only
                                </span>
                              </div>
                            </div>
                            <div>
                              <FieldLabel>Industry</FieldLabel>
                              <ReadOnlyValue>
                                {initialData.industry_name}
                              </ReadOnlyValue>
                            </div>
                            <div>
                              <FieldLabel>Sub-industries</FieldLabel>
                              <ReadOnlyValue>
                                {Array.isArray(initialData.subIndustries) &&
                                initialData.subIndustries.length > 0
                                  ? initialData.subIndustries
                                      .map(
                                        (sub) =>
                                          sub.sub_industry_name || sub.name,
                                      )
                                      .join(", ")
                                  : "—"}
                              </ReadOnlyValue>
                            </div>
                            <div>
                              <FieldLabel>Company size</FieldLabel>
                              <ReadOnlyValue>
                                {initialData.company_size_name}
                              </ReadOnlyValue>
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        {activeProfileTab === "documents" && (
                          <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
                              <div className="flex-1">
                                <FieldLabel>
                                  Registration document type
                                </FieldLabel>
                                <ReadOnlyValue>
                                  {initialData.company_register_document_type}
                                </ReadOnlyValue>
                              </div>
                              <div className="flex-1">
                                <FieldLabel>Registration document</FieldLabel>
                                <div className="mt-1">
                                  {initialData.company_register_document ? (
                                    renderImage(
                                      initialData.company_register_document,
                                      "Registration Document",
                                      "w-32 h-24 object-cover rounded-lg",
                                    )
                                  ) : (
                                    <span className="text-gray-400">
                                      No document
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
                              <div className="flex-1">
                                <FieldLabel>GST Number</FieldLabel>
                                <div className="flex items-center gap-2 text-sm text-slate-700 py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
                                  <MdReceiptLong
                                    size={16}
                                    className="text-slate-400"
                                  />
                                  {initialData.gst_number || "—"}
                                </div>
                              </div>
                              <div className="flex-1" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-slate-100">
                              <div className="flex-1">
                                <FieldLabel>PAN card number</FieldLabel>
                                <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                                  <MdCreditCard
                                    size={16}
                                    className="text-slate-400"
                                  />
                                  {initialData.company_pan_card || "—"}
                                </div>
                              </div>
                              <div>
                                <FieldLabel>PAN card image</FieldLabel>
                                {renderDocPreview(
                                  initialData.company_pan_card_image,
                                  "PAN card",
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                              <div className="flex-1">
                                <FieldLabel>Owner Aadhar number</FieldLabel>
                                <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                                  <MdPermIdentity
                                    size={16}
                                    className="text-slate-400"
                                  />
                                  {initialData.owner_adharcard || "—"}
                                </div>
                              </div>
                              <div>
                                <FieldLabel>Owner Aadhar image</FieldLabel>
                                {renderDocPreview(
                                  initialData.owner_adharcard_image,
                                  "Aadhar card",
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Media */}
                        {activeProfileTab === "media" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <FieldLabel>Logo</FieldLabel>
                              <div className="mt-1">
                                {renderImage(
                                  initialData.logo,
                                  "Logo",
                                  "w-28 h-28 object-cover rounded-lg",
                                )}
                              </div>
                            </div>
                            <div>
                              <FieldLabel>Banner image</FieldLabel>
                              <div className="mt-1">
                                {renderImage(
                                  initialData.banner_image,
                                  "Banner",
                                  "w-full sm:w-64 h-28 object-cover rounded-lg",
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Activity */}
                        {activeProfileTab === "activity" && (
                          <div className="space-y-6">
                            <div>
                              <FieldLabel>Profile completion</FieldLabel>
                              <div className="flex items-center gap-4 mb-1">
                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPct}%` }}
                                    transition={{
                                      duration: 0.8,
                                      ease: "easeOut",
                                    }}
                                    className={`h-full rounded-full ${
                                      completionPct === 100
                                        ? "bg-emerald-500"
                                        : completionPct >= 50
                                          ? "bg-blue-500"
                                          : "bg-amber-500"
                                    }`}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                                  {completionPct}%
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">
                                Score: {initialData.profile_completion}/100 ·
                                Last calculated{" "}
                                {initialData.last_completion_calculated_at
                                  ? formatDate(
                                      parseApiDate(
                                        initialData.last_completion_calculated_at,
                                      ),
                                    )
                                  : "—"}
                              </p>
                            </div>

                            <div className="border-t border-slate-100 pt-5">
                              <div className="relative pl-6">
                                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
                                <div className="relative pb-6">
                                  <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                                  <p className="text-sm font-semibold text-slate-700">
                                    Created
                                  </p>
                                  <p className="text-sm text-slate-500 mt-0.5">
                                    {getCreatedByName(viewData)}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {initialData.created_at
                                      ? formatDate(initialData.created_at)
                                      : "—"}
                                  </p>
                                </div>
                                <div className="relative">
                                  <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                                  <p className="text-sm font-semibold text-slate-700">
                                    Last updated
                                  </p>
                                  <p className="text-sm text-slate-500 mt-0.5">
                                    {getUpdatedByName(viewData)}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {initialData.updated_at
                                      ? formatDate(initialData.updated_at)
                                      : "—"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                {/* Subscription History */}
                {activeTab === "subscription" && approved && (
                  <SubscriptionHistorySection
                    state={subscriptionState}
                    onRetry={fetchSubscriptionHistory}
                  />
                )}

                {/* Jobs */}
                {activeTab === "jobs" && approved && (
                  <JobsSection
                    state={jobsState}
                    pagination={jobsPagination}
                    onPageChange={handleJobsPageChange}
                    onRetry={() => fetchJobs(jobsPagination.page)}
                    onViewJob={handleViewJob}
                  />
                )}

                {/* Search History */}
                {activeTab === "search-history" && approved && (
                  <SearchHistorySection
                    state={searchHistoryState}
                    onRetry={fetchSearchHistory}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCompany;
