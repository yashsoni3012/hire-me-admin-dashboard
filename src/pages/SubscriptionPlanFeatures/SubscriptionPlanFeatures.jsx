

// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdChevronLeft,
//   MdChevronRight,
//   MdUpload,
//   MdPerson,
//   MdUpdate,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow } from "../../components/common/ViewModal";
// import { subscriptionPlanFeatureService } from "../../services/subscriptionPlanFeature.service";
// import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
// import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// // Robust boolean coercion
// const toBool = (val, fallback = true) => {
//   if (val === undefined || val === null || val === "") return fallback;
//   if (val === true || val === 1 || val === "1" || val === "true") return true;
//   if (val === false || val === 0 || val === "0" || val === "false") return false;
//   return Boolean(val);
// };

// const SubscriptionPlanFeatures = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [userNameCache, setUserNameCache] = useState({});
//   const [togglingId, setTogglingId] = useState(null);
//   const [plans, setPlans] = useState([]);
//   const [features, setFeatures] = useState([]);

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // Load plans
//   const loadPlans = async () => {
//     try {
//       const response = await subscriptionPlanService.getAll({ limit: 1000 });
//       const rawData = response.data?.data || response.data?.results || response.data || [];
//       const plansData = Array.isArray(rawData) ? rawData : [];
//       setPlans(plansData);
//     } catch (error) {
//       console.error("Error loading plans:", error);
//     }
//   };

//   // Load features
//   const loadFeatures = async () => {
//     try {
//       const response = await subscriptionFeatureService.getAll({ limit: 1000 });
//       const rawData = response.data?.data || response.data?.results || response.data || [];
//       const featuresData = Array.isArray(rawData) ? rawData : [];
//       setFeatures(featuresData);
//     } catch (error) {
//       console.error("Error loading features:", error);
//     }
//   };

//   // Normalize subscription plan feature data
//   const normalizePlanFeature = (item) => {
//     // let planName = "-";
//     // if (item.SubscriptionPlan) {
//     //   planName = item.SubscriptionPlan.plan_name || "-";
//     // } else if (item.plan_name) {
//     //   planName = item.plan_name;
//     // } else if (item.subscription_plan_id) {
//     //   const plan = plans.find(p => (p.id || p._id) === item.subscription_plan_id);
//     //   planName = plan?.plan_name || "-";
//     // }

//     // let featureName = "-";
//     // if (item.SubscriptionFeature) {
//     //   featureName = item.SubscriptionFeature.feature_name || "-";
//     // } else if (item.feature_name) {
//     //   featureName = item.feature_name;
//     // } else if (item.subscription_features_id) {
//     //   const feature = features.find(f => (f.id || f._id) === item.subscription_features_id);
//     //   featureName = feature?.feature_name || "-";
//     // }

//     let planName = "-";

//     if (item.SubscriptionPlan?.plan_name) {
//       planName = item.SubscriptionPlan.plan_name;
//     } else if (item.plan_name) {
//       planName = item.plan_name;
//     } else if (item.subscription_plan_id) {
//       const plan = plans.find(
//         (p) => (p.id || p._id) === item.subscription_plan_id
//       );

//       planName = plan?.plan_name || "-";
//     }

//     // Feature name
//     let featureName = "-";

//     // Get feature name from:
//     // SubscriptionPlan -> PlanFeatures -> SubscriptionFeature
//     const planFeature = item.SubscriptionPlan?.PlanFeatures?.find(
//       (feature) =>
//         (feature.subscription_features_id || feature.SubscriptionFeature?.id) ===
//         item.subscription_features_id
//     );

//     if (planFeature?.SubscriptionFeature?.feature_name) {
//       featureName = planFeature.SubscriptionFeature.feature_name;
//     } else if (item.feature_name) {
//       featureName = item.feature_name;
//     } else if (item.subscription_features_id) {
//       const feature = features.find(
//         (f) => (f.id || f._id) === item.subscription_features_id
//       );

//       featureName = feature?.feature_name || "-";
//     }

//     return {
//       id: item.id || item._id,
//       subscription_plan_id: item.subscription_plan_id || "",
//       subscription_features_id: item.subscription_features_id || "",
//       value: item.value || "",
//       display_value: item.display_value || "",
//       is_unlimited: toBool(item.is_unlimited, false),
//       is_trending: toBool(item.is_trending, false),
//       is_status: toBool(item.status, true),
//       updated_by: item.updated_by || "",
//       updated_at: item.updated_at || item.updatedAt || null,
//       created_at: item.created_at || item.createdAt || null,
//       created_by: item.created_by || "",
//       plan_name: planName,
//       feature_name: featureName,
//     };
//   };

