// // pages/subscriptions/SubscriptionTransactionsForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { ViewBadge } from '../../components/common/FormPageUtils';
// import { subscriptionTransactionService } from '../../services/subscriptionTransaction.service';
// import { showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const SubscriptionTransactionsForm = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { id } = useParams();
//     const [mode, setMode] = useState('view'); // Only 'view' mode
//     const [data, setData] = useState(null);
//     const [userNameCache, setUserNameCache] = useState({});
//     const [pageLoading, setPageLoading] = useState(false);

//     // Determine mode from URL (always view)
//     useEffect(() => {
//         const path = location.pathname;
//         if (path.includes('/view/')) {
//             setMode('view');
//         } else {
//             setMode('view');
//         }
//     }, [location.pathname]);

//     // Fetch users for display names
//     useEffect(() => {
//         const loadUsers = async () => {
//             try {
//                 const users = await fetchUsers();
//                 const userMap = {};
//                 Object.keys(users).forEach(id => {
//                     userMap[id] = users[id].name;
//                 });
//                 setUserNameCache(userMap);
//             } catch (error) {
//                 console.error('Failed to load users:', error);
//             }
//         };
//         loadUsers();
//     }, []);

//     // Fetch data for view mode
//     useEffect(() => {
//         const fetchData = async () => {
//             if (id) {
//                 setPageLoading(true);
//                 try {
//                     let item = location.state?.item;

//                     if (!item) {
//                         const response = await subscriptionTransactionService.getById(id);
//                         item = response.data;
//                     }

//                     // Normalize the data with proper number parsing
//                     const normalizedData = {
//                         // Keep EVERY field returned by API
//                         ...item,

//                         // Basic
//                         id: item.id || item._id,

//                         // Amounts
//                         base_price: Number(item.base_price || 0),

//                         discount_price: Number(item.discount_price || 0),
//                         discount: Number(
//                             item.discount_price ?? item.discount ?? 0
//                         ),

//                         gst_amount: Number(item.gst_amount || 0),
//                         gst: Number(
//                             item.gst_amount ?? item.gst ?? 0
//                         ),

//                         final_amount: Number(item.final_amount || 0),

//                         // Payment
//                         payment_gateway: item.payment_gateway || "",
//                         payment_status: item.payment_status || "",
//                         invoice_no: item.invoice_no || "",
//                         transaction_no: item.transaction_no || "",
//                         payment_response: item.payment_response || "",
//                         payment_reference: item.payment_reference || "",
//                         gateway_order_id: item.gateway_order_id || "",

//                         // Status
//                         is_status:
//                             item.is_status !== undefined
//                                 ? item.is_status
//                                 : true,

//                         status:
//                             item.is_status !== undefined
//                                 ? item.is_status
//                                 : true,

//                         // Users
//                         created_by: item.created_by || "",
//                         updated_by: item.updated_by || "",

//                         // Dates
//                         created_at:
//                             item.created_at ||
//                             item.createdAt ||
//                             null,

//                         updated_at:
//                             item.updated_at ||
//                             item.updatedAt ||
//                             null,

//                         // Keep complete nested API objects
//                         Company: item.Company || null,

//                         SubscriptionPlan:
//                             item.SubscriptionPlan || null,

//                         CompanySubscription:
//                             item.CompanySubscription || null,

//                         SubscriptionPlanOffer:
//                             item.SubscriptionPlanOffer || null,

//                         SubscriptionCoupon:
//                             item.SubscriptionCoupon || null,

//                         // Convenient display fields
//                         company_name:
//                             item.Company?.company_name || "",

//                         company_id:
//                             item.Company?.company_id || "",

//                         plan_name:
//                             item.SubscriptionPlan?.plan_name || "",

//                         plan_id:
//                             item.SubscriptionPlan?.subscriptionplan_id ||
//                             item.SubscriptionPlan?.id ||
//                             "",

//                         subscription_type:
//                             item.CompanySubscription?.subscription_type || "",

//                         subscription_id:
//                             item.CompanySubscription?.company_subscription_id ||
//                             item.CompanySubscription?.id ||
//                             "",

//                         offer_name:
//                             item.SubscriptionPlanOffer?.offer_name || "",

//                         offer_id:
//                             item.SubscriptionPlanOffer?.offer_id ||
//                             item.SubscriptionPlanOffer?.id ||
//                             "",

//                         coupon_code:
//                             item.SubscriptionCoupon?.coupon_code || "",

//                         coupon_id:
//                             item.SubscriptionCoupon?.coupon_id ||
//                             item.SubscriptionCoupon?.id ||
//                             "",

//                         // Original complete API response
//                         raw: item,
//                     };

//                     setData(normalizedData);
//                 } catch (error) {
//                     console.error('Fetch error:', error);
//                     showError("Failed to load subscription transaction data");
//                     navigate('/subscription-transactions');
//                 } finally {
//                     setPageLoading(false);
//                 }
//             }
//         };
//         fetchData();
//     }, [id, location.state, navigate]);

//     // Get user name with caching
//     const getUserNameCached = (userId) => {
//         if (!userId) return "-";
//         return userNameCache[userId] || `User ${userId}`;
//     };

//     // Get status value
//     const getStatusValue = (row) => {
//         if (row?.is_status !== undefined) {
//             return row.is_status;
//         }
//         if (row?.status !== undefined) {
//             return row.status === 1 || row.status === true;
//         }
//         return true;
//     };

//     // Get payment status badge color
//     const getPaymentStatusColor = (status) => {
//         const statusMap = {
//             'Success': 'green',
//             'success': 'green',
//             'Pending': 'yellow',
//             'pending': 'yellow',
//             'Failed': 'red',
//             'failed': 'red',
//             'Refunded': 'orange',
//             'refunded': 'orange',
//         };
//         return statusMap[status] || 'gray';
//     };

//     // Get created by name
//     const getCreatedByName = (row) => {
//         if (!row) return "-";
//         if (row.created_by) {
//             if (typeof row.created_by === 'object') {
//                 return row.created_by.name || row.created_by.username || row.created_by.email || "User";
//             }
//             return getUserNameCached(row.created_by);
//         }
//         return "System";
//     };

//     // Get updated by name
//     const getUpdatedByName = (row) => {
//         if (!row) return "-";
//         if (row.updated_by) {
//             return getUserNameCached(row.updated_by);
//         }
//         return "-";
//     };

//     // Helper function to safely format currency
//     const formatCurrency = (value) => {
//         const num = parseFloat(value);
//         return isNaN(num) ? '0.00' : num.toFixed(2);
//     };

