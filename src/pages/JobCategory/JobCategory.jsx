// import React, { useState, useEffect, useCallback } from "react";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdInsertPhoto,
//   MdImage,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import FormModal from "../../components/common/FormModal";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow, ViewBadge, ViewTrendingBadge } from "../../components/common/ViewModal";
// import { jobCategoryService } from "../../services/jobCategory.service";
// import { jobSubCategoryService } from "../../services/jobSubCategory.service";
// import { showSuccess, showError, showInfo } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const JobCategory = () => {
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
//   const [checkingSubCategories, setCheckingSubCategories] = useState({});

//   const normalizeCategory = (item) => ({
//     id: item.id || item._id,
//     name: item.category_name || item.name || "",
//     category_name: item.category_name || item.name || "",
//     icon: item.icon || null,
//     image: item.image || null,
//     is_status: item.is_status !== undefined ? item.is_status : true,
//     is_trending: item.is_trending || false,
//     status: item.status !== undefined ? item.status : true,
//     createdAt: item.created_at || item.createdAt || null,
//     updatedAt: item.updated_at || item.updatedAt || null,
//     created_by: item.created_by || "",
//     raw: item,
//   });

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

//   const load = async () => {
//     setLoading(true);
//     try {
//       const r = await jobCategoryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
//       // Sort by created_at descending (newest first)
//       const sortedCategories = categories.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setData(sortedCategories);
//     } catch (error) {
//       console.error('Load error:', error);
//       showError(error.message || "Failed to load job categories");
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
//         String(item.name ?? "").toLowerCase().includes(query)
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
//   const inactiveCount = data.length - activeCount;

//   // Form fields configuration with file uploads
//   const getFormFields = (editData = null) => {
//     return [
//       {
//         name: "name",
//         label: "Category Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Web Development",
//         help: "Enter a unique name for the job category"
//       },
//       {
//         name: "icon",
//         label: "Category Icon",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload an icon for the category (PNG, JPG, SVG) - Max 5MB",
//         placeholder: "Click or drag to upload icon",
//         existingImage: editData?.icon ? getFullImageUrl(editData.icon) : null
//       },
//       {
//         name: "image",
//         label: "Category Image",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload a banner image for the category (PNG, JPG) - Max 5MB",
//         placeholder: "Click or drag to upload image",
//         existingImage: editData?.image ? getFullImageUrl(editData.image) : null
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
//           (item.name?.toLowerCase() || item.category_name?.toLowerCase()) === value.toLowerCase() &&
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
//       const submitData = {
//         category_name: formData.name,
//         is_status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//       };

//       // Handle icon file
//       if (formData.iconFile instanceof File) {
//         submitData.iconFile = formData.iconFile;
//       } else if (editItem && editItem.icon) {
//         submitData.icon = editItem.icon;
//       }

//       // Handle image file
//       if (formData.imageFile instanceof File) {
//         submitData.imageFile = formData.imageFile;
//       } else if (editItem && editItem.image) {
//         submitData.image = editItem.image;
//       }

//       if (editItem) {
//         await jobCategoryService.update(editItem.id, submitData);
//         showSuccess("Category updated successfully");
//       } else {
//         await jobCategoryService.create(submitData);
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

//   // const handleDelete = async () => {
//   //   if (!deleteId) return;

//   //   setDeleteLoading(true);
//   //   try {
//   //     await jobCategoryService.delete(deleteId);
//   //     showSuccess("Category deleted successfully");
//   //     load();
//   //   } catch (error) {
//   //     console.error('Delete error:', error);
//   //     showError(error.message || "Failed to delete");
//   //   } finally {
//   //     setDeleteId(null);
//   //     setDeleteLoading(false);
//   //   }
//   // };

//   const handleDelete = async () => {
//     showError("You cannot delete it because it have child categories");
//     return; // ❌ stop function here
//   };

//   const handleDeleteClick = async (row) => {
//     const categoryId = row.id || row._id;
//     const categoryName = row.name || row.category_name || "";

