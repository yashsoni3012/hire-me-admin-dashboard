// import React, { useState, useEffect, useCallback } from "react";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import FormModal from "../../components/common/FormModal";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow, ViewBadge, ViewTrendingBadge } from "../../components/common/ViewModal";
// import { perkBenefitService } from "../../services/perkBenefit.service";
// import { perkBenefitCategoryService } from "../../services/perkBenefitCategory.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const PerkBenefit = () => {
//   const [data, setData] = useState([]);
//   const [parentCategories, setParentCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [userNameCache, setUserNameCache] = useState({});

//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   const normalizePerk = (item) => ({
//     id: item.id || item._id,
//     name: item.name || "",
//     category_id: item.category_id || "",
//     perks_benefits_category: item.perks_benefits_category || null,
//     parent_category_name: item.perks_benefits_category?.name || "",
//     is_status: item.is_status !== undefined ? item.is_status : true,
//     is_trending: item.is_trending || false,
//     status: item.status !== undefined ? item.status : true,
//     createdAt: item.created_at || item.createdAt || null,
//     updatedAt: item.updated_at || item.updatedAt || null,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     raw: item,
//   });

//   // Fetch parent categories
//   const fetchParentCategories = async () => {
//     try {
//       const r = await perkBenefitCategoryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const categories = Array.isArray(rawData) ? rawData : [];
//       setParentCategories(categories);
//     } catch (error) {
//       console.error("Failed to fetch parent categories:", error);
//     }
//   };

//   const load = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach(id => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);

//       const r = await perkBenefitService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const perks = Array.isArray(rawData) ? rawData.map(normalizePerk) : [];
//       // Sort by created_at descending (newest first)
//       const sortedPerks = perks.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setData(sortedPerks);
//     } catch (error) {
//       console.error('Load error:', error);
//       showError(error.message || "Failed to load perk benefits");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     fetchParentCategories();
//   }, []);

//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   const filteredData = React.useMemo(() => {
//     let result = data;
//     if (statusFilter !== "all") {
//       const isActive = statusFilter === "active";
//       result = result.filter((item) => {
//         const itemStatus = item.is_status === true || item.status === true || item.status === "active";
//         return itemStatus === isActive;
//       });
//     }
//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter((item) =>
//         String(item.name ?? "").toLowerCase().includes(query) ||
//         String(item.parent_category_name ?? "").toLowerCase().includes(query)
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
//   const inactiveCount = data.length - activeCount;

//   // Form fields configuration with parent category dropdown
//   const getFormFields = (editData = null) => {
//     const categoryOptions = parentCategories.map(cat => ({
//       value: cat.id || cat._id,
//       label: cat.name || ""
//     }));

//     return [
//       {
//         name: "name",
//         label: "Perk Benefit Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Health Insurance",
//         help: "Enter a unique name for the perk benefit"
//       },
//       {
//         name: "category_id",
//         label: "Parent Category",
//         type: "select",
//         required: true,
//         options: categoryOptions,
//         placeholder: "Select parent category",
//         help: "Select the parent perk benefit category"
//       },
//       {
//         name: "status",
//         label: "Status",
//         type: "radio",
//         options: [
//           { value: "active", label: "Active" },
//           { value: "inactive", label: "Inactive" },
//         ],
//         color: "text-[#2c0eee] focus:ring-[#4529f7]",
//       },
//       {
//         name: "is_trending",
//         label: "Mark as Trending",
//         type: "checkbox",
//         color: "text-yellow-500 focus:ring-yellow-500",
//         help: "Trending perks will be highlighted in the listing",
//       },
//     ];
//   };

//   // Validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: 'Perk benefit name is required',
//       minLength: 2,
//       minLengthMessage: 'Perk benefit name must be at least 2 characters',
//       maxLength: 50,
//       maxLengthMessage: 'Perk benefit name must be at most 50 characters',
//       custom: (value) => {
//         const exists = data.some(item =>
//           item.name.toLowerCase() === value.toLowerCase() &&
//           (!editItem || item.id !== editItem.id)
//         );
//         if (exists) {
//           return 'This perk benefit name already exists';
//         }
//         return null;
//       }
//     },
//     category_id: {
//       required: true,
//       requiredMessage: 'Please select a parent category'
//     }
//   };

//   const openAdd = () => {
//     setEditItem(null);
//     setModalOpen(true);
//   };

//   const openEdit = (item) => {
//     setEditItem(item);
//     setModalOpen(true);
//   };

//   const openView = (item) => {
//     setViewData(item);
//     setViewModalOpen(true);
//   };