//     // Define fields for the form (view only)
//     const getFields = () => {
//         return [
//             {
//                 name: "transaction_no",
//                 label: "Transaction Number",
//                 type: "text",
//                 viewRender: (value) => (
//                     <span className="font-mono text-lg font-semibold text-[#2c0eee]">{value || '-'}</span>
//                 )
//             },
//             // {
//             //     name: "invoice_no",
//             //     label: "Invoice Number",
//             //     type: "text",
//             //     viewRender: (value) => (
//             //         <span className="font-medium">{value || '-'}</span>
//             //     )
//             // },
//             {
//                 name: "company_name",
//                 label: "Company",
//                 type: "text",
//                 viewRender: (value, row) => (
//                     <div className="flex items-center gap-2">
//                         <span className="font-medium">{row?.Company?.company_name || '-'}</span>
//                         {row?.Company?.company_id && (
//                             <span className="text-xs text-gray-400">(ID: {row.Company.company_id})</span>
//                         )}
//                     </div>
//                 )
//             },
//             {
//                 name: "plan_name",
//                 label: "Subscription Plan",
//                 type: "text",
//                 viewRender: (value, row) => (
//                     <div className="flex items-center gap-2">
//                         <span>{row?.SubscriptionPlan?.plan_name || '-'}</span>
//                         {row?.SubscriptionPlan?.subscriptionplan_id && (
//                             <span className="text-xs text-gray-400">(ID: {row.SubscriptionPlan.subscriptionplan_id})</span>
//                         )}
//                     </div>
//                 )
//             },
//             {
//                 name: "subscription_type",
//                 label: "Subscription Type",
//                 type: "text",
//                 viewRender: (value, row) => (
//                     <div className="flex items-center gap-2">
//                         <span>{row?.CompanySubscription?.subscription_type || '-'}</span>
//                         {row?.CompanySubscription?.company_subscription_id && (
//                             <span className="text-xs text-gray-400">(ID: {row.CompanySubscription.company_subscription_id})</span>
//                         )}
//                     </div>
//                 )
//             },
//             {
//                 name: "base_price",
//                 label: "Base Price",
//                 type: "text",
//                 viewRender: (value) => (
//                     <span className="font-medium">₹{formatCurrency(value)}</span>
//                 )
//             },
//             {
//                 name: "discount",
//                 label: "Discount",
//                 type: "text",
//                 viewRender: (value) => {
//                     const num = parseFloat(value);
//                     const formatted = isNaN(num) ? '0.00' : num.toFixed(2);
//                     return (
//                         <span className="font-medium text-red-500">-₹{formatted}</span>
//                     );
//                 }
//             },
//             {
//                 name: "gst",
//                 label: "GST Amount",
//                 type: "text",
//                 viewRender: (value) => (
//                     <span className="font-medium">₹{formatCurrency(value)}</span>
//                 )
//             },
//             {
//                 name: "final_amount",
//                 label: "Final Amount",
//                 type: "text",
//                 viewRender: (value) => (
//                     <span className="font-bold text-2xl text-[#2c0eee]">₹{formatCurrency(value)}</span>
//                 )
//             },
//             {
//                 name: "offer_name",
//                 label: "Offer Applied",
//                 type: "text",
//                 viewRender: (value, row) => row?.SubscriptionPlanOffer?.offer_name || '—'
//             },
//             {
//                 name: "coupon_code",
//                 label: "Coupon Applied",
//                 type: "text",
//                 viewRender: (value, row) => row?.SubscriptionCoupon?.coupon_code || '—'
//             },
//             {
//                 name: "payment_gateway",
//                 label: "Payment Gateway",
//                 type: "text",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "payment_status",
//                 label: "Payment Status",
//                 type: "text",
//                 viewRender: (value) => {
//                     const color = getPaymentStatusColor(value);
//                     return (
//                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}>
//                             <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
//                             {value || "Unknown"}
//                         </span>
//                     );
//                 }
//             },
//             {
//                 name: "payment_reference",
//                 label: "Payment Reference",
//                 type: "text",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "gateway_order_id",
//                 label: "Gateway Order ID",
//                 type: "text",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "payment_response",
//                 label: "Payment Response",
//                 type: "textarea",
//                 viewRender: (value) => {
//                     if (!value) return '—';
//                     return (
//                         <pre className="text-xs bg-gray-50 p-2 rounded border border-gray-200 max-h-24 overflow-auto">
//                             {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
//                         </pre>
//                     );
//                 }
//             },
//             {
//                 name: "status",
//                 label: "Status",
//                 type: "radio",
//                 options: [
//                     { value: "active", label: "Active" },
//                     { value: "inactive", label: "Inactive" },
//                 ],
//                 color: "text-[#2c0eee] focus:ring-[#4529f7]",
//                 viewRender: () => {
//                     const isActive =
//                         data?.is_status === true ||
//                         data?.is_status === 1 ||
//                         data?.is_status === "1" ||
//                         data?.is_status === "true";

//                     return <ViewBadge active={isActive} />;
//                 }
//             },
//             {
//                 name: "created_by",
//                 label: "Created By",
//                 type: "text",
//                 viewRender: (value, row) => getCreatedByName(row)
//             },
//             {
//                 name: "updated_by",
//                 label: "Updated By",
//                 type: "text",
//                 viewRender: (value, row) => getUpdatedByName(row)
//             },
//             {
//                 name: "created_at",
//                 label: "Created At",
//                 type: "text",
//                 viewRender: (value) => formatDate(value)
//             },
//             {
//                 name: "updated_at",
//                 label: "Updated At",
//                 type: "text",
//                 viewRender: (value) => value ? formatDate(value) : '—'
//             }
//         ];
//     };

//     // Get title
//     const getTitle = () => {
//         return 'Subscription Transaction Details';
//     };

