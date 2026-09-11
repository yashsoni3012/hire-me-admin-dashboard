// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Editor } from "@tinymce/tinymce-react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MdArrowBack,
//   MdSave,
//   MdCancel,
//   MdDelete,
//   MdWarning,
//   MdClose,
//   MdLanguage,
//   MdCalendarToday,
//   MdCategory,
//   MdGroups,
//   MdReceiptLong,
//   MdDescription,
//   MdImage,
//   MdHistory,
//   MdApartment,
//   MdPerson,
//   MdCreditCard,
//   MdPermIdentity,
//   MdOpenInNew,
//   MdCloudUpload,
//   MdWhatshot,
//   MdCheckCircle,
//   MdErrorOutline,
//   MdPauseCircle,
//   MdBlock,
//   MdWork,
//   MdBusiness,
//   MdAttachMoney,
//   MdDateRange,
//   MdTrendingUp,
//   MdCheck,
// } from "react-icons/md";
// import jobService, {
//   companyService,
//   jobTypeService,
//   workplaceTypeService,
//   functionRoleService,
// } from "../../services/job.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";
// import { useAuth } from "../../context/AuthContext";

// // ─── Helpers ──────────────────────────────────────────────────

// const toNumberOrEmpty = (value) => {
//   if (value === null || value === undefined || value === "") return "";
//   const number = Number(value);
//   return Number.isNaN(number) ? "" : number;
// };

// const toBoolean = (value) =>
//   value === true || value === 1 || value === "1" || value === "true";

// const getCompanyName = (company) =>
//   company?.company_name ||
//   company?.Company?.company_name ||
//   company?.CompanyUser?.company_name ||
//   company?.CompanyUser?.company_user_email ||
//   company?.CompanyUser?.email ||
//   "";

// const parseApiDate = (dateString) => {
//   if (!dateString) return null;
//   if (dateString instanceof Date) return dateString;
//   if (typeof dateString !== "string") return null;
//   if (dateString.includes("T")) {
//     const d = new Date(dateString);
//     if (!Number.isNaN(d.getTime())) return d;
//   }
//   const match = dateString.match(
//     /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i,
//   );
//   if (match) {
//     let [, day, month, year, hours, minutes, seconds, ampm] = match;
//     hours = Number(hours);
//     if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
//     if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;
//     const d = new Date(
//       Number(year),
//       Number(month) - 1,
//       Number(day),
//       hours,
//       Number(minutes),
//       Number(seconds),
//     );
//     return Number.isNaN(d.getTime()) ? null : d;
//   }
//   const d = new Date(dateString);
//   return Number.isNaN(d.getTime()) ? null : d;
// };

// const formatDateTime = (date) => {
//   if (!date) return "—";
//   const parsed = typeof date === "string" ? parseApiDate(date) : date;
//   if (!parsed || Number.isNaN(parsed.getTime())) return "—";
//   return parsed.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const generateSlug = (title) => {
//   if (!title) return "";
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .substring(0, 100);
// };

// // ─── Status styles ─────────────────────────────────────────────

// const STATUS_STYLES = {
//   draft: {
//     pill: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
//     dot: "bg-gray-400",
//     icon: MdPauseCircle,
//   },
//   published: {
//     pill: "bg-green-50 text-green-700 ring-1 ring-green-200",
//     dot: "bg-green-500",
//     icon: MdCheckCircle,
//   },
//   closed: {
//     pill: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
//     dot: "bg-yellow-500",
//     icon: MdErrorOutline,
//   },
// };

// const StatusPill = ({ status }) => {
//   const style = STATUS_STYLES[status] || STATUS_STYLES.draft;
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

// const ViewBadge = ({ active }) => (
//   <span
//     className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
//       active
//         ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
//         : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
//     }`}
//   >
//     <span
//       className={`w-1.5 h-1.5 rounded-full ${
//         active ? "bg-emerald-500" : "bg-slate-400"
//       }`}
//     />
//     {active ? "Active" : "Inactive"}
//   </span>
// );

// // ─── Helper components ────────────────────────────────────────

// const FieldLabel = ({ children, required }) => (
//   <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
//     {children}
//     {required && <span className="text-red-500 ml-0.5">*</span>}
//   </label>
// );

// const RichTextEditorField = ({ value, onChange, height = 350 }) => {
//   const [editorMode, setEditorMode] = useState("text");
//   const editorRef = useRef(null);

//   const syncToEditor = (nextValue) => {
//     if (
//       editorRef.current &&
//       typeof editorRef.current.setContent === "function"
//     ) {
//       editorRef.current.setContent(nextValue || "", { format: "html" });
//     }
//   };

//   const handleModeChange = (nextMode) => {
//     if (nextMode === "html" && editorRef.current) {
//       const currentHtml = editorRef.current.getContent();
//       if (currentHtml !== value) {
//         onChange(currentHtml);
//       }
//     }

//     if (nextMode === "text") {
//       syncToEditor(value || "");
//     }

//     setEditorMode(nextMode);
//   };

//   return (
//     <div className="space-y-3">
//       <div className="flex gap-1 p-1 w-fit bg-slate-100 rounded-lg">
//         {["text", "html"].map((mode) => (
//           <button
//             key={mode}
//             type="button"
//             onClick={() => handleModeChange(mode)}
//             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
//               editorMode === mode
//                 ? "bg-white text-blue-600 shadow-sm"
//                 : "text-slate-600 hover:text-slate-900"
//             }`}
//           >
//             {mode === "text" ? "Text" : "HTML"}
//           </button>
//         ))}
//       </div>

//       {editorMode === "text" ? (
//         <div className="border border-slate-200 rounded-xl overflow-hidden">
//           <Editor
//             tinymceScriptSrc="/tinymce/tinymce.min.js"
//             licenseKey="gpl"
//             value={value || ""}
//             onEditorChange={onChange}
//             onInit={(evt, editor) => {
//               editorRef.current = editor;
//               editor.setContent(value || "", { format: "html" });
//             }}
//             init={{
//               height,
//               menubar: false,
//               statusbar: true,
//               plugins: [
//                 "advlist",
//                 "autolink",
//                 "lists",
//                 "link",
//                 "image",
//                 "charmap",
//                 "preview",
//                 "anchor",
//                 "searchreplace",
//                 "visualblocks",
//                 "code",
//                 "fullscreen",
//                 "insertdatetime",
//                 "media",
//                 "table",
//                 "help",
//                 "wordcount",
//               ],
//               toolbar:
//                 "undo redo | blocks | bold italic underline strikethrough | " +
//                 "alignleft aligncenter alignright alignjustify | " +
//                 "bullist numlist outdent indent | link image table | " +
//                 "forecolor backcolor | removeformat code | help",
//               content_style:
//                 "body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.7; } p { margin: 0 0 10px; } h1, h2, h3, h4, h5, h6 { margin: 0 0 12px; line-height: 1.3; }",
//               placeholder: "Write the job description here…",
//               forced_root_block: "p",
//               verify_html: false,
//               cleanup: false,
//             }}
//           />
//         </div>
//       ) : (
//         <textarea
//           value={value || ""}
//           onChange={(event) => onChange(event.target.value)}
//           className="w-full min-h-[350px] px-4 py-3 bg-slate-950 text-slate-100 border border-slate-200 rounded-xl text-sm font-mono placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-slate-950 transition-all resize-y"
//           spellCheck={false}
//           rows={16}
//           placeholder="<!-- Write HTML here -->"
//         />
//       )}
//     </div>
//   );
// };

// const RichTextViewer = ({ value }) => {
//   const [viewMode, setViewMode] = useState("text");
//   const content = value || "";

//   return (
//     <div className="space-y-3">
//       <div className="flex gap-1 p-1 w-fit bg-slate-100 rounded-lg">
//         {["text", "html"].map((mode) => (
//           <button
//             key={mode}
//             type="button"
//             onClick={() => setViewMode(mode)}
//             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
//               viewMode === mode
//                 ? "bg-white text-blue-600 shadow-sm"
//                 : "text-slate-600 hover:text-slate-900"
//             }`}
//           >
//             {mode === "text" ? "Text" : "HTML"}
//           </button>
//         ))}
//       </div>

//       {viewMode === "text" ? (
//         <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
//           {content ? (
//             <div
//               className="prose prose-sm max-w-none text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_table]:border [&_table]:border-slate-300 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2"
//               dangerouslySetInnerHTML={{ __html: content }}
//             />
//           ) : (
//             <span className="text-slate-400">—</span>
//           )}
//         </div>
//       ) : (
//         <pre className="whitespace-pre-wrap break-words p-4 font-mono text-xs text-slate-700 bg-slate-950/5 border border-slate-200 rounded-xl min-h-[120px]">
//           {content || ""}
//         </pre>
//       )}
//     </div>
//   );
// };

// const ReadOnlyValue = ({ children }) => (
//   <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
//     {children || "—"}
//   </div>
// );

// const HeroStat = ({ icon: Icon, label, value }) => (
//   <div className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-sm px-3.5 py-2.5 min-w-0">
//     <Icon size={16} className="text-white/70 flex-shrink-0" />
//     <div className="min-w-0">
//       <p className="text-[10px] text-black leading-tight">{label}</p>
//       <p className="text-sm font-semibold text-black truncate leading-tight">
//         {value || "—"}
//       </p>
//     </div>
//   </div>
// );

// const Tabs = [
//   { id: "overview", label: "Overview", icon: MdApartment },
//   { id: "classification", label: "Classification", icon: MdCategory },
//   { id: "compensation", label: "Compensation", icon: MdAttachMoney },
//   { id: "description", label: "Description", icon: MdDescription },
//   { id: "status", label: "Status & Features", icon: MdCheck },
//   { id: "activity", label: "Activity", icon: MdHistory },
// ];

// // ─── Main Component ────────────────────────────────────────────

// const JobsForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const { user } = useAuth();
//   const userId = user?.id;

//   // ─── Mode resolution ──────────────────────────────────────

//   const resolveModeFromPath = (pathname) => {
//     if (pathname.includes("/view/")) return "view";
//     if (pathname.includes("/edit/")) return "edit";
//     return "add";
//   };

//   const [mode, setMode] = useState(() =>
//     resolveModeFromPath(location.pathname),
//   );
//   const [pageLoading, setPageLoading] = useState(() => {
//     const initialMode = resolveModeFromPath(location.pathname);
//     return initialMode === "edit" || initialMode === "view";
//   });
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");

//   // ─── Dropdown states ───────────────────────────────────────

