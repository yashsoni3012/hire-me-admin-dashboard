// // pages/demo-requests/ViewDemoRequest.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { demoRequestService } from '../../services/demoRequest.service';
// import { showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// const ViewDemoRequest = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});

//   // Get user name with caching - FIXED
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     // Convert to string for comparison
//     const userIdStr = String(userId); 
//     // Check if name exists in cache 
//     if (userNameCache[userIdStr]) {
//       return userNameCache[userIdStr];
//     }
//     // Try to find user in cache with different key format
//     const keys = Object.keys(userNameCache);
//     for (const key of keys) {
//       if (String(key) === String(userId)) {
//         return userNameCache[key];
//       }
//     }
//     return `User ${userId}`;
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     const colors = {
//       new: "bg-blue-100 text-blue-700",
//       contacted: "bg-yellow-100 text-yellow-700",
//       scheduled: "bg-purple-100 text-purple-700",
//       completed: "bg-green-100 text-green-700",
//       converted: "bg-green-600 text-white",
//       cancelled: "bg-red-100 text-red-700",
//     };
//     const labels = {
//       new: "New",
//       contacted: "Contacted",
//       scheduled: "Scheduled",
//       completed: "Completed",
//       converted: "Converted",
//       cancelled: "Cancelled",
//     };
//     return (
//       <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
//         {labels[status] || status || "New"}
//       </span>
//     );
//   };

//   // Get priority badge
//   const getPriorityBadge = (priority) => {
//     const colors = {
//       low: "bg-gray-100 text-gray-600",
//       medium: "bg-yellow-100 text-yellow-700",
//       high: "bg-red-100 text-red-700",
//     };
//     return (
//       <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[priority] || "bg-gray-100 text-gray-700"}`}>
//         {priority || "Medium"}
//       </span>
//     );
//   };

//   // Get source badge
//   const getSourceBadge = (source) => {
//     const colors = {
//       Website: "bg-blue-100 text-blue-700",
//       Google: "bg-red-100 text-red-700",
//       LinkedIn: "bg-blue-600 text-white",
//       friends: "bg-green-100 text-green-700",
//       socialmedia: "bg-purple-100 text-purple-700",
//       others: "bg-gray-100 text-gray-700",
//     };
//     return (
//       <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[source] || "bg-gray-100 text-gray-700"}`}>
//         {source || "-"}
//       </span>
//     );
//   };

//   // Get hiring frequency badge
//   const getHiringFrequencyBadge = (frequency) => {
//     const colors = {
//       occasional: "bg-gray-100 text-gray-600",
//       monthly: "bg-blue-100 text-blue-700",
//       quarterly: "bg-yellow-100 text-yellow-700",
//       frequent: "bg-red-100 text-red-700",
//     };
//     const labels = {
//       occasional: "Occasional",
//       monthly: "Monthly",
//       quarterly: "Quarterly",
//       frequent: "Frequent",
//     };
//     return (
//       <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[frequency] || "bg-gray-100 text-gray-700"}`}>
//         {labels[frequency] || frequency || "-"}
//       </span>
//     );
//   };

//   // Fetch demo request data
//   useEffect(() => {
//     const fetchDemoRequest = async () => {
//       setLoading(true);
//       try {
//         // ─── Fetch users for name mapping ──────────────────────────
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach(id => {
//           // Store with string key for easy lookup
//           userMap[String(id)] = users[id].name;
//         });
//         setUserNameCache(userMap);
//         console.log('📥 User map loaded:', userMap);

//         const response = await demoRequestService.getById(id);
//         const data = response?.data || response;

//         if (data && data.id) {
//           console.log('📥 Demo request data:', data);
//           console.log('📥 Assigned to ID:', data.assigned_to);
          
//           // ─── Get assigned user name ──────────────────────────────
//           let assignedUserName = "-";
//           if (data.assigned_to) {
//             const userId = String(data.assigned_to);
//             assignedUserName = userMap[userId] || `User ${data.assigned_to}`;
//           }
//           console.log('📥 Assigned user name:', assignedUserName);

//           const formData = {
//             name: data.name || "-",
//             email: data.email || "-",
//             mobile: data.mobile || "-",
//             company_name: data.company_name || "-",
//             designation: data.designation || "-",
//             company_size: data.companySize?.name || "-",
//             industry: data.industry?.name || "-",
//             city: data.city?.name || "-",
//             job_hiring_volume: data.job_hiring_volume || "-",
//             hiring_frequency: getHiringFrequencyBadge(data.hiring_frequency),
//             interested_plan: data.interested_plan || "-",
//             preferred_demo_date: data.preferred_demo_date ? formatDate(data.preferred_demo_date) : "-",
//             preferred_demo_time: data.preferred_demo_time || "-",
//             message: data.message || "-",
//             source: getSourceBadge(data.source),
//             assigned_to: assignedUserName,
//             status: getStatusBadge(data.status),
//             priority: getPriorityBadge(data.priority),
//             admin_remarks: data.admin_remarks || "-",
//             demo_scheduled_at: data.demo_scheduled_at ? formatDate(data.demo_scheduled_at) : "-",
//             demo_completed_at: data.demo_completed_at ? formatDate(data.demo_completed_at) : "-",
//             follow_up_at: data.follow_up_at ? formatDate(data.follow_up_at) : "-",
//             updated_by: data.updated_by || "-",
//             created_at: data.created_at || data.createdAt || null,
//             updated_at: data.updated_at || data.updatedAt || null,
//           };
//           setInitialData(formData);
//           setViewData(data);
//         } else {
//           showError("Demo request not found");
//           navigate('/demo-requests');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load demo request data");
//         navigate('/demo-requests');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchDemoRequest();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/demo-requests/edit/${id}`);
//   };

//   // ─── Helper: Convert 24-hour time to 12-hour AM/PM format ────
//   const formatTimeTo12Hour = (value) => {
//     if (!value) return "—";
//     const parts = value.split(':');
//     if (parts.length < 2) return value;
//     const hour = parseInt(parts[0]);
//     const minutes = parts[1];
//     const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//     const ampm = hour < 12 ? 'AM' : 'PM';
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   // ─── Get updated by name ─────────────────────────────────────────
//   const getUpdatedByName = (value) => {
//     if (!value) return "—";
//     // Check if updatedBy is in the viewData
//     if (viewData?.updatedBy?.name) {
//       return viewData.updatedBy.name;
//     }
//     // Try to get from user map
//     const userId = String(value);
//     return userNameCache[userId] || `User ${value}`;
//   };

//   // Form fields configuration - view only
//   const fields = [
//     {
//       name: "name",
//       label: "Full Name",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <span className="font-medium text-gray-800">{value}</span>,
//     },
//     {
//       name: "email",
//       label: "Email Address",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <span className="text-gray-700">{value}</span>,
//     },
//     {
//       name: "mobile",
//       label: "Mobile Number",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <span className="text-gray-700">{value}</span>,
//     },
//     {
//       name: "company_name",
//       label: "Company Name",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <span className="font-medium text-gray-800">{value}</span>,
//     },
//     {
//       name: "designation",
//       label: "Designation",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "company_size",
//       label: "Company Size",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "industry",
//       label: "Industry",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "city",
//       label: "City",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "job_hiring_volume",
//       label: "Expected Hiring Volume",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "hiring_frequency",
//       label: "Hiring Frequency",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "interested_plan",
//       label: "Interested Plan",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "preferred_demo_date",
//       label: "Preferred Demo Date",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "preferred_demo_time",
//       label: "Preferred Demo Time",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => formatTimeTo12Hour(value),
//     },
//     {
//       name: "message",
//       label: "Message / Requirements",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <div className="whitespace-pre-wrap">{value || "—"}</div>,
//     },
//     {
//       name: "source",
//       label: "Source",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     // ─── FIX: Assigned To - shows name ────────────────────────────
//     {
//       name: "assigned_to",
//       label: "Assigned To",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="text-gray-700 font-medium">{value || "—"}</span>
//       ),
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "priority",
//       label: "Priority",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "admin_remarks",
//       label: "Admin Remarks",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <div className="whitespace-pre-wrap">{value || "—"}</div>,
//     },
//     {
//       name: "demo_scheduled_at",
//       label: "Demo Scheduled At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "demo_completed_at",
//       label: "Demo Completed At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "follow_up_at",
//       label: "Follow-up Date",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value || "—",
//     },
//     {
//       name: "updated_by",
//       label: "Updated By",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const name = viewData?.updatedBy?.name || getUserNameCached(value);
//         return <span className="text-gray-600">{name}</span>;
//       },
//     },
//     {
//       name: "created_at",
//       label: "Created At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => value ? formatDate(value) : "—",
//     },
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
//           <p className="text-sm text-gray-400">Loading demo request details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Demo Request Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/demo-requests"
//       breadcrumb={`Viewing: ${viewData?.name || 'Demo Request'}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Request"
//       cancelLabel="Back to Requests"
//     />
//   );
// };

// export default ViewDemoRequest;

// pages/demo-requests/ViewDemoRequest.jsx
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
  MdBusiness,
  MdWork,
  MdLocationOn,
  MdDateRange,
  MdAccessTime,
  MdMessage,
  MdAssignment,
  MdPriorityHigh,
  MdInfo,
  MdHistory,
  MdCheckCircle,
} from 'react-icons/md';
import { demoRequestService } from '../../services/demoRequest.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

// ─── Helper: Format time to 12-hour AM/PM ──────────────────
const formatTimeTo12Hour = (value) => {
  if (!value) return '—';
  const parts = value.split(':');
  if (parts.length < 2) return value;
  const hour = parseInt(parts[0]);
  const minutes = parts[1];
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${hour12}:${minutes} ${ampm}`;
};

// ─── Badge components ────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    new: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    contacted: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    scheduled: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    converted: 'bg-emerald-600 text-white ring-1 ring-emerald-700',
    cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  };
  const labels = {
    new: 'New',
    contacted: 'Contacted',
    scheduled: 'Scheduled',
    completed: 'Completed',
    converted: 'Converted',
    cancelled: 'Cancelled',
  };
  const cls = colors[status] || 'bg-gray-100 text-gray-700 ring-1 ring-gray-200';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {labels[status] || status || 'New'}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    low: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
    medium: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    high: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  };
  const cls = colors[priority] || colors.medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <MdPriorityHigh size={13} />
      {priority || 'Medium'}
    </span>
  );
};

const SourceBadge = ({ source }) => {
  const colors = {
    Website: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    Google: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    LinkedIn: 'bg-blue-600 text-white ring-1 ring-blue-700',
    friends: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    socialmedia: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    others: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
  };
  const cls = colors[source] || colors.others;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {source || '—'}
    </span>
  );
};

const HiringFrequencyBadge = ({ frequency }) => {
  const colors = {
    occasional: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
    monthly: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    quarterly: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    frequent: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  };
  const labels = {
    occasional: 'Occasional',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    frequent: 'Frequent',
  };
  const cls = colors[frequency] || colors.occasional;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {labels[frequency] || frequency || '—'}
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
const ViewDemoRequest = () => {
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
    const userIdStr = String(userId);
    if (userNameCache[userIdStr]) return userNameCache[userIdStr];
    // Try other key formats
    const keys = Object.keys(userNameCache);
    for (const key of keys) {
      if (String(key) === String(userId)) {
        return userNameCache[key];
      }
    }
    return `User ${userId}`;
  };

  // Fetch demo request data
  useEffect(() => {
    const fetchDemoRequest = async () => {
      setLoading(true);
      try {
        // ─── Fetch users for name mapping ──────────────────────────
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[String(id)] = users[id].name;
        });
        setUserNameCache(userMap);

        const response = await demoRequestService.getById(id);
        const rawData = response?.data || response;

        if (rawData && rawData.id) {
          // Get assigned user name
          let assignedUserName = '—';
          if (rawData.assigned_to) {
            const userId = String(rawData.assigned_to);
            assignedUserName = userMap[userId] || `User ${rawData.assigned_to}`;
          }

          const formatted = {
            name: rawData.name || '—',
            email: rawData.email || '—',
            mobile: rawData.mobile || '—',
            company_name: rawData.company_name || '—',
            designation: rawData.designation || '—',
            company_size: rawData.companySize?.name || '—',
            industry: rawData.industry?.name || '—',
            city: rawData.city?.name || '—',
            job_hiring_volume: rawData.job_hiring_volume || '—',
            hiring_frequency: rawData.hiring_frequency || '—',
            interested_plan: rawData.interested_plan || '—',
            preferred_demo_date: rawData.preferred_demo_date
              ? formatDate(rawData.preferred_demo_date)
              : '—',
            preferred_demo_time: rawData.preferred_demo_time || '—',
            message: rawData.message || '—',
            source: rawData.source || '—',
            assigned_to: assignedUserName,
            status: rawData.status || 'new',
            priority: rawData.priority || 'medium',
            admin_remarks: rawData.admin_remarks || '—',
            demo_scheduled_at: rawData.demo_scheduled_at
              ? formatDate(rawData.demo_scheduled_at)
              : '—',
            demo_completed_at: rawData.demo_completed_at
              ? formatDate(rawData.demo_completed_at)
              : '—',
            follow_up_at: rawData.follow_up_at
              ? formatDate(rawData.follow_up_at)
              : '—',
            created_by: rawData.created_by || '—',
            updated_by: rawData.updated_by || '—',
            created_at: rawData.created_at || rawData.createdAt || null,
            updated_at: rawData.updated_at || rawData.updatedAt || null,
          };
          setData(rawData);
          setFormData(formatted);
        } else {
          showError('Demo request not found');
          navigate('/demo-requests');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load demo request data');
        navigate('/demo-requests');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDemoRequest();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/demo-requests/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/demo-requests');
  };

  // ─── Compute hero data ────────────────────────────────────
  const demoName = formData?.name || 'Demo Request';
  const company = formData?.company_name || '—';
  const email = formData?.email || '—';
  const mobile = formData?.mobile || '—';
  const status = formData?.status || 'new';
  const priority = formData?.priority || 'medium';
  const source = formData?.source || '—';
  const assignedTo = formData?.assigned_to || 'Unassigned';
  const preferredDate = formData?.preferred_demo_date || '—';
  const preferredTime = formData?.preferred_demo_time || '—';

  const initials = demoName
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
            {/* ─── Contact & Company Info ──────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdPerson size={16} />
                  Contact & Company Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel>Full Name</FieldLabel>
                    <ReadOnlyValue>
                      <span className="font-medium text-slate-800">{formData?.name}</span>
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Email Address</FieldLabel>
                    <ReadOnlyValue>
                      <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                        {email}
                      </a>
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Mobile Number</FieldLabel>
                    <ReadOnlyValue>
                      <a href={`tel:${mobile}`} className="hover:text-blue-600">
                        {mobile}
                      </a>
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Company Name</FieldLabel>
                    <ReadOnlyValue>
                      <span className="font-medium text-slate-800">{company}</span>
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Designation</FieldLabel>
                    <ReadOnlyValue>{formData?.designation || '—'}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Company Size</FieldLabel>
                    <ReadOnlyValue>{formData?.company_size}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Industry</FieldLabel>
                    <ReadOnlyValue>{formData?.industry}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <ReadOnlyValue>{formData?.city}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Expected Hiring Volume</FieldLabel>
                    <ReadOnlyValue>{formData?.job_hiring_volume}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Hiring Frequency</FieldLabel>
                    <ReadOnlyValue>
                      <HiringFrequencyBadge frequency={formData?.hiring_frequency} />
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Interested Plan</FieldLabel>
                    <ReadOnlyValue>{formData?.interested_plan}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Source</FieldLabel>
                    <ReadOnlyValue>
                      <SourceBadge source={formData?.source} />
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Preferred Demo Date</FieldLabel>
                    <ReadOnlyValue>{preferredDate}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Preferred Demo Time</FieldLabel>
                    <ReadOnlyValue>{formatTimeTo12Hour(preferredTime)}</ReadOnlyValue>
                  </div>
                </div>
                <div>
                  <FieldLabel>Message / Requirements</FieldLabel>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {formData?.message || '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Admin Details ────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdAssignment size={16} />
                  Admin Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <ReadOnlyValue>
                      <StatusBadge status={status} />
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Priority</FieldLabel>
                    <ReadOnlyValue>
                      <PriorityBadge priority={priority} />
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Assigned To</FieldLabel>
                    <ReadOnlyValue>
                      <span className="font-medium text-slate-700">{assignedTo}</span>
                    </ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Demo Scheduled At</FieldLabel>
                    <ReadOnlyValue>{formData?.demo_scheduled_at}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Demo Completed At</FieldLabel>
                    <ReadOnlyValue>{formData?.demo_completed_at}</ReadOnlyValue>
                  </div>
                  <div>
                    <FieldLabel>Follow-up Date</FieldLabel>
                    <ReadOnlyValue>{formData?.follow_up_at}</ReadOnlyValue>
                  </div>
                </div>
                <div>
                  <FieldLabel>Admin Remarks</FieldLabel>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap bg-purple-50 p-4 rounded-lg border border-purple-100">
                    {formData?.admin_remarks || '—'}
                  </div>
                </div>
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
                  <MdAccessTime size={16} />
                  Timeline
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <FieldLabel>Created By</FieldLabel>
                  <ReadOnlyValue>
                    {data?.created_by
                      ? getUserNameCached(data.created_by)
                      : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>
                    {data?.created_at ? formatDate(data.created_at) : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated By</FieldLabel>
                  <ReadOnlyValue>
                    {data?.updated_by
                      ? getUserNameCached(data.updated_by)
                      : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated At</FieldLabel>
                  <ReadOnlyValue>
                    {data?.updated_at ? formatDate(data.updated_at) : '—'}
                  </ReadOnlyValue>
                </div>
                {data?.demo_scheduled_at && (
                  <div>
                    <FieldLabel>Demo Scheduled At</FieldLabel>
                    <div className="text-sm text-purple-700 py-2 px-3 bg-purple-50 rounded-lg border border-purple-200 flex items-center gap-2">
                      <MdDateRange size={16} className="text-purple-500" />
                      {formatDate(data.demo_scheduled_at)}
                    </div>
                  </div>
                )}
                {data?.demo_completed_at && (
                  <div>
                    <FieldLabel>Demo Completed At</FieldLabel>
                    <div className="text-sm text-emerald-700 py-2 px-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                      <MdCheckCircle size={16} className="text-emerald-500" />
                      {formatDate(data.demo_completed_at)}
                    </div>
                  </div>
                )}
              </div>
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
          <p className="text-sm text-slate-400">Loading demo request details...</p>
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
              <p className="text-[11px] text-slate-400 leading-tight">Demo Requests</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {demoName}
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
              Edit Request
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
                    {demoName}
                  </h1>
                  <StatusBadge status={status} />
                  <PriorityBadge priority={priority} />
                  <SourceBadge source={source} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70">{company}</span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdEmail size={12} /> {email}
                  </span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdPhone size={12} /> {mobile}
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
            <MdAssignment size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Assigned To</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{assignedTo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Preferred Demo</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {preferredDate} {preferredTime !== '—' ? formatTimeTo12Hour(preferredTime) : ''}
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
                    active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="demo-view-tab-underline"
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
          Back to Requests
        </button>
      </div>
    </div>
  );
};

export default ViewDemoRequest;