
// // pages/demo-requests/EditDemoRequest.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MdArrowBack,
//   MdSave,
//   MdCancel,
//   MdDelete,
//   MdPerson,
//   MdEmail,
//   MdPhone,
//   MdBusiness,
//   MdWork,
//   MdPeople,
//   MdCategory,
//   MdLocationCity,
//   MdDateRange,
//   MdSchedule,
//   MdAssignment,
//   MdPriorityHigh,
//   MdFlag,
//   MdMessage,
//   MdInfoOutline,
//   MdCheckCircle,
//   MdErrorOutline,
//   MdPersonAdd,
//   MdTrendingUp,
//   MdLock,
//   MdEventNote,
// } from "react-icons/md";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import {
//   demoRequestService,
//   toDatetimeLocalInput,
//   toDateInput,
// } from "../../services/demoRequest.service";
// import { showSuccess, showError } from "../../utils/toast";
// import api from "../../services/axiosInstance";

// // ─── Defensive array extraction ─────────────────────────────────
// const extractArray = (res) => {
//   const d = res?.data;
//   let arr = [];
//   if (Array.isArray(d)) arr = d;
//   else if (Array.isArray(d?.data)) arr = d.data;
//   else if (Array.isArray(d?.results)) arr = d.results;
//   else if (Array.isArray(d?.data?.data)) arr = d.data.data;
//   else if (Array.isArray(d?.data?.results)) arr = d.data.results;
//   return arr;
// };

// // ─── Shared components ──────────────────────────────────────────
// const FieldLabel = ({ children, required }) => (
//   <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
//     {children}
//     {required && <span className="text-red-500 ml-0.5">*</span>}
//   </label>
// );

// // ─── Status pill ────────────────────────────────────────────────
// const STATUS_STYLES = {
//   new: {
//     pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
//     icon: MdInfoOutline,
//   },
//   contacted: {
//     pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
//     icon: MdCheckCircle,
//   },
//   scheduled: {
//     pill: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
//     icon: MdSchedule,
//   },
//   completed: {
//     pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
//     icon: MdCheckCircle,
//   },
//   converted: {
//     pill: "bg-green-50 text-green-700 ring-1 ring-green-200",
//     icon: MdTrendingUp,
//   },
//   cancelled: {
//     pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
//     icon: MdErrorOutline,
//   },
// };

// const StatusPill = ({ status }) => {
//   const style = STATUS_STYLES[status] || STATUS_STYLES.new;
//   const Icon = style.icon;
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
//     >
//       <Icon size={13} />
//       {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
//     </span>
//   );
// };

// // ─── Priority pill ──────────────────────────────────────────────
// const PRIORITY_STYLES = {
//   low: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
//   medium: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
//   high: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
// };

// const PriorityPill = ({ priority }) => {
//   const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
//   const label = priority
//     ? priority.charAt(0).toUpperCase() + priority.slice(1)
//     : "Medium";
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style}`}
//     >
//       <MdPriorityHigh size={13} />
//       {label}
//     </span>
//   );
// };

// // ─── Searchable select ──────────────────────────────────────────
// const SearchableSelect = ({
//   options,
//   value,
//   onChange,
//   placeholder,
//   label,
//   required,
//   error,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   const filteredOptions = useMemo(() => {
//     if (!searchTerm) return options;
//     return options.filter((option) =>
//       option.label.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [options, searchTerm]);

//   const selectedOption = options.find((opt) => opt.value === value);

//   return (
//     <div className="relative">
//       <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
//         {label}
//         {required && <span className="text-red-500 ml-0.5">*</span>}
//       </label>
//       <div
//         className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-white cursor-pointer hover:border-slate-400 transition-colors flex items-center justify-between ${
//           error ? "border-red-300" : "border-slate-300"
//         }`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className={selectedOption ? "text-slate-800" : "text-slate-400"}>
//           {selectedOption ? selectedOption.label : placeholder || "Select..."}
//         </span>
//         <svg
//           className={`w-4 h-4 text-slate-400 transition-transform ${
//             isOpen ? "rotate-180" : ""
//           }`}
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
//         <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//           <div className="p-2 sticky top-0 bg-white border-b border-slate-100">
//             <input
//               type="text"
//               className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder={`Search ${label.toLowerCase()}...`}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//           {filteredOptions.length === 0 ? (
//             <div className="p-3 text-sm text-slate-400 text-center">
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
//                     className="w-4 h-4 text-blue-600"
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
//                       ? "font-medium text-blue-600"
//                       : "text-slate-700"
//                   }
//                 >
//                   {option.label}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// };

