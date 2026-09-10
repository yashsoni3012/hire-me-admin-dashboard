// // pages/subscription-coupons/ViewSubscriptionCoupon.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { subscriptionCouponService } from '../../services/subscriptionCoupon.service';
// import { showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';
// import { MdDateRange } from 'react-icons/md';

// // ─── Helper: Parse API date format ──────────────────────────────
// const parseApiDate = (dateString) => {
//   if (!dateString) return null;
  
//   if (dateString instanceof Date) return dateString;
//   if (typeof dateString === 'string' && dateString.includes('T')) {
//     const d = new Date(dateString);
//     if (!isNaN(d)) return d;
//   }
  
//   const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i);
//   if (match) {
//     let [_, day, month, year, hours, minutes, seconds, ampm] = match;
//     hours = parseInt(hours);
//     if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
//     if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
//     return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, parseInt(minutes), parseInt(seconds));
//   }
  
//   const d = new Date(dateString);
//   return !isNaN(d) ? d : null;
// };

// // ─── Helper: Format date with time ──────────────────────────────
// const formatDateTime = (date) => {
//   if (!date) return '—';
  
//   const parsed = typeof date === 'string' ? parseApiDate(date) : date;
//   if (!parsed || isNaN(parsed)) return '—';
  
//   return parsed.toLocaleString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const ViewSubscriptionCoupon = () => {
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

//   // Format currency
//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return '-';
//     return `₹${parseFloat(amount).toFixed(2)}`;
//   };

//   // Fetch coupon data
//   useEffect(() => {
//     const fetchCoupon = async () => {
//       setLoading(true);
//       try {
//         // Fetch users for names
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach(id => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);

//         console.log(`Fetching coupon with ID: ${id}`);
//         const response = await subscriptionCouponService.getById(id);
//         console.log('Coupon response:', response);
        
//         // ─── Handle different response structures ────────────────
//         const result = response?.data || response;
//         const data = result?.data || result;
//         console.log('Extracted data:', data);
        
//         if (data && data.id) {
//           // ─── Determine status ────────────────────────────────────
//           let isActive = false;
//           if (data.is_status !== undefined && data.is_status !== null) {
//             isActive = data.is_status === true || data.is_status === 1 || data.is_status === "1" || data.is_status === "true";
//           } else if (data.status !== undefined && data.status !== null) {
//             isActive = data.status === true || data.status === 1 || data.status === "1" || data.status === "true" || data.status === "active";
//           }

//           // ─── Parse dates ─────────────────────────────────────────
//           const createdAt = data.created_at || data.createdAt || null;
//           const updatedAt = data.updated_at || data.updatedAt || null;

//           const formData = {
//             coupon_code: data.coupon_code || "",
//             title: data.title || "",
//             discount_type: data.discount_type || "percentage",
//             discount_value: data.discount_value || 0,
//             minimum_amount: data.minimum_amount || 0,
//             max_discount: data.max_discount || null,
//             valid_from: data.valid_from || null,
//             valid_to: data.valid_to || null,
//             usage_limit: data.usage_limit || null,
//             per_company_limit: data.per_company_limit || 1,
//             is_trending: data.is_trending === true || data.is_trending === 1 || data.is_trending === "1",
//             status: isActive ? "active" : "inactive",
//             created_by: data.created_by || "-",
//             updated_by: data.updated_by || "-",
//             created_at: createdAt,
//             updated_at: updatedAt,
//           };
//           console.log('Form data prepared:', formData);
//           setInitialData(formData);
//           setViewData(data);
//         } else {
//           showError("Coupon not found");
//           navigate('/subscription-coupons');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         console.error('Error response:', error.response);
//         console.error('Error status:', error.response?.status);
//         console.error('Error data:', error.response?.data);
//         showError(error.message || "Failed to load coupon data");
//         navigate('/subscription-coupons');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchCoupon();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/subscription-coupons/edit/${id}`);
//   };

