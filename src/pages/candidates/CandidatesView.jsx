// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MdArrowBack,
//   MdPerson,
//   MdEmail,
//   MdPhone,
//   MdCalendarToday,
//   MdWork,
//   MdSchool,
//   MdVerified,
//   MdLink,
//   MdEmojiEvents,
//   MdDescription,
//   MdLocationOn,
//   MdBusiness,
//   MdBook,
//   MdTrendingUp,
//   MdStar,
//   MdCheckCircle,
//   MdErrorOutline,
//   MdPauseCircle,
//   MdBlock,
//   MdOpenInNew,
//   MdHistory,
//   MdCategory,
//   MdGroups,
// } from "react-icons/md";
// import candidateService from "../../services/candidate.service";
// import { showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// // ─── Helpers ──────────────────────────────────────────────────
// const getFullImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:image")) return path;
//   if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
//   if (path.startsWith("./uploads/")) return `${API_BASE_URL}${path.substring(1)}`;
//   if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
//   if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
//   return `${API_BASE_URL}/uploads/${path}`;
// };

// // ─── FIX: Resume URL builder ─────────────────────────────────
// // Handles bare filenames, full URLs, and relative paths.
// // Always points to /uploads/ (not /uploads/resumes/)
// const getResumeUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http://") || path.startsWith("https://")) return path;
//   if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
//   if (path.startsWith("./uploads/")) return `${API_BASE_URL}${path.substring(1)}`;
//   if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
//   // Default: treat as a bare filename inside /uploads/
//   return `${API_BASE_URL}/uploads/${encodeURIComponent(path)}`;
// };

// // ─── Status styles ─────────────────────────────────────────────
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

// // ─── Animated completion ring ────────────────────────────────
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

// // ─── Shared small pieces ─────────────────────────────────────
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

// const TagList = ({ items, color = "blue" }) => {
//   if (!items || items.length === 0) return <span className="text-slate-400 text-sm">—</span>;
//   const colorClasses = {
//     blue: "bg-blue-50 text-blue-700 border-blue-200",
//     green: "bg-green-50 text-green-700 border-green-200",
//     purple: "bg-purple-50 text-purple-700 border-purple-200",
//     amber: "bg-amber-50 text-amber-700 border-amber-200",
//     red: "bg-red-50 text-red-700 border-red-200",
//     indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
//   };
//   const dotColors = {
//     blue: "bg-blue-500",
//     green: "bg-green-500",
//     purple: "bg-purple-500",
//     amber: "bg-amber-500",
//     red: "bg-red-500",
//     indigo: "bg-indigo-500",
//   };
//   const cls = colorClasses[color] || colorClasses.blue;
//   const dotCls = dotColors[color] || dotColors.blue;
//   return (
//     <div className="flex flex-wrap gap-2">
//       {items.map((item, idx) => (
//         <span
//           key={idx}
//           className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cls}`}
//         >
//           <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
//           {typeof item === "string" ? item : item.name || item.label || item}
//         </span>
//       ))}
//     </div>
//   );
// };

// // ─── Tabs ──────────────────────────────────────────────────────
// const TABS = [
//   { id: "overview", label: "Overview", icon: MdPerson },
//   { id: "professional", label: "Professional", icon: MdBusiness }, // combines Experience, Education, Skills
//   { id: "preferences", label: "Preferences", icon: MdTrendingUp },
//   { id: "documents", label: "Documents", icon: MdDescription },
//   { id: "activity", label: "Activity", icon: MdHistory },
// ];

// // ─── Main Component ──────────────────────────────────────────
// const CandidateView = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});
//   const [activeTab, setActiveTab] = useState("overview");

//   // Load users for audit names
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((uid) => {
//           userMap[uid] = users[uid].name;
//         });
//         setUserNameCache(userMap);
//       } catch (error) {
//         console.error("Failed to load users:", error);
//       }
//     };
//     loadUsers();
//   }, []);

//   const getUserNameCached = (userId) => {
//     if (!userId) return "—";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // Fetch full candidate profile
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         const response = await candidateService.getFullProfile(id);
//         const data = response?.data?.data || response?.data;
//         if (data) {
//           setProfile({
//             ...data,
//             candidate_skills: Array.isArray(data.candidate_skills)
//               ? data.candidate_skills
//               : data.candidate_skills
//                 ? [data.candidate_skills]
//                 : [],
//             candidate_education: Array.isArray(data.candidate_education)
//               ? data.candidate_education
//               : data.candidate_education
//                 ? [data.candidate_education]
//                 : [],
//             candidate_experience: Array.isArray(data.candidate_experience)
//               ? data.candidate_experience
//               : data.candidate_experience
//                 ? [data.candidate_experience]
//                 : [],
//             candidate_certification: Array.isArray(data.candidate_certification)
//               ? data.candidate_certification
//               : data.candidate_certification
//                 ? [data.candidate_certification]
//                 : [],
//             candidate_awards: Array.isArray(data.candidate_awards)
//               ? data.candidate_awards
//               : data.candidate_awards
//                 ? [data.candidate_awards]
//                 : [],
//             candidate_social_links: Array.isArray(data.candidate_social_links)
//               ? data.candidate_social_links
//               : data.candidate_social_links
//                 ? [data.candidate_social_links]
//                 : [],
//             candidate_projects: Array.isArray(data.candidate_projects)
//               ? data.candidate_projects
//               : data.candidate_projects
//                 ? [data.candidate_projects]
//                 : [],
//           });
//         } else {
//           showError("Candidate not found");
//           navigate("/candidates");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.response?.data?.message || "Failed to load candidate profile");
//         navigate("/candidates");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, navigate]);

//   const handleBack = () => {
//     navigate("/candidates");
//   };

//   // Calculate total experience
//   const calculateTotalExperience = () => {
//     if (!profile?.candidate_experience || profile.candidate_experience.length === 0) return null;
//     let totalMonths = 0;
//     profile.candidate_experience.forEach((exp) => {
//       if (exp.start_date) {
//         const start = new Date(exp.start_date);
//         const end = exp.is_current_company
//           ? new Date()
//           : exp.end_date
//             ? new Date(exp.end_date)
//             : new Date();
//         const diffMonths =
//           (end.getFullYear() - start.getFullYear()) * 12 +
//           (end.getMonth() - start.getMonth());
//         totalMonths += Math.max(0, diffMonths);
//       }
//     });
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;
//     if (years === 0 && months === 0) return null;
//     if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
//     if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
//     return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-slate-400">Loading candidate profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
//         <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
//           <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
//           <p className="text-slate-600 font-medium">Candidate not found</p>
//           <button
//             onClick={handleBack}
//             className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//           >
//             <MdArrowBack size={16} />
//             Back to candidates
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const {
//     candidate,
//     candidate_profiles,
//     candidate_resumes,
//     candidate_skills,
//     candidate_education,
//     candidate_experience,
//     candidate_preferences,
//     candidate_certification,
//     candidate_awards,
//     candidate_social_links,
//     candidate_projects,
//   } = profile;

//   const totalExperience = calculateTotalExperience();
//   const fullName = `${candidate?.first_name || ""} ${candidate?.last_name || ""}`.trim() || "Unnamed Candidate";
//   const initials = fullName
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0]?.toUpperCase())
//     .join("");

//   const completionPct = parseInt(candidate_profiles?.profile_completion_percentage) || 0;
//   const status = candidate?.status || "pending";

//   // ─── Render tab content ──────────────────────────────────────
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return (
//           <div className="space-y-6">
//             {/* About */}
//             {candidate_profiles?.career_summary && (
//               <div>
//                 <FieldLabel>About</FieldLabel>
//                 <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
//                   {candidate_profiles.career_summary}
//                 </div>
//               </div>
//             )}

//             {/* Personal Details */}
//             <div>
//               <FieldLabel>Personal Details</FieldLabel>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-lg border border-slate-200 p-4">
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Gender</span>
//                   <p className="text-sm text-slate-700">
//                     {candidate_profiles?.gender ? candidate_profiles.gender.charAt(0).toUpperCase() + candidate_profiles.gender.slice(1) : "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Marital Status</span>
//                   <p className="text-sm text-slate-700">
//                     {candidate_profiles?.marital_status ? candidate_profiles.marital_status.charAt(0).toUpperCase() + candidate_profiles.marital_status.slice(1) : "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Nationality</span>
//                   <p className="text-sm text-slate-700">{candidate_profiles?.nationality || "—"}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Date of Birth</span>
//                   <p className="text-sm text-slate-700">{candidate_profiles?.dob ? formatDate(candidate_profiles.dob) : "—"}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Current City</span>
//                   <p className="text-sm text-slate-700">{candidate_profiles?.City?.name || "—"}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Current Address</span>
//                   <p className="text-sm text-slate-700">{candidate_profiles?.current_address || "—"}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Pincode</span>
//                   <p className="text-sm text-slate-700">{candidate_profiles?.pincode || "—"}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Willing to Relocate</span>
//                   <p className="text-sm text-slate-700">{candidate_profiles?.willing_to_relocate ? "Yes" : "No"}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Notice Period</span>
//                   <p className="text-sm text-slate-700">{candidate_profiles?.NoticePeriod?.name || "—"}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-slate-500">Total Experience</span>
//                   <p className="text-sm text-slate-700">{totalExperience || "—"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Social Links */}
//             {candidate_social_links && candidate_social_links.length > 0 && (
//               <div>
//                 <FieldLabel>Social Links</FieldLabel>
//                 <div className="flex flex-wrap gap-3">
//                   {candidate_social_links.map((link, idx) => (
//                     <a
//                       key={idx}
//                       href={link.social_url?.startsWith("http") ? link.social_url : `https://${link.social_url}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
//                     >
//                       <MdLink size={14} />
//                       {link.social_type?.charAt(0).toUpperCase() + link.social_type?.slice(1)}
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       case "professional":
//         return (
//           <div className="space-y-8">
//             {/* ─── Experience ─── */}
//             <div>
//               <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
//                 <MdBusiness size={18} className="text-blue-600" />
//                 Experience
//               </h3>
//               {!candidate_experience || candidate_experience.length === 0 ? (
//                 <p className="text-slate-400 text-sm">No experience entries.</p>
//               ) : (
//                 <div className="space-y-6">
//                   {candidate_experience.map((exp, idx) => (
//                     <div key={idx} className={`pb-6 ${idx < candidate_experience.length - 1 ? "border-b border-slate-200" : ""}`}>
//                       <div className="flex flex-wrap items-start justify-between gap-2">
//                         <div>
//                           <h4 className="text-base font-semibold text-slate-800">{exp.job_title || exp.designation}</h4>
//                           <p className="text-sm text-slate-600 font-medium">{exp.company_name}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           {exp.is_current_company && (
//                             <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
//                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//                               Current
//                             </span>
//                           )}
//                           <span className="text-xs text-slate-400">
//                             {exp.start_date ? formatDate(exp.start_date) : "—"} —{" "}
//                             {exp.is_current_company ? "Present" : exp.end_date ? formatDate(exp.end_date) : "—"}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {exp.Industry?.name && (
//                           <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Industry: {exp.Industry.name}</span>
//                         )}
//                         {exp.WorkplaceType?.name && (
//                           <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Workplace: {exp.WorkplaceType.name}</span>
//                         )}
//                         {exp.jobType?.name && (
//                           <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Job Type: {exp.jobType.name}</span>
//                         )}
//                         {exp.salary && (
//                           <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Salary: ₹{parseFloat(exp.salary).toLocaleString()}</span>
//                         )}
//                       </div>
//                       {exp.job_description && (
//                         <p className="mt-2 text-sm text-slate-600 leading-relaxed">{exp.job_description}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* ─── Education ─── */}
//             <div>
//               <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
//                 <MdSchool size={18} className="text-blue-600" />
//                 Education
//               </h3>
//               {!candidate_education || candidate_education.length === 0 ? (
//                 <p className="text-slate-400 text-sm">No education entries.</p>
//               ) : (
//                 <div className="space-y-6">
//                   {candidate_education.map((edu, idx) => (
//                     <div key={idx} className={`pb-6 ${idx < candidate_education.length - 1 ? "border-b border-slate-200" : ""}`}>
//                       <div className="flex flex-wrap items-start justify-between gap-2">
//                         <div>
//                           <h4 className="text-base font-semibold text-slate-800">{edu.EducationSubCategory?.name || "Education"}</h4>
//                           <p className="text-sm text-slate-600">{edu.college_name}</p>
//                         </div>
//                         <span className="text-xs text-slate-400">{edu.passing_year || "—"}</span>
//                       </div>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {edu.EducationCategory?.name && (
//                           <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Category: {edu.EducationCategory.name}</span>
//                         )}
//                         {edu.percentage && (
//                           <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Percentage: {edu.percentage}%</span>
//                         )}
//                         {edu.education_type && (
//                           <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Type: {edu.education_type}</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* ─── Skills ─── */}
//             <div>
//               <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
//                 <MdWork size={18} className="text-blue-600" />
//                 Skills
//               </h3>
//               {!candidate_skills || candidate_skills.length === 0 ? (
//                 <p className="text-slate-400 text-sm">No skills listed.</p>
//               ) : (
//                 <TagList
//                   items={candidate_skills.map((s) => s.Skill?.skill_name || s.skill_id)}
//                   color="blue"
//                 />
//               )}
//             </div>
//           </div>
//         );

//       case "preferences":
//         if (!candidate_preferences) {
//           return <p className="text-slate-400 text-sm">No preferences set.</p>;
//         }
//         return (
//           <div className="space-y-5">
//             {candidate_preferences.preferred_salary && (
//               <div>
//                 <FieldLabel>Preferred Salary</FieldLabel>
//                 <ReadOnlyValue>₹{parseFloat(candidate_preferences.preferred_salary).toLocaleString()}</ReadOnlyValue>
//               </div>
//             )}
//             {candidate_preferences.preferred_industries?.length > 0 && (
//               <div>
//                 <FieldLabel>Preferred Industries</FieldLabel>
//                 <TagList items={candidate_preferences.preferred_industries.map((i) => i.name)} color="green" />
//               </div>
//             )}
//             {candidate_preferences.preferred_cities?.length > 0 && (
//               <div>
//                 <FieldLabel>Preferred Cities</FieldLabel>
//                 <TagList items={candidate_preferences.preferred_cities.map((c) => c.name)} color="purple" />
//               </div>
//             )}
//             {candidate_preferences.preferred_workplace_types?.length > 0 && (
//               <div>
//                 <FieldLabel>Preferred Workplace Types</FieldLabel>
//                 <TagList items={candidate_preferences.preferred_workplace_types.map((w) => w.name)} color="amber" />
//               </div>
//             )}
//           </div>
//         );

//       case "documents":
//         return (
//           <div className="space-y-6">
//             {/* Resume */}
//             {candidate_resumes?.resume_file ? (
//               <div>
//                 <FieldLabel>Resume</FieldLabel>
//                 <a
//                   href={getResumeUrl(candidate_resumes.resume_file)}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 px-4 py-2 bg-[#2c0eee] text-white rounded-lg hover:bg-[#1a0b9e] transition-colors"
//                 >
//                   <MdDescription size={18} />
//                   {candidate_resumes.resume_title || "Download Resume"}
//                   <MdOpenInNew size={14} />
//                 </a>
//               </div>
//             ) : (
//               <div>
//                 <FieldLabel>Resume</FieldLabel>
//                 <p className="text-slate-400 text-sm">No resume uploaded.</p>
//               </div>
//             )}

//             {/* Certifications */}
//             {candidate_certification?.length > 0 && (
//               <div>
//                 <FieldLabel>Certifications</FieldLabel>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {candidate_certification.map((cert, idx) => (
//                     <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
//                       <p className="font-medium text-slate-800">{cert.certificate_name}</p>
//                       <p className="text-sm text-slate-500">Issuer: {cert.issuer || "—"}</p>
//                       <p className="text-xs text-slate-400">
//                         Issue Date: {cert.issue_date ? formatDate(cert.issue_date) : "—"}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Awards */}
//             {candidate_awards?.length > 0 && (
//               <div>
//                 <FieldLabel>Awards</FieldLabel>
//                 <div className="space-y-3">
//                   {candidate_awards.map((award, idx) => (
//                     <div key={idx} className="p-4 bg-amber-50 rounded-lg border border-amber-100">
//                       <p className="font-medium text-slate-800">{award.title}</p>
//                       {award.description && (
//                         <p className="text-sm text-slate-600 mt-1">{award.description}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Projects */}
//             {candidate_projects?.length > 0 && (
//               <div>
//                 <FieldLabel>Projects</FieldLabel>
//                 <div className="space-y-6">
//                   {candidate_projects.map((project, idx) => (
//                     <div key={idx} className="pb-6 border-b border-slate-200 last:border-0">
//                       <div className="flex flex-wrap items-start justify-between gap-2">
//                         <div>
//                           <h3 className="text-base font-semibold text-slate-800">{project.project_title}</h3>
//                           <p className="text-sm text-slate-600">Role: {project.candidate_role}</p>
//                         </div>
//                         {project.team_size && (
//                           <span className="text-xs text-slate-400">Team Size: {project.team_size}</span>
//                         )}
//                       </div>
//                       {project.client_name && (
//                         <p className="text-sm text-slate-500 mt-1">Client: {project.client_name}</p>
//                       )}
//                       {project.technologies_used && (
//                         <p className="text-sm text-slate-500">Technologies: {project.technologies_used}</p>
//                       )}
//                       {project.project_description && (
//                         <p className="mt-2 text-sm text-slate-600 leading-relaxed">{project.project_description}</p>
//                       )}
//                       {project.project_url && (
//                         <a
//                           href={project.project_url.startsWith("http") ? project.project_url : `https://${project.project_url}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-block mt-2 text-blue-600 hover:underline text-sm"
//                         >
//                           View Project →
//                         </a>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       case "activity":
//         return (
//           <div className="space-y-6">
//             <div>
//               <FieldLabel>Profile Completion</FieldLabel>
//               <div className="flex items-center gap-4 mb-1">
//                 <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${completionPct}%` }}
//                     transition={{ duration: 0.8, ease: "easeOut" }}
//                     className={`h-full rounded-full ${
//                       completionPct === 100
//                         ? "bg-emerald-500"
//                         : completionPct >= 50
//                           ? "bg-blue-500"
//                           : "bg-amber-500"
//                     }`}
//                   />
//                 </div>
//                 <span className="text-sm font-semibold text-slate-700 w-12 text-right">{completionPct}%</span>
//               </div>
//               <p className="text-xs text-slate-400">
//                 Last calculated{" "}
//                 {candidate_profiles?.last_completion_calculated_at
//                   ? formatDate(candidate_profiles.last_completion_calculated_at)
//                   : "—"}
//               </p>
//             </div>

//             <div className="border-t border-slate-100 pt-5">
//               <div className="relative pl-6">
//                 <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
//                 <div className="relative pb-6">
//                   <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
//                   <p className="text-sm font-semibold text-slate-700">Created</p>
//                   <p className="text-sm text-slate-500 mt-0.5">
//                     {candidate?.created_by ? getUserNameCached(candidate.created_by) : "System"}
//                   </p>
//                   <p className="text-xs text-slate-400 mt-0.5">
//                     {candidate?.createdAt ? formatDate(candidate.createdAt) : "—"}
//                   </p>
//                 </div>
//                 <div className="relative">
//                   <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
//                   <p className="text-sm font-semibold text-slate-700">Last updated</p>
//                   <p className="text-sm text-slate-500 mt-0.5">
//                     {candidate?.updated_by ? getUserNameCached(candidate.updated_by) : "—"}
//                   </p>
//                   <p className="text-xs text-slate-400 mt-0.5">
//                     {candidate_profiles?.updated_at ? formatDate(candidate_profiles.updated_at) : "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   // ─── Render ──────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen pb-16">
//       {/* ─── Sticky action bar ─────────────────────────────────── */}
//       <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3 min-w-0">
//             <button
//               onClick={handleBack}
//               className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
//               aria-label="Back"
//             >
//               <MdArrowBack size={19} className="text-slate-600" />
//             </button>
//             <div className="min-w-0">
//               <p className="text-[11px] text-slate-400 leading-tight">Candidates</p>
//               <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
//                 {fullName}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
//             >
//               Back
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
//             {candidate_profiles?.banner_image ? (
//               <img
//                 src={getFullImageUrl(candidate_profiles.banner_image)}
//                 alt="Banner"
//                 className="w-full h-full object-cover"
//                 onError={(e) => { e.target.style.display = "none"; }}
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
//             )}
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
//           </div>

//           <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
//             <div className="flex flex-col sm:flex-row sm:items-end gap-4">
//               {/* Avatar */}
//               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
//                 {candidate_profiles?.profile_photo ? (
//                   <img
//                     src={getFullImageUrl(candidate_profiles.profile_photo)}
//                     alt={fullName}
//                     className="w-full h-full object-cover rounded-xl"
//                     onError={(e) => { e.target.style.display = "none"; }}
//                   />
//                 ) : (
//                   <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
//                     {initials || <MdPerson size={22} />}
//                   </div>
//                 )}
//               </div>

//               {/* Name + chips */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
//                     {fullName}
//                   </h1>
//                   {candidate_profiles?.headline && (
//                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-400/20 text-blue-300 ring-1 ring-blue-400/30">
//                       {candidate_profiles.headline}
//                     </span>
//                   )}
//                 </div>
//                 <div className="mt-2 flex items-center gap-2 flex-wrap">
//                   <StatusPill status={status} />
//                   {candidate?.email && (
//                     <span className="text-xs text-white/70 flex items-center gap-1">
//                       <MdEmail size={12} /> {candidate.email}
//                     </span>
//                   )}
//                   {candidate?.mobile && (
//                     <span className="text-xs text-white/70 flex items-center gap-1">
//                       <MdPhone size={12} /> {candidate.mobile}
//                     </span>
//                   )}
//                   {candidate_profiles?.City?.name && (
//                     <span className="text-xs text-white/70 flex items-center gap-1">
//                       <MdLocationOn size={12} /> {candidate_profiles.City.name}
//                     </span>
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
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
//           <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
//             <MdWork size={16} className="text-slate-400 flex-shrink-0" />
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-500 leading-tight">Experience</p>
//               <p className="text-sm font-semibold text-slate-700 truncate">{totalExperience || "—"}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
//             <MdSchool size={16} className="text-slate-400 flex-shrink-0" />
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-500 leading-tight">Education</p>
//               <p className="text-sm font-semibold text-slate-700 truncate">{candidate_education?.length || 0}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
//             <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-500 leading-tight">Skills</p>
//               <p className="text-sm font-semibold text-slate-700 truncate">{candidate_skills?.length || 0}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
//             <MdDescription size={16} className="text-slate-400 flex-shrink-0" />
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-500 leading-tight">Resume</p>
//               <p className="text-sm font-semibold text-slate-700 truncate">
//                 {candidate_resumes?.resume_file ? "Uploaded" : "—"}
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
//                     active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
//                   }`}
//                 >
//                   <Icon size={16} />
//                   {tab.label}
//                   {active && (
//                     <motion.span
//                       layoutId="candidate-view-tab-underline"
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
//                 {renderTabContent()}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CandidateView;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdWork,
  MdSchool,
  MdVerified,
  MdLink,
  MdEmojiEvents,
  MdDescription,
  MdLocationOn,
  MdBusiness,
  MdBook,
  MdTrendingUp,
  MdStar,
  MdCheckCircle,
  MdErrorOutline,
  MdPauseCircle,
  MdBlock,
  MdOpenInNew,
  MdHistory,
  MdCategory,
  MdGroups,
} from "react-icons/md";
import candidateService from "../../services/candidate.service";
import { showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Helpers ──────────────────────────────────────────────────
const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:image")) return path;
  if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
  if (path.startsWith("./uploads/")) return `${API_BASE_URL}${path.substring(1)}`;
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path}`;
};

// ─── FIX: Resume URL builder ─────────────────────────────────
// Handles bare filenames, full URLs, and relative paths.
// Always points to /uploads/ (not /uploads/resumes/)
const getResumeUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
  if (path.startsWith("./uploads/")) return `${API_BASE_URL}${path.substring(1)}`;
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
  // Default: treat as a bare filename inside /uploads/
  return `${API_BASE_URL}/uploads/${encodeURIComponent(path)}`;
};

// ─── Status styles ─────────────────────────────────────────────
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

// ─── Animated completion ring ────────────────────────────────
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

// ─── Shared small pieces ─────────────────────────────────────
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

const TagList = ({ items, color = "blue" }) => {
  if (!items || items.length === 0) return <span className="text-slate-400 text-sm">—</span>;
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  const dotColors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
  };
  const cls = colorClasses[color] || colorClasses.blue;
  const dotCls = dotColors[color] || dotColors.blue;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span
          key={idx}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cls}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
          {typeof item === "string" ? item : item.name || item.label || item}
        </span>
      ))}
    </div>
  );
};

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdPerson },
  { id: "professional", label: "Professional", icon: MdBusiness }, // combines Experience, Education, Skills
  { id: "preferences", label: "Preferences", icon: MdTrendingUp },
  { id: "documents", label: "Documents", icon: MdDescription },
  { id: "activity", label: "Activity", icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const CandidateView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  // Load users for audit names
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((uid) => {
          userMap[uid] = users[uid].name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  const getUserNameCached = (userId) => {
    if (!userId) return "—";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Fetch full candidate profile
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await candidateService.getFullProfile(id);
        const data = response?.data?.data || response?.data;
        if (data) {
          setProfile({
            ...data,
            candidate_skills: Array.isArray(data.candidate_skills)
              ? data.candidate_skills
              : data.candidate_skills
                ? [data.candidate_skills]
                : [],
            candidate_education: Array.isArray(data.candidate_education)
              ? data.candidate_education
              : data.candidate_education
                ? [data.candidate_education]
                : [],
            candidate_experience: Array.isArray(data.candidate_experience)
              ? data.candidate_experience
              : data.candidate_experience
                ? [data.candidate_experience]
                : [],
            candidate_certification: Array.isArray(data.candidate_certification)
              ? data.candidate_certification
              : data.candidate_certification
                ? [data.candidate_certification]
                : [],
            candidate_awards: Array.isArray(data.candidate_awards)
              ? data.candidate_awards
              : data.candidate_awards
                ? [data.candidate_awards]
                : [],
            candidate_social_links: Array.isArray(data.candidate_social_links)
              ? data.candidate_social_links
              : data.candidate_social_links
                ? [data.candidate_social_links]
                : [],
            candidate_projects: Array.isArray(data.candidate_projects)
              ? data.candidate_projects
              : data.candidate_projects
                ? [data.candidate_projects]
                : [],
          });
        } else {
          showError("Candidate not found");
          navigate("/candidates");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.response?.data?.message || "Failed to load candidate profile");
        navigate("/candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/candidates");
  };

  // Calculate total experience
  const calculateTotalExperience = () => {
    if (!profile?.candidate_experience || profile.candidate_experience.length === 0) return null;
    let totalMonths = 0;
    profile.candidate_experience.forEach((exp) => {
      if (exp.start_date) {
        const start = new Date(exp.start_date);
        const end = exp.is_current_company
          ? new Date()
          : exp.end_date
            ? new Date(exp.end_date)
            : new Date();
        const diffMonths =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, diffMonths);
      }
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years === 0 && months === 0) return null;
    if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
    if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
          <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Candidate not found</p>
          <button
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MdArrowBack size={16} />
            Back to candidates
          </button>
        </div>
      </div>
    );
  }

  const {
    candidate,
    candidate_profiles,
    candidate_resumes,
    candidate_skills,
    candidate_education,
    candidate_experience,
    candidate_preferences,
    candidate_certification,
    candidate_awards,
    candidate_social_links,
    candidate_projects,
  } = profile;

  const totalExperience = calculateTotalExperience();
  const fullName = `${candidate?.first_name || ""} ${candidate?.last_name || ""}`.trim() || "Unnamed Candidate";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const completionPct = parseInt(candidate_profiles?.profile_completion_percentage) || 0;
  const status = candidate?.status || "pending";

  // ─── Render tab content ──────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* About */}
            {candidate_profiles?.career_summary && (
              <div>
                <FieldLabel>About</FieldLabel>
                <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {candidate_profiles.career_summary}
                </div>
              </div>
            )}

            {/* Personal Details */}
            <div>
              <FieldLabel>Personal Details</FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-lg border border-slate-200 p-4">
                <div>
                  <span className="text-xs font-medium text-slate-500">Gender</span>
                  <p className="text-sm text-slate-700">
                    {candidate_profiles?.gender ? candidate_profiles.gender.charAt(0).toUpperCase() + candidate_profiles.gender.slice(1) : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Marital Status</span>
                  <p className="text-sm text-slate-700">
                    {candidate_profiles?.marital_status ? candidate_profiles.marital_status.charAt(0).toUpperCase() + candidate_profiles.marital_status.slice(1) : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Nationality</span>
                  <p className="text-sm text-slate-700">{candidate_profiles?.nationality || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Date of Birth</span>
                  <p className="text-sm text-slate-700">{candidate_profiles?.dob ? formatDate(candidate_profiles.dob) : "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Current City</span>
                  <p className="text-sm text-slate-700">{candidate_profiles?.City?.name || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Current Address</span>
                  <p className="text-sm text-slate-700">{candidate_profiles?.current_address || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Pincode</span>
                  <p className="text-sm text-slate-700">{candidate_profiles?.pincode || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Willing to Relocate</span>
                  <p className="text-sm text-slate-700">{candidate_profiles?.willing_to_relocate ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Notice Period</span>
                  <p className="text-sm text-slate-700">{candidate_profiles?.NoticePeriod?.name || "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Total Experience</span>
                  <p className="text-sm text-slate-700">{totalExperience || "—"}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {candidate_social_links && candidate_social_links.length > 0 && (
              <div>
                <FieldLabel>Social Links</FieldLabel>
                <div className="flex flex-wrap gap-3">
                  {candidate_social_links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.social_url?.startsWith("http") ? link.social_url : `https://${link.social_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
                    >
                      <MdLink size={14} />
                      {link.social_type?.charAt(0).toUpperCase() + link.social_type?.slice(1)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "professional":
        return (
          <div className="space-y-8">
            {/* ─── Experience ─── */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MdBusiness size={18} className="text-blue-600" />
                Experience
              </h3>
              {!candidate_experience || candidate_experience.length === 0 ? (
                <p className="text-slate-400 text-sm">No experience entries.</p>
              ) : (
                <div className="space-y-6">
                  {candidate_experience.map((exp, idx) => (
                    <div key={idx} className={`pb-6 ${idx < candidate_experience.length - 1 ? "border-b border-slate-200" : ""}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-semibold text-slate-800">{exp.job_title || exp.designation}</h4>
                          <p className="text-sm text-slate-600 font-medium">{exp.company_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {exp.is_current_company && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Current
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {exp.start_date ? formatDate(exp.start_date) : "—"} —{" "}
                            {exp.is_current_company ? "Present" : exp.end_date ? formatDate(exp.end_date) : "—"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exp.Industry?.name && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Industry: {exp.Industry.name}</span>
                        )}
                        {exp.WorkplaceType?.name && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Workplace: {exp.WorkplaceType.name}</span>
                        )}
                        {exp.jobType?.name && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Job Type: {exp.jobType.name}</span>
                        )}
                        {exp.salary && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Salary: ₹{parseFloat(exp.salary).toLocaleString()}</span>
                        )}
                      </div>
                      {exp.job_description && (
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{exp.job_description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Education ─── */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MdSchool size={18} className="text-blue-600" />
                Education
              </h3>
              {!candidate_education || candidate_education.length === 0 ? (
                <p className="text-slate-400 text-sm">No education entries.</p>
              ) : (
                <div className="space-y-6">
                  {candidate_education.map((edu, idx) => (
                    <div key={idx} className={`pb-6 ${idx < candidate_education.length - 1 ? "border-b border-slate-200" : ""}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-semibold text-slate-800">{edu.EducationSubCategory?.name || "Education"}</h4>
                          <p className="text-sm text-slate-600">{edu.college_name}</p>
                        </div>
                        <span className="text-xs text-slate-400">{edu.passing_year || "—"}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {edu.EducationCategory?.name && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Category: {edu.EducationCategory.name}</span>
                        )}
                        {edu.percentage && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Percentage: {edu.percentage}%</span>
                        )}
                        {edu.education_type && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Type: {edu.education_type}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Skills ─── */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MdWork size={18} className="text-blue-600" />
                Skills
              </h3>
              {!candidate_skills || candidate_skills.length === 0 ? (
                <p className="text-slate-400 text-sm">No skills listed.</p>
              ) : (
                <TagList
                  items={candidate_skills.map((s) => s.Skill?.skill_name || s.skill_id)}
                  color="blue"
                />
              )}
            </div>
          </div>
        );

      case "preferences":
        if (!candidate_preferences) {
          return <p className="text-slate-400 text-sm">No preferences set.</p>;
        }
        return (
          <div className="space-y-5">
            {candidate_preferences.preferred_salary && (
              <div>
                <FieldLabel>Preferred Salary</FieldLabel>
                <ReadOnlyValue>₹{parseFloat(candidate_preferences.preferred_salary).toLocaleString()}</ReadOnlyValue>
              </div>
            )}
            {candidate_preferences.preferred_industries?.length > 0 && (
              <div>
                <FieldLabel>Preferred Industries</FieldLabel>
                <TagList items={candidate_preferences.preferred_industries.map((i) => i.name)} color="green" />
              </div>
            )}
            {candidate_preferences.preferred_cities?.length > 0 && (
              <div>
                <FieldLabel>Preferred Cities</FieldLabel>
                <TagList items={candidate_preferences.preferred_cities.map((c) => c.name)} color="purple" />
              </div>
            )}
            {candidate_preferences.preferred_workplace_types?.length > 0 && (
              <div>
                <FieldLabel>Preferred Workplace Types</FieldLabel>
                <TagList items={candidate_preferences.preferred_workplace_types.map((w) => w.name)} color="amber" />
              </div>
            )}
          </div>
        );

      case "documents":
        return (
          <div className="space-y-6">
            {/* Resume */}
            {candidate_resumes?.resume_file ? (
              <div>
                <FieldLabel>Resume</FieldLabel>
                <a
                  href={getResumeUrl(candidate_resumes.resume_file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2c0eee] text-white rounded-lg hover:bg-[#1a0b9e] transition-colors"
                >
                  <MdDescription size={18} />
                  {candidate_resumes.resume_title || "Download Resume"}
                  <MdOpenInNew size={14} />
                </a>
              </div>
            ) : (
              <div>
                <FieldLabel>Resume</FieldLabel>
                <p className="text-slate-400 text-sm">No resume uploaded.</p>
              </div>
            )}

            {/* Certifications */}
            {candidate_certification?.length > 0 && (
              <div>
                <FieldLabel>Certifications</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {candidate_certification.map((cert, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="font-medium text-slate-800">{cert.certificate_name}</p>
                      <p className="text-sm text-slate-500">Issuer: {cert.issuer || "—"}</p>
                      <p className="text-xs text-slate-400">
                        Issue Date: {cert.issue_date ? formatDate(cert.issue_date) : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {candidate_awards?.length > 0 && (
              <div>
                <FieldLabel>Awards</FieldLabel>
                <div className="space-y-3">
                  {candidate_awards.map((award, idx) => (
                    <div key={idx} className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <p className="font-medium text-slate-800">{award.title}</p>
                      {award.description && (
                        <p className="text-sm text-slate-600 mt-1">{award.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {candidate_projects?.length > 0 && (
              <div>
                <FieldLabel>Projects</FieldLabel>
                <div className="space-y-6">
                  {candidate_projects.map((project, idx) => (
                    <div key={idx} className="pb-6 border-b border-slate-200 last:border-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-slate-800">{project.project_title}</h3>
                          <p className="text-sm text-slate-600">Role: {project.candidate_role}</p>
                        </div>
                        {project.team_size && (
                          <span className="text-xs text-slate-400">Team Size: {project.team_size}</span>
                        )}
                      </div>
                      {project.client_name && (
                        <p className="text-sm text-slate-500 mt-1">Client: {project.client_name}</p>
                      )}
                      {project.technologies_used && (
                        <p className="text-sm text-slate-500">Technologies: {project.technologies_used}</p>
                      )}
                      {project.project_description && (
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{project.project_description}</p>
                      )}
                      {project.project_url && (
                        <a
                          href={project.project_url.startsWith("http") ? project.project_url : `https://${project.project_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "activity":
        return (
          <div className="space-y-6">
            <div>
              <FieldLabel>Profile Completion</FieldLabel>
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
                <span className="text-sm font-semibold text-slate-700 w-12 text-right">{completionPct}%</span>
              </div>
              <p className="text-xs text-slate-400">
                Last calculated{" "}
                {candidate_profiles?.last_completion_calculated_at
                  ? formatDate(candidate_profiles.last_completion_calculated_at)
                  : "—"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="relative pl-6">
                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
                <div className="relative pb-6">
                  <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                  <p className="text-sm font-semibold text-slate-700">Created</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {candidate?.created_by ? getUserNameCached(candidate.created_by) : "System"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {candidate?.createdAt ? formatDate(candidate.createdAt) : "—"}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <p className="text-sm font-semibold text-slate-700">Last updated</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {candidate?.updated_by ? getUserNameCached(candidate.updated_by) : "—"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {candidate_profiles?.updated_at ? formatDate(candidate_profiles.updated_at) : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Render ──────────────────────────────────────────────────
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
              <p className="text-[11px] text-slate-400 leading-tight">Candidates</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              Back
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
            {candidate_profiles?.banner_image ? (
              <img
                src={getFullImageUrl(candidate_profiles.banner_image)}
                alt="Banner"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
                {candidate_profiles?.profile_photo ? (
                  <img
                    src={getFullImageUrl(candidate_profiles.profile_photo)}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdPerson size={22} />}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {fullName}
                  </h1>
                  {candidate_profiles?.headline && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-400/20 text-blue-300 ring-1 ring-blue-400/30">
                      {candidate_profiles.headline}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <StatusPill status={status} />
                  {candidate?.email && (
                    <span className="text-xs text-white/70 flex items-center gap-1">
                      <MdEmail size={12} /> {candidate.email}
                    </span>
                  )}
                  {candidate?.mobile && (
                    <span className="text-xs text-white/70 flex items-center gap-1">
                      <MdPhone size={12} /> {candidate.mobile}
                    </span>
                  )}
                  {candidate_profiles?.City?.name && (
                    <span className="text-xs text-white/70 flex items-center gap-1">
                      <MdLocationOn size={12} /> {candidate_profiles.City.name}
                    </span>
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdWork size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Experience</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{totalExperience || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdSchool size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Education</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{candidate_education?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Skills</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{candidate_skills?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDescription size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Resume</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {candidate_resumes?.resume_file ? "Uploaded" : "—"}
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
                    active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="candidate-view-tab-underline"
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
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateView;