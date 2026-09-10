// // pages/demo-requests/AddDemoRequest.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import { demoRequestService } from "../../services/demoRequest.service";
// import { showSuccess, showError } from "../../utils/toast";
// import api from "../../services/axiosInstance";

// // ─── FIX: defensive extraction that handles several common response shapes
// // ({data:[...]}, {results:[...]}, {data:{data:[...]}}, or a bare array).
// // If a dropdown still shows empty after this, check the console log this
// // prints for each endpoint — it means the endpoint path itself or the
// // response shape is different from what's handled here.
// const extractArray = (res, label) => {
//   const d = res?.data;
//   let arr = [];
//   if (Array.isArray(d)) arr = d;
//   else if (Array.isArray(d?.data)) arr = d.data;
//   else if (Array.isArray(d?.results)) arr = d.results;
//   else if (Array.isArray(d?.data?.data)) arr = d.data.data;
//   else if (Array.isArray(d?.data?.results)) arr = d.data.results;

//   console.log(
//     `📥 [${label}] raw response:`,
//     d,
//     "→ extracted",
//     arr.length,
//     "items",
//   );
//   return arr;
// };

// // ─── Searchable Select Component ──────────────────────────────
// const SearchableSelect = ({
//   options,
//   value,
//   onChange,
//   placeholder,
//   label,
//   ...props
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   const filteredOptions = useMemo(() => {
//     if (!searchTerm) return options;
//     return options.filter((option) =>
//       option.label.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   }, [options, searchTerm]);

//   const selectedOption = options.find((opt) => opt.value === value);

//   return (
//     <div className="relative">
//       <label className="block text-sm font-medium text-gray-700 mb-1.5">
//         {label}
//       </label>
//       <div
//         className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer hover:border-gray-300 transition-colors flex items-center justify-between"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
//           {selectedOption ? selectedOption.label : placeholder || "Select..."}
//         </span>
//         <svg
//           className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//           <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
//             <input
//               type="text"
//               className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4529f7]"
//               placeholder={`Search ${label.toLowerCase()}...`}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//           {filteredOptions.length === 0 ? (
//             <div className="p-3 text-sm text-gray-400 text-center">
//               No options found
//             </div>
//           ) : (
//             filteredOptions.map((option) => (
//               <div
//                 key={option.value}
//                 className="px-3.5 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-2"
//                 onClick={() => {
//                   onChange(option.value);
//                   setIsOpen(false);
//                   setSearchTerm("");
//                 }}
//               >
//                 {option.value === value && (
//                   <svg
//                     className="w-4 h-4 text-[#2c0eee]"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 )}
//                 <span
//                   className={
//                     option.value === value
//                       ? "font-medium text-[#2c0eee]"
//                       : "text-gray-700"
//                   }
//                 >
//                   {option.label}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const AddDemoRequest = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [companySizes, setCompanySizes] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [subscriptionPlans, setSubscriptionPlans] = useState([]);

//   // Load dropdown data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [sizesRes, industriesRes, citiesRes, usersRes, plansRes] =
//           await Promise.all([
//             api.get("/company-sizes"),
//             api.get("/industry"),
//             api.get("/cities"),
//             api.get("/user"),
//             api.get("/subscription-plans"),
//           ]);

//         setCompanySizes(extractArray(sizesRes, "company-sizes"));
//         setIndustries(extractArray(industriesRes, "industry"));
//         setCities(extractArray(citiesRes, "cities"));
//         setUsers(extractArray(usersRes, "user"));
//         setSubscriptionPlans(extractArray(plansRes, "subscription-plans"));
//       } catch (error) {
//         console.error("Error loading dropdown data:", error);
//       }
//     };
//     loadData();
//   }, []);

//   // ─── Helper: Get today's date in YYYY-MM-DD format ──────────
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };

//   // ─── Helper: Get today's date in YYYY-MM-DDTHH:mm format ────
//   const getTodayDateTime = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const day = String(now.getDate()).padStart(2, "0");
//     const hours = String(now.getHours()).padStart(2, "0");
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   };