//   // ─── Form fields configuration - view only ─────────────────────
//   const fields = [
//     {
//       name: "coupon_code",
//       label: "Coupon Code",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-mono font-bold text-blue-600 text-lg">{value}</span>
//       ),
//     },
//     {
//       name: "title",
//       label: "Title",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "discount_value",
//       label: "Discount",
//       type: "text",
//       readonly: true,
//       viewRender: (value, formData) => {
//         const type = formData?.discount_type || "percentage";
//         const val = parseFloat(value || 0);
//         return (
//           <span className="font-semibold text-green-600 text-lg">
//             {type === "percentage" ? `${val}%` : formatCurrency(val)}
//           </span>
//         );
//       },
//     },
//     {
//       name: "minimum_amount",
//       label: "Minimum Amount",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const amount = parseFloat(value || 0);
//         return amount > 0 ? (
//           <span className="text-gray-600">{formatCurrency(amount)}</span>
//         ) : (
//           <span className="text-gray-400">No minimum</span>
//         );
//       },
//     },
//     {
//       name: "max_discount",
//       label: "Maximum Discount",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         return value ? (
//           <span className="text-gray-600">{formatCurrency(value)}</span>
//         ) : (
//           <span className="text-gray-400">Unlimited</span>
//         );
//       },
//     },
//     {
//       name: "valid_period",
//       label: "Valid Period",
//       type: "text",
//       readonly: true,
//       viewRender: (_, formData) => {
//         const from = formData?.valid_from ? formatDate(formData.valid_from) : "-";
//         const to = formData?.valid_to ? formatDate(formData.valid_to) : "-";
//         return (
//           <div className="flex items-center gap-2 text-gray-600">
//             <MdDateRange size={18} className="text-gray-400" />
//             <span>{from} → {to}</span>
//           </div>
//         );
//       },
//     },
//     {
//       name: "usage_limit",
//       label: "Usage Limit",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-600">{value || "Unlimited"}</span>
//       ),
//     },
//     {
//       name: "per_company_limit",
//       label: "Per Company Limit",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-600">{value || 1}</span>
//       ),
//     },
//     {
//       name: "is_trending",
//       label: "Trending",
//       type: "checkbox",
//       readonly: true,
//       viewRender: (value) => (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//           value ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"
//         }`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-yellow-500" : "bg-gray-400"}`} />
//           {value ? "Trending" : "Not Trending"}
//         </span>
//       ),
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//           value === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
//         }`}>
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
//       viewRender: (value) => {
//         if (!value) return <span className="text-gray-400">—</span>;
//         return (
//           <div className="flex flex-col">
//             <span className="text-gray-700">{formatDateTime(value)}</span>
//           </div>
//         );
//       },
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
//       viewRender: (value) => {
//         if (!value) return <span className="text-gray-400">—</span>;
//         return (
//           <div className="flex flex-col">
//             <span className="text-gray-700">{formatDateTime(value)}</span>
//           </div>
//         );
//       },
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading coupon details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Coupon Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/subscription-coupons"
//       breadcrumb={`Viewing: ${viewData?.coupon_code || 'Coupon'}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Coupon"
//       cancelLabel="Back to Coupons"
//     />
//   );
// };

// export default ViewSubscriptionCoupon;

// pages/subscription-coupons/ViewSubscriptionCoupon.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdCheckCircle,
  MdErrorOutline,
  MdPauseCircle,
  MdBlock,
  MdDateRange,
  MdInfo,
  MdAssignment,
  MdAttachMoney,
  MdLocalOffer,
  MdTrendingUp,
  MdPerson,
  MdHistory,
} from 'react-icons/md';
import { subscriptionCouponService } from '../../services/subscriptionCoupon.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

// ─── Helper: Parse API date format ──────────────────────────────
const parseApiDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  if (typeof dateString === 'string' && dateString.includes('T')) {
    const d = new Date(dateString);
    if (!isNaN(d)) return d;
  }
  const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i);
  if (match) {
    let [_, day, month, year, hours, minutes, seconds, ampm] = match;
    hours = parseInt(hours);
    if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, parseInt(minutes), parseInt(seconds));
  }
  const d = new Date(dateString);
  return !isNaN(d) ? d : null;
};