//     setCheckingSubCategories(prev => ({ ...prev, [categoryId]: true }));

//     try {
//       const response = await jobSubCategoryService.getByCategoryId(categoryId);
//       const subCategories = response.data || response.results || [];

//       if (subCategories.length > 0) {
//         showInfo(
//           `Cannot delete "${categoryName}" because it has ${subCategories.length} sub-categor${subCategories.length > 1 ? 'ies' : 'y'}. Please delete the sub-categories first.`
//         );
//         setCheckingSubCategories(prev => ({ ...prev, [categoryId]: false }));
//         return;
//       }

//       setDeleteId(categoryId);
//     } catch (error) {
//       console.error('Delete click error:', error);
//       showError("Failed to check sub-categories. Please try again.");
//       setCheckingSubCategories(prev => ({ ...prev, [categoryId]: false }));
//     }
//   };

//   // FIXED: Status toggle - preserve icon and image
//   const handleStatusToggle = async (row) => {
//     const currentStatus = getStatusValue(row);
//     const newStatus = !currentStatus;

//     try {
//       const updateData = {
//         category_name: row.name || row.category_name,
//         is_trending: row.is_trending || false,
//         is_status: newStatus,
//         status: newStatus ? "active" : "inactive",
//         // IMPORTANT: Preserve icon and image from the row
//         icon: row.icon || null,
//         image: row.image || null,
//       };

//       console.log('Toggling status from', currentStatus, 'to', newStatus);
//       console.log('Update data:', updateData);

//       const result = await jobCategoryService.update(row.id, updateData);

//       // After successful update, reload data to get fresh data
//       await load();
//       showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//     } catch (error) {
//       console.error('Status toggle error:', error);
//       showError(error.response?.data?.message || error.message || "Failed to update status");
//     }
//   };

//   // FIXED: Trending toggle - preserve icon and image
//   const handleTrendingToggle = async (row) => {
//     const newValue = !row.is_trending;

//     try {
//       const updateData = {
//         category_name: row.name || row.category_name,
//         is_trending: newValue,
//         is_status: row.is_status !== undefined ? row.is_status : row.status,
//         status: row.is_status !== undefined ? row.is_status : row.status,
//         // IMPORTANT: Preserve icon and image from the row
//         icon: row.icon || null,
//         image: row.image || null,
//       };

//       const result = await jobCategoryService.update(row.id, updateData);

//       // After successful update, reload data to get fresh data
//       await load();
//       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
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

//   const handleImageError = (id, type) => {
//     setImageErrors((prev) => ({ ...prev, [`${id}-${type}`]: true }));
//   };

//   const renderMediaPreview = (value, type, rowId) => {
//     if (!value) return <span className="text-gray-400 text-xs">-</span>;

//     const errorKey = `${rowId}-${type}`;
//     const hasError = imageErrors[errorKey];
//     const fullUrl = getFullImageUrl(value);

//     if (!hasError && fullUrl) {
//       return (
//         <div className="flex items-center gap-2">
//           <div className="relative group cursor-pointer">
//             <img
//               src={fullUrl}
//               alt={type}
//               className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
//               onError={() => handleImageError(rowId, type)}
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
//           {type === "icon" ? <MdInsertPhoto size={20} /> : <MdImage size={20} />}
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
//       header: "Category Name",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-gray-800">{v}</span>
//       ),
//     },
//     {
//       header: "Icon",
//       key: "icon",
//       render: (value, row) => renderMediaPreview(value, "icon", row.id),
//     },
//     {
//       header: "Image",
//       key: "image",
//       render: (value, row) => renderMediaPreview(value, "image", row.id),
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
//       key: "createdAt",
//       render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => {
//         const isChecking = checkingSubCategories[id];
//         return (
//           <div className="flex gap-1">
//             <button
//               onClick={() => openView(row)}
//               className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
//               title="View"
//               disabled={isChecking}
//             >
//               <MdVisibility size={16} />
//             </button>
//             <button
//               onClick={() => openEdit(row)}
//               className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
//               title="Edit"
//               disabled={isChecking}
//             >
//               <MdEdit size={16} />
//             </button>
//             <button
//               onClick={() => handleDeleteClick(row)}
//               className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
//               title="Delete"
//               disabled={isChecking}
//             >
//               {isChecking ? (
//                 <span className="inline-block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
//               ) : (
//                 <MdDelete size={16} />
//               )}
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
//           <h1 className="text-2xl font-bold text-gray-900">Job Categories</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage job categories for job listings</p>
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