//   const [companies, setCompanies] = useState([]);
//   const [jobTypes, setJobTypes] = useState([]);
//   const [workplaceTypes, setWorkplaceTypes] = useState([]);
//   const [functionRoles, setFunctionRoles] = useState([]);
//   const [loadingDropdowns, setLoadingDropdowns] = useState(false);
//   const [userNameCache, setUserNameCache] = useState({});

//   // ─── Fetch dropdowns ──────────────────────────────────────

//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       setLoadingDropdowns(true);
//       try {
//         const [
//           companyResponse,
//           jobTypeResponse,
//           workplaceResponse,
//           functionRoleResponse,
//         ] = await Promise.all([
//           companyService.getAll(),
//           jobTypeService.getAll(),
//           workplaceTypeService.getAll(),
//           functionRoleService.getAll(),
//         ]);

//         // Companies
//         const companyData =
//           companyResponse?.data?.data ||
//           companyResponse?.data?.results ||
//           companyResponse?.data ||
//           [];
//         const normalizedCompanies = Array.isArray(companyData)
//           ? companyData
//               .map((c) => ({
//                 ...c,
//                 id: toNumberOrEmpty(
//                   c.id ??
//                     c.company_id ??
//                     c.Company?.id ??
//                     c.Company?.company_id,
//                 ),
//               }))
//               .filter((c) => c.id !== "")
//           : [];
//         setCompanies(normalizedCompanies);

//         // Job Types
//         const jobTypeData =
//           jobTypeResponse?.data?.data || jobTypeResponse?.data || [];
//         const normalizedJobTypes = Array.isArray(jobTypeData)
//           ? jobTypeData
//               .filter(
//                 (item) =>
//                   item.is_status === true ||
//                   item.is_status === 1 ||
//                   item.status === true ||
//                   item.status === 1,
//               )
//               .map((item) => ({
//                 ...item,
//                 id: toNumberOrEmpty(item.jobtype_id ?? item.id),
//               }))
//               .filter((item) => item.id !== "")
//           : [];
//         setJobTypes(normalizedJobTypes);

//         // Workplace Types
//         const workplaceData =
//           workplaceResponse?.data?.data || workplaceResponse?.data || [];
//         const normalizedWorkplaceTypes = Array.isArray(workplaceData)
//           ? workplaceData
//               .filter(
//                 (item) =>
//                   item.is_status === true ||
//                   item.is_status === 1 ||
//                   item.status === true ||
//                   item.status === 1,
//               )
//               .map((item) => ({
//                 ...item,
//                 id: toNumberOrEmpty(item.workplacetype_id ?? item.id),
//               }))
//               .filter((item) => item.id !== "")
//           : [];
//         setWorkplaceTypes(normalizedWorkplaceTypes);

//         // Function Roles
//         const functionRoleData =
//           functionRoleResponse?.data?.data || functionRoleResponse?.data || [];
//         const normalizedFunctionRoles = Array.isArray(functionRoleData)
//           ? functionRoleData
//               .filter(
//                 (item) =>
//                   item.is_status === true ||
//                   item.is_status === 1 ||
//                   item.status === true ||
//                   item.status === 1,
//               )
//               .map((item) => ({
//                 ...item,
//                 id: toNumberOrEmpty(item.functionrole_id ?? item.id),
//               }))
//               .filter((item) => item.id !== "")
//           : [];
//         setFunctionRoles(normalizedFunctionRoles);
//       } catch (error) {
//         console.error("Error loading dropdowns:", error);
//         showError("Failed to load form data. Please refresh.");
//       } finally {
//         setLoadingDropdowns(false);
//       }
//     };
//     fetchDropdowns();
//   }, []);

//   // ─── Load users ────────────────────────────────────────────

//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users || {}).forEach((uid) => {
//           userMap[uid] = users[uid]?.name;
//         });
//         setUserNameCache(userMap);
//       } catch (error) {
//         console.error("Failed to load users:", error);
//       }
//     };
//     loadUsers();
//   }, []);

//   const getCreatedByName = (row) => {
//     if (!row?.created_by) return "—";
//     return userNameCache[row.created_by] || `User ${row.created_by}`;
//   };
//   const getUpdatedByName = (row) => {
//     if (!row?.updated_by) return "—";
//     return userNameCache[row.updated_by] || `User ${row.updated_by}`;
//   };

//   // ─── Normalize job data ──────────────────────────────────

//   const normalizeJobData = (item) => {
//     if (!item) return null;
//     const companyId = toNumberOrEmpty(
//       item.company_id ??
//         item.Company?.company_id ??
//         item.Company?.id ??
//         item.company?.company_id ??
//         item.company?.id,
//     );
//     const jobTypeId = toNumberOrEmpty(
//       item.jobtype_id ?? item.JobType?.jobtype_id,
//     );
//     const workplaceTypeId = toNumberOrEmpty(
//       item.workplacetype_id ?? item.WorkplaceType?.workplacetype_id,
//     );
//     const functionRoleId = toNumberOrEmpty(
//       item.functionrole_id ?? item.FunctionRole?.functionrole_id,
//     );

//     let companyName =
//       item.company_name ||
//       getCompanyName(item.Company) ||
//       getCompanyName(item.company);
//     if (!companyName && companyId !== "") {
//       const comp = companies.find((c) => Number(c.id) === Number(companyId));
//       if (comp) companyName = getCompanyName(comp);
//     }

//     return {
//       id: item.id || item._id,
//       title: item.title || "",
//       job_description: item.job_description || "",
//       company_id: companyId,
//       company_name: companyName,
//       jobtype_id: jobTypeId,
//       jobtype_name: item.JobType?.name || item.jobtype_name || "",
//       workplacetype_id: workplaceTypeId,
//       workplacetype_name:
//         item.WorkplaceType?.name || item.workplacetype_name || "",
//       functionrole_id: functionRoleId,
//       functionrole_name:
//         item.FunctionRole?.name || item.functionrole_name || "",
//       experience_min: item.experience_min ?? "",
//       experience_max: item.experience_max ?? "",
//       experience_type: item.experience_type || "experience",
//       salary_min: item.salary_min ?? "",
//       salary_max: item.salary_max ?? "",
//       salary_confidential: toBoolean(item.salary_confidential),
//       job_status: item.job_status || "draft",
//       posting_type: item.posting_type || "permanent",
//       expiry_date: item.expiry_date || "",
//       auto_renew: item.auto_renew || "off",
//       reference_code: item.reference_code || "",
//       is_trending: toBoolean(item.is_trending),
//       is_status: toBoolean(item.is_status),
//       daily_application_summary: toBoolean(item.daily_application_summary),
//       notify_matching_type:
//         item.notify_matching_type || "All matching applicants",
//       prioritize_women: toBoolean(item.prioritize_women),
//       schedule_date: item.schedule_date || null,
//       published_at: item.published_at || null,
//       slug: item.slug || "",
//       created_by: item.created_by ?? null,
//       updated_by: item.updated_by ?? null,
//       created_at: item.created_at || null,
//       updated_at: item.updated_at || null,
//     };
//   };

//   // ─── Fetch edit/view data ────────────────────────────────

//   useEffect(() => {
//     const fetchData = async () => {
//       if ((mode !== "edit" && mode !== "view") || !id) return;
//       setPageLoading(true);
//       try {
//         let item = location.state?.item;
//         if (!item) {
//           const response = await jobService.getById(id);
//           item = response?.data?.data || response?.data;
//         }
//         if (!item) throw new Error("Job data not found");
//         const normalizedData = normalizeJobData(item);
//         setData(normalizedData);
//       } catch (error) {
//         console.error("Fetch job error:", error);
//         showError("Failed to load job data");
//         navigate("/jobs");
//       } finally {
//         setPageLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, mode, location.state, navigate, companies]);

//   // ─── Update company name after companies load ────────────

//   useEffect(() => {
//     if (!data?.company_id) return;
//     const company = companies.find(
//       (c) => Number(c.id) === Number(data.company_id),
//     );
//     if (!company) return;
//     const companyName =
//       company.company_name || company.CompanyUser?.company_user_email || "";
//     if (companyName && companyName !== data.company_name) {
//       setData((prev) => (prev ? { ...prev, company_name: companyName } : prev));
//     }
//   }, [companies, data?.company_id, data?.company_name]);

//   // ─── Form state ────────────────────────────────────────────

//   const getInitialData = () => {
//     if (mode === "add") {
//       return {
//         title: "",
//         job_description: "",
//         company_id: "",
//         jobtype_id: "",
//         workplacetype_id: "",
//         functionrole_id: "",
//         experience_min: "",
//         experience_max: "",
//         experience_type: "experience",
//         salary_min: "",
//         salary_max: "",
//         salary_confidential: false,
//         job_status: "draft",
//         posting_type: "permanent",
//         expiry_date: "",
//         auto_renew: "off",
//         reference_code: "",
//         is_trending: false,
//         status: "active",
//       };
//     }
//     if (data) {
//       return {
//         title: data.title || "",
//         job_description: data.job_description || "",
//         company_id: data.company_id !== "" ? Number(data.company_id) : "",
//         jobtype_id: data.jobtype_id !== "" ? Number(data.jobtype_id) : "",
//         workplacetype_id:
//           data.workplacetype_id !== "" ? Number(data.workplacetype_id) : "",
//         functionrole_id:
//           data.functionrole_id !== "" ? Number(data.functionrole_id) : "",
//         experience_min: data.experience_min ?? "",
//         experience_max: data.experience_max ?? "",
//         experience_type: data.experience_type || "experience",
//         salary_min: data.salary_min ?? "",
//         salary_max: data.salary_max ?? "",
//         salary_confidential: data.salary_confidential || false,
//         job_status: data.job_status || "draft",
//         posting_type: data.posting_type || "permanent",
//         expiry_date: data.expiry_date || "",
//         auto_renew: data.auto_renew || "off",
//         reference_code: data.reference_code || "",
//         is_trending: data.is_trending || false,
//         status: data.is_status ? "active" : "inactive",
//         // Additional view-only props
//         company_name: data.company_name || "",
//         jobtype_name: data.jobtype_name || "",
//         workplacetype_name: data.workplacetype_name || "",
//         functionrole_name: data.functionrole_name || "",
//         created_by: data.created_by,
//         updated_by: data.updated_by,
//         created_at: data.created_at,
//         updated_at: data.updated_at,
//       };
//     }
//     return {};
//   };

//   const [formValues, setFormValues] = useState(getInitialData);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   useEffect(() => {
//     setFormValues(getInitialData());
//   }, [data, mode]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFormValues((prev) => ({ ...prev, [name]: val }));
//     // Clear error for field
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//   };

