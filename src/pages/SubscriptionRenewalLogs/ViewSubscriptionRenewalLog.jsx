// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import subscriptionRenewalLogService from "../../services/subscriptionRenewalLog.service";
// import companyService from "../../services/company.service";
// import { showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { getUserName, fetchUsers } from "../../utils/getUserName";

// const ViewSubscriptionRenewalLog = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // Fetch renewal log data
//   useEffect(() => {
//     const fetchRenewalLog = async () => {
//       setLoading(true);
//       try {
//         // Fetch users for name mapping
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((id) => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);

//         // Fetch renewal log by ID
//         const response = await subscriptionRenewalLogService.getById(id);
//         const data = response?.data || response;

//         console.log("📥 Fetched renewal log data:", data);

//         if (data) {
//           // ─── Extract company name from nested object ──────────────────
//           let companyName = "-";
//           if (data.companySubscription?.Company?.company_name) {
//             companyName = data.companySubscription.Company.company_name;
//           } else if (data.company_name) {
//             companyName = data.company_name;
//           }

//           // ─── Extract plan names from nested object ──────────────────
//           let oldPlanName = data.old_plan || "-";
//           let newPlanName = data.new_plan || "-";

//           // If old_plan/new_plan are objects with plan_name
//           if (data.old_plan && typeof data.old_plan === "object") {
//             oldPlanName = data.old_plan.plan_name || "-";
//           }
//           if (data.new_plan && typeof data.new_plan === "object") {
//             newPlanName = data.new_plan.plan_name || "-";
//           }

//           // ─── Build form data ──────────────────────────────────────────
//           const formData = {
//             company_name: companyName,
//             renewal_type: data.renewal_type || "-",
//             old_plan: oldPlanName,
//             new_plan: newPlanName,
//             old_expiry: data.old_expiry || null,
//             new_expiry: data.new_expiry || null,
//             amount: data.amount || "0.00",
//             status:
//               data.status === true || data.status === 1 ? "active" : "inactive",
//             created_by: data.created_by || "-",
//             updated_by: data.updated_by || "-",
//             created_at: data.created_at || null,
//             updated_at: data.updated_at || null,
//           };

//           console.log("📋 Form data:", formData);
//           setInitialData(formData);
//           setViewData(data);
//         } else {
//           showError("Renewal log not found");
//           navigate("/subscription-renewal-logs");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load renewal log data");
//         navigate("/subscription-renewal-logs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchRenewalLog();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/subscription-renewal-logs/edit/${id}`);
//   };

//   // Form fields configuration - view only
//   const fields = [
//     {
//       name: "company_name",
//       label: "Company",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "renewal_type",
//       label: "Renewal Type",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const colorMap = {
//           upgrade: "bg-blue-100 text-blue-700",
//           downgrade: "bg-orange-100 text-orange-700",
//           renew: "bg-green-100 text-green-700",
//           extension: "bg-purple-100 text-purple-700",
//           cancel: "bg-red-100 text-red-700",
//         };
//         const displayNames = {
//           upgrade: "Upgrade",
//           downgrade: "Downgrade",
//           renew: "Renew",
//           extension: "Extension",
//           cancel: "Cancel",
//         };
//         const type = value?.toLowerCase() || "";
//         return (
//           <span
//             className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}
//           >
//             {displayNames[type] || value || "-"}
//           </span>
//         );
//       },
//     },
//     {
//       name: "old_plan",
//       label: "Old Plan",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <span className="text-gray-600">{value}</span>,
//     },
//     {
//       name: "new_plan",
//       label: "New Plan",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-[#2c0eee]">{value}</span>
//       ),
//     },
//     {
//       name: "plan_change",
//       label: "Plan Change",
//       type: "text",
//       readonly: true,
//       viewRender: (_, formData) => (
//         <div className="flex items-center gap-3">
//           <span className="text-gray-600">{formData?.old_plan || "-"}</span>
//           <span className="text-gray-400">→</span>
//           <span className="font-medium text-[#2c0eee]">
//             {formData?.new_plan || "-"}
//           </span>
//         </div>
//       ),
//     },
//     {
//       name: "amount",
//       label: "Amount",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-semibold text-gray-900 text-lg">
//           ₹{parseFloat(value || 0).toFixed(2)}
//         </span>
//       ),
//     },
//     {
//       name: "expiry_change",
//       label: "Expiry Change",
//       type: "text",
//       readonly: true,
//       viewRender: (_, formData) => (
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <span className="text-gray-500 text-sm">
//               Old: {formatDate(formData?.old_expiry)}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-gray-400 text-sm">↓</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-[#2c0eee] text-sm font-medium">
//               New: {formatDate(formData?.new_expiry)}
//             </span>
//           </div>
//         </div>
//       ),
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span
//           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//             value === "active"
//               ? "bg-green-50 text-green-700"
//               : "bg-gray-100 text-gray-500"
//           }`}
//         >
//           <span
//             className={`w-1.5 h-1.5 rounded-full ${value === "active" ? "bg-green-500" : "bg-gray-400"}`}
//           />
//           {value === "active" ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//     {
//       name: "created_by",
//       label: "Created By",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const name = getUserNameCached(value);
//         return <span className="text-gray-600">{name}</span>;
//       },
//     },
//     {
//       name: "updated_by",
//       label: "Updated By",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const name = getUserNameCached(value);
//         return <span className="text-gray-600">{name}</span>;
//       },
//     },
//     {
//       name: "created_at",
//       label: "Created At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (value ? formatDate(value) : "—"),
//     },
//     {
//       name: "updated_at",
//       label: "Updated At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (value ? formatDate(value) : "—"),
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">
//             Loading renewal log details...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Renewal Log Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/subscription-renewal-logs"
//       breadcrumb={`Viewing: ${viewData?.renewal_type || "Renewal Log"}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Log"
//       cancelLabel="Back to Logs"
//     />
//   );
// };

// export default ViewSubscriptionRenewalLog;


// pages/subscription-renewal-logs/ViewSubscriptionRenewalLog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdBusiness,
  MdAutorenew,
  MdAttachMoney,
  MdDateRange,
  MdSwapHoriz,
  MdPerson,
} from 'react-icons/md';
import subscriptionRenewalLogService from '../../services/subscriptionRenewalLog.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    icon: MdCheckCircle,
  },
  inactive: {
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
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
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

// ─── Renewal type styles ───────────────────────────────────────
const RENEWAL_TYPE_STYLES = {
  upgrade: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  downgrade: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  renew: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  extension: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  cancel: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const RENEWAL_TYPE_LABELS = {
  upgrade: 'Upgrade',
  downgrade: 'Downgrade',
  renew: 'Renew',
  extension: 'Extension',
  cancel: 'Cancel',
};

const RenewalTypePill = ({ type }) => {
  const key = String(type || '').toLowerCase();
  const cls = RENEWAL_TYPE_STYLES[key] || 'bg-slate-100 text-slate-500 ring-1 ring-slate-200';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <MdSwapHoriz size={12} />
      {RENEWAL_TYPE_LABELS[key] || type || '—'}
    </span>
  );
};

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
  </label>
);

const ReadOnlyValue = ({ children }) => (
  <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 break-words">
    {children !== '' && children !== null && children !== undefined ? children : '—'}
  </div>
);

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: MdBusiness },
  { id: 'plan', label: 'Plan Change', icon: MdAutorenew },
  { id: 'dates', label: 'Dates & Amount', icon: MdDateRange },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const ViewSubscriptionRenewalLog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [logData, setLogData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    const key = String(userId);
    return userNameCache[key] || `User ${userId}`;
  };

  // ─── Fetch renewal log data ────────────────────────────────
  useEffect(() => {
    const fetchRenewalLog = async () => {
      setLoading(true);
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users || {}).forEach((uid) => {
          userMap[uid] = users[uid]?.name ?? users[uid];
        });
        setUserNameCache(userMap);

        const response = await subscriptionRenewalLogService.getById(id);
        const data = response?.data || response;

        if (data) {
          // ─── Extract company name from nested object ─────────
          let companyName = '—';
          if (data.companySubscription?.Company?.company_name) {
            companyName = data.companySubscription.Company.company_name;
          } else if (data.company_name) {
            companyName = data.company_name;
          }

          // ─── Extract plan names from nested objects ───────────
          let oldPlanName = data.old_plan || '—';
          let newPlanName = data.new_plan || '—';

          if (data.old_plan && typeof data.old_plan === 'object') {
            oldPlanName = data.old_plan.plan_name || '—';
          }
          if (data.new_plan && typeof data.new_plan === 'object') {
            newPlanName = data.new_plan.plan_name || '—';
          }

          setLogData({
            id: data.id,
            company_name: companyName,
            renewal_type: data.renewal_type || '—',
            old_plan: oldPlanName,
            new_plan: newPlanName,
            old_expiry: data.old_expiry || null,
            new_expiry: data.new_expiry || null,
            amount: data.amount || '0.00',
            status:
              data.status === true || data.status === 1
                ? 'active'
                : 'inactive',
            created_by: data.created_by || null,
            updated_by: data.updated_by || null,
            created_at: data.created_at || data.createdAt || null,
            updated_at: data.updated_at || data.updatedAt || null,
          });
        } else {
          showError('Renewal log not found');
          navigate('/subscription-renewal-logs');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load renewal log data');
        navigate('/subscription-renewal-logs');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRenewalLog();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/subscription-renewal-logs/edit/${id}`);
  };

  const handleBack = () => navigate('/subscription-renewal-logs');

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading renewal log details...</p>
        </div>
      </div>
    );
  }

  if (!logData) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const companyName = logData.company_name || 'Renewal Log';
  const renewalType = logData.renewal_type || '—';
  const amount = parseFloat(logData.amount || 0);
  const amountDisplay = amount.toFixed(2);
  const status = logData.status || 'inactive';
  const oldPlan = logData.old_plan || '—';
  const newPlan = logData.new_plan || '—';
  const oldExpiry = logData.old_expiry ? formatDate(logData.old_expiry) : '—';
  const newExpiry = logData.new_expiry ? formatDate(logData.new_expiry) : '—';
  const createdDate = logData.created_at ? formatDate(logData.created_at) : '—';
  const updatedDate = logData.updated_at ? formatDate(logData.updated_at) : '—';

  const initials = companyName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Render tab content ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel>Company</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-lg">{companyName}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Renewal Type</FieldLabel>
                <ReadOnlyValue>
                  <RenewalTypePill type={renewalType} />
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <ReadOnlyValue>
                  <StatusPill status={status} />
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Amount</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-bold text-2xl text-blue-600">
                    ₹{amountDisplay}
                  </span>
                </ReadOnlyValue>
              </div>
           
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Old Plan</FieldLabel>
                <ReadOnlyValue>
                  <span className="text-slate-600">{oldPlan}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>New Plan</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-blue-600">{newPlan}</span>
                </ReadOnlyValue>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Plan Change</FieldLabel>
                <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600">{oldPlan}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-medium text-blue-600">{newPlan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'dates':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Old Expiry</FieldLabel>
                <ReadOnlyValue>{oldExpiry}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>New Expiry</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-blue-600">{newExpiry}</span>
                </ReadOnlyValue>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Expiry Change</FieldLabel>
                <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">
                      Old: {oldExpiry}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">↓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-sm font-medium">
                      New: {newExpiry}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>Amount</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-semibold text-slate-900 text-lg">
                    ₹{amountDisplay}
                  </span>
                </ReadOnlyValue>
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdHistory size={16} />
                  Audit Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <FieldLabel>Created By</FieldLabel>
                  <ReadOnlyValue>
                    {logData.created_by ? getUserNameCached(logData.created_by) : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>{createdDate}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated By</FieldLabel>
                  <ReadOnlyValue>
                    {logData.updated_by ? getUserNameCached(logData.updated_by) : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated At</FieldLabel>
                  <ReadOnlyValue>{updatedDate}</ReadOnlyValue>
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
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar (light) ───────────────────────── */}
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
              <p className="text-[11px] text-slate-400 leading-tight">
                Subscription Renewal Logs
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
            >
              <MdEdit size={16} />
              Edit Log
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero (fixed dark gradient) ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdAutorenew size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {companyName}
                  </h1>
                  <StatusPill status={status} />
                  <RenewalTypePill type={renewalType} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">₹{amountDisplay}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">
                    {oldPlan} → {newPlan}
                  </span>
                  {logData.created_at && (
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

        {/* ─── Quick stat strip ─────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Company</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {companyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdSwapHoriz size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Renewal Type
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {renewalType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Amount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                ₹{amountDisplay}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                New Expiry
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {newExpiry}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────── */}
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
                      layoutId="view-renewal-log-tab-underline"
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
          Back to Logs
        </button>
      </div>
    </div>
  );
};

export default ViewSubscriptionRenewalLog;