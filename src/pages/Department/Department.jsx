// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdRefresh,
//   MdChevronLeft,
//   MdChevronRight,
//   MdBusiness,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import { departmentService } from "../../services/department.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// // Robust boolean coercion
// const toBool = (val, fallback = true) => {
//   if (val === undefined || val === null || val === "") return fallback;
//   if (val === true || val === 1 || val === "1" || val === "true") return true;
//   if (val === false || val === 0 || val === "0" || val === "false") return false;
//   return Boolean(val);
// };

// const Department = () => {
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
//   const [imageErrors, setImageErrors] = useState({});
//   const [togglingId, setTogglingId] = useState(null);

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // Get full image URL
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (typeof value !== "string") return null;
    
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
//     if (!value.includes("/") && !value.includes("http") && !value.startsWith("data:")) {
//       return `${API_BASE_URL}/uploads/${value}`;
//     }
//     return value;
//   };

//   // Normalize department data
//   const normalizeDepartment = (item) => {
//     let statusValue = true;
    
//     if (item.is_status !== undefined && item.is_status !== null) {
//       statusValue = toBool(item.is_status, true);
//     } else if (item.status !== undefined && item.status !== null) {
//       statusValue = toBool(item.status, true);
//     }
    
//     return {
//       id: item.id || item._id,
//       department_name: item.department_name || item.name || "",
//       name: item.name || item.department_name || "",
//       icon: item.icon || null,
//       is_trending: toBool(item.is_trending, false),
//       is_status: statusValue,
//       updated_by: item.updated_by || "",
//       updated_at: item.updated_at || item.updatedAt || null,
//       created_at: item.created_at || item.createdAt || null,
//       created_by: item.created_by || "",
//     };
//   };

//   // Load departments
//   const load = async () => {
//     setLoading(true);
//     try {
//       // Fetch and cache users
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach(id => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);

//       // Fetch departments
//       const r = await departmentService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const departments = Array.isArray(rawData) ? rawData.map(normalizeDepartment) : [];

//       // Sort by created_at descending (newest first)
//       const sortedDepartments = departments.sort((a, b) => {
//         return new Date(b.created_at) - new Date(a.created_at);
//       });

//       setData(sortedDepartments);
//     } catch (error) {
//       console.error("Load error:", error);
//       showError(error.message || "Failed to load departments");
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
//       const isActive = statusFilter === "active";
//       result = result.filter((item) => item.is_status === isActive);
//     }
//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter((item) =>
//         String(item.department_name ?? "")
//           .toLowerCase()
//           .includes(query) ||
//         String(item.name ?? "")
//           .toLowerCase()
//           .includes(query)
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => r.is_status === true).length;
//   const inactiveCount = data.length - activeCount;

//   // Get display name for updated by
//   const getUpdatedByName = (row) => {
//     if (!row) return "-";
//     if (row.updated_by) {
//       return getUserNameCached(row.updated_by);
//     }
//     return "-";
//   };

//   // Handle image error
//   const handleImageError = (id) => {
//     setImageErrors((prev) => ({ ...prev, [id]: true }));
//   };

//   // Render icon preview
//   const renderIconPreview = (value, row) => {
//     const rowId = row.id || row._id;
//     const departmentName = row.department_name || row.name || "Department";
    
//     let iconValue = value;
    
//     if (!iconValue || iconValue === "null" || iconValue === "undefined") {
//       const possibleFields = ['icon', 'icon_url', 'image', 'icon_path', 'avatar', 'logo'];
//       for (const field of possibleFields) {
//         if (row[field] && typeof row[field] === 'string' && row[field] !== 'null' && row[field] !== '') {
//           iconValue = row[field];
//           break;
//         }
//       }
//     }
    
//     if (!iconValue || iconValue === "null" || iconValue === "undefined" || iconValue.trim() === "") {
//       return (
//         <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 flex items-center justify-center">
//           <MdBusiness className="text-blue-600" size={20} />
//         </div>
//       );
//     }