// // ─── Tabs ────────────────────────────────────────────────────────
// const TABS = [
//   { id: "overview", label: "Overview", icon: MdPerson },
//   { id: "assignment", label: "Assignment & Status", icon: MdAssignment },
//   { id: "schedule", label: "Schedule", icon: MdEventNote },
//   { id: "remarks", label: "Remarks", icon: MdMessage },
// ];

// // ─── Main Component ─────────────────────────────────────────────
// const EditDemoRequest = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");

//   // Dropdown data
//   const [companySizes, setCompanySizes] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [subscriptionPlans, setSubscriptionPlans] = useState([]);

//   // Form state
//   const [formValues, setFormValues] = useState({
//     // Read-only
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
//     preferred_demo_date: "",
//     preferred_demo_time: "",
//     message: "",
//     // Editable
//     interested_plan: "",
//     source: "",
//     assigned_to: "",
//     status: "new",
//     priority: "medium",
//     admin_remarks: "",
//     demo_scheduled_at: "",
//     demo_completed_at: "",
//     follow_up_at: "",
//   });

//   const [errors, setErrors] = useState({});

//   // ─── Load dropdown data ──────────────────────────────────────
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

//         setCompanySizes(extractArray(sizesRes));
//         setIndustries(extractArray(industriesRes));
//         setCities(extractArray(citiesRes));
//         setUsers(extractArray(usersRes));
//         setSubscriptionPlans(extractArray(plansRes));
//       } catch (error) {
//         console.error("Error loading dropdown data:", error);
//       }
//     };
//     loadData();
//   }, []);

//   // ─── Fetch demo request ──────────────────────────────────────
//   useEffect(() => {
//     const fetchDemoRequest = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await demoRequestService.getById(id);
//         let data = response?.data || response;
//         if (response?.data?.data) data = response.data.data;
//         if (
//           response?.data?.results &&
//           Array.isArray(response.data.results)
//         ) {
//           data = response.data.results[0] || null;
//         }

//         if (data && data.id) {
//           setFormValues({
//             name: data.name || "",
//             email: data.email || "",
//             mobile: data.mobile || "",
//             company_name: data.company_name || "",
//             designation: data.designation || "",
//             company_size_id: data.company_size_id
//               ? String(data.company_size_id)
//               : "",
//             industry_id: data.industry_id
//               ? String(data.industry_id)
//               : "",
//             city_id: data.city_id ? String(data.city_id) : "",
//             job_hiring_volume: data.job_hiring_volume || "",
//             hiring_frequency: data.hiring_frequency || "",
//             preferred_demo_date: toDateInput(data.preferred_demo_date),
//             preferred_demo_time: data.preferred_demo_time || "",
//             message: data.message || "",
//             interested_plan: data.interested_plan || "",
//             source: data.source || "",
//             assigned_to: data.assigned_to ? String(data.assigned_to) : "",
//             status: data.status || "new",
//             priority: data.priority || "medium",
//             admin_remarks: data.admin_remarks || "",
//             demo_scheduled_at: toDatetimeLocalInput(data.demo_scheduled_at),
//             demo_completed_at: toDatetimeLocalInput(data.demo_completed_at),
//             follow_up_at: toDatetimeLocalInput(data.follow_up_at),
//           });
//           setEditItem(data);
//         } else {
//           showError("Demo request not found");
//           navigate("/demo-requests");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load demo request data");
//         navigate("/demo-requests");
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) fetchDemoRequest();
//   }, [id, navigate]);