//       {/* Form Modal with File Uploads - Passing editItem for preview */}
//       <FormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         title={editItem ? "Edit Category" : "Add Category"}
//         fields={getFormFields(editItem)}
//         initialData={editItem ? {
//           name: editItem.name || editItem.category_name || "",
//           icon: editItem.icon || null,
//           image: editItem.image || null,
//           status: editItem.is_status !== undefined ? (editItem.is_status ? "active" : "inactive") : "active",
//           is_trending: editItem.is_trending || false
//         } : {
//           name: "",
//           icon: null,
//           image: null,
//           status: "active",
//           is_trending: false
//         }}
//         validationRules={validationRules}
//         loading={formLoading}
//         submitLabel={editItem ? "Update" : "Create"}
//         size="lg"
//         existingImage={editItem?.icon ? getFullImageUrl(editItem.icon) : null}
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
//             <ViewRow label="Category Name" value={viewData.name || viewData.category_name} />
//             {viewData.icon && (
//               <ViewRow
//                 label="Icon"
//                 value={
//                   <img
//                     src={getFullImageUrl(viewData.icon)}
//                     alt="Category icon"
//                     className="w-16 h-16 rounded-lg object-cover border border-gray-200"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 }
//               />
//             )}
//             {viewData.image && (
//               <ViewRow
//                 label="Image"
//                 value={
//                   <img
//                     src={getFullImageUrl(viewData.image)}
//                     alt="Category image"
//                     className="w-32 h-32 rounded-lg object-cover border border-gray-200"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 }
//               />
//             )}
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
//         title="Delete Category"
//         message="Delete this category? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default JobCategory;



// import React, { useState, useEffect, useCallback } from "react";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdInsertPhoto,
//   MdImage,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import FormModal from "../../components/common/FormModal";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow, ViewBadge, ViewTrendingBadge } from "../../components/common/ViewModal";
// import { jobCategoryService } from "../../services/jobCategory.service";
// import { jobSubCategoryService } from "../../services/jobSubCategory.service";
// import { showSuccess, showError, showInfo } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const JobCategory = () => {
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
//   const [subCategories, setSubCategories] = useState([]);
//   const [userNameCache, setUserNameCache] = useState({});

//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   const normalizeCategory = (item) => ({
//     id: item.id || item._id,
//     name: item.category_name || item.name || "",
//     category_name: item.category_name || item.name || "",
//     icon: item.icon || null,
//     image: item.image || null,
//     is_status: item.is_status !== undefined ? item.is_status : true,
//     is_trending: item.is_trending || false,
//     status: item.status !== undefined ? item.status : true,
//     createdAt: item.created_at || item.createdAt || null,
//     updatedAt: item.updated_at || item.updatedAt || null,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     raw: item,
//   });

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

//   const load = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach(id => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);
//       const r = await jobCategoryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
//       // Sort by created_at descending (newest first)
//       const sortedCategories = categories.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setData(sortedCategories);
//     } catch (error) {
//       console.error('Load error:', error);
//       showError(error.message || "Failed to load job categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch every sub-category so we know which categories have children.
//   const loadSubCategories = async () => {
//     try {
//       const r = await jobSubCategoryService.getAll({ limit: 1000 });
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
//         const itemStatus = item.is_status === true || item.status === true || item.status === "active";
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

//   const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
//   const inactiveCount = data.length - activeCount;

//   // How many sub-categories point back to this category?
//   const getSubCategoryCount = (categoryId) => {
//     return subCategories.filter((sub) => {
//       const parentId = sub.JobCategory?.id ?? sub.category_id;
//       return String(parentId) === String(categoryId);
//     }).length;
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

//   // Form fields configuration with file uploads
//   const getFormFields = (editData = null) => {
//     return [
//       {
//         name: "name",
//         label: "Category Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Web Development",
//         help: "Enter a unique name for the job category"
//       },
//       {
//         name: "icon",
//         label: "Category Icon",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload an icon for the category (PNG, JPG, SVG) - Max 5MB",
//         placeholder: "Click or drag to upload icon",
//         existingImage: editData?.icon ? getFullImageUrl(editData.icon) : null
//       },
//       {
//         name: "image",
//         label: "Category Image",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload a banner image for the category (PNG, JPG) - Max 5MB",
//         placeholder: "Click or drag to upload image",
//         existingImage: editData?.image ? getFullImageUrl(editData.image) : null
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
//           (item.name?.toLowerCase() || item.category_name?.toLowerCase()) === value.toLowerCase() &&
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
//       const submitData = {
//         category_name: formData.name,
//         is_status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//       };

//       // Handle icon file
//       if (formData.iconFile instanceof File) {
//         submitData.iconFile = formData.iconFile;
//       } else if (editItem && editItem.icon) {
//         submitData.icon = editItem.icon;
//       }

//       // Handle image file
//       if (formData.imageFile instanceof File) {
//         submitData.imageFile = formData.imageFile;
//       } else if (editItem && editItem.image) {
//         submitData.image = editItem.image;
//       }

//       if (editItem) {
//         await jobCategoryService.update(editItem.id, submitData);
//         showSuccess("Category updated successfully");
//       } else {
//         await jobCategoryService.create(submitData);
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
//       await jobCategoryService.delete(deleteId);
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

//   // FIXED: Status toggle - preserve icon and image
//   const handleStatusToggle = async (row) => {
//     const currentStatus = getStatusValue(row);
//     const newStatus = !currentStatus;

//     try {
//       const updateData = {
//         category_name: row.name || row.category_name,
//         is_trending: row.is_trending || false,
//         is_status: newStatus,
//         status: newStatus ? "active" : "inactive",
//         // IMPORTANT: Preserve icon and image from the row
//         icon: row.icon || null,
//         image: row.image || null,
//       };

//       console.log('Toggling status from', currentStatus, 'to', newStatus);
//       console.log('Update data:', updateData);

//       const result = await jobCategoryService.update(row.id, updateData);

//       // After successful update, reload data to get fresh data
//       await load();
//       showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//     } catch (error) {
//       console.error('Status toggle error:', error);
//       showError(error.response?.data?.message || error.message || "Failed to update status");
//     }
//   };

//   // FIXED: Trending toggle - preserve icon and image
//   const handleTrendingToggle = async (row) => {
//     const newValue = !row.is_trending;

//     try {
//       const updateData = {
//         category_name: row.name || row.category_name,
//         is_trending: newValue,
//         is_status: row.is_status !== undefined ? row.is_status : row.status,
//         status: row.is_status !== undefined ? row.is_status : row.status,
//         // IMPORTANT: Preserve icon and image from the row
//         icon: row.icon || null,
//         image: row.image || null,
//       };

//       const result = await jobCategoryService.update(row.id, updateData);

//       // After successful update, reload data to get fresh data
//       await load();
//       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
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

//   const handleImageError = (id, type) => {
//     setImageErrors((prev) => ({ ...prev, [`${id}-${type}`]: true }));
//   };

//   const renderMediaPreview = (value, type, rowId) => {
//     if (!value) return <span className="text-gray-400 text-xs">-</span>;

//     const errorKey = `${rowId}-${type}`;
//     const hasError = imageErrors[errorKey];
//     const fullUrl = getFullImageUrl(value);

