

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MdArrowBack,
//   MdEdit,
//   MdCheckCircle,
//   MdVerified,
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
//   MdWhatshot,
//   MdErrorOutline,
//   MdPauseCircle,
//   MdBlock,
// } from "react-icons/md";
// import companyService from "../../services/company.service";
// import { showError, showSuccess } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE =
//   import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// // ─── Helper: build full image URL ──────────────────────────────
// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http://") || path.startsWith("https://")) return path;
//   return `${API_BASE}${path}`;
// };

// // ─── Helper: Parse API date format "17/08/2026, 06:22:41 pm" ──
// const parseApiDate = (dateString) => {
//   if (!dateString) return null;
//   if (dateString instanceof Date) return dateString;
//   if (typeof dateString === "string" && dateString.includes("T")) {
//     const d = new Date(dateString);
//     if (!isNaN(d)) return d;
//   }
//   const match = dateString.match(
//     /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i,
//   );
//   if (match) {
//     let [_, day, month, year, hours, minutes, seconds, ampm] = match;
//     hours = parseInt(hours);
//     if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
//     if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;
//     return new Date(
//       parseInt(year),
//       parseInt(month) - 1,
//       parseInt(day),
//       hours,
//       parseInt(minutes),
//       parseInt(seconds),
//     );
//   }
//   const d = new Date(dateString);
//   return !isNaN(d) ? d : null;
// };

// // ─── Company status styles (same as EditCompany) ──────────────
// const STATUS_STYLES = {
//   active: {
//     pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
//     dot: "bg-emerald-500",
//     icon: MdCheckCircle,
//     heroDot: "bg-emerald-400",
//   },
//   pending: {
//     pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
//     dot: "bg-amber-500",
//     icon: MdPauseCircle,
//     heroDot: "bg-amber-400",
//   },
//   blocked: {
//     pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
//     dot: "bg-red-500",
//     icon: MdBlock,
//     heroDot: "bg-red-400",
//   },
//   inactive: {
//     pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
//     dot: "bg-slate-400",
//     icon: MdErrorOutline,
//     heroDot: "bg-slate-400",
//   },
// };

// const StatusPill = ({ status }) => {
//   const style = STATUS_STYLES[status] || STATUS_STYLES.inactive;
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

// // ─── Animated completion ring ──────────────────────────────────
// const CompletionRing = ({ percentage = 0, size = 60, strokeWidth = 5 }) => {
//   const clamped = Math.min(100, Math.max(0, Number(percentage) || 0));
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (clamped / 100) * circumference;

//   return (
//     <div
//       className="relative flex-shrink-0"
//       style={{ width: size, height: size }}
//       title={`Profile ${clamped}% complete`}
//     >
//       <svg width={size} height={size} className="-rotate-90">
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           strokeWidth={strokeWidth}
//           fill="none"
//           className="stroke-white/25"
//         />
//         <motion.circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           strokeWidth={strokeWidth}
//           fill="none"
//           strokeLinecap="round"
//           className="stroke-emerald-400"
//           strokeDasharray={circumference}
//           initial={{ strokeDashoffset: circumference }}
//           animate={{ strokeDashoffset: offset }}
//           transition={{ duration: 1, ease: "easeOut" }}
//         />
//       </svg>
//       <div className="absolute inset-0 flex items-center justify-center">
//         <span className="text-[11px] font-bold text-white">{clamped}%</span>
//       </div>
//     </div>
//   );
// };

// // ─── Small helper components ────────────────────────────────────
// const FieldLabel = ({ children }) => (
//   <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
//     {children}
//   </label>
// );

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

// const TABS = [
//   { id: "overview", label: "Overview", icon: MdApartment },
//   { id: "relations", label: "Relations", icon: MdCategory },
//   { id: "documents", label: "Documents", icon: MdDescription },
//   { id: "media", label: "Media", icon: MdImage },
//   { id: "activity", label: "Activity", icon: MdHistory },
// ];

// // ─── Main Component ─────────────────────────────────────────────
// const ViewCompany = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});
//   const [statusUpdatingId, setStatusUpdatingId] = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");