//   // ─── Handlers ────────────────────────────────────────────────
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleSelectChange = (name, value) => {
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // ─── Validation ──────────────────────────────────────────────
//   const validate = () => {
//     const newErrors = {};
//     if (!formValues.status) newErrors.status = "Status is required";
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) {
//       setActiveTab("assignment");
//       showError(Object.values(newErrors)[0]);
//       return false;
//     }
//     return true;
//   };

//   // ─── Submit ──────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const submitData = {
//         interested_plan: formValues.interested_plan,
//         source: formValues.source,
//         assigned_to: formValues.assigned_to,
//         status: formValues.status,
//         priority: formValues.priority,
//         admin_remarks: formValues.admin_remarks,
//         demo_scheduled_at: formValues.demo_scheduled_at,
//         demo_completed_at: formValues.demo_completed_at,
//         follow_up_at: formValues.follow_up_at,
//       };

//       await demoRequestService.update(id, submitData);
//       showSuccess("Demo request updated successfully");
//       navigate("/demo-requests");
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(
//         error.message ||
//           error?.response?.data?.message ||
//           "Failed to update demo request"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Delete ──────────────────────────────────────────────────
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await demoRequestService.delete(id);
//       showSuccess("Demo request deleted successfully");
//       setShowDeleteDialog(false);
//       navigate("/demo-requests");
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError(
//           "Cannot delete this request because it is being used in other records."
//         );
//       } else {
//         showError(message || "Failed to delete request");
//       }
//       setShowDeleteDialog(false);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   // ─── Options ─────────────────────────────────────────────────
//   const companySizeOptions = companySizes.map((s) => ({
//     value: String(s.id || s._id),
//     label: s.name || s.size_name || `Size ${s.id}`,
//   }));

//   const industryOptions = industries.map((i) => ({
//     value: String(i.id || i._id),
//     label: i.name || i.industry_name || `Industry ${i.id}`,
//   }));

//   const cityOptions = cities.map((c) => ({
//     value: String(c.id || c._id),
//     label: c.name || c.city_name || `City ${c.id}`,
//   }));

//   const userOptions = users.map((u) => ({
//     value: String(u.id || u._id),
//     label: u.name || u.username || u.email || `User ${u.id}`,
//   }));

//   const planOptions = subscriptionPlans.map((p) => ({
//     value: p.plan_name || `Plan ${p.id}`,
//     label: p.plan_name
//       ? `${p.plan_name} (₹${p.price || 0})`
//       : `Plan ${p.id}`,
//   }));

//   const frequencyOptions = [
//     { value: "occasional", label: "Occasional" },
//     { value: "monthly", label: "Monthly" },
//     { value: "quarterly", label: "Quarterly" },
//     { value: "frequent", label: "Frequent" },
//   ];

//   const sourceOptions = [
//     { value: "Website", label: "Website" },
//     { value: "Google", label: "Google" },
//     { value: "LinkedIn", label: "LinkedIn" },
//     { value: "friends", label: "Friends/Referral" },
//     { value: "socialmedia", label: "Social Media" },
//     { value: "others", label: "Others" },
//   ];

//   const statusOptions = [
//     { value: "new", label: "New" },
//     { value: "contacted", label: "Contacted" },
//     { value: "scheduled", label: "Scheduled" },
//     { value: "completed", label: "Completed" },
//     { value: "converted", label: "Converted" },
//     { value: "cancelled", label: "Cancelled" },
//   ];

//   const priorityOptions = [
//     { value: "low", label: "Low" },
//     { value: "medium", label: "Medium" },
//     { value: "high", label: "High" },
//   ];

//   // ─── Loading state ───────────────────────────────────────────
//   if (fetchLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-slate-400">
//             Loading demo request data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!editItem) return null;

//   // ─── Hero helpers ────────────────────────────────────────────
//   const heroName = formValues.name?.trim() || "Demo Request";
//   const heroCompany = formValues.company_name?.trim() || "";
//   const initials = heroName
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0]?.toUpperCase())
//     .join("");

//   // ─── Render Tab Content ─────────────────────────────────────
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return (
//           <div className="space-y-5">
            

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div>
//                 <FieldLabel>Full Name</FieldLabel>
//                 <div className="relative">
//                   <MdPerson
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formValues.name}
//                     disabled
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>Email Address</FieldLabel>
//                 <div className="relative">
//                   <MdEmail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={formValues.email}
//                     disabled
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>Mobile Number</FieldLabel>
//                 <div className="relative">
//                   <MdPhone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formValues.mobile}
//                     disabled
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>Company Name</FieldLabel>
//                 <div className="relative">
//                   <MdBusiness
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formValues.company_name}
//                     disabled
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>Designation</FieldLabel>
//                 <div className="relative">
//                   <MdWork
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={formValues.designation}
//                     disabled
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>Company Size</FieldLabel>
//                 <div className="relative">
//                   <MdPeople
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//                     size={18}
//                   />
//                   <select
//                     value={formValues.company_size_id}
//                     disabled
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed appearance-none"
//                   >
//                     <option value="">—</option>
//                     {companySizeOptions.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>Industry</FieldLabel>
//                 <div className="relative">
//                   <MdCategory
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//                     size={18}
//                   />
//                   <select
//                     value={formValues.industry_id}
//                     disabled
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed appearance-none"
//                   >
//                     <option value="">—</option>
//                     {industryOptions.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>City</FieldLabel>
//                 <div className="relative">
//                   <MdLocationCity
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//                     size={18}
//                   />
//                   <select
//                     value={formValues.city_id}
//                     disabled
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed appearance-none"
//                   >
//                     <option value="">—</option>
//                     {cityOptions.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>Expected Hiring Volume</FieldLabel>
//                 <input
//                   type="text"
//                   value={formValues.job_hiring_volume}
//                   disabled
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
//                 />
//               </div>