//     if (!hasError && fullUrl) {
//       return (
//         <div className="flex items-center gap-2">
//           <div className="relative group cursor-pointer">
//             <img
//               src={fullUrl}
//               alt={type}
//               className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
//               onError={() => handleImageError(rowId, type)}
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
//           {type === "icon" ? <MdInsertPhoto size={20} /> : <MdImage size={20} />}
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
//       header: "Category Name",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-gray-800">{v}</span>
//       ),
//     },
//     {
//       header: "Icon",
//       key: "icon",
//       render: (value, row) => renderMediaPreview(value, "icon", row.id),
//     },
//     {
//       header: "Image",
//       key: "image",
//       render: (value, row) => renderMediaPreview(value, "image", row.id),
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
//               onClick={() => navigate(`/job-categories/view/${row.id}`, { state: { item: row } })}
//               className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
//               title="View"
//             >
//               <MdVisibility size={16} />
//             </button>
//             <button
//               onClick={() => navigate(`/job-categories/edit/${row.id}`, { state: { item: row } })}
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
//           <h1 className="text-2xl font-bold text-gray-900">Job Categories</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage job categories for job listings</p>
//         </div>
//         <Button icon={MdAdd} onClick={() => navigate('/job-categories/add')}>
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

//       {/* Form Modal with File Uploads - Passing editItem for preview */}
//       <FormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         title={editItem ? "Edit Category" : "Add Category"}
//         fields={getFormFields(editItem)}
//         initialData={editItem ? {
//           name: editItem.name || editItem.category_name || "",
//           icon: editItem.icon || null,
//           image: editItem.image || null,
//           status: editItem.is_status !== undefined ? (editItem.is_status ? "active" : "inactive") : "active",
//           is_trending: editItem.is_trending || false
//         } : {
//           name: "",
//           icon: null,
//           image: null,
//           status: "active",
//           is_trending: false
//         }}
//         validationRules={validationRules}
//         loading={formLoading}
//         submitLabel={editItem ? "Update" : "Create"}
//         size="lg"
//         existingImage={editItem?.icon ? getFullImageUrl(editItem.icon) : null}
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
//             <ViewRow label="Category Name" value={viewData.name || viewData.category_name} />
//             {viewData.icon && (
//               <ViewRow
//                 label="Icon"
//                 value={
//                   <img
//                     src={getFullImageUrl(viewData.icon)}
//                     alt="Category icon"
//                     className="w-16 h-16 rounded-lg object-cover border border-gray-200"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 }
//               />
//             )}
//             {viewData.image && (
//               <ViewRow
//                 label="Image"
//                 value={
//                   <img
//                     src={getFullImageUrl(viewData.image)}
//                     alt="Category image"
//                     className="w-32 h-32 rounded-lg object-cover border border-gray-200"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 }
//               />
//             )}
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
//         title="Delete Category"
//         message="Delete this category? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default JobCategory;


// // pages/JobCategory.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdInsertPhoto,
//   MdImage,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import { jobCategoryService } from "../../services/jobCategory.service";
// import { jobSubCategoryService } from "../../services/jobSubCategory.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const JobCategory = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [imageErrors, setImageErrors] = useState({});
//   const [subCategories, setSubCategories] = useState([]);
//   const [userNameCache, setUserNameCache] = useState({});

//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   const normalizeCategory = (item) => ({
//     id: item.id || item._id,
//     name: item.category_name || item.name || "",
//     category_name: item.category_name || item.name || "",
//     icon: item.icon || null,
//     image: item.image || null,
//     is_status: item.is_status !== undefined ? item.is_status : true,
//     is_trending: item.is_trending || false,
//     status: item.status !== undefined ? item.status : true,
//     createdAt: item.created_at || item.createdAt || null,
//     updatedAt: item.updated_at || item.updatedAt || null,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     raw: item,
//   });

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

//   const load = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach(id => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);
//       const r = await jobCategoryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
//       const sortedCategories = categories.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setData(sortedCategories);
//     } catch (error) {
//       console.error('Load error:', error);
//       showError(error.message || "Failed to load job categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch every sub-category so we know which categories have children.
//   const loadSubCategories = async () => {
//     try {
//       const r = await jobSubCategoryService.getAll({ limit: 1000 });
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
//         const itemStatus = item.is_status === true || item.status === true || item.status === "active";
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

//   const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
//   const inactiveCount = data.length - activeCount;

//   const getSubCategoryCount = (categoryId) => {
//     return subCategories.filter((sub) => {
//       const parentId = sub.JobCategory?.id ?? sub.category_id;
//       return String(parentId) === String(categoryId);
//     }).length;
//   };

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
//       await jobCategoryService.delete(deleteId);
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

//   const handleDeleteClick = (row) => {
//     const childCount = getSubCategoryCount(row.id);
//     if (childCount > 0) {
//       showError(
//         `Cannot delete it has sub-categor linked to it.`
//       );
//       return;
//     }
//     setDeleteId(row.id);
//   };

//   const handleStatusToggle = async (row) => {
//     const currentStatus = getStatusValue(row);
//     const newStatus = !currentStatus;

//     try {
//       const updateData = {
//         category_name: row.name || row.category_name,
//         is_trending: row.is_trending || false,
//         is_status: newStatus,
//         status: newStatus ? "active" : "inactive",
//         icon: row.icon || null,
//         image: row.image || null,
//       };

//       await jobCategoryService.update(row.id, updateData);
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
//         category_name: row.name || row.category_name,
//         is_trending: newValue,
//         is_status: row.is_status !== undefined ? row.is_status : row.status,
//         status: row.is_status !== undefined ? row.is_status : row.status,
//         icon: row.icon || null,
//         image: row.image || null,
//       };

//       await jobCategoryService.update(row.id, updateData);
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

//   const handleImageError = (id, type) => {
//     setImageErrors((prev) => ({ ...prev, [`${id}-${type}`]: true }));
//   };

//   const renderMediaPreview = (value, type, rowId) => {
//     if (!value) return <span className="text-gray-400 text-xs">-</span>;

//     const errorKey = `${rowId}-${type}`;
//     const hasError = imageErrors[errorKey];
//     const fullUrl = getFullImageUrl(value);

//     if (!hasError && fullUrl) {
//       return (
//         <div className="flex items-center gap-2">
//           <div className="relative group cursor-pointer">
//             <img
//               src={fullUrl}
//               alt={type}
//               className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
//               onError={() => handleImageError(rowId, type)}
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
//           {type === "icon" ? <MdInsertPhoto size={20} /> : <MdImage size={20} />}
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
//       header: "Category Name",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-gray-800">{v}</span>
//       ),
//     },
//     {
//       header: "Icon",
//       key: "icon",
//       render: (value, row) => renderMediaPreview(value, "icon", row.id),
//     },
//     {
//       header: "Image",
//       key: "image",
//       render: (value, row) => renderMediaPreview(value, "image", row.id),
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
//               onClick={() => navigate(`/job-categories/view/${row.id}`, { state: { item: row } })}
//               className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
//               title="View"
//             >
//               <MdVisibility size={16} />
//             </button>
//             <button
//               onClick={() => navigate(`/job-categories/edit/${row.id}`, { state: { item: row } })}
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
//               title={canDelete ? "Delete" : `Cannot delete sub-categor linked`}
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
//           <h1 className="text-2xl font-bold text-gray-900">Job Categories</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage job categories for job listings</p>
//         </div>
//         <Button icon={MdAdd} onClick={() => navigate('/job-categories/add')}>
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

//       {/* Confirm Dialog */}
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

// export default JobCategory;


// pages/JobCategory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdInsertPhoto,
  MdImage,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { jobCategoryService } from "../../services/jobCategory.service";
