// import React, { useState, useEffect, useMemo } from "react";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdInsertPhoto,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import FormModal from "../../components/common/FormModal";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow } from "../../components/common/ViewModal";
// import { industryService } from "../../services/industry.service";
// import { subIndustryService } from "../../services/subIndustry.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { getUserName, fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const Industry = () => {
//   const [data, setData] = useState([]);
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
//   const [imageErrors, setImageErrors] = useState({});
//   const [subIndustries, setSubIndustries] = useState([]);
//   const [userNameCache, setUserNameCache] = useState({});

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   const normalizeIndustry = (item) => ({
//     id: item.id || item._id,
//     name: item.name || "",
//     slug: item.slug || "",
//     icon: item.icon || null,
//     is_status: item.is_status !== undefined ? item.is_status : true,
//     is_trending: item.is_trending || false,
//     status: item.status !== undefined ? item.status : true,
//     created_at: item.created_at || item.createdAt || null,
//     updated_at: item.updated_at || item.updatedAt || null,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     raw: item,
//   });

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

//       // Fetch industries
//       const r = await industryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const industries = Array.isArray(rawData) ? rawData.map(normalizeIndustry) : [];

//       // Sort by created_at descending (newest first)
//       const sortedIndustries = industries.sort((a, b) => {
//         return new Date(b.created_at) - new Date(a.created_at);
//       });
//       setData(sortedIndustries);
//     } catch (error) {
//       console.error('Load error:', error);
//       showError(error.message || "Failed to load industries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch every sub-industry so we know which industries have children.
//   const loadSubIndustries = async () => {
//     try {
//       const r = await subIndustryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const subs = Array.isArray(rawData) ? rawData : [];
//       setSubIndustries(subs);
//       return subs;
//     } catch (error) {
//       console.error('Load sub-industries error:', error);
//       return subIndustries;
//     }
//   };

//   useEffect(() => {
//     load();
//     loadSubIndustries();
//   }, []);

//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   const filteredData = useMemo(() => {
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
//         String(item.slug ?? "").toLowerCase().includes(query)
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
//   const inactiveCount = data.length - activeCount;

//   // How many sub-industries point back to this industry?
//   const getSubIndustryCount = (industryId) => {
//     return subIndustries.filter((sub) => {
//       const parentId = sub.Industry?.id ?? sub.industry_id;
//       return String(parentId) === String(industryId);
//     }).length;
//   };

//   // Get display name for created by - uses cached user names
//   const getCreatedByName = (row) => {
//     if (!row) return "-";
//     if (row.created_by) {
//       return getUserNameCached(row.created_by);
//     }
//     return "-";
//   };

//   // Get display name for updated by - uses cached user names
//   const getUpdatedByName = (row) => {
//     if (!row) return "-";
//     if (row.updated_by) {
//       return getUserNameCached(row.updated_by);
//     }
//     return "-";
//   };

//   // Get full image URL helper
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (value.startsWith("http") || value.startsWith("data:image")) {
//       return value;
//     }
//     if (value.startsWith("/uploads/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     return value;
//   };

//   // In your Industry component, replace the form fields configuration:

//   const getFormFields = (editData = null) => {
//     return [
//       {
//         name: "name",
//         label: "Industry Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Technology",
//         help: "Enter a unique name for the industry"
//       },
//       {
//         name: "icon",
//         label: "Industry Icon",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload an icon for the industry (PNG, JPG, SVG) - Max 5MB",
//         placeholder: "Click or drag to upload icon",
//         existingImage: editData?.icon ? getFullImageUrl(editData.icon) : null
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
//         help: "Trending industries will be highlighted in the listing",
//       },
//     ];
//   };

//   // Validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: 'Industry name is required',
//       minLength: 2,
//       minLengthMessage: 'Industry name must be at least 2 characters',
//       maxLength: 50,
//       maxLengthMessage: 'Industry name must be at most 50 characters',
//       custom: (value) => {
//         const exists = data.some(item =>
//           item.name.toLowerCase() === value.toLowerCase() &&
//           (!editItem || item.id !== editItem.id)
//         );
//         if (exists) {
//           return 'This industry name already exists';
//         }
//         return null;
//       }
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
//         status: formData.status,
//         is_trending: formData.is_trending || false,
//       };

//       if (formData.iconFile instanceof File) {
//         submitData.iconFile = formData.iconFile;
//       } else if (editItem && editItem.icon) {
//         submitData.icon = editItem.icon;
//       }

//       if (editItem) {
//         await industryService.update(editItem.id, submitData);
//         showSuccess("Industry updated successfully");
//       } else {
//         await industryService.create(submitData);
//         showSuccess("Industry created successfully");
//       }

//       setModalOpen(false);
//       load();
//     } catch (error) {
//       console.error('Submit error:', error);
//       const errorMessage = error?.message || error?.response?.data?.message || "Failed to save";
//       showError(errorMessage);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDeleteClick = (row) => {
//     const childCount = getSubIndustryCount(row.id);
//     if (childCount > 0) {
//       showError(
//         `Cannot delete it has sub-industrs linked to it`
//       );
//       return;
//     }
//     setDeleteId(row.id);
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await industryService.delete(deleteId);
//       showSuccess("Industry deleted successfully");
//       load();
//       loadSubIndustries();
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/sub[-_ ]?industr|child|foreign\s*key|constraint/i.test(message)) {
//         showError("Cannot delete this industry because it has sub-industries linked to it.");
//       } else {
//         showError(message || "Failed to delete industry");
//       }
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   const handleStatusToggle = async (row) => {
//     const currentStatus = getStatusValue(row);
//     const newStatus = !currentStatus;

//     try {
//       const updateData = {
//         name: row.name,
//         slug: row.slug,
//         is_trending: row.is_trending || false,
//         is_status: newStatus,
//         status: newStatus
//       };

//       await industryService.update(row.id, updateData);
//       showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//       load();
//     } catch (error) {
//       console.error('Status toggle error:', error);
//       showError(error.response?.data?.message || error.message || "Failed to update status");
//     }
//   };

//   const handleTrendingToggle = async (row) => {
//     const newValue = !row.is_trending;

//     try {
//       const updateData = {
//         name: row.name,
//         slug: row.slug,
//         is_trending: newValue,
//         is_status: row.is_status !== undefined ? row.is_status : row.status,
//         status: row.is_status !== undefined ? row.is_status : row.status
//       };

//       await industryService.update(row.id, updateData);
//       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
//       load();
//     } catch (error) {
//       console.error('Trending toggle error:', error);
//       showError(error.response?.data?.message || error.message || "Failed to update trending");
//     }
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

//   const handleImageError = (id) => {
//     setImageErrors((prev) => ({ ...prev, [id]: true }));
//   };

//   const renderIconPreview = (value, rowId) => {
//     if (!value) return <span className="text-gray-400 text-xs">-</span>;

//     const hasError = imageErrors[rowId];
//     const fullUrl = getFullImageUrl(value);

//     if (!hasError && fullUrl) {
//       return (
//         <div className="flex items-center gap-2">
//           <div className="relative group cursor-pointer">
//             <img
//               src={fullUrl}
//               alt="Industry icon"
//               className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
//               onError={() => handleImageError(rowId)}
//             />
//             <button
//               onClick={() => window.open(fullUrl, '_blank')}
//               className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//               title="Click to view image"
//             >
//               <MdVisibility size={16} />
//             </button>
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div className="w-12 h-12 rounded-lg bg-blue-50 border border-[#4529f7] flex items-center justify-center text-[#2c0eee]">
//           <MdInsertPhoto size={20} />
//         </div>
//       );
//     }
//   };

//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1
//     },
//     {
//       header: "Icon",
//       key: "icon",
//       render: (value, row) => renderIconPreview(value, row.id),
//     },
//     {
//       header: "Industry Name",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-gray-800">{v}</span>
//       ),
//     },
//     {
//       header: "Slug",
//       key: "slug",
//       render: (v) => (
//         <span className="text-gray-500 text-sm">{v || "-"}</span>
//       ),
//     },
//     // {
//     //   header: "Created By",
//     //   key: "created_by",
//     //   render: (_, row) => (
//     //     <span className="text-gray-500 text-sm font-medium">
//     //       {getCreatedByName(row)}
//     //     </span>
//     //   ),
//     // },
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
//       header: "Created At",
//       key: "created_at",
//       render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => {
//         const childCount = getSubIndustryCount(row.id);
//         const canDelete = childCount === 0;
//         return (
//           <div className="flex gap-1">
//             <button
//               onClick={() => openView(row)}
//               className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
//               title="View"
//             >
//               <MdVisibility size={16} />
//             </button>
//             <button
//               onClick={() => openEdit(row)}
//               className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
//               title="Edit"
//             >
//               <MdEdit size={16} />
//             </button>
//             <button
//               onClick={() => handleDeleteClick(row)}
//               className={`p-1.5 rounded-lg transition-colors ${canDelete
//                 ? "hover:bg-red-50 text-gray-500 hover:text-red-600"
//                 : "text-gray-300 hover:bg-gray-50 hover:text-gray-400"
//                 }`}
//               title={canDelete ? "Delete" : `Cannot delete  sub-industrs linked`}
//             >
//               <MdDelete size={16} />
//             </button>
//           </div>
//         );
//       },
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
//           <h1 className="text-2xl font-bold text-gray-900">Industries</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage your industry categories</p>
//         </div>
//         <Button icon={MdAdd} onClick={openAdd}>
//           Add Industry
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
//               placeholder="Search industries..."
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
//           emptyMessage="No industries found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of {filteredData.length} industries
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

//       {/* Form Modal with Icon Upload */}
//  // For the FormModal, add these props:
//       <FormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         title={editItem ? "Edit Industry" : "Add Industry"}
//         fields={getFormFields(editItem)}
//         initialData={editItem ? {
//           name: editItem.name || "",
//           icon: editItem.icon || null,
//           status: editItem.is_status !== undefined ? (editItem.is_status ? "active" : "inactive") : "active",
//           is_trending: editItem.is_trending || false
//         } : {
//           name: "",
//           icon: null,
//           status: "active",
//           is_trending: false
//         }}
//         validationRules={validationRules}
//         loading={formLoading}
//         submitLabel={editItem ? "Update" : "Create"}
//         size="lg"
//         existingImage={editItem?.icon ? getFullImageUrl(editItem.icon) : null}
//       />

// // For the ViewModal, use the enhanced components:
//       <ViewModal
//         isOpen={viewModalOpen}
//         onClose={() => {
//           setViewModalOpen(false);
//           setViewData(null);
//         }}
//         title="Industry Details"
//         size="lg"
//       >
//         {viewData && (
//           <>
//             <ViewRow label="Industry Name" value={viewData.name} />
//             <ViewRow label="Slug" value={viewData.slug || "-"} />

//             {viewData.icon && (
//               <ViewRow
//                 label="Icon"
//                 value={
//                   <div className="relative group">
//                     <img
//                       src={getFullImageUrl(viewData.icon)}
//                       alt="Industry icon"
//                       className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                       }}
//                     />
//                     <button
//                       onClick={() => window.open(getFullImageUrl(viewData.icon), '_blank')}
//                       className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//                     >
//                       <MdVisibility size={20} />
//                     </button>
//                   </div>
//                 }
//               />
//             )}

//             <ViewRow
//               label="Status"
//               value={<ViewBadge active={getStatusValue(viewData)} />}
//             />

//             <ViewRow
//               label="Trending"
//               value={<ViewTrendingBadge isTrending={viewData.is_trending} />}
//             />

//             <ViewRow label="Created By" value={getCreatedByName(viewData)} />
//             <ViewRow label="Updated By" value={getUpdatedByName(viewData)} />
//             <ViewRow label="Created At" value={formatDate(viewData.created_at)} />

//             {viewData.updated_at && (
//               <ViewRow label="Updated At" value={formatDate(viewData.updated_at)} />
//             )}
//           </>
//         )}
//       </ViewModal>

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Industry"
//         message="Delete this industry? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default Industry;


// Industry.jsx - Updated to use FormPage
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdVisibility } from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import FormPage from "../../components/common/FormPage";
import { ViewBadge, ViewTrendingBadge } from "../../components/common/FormPageUtils";
import { industryService } from "../../services/industry.service";
import { subIndustryService } from "../../services/subIndustry.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const Industry = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [imageErrors, setImageErrors] = useState({});
  const [subIndustries, setSubIndustries] = useState([]);
  const [userNameCache, setUserNameCache] = useState({});

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  const normalizeIndustry = (item) => ({
    id: item.id || item._id,
    name: item.name || "",
    slug: item.slug || "",
    icon: item.icon || null,
    is_status: item.is_status !== undefined ? item.is_status : true,
    is_trending: item.is_trending || false,
    status: item.status !== undefined ? item.status : true,
    created_at: item.created_at || item.createdAt || null,
    updated_at: item.updated_at || item.updatedAt || null,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    raw: item,
  });

  const load = async () => {
    setLoading(true);
    try {
      // Fetch and cache users
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      // Fetch industries
      const r = await industryService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const industries = Array.isArray(rawData) ? rawData.map(normalizeIndustry) : [];

      // Sort by created_at descending (newest first)
      const sortedIndustries = industries.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setData(sortedIndustries);
    } catch (error) {
      console.error('Load error:', error);
      showError(error.message || "Failed to load industries");
    } finally {
      setLoading(false);
    }
  };

  const loadSubIndustries = async () => {
    try {
      const r = await subIndustryService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const subs = Array.isArray(rawData) ? rawData : [];
      setSubIndustries(subs);
      return subs;
    } catch (error) {
      console.error('Load sub-industries error:', error);
      return subIndustries;
    }
  };

  useEffect(() => {
    load();
    loadSubIndustries();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredData = useMemo(() => {
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
        String(item.slug ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
  const inactiveCount = data.length - activeCount;

  const getSubIndustryCount = (industryId) => {
    return subIndustries.filter((sub) => {
      const parentId = sub.Industry?.id ?? sub.industry_id;
      return String(parentId) === String(industryId);
    }).length;
  };

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

  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http") || value.startsWith("data:image")) {
      return value;
    }
    if (value.startsWith("/uploads/")) {
      return `${API_BASE_URL}${value}`;
    }
    return value;
  };

  // Form fields configuration
  const getFormFields = (editData = null) => {
    return [
      {
        name: "name",
        label: "Industry Name",
        type: "text",
        required: true,
        placeholder: "e.g. Technology",
        help: "Enter a unique name for the industry",
        viewRender: (value) => <span className="font-medium">{value}</span>
      },
      {
        name: "icon",
        label: "Industry Icon",
        type: "file",
        required: false,
        accept: "image/*",
        maxSize: 5,
        help: "Upload an icon for the industry (PNG, JPG, SVG) - Max 5MB",
        placeholder: "Click or drag to upload icon",
        viewRender: (value) => value ? (
          <img
            src={getFullImageUrl(value)}
            alt="Industry icon"
            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span class="text-gray-400">Invalid image</span>';
            }}
          />
        ) : '—'
      },
      {
        name: "status",
        label: "Status",
        type: "radio",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        color: "text-[#2c0eee] focus:ring-[#4529f7]",
        viewRender: (value) => <ViewBadge active={value === 'active'} />
      },
      {
        name: "is_trending",
        label: "Mark as Trending",
        type: "checkbox",
        color: "text-yellow-500 focus:ring-yellow-500",
        help: "Trending industries will be highlighted in the listing",
        viewRender: (value) => <ViewTrendingBadge isTrending={value} />
      },
      {
        name: "created_by_display",
        label: "Created By",
        type: "text",
        disabled: true,
        viewRender: (_, row) => getCreatedByName(row)
      },
      {
        name: "updated_by_display",
        label: "Updated By",
        type: "text",
        disabled: true,
        viewRender: (_, row) => getUpdatedByName(row)
      },
      {
        name: "created_at",
        label: "Created At",
        type: "text",
        disabled: true,
        viewRender: (value) => formatDate(value)
      },
      {
        name: "updated_at",
        label: "Updated At",
        type: "text",
        disabled: true,
        viewRender: (value) => value ? formatDate(value) : '—'
      }
    ];
  };

  // Validation rules
  const validationRules = {
    name: {
      required: true,
      requiredMessage: 'Industry name is required',
      minLength: 2,
      minLengthMessage: 'Industry name must be at least 2 characters',
      maxLength: 50,
      maxLengthMessage: 'Industry name must be at most 50 characters',
      custom: (value, formData) => {
        const existingId = formData?.id;
        const exists = data.some(item =>
          item.name.toLowerCase() === value.toLowerCase() &&
          item.id !== existingId
        );
        if (exists) {
          return 'This industry name already exists';
        }
        return null;
      }
    }
  };

  // Navigation handlers
  const handleAdd = () => {
    navigate('/industries/add');
  };

  const handleEdit = (item) => {
    navigate(`/industries/edit/${item.id}`, { state: { item } });
  };

  const handleView = (item) => {
    navigate(`/industries/view/${item.id}`, { state: { item } });
  };

  const handleDeleteClick = (row) => {
    const childCount = getSubIndustryCount(row.id);
    if (childCount > 0) {
      showError("Cannot delete it has sub-industries linked to it");
      return;
    }
    setDeleteId(row.id);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await industryService.delete(deleteId);
      showSuccess("Industry deleted successfully");
      load();
      loadSubIndustries();
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/sub[-_ ]?industr|child|foreign\s*key|constraint/i.test(message)) {
        showError("Cannot delete this industry because it has sub-industries linked to it.");
      } else {
        showError(message || "Failed to delete industry");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    const currentStatus = getStatusValue(row);
    const newStatus = !currentStatus;

    try {
      const updateData = {
        name: row.name,
        slug: row.slug,
        is_trending: row.is_trending || false,
        is_status: newStatus,
        status: newStatus
      };

      await industryService.update(row.id, updateData);
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
        slug: row.slug,
        is_trending: newValue,
        is_status: row.is_status !== undefined ? row.is_status : row.status,
        status: row.is_status !== undefined ? row.is_status : row.status
      };

      await industryService.update(row.id, updateData);
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

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const renderIconPreview = (value, rowId) => {
    if (!value) return <span className="text-gray-400 text-xs">-</span>;

    const hasError = imageErrors[rowId];
    const fullUrl = getFullImageUrl(value);

    if (!hasError && fullUrl) {
      return (
        <div className="flex items-center gap-2">
          <div className="relative group cursor-pointer">
            <img
              src={fullUrl}
              alt="Industry icon"
              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
              onError={() => handleImageError(rowId)}
            />
            <button
              onClick={() => window.open(fullUrl, '_blank')}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
              title="Click to view image"
            >
              <MdVisibility size={16} />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-lg bg-blue-50 border border-[#4529f7] flex items-center justify-center text-[#2c0eee]">
          <span className="text-xl">📄</span>
        </div>
      );
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1
    },
    {
      header: "Icon",
      key: "icon",
      render: (value, row) => renderIconPreview(value, row.id),
    },
    {
      header: "Industry Name",
      key: "name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    {
      header: "Slug",
      key: "slug",
      render: (v) => (
        <span className="text-gray-500 text-sm">{v || "-"}</span>
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
      render: (id, row) => {
        const childCount = getSubIndustryCount(row.id);
        const canDelete = childCount === 0;
        return (
          <div className="flex gap-1">
            <button
              onClick={() => handleView(row)}
              className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
              title="View"
            >
              <MdVisibility size={16} />
            </button>
            <button
              onClick={() => handleEdit(row)}
              className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
              title="Edit"
            >
              <MdEdit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(row)}
              className={`p-1.5 rounded-lg transition-colors ${canDelete
                ? "hover:bg-red-50 text-red-600"
                : "text-gray-300 hover:bg-gray-50 hover:text-gray-400 cursor-not-allowed"
                }`}
              title={canDelete ? "Delete" : `Cannot delete sub-industries linked`}
            >
              <MdDelete size={16} />
            </button>
          </div>
        );
      },
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
          <h1 className="text-2xl font-bold text-gray-900">Industries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your industry categories</p>
        </div>
        <Button icon={MdAdd} onClick={handleAdd}>
          Add Industry
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
              placeholder="Search industries..."
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
          emptyMessage="No industries found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} industries
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
        title="Delete Industry"
        message="Delete this industry? This action cannot be undone."
      />
    </div>
  );
};

export default Industry;