//   // Load subscription plan features
//   const load = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach(id => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);

//       await Promise.all([loadPlans(), loadFeatures()]);

//       const r = await subscriptionPlanFeatureService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const planFeatures = Array.isArray(rawData) ? rawData.map(normalizePlanFeature) : [];

//       const sortedPlanFeatures = planFeatures.sort((a, b) => {
//         return new Date(b.created_at) - new Date(a.created_at);
//       });

//       setData(sortedPlanFeatures);
//     } catch (error) {
//       console.error("Load error:", error);
//       showError(error.message || "Failed to load subscription plan features");
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
//         String(item.plan_name ?? "").toLowerCase().includes(query) ||
//         String(item.feature_name ?? "").toLowerCase().includes(query) ||
//         String(item.display_value ?? "").toLowerCase().includes(query)
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => r.is_status === true).length;
//   const inactiveCount = data.length - activeCount;

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

//   const openView = (item) => {
//     setViewData(item);
//     setViewModalOpen(true);
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await subscriptionPlanFeatureService.delete(deleteId);
//       showSuccess("Subscription plan feature deleted successfully");
//       load();
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this feature because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete feature");
//       }
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

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
//         subscription_plan_id: row.subscription_plan_id,
//         subscription_features_id: row.subscription_features_id,
//         value: row.value || "",
//         display_value: row.display_value || "",
//         is_unlimited: row.is_unlimited || false,
//         is_trending: row.is_trending || false,
//         status: newStatus,
//       };

//       await subscriptionPlanFeatureService.update(row.id, updateData);
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
//         subscription_plan_id: row.subscription_plan_id,
//         subscription_features_id: row.subscription_features_id,
//         value: row.value || "",
//         display_value: row.display_value || "",
//         is_unlimited: row.is_unlimited || false,
//         is_trending: newValue,
//         status: row.is_status === true,
//       };

//       await subscriptionPlanFeatureService.update(row.id, updateData);
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
//       header: "Plan Name",
//       key: "plan_name",
//       render: (v) => (
//         <span className="font-medium text-gray-800">{v || "-"}</span>
//       ),
//     },
//     {
//       header: "Feature Name",
//       key: "feature_name",
//       render: (v) => (
//         <span className="font-medium text-gray-800">{v || "-"}</span>
//       ),
//     },
//     {
//       header: "Display Value",
//       key: "display_value",
//       render: (v, row) => {
//         if (row.is_unlimited) {
//           return <span className="text-green-600 font-medium">♾️ Unlimited</span>;
//         }
//         return <span className="text-gray-800">{v || row.value || "-"}</span>;
//       },
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
//         <div className="flex items-center gap-1.5">
//           <span className="text-gray-600 text-sm font-medium">
//             {row.updated_by ? getUpdatedByName(row) : getCreatedByName(row)}
//           </span>
//         </div>
//       ),
//     },
//     // {
//     //   header: "Updated At",
//     //   key: "updated_at",
//     //   // type: "text",
//     //   // disabled: true,
//     //   render: (value) => value ? formatDate(value) : "—"
//     // },
//       {
//         header: "Updated At",
//         key: "updated_at",
//         render: (value) => (
//           <span className="text-gray-500 text-sm">
//             {value ? formatDate(value) : "-"}
//           </span>
//         ),
//       },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1">
//           <button
//             onClick={() => navigate(`/subscription-plan-features/view/${row.id}`, { state: { item: row } })}
//             className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
//             title="View"
//           >
//             <MdVisibility size={16} />
//           </button>
//           <button
//             onClick={() => navigate(`/subscription-plan-features/edit/${row.id}`, { state: { item: row } })}
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
//           <h1 className="text-2xl font-bold text-gray-900">Subscription Plan Features</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage features assigned to subscription plans
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button
//             variant="secondary"
//             icon={MdUpload}
//             onClick={() => navigate('/subscription-plan-features/bulk-add')}
//           >
//             Bulk Upload
//           </Button>
//           <Button icon={MdAdd} onClick={() => navigate('/subscription-plan-features/add')}>
//             Add Feature
//           </Button>
//         </div>
//       </div>

