// // pages/demo-requests/EditDemoRequest.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { demoRequestService, toDatetimeLocalInput, toDateInput } from '../../services/demoRequest.service';
// import { showSuccess, showError } from '../../utils/toast';
// import api from '../../services/axiosInstance';

// // ─── FIX: defensive extraction that handles several common response shapes
// // ({data:[...]}, {results:[...]}, {data:{data:[...]}}, or a bare array).
// // If a dropdown still shows empty after this, check the console log this
// // prints for each endpoint — it means the endpoint path itself or the
// // response shape is different from what's handled here.
// const extractArray = (res, label) => {
//     const d = res?.data;
//     let arr = [];
//     if (Array.isArray(d)) arr = d;
//     else if (Array.isArray(d?.data)) arr = d.data;
//     else if (Array.isArray(d?.results)) arr = d.results;
//     else if (Array.isArray(d?.data?.data)) arr = d.data.data;
//     else if (Array.isArray(d?.data?.results)) arr = d.data.results;

//     console.log(`📥 [${label}] raw response:`, d, '→ extracted', arr.length, 'items');
//     return arr;
// };

// const EditDemoRequest = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [companySizes, setCompanySizes] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [subscriptionPlans, setSubscriptionPlans] = useState([]);

//   // Load dropdown data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [sizesRes, industriesRes, citiesRes, usersRes, plansRes] = await Promise.all([
//           api.get('/company-sizes'),
//           api.get('/industry'),
//           api.get('/cities'),
//           api.get('/user'),
//           api.get('/subscription-plans')
//         ]);

//         setCompanySizes(extractArray(sizesRes, 'company-sizes'));
//         setIndustries(extractArray(industriesRes, 'industry'));
//         setCities(extractArray(citiesRes, 'cities'));
//         setUsers(extractArray(usersRes, 'user'));
//         setSubscriptionPlans(extractArray(plansRes, 'subscription-plans'));
//       } catch (error) {
//         console.error('Error loading dropdown data:', error);
//       }
//     };
//     loadData();
//   }, []);

//   // Fetch demo request data
//   useEffect(() => {
//     const fetchDemoRequest = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await demoRequestService.getById(id);
//         const data = response?.data || response;

//         if (data) {
//           const formData = {
//             name: data.name || "",
//             email: data.email || "",
//             mobile: data.mobile || "",
//             company_name: data.company_name || "",
//             designation: data.designation || "",
//             company_size_id: data.company_size_id ? String(data.company_size_id) : "",
//             industry_id: data.industry_id ? String(data.industry_id) : "",
//             city_id: data.city_id ? String(data.city_id) : "",
//             job_hiring_volume: data.job_hiring_volume || "",
//             hiring_frequency: data.hiring_frequency || "",
//             interested_plan: data.interested_plan || "",
//             // FIX: convert ISO -> "YYYY-MM-DD" for <input type="date">
//             preferred_demo_date: toDateInput(data.preferred_demo_date),
//             preferred_demo_time: data.preferred_demo_time || "",
//             message: data.message || "",
//             source: data.source || "",
//             assigned_to: data.assigned_to ? String(data.assigned_to) : "",
//             status: data.status || "new",
//             priority: data.priority || "medium",
//             admin_remarks: data.admin_remarks || "",
//             // FIX: convert ISO -> "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
//             demo_scheduled_at: toDatetimeLocalInput(data.demo_scheduled_at),
//             demo_completed_at: toDatetimeLocalInput(data.demo_completed_at),
//             follow_up_at: toDatetimeLocalInput(data.follow_up_at),
//           };
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("Demo request not found");
//           navigate('/demo-requests');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load demo request data");
//         navigate('/demo-requests');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchDemoRequest();
//     }
//   }, [id, navigate]);

