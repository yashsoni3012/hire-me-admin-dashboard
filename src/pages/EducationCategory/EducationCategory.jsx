// // import React, { useState, useEffect, useCallback } from "react";
// // import {
// //   MdAdd,
// //   MdEdit,
// //   MdDelete,
// //   MdSearch,
// //   MdVisibility,
// // } from "react-icons/md";
// // import Table from "../../components/common/Table";
// // import Button from "../../components/common/Button";
// // import Pagination from "../../components/common/Pagination";
// // import FormModal from "../../components/common/FormModal";
// // import ConfirmDialog from "../../components/common/ConfirmDialog";
// // import ViewModal, { ViewRow, ViewBadge, ViewTrendingBadge } from "../../components/common/ViewModal";
// // import { educationCategoryService } from "../../services/educationCategory.service";
// // import { educationSubCategoryService } from "../../services/educationSubCategory.service";
// // import { showSuccess, showError, showInfo } from "../../utils/toast";
// // import { formatDate } from "../../utils/helpers";

// // const EducationCategory = () => {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [viewModalOpen, setViewModalOpen] = useState(false);
// //   const [viewData, setViewData] = useState(null);
// //   const [editItem, setEditItem] = useState(null);
// //   const [deleteId, setDeleteId] = useState(null);
// //   const [formLoading, setFormLoading] = useState(false);
// //   const [deleteLoading, setDeleteLoading] = useState(false);
// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [limit, setLimit] = useState(10);
// //   const [statusFilter, setStatusFilter] = useState("all");

// //   const normalizeCategory = (item) => ({
// //     id: item.id || item._id,
// //     name: item.name || "",
// //     status: item.status || "active",
// //     is_status: item.status === "active",
// //     is_trending: item.is_trending || false,
// //     createdAt: item.created_at || item.createdAt || null,
// //     updatedAt: item.updated_at || item.updatedAt || null,
// //     description: item.description || "",
// //     created_by: item.created_by || "",
// //     raw: item,
// //   });

// //   const load = async () => {
// //     setLoading(true);
// //     try {
// //       const r = await educationCategoryService.getAll({ limit: 1000 });
// //       const rawData = r.data?.data || r.data?.results || r.data || [];
// //       const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
// //       setData(categories);
// //     } catch (error) {
// //       console.error('Load error:', error);
// //       showError(error.message || "Failed to load education categories");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     load();
// //   }, []);

// //   useEffect(() => {
// //     setPage(1);
// //   }, [search, statusFilter]);

// //   const filteredData = React.useMemo(() => {
// //     let result = data;
// //     if (statusFilter !== "all") {
// //       const isActive = statusFilter === "active";
// //       result = result.filter((item) => {
// //         const itemStatus = item.is_status === true || item.status === "active";
// //         return itemStatus === isActive;
// //       });
// //     }
// //     const query = search.toLowerCase().trim();
// //     if (query) {
// //       result = result.filter((item) =>
// //         String(item.name ?? "").toLowerCase().includes(query)
// //       );
// //     }
// //     return result;
// //   }, [data, search, statusFilter]);

// //   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

// //   const activeCount = data.filter((r) => r.is_status === true || r.status === "active").length;
// //   const inactiveCount = data.length - activeCount;

// //   // Form fields configuration
// //   const getFormFields = () => {
// //     return [
// //       {
// //         name: "name",
// //         label: "Category Name",
// //         type: "text",
// //         required: true,
// //         placeholder: "e.g. Computer Science",
// //         help: "Enter a unique name for the category"
// //       },
// //       {
// //         name: "status",
// //         label: "Status",
// //         type: "radio",
// //         options: [
// //           { value: "active", label: "Active" },
// //           { value: "inactive", label: "Inactive" },
// //         ],
// //         color: "text-[#2c0eee] focus:ring-[#4529f7]",
// //       },
// //       {
// //         name: "is_trending",
// //         label: "Mark as Trending",
// //         type: "checkbox",
// //         color: "text-yellow-500 focus:ring-yellow-500",
// //         help: "Trending categories will be highlighted in the listing",
// //       },
// //     ];
// //   };

