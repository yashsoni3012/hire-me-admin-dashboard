// import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import jobService, {
//   companyService,
//   jobTypeService,
//   workplaceTypeService,
//   functionRoleService,
// } from "../../services/job.service";
// import companyUserService from "../../services/company.service";
// import { showSuccess, showError } from "../../utils/toast";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdRefresh,
//   MdDateRange,
// } from "react-icons/md";
// import { formatDate } from "../../utils/helpers";
// import { useAuth } from "../../context/AuthContext";

// const Jobs = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const userId = user?.id;

//   // ─── Pagination & Filters ──────────────────────────────────────
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
  
//   // Search state
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
  
//   // Status filter
//   const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive" | "trending"
  
//   // ─── Date Range Filter ─────────────────────────────────────────
//   const [dateFilterType, setDateFilterType] = useState("all"); // "all" | "today" | "week" | "month" | "custom"
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   // ─── Data & UI state ──────────────────────────────────────────
//   const [jobs, setJobs] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [userNameCache, setUserNameCache] = useState({});
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const requestIdRef = useRef(0);

//   // ─── Debounce search ───────────────────────────────────────────
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [search]);

//   // ─── User name cache ──────────────────────────────────────────
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || "-";
//   };

//   const getUpdatedByName = (row) => {
//     if (!row) return "-";
//     if (row.updated_by_name !== undefined) {
//       return row.updated_by_name?.trim() || "-";
//     }
//     return row.updated_by ? getUserNameCached(row.updated_by) : "-";
//   };

//   // ─── Helper: Parse API date format "DD/MM/YYYY, HH:MM:SS am/pm" ──
//   const parseApiDate = (dateString) => {
//     if (!dateString) return null;

//     // Handle "DD/MM/YYYY, HH:MM:SS am/pm" format
//     const match = dateString.match(
//       /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i
//     );
//     if (match) {
//       let [_, day, month, year, hours, minutes, seconds, ampm] = match;
//       hours = parseInt(hours);
//       if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
//       if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
//       return new Date(
//         parseInt(year),
//         parseInt(month) - 1,
//         parseInt(day),
//         hours,
//         parseInt(minutes),
//         parseInt(seconds)
//       );
//     }

//     // Fallback for ISO or other formats
//     const d = new Date(dateString);
//     return !isNaN(d) ? d : null;
//   };

//   // ─── Get date range for filter ──────────────────────────────────
//   const getDateRange = (filterType) => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
//     switch (filterType) {
//       case "today": {
//         const start = new Date(today);
//         const end = new Date(today);
//         end.setHours(23, 59, 59, 999);
//         return { start, end };
//       }
//       case "week": {
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - today.getDay());
//         weekStart.setHours(0, 0, 0, 0);
//         const end = new Date(today);
//         end.setHours(23, 59, 59, 999);
//         return { start: weekStart, end };
//       }
//       case "month": {
//         const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
//         monthStart.setHours(0, 0, 0, 0);
//         const end = new Date(today);
//         end.setHours(23, 59, 59, 999);
//         return { start: monthStart, end };
//       }
//       case "custom": {
//         if (startDate && endDate) {
//           const start = new Date(startDate);
//           start.setHours(0, 0, 0, 0);
//           const end = new Date(endDate);
//           end.setHours(23, 59, 59, 999);
//           return { start, end };
//         }
//         return { start: null, end: null };
//       }
//       default:
//         return { start: null, end: null };
//     }
//   };

