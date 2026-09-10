
// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import companyService from "../../services/company.service";
// import { showSuccess, showError } from "../../utils/toast";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdRefresh,
//   MdVisibility,
//   MdBusiness,
//   MdPerson,
// } from "react-icons/md";
// import { useAuth } from "../../context/AuthContext";
// import { fetchUsers } from "../../utils/getUserName";

// // ─── Profile type tabs (top-level) ─────────────────────────────
// // Every company/consultant record carries a "profile_type" field from
// // the backend which is either "company" or "consultant". These two
// // top-level tabs split the whole page by that field; the existing
// // status tabs (All/Active/Inactive/Blocked/Pending/Trending) then
// // operate *within* whichever profile type is currently selected.
// const PROFILE_TYPES = [
//   // { key: "all", label: "All", icon: MdBusiness },
//   { key: "company", label: "Company", icon: MdBusiness },
//   { key: "consultant", label: "Consultant", icon: MdPerson },
// ];

// // ─── Status options (must match backend ENUM) ──────────────────
// const STATUS_OPTIONS = [
//   { value: "active", label: "Active" },
//   { value: "inactive", label: "Inactive" },
//   { value: "blocked", label: "Blocked" },
//   { value: "pending", label: "Pending" },
// ];

// // ─── Helper: badge classes per status ──────────────────────────
// const STATUS_STYLES = {
//   active: "bg-green-50 text-green-700 border-green-200 focus:ring-green-100",
//   inactive: "bg-gray-100 text-gray-600 border-gray-200 focus:ring-gray-100",
//   blocked: "bg-red-50 text-red-700 border-red-200 focus:ring-red-100",
//   pending: "bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-100",
// };

// // ─── Helper: build full image URL ──────────────────────────────
// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http://") || path.startsWith("https://")) return path;
//   const base = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";
//   return `${base}${path}`;
// };

// // ─── Helper: Parse API date format ─────────────────────────────
// const parseApiDate = (dateString) => {
//   if (!dateString) return null;
//   if (dateString instanceof Date) return dateString;

//   // ISO format
//   if (typeof dateString === "string" && dateString.includes("T")) {
//     const d = new Date(dateString);
//     if (!isNaN(d)) return d;
//   }

//   // "DD/MM/YYYY, HH:MM:SS am/pm"
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

// const formatDate = (date) => {
//   if (!date) return "—";
//   const parsed = typeof date === "string" ? parseApiDate(date) : date;
//   if (!parsed || isNaN(parsed)) return "—";
//   return parsed.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// // ─── Helper: pull a total count out of either response shape ───
// // Handles { pagination: { total } } (the real API shape) as well as
// // a bare { total } or an unwrapped array, so count-fetching never
// // silently returns 0 just because of a shape mismatch.
// const extractTotal = (res) => {
//   if (!res) return 0;
//   if (typeof res.pagination?.total === "number") return res.pagination.total;
//   if (typeof res.total === "number") return res.total;
//   if (res.data && typeof res.data === "object" && !Array.isArray(res.data)) {
//     return extractTotal(res.data);
//   }
//   if (Array.isArray(res.data)) return res.data.length;
//   if (Array.isArray(res)) return res.length;
//   return 0;
// };

// const extractList = (res) => {
//   if (Array.isArray(res)) return res;
//   if (!res || typeof res !== "object") return [];
//   if (Array.isArray(res.data)) return res.data;
//   if (res.data && typeof res.data === "object") return extractList(res.data);
//   if (Array.isArray(res.results)) return res.results;
//   return [];
// };

// // ─── Helper: normalize a profile_type value down to "company" |
// // "consultant". Anything missing/unrecognized falls back to "company"
// // so older records without the field still show up somewhere.
// const normalizeProfileType = (value) => {
//   const v = String(value || "")
//     .trim()
//     .toLowerCase();
//   return v === "consultant" ? "consultant" : "company";
// };

// const Companies = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const userId = user?.id || 1;

//   // ─── Top-level Company / Consultant tab ────────────────────────
//   const [profileTab, setProfileTab] = useState("all"); // "all" | "company" | "consultant"

//   // ─── Pagination & Filters ──────────────────────────────────────
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   // "search" is the raw, immediately-controlled input value so typing
//   // feels instant. "debouncedSearch" is what actually drives the API
//   // call & filtering — it only updates 400ms after you stop typing, so
//   // we don't fire (and possibly race) a request on every keystroke.
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive" | "blocked" | "pending" | "trending"

//   // ─── Data & UI state ──────────────────────────────────────────
//   const [data, setData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [userNameCache, setUserNameCache] = useState({});
//   // Tracks which row's status select is mid-request, so we can disable
//   // just that row instead of freezing the whole table.
//   const [statusUpdatingId, setStatusUpdatingId] = useState(null);

