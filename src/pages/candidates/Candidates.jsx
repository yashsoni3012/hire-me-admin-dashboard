// // pages/Candidates.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import candidateService from "../../services/candidate.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdOpenInNew,
// } from "react-icons/md";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const Candidates = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [userNameCache, setUserNameCache] = useState({});

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // Get full image URL
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (value.startsWith("http") || value.startsWith("data:image")) {
//       return value;
//     }
//     if (value.startsWith("/uploads/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     if (value.startsWith("./uploads/")) {
//       return `${API_BASE_URL}${value.substring(1)}`;
//     }
//     if (value.startsWith("/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     return value;
//   };

//   // Normalize candidate data
//   const normalizeCandidate = (item) => ({
//     id: item.id || item._id,
//     first_name: item.first_name || "",
//     last_name: item.last_name || "",
//     email: item.email || "",
//     mobile: item.mobile || "",
//     profile_photo: item.profile_photo || null,
//     status: String(item.status || "inactive")
//       .trim()
//       .toLowerCase(),
//     last_login_at: item.last_login_at || null,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     created_at: item.createdAt || item.created_at || null,
//     updated_at: item.updatedAt || item.updated_at || null,
//   });

//   const load = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach((id) => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);

//       const r = await candidateService.getAll();
//       const rawData = r.data?.data?.data || r.data?.results || r.data || [];
//       const items = Array.isArray(rawData)
//         ? rawData.map(normalizeCandidate)
//         : [];
//       setData(items);
//     } catch (err) {
//       console.error("Load error:", err);
//       showError(err.response?.data?.message || "Failed to load candidates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   const filteredData = useMemo(() => {
//     let result = data;
//     if (statusFilter !== "all") {
//       result = result.filter((item) => {
//         if (statusFilter === "active") return item.status === "active";
//         if (statusFilter === "inactive") return item.status === "inactive";
//         if (statusFilter === "blocked") return item.status === "blocked";
//         return true;
//       });
//     }
//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter((item) =>
//         [item.first_name, item.last_name, item.email, item.mobile].some(
//           (value) =>
//             String(value ?? "")
//               .toLowerCase()
//               .includes(query),
//         ),
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   // Counts for tabs
//   const activeCount = data.filter((c) => c.status === "active").length;
//   const inactiveCount = data.filter((c) => c.status === "inactive").length;
//   const blockedCount = data.filter((c) => c.status === "blocked").length;

//   const getCreatedByName = (row) => {
//     if (!row) return "-";
//     if (row.created_by) {
//       return getUserNameCached(row.created_by);
//     }
//     return "-";
//   };

//   const getUpdatedByName = (row) => {
//     if (!row) return "-";
//     if (row.updated_by) {
//       return getUserNameCached(row.updated_by);
//     }
//     return "-";
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await candidateService.delete(deleteId);
//       showSuccess("Candidate deleted successfully");
//       load();
//     } catch (err) {
//       console.error("Delete error:", err);
//       showError(err.response?.data?.message || "Failed to delete");
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   const getCurrentUserId = () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       if (user.id) return parseInt(user.id, 10);

//       const userId = localStorage.getItem("userId");
//       if (userId) return parseInt(userId, 10);
//     } catch (err) {
//       console.warn("Could not get user ID from localStorage");
//     }

//     return 1;
//   };

//   const handleStatusToggle = async (id, currentStatus) => {
//     const normalizedStatus = String(currentStatus || "inactive")
//       .trim()
//       .toLowerCase();
//     const newStatus = normalizedStatus === "active" ? "inactive" : "active";

//     setData((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, status: newStatus } : item,
//       ),
//     );

//     try {
//       await candidateService.update(id, {
//         status: newStatus,
//         updated_by: getCurrentUserId(),
//       });
//       showSuccess(`Status updated to ${newStatus}`);
//     } catch (err) {
//       setData((prev) =>
//         prev.map((item) =>
//           item.id === id ? { ...item, status: normalizedStatus } : item,
//         ),
//       );
//       console.error("Status toggle error:", err);
//       showError(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   // Navigate to view page instead of opening popup
//   const openView = (item) => {
//     navigate(`/candidates/view/${item.id}`, { state: { item } });
//   };

//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1,
//     },
//     // Photo column commented out (can be re-enabled if needed)
//     // {
//     //   header: "Photo",
//     //   key: "profile_photo",
//     //   render: (photo) =>
//     //     photo ? (
//     //       <img
//     //         src={getFullImageUrl(photo)}
//     //         alt="profile"
//     //         className="w-8 h-8 object-cover rounded-full border border-gray-200"
//     //         onError={(e) => {
//     //           e.target.style.display = "none";
//     //         }}
//     //       />
//     //     ) : (
//     //       <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-medium">
//     //         ?
//     //       </div>
//     //     ),
//     // },
//     {
//       header: "Full Name",
//       key: "first_name",
//       render: (_, row) => (
//         <span className="font-medium capitalize text-gray-800">
//           {row.first_name} {row.last_name}
//         </span>
//       ),
//     },
//     {
//       header: "Email",
//       key: "email",
//       render: (v) => <span className="text-sm text-gray-500">{v}</span>,
//     },
//     {
//       header: "Mobile",
//       key: "mobile",
//       render: (v) => <span className="text-sm text-gray-500">{v}</span>,
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (status, row) => {
//         // If status is blocked, show a disabled toggle or a badge
//         if (status === "blocked") {
//           return (
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//               Blocked
//             </span>
//           );
//         }
//         return (
//           <button
//             onClick={() => handleStatusToggle(row.id, status)}
//             className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//               status === "active" ? "bg-[#2c0eee]" : "bg-gray-300"
//             }`}
//           >
//             <span
//               className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
//                 status === "active" ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>
//         );
//       },
//     },
//     {
//       header: "Last Login",
//       key: "last_login_at",
//       render: (v) => (
//         <span className="text-gray-500 text-sm">{v ? formatDate(v) : "—"}</span>
//       ),
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1 justify-end">
//           <button
//             onClick={() => openView(row)}
//             className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-[#2c0eee] rounded-lg transition-colors"
//             title="View Profile"
//           >
//             <MdVisibility size={16} />
//           </button>
//           {/* Edit button - Commented out */}
//           {/* <button
//             onClick={() => navigate(`/candidates/edit/${row.id}`, { state: { item: row } })}
//             className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
//             title="Edit"
//           >
//             <MdEdit size={16} />
//           </button> */}
//           <button
//             onClick={() => setDeleteId(id)}
//             className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
//             title="Delete"
//           >
//             <MdDelete size={16} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // Tabs: All, Active, Inactive, Blocked (like company module)
//   const tabs = [
//     { key: "all", label: "All", count: data.length },
//     { key: "active", label: "Active", count: activeCount },
//     { key: "inactive", label: "Inactive", count: inactiveCount },
//     { key: "blocked", label: "Blocked", count: blockedCount },
//   ];

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage registered candidates
//           </p>
//         </div>
//         {/* Add button - Commented out */}
//         {/* <Button icon={MdAdd} onClick={() => navigate('/candidates/add')}>
//           Add Candidate
//         </Button> */}
//       </div>

//       {/* Table Card */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         {/* Top bar: search + tabs */}
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
//               placeholder="Search candidates..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-5 text-sm flex-wrap">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${
//                   statusFilter === tab.key
//                     ? tab.key === "blocked"
//                       ? "text-red-600"
//                       : "text-[#2c0eee]"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 {tab.label}
//                 <span
//                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
//                     statusFilter === tab.key
//                       ? tab.key === "blocked"
//                         ? "bg-red-50 text-red-600"
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
//           emptyMessage="No candidates found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of{" "}
//             {filteredData.length} candidates
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
//         title="Delete Candidate"
//         message="Delete this candidate? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default Candidates;


import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import candidateService from "../../services/candidate.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdOpenInNew,
} from "react-icons/md";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Helpers to safely extract arrays & pagination from any response shape ──
const extractList = (body) => {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== "object") return [];
  if (Array.isArray(body.data?.data)) return body.data.data;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.results)) return body.results;
  return [];
};