// //   // Validation rules
// //   const validationRules = {
// //     name: {
// //       required: true,
// //       requiredMessage: 'Category name is required',
// //       minLength: 2,
// //       minLengthMessage: 'Category name must be at least 2 characters',
// //       maxLength: 50,
// //       maxLengthMessage: 'Category name must be at most 50 characters',
// //       custom: (value) => {
// //         const exists = data.some(item =>
// //           item.name.toLowerCase() === value.toLowerCase() &&
// //           (!editItem || item.id !== editItem.id)
// //         );
// //         if (exists) {
// //           return 'This category name already exists';
// //         }
// //         return null;
// //       }
// //     }
// //   };

// //   const openAdd = () => {
// //     setEditItem(null);
// //     setModalOpen(true);
// //   };

// //   const openEdit = (item) => {
// //     setEditItem(item);
// //     setModalOpen(true);
// //   };

// //   const openView = (item) => {
// //     setViewData(item);
// //     setViewModalOpen(true);
// //   };

// //   const handleSubmit = async (formData) => {
// //     setFormLoading(true);
// //     try {
// //       if (editItem) {
// //         await educationCategoryService.update(editItem.id, formData);
// //         showSuccess("Category updated successfully");
// //       } else {
// //         await educationCategoryService.create(formData);
// //         showSuccess("Category created successfully");
// //       }
// //       setModalOpen(false);
// //       load();
// //     } catch (error) {
// //       console.error('Submit error:', error);
// //       showError(error.message || error?.response?.data?.message || "Failed to save");
// //     } finally {
// //       setFormLoading(false);
// //     }
// //   };

// //   // const handleDelete = async () => {
// //   //   setDeleteLoading(true);
// //   //   try {
// //   //     await educationCategoryService.delete(deleteId);
// //   //     showSuccess("Category deleted successfully");
// //   //     load();
// //   //   } catch (error) {
// //   //     console.error('Delete error:', error);
// //   //     showError(error.message || "Failed to delete");
// //   //   } finally {
// //   //     setDeleteId(null);
// //   //     setDeleteLoading(false);
// //   //   }
// //   // };

// //   const handleDelete = async () => {
// //     showError("You cannot delete it because it have child categories");
// //     return; // ❌ stop function here
// //   };

// //   const handleDeleteClick = async (row) => {
// //     const categoryId = row.id || row._id;
// //     const categoryName = row.name || "";

// //     try {
// //       const response = await educationSubCategoryService.getByEducationId(categoryId);
// //       const subCategories = response.data || response.results || [];

// //       if (subCategories.length > 0) {
// //         showInfo(
// //           `Cannot delete "${categoryName}" because it has ${subCategories.length} sub-category(s). Please delete the sub-categories first.`
// //         );
// //         return;
// //       }
// //     } catch (error) {
// //       console.error('Check sub-categories error:', error);
// //       showInfo(
// //         `Cannot delete "${categoryName}" because it may have sub-categories. Please delete the sub-categories first.`
// //       );
// //       return;
// //     }

// //     setDeleteId(categoryId);
// //   };

// //   const handleStatusToggle = async (row) => {
// //     const currentStatus = row.is_status !== undefined ? row.is_status : row.status === "active";
// //     const newStatus = !currentStatus;

// //     try {
// //       const updateData = {
// //         name: row.name,
// //         is_trending: row.is_trending || false,
// //         status: newStatus ? "active" : "inactive"
// //       };

// //       await educationCategoryService.update(row.id, updateData);
// //       showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
// //       load();
// //     } catch (error) {
// //       console.error('Status toggle error:', error);
// //       showError(error.response?.data?.message || error.message || "Failed to update status");
// //     }
// //   };

// //   const handleTrendingToggle = async (row) => {
// //     const newValue = !row.is_trending;

// //     try {
// //       const updateData = {
// //         name: row.name,
// //         is_trending: newValue,
// //         status: row.status || "active"
// //       };

// //       await educationCategoryService.update(row.id, updateData);
// //       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
// //       load();
// //     } catch (error) {
// //       console.error('Trending toggle error:', error);
// //       showError(error.response?.data?.message || error.message || "Failed to update trending");
// //     }
// //   };

// //   const getStatusValue = (row) => {
// //     if (row.is_status !== undefined) {
// //       return row.is_status;
// //     }
// //     if (row.status) {
// //       return row.status === "active";
// //     }
// //     return true;
// //   };