//   const handleSubmit = async (formData) => {
//     setFormLoading(true);
//     try {
//       const submitData = {
//         name: formData.name,
//         category_id: formData.category_id,
//         is_status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//       };

//       if (editItem) {
//         await perkBenefitService.update(editItem.id, submitData);
//         showSuccess("Perk benefit updated successfully");
//       } else {
//         await perkBenefitService.create(submitData);
//         showSuccess("Perk benefit created successfully");
//       }
//       setModalOpen(false);
//       load();
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to save");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await perkBenefitService.delete(deleteId);
//       showSuccess("Perk benefit deleted successfully");
//       load();
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this perk benefit because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete perk benefit");
//       }
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   // FIXED: Status toggle - only send fields that need updating
//   const handleStatusToggle = async (row) => {
//     const currentStatus = getStatusValue(row);
//     const newStatus = !currentStatus;

//     try {
//       // Only send the fields that need updating
//       const updateData = {
//         name: row.name,
//         is_trending: row.is_trending || false,
//         is_status: newStatus,
//         status: newStatus ? "active" : "inactive", // For API compatibility
//       };

//       // Only include category_id if it exists and is valid
//       if (row.category_id && row.category_id !== '' && parseInt(row.category_id) > 0) {
//         updateData.category_id = parseInt(row.category_id);
//       }

//       console.log('Toggling status from', currentStatus, 'to', newStatus);
//       console.log('Update data:', updateData);

//       await perkBenefitService.update(row.id, updateData);
//       showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//       load();
//     } catch (error) {
//       console.error('Status toggle error:', error);
//       showError(error.response?.data?.message || error.message || "Failed to update status");
//     }
//   };

//   // FIXED: Trending toggle - only send fields that need updating
//   const handleTrendingToggle = async (row) => {
//     const newValue = !row.is_trending;

//     try {
//       const updateData = {
//         name: row.name,
//         is_trending: newValue,
//         is_status: row.is_status !== undefined ? row.is_status : row.status,
//         status: row.is_status !== undefined ? (row.is_status ? "active" : "inactive") : "active",
//       };

//       // Only include category_id if it exists and is valid
//       if (row.category_id && row.category_id !== '' && parseInt(row.category_id) > 0) {
//         updateData.category_id = parseInt(row.category_id);
//       }

//       console.log('Toggling trending from', row.is_trending, 'to', newValue);
//       console.log('Update data:', updateData);

//       await perkBenefitService.update(row.id, updateData);
//       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
//       load();
//     } catch (error) {
//       console.error('Trending toggle error:', error);
//       showError(error.response?.data?.message || error.message || "Failed to update trending");
//     }
//   };
//   // Get display name for created by
//   const getCreatedByName = (row) => {
//     if (!row) return "-";
//     if (row.created_by) {
//       return getUserNameCached(row.created_by);
//     }
//     return "-";
//   };

//   // Get display name for updated by
//   const getUpdatedByName = (row) => {
//     if (!row) return "-";
//     if (row.updated_by) {
//       return getUserNameCached(row.updated_by);
//     }
//     return "-";
//   };

//   const getStatusValue = (row) => {
//     if (row.is_status !== undefined) {
//       return row.is_status;
//     }
//     if (row.status !== undefined) {
//       return row.status;
//     }
//     return true;
//   };

//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1
//     },
//     {
//       header: "Perk Benefit Name",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-gray-800">{v}</span>
//       ),
//     },
//     {
//       header: "Parent Category",
//       key: "parent_category_name",
//       render: (v) => (
//         <span className="text-gray-600">{v || "-"}</span>
//       ),
//     },
//     {
//       header: "Trending",
//       key: "is_trending",
//       render: (value, row) => (
//         <button
//           onClick={() => handleTrendingToggle(row)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"
//             }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"
//               }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (status, row) => {
//         const isActive = getStatusValue(row);
//         return (
//           <button
//             onClick={() => handleStatusToggle(row)}
//             className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"
//               }`}
//           >
//             <span
//               className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"
//                 }`}
//             />
//           </button>
//         );
//       },
//     },
//     {
//       header: "Created By",
//       key: "created_by",
//       render: (_, row) => (
//         <span className="text-gray-500 text-sm font-medium">
//           {getCreatedByName(row)}
//         </span>
//       ),
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
//       header: "Created At",
//       key: "createdAt",
//       render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1">
//           <button
//             onClick={() => openView(row)}
//             className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
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

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Perk & Benefits</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage perk benefits for job listings</p>
//         </div>
//         <Button icon={MdAdd} onClick={openAdd}>
//           Add Perk Benefit
//         </Button>
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
//               placeholder="Search perk benefits..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-5 text-sm">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
//                   }`}
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
//           emptyMessage="No perk benefits found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of {filteredData.length} perk benefits
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