//   // ─── Form fields configuration ──────────────────────────────
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
//         ...companySizes.map((size) => ({
//           value: String(size.id || size._id),
//           label: size.name || size.size_name || `Size ${size.id}`,
//         })),
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
//         ...industries.map((industry) => ({
//           value: String(industry.id || industry._id),
//           label:
//             industry.name ||
//             industry.industry_name ||
//             `Industry ${industry.id}`,
//         })),
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
//         ...cities.map((city) => ({
//           value: String(city.id || city._id),
//           label: city.name || city.city_name || `City ${city.id}`,
//         })),
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
//         ...subscriptionPlans.map((plan) => ({
//           value: plan.plan_name || `Plan ${plan.id}`,
//           label: plan.plan_name
//             ? `${plan.plan_name} (₹${plan.price || 0})`
//             : `Plan ${plan.id}`,
//         })),
//       ],
//       placeholder: "Select plan",
//       help: "Select the subscription plan the customer is interested in",
//       searchable: true,
//     },
//     // ─── DATE FIELD WITH MIN DATE ──────────────────────────────────
//     {
//       name: "preferred_demo_date",
//       label: "Preferred Demo Date",
//       type: "date",
//       required: false,
//       min: getTodayDate(), // ─── Cannot select date before today ───
//       help: "Select the preferred date for the demo (cannot be before today)",
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
//         ...users.map((user) => ({
//           value: String(user.id || user._id),
//           label: user.name || `User ${user.id}`,
//         })),
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
//     // ─── DATETIME FIELDS WITH MIN DATE ────────────────────────────
//     {
//       name: "demo_scheduled_at",
//       label: "Demo Scheduled At",
//       type: "datetime-local",
//       required: false,
//       min: getTodayDateTime(), // ─── Cannot select date/time before now ───
//       help: "Set the actual scheduled date and time (cannot be in the past)",
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
//       min: getTodayDateTime(), // ─── Cannot select date/time before now ───
//       help: "Set the next follow-up date and time (cannot be in the past)",
//     },
//   ];

//   // ─── Validation rules ──────────────────────────────────────────────
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
//         if (
//           value &&
//           value !== "" &&
//           (isNaN(Number(value)) || Number(value) < 0)
//         ) {
//           return "Please enter a valid number";
//         }
//         return null;
//       },
//     },
//     // ─── Custom date validation ──────────────────────────────────────
//     preferred_demo_date: {
//       custom: (value) => {
//         if (value) {
//           const selectedDate = new Date(value);
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
//           if (selectedDate < today) {
//             return "Preferred demo date cannot be before today";
//           }
//         }
//         return null;
//       },
//     },
//     demo_scheduled_at: {
//       custom: (value) => {
//         if (value) {
//           const selectedDateTime = new Date(value);
//           const now = new Date();
//           if (selectedDateTime < now) {
//             return "Demo scheduled date/time cannot be in the past";
//           }
//         }
//         return null;
//       },
//     },
//     follow_up_at: {
//       custom: (value) => {
//         if (value) {
//           const selectedDateTime = new Date(value);
//           const now = new Date();
//           if (selectedDateTime < now) {
//             return "Follow-up date/time cannot be in the past";
//           }
//         }
//         return null;
//       },
//     },
//   };

//   // Initial data
//   const initialData = {
//     name: "",
//     email: "",
//     mobile: "",
//     company_name: "",
//     designation: "",
//     company_size_id: "",
//     industry_id: "",
//     city_id: "",
//     job_hiring_volume: "",
//     hiring_frequency: "",
//     interested_plan: "",
//     preferred_demo_date: "",
//     preferred_demo_time: "",
//     message: "",
//     source: "",
//     assigned_to: "",
//     status: "new",
//     priority: "medium",
//     admin_remarks: "",
//     demo_scheduled_at: "",
//     demo_completed_at: "",
//     follow_up_at: "",
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);