//   // ─── Load users ──────────────────────────────────────────────
//   const loadUsers = async () => {
//     try {
//       const users = await fetchUsers();
//       setUserNameCache(users);
//     } catch (err) {
//       console.error("Failed to load users:", err);
//     }
//   };

//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId]?.name || `User ${userId}`;
//   };

//   const getCreatedByName = (row) => {
//     if (!row) return "-";
//     return row.created_by ? getUserNameCached(row.created_by) : "-";
//   };

//   const getUpdatedByName = (row) => {
//     if (!row) return "-";
//     return row.updated_by ? getUserNameCached(row.updated_by) : "-";
//   };

//   // ─── Handle status change ────────────────────────────────────
//   const handleCompanyStatusChange = async (id, newStatus) => {
//     const prevData = viewData;
//     setViewData({ ...viewData, company_status: newStatus });
//     setInitialData({ ...initialData, company_status: newStatus });
//     setStatusUpdatingId(id);

//     try {
//       await companyService.update(id, {
//         company_status: newStatus,
//         updated_by: viewData?.updated_by || 1,
//       });
//       showSuccess(
//         newStatus === "active"
//           ? "Company approved successfully"
//           : "Company approval removed",
//       );
//       const response = await companyService.getById(id);
//       const data = response?.data || response;
//       if (data) {
//         setViewData(data);
//         setInitialData((prev) => ({
//           ...prev,
//           company_status: data.company_status || newStatus,
//         }));
//       }
//     } catch (err) {
//       setViewData(prevData);
//       setInitialData((prev) => ({
//         ...prev,
//         company_status: prevData?.company_status || prev?.company_status,
//       }));
//       showError(err.message || "Failed to update status");
//     } finally {
//       setStatusUpdatingId(null);
//     }
//   };

//   const handleToggleApprove = () => {
//     if (!viewData?.id) return;
//     const nextStatus = viewData.company_status === "active" ? "pending" : "active";
//     handleCompanyStatusChange(viewData.id, nextStatus);
//   };

//   // ─── Calculate profile completion ──────────────────────────────
//   const calculateProfileCompletion = (data) => {
//     if (!data) return 0;
//     const fields = [
//       { name: "company_name", weight: 15 },
//       { name: "slug", weight: 5 },
//       { name: "website", weight: 10 },
//       { name: "founded_year", weight: 5 },
//       { name: "about_company", weight: 15 },
//       { name: "gst_number", weight: 10 },
//       { name: "company_user_id", weight: 10 },
//       { name: "industry_id", weight: 10 },
//       { name: "company_size_id", weight: 10 },
//       { name: "logo", weight: 5 },
//       { name: "banner_image", weight: 5 },
//     ];
//     let completedWeight = 0;
//     let totalWeight = 0;
//     fields.forEach((field) => {
//       totalWeight += field.weight;
//       const value = data[field.name];
//       if (
//         value !== null &&
//         value !== undefined &&
//         value !== "" &&
//         value !== "-"
//       ) {
//         completedWeight += field.weight;
//       }
//     });
//     const percentage =
//       totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
//     return Math.min(percentage, 100);
//   };

//   // ─── Fetch company data ────────────────────────────────────────
//   useEffect(() => {
//     const fetchCompany = async () => {
//       setLoading(true);
//       try {
//         await loadUsers();

//         const response = await companyService.getById(id);
//         const data = response?.data || response;

//         if (data) {
//           const createdAt = data.created_at
//             ? parseApiDate(data.created_at)
//             : null;
//           const updatedAt = data.updated_at
//             ? parseApiDate(data.updated_at)
//             : null;

