
// import React, { useState, useEffect, useCallback } from "react";
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
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import { cmsPageService } from "../../services/cmsPage.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";
// import { useAuth } from "../../context/AuthContext";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const toBool = (val, fallback = false) => {
//   if (val === undefined || val === null || val === "") return fallback;
//   if (val === true || val === 1 || val === "1" || val === "true") return true;
//   if (val === false || val === 0 || val === "0" || val === "false")
//     return false;
//   return Boolean(val);
// };

// const normalizeBannerImage = (value) => {
//   if (!value) return null;
//   if (typeof value === "string") return value.trim() || null;
//   if (typeof value === "object") {
//     return normalizeBannerImage(
//       value.url ||
//         value.uri ||
//         value.path ||
//         value.image ||
//         value.banner_image ||
//         value.file,
//     );
//   }
//   return null;
// };

// // ─── Read the logged-in user straight from localStorage ─────────
// // Matches the shape saved at login: { id, name, email, mobile, image, role_id }
// const getLoggedInUserFromStorage = () => {
//   try {
//     const raw = localStorage.getItem("user");
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     if (!parsed || typeof parsed !== "object") return null;
//     return parsed;
//   } catch (error) {
//     console.error("Failed to read logged-in user from localStorage:", error);
//     return null;
//   }
// };

// const CmsPages = () => {
//   const navigate = useNavigate();
//   const { user: authUser } = useAuth(); // fallback if localStorage isn't populated yet

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [userNameCache, setUserNameCache] = useState({});
//   const [togglingId, setTogglingId] = useState(null);

//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // ─── Current logged-in user (localStorage first, AuthContext fallback) ──
//   const [currentUser, setCurrentUser] = useState(
//     () => getLoggedInUserFromStorage() || authUser || null,
//   );

//   // Keep currentUser in sync if AuthContext resolves after mount, or if the
//   // localStorage "user" entry changes (e.g. re-login in another tab).
//   useEffect(() => {
//     const fromStorage = getLoggedInUserFromStorage();
//     if (fromStorage) {
//       setCurrentUser(fromStorage);
//     } else if (authUser) {
//       setCurrentUser(authUser);
//     }
//   }, [authUser]);

//   useEffect(() => {
//     const handleStorage = (e) => {
//       if (e.key === "user") {
//         setCurrentUser(getLoggedInUserFromStorage() || authUser || null);
//       }
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, [authUser]);

//   // ─── Resolve what to display in "Updated By" for a given user id ──────
//   // If the row was last touched by whoever is currently logged in, show
//   // their real name (falling back to email, then a generic label) pulled
//   // straight from localStorage — never the placeholder "You". Their email
//   // is attached as a tooltip for extra detail on hover. Otherwise fall
//   // back to the async-loaded userNameCache (from fetchUsers).
//   const getUpdatedByDisplay = (userId) => {
//     if (!userId) return { label: "—", title: undefined };

//     if (currentUser?.id && Number(currentUser.id) === Number(userId)) {
//       return {
//         label: currentUser.name || currentUser.email || `User ${userId}`,
//         title: currentUser.email || undefined,
//       };
//     }

//     return {
//       label: userNameCache[userId] || `User ${userId}`,
//       title: undefined,
//     };
//   };

//   // ─── Normalize data ───────────────────────────────────────────
//   const normalizeCmsPage = (item) => ({
//     id: item.id || item._id,
//     page_name: item.page_name || "",
//     page_slug: item.page_slug || "",
//     page_type: item.page_type || "",
//     short_description: item.short_description || "",
//     page_title: item.page_title || "",
//     meta_title: item.meta_title || "",
//     meta_description: item.meta_description || "",
//     meta_keywords: item.meta_keywords || "",
//     banner_image: normalizeBannerImage(item.banner_image),
//     banner_title: item.banner_title || "",
//     banner_subtitle: item.banner_subtitle || "",
//     banner_CTA_button: item.banner_CTA_button || "",
//     content: item.content || "",
//     status: toBool(item.status, true),
//     is_menu_visible: toBool(item.is_menu_visible, false),
//     is_footer_visible: toBool(item.is_footer_visible, false),
//     display_order: item.display_order || 0,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     created_at: item.created_at || null,
//     updated_at: item.updated_at || null,
//   });