//               <div>
//                 <FieldLabel>Hiring Frequency</FieldLabel>
//                 <select
//                   value={formValues.hiring_frequency}
//                   disabled
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed appearance-none"
//                 >
//                   <option value="">—</option>
//                   {frequencyOptions.map((opt) => (
//                     <option key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <FieldLabel>Preferred Demo Date</FieldLabel>
//                 <input
//                   type="text"
//                   value={formValues.preferred_demo_date || "—"}
//                   disabled
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
//                 />
//               </div>

//               <div>
//                 <FieldLabel>Preferred Demo Time</FieldLabel>
//                 <input
//                   type="text"
//                   value={formValues.preferred_demo_time || "—"}
//                   disabled
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <FieldLabel>Message / Requirements</FieldLabel>
//                 <textarea
//                   value={formValues.message}
//                   disabled
//                   rows={3}
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed resize-none"
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       case "assignment":
//         return (
//           <div className="space-y-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <SearchableSelect
//                 label="Interested Plan"
//                 options={planOptions}
//                 value={formValues.interested_plan}
//                 onChange={(v) => handleSelectChange("interested_plan", v)}
//                 placeholder="Select plan"
//               />

//               <div>
//                 <FieldLabel>Source</FieldLabel>
//                 <select
//                   name="source"
//                   value={formValues.source}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all bg-white"
//                 >
//                   <option value="">Select source</option>
//                   {sourceOptions.map((opt) => (
//                     <option key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <SearchableSelect
//                 label="Assigned To"
//                 options={userOptions}
//                 value={formValues.assigned_to}
//                 onChange={(v) => handleSelectChange("assigned_to", v)}
//                 placeholder="Assign to..."
//               />

//               <div>
//                 <FieldLabel required>Status</FieldLabel>
//                 <select
//                   name="status"
//                   value={formValues.status}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
//                     errors.status
//                       ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
//                       : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                   } bg-white`}
//                 >
//                   {statusOptions.map((opt) => (
//                     <option key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.status && (
//                   <p className="text-xs text-red-500 mt-1">{errors.status}</p>
//                 )}
//               </div>

//               <div>
//                 <FieldLabel>Priority</FieldLabel>
//                 <select
//                   name="priority"
//                   value={formValues.priority}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all bg-white"
//                 >
//                   {priorityOptions.map((opt) => (
//                     <option key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         );

//       case "schedule":
//         return (
//           <div className="space-y-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div>
//                 <FieldLabel>Demo Scheduled At</FieldLabel>
//                 <div className="relative">
//                   <MdSchedule
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={18}
//                   />
//                   <input
//                     type="datetime-local"
//                     name="demo_scheduled_at"
//                     value={formValues.demo_scheduled_at}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <FieldLabel>Demo Completed At</FieldLabel>
//                 <div className="relative">
//                   <MdCheckCircle
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={18}
//                   />
//                   <input
//                     type="datetime-local"
//                     name="demo_completed_at"
//                     value={formValues.demo_completed_at}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-2">
//                 <FieldLabel>Follow-up At</FieldLabel>
//                 <div className="relative">
//                   <MdDateRange
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={18}
//                   />
//                   <input
//                     type="datetime-local"
//                     name="follow_up_at"
//                     value={formValues.follow_up_at}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case "remarks":
//         return (
//           <div className="space-y-5 max-w-2xl">
//             <div>
//               <FieldLabel>Admin Remarks</FieldLabel>
//               <div className="relative">
//                 <MdMessage
//                   className="absolute left-3 top-3 text-slate-400"
//                   size={18}
//                 />
//                 <textarea
//                   name="admin_remarks"
//                   value={formValues.admin_remarks}
//                   onChange={handleInputChange}
//                   rows={5}
//                   placeholder="Internal notes..."
//                   className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y bg-white"
//                 />
//               </div>
//               <p className="text-xs text-slate-500 mt-1.5">
//                 Internal remarks visible only to admins.
//               </p>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   // ─── Main render ─────────────────────────────────────────────
//   return (
//     <div className="min-h-screen pb-16 bg-[#F4F5FA]">
//       {/* ─── Sticky action bar ─────────────────────────────────── */}
//       <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3 min-w-0">
//             <button
//               onClick={() => navigate("/demo-requests")}
//               className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
//               aria-label="Back"
//             >
//               <MdArrowBack size={19} className="text-slate-600" />
//             </button>
//             <div className="min-w-0">
//               <p className="text-[11px] text-slate-400 leading-tight">
//                 Demo Requests · Edit
//               </p>
//               <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
//                 {heroCompany || heroName}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <button
//               type="button"
//               onClick={() => navigate("/demo-requests")}
//               className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
//             >
//               <MdCancel size={16} />
//               Cancel
//             </button>
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
//             >
//               {loading ? (
//                 <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <MdSave size={16} />
//               )}
//               {loading ? "Updating..." : "Update Request"}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
//         {/* ─── Hero ───────────────────────────────────────────────── */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.35, ease: "easeOut" }}
//           className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
//         >
//           <div className="relative h-44 sm:h-52 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
//               <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
//             </div>
//           </div>