//           const formData = {
//             id: data.id || "",
//             company_name: data.company_name || "",
//             profile_type: data.profile_type || "company",
//             slug: data.slug || "",
//             website: Array.isArray(data.website)
//               ? data.website.join(", ")
//               : data.website || "",
//             founded_year: data.founded_year || "",
//             about_company: data.about_company || "",
//             gst_number: data.gst_number || "",
//             reference_code:
//               data.reference_code || data.referenceCode || data.ref_code || "",
//             company_user_email:
//               data.CompanyUser?.company_user_email ||
//               data.CompanyUser?.email ||
//               data.company_user_email ||
//               "-",
//             company_user_id:
//               data.company_user_id || data.CompanyUser?.company_user_id || "-",
//             industry_name:
//               data.Industries?.[0]?.industry_name ||
//               data.Industry?.industry_name ||
//               data.industry_name ||
//               "-",
//             industry_id:
//               data.industry_id ||
//               data.Industries?.[0]?.industry_id ||
//               data.Industry?.industry_id ||
//               "-",
//             company_size_name:
//               data.CompanySize?.company_size_name ||
//               data.company_size_name ||
//               "-",
//             logo: data.logo || null,
//             banner_image: data.banner_image || null,
//             company_status: data.company_status || "inactive",
//             is_trending: data.is_trending || false,
//             profile_completion: data.profile_completion ?? 0,
//             profile_completion_percentage:
//               data.profile_completion_percentage ??
//               data.profile_completion ??
//               0,
//             last_completion_calculated_at:
//               data.last_completion_calculated_at || null,
//             company_register_document_type:
//               data.company_register_document_type || "-",
//             company_register_document: data.company_register_document || null,
//             company_pan_card: data.company_pan_card || "-",
//             company_pan_card_image: data.company_pan_card_image || null,
//             owner_adharcard: data.owner_adharcard || "-",
//             owner_adharcard_image: data.owner_adharcard_image || null,
//             industries: data.Industries || [],
//             subIndustries: data.SubIndustries || [],
//             created_by: data.created_by || null,
//             updated_by: data.updated_by || null,
//             created_at: createdAt,
//             updated_at: updatedAt,
//           };

//           setInitialData(formData);
//           setViewData(data);
//         } else {
//           showError("Company not found");
//           navigate("/companies");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load company data");
//         navigate("/companies");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchCompany();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/companies/edit/${id}`);
//   };

//   // ─── Render helpers ──────────────────────────────────────────
//   const renderDocPreview = (path, alt, size = "w-28 h-20") => {
//     if (!path)
//       return (
//         <div
//           className={`${size} rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400`}
//         >
//           No image
//         </div>
//       );
//     return (
//       <div className={`relative group ${size} flex-shrink-0`}>
//         <img
//           src={path.startsWith("blob:") ? path : getImageUrl(path)}
//           alt={alt}
//           className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm"
//           onError={(e) => {
//             e.target.style.display = "none";
//           }}
//         />
//         <button
//           type="button"
//           onClick={() =>
//             window.open(path.startsWith("blob:") ? path : getImageUrl(path), "_blank")
//           }
//           className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
//         >
//           <span className="text-white text-xs font-medium flex items-center gap-1">
//             <MdOpenInNew size={13} /> View
//           </span>
//         </button>
//       </div>
//     );
//   };

//   const renderImage = (path, alt, className = "w-24 h-24 object-cover rounded-lg") => {
//     if (!path) return <span className="text-gray-400">No image</span>;
//     const fullUrl = getImageUrl(path);
//     return (
//       <div className="relative group inline-block">
//         <img
//           src={fullUrl}
//           alt={alt}
//           className={`${className} border border-gray-200 shadow-sm`}
//           onError={(e) => {
//             e.target.style.display = "none";
//           }}
//         />
//         <button
//           onClick={() => window.open(fullUrl, "_blank")}
//           className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//           title="View full image"
//         >
//           <span className="text-xs">View</span>
//         </button>
//       </div>
//     );
//   };

//   const renderCompletionBar = (percentage) => {
//     const p = parseInt(percentage) || 0;
//     const color =
//       p === 100
//         ? "bg-emerald-500"
//         : p >= 75
//           ? "bg-blue-500"
//           : p >= 50
//             ? "bg-amber-500"
//             : p >= 25
//               ? "bg-orange-500"
//               : "bg-red-500";
//     return (
//       <div className="flex items-center gap-4">
//         <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden">
//           <div
//             className={`h-full ${color} rounded-full transition-all duration-500`}
//             style={{ width: `${p}%` }}
//           />
//         </div>
//         <span className="text-sm font-medium text-slate-700">{p}%</span>
//       </div>
//     );
//   };

//   // ─── Loading state ─────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-slate-400">Loading company details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData || !viewData) {
//     return null;
//   }