//     try {
//       await demoRequestService.create(formData);
//       showSuccess("Demo request created successfully");
//       navigate("/demo-requests");
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(
//         error.message ||
//           error?.response?.data?.message ||
//           "Failed to create demo request",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormPage
//       title="Add Demo Request"
//       mode="add"
//       fields={fields}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       loading={loading}
//       submitLabel="Create"
//       navigateTo="/demo-requests"
//       breadcrumb="Add a new demo request"
//     />
//   );
// };

// export default AddDemoRequest;


// pages/demo-requests/AddDemoRequest.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdPerson,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdLocationOn,
  MdDateRange,
  MdAssignment,
  MdTrendingUp,
  MdWork,
  MdDescription,
} from 'react-icons/md';
import { demoRequestService } from '../../services/demoRequest.service';
import { showSuccess, showError } from '../../utils/toast';
import api from '../../services/axiosInstance';

// ─── Defensive array extraction ──────────────────────────────
const extractArray = (res, label) => {
  const d = res?.data;
  let arr = [];
  if (Array.isArray(d)) arr = d;
  else if (Array.isArray(d?.data)) arr = d.data;
  else if (Array.isArray(d?.results)) arr = d.results;
  else if (Array.isArray(d?.data?.data)) arr = d.data.data;
  else if (Array.isArray(d?.data?.results)) arr = d.data.results;

  console.log(`📥 [${label}] extracted ${arr.length} items`);
  return arr;
};

