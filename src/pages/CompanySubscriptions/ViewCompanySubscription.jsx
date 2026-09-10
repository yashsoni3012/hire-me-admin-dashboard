// // pages/company-subscriptions/ViewCompanySubscription.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { companySubscriptionService } from '../../services/companySubscription.service';
// import { showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// const ViewCompanySubscription = () => {
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

//   // Fetch company subscription data
//   useEffect(() => {
//     const fetchSubscription = async () => {
//       setLoading(true);
//       try {
//         // Fetch users for names
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach(id => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);

//         // ─── Fetch subscription by ID ──────────────────────────────
//         const response = await companySubscriptionService.getById(id);
//         console.log('Subscription response:', response);

//         // ─── Handle different response structures ────────────────
//         const result = response?.data || response;
//         const data = result?.data || result;
//         console.log('Extracted data:', data);

//         if (data && data.id) {
//           // ─── Determine status ────────────────────────────────────
//           const isActive = data.is_status === true ||
//             data.is_status === 1 ||
//             data.is_status === "1" ||
//             data.is_status === "true";

//           // ─── Format Previous and Next Subscription Plans ────────
//           const previousPlan = data.PreviousSubscriptionPlan
//             ? `${data.PreviousSubscriptionPlan.plan_name} (ID: ${data.PreviousSubscriptionPlan.previous_subscription_id || data.PreviousSubscriptionPlan.id})`
//             : "None";

//           const nextPlan = data.NextSubscriptionPlan
//             ? `${data.NextSubscriptionPlan.plan_name} (ID: ${data.NextSubscriptionPlan.next_subscription_plan_id || data.NextSubscriptionPlan.id})`
//             : "None";

//           const formData = {
//             company_name: data.Company?.company_name || data.company_name || "-",
//             plan_name: data.SubscriptionPlan?.plan_name || data.plan_name || "-",
//             subscription_type: data.subscription_type || "New",
//             subscription_status: data.subscription_status || "pending",
//             start_date: data.start_date || null,
//             expiry_date: data.expiry_date || data.end_date || null,
//             is_trial: data.is_trial || false,
//             auto_renew: data.auto_renew || false,
//             cancel_reason: data.cancel_reason || "—",
//             cancelled_at: data.cancelled_at || null,
//             previous_subscription_plan: previousPlan,
//             next_subscription_plan: nextPlan,
//             status: isActive ? "active" : "inactive",
//             created_by: data.created_by || "-",
//             updated_by: data.updated_by || "-",
//             created_at: data.created_at || data.createdAt || null,
//             updated_at: data.updated_at || data.updatedAt || null,
//           };
//           console.log('Form data prepared:', formData);
//           setInitialData(formData);
//           setViewData(data);
//         } else {
//           showError("Company subscription not found");
//           navigate('/company-subscriptions');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load company subscription data");
//         navigate('/company-subscriptions');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchSubscription();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/company-subscriptions/edit/${id}`);
//   };
//   const formatDateTime = (date) => {
//     if (!date) return "—";

//     const d = new Date(date);

//     if (Number.isNaN(d.getTime())) return "—";