//       {/* Table Card */}
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
//               placeholder="Search by plan or feature..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-5 text-sm">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"}`}
//               >
//                 {tab.label}
//                 <span
//                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
//                     ? "bg-blue-50 text-[#2c0eee]"
//                     : "bg-gray-100 text-gray-500"
//                     }`}
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
//           emptyMessage="No subscription plan features found"
//         />

//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of{" "}
//             {filteredData.length} features
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
//                 className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
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
//                 className={`p-1 rounded-lg transition-colors ${page === 1
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "hover:bg-gray-100 text-gray-500"
//                   }`}
//               >
//                 <MdChevronLeft size={18} />
//               </button>
//               <span className="text-sm text-gray-600 px-2">
//                 Page {page} of {totalPages || 1}
//               </span>
//               <button
//                 onClick={() => setPage(page + 1)}
//                 disabled={page === totalPages || totalPages === 0}
//                 className={`p-1 rounded-lg transition-colors ${page === totalPages || totalPages === 0
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "hover:bg-gray-100 text-gray-500"
//                   }`}
//               >
//                 <MdChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* View Modal */}
//       <ViewModal
//         isOpen={viewModalOpen}
//         onClose={() => {
//           setViewModalOpen(false);
//           setViewData(null);
//         }}
//         title="Plan Feature Details"
//       >
//         {viewData && (
//           <div className="space-y-1">
//             <ViewRow label="Plan Name" value={viewData.plan_name || "-"} />
//             <ViewRow label="Feature Name" value={viewData.feature_name || "-"} />
//             <ViewRow label="Value" value={viewData.value || "-"} />
//             <ViewRow label="Display Value" value={viewData.display_value || "-"} />
//             <ViewRow
//               label="Unlimited"
//               value={viewData.is_unlimited ? "Yes" : "No"}
//             />
//             <ViewRow
//               label="Trending"
//               value={
//                 <span
//                   className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_trending
//                     ? "bg-yellow-50 text-yellow-700"
//                     : "bg-gray-100 text-gray-500"
//                     }`}
//                 >
//                   <span
//                     className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`}
//                   />
//                   {viewData.is_trending ? "Trending" : "Not Trending"}
//                 </span>
//               }
//             />
//             <ViewRow
//               label="Status"
//               value={
//                 <span
//                   className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_status
//                     ? "bg-green-50 text-green-700"
//                     : "bg-gray-100 text-gray-500"
//                     }`}
//                 >
//                   <span
//                     className={`w-1.5 h-1.5 rounded-full ${viewData.is_status ? "bg-green-500" : "bg-gray-400"}`}
//                   />
//                   {viewData.is_status ? "Active" : "Inactive"}
//                 </span>
//               }
//             />
//             <ViewRow
//               label="Created By"
//               value={
//                 <div className="flex items-center gap-1.5">
//                   <MdPerson size={14} className="text-gray-400" />
//                   {getCreatedByName(viewData)}
//                 </div>
//               }
//             />
//             <ViewRow
//               label="Updated By"
//               value={
//                 <div className="flex items-center gap-1.5">
//                   <MdUpdate size={14} className="text-gray-400" />
//                   {viewData.updated_by ? getUpdatedByName(viewData) : getCreatedByName(viewData)}
//                 </div>
//               }
//             />
//             <ViewRow
//               label="Created At"
//               value={formatDate(viewData.created_at)}
//             />
//             <ViewRow
//               label="Updated At"
//               value={formatDate(viewData.updated_at)}
//             />
//           </div>
//         )}
//       </ViewModal>

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Plan Feature"
//         message="Delete this subscription plan feature? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default SubscriptionPlanFeatures;

// pages/subscriptions/SubscriptionPlanFeatures.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
  MdUpload,
  MdPerson,
  MdUpdate,
  MdAutoFixHigh, // ✅ NEW: Bulk Edit icon
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ViewModal, { ViewRow } from "../../components/common/ViewModal";
import { subscriptionPlanFeatureService } from "../../services/subscriptionPlanFeature.service";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

// Robust boolean coercion
const toBool = (val, fallback = true) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false") return false;
  return Boolean(val);
};