//   // ─── Tab counts ─────────────────────────────────────────────────
//   // These are fetched independently of the main table query (limit=1,
//   // just to read `pagination.total`), so tab counts always reflect the
//   // TRUE total across every page — not just whatever rows happen to be
//   // on the currently displayed page/filter/search. This is what fixes
//   // the "glitchy" tabs: previously counts (and whether the Trending tab
//   // even showed up) were derived from `data`, so switching pages or
//   // filters made counts jump around or made the Trending tab
//   // appear/disappear at random.
//   //
//   // Counts are now scoped PER profile type ("company" / "consultant")
//   // since each top-level tab has its own independent set of status
//   // counts.
//   const emptyStatusCounts = () => ({
//     all: 0,
//     active: 0,
//     inactive: 0,
//     blocked: 0,
//     pending: 0,
//     trending: 0,
//   });

//   // ─── Debounce the search box ────────────────────────────────────
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//     }, 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   // ─── Load users for "Updated By" ──────────────────────────────
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

//   const getUpdatedByName = (row) => {
//     if (!row) return "-";
//     if (row.updated_by_name) return row.updated_by_name;
//     return row.updated_by ? getUserNameCached(row.updated_by) : "-";
//   };

//   // ─── Normalize company object ──────────────────────────────────
//   const normalizeCompany = (item) => ({
//     id: item.id,
//     company_name: item.company_name || "",
//     slug: item.slug || "",
//     logo: item.logo || null,
//     banner_image: item.banner_image || null,
//     website: item.website || "",
//     founded_year: item.founded_year || "",
//     about_company: item.about_company || "",
//     gst_number: item.gst_number || "",
//     company_status: item.company_status || "inactive",
//     profile_type: normalizeProfileType(item.profile_type),
//     is_status:
//       item.is_status === true ||
//       item.is_status === "true" ||
//       item.is_status === 1,
//     is_trending:
//       item.is_trending === true ||
//       item.is_trending === "true" ||
//       item.is_trending === 1,
//     profile_completion_percentage: item.profile_completion_percentage || "0.00",
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     updated_by_name:
//       item.Company?.CompanyUser?.full_name ||
//       item.CompanyUser?.full_name ||
//       item.updated_by_name ||
//       null,
//     created_at: item.created_at || null,
//     updated_at: item.updated_at || null,
//     industry_name:
//       item.Industry?.industry_name ||
//       item.Industry?.name ||
//       item.industry_name ||
//       null,
//     Industries: item.Industries || [],
//     SubIndustries: item.SubIndustries || [],
//     company_size_name:
//       item.CompanySize?.company_size_name ||
//       item.CompanySize?.name ||
//       item.company_size_name ||
//       null,
//     company_user_email:
//       item.CompanyUser?.company_user_email ||
//       item.CompanyUser?.email ||
//       item.company_user_email ||
//       null,
//     reference_code: item.reference_code || item.referenceCode || null,
//   });

//   // ─── Race-safety guard ───────────────────────────────────────
//   // If the user types quickly, several requests can be in flight at
//   // once. Without this, a slow-to-resolve *older* request could land
//   // after a newer one and overwrite it with stale results — which
//   // looks exactly like "search doesn't work". requestIdRef lets us
//   // ignore any response that isn't from the most recently issued
//   // request.
//   const requestIdRef = useRef(0);

//   // ─── API call with pagination and filters ─────────────────────
//   // `silent` skips toggling the page-wide `loading` flag — used after a
//   // quick row-level status/trending change so the whole table doesn't
//   // flash into a loading state for what is a tiny, already-optimistic
//   // update.
//   const load = useCallback(async ({ silent = false } = {}) => {
//     const requestId = ++requestIdRef.current;
//     if (!silent) setLoading(true);
//     setError(null);
//     try {
//       await loadUsers();

//       // Build query parameters
//       // Fetch the complete dataset once. The API currently ignores
//       // profile_type and search filters, so those are applied locally.
//       const response = await companyService.getAll({ page: 1, limit: 100 });

//       // Ignore this response if a newer request has already been issued
//       if (requestIdRef.current !== requestId) return;

//       const rawData = extractList(response);
//       const items = rawData.map(normalizeCompany);

//       // Extract pagination metadata
//       const totalItems = rawData.length;

//       setData(items);
//       setTotal(totalItems);
//     } catch (err) {
//       if (requestIdRef.current !== requestId) return;
//       console.error("Load error:", err);
//       let errorMessage = "Failed to load companies";
//       if (
//         err.message?.includes("NetworkError") ||
//         err.message?.includes("Failed to fetch")
//       ) {
//         errorMessage = "Network error: Unable to connect to the server.";
//       } else if (err.status === 401 || err.status === 403) {
//         errorMessage = "Access denied. Please log in again.";
//       } else if (err.status === 404) {
//         errorMessage = "API endpoint not found. Please check the API URL.";
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
//       setError(errorMessage);
//       showError(errorMessage);
//     } finally {
//       if (requestIdRef.current === requestId && !silent) setLoading(false);
//     }
//   }, []);

//   // ─── Reload after the complete dataset changes ────────────────
//   useEffect(() => {
//     load();
//   }, [load]);

//   // Reset page when search, status filter, or top-level profile tab changes
//   useEffect(() => {
//     setPage(1);
//   }, [debouncedSearch, statusFilter, profileTab]);