//     // Handle loading state
//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-3 text-gray-500">Loading transaction details...</p>
//                 </div>
//             </div>
//         );
//     }

//     // If view mode and data not loaded, show error
//     if (!data && !pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Subscription transaction not found</p>
//                     <button
//                         onClick={() => navigate('/subscription-transactions')}
//                         className="mt-3 text-[#2c0eee] hover:underline"
//                     >
//                         Go back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // Prepare initial data
//     const getInitialData = () => {
//         if (data) {
//             return {
//                 ...data,
//                 status: data.is_status ? "active" : "inactive",
//             };
//         }
//         return {};
//     };

//     return (
//         <FormPage
//             title={getTitle()}
//             mode="view"
//             fields={getFields()}
//             initialData={getInitialData()}
//             navigateTo="/subscription-transactions"
//             showDelete={false}
//             showEdit={false}
//             enableEditMode={false}
//             breadcrumb="Viewing transaction details"
//         />
//     );
// };

// export default SubscriptionTransactionsForm;

// pages/subscriptions/SubscriptionTransactionsForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdCancel,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdPerson,
  MdBusiness,
  MdAttachMoney,
  MdPayment,
  MdReceiptLong,
  MdLink,
  MdDateRange,
  MdDescription,
  MdLocalOffer,
  MdCardGiftcard,
  MdConfirmationNumber,
} from 'react-icons/md';
import { subscriptionTransactionService } from '../../services/subscriptionTransaction.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

const API_BASE_URL = 'https://apidata.hiremejobs.in';

// ─── Payment status styles ────────────────────────────────────
const PAYMENT_STATUS_STYLES = {
  success: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
    icon: MdCheckCircle,
  },
  pending: {
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
    icon: MdInfo,
  },
  failed: {
    pill: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    dot: 'bg-red-500',
    icon: MdErrorOutline,
  },
  refunded: {
    pill: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    dot: 'bg-orange-500',
    icon: MdPayment,
  },
};

const getPaymentStyle = (status) => {
  const key = String(status || '').toLowerCase();
  return PAYMENT_STATUS_STYLES[key] || {
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
    dot: 'bg-slate-400',
    icon: MdErrorOutline,
  };
};

const PaymentStatusPill = ({ status }) => {
  const style = getPaymentStyle(status);
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : 'Unknown'}
    </span>
  );
};

// ─── Status styles (record active/inactive) ───────────────────
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

const RecordStatusPill = ({ isActive }) => {
  const style = isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {isActive ? 'Active' : 'Inactive'}
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
  { id: 'overview', label: 'Overview', icon: MdInfo },
  { id: 'pricing', label: 'Pricing', icon: MdAttachMoney },
  { id: 'payment', label: 'Payment', icon: MdPayment },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const SubscriptionTransactionsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // ─── Load users ─────────────────────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users || {}).forEach((uid) => {
          userMap[uid] = users[uid]?.name ?? users[uid];
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);

  // ─── Fetch transaction data ─────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setPageLoading(true);
      try {
        let item = location.state?.item;
        if (!item) {
          const response = await subscriptionTransactionService.getById(id);
          item = response.data;
        }

        const normalizedData = {
          ...item,
          id: item.id || item._id,
          base_price: Number(item.base_price || 0),
          discount_price: Number(item.discount_price || 0),
          discount: Number(item.discount_price ?? item.discount ?? 0),
          gst_amount: Number(item.gst_amount || 0),
          gst: Number(item.gst_amount ?? item.gst ?? 0),
          final_amount: Number(item.final_amount || 0),
          payment_gateway: item.payment_gateway || '',
          payment_status: item.payment_status || '',
          invoice_no: item.invoice_no || '',
          transaction_no: item.transaction_no || '',
          payment_response: item.payment_response || '',
          payment_reference: item.payment_reference || '',
          gateway_order_id: item.gateway_order_id || '',
          is_status: item.is_status !== undefined ? item.is_status : true,
          status: item.is_status !== undefined ? item.is_status : true,
          created_by: item.created_by || '',
          updated_by: item.updated_by || '',
          created_at: item.created_at || item.createdAt || null,
          updated_at: item.updated_at || item.updatedAt || null,
          Company: item.Company || null,
          SubscriptionPlan: item.SubscriptionPlan || null,
          CompanySubscription: item.CompanySubscription || null,
          SubscriptionPlanOffer: item.SubscriptionPlanOffer || null,
          SubscriptionCoupon: item.SubscriptionCoupon || null,
          company_name: item.Company?.company_name || '',
          company_id: item.Company?.company_id || '',
          plan_name: item.SubscriptionPlan?.plan_name || '',
          plan_id:
            item.SubscriptionPlan?.subscriptionplan_id ||
            item.SubscriptionPlan?.id ||
            '',
          subscription_type: item.CompanySubscription?.subscription_type || '',
          subscription_id:
            item.CompanySubscription?.company_subscription_id ||
            item.CompanySubscription?.id ||
            '',
          offer_name: item.SubscriptionPlanOffer?.offer_name || '',
          offer_id:
            item.SubscriptionPlanOffer?.offer_id ||
            item.SubscriptionPlanOffer?.id ||
            '',
          coupon_code: item.SubscriptionCoupon?.coupon_code || '',
          coupon_id:
            item.SubscriptionCoupon?.coupon_id ||
            item.SubscriptionCoupon?.id ||
            '',
          raw: item,
        };

        setData(normalizedData);
      } catch (error) {
        console.error('Fetch error:', error);
        showError('Failed to load subscription transaction data');
        navigate('/subscription-transactions');
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id, location.state, navigate]);

  // ─── Helpers ────────────────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    const key = String(userId);
    return userNameCache[key] || `User ${userId}`;
  };

  const getStatusValue = (row) => {
    if (!row) return true;
    if (row.is_status !== undefined) return row.is_status === true || row.is_status === 1;
    if (row.status !== undefined) return row.status === 1 || row.status === true;
    return true;
  };

  const getCreatedByName = (row) => {
    if (!row) return '—';
    if (row.created_by) {
      if (typeof row.created_by === 'object') {
        return (
          row.created_by.name ||
          row.created_by.username ||
          row.created_by.email ||
          'User'
        );
      }
      return getUserNameCached(row.created_by);
    }
    return 'System';
  };

  const getUpdatedByName = (row) => {
    if (!row) return '—';
    if (row.updated_by) {
      return getUserNameCached(row.updated_by);
    }
    return '—';
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handleBack = () => navigate('/subscription-transactions');

  // ─── Loading state ─────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
          <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Subscription transaction not found</p>
          <button
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MdArrowBack size={16} />
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  // ─── Compute hero data ────────────────────────────────────
  const isActive = getStatusValue(data);
  const transactionNo = data.transaction_no || `#${data.id}`;
  const companyName = data.company_name || data.Company?.company_name || '—';
  const planName = data.plan_name || data.SubscriptionPlan?.plan_name || '—';
  const paymentStatus = data.payment_status || '—';
  const finalAmount = data.final_amount || 0;
  const createdDate = data.created_at ? formatDate(data.created_at) : '—';
  const updatedDate = data.updated_at ? formatDate(data.updated_at) : '—';

  const initials = (companyName || 'TX')
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
                <FieldLabel>Transaction Number</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-mono text-lg font-semibold text-blue-600">
                    {transactionNo}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Company</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium">{companyName}</span>
                  {data.Company?.company_id && (
                    <span className="text-xs text-slate-400 ml-2">
                      (ID: {data.Company.company_id})
                    </span>
                  )}
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Subscription Plan</FieldLabel>
                <ReadOnlyValue>
                  <span>{planName}</span>
                  {data.SubscriptionPlan?.subscriptionplan_id && (
                    <span className="text-xs text-slate-400 ml-2">
                      (ID: {data.SubscriptionPlan.subscriptionplan_id})
                    </span>
                  )}
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Subscription Type</FieldLabel>
                <ReadOnlyValue>
                  <span>{data.subscription_type || '—'}</span>
                  {data.subscription_id && (
                    <span className="text-xs text-slate-400 ml-2">
                      (ID: {data.subscription_id})
                    </span>
                  )}
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Record Status</FieldLabel>
                <ReadOnlyValue>
                  <RecordStatusPill isActive={isActive} />
                </ReadOnlyValue>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Base Price</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium">
                    ₹{formatCurrency(data.base_price)}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Discount</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-red-500">
                    -₹{formatCurrency(data.discount)}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>GST Amount</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium">
                    ₹{formatCurrency(data.gst)}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Final Amount</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-bold text-2xl text-blue-600">
                    ₹{formatCurrency(data.final_amount)}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Offer Applied</FieldLabel>
                <ReadOnlyValue>
                  {data.SubscriptionPlanOffer?.offer_name ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MdLocalOffer size={14} className="text-blue-500" />
                      {data.SubscriptionPlanOffer.offer_name}
                    </span>
                  ) : (
                    '—'
                  )}
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Coupon Applied</FieldLabel>
                <ReadOnlyValue>
                  {data.SubscriptionCoupon?.coupon_code ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MdCardGiftcard size={14} className="text-purple-500" />
                      {data.SubscriptionCoupon.coupon_code}
                    </span>
                  ) : (
                    '—'
                  )}
                </ReadOnlyValue>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Payment Gateway</FieldLabel>
                <ReadOnlyValue>
                  {data.payment_gateway || '—'}
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Payment Status</FieldLabel>
                <ReadOnlyValue>
                  <PaymentStatusPill status={paymentStatus} />
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Payment Reference</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-mono text-sm">
                    {data.payment_reference || '—'}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Gateway Order ID</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-mono text-sm">
                    {data.gateway_order_id || '—'}
                  </span>
                </ReadOnlyValue>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Payment Response</FieldLabel>
                <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                  {data.payment_response ? (
                    <pre className="text-xs bg-white p-3 rounded border border-slate-200 max-h-48 overflow-auto font-mono text-slate-600 whitespace-pre-wrap break-words">
                      {typeof data.payment_response === 'string'
                        ? data.payment_response
                        : JSON.stringify(data.payment_response, null, 2)}
                    </pre>
                  ) : (
                    '—'
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'links':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.invoice_no && (
                <div>
                  <FieldLabel>Invoice Number</FieldLabel>
                  <ReadOnlyValue>
                    <span className="font-mono text-sm inline-flex items-center gap-1.5">
                      <MdReceiptLong size={14} className="text-slate-400" />
                      {data.invoice_no}
                    </span>
                  </ReadOnlyValue>
                </div>
              )}
              <div>
                <FieldLabel>Company ID</FieldLabel>
                <ReadOnlyValue>{data.company_id || '—'}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Plan ID</FieldLabel>
                <ReadOnlyValue>{data.plan_id || '—'}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Subscription ID</FieldLabel>
                <ReadOnlyValue>{data.subscription_id || '—'}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Offer ID</FieldLabel>
                <ReadOnlyValue>{data.offer_id || '—'}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Coupon ID</FieldLabel>
                <ReadOnlyValue>{data.coupon_id || '—'}</ReadOnlyValue>
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
                  <ReadOnlyValue>{getCreatedByName(data)}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>{createdDate}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated By</FieldLabel>
                  <ReadOnlyValue>{getUpdatedByName(data)}</ReadOnlyValue>
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
                Subscription Transactions
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {transactionNo}
              </p>
            </div>
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
                  {initials || <MdReceiptLong size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full font-mono">
                    {transactionNo}
                  </h1>
                  <PaymentStatusPill status={paymentStatus} />
                  <RecordStatusPill isActive={isActive} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdBusiness size={12} /> {companyName}
                  </span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdReceiptLong size={12} /> {planName}
                  </span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">
                    ₹{formatCurrency(finalAmount)}
                  </span>
                  {data.created_at && (
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
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Final Amount
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                ₹{formatCurrency(finalAmount)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPayment size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Payment
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {paymentStatus || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Company
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {companyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Created At
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {createdDate}
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
                    active
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="view-transaction-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: 'spring',
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
          onClick={handleBack}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Back to Transactions
        </button>
      </div>
    </div>
  );
};

export default SubscriptionTransactionsForm;