// //   const columns = [
// //     {
// //       header: "#",
// //       key: "id",
// //       render: (_, __, i) => (page - 1) * limit + i + 1
// //     },
// //     {
// //       header: "Category Name",
// //       key: "name",
// //       render: (v) => (
// //         <span className="font-medium capitalize text-gray-800">{v}</span>
// //       ),
// //     },
// //     {
// //       header: "Trending",
// //       key: "is_trending",
// //       render: (value, row) => (
// //         <button
// //           onClick={() => handleTrendingToggle(row)}
// //           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"
// //             }`}
// //         >
// //           <span
// //             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"
// //               }`}
// //           />
// //         </button>
// //       ),
// //     },
// //     {
// //       header: "Status",
// //       key: "status",
// //       render: (status, row) => {
// //         const isActive = getStatusValue(row);
// //         return (
// //           <button
// //             onClick={() => handleStatusToggle(row)}
// //             className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"
// //               }`}
// //           >
// //             <span
// //               className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"
// //                 }`}
// //             />
// //           </button>
// //         );
// //       },
// //     },
// //     {
// //       header: "Created At",
// //       key: "createdAt",
// //       render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
// //     },
// //     {
// //       header: "Actions",
// //       key: "id",
// //       render: (id, row) => (
// //         <div className="flex gap-1">
// //           <button
// //             onClick={() => openView(row)}
// //             className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
// //             title="View"
// //           >
// //             <MdVisibility size={16} />
// //           </button>
// //           <button
// //             onClick={() => openEdit(row)}
// //             className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
// //             title="Edit"
// //           >
// //             <MdEdit size={16} />
// //           </button>
// //           <button
// //             onClick={() => handleDeleteClick(row)}
// //             className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
// //             title="Delete"
// //           >
// //             <MdDelete size={16} />
// //           </button>
// //         </div>
// //       ),
// //     },
// //   ];

// //   const tabs = [
// //     { key: "all", label: "All", count: data.length },
// //     { key: "active", label: "Active", count: activeCount },
// //     { key: "inactive", label: "Inactive", count: inactiveCount },
// //   ];

// //   return (
// //     <div className="space-y-4">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Education Categories</h1>
// //           <p className="text-sm text-gray-500 mt-1">Manage education categories for job listings</p>
// //         </div>
// //         <Button icon={MdAdd} onClick={openAdd}>
// //           Add Category
// //         </Button>
// //       </div>

// //       {/* Table Card */}
// //       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
// //         {/* Top bar: search + tabs */}
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
// //           <div className="relative w-full sm:w-72">
// //             <MdSearch
// //               size={18}
// //               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
// //             />
// //             <input
// //               type="text"
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               placeholder="Search categories..."
// //               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
// //             />
// //           </div>

// //           <div className="flex items-center gap-5 text-sm">
// //             {tabs.map((tab) => (
// //               <button
// //                 key={tab.key}
// //                 onClick={() => setStatusFilter(tab.key)}
// //                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
// //                   }`}
// //               >
// //                 {tab.label}
// //                 <span
// //                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
// //                     ? "bg-blue-50 text-[#2c0eee]"
// //                     : "bg-gray-100 text-gray-500"
// //                     }`}
// //                 >
// //                   {tab.count}
// //                 </span>
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         <Table
// //           columns={columns}
// //           data={paginatedData}
// //           loading={loading}
// //           emptyMessage="No categories found"
// //         />

// //         {/* Footer */}
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
// //           <p className="text-xs text-gray-400">
// //             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
// //             {"–"}
// //             {Math.min(page * limit, filteredData.length)} of {filteredData.length} categories
// //           </p>
// //           <Pagination
// //             page={page}
// //             total={filteredData.length}
// //             limit={limit}
// //             onChange={setPage}
// //             onLimitChange={(newLimit) => {
// //               setLimit(newLimit);
// //               setPage(1);
// //             }}
// //           />
// //         </div>
// //       </div>

// //       {/* Form Modal with Validation */}
// //       <FormModal
// //         isOpen={modalOpen}
// //         onClose={() => setModalOpen(false)}
// //         onSubmit={handleSubmit}
// //         title={editItem ? "Edit Category" : "Add Category"}
// //         fields={getFormFields()}
// //         initialData={editItem ? {
// //           name: editItem.name || "",
// //           status: editItem.status || "active",
// //           is_trending: editItem.is_trending || false
// //         } : {
// //           name: "",
// //           status: "active",
// //           is_trending: false
// //         }}
// //         validationRules={validationRules}
// //         loading={formLoading}
// //         submitLabel={editItem ? "Update" : "Create"}
// //         size="sm"
// //       />