// ─── Searchable Select Component ──────────────────────────────
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  error,
  help,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative mb-4">
      <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
        {label}
      </label>
      <div
        className={`w-full px-3.5 py-2.5 border ${
          error ? 'border-red-500' : 'border-slate-300'
        } rounded-lg text-sm bg-white cursor-pointer hover:border-slate-400 transition-colors flex items-center justify-between`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-slate-800' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : placeholder || 'Select...'}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="p-2 sticky top-0 bg-white border-b border-slate-100">
            <input
              type="text"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-sm text-slate-400 text-center">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="px-3.5 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-2"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {option.value === value && (
                  <MdCheckCircle className="w-4 h-4 text-blue-600" />
                )}
                <span
                  className={
                    option.value === value
                      ? 'font-medium text-blue-600'
                      : 'text-slate-700'
                  }
                >
                  {option.label}
                </span>
              </div>
            ))
          )}
        </div>
      )}
      {help && !error && <p className="mt-1 text-xs text-slate-400">{help}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  new: {
    pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    icon: MdInfo,
  },
  contacted: {
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    icon: MdPhone,
  },
  scheduled: {
    pill: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    icon: MdDateRange,
  },
  completed: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    icon: MdCheckCircle,
  },
  converted: {
    pill: 'bg-emerald-600 text-white ring-1 ring-emerald-700',
    icon: MdCheckCircle,
  },
  cancelled: {
    pill: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    icon: MdErrorOutline,
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
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

const PriorityPill = ({ priority }) => {
  const colors = {
    low: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    medium: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    high: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  };
  const cls = colors[priority] || colors.medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}
    >
      <MdTrendingUp size={12} />
      {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium'}
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

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: MdPerson },
  { id: 'company', label: 'Company', icon: MdBusiness },
  { id: 'demo', label: 'Demo Details', icon: MdDateRange },
  { id: 'assignment', label: 'Assignment', icon: MdAssignment },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const AddDemoRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [companySizes, setCompanySizes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
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

  // ─── Load dropdown data ──────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sizesRes, industriesRes, citiesRes, usersRes, plansRes] =
          await Promise.all([
            api.get('/company-sizes'),
            api.get('/industry'),
            api.get('/cities'),
            api.get('/user'),
            api.get('/subscription-plans'),
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
    loadData();
  }, []);

  // ─── Date helpers ──────────────────────────────────────────
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const getTodayDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // ─── Options ───────────────────────────────────────────────
  const companySizeOptions = companySizes.map((s) => ({
    value: String(s.id || s._id),
    label: s.name || s.size_name || `Size ${s.id}`,
  }));
  const industryOptions = industries.map((i) => ({
    value: String(i.id || i._id),
    label: i.name || i.industry_name || `Industry ${i.id}`,
  }));
  const cityOptions = cities.map((c) => ({
    value: String(c.id || c._id),
    label: c.name || c.city_name || `City ${c.id}`,
  }));
  const userOptions = users.map((u) => ({
    value: String(u.id || u._id),
    label: u.name || `User ${u.id}`,
  }));
  const planOptions = subscriptionPlans.map((p) => ({
    value: p.plan_name || `Plan ${p.id}`,
    label: p.plan_name ? `${p.plan_name} (₹${p.price || 0})` : `Plan ${p.id}`,
  }));
  const hiringFrequencyOptions = [
    { value: 'occasional', label: 'Occasional' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'frequent', label: 'Frequent' },
  ];
  const sourceOptions = [
    { value: 'Website', label: 'Website' },
    { value: 'Google', label: 'Google' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'friends', label: 'Friends/Referral' },
    { value: 'socialmedia', label: 'Social Media' },
    { value: 'others', label: 'Others' },
  ];
  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'converted', label: 'Converted' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  // ─── Handlers ──────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────
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
      case 'preferred_demo_date':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) return 'Preferred demo date cannot be before today';
        }
        return null;
      case 'demo_scheduled_at':
        if (value) {
          const selectedDateTime = new Date(value);
          const now = new Date();
          if (selectedDateTime < now) return 'Demo scheduled date/time cannot be in the past';
        }
        return null;
      case 'follow_up_at':
        if (value) {
          const selectedDateTime = new Date(value);
          const now = new Date();
          if (selectedDateTime < now) return 'Follow-up date/time cannot be in the past';
        }
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    const fieldsToValidate = [
      'name',
      'email',
      'mobile',
      'company_name',
      'job_hiring_volume',
      'preferred_demo_date',
      'demo_scheduled_at',
      'follow_up_at',
    ];
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    const allTouched = {};
    Object.keys(formValues).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  // ─── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      showError('Please fix validation errors');
      return;
    }

    setLoading(true);
    try {
      await demoRequestService.create(formValues);
      showSuccess('Demo request created successfully');
      navigate('/demo-requests');
    } catch (error) {
      console.error('Submit error:', error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          'Failed to create demo request',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/demo-requests');

  // ─── Compute hero data ────────────────────────────────────
  const contactName = formValues.name?.trim() || 'New Demo Request';
  const companyName = formValues.company_name?.trim() || '';
  const status = formValues.status || 'new';
  const priority = formValues.priority || 'medium';

  const initials = contactName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Render tab content ────────────────────────────────────
  const renderTabContent = () => {
    const commonClass = `w-full px-3.5 py-2.5 border ${
      errors ? 'border-slate-300' : 'border-slate-300'
    } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    const renderInput = (name, label, type = 'text', required = false, placeholder = '', help = '') => {
      const error = touched[name] && errors[name];
      const inputCls = `w-full px-3.5 py-2.5 border ${
        error ? 'border-red-500' : 'border-slate-300'
      } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

      return (
        <div key={name} className="mb-4">
          <FieldLabel required={required}>{label}</FieldLabel>
          <input
            type={type}
            name={name}
            value={formValues[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={inputCls}
          />
          {help && !error && <p className="mt-1 text-xs text-slate-400">{help}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    };

    const renderSelect = (name, label, options, placeholder, help = '') => {
      const error = touched[name] && errors[name];
      const inputCls = `w-full px-3.5 py-2.5 border ${
        error ? 'border-red-500' : 'border-slate-300'
      } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

      return (
        <div key={name} className="mb-4">
          <FieldLabel>{label}</FieldLabel>
          <select
            name={name}
            value={formValues[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={inputCls}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {help && !error && <p className="mt-1 text-xs text-slate-400">{help}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    };

    const renderTextarea = (name, label, rows = 3, placeholder = '', help = '') => {
      const error = touched[name] && errors[name];
      const inputCls = `w-full px-3.5 py-2.5 border ${
        error ? 'border-red-500' : 'border-slate-300'
      } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white resize-y`;

      return (
        <div key={name} className="mb-4">
          <FieldLabel>{label}</FieldLabel>
          <textarea
            name={name}
            value={formValues[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={rows}
            placeholder={placeholder}
            className={inputCls}
          />
          {help && !error && <p className="mt-1 text-xs text-slate-400">{help}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    };

    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              {renderInput('name', 'Full Name', 'text', true, 'e.g. John Doe', "Enter the contact person's full name")}
            </div>
            <div>
              {renderInput('email', 'Email Address', 'email', true, 'e.g. john@company.com', 'Enter the business email address')}
            </div>
            <div>
              {renderInput('mobile', 'Mobile Number', 'text', true, 'e.g. 9876543210', 'Enter the contact number')}
            </div>
            <div>
              {renderInput('company_name', 'Company Name', 'text', true, 'e.g. Tech Solutions Pvt Ltd', 'Enter the company name')}
            </div>
            <div>
              {renderInput('designation', 'Designation', 'text', false, 'e.g. HR Manager, Recruiter', "Enter the person's designation")}
            </div>
            <div className="sm:col-span-2">
              {renderTextarea('message', 'Message / Requirements', 3, 'Describe any specific requirements...', 'Additional requirements or notes')}
            </div>
          </div>
        );

      case 'company':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <SearchableSelect
                label="Company Size"
                options={companySizeOptions}
                value={formValues.company_size_id}
                onChange={(val) => handleSelectChange('company_size_id', val)}
                placeholder="Select company size"
                help="Select the company size range"
              />
            </div>
            <div>
              <SearchableSelect
                label="Industry"
                options={industryOptions}
                value={formValues.industry_id}
                onChange={(val) => handleSelectChange('industry_id', val)}
                placeholder="Select industry"
                help="Select the industry"
              />
            </div>
            <div>
              <SearchableSelect
                label="City"
                options={cityOptions}
                value={formValues.city_id}
                onChange={(val) => handleSelectChange('city_id', val)}
                placeholder="Select city"
                help="Select the company location city"
              />
            </div>
            <div>
              {renderInput('job_hiring_volume', 'Expected Hiring Volume', 'number', false, 'e.g. 10', 'Enter the expected number of hires')}
            </div>
            <div>
              {renderSelect('hiring_frequency', 'Hiring Frequency', hiringFrequencyOptions, 'Select hiring frequency', 'Select how often you hire')}
            </div>
            <div>
              <SearchableSelect
                label="Interested Plan"
                options={planOptions}
                value={formValues.interested_plan}
                onChange={(val) => handleSelectChange('interested_plan', val)}
                placeholder="Select plan"
                help="Select the subscription plan the customer is interested in"
              />
            </div>
          </div>
        );

      case 'demo':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Preferred Demo Date</FieldLabel>
              <input
                type="date"
                name="preferred_demo_date"
                value={formValues.preferred_demo_date}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={getTodayDate()}
                className={`w-full px-3.5 py-2.5 border ${
                  touched.preferred_demo_date && errors.preferred_demo_date
                    ? 'border-red-500'
                    : 'border-slate-300'
                } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`}
              />
              <p className="mt-1 text-xs text-slate-400">
                Select the preferred date for the demo (cannot be before today)
              </p>
              {touched.preferred_demo_date && errors.preferred_demo_date && (
                <p className="mt-1 text-xs text-red-500">{errors.preferred_demo_date}</p>
              )}
            </div>
            <div>
              {renderInput('preferred_demo_time', 'Preferred Demo Time', 'text', false, 'e.g. 10:00 AM, 14:30', 'Enter the preferred time for the demo')}
            </div>
            <div>
              <FieldLabel>Demo Scheduled At</FieldLabel>
              <input
                type="datetime-local"
                name="demo_scheduled_at"
                value={formValues.demo_scheduled_at}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={getTodayDateTime()}
                className={`w-full px-3.5 py-2.5 border ${
                  touched.demo_scheduled_at && errors.demo_scheduled_at
                    ? 'border-red-500'
                    : 'border-slate-300'
                } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`}
              />
              <p className="mt-1 text-xs text-slate-400">
                Set the actual scheduled date and time (cannot be in the past)
              </p>
              {touched.demo_scheduled_at && errors.demo_scheduled_at && (
                <p className="mt-1 text-xs text-red-500">{errors.demo_scheduled_at}</p>
              )}
            </div>
            <div>
              <FieldLabel>Demo Completed At</FieldLabel>
              <input
                type="datetime-local"
                name="demo_completed_at"
                value={formValues.demo_completed_at}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white"
              />
              <p className="mt-1 text-xs text-slate-400">
                Set the demo completion date and time
              </p>
            </div>
            <div>
              <FieldLabel>Follow-up Date</FieldLabel>
              <input
                type="datetime-local"
                name="follow_up_at"
                value={formValues.follow_up_at}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min={getTodayDateTime()}
                className={`w-full px-3.5 py-2.5 border ${
                  touched.follow_up_at && errors.follow_up_at
                    ? 'border-red-500'
                    : 'border-slate-300'
                } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`}
              />
              <p className="mt-1 text-xs text-slate-400">
                Set the next follow-up date and time (cannot be in the past)
              </p>
              {touched.follow_up_at && errors.follow_up_at && (
                <p className="mt-1 text-xs text-red-500">{errors.follow_up_at}</p>
              )}
            </div>
            <div>
              {renderSelect('source', 'Source', sourceOptions, 'Select source', 'How did the customer find us?')}
            </div>
          </div>
        );

      case 'assignment':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <SearchableSelect
                label="Assigned To"
                options={userOptions}
                value={formValues.assigned_to}
                onChange={(val) => handleSelectChange('assigned_to', val)}
                placeholder="Select user"
                help="Assign this demo request to a team member"
              />
            </div>
            <div>
              {renderSelect('status', 'Status', statusOptions, 'Select status', 'Select the current status')}
            </div>
            <div>
              {renderSelect('priority', 'Priority', priorityOptions, 'Select priority', 'Select the priority level')}
            </div>
            <div className="sm:col-span-2">
              {renderTextarea('admin_remarks', 'Admin Remarks', 2, 'Internal notes...', 'Internal remarks or notes')}
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdInfo size={16} />
                  No Activity Yet
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500">
                  This demo request hasn't been created yet. Once created, activity details will appear here.
                </p>
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
      {/* ─── Sticky action bar ───────────────────────────────── */}
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
                Add New Demo Request
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
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
              {loading ? 'Creating...' : 'Create Demo Request'}
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
                  {initials || <MdPerson size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {contactName}
                  </h1>
                  <StatusPill status={status} />
                  <PriorityPill priority={priority} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {companyName && (
                    <>
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <MdBusiness size={12} /> {companyName}
                      </span>
                      <span className="text-xs text-white/70">•</span>
                    </>
                  )}
                  {formValues.email && (
                    <span className="text-xs text-white/70 flex items-center gap-1">
                      <MdEmail size={12} /> {formValues.email}
                    </span>
                  )}
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/50">New Demo Request</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ─────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAssignment size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {status.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdTrendingUp size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Priority</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {priority}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdWork size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Hiring Volume</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.job_hiring_volume || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Preferred Demo</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.preferred_demo_date || '—'}
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
                      layoutId="add-demo-request-tab-underline"
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
                <form onSubmit={handleSubmit}>
                  {renderTabContent()}
                  {activeTab !== 'activity' && (
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
                            Creating...
                          </span>
                        ) : (
                          'Create Demo Request'
                        )}
                      </button>
                    </div>
                  )}
                </form>
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
    </div>
  );
};

export default AddDemoRequest;