//           <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
//             <div className="flex flex-col sm:flex-row sm:items-end gap-4">
//               {/* Avatar */}
//               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
//                 <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
//                   {initials || <MdPerson size={24} />}
//                 </div>
//               </div>

//               {/* Name + chips */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
//                     {heroName}
//                   </h1>
//                   <StatusPill status={formValues.status} />
//                   <PriorityPill priority={formValues.priority} />
//                 </div>
//                 <div className="mt-2 flex items-center gap-2 flex-wrap">
//                   {heroCompany && (
//                     <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
//                       {heroCompany}
//                     </span>
//                   )}
//                   <span className="text-xs text-white/70">
//                     {formValues.email}
//                   </span>
//                   <span className="text-xs text-white/70">ID: #{id}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* ─── Quick stat strip ──────────────────────────────────── */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
//           <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
//             <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-500 leading-tight">
//                 Company
//               </p>
//               <p className="text-sm font-semibold text-slate-700 truncate">
//                 {heroCompany || "—"}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
//             <MdAssignment size={16} className="text-slate-400 flex-shrink-0" />
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-500 leading-tight">Status</p>
//               <p className="text-sm font-semibold text-slate-700 truncate capitalize">
//                 {formValues.status}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
//             <MdPriorityHigh
//               size={16}
//               className="text-slate-400 flex-shrink-0"
//             />
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-500 leading-tight">
//                 Priority
//               </p>
//               <p className="text-sm font-semibold text-slate-700 truncate capitalize">
//                 {formValues.priority}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
//             <MdPersonAdd size={16} className="text-slate-400 flex-shrink-0" />
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-500 leading-tight">
//                 Assigned To
//               </p>
//               <p className="text-sm font-semibold text-slate-700 truncate">
//                 {formValues.assigned_to
//                   ? userOptions.find(
//                       (u) => u.value === formValues.assigned_to
//                     )?.label || "User"
//                   : "Unassigned"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ─── Tabs ───────────────────────────────────────────────── */}
//         <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="flex overflow-x-auto border-b border-slate-200 px-2">
//             {TABS.map((tab) => {
//               const Icon = tab.icon;
//               const active = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   type="button"
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
//                     active
//                       ? "text-blue-600"
//                       : "text-slate-500 hover:text-slate-700"
//                   }`}
//                 >
//                   <Icon size={16} />
//                   {tab.label}
//                   {active && (
//                     <motion.span
//                       layoutId="edit-demo-request-tab-underline"
//                       className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
//                       transition={{
//                         type: "spring",
//                         stiffness: 500,
//                         damping: 35,
//                       }}
//                     />
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="p-5 sm:p-7">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={activeTab}
//                 initial={{ opacity: 0, y: 6 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -6 }}
//                 transition={{ duration: 0.18 }}
//               >
//                 {renderTabContent()}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* ─── Actions ────────────────────────────────────────────── */}
//         <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
//             <button
//               type="button"
//               onClick={() => setShowDeleteDialog(true)}
//               className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
//             >
//               <MdDelete size={16} />
//               Delete Demo Request
//             </button>
//             <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={() => navigate("/demo-requests")}
//                 className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
//               >
//                 <MdCancel size={16} />
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
//               >
//                 {loading ? (
//                   <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <MdSave size={16} />
//                 )}
//                 {loading ? "Updating..." : "Update Request"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile-only cancel button */}
//         <button
//           type="button"
//           onClick={() => navigate("/demo-requests")}
//           className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
//         >
//           <MdCancel size={16} />
//           Cancel
//         </button>
//       </div>

//       {/* ─── Delete Confirmation Dialog ─────────────────────────── */}
//       <ConfirmDialog
//         isOpen={showDeleteDialog}
//         onClose={() => setShowDeleteDialog(false)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Demo Request"
//         message="Delete this demo request? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default EditDemoRequest;

