// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
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
// } from "react-icons/md";
// import companyService from "../../services/company.service";
// import subIndustryService from "../../services/subIndustry.service";
// import { useAuth } from "../../context/AuthContext";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { Editor } from "@tinymce/tinymce-react";

// const API_BASE =
//   import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

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

// // ─── Company status options ──────────────────────────────────
// const COMPANY_STATUS_OPTIONS = [
//   { value: "active", label: "Active" },
//   { value: "inactive", label: "Inactive" },
//   { value: "blocked", label: "Blocked" },
//   { value: "pending", label: "Pending" },
// ];

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

// // ─── Animated completion ring, shown in the hero ─────────────
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

// // ─── Small reusable pieces ────────────────────────────────────
// const FieldLabel = ({ children, required }) => (
//   <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
//     {children}
//     {required && <span className="text-red-500 ml-0.5">*</span>}
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

// const Toggle = ({ checked, onChange, name }) => (
//   <label className="relative inline-flex items-center cursor-pointer">
//     <input
//       type="checkbox"
//       name={name}
//       checked={checked || false}
//       onChange={onChange}
//       className="sr-only peer"
//     />
//     <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
//   </label>
// );

// const TABS = [
//   { id: "overview", label: "Overview", icon: MdApartment },
//   { id: "relations", label: "Relations", icon: MdCategory },
//   { id: "documents", label: "Documents", icon: MdDescription },
//   { id: "media", label: "Media", icon: MdImage },
//   { id: "activity", label: "Activity", icon: MdHistory },
// ];

// const EditCompany = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { user } = useAuth();
//   const userId = user?.id || 1;

//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [aboutCompanyMode, setAboutCompanyMode] = useState("rich");
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   // ─── Dropdown data states ────────────────────────────────────
//   const [companyUsers, setCompanyUsers] = useState([]);
//   const [companySizes, setCompanySizes] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [subIndustries, setSubIndustries] = useState([]);
//   const [loadingData, setLoadingData] = useState(true);

//   const extractList = (response) => {
//     let value = response;
//     for (let depth = 0; depth < 4 && value; depth += 1) {
//       if (Array.isArray(value)) return value;
//       value = value.data || value.results || value.items;
//     }
//     return [];
//   };

//   const [userNameCache, setUserNameCache] = useState({});

//   // ─── Load dropdown data ──────────────────────────────────────
//   useEffect(() => {
//     const loadDropdownData = async () => {
//       try {
//         const [usersRes, sizesRes, industriesRes, subIndustriesRes] =
//           await Promise.all([
//             companyService.getCompanyUsers(),
//             companyService.getCompanySizes(),
//             companyService.getIndustries(),
//             subIndustryService.getAll(),
//           ]);

//         const sizes = extractList(sizesRes);
//         const activeSizes = Array.isArray(sizes)
//           ? sizes.filter(
//               (s) =>
//                 s.is_status === true ||
//                 s.is_status === 1 ||
//                 s.is_status === "true",
//             )
//           : [];
//         setCompanySizes(activeSizes.length > 0 ? activeSizes : sizes);

//         setCompanyUsers(extractList(usersRes));
//         setIndustries(extractList(industriesRes));
//         setSubIndustries(extractList(subIndustriesRes));
//       } catch (err) {
//         console.error("Error loading dropdown data:", err);
//         showError("Failed to load form data. Please refresh.");
//       } finally {
//         setLoadingData(false);
//       }
//     };
//     loadDropdownData();
//   }, []);

//   // ─── Fetch users for name mapping ────────────────────────────
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await companyService.getUsers();
//         const users = response?.data || response || [];
//         const userMap = {};
//         const userArray = Array.isArray(users) ? users : [];
//         userArray.forEach((u) => {
//           const userId = u.id || u.user_id || u.company_user_id;
//           if (userId) {
//             userMap[userId] =
//               u.full_name ||
//               u.company_user_name ||
//               u.display_name ||
//               u.name ||
//               u.username ||
//               u.email ||
//               u.company_user_email ||
//               `User ${userId}`;
//           }
//         });
//         setUserNameCache(userMap);
//       } catch (err) {
//         console.warn("Could not fetch users for name mapping:", err.message);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ─── Fetch company data ──────────────────────────────────────
//   useEffect(() => {
//     const fetchCompany = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await companyService.getById(id);
//         const data = response?.data || response;

//         if (data) {
//           let createdByName = "-";
//           let updatedByName = "-";

//           if (data.created_by) {
//             createdByName =
//               userNameCache[data.created_by] ||
//               data.CreatedBy?.name ||
//               data.CreatedBy?.email ||
//               `User ${data.created_by}`;
//           }
//           if (data.updated_by) {
//             updatedByName =
//               userNameCache[data.updated_by] ||
//               data.UpdatedBy?.name ||
//               data.UpdatedBy?.email ||
//               `User ${data.updated_by}`;
//           }

//           const createdAtDate = data.created_at
//             ? parseApiDate(data.created_at)
//             : null;
//           const updatedAtDate = data.updated_at
//             ? parseApiDate(data.updated_at)
//             : null;

//           const formData = {
//             id: data.id || "",
//             company_name: data.company_name || "",
//             profile_type: data.profile_type || "company",
//             slug: data.slug || "",
//             website: data.website || "",
//             founded_year: data.founded_year || "",
//             about_company: data.about_company || "",
//             gst_number: data.gst_number || "",
//             company_user_id: String(
//               data.company_user_id || data.CompanyUser?.company_user_id || "",
//             ),
//             company_user_email:
//               data.CompanyUser?.company_user_email ||
//               data.CompanyUser?.email ||
//               data.company_user_email ||
//               "-",
//             industry_id: String(
//               data.industry_id ||
//                 data.Industries?.[0]?.industry_id ||
//                 data.Industry?.industry_id ||
//                 "",
//             ),
//             industry_name:
//               data.Industries?.[0]?.industry_name ||
//               data.Industry?.industry_name ||
//               data.industry_name ||
//               "-",
//             sub_industry_id: String(
//               data.sub_industry_id ||
//                 data.SubIndustries?.[0]?.sub_industry_id ||
//                 data.SubIndustry?.sub_industry_id ||
//                 "",
//             ),
//             sub_industry_name:
//               data.SubIndustries?.[0]?.sub_industry_name ||
//               data.SubIndustry?.sub_industry_name ||
//               data.sub_industry_name ||
//               "-",
//             company_size_id: String(
//               data.company_size_id || data.CompanySize?.company_size_id || "",
//             ),
//             company_size_name:
//               data.CompanySize?.company_size_name ||
//               data.company_size_name ||
//               "-",
//             logo: data.logo || null,
//             banner_image: data.banner_image || null,
//             company_status: data.company_status || "active",
//             is_status: data.is_status ? "active" : "inactive",
//             is_trending: data.is_trending || false,
//             profile_completion: data.profile_completion || 0,
//             profile_completion_percentage:
//               data.profile_completion_percentage || 0,
//             last_completion_calculated_at:
//               data.last_completion_calculated_at || null,
//             company_register_document_type:
//               data.company_register_document_type || "-",
//             company_register_document: data.company_register_document || null,
//             company_pan_card: data.company_pan_card || "-",
//             company_pan_card_image: data.company_pan_card_image || null,
//             owner_adharcard: data.owner_adharcard || "-",
//             owner_adharcard_image: data.owner_adharcard_image || null,
//             created_by: data.created_by,
//             created_by_name: createdByName,
//             created_at: createdAtDate,
//             updated_by: data.updated_by,
//             updated_by_name: updatedByName,
//             updated_at: updatedAtDate,
//           };

//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("Company not found");
//           navigate("/companies");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load company data");
//         navigate("/companies");
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id) {
//       fetchCompany();
//     }
//   }, [id, navigate, userNameCache]);

//   // ─── Form state ──────────────────────────────────────────────
//   const [formValues, setFormValues] = useState(initialData || {});
//   const [fileLogo, setFileLogo] = useState(null);
//   const [fileBanner, setFileBanner] = useState(null);

//   useEffect(() => {
//     if (initialData) {
//       setFormValues(initialData);
//     }
//   }, [initialData]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (field === "logo") {
//         setFileLogo(file);
//         setFormValues((prev) => ({ ...prev, logo: URL.createObjectURL(file) }));
//       } else if (field === "banner_image") {
//         setFileBanner(file);
//         setFormValues((prev) => ({
//           ...prev,
//           banner_image: URL.createObjectURL(file),
//         }));
//       }
//     }
//   };

//   // ─── Dropdown options ────────────────────────────────────────
//   const sizeOptions = companySizes.map((s) => ({
//     value: String(s.id || s.company_size_id),
//     label: s.name || s.company_size_name || `Size ${s.id || s.company_size_id}`,
//   }));

//   const industryOptions = industries.map((ind) => ({
//     value: String(ind.id || ind.industry_id),
//     label:
//       ind.name || ind.industry_name || `Industry ${ind.id || ind.industry_id}`,
//   }));

//   const subIndustryOptions = subIndustries.map((sub) => ({
//     value: String(sub.id || sub.sub_industry_id),
//     label:
//       sub.name ||
//       sub.sub_industry_name ||
//       `Sub-industry ${sub.id || sub.sub_industry_id}`,
//   }));

//   // ─── Validation ──────────────────────────────────────────────
//   const validate = () => {
//     if (!formValues.company_name?.trim()) {
//       showError("Company name is required");
//       return false;
//     }
//     if (formValues.company_name.trim().length < 2) {
//       showError("Company name must be at least 2 characters");
//       return false;
//     }
//     if (formValues.company_name.trim().length > 100) {
//       showError("Company name must be at most 100 characters");
//       return false;
//     }
//     if (
//       formValues.website &&
//       !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
//         formValues.website,
//       )
//     ) {
//       showError("Please enter a valid URL");
//       return false;
//     }
//     if (formValues.founded_year) {
//       const year = parseInt(formValues.founded_year);
//       if (year < 1900 || year > new Date().getFullYear()) {
//         showError(
//           `Founded year must be between 1900 and ${new Date().getFullYear()}`,
//         );
//         return false;
//       }
//     }
//     if (!formValues.company_status) {
//       showError("Company status is required");
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
//       const payload = new FormData();
//       payload.append("company_name", formValues.company_name.trim());
//       payload.append(
//         "slug",
//         formValues.slug.trim() ||
//           formValues.company_name.trim().toLowerCase().replace(/\s+/g, "-"),
//       );
//       payload.append("website", formValues.website?.trim() || "");
//       payload.append("founded_year", formValues.founded_year || "");
//       payload.append("about_company", formValues.about_company?.trim() || "");
//       payload.append("gst_number", formValues.gst_number?.trim() || "");
//       payload.append("company_status", formValues.company_status);
//       payload.append(
//         "is_status",
//         formValues.is_status === "active" ? "true" : "false",
//       );
//       payload.append("is_trending", formValues.is_trending ? "true" : "false");
//       payload.append("updated_by", userId);

//       // company_user_id is NOT sent because it's read-only - we do not include it.
//       // if (formValues.company_user_id) {
//       //   payload.append("company_user_id", formValues.company_user_id);
//       // }
//       if (formValues.company_size_id) {
//         payload.append("company_size_id", formValues.company_size_id);
//       }
//       if (formValues.industry_id) {
//         payload.append("industry_id", formValues.industry_id);
//       }
//       if (formValues.sub_industry_id) {
//         payload.append("sub_industry_id", formValues.sub_industry_id);
//       }

//       if (fileLogo instanceof File) {
//         payload.append("logo", fileLogo);
//       }
//       if (fileBanner instanceof File) {
//         payload.append("banner_image", fileBanner);
//       }

//       await companyService.update(id, payload);
//       showSuccess("Company updated successfully");
//       navigate("/companies");
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(error.message || "Failed to update company");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Delete ──────────────────────────────────────────────────
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await companyService.delete(id);
//       showSuccess("Company deleted successfully");
//       navigate("/companies");
//     } catch (error) {
//       console.error("Delete error:", error);
//       showError(error.message || "Failed to delete company");
//     } finally {
//       setDeleteLoading(false);
//       setIsDeleteModalOpen(false);
//     }
//   };

//   // ─── Loading state ─────────────────────────────────────────────
//   if (fetchLoading || loadingData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-slate-400">Loading company data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
//         <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
//           <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
//           <p className="text-slate-600 font-medium">Company not found</p>
//           <p className="text-sm text-slate-400 mt-1">
//             It may have been removed or the link is incorrect.
//           </p>
//           <button
//             onClick={() => navigate("/companies")}
//             className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//           >
//             <MdArrowBack size={16} />
//             Back to companies
//           </button>
//         </div>
//       </div>
//     );
//   }

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
//             window.open(
//               path.startsWith("blob:") ? path : getImageUrl(path),
//               "_blank",
//             )
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

//   const completionPct = parseInt(formValues.profile_completion_percentage) || 0;
//   const heroName = formValues.company_name?.trim() || "Unnamed Company";
//   const initials = heroName
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0]?.toUpperCase())
//     .join("");

//   return (
//     <div className="min-h-screen pb-16">
//       {/* ─── Sticky action bar ─────────────────────────────────── */}
//       <div className="bg-white/85 backdrop-blur-md border-b border-slate-200">
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
//             {/* <button
//               type="button"
//               onClick={() => setIsDeleteModalOpen(true)}
//               className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
//               aria-label="Delete company"
//               title="Delete company"
//             >
//               <MdDelete size={19} />
//             </button> */}
//             {/* <button
//               type="button"
//               onClick={() => navigate("/companies")}
//               className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
//             >
//               <MdCancel size={16} />
//               Cancel
//             </button> */}
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
//             >
//               {loading ? (
//                 <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <MdSave size={16} />
//               )}
//               {loading ? "Saving..." : "Save changes"}
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
//             {formValues.banner_image ? (
//               <img
//                 src={
//                   formValues.banner_image.startsWith("blob:")
//                     ? formValues.banner_image
//                     : getImageUrl(formValues.banner_image)
//                 }
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
//                 {formValues.logo ? (
//                   <img
//                     src={
//                       formValues.logo.startsWith("blob:")
//                         ? formValues.logo
//                         : getImageUrl(formValues.logo)
//                     }
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
//                   {formValues.is_trending && (
//                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
//                       <MdWhatshot size={12} />
//                       Trending
//                     </span>
//                   )}
//                 </div>
//                 <div className="mt-2 flex items-center gap-2 flex-wrap">
//                   <StatusPill status={formValues.company_status} />
//                   <span className="text-xs text-white/70 capitalize">
//                     {formValues.profile_type || "company"}
//                   </span>
//                   {formValues.website && (
//                     <a
//                       href={
//                         formValues.website.startsWith("http")
//                           ? formValues.website
//                           : `https://${formValues.website}`
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
//             value={formValues.industry_name}
//           />
//           <HeroStat
//             icon={MdGroups}
//             label="Company size"
//             value={formValues.company_size_name}
//           />
//           <HeroStat
//             icon={MdCalendarToday}
//             label="Founded"
//             value={formValues.founded_year}
//           />
//           <HeroStat
//             icon={MdReceiptLong}
//             label="GST number"
//             value={formValues.gst_number}
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
//                       layoutId="edit-company-tab-underline"
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
//                 {/* ─── OVERVIEW ─────────────────────────────────── */}
//                 {activeTab === "overview" && (
//                   <div className="space-y-5">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div className="sm:col-span-2">
//                         <FieldLabel required>Company name</FieldLabel>
//                         <input
//                           type="text"
//                           name="company_name"
//                           value={formValues.company_name || ""}
//                           onChange={handleInputChange}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                           placeholder="e.g. Acme Corp"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <FieldLabel>Slug (URL identifier)</FieldLabel>
//                         <input
//                           type="text"
//                           name="slug"
//                           value={formValues.slug || ""}
//                           onChange={handleInputChange}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                           placeholder="auto-generated if empty"
//                         />
//                       </div>

//                       <div>
//                         <FieldLabel>Website</FieldLabel>
//                         <input
//                           type="url"
//                           name="website"
//                           value={formValues.website || ""}
//                           onChange={handleInputChange}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                           placeholder="https://example.com"
//                         />
//                       </div>

//                       <div>
//                         <FieldLabel>Founded year</FieldLabel>
//                         <input
//                           type="number"
//                           name="founded_year"
//                           value={formValues.founded_year || ""}
//                           onChange={handleInputChange}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                           placeholder="2020"
//                           min="1900"
//                           max={new Date().getFullYear()}
//                         />
//                       </div>

//                       <div>
//                         <FieldLabel>GST number</FieldLabel>
//                         <input
//                           type="text"
//                           name="gst_number"
//                           value={formValues.gst_number || ""}
//                           onChange={handleInputChange}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                           placeholder="e.g. 24ABCDE1234F1Z5"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <FieldLabel>About company</FieldLabel>

//                       <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 w-fit shadow-sm">
//                         {[
//                           { id: "rich", label: "Text" },
//                           { id: "html", label: "HTML" },
//                         ].map((tab) => (
//                           <button
//                             key={tab.id}
//                             type="button"
//                             onClick={() => setAboutCompanyMode(tab.id)}
//                             className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                               aboutCompanyMode === tab.id
//                                 ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-100"
//                                 : "text-slate-600 hover:text-slate-800"
//                             }`}
//                           >
//                             {tab.label}
//                           </button>
//                         ))}
//                       </div>