import { jobSubCategoryService } from "../../services/jobSubCategory.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const JobCategory = () => {
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
  const [subCategories, setSubCategories] = useState([]);
  const [userNameCache, setUserNameCache] = useState({});

  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  const normalizeCategory = (item) => ({
    id: item.id || item._id,
    name: item.category_name || item.name || "",
    category_name: item.category_name || item.name || "",
    icon: item.icon || null,
    image: item.image || null,
    is_status: item.is_status !== undefined ? item.is_status : true,
    is_trending: item.is_trending || false,
    status: item.status !== undefined ? item.status : true,
    createdAt: item.created_at || item.createdAt || null,
    updatedAt: item.updated_at || item.updatedAt || null,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    raw: item,
  });

  // Get full image URL helper
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

  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);
      const r = await jobCategoryService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
      const sortedCategories = categories.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedCategories);
    } catch (error) {
      console.error('Load error:', error);
      showError(error.message || "Failed to load job categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch every sub-category so we know which categories have children.
  const loadSubCategories = async () => {
    try {
      const r = await jobSubCategoryService.getAll({ limit: 1000 });
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
        const itemStatus = item.is_status === true || item.status === true || item.status === "active";
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

  const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
  const inactiveCount = data.length - activeCount;

  const getSubCategoryCount = (categoryId) => {
    return subCategories.filter((sub) => {
      const parentId = sub.JobCategory?.id ?? sub.category_id;
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

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await jobCategoryService.delete(deleteId);
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

  const handleDeleteClick = (row) => {
    const childCount = getSubCategoryCount(row.id);
    if (childCount > 0) {
      showError(
        `Cannot delete it has sub-categor linked to it.`
      );
      return;
    }
    setDeleteId(row.id);
  };

  const handleStatusToggle = async (row) => {
    const currentStatus = getStatusValue(row);
    const newStatus = !currentStatus;

    try {
      const updateData = {
        category_name: row.name || row.category_name,
        is_trending: row.is_trending || false,
        is_status: newStatus,
        status: newStatus ? "active" : "inactive",
        icon: row.icon || null,
        image: row.image || null,
      };

      await jobCategoryService.update(row.id, updateData);
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
        category_name: row.name || row.category_name,
        is_trending: newValue,
        is_status: row.is_status !== undefined ? row.is_status : row.status,
        status: row.is_status !== undefined ? row.is_status : row.status,
        icon: row.icon || null,
        image: row.image || null,
      };

      await jobCategoryService.update(row.id, updateData);
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

  const handleImageError = (id, type) => {
    setImageErrors((prev) => ({ ...prev, [`${id}-${type}`]: true }));
  };

  const renderMediaPreview = (value, type, rowId) => {
    if (!value) return <span className="text-gray-400 text-xs">-</span>;

    const errorKey = `${rowId}-${type}`;
    const hasError = imageErrors[errorKey];
    const fullUrl = getFullImageUrl(value);

    if (!hasError && fullUrl) {
      return (
        <div className="flex items-center gap-2">
          <div className="relative group cursor-pointer">
            <img
              src={fullUrl}
              alt={type}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
              onError={() => handleImageError(rowId, type)}
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
          {type === "icon" ? <MdInsertPhoto size={20} /> : <MdImage size={20} />}
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
      header: "Category Name",
      key: "name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    {
      header: "Icon",
      key: "icon",
      render: (value, row) => renderMediaPreview(value, "icon", row.id),
    },
    {
      header: "Image",
      key: "image",
      render: (value, row) => renderMediaPreview(value, "image", row.id),
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

    // ONLY UPDATED AT
    {
      header: "Updated At",
      key: "updatedAt",
      render: (value, row) => (
        <span className="text-gray-500 text-sm">
          {row.updatedAt ? formatDate(row.updatedAt) : "-"}
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
              onClick={() => navigate(`/job-categories/view/${row.id}`, { state: { item: row } })}
              className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
              title="View"
            >
              <MdVisibility size={16} />
            </button>
            <button
              onClick={() => navigate(`/job-categories/edit/${row.id}`, { state: { item: row } })}
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
          <h1 className="text-2xl font-bold text-gray-900">Job Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job categories for job listings</p>
        </div>
        <Button icon={MdAdd} onClick={() => navigate('/job-categories/add')}>
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

export default JobCategory;