//   // Reset the status filter back to "all" whenever the top-level
//   // Company/Consultant tab is switched, so you don't land on
//   // "Consultant → Blocked" just because that's where you left off on
//   // the Company tab.
//   const handleProfileTabChange = (key) => {
//     if (key === profileTab) return;
//     setProfileTab(key);
//     setStatusFilter("all");
//   };

//   // ─── Client-side search safety net ────────────────────────────
//   // Re-applies the debounced search text to whatever rows the server
//   // actually returned. If the backend already searches correctly this
//   // is a no-op (everything already matches). If it doesn't (wrong
//   // param name, search unimplemented for some fields, etc.), the table
//   // you see still respects what you typed — this is what guarantees
//   // search actually works regardless of backend behavior.
//   const filteredData = useMemo(() => {
//     const q = debouncedSearch.toLowerCase();
//     return data.filter((c) => {
//       if (profileTab !== "all" && c.profile_type !== profileTab) return false;
//       if (statusFilter === "trending" && !c.is_trending) return false;
//       if (
//         statusFilter !== "all" &&
//         statusFilter !== "trending" &&
//         c.company_status !== statusFilter
//       ) {
//         return false;
//       }
//       if (!q) return true;

//       const searchFields = [
//         c.company_name,
//         c.slug,
//         c.company_user_email,
//         c.industry_name,
//         c.company_size_name,
//         c.reference_code,
//         c.website,
//       ];

//       // Add all industry names to search
//       if (c.Industries && Array.isArray(c.Industries)) {
//         c.Industries.forEach((ind) => {
//           searchFields.push(ind.industry_name || ind.name);
//         });
//       }
//       if (c.SubIndustries && Array.isArray(c.SubIndustries)) {
//         c.SubIndustries.forEach((subIndustry) => {
//           searchFields.push(subIndustry.sub_industry_name || subIndustry.name);
//         });
//       }

//       return searchFields
//         .filter(Boolean)
//         .some((field) => String(field).toLowerCase().includes(q));
//     });
//   }, [data, debouncedSearch, profileTab, statusFilter]);

//   const paginatedData = useMemo(
//     () => filteredData.slice((page - 1) * limit, page * limit),
//     [filteredData, page, limit],
//   );

//   const statusCounts = useMemo(() => {
//     const counts = {
//       all: emptyStatusCounts(),
//       company: emptyStatusCounts(),
//       consultant: emptyStatusCounts(),
//     };

//     data.forEach((company) => {
//       [counts.all, counts[company.profile_type]].forEach((profileCounts) => {
//         if (!profileCounts) return;
//         profileCounts.all += 1;
//         if (profileCounts[company.company_status] !== undefined) {
//           profileCounts[company.company_status] += 1;
//         }
//         if (company.is_trending) profileCounts.trending += 1;
//       });
//     });

//     return counts;
//   }, [data]);

//   // ─── Toggle / change handlers ───────────────────────────────────
//   const handleCompanyStatusChange = async (id, newStatus) => {
//     const prevData = data;
//     // Optimistic update so the select reflects the choice immediately
//     setData((prev) =>
//       prev.map((c) => (c.id === id ? { ...c, company_status: newStatus } : c)),
//     );
//     setStatusUpdatingId(id);
//     try {
//       await companyService.update(id, {
//         company_status: newStatus,
//         updated_by: userId,
//       });
//       showSuccess(`Company status updated to ${newStatus}`);
//       // Silent reload: keeps the row's already-correct optimistic value
//       // on screen and just reconciles pagination/filtering in the
//       // background (e.g. drops the row if it no longer matches the
//       // active tab) without flashing the whole table into a loading
//       // state.
//       load({ silent: true });
//     } catch (err) {
//       // Roll back on failure
//       setData(prevData);
//       showError(err.message || "Failed to update status");
//     } finally {
//       setStatusUpdatingId(null);
//     }
//   };

//   const handleIsStatusToggle = async (id, currentValue) => {
//     const newValue = !currentValue;
//     try {
//       await companyService.update(id, {
//         is_status: newValue,
//         updated_by: userId,
//       });
//       showSuccess(
//         `Internal status updated to ${newValue ? "active" : "inactive"}`,
//       );
//       load({ silent: true });
//     } catch (err) {
//       showError(err.message || "Failed to update internal status");
//     }
//   };

//   const handleTrendingToggle = async (id, currentTrending) => {
//     const newTrending = !currentTrending;
//     const prevData = data;
//     // Optimistic update, same reasoning as status change above
//     setData((prev) =>
//       prev.map((c) => (c.id === id ? { ...c, is_trending: newTrending } : c)),
//     );
//     try {
//       await companyService.update(id, {
//         is_trending: newTrending,
//         updated_by: userId,
//       });
//       showSuccess(`Trending updated to ${newTrending ? "Yes" : "No"}`);
//       load({ silent: true });
//     } catch (err) {
//       setData(prevData);
//       showError(err.message || "Failed to update trending");
//     }
//   };

//   // ─── Navigation ────────────────────────────────────────────────
//   const openAdd = () => navigate("/companies/add");
//   const openEdit = (item) => navigate(`/companies/edit/${item.id}`);
//   const openView = (item) => navigate(`/companies/view/${item.id}`);

//   // ─── Delete ────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await companyService.delete(deleteId);
//       showSuccess("Company deleted successfully");
//       load();
//     } catch (err) {
//       console.error("Delete error:", err);
//       showError(err.message || "Failed to delete company");
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   // ─── Status Tabs (scoped to the active profile tab) ─────────────
//   // Counts come from `statusCounts[profileTab]` (a dedicated,
//   // page/filter-independent fetch) rather than being derived from
//   // `data`, which only ever holds the current page's rows. Trending
//   // tab visibility is likewise driven by the true total, so it no
//   // longer flickers in and out as you page through or switch filters.
//   const activeCounts = statusCounts[profileTab] || emptyStatusCounts();
//   const hasTrending = activeCounts.trending > 0;
//   const tabs = [
//     { key: "all", label: "All", count: activeCounts.all },
//     { key: "active", label: "Active", count: activeCounts.active },
//     { key: "inactive", label: "Inactive", count: activeCounts.inactive },
//     { key: "blocked", label: "Blocked", count: activeCounts.blocked },
//     { key: "pending", label: "Pending", count: activeCounts.pending },
//     ...(hasTrending
//       ? [{ key: "trending", label: "Trending", count: activeCounts.trending }]
//       : []),
//   ];

//   // ─── Table Columns ──────────────────────────────────────────────
//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1,
//     },
//     {
//       header: "Logo",
//       key: "logo",
//       render: (logo) =>
//         logo ? (
//           <img
//             src={getImageUrl(logo)}
//             alt="logo"
//             className="w-9 h-9 object-cover rounded border border-gray-200"
//             onError={(e) => {
//               e.target.style.display = "none";
//             }}
//           />
//         ) : (
//           <div className="w-9 h-9 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
//             <svg
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <rect x="3" y="3" width="18" height="18" rx="2" />
//               <circle cx="8.5" cy="8.5" r="1.5" />
//               <path d="M21 15l-5-5L5 21" />
//             </svg>
//           </div>
//         ),
//     },
//     {
//       header: profileTab === "consultant" ? "Consultant" : "Company",
//       key: "company_name",
//       render: (v, row) => (
//         <div>
//           <span className="font-medium text-gray-800">{v}</span>
//           <div className="text-xs text-gray-400">{row.slug}</div>
//           {row.reference_code && (
//             <div className="text-xs text-gray-400 font-mono">
//               Ref: {row.reference_code}
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       header: "Email",
//       key: "company_user_email",
//       render: (v) => <span className="text-sm text-gray-500">{v || "—"}</span>,
//     },
//     {
//       header: "Industries",
//       key: "Industries",
//       render: (_, row) => {
//         const industries = row.Industries || [];
//         if (!industries || industries.length === 0) {
//           return <span className="text-sm text-gray-400">—</span>;
//         }
//         return (
//           <div className="flex flex-wrap gap-1.5">
//             {industries.map((ind, idx) => (
//               <span
//                 key={idx}
//                 className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
//                 title={ind.industry_name || ind.name}
//               >
//                 <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
//                 {ind.industry_name || ind.name || "Unknown"}
//               </span>
//             ))}
//           </div>
//         );
//       },
//     },
//     {
//       header: "Size",
//       key: "company_size_name",
//       render: (v) => <span className="text-sm text-gray-500">{v || "—"}</span>,
//     },
//     {
//       header: "Trending",
//       key: "is_trending",
//       render: (is_trending, row) => (
//         <button
//           onClick={() => handleTrendingToggle(row.id, is_trending)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${is_trending ? "bg-amber-500" : "bg-gray-300"}`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${is_trending ? "translate-x-6" : "translate-x-1"}`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Status",
//       key: "company_status",
//       render: (status, row) => (
//         <select
//           value={status}
//           disabled={statusUpdatingId === row.id}
//           onChange={(e) => handleCompanyStatusChange(row.id, e.target.value)}
//           className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
//             STATUS_STYLES[status] || STATUS_STYLES.inactive
//           }`}
//         >
//           {STATUS_OPTIONS.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//       ),
//     },
//     {
//       header: "Updated By",
//       key: "updated_by",
//       render: (_, row) => (
//         <div className="flex items-center gap-1.5">
//           <span className="text-gray-600 text-sm font-medium">
//             {getUpdatedByName(row)}
//           </span>
//         </div>
//       ),
//     },
//     // {
//     //   header: "Updated At",
//     //   key: "updated_at",
//     //   render: (_, row) => {
//     //     const date = row.updated_at || row.updatedAt;
//     //     return (
//     //       <span className="text-gray-500 text-sm">{formatDate(date)}</span>
//     //     );
//     //   },
//     // },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1">
//           <button
//             onClick={() => openView(row)}
//             className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
//             title="View"
//           >
//             <MdVisibility size={16} />
//           </button>
//           <button
//             onClick={() => openEdit(row)}
//             className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
//             title="Edit"
//           >
//             <MdEdit size={16} />
//           </button>
//           <button
//             onClick={() => setDeleteId(id)}
//             className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
//             title="Delete"
//           >
//             <MdDelete size={16} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // ─── Error display ─────────────────────────────────────────────
//   if (error) {
//     return (
//       <div className="space-y-4">
//         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Manage registered companies
//             </p>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden p-8 text-center">
//           <div className="text-red-500 mb-4">
//             <svg
//               className="w-12 h-12 mx-auto"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             Failed to Load Companies
//           </h3>
//           <p className="text-gray-600 max-w-md mx-auto whitespace-pre-line">
//             {error}
//           </p>
//           <button
//             onClick={load}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage registered companies and consultants
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="secondary"
//             icon={MdRefresh}
//             onClick={() => {
//               load();
//               loadStatusCounts();
//             }}
//             loading={loading}
//           >
//             Refresh
//           </Button>
//           <Button icon={MdAdd} onClick={openAdd}>
//             Add Company
//           </Button>
//         </div>
//       </div>

//       {/* Top-level Company / Consultant tabs */}
//       <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-full sm:w-fit">
//         {PROFILE_TYPES.map(({ key, label, icon: Icon }) => {
//           const isActive = profileTab === key;
//           const count = statusCounts[key]?.all ?? 0;
//           return (
//             <button
//               key={key}
//               onClick={() => handleProfileTabChange(key)}
//               className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 sm:flex-initial ${
//                 isActive
//                   ? "bg-white text-blue-600 shadow-sm"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <Icon size={16} />
//               {label}
//               <span
//                 className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
//                   isActive
//                     ? "bg-blue-50 text-blue-600"
//                     : "bg-gray-200 text-gray-500"
//                 }`}
//               >
//                 {count}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Table Card */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         {/* Top bar with search and status tabs */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
//           <div className="relative w-full sm:w-72">
//             <MdSearch
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder={`Search ${profileTab === "consultant" ? "consultants" : "companies"}...`}
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-5 text-sm flex-wrap">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${
//                   statusFilter === tab.key
//                     ? tab.key === "trending"
//                       ? "text-amber-600"
//                       : "text-blue-600"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 {tab.label}
//                 <span
//                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
//                     statusFilter === tab.key
//                       ? tab.key === "trending"
//                         ? "bg-amber-50 text-amber-600"
//                         : "bg-blue-50 text-blue-600"
//                       : "bg-gray-100 text-gray-500"
//                   }`}
//                 >
//                   {tab.count}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <Table
//           columns={columns}
//           data={paginatedData}
//           loading={loading}
//           emptyMessage={
//             profileTab === "consultant"
//               ? "No consultants found"
//               : "No companies found"
//           }
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of{" "}
//             {filteredData.length}{" "}
//             {profileTab === "consultant" ? "consultants" : "companies"}
//           </p>
//           <Pagination
//             page={page}
//             total={filteredData.length}
//             limit={limit}
//             onChange={setPage}
//             onLimitChange={(newLimit) => {
//               setLimit(newLimit);
//               setPage(1);
//             }}
//           />
//         </div>
//       </div>

//       {/* Delete Confirmation */}
//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Company"
//         message="Delete this company? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default Companies;



import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import companyService from "../../services/company.service";
import { showSuccess, showError } from "../../utils/toast";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdRefresh,
  MdVisibility,
  MdBusiness,
  MdPerson,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { fetchUsers } from "../../utils/getUserName";

// ─── Profile type tabs (top-level) ─────────────────────────────
// Every company/consultant record carries a "profile_type" field from
// the backend which is either "company" or "consultant". These two
// top-level tabs split the whole page by that field; the existing
// status tabs (All/Active/Inactive/Blocked/Pending/Trending) then
// operate *within* whichever profile type is currently selected.
const PROFILE_TYPES = [
  // { key: "all", label: "All", icon: MdBusiness },
  { key: "company", label: "Company", icon: MdBusiness },
  { key: "consultant", label: "Consultant", icon: MdPerson },
];

// ─── Status options (must match backend ENUM) ──────────────────
const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "blocked", label: "Blocked" },
  { value: "pending", label: "Pending" },
];

// ─── Helper: badge classes per status ──────────────────────────
const STATUS_STYLES = {
  active: "bg-green-50 text-green-700 border-green-200 focus:ring-green-100",
  inactive: "bg-gray-100 text-gray-600 border-gray-200 focus:ring-gray-100",
  blocked: "bg-red-50 text-red-700 border-red-200 focus:ring-red-100",
  pending: "bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-100",
};

// ─── Helper: build full image URL ──────────────────────────────
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";
  return `${base}${path}`;
};

// ─── Helper: Parse API date format ─────────────────────────────
const parseApiDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;

  // ISO format
  if (typeof dateString === "string" && dateString.includes("T")) {
    const d = new Date(dateString);
    if (!isNaN(d)) return d;
  }

  // "DD/MM/YYYY, HH:MM:SS am/pm"
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