//     if (imageErrors[rowId]) {
//       return (
//         <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-pink-50 border border-blue-200 flex items-center justify-center">
//           <MdBusiness className="text-blue-600" size={20} />
//         </div>
//       );
//     }

//     const fullUrl = getFullImageUrl(iconValue);
    
//     if (!fullUrl) {
//       return (
//         <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-pink-50 border border-blue-200 flex items-center justify-center">
//           <MdBusiness className="text-blue-600" size={20} />
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center">
//         <div className="relative group cursor-pointer">
//           <img
//             src={fullUrl}
//             alt={departmentName}
//             className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//             onError={() => handleImageError(rowId)}
//             loading="lazy"
//           />
//         </div>
//       </div>
//     );
//   };

//   // Navigation handlers
//   const openAdd = () => {
//     navigate('/departments/add');
//   };

//   const openEdit = (item) => {
//     navigate(`/departments/edit/${item.id}`);
//   };

//   const openView = (item) => {
//     navigate(`/departments/view/${item.id}`);
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await departmentService.delete(deleteId);
//       showSuccess("Department deleted successfully");
//       load();
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this department because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete department");
//       }
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   // Toggle status
//   const handleStatusToggle = async (row) => {
//     if (togglingId === row.id) return;
//     const currentStatus = row.is_status === true;
//     const newStatus = !currentStatus;

//     setTogglingId(row.id);
//     setData((prev) =>
//       prev.map((item) => (item.id === row.id ? { ...item, is_status: newStatus } : item)),
//     );

//     try {
//       const updateData = {
//         department_name: row.department_name || row.name,
//         is_trending: row.is_trending === true,
//         status: newStatus,
//         icon: row.icon || null,
//       };

//       await departmentService.update(row.id, updateData);
//       showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//     } catch (error) {
//       console.error("Status toggle error:", error);
//       setData((prev) =>
//         prev.map((item) => (item.id === row.id ? { ...item, is_status: currentStatus } : item)),
//       );
//       showError(error.response?.data?.message || error.message || "Failed to update status");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   // Toggle trending
//   const handleTrendingToggle = async (row) => {
//     if (togglingId === `trend-${row.id}`) return;
//     const currentTrending = row.is_trending === true;
//     const newValue = !currentTrending;

//     setTogglingId(`trend-${row.id}`);
//     setData((prev) =>
//       prev.map((item) => (item.id === row.id ? { ...item, is_trending: newValue } : item)),
//     );

//     try {
//       const updateData = {
//         department_name: row.department_name || row.name,
//         is_trending: newValue,
//         status: row.is_status === true,
//         icon: row.icon || null,
//       };

//       await departmentService.update(row.id, updateData);
//       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
//     } catch (error) {
//       console.error("Trending toggle error:", error);
//       setData((prev) =>
//         prev.map((item) => (item.id === row.id ? { ...item, is_trending: currentTrending } : item)),
//       );
//       showError(error.response?.data?.message || error.message || "Failed to update trending");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1,
//     },
//     {
//       header: "Icon",
//       key: "icon",
//       render: (value, row) => renderIconPreview(value, row),
//     },
//     {
//       header: "Department Name",
//       key: "department_name",
//       render: (v, row) => (
//         <span className="font-medium capitalize text-gray-800">
//           {v || row.department_name || row.name || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Trending",
//       key: "is_trending",
//       render: (value, row) => (
//         <button
//           onClick={() => handleTrendingToggle(row)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${row.is_trending === true ? "bg-yellow-500" : "bg-gray-300"}`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${row.is_trending === true ? "translate-x-6" : "translate-x-1"}`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Status",
//       key: "is_status",
//       render: (value, row) => {
//         const isActive = row.is_status === true;
//         return (
//           <button
//             onClick={() => handleStatusToggle(row)}
//             className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"}`}
//           >
//             <span
//               className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"}`}
//             />
//           </button>
//         );
//       },
//     },
//     {
//       header: "Updated By",
//       key: "updated_by",
//       render: (_, row) => (
//         <span className="text-gray-500 text-sm font-medium">
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
//         <div className="flex gap-1">
//           <button
//             onClick={() => openView(row)}
//             className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
//             title="View"
//           >
//             <MdVisibility size={16} />
//           </button>
//           <button
//             onClick={() => openEdit(row)}
//             className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
//             title="Edit"
//           >
//             <MdEdit size={16} />
//           </button>
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