// //       {/* View Modal */}
// //       <ViewModal
// //         isOpen={viewModalOpen}
// //         onClose={() => {
// //           setViewModalOpen(false);
// //           setViewData(null);
// //         }}
// //         title="Category Details"
// //       >
// //         {viewData && (
// //           <div className="space-y-1">
// //             <ViewRow label="Category Name" value={viewData.name} />
// //             <ViewRow
// //               label="Status"
// //               value={
// //                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusValue(viewData)
// //                   ? "bg-green-50 text-green-700"
// //                   : "bg-gray-100 text-gray-500"
// //                   }`}>
// //                   <span className={`w-1.5 h-1.5 rounded-full ${getStatusValue(viewData) ? "bg-green-500" : "bg-gray-400"}`} />
// //                   {getStatusValue(viewData) ? "Active" : "Inactive"}
// //                 </span>
// //               }
// //             />
// //             <ViewRow
// //               label="Trending"
// //               value={
// //                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_trending
// //                   ? "bg-yellow-50 text-yellow-700"
// //                   : "bg-gray-100 text-gray-500"
// //                   }`}>
// //                   <span className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`} />
// //                   {viewData.is_trending ? "Trending" : "Not Trending"}
// //                 </span>
// //               }
// //             />
// //             <ViewRow label="Created At" value={formatDate(viewData.createdAt)} />
// //             {viewData.updatedAt && (
// //               <ViewRow label="Updated At" value={formatDate(viewData.updatedAt)} />
// //             )}
// //             {viewData.created_by && (
// //               <ViewRow label="Created By" value={viewData.created_by} />
// //             )}
// //             {viewData.description && (
// //               <ViewRow label="Description" value={viewData.description} />
// //             )}
// //           </div>
// //         )}
// //       </ViewModal>

// //       <ConfirmDialog
// //         isOpen={!!deleteId}
// //         onClose={() => setDeleteId(null)}
// //         onConfirm={handleDelete}
// //         loading={deleteLoading}
// //         title="Delete Category"
// //         message="Delete this category? Associated sub-categories may be affected."
// //       />
// //     </div>
// //   );
// // };

// // export default EducationCategory;


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
// import { educationCategoryService } from "../../services/educationCategory.service";
// import { educationSubCategoryService } from "../../services/educationSubCategory.service";
// import { showSuccess, showError, showInfo } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const EducationCategory = () => {
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
//   const [subCategories, setSubCategories] = useState([]);
//   const [userNameCache, setUserNameCache] = useState({});

//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };
//   const normalizeCategory = (item) => ({
//     id: item.id || item._id,
//     name: item.name || "",
//     status: item.status || "active",
//     is_status: item.status === "active",
//     is_trending: item.is_trending || false,
//     createdAt: item.created_at || item.createdAt || null,
//     updatedAt: item.updated_at || item.updatedAt || null,
//     description: item.description || "",
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     raw: item,
//   });

//   const load = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach(id => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);

//       const r = await educationCategoryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
//       // Sort by created_at descending (newest first)
//       const sortedCategories = categories.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setData(sortedCategories);
//     } catch (error) {
//       console.error('Load error:', error);
//       showError(error.message || "Failed to load education categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch every sub-category so we know which categories have children.
//   const loadSubCategories = async () => {
//     try {
//       const r = await educationSubCategoryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const subs = Array.isArray(rawData) ? rawData : [];
//       setSubCategories(subs);
//       return subs;
//     } catch (error) {
//       console.error('Load sub-categories error:', error);
//       return subCategories;
//     }
//   };

//   useEffect(() => {
//     load();
//     loadSubCategories();
//   }, []);

//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   const filteredData = React.useMemo(() => {
//     let result = data;
//     if (statusFilter !== "all") {
//       const isActive = statusFilter === "active";
//       result = result.filter((item) => {
//         const itemStatus = item.is_status === true || item.status === "active";
//         return itemStatus === isActive;
//       });
//     }
//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter((item) =>
//         String(item.name ?? "").toLowerCase().includes(query)
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => r.is_status === true || r.status === "active").length;
//   const inactiveCount = data.length - activeCount;