//   const completionPct =
//     parseInt(initialData.profile_completion_percentage) || 0;
//   const heroName = initialData.company_name?.trim() || "Unnamed Company";
//   const initials = heroName
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0]?.toUpperCase())
//     .join("");

//   const approved = viewData.company_status === "active";
//   const isTogglingThisCompany = statusUpdatingId === viewData?.id;

//   // ─── Main render ───────────────────────────────────────────────
//   return (
//     <div className="min-h-screen pb-16">
//       {/* ─── Sticky action bar ─────────────────────────────────── */}
//       <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3 min-w-0">
//             <button
//               onClick={() => navigate("/companies")}
//               className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
//               aria-label="Back"
//             >
//               <MdArrowBack size={19} className="text-slate-600" />
//             </button>
//             <div className="min-w-0">
//               <p className="text-[11px] text-slate-400 leading-tight">
//                 Companies
//               </p>
//               <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
//                 {heroName}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <button
//               onClick={handleToggleApprove}
//               disabled={isTogglingThisCompany}
//               className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
//                 approved
//                   ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
//                   : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
//               }`}
//             >
//               {approved ? <MdVerified size={18} /> : <MdCheckCircle size={18} />}
//               {isTogglingThisCompany
//                 ? "Updating..."
//                 : approved
//                   ? "Approved"
//                   : "Approve"}
//             </button>
//             <button
//               onClick={handleEdit}
//               className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
//             >
//               <MdEdit size={18} />
//               Edit Company
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
//           <div className="relative h-44 sm:h-52">
//             {initialData.banner_image ? (
//               <img
//                 src={getImageUrl(initialData.banner_image)}
//                 alt="Banner"
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                 }}
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
//             )}
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
//           </div>

//           <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
//             <div className="flex flex-col sm:flex-row sm:items-end gap-4">
//               {/* Logo */}
//               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
//                 {initialData.logo ? (
//                   <img
//                     src={getImageUrl(initialData.logo)}
//                     alt="Logo"
//                     className="w-full h-full object-cover rounded-xl"
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
//                     {initials || <MdApartment size={22} />}
//                   </div>
//                 )}
//               </div>

//               {/* Name + chips */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
//                     {heroName}
//                   </h1>
//                   {initialData.is_trending && (
//                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
//                       <MdWhatshot size={12} />
//                       Trending
//                     </span>
//                   )}
//                 </div>
//                 <div className="mt-2 flex items-center gap-2 flex-wrap">
//                   <StatusPill status={initialData.company_status} />
//                   <span className="text-xs text-white/70 capitalize">
//                     {initialData.profile_type || "company"}
//                   </span>
//                   {initialData.website && (
//                     <a
//                       href={
//                         initialData.website.startsWith("http")
//                           ? initialData.website
//                           : `https://${initialData.website}`
//                       }
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
//                     >
//                       <MdLanguage size={13} />
//                       Website
//                       <MdOpenInNew size={11} />
//                     </a>
//                   )}
//                 </div>
//               </div>

//               {/* Completion ring */}
//               <div className="hidden sm:block">
//                 <CompletionRing percentage={completionPct} />
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* ─── Quick stat strip ──────────────────────────────────── */}
//         {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
//           <HeroStat
//             icon={MdCategory}
//             label="Industry"
//             value={initialData.industry_name}
//           />
//           <HeroStat
//             icon={MdGroups}
//             label="Company size"
//             value={initialData.company_size_name}
//           />
//           <HeroStat
//             icon={MdCalendarToday}
//             label="Founded"
//             value={initialData.founded_year}
//           />
//           <HeroStat
//             icon={MdReceiptLong}
//             label="GST number"
//             value={initialData.gst_number}
//           />
//         </div> */}

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
//                       layoutId="view-company-tab-underline"
//                       className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
//                       transition={{ type: "spring", stiffness: 500, damping: 35 }}
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
//                 {/* ─── OVERVIEW ─────────────────────────────────── */}
//                 {activeTab === "overview" && (
//                   <div className="space-y-5">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div className="sm:col-span-2">
//                         <FieldLabel>Company name</FieldLabel>
//                         <ReadOnlyValue>{initialData.company_name}</ReadOnlyValue>
//                       </div>
//                       <div>
//                         <FieldLabel>Slug</FieldLabel>
//                         <ReadOnlyValue>{initialData.slug || "—"}</ReadOnlyValue>
//                       </div>
//                       <div>
//                         <FieldLabel>Website</FieldLabel>
//                         <ReadOnlyValue>
//                           {initialData.website ? (
//                             <a
//                               href={initialData.website}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:underline"
//                             >
//                               {initialData.website}
//                             </a>
//                           ) : (
//                             "—"
//                           )}
//                         </ReadOnlyValue>
//                       </div>
//                       <div>
//                         <FieldLabel>Founded year</FieldLabel>
//                         <ReadOnlyValue>{initialData.founded_year || "—"}</ReadOnlyValue>
//                       </div>
//                       <div>
//                         <FieldLabel>GST number</FieldLabel>
//                         <ReadOnlyValue>{initialData.gst_number || "—"}</ReadOnlyValue>
//                       </div>
//                     </div>

//                     <div>
//                       <FieldLabel>About company</FieldLabel>
//                       <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-w-2xl">
//                         {initialData.about_company ? (
//                           <div
//                             className="prose prose-sm max-w-none text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_table]:border [&_table]:border-slate-300 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2"
//                             dangerouslySetInnerHTML={{
//                               __html: initialData.about_company,
//                             }}
//                           />
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <FieldLabel>Company status</FieldLabel>
//                         <StatusPill status={initialData.company_status} />
//                       </div>
//                       <div>
//                         <FieldLabel>Trending</FieldLabel>
//                         <div className="flex items-center gap-3 pt-1.5">
//                           <span className="text-sm text-slate-600">
//                             {initialData.is_trending
//                               ? "Shown in trending companies"
//                               : "Not marked as trending"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── RELATIONS ────────────────────────────────── */}
//                 {activeTab === "relations" && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                     <div className="sm:col-span-2">
//                       <FieldLabel>Company user</FieldLabel>
//                       <div className="flex items-center gap-2.5 text-sm text-slate-700 py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
//                         <MdPerson size={16} className="text-slate-400" />
//                         {initialData.company_user_email || "—"}
//                         <span className="ml-auto text-[11px] text-slate-400">
//                           Read-only
//                         </span>
//                       </div>
//                     </div>

//                     <div>
//                       <FieldLabel>Industry</FieldLabel>
//                       <ReadOnlyValue>{initialData.industry_name}</ReadOnlyValue>
//                     </div>

//                     <div>
//                       <FieldLabel>Sub-industries</FieldLabel>
//                       <ReadOnlyValue>
//                         {Array.isArray(initialData.subIndustries) &&
//                         initialData.subIndustries.length > 0
//                           ? initialData.subIndustries
//                               .map((sub) => sub.sub_industry_name || sub.name)
//                               .join(", ")
//                           : "—"}
//                       </ReadOnlyValue>
//                     </div>