//                       {aboutCompanyMode === "rich" ? (
//                         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//                           <Editor
//                             tinymceScriptSrc="/tinymce/tinymce.min.js"
//                             licenseKey="gpl"
//                             value={formValues.about_company || ""}
//                             onEditorChange={(content) =>
//                               setFormValues((prev) => ({
//                                 ...prev,
//                                 about_company: content,
//                               }))
//                             }
//                             init={{
//                               height: 320,
//                               menubar: false,
//                               statusbar: true,
//                               plugins: [
//                                 "advlist",
//                                 "autolink",
//                                 "lists",
//                                 "link",
//                                 "image",
//                                 "charmap",
//                                 "preview",
//                                 "anchor",
//                                 "searchreplace",
//                                 "visualblocks",
//                                 "code",
//                                 "fullscreen",
//                                 "insertdatetime",
//                                 "media",
//                                 "table",
//                                 "help",
//                                 "wordcount",
//                               ],
//                               toolbar:
//                                 "undo redo | styleselect | bold italic underline strikethrough | " +
//                                 "fontfamily fontsize | forecolor backcolor | " +
//                                 "alignleft aligncenter alignright alignjustify | " +
//                                 "bullist numlist outdent indent | link image table | " +
//                                 "removeformat code fullscreen | help",
//                               content_style:
//                                 "body { font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.7; } p { margin: 0 0 10px; }",
//                               placeholder: "Write your company profile here...",
//                               images_upload_handler: (blobInfo) =>
//                                 new Promise((resolve, reject) => {
//                                   const reader = new FileReader();
//                                   reader.onload = () => resolve(reader.result);
//                                   reader.onerror = () =>
//                                     reject("Image upload failed");
//                                   reader.readAsDataURL(blobInfo.blob());
//                                 }),
//                             }}
//                           />
//                         </div>
//                       ) : (
//                         <textarea
//                           value={formValues.about_company || ""}
//                           onChange={(e) =>
//                             setFormValues((prev) => ({
//                               ...prev,
//                               about_company: e.target.value,
//                             }))
//                           }
//                           className="w-full min-h-[220px] px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors resize-y bg-slate-50"
//                           placeholder="<p>Write HTML here...</p>"
//                         />
//                       )}

//                       <p className="mt-2 text-xs text-slate-500">
//                         Use the rich text editor for formatting, or switch to
//                         HTML for direct source editing.
//                       </p>
//                     </div>

//                     <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <FieldLabel required>Company status</FieldLabel>
//                         <select
//                           name="company_status"
//                           value={formValues.company_status || "active"}
//                           onChange={handleInputChange}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                         >
//                           {COMPANY_STATUS_OPTIONS.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <FieldLabel>Trending</FieldLabel>
//                         <div className="flex items-center gap-3 pt-1.5">
//                           <Toggle
//                             name="is_trending"
//                             checked={formValues.is_trending}
//                             onChange={handleInputChange}
//                           />
//                           <span className="text-sm text-slate-600">
//                             {formValues.is_trending
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
//                         {formValues.company_user_email || "—"}
//                         <span className="ml-auto text-[11px] text-slate-400">
//                           Read-only
//                         </span>
//                       </div>
//                     </div>

//                     <div>
//                       <FieldLabel>Industry</FieldLabel>
//                       <select
//                         name="industry_id"
//                         value={formValues.industry_id || ""}
//                         onChange={handleInputChange}
//                         className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                         disabled={loadingData}
//                       >
//                         <option value="">
//                           {loadingData ? "Loading..." : "Select an industry"}
//                         </option>
//                         {industryOptions.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <FieldLabel>Sub-industry</FieldLabel>
//                       <select
//                         name="sub_industry_id"
//                         value={formValues.sub_industry_id || ""}
//                         onChange={handleInputChange}
//                         className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                         disabled={loadingData}
//                       >
//                         <option value="">
//                           {loadingData ? "Loading..." : "Select a sub-industry"}
//                         </option>
//                         {subIndustryOptions.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <FieldLabel>Company size</FieldLabel>
//                       <select
//                         name="company_size_id"
//                         value={formValues.company_size_id || ""}
//                         onChange={handleInputChange}
//                         className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
//                         disabled={loadingData}
//                       >
//                         <option value="">
//                           {loadingData ? "Loading..." : "Select a company size"}
//                         </option>
//                         {sizeOptions.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 )}

//                 {/* ─── DOCUMENTS ────────────────────────────────── */}
//                 {activeTab === "documents" && (
//                   <div className="space-y-6">
//                     {/* ── Registration document ── */}
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
//                       <div className="flex-1">
//                         <FieldLabel>Registration document type</FieldLabel>
//                         <ReadOnlyValue>
//                           {formValues.company_register_document_type}
//                         </ReadOnlyValue>
//                       </div>
//                       <div className="flex-1">
//                         <FieldLabel>Registration document</FieldLabel>
//                         {formValues.company_register_document ? (
//                           <a
//                             href={getImageUrl(
//                               formValues.company_register_document,
//                             )}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline py-2.5 px-3.5 bg-blue-50 rounded-lg"
//                           >
//                             <MdDescription size={16} />
//                             {formValues.company_register_document
//                               .split("/")
//                               .pop()}
//                           </a>
//                         ) : (
//                           <ReadOnlyValue>No document</ReadOnlyValue>
//                         )}
//                       </div>
//                     </div>

//                     {/* ── GST Number (NEW) ── */}
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
//                       <div className="flex-1">
//                         <FieldLabel>GST Number</FieldLabel>
//                         <div className="flex items-center gap-2 text-sm text-slate-700 py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
//                           <MdReceiptLong size={16} className="text-slate-400" />
//                           {formValues.gst_number || "—"}
//                         </div>
//                       </div>
//                       <div className="flex-1">
//                         {/* Placeholder to keep alignment with other rows */}
//                       </div>
//                     </div>

//                     {/* ── PAN card ── */}
//                     <div className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-slate-100">
//                       <div className="flex-1">
//                         <FieldLabel>PAN card number</FieldLabel>
//                         <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
//                           <MdCreditCard size={16} className="text-slate-400" />
//                           {formValues.company_pan_card || "—"}
//                         </div>
//                       </div>
//                       <div>
//                         <FieldLabel>PAN card image</FieldLabel>
//                         {renderDocPreview(
//                           formValues.company_pan_card_image,
//                           "PAN card",
//                         )}
//                       </div>
//                     </div>

//                     {/* ── Owner Aadhar ── */}
//                     <div className="flex flex-col sm:flex-row gap-5">
//                       <div className="flex-1">
//                         <FieldLabel>Owner Aadhar number</FieldLabel>
//                         <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
//                           <MdPermIdentity
//                             size={16}
//                             className="text-slate-400"
//                           />
//                           {formValues.owner_adharcard || "—"}
//                         </div>
//                       </div>
//                       <div>
//                         <FieldLabel>Owner Aadhar image</FieldLabel>
//                         {renderDocPreview(
//                           formValues.owner_adharcard_image,
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
//                       <div className="flex flex-col items-start gap-3">
//                         <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
//                           {formValues.logo ? (
//                             <img
//                               src={
//                                 formValues.logo.startsWith("blob:")
//                                   ? formValues.logo
//                                   : getImageUrl(formValues.logo)
//                               }
//                               alt="Logo"
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.target.style.display = "none";
//                               }}
//                             />
//                           ) : (
//                             <MdApartment size={28} className="text-slate-300" />
//                           )}
//                         </div>
//                         <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
//                           <MdCloudUpload size={16} />
//                           {formValues.logo ? "Change logo" : "Upload logo"}
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => handleFileChange(e, "logo")}
//                             className="hidden"
//                           />
//                         </label>
//                       </div>
//                     </div>