const formatDate = (date) => {
  if (!date) return "—";
  const parsed = typeof date === "string" ? parseApiDate(date) : date;
  if (!parsed || isNaN(parsed)) return "—";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ─── Helper: pull a total count out of either response shape ───
// Handles { pagination: { total } } (the real API shape) as well as
// a bare { total } or an unwrapped array, so count-fetching never
// silently returns 0 just because of a shape mismatch.
const extractTotal = (res) => {
  if (!res) return 0;
  if (typeof res.pagination?.total === "number") return res.pagination.total;
  if (typeof res.total === "number") return res.total;
  if (res.data && typeof res.data === "object" && !Array.isArray(res.data)) {
    return extractTotal(res.data);
  }
  if (Array.isArray(res.data)) return res.data.length;
  if (Array.isArray(res)) return res.length;
  return 0;
};

const extractList = (res) => {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];
  if (Array.isArray(res.data)) return res.data;
  if (res.data && typeof res.data === "object") return extractList(res.data);
  if (Array.isArray(res.results)) return res.results;
  return [];
};

// ─── Helper: normalize a profile_type value down to "company" |
// "consultant". Anything missing/unrecognized falls back to "company"
// so older records without the field still show up somewhere.
const normalizeProfileType = (value) => {
  const v = String(value || "")
    .trim()
    .toLowerCase();
  return v === "consultant" ? "consultant" : "company";
};