//   // Form fields configuration with searchable selects
//   const fields = [
//     {
//       name: "name",
//       label: "Full Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. John Doe",
//       help: "Enter the contact person's full name",
//     },
//     {
//       name: "email",
//       label: "Email Address",
//       type: "email",
//       required: true,
//       placeholder: "e.g. john@company.com",
//       help: "Enter the business email address",
//     },
//     {
//       name: "mobile",
//       label: "Mobile Number",
//       type: "text",
//       required: true,
//       placeholder: "e.g. 9876543210",
//       help: "Enter the contact number",
//     },
//     {
//       name: "company_name",
//       label: "Company Name",
//       type: "text",
//       required: true,
//       placeholder: "e.g. Tech Solutions Pvt Ltd",
//       help: "Enter the company name",
//     },
//     {
//       name: "designation",
//       label: "Designation",
//       type: "text",
//       required: false,
//       placeholder: "e.g. HR Manager, Recruiter, Founder",
//       help: "Enter the person's designation",
//     },
//     {
//       name: "company_size_id",
//       label: "Company Size",
//       type: "select",
//       required: false,
//       options: [
//         { value: "", label: "Select Company Size" },
//         ...companySizes.map((size) => ({
//           value: String(size.id || size._id),
//           label: size.name || size.size_name || `Size ${size.id}`,
//         }))
//       ],
//       placeholder: "Select company size",
//       help: "Select the company size range",
//       searchable: true,
//     },
//     {
//       name: "industry_id",
//       label: "Industry",
//       type: "select",
//       required: false,
//       options: [
//         { value: "", label: "Select Industry" },
//         ...industries.map((industry) => ({
//           value: String(industry.id || industry._id),
//           label: industry.name || industry.industry_name || `Industry ${industry.id}`,
//         }))
//       ],
//       placeholder: "Select industry",
//       help: "Select the industry",
//       searchable: true,
//     },
//     {
//       name: "city_id",
//       label: "City",
//       type: "select",
//       required: false,
//       options: [
//         { value: "", label: "Select City" },
//         ...cities.map((city) => ({
//           value: String(city.id || city._id),
//           label: city.name || city.city_name || `City ${city.id}`,
//         }))
//       ],
//       placeholder: "Select city",
//       help: "Select the company location city",
//       searchable: true,
//     },
//     {
//       name: "job_hiring_volume",
//       label: "Expected Hiring Volume",
//       type: "number",
//       required: false,
//       placeholder: "e.g. 10",
//       help: "Enter the expected number of hires",
//       min: 0,
//       step: 1,
//     },
//     {
//       name: "hiring_frequency",
//       label: "Hiring Frequency",
//       type: "select",
//       required: false,
//       options: [
//         { value: "", label: "Select Frequency" },
//         { value: "occasional", label: "Occasional" },
//         { value: "monthly", label: "Monthly" },
//         { value: "quarterly", label: "Quarterly" },
//         { value: "frequent", label: "Frequent" },
//       ],
//       placeholder: "Select hiring frequency",
//       help: "Select how often you hire",
//     },
//     {
//       name: "interested_plan",
//       label: "Interested Plan",
//       type: "select",
//       required: false,
//       options: [
//         { value: "", label: "Select Plan" },
//         ...subscriptionPlans.map((plan) => ({
//           value: plan.plan_name || `Plan ${plan.id}`,
//           label: plan.plan_name ? `${plan.plan_name} (₹${plan.price || 0})` : `Plan ${plan.id}`,
//         }))
//       ],
//       placeholder: "Select plan",
//       help: "Select the subscription plan the customer is interested in",
//       searchable: true,
//     },
//     {
//       name: "preferred_demo_date",
//       label: "Preferred Demo Date",
//       type: "date",
//       required: false,
//       help: "Select the preferred date for the demo",
//     },
//     {
//       name: "preferred_demo_time",
//       label: "Preferred Demo Time",
//       type: "text",
//       required: false,
//       placeholder: "e.g. 10:00 AM, 14:30",
//       help: "Enter the preferred time for the demo",
//     },
//     {
//       name: "message",
//       label: "Message / Requirements",
//       type: "textarea",
//       required: false,
//       placeholder: "Describe any specific requirements...",
//       rows: 3,
//       help: "Additional requirements or notes",
//     },
//     {
//       name: "source",
//       label: "Source",
//       type: "select",
//       required: false,
//       options: [
//         { value: "", label: "Select Source" },
//         { value: "Website", label: "Website" },
//         { value: "Google", label: "Google" },
//         { value: "LinkedIn", label: "LinkedIn" },
//         { value: "friends", label: "Friends/Referral" },
//         { value: "socialmedia", label: "Social Media" },
//         { value: "others", label: "Others" },
//       ],
//       placeholder: "Select source",
//       help: "How did the customer find us?",
//     },
//     {
//       name: "assigned_to",
//       label: "Assigned To",
//       type: "select",
//       required: false,
//       options: [
//         { value: "", label: "Assign to..." },
//         ...users.map((user) => ({
//           value: String(user.id || user._id),
//           label: user.name || `User ${user.id}`,
//         }))
//       ],
//       placeholder: "Select user",
//       help: "Assign this demo request to a team member",
//       searchable: true,
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "select",
//       required: true,
//       options: [
//         { value: "new", label: "New" },
//         { value: "contacted", label: "Contacted" },
//         { value: "scheduled", label: "Scheduled" },
//         { value: "completed", label: "Completed" },
//         { value: "converted", label: "Converted" },
//         { value: "cancelled", label: "Cancelled" },
//       ],
//       placeholder: "Select status",
//       help: "Select the current status",
//     },
//     {
//       name: "priority",
//       label: "Priority",
//       type: "select",
//       required: false,
//       options: [
//         { value: "low", label: "Low" },
//         { value: "medium", label: "Medium" },
//         { value: "high", label: "High" },
//       ],
//       placeholder: "Select priority",
//       help: "Select the priority level",
//     },
//     {
//       name: "admin_remarks",
//       label: "Admin Remarks",
//       type: "textarea",
//       required: false,
//       placeholder: "Internal notes...",
//       rows: 2,
//       help: "Internal remarks or notes",
//     },
//     {
//       name: "demo_scheduled_at",
//       label: "Demo Scheduled At",
//       type: "datetime-local",
//       required: false,
//       help: "Set the actual scheduled date and time",
//     },
//     {
//       name: "demo_completed_at",
//       label: "Demo Completed At",
//       type: "datetime-local",
//       required: false,
//       help: "Set the demo completion date and time",
//     },
//     {
//       name: "follow_up_at",
//       label: "Follow-up Date",
//       type: "datetime-local",
//       required: false,
//       help: "Set the next follow-up date and time",
//     },
//   ];