//   // ─── Load data with server-side pagination and filters ──────
//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Fetch users only once
//       if (Object.keys(userNameCache).length === 0) {
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((id) => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);
//       }

//       // Build query parameters
//       const params = { page, limit };

//       if (search.trim()) {
//         params.search = search.trim();
//       }

//       // Status filter: send 1 for active, 0 for inactive
//       if (statusFilter === "active") {
//         params.status = 1;
//       } else if (statusFilter === "inactive") {
//         params.status = 0;
//       }

//       const response = await cmsPageService.getAll(params);

//       // Extract data and pagination
//       const rawData =
//         response?.data?.data || response?.data?.results || response?.data || [];
//       const pages = Array.isArray(rawData) ? rawData.map(normalizeCmsPage) : [];

//       const pagination =
//         response?.data?.pagination || response?.pagination || {};
//       const totalItems = pagination?.total ?? response?.total ?? pages.length;
//       const totalPagesCount =
//         (pagination?.totalPages ?? Math.ceil(totalItems / limit)) || 1;

//       setData(pages);
//       setTotal(totalItems);
//       setTotalPages(totalPagesCount);
//     } catch (error) {
//       console.error("Load error:", error);
//       showError(error.message || "Failed to load CMS pages");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, limit, search, statusFilter, userNameCache]);

//   // ─── Reload on filter/page change ────────────────────────────
//   useEffect(() => {
//     load();
//   }, [load]);

//   // Reset page when search or filter changes
//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   // ─── Computed counts (from current page) ─────────────────────
//   const activeCount = data.filter((r) => r.status === true).length;
//   const inactiveCount = data.length - activeCount;

//   // ─── Navigation ──────────────────────────────────────────────
//   const openAdd = () => navigate("/cms-pages/add");
//   const openEdit = (item) =>
//     navigate(`/cms-pages/edit/${item.id}`, { state: { item } });
//   const openView = (item) =>
//     navigate(`/cms-pages/view/${item.id}`, { state: { item } });