//   // How many sub-categories point back to this category?
//   const getSubCategoryCount = (categoryId) => {
//     return subCategories.filter((sub) => {
//       const parentId = sub.education_id || sub.EducationCategory?.id;
//       return String(parentId) === String(categoryId);
//     }).length;
//   };

//   // Form fields configuration
//   const getFormFields = (editData = null) => {
//     return [
//       {
//         name: "name",
//         label: "Category Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Computer Science",
//         help: "Enter a unique name for the category"
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
//         help: "Trending categories will be highlighted in the listing",
//       },
//     ];
//   };

//   // Validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: 'Category name is required',
//       minLength: 2,
//       minLengthMessage: 'Category name must be at least 2 characters',
//       maxLength: 50,
//       maxLengthMessage: 'Category name must be at most 50 characters',
//       custom: (value) => {
//         const exists = data.some(item =>
//           item.name.toLowerCase() === value.toLowerCase() &&
//           (!editItem || item.id !== editItem.id)
//         );
//         if (exists) {
//           return 'This category name already exists';
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
//       if (editItem) {
//         await educationCategoryService.update(editItem.id, formData);
//         showSuccess("Category updated successfully");
//       } else {
//         await educationCategoryService.create(formData);
//         showSuccess("Category created successfully");
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


//   // Fired from the trash icon - blocks the action up front if sub-categories
//   // are still linked, instead of opening a confirm dialog that can't succeed.
//   const handleDeleteClick = (row) => {
//     const childCount = getSubCategoryCount(row.id);
//     if (childCount > 0) {
//       showError(
//         `Cannot delete "${row.name}" - it has ${childCount} sub-categor${childCount === 1 ? "y" : "ies"} linked to it. Please delete or reassign ${childCount === 1 ? "it" : "them"} first.`
//       );
//       return;
//     }
//     setDeleteId(row.id);
//   };

//   // Fired when the user confirms deletion in the dialog. By this point we've
//   // already verified there are no linked sub-categories, but the catch block
//   // below still recognizes a backend "has children" error as a fallback.
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await educationCategoryService.delete(deleteId);
//       showSuccess("Category deleted successfully");
//       load();
//       loadSubCategories();
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/sub[-_ ]?categor|child|foreign\s*key|constraint/i.test(message)) {
//         showError("Cannot delete this category because it has sub-categories linked to it.");
//       } else {
//         showError(message || "Failed to delete category");
//       }
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   const handleStatusToggle = async (row) => {
//     const currentStatus = row.is_status !== undefined ? row.is_status : row.status === "active";
//     const newStatus = !currentStatus;

//     try {
//       const updateData = {
//         name: row.name,
//         is_trending: row.is_trending || false,
//         status: newStatus ? "active" : "inactive",
//         is_status: newStatus,
//       };

//       await educationCategoryService.update(row.id, updateData);
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
//         is_trending: newValue,
//         status: row.status || "active",
//         is_status: row.is_status !== undefined ? row.is_status : true,
//       };

//       await educationCategoryService.update(row.id, updateData);
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
//     if (row.status) {
//       return row.status === "active";
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
//       header: "Category Name",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-gray-800">{v}</span>
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
//       render: (id, row) => {
//         const childCount = getSubCategoryCount(row.id);
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
//               title={canDelete ? "Delete" : `Cannot delete - ${childCount} sub-categor${childCount === 1 ? "y" : "ies"} linked`}
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
//           <h1 className="text-2xl font-bold text-gray-900">Education Categories</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage education categories for job listings</p>
//         </div>
//         <Button icon={MdAdd} onClick={openAdd}>
//           Add Category
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
//               placeholder="Search categories..."
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
//           emptyMessage="No categories found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of {filteredData.length} categories
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

//       {/* Form Modal with Validation */}
//       <FormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         title={editItem ? "Edit Category" : "Add Category"}
//         fields={getFormFields(editItem)}
//         initialData={editItem ? {
//           name: editItem.name || "",
//           status: editItem.is_status !== undefined ? (editItem.is_status ? "active" : "inactive") : "active",
//           is_trending: editItem.is_trending || false
//         } : {
//           name: "",
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
//         title="Category Details"
//       >
//         {viewData && (
//           <div className="space-y-1">
//             <ViewRow label="Category Name" value={viewData.name} />
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
//             {viewData.description && (
//               <ViewRow label="Description" value={viewData.description} />
//             )}
//           </div>
//         )}
//       </ViewModal>

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Category"
//         message="Delete this category? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default EducationCategory;


// pages/EducationCategory.jsx
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
import { educationCategoryService } from "../../services/educationCategory.service";
import { educationSubCategoryService } from "../../services/educationSubCategory.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const EducationCategory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [subCategories, setSubCategories] = useState([]);
  const [userNameCache, setUserNameCache] = useState({});

  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  const normalizeCategory = (item) => ({
    id: item.id || item._id,
    name: item.name || "",
    status: item.status || "active",
    is_status: item.status === "active",
    is_trending: item.is_trending || false,
    createdAt: item.created_at || item.createdAt || null,
    updatedAt: item.updated_at || item.updatedAt || null,
    // description: item.description || "",
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    raw: item,
  });

  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await educationCategoryService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
      const sortedCategories = categories.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedCategories);
    } catch (error) {
      console.error('Load error:', error);
      showError(error.message || "Failed to load education categories");
    } finally {
      setLoading(false);
    }
  };

  const loadSubCategories = async () => {
    try {
      const r = await educationSubCategoryService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const subs = Array.isArray(rawData) ? rawData : [];
      setSubCategories(subs);
      return subs;
    } catch (error) {
      console.error('Load sub-categories error:', error);
      return subCategories;
    }
  };

  useEffect(() => {
    load();
    loadSubCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredData = React.useMemo(() => {
    let result = data;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((item) => {
        const itemStatus = item.is_status === true || item.status === "active";
        return itemStatus === isActive;
      });
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        String(item.name ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.is_status === true || r.status === "active").length;
  const inactiveCount = data.length - activeCount;

  const getSubCategoryCount = (categoryId) => {
    return subCategories.filter((sub) => {
      const parentId = sub.education_id || sub.EducationCategory?.id;
      return String(parentId) === String(categoryId);
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

  const handleDeleteClick = (row) => {
    const childCount = getSubCategoryCount(row.id);
    if (childCount > 0) {
      showError(
        `Cannot delete  it has sub-categor linked to it.`
      );
      return;
    }
    setDeleteId(row.id);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await educationCategoryService.delete(deleteId);
      showSuccess("Category deleted successfully");
      load();
      loadSubCategories();
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/sub[-_ ]?categor|child|foreign\s*key|constraint/i.test(message)) {
        showError("Cannot delete this category because it has sub-categories linked to it.");
      } else {
        showError(message || "Failed to delete category");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    const currentStatus = row.is_status !== undefined ? row.is_status : row.status === "active";
    const newStatus = !currentStatus;

    try {
      const updateData = {
        name: row.name,
        is_trending: row.is_trending || false,
        status: newStatus ? "active" : "inactive",
        is_status: newStatus,
      };

      await educationCategoryService.update(row.id, updateData);
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
        status: row.status || "active",
        is_status: row.is_status !== undefined ? row.is_status : true,
      };

      await educationCategoryService.update(row.id, updateData);
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
    if (row.status) {
      return row.status === "active";
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
      header: "Category Name",
      key: "name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
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
      render: (id, row) => {
        const childCount = getSubCategoryCount(row.id);
        const canDelete = childCount === 0;
        return (
          <div className="flex gap-1">
            <button
              onClick={() => navigate(`/education-categories/view/${row.id}`, { state: { item: row } })}
              className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
              title="View"
            >
              <MdVisibility size={16} />
            </button>
            <button
              onClick={() => navigate(`/education-categories/edit/${row.id}`, { state: { item: row } })}
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
              title={canDelete ? "Delete" : `Cannot delete sub-categor linked`}
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
          <h1 className="text-2xl font-bold text-gray-900">Education Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage education categories for job listings</p>
        </div>
        <Button icon={MdAdd} onClick={() => navigate('/education-categories/add')}>
          Add Category
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
              placeholder="Search categories..."
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
          emptyMessage="No categories found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} categories
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
        title="Delete Category"
        message="Delete this category? This action cannot be undone."
      />
    </div>
  );
};

export default EducationCategory;