//       {/* Form Modal - Fix initialData for category_id */}
//       <FormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         title={editItem ? "Edit Perk Benefit" : "Add Perk Benefit"}
//         fields={getFormFields(editItem)}
//         initialData={editItem ? {
//           name: editItem.name || "",
//           // IMPORTANT: Get the category_id from the edit item
//           category_id: editItem.category_id || (editItem.perks_benefits_category?.id) || "",
//           status: editItem.is_status !== undefined ? (editItem.is_status ? "active" : "inactive") : "active",
//           is_trending: editItem.is_trending || false
//         } : {
//           name: "",
//           category_id: "",
//           status: "active",
//           is_trending: false
//         }}
//         validationRules={validationRules}
//         loading={formLoading}
//         submitLabel={editItem ? "Update" : "Create"}
//         size="sm"
//       />

//       {/* View Modal */}
//       <ViewModal
//         isOpen={viewModalOpen}
//         onClose={() => {
//           setViewModalOpen(false);
//           setViewData(null);
//         }}
//         title="Perk Benefit Details"
//       >
//         {viewData && (
//           <div className="space-y-1">
//             <ViewRow label="Perk Benefit Name" value={viewData.name} />
//             <ViewRow label="Parent Category" value={viewData.parent_category_name || "-"} />
//             <ViewRow
//               label="Status"
//               value={
//                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusValue(viewData)
//                   ? "bg-green-50 text-green-700"
//                   : "bg-gray-100 text-gray-500"
//                   }`}>
//                   <span className={`w-1.5 h-1.5 rounded-full ${getStatusValue(viewData) ? "bg-green-500" : "bg-gray-400"}`} />
//                   {getStatusValue(viewData) ? "Active" : "Inactive"}
//                 </span>
//               }
//             />
//             <ViewRow
//               label="Trending"
//               value={
//                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_trending
//                   ? "bg-yellow-50 text-yellow-700"
//                   : "bg-gray-100 text-gray-500"
//                   }`}>
//                   <span className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`} />
//                   {viewData.is_trending ? "Trending" : "Not Trending"}
//                 </span>
//               }
//             />
//             <ViewRow label="Created At" value={formatDate(viewData.createdAt)} />
//             {viewData.updatedAt && (
//               <ViewRow label="Updated At" value={formatDate(viewData.updatedAt)} />
//             )}
//             {viewData.created_by && (
//               <ViewRow label="Created By" value={viewData.created_by} />
//             )}
//           </div>
//         )}
//       </ViewModal>

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Perk Benefit"
//         message="Delete this perk benefit? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default PerkBenefit;