// pages/demo-requests/EditDemoRequest.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdPerson,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdWork,
  MdPeople,
  MdCategory,
  MdLocationCity,
  MdDateRange,
  MdSchedule,
  MdAssignment,
  MdPriorityHigh,
  MdFlag,
  MdMessage,
  MdInfoOutline,
  MdCheckCircle,
  MdErrorOutline,
  MdPersonAdd,
  MdTrendingUp,
  MdLock,
  MdEventNote,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  demoRequestService,
  toDatetimeLocalInput,
  toDateInput,
} from "../../services/demoRequest.service";
import { showSuccess, showError } from "../../utils/toast";
import api from "../../services/axiosInstance";

// ─── Defensive array extraction ─────────────────────────────────
const extractArray = (res) => {
  const d = res?.data;
  let arr = [];
  if (Array.isArray(d)) arr = d;
  else if (Array.isArray(d?.data)) arr = d.data;
  else if (Array.isArray(d?.results)) arr = d.results;
  else if (Array.isArray(d?.data?.data)) arr = d.data.data;
  else if (Array.isArray(d?.data?.results)) arr = d.data.results;
  return arr;
};

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
  contacted: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: MdCheckCircle,
  },
  scheduled: {
    pill: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    icon: MdSchedule,
  },
  completed: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  converted: {
    pill: "bg-green-50 text-green-700 ring-1 ring-green-200",
    icon: MdTrendingUp,
  },
  cancelled: {
    pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
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
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ─── Priority pill ──────────────────────────────────────────────
const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  medium: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  high: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
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

// ─── Searchable select ──────────────────────────────────────────
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  required,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div
        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-white cursor-pointer hover:border-slate-400 transition-colors flex items-center justify-between ${
          error ? "border-red-300" : "border-slate-300"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-slate-800" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder || "Select..."}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
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
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  setSearchTerm("");
                }}
              >
                {option.value === value && (
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                <span
                  className={
                    option.value === value
                      ? "font-medium text-blue-600"
                      : "text-slate-700"
                  }
                >
                  {option.label}
                </span>
              </div>
            ))
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdPerson },
  { id: "assignment", label: "Assignment & Status", icon: MdAssignment },
  { id: "schedule", label: "Schedule", icon: MdEventNote },
  { id: "remarks", label: "Remarks", icon: MdMessage },
];