//                     <div>
//                       <FieldLabel>Company size</FieldLabel>
//                       <ReadOnlyValue>{initialData.company_size_name}</ReadOnlyValue>
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── DOCUMENTS ────────────────────────────────── */}
//                 {activeTab === "documents" && (
//                   <div className="space-y-6">
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
//                       <div className="flex-1">
//                         <FieldLabel>Registration document type</FieldLabel>
//                         <ReadOnlyValue>
//                           {initialData.company_register_document_type}
//                         </ReadOnlyValue>
//                       </div>
//                       <div className="flex-1">
//                         <FieldLabel>Registration document</FieldLabel>
//                         {initialData.company_register_document ? (
//                           <a
//                             href={getImageUrl(initialData.company_register_document)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline py-2.5 px-3.5 bg-blue-50 rounded-lg"
//                           >
//                             <MdDescription size={16} />
//                             {initialData.company_register_document
//                               .split("/")
//                               .pop()}
//                           </a>
//                         ) : (
//                           <ReadOnlyValue>No document</ReadOnlyValue>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
//                       <div className="flex-1">
//                         <FieldLabel>GST Number</FieldLabel>
//                         <div className="flex items-center gap-2 text-sm text-slate-700 py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
//                           <MdReceiptLong size={16} className="text-slate-400" />
//                           {initialData.gst_number || "—"}
//                         </div>
//                       </div>
//                       <div className="flex-1" />
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-slate-100">
//                       <div className="flex-1">
//                         <FieldLabel>PAN card number</FieldLabel>
//                         <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
//                           <MdCreditCard size={16} className="text-slate-400" />
//                           {initialData.company_pan_card || "—"}
//                         </div>
//                       </div>
//                       <div>
//                         <FieldLabel>PAN card image</FieldLabel>
//                         {renderDocPreview(
//                           initialData.company_pan_card_image,
//                           "PAN card",
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-5">
//                       <div className="flex-1">
//                         <FieldLabel>Owner Aadhar number</FieldLabel>
//                         <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
//                           <MdPermIdentity size={16} className="text-slate-400" />
//                           {initialData.owner_adharcard || "—"}
//                         </div>
//                       </div>
//                       <div>
//                         <FieldLabel>Owner Aadhar image</FieldLabel>
//                         {renderDocPreview(
//                           initialData.owner_adharcard_image,
//                           "Aadhar card",
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── MEDIA ────────────────────────────────────── */}
//                 {activeTab === "media" && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <div>
//                       <FieldLabel>Logo</FieldLabel>
//                       <div className="mt-1">
//                         {renderImage(
//                           initialData.logo,
//                           "Logo",
//                           "w-28 h-28 object-cover rounded-lg",
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <FieldLabel>Banner image</FieldLabel>
//                       <div className="mt-1">
//                         {renderImage(
//                           initialData.banner_image,
//                           "Banner",
//                           "w-full sm:w-64 h-28 object-cover rounded-lg",
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── ACTIVITY ─────────────────────────────────── */}
//                 {activeTab === "activity" && (
//                   <div className="space-y-6">
//                     <div>
//                       <FieldLabel>Profile completion</FieldLabel>
//                       <div className="flex items-center gap-4 mb-1">
//                         <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: `${completionPct}%` }}
//                             transition={{ duration: 0.8, ease: "easeOut" }}
//                             className={`h-full rounded-full ${
//                               completionPct === 100
//                                 ? "bg-emerald-500"
//                                 : completionPct >= 50
//                                   ? "bg-blue-500"
//                                   : "bg-amber-500"
//                             }`}
//                           />
//                         </div>
//                         <span className="text-sm font-semibold text-slate-700 w-12 text-right">
//                           {completionPct}%
//                         </span>
//                       </div>
//                       <p className="text-xs text-slate-400">
//                         Score: {initialData.profile_completion}/100 · Last
//                         calculated{" "}
//                         {initialData.last_completion_calculated_at
//                           ? formatDate(
//                               parseApiDate(
//                                 initialData.last_completion_calculated_at,
//                               ),
//                             )
//                           : "—"}
//                       </p>
//                     </div>

//                     <div className="border-t border-slate-100 pt-5">
//                       <div className="relative pl-6">
//                         <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />

//                         <div className="relative pb-6">
//                           <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
//                           <p className="text-sm font-semibold text-slate-700">
//                             Created
//                           </p>
//                           <p className="text-sm text-slate-500 mt-0.5">
//                             {getCreatedByName(viewData)}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {initialData.created_at
//                               ? formatDate(initialData.created_at)
//                               : "—"}
//                           </p>
//                         </div>