const SubscriptionPlanFeatures = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});
  const [togglingId, setTogglingId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);

  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  const loadPlans = async () => {
    try {
      const response = await subscriptionPlanService.getAll({ limit: 1000 });
      const rawData =
        response.data?.data || response.data?.results || response.data || [];
      const plansData = Array.isArray(rawData) ? rawData : [];
      setPlans(plansData);
    } catch (error) {
      console.error("Error loading plans:", error);
    }
  };

  const loadFeatures = async () => {
    try {
      const response = await subscriptionFeatureService.getAll({
        limit: 1000,
      });
      const rawData =
        response.data?.data || response.data?.results || response.data || [];
      const featuresData = Array.isArray(rawData) ? rawData : [];
      setFeatures(featuresData);
    } catch (error) {
      console.error("Error loading features:", error);
    }
  };

  const normalizePlanFeature = (item) => {
    let planName = "-";
    if (item.SubscriptionPlan?.plan_name) {
      planName = item.SubscriptionPlan.plan_name;
    } else if (item.plan_name) {
      planName = item.plan_name;
    } else if (item.subscription_plan_id) {
      const plan = plans.find(
        (p) => (p.id || p._id) === item.subscription_plan_id
      );
      planName = plan?.plan_name || "-";
    }

    let featureName = "-";
    const planFeature = item.SubscriptionPlan?.PlanFeatures?.find(
      (feature) =>
        (feature.subscription_features_id || feature.SubscriptionFeature?.id) ===
        item.subscription_features_id
    );

    if (planFeature?.SubscriptionFeature?.feature_name) {
      featureName = planFeature.SubscriptionFeature.feature_name;
    } else if (item.feature_name) {
      featureName = item.feature_name;
    } else if (item.subscription_features_id) {
      const feature = features.find(
        (f) => (f.id || f._id) === item.subscription_features_id
      );
      featureName = feature?.feature_name || "-";
    }

    return {
      id: item.id || item._id,
      subscription_plan_id: item.subscription_plan_id || "",
      subscription_features_id: item.subscription_features_id || "",
      value: item.value || "",
      display_value: item.display_value || "",
      is_unlimited: toBool(item.is_unlimited, false),
      is_trending: toBool(item.is_trending, false),
      is_status: toBool(item.status, true),
      updated_by: item.updated_by || "",
      updated_at: item.updated_at || item.updatedAt || null,
      created_at: item.created_at || item.createdAt || null,
      created_by: item.created_by || "",
      plan_name: planName,
      feature_name: featureName,
    };
  };

  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach((id) => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      await Promise.all([loadPlans(), loadFeatures()]);

      const r = await subscriptionPlanFeatureService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const planFeatures = Array.isArray(rawData)
        ? rawData.map(normalizePlanFeature)
        : [];

      const sortedPlanFeatures = planFeatures.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setData(sortedPlanFeatures);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load subscription plan features");
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
      const isActive = statusFilter === "active";
      result = result.filter((item) => item.is_status === isActive);
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (item) =>
          String(item.plan_name ?? "").toLowerCase().includes(query) ||
          String(item.feature_name ?? "").toLowerCase().includes(query) ||
          String(item.display_value ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.is_status === true).length;
  const inactiveCount = data.length - activeCount;

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

  const openView = (item) => {
    setViewData(item);
    setViewModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionPlanFeatureService.delete(deleteId);
      showSuccess("Subscription plan feature deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this feature because it is being used in other records."
        );
      } else {
        showError(message || "Failed to delete feature");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.is_status === true;
    const newStatus = !currentStatus;

    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, is_status: newStatus } : item
      )
    );

    try {
      const updateData = {
        subscription_plan_id: row.subscription_plan_id,
        subscription_features_id: row.subscription_features_id,
        value: row.value || "",
        display_value: row.display_value || "",
        is_unlimited: row.is_unlimited || false,
        is_trending: row.is_trending || false,
        status: newStatus,
      };

      await subscriptionPlanFeatureService.update(row.id, updateData);
      showSuccess(
        `Status ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Status toggle error:", error);
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, is_status: currentStatus } : item
        )
      );
      showError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status"
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleTrendingToggle = async (row) => {
    if (togglingId === `trend-${row.id}`) return;
    const currentTrending = row.is_trending === true;
    const newValue = !currentTrending;

    setTogglingId(`trend-${row.id}`);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, is_trending: newValue } : item
      )
    );

    try {
      const updateData = {
        subscription_plan_id: row.subscription_plan_id,
        subscription_features_id: row.subscription_features_id,
        value: row.value || "",
        display_value: row.display_value || "",
        is_unlimited: row.is_unlimited || false,
        is_trending: newValue,
        status: row.is_status === true,
      };

      await subscriptionPlanFeatureService.update(row.id, updateData);
      showSuccess(
        `Trending ${newValue ? "enabled" : "disabled"} successfully`
      );
    } catch (error) {
      console.error("Trending toggle error:", error);
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? { ...item, is_trending: currentTrending }
            : item
        )
      );
      showError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update trending"
      );
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Plan Name",
      key: "plan_name",
      render: (v) => (
        <span className="font-medium text-gray-800">{v || "-"}</span>
      ),
    },
    {
      header: "Feature Name",
      key: "feature_name",
      render: (v) => (
        <span className="font-medium text-gray-800">{v || "-"}</span>
      ),
    },
    {
      header: "Display Value",
      key: "display_value",
      render: (v, row) => {
        if (row.is_unlimited) {
          return (
            <span className="text-green-600 font-medium">♾️ Unlimited</span>
          );
        }
        return <span className="text-gray-800">{v || row.value || "-"}</span>;
      },
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
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600 text-sm font-medium">
            {row.updated_by ? getUpdatedByName(row) : getCreatedByName(row)}
          </span>
        </div>
      ),
    },
    {
      header: "Updated At",
      key: "updated_at",
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {value ? formatDate(value) : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() =>
              navigate(`/subscription-plan-features/view/${row.id}`, {
                state: { item: row },
              })
            }
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() =>
              navigate(`/subscription-plan-features/edit/${row.id}`, {
                state: { item: row },
              })
            }
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

  const tabs = [
    { key: "all", label: "All", count: data.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
  ];

  const totalPages = Math.ceil(filteredData.length / limit);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Plan Features
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage features assigned to subscription plans
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* ✅ NEW: Bulk Edit button */}
          <Button
            variant="secondary"
            icon={MdAutoFixHigh}
            onClick={() => navigate("/subscription-plan-features/bulk-edit")}
          >
            Bulk Edit
          </Button>
          <Button
            variant="secondary"
            icon={MdUpload}
            onClick={() => navigate("/subscription-plan-features/bulk-add")}
          >
            Bulk Upload
          </Button>
          <Button
            icon={MdAdd}
            onClick={() => navigate("/subscription-plan-features/add")}
          >
            Add Feature
          </Button>
        </div>
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
              placeholder="Search by plan or feature..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key
                    ? "text-[#2c0eee]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
                      ? "bg-blue-50 text-[#2c0eee]"
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
          emptyMessage="No subscription plan features found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} features
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
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
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
                onClick={() => setPage(page - 1)}
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
                onClick={() => setPage(page + 1)}
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

      {/* View Modal */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewData(null);
        }}
        title="Plan Feature Details"
      >
        {viewData && (
          <div className="space-y-1">
            <ViewRow label="Plan Name" value={viewData.plan_name || "-"} />
            <ViewRow
              label="Feature Name"
              value={viewData.feature_name || "-"}
            />
            <ViewRow label="Value" value={viewData.value || "-"} />
            <ViewRow
              label="Display Value"
              value={viewData.display_value || "-"}
            />
            <ViewRow
              label="Unlimited"
              value={viewData.is_unlimited ? "Yes" : "No"}
            />
            <ViewRow
              label="Trending"
              value={
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    viewData.is_trending
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"
                    }`}
                  />
                  {viewData.is_trending ? "Trending" : "Not Trending"}
                </span>
              }
            />
            <ViewRow
              label="Status"
              value={
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    viewData.is_status
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      viewData.is_status ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {viewData.is_status ? "Active" : "Inactive"}
                </span>
              }
            />
            <ViewRow
              label="Created By"
              value={
                <div className="flex items-center gap-1.5">
                  <MdPerson size={14} className="text-gray-400" />
                  {getCreatedByName(viewData)}
                </div>
              }
            />
            <ViewRow
              label="Updated By"
              value={
                <div className="flex items-center gap-1.5">
                  <MdUpdate size={14} className="text-gray-400" />
                  {viewData.updated_by
                    ? getUpdatedByName(viewData)
                    : getCreatedByName(viewData)}
                </div>
              }
            />
            <ViewRow
              label="Created At"
              value={formatDate(viewData.created_at)}
            />
            <ViewRow
              label="Updated At"
              value={formatDate(viewData.updated_at)}
            />
          </div>
        )}
      </ViewModal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Plan Feature"
        message="Delete this subscription plan feature? This action cannot be undone."
      />
    </div>
  );
};

export default SubscriptionPlanFeatures;