//   // ─── Normalize job object ──────────────────────────────────────
//   const normalizeJob = (item) => ({
//     id: item.id,
//     title: item.title || "",
//     job_description: item.job_description || "",
//     company_id: item.company_id || item.Company?.company_id || null,
//     company_name: item.Company?.company_name || "",
//     jobtype_id: item.jobtype_id || item.JobType?.jobtype_id || null,
//     jobtype_name: item.JobType?.name || "",
//     workplacetype_id:
//       item.workplacetype_id || item.WorkplaceType?.workplacetype_id || null,
//     workplacetype_name: item.WorkplaceType?.name || "",
//     functionrole_id:
//       item.functionrole_id || item.FunctionRole?.functionrole_id || null,
//     functionrole_name: item.FunctionRole?.name || "",
//     experience_min: item.experience_min ?? "",
//     experience_max: item.experience_max ?? "",
//     salary_min: item.salary_min ?? "",
//     salary_max: item.salary_max ?? "",
//     job_status: item.job_status || "draft",
//     expiry_date: item.expiry_date || "",
//     is_trending:
//       item.is_trending === true ||
//       item.is_trending === "true" ||
//       item.is_trending === 1,
//     is_status:
//       item.is_status === true ||
//       item.is_status === "true" ||
//       item.is_status === 1,
//     created_at: item.created_at || null,
//     updated_at: item.updated_at || null,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     updated_by_name: item.Company?.CompanyUser
//       ? item.Company.CompanyUser.full_name
//       : item.CompanyUser
//         ? item.CompanyUser.full_name
//         : item.updated_by_name,
//   });

//   // ─── Load jobs with pagination and filters ──────────────────────
//   const load = useCallback(async ({ silent = false } = {}) => {
//     const requestId = ++requestIdRef.current;
//     if (!silent) setLoading(true);
//     setError(null);
    
//     try {
//       // Load company users for "Updated By"
//       const usersResponse = await companyUserService.getCompanyUsers();
//       const users =
//         usersResponse?.data?.data || usersResponse?.data || usersResponse || [];
//       const userMap = {};
//       const userList = Array.isArray(users) ? users : users ? [users] : [];
//       userList.forEach((companyUser) => {
//         const id =
//           companyUser.user_id || companyUser.id || companyUser.company_user_id;
//         if (id) {
//           userMap[id] = companyUser.full_name?.trim() || null;
//         }
//       });
//       setUserNameCache(userMap);

//       // Build query parameters
//       const params = {
//         page: 1,
//         limit: 1000, // Fetch all for client-side filtering
//       };
      
//       // Search filter
//       if (debouncedSearch) {
//         params.search = debouncedSearch;
//       }
      
//       // Status filter
//       if (statusFilter === "active") {
//         params.is_status = true;
//       } else if (statusFilter === "inactive") {
//         params.is_status = false;
//       } else if (statusFilter === "trending") {
//         params.is_trending = true;
//       }

//       console.log("Fetching jobs with params:", params);

//       const response = await jobService.getAll(params);
      
//       // Ignore stale response
//       if (requestIdRef.current !== requestId) return;

//       console.log("API Response:", response);

//       // Extract data properly
//       let rawData = [];
//       let totalItems = 0;
      
//       if (response?.data?.data) {
//         rawData = response.data.data;
//         totalItems = response.data.pagination?.total || response.data.total || rawData.length;
//       } else if (response?.data) {
//         rawData = response.data;
//         totalItems = response.pagination?.total || response.total || rawData.length;
//       } else if (Array.isArray(response)) {
//         rawData = response;
//         totalItems = rawData.length;
//       }

//       const items = Array.isArray(rawData) ? rawData.map(normalizeJob) : [];

//       setJobs(items);
//       setTotal(totalItems);
//     } catch (err) {
//       if (requestIdRef.current !== requestId) return;
//       console.error("Load jobs error:", err);
//       let errorMessage = "Failed to load jobs";
//       if (err.message?.includes("NetworkError") || err.message?.includes("Failed to fetch")) {
//         errorMessage = "Network error: Unable to connect to the server.";
//       } else if (err.status === 401 || err.status === 403) {
//         errorMessage = "Access denied. Please log in again.";
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
//       setError(errorMessage);
//       showError(errorMessage);
//     } finally {
//       if (requestIdRef.current === requestId && !silent) setLoading(false);
//     }
//   }, [debouncedSearch, statusFilter]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   // Reset page when search or filter changes
//   useEffect(() => {
//     setPage(1);
//   }, [debouncedSearch, statusFilter, dateFilterType, startDate, endDate]);