//   // ─── Validation ────────────────────────────────────────────

//   const getValidationRules = () => ({
//     title: {
//       required: true,
//       requiredMessage: "Job title is required",
//       minLength: 5,
//       minLengthMessage: "Job title must be at least 5 characters",
//       maxLength: 200,
//       maxLengthMessage: "Job title must be at most 200 characters",
//     },
//     company_id: {
//       required: true,
//       requiredMessage: "Please select a company",
//     },
//     jobtype_id: {
//       required: true,
//       requiredMessage: "Please select a job type",
//     },
//     workplacetype_id: {
//       required: true,
//       requiredMessage: "Please select a workplace type",
//     },
//     functionrole_id: {
//       required: true,
//       requiredMessage: "Please select a function role",
//     },
//     job_status: {
//       required: true,
//       requiredMessage: "Please select a job status",
//     },
//     experience_type: {
//       required: true,
//       requiredMessage: "Please select an experience type",
//     },
//     posting_type: {
//       required: true,
//       requiredMessage: "Please select a posting type",
//     },
//     auto_renew: {
//       required: true,
//       requiredMessage: "Please select auto-renew option",
//     },
//     experience_min: {
//       custom: (value) => {
//         if (value !== "" && value !== null && value !== undefined) {
//           const num = Number(value);
//           if (Number.isNaN(num))
//             return "Experience minimum must be a valid number";
//           if (num < 0) return "Experience minimum cannot be negative";
//           if (num > 50) return "Experience minimum cannot exceed 50 years";
//         }
//         return null;
//       },
//     },
//     experience_max: {
//       custom: (value, formData) => {
//         if (value !== "" && value !== null && value !== undefined) {
//           const num = Number(value);
//           if (Number.isNaN(num))
//             return "Experience maximum must be a valid number";
//           if (num < 0) return "Experience maximum cannot be negative";
//           if (num > 50) return "Experience maximum cannot exceed 50 years";
//           if (
//             formData?.experience_min !== "" &&
//             formData?.experience_min !== null &&
//             formData?.experience_min !== undefined
//           ) {
//             const min = Number(formData.experience_min);
//             if (!Number.isNaN(min) && num < min)
//               return "Experience maximum must be >= minimum";
//           }
//         }
//         return null;
//       },
//     },
//     salary_min: {
//       custom: (value) => {
//         if (value !== "" && value !== null && value !== undefined) {
//           const num = Number(value);
//           if (Number.isNaN(num)) return "Salary minimum must be a valid number";
//           if (num < 0) return "Salary minimum cannot be negative";
//         }
//         return null;
//       },
//     },
//     salary_max: {
//       custom: (value, formData) => {
//         if (value !== "" && value !== null && value !== undefined) {
//           const num = Number(value);
//           if (Number.isNaN(num)) return "Salary maximum must be a valid number";
//           if (num < 0) return "Salary maximum cannot be negative";
//           if (
//             formData?.salary_min !== "" &&
//             formData?.salary_min !== null &&
//             formData?.salary_min !== undefined
//           ) {
//             const min = Number(formData.salary_min);
//             if (!Number.isNaN(min) && num < min)
//               return "Salary maximum must be >= minimum";
//           }
//         }
//         return null;
//       },
//     },
//   });

//   const validateField = (name, value, allValues) => {
//     const rules = getValidationRules()[name];
//     if (!rules) return null;
//     if (
//       rules.required &&
//       (value === "" || value === null || value === undefined)
//     ) {
//       return rules.requiredMessage || `${name} is required`;
//     }
//     if (rules.minLength && value?.length < rules.minLength) {
//       return rules.minLengthMessage || `Minimum length is ${rules.minLength}`;
//     }
//     if (rules.maxLength && value?.length > rules.maxLength) {
//       return rules.maxLengthMessage || `Maximum length is ${rules.maxLength}`;
//     }
//     if (rules.custom) {
//       return rules.custom(value, allValues);
//     }
//     return null;
//   };