//   // Validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: "Name is required",
//       minLength: 2,
//       minLengthMessage: "Name must be at least 2 characters",
//       maxLength: 150,
//       maxLengthMessage: "Name must be at most 150 characters",
//     },
//     email: {
//       required: true,
//       requiredMessage: "Email is required",
//       pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//       patternMessage: "Please enter a valid email address",
//     },
//     mobile: {
//       required: true,
//       requiredMessage: "Mobile number is required",
//       minLength: 10,
//       minLengthMessage: "Mobile number must be at least 10 digits",
//       maxLength: 20,
//       maxLengthMessage: "Mobile number must be at most 20 digits",
//     },
//     company_name: {
//       required: true,
//       requiredMessage: "Company name is required",
//       maxLength: 255,
//       maxLengthMessage: "Company name must be at most 255 characters",
//     },
//     job_hiring_volume: {
//       custom: (value) => {
//         if (value && value !== "" && (isNaN(Number(value)) || Number(value) < 0)) {
//           return "Please enter a valid number";
//         }
//         return null;
//       },
//     },
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       await demoRequestService.update(id, formData);
//       showSuccess("Demo request updated successfully");
//       navigate('/demo-requests');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update demo request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await demoRequestService.delete(id);
//       showSuccess("Demo request deleted successfully");
//       navigate('/demo-requests');
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this request because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete request");
//       }
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading demo request data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Demo Request"
//       mode="edit"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/demo-requests"
//       breadcrumb={`Editing: ${editItem?.name || 'Demo Request'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditDemoRequest;

// pages/demo-requests/EditDemoRequest.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdWarning,
  MdClose,
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
import { demoRequestService, toDatetimeLocalInput, toDateInput } from '../../services/demoRequest.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import api from '../../services/axiosInstance';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { fetchUsers } from '../../utils/getUserName';

// ─── FIX: defensive extraction that handles several common response shapes ──
const extractArray = (res, label) => {
  const d = res?.data;
  let arr = [];
  if (Array.isArray(d)) arr = d;
  else if (Array.isArray(d?.data)) arr = d.data;
  else if (Array.isArray(d?.results)) arr = d.results;
  else if (Array.isArray(d?.data?.data)) arr = d.data.data;
  else if (Array.isArray(d?.data?.results)) arr = d.data.results;

  console.log(`📥 [${label}] raw response:`, d, '→ extracted', arr.length, 'items');
  return arr;
};

// ─── Badge components (for hero and stats) ──────────────────────
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

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

// ─── Main Component ──────────────────────────────────────────
const EditDemoRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Dropdown data
  const [companySizes, setCompanySizes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [userNameCache, setUserNameCache] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    company_name: '',
    designation: '',
    company_size_id: '',
    industry_id: '',
    city_id: '',
    job_hiring_volume: '',
    hiring_frequency: '',
    interested_plan: '',
    preferred_demo_date: '',
    preferred_demo_time: '',
    message: '',
    source: '',
    assigned_to: '',
    status: 'new',
    priority: 'medium',
    admin_remarks: '',
    demo_scheduled_at: '',
    demo_completed_at: '',
    follow_up_at: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [initialData, setInitialData] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // ─── Load dropdown data ──────────────────────────────────────
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [sizesRes, industriesRes, citiesRes, usersRes, plansRes] = await Promise.all([
          api.get('/company-sizes'),
          api.get('/industry'),
          api.get('/cities'),
          api.get('/user'),
          api.get('/subscription-plans')
        ]);

        setCompanySizes(extractArray(sizesRes, 'company-sizes'));
        setIndustries(extractArray(industriesRes, 'industry'));
        setCities(extractArray(citiesRes, 'cities'));
        setUsers(extractArray(usersRes, 'user'));
        setSubscriptionPlans(extractArray(plansRes, 'subscription-plans'));
      } catch (error) {
        console.error('Error loading dropdown data:', error);
      }
    };
    loadDropdowns();
  }, []);

  // ─── Load users for name mapping ──────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[String(id)] = users[id].name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);

  // ─── Fetch demo request data ──────────────────────────────────
  useEffect(() => {
    const fetchDemoRequest = async () => {
      setFetchLoading(true);
      try {
        const response = await demoRequestService.getById(id);
        const data = response?.data || response;

        if (data) {
          const formData = {
            name: data.name || '',
            email: data.email || '',
            mobile: data.mobile || '',
            company_name: data.company_name || '',
            designation: data.designation || '',
            company_size_id: data.company_size_id ? String(data.company_size_id) : '',
            industry_id: data.industry_id ? String(data.industry_id) : '',
            city_id: data.city_id ? String(data.city_id) : '',
            job_hiring_volume: data.job_hiring_volume || '',
            hiring_frequency: data.hiring_frequency || '',
            interested_plan: data.interested_plan || '',
            preferred_demo_date: toDateInput(data.preferred_demo_date),
            preferred_demo_time: data.preferred_demo_time || '',
            message: data.message || '',
            source: data.source || '',
            assigned_to: data.assigned_to ? String(data.assigned_to) : '',
            status: data.status || 'new',
            priority: data.priority || 'medium',
            admin_remarks: data.admin_remarks || '',
            demo_scheduled_at: toDatetimeLocalInput(data.demo_scheduled_at),
            demo_completed_at: toDatetimeLocalInput(data.demo_completed_at),
            follow_up_at: toDatetimeLocalInput(data.follow_up_at),
          };
          setFormData(formData);
          setInitialData(formData);
          setEditItem(data);
        } else {
          showError('Demo request not found');
          navigate('/demo-requests');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load demo request data');
        navigate('/demo-requests');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchDemoRequest();
    }
  }, [id, navigate]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 150) return 'Name must be at most 150 characters';
        return null;
      case 'email':
        if (!value || !value.trim()) return 'Email is required';
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        return null;
      case 'mobile':
        if (!value || !value.trim()) return 'Mobile number is required';
        if (value.trim().length < 10) return 'Mobile number must be at least 10 digits';
        if (value.trim().length > 20) return 'Mobile number must be at most 20 digits';
        return null;
      case 'company_name':
        if (!value || !value.trim()) return 'Company name is required';
        if (value.trim().length > 255) return 'Company name must be at most 255 characters';
        return null;
      case 'job_hiring_volume':
        if (value && value !== '' && (isNaN(Number(value)) || Number(value) < 0)) {
          return 'Please enter a valid number';
        }
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'email', 'mobile', 'company_name'];
    let isValid = true;

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Optional fields with validation
    const optionalFields = ['job_hiring_volume'];
    optionalFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  // ─── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Please fix validation errors');
      return;
    }

    setLoading(true);
    try {
      await demoRequestService.update(id, formData);
      showSuccess('Demo request updated successfully');
      navigate('/demo-requests');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || 'Failed to update demo request');
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await demoRequestService.delete(id);
      showSuccess('Demo request deleted successfully');
      navigate('/demo-requests');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || '';
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError('Cannot delete this request because it is being used in other records.');
      } else {
        showError(message || 'Failed to delete request');
      }
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => navigate('/demo-requests');

  // ─── Helper to render fields ──────────────────────────────────
  const renderField = (field) => {
    const { name, label, type, required, options, placeholder, help, rows, min, max, step } = field;
    const value = formData[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const hasError = isTouched && error;

    const commonClass = `w-full px-3.5 py-2.5 border ${hasError ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    let inputElement;
    switch (type) {
      case 'select':
        inputElement = (
          <select
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={commonClass}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
        break;
      case 'textarea':
        inputElement = (
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={rows || 3}
            placeholder={placeholder}
            className={`${commonClass} resize-y`}
          />
        );
        break;
      case 'number':
        inputElement = (
          <input
            type="number"
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={commonClass}
          />
        );
        break;
      case 'date':
        inputElement = (
          <input
            type="date"
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={commonClass}
          />
        );
        break;
      case 'datetime-local':
        inputElement = (
          <input
            type="datetime-local"
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={commonClass}
          />
        );
        break;
      default:
        inputElement = (
          <input
            type={type || 'text'}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={commonClass}
          />
        );
    }

    return (
      <div key={name} className="mb-4">
        <FieldLabel required={required}>{label}</FieldLabel>
        {inputElement}
        {help && !hasError && <p className="mt-1 text-xs text-slate-400">{help}</p>}
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  };

  // ─── Compute hero data ────────────────────────────────────
  const demoName = formData.name?.trim() || 'Demo Request';
  const company = formData.company_name || '—';
  const email = formData.email || '—';
  const mobile = formData.mobile || '—';
  const status = formData.status || 'new';
  const priority = formData.priority || 'medium';
  const source = formData.source || '—';
  const assignedTo = formData.assigned_to
    ? users.find((u) => String(u.id || u._id) === String(formData.assigned_to))?.name ||
      userNameCache[String(formData.assigned_to)] ||
      `User ${formData.assigned_to}`
    : 'Unassigned';
  const preferredDate = formData.preferred_demo_date ? formatDate(formData.preferred_demo_date) : '—';
  const preferredTime = formData.preferred_demo_time || '—';

  const initials = demoName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Field definitions ──────────────────────────────────────
  const allFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. John Doe',
      help: 'Enter the contact person\'s full name',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'e.g. john@company.com',
      help: 'Enter the business email address',
    },
    {
      name: 'mobile',
      label: 'Mobile Number',
      type: 'text',
      required: true,
      placeholder: 'e.g. 9876543210',
      help: 'Enter the contact number',
    },
    {
      name: 'company_name',
      label: 'Company Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Tech Solutions Pvt Ltd',
      help: 'Enter the company name',
    },
    {
      name: 'designation',
      label: 'Designation',
      type: 'text',
      required: false,
      placeholder: 'e.g. HR Manager, Recruiter, Founder',
      help: 'Enter the person\'s designation',
    },
    {
      name: 'company_size_id',
      label: 'Company Size',
      type: 'select',
      required: false,
      options: [
        { value: '', label: 'Select Company Size' },
        ...companySizes.map((size) => ({
          value: String(size.id || size._id),
          label: size.name || size.size_name || `Size ${size.id}`,
        })),
      ],
      placeholder: 'Select company size',
      help: 'Select the company size range',
    },
    {
      name: 'industry_id',
      label: 'Industry',
      type: 'select',
      required: false,
      options: [
        { value: '', label: 'Select Industry' },
        ...industries.map((industry) => ({
          value: String(industry.id || industry._id),
          label: industry.name || industry.industry_name || `Industry ${industry.id}`,
        })),
      ],
      placeholder: 'Select industry',
      help: 'Select the industry',
    },
    {
      name: 'city_id',
      label: 'City',
      type: 'select',
      required: false,
      options: [
        { value: '', label: 'Select City' },
        ...cities.map((city) => ({
          value: String(city.id || city._id),
          label: city.name || city.city_name || `City ${city.id}`,
        })),
      ],
      placeholder: 'Select city',
      help: 'Select the company location city',
    },
    {
      name: 'job_hiring_volume',
      label: 'Expected Hiring Volume',
      type: 'number',
      required: false,
      placeholder: 'e.g. 10',
      help: 'Enter the expected number of hires',
      min: 0,
      step: 1,
    },
    {
      name: 'hiring_frequency',
      label: 'Hiring Frequency',
      type: 'select',
      required: false,
      options: [
        { value: '', label: 'Select Frequency' },
        { value: 'occasional', label: 'Occasional' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'frequent', label: 'Frequent' },
      ],
      placeholder: 'Select hiring frequency',
      help: 'Select how often you hire',
    },
    {
      name: 'interested_plan',
      label: 'Interested Plan',
      type: 'select',
      required: false,
      options: [
        { value: '', label: 'Select Plan' },
        ...subscriptionPlans.map((plan) => ({
          value: plan.plan_name || `Plan ${plan.id}`,
          label: plan.plan_name ? `${plan.plan_name} (₹${plan.price || 0})` : `Plan ${plan.id}`,
        })),
      ],
      placeholder: 'Select plan',
      help: 'Select the subscription plan the customer is interested in',
    },
    {
      name: 'preferred_demo_date',
      label: 'Preferred Demo Date',
      type: 'date',
      required: false,
      help: 'Select the preferred date for the demo',
    },
    {
      name: 'preferred_demo_time',
      label: 'Preferred Demo Time',
      type: 'text',
      required: false,
      placeholder: 'e.g. 10:00 AM, 14:30',
      help: 'Enter the preferred time for the demo',
    },
    {
      name: 'message',
      label: 'Message / Requirements',
      type: 'textarea',
      required: false,
      placeholder: 'Describe any specific requirements...',
      rows: 3,
      help: 'Additional requirements or notes',
    },
    {
      name: 'source',
      label: 'Source',
      type: 'select',
      required: false,
      options: [
        { value: '', label: 'Select Source' },
        { value: 'Website', label: 'Website' },
        { value: 'Google', label: 'Google' },
        { value: 'LinkedIn', label: 'LinkedIn' },
        { value: 'friends', label: 'Friends/Referral' },
        { value: 'socialmedia', label: 'Social Media' },
        { value: 'others', label: 'Others' },
      ],
      placeholder: 'Select source',
      help: 'How did the customer find us?',
    },
    {
      name: 'assigned_to',
      label: 'Assigned To',
      type: 'select',
      required: false,
      options: [
        { value: '', label: 'Assign to...' },
        ...users.map((user) => ({
          value: String(user.id || user._id),
          label: user.name || `User ${user.id}`,
        })),
      ],
      placeholder: 'Select user',
      help: 'Assign this demo request to a team member',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'new', label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
        { value: 'converted', label: 'Converted' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
      placeholder: 'Select status',
      help: 'Select the current status',
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      required: false,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ],
      placeholder: 'Select priority',
      help: 'Select the priority level',
    },
    {
      name: 'admin_remarks',
      label: 'Admin Remarks',
      type: 'textarea',
      required: false,
      placeholder: 'Internal notes...',
      rows: 2,
      help: 'Internal remarks or notes',
    },
    {
      name: 'demo_scheduled_at',
      label: 'Demo Scheduled At',
      type: 'datetime-local',
      required: false,
      help: 'Set the actual scheduled date and time',
    },
    {
      name: 'demo_completed_at',
      label: 'Demo Completed At',
      type: 'datetime-local',
      required: false,
      help: 'Set the demo completion date and time',
    },
    {
      name: 'follow_up_at',
      label: 'Follow-up Date',
      type: 'datetime-local',
      required: false,
      help: 'Set the next follow-up date and time',
    },
  ];

  // ─── Loading state ─────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading demo request data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  // ─── Tabs ──────────────────────────────────────────────────────
  const TABS = [
    { id: 'overview', label: 'Overview', icon: MdInfo },
    { id: 'activity', label: 'Activity', icon: MdHistory },
  ];

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
                Edit: {demoName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete"
              title="Delete request"
            >
              <MdDelete size={19} />
            </button>
            <button
              type="button"
              onClick={handleBack}
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
              {loading ? 'Updating...' : 'Update Request'}
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
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800">
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
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdPerson size={24} />}
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
                {preferredDate} {preferredTime !== '—' ? preferredTime : ''}
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
                      layoutId="edit-demo-tab-underline"
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
                {activeTab === 'overview' && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {allFields.map((field) => (
                        <div
                          key={field.name}
                          className={
                            field.type === 'textarea' ||
                            field.type === 'datetime-local' ||
                            ['message', 'admin_remarks', 'demo_scheduled_at', 'demo_completed_at', 'follow_up_at'].includes(
                              field.name
                            )
                              ? 'sm:col-span-2'
                              : ''
                          }
                        >
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 px-4 rounded-lg transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 shadow-sm shadow-blue-600/20"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          'Update Request'
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                          <MdAccessTime size={16} />
                          Timeline
                        </h2>
                      </div>
                      <div className="p-6 space-y-5">
                        <div>
                          <FieldLabel>Created By</FieldLabel>
                          <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                            {editItem?.created_by ? (userNameCache[String(editItem.created_by)] || `User ${editItem.created_by}`) : '—'}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Created At</FieldLabel>
                          <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                            {editItem?.created_at ? formatDate(editItem.created_at) : '—'}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Last Updated By</FieldLabel>
                          <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                            {editItem?.updated_by ? (userNameCache[String(editItem.updated_by)] || `User ${editItem.updated_by}`) : '—'}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Last Updated At</FieldLabel>
                          <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                            {editItem?.updated_at ? formatDate(editItem.updated_at) : '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={handleBack}
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
        title="Delete Demo Request"
        message={`Delete demo request from "${demoName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EditDemoRequest;