//   // ─── Client-side filtering ──────────────────────────────────────
//   const filteredData = useMemo(() => {
//     let result = [...jobs];

//     // Search filter (client-side fallback)
//     const query = debouncedSearch.toLowerCase();
//     if (query) {
//       result = result.filter(
//         (j) =>
//           j.title.toLowerCase().includes(query) ||
//           (j.company_name && j.company_name.toLowerCase().includes(query)) ||
//           (j.jobtype_name && j.jobtype_name.toLowerCase().includes(query)) ||
//           (j.job_status && j.job_status.toLowerCase().includes(query))
//       );
//     }

//     // Status filter
//     if (statusFilter === "active") {
//       result = result.filter((j) => j.is_status === true);
//     } else if (statusFilter === "inactive") {
//       result = result.filter((j) => j.is_status === false);
//     } else if (statusFilter === "trending") {
//       result = result.filter((j) => j.is_trending === true);
//     }

//     // ─── FIXED: Date filter using the parseApiDate helper ──────
//     const dateRange = getDateRange(dateFilterType);
//     if (dateRange.start && dateRange.end) {
//       const { start, end } = dateRange;
//       result = result.filter((j) => {
//         // Use the `updated_at` field and parse it
//         const jobDate = parseApiDate(j.updated_at);
//         if (!jobDate) return false;
//         return jobDate >= start && jobDate <= end;
//       });
//     }

//     return result;
//   }, [jobs, debouncedSearch, statusFilter, dateFilterType, startDate, endDate]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   // ─── Compute counts ────────────────────────────────────────────
//   const activeCount = jobs.filter((j) => j.is_status === true).length;
//   const inactiveCount = jobs.length - activeCount;
//   const trendingCount = jobs.filter((j) => j.is_trending === true).length;
//   const hasTrending = trendingCount > 0;

//   const tabs = [
//     { key: "all", label: "All", count: jobs.length },
//     { key: "active", label: "Active", count: activeCount },
//     { key: "inactive", label: "Inactive", count: inactiveCount },
//     ...(hasTrending
//       ? [{ key: "trending", label: "Trending", count: trendingCount }]
//       : []),
//   ];

//   // ─── Date filter options ──────────────────────────────────────
//   const dateFilterOptions = [
//     { key: "all", label: "All Time" },
//     { key: "today", label: "Today" },
//     { key: "week", label: "This Week" },
//     { key: "month", label: "This Month" },
//     { key: "custom", label: "Custom Range" },
//   ];

//   // ─── Handlers ──────────────────────────────────────────────────
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       try {
//         await jobService.deleteJobBenefits(deleteId);
//       } catch (benefitErr) {
//         console.log("No benefits to delete or already deleted");
//       }
//       await jobService.delete(deleteId);
//       showSuccess("Job deleted successfully");
//       load();
//     } catch (err) {
//       console.error("Delete error:", err);
//       showError(err.response?.data?.message || "Failed to delete");
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   const handleTrendingToggle = async (id, current) => {
//     const newVal = !current;
//     try {
//       await jobService.update(id, {
//         is_trending: newVal,
//         updated_by: userId,
//       });
//       showSuccess(`Trending updated to ${newVal ? "Yes" : "No"}`);
//       load({ silent: true });
//     } catch (err) {
//       showError(err.response?.data?.message || "Failed to update trending");
//     }
//   };

//   const handleStatusToggle = async (id, current) => {
//     const newVal = !current;
//     try {
//       await jobService.update(id, {
//         is_status: newVal,
//         updated_by: userId,
//       });
//       showSuccess(`Status updated to ${newVal ? "Active" : "Inactive"}`);
//       load({ silent: true });
//     } catch (err) {
//       showError(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   const handleDateFilterChange = (key) => {
//     setDateFilterType(key);
//     if (key !== "custom") {
//       setStartDate("");
//       setEndDate("");
//       setShowDatePicker(false);
//     } else {
//       setShowDatePicker(true);
//     }
//   };

//   const clearDateFilter = () => {
//     setDateFilterType("all");
//     setStartDate("");
//     setEndDate("");
//     setShowDatePicker(false);
//   };

//   // ─── Table Columns ──────────────────────────────────────────────
//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1,
//     },
//     {
//       header: "Title",
//       key: "title",
//       render: (v) => <span className="font-medium text-gray-800">{v}</span>,
//     },
//     {
//       header: "Company",
//       key: "company_name",
//       render: (v) => <span className="text-gray-600">{v || "—"}</span>,
//     },
//     {
//       header: "Job Type",
//       key: "jobtype_name",
//       render: (v) => <span className="text-gray-600">{v || "—"}</span>,
//     },
//     {
//       header: "Workplace",
//       key: "workplacetype_name",
//       render: (v) => <span className="text-gray-600">{v || "—"}</span>,
//     },
//     {
//       header: "Status",
//       key: "job_status",
//       render: (v) => (
//         <span
//           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//             v === "published"
//               ? "bg-green-100 text-green-800"
//               : v === "draft"
//                 ? "bg-gray-100 text-gray-800"
//                 : "bg-yellow-100 text-yellow-800"
//           }`}
//         >
//           {v}
//         </span>
//       ),
//     },
//     {
//       header: "Trending",
//       key: "is_trending",
//       render: (val, row) => (
//         <button
//           onClick={() => handleTrendingToggle(row.id, val)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             val ? "bg-amber-500" : "bg-gray-300"
//           }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
//               val ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Active",
//       key: "is_status",
//       render: (val, row) => (
//         <button
//           onClick={() => handleStatusToggle(row.id, val)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             val ? "bg-[#2c0eee]" : "bg-gray-300"
//           }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
//               val ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Updated By",
//       key: "updated_by",
//       render: (_, row) => (
//         <span className="text-gray-600 text-sm font-medium">
//           {getUpdatedByName(row)}
//         </span>
//       ),
//     },
//     {
//       header: "Updated At",
//       key: "updated_at",
//       render: (v) => (
//         <span className="text-gray-500 text-sm">{formatDate(v)}</span>
//       ),
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1 justify-end">
//           <button
//             onClick={() =>
//               navigate(`/jobs/view/${row.id}`, { state: { item: row } })
//             }
//             className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
//             title="View"
//           >
//             <MdVisibility size={16} />
//           </button>
//           <button
//             onClick={() =>
//               navigate(`/jobs/edit/${row.id}`, { state: { item: row } })
//             }
//             className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
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
//             <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
//             <p className="text-sm text-gray-500 mt-1">Manage job listings</p>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden p-8 text-center">
//           <div className="text-red-500 mb-4">
//             <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Jobs</h3>
//           <p className="text-gray-600 max-w-md mx-auto whitespace-pre-line">{error}</p>
//           <button onClick={() => load()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
//           <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage job listings</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="secondary"
//             icon={MdRefresh}
//             onClick={() => load()}
//             loading={loading}
//           >
//             Refresh
//           </Button>
//           <Button icon={MdAdd} onClick={() => navigate("/jobs/add")}>
//             Add Job
//           </Button>
//         </div>
//       </div>

//       {/* Table Card */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         {/* Top bar: search + status tabs + date filter */}
//         <div className="flex flex-col gap-3 px-5 py-4 border-b border-gray-100">
//           {/* Search and Refresh Row */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//             <div className="relative w-full sm:w-72">
//               <MdSearch
//                 size={18}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by title, company, type, status..."
//                 className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//               />
//             </div>

//             {/* Date Filter */}
//             <div className="flex items-center gap-2 flex-wrap">
//               <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-200">
//                 <MdDateRange size={16} className="text-gray-500 ml-2" />
//                 {dateFilterOptions.map((opt) => (
//                   <button
//                     key={opt.key}
//                     onClick={() => handleDateFilterChange(opt.key)}
//                     className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
//                       dateFilterType === opt.key
//                         ? "bg-[#2c0eee] text-white"
//                         : "text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//               </div>

//               {/* Custom Date Range Picker */}
//               {showDatePicker && (
//                 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
//                   <input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
//                     placeholder="Start Date"
//                   />
//                   <span className="text-gray-400">to</span>
//                   <input
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
//                     placeholder="End Date"
//                   />
//                   <button
//                     onClick={clearDateFilter}
//                     className="text-gray-400 hover:text-gray-600 text-sm"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               )}

//               {/* Active date filter indicator */}
//               {dateFilterType !== "all" && (
//                 <span className="text-xs text-[#2c0eee] font-medium bg-blue-50 px-2 py-1 rounded-full">
//                   {dateFilterType === "custom" 
//                     ? `${startDate || "..."} → ${endDate || "..."}`
//                     : dateFilterOptions.find(opt => opt.key === dateFilterType)?.label}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Status Tabs */}
//           <div className="flex items-center gap-5 text-sm flex-wrap">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${
//                   statusFilter === tab.key
//                     ? tab.key === "trending"
//                       ? "text-amber-600"
//                       : "text-[#2c0eee]"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 {tab.label}
//                 <span
//                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
//                     statusFilter === tab.key
//                       ? tab.key === "trending"
//                         ? "bg-amber-50 text-amber-600"
//                         : "bg-blue-50 text-[#2c0eee]"
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
//           emptyMessage="No jobs found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of {filteredData.length} jobs
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
//         title="Delete Job"
//         message="Delete this job? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default Jobs;


import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import jobService from "../../services/job.service";
import companyUserService from "../../services/company.service";
import { showSuccess, showError } from "../../utils/toast";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdRefresh,
  MdDateRange,
} from "react-icons/md";
import { formatDate } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

const Jobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  // ─── Pagination & Filters ──────────────────────────────────────
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Status filter
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive" | "trending"

  // ─── Date Range Filter ─────────────────────────────────────────
  const [dateFilterType, setDateFilterType] = useState("all"); // "all" | "today" | "week" | "month" | "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ─── Data & UI state ──────────────────────────────────────────
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userNameCache, setUserNameCache] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  // ─── Debounce search ───────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ─── User name cache ──────────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || "-";
  };

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by_name !== undefined) {
      return row.updated_by_name?.trim() || "-";
    }
    return row.updated_by ? getUserNameCached(row.updated_by) : "-";
  };

  // ─── Helper: Parse API date format "DD/MM/YYYY, HH:MM:SS am/pm" ──
  const parseApiDate = (dateString) => {
    if (!dateString) return null;

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

  // ─── Get date range for filter ──────────────────────────────────
  const getDateRange = (filterType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filterType) {
      case "today": {
        const start = new Date(today);
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      case "week": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        return { start: weekStart, end };
      }
      case "month": {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        return { start: monthStart, end };
      }
      case "custom": {
        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return { start, end };
        }
        return { start: null, end: null };
      }
      default:
        return { start: null, end: null };
    }
  };

  // ─── Normalize job object ──────────────────────────────────────
  const normalizeJob = (item) => ({
    id: item.id,
    title: item.title || "",
    job_description: item.job_description || "",
    company_id: item.company_id || item.Company?.company_id || null,
    company_name: item.Company?.company_name || "",
    jobtype_id: item.jobtype_id || item.JobType?.jobtype_id || null,
    jobtype_name: item.JobType?.name || "",
    workplacetype_id:
      item.workplacetype_id || item.WorkplaceType?.workplacetype_id || null,
    workplacetype_name: item.WorkplaceType?.name || "",
    functionrole_id:
      item.functionrole_id || item.FunctionRole?.functionrole_id || null,
    functionrole_name: item.FunctionRole?.name || "",
    experience_min: item.experience_min ?? "",
    experience_max: item.experience_max ?? "",
    salary_min: item.salary_min ?? "",
    salary_max: item.salary_max ?? "",
    job_status: item.job_status || "draft",
    expiry_date: item.expiry_date || "",
    is_trending:
      item.is_trending === true ||
      item.is_trending === "true" ||
      item.is_trending === 1,
    is_status:
      item.is_status === true ||
      item.is_status === "true" ||
      item.is_status === 1,
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    updated_by_name: item.Company?.CompanyUser
      ? item.Company.CompanyUser.full_name
      : item.CompanyUser
        ? item.CompanyUser.full_name
        : item.updated_by_name,
  });

  // ─── Load jobs with pagination ──────────────────────────────────
  // FIX: Only `search` is sent to the API. Status / trending filters
  // are applied client-side on the full dataset so the tab counts
  // stay accurate and switching tabs never narrows the base data.
  const load = useCallback(
    async ({ silent = false } = {}) => {
      const requestId = ++requestIdRef.current;
      if (!silent) setLoading(true);
      setError(null);

      try {
        // Load company users for "Updated By"
        const usersResponse = await companyUserService.getCompanyUsers();
        const users =
          usersResponse?.data?.data ||
          usersResponse?.data ||
          usersResponse ||
          [];
        const userMap = {};
        const userList = Array.isArray(users) ? users : users ? [users] : [];
        userList.forEach((companyUser) => {
          const id =
            companyUser.user_id ||
            companyUser.id ||
            companyUser.company_user_id;
          if (id) {
            userMap[id] = companyUser.full_name?.trim() || null;
          }
        });
        setUserNameCache(userMap);

        // Build first-page params — search only, no status filters
        const PER_PAGE = 20;
        const firstParams = {
          page: 1,
          limit: PER_PAGE,
        };
        if (debouncedSearch) {
          firstParams.search = debouncedSearch;
        }

        console.log("Fetching jobs with params:", firstParams);

        // 1️⃣ Fetch the first page
        const firstResponse = await jobService.getAll(firstParams);
        if (requestIdRef.current !== requestId) return;

        let firstRaw = [];
        let totalItems = 0;
        let totalPages = 1;

        if (firstResponse?.data?.data) {
          firstRaw = firstResponse.data.data;
          totalItems =
            firstResponse.data.pagination?.total ||
            firstResponse.data.total ||
            firstRaw.length;
          totalPages =
            firstResponse.data.pagination?.totalPages ||
            firstResponse.data.totalPages ||
            Math.ceil(totalItems / PER_PAGE);
        } else if (firstResponse?.data) {
          firstRaw = firstResponse.data;
          totalItems =
            firstResponse.pagination?.total ||
            firstResponse.total ||
            firstRaw.length;
          totalPages =
            firstResponse.pagination?.totalPages ||
            firstResponse.totalPages ||
            Math.ceil(totalItems / PER_PAGE);
        } else if (Array.isArray(firstResponse)) {
          firstRaw = firstResponse;
          totalItems = firstRaw.length;
          totalPages = 1;
        }

        let allRaw = Array.isArray(firstRaw) ? [...firstRaw] : [];

        // 2️⃣ Loop through remaining pages (if any)
        if (totalPages > 1) {
          const pageRequests = [];
          for (let p = 2; p <= totalPages; p++) {
            pageRequests.push(
              jobService.getAll({ ...firstParams, page: p, limit: PER_PAGE }),
            );
          }

          const pageResponses = await Promise.all(pageRequests);
          if (requestIdRef.current !== requestId) return;

          pageResponses.forEach((resp) => {
            let pageRaw = [];
            if (resp?.data?.data) {
              pageRaw = resp.data.data;
            } else if (resp?.data) {
              pageRaw = resp.data;
            } else if (Array.isArray(resp)) {
              pageRaw = resp;
            }
            if (Array.isArray(pageRaw)) {
              allRaw.push(...pageRaw);
            }
          });
        }

        // 3️⃣ Normalize and store
        const items = Array.isArray(allRaw) ? allRaw.map(normalizeJob) : [];
        setJobs(items);
        setTotal(totalItems);
      } catch (err) {
        if (requestIdRef.current !== requestId) return;
        console.error("Load jobs error:", err);
        let errorMessage = "Failed to load jobs";
        if (
          err.message?.includes("NetworkError") ||
          err.message?.includes("Failed to fetch")
        ) {
          errorMessage = "Network error: Unable to connect to the server.";
        } else if (err.status === 401 || err.status === 403) {
          errorMessage = "Access denied. Please log in again.";
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        if (requestIdRef.current === requestId && !silent) setLoading(false);
      }
    },
    [debouncedSearch], // FIX: removed statusFilter from deps
  );

  useEffect(() => {
    load();
  }, [load]);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, dateFilterType, startDate, endDate]);

  // ─── Client-side filtering ──────────────────────────────────────
  const filteredData = useMemo(() => {
    let result = [...jobs];

    // Search filter (client-side fallback)
    const query = debouncedSearch.toLowerCase();
    if (query) {
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          (j.company_name && j.company_name.toLowerCase().includes(query)) ||
          (j.jobtype_name && j.jobtype_name.toLowerCase().includes(query)) ||
          (j.job_status && j.job_status.toLowerCase().includes(query)),
      );
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((j) => j.is_status === true);
    } else if (statusFilter === "inactive") {
      result = result.filter((j) => j.is_status === false);
    } else if (statusFilter === "trending") {
      result = result.filter((j) => j.is_trending === true);
    }

    // Date filter
    const dateRange = getDateRange(dateFilterType);
    if (dateRange.start && dateRange.end) {
      const { start, end } = dateRange;
      result = result.filter((j) => {
        const jobDate = parseApiDate(j.updated_at);
        if (!jobDate) return false;
        return jobDate >= start && jobDate <= end;
      });
    }

    return result;
  }, [jobs, debouncedSearch, statusFilter, dateFilterType, startDate, endDate]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  // ─── Compute counts (from full dataset) ────────────────────────
  const activeCount = jobs.filter((j) => j.is_status === true).length;
  const inactiveCount = jobs.filter((j) => j.is_status === false).length;
  const trendingCount = jobs.filter((j) => j.is_trending === true).length;
  const hasTrending = trendingCount > 0;

  const tabs = [
    { key: "all", label: "All", count: jobs.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
    ...(hasTrending
      ? [{ key: "trending", label: "Trending", count: trendingCount }]
      : []),
  ];

  // ─── Date filter options ──────────────────────────────────────
  const dateFilterOptions = [
    { key: "all", label: "All Time" },
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "custom", label: "Custom Range" },
  ];

  // ─── Handlers ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      try {
        await jobService.deleteJobBenefits(deleteId);
      } catch (benefitErr) {
        console.log("No benefits to delete or already deleted");
      }
      await jobService.delete(deleteId);
      showSuccess("Job deleted successfully");
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleTrendingToggle = async (id, current) => {
    const newVal = !current;
    try {
      await jobService.update(id, {
        is_trending: newVal,
        updated_by: userId,
      });
      showSuccess(`Trending updated to ${newVal ? "Yes" : "No"}`);
      load({ silent: true });
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update trending");
    }
  };

  const handleStatusToggle = async (id, current) => {
    const newVal = !current;
    try {
      await jobService.update(id, {
        is_status: newVal,
        updated_by: userId,
      });
      showSuccess(`Status updated to ${newVal ? "Active" : "Inactive"}`);
      load({ silent: true });
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDateFilterChange = (key) => {
    setDateFilterType(key);
    if (key !== "custom") {
      setStartDate("");
      setEndDate("");
      setShowDatePicker(false);
    } else {
      setShowDatePicker(true);
    }
  };

  const clearDateFilter = () => {
    setDateFilterType("all");
    setStartDate("");
    setEndDate("");
    setShowDatePicker(false);
  };

  // ─── Table Columns ──────────────────────────────────────────────
  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Title",
      key: "title",
      render: (v) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      header: "Company",
      key: "company_name",
      render: (v) => <span className="text-gray-600">{v || "—"}</span>,
    },
    {
      header: "Job Type",
      key: "jobtype_name",
      render: (v) => <span className="text-gray-600">{v || "—"}</span>,
    },
    {
      header: "Workplace",
      key: "workplacetype_name",
      render: (v) => <span className="text-gray-600">{v || "—"}</span>,
    },
    {
      header: "Status",
      key: "job_status",
      render: (v) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            v === "published"
              ? "bg-green-100 text-green-800"
              : v === "draft"
                ? "bg-gray-100 text-gray-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {v}
        </span>
      ),
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (val, row) => (
        <button
          onClick={() => handleTrendingToggle(row.id, val)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            val ? "bg-amber-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
              val ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      header: "Active",
      key: "is_status",
      render: (val, row) => (
        <button
          onClick={() => handleStatusToggle(row.id, val)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            val ? "bg-[#2c0eee]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
              val ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      header: "Updated By",
      key: "updated_by",
      render: (_, row) => (
        <span className="text-gray-600 text-sm font-medium">
          {getUpdatedByName(row)}
        </span>
      ),
    },
    {
      header: "Updated At",
      key: "updated_at",
      render: (v) => (
        <span className="text-gray-500 text-sm">{formatDate(v)}</span>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={() =>
              navigate(`/jobs/view/${row.id}`, { state: { item: row } })
            }
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() =>
              navigate(`/jobs/edit/${row.id}`, { state: { item: row } })
            }
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
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
            <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
            <p className="text-sm text-gray-500 mt-1">Manage job listings</p>
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
            Failed to Load Jobs
          </h3>
          <p className="text-gray-600 max-w-md mx-auto whitespace-pre-line">
            {error}
          </p>
          <button
            onClick={() => load()}
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
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={MdRefresh}
            onClick={() => load()}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={() => navigate("/jobs/add")}>
            Add Job
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top bar: search + status tabs + date filter */}
        <div className="flex flex-col gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <MdSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, company, type, status..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
              />
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-200">
                <MdDateRange size={16} className="text-gray-500 ml-2" />
                {dateFilterOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleDateFilterChange(opt.key)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      dateFilterType === opt.key
                        ? "bg-[#2c0eee] text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {showDatePicker && (
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
                    placeholder="Start Date"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
                    placeholder="End Date"
                  />
                  <button
                    onClick={clearDateFilter}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}

              {dateFilterType !== "all" && (
                <span className="text-xs text-[#2c0eee] font-medium bg-blue-50 px-2 py-1 rounded-full">
                  {dateFilterType === "custom"
                    ? `${startDate || "..."} → ${endDate || "..."}`
                    : dateFilterOptions.find(
                        (opt) => opt.key === dateFilterType,
                      )?.label}
                </span>
              )}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-5 text-sm flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key
                    ? tab.key === "trending"
                      ? "text-amber-600"
                      : "text-[#2c0eee]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
                      ? tab.key === "trending"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-blue-50 text-[#2c0eee]"
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
          emptyMessage="No jobs found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} jobs
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
        title="Delete Job"
        message="Delete this job? This action cannot be undone."
      />
    </div>
  );
};

export default Jobs;