const Companies = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || 1;

  // ─── Top-level Company / Consultant tab ────────────────────────
  const [profileTab, setProfileTab] = useState("all"); // "all" | "company" | "consultant"

  // ─── Pagination & Filters ──────────────────────────────────────
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // "search" is the raw, immediately-controlled input value so typing
  // feels instant. "debouncedSearch" is what actually drives the API
  // call & filtering — it only updates 400ms after you stop typing, so
  // we don't fire (and possibly race) a request on every keystroke.
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive" | "blocked" | "pending" | "trending"

  // ─── Data & UI state ──────────────────────────────────────────
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  // Tracks which row's status select is mid-request, so we can disable
  // just that row instead of freezing the whole table.
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // ─── Tab counts ─────────────────────────────────────────────────
  // These are fetched independently of the main table query (limit=1,
  // just to read `pagination.total`), so tab counts always reflect the
  // TRUE total across every page — not just whatever rows happen to be
  // on the currently displayed page/filter/search. This is what fixes
  // the "glitchy" tabs: previously counts (and whether the Trending tab
  // even showed up) were derived from `data`, so switching pages or
  // filters made counts jump around or made the Trending tab
  // appear/disappear at random.
  //
  // Counts are now scoped PER profile type ("company" / "consultant")
  // since each top-level tab has its own independent set of status
  // counts.
  const emptyStatusCounts = () => ({
    all: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    pending: 0,
    trending: 0,
  });

  // ─── Debounce the search box ────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ─── Load users for "Updated By" ──────────────────────────────
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

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by_name) return row.updated_by_name;
    return row.updated_by ? getUserNameCached(row.updated_by) : "-";
  };

  // ─── Normalize company object ──────────────────────────────────
  const normalizeCompany = (item) => ({
    id: item.id,
    company_name: item.company_name || "",
    slug: item.slug || "",
    logo: item.logo || null,
    banner_image: item.banner_image || null,
    website: item.website || "",
    founded_year: item.founded_year || "",
    about_company: item.about_company || "",
    gst_number: item.gst_number || "",
    company_status: item.company_status || "inactive",
    profile_type: normalizeProfileType(item.profile_type),
    is_status:
      item.is_status === true ||
      item.is_status === "true" ||
      item.is_status === 1,
    is_trending:
      item.is_trending === true ||
      item.is_trending === "true" ||
      item.is_trending === 1,
    profile_completion_percentage: item.profile_completion_percentage || "0.00",
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    updated_by_name:
      item.Company?.CompanyUser?.full_name ||
      item.CompanyUser?.full_name ||
      item.updated_by_name ||
      null,
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
    industry_name:
      item.Industry?.industry_name ||
      item.Industry?.name ||
      item.industry_name ||
      null,
    Industries: item.Industries || [],
    SubIndustries: item.SubIndustries || [],
    company_size_name:
      item.CompanySize?.company_size_name ||
      item.CompanySize?.name ||
      item.company_size_name ||
      null,
    company_user_email:
      item.CompanyUser?.company_user_email ||
      item.CompanyUser?.email ||
      item.company_user_email ||
      null,
    reference_code: item.reference_code || item.referenceCode || null,
  });

  // ─── Race-safety guard ───────────────────────────────────────
  // If the user types quickly, several requests can be in flight at
  // once. Without this, a slow-to-resolve *older* request could land
  // after a newer one and overwrite it with stale results — which
  // looks exactly like "search doesn't work". requestIdRef lets us
  // ignore any response that isn't from the most recently issued
  // request.
  const requestIdRef = useRef(0);

  // ─── API call with pagination and filters ─────────────────────
  // `silent` skips toggling the page-wide `loading` flag — used after a
  // quick row-level status/trending change so the whole table doesn't
  // flash into a loading state for what is a tiny, already-optimistic
  // update.
  const load = useCallback(async ({ silent = false } = {}) => {
    const requestId = ++requestIdRef.current;
    if (!silent) setLoading(true);
    setError(null);
    try {
      await loadUsers();

      // Build query parameters
      // Fetch the complete dataset once. The API currently ignores
      // profile_type and search filters, so those are applied locally.
      const response = await companyService.getAll({ page: 1, limit: 100 });

      // Ignore this response if a newer request has already been issued
      if (requestIdRef.current !== requestId) return;

      const rawData = extractList(response);
      const items = rawData.map(normalizeCompany);

      // Extract pagination metadata
      const totalItems = rawData.length;

      setData(items);
      setTotal(totalItems);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      console.error("Load error:", err);
      let errorMessage = "Failed to load companies";
      if (
        err.message?.includes("NetworkError") ||
        err.message?.includes("Failed to fetch")
      ) {
        errorMessage = "Network error: Unable to connect to the server.";
      } else if (err.status === 401 || err.status === 403) {
        errorMessage = "Access denied. Please log in again.";
      } else if (err.status === 404) {
        errorMessage = "API endpoint not found. Please check the API URL.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      if (requestIdRef.current === requestId && !silent) setLoading(false);
    }
  }, []);

  // ─── Reload after the complete dataset changes ────────────────
  useEffect(() => {
    load();
  }, [load]);

  // Reset page when search, status filter, or top-level profile tab changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, profileTab]);

  // Reset the status filter back to "all" whenever the top-level
  // Company/Consultant tab is switched, so you don't land on
  // "Consultant → Blocked" just because that's where you left off on
  // the Company tab.
  const handleProfileTabChange = (key) => {
    if (key === profileTab) return;
    setProfileTab(key);
    setStatusFilter("all");
  };

  // ─── Client-side search safety net ────────────────────────────
  // Re-applies the debounced search text to whatever rows the server
  // actually returned. If the backend already searches correctly this
  // is a no-op (everything already matches). If it doesn't (wrong
  // param name, search unimplemented for some fields, etc.), the table
  // you see still respects what you typed — this is what guarantees
  // search actually works regardless of backend behavior.
  const filteredData = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return data.filter((c) => {
      if (profileTab !== "all" && c.profile_type !== profileTab) return false;
      if (statusFilter === "trending" && !c.is_trending) return false;
      if (
        statusFilter !== "all" &&
        statusFilter !== "trending" &&
        c.company_status !== statusFilter
      ) {
        return false;
      }
      if (!q) return true;

      const searchFields = [
        c.company_name,
        c.slug,
        c.company_user_email,
        c.industry_name,
        c.company_size_name,
        c.reference_code,
        c.website,
      ];

      // Add all industry names to search
      if (c.Industries && Array.isArray(c.Industries)) {
        c.Industries.forEach((ind) => {
          searchFields.push(ind.industry_name || ind.name);
        });
      }
      if (c.SubIndustries && Array.isArray(c.SubIndustries)) {
        c.SubIndustries.forEach((subIndustry) => {
          searchFields.push(subIndustry.sub_industry_name || subIndustry.name);
        });
      }

      return searchFields
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });
  }, [data, debouncedSearch, profileTab, statusFilter]);

  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * limit, page * limit),
    [filteredData, page, limit],
  );

  const statusCounts = useMemo(() => {
    const counts = {
      all: emptyStatusCounts(),
      company: emptyStatusCounts(),
      consultant: emptyStatusCounts(),
    };

    data.forEach((company) => {
      [counts.all, counts[company.profile_type]].forEach((profileCounts) => {
        if (!profileCounts) return;
        profileCounts.all += 1;
        if (profileCounts[company.company_status] !== undefined) {
          profileCounts[company.company_status] += 1;
        }
        if (company.is_trending) profileCounts.trending += 1;
      });
    });

    return counts;
  }, [data]);

  // ─── Toggle / change handlers ───────────────────────────────────
  const handleCompanyStatusChange = async (id, newStatus) => {
    const prevData = data;
    // Optimistic update so the select reflects the choice immediately
    setData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, company_status: newStatus } : c)),
    );
    setStatusUpdatingId(id);
    try {
      await companyService.update(id, {
        company_status: newStatus,
        updated_by: userId,
      });
      showSuccess(`Company status updated to ${newStatus}`);
      // Silent reload: keeps the row's already-correct optimistic value
      // on screen and just reconciles pagination/filtering in the
      // background (e.g. drops the row if it no longer matches the
      // active tab) without flashing the whole table into a loading
      // state.
      load({ silent: true });
    } catch (err) {
      // Roll back on failure
      setData(prevData);
      showError(err.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleIsStatusToggle = async (id, currentValue) => {
    const newValue = !currentValue;
    try {
      await companyService.update(id, {
        is_status: newValue,
        updated_by: userId,
      });
      showSuccess(
        `Internal status updated to ${newValue ? "active" : "inactive"}`,
      );
      load({ silent: true });
    } catch (err) {
      showError(err.message || "Failed to update internal status");
    }
  };

  const handleTrendingToggle = async (id, currentTrending) => {
    const newTrending = !currentTrending;
    const prevData = data;
    // Optimistic update, same reasoning as status change above
    setData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_trending: newTrending } : c)),
    );
    try {
      await companyService.update(id, {
        is_trending: newTrending,
        updated_by: userId,
      });
      showSuccess(`Trending updated to ${newTrending ? "Yes" : "No"}`);
      load({ silent: true });
    } catch (err) {
      setData(prevData);
      showError(err.message || "Failed to update trending");
    }
  };

  // ─── Navigation ────────────────────────────────────────────────
  const openAdd = () => navigate("/companies/add");
  const openEdit = (item) => navigate(`/companies/edit/${item.id}`);
  const openView = (item) => navigate(`/companies/view/${item.id}`);

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await companyService.delete(deleteId);
      showSuccess("Company deleted successfully");
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.message || "Failed to delete company");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // ─── Status Tabs (scoped to the active profile tab) ─────────────
  // Counts come from `statusCounts[profileTab]` (a dedicated,
  // page/filter-independent fetch) rather than being derived from
  // `data`, which only ever holds the current page's rows. Trending
  // tab visibility is likewise driven by the true total, so it no
  // longer flickers in and out as you page through or switch filters.
  const activeCounts = statusCounts[profileTab] || emptyStatusCounts();
  const hasTrending = activeCounts.trending > 0;
  const tabs = [
    { key: "all", label: "All", count: activeCounts.all },
    { key: "active", label: "Active", count: activeCounts.active },
    { key: "inactive", label: "Inactive", count: activeCounts.inactive },
    { key: "blocked", label: "Blocked", count: activeCounts.blocked },
    { key: "pending", label: "Pending", count: activeCounts.pending },
    ...(hasTrending
      ? [{ key: "trending", label: "Trending", count: activeCounts.trending }]
      : []),
  ];

  // ─── Table Columns ──────────────────────────────────────────────
  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Logo",
      key: "logo",
      render: (logo) =>
        logo ? (
          <img
            src={getImageUrl(logo)}
            alt="logo"
            className="w-9 h-9 object-cover rounded border border-gray-200"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-9 h-9 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        ),
    },
    {
      header: profileTab === "consultant" ? "Consultant" : "Company",
      key: "company_name",
      render: (v, row) => (
        <div>
          <span className="font-medium text-gray-800">{v}</span>
          <div className="text-xs text-gray-400">{row.slug}</div>
          {row.reference_code && (
            <div className="text-xs text-gray-400 font-mono">
              Ref: {row.reference_code}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Email",
      key: "company_user_email",
      render: (v) => <span className="text-sm text-gray-500">{v || "—"}</span>,
    },
    {
      header: "Industries",
      key: "Industries",
      render: (_, row) => {
        const industries = row.Industries || [];
        if (!industries || industries.length === 0) {
          return <span className="text-sm text-gray-400">—</span>;
        }
        return (
          <div className="flex flex-wrap gap-1.5">
            {industries.map((ind, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                title={ind.industry_name || ind.name}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {ind.industry_name || ind.name || "Unknown"}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Size",
      key: "company_size_name",
      render: (v) => <span className="text-sm text-gray-500">{v || "—"}</span>,
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (is_trending, row) => (
        <button
          onClick={() => handleTrendingToggle(row.id, is_trending)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${is_trending ? "bg-amber-500" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${is_trending ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      ),
    },
    {
      header: "Status",
      key: "company_status",
      render: (status, row) => (
        <select
          value={status}
          disabled={statusUpdatingId === row.id}
          onChange={(e) => handleCompanyStatusChange(row.id, e.target.value)}
          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
            STATUS_STYLES[status] || STATUS_STYLES.inactive
          }`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: "Updated By",
      key: "updated_by",
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600 text-sm font-medium">
            {getUpdatedByName(row)}
          </span>
        </div>
      ),
    },
    // {
    //   header: "Updated At",
    //   key: "updated_at",
    //   render: (_, row) => {
    //     const date = row.updated_at || row.updatedAt;
    //     return (
    //       <span className="text-gray-500 text-sm">{formatDate(date)}</span>
    //     );
    //   },
    // },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="Edit"
          > 
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => setDeleteId(id)}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            title="Delete"
          >
            <MdDelete size={16} />
          </button>
        </div>
      ),
    },
  ];

  // ─── Error display ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage registered companies
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to Load Companies
          </h3>
          <p className="text-gray-600 max-w-md mx-auto whitespace-pre-line">
            {error}
          </p>
          <button
            onClick={load}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage registered companies and consultants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={MdRefresh}
            onClick={() => {
              load();
              loadStatusCounts();
            }}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={openAdd}>
            Add Company
          </Button>
        </div>
      </div>

      {/* Top-level Company / Consultant tabs */}
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-full sm:w-fit">
        {PROFILE_TYPES.map(({ key, label, icon: Icon }) => {
          const isActive = profileTab === key;
          const count = statusCounts[key]?.all ?? 0;
          return (
            <button
              key={key}
              onClick={() => handleProfileTabChange(key)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 sm:flex-initial ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top bar with search and status tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <MdSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${profileTab === "consultant" ? "consultants" : "companies"}...`}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key
                    ? tab.key === "trending"
                      ? "text-amber-600"
                      : "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
                      ? tab.key === "trending"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage={
            profileTab === "consultant"
              ? "No consultants found"
              : "No companies found"
          }
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length}{" "}
            {profileTab === "consultant" ? "consultants" : "companies"}
          </p>
          <Pagination
            page={page}
            total={filteredData.length}
            limit={limit}
            onChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Company"
        message="Delete this company? This action cannot be undone."
      />
    </div>
  );
};

export default Companies;