const extractPagination = (body) => {
  if (!body || typeof body !== "object") return null;
  if (body.data?.pagination) return body.data.pagination;
  if (body.pagination) return body.pagination;
  return null;
};

const Candidates = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Get full image URL
  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http") || value.startsWith("data:image")) {
      return value;
    }
    if (value.startsWith("/uploads/")) {
      return `${API_BASE_URL}${value}`;
    }
    if (value.startsWith("./uploads/")) {
      return `${API_BASE_URL}${value.substring(1)}`;
    }
    if (value.startsWith("/")) {
      return `${API_BASE_URL}${value}`;
    }
    return value;
  };

  // Normalize candidate data
  const normalizeCandidate = (item) => ({
    id: item.id || item._id,
    first_name: item.first_name || "",
    last_name: item.last_name || "",
    email: item.email || "",
    mobile: item.mobile || "",
    profile_photo: item.profile_photo || null,
    status: String(item.status || "inactive")
      .trim()
      .toLowerCase(),
    last_login_at: item.last_login_at || null,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    created_at: item.createdAt || item.created_at || null,
    updated_at: item.updatedAt || item.updated_at || null,
  });

  // ─── Load ALL candidates from API without duplicate records ───
const load = async () => {
  setLoading(true);

  try {
    // 1. Load users for name cache
    const users = await fetchUsers();
    const userMap = {};
    Object.keys(users || {}).forEach((id) => {
      userMap[id] = users[id].name;
    });
    setUserNameCache(userMap);

    // 2. Fetch first page
    const firstResponse = await candidateService.getAll({ page: 1, limit: 20 });
    const firstBody = firstResponse?.data;

    console.log("PAGE 1 RESPONSE:", firstBody);

    let allCandidates = extractList(firstBody);
    const pagination = extractPagination(firstBody);

    const total = Number(pagination?.total || 0);
    let totalPages = Number(
      pagination?.totalPages ||
      pagination?.total_pages ||
      (total ? Math.ceil(total / 20) : 1) ||
      1
    );

    console.log("PAGINATION:", pagination, "TOTAL PAGES:", totalPages);

    // Fallback: if totalPages looks wrong (e.g. NaN or 1 but a "next" link exists),
    // trust the presence of a next link instead.
    let nextLink = pagination?.links?.next || null;
    if ((!totalPages || totalPages < 2) && nextLink) {
      totalPages = 999; // let the while-loop below drive it off nextLink instead
    }

    // 3. Fetch remaining pages
    let currentPage = 2;
    while (currentPage <= totalPages) {
      console.log(`Fetching page ${currentPage}`);

      const response = await candidateService.getAll({
        page: currentPage,
        limit: 20,
      });
      const body = response?.data;

      console.log(`PAGE ${currentPage} RESPONSE:`, body);

      const pageCandidates = extractList(body);
      const pagePagination = extractPagination(body);

      if (pageCandidates.length === 0) {
        // No more data — stop to avoid an infinite/incorrect loop
        break;
      }

      allCandidates.push(...pageCandidates);

      // Determine whether to continue
      nextLink = pagePagination?.links?.next || null;
      const pageTotalPages = Number(
        pagePagination?.totalPages || pagePagination?.total_pages || 0
      );

      if (pageTotalPages) {
        totalPages = pageTotalPages; // trust the latest authoritative value
      } else if (!nextLink) {
        break; // no more pages
      }

      currentPage++;

      // Safety valve: never loop more than 500 times
      if (currentPage > 500) break;
    }

    // 4. Remove duplicates by ID
    const uniqueCandidates = Array.from(
      new Map(
        allCandidates.map((candidate) => [
          String(candidate?.id ?? candidate?._id),
          candidate,
        ])
      ).values()
    );

    // 5. Normalize and store
    const items = uniqueCandidates.map(normalizeCandidate);
    setData(items);

    console.log(`✅ Candidates fetched (raw): ${allCandidates.length}`);
    console.log(`✅ Unique candidates in list: ${items.length}`);
  } catch (error) {
    console.error("Candidate load error:", error);
    showError(error?.response?.data?.message || "Failed to load candidates");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter !== "all") {
      result = result.filter((item) => {
        if (statusFilter === "active") return item.status === "active";
        if (statusFilter === "inactive") return item.status === "inactive";
        if (statusFilter === "blocked") return item.status === "blocked";
        return true;
      });
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        [item.first_name, item.last_name, item.email, item.mobile].some(
          (value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(query),
        ),
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  // Counts for tabs
  const activeCount = data.filter((c) => c.status === "active").length;
  const inactiveCount = data.filter((c) => c.status === "inactive").length;
  const blockedCount = data.filter((c) => c.status === "blocked").length;

  const getCreatedByName = (row) => {
    if (!row) return "-";
    if (row.created_by) {
      return getUserNameCached(row.created_by);
    }
    return "-";
  };

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by) {
      return getUserNameCached(row.updated_by);
    }
    return "-";
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await candidateService.delete(deleteId);
      showSuccess("Candidate deleted successfully");
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id) return parseInt(user.id, 10);

      const userId = localStorage.getItem("userId");
      if (userId) return parseInt(userId, 10);
    } catch (err) {
      console.warn("Could not get user ID from localStorage");
    }

    return 1;
  };

  // ─── NEW: Change status to any value (active / inactive / blocked) ──
  const handleStatusChange = async (id, newStatus) => {
    const previousStatus = data.find((item) => item.id === id)?.status;

    // Optimistic update
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      await candidateService.update(id, {
        status: newStatus,
        updated_by: getCurrentUserId(),
      });
      showSuccess(`Status updated to ${newStatus}`);
    } catch (err) {
      // Revert on failure
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: previousStatus } : item
        )
      );
      console.error("Status update error:", err);
      showError(err.response?.data?.message || "Failed to update status");
    }
  };

  // Navigate to view page instead of opening popup
  const openView = (item) => {
    navigate(`/candidates/view/${item.id}`, { state: { item } });
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    // Photo column commented out (can be re-enabled if needed)
    // {
    //   header: "Photo",
    //   key: "profile_photo",
    //   render: (photo) =>
    //     photo ? (
    //       <img
    //         src={getFullImageUrl(photo)}
    //         alt="profile"
    //         className="w-8 h-8 object-cover rounded-full border border-gray-200"
    //         onError={(e) => {
    //           e.target.style.display = "none";
    //         }}
    //       />
    //     ) : (
    //       <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-medium">
    //         ?
    //       </div>
    //     ),
    // },
    {
      header: "Full Name",
      key: "first_name",
      render: (_, row) => (
        <span className="font-medium capitalize text-gray-800">
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    {
      header: "Email",
      key: "email",
      render: (v) => <span className="text-sm text-gray-500">{v}</span>,
    },
    {
      header: "Mobile",
      key: "mobile",
      render: (v) => <span className="text-sm text-gray-500">{v}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (status, row) => (
        <select
          value={status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition-colors ${
            status === "active"
              ? "bg-green-50 text-green-700 border-green-200 focus:ring-green-100"
              : status === "blocked"
                ? "bg-red-50 text-red-700 border-red-200 focus:ring-red-100"
                : "bg-gray-100 text-gray-600 border-gray-200 focus:ring-gray-100"
          }`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
        </select>
      ),
    },
    {
      header: "Last Login",
      key: "last_login_at",
      render: (v) => (
        <span className="text-gray-500 text-sm">{v ? formatDate(v) : "—"}</span>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-[#2c0eee] rounded-lg transition-colors"
            title="View Profile"
          >
            <MdVisibility size={16} />
          </button>
          {/* Edit button - Commented out */}
          {/* <button
            onClick={() => navigate(`/candidates/edit/${row.id}`, { state: { item: row } })}
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
            title="Edit"
          >
            <MdEdit size={16} />
          </button> */}
          <button
            onClick={() => setDeleteId(id)}
            className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
            title="Delete"
          >
            <MdDelete size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Tabs: All, Active, Inactive, Blocked (like company module)
  const tabs = [
    { key: "all", label: "All", count: data.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
    { key: "blocked", label: "Blocked", count: blockedCount },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage registered candidates
          </p>
        </div>
        {/* Add button - Commented out */}
        {/* <Button icon={MdAdd} onClick={() => navigate('/candidates/add')}>
          Add Candidate
        </Button> */}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top bar: search + tabs */}
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
              placeholder="Search candidates..."
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
                    ? tab.key === "blocked"
                      ? "text-red-600"
                      : "text-[#2c0eee]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
                      ? tab.key === "blocked"
                        ? "bg-red-50 text-red-600"
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
          emptyMessage="No candidates found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} candidates
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
        title="Delete Candidate"
        message="Delete this candidate? This action cannot be undone."
      />
    </div>
  );
};

export default Candidates; 