//   const tabs = [
//     { key: "all", label: "All", count: data.length },
//     { key: "active", label: "Active", count: activeCount },
//     { key: "inactive", label: "Inactive", count: inactiveCount },
//   ];

//   const totalPages = Math.ceil(filteredData.length / limit);

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage departments for job listings
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="secondary"
//             icon={MdRefresh}
//             onClick={load}
//             loading={loading}
//           >
//             Refresh
//           </Button>
//           <Button icon={MdAdd} onClick={openAdd}>
//             Add Department
//           </Button>
//         </div>
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
//               placeholder="Search departments..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-5 text-sm">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//               >
//                 {tab.label}
//                 <span
//                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
//                     statusFilter === tab.key
//                       ? "bg-blue-50 text-blue-600"
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
//           emptyMessage="No departments found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of{" "}
//             {filteredData.length} departments
//           </p>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-400">Rows:</span>
//               <select
//                 value={limit}
//                 onChange={(e) => {
//                   setLimit(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
//               >
//                 {[5, 10, 15, 20, 25, 50, 100].map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setPage(page - 1)}
//                 disabled={page === 1}
//                 className={`p-1 rounded-lg transition-colors ${
//                   page === 1
//                     ? "text-gray-300 cursor-not-allowed"
//                     : "hover:bg-gray-100 text-gray-500"
//                 }`}
//               >
//                 <MdChevronLeft size={18} />
//               </button>
//               <span className="text-sm text-gray-600 px-2">
//                 Page {page} of {totalPages || 1}
//               </span>
//               <button
//                 onClick={() => setPage(page + 1)}
//                 disabled={page === totalPages || totalPages === 0}
//                 className={`p-1 rounded-lg transition-colors ${
//                   page === totalPages || totalPages === 0
//                     ? "text-gray-300 cursor-not-allowed"
//                     : "hover:bg-gray-100 text-gray-500"
//                 }`}
//               >
//                 <MdChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation */}
//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Department"
//         message="Delete this department? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default Department;



import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdRefresh,
  MdChevronLeft,
  MdChevronRight,
  MdBusiness,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { departmentService } from "../../services/department.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// Robust boolean coercion
const toBool = (val, fallback = true) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false") return false;
  return Boolean(val);
};