//                     <div>
//                       <FieldLabel>Banner image</FieldLabel>
//                       <div className="flex flex-col items-start gap-3">
//                         <div className="w-full sm:w-64 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
//                           {formValues.banner_image ? (
//                             <img
//                               src={
//                                 formValues.banner_image.startsWith("blob:")
//                                   ? formValues.banner_image
//                                   : getImageUrl(formValues.banner_image)
//                               }
//                               alt="Banner"
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.target.style.display = "none";
//                               }}
//                             />
//                           ) : (
//                             <MdImage size={28} className="text-slate-300" />
//                           )}
//                         </div>
//                         <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
//                           <MdCloudUpload size={16} />
//                           {formValues.banner_image
//                             ? "Change banner"
//                             : "Upload banner"}
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) =>
//                               handleFileChange(e, "banner_image")
//                             }
//                             className="hidden"
//                           />
//                         </label>
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
//                         Score: {formValues.profile_completion}/100 · Last
//                         calculated{" "}
//                         {formValues.last_completion_calculated_at
//                           ? formatDate(
//                               parseApiDate(
//                                 formValues.last_completion_calculated_at,
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
//                             {formValues.created_by_name || "—"}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {formValues.created_at
//                               ? formatDate(formValues.created_at)
//                               : "—"}
//                           </p>
//                         </div>

//                         <div className="relative">
//                           <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
//                           <p className="text-sm font-semibold text-slate-700">
//                             Last updated
//                           </p>
//                           <p className="text-sm text-slate-500 mt-0.5">
//                             {formValues.updated_by_name || "—"}
//                           </p>
//                           <p className="text-xs text-slate-400 mt-0.5">
//                             {formValues.updated_at
//                               ? formatDate(formValues.updated_at)
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

//         {/* Mobile-only cancel button, since header hides it on small screens */}
//         <button
//           type="button"
//           onClick={() => navigate("/companies")}
//           className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
//         >
//           <MdCancel size={16} />
//           Cancel
//         </button>
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
//                     Delete company?
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
//                   <span className="font-medium text-slate-800">{heroName}</span>{" "}
//                   and its data. This action cannot be undone.
//                 </p>
//               </div>
//               <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-slate-100">
//                 <button
//                   onClick={() => setIsDeleteModalOpen(false)}
//                   disabled={deleteLoading}
//                   className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
//                 >
//                   Keep company
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   disabled={deleteLoading}
//                   className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
//                 >
//                   {deleteLoading && (
//                     <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
//                   )}
//                   {deleteLoading ? "Deleting..." : "Delete company"}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default EditCompany;

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "react-icons/md";
import companyService from "../../services/company.service";
import subIndustryService from "../../services/subIndustry.service";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { Editor } from "@tinymce/tinymce-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path}`;
};

// ─── Helper: Parse API date format "17/08/2026, 06:22:41 pm" ──
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

// ─── Company status options ──────────────────────────────────
const COMPANY_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "blocked", label: "Blocked" },
  { value: "pending", label: "Pending" },
];

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

// ─── Animated completion ring, shown in the hero ─────────────
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

// ─── Small reusable pieces ────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const RichTextEditorField = ({ value, onChange, height = 280 }) => {
  const [editorMode, setEditorMode] = useState("text");

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        {["text", "html"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setEditorMode(mode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              editorMode === mode
                ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {mode === "text" ? "Text" : "HTML"}
          </button>
        ))}
      </div>

      {editorMode === "text" ? (
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          value={value || ""}
          onEditorChange={(content) => onChange(content)}
          init={{
            height,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic underline forecolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | link image table | " +
              "removeformat code | help",
            content_style:
              "body { font-family:'Inter',sans-serif; font-size:14px }",
            image_advtab: true,
            images_upload_handler: (blobInfo) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject("Image upload failed");
                reader.readAsDataURL(blobInfo.blob());
              }),
          }}
        />
      ) : (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          className="w-full min-h-[280px] resize-y bg-slate-950 text-slate-100 p-3 font-mono text-xs leading-6 outline-none"
        />
      )}
    </div>
  );
};

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

const Toggle = ({ checked, onChange, name }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked || false}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
  </label>
);

const TABS = [
  { id: "overview", label: "Overview", icon: MdApartment },
  { id: "relations", label: "Relations", icon: MdCategory },
  { id: "documents", label: "Documents", icon: MdDescription },
  { id: "media", label: "Media", icon: MdImage },
  { id: "activity", label: "Activity", icon: MdHistory },
];

const EditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id || 1;

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [initialData, setInitialData] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  // ─── Dropdown data states ────────────────────────────────────
  const [companyUsers, setCompanyUsers] = useState([]);
  const [companySizes, setCompanySizes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [subIndustries, setSubIndustries] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const extractList = (response) => {
    let value = response;
    for (let depth = 0; depth < 4 && value; depth += 1) {
      if (Array.isArray(value)) return value;
      value = value.data || value.results || value.items;
    }
    return [];
  };

  const [userNameCache, setUserNameCache] = useState({});

  // ─── Load dropdown data ──────────────────────────────────────
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [usersRes, sizesRes, industriesRes, subIndustriesRes] =
          await Promise.all([
            companyService.getCompanyUsers(),
            companyService.getCompanySizes(),
            companyService.getIndustries(),
            subIndustryService.getAll(),
          ]);

        const sizes = extractList(sizesRes);
        const activeSizes = Array.isArray(sizes)
          ? sizes.filter(
              (s) =>
                s.is_status === true ||
                s.is_status === 1 ||
                s.is_status === "true",
            )
          : [];
        setCompanySizes(activeSizes.length > 0 ? activeSizes : sizes);

        setCompanyUsers(extractList(usersRes));
        setIndustries(extractList(industriesRes));
        setSubIndustries(extractList(subIndustriesRes));
      } catch (err) {
        console.error("Error loading dropdown data:", err);
        showError("Failed to load form data. Please refresh.");
      } finally {
        setLoadingData(false);
      }
    };
    loadDropdownData();
  }, []);

  // ─── Fetch users for name mapping ────────────────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await companyService.getUsers();
        const users = response?.data || response || [];
        const userMap = {};
        const userArray = Array.isArray(users) ? users : [];
        userArray.forEach((u) => {
          const userId = u.id || u.user_id || u.company_user_id;
          if (userId) {
            userMap[userId] =
              u.full_name ||
              u.company_user_name ||
              u.display_name ||
              u.name ||
              u.username ||
              u.email ||
              u.company_user_email ||
              `User ${userId}`;
          }
        });
        setUserNameCache(userMap);
      } catch (err) {
        console.warn("Could not fetch users for name mapping:", err.message);
      }
    };
    fetchUsers();
  }, []);

  // ─── Fetch company data ──────────────────────────────────────
  useEffect(() => {
    const fetchCompany = async () => {
      setFetchLoading(true);
      try {
        const response = await companyService.getById(id);
        const data = response?.data || response;

        if (data) {
          let createdByName = "-";
          let updatedByName = "-";

          if (data.created_by) {
            createdByName =
              userNameCache[data.created_by] ||
              data.CreatedBy?.name ||
              data.CreatedBy?.email ||
              `User ${data.created_by}`;
          }
          if (data.updated_by) {
            updatedByName =
              userNameCache[data.updated_by] ||
              data.UpdatedBy?.name ||
              data.UpdatedBy?.email ||
              `User ${data.updated_by}`;
          }

          const createdAtDate = data.created_at
            ? parseApiDate(data.created_at)
            : null;
          const updatedAtDate = data.updated_at
            ? parseApiDate(data.updated_at)
            : null;

          const formData = {
            id: data.id || "",
            company_name: data.company_name || "",
            profile_type: data.profile_type || "company",
            slug: data.slug || "",
            website: data.website || "",
            founded_year: data.founded_year || "",
            about_company: data.about_company || "",
            gst_number: data.gst_number || "",
            company_user_id: String(
              data.company_user_id || data.CompanyUser?.company_user_id || "",
            ),
            company_user_email:
              data.CompanyUser?.company_user_email ||
              data.CompanyUser?.email ||
              data.company_user_email ||
              "-",
            industry_id: String(
              data.industry_id ||
                data.Industries?.[0]?.industry_id ||
                data.Industry?.industry_id ||
                "",
            ),
            industry_name:
              data.Industries?.[0]?.industry_name ||
              data.Industry?.industry_name ||
              data.industry_name ||
              "-",
            sub_industry_id: String(
              data.sub_industry_id ||
                data.SubIndustries?.[0]?.sub_industry_id ||
                data.SubIndustry?.sub_industry_id ||
                "",
            ),
            sub_industry_name:
              data.SubIndustries?.[0]?.sub_industry_name ||
              data.SubIndustry?.sub_industry_name ||
              data.sub_industry_name ||
              "-",
            company_size_id: String(
              data.company_size_id || data.CompanySize?.company_size_id || "",
            ),
            company_size_name:
              data.CompanySize?.company_size_name ||
              data.company_size_name ||
              "-",
            logo: data.logo || null,
            banner_image: data.banner_image || null,
            company_status: data.company_status || "active",
            is_status: data.is_status ? "active" : "inactive",
            is_trending: data.is_trending || false,
            profile_completion: data.profile_completion || 0,
            profile_completion_percentage:
              data.profile_completion_percentage || 0,
            last_completion_calculated_at:
              data.last_completion_calculated_at || null,
            company_register_document_type:
              data.company_register_document_type || "-",
            company_register_document: data.company_register_document || null,
            company_pan_card: data.company_pan_card || "-",
            company_pan_card_image: data.company_pan_card_image || null,
            owner_adharcard: data.owner_adharcard || "-",
            owner_adharcard_image: data.owner_adharcard_image || null,
            created_by: data.created_by,
            created_by_name: createdByName,
            created_at: createdAtDate,
            updated_by: data.updated_by,
            updated_by_name: updatedByName,
            updated_at: updatedAtDate,
          };

          setInitialData(formData);
          setEditItem(data);
        } else {
          showError("Company not found");
          navigate("/companies");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load company data");
        navigate("/companies");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id, navigate, userNameCache]);

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState(initialData || {});
  const [fileLogo, setFileLogo] = useState(null);
  const [fileBanner, setFileBanner] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormValues(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (field === "logo") {
        setFileLogo(file);
        setFormValues((prev) => ({ ...prev, logo: URL.createObjectURL(file) }));
      } else if (field === "banner_image") {
        setFileBanner(file);
        setFormValues((prev) => ({
          ...prev,
          banner_image: URL.createObjectURL(file),
        }));
      }
    }
  };

  // ─── Dropdown options ────────────────────────────────────────
  const sizeOptions = companySizes.map((s) => ({
    value: String(s.id || s.company_size_id),
    label: s.name || s.company_size_name || `Size ${s.id || s.company_size_id}`,
  }));

  const industryOptions = industries.map((ind) => ({
    value: String(ind.id || ind.industry_id),
    label:
      ind.name || ind.industry_name || `Industry ${ind.id || ind.industry_id}`,
  }));

  const subIndustryOptions = subIndustries.map((sub) => ({
    value: String(sub.id || sub.sub_industry_id),
    label:
      sub.name ||
      sub.sub_industry_name ||
      `Sub-industry ${sub.id || sub.sub_industry_id}`,
  }));

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    if (!formValues.company_name?.trim()) {
      showError("Company name is required");
      return false;
    }
    if (formValues.company_name.trim().length < 2) {
      showError("Company name must be at least 2 characters");
      return false;
    }
    if (formValues.company_name.trim().length > 100) {
      showError("Company name must be at most 100 characters");
      return false;
    }
    if (
      formValues.website &&
      !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
        formValues.website,
      )
    ) {
      showError("Please enter a valid URL");
      return false;
    }
    if (formValues.founded_year) {
      const year = parseInt(formValues.founded_year);
      if (year < 1900 || year > new Date().getFullYear()) {
        showError(
          `Founded year must be between 1900 and ${new Date().getFullYear()}`,
        );
        return false;
      }
    }
    if (!formValues.company_status) {
      showError("Company status is required");
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
      const payload = new FormData();
      payload.append("company_name", formValues.company_name.trim());
      payload.append(
        "slug",
        formValues.slug.trim() ||
          formValues.company_name.trim().toLowerCase().replace(/\s+/g, "-"),
      );
      payload.append("website", formValues.website?.trim() || "");
      payload.append("founded_year", formValues.founded_year || "");
      payload.append("about_company", formValues.about_company?.trim() || "");
      payload.append("gst_number", formValues.gst_number?.trim() || "");
      payload.append("company_status", formValues.company_status);
      payload.append(
        "is_status",
        formValues.is_status === "active" ? "true" : "false",
      );
      payload.append("is_trending", formValues.is_trending ? "true" : "false");
      payload.append("updated_by", userId);

      // company_user_id is NOT sent because it's read-only - we do not include it.
      // if (formValues.company_user_id) {
      //   payload.append("company_user_id", formValues.company_user_id);
      // }
      if (formValues.company_size_id) {
        payload.append("company_size_id", formValues.company_size_id);
      }
      if (formValues.industry_id) {
        payload.append("industry_id", formValues.industry_id);
      }
      if (formValues.sub_industry_id) {
        payload.append("sub_industry_id", formValues.sub_industry_id);
      }

      if (fileLogo instanceof File) {
        payload.append("logo", fileLogo);
      }
      if (fileBanner instanceof File) {
        payload.append("banner_image", fileBanner);
      }

      await companyService.update(id, payload);
      showSuccess("Company updated successfully");
      navigate("/companies");
    } catch (error) {
      console.error("Submit error:", error);
      showError(error.message || "Failed to update company");
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await companyService.delete(id);
      showSuccess("Company deleted successfully");
      navigate("/companies");
    } catch (error) {
      console.error("Delete error:", error);
      showError(error.message || "Failed to delete company");
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  // ─── Loading state ─────────────────────────────────────────────
  if (fetchLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
          <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Company not found</p>
          <p className="text-sm text-slate-400 mt-1">
            It may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate("/companies")}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MdArrowBack size={16} />
            Back to companies
          </button>
        </div>
      </div>
    );
  }

  const renderDocPreview = (path, alt, size = "w-28 h-20") => {
    if (!path)
      return (
        <div
          className={`${size} rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400`}
        >
          No image
        </div>
      );
    return (
      <div className={`relative group ${size} flex-shrink-0`}>
        <img
          src={path.startsWith("blob:") ? path : getImageUrl(path)}
          alt={alt}
          className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <button
          type="button"
          onClick={() =>
            window.open(
              path.startsWith("blob:") ? path : getImageUrl(path),
              "_blank",
            )
          }
          className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <span className="text-white text-xs font-medium flex items-center gap-1">
            <MdOpenInNew size={13} /> View
          </span>
        </button>
      </div>
    );
  };

  const completionPct = parseInt(formValues.profile_completion_percentage) || 0;
  const heroName = formValues.company_name?.trim() || "Unnamed Company";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen pb-16">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200">
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
            {/* <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete company"
              title="Delete company"
            >
              <MdDelete size={19} />
            </button> */}
            {/* <button
              type="button"
              onClick={() => navigate("/companies")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdCancel size={16} />
              Cancel
            </button> */}
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
              {loading ? "Saving..." : "Save changes"}
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
            {formValues.banner_image ? (
              <img
                src={
                  formValues.banner_image.startsWith("blob:")
                    ? formValues.banner_image
                    : getImageUrl(formValues.banner_image)
                }
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
                {formValues.logo ? (
                  <img
                    src={
                      formValues.logo.startsWith("blob:")
                        ? formValues.logo
                        : getImageUrl(formValues.logo)
                    }
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
                  {formValues.is_trending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdWhatshot size={12} />
                      Trending
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <StatusPill status={formValues.company_status} />
                  <span className="text-xs text-white/70 capitalize">
                    {formValues.profile_type || "company"}
                  </span>
                  {formValues.website && (
                    <a
                      href={
                        formValues.website.startsWith("http")
                          ? formValues.website
                          : `https://${formValues.website}`
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

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <HeroStat
            icon={MdCategory}
            label="Industry"
            value={formValues.industry_name}
          />
          <HeroStat
            icon={MdGroups}
            label="Company size"
            value={formValues.company_size_name}
          />
          <HeroStat
            icon={MdCalendarToday}
            label="Founded"
            value={formValues.founded_year}
          />
          <HeroStat
            icon={MdReceiptLong}
            label="GST number"
            value={formValues.gst_number}
          />
        </div> */}

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
                      layoutId="edit-company-tab-underline"
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
                {/* ─── OVERVIEW ─────────────────────────────────── */}
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <FieldLabel required>Company name</FieldLabel>
                        <input
                          type="text"
                          name="company_name"
                          value={formValues.company_name || ""}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                          placeholder="e.g. Acme Corp"
                          required
                        />
                      </div>

                      <div>
                        <FieldLabel>Slug (URL identifier)</FieldLabel>
                        <input
                          type="text"
                          name="slug"
                          value={formValues.slug || ""}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                          placeholder="auto-generated if empty"
                        />
                      </div>

                      <div>
                        <FieldLabel>Website</FieldLabel>
                        <input
                          type="url"
                          name="website"
                          value={formValues.website || ""}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <FieldLabel>Founded year</FieldLabel>
                        <input
                          type="number"
                          name="founded_year"
                          value={formValues.founded_year || ""}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                          placeholder="2020"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>

                      <div>
                        <FieldLabel>GST number</FieldLabel>
                        <input
                          type="text"
                          name="gst_number"
                          value={formValues.gst_number || ""}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                          placeholder="e.g. 24ABCDE1234F1Z5"
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel>About company</FieldLabel>
                      <RichTextEditorField
                        value={formValues.about_company || ""}
                        onChange={(content) =>
                          setFormValues((prev) => ({
                            ...prev,
                            about_company: content,
                          }))
                        }
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel required>Company status</FieldLabel>
                        <select
                          name="company_status"
                          value={formValues.company_status || "active"}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                        >
                          {COMPANY_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <FieldLabel>Trending</FieldLabel>
                        <div className="flex items-center gap-3 pt-1.5">
                          <Toggle
                            name="is_trending"
                            checked={formValues.is_trending}
                            onChange={handleInputChange}
                          />
                          <span className="text-sm text-slate-600">
                            {formValues.is_trending
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
                        {formValues.company_user_email || "—"}
                        <span className="ml-auto text-[11px] text-slate-400">
                          Read-only
                        </span>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Industry</FieldLabel>
                      <select
                        name="industry_id"
                        value={formValues.industry_id || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                        disabled={loadingData}
                      >
                        <option value="">
                          {loadingData ? "Loading..." : "Select an industry"}
                        </option>
                        {industryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FieldLabel>Sub-industry</FieldLabel>
                      <select
                        name="sub_industry_id"
                        value={formValues.sub_industry_id || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                        disabled={loadingData}
                      >
                        <option value="">
                          {loadingData ? "Loading..." : "Select a sub-industry"}
                        </option>
                        {subIndustryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FieldLabel>Company size</FieldLabel>
                      <select
                        name="company_size_id"
                        value={formValues.company_size_id || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                        disabled={loadingData}
                      >
                        <option value="">
                          {loadingData ? "Loading..." : "Select a company size"}
                        </option>
                        {sizeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* ─── DOCUMENTS ────────────────────────────────── */}
                {activeTab === "documents" && (
                  <div className="space-y-6">
                    {/* ── Registration document ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
                      <div className="flex-1">
                        <FieldLabel>Registration document type</FieldLabel>
                        <ReadOnlyValue>
                          {formValues.company_register_document_type}
                        </ReadOnlyValue>
                      </div>
                      <div className="flex-1">
                        <FieldLabel>Registration document</FieldLabel>
                        {formValues.company_register_document ? (
                          <a
                            href={getImageUrl(
                              formValues.company_register_document,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline py-2.5 px-3.5 bg-blue-50 rounded-lg"
                          >
                            <MdDescription size={16} />
                            {formValues.company_register_document
                              .split("/")
                              .pop()}
                          </a>
                        ) : (
                          <ReadOnlyValue>No document</ReadOnlyValue>
                        )}
                      </div>
                    </div>

                    {/* ── GST Number (NEW) ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-slate-100">
                      <div className="flex-1">
                        <FieldLabel>GST Number</FieldLabel>
                        <div className="flex items-center gap-2 text-sm text-slate-700 py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
                          <MdReceiptLong size={16} className="text-slate-400" />
                          {formValues.gst_number || "—"}
                        </div>
                      </div>
                      <div className="flex-1">
                        {/* Placeholder to keep alignment with other rows */}
                      </div>
                    </div>

                    {/* ── PAN card ── */}
                    <div className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-slate-100">
                      <div className="flex-1">
                        <FieldLabel>PAN card number</FieldLabel>
                        <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                          <MdCreditCard size={16} className="text-slate-400" />
                          {formValues.company_pan_card || "—"}
                        </div>
                      </div>
                      <div>
                        <FieldLabel>PAN card image</FieldLabel>
                        {renderDocPreview(
                          formValues.company_pan_card_image,
                          "PAN card",
                        )}
                      </div>
                    </div>

                    {/* ── Owner Aadhar ── */}
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-1">
                        <FieldLabel>Owner Aadhar number</FieldLabel>
                        <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                          <MdPermIdentity
                            size={16}
                            className="text-slate-400"
                          />
                          {formValues.owner_adharcard || "—"}
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Owner Aadhar image</FieldLabel>
                        {renderDocPreview(
                          formValues.owner_adharcard_image,
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
                      <div className="flex flex-col items-start gap-3">
                        <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                          {formValues.logo ? (
                            <img
                              src={
                                formValues.logo.startsWith("blob:")
                                  ? formValues.logo
                                  : getImageUrl(formValues.logo)
                              }
                              alt="Logo"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <MdApartment size={28} className="text-slate-300" />
                          )}
                        </div>
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                          <MdCloudUpload size={16} />
                          {formValues.logo ? "Change logo" : "Upload logo"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "logo")}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Banner image</FieldLabel>
                      <div className="flex flex-col items-start gap-3">
                        <div className="w-full sm:w-64 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                          {formValues.banner_image ? (
                            <img
                              src={
                                formValues.banner_image.startsWith("blob:")
                                  ? formValues.banner_image
                                  : getImageUrl(formValues.banner_image)
                              }
                              alt="Banner"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <MdImage size={28} className="text-slate-300" />
                          )}
                        </div>
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                          <MdCloudUpload size={16} />
                          {formValues.banner_image
                            ? "Change banner"
                            : "Upload banner"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, "banner_image")
                            }
                            className="hidden"
                          />
                        </label>
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
                        Score: {formValues.profile_completion}/100 · Last
                        calculated{" "}
                        {formValues.last_completion_calculated_at
                          ? formatDate(
                              parseApiDate(
                                formValues.last_completion_calculated_at,
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
                            {formValues.created_by_name || "—"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formValues.created_at
                              ? formatDate(formValues.created_at)
                              : "—"}
                          </p>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                          <p className="text-sm font-semibold text-slate-700">
                            Last updated
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {formValues.updated_by_name || "—"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formValues.updated_at
                              ? formatDate(formValues.updated_at)
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

        {/* Mobile-only cancel button, since header hides it on small screens */}
        <button
          type="button"
          onClick={() => navigate("/companies")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
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
                  <h3 className="text-base font-semibold text-slate-800">
                    Delete company?
                  </h3>
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
                  This will permanently remove{" "}
                  <span className="font-medium text-slate-800">{heroName}</span>{" "}
                  and its data. This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-slate-100">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleteLoading}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Keep company
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deleteLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  {deleteLoading ? "Deleting..." : "Delete company"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditCompany;