// ─── Main Component ─────────────────────────────────────────────
const EditDemoRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Dropdown data
  const [companySizes, setCompanySizes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  // Form state
  const [formValues, setFormValues] = useState({
    // Read-only
    name: "",
    email: "",
    mobile: "",
    company_name: "",
    designation: "",
    company_size_id: "",
    industry_id: "",
    city_id: "",
    job_hiring_volume: "",
    hiring_frequency: "",
    preferred_demo_date: "",
    preferred_demo_time: "",
    message: "",
    // Editable
    interested_plan: "",
    source: "",
    assigned_to: "",
    status: "new",
    priority: "medium",
    admin_remarks: "",
    demo_scheduled_at: "",
    demo_completed_at: "",
    follow_up_at: "",
  });

  const [errors, setErrors] = useState({});

  // ─── Load dropdown data ──────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sizesRes, industriesRes, citiesRes, usersRes, plansRes] =
          await Promise.all([
            api.get("/company-sizes"),
            api.get("/industry"),
            api.get("/cities"),
            api.get("/user"),
            api.get("/subscription-plans"),
          ]);

        setCompanySizes(extractArray(sizesRes));
        setIndustries(extractArray(industriesRes));
        setCities(extractArray(citiesRes));
        setUsers(extractArray(usersRes));
        setSubscriptionPlans(extractArray(plansRes));
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    };
    loadData();
  }, []);

  // ─── Fetch demo request ──────────────────────────────────────
  useEffect(() => {
    const fetchDemoRequest = async () => {
      setFetchLoading(true);
      try {
        const response = await demoRequestService.getById(id);
        let data = response?.data || response;
        if (response?.data?.data) data = response.data.data;
        if (
          response?.data?.results &&
          Array.isArray(response.data.results)
        ) {
          data = response.data.results[0] || null;
        }

        if (data && data.id) {
          setFormValues({
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            company_name: data.company_name || "",
            designation: data.designation || "",
            company_size_id: data.company_size_id
              ? String(data.company_size_id)
              : "",
            industry_id: data.industry_id
              ? String(data.industry_id)
              : "",
            city_id: data.city_id ? String(data.city_id) : "",
            job_hiring_volume: data.job_hiring_volume || "",
            hiring_frequency: data.hiring_frequency || "",
            preferred_demo_date: toDateInput(data.preferred_demo_date),
            preferred_demo_time: data.preferred_demo_time || "",
            message: data.message || "",
            interested_plan: data.interested_plan || "",
            source: data.source || "",
            assigned_to: data.assigned_to ? String(data.assigned_to) : "",
            status: data.status || "new",
            priority: data.priority || "medium",
            admin_remarks: data.admin_remarks || "",
            demo_scheduled_at: toDatetimeLocalInput(data.demo_scheduled_at),
            demo_completed_at: toDatetimeLocalInput(data.demo_completed_at),
            follow_up_at: toDatetimeLocalInput(data.follow_up_at),
          });
          // Keep the raw, untouched record so the update payload can send
          // these read-only fields back exactly as the API gave them to us.
          setEditItem(data);
        } else {
          showError("Demo request not found");
          navigate("/demo-requests");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load demo request data");
        navigate("/demo-requests");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) fetchDemoRequest();
  }, [id, navigate]);

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!formValues.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setActiveTab("assignment");
      showError(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // FIX: the API applies a full update to the record (its response
      // shape includes the whole row, joined companySize/industry/city
      // and all), so a payload that only carries the editable fields
      // causes the backend to overwrite name/email/mobile/company_name/
      // designation/company_size_id/industry_id/city_id/job_hiring_volume/
      // hiring_frequency/preferred_demo_date/preferred_demo_time/message
      // with null — which is exactly why they were disappearing from the
      // list after every edit. We now send those read-only fields back
      // unchanged, straight from the original fetched record (`editItem`),
      // so their original values and types are preserved.
      const submitData = {
        // ─ Read-only fields — preserved exactly as received ─
        name: editItem.name,
        email: editItem.email,
        mobile: editItem.mobile,
        company_name: editItem.company_name,
        designation: editItem.designation,
        company_size_id: editItem.company_size_id,
        industry_id: editItem.industry_id,
        city_id: editItem.city_id,
        job_hiring_volume: editItem.job_hiring_volume,
        hiring_frequency: editItem.hiring_frequency,
        preferred_demo_date: editItem.preferred_demo_date,
        preferred_demo_time: editItem.preferred_demo_time,
        message: editItem.message,
        // ─ Editable fields — from the form ─
        interested_plan: formValues.interested_plan,
        source: formValues.source,
        assigned_to: formValues.assigned_to,
        status: formValues.status,
        priority: formValues.priority,
        admin_remarks: formValues.admin_remarks,
        demo_scheduled_at: formValues.demo_scheduled_at,
        demo_completed_at: formValues.demo_completed_at,
        follow_up_at: formValues.follow_up_at,
      };

      await demoRequestService.update(id, submitData);
      showSuccess("Demo request updated successfully");
      navigate("/demo-requests");
    } catch (error) {
      console.error("Submit error:", error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          "Failed to update demo request"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await demoRequestService.delete(id);
      showSuccess("Demo request deleted successfully");
      setShowDeleteDialog(false);
      navigate("/demo-requests");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this request because it is being used in other records."
        );
      } else {
        showError(message || "Failed to delete request");
      }
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Options ─────────────────────────────────────────────────
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
    label: u.name || u.username || u.email || `User ${u.id}`,
  }));

  const planOptions = subscriptionPlans.map((p) => ({
    value: p.plan_name || `Plan ${p.id}`,
    label: p.plan_name
      ? `${p.plan_name} (₹${p.price || 0})`
      : `Plan ${p.id}`,
  }));

  const frequencyOptions = [
    { value: "occasional", label: "Occasional" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "frequent", label: "Frequent" },
  ];

  const sourceOptions = [
    { value: "Website", label: "Website" },
    { value: "Google", label: "Google" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "friends", label: "Friends/Referral" },
    { value: "socialmedia", label: "Social Media" },
    { value: "others", label: "Others" },
  ];

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "converted", label: "Converted" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  // ─── Loading state ───────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">
            Loading demo request data...
          </p>
        </div>
      </div>
    );
  }

  if (!editItem) return null;

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.name?.trim() || "Demo Request";
  const heroCompany = formValues.company_name?.trim() || "";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Full Name</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formValues.name}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Email Address</FieldLabel>
                <div className="relative">
                  <MdEmail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={formValues.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Mobile Number</FieldLabel>
                <div className="relative">
                  <MdPhone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formValues.mobile}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Company Name</FieldLabel>
                <div className="relative">
                  <MdBusiness
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formValues.company_name}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Designation</FieldLabel>
                <div className="relative">
                  <MdWork
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formValues.designation}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Company Size</FieldLabel>
                <div className="relative">
                  <MdPeople
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    value={formValues.company_size_id}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed appearance-none"
                  >
                    <option value="">—</option>
                    {companySizeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel>Industry</FieldLabel>
                <div className="relative">
                  <MdCategory
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    value={formValues.industry_id}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed appearance-none"
                  >
                    <option value="">—</option>
                    {industryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel>City</FieldLabel>
                <div className="relative">
                  <MdLocationCity
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    value={formValues.city_id}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed appearance-none"
                  >
                    <option value="">—</option>
                    {cityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel>Expected Hiring Volume</FieldLabel>
                <input
                  type="text"
                  value={formValues.job_hiring_volume}
                  disabled
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <FieldLabel>Hiring Frequency</FieldLabel>
                <select
                  value={formValues.hiring_frequency}
                  disabled
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed appearance-none"
                >
                  <option value="">—</option>
                  {frequencyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Preferred Demo Date</FieldLabel>
                <input
                  type="text"
                  value={formValues.preferred_demo_date || "—"}
                  disabled
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <FieldLabel>Preferred Demo Time</FieldLabel>
                <input
                  type="text"
                  value={formValues.preferred_demo_time || "—"}
                  disabled
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel>Message / Requirements</FieldLabel>
                <textarea
                  value={formValues.message}
                  disabled
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed resize-none"
                />
              </div>
            </div>
          </div>
        );

      case "assignment":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <SearchableSelect
                label="Interested Plan"
                options={planOptions}
                value={formValues.interested_plan}
                onChange={(v) => handleSelectChange("interested_plan", v)}
                placeholder="Select plan"
              />

              <div>
                <FieldLabel>Source</FieldLabel>
                <select
                  name="source"
                  value={formValues.source}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all bg-white"
                >
                  <option value="">Select source</option>
                  {sourceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <SearchableSelect
                label="Assigned To"
                options={userOptions}
                value={formValues.assigned_to}
                onChange={(v) => handleSelectChange("assigned_to", v)}
                placeholder="Assign to..."
              />

              <div>
                <FieldLabel required>Status</FieldLabel>
                <select
                  name="status"
                  value={formValues.status}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                    errors.status
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  } bg-white`}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-xs text-red-500 mt-1">{errors.status}</p>
                )}
              </div>

              <div>
                <FieldLabel>Priority</FieldLabel>
                <select
                  name="priority"
                  value={formValues.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all bg-white"
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Demo Scheduled At</FieldLabel>
                <div className="relative">
                  <MdSchedule
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="datetime-local"
                    name="demo_scheduled_at"
                    value={formValues.demo_scheduled_at}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Demo Completed At</FieldLabel>
                <div className="relative">
                  <MdCheckCircle
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="datetime-local"
                    name="demo_completed_at"
                    value={formValues.demo_completed_at}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <FieldLabel>Follow-up At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="datetime-local"
                    name="follow_up_at"
                    value={formValues.follow_up_at}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "remarks":
        return (
          <div className="space-y-5 max-w-2xl">
            <div>
              <FieldLabel>Admin Remarks</FieldLabel>
              <div className="relative">
                <MdMessage
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />
                <textarea
                  name="admin_remarks"
                  value={formValues.admin_remarks}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Internal notes..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y bg-white"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Internal remarks visible only to admins.
              </p>
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
              onClick={() => navigate("/demo-requests")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Demo Requests · Edit
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroCompany || heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/demo-requests")}
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
              {loading ? "Updating..." : "Update Request"}
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
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdPerson size={24} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  <StatusPill status={formValues.status} />
                  <PriorityPill priority={formValues.priority} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {heroCompany && (
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                      {heroCompany}
                    </span>
                  )}
                  <span className="text-xs text-white/70">
                    {formValues.email}
                  </span>
                  <span className="text-xs text-white/70">ID: #{id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Company
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {heroCompany || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAssignment size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {formValues.status}
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
                {formValues.priority}
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
                {formValues.assigned_to
                  ? userOptions.find(
                      (u) => u.value === formValues.assigned_to
                    )?.label || "User"
                  : "Unassigned"}
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
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="edit-demo-request-tab-underline"
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

        {/* ─── Actions ────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
            >
              <MdDelete size={16} />
              Delete Demo Request
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/demo-requests")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
              >
                <MdCancel size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdSave size={16} />
                )}
                {loading ? "Updating..." : "Update Request"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/demo-requests")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>

      {/* ─── Delete Confirmation Dialog ─────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Demo Request"
        message="Delete this demo request? This action cannot be undone."
      />
    </div>
  );
};

export default EditDemoRequest;