// ─── Helper: Format date with time ──────────────────────────────
const formatDateTime = (date) => {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseApiDate(date) : date;
  if (!parsed || isNaN(parsed)) return '—';
  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
    icon: MdCheckCircle,
    heroDot: 'bg-emerald-400',
  },
  inactive: {
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
    dot: 'bg-slate-400',
    icon: MdErrorOutline,
    heroDot: 'bg-slate-400',
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
  { id: 'overview', label: 'Overview', icon: MdAssignment },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const ViewSubscriptionCoupon = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    return userNameCache[userId] || `User ${userId}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  // Fetch coupon data
  useEffect(() => {
    const fetchCoupon = async () => {
      setLoading(true);
      try {
        // Fetch users for names
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[id] = users[id].name;
        });
        setUserNameCache(userMap);

        const response = await subscriptionCouponService.getById(id);
        const result = response?.data || response;
        const coupon = result?.data || result;

        if (coupon && coupon.id) {
          // Determine status
          let isActive = false;
          if (coupon.is_status !== undefined && coupon.is_status !== null) {
            isActive =
              coupon.is_status === true ||
              coupon.is_status === 1 ||
              coupon.is_status === '1' ||
              coupon.is_status === 'true';
          } else if (coupon.status !== undefined && coupon.status !== null) {
            isActive =
              coupon.status === true ||
              coupon.status === 1 ||
              coupon.status === '1' ||
              coupon.status === 'true' ||
              coupon.status === 'active';
          }

          const createdAt = coupon.created_at || coupon.createdAt || null;
          const updatedAt = coupon.updated_at || coupon.updatedAt || null;

          const normalizedData = {
            id: coupon.id,
            coupon_code: coupon.coupon_code || '',
            title: coupon.title || '',
            discount_type: coupon.discount_type || 'percentage',
            discount_value: coupon.discount_value || 0,
            minimum_amount: coupon.minimum_amount || 0,
            max_discount: coupon.max_discount || null,
            valid_from: coupon.valid_from || null,
            valid_to: coupon.valid_to || null,
            usage_limit: coupon.usage_limit || null,
            per_company_limit: coupon.per_company_limit || 1,
            is_trending:
              coupon.is_trending === true ||
              coupon.is_trending === 1 ||
              coupon.is_trending === '1',
            status: isActive ? 'active' : 'inactive',
            created_by: coupon.created_by || '-',
            updated_by: coupon.updated_by || '-',
            created_at: createdAt,
            updated_at: updatedAt,
          };

          setData(coupon);
          setFormData(normalizedData);
        } else {
          showError('Coupon not found');
          navigate('/subscription-coupons');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load coupon data');
        navigate('/subscription-coupons');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoupon();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/subscription-coupons/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/subscription-coupons');
  };

  // ─── Compute hero data ────────────────────────────────────
  const couponCode = formData?.coupon_code || 'New Coupon';
  const title = formData?.title || '';
  const discountType = formData?.discount_type || 'percentage';
  const discountValue = parseFloat(formData?.discount_value || 0);
  const discountDisplay =
    discountType === 'percentage' ? `${discountValue}%` : formatCurrency(discountValue);
  const minAmount = parseFloat(formData?.minimum_amount || 0);
  const maxDiscount = formData?.max_discount ? parseFloat(formData.max_discount) : null;
  const validFrom = formData?.valid_from ? formatDate(formData.valid_from) : '-';
  const validTo = formData?.valid_to ? formatDate(formData.valid_to) : '-';
  const usageLimit = formData?.usage_limit || 'Unlimited';
  const perCompanyLimit = formData?.per_company_limit || 1;
  const isTrending = formData?.is_trending || false;
  const status = formData?.status || 'inactive';

  const initials = couponCode
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
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Coupon Code</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-mono font-bold text-blue-600 text-lg">{couponCode}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <ReadOnlyValue>{title || '—'}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Discount</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-semibold text-green-600 text-lg">
                    {discountDisplay}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Minimum Amount</FieldLabel>
                <ReadOnlyValue>
                  {minAmount > 0 ? formatCurrency(minAmount) : 'No minimum'}
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Maximum Discount</FieldLabel>
                <ReadOnlyValue>
                  {maxDiscount !== null && maxDiscount > 0
                    ? formatCurrency(maxDiscount)
                    : 'Unlimited'}
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Valid Period</FieldLabel>
                <ReadOnlyValue>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MdDateRange size={18} className="text-slate-400" />
                    <span>
                      {validFrom} → {validTo}
                    </span>
                  </div>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Usage Limit</FieldLabel>
                <ReadOnlyValue>{usageLimit}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Per Company Limit</FieldLabel>
                <ReadOnlyValue>{perCompanyLimit}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Trending</FieldLabel>
                <ReadOnlyValue>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      isTrending ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isTrending ? 'bg-yellow-500' : 'bg-slate-400'}`}
                    />
                    {isTrending ? 'Trending' : 'Not Trending'}
                  </span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <ReadOnlyValue>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </ReadOnlyValue>
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6 max-w-xl">
            <div>
              <FieldLabel>Created By</FieldLabel>
              <ReadOnlyValue>{getUserNameCached(data?.created_by)}</ReadOnlyValue>
            </div>
            <div>
              <FieldLabel>Created At</FieldLabel>
              <ReadOnlyValue>{data?.created_at ? formatDateTime(data.created_at) : '—'}</ReadOnlyValue>
            </div>
            <div>
              <FieldLabel>Last Updated By</FieldLabel>
              <ReadOnlyValue>{getUserNameCached(data?.updated_by)}</ReadOnlyValue>
            </div>
            <div>
              <FieldLabel>Last Updated At</FieldLabel>
              <ReadOnlyValue>{data?.updated_at ? formatDateTime(data.updated_at) : '—'}</ReadOnlyValue>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading coupon details...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

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
              <p className="text-[11px] text-slate-400 leading-tight">Subscription Coupons</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {couponCode}
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
              Edit Coupon
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
              {/* Icon placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdLocalOffer size={22} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {couponCode}
                  </h1>
                  {isTrending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdTrendingUp size={12} />
                      Trending
                    </span>
                  )}
                  <StatusPill status={status} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">{title || 'No title'}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">{discountDisplay} discount</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">
                    {validFrom} → {validTo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Discount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{discountDisplay}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Min Amount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {minAmount > 0 ? formatCurrency(minAmount) : 'None'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Max Discount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {maxDiscount !== null && maxDiscount > 0 ? formatCurrency(maxDiscount) : 'Unlimited'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Valid Until</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{validTo}</p>
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
                      layoutId="view-coupon-tab-underline"
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
          Back to Coupons
        </button>
      </div>
    </div>
  );
};

export default ViewSubscriptionCoupon;