//   // ─── Delete ──────────────────────────────────────────────────
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await cmsPageService.delete(deleteId);
//       showSuccess("CMS page deleted successfully");
//       load();
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError(
//           "Cannot delete this page because it is being used in other records.",
//         );
//       } else {
//         showError(message || "Failed to delete CMS page");
//       }
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   // ─── Toggles ──────────────────────────────────────────────────
//   // Each toggle now:
//   //  1. Sends `updated_by: currentUser.id` to the backend so the saved
//   //     record correctly attributes the change to whoever is logged in.
//   //  2. Optimistically stamps the row locally with the current user's id
//   //     and "now" as updated_at, so the "Updated By" column reflects the
//   //     change instantly (via getUpdatedByDisplay -> currentUser.name)
//   //     instead of waiting for a reload or showing stale data.
//   //  3. Reverts the toggled value AND the updated_by/updated_at stamp on
//   //     failure.
//   const handleStatusToggle = async (row) => {
//     if (togglingId === row.id) return;
//     const currentStatus = row.status === true;
//     const newStatus = !currentStatus;
//     const prevUpdatedBy = row.updated_by;
//     const prevUpdatedAt = row.updated_at;
//     const nowIso = new Date().toISOString();

//     setTogglingId(row.id);
//     setData((prev) =>
//       prev.map((item) =>
//         item.id === row.id
//           ? {
//               ...item,
//               status: newStatus,
//               updated_by: currentUser?.id ?? item.updated_by,
//               updated_at: nowIso,
//             }
//           : item,
//       ),
//     );

//     try {
//       await cmsPageService.update(row.id, {
//         status: newStatus ? 1 : 0,
//         updated_by: currentUser?.id,
//       });
//       showSuccess(
//         `Status ${newStatus ? "activated" : "deactivated"} successfully`,
//       );
//     } catch (error) {
//       console.error("Status toggle error:", error);
//       setData((prev) =>
//         prev.map((item) =>
//           item.id === row.id
//             ? {
//                 ...item,
//                 status: currentStatus,
//                 updated_by: prevUpdatedBy,
//                 updated_at: prevUpdatedAt,
//               }
//             : item,
//         ),
//       );
//       showError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update status",
//       );
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const handleMenuToggle = async (row) => {
//     if (togglingId === `menu-${row.id}`) return;
//     const currentVal = row.is_menu_visible === true;
//     const newVal = !currentVal;
//     const prevUpdatedBy = row.updated_by;
//     const prevUpdatedAt = row.updated_at;
//     const nowIso = new Date().toISOString();

//     setTogglingId(`menu-${row.id}`);
//     setData((prev) =>
//       prev.map((item) =>
//         item.id === row.id
//           ? {
//               ...item,
//               is_menu_visible: newVal,
//               updated_by: currentUser?.id ?? item.updated_by,
//               updated_at: nowIso,
//             }
//           : item,
//       ),
//     );

//     try {
//       await cmsPageService.update(row.id, {
//         is_menu_visible: newVal ? 1 : 0,
//         updated_by: currentUser?.id,
//       });
//       showSuccess(
//         `Menu visibility ${newVal ? "enabled" : "disabled"} successfully`,
//       );
//     } catch (error) {
//       console.error("Menu toggle error:", error);
//       setData((prev) =>
//         prev.map((item) =>
//           item.id === row.id
//             ? {
//                 ...item,
//                 is_menu_visible: currentVal,
//                 updated_by: prevUpdatedBy,
//                 updated_at: prevUpdatedAt,
//               }
//             : item,
//         ),
//       );
//       showError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update menu visibility",
//       );
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const handleFooterToggle = async (row) => {
//     if (togglingId === `footer-${row.id}`) return;
//     const currentVal = row.is_footer_visible === true;
//     const newVal = !currentVal;
//     const prevUpdatedBy = row.updated_by;
//     const prevUpdatedAt = row.updated_at;
//     const nowIso = new Date().toISOString();

//     setTogglingId(`footer-${row.id}`);
//     setData((prev) =>
//       prev.map((item) =>
//         item.id === row.id
//           ? {
//               ...item,
//               is_footer_visible: newVal,
//               updated_by: currentUser?.id ?? item.updated_by,
//               updated_at: nowIso,
//             }
//           : item,
//       ),
//     );

//     try {
//       await cmsPageService.update(row.id, {
//         is_footer_visible: newVal ? 1 : 0,
//         updated_by: currentUser?.id,
//       });
//       showSuccess(
//         `Footer visibility ${newVal ? "enabled" : "disabled"} successfully`,
//       );
//     } catch (error) {
//       console.error("Footer toggle error:", error);
//       setData((prev) =>
//         prev.map((item) =>
//           item.id === row.id
//             ? {
//                 ...item,
//                 is_footer_visible: currentVal,
//                 updated_by: prevUpdatedBy,
//                 updated_at: prevUpdatedAt,
//               }
//             : item,
//         ),
//       );
//       showError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update footer visibility",
//       );
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   // ─── Columns ──────────────────────────────────────────────────
//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1,
//     },
//     {
//       header: "Page Name",
//       key: "page_name",
//       render: (v) => <span className="font-medium text-gray-800">{v}</span>,
//     },
//     {
//       header: "Slug",
//       key: "page_slug",
//       render: (v) => <span className="text-gray-500 text-sm">{v}</span>,
//     },
//     {
//       header: "Page Type",
//       key: "page_type",
//       render: (v) => <span className="text-gray-500 text-sm">{v || "—"}</span>,
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (value, row) => (
//         <button
//           onClick={() => handleStatusToggle(row)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             row.status === true ? "bg-[#2c0eee]" : "bg-gray-300"
//           }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
//               row.status === true ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Menu",
//       key: "is_menu_visible",
//       render: (value, row) => (
//         <button
//           onClick={() => handleMenuToggle(row)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             row.is_menu_visible === true ? "bg-blue-500" : "bg-gray-300"
//           }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
//               row.is_menu_visible === true ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Footer",
//       key: "is_footer_visible",
//       render: (value, row) => (
//         <button
//           onClick={() => handleFooterToggle(row)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             row.is_footer_visible === true ? "bg-green-500" : "bg-gray-300"
//           }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
//               row.is_footer_visible === true ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Updated By",
//       key: "updated_by",
//       render: (_, row) => {
//         const { label, title } = getUpdatedByDisplay(row.updated_by);
//         return (
//           <span className="text-gray-500 text-sm font-medium" title={title}>
//             {label}
//           </span>
//         );
//       },
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
//             className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg"
//             title="View"
//           >
//             <MdVisibility size={16} />
//           </button>
//           <button
//             onClick={() => openEdit(row)}
//             className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg"
//             title="Edit"
//           >
//             <MdEdit size={16} />
//           </button>
//           <button
//             onClick={() => setDeleteId(id)}
//             className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg"
//             title="Delete"
//           >
//             <MdDelete size={16} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const tabs = [
//     { key: "all", label: "All", count: total },
//     { key: "active", label: "Active", count: activeCount },
//     { key: "inactive", label: "Inactive", count: inactiveCount },
//   ];

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">CMS Pages</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage static pages and content
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
//             Add CMS Page
//           </Button>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
//               placeholder="Search pages..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
//             />
//           </div>
//           <div className="flex items-center gap-5 text-sm">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${
//                   statusFilter === tab.key
//                     ? "text-blue-600"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
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
//           data={data}
//           loading={loading}
//           emptyMessage="No CMS pages found"
//         />

//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {data.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, total)} of {total} pages
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
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className={`p-1 rounded-lg ${
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
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages || totalPages === 0}
//                 className={`p-1 rounded-lg ${
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

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete CMS Page"
//         message="Delete this page? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default CmsPages;


import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { cmsPageService } from "../../services/cmsPage.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const toBool = (val, fallback = false) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false")
    return false;
  return Boolean(val);
};

const normalizeBannerImage = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "object") {
    return normalizeBannerImage(
      value.url ||
      value.uri ||
      value.path ||
      value.image ||
      value.banner_image ||
      value.file,
    );
  }
  return null;
};

// ─── Read the logged-in user straight from localStorage ─────────
// Matches the shape saved at login: { id, name, email, mobile, image, role_id }
const getLoggedInUserFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (error) {
    console.error("Failed to read logged-in user from localStorage:", error);
    return null;
  }
};

const CmsPages = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth(); // fallback if localStorage isn't populated yet

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // "search" is the raw, immediately-controlled input value.
  // "debouncedSearch" is what actually drives API calls & filtering —
  // it only updates 400ms after the user stops typing, so we don't fire
  // (and possibly race) a request on every keystroke.
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});
  const [togglingId, setTogglingId] = useState(null);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Tab counts are fetched independently of the current page's filter/status
  // so "All / Active / Inactive" always reflect true totals (respecting the
  // search box, but NOT whichever status tab is currently selected) instead
  // of just counting whatever 10 rows happen to be on the current page.
  const [allTotal, setAllTotal] = useState(0);
  const [activeTotal, setActiveTotal] = useState(0);

  // ─── Debounce the search box ────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ─── Current logged-in user (localStorage first, AuthContext fallback) ──
  const [currentUser, setCurrentUser] = useState(
    () => getLoggedInUserFromStorage() || authUser || null,
  );

  useEffect(() => {
    const fromStorage = getLoggedInUserFromStorage();
    if (fromStorage) {
      setCurrentUser(fromStorage);
    } else if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "user") {
        setCurrentUser(getLoggedInUserFromStorage() || authUser || null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [authUser]);

  // ─── Resolve what to display in "Updated By" for a given user id ──────
  const getUpdatedByDisplay = (userId) => {
    if (!userId) return { label: "—", title: undefined };

    if (currentUser?.id && Number(currentUser.id) === Number(userId)) {
      return {
        label: currentUser.name || currentUser.email || `User ${userId}`,
        title: currentUser.email || undefined,
      };
    }

    return {
      label: userNameCache[userId] || `User ${userId}`,
      title: undefined,
    };
  };

  // ─── Normalize data ───────────────────────────────────────────
  const normalizeCmsPage = (item) => ({
    id: item.id || item._id,
    page_name: item.page_name || "",
    page_slug: item.page_slug || "",
    page_type: item.page_type || "",
    short_description: item.short_description || "",
    page_title: item.page_title || "",
    meta_title: item.meta_title || "",
    meta_description: item.meta_description || "",
    meta_keywords: item.meta_keywords || "",
    banner_image: normalizeBannerImage(item.banner_image),
    banner_title: item.banner_title || "",
    banner_subtitle: item.banner_subtitle || "",
    banner_CTA_button: item.banner_CTA_button || "",
    content: item.content || "",
    status: toBool(item.status, true),
    is_menu_visible: toBool(item.is_menu_visible, false),
    is_footer_visible: toBool(item.is_footer_visible, false),
    display_order: item.display_order || 0,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
  });

  // ─── Race-safety guard ───────────────────────────────────────
  // If the user types quickly, several requests can be in flight at once.
  // Without this, a slow-to-resolve *older* request could land after a
  // newer one and overwrite it with stale results — which looks exactly
  // like "search doesn't work". requestIdRef lets us ignore any response
  // that isn't from the most recently issued request.
  const requestIdRef = useRef(0);

  // ─── Load data with server-side pagination and filters ──────
  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      // Fetch users only once
      if (Object.keys(userNameCache).length === 0) {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[id] = users[id].name;
        });
        setUserNameCache(userMap);
      }

      // Build query parameters
      const params = { page, limit };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      // Status filter: send 1 for active, 0 for inactive
      if (statusFilter === "active") {
        params.status = 1;
      } else if (statusFilter === "inactive") {
        params.status = 0;
      }

      const response = await cmsPageService.getAll(params);

      // Ignore this response if a newer request has already been issued
      if (requestIdRef.current !== requestId) return;

      // Extract data and pagination
      const rawData =
        response?.data?.data || response?.data?.results || response?.data || [];
      const pages = Array.isArray(rawData) ? rawData.map(normalizeCmsPage) : [];

      const pagination =
        response?.data?.pagination || response?.pagination || {};
      const totalItems = pagination?.total ?? response?.total ?? pages.length;
      const totalPagesCount =
        (pagination?.totalPages ?? Math.ceil(totalItems / limit)) || 1;

      setData(pages);
      setTotal(totalItems);
      setTotalPages(totalPagesCount);
    } catch (error) {
      if (requestIdRef.current !== requestId) return;
      console.error("Load error:", error);
      showError(error.message || "Failed to load CMS pages");
    } finally {
      if (requestIdRef.current === requestId) setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, userNameCache]);

  // ─── Load true tab counts (independent of the selected status tab) ────
  // Always respects the search box, but always queries "all" and
  // "active" totals regardless of which tab is currently selected, so the
  // numbers on the tabs never lie based on what page/status you're viewing.
  const loadTabCounts = useCallback(async () => {
    try {
      const baseParams = {};
      if (debouncedSearch) baseParams.search = debouncedSearch;

      const [allRes, activeRes] = await Promise.all([
        cmsPageService.getAll({ ...baseParams, page: 1, limit: 1 }),
        cmsPageService.getAll({ ...baseParams, page: 1, limit: 1, status: 1 }),
      ]);

      const allPagination =
        allRes?.data?.pagination || allRes?.pagination || {};
      const activePagination =
        activeRes?.data?.pagination || activeRes?.pagination || {};

      const allRaw =
        allRes?.data?.data || allRes?.data?.results || allRes?.data || [];
      const activeRaw =
        activeRes?.data?.data ||
        activeRes?.data?.results ||
        activeRes?.data ||
        [];

      setAllTotal(
        allPagination?.total ??
        allRes?.total ??
        (Array.isArray(allRaw) ? allRaw.length : 0),
      );
      setActiveTotal(
        activePagination?.total ??
        activeRes?.total ??
        (Array.isArray(activeRaw) ? activeRaw.length : 0),
      );
    } catch (error) {
      console.error("Failed to load tab counts:", error);
    }
  }, [debouncedSearch]);

  // ─── Reload on filter/page change ────────────────────────────
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadTabCounts();
  }, [loadTabCounts]);

  // Reset page when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  // ─── Client-side filtering safety net ─────────────────────────
  // Re-applies the same search text + status filter to whatever rows the
  // server actually returned. If the backend already filters correctly
  // this is a no-op (everything already matches). If the backend ignores
  // `search`/`status` params, this guarantees the table you see still
  // respects what you typed/selected instead of silently showing
  // everything.
  const filteredData = useMemo(() => {
    let rows = data;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      rows = rows.filter((r) =>
        [r.page_name, r.page_slug, r.page_type, r.short_description]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q)),
      );
    }

    if (statusFilter === "active") {
      rows = rows.filter((r) => r.status === true);
    } else if (statusFilter === "inactive") {
      rows = rows.filter((r) => r.status === false);
    }

    return rows;
  }, [data, debouncedSearch, statusFilter]);

  // ─── Navigation ──────────────────────────────────────────────
  const openAdd = () => navigate("/cms-pages/add");
  const openEdit = (item) =>
    navigate(`/cms-pages/edit/${item.id}`, { state: { item } });
  const openView = (item) =>
    navigate(`/cms-pages/view/${item.id}`, { state: { item } });

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await cmsPageService.delete(deleteId);
      showSuccess("CMS page deleted successfully");
      load();
      loadTabCounts();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this page because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete CMS page");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // ─── Toggles ──────────────────────────────────────────────────
  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.status === true;
    const newStatus = !currentStatus;
    const prevUpdatedBy = row.updated_by;
    const prevUpdatedAt = row.updated_at;
    const nowIso = new Date().toISOString();

    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? {
            ...item,
            status: newStatus,
            updated_by: currentUser?.id ?? item.updated_by,
            updated_at: nowIso,
          }
          : item,
      ),
    );

    try {
      await cmsPageService.update(row.id, {
        status: newStatus ? 1 : 0,
        updated_by: currentUser?.id,
      });
      showSuccess(
        `Status ${newStatus ? "activated" : "deactivated"} successfully`,
      );
      // Status changed -> active/inactive tab counts need to reflect it
      loadTabCounts();
    } catch (error) {
      console.error("Status toggle error:", error);
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
              ...item,
              status: currentStatus,
              updated_by: prevUpdatedBy,
              updated_at: prevUpdatedAt,
            }
            : item,
        ),
      );
      showError(
        error.response?.data?.message ||
        error.message ||
        "Failed to update status",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleMenuToggle = async (row) => {
    if (togglingId === `menu-${row.id}`) return;
    const currentVal = row.is_menu_visible === true;
    const newVal = !currentVal;
    const prevUpdatedBy = row.updated_by;
    const prevUpdatedAt = row.updated_at;
    const nowIso = new Date().toISOString();

    setTogglingId(`menu-${row.id}`);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? {
            ...item,
            is_menu_visible: newVal,
            updated_by: currentUser?.id ?? item.updated_by,
            updated_at: nowIso,
          }
          : item,
      ),
    );

    try {
      await cmsPageService.update(row.id, {
        is_menu_visible: newVal ? 1 : 0,
        updated_by: currentUser?.id,
      });
      showSuccess(
        `Menu visibility ${newVal ? "enabled" : "disabled"} successfully`,
      );
    } catch (error) {
      console.error("Menu toggle error:", error);
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
              ...item,
              is_menu_visible: currentVal,
              updated_by: prevUpdatedBy,
              updated_at: prevUpdatedAt,
            }
            : item,
        ),
      );
      showError(
        error.response?.data?.message ||
        error.message ||
        "Failed to update menu visibility",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleFooterToggle = async (row) => {
    if (togglingId === `footer-${row.id}`) return;
    const currentVal = row.is_footer_visible === true;
    const newVal = !currentVal;
    const prevUpdatedBy = row.updated_by;
    const prevUpdatedAt = row.updated_at;
    const nowIso = new Date().toISOString();

    setTogglingId(`footer-${row.id}`);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? {
            ...item,
            is_footer_visible: newVal,
            updated_by: currentUser?.id ?? item.updated_by,
            updated_at: nowIso,
          }
          : item,
      ),
    );

    try {
      await cmsPageService.update(row.id, {
        is_footer_visible: newVal ? 1 : 0,
        updated_by: currentUser?.id,
      });
      showSuccess(
        `Footer visibility ${newVal ? "enabled" : "disabled"} successfully`,
      );
    } catch (error) {
      console.error("Footer toggle error:", error);
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
              ...item,
              is_footer_visible: currentVal,
              updated_by: prevUpdatedBy,
              updated_at: prevUpdatedAt,
            }
            : item,
        ),
      );
      showError(
        error.response?.data?.message ||
        error.message ||
        "Failed to update footer visibility",
      );
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Columns ──────────────────────────────────────────────────
  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Page Name",
      key: "page_name",
      render: (v) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      header: "Slug",
      key: "page_slug",
      render: (v) => <span className="text-gray-500 text-sm">{v}</span>,
    },
    {
      header: "Page Type",
      key: "page_type",
      render: (v) => <span className="text-gray-500 text-sm">{v || "—"}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (value, row) => (
        <button
          onClick={() => handleStatusToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${row.status === true ? "bg-[#2c0eee]" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${row.status === true ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      ),
    },
    {
      header: "Menu",
      key: "is_menu_visible",
      render: (value, row) => (
        <button
          onClick={() => handleMenuToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${row.is_menu_visible === true ? "bg-blue-500" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${row.is_menu_visible === true ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      ),
    },
    {
      header: "Footer",
      key: "is_footer_visible",
      render: (value, row) => (
        <button
          onClick={() => handleFooterToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${row.is_footer_visible === true ? "bg-green-500" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${row.is_footer_visible === true ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      ),
    },
    {
      header: "Updated By",
      key: "updated_by",
      render: (_, row) => {
        const { label, title } = getUpdatedByDisplay(row.updated_by);
        return (
          <span className="text-gray-500 text-sm font-medium" title={title}>
            {label}
          </span>
        );
      },
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
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg"
            title="Edit"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => setDeleteId(id)}
            className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg"
            title="Delete"
          >
            <MdDelete size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tabs = [
    { key: "all", label: "All", count: allTotal },
    { key: "active", label: "Active", count: activeTotal },
    {
      key: "inactive",
      label: "Inactive",
      count: Math.max(allTotal - activeTotal, 0),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMS Pages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage static pages and content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={MdRefresh}
            onClick={() => {
              load();
              loadTabCounts();
            }}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={openAdd}>
            Add CMS Page
          </Button>
        </div>
      </div>

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
              placeholder="Search pages..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </div>
          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
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
          emptyMessage="No CMS pages found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min((page - 1) * limit + filteredData.length, total)} of{" "}
            {total} pages
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
                className={`p-1 rounded-lg ${page === 1
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
                className={`p-1 rounded-lg ${page === totalPages || totalPages === 0
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

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete CMS Page"
        message="Delete this page? This action cannot be undone."
      />
    </div>
  );
};

export default CmsPages;