const Department = () => {
  const navigate = useNavigate();

  // ─── State ──────────────────────────────────────────────────────
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [togglingId, setTogglingId] = useState(null);

  // ─── Pagination state from API ────────────────────────────────
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ─── Helper: Get user name ────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // ─── Helper: Get full image URL ──────────────────────────────
  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (typeof value !== "string") return null;

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
    if (!value.includes("/") && !value.includes("http") && !value.startsWith("data:")) {
      return `${API_BASE_URL}/uploads/${value}`;
    }
    return value;
  };

  // ─── Normalize department data ────────────────────────────────
  const normalizeDepartment = (item) => {
    let statusValue = true;
    if (item.is_status !== undefined && item.is_status !== null) {
      statusValue = toBool(item.is_status, true);
    } else if (item.status !== undefined && item.status !== null) {
      statusValue = toBool(item.status, true);
    }

    return {
      id: item.id || item._id,
      department_name: item.department_name || item.name || "",
      name: item.name || item.department_name || "",
      icon: item.icon || null,
      is_trending: toBool(item.is_trending, false),
      is_status: statusValue,
      updated_by: item.updated_by || "",
      updated_at: item.updated_at || item.updatedAt || null,
      created_at: item.created_at || item.createdAt || null,
      created_by: item.created_by || "",
    };
  };

  // ─── Load departments with server-side pagination ─────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch and cache users (only once)
      if (Object.keys(userNameCache).length === 0) {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[id] = users[id].name;
        });
        setUserNameCache(userMap);
      }

      // Build query parameters for server-side pagination
      const params = {
        page,
        limit,
      };

      // Add status filter if not "all"
      if (statusFilter === "active") {
        params.status = "true";
      } else if (statusFilter === "inactive") {
        params.status = "false";
      }

      const response = await departmentService.getAll(params);

      // Extract data and pagination metadata
      const rawData = response?.data?.data || response?.data?.results || response?.data || [];
      const departments = Array.isArray(rawData) ? rawData.map(normalizeDepartment) : [];

      // Get pagination info from response – safely handle fallback
      const pagination = response?.data?.pagination || response?.pagination || {};
      const totalItems = pagination?.total ?? response?.total ?? departments.length;
      // Fix: wrap the expression in parentheses to avoid mixing ?? and ||
      const totalPagesCount = (pagination?.totalPages ?? Math.ceil(totalItems / limit)) || 1;

      setData(departments);
      setTotal(totalItems);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, userNameCache]);

  // ─── Initial load & reload on filter/page changes ────────────
  useEffect(() => {
    load();
  }, [load]);

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // ─── Client-side filtering for search (if API doesn't support it) ─
  // If your API supports server-side search, you can remove this.
  // For now, we keep it as a fallback, but the main data is already filtered.
  const filteredData = useMemo(() => {
    // If search is empty, return the current page data
    if (!search.trim()) {
      return data;
    }
    // Otherwise, filter client-side (as a fallback)
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      String(item.department_name ?? "")
        .toLowerCase()
        .includes(query) ||
      String(item.name ?? "")
        .toLowerCase()
        .includes(query)
    );
  }, [data, search]);

  // ─── Computed counts (from all data, not just current page) ──
  // Note: These counts are based on the current page only.
  // For accurate totals, the API would need to return counts per status.
  const activeCount = data.filter((r) => r.is_status === true).length;
  const inactiveCount = data.length - activeCount;

  // ─── Get display name for updated by ──────────────────────────
  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by) {
      return getUserNameCached(row.updated_by);
    }
    return "-";
  };

  // ─── Handle image error ───────────────────────────────────────
  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // ─── Render icon preview ──────────────────────────────────────
  const renderIconPreview = (value, row) => {
    const rowId = row.id || row._id;
    const departmentName = row.department_name || row.name || "Department";

    let iconValue = value;
    if (!iconValue || iconValue === "null" || iconValue === "undefined") {
      const possibleFields = ['icon', 'icon_url', 'image', 'icon_path', 'avatar', 'logo'];
      for (const field of possibleFields) {
        if (row[field] && typeof row[field] === 'string' && row[field] !== 'null' && row[field] !== '') {
          iconValue = row[field];
          break;
        }
      }
    }

    if (!iconValue || iconValue === "null" || iconValue === "undefined" || iconValue.trim() === "") {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 flex items-center justify-center">
          <MdBusiness className="text-blue-600" size={20} />
        </div>
      );
    }

    if (imageErrors[rowId]) {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-pink-50 border border-blue-200 flex items-center justify-center">
          <MdBusiness className="text-blue-600" size={20} />
        </div>
      );
    }

    const fullUrl = getFullImageUrl(iconValue);
    if (!fullUrl) {
      return (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-pink-50 border border-blue-200 flex items-center justify-center">
          <MdBusiness className="text-blue-600" size={20} />
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <div className="relative group cursor-pointer">
          <img
            src={fullUrl}
            alt={departmentName}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            onError={() => handleImageError(rowId)}
            loading="lazy"
          />
        </div>
      </div>
    );
  };

  // ─── Navigation handlers ──────────────────────────────────────
  const openAdd = () => navigate('/departments/add');
  const openEdit = (item) => navigate(`/departments/edit/${item.id}`);
  const openView = (item) => navigate(`/departments/view/${item.id}`);

  // ─── Handle delete ────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await departmentService.delete(deleteId);
      showSuccess("Department deleted successfully");
      load(); // Reload current page
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError("Cannot delete this department because it is being used in other records.");
      } else {
        showError(message || "Failed to delete department");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // ─── Toggle status ────────────────────────────────────────────
  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.is_status === true;
    const newStatus = !currentStatus;

    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, is_status: newStatus } : item))
    );

    try {
      const updateData = {
        department_name: row.department_name || row.name,
        is_trending: row.is_trending === true,
        status: newStatus,
        icon: row.icon || null,
      };
      await departmentService.update(row.id, updateData);
      showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Status toggle error:", error);
      setData((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, is_status: currentStatus } : item))
      );
      showError(error.response?.data?.message || error.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Toggle trending ──────────────────────────────────────────
  const handleTrendingToggle = async (row) => {
    if (togglingId === `trend-${row.id}`) return;
    const currentTrending = row.is_trending === true;
    const newValue = !currentTrending;

    setTogglingId(`trend-${row.id}`);
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, is_trending: newValue } : item))
    );

    try {
      const updateData = {
        department_name: row.department_name || row.name,
        is_trending: newValue,
        status: row.is_status === true,
        icon: row.icon || null,
      };
      await departmentService.update(row.id, updateData);
      showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
    } catch (error) {
      console.error("Trending toggle error:", error);
      setData((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, is_trending: currentTrending } : item))
      );
      showError(error.response?.data?.message || error.message || "Failed to update trending");
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Table Columns ─────────────────────────────────────────────
  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Icon",
      key: "icon",
      render: (value, row) => renderIconPreview(value, row),
    },
    {
      header: "Department Name",
      key: "department_name",
      render: (v, row) => (
        <span className="font-medium capitalize text-gray-800">
          {v || row.department_name || row.name || "-"}
        </span>
      ),
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (value, row) => (
        <button
          onClick={() => handleTrendingToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            row.is_trending === true ? "bg-yellow-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
              row.is_trending === true ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      header: "Status",
      key: "is_status",
      render: (value, row) => {
        const isActive = row.is_status === true;
        return (
          <button
            onClick={() => handleStatusToggle(row)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
              isActive ? "bg-[#2c0eee]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        );
      },
    },
    {
      header: "Updated By",
      key: "updated_by",
      render: (_, row) => (
        <span className="text-gray-500 text-sm font-medium">
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
        <div className="flex gap-1">
          <button
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
            title="Edit"
          >
            <MdEdit size={16} />
          </button>
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

  // ─── Tabs ──────────────────────────────────────────────────────
  const tabs = [
    { key: "all", label: "All", count: total },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
  ];

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage departments for job listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={MdRefresh}
            onClick={load}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={openAdd}>
            Add Department
          </Button>
        </div>
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
              placeholder="Search departments..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
                      ? "bg-blue-50 text-blue-600"
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
          data={filteredData}
          loading={loading}
          emptyMessage="No departments found"
        />

        {/* Footer with server-side pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {data.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, total)} of {total} departments
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              >
                {[5, 10, 15, 20, 25, 50, 100].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`p-1 rounded-lg transition-colors ${
                  page === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <MdChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600 px-2">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className={`p-1 rounded-lg transition-colors ${
                  page === totalPages || totalPages === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Department"
        message="Delete this department? This action cannot be undone."
      />
    </div>
  );
};

export default Department;