// pages/PerkBenefit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { perkBenefitService } from "../../services/perkBenefit.service";
import { perkBenefitCategoryService } from "../../services/perkBenefitCategory.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const PerkBenefit = () => {
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

  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  const normalizePerk = (item) => ({
    id: item.id || item._id,
    name: item.name || "",
    category_id: item.category_id || "",
    perks_benefits_category: item.perks_benefits_category || null,
    parent_category_name: item.perks_benefits_category?.name || "",
    is_status: item.is_status !== undefined ? item.is_status : true,
    is_trending: item.is_trending || false,
    status: item.status !== undefined ? item.status : true,
    createdAt: item.created_at || item.createdAt || null,
    updatedAt: item.updated_at || item.updatedAt || null,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    raw: item,
  });

  // const load = async () => {
  //   setLoading(true);
  //   try {
  //     const users = await fetchUsers();
  //     const userMap = {};
  //     Object.keys(users).forEach(id => {
  //       userMap[id] = users[id].name;
  //     });
  //     setUserNameCache(userMap);

  //     // const r = await perkBenefitService.getAll({ limit: 1000 });
  //     // const rawData = r.data?.data || r.data?.results || r.data || [];

  //     const r = await perkBenefitService.getAll();

  //     const rawData =
  //       r.data?.data ||
  //       r.data?.results ||
  //       r.data ||
  //       [];

  //     const perks = Array.isArray(rawData)
  //       ? rawData.map(normalizePerk)
  //       : [];

  //     // const perks = Array.isArray(rawData) ? rawData.map(normalizePerk) : [];
  //     const sortedPerks = perks.sort((a, b) => {
  //       return new Date(b.createdAt) - new Date(a.createdAt);
  //     });
  //     setData(sortedPerks);
  //   } catch (error) {
  //     console.error('Load error:', error);
  //     showError(error.message || "Failed to load perk benefits");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const load = async () => {
    setLoading(true);

    try {
      const users = await fetchUsers();

      const userMap = {};

      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });

      setUserNameCache(userMap);

      // Fetch ALL pages
      const r = await perkBenefitService.getAll();

      const rawData =
        r.data?.data ||
        r.data?.results ||
        r.data ||
        [];

      const perks = Array.isArray(rawData)
        ? rawData.map(normalizePerk)
        : [];

      const sortedPerks = perks.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setData(sortedPerks);

    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load perk benefits");
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

  const filteredData = React.useMemo(() => {
    let result = data;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((item) => {
        const itemStatus = item.is_status === true || item.status === true || item.status === "active";
        return itemStatus === isActive;
      });
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        String(item.name ?? "").toLowerCase().includes(query) ||
        String(item.parent_category_name ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
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

  // const handleDelete = async () => {
  //   setDeleteLoading(true);
  //   try {
  //     await perkBenefitService.delete(deleteId);
  //     showSuccess("Perk benefit deleted successfully");
  //     load();
  //   } catch (error) {
  //     console.error('Delete error:', error);
  //     const message = error?.response?.data?.message || error?.message || "";
  //     if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
  //       showError("Cannot delete this perk benefit because it is being used in other records.");
  //     } else {
  //       showSuccess("Perk benefit deleted successfully");
  //     }
  //   } finally {
  //     setDeleteId(null);
  //     setDeleteLoading(false);
  //   }
  // };

  const handleDelete = async () => {
    if (!deleteId) return;

    const idToDelete = deleteId;

    setDeleteLoading(true);

    try {
      await perkBenefitService.delete(idToDelete);

      // Remove deleted item immediately from frontend
      setData((prevData) =>
        prevData.filter((item) => item.id !== idToDelete)
      );

      // Close dialog
      setDeleteId(null);

      // Reset page
      setPage(1);

      showSuccess("Perk benefit deleted successfully");

      // Fetch latest data from server
      await load();

    } catch (error) {
      console.error("Delete error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete perk benefit";

      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this perk benefit because it is being used in other records."
        );
      } else {
        showError(message);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    const currentStatus = getStatusValue(row);
    const newStatus = !currentStatus;

    try {
      const updateData = {
        name: row.name,
        is_trending: row.is_trending || false,
        is_status: newStatus,
        status: newStatus ? "active" : "inactive",
      };

      if (row.category_id && row.category_id !== '' && parseInt(row.category_id) > 0) {
        updateData.category_id = parseInt(row.category_id);
      }

      await perkBenefitService.update(row.id, updateData);
      showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
      load();
    } catch (error) {
      console.error('Status toggle error:', error);
      showError(error.response?.data?.message || error.message || "Failed to update status");
    }
  };

  const handleTrendingToggle = async (row) => {
    const newValue = !row.is_trending;

    try {
      const updateData = {
        name: row.name,
        is_trending: newValue,
        is_status: row.is_status !== undefined ? row.is_status : row.status,
        status: row.is_status !== undefined ? (row.is_status ? "active" : "inactive") : "active",
      };

      if (row.category_id && row.category_id !== '' && parseInt(row.category_id) > 0) {
        updateData.category_id = parseInt(row.category_id);
      }

      await perkBenefitService.update(row.id, updateData);
      showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
      load();
    } catch (error) {
      console.error('Trending toggle error:', error);
      showError(error.response?.data?.message || error.message || "Failed to update trending");
    }
  };

  const getStatusValue = (row) => {
    if (row.is_status !== undefined) {
      return row.is_status;
    }
    if (row.status !== undefined) {
      return row.status;
    }
    return true;
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1
    },
    {
      header: "Perk Benefit Name",
      key: "name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    {
      header: "Parent Category",
      key: "parent_category_name",
      render: (v) => (
        <span className="text-gray-600">{v || "-"}</span>
      ),
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (value, row) => (
        <button
          onClick={() => handleTrendingToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (status, row) => {
        const isActive = getStatusValue(row);
        return (
          <button
            onClick={() => handleStatusToggle(row)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"
              }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"
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
      key: "updatedAt",
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
            onClick={() => navigate(`/perk-benefits/view/${row.id}`, { state: { item: row } })}
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => navigate(`/perk-benefits/edit/${row.id}`, { state: { item: row } })}
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perk & Benefits</h1>
          <p className="text-sm text-gray-500 mt-1">Manage perk benefits for job listings</p>
        </div>
        <Button icon={MdAdd} onClick={() => navigate('/perk-benefits/add')}>
          Add Perk Benefit
        </Button>
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
              placeholder="Search perk benefits..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
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
          emptyMessage="No perk benefits found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} perk benefits
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Perk Benefit"
        message="Delete this perk benefit? This action cannot be undone."
      />
    </div>
  );
};

export default PerkBenefit;