//   const validateAll = () => {
//     const allValues = formValues;
//     const newErrors = {};
//     const rules = getValidationRules();
//     Object.keys(rules).forEach((field) => {
//       const error = validateField(field, allValues[field], allValues);
//       if (error) newErrors[field] = error;
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ─── Submit ────────────────────────────────────────────────

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateAll()) {
//       showError("Please fix validation errors");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         title: formValues.title.trim(),
//         job_description: formValues.job_description?.trim() || "",
//         company_id: toNumberOrEmpty(formValues.company_id) || null,
//         jobtype_id: toNumberOrEmpty(formValues.jobtype_id) || null,
//         workplacetype_id: toNumberOrEmpty(formValues.workplacetype_id) || null,
//         functionrole_id: toNumberOrEmpty(formValues.functionrole_id) || null,
//         experience_min:
//           formValues.experience_min !== ""
//             ? Number(formValues.experience_min)
//             : null,
//         experience_max:
//           formValues.experience_max !== ""
//             ? Number(formValues.experience_max)
//             : null,
//         experience_type: formValues.experience_type || "experience",
//         salary_min:
//           formValues.salary_min !== "" ? Number(formValues.salary_min) : null,
//         salary_max:
//           formValues.salary_max !== "" ? Number(formValues.salary_max) : null,
//         salary_confidential: toBoolean(formValues.salary_confidential),
//         job_status: formValues.job_status || "draft",
//         posting_type: formValues.posting_type || "permanent",
//         expiry_date: formValues.expiry_date || null,
//         auto_renew: formValues.auto_renew || "off",
//         reference_code: formValues.reference_code?.trim() || null,
//         is_trending: toBoolean(formValues.is_trending),
//         is_status: formValues.status === "active",
//         daily_application_summary: true,
//         notify_matching_type: "All matching applicants",
//         prioritize_women: false,
//         schedule_date:
//           formValues.job_status === "published"
//             ? new Date().toISOString()
//             : null,
//         published_at:
//           formValues.job_status === "published"
//             ? new Date().toISOString()
//             : null,
//         slug: generateSlug(formValues.title.trim()),
//       };

//       if (mode === "edit" && id) {
//         payload.updated_by = userId || null;
//         await jobService.update(id, payload);
//         showSuccess("Job updated successfully");
//       } else {
//         payload.created_by = userId || null;
//         payload.updated_by = userId || null;
//         await jobService.create(payload);
//         showSuccess("Job created successfully");
//       }
//       navigate("/jobs");
//     } catch (error) {
//       console.error("Submit error:", error);
//       const msg =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         error?.message ||
//         "Failed to save job";
//       showError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Delete ────────────────────────────────────────────────

//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const handleDelete = async () => {
//     if (!id) return;
//     setDeleteLoading(true);
//     try {
//       await jobService.deleteJobBenefits(id);
//       await jobService.delete(id);
//       showSuccess("Job deleted successfully");
//       navigate("/jobs");
//     } catch (error) {
//       console.error("Delete error:", error);
//       showError(
//         error?.response?.data?.message || error?.message || "Failed to delete",
//       );
//     } finally {
//       setDeleteLoading(false);
//       setIsDeleteModalOpen(false);
//     }
//   };

//   // ─── Dropdown options ──────────────────────────────────────

//   const getDropdownOptions = () => {
//     const companyOptions = companies.map((c) => ({
//       value: Number(c.id),
//       label: getCompanyName(c) || `Company ${c.id}`,
//     }));
//     if (
//       data?.company_id &&
//       !companyOptions.some((o) => Number(o.value) === Number(data.company_id))
//     ) {
//       companyOptions.unshift({
//         value: Number(data.company_id),
//         label: data.company_name || `Company ${data.company_id}`,
//       });
//     }
//     const jobTypeOptions = jobTypes.map((j) => ({
//       value: Number(j.id),
//       label: j.name || "",
//     }));
//     const workplaceTypeOptions = workplaceTypes.map((w) => ({
//       value: Number(w.id),
//       label: w.name || "",
//     }));
//     const functionRoleOptions = functionRoles.map((f) => ({
//       value: Number(f.id),
//       label: f.name || "",
//     }));
//     return {
//       companyOptions,
//       jobTypeOptions,
//       workplaceTypeOptions,
//       functionRoleOptions,
//     };
//   };

//   // ─── Render field based on definition ──────────────────────

//   const renderField = (fieldDef) => {
//     const {
//       name,
//       label,
//       type,
//       required,
//       options,
//       placeholder,
//       rows,
//       disabled,
//       viewRender,
//       color,
//       min,
//       max,
//       step,
//     } = fieldDef;

//     const value = formValues[name] ?? "";
//     const error = errors[name];
//     const isTouched = touched[name];

//     if (mode === "view" && name === "job_description") {
//       return (
//         <div key={name} className="mb-4 md:col-span-2">
//           <FieldLabel>{label}</FieldLabel>
//           <RichTextViewer value={value} />
//         </div>
//       );
//     }

//     if (mode === "view" && viewRender) {
//       return (
//         <div key={name} className="mb-4">
//           <FieldLabel>{label}</FieldLabel>
//           <div className="text-sm text-slate-700">
//             {viewRender(value, formValues)}
//           </div>
//         </div>
//       );
//     }

//     const commonInputClass = `w-full px-3.5 py-2.5 border ${
//       error && isTouched ? "border-red-500" : "border-slate-300"
//     } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

//     let inputElement;
//     switch (type) {
//       case "select":
//         inputElement = (
//           <select
//             name={name}
//             value={value}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             disabled={disabled || loadingDropdowns}
//             className={commonInputClass}
//           >
//             <option value="">
//               {loadingDropdowns ? "Loading..." : placeholder || "Select option"}
//             </option>
//             {options?.map((opt) => (
//               <option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>
//         );
//         break;

//       case "textarea":
//         if (name === "job_description") {
//           inputElement = (
//             <RichTextEditorField
//               value={value}
//               onChange={(nextValue) => {
//                 setFormValues((prev) => ({ ...prev, [name]: nextValue }));
//                 if (errors[name]) {
//                   setErrors((prev) => ({ ...prev, [name]: undefined }));
//                 }
//               }}
//             />
//           );
//         } else {
//           inputElement = (
//             <textarea
//               name={name}
//               value={value}
//               onChange={handleInputChange}
//               onBlur={handleBlur}
//               rows={rows || 4}
//               placeholder={placeholder}
//               disabled={disabled}
//               className={`${commonInputClass} resize-y`}
//             />
//           );
//         }
//         break;

//       case "checkbox":
//         inputElement = (
//           <div className="flex items-center gap-3 pt-1.5">
//             <input
//               type="checkbox"
//               name={name}
//               checked={Boolean(value)}
//               onChange={handleInputChange}
//               onBlur={handleBlur}
//               disabled={disabled}
//               className={`w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${color || ""}`}
//             />
//             <span className="text-sm text-slate-600">{label}</span>
//           </div>
//         );
//         break;

//       case "radio":
//         inputElement = (
//           <div className="flex flex-wrap gap-4 pt-1.5">
//             {options?.map((opt) => (
//               <label
//                 key={opt.value}
//                 className="flex items-center gap-2 text-sm text-slate-700"
//               >
//                 <input
//                   type="radio"
//                   name={name}
//                   value={opt.value}
//                   checked={String(value) === String(opt.value)}
//                   onChange={handleInputChange}
//                   onBlur={handleBlur}
//                   disabled={disabled}
//                   className={`w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500 ${color || ""}`}
//                 />
//                 {opt.label}
//               </label>
//             ))}
//           </div>
//         );
//         break;

//       case "number":
//         inputElement = (
//           <input
//             type="number"
//             name={name}
//             value={value}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             placeholder={placeholder}
//             disabled={disabled}
//             min={min}
//             max={max}
//             step={step}
//             className={commonInputClass}
//           />
//         );
//         break;

//       case "date":
//         inputElement = (
//           <input
//             type="date"
//             name={name}
//             value={value}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             disabled={disabled}
//             className={commonInputClass}
//           />
//         );
//         break;

//       default:
//         inputElement = (
//           <input
//             type="text"
//             name={name}
//             value={value}
//             onChange={handleInputChange}
//             onBlur={handleBlur}
//             placeholder={placeholder}
//             disabled={disabled}
//             className={commonInputClass}
//           />
//         );
//     }

//     return (
//       <div key={name} className="mb-4">
//         {type !== "checkbox" && type !== "radio" && (
//           <FieldLabel required={required}>{label}</FieldLabel>
//         )}
//         {inputElement}
//         {error && isTouched && (
//           <p className="mt-1 text-xs text-red-500">{error}</p>
//         )}
//       </div>
//     );
//   };

//   // ─── Group fields by tab ──────────────────────────────────

//   const fields = (() => {
//     if (mode === "view") {
//       return [
//         // overview
//         [
//           "title",
//           "company_name",
//           "reference_code",
//           "jobtype_name",
//           "workplacetype_name",
//           "functionrole_name",
//         ],
//         // classification
//         ["jobtype_name", "workplacetype_name", "functionrole_name"],
//         // compensation
//         ["salary_min", "salary_max", "salary_confidential"],
//         // description
//         ["job_description"],
//         // status
//         [
//           "job_status",
//           "posting_type",
//           "expiry_date",
//           "auto_renew",
//           "is_trending",
//           "status",
//         ],
//         // activity
//         ["created_by", "created_at", "updated_by", "updated_at"],
//       ];
//     }
//     // add/edit
//     return [
//       // overview
//       ["title", "company_id", "reference_code"],
//       // classification
//       ["jobtype_id", "workplacetype_id", "functionrole_id"],
//       // compensation
//       ["salary_min", "salary_max", "salary_confidential"],
//       // description
//       ["job_description"],
//       // status
//       [
//         "job_status",
//         "posting_type",
//         "expiry_date",
//         "auto_renew",
//         "is_trending",
//         "status",
//       ],
//       // activity - only in edit/view, not in add
//     ];
//   })();

//   const getTabFields = (tabId) => {
//     const tabMap = {
//       overview: 0,
//       classification: 1,
//       compensation: 2,
//       description: 3,
//       status: 4,
//       activity: 5,
//     };
//     const index = tabMap[tabId];
//     if (index === undefined) return [];
//     const fieldNames = fields[index] || [];
//     const allFieldDefs = (() => {
//       if (mode === "view") {
//         // We need the view field definitions from getFields() but we don't have them here.
//         // We'll construct them manually based on the fields we have.
//         // Since we are in view mode, we can render simple read-only labels using the field names.
//         // We'll map field names to display labels.
//         const labelMap = {
//           title: "Job Title",
//           company_name: "Company",
//           reference_code: "Reference Code",
//           jobtype_name: "Job Type",
//           workplacetype_name: "Workplace Type",
//           functionrole_name: "Function Role",
//           salary_min: "Salary Min",
//           salary_max: "Salary Max",
//           salary_confidential: "Salary Confidential",
//           job_description: "Job Description",
//           job_status: "Job Status",
//           posting_type: "Posting Type",
//           expiry_date: "Expiry Date",
//           auto_renew: "Auto Renew",
//           is_trending: "Trending",
//           status: "Active",
//           created_by: "Created By",
//           created_at: "Created At",
//           updated_by: "Updated By",
//           updated_at: "Updated At",
//         };
//         return fieldNames.map((name) => ({
//           name,
//           label: labelMap[name] || name,
//           type: "text",
//           viewRender: (value, row) => {
//             if (name === "salary_min" || name === "salary_max") {
//               return value !== "" && value !== null && value !== undefined
//                 ? `₹${Number(value).toLocaleString("en-IN")}`
//                 : "—";
//             }
//             if (name === "salary_confidential") {
//               return value ? "Confidential" : "Not Confidential";
//             }
//             if (name === "is_trending") {
//               return value ? "Trending" : "Not Trending";
//             }
//             if (name === "status") {
//               return <ViewBadge active={row?.is_status} />;
//             }
//             if (name === "job_status") {
//               return <StatusPill status={value} />;
//             }
//             if (name === "created_at" || name === "updated_at") {
//               return formatDateTime(row?.[name]);
//             }
//             if (name === "created_by" || name === "updated_by") {
//               const nameFn =
//                 name === "created_by" ? getCreatedByName : getUpdatedByName;
//               return nameFn(row);
//             }
//             return value || "—";
//           },
//         }));
//       } else {
//         // add/edit: we need the actual field definitions from getFields() but they are not directly accessible.
//         // We'll rebuild them from the field definitions we used in the original JobsForm.
//         // Since we have the logic in the original component, we can copy the field definitions from there.
//         // But to keep this self-contained, we'll define them inline.
//         const {
//           companyOptions,
//           jobTypeOptions,
//           workplaceTypeOptions,
//           functionRoleOptions,
//         } = getDropdownOptions();

//         const jobStatusOptions = [
//           { value: "draft", label: "Draft" },
//           { value: "published", label: "Published" },
//           { value: "closed", label: "Closed" },
//         ];
//         const postingTypeOptions = [
//           { value: "permanent", label: "Permanent" },
//           { value: "contract", label: "Contract" },
//           { value: "walk-in", label: "Walk-in" },
//           { value: "internship", label: "Internship" },
//         ];
//         const experienceTypeOptions = [
//           { value: "experience", label: "Experience" },
//           { value: "fresher", label: "Fresher" },
//         ];
//         const autoRenewOptions = [
//           { value: "off", label: "Off" },
//           { value: "weekly", label: "Weekly" },
//           { value: "monthly", label: "Monthly" },
//         ];

//         const fieldDefs = {
//           title: {
//             name: "title",
//             label: "Job Title",
//             type: "text",
//             required: true,
//             placeholder: "e.g. Frontend Developer",
//           },
//           company_id: {
//             name: "company_id",
//             label: "Company",
//             type: "select",
//             required: true,
//             options: companyOptions,
//             placeholder: loadingDropdowns
//               ? "Loading companies..."
//               : "Select company",
//             disabled: loadingDropdowns,
//           },
//           reference_code: {
//             name: "reference_code",
//             label: "Reference Code",
//             type: "text",
//             placeholder: "e.g. JOB123",
//           },
//           jobtype_id: {
//             name: "jobtype_id",
//             label: "Job Type",
//             type: "select",
//             required: true,
//             options: jobTypeOptions,
//             placeholder: loadingDropdowns
//               ? "Loading job types..."
//               : "Select job type",
//             disabled: loadingDropdowns,
//           },
//           workplacetype_id: {
//             name: "workplacetype_id",
//             label: "Workplace Type",
//             type: "select",
//             required: true,
//             options: workplaceTypeOptions,
//             placeholder: loadingDropdowns
//               ? "Loading workplace types..."
//               : "Select workplace type",
//             disabled: loadingDropdowns,
//           },
//           functionrole_id: {
//             name: "functionrole_id",
//             label: "Function Role",
//             type: "select",
//             required: true,
//             options: functionRoleOptions,
//             placeholder: loadingDropdowns
//               ? "Loading function roles..."
//               : "Select function role",
//             disabled: loadingDropdowns,
//           },
//           experience_min: {
//             name: "experience_min",
//             label: "Experience Min (years)",
//             type: "number",
//             min: 0,
//             max: 50,
//             step: 1,
//             placeholder: "0",
//           },
//           experience_max: {
//             name: "experience_max",
//             label: "Experience Max (years)",
//             type: "number",
//             min: 0,
//             max: 50,
//             step: 1,
//             placeholder: "10",
//           },
//           experience_type: {
//             name: "experience_type",
//             label: "Experience Type",
//             type: "select",
//             required: true,
//             options: experienceTypeOptions,
//             placeholder: "Select experience type",
//           },
//           salary_min: {
//             name: "salary_min",
//             label: "Salary Min (₹)",
//             type: "number",
//             min: 0,
//             step: 1000,
//             placeholder: "30000",
//           },
//           salary_max: {
//             name: "salary_max",
//             label: "Salary Max (₹)",
//             type: "number",
//             min: 0,
//             step: 1000,
//             placeholder: "50000",
//           },
//           salary_confidential: {
//             name: "salary_confidential",
//             label: "Salary Confidential",
//             type: "checkbox",
//             color: "text-gray-500 focus:ring-gray-500",
//           },
//           job_description: {
//             name: "job_description",
//             label: "Job Description",
//             type: "textarea",
//             rows: 5,
//             placeholder: "Describe the role, responsibilities, requirements...",
//           },
//           job_status: {
//             name: "job_status",
//             label: "Job Status",
//             type: "select",
//             required: true,
//             options: jobStatusOptions,
//             placeholder: "Select job status",
//           },
//           posting_type: {
//             name: "posting_type",
//             label: "Posting Type",
//             type: "select",
//             required: true,
//             options: postingTypeOptions,
//             placeholder: "Select posting type",
//           },
//           expiry_date: {
//             name: "expiry_date",
//             label: "Expiry Date",
//             type: "date",
//           },
//           auto_renew: {
//             name: "auto_renew",
//             label: "Auto Renew",
//             type: "select",
//             required: true,
//             options: autoRenewOptions,
//             placeholder: "Select auto-renew option",
//           },
//           is_trending: {
//             name: "is_trending",
//             label: "Mark as Trending",
//             type: "checkbox",
//             color: "text-amber-500 focus:ring-amber-500",
//           },
//           status: {
//             name: "status",
//             label: "Active",
//             type: "radio",
//             options: [
//               { value: "active", label: "Active" },
//               { value: "inactive", label: "Inactive" },
//             ],
//             color: "text-[#2c0eee] focus:ring-[#4529f7]",
//           },
//         };

//         return fieldNames.map((name) => fieldDefs[name]).filter(Boolean);
//       }
//     })();
//     return allFieldDefs;
//   };

//   // ─── Loading state ─────────────────────────────────────────

//   if (pageLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-slate-400">Loading job data...</p>
//         </div>
//       </div>
//     );
//   }

//   if ((mode === "view" || mode === "edit") && !data && !pageLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
//         <div className="text-center bg-white rounded-2xl border border-slate-200 px-10 py-12">
//           <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
//           <p className="text-slate-600 font-medium">Job not found</p>
//           <button
//             onClick={() => navigate("/jobs")}
//             className="mt-3 text-blue-600 hover:underline"
//           >
//             Go back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const heroTitle =
//     mode === "add" ? "Create New Job" : formValues.title || "Untitled Job";
//   const companyName = formValues.company_name || formValues.company_id || "—";
//   const status = formValues.job_status || "draft";
//   const isTrending = formValues.is_trending;

//   // ─── Render ──────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen pb-16">
//       {/* ─── Sticky action bar ─────────────────────────────────── */}
//       <div className="z-30 bg-white/85 backdrop-blur-md border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3 min-w-0">
//             <button
//               onClick={() => navigate("/jobs")}
//               className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
//               aria-label="Back"
//             >
//               <MdArrowBack size={19} className="text-slate-600" />
//             </button>
//             <div className="min-w-0">
//               <p className="text-[11px] text-slate-400 leading-tight">Jobs</p>
//               <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
//                 {heroTitle}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             {mode === "view" && (
//               <>
//                 <button
//                   type="button"
//                   onClick={() => setIsDeleteModalOpen(true)}
//                   className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
//                   title="Delete job"
//                 >
//                   <MdDelete size={19} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     navigate(`/jobs/edit/${id}`, { state: { item: data } })
//                   }
//                   className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
//                 >
//                   <MdWork size={16} />
//                   Edit Job
//                 </button>
//               </>
//             )}
//             {(mode === "edit" || mode === "add") && (
//               <>
//                 <button
//                   type="button"
//                   onClick={() => navigate("/jobs")}
//                   className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
//                 >
//                   <MdCancel size={16} />
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
//                 >
//                   {loading ? (
//                     <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
//                   ) : (
//                     <MdSave size={16} />
//                   )}
//                   {loading
//                     ? "Saving..."
//                     : mode === "edit"
//                       ? "Update Job"
//                       : "Create Job"}
//                 </button>
//               </>
//             )}
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
//           <div className="relative h-44 sm:h-52 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800">
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
//           </div>

//           <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
//             <div className="flex flex-col sm:flex-row sm:items-end gap-4">
//               {/* Icon/Logo placeholder */}
//               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl flex-shrink-0 border border-white/20">
//                 <MdWork size={32} className="text-white" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
//                     {heroTitle}
//                   </h1>
//                   {isTrending && (
//                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
//                       <MdWhatshot size={12} />
//                       Trending
//                     </span>
//                   )}
//                 </div>
//                 <div className="mt-2 flex items-center gap-2 flex-wrap">
//                   <StatusPill status={status} />
//                   <span className="text-xs text-white/70">• {companyName}</span>
//                   {formValues.posting_type && (
//                     <span className="text-xs text-white/70 capitalize">
//                       {formValues.posting_type}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Completion ring placeholder */}
//               <div className="hidden sm:block">
//                 <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white text-xs font-medium">
//                   Job
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* ─── Quick stat strip ──────────────────────────────────── */}
//         {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
//           <HeroStat icon={MdBusiness} label="Company" value={companyName} />
//           <HeroStat icon={MdCategory} label="Job Type" value={formValues.jobtype_name || "—"} />
//           <HeroStat icon={MdWork} label="Experience" value={
//             formValues.experience_min && formValues.experience_max
//               ? `${formValues.experience_min} - ${formValues.experience_max} yrs`
//               : formValues.experience_min || formValues.experience_max || "—"
//           } />
//           <HeroStat icon={MdAttachMoney} label="Salary" value={
//             formValues.salary_min && formValues.salary_max
//               ? `₹${Number(formValues.salary_min).toLocaleString()} - ₹${Number(formValues.salary_max).toLocaleString()}`
//               : formValues.salary_min || formValues.salary_max || "—"
//           } />
//         </div> */}

//         {/* ─── Tabs ───────────────────────────────────────────────── */}
//         <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="flex overflow-x-auto border-b border-slate-200 px-2">
//             {Tabs.map((tab) => {
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
//                       layoutId="jobs-tab-underline"
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
//                 <form onSubmit={handleSubmit}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {getTabFields(activeTab).map((fieldDef) => {
//                       // For activity tab, we only show in view mode
//                       if (activeTab === "activity" && mode !== "view")
//                         return null;
//                       return (
//                         <div
//                           key={fieldDef.name}
//                           className={
//                             fieldDef.type === "textarea" ||
//                             fieldDef.type === "checkbox" ||
//                             fieldDef.type === "radio" ||
//                             fieldDef.name === "job_description"
//                               ? "md:col-span-2"
//                               : ""
//                           }
//                         >
//                           {renderField(fieldDef)}
//                         </div>
//                       );
//                     })}
//                   </div>
//                   {mode !== "view" && (
//                     <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
//                       <button
//                         type="button"
//                         onClick={() => navigate("/jobs")}
//                         className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 px-4 rounded-lg transition-colors font-medium"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 shadow-sm shadow-blue-600/20"
//                       >
//                         {loading ? (
//                           <span className="flex items-center justify-center gap-2">
//                             <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
//                             Saving...
//                           </span>
//                         ) : mode === "edit" ? (
//                           "Update Job"
//                         ) : (
//                           "Create Job"
//                         )}
//                       </button>
//                     </div>
//                   )}
//                 </form>
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       {/* ─── Delete confirmation modal ──────────────────────────── */}
//       <AnimatePresence>
//         {isDeleteModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
//             onClick={() => !deleteLoading && setIsDeleteModalOpen(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.97, y: 8 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.97, y: 8 }}
//               transition={{ duration: 0.18 }}
//               className="w-full max-w-sm rounded-2xl bg-white shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//                 <div className="flex items-center gap-2.5">
//                   <div className="p-2 rounded-full bg-red-50">
//                     <MdWarning size={18} className="text-red-500" />
//                   </div>
//                   <h3 className="text-base font-semibold text-slate-800">
//                     Delete Job?
//                   </h3>
//                 </div>
//                 <button
//                   onClick={() => setIsDeleteModalOpen(false)}
//                   className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
//                   disabled={deleteLoading}
//                 >
//                   <MdClose size={18} />
//                 </button>
//               </div>
//               <div className="px-5 py-4">
//                 <p className="text-sm text-slate-600">
//                   This will permanently remove{" "}
//                   <span className="font-medium text-slate-800">
//                     {heroTitle}
//                   </span>{" "}
//                   and its data. This action cannot be undone.
//                 </p>
//               </div>
//               <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-slate-100">
//                 <button
//                   onClick={() => setIsDeleteModalOpen(false)}
//                   disabled={deleteLoading}
//                   className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
//                 >
//                   Keep job
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   disabled={deleteLoading}
//                   className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
//                 >
//                   {deleteLoading && (
//                     <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
//                   )}
//                   {deleteLoading ? "Deleting..." : "Delete job"}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default JobsForm;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdWarning,
  MdClose,
  MdLanguage,
  MdCalendarToday,
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
  MdCloudUpload,
  MdWhatshot,
  MdCheckCircle,
  MdErrorOutline,
  MdPauseCircle,
  MdBlock,
  MdWork,
  MdBusiness,
  MdAttachMoney,
  MdDateRange,
  MdTrendingUp,
  MdCheck,
} from "react-icons/md";
import jobService, {
  companyService,
  jobTypeService,
  workplaceTypeService,
  functionRoleService,
} from "../../services/job.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import { useAuth } from "../../context/AuthContext";

// ─── Helpers ──────────────────────────────────────────────────

const toNumberOrEmpty = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const number = Number(value);
  return Number.isNaN(number) ? "" : number;
};

const toBoolean = (value) =>
  value === true || value === 1 || value === "1" || value === "true";

const getCompanyName = (company) =>
  company?.company_name ||
  company?.Company?.company_name ||
  company?.CompanyUser?.company_name ||
  company?.CompanyUser?.company_user_email ||
  company?.CompanyUser?.email ||
  "";

const parseApiDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  if (typeof dateString !== "string") return null;
  if (dateString.includes("T")) {
    const d = new Date(dateString);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const match = dateString.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i,
  );
  if (match) {
    let [, day, month, year, hours, minutes, seconds, ampm] = match;
    hours = Number(hours);
    if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;
    const d = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      hours,
      Number(minutes),
      Number(seconds),
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(dateString);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDateTime = (date) => {
  if (!date) return "—";
  const parsed = typeof date === "string" ? parseApiDate(date) : date;
  if (!parsed || Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const generateSlug = (title) => {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
};

// ─── Status styles ─────────────────────────────────────────────

const STATUS_STYLES = {
  draft: {
    pill: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
    dot: "bg-gray-400",
    icon: MdPauseCircle,
  },
  published: {
    pill: "bg-green-50 text-green-700 ring-1 ring-green-200",
    dot: "bg-green-500",
    icon: MdCheckCircle,
  },
  closed: {
    pill: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    dot: "bg-yellow-500",
    icon: MdErrorOutline,
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft;
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

const ViewBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      active
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        active ? "bg-emerald-500" : "bg-slate-400"
      }`}
    />
    {active ? "Active" : "Inactive"}
  </span>
);

// ─── Helper components ────────────────────────────────────────

const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const ReadOnlyValue = ({ children }) => (
  <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
    {children || "—"}
  </div>
);

const HeroStat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-sm px-3.5 py-2.5 min-w-0">
    <Icon size={16} className="text-white/70 flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-[10px] text-black leading-tight">{label}</p>
      <p className="text-sm font-semibold text-black truncate leading-tight">
        {value || "—"}
      </p>
    </div>
  </div>
);

const Tabs = [
  { id: "overview", label: "Overview", icon: MdApartment },
  { id: "classification", label: "Classification", icon: MdCategory },
  { id: "compensation", label: "Compensation", icon: MdAttachMoney },
  { id: "description", label: "Description", icon: MdDescription },
  { id: "status", label: "Status & Features", icon: MdCheck },
  { id: "activity", label: "Activity", icon: MdHistory },
];

// ─── Main Component ────────────────────────────────────────────

const JobsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id;

  // ─── Mode resolution ──────────────────────────────────────

  const resolveModeFromPath = (pathname) => {
    if (pathname.includes("/view/")) return "view";
    if (pathname.includes("/edit/")) return "edit";
    return "add";
  };

  const [mode, setMode] = useState(() => resolveModeFromPath(location.pathname));
  const [pageLoading, setPageLoading] = useState(() => {
    const initialMode = resolveModeFromPath(location.pathname);
    return initialMode === "edit" || initialMode === "view";
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Dropdown states ───────────────────────────────────────

  const [companies, setCompanies] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [workplaceTypes, setWorkplaceTypes] = useState([]);
  const [functionRoles, setFunctionRoles] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [userNameCache, setUserNameCache] = useState({});

  // ─── Fetch dropdowns ──────────────────────────────────────

  useEffect(() => {
    const fetchDropdowns = async () => {
      setLoadingDropdowns(true);
      try {
        const [
          companyResponse,
          jobTypeResponse,
          workplaceResponse,
          functionRoleResponse,
        ] = await Promise.all([
          companyService.getAll(),
          jobTypeService.getAll(),
          workplaceTypeService.getAll(),
          functionRoleService.getAll(),
        ]);

        // Companies
        const companyData =
          companyResponse?.data?.data ||
          companyResponse?.data?.results ||
          companyResponse?.data ||
          [];
        const normalizedCompanies = Array.isArray(companyData)
          ? companyData
              .map((c) => ({
                ...c,
                id: toNumberOrEmpty(
                  c.id ?? c.company_id ?? c.Company?.id ?? c.Company?.company_id,
                ),
              }))
              .filter((c) => c.id !== "")
          : [];
        setCompanies(normalizedCompanies);

        // Job Types
        const jobTypeData = jobTypeResponse?.data?.data || jobTypeResponse?.data || [];
        const normalizedJobTypes = Array.isArray(jobTypeData)
          ? jobTypeData
              .filter(
                (item) =>
                  item.is_status === true ||
                  item.is_status === 1 ||
                  item.status === true ||
                  item.status === 1,
              )
              .map((item) => ({
                ...item,
                id: toNumberOrEmpty(item.jobtype_id ?? item.id),
              }))
              .filter((item) => item.id !== "")
          : [];
        setJobTypes(normalizedJobTypes);

        // Workplace Types
        const workplaceData =
          workplaceResponse?.data?.data || workplaceResponse?.data || [];
        const normalizedWorkplaceTypes = Array.isArray(workplaceData)
          ? workplaceData
              .filter(
                (item) =>
                  item.is_status === true ||
                  item.is_status === 1 ||
                  item.status === true ||
                  item.status === 1,
              )
              .map((item) => ({
                ...item,
                id: toNumberOrEmpty(item.workplacetype_id ?? item.id),
              }))
              .filter((item) => item.id !== "")
          : [];
        setWorkplaceTypes(normalizedWorkplaceTypes);

        // Function Roles
        const functionRoleData =
          functionRoleResponse?.data?.data || functionRoleResponse?.data || [];
        const normalizedFunctionRoles = Array.isArray(functionRoleData)
          ? functionRoleData
              .filter(
                (item) =>
                  item.is_status === true ||
                  item.is_status === 1 ||
                  item.status === true ||
                  item.status === 1,
              )
              .map((item) => ({
                ...item,
                id: toNumberOrEmpty(item.functionrole_id ?? item.id),
              }))
              .filter((item) => item.id !== "")
          : [];
        setFunctionRoles(normalizedFunctionRoles);
      } catch (error) {
        console.error("Error loading dropdowns:", error);
        showError("Failed to load form data. Please refresh.");
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdowns();
  }, []);

  // ─── Load users ────────────────────────────────────────────

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users || {}).forEach((uid) => {
          userMap[uid] = users[uid]?.name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  const getCreatedByName = (row) => {
    if (!row?.created_by) return "—";
    return userNameCache[row.created_by] || `User ${row.created_by}`;
  };
  const getUpdatedByName = (row) => {
    if (!row?.updated_by) return "—";
    return userNameCache[row.updated_by] || `User ${row.updated_by}`;
  };

  // ─── Normalize job data ──────────────────────────────────

  const normalizeJobData = (item) => {
    if (!item) return null;
    const companyId = toNumberOrEmpty(
      item.company_id ??
        item.Company?.company_id ??
        item.Company?.id ??
        item.company?.company_id ??
        item.company?.id,
    );
    const jobTypeId = toNumberOrEmpty(item.jobtype_id ?? item.JobType?.jobtype_id);
    const workplaceTypeId = toNumberOrEmpty(
      item.workplacetype_id ?? item.WorkplaceType?.workplacetype_id,
    );
    const functionRoleId = toNumberOrEmpty(
      item.functionrole_id ?? item.FunctionRole?.functionrole_id,
    );

    let companyName =
      item.company_name ||
      getCompanyName(item.Company) ||
      getCompanyName(item.company);
    if (!companyName && companyId !== "") {
      const comp = companies.find((c) => Number(c.id) === Number(companyId));
      if (comp) companyName = getCompanyName(comp);
    }

    return {
      id: item.id || item._id,
      title: item.title || "",
      job_description: item.job_description || "",
      company_id: companyId,
      company_name: companyName,
      jobtype_id: jobTypeId,
      jobtype_name: item.JobType?.name || item.jobtype_name || "",
      workplacetype_id: workplaceTypeId,
      workplacetype_name: item.WorkplaceType?.name || item.workplacetype_name || "",
      functionrole_id: functionRoleId,
      functionrole_name: item.FunctionRole?.name || item.functionrole_name || "",
      experience_min: item.experience_min ?? "",
      experience_max: item.experience_max ?? "",
      experience_type: item.experience_type || "experience",
      salary_min: item.salary_min ?? "",
      salary_max: item.salary_max ?? "",
      salary_confidential: toBoolean(item.salary_confidential),
      job_status: item.job_status || "draft",
      posting_type: item.posting_type || "permanent",
      expiry_date: item.expiry_date || "",
      auto_renew: item.auto_renew || "off",
      reference_code: item.reference_code || "",
      is_trending: toBoolean(item.is_trending),
      is_status: toBoolean(item.is_status),
      daily_application_summary: toBoolean(item.daily_application_summary),
      notify_matching_type: item.notify_matching_type || "All matching applicants",
      prioritize_women: toBoolean(item.prioritize_women),
      schedule_date: item.schedule_date || null,
      published_at: item.published_at || null,
      slug: item.slug || "",
      created_by: item.created_by ?? null,
      updated_by: item.updated_by ?? null,
      created_at: item.created_at || null,
      updated_at: item.updated_at || null,
    };
  };

  // ─── Fetch edit/view data ────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      if ((mode !== "edit" && mode !== "view") || !id) return;
      setPageLoading(true);
      try {
        let item = location.state?.item;
        if (!item) {
          const response = await jobService.getById(id);
          item = response?.data?.data || response?.data;
        }
        if (!item) throw new Error("Job data not found");
        const normalizedData = normalizeJobData(item);
        setData(normalizedData);
      } catch (error) {
        console.error("Fetch job error:", error);
        showError("Failed to load job data");
        navigate("/jobs");
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id, mode, location.state, navigate, companies]);

  // ─── Update company name after companies load ────────────

  useEffect(() => {
    if (!data?.company_id) return;
    const company = companies.find((c) => Number(c.id) === Number(data.company_id));
    if (!company) return;
    const companyName =
      company.company_name || company.CompanyUser?.company_user_email || "";
    if (companyName && companyName !== data.company_name) {
      setData((prev) => (prev ? { ...prev, company_name: companyName } : prev));
    }
  }, [companies, data?.company_id, data?.company_name]);

  // ─── Form state ────────────────────────────────────────────

  const getInitialData = () => {
    if (mode === "add") {
      return {
        title: "",
        job_description: "",
        company_id: "",
        jobtype_id: "",
        workplacetype_id: "",
        functionrole_id: "",
        experience_min: "",
        experience_max: "",
        experience_type: "experience",
        salary_min: "",
        salary_max: "",
        salary_confidential: false,
        job_status: "draft",
        posting_type: "permanent",
        expiry_date: "",
        auto_renew: "off",
        reference_code: "",
        is_trending: false,
        status: "active",
      };
    }
    if (data) {
      return {
        title: data.title || "",
        job_description: data.job_description || "",
        company_id: data.company_id !== "" ? Number(data.company_id) : "",
        jobtype_id: data.jobtype_id !== "" ? Number(data.jobtype_id) : "",
        workplacetype_id:
          data.workplacetype_id !== "" ? Number(data.workplacetype_id) : "",
        functionrole_id:
          data.functionrole_id !== "" ? Number(data.functionrole_id) : "",
        experience_min: data.experience_min ?? "",
        experience_max: data.experience_max ?? "",
        experience_type: data.experience_type || "experience",
        salary_min: data.salary_min ?? "",
        salary_max: data.salary_max ?? "",
        salary_confidential: data.salary_confidential || false,
        job_status: data.job_status || "draft",
        posting_type: data.posting_type || "permanent",
        expiry_date: data.expiry_date || "",
        auto_renew: data.auto_renew || "off",
        reference_code: data.reference_code || "",
        is_trending: data.is_trending || false,
        status: data.is_status ? "active" : "inactive",
        // Additional view-only props
        company_name: data.company_name || "",
        jobtype_name: data.jobtype_name || "",
        workplacetype_name: data.workplacetype_name || "",
        functionrole_name: data.functionrole_name || "",
        created_by: data.created_by,
        updated_by: data.updated_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    }
    return {};
  };

  const [formValues, setFormValues] = useState(getInitialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setFormValues(getInitialData());
  }, [data, mode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Validation ────────────────────────────────────────────

  const getValidationRules = () => ({
    title: {
      required: true,
      requiredMessage: "Job title is required",
      minLength: 5,
      minLengthMessage: "Job title must be at least 5 characters",
      maxLength: 200,
      maxLengthMessage: "Job title must be at most 200 characters",
    },
    company_id: {
      required: true,
      requiredMessage: "Please select a company",
    },
    jobtype_id: {
      required: true,
      requiredMessage: "Please select a job type",
    },
    workplacetype_id: {
      required: true,
      requiredMessage: "Please select a workplace type",
    },
    functionrole_id: {
      required: true,
      requiredMessage: "Please select a function role",
    },
    job_status: {
      required: true,
      requiredMessage: "Please select a job status",
    },
    experience_type: {
      required: true,
      requiredMessage: "Please select an experience type",
    },
    posting_type: {
      required: true,
      requiredMessage: "Please select a posting type",
    },
    auto_renew: {
      required: true,
      requiredMessage: "Please select auto-renew option",
    },
    experience_min: {
      custom: (value) => {
        if (value !== "" && value !== null && value !== undefined) {
          const num = Number(value);
          if (Number.isNaN(num)) return "Experience minimum must be a valid number";
          if (num < 0) return "Experience minimum cannot be negative";
          if (num > 50) return "Experience minimum cannot exceed 50 years";
        }
        return null;
      },
    },
    experience_max: {
      custom: (value, formData) => {
        if (value !== "" && value !== null && value !== undefined) {
          const num = Number(value);
          if (Number.isNaN(num)) return "Experience maximum must be a valid number";
          if (num < 0) return "Experience maximum cannot be negative";
          if (num > 50) return "Experience maximum cannot exceed 50 years";
          if (
            formData?.experience_min !== "" &&
            formData?.experience_min !== null &&
            formData?.experience_min !== undefined
          ) {
            const min = Number(formData.experience_min);
            if (!Number.isNaN(min) && num < min)
              return "Experience maximum must be >= minimum";
          }
        }
        return null;
      },
    },
    salary_min: {
      custom: (value) => {
        if (value !== "" && value !== null && value !== undefined) {
          const num = Number(value);
          if (Number.isNaN(num)) return "Salary minimum must be a valid number";
          if (num < 0) return "Salary minimum cannot be negative";
        }
        return null;
      },
    },
    salary_max: {
      custom: (value, formData) => {
        if (value !== "" && value !== null && value !== undefined) {
          const num = Number(value);
          if (Number.isNaN(num)) return "Salary maximum must be a valid number";
          if (num < 0) return "Salary maximum cannot be negative";
          if (
            formData?.salary_min !== "" &&
            formData?.salary_min !== null &&
            formData?.salary_min !== undefined
          ) {
            const min = Number(formData.salary_min);
            if (!Number.isNaN(min) && num < min)
              return "Salary maximum must be >= minimum";
          }
        }
        return null;
      },
    },
  });

  const validateField = (name, value, allValues) => {
    const rules = getValidationRules()[name];
    if (!rules) return null;
    if (rules.required && (value === "" || value === null || value === undefined)) {
      return rules.requiredMessage || `${name} is required`;
    }
    if (rules.minLength && value?.length < rules.minLength) {
      return rules.minLengthMessage || `Minimum length is ${rules.minLength}`;
    }
    if (rules.maxLength && value?.length > rules.maxLength) {
      return rules.maxLengthMessage || `Maximum length is ${rules.maxLength}`;
    }
    if (rules.custom) {
      return rules.custom(value, allValues);
    }
    return null;
  };

  const validateAll = () => {
    const allValues = formValues;
    const newErrors = {};
    const rules = getValidationRules();
    Object.keys(rules).forEach((field) => {
      const error = validateField(field, allValues[field], allValues);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      showError("Please fix validation errors");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formValues.title.trim(),
        job_description: formValues.job_description?.trim() || "",
        company_id: toNumberOrEmpty(formValues.company_id) || null,
        jobtype_id: toNumberOrEmpty(formValues.jobtype_id) || null,
        workplacetype_id: toNumberOrEmpty(formValues.workplacetype_id) || null,
        functionrole_id: toNumberOrEmpty(formValues.functionrole_id) || null,
        experience_min:
          formValues.experience_min !== "" ? Number(formValues.experience_min) : null,
        experience_max:
          formValues.experience_max !== "" ? Number(formValues.experience_max) : null,
        experience_type: formValues.experience_type || "experience",
        salary_min:
          formValues.salary_min !== "" ? Number(formValues.salary_min) : null,
        salary_max:
          formValues.salary_max !== "" ? Number(formValues.salary_max) : null,
        salary_confidential: toBoolean(formValues.salary_confidential),
        job_status: formValues.job_status || "draft",
        posting_type: formValues.posting_type || "permanent",
        expiry_date: formValues.expiry_date || null,
        auto_renew: formValues.auto_renew || "off",
        reference_code: formValues.reference_code?.trim() || null,
        is_trending: toBoolean(formValues.is_trending),
        is_status: formValues.status === "active",
        daily_application_summary: true,
        notify_matching_type: "All matching applicants",
        prioritize_women: false,
        schedule_date: formValues.job_status === "published" ? new Date().toISOString() : null,
        published_at: formValues.job_status === "published" ? new Date().toISOString() : null,
        slug: generateSlug(formValues.title.trim()),
      };

      if (mode === "edit" && id) {
        payload.updated_by = userId || null;
        await jobService.update(id, payload);
        showSuccess("Job updated successfully");
      } else {
        payload.created_by = userId || null;
        payload.updated_by = userId || null;
        await jobService.create(payload);
        showSuccess("Job created successfully");
      }
      navigate("/jobs");
    } catch (error) {
      console.error("Submit error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to save job";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      await jobService.deleteJobBenefits(id);
      await jobService.delete(id);
      showSuccess("Job deleted successfully");
      navigate("/jobs");
    } catch (error) {
      console.error("Delete error:", error);
      showError(error?.response?.data?.message || error?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  // ─── Dropdown options ──────────────────────────────────────

  const getDropdownOptions = () => {
    const companyOptions = companies.map((c) => ({
      value: Number(c.id),
      label: getCompanyName(c) || `Company ${c.id}`,
    }));
    if (
      data?.company_id &&
      !companyOptions.some((o) => Number(o.value) === Number(data.company_id))
    ) {
      companyOptions.unshift({
        value: Number(data.company_id),
        label: data.company_name || `Company ${data.company_id}`,
      });
    }
    const jobTypeOptions = jobTypes.map((j) => ({
      value: Number(j.id),
      label: j.name || "",
    }));
    const workplaceTypeOptions = workplaceTypes.map((w) => ({
      value: Number(w.id),
      label: w.name || "",
    }));
    const functionRoleOptions = functionRoles.map((f) => ({
      value: Number(f.id),
      label: f.name || "",
    }));
    return { companyOptions, jobTypeOptions, workplaceTypeOptions, functionRoleOptions };
  };

  // ─── Render field based on definition ──────────────────────

  const renderField = (fieldDef) => {
    const {
      name,
      label,
      type,
      required,
      options,
      placeholder,
      rows,
      disabled,
      viewRender,
      color,
      min,
      max,
      step,
    } = fieldDef;

    const value = formValues[name] ?? "";
    const error = errors[name];
    const isTouched = touched[name];

    if (mode === "view" && viewRender) {
      return (
        <div key={name} className="mb-4">
          <FieldLabel>{label}</FieldLabel>
          <div className="text-sm text-slate-700">{viewRender(value, formValues)}</div>
        </div>
      );
    }

    const commonInputClass = `w-full px-3.5 py-2.5 border ${
      error && isTouched ? "border-red-500" : "border-slate-300"
    } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    let inputElement;
    switch (type) {
      case "select":
        inputElement = (
          <select
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled || loadingDropdowns}
            className={commonInputClass}
          >
            <option value="">
              {loadingDropdowns ? "Loading..." : placeholder || "Select option"}
            </option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
        break;

      case "textarea":
        inputElement = (
          <textarea
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={rows || 4}
            placeholder={placeholder}
            disabled={disabled}
            className={`${commonInputClass} resize-y`}
          />
        );
        break;

      case "checkbox":
        inputElement = (
          <div className="flex items-center gap-3 pt-1.5">
            <input
              type="checkbox"
              name={name}
              checked={Boolean(value)}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={disabled}
              className={`w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${color || ""}`}
            />
            <span className="text-sm text-slate-600">{label}</span>
          </div>
        );
        break;

      case "radio":
        inputElement = (
          <div className="flex flex-wrap gap-4 pt-1.5">
            {options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={String(value) === String(opt.value)}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={disabled}
                  className={`w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500 ${color || ""}`}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
        break;

      case "number":
        inputElement = (
          <input
            type="number"
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={commonInputClass}
          />
        );
        break;

      case "date":
        inputElement = (
          <input
            type="date"
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={commonInputClass}
          />
        );
        break;

      default:
        inputElement = (
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={commonInputClass}
          />
        );
    }

    return (
      <div key={name} className="mb-4">
        {type !== "checkbox" && type !== "radio" && (
          <FieldLabel required={required}>{label}</FieldLabel>
        )}
        {inputElement}
        {error && isTouched && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  // ─── Group fields by tab ──────────────────────────────────

  const fields = (() => {
    if (mode === "view") {
      return [
        // overview
        [
          "title",
          "company_name",
          "reference_code",
          "jobtype_name",
          "workplacetype_name",
          "functionrole_name",
        ],
        // classification
        ["jobtype_name", "workplacetype_name", "functionrole_name"],
        // compensation
        ["salary_min", "salary_max", "salary_confidential"],
        // description
        ["job_description"],
        // status
        ["job_status", "posting_type", "expiry_date", "auto_renew", "is_trending", "status"],
        // activity
        ["created_by", "created_at", "updated_by", "updated_at"],
      ];
    }
    // add/edit
    return [
      // overview
      ["title", "company_id", "reference_code"],
      // classification
      ["jobtype_id", "workplacetype_id", "functionrole_id"],
      // compensation
      ["salary_min", "salary_max", "salary_confidential"],
      // description
      ["job_description"],
      // status
      ["job_status", "posting_type", "expiry_date", "auto_renew", "is_trending", "status"],
      // activity - only in edit/view, not in add
    ];
  })();

  const getTabFields = (tabId) => {
    const tabMap = {
      overview: 0,
      classification: 1,
      compensation: 2,
      description: 3,
      status: 4,
      activity: 5,
    };
    const index = tabMap[tabId];
    if (index === undefined) return [];
    const fieldNames = fields[index] || [];
    const allFieldDefs = (() => {
      if (mode === "view") {
        // We need the view field definitions from getFields() but we don't have them here.
        // We'll construct them manually based on the fields we have.
        // Since we are in view mode, we can render simple read-only labels using the field names.
        // We'll map field names to display labels.
        const labelMap = {
          title: "Job Title",
          company_name: "Company",
          reference_code: "Reference Code",
          jobtype_name: "Job Type",
          workplacetype_name: "Workplace Type",
          functionrole_name: "Function Role",
          salary_min: "Salary Min",
          salary_max: "Salary Max",
          salary_confidential: "Salary Confidential",
          job_description: "Job Description",
          job_status: "Job Status",
          posting_type: "Posting Type",
          expiry_date: "Expiry Date",
          auto_renew: "Auto Renew",
          is_trending: "Trending",
          status: "Active",
          created_by: "Created By",
          created_at: "Created At",
          updated_by: "Updated By",
          updated_at: "Updated At",
        };
        return fieldNames.map((name) => ({
          name,
          label: labelMap[name] || name,
          type: "text",
          viewRender: (value, row) => {
            if (name === "salary_min" || name === "salary_max") {
              return value !== "" && value !== null && value !== undefined
                ? `₹${Number(value).toLocaleString("en-IN")}`
                : "—";
            }
            if (name === "salary_confidential") {
              return value ? "Confidential" : "Not Confidential";
            }
            if (name === "is_trending") {
              return value ? "Trending" : "Not Trending";
            }
            if (name === "status") {
              return <ViewBadge active={row?.is_status} />;
            }
            if (name === "job_status") {
              return <StatusPill status={value} />;
            }
            if (name === "created_at" || name === "updated_at") {
              return formatDateTime(row?.[name]);
            }
            if (name === "created_by" || name === "updated_by") {
              const nameFn = name === "created_by" ? getCreatedByName : getUpdatedByName;
              return nameFn(row);
            }
            return value || "—";
          },
        }));
      } else {
        // add/edit: we need the actual field definitions from getFields() but they are not directly accessible.
        // We'll rebuild them from the field definitions we used in the original JobsForm.
        // Since we have the logic in the original component, we can copy the field definitions from there.
        // But to keep this self-contained, we'll define them inline.
        const {
          companyOptions,
          jobTypeOptions,
          workplaceTypeOptions,
          functionRoleOptions,
        } = getDropdownOptions();

        const jobStatusOptions = [
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
          { value: "closed", label: "Closed" },
        ];
        const postingTypeOptions = [
          { value: "permanent", label: "Permanent" },
          { value: "contract", label: "Contract" },
          { value: "walk-in", label: "Walk-in" },
          { value: "internship", label: "Internship" },
        ];
        const experienceTypeOptions = [
          { value: "experience", label: "Experience" },
          { value: "fresher", label: "Fresher" },
        ];
        const autoRenewOptions = [
          { value: "off", label: "Off" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
        ];

        const fieldDefs = {
          title: {
            name: "title",
            label: "Job Title",
            type: "text",
            required: true,
            placeholder: "e.g. Frontend Developer",
          },
          company_id: {
            name: "company_id",
            label: "Company",
            type: "select",
            required: true,
            options: companyOptions,
            placeholder: loadingDropdowns ? "Loading companies..." : "Select company",
            disabled: loadingDropdowns,
          },
          reference_code: {
            name: "reference_code",
            label: "Reference Code",
            type: "text",
            placeholder: "e.g. JOB123",
          },
          jobtype_id: {
            name: "jobtype_id",
            label: "Job Type",
            type: "select",
            required: true,
            options: jobTypeOptions,
            placeholder: loadingDropdowns ? "Loading job types..." : "Select job type",
            disabled: loadingDropdowns,
          },
          workplacetype_id: {
            name: "workplacetype_id",
            label: "Workplace Type",
            type: "select",
            required: true,
            options: workplaceTypeOptions,
            placeholder: loadingDropdowns ? "Loading workplace types..." : "Select workplace type",
            disabled: loadingDropdowns,
          },
          functionrole_id: {
            name: "functionrole_id",
            label: "Function Role",
            type: "select",
            required: true,
            options: functionRoleOptions,
            placeholder: loadingDropdowns ? "Loading function roles..." : "Select function role",
            disabled: loadingDropdowns,
          },
          experience_min: {
            name: "experience_min",
            label: "Experience Min (years)",
            type: "number",
            min: 0,
            max: 50,
            step: 1,
            placeholder: "0",
          },
          experience_max: {
            name: "experience_max",
            label: "Experience Max (years)",
            type: "number",
            min: 0,
            max: 50,
            step: 1,
            placeholder: "10",
          },
          experience_type: {
            name: "experience_type",
            label: "Experience Type",
            type: "select",
            required: true,
            options: experienceTypeOptions,
            placeholder: "Select experience type",
          },
          salary_min: {
            name: "salary_min",
            label: "Salary Min (₹)",
            type: "number",
            min: 0,
            step: 1000,
            placeholder: "30000",
          },
          salary_max: {
            name: "salary_max",
            label: "Salary Max (₹)",
            type: "number",
            min: 0,
            step: 1000,
            placeholder: "50000",
          },
          salary_confidential: {
            name: "salary_confidential",
            label: "Salary Confidential",
            type: "checkbox",
            color: "text-gray-500 focus:ring-gray-500",
          },
          job_description: {
            name: "job_description",
            label: "Job Description",
            type: "textarea",
            rows: 5,
            placeholder: "Describe the role, responsibilities, requirements...",
          },
          job_status: {
            name: "job_status",
            label: "Job Status",
            type: "select",
            required: true,
            options: jobStatusOptions,
            placeholder: "Select job status",
          },
          posting_type: {
            name: "posting_type",
            label: "Posting Type",
            type: "select",
            required: true,
            options: postingTypeOptions,
            placeholder: "Select posting type",
          },
          expiry_date: {
            name: "expiry_date",
            label: "Expiry Date",
            type: "date",
          },
          auto_renew: {
            name: "auto_renew",
            label: "Auto Renew",
            type: "select",
            required: true,
            options: autoRenewOptions,
            placeholder: "Select auto-renew option",
          },
          is_trending: {
            name: "is_trending",
            label: "Mark as Trending",
            type: "checkbox",
            color: "text-amber-500 focus:ring-amber-500",
          },
          status: {
            name: "status",
            label: "Active",
            type: "radio",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
            color: "text-[#2c0eee] focus:ring-[#4529f7]",
          },
        };

        return fieldNames.map((name) => fieldDefs[name]).filter(Boolean);
      }
    })();
    return allFieldDefs;
  };

  // ─── Loading state ─────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading job data...</p>
        </div>
      </div>
    );
  }

  if ((mode === "view" || mode === "edit") && !data && !pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center bg-white rounded-2xl border border-slate-200 px-10 py-12">
          <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Job not found</p>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-3 text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

 const heroTitle =
  mode === "add"
    ? "Create New Job"
    : formValues.title || "Untitled Job";
  const companyName = formValues.company_name || formValues.company_id || "—";
  const status = formValues.job_status || "draft";
  const isTrending = formValues.is_trending;

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-16">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="z-30 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/jobs")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">Jobs</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {mode === "view" && (
              <>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete job"
                >
                  <MdDelete size={19} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/jobs/edit/${id}`, { state: { item: data } })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
                >
                  <MdWork size={16} />
                  Edit Job
                </button>
              </>
            )}
            {(mode === "edit" || mode === "add") && (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/jobs")}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                >
                  <MdCancel size={16} />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdSave size={16} />
                  )}
                  {loading ? "Saving..." : mode === "edit" ? "Update Job" : "Create Job"}
                </button>
              </>
            )}
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
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Icon/Logo placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl flex-shrink-0 border border-white/20">
                <MdWork size={32} className="text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroTitle}
                  </h1>
                  {isTrending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdWhatshot size={12} />
                      Trending
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <StatusPill status={status} />
                  <span className="text-xs text-white/70">• {companyName}</span>
                  {formValues.posting_type && (
                    <span className="text-xs text-white/70 capitalize">
                      {formValues.posting_type}
                    </span>
                  )}
                </div>
              </div>

              {/* Completion ring placeholder */}
              <div className="hidden sm:block">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white text-xs font-medium">
                  Job
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <HeroStat icon={MdBusiness} label="Company" value={companyName} />
          <HeroStat icon={MdCategory} label="Job Type" value={formValues.jobtype_name || "—"} />
          <HeroStat icon={MdWork} label="Experience" value={
            formValues.experience_min && formValues.experience_max
              ? `${formValues.experience_min} - ${formValues.experience_max} yrs`
              : formValues.experience_min || formValues.experience_max || "—"
          } />
          <HeroStat icon={MdAttachMoney} label="Salary" value={
            formValues.salary_min && formValues.salary_max
              ? `₹${Number(formValues.salary_min).toLocaleString()} - ₹${Number(formValues.salary_max).toLocaleString()}`
              : formValues.salary_min || formValues.salary_max || "—"
          } />
        </div> */}

        {/* ─── Tabs ───────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-200 px-2">
            {Tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="jobs-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getTabFields(activeTab).map((fieldDef) => {
                      // For activity tab, we only show in view mode
                      if (activeTab === "activity" && mode !== "view") return null;
                      return (
                        <div
                          key={fieldDef.name}
                          className={
                            fieldDef.type === "textarea" ||
                            fieldDef.type === "checkbox" ||
                            fieldDef.type === "radio" ||
                            fieldDef.name === "job_description"
                              ? "md:col-span-2"
                              : ""
                          }
                        >
                          {renderField(fieldDef)}
                        </div>
                      );
                    })}
                  </div>
                  {mode !== "view" && (
                    <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => navigate("/jobs")}
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
                            Saving...
                          </span>
                        ) : mode === "edit" ? (
                          "Update Job"
                        ) : (
                          "Create Job"
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Delete confirmation modal ──────────────────────────── */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
            onClick={() => !deleteLoading && setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full bg-red-50">
                    <MdWarning size={18} className="text-red-500" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">Delete Job?</h3>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  disabled={deleteLoading}
                >
                  <MdClose size={18} />
                </button>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-slate-600">
                  This will permanently remove <span className="font-medium text-slate-800">{heroTitle}</span> and its data. This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-slate-100">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleteLoading}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Keep job
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deleteLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  {deleteLoading ? "Deleting..." : "Delete job"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobsForm;