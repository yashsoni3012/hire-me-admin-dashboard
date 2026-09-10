// // pages/Jobs.jsx
// import React, { useState, useEffect, useMemo } from "react";
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
// import { showSuccess, showError } from "../../utils/toast";
// import { MdAdd, MdEdit, MdDelete, MdSearch, MdVisibility } from "react-icons/md";
// import { formatDate } from "../../utils/helpers";
// import { useAuth } from "../../context/AuthContext";
// import { fetchUsers } from "../../utils/getUserName";

// const Jobs = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const userId = user?.id;

//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userNameCache, setUserNameCache] = useState({});

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");

//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   const getUpdatedByName = (row) => {
//     if (!row) return "-";
//     if (row.updated_by) {
//       return getUserNameCached(row.updated_by);
//     }
//     return "-";
//   };

//   const normalizeJob = (item) => ({
//     id: item.id,
//     title: item.title || "",
//     job_description: item.job_description || "",
//     company_id: item.company_id || item.Company?.company_id || null,
//     company_name: item.Company?.company_name || "",
//     jobtype_id: item.jobtype_id || item.JobType?.jobtype_id || null,
//     jobtype_name: item.JobType?.name || "",
//     workplacetype_id: item.workplacetype_id || item.WorkplaceType?.workplacetype_id || null,
//     workplacetype_name: item.WorkplaceType?.name || "",
//     functionrole_id: item.functionrole_id || item.FunctionRole?.functionrole_id || null,
//     functionrole_name: item.FunctionRole?.name || "",
//     experience_min: item.experience_min ?? "",
//     experience_max: item.experience_max ?? "",
//     salary_min: item.salary_min ?? "",
//     salary_max: item.salary_max ?? "",
//     job_status: item.job_status || "draft",
//     expiry_date: item.expiry_date || "",
//     is_trending: item.is_trending === true || item.is_trending === "true" || item.is_trending === 1,
//     is_status: item.is_status === true || item.is_status === "true" || item.is_status === 1,
//     created_at: item.created_at || null,
//     updated_at: item.updated_at || null,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//   });

//   const loadJobs = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach(id => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);

//       const r = await jobService.getAll();
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const items = Array.isArray(rawData) ? rawData.map(normalizeJob) : [];
//       setJobs(items);
//     } catch (err) {
//       console.error("Load jobs error:", err);
//       showError(err.response?.data?.message || "Failed to load jobs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadJobs();
//   }, []);

//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   const filteredData = useMemo(() => {
//     let result = jobs;

//     if (statusFilter === "active") {
//       result = result.filter((j) => j.is_status === true);
//     } else if (statusFilter === "inactive") {
//       result = result.filter((j) => j.is_status === false);
//     } else if (statusFilter === "trending") {
//       result = result.filter((j) => j.is_trending === true);
//     }

//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter(
//         (j) =>
//           j.title.toLowerCase().includes(query) ||
//           (j.company_name && j.company_name.toLowerCase().includes(query))
//       );
//     }
//     return result;
//   }, [jobs, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = jobs.filter((j) => j.is_status === true).length;
//   const inactiveCount = jobs.length - activeCount;
//   const trendingCount = jobs.filter((j) => j.is_trending === true).length;
//   const hasTrending = trendingCount > 0;

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
//       loadJobs();
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
//         updated_by: userId
//       });
//       showSuccess(`Trending updated to ${newVal ? "Yes" : "No"}`);
//       loadJobs();
//     } catch (err) {
//       showError(err.response?.data?.message || "Failed to update trending");
//     }
//   };

//   const handleStatusToggle = async (id, current) => {
//     const newVal = !current;
//     try {
//       await jobService.update(id, {
//         is_status: newVal,
//         updated_by: userId
//       });
//       showSuccess(`Status updated to ${newVal ? "Active" : "Inactive"}`);
//       loadJobs();
//     } catch (err) {
//       showError(err.response?.data?.message || "Failed to update status");
//     }
//   };

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
//         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${v === "published" ? "bg-green-100 text-green-800" :
//             v === "draft" ? "bg-gray-100 text-gray-800" :
//               "bg-yellow-100 text-yellow-800"
//           }`}>
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
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${val ? "bg-amber-500" : "bg-gray-300"
//             }`}
//         >
//           <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${val ? "translate-x-6" : "translate-x-1"
//             }`} />
//         </button>
//       ),
//     },
//     {
//       header: "Active",
//       key: "is_status",
//       render: (val, row) => (
//         <button
//           onClick={() => handleStatusToggle(row.id, val)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${val ? "bg-[#2c0eee]" : "bg-gray-300"
//             }`}
//         >
//           <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${val ? "translate-x-6" : "translate-x-1"
//             }`} />
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
//       render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1 justify-end">
//           <button
//             onClick={() => navigate(`/jobs/view/${row.id}`, { state: { item: row } })}
//             className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
//             title="View"
//           >
//             <MdVisibility size={16} />
//           </button>
//           <button
//             onClick={() => navigate(`/jobs/edit/${row.id}`, { state: { item: row } })}
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

//   const tabs = [
//     { key: "all", label: "All", count: jobs.length },
//     { key: "active", label: "Active", count: activeCount },
//     { key: "inactive", label: "Inactive", count: inactiveCount },
//     ...(hasTrending ? [{ key: "trending", label: "Trending", count: trendingCount }] : []),
//   ];

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage job listings</p>
//         </div>
//         <Button icon={MdAdd} onClick={() => navigate('/jobs/add')}>
//           Add Job
//         </Button>
//       </div>

//       {/* Table Card */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
//           <div className="relative w-full sm:w-72">
//             <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search by title or company..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-5 text-sm flex-wrap">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key
//                     ? tab.key === "trending" ? "text-amber-600" : "text-[#2c0eee]"
//                     : "text-gray-500 hover:text-gray-700"
//                   }`}
//               >
//                 {tab.label}
//                 <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
//                     ? tab.key === "trending" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-[#2c0eee]"
//                     : "bg-gray-100 text-gray-500"
//                   }`}>
//                   {tab.count}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <Table columns={columns} data={paginatedData} loading={loading} emptyMessage="No jobs found" />

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

// pages/Jobs.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import jobService, {
  companyService,
  jobTypeService,
  workplaceTypeService,
  functionRoleService,
} from "../../services/job.service";
import companyUserService from "../../services/company.service";
import { showSuccess, showError } from "../../utils/toast";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive" | "trending"

  // ─── Data & UI state ──────────────────────────────────────────
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userNameCache, setUserNameCache] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // ─── Load users and jobs with pagination ──────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load company users for "Updated By"
      const usersResponse = await companyUserService.getCompanyUsers();
      const users =
        usersResponse?.data?.data || usersResponse?.data || usersResponse || [];
      const userMap = {};
      const userList = Array.isArray(users) ? users : users ? [users] : [];
      userList.forEach((companyUser) => {
        const id =
          companyUser.user_id || companyUser.id || companyUser.company_user_id;
        if (id) {
          userMap[id] = companyUser.full_name?.trim() || null;
        }
      });
      setUserNameCache(userMap);

      // Build query parameters
      const params = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter === "active") params.is_status = true;
      else if (statusFilter === "inactive") params.is_status = false;
      else if (statusFilter === "trending") params.is_trending = true;

      const response = await jobService.getAll(params);
      const rawData =
        response?.data?.data || response?.data?.results || response?.data || [];
      const items = Array.isArray(rawData) ? rawData.map(normalizeJob) : [];

      // Extract pagination metadata
      const pagination =
        response?.data?.pagination || response?.pagination || {};
      const totalItems =
        pagination?.total ?? response?.total ?? rawData.length ?? 0;

      setJobs(items);
      setTotal(totalItems);
    } catch (err) {
      console.error("Load jobs error:", err);
      showError(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      // Try to delete benefits first (ignore error if none)
      try {
        await jobService.deleteJobBenefits(deleteId);
      } catch (benefitErr) {
        console.log("No benefits to delete or already deleted");
      }
      await jobService.delete(deleteId);
      showSuccess("Job deleted successfully");
      loadData();
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
      loadData();
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
      loadData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update status");
    }
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

  // ─── Compute counts from current page (for tab display) ──────
  // Note: These are not global totals, but the API doesn't provide per-status counts.
  // We'll show counts from the current page as a visual indicator.
  const activeCount = jobs.filter((j) => j.is_status === true).length;
  const inactiveCount = jobs.length - activeCount;
  const trendingCount = jobs.filter((j) => j.is_trending === true).length;
  const hasTrending = trendingCount > 0;

  const tabs = [
    { key: "all", label: "All", count: total },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
    ...(hasTrending
      ? [{ key: "trending", label: "Trending", count: trendingCount }]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job listings</p>
        </div>
        <Button icon={MdAdd} onClick={() => navigate("/jobs/add")}>
          Add Job
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
              placeholder="Search by title or company..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
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
          data={jobs}
          loading={loading}
          emptyMessage="No jobs found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {jobs.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, total)} of {total} jobs
          </p>
          <Pagination
            page={page}
            total={total}
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