//                         <div className="relative">
//                           <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
//                           <p className="text-sm font-semibold text-slate-700">
//                             Last updated
//                           </p>
//                           <p className="text-sm text-slate-500 mt-0.5">
//                             {getUpdatedByName(viewData)}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {initialData.updated_at
//                               ? formatDate(initialData.updated_at)
//                               : "—"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewCompany;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdEdit,
  MdCheckCircle,
  MdVerified,
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
  MdWhatshot,
  MdErrorOutline,
  MdPauseCircle,
  MdBlock,
} from "react-icons/md";
import companyService from "../../services/company.service";
import { showError, showSuccess } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// ─── Helper: build full image URL ──────────────────────────────
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path}`;
};

// ─── Helper: Check if file is an image ──────────────────────────
const isImageFile = (path) => {
  if (!path) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.avif'];
  const lowerPath = path.toLowerCase();
  return imageExtensions.some(ext => lowerPath.endsWith(ext));
};

// ─── Helper: Get file name from path ────────────────────────────
const getFileName = (path) => {
  if (!path) return 'Document';
  return path.split('/').pop() || 'Document';
};

// ─── Helper: Parse API date format ──────────────────────────────
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

// ─── Company status styles ──────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    icon: MdCheckCircle,
    heroDot: "bg-emerald-400",
  },
  pending: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    icon: MdPauseCircle,
    heroDot: "bg-amber-400",
  },
  blocked: {
    pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-500",
    icon: MdBlock,
    heroDot: "bg-red-400",
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    icon: MdErrorOutline,
    heroDot: "bg-slate-400",
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
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ─── Animated completion ring ──────────────────────────────────
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

// ─── Small helper components ────────────────────────────────────
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

const TABS = [
  { id: "overview", label: "Overview", icon: MdApartment },
  { id: "relations", label: "Relations", icon: MdCategory },
  { id: "documents", label: "Documents", icon: MdDescription },
  { id: "media", label: "Media", icon: MdImage },
  { id: "activity", label: "Activity", icon: MdHistory },
];

// ─── Main Component ─────────────────────────────────────────────
const ViewCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNameCache, setUserNameCache] = useState({});
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

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

  const getCreatedByName = (row) => {
    if (!row) return "-";
    return row.created_by ? getUserNameCached(row.created_by) : "-";
  };

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    return row.updated_by ? getUserNameCached(row.updated_by) : "-";
  };

  // ─── Handle status change ────────────────────────────────────
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
    const nextStatus = viewData.company_status === "active" ? "pending" : "active";
    handleCompanyStatusChange(viewData.id, nextStatus);
  };

  // ─── Calculate profile completion ──────────────────────────────
  const calculateProfileCompletion = (data) => {
    if (!data) return 0;
    const fields = [
      { name: "company_name", weight: 15 },
      { name: "slug", weight: 5 },
      { name: "website", weight: 10 },
      { name: "founded_year", weight: 5 },
      { name: "about_company", weight: 15 },
      { name: "gst_number", weight: 10 },
      { name: "company_user_id", weight: 10 },
      { name: "industry_id", weight: 10 },
      { name: "company_size_id", weight: 10 },
      { name: "logo", weight: 5 },
      { name: "banner_image", weight: 5 },
    ];
    let completedWeight = 0;
    let totalWeight = 0;
    fields.forEach((field) => {
      totalWeight += field.weight;
      const value = data[field.name];
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "-"
      ) {
        completedWeight += field.weight;
      }
    });
    const percentage =
      totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
    return Math.min(percentage, 100);
  };

  // ─── Fetch company data ────────────────────────────────────────
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
            reference_code:
              data.reference_code || data.referenceCode || data.ref_code || "",
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

    if (id) {
      fetchCompany();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/companies/edit/${id}`);
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
            <MdOpenInNew size={13} /> {isImage ? 'View' : 'Open'}
          </span>
        </button>
      </div>
    );
  };

  const renderImage = (path, alt, className = "w-24 h-24 object-cover rounded-lg") => {
    if (!path) return <span className="text-gray-400">No image</span>;
    const fullUrl = getImageUrl(path);
    const isImage = isImageFile(path);
    const fileName = getFileName(path);

    if (!isImage) {
      return (
        <div className="relative group inline-block">
          <div className={`${className} border border-gray-200 shadow-sm bg-slate-50 flex flex-col items-center justify-center p-4`}>
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

  const renderCompletionBar = (percentage) => {
    const p = parseInt(percentage) || 0;
    const color =
      p === 100
        ? "bg-emerald-500"
        : p >= 75
          ? "bg-blue-500"
          : p >= 50
            ? "bg-amber-500"
            : p >= 25
              ? "bg-orange-500"
              : "bg-red-500";
    return (
      <div className="flex items-center gap-4">
        <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} rounded-full transition-all duration-500`}
            style={{ width: `${p}%` }}
          />
        </div>
        <span className="text-sm font-medium text-slate-700">{p}%</span>
      </div>
    );
  };

  // ─── Loading state ─────────────────────────────────────────────
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

  if (!initialData || !viewData) {
    return null;
  }

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

  // ─── Main render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
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
              {approved ? <MdVerified size={18} /> : <MdCheckCircle size={18} />}
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
        {/* ─── Hero ───────────────────────────────────────────────── */}
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
              {/* Logo */}
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

              {/* Name + chips */}
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

              {/* Completion ring */}
              <div className="hidden sm:block">
                <CompletionRing percentage={completionPct} />
              </div>
            </div>
          </div>
        </motion.div>

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
                      layoutId="view-company-tab-underline"
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
                {/* ─── OVERVIEW ─────────────────────────────────── */}
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <FieldLabel>Company name</FieldLabel>
                        <ReadOnlyValue>{initialData.company_name}</ReadOnlyValue>
                      </div>
                      <div>
                        <FieldLabel>Slug</FieldLabel>
                        <ReadOnlyValue>{initialData.slug || "—"}</ReadOnlyValue>
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
                        <ReadOnlyValue>{initialData.founded_year || "—"}</ReadOnlyValue>
                      </div>
                      <div>
                        <FieldLabel>GST number</FieldLabel>
                        <ReadOnlyValue>{initialData.gst_number || "—"}</ReadOnlyValue>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>About company</FieldLabel>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-w-2xl">
                        {initialData.about_company ? (
                          <div
                            className="prose prose-sm max-w-none text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_img]:rounded-lg [&_table]:border [&_table]:border-slate-300 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2"
                            dangerouslySetInnerHTML={{
                              __html: initialData.about_company,
                            }}
                          />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel>Company status</FieldLabel>
                        <StatusPill status={initialData.company_status} />
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

                {/* ─── RELATIONS ────────────────────────────────── */}
                {activeTab === "relations" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <FieldLabel>Company user</FieldLabel>
                      <div className="flex items-center gap-2.5 text-sm text-slate-700 py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
                        <MdPerson size={16} className="text-slate-400" />
                        {initialData.company_user_email || "—"}
                        <span className="ml-auto text-[11px] text-slate-400">
                          Read-only
                        </span>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Industry</FieldLabel>
                      <ReadOnlyValue>{initialData.industry_name}</ReadOnlyValue>
                    </div>

                    <div>
                      <FieldLabel>Sub-industries</FieldLabel>
                      <ReadOnlyValue>
                        {Array.isArray(initialData.subIndustries) &&
                        initialData.subIndustries.length > 0
                          ? initialData.subIndustries
                              .map((sub) => sub.sub_industry_name || sub.name)
                              .join(", ")
                          : "—"}
                      </ReadOnlyValue>
                    </div>

                    <div>
                      <FieldLabel>Company size</FieldLabel>
                      <ReadOnlyValue>{initialData.company_size_name}</ReadOnlyValue>
                    </div>
                  </div>
                )}

                {/* ─── DOCUMENTS ────────────────────────────────── */}
                {activeTab === "documents" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
                      <div className="flex-1">
                        <FieldLabel>Registration document type</FieldLabel>
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
                              "w-32 h-24 object-cover rounded-lg"
                            )
                          ) : (
                            <span className="text-gray-400">No document</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
                      <div className="flex-1">
                        <FieldLabel>GST Number</FieldLabel>
                        <div className="flex items-center gap-2 text-sm text-slate-700 py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
                          <MdReceiptLong size={16} className="text-slate-400" />
                          {initialData.gst_number || "—"}
                        </div>
                      </div>
                      <div className="flex-1" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-slate-100">
                      <div className="flex-1">
                        <FieldLabel>PAN card number</FieldLabel>
                        <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                          <MdCreditCard size={16} className="text-slate-400" />
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
                          <MdPermIdentity size={16} className="text-slate-400" />
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

                {/* ─── MEDIA ────────────────────────────────────── */}
                {activeTab === "media" && (
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

                {/* ─── ACTIVITY ─────────────────────────────────── */}
                {activeTab === "activity" && (
                  <div className="space-y-6">
                    <div>
                      <FieldLabel>Profile completion</FieldLabel>
                      <div className="flex items-center gap-4 mb-1">
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
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
                        Score: {initialData.profile_completion}/100 · Last
                        calculated{" "}
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
        </div>
      </div>
    </div>
  );
};

export default ViewCompany;