//     return d.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   // ─── Form fields configuration - view only ─────────────────────
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
//       name: "plan_name",
//       label: "Plan Name",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "subscription_type",
//       label: "Subscription Type",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const colors = {
//           'Upgrade': 'bg-blue-100 text-blue-700',
//           'Renew': 'bg-green-100 text-green-700',
//           'New': 'bg-purple-100 text-purple-700',
//         };
//         return (
//           <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[value] || colors['New']}`}>
//             {value || "New"}
//           </span>
//         );
//       },
//     },
//     {
//       name: "subscription_status",
//       label: "Subscription Status",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const colors = {
//           'active': 'bg-green-100 text-green-700',
//           'pending': 'bg-yellow-100 text-yellow-700',
//           'expired': 'bg-red-100 text-red-700',
//           'cancelled': 'bg-gray-100 text-gray-700',
//         };
//         return (
//           <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-500'}`}>
//             {value || "pending"}
//           </span>
//         );
//       },
//     },
//     {
//       name: "start_date",
//       label: "Start Date",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
//     {
//       name: "expiry_date",
//       label: "Expiry Date",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
//     // ─── New: Cancel Reason ──────────────────────────────────────
//     {
//       name: "cancel_reason",
//       label: "Cancel Reason",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value && value !== "—" ? value : "—",
//     },
//     // ─── New: Cancelled At ──────────────────────────────────────
//     {
//       name: "cancelled_at",
//       label: "Cancelled At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDateTime(value) : '—'
//     },
//     // ─── New: Previous Subscription Plan ────────────────────────
//     {
//       name: "previous_subscription_plan",
//       label: "Previous Subscription Plan",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-700">{value}</span>
//       ),
//     },
//     // ─── New: Next Subscription Plan ────────────────────────────
//     {
//       name: "next_subscription_plan",
//       label: "Next Subscription Plan",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-700">{value}</span>
//       ),
//     },
//     {
//       name: "is_trial",
//       label: "Is Trial",
//       type: "checkbox",
//       readonly: true,
//       viewRender: (value) => (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"
//           }`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-blue-500" : "bg-gray-400"}`} />
//           {value ? "Yes" : "No"}
//         </span>
//       ),
//     },
//     {
//       name: "auto_renew",
//       label: "Auto Renew",
//       type: "checkbox",
//       readonly: true,
//       viewRender: (value) => (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
//           }`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-green-500" : "bg-gray-400"}`} />
//           {value ? "Yes" : "No"}
//         </span>
//       ),
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
//           }`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${value === "active" ? "bg-green-500" : "bg-gray-400"}`} />
//           {value === "active" ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//     // ─── Audit: Created By ──────────────────────────────────────
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
//     // ─── Audit: Created At ──────────────────────────────────────
//     {
//       name: "created_at",
//       label: "Created At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
//     // ─── Audit: Updated By ──────────────────────────────────────
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
//     // ─── Audit: Updated At ──────────────────────────────────────
//     {
//       name: "updated_at",
//       label: "Updated At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading company subscription details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Company Subscription Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => { }}
//       onEdit={handleEdit}
//       navigateTo="/company-subscriptions"
//       breadcrumb={`Viewing: ${viewData?.Company?.company_name || viewData?.company_name || 'Company Subscription'}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Subscription"
//       cancelLabel="Back to Subscriptions"
//     />
//   );
// };

// export default ViewCompanySubscription;

// pages/company-subscriptions/ViewCompanySubscription.jsx
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
  MdPerson,
  MdBusiness,
  MdAutorenew,
  MdToday,
  MdEventBusy,
  MdCardGiftcard,
  MdTrendingUp,
  MdSwapHoriz,
} from 'react-icons/md';
import { companySubscriptionService } from '../../services/companySubscription.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
    icon: MdCheckCircle,
  },
  inactive: {
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
    dot: 'bg-slate-400',
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

const TypeBadge = ({ type }) => {
  const colors = {
    Upgrade: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    Renew: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    New: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  };
  const cls = colors[type] || colors.New;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <MdSwapHoriz size={13} />
      {type || 'New'}
    </span>
  );
};

const SubscriptionStatusBadge = ({ status }) => {
  const colors = {
    active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    expired: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    cancelled: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  };
  const cls = colors[status] || 'bg-slate-100 text-slate-500 ring-1 ring-slate-200';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
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
const ViewCompanySubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    const key = String(userId);
    return userNameCache[key] || `User ${userId}`;
  };

  const formatDateTime = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // ─── Fetch company subscription data ─────────────────────────
  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users || {}).forEach((uid) => {
          userMap[uid] = users[uid]?.name ?? users[uid];
        });
        setUserNameCache(userMap);

        const response = await companySubscriptionService.getById(id);
        const result = response?.data || response;
        const data = result?.data || result;

        if (data && data.id) {
          const isActive =
            data.is_status === true ||
            data.is_status === 1 ||
            data.is_status === '1' ||
            data.is_status === 'true';

          const previousPlan = data.PreviousSubscriptionPlan
            ? `${data.PreviousSubscriptionPlan.plan_name} (ID: ${
                data.PreviousSubscriptionPlan.previous_subscription_id ||
                data.PreviousSubscriptionPlan.id
              })`
            : 'None';

          const nextPlan = data.NextSubscriptionPlan
            ? `${data.NextSubscriptionPlan.plan_name} (ID: ${
                data.NextSubscriptionPlan.next_subscription_plan_id ||
                data.NextSubscriptionPlan.id
              })`
            : 'None';

          setSubscriptionData({
            id: data.id,
            company_name: data.Company?.company_name || data.company_name || '—',
            plan_name: data.SubscriptionPlan?.plan_name || data.plan_name || '—',
            subscription_type: data.subscription_type || 'New',
            subscription_status: data.subscription_status || 'pending',
            start_date: data.start_date || null,
            expiry_date: data.expiry_date || data.end_date || null,
            is_trial: data.is_trial || false,
            auto_renew: data.auto_renew || false,
            cancel_reason: data.cancel_reason || '—',
            cancelled_at: data.cancelled_at || null,
            previous_subscription_plan: previousPlan,
            next_subscription_plan: nextPlan,
            status: isActive ? 'active' : 'inactive',
            created_by: data.created_by || null,
            updated_by: data.updated_by || null,
            created_at: data.created_at || data.createdAt || null,
            updated_at: data.updated_at || data.updatedAt || null,
          });
        } else {
          showError('Company subscription not found');
          navigate('/company-subscriptions');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load company subscription data');
        navigate('/company-subscriptions');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubscription();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/company-subscriptions/edit/${id}`);
  };

  const handleBack = () => navigate('/company-subscriptions');

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">
            Loading company subscription details...
          </p>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const companyName = subscriptionData.company_name || 'Company';
  const planName = subscriptionData.plan_name || 'Plan';
  const type = subscriptionData.subscription_type || 'New';
  const subStatus = subscriptionData.subscription_status || 'pending';
  const status = subscriptionData.status || 'inactive';
  const isTrial = subscriptionData.is_trial || false;
  const autoRenew = subscriptionData.auto_renew || false;
  const startDate = subscriptionData.start_date ? formatDate(subscriptionData.start_date) : '—';
  const expiryDate = subscriptionData.expiry_date ? formatDate(subscriptionData.expiry_date) : '—';
  const cancelReason = subscriptionData.cancel_reason || '—';
  const cancelledAt = subscriptionData.cancelled_at
    ? formatDateTime(subscriptionData.cancelled_at)
    : '—';
  const previousPlan = subscriptionData.previous_subscription_plan || '—';
  const nextPlan = subscriptionData.next_subscription_plan || '—';
  const createdDate = subscriptionData.created_at
    ? formatDate(subscriptionData.created_at)
    : '—';
  const updatedDate = subscriptionData.updated_at
    ? formatDate(subscriptionData.updated_at)
    : '—';

  const initials = (companyName || 'CS')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Render tab content ──────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Company</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-lg">{companyName}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Plan Name</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-lg">{planName}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Subscription Type</FieldLabel>
                <ReadOnlyValue>
                  <TypeBadge type={type} />
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Subscription Status</FieldLabel>
                <ReadOnlyValue>
                  <SubscriptionStatusBadge status={subStatus} />
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Start Date</FieldLabel>
                <ReadOnlyValue>{startDate}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Expiry Date</FieldLabel>
                <ReadOnlyValue>{expiryDate}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Is Trial</FieldLabel>
                <ReadOnlyValue>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      isTrial
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                        : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                    }`}
                  >
                    {isTrial ? 'Yes' : 'No'}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Auto Renew</FieldLabel>
                <ReadOnlyValue>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      autoRenew
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                        : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                    }`}
                  >
                    {autoRenew ? 'Yes' : 'No'}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Cancel Reason</FieldLabel>
                <ReadOnlyValue>{cancelReason}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Cancelled At</FieldLabel>
                <ReadOnlyValue>{cancelledAt}</ReadOnlyValue>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Previous Subscription Plan</FieldLabel>
                <ReadOnlyValue>{previousPlan}</ReadOnlyValue>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Next Subscription Plan</FieldLabel>
                <ReadOnlyValue>{nextPlan}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <ReadOnlyValue>
                  <StatusPill status={status} />
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
                    {subscriptionData.created_by
                      ? getUserNameCached(subscriptionData.created_by)
                      : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>{createdDate}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated By</FieldLabel>
                  <ReadOnlyValue>
                    {subscriptionData.updated_by
                      ? getUserNameCached(subscriptionData.updated_by)
                      : '—'}
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
                Company Subscriptions
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
              Edit Subscription
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero (fixed dark gradient) ─────────────────────── */}
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
                  {initials || <MdBusiness size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {companyName}
                  </h1>
                  <StatusPill status={status} />
                  <TypeBadge type={type} />
                  <SubscriptionStatusBadge status={subStatus} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">Plan: {planName}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">ID: #{subscriptionData.id}</span>
                  {subscriptionData.created_at && (
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
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Plan</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {planName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAutorenew size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Auto Renew</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {autoRenew ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCardGiftcard size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Is Trial</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {isTrial ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdToday size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Expires</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {expiryDate}
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
                    active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="view-subscription-tab-underline"
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
          Back to Subscriptions
        </button>
      </div>
    </div>
  );
};

export default ViewCompanySubscription;