// // import React, { useState, useEffect, useCallback } from "react";
// // import {
// //     MdAdd,
// //     MdEdit,
// //     MdDelete,
// //     MdSearch,
// //     MdVisibility,
// //     MdInsertPhoto,
// // } from "react-icons/md";
// // import Table from "../../components/common/Table";
// // import Button from "../../components/common/Button";
// // import Pagination from "../../components/common/Pagination";
// // import FormModal from "../../components/common/FormModal";
// // import ConfirmDialog from "../../components/common/ConfirmDialog";
// // import ViewModal, { ViewRow, ViewBadge, ViewTrendingBadge } from "../../components/common/ViewModal";
// // import { subscriptionFeatureCategoryService } from "../../services/subscriptionFeatureCategory.service";
// // import { showSuccess, showError } from "../../utils/toast";
// // import { formatDate } from "../../utils/helpers";

// // const API_BASE_URL = "https://apidata.hiremejobs.in";

// // const SubscriptionFeatureCategories = () => {
// //     const [data, setData] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [modalOpen, setModalOpen] = useState(false);
// //     const [viewModalOpen, setViewModalOpen] = useState(false);
// //     const [viewData, setViewData] = useState(null);
// //     const [editItem, setEditItem] = useState(null);
// //     const [deleteId, setDeleteId] = useState(null);
// //     const [formLoading, setFormLoading] = useState(false);
// //     const [deleteLoading, setDeleteLoading] = useState(false);
// //     const [search, setSearch] = useState("");
// //     const [page, setPage] = useState(1);
// //     const [limit, setLimit] = useState(10);
// //     const [statusFilter, setStatusFilter] = useState("all");
// //     const [imageErrors, setImageErrors] = useState({});

// //     const normalizeCategory = (item) => ({
// //         id: item.id || item._id,
// //         category_name: item.category_name || "",
// //         category_code: item.category_code || "",
// //         description: item.description || "",
// //         icon: item.icon || null,
// //         display_order: item.display_order || 0,
// //         is_status: item.status === 1 || item.status === true,
// //         is_trending: item.is_trending === 1 || item.is_trending === true,
// //         status: item.status !== undefined ? item.status : 1,
// //         createdAt: item.created_at || item.createdAt || null,
// //         updatedAt: item.updated_at || item.updatedAt || null,
// //         created_by: item.created_by || "",
// //         raw: item,
// //     });

// //     const getStatusValue = (row) => {
// //         if (row.is_status !== undefined) {
// //             return row.is_status;
// //         }
// //         if (row.status !== undefined) {
// //             return row.status === 1 || row.status === true;
// //         }
// //         return true;
// //     };

// //     const load = async () => {
// //         setLoading(true);
// //         try {
// //             const r = await subscriptionFeatureCategoryService.getAll({ limit: 1000 });
// //             const rawData = r.data?.data || r.data?.results || r.data || [];
// //             const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
// //             const sortedCategories = categories.sort((a, b) => {
// //                 return new Date(b.createdAt) - new Date(a.createdAt);
// //             });
// //             setData(sortedCategories);
// //         } catch (error) {
// //             console.error('Load error:', error);
// //             showError(error.message || "Failed to load subscription feature categories");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         load();
// //     }, []);

// //     useEffect(() => {
// //         setPage(1);
// //     }, [search, statusFilter]);

// //     const filteredData = React.useMemo(() => {
// //         let result = data;
// //         if (statusFilter !== "all") {
// //             const isActive = statusFilter === "active";
// //             result = result.filter((item) => {
// //                 const itemStatus = item.is_status === true || item.status === 1 || item.status === true;
// //                 return itemStatus === isActive;
// //             });
// //         }
// //         const query = search.toLowerCase().trim();
// //         if (query) {
// //             result = result.filter((item) =>
// //                 String(item.category_name ?? "").toLowerCase().includes(query) ||
// //                 String(item.category_code ?? "").toLowerCase().includes(query) ||
// //                 String(item.description ?? "").toLowerCase().includes(query)
// //             );
// //         }
// //         return result;
// //     }, [data, search, statusFilter]);

// //     const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

// //     const activeCount = data.filter((r) => r.is_status === true || r.status === 1 || r.status === true).length;
// //     const inactiveCount = data.length - activeCount;

// //     const getFullImageUrl = (value) => {
// //         if (!value) return null;
// //         if (value.startsWith("http") || value.startsWith("data:image")) {
// //             return value;
// //         }
// //         if (value.startsWith("/uploads/")) {
// //             return `${API_BASE_URL}${value}`;
// //         }
// //         return value;
// //     };

// //     const getFormFields = (editData = null) => {
// //         return [
// //             {
// //                 name: "category_name",
// //                 label: "Category Name",
// //                 type: "text",
// //                 required: true,
// //                 placeholder: "e.g. Jobs",
// //                 help: "Enter a unique name for the category"
// //             },
// //             {
// //                 name: "category_code",
// //                 label: "Category Code",
// //                 type: "text",
// //                 required: true,
// //                 placeholder: "e.g. jobs",
// //                 help: "Unique identifier for the category"
// //             },
// //             {
// //                 name: "description",
// //                 label: "Description",
// //                 type: "textarea",
// //                 required: false,
// //                 placeholder: "Enter category description...",
// //                 rows: 3,
// //                 help: "Optional description for the category"
// //             },
// //             {
// //                 name: "icon",
// //                 label: "Category Icon",
// //                 type: "file",
// //                 required: false,
// //                 accept: "image/*",
// //                 maxSize: 5,
// //                 help: "Upload an icon for the category (PNG, JPG, SVG) - Max 5MB",
// //                 placeholder: "Click or drag to upload icon",
// //                 existingImage: editData?.icon ? getFullImageUrl(editData.icon) : null
// //             },
// //             {
// //                 name: "display_order",
// //                 label: "Display Order",
// //                 type: "number",
// //                 required: false,
// //                 min: 0,
// //                 help: "Order in which the category should be displayed"
// //             },
// //             {
// //                 name: "status",
// //                 label: "Status",
// //                 type: "radio",
// //                 options: [
// //                     { value: "active", label: "Active" },
// //                     { value: "inactive", label: "Inactive" },
// //                 ],
// //                 color: "text-[#2c0eee] focus:ring-[#4529f7]",
// //             },
// //             {
// //                 name: "is_trending",
// //                 label: "Mark as Trending",
// //                 type: "checkbox",
// //                 color: "text-yellow-500 focus:ring-yellow-500",
// //                 help: "Trending categories will be highlighted in the listing",
// //             },
// //         ];
// //     };

// //     const validationRules = {
// //         category_name: {
// //             required: true,
// //             requiredMessage: 'Category name is required',
// //             minLength: 2,
// //             minLengthMessage: 'Category name must be at least 2 characters',
// //             maxLength: 100,
// //             maxLengthMessage: 'Category name must be at most 100 characters',
// //             custom: (value) => {
// //                 const exists = data.some(item =>
// //                     item.category_name?.toLowerCase() === value.toLowerCase() &&
// //                     (!editItem || item.id !== editItem.id)
// //                 );
// //                 if (exists) {
// //                     return 'This category name already exists';
// //                 }
// //                 return null;
// //             }
// //         },
// //         category_code: {
// //             required: true,
// //             requiredMessage: 'Category code is required',
// //             minLength: 2,
// //             minLengthMessage: 'Category code must be at least 2 characters',
// //             maxLength: 50,
// //             maxLengthMessage: 'Category code must be at most 50 characters',
// //             pattern: /^[a-z0-9_-]+$/,
// //             patternMessage: 'Category code must contain only lowercase letters, numbers, underscores and hyphens',
// //             custom: (value) => {
// //                 const exists = data.some(item =>
// //                     item.category_code?.toLowerCase() === value.toLowerCase() &&
// //                     (!editItem || item.id !== editItem.id)
// //                 );
// //                 if (exists) {
// //                     return 'This category code already exists';
// //                 }
// //                 return null;
// //             }
// //         }
// //     };

// //     const openAdd = () => {
// //         setEditItem(null);
// //         setModalOpen(true);
// //     };

// //     const openEdit = (item) => {
// //         setEditItem(item);
// //         setModalOpen(true);
// //     };

// //     const openView = (item) => {
// //         setViewData(item);
// //         setViewModalOpen(true);
// //     };

// //     // FIXED: handleSubmit - proper status and file handling
// //     const handleSubmit = async (formData) => {
// //         setFormLoading(true);
// //         try {
// //             const submitData = {
// //                 category_name: formData.category_name,
// //                 category_code: formData.category_code || formData.category_name.toLowerCase().replace(/\s+/g, '-'),
// //                 description: formData.description || "",
// //                 display_order: formData.display_order || 0,
// //                 // FIX: Send status as integer (1 for active, 0 for inactive)
// //                 status: formData.status === "active" ? 1 : 0,
// //                 is_trending: formData.is_trending || false,
// //             };

// //             // Handle icon file upload
// //             if (formData.iconFile instanceof File) {
// //                 submitData.iconFile = formData.iconFile;
// //             } else if (editItem && editItem.icon) {
// //                 // Keep existing icon if no new file uploaded
// //                 submitData.icon = editItem.icon;
// //             }

// //             if (editItem) {
// //                 await subscriptionFeatureCategoryService.update(editItem.id, submitData);
// //                 showSuccess("Category updated successfully");
// //             } else {
// //                 await subscriptionFeatureCategoryService.create(submitData);
// //                 showSuccess("Category created successfully");
// //             }
// //             setModalOpen(false);
// //             load();
// //         } catch (error) {
// //             console.error('Submit error:', error);
// //             showError(error.message || error?.response?.data?.message || "Failed to save");
// //         } finally {
// //             setFormLoading(false);
// //         }
// //     };

// //     const handleDelete = async () => {
// //         setDeleteLoading(true);
// //         try {
// //             await subscriptionFeatureCategoryService.delete(deleteId);
// //             showSuccess("Category deleted successfully");
// //             load();
// //         } catch (error) {
// //             console.error('Delete error:', error);
// //             const message = error?.response?.data?.message || error?.message || "";
// //             if (/foreign\s*key|constraint|used|referenced|subscription[-_ ]?feature/i.test(message)) {
// //                 showError("Cannot delete this category because it has subscription features linked to it.");
// //             } else {
// //                 showError(message || "Failed to delete category");
// //             }
// //         } finally {
// //             setDeleteId(null);
// //             setDeleteLoading(false);
// //         }
// //     };

// //     const handleStatusToggle = async (row) => {
// //         const currentStatus = getStatusValue(row);
// //         const newStatus = !currentStatus;

// //         try {
// //             const updateData = {
// //                 category_name: row.category_name,
// //                 category_code: row.category_code,
// //                 description: row.description || "",
// //                 display_order: row.display_order || 0,
// //                 is_trending: row.is_trending ? 1 : 0,
// //                 status: newStatus ? 1 : 0,
// //                 icon: row.icon || null,
// //             };

// //             console.log('Toggling status from', currentStatus, 'to', newStatus);
// //             console.log('Update data:', updateData);

// //             await subscriptionFeatureCategoryService.update(row.id, updateData);
// //             showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
// //             load();
// //         } catch (error) {
// //             console.error('Status toggle error:', error);
// //             showError(error.response?.data?.message || error.message || "Failed to update status");
// //         }
// //     };

// //     const handleTrendingToggle = async (row) => {
// //         const newValue = !row.is_trending;

// //         try {
// //             const updateData = {
// //                 category_name: row.category_name,
// //                 category_code: row.category_code,
// //                 description: row.description || "",
// //                 display_order: row.display_order || 0,
// //                 is_trending: newValue ? 1 : 0,
// //                 status: row.status !== undefined ? row.status : 1,
// //                 icon: row.icon || null,
// //             };

// //             await subscriptionFeatureCategoryService.update(row.id, updateData);
// //             showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
// //             load();
// //         } catch (error) {
// //             console.error('Trending toggle error:', error);
// //             showError(error.response?.data?.message || error.message || "Failed to update trending");
// //         }
// //     };

// //     const handleImageError = (id) => {
// //         setImageErrors((prev) => ({ ...prev, [id]: true }));
// //     };

// //     const renderIconPreview = (value, rowId) => {
// //         if (!value) return <span className="text-gray-400 text-xs">-</span>;

// //         const hasError = imageErrors[rowId];
// //         const fullUrl = getFullImageUrl(value);

// //         if (!hasError && fullUrl) {
// //             return (
// //                 <div className="flex items-center gap-2">
// //                     <div className="relative group cursor-pointer">
// //                         <img
// //                             src={fullUrl}
// //                             alt="Category icon"
// //                             className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
// //                             onError={() => handleImageError(rowId)}
// //                         />
// //                         <button
// //                             onClick={() => window.open(fullUrl, '_blank')}
// //                             className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
// //                             title="Click to view image"
// //                         >
// //                             <MdVisibility size={16} />
// //                         </button>
// //                     </div>
// //                 </div>
// //             );
// //         } else {
// //             return (
// //                 <div className="w-12 h-12 rounded-lg bg-blue-50 border border-[#4529f7] flex items-center justify-center text-[#2c0eee]">
// //                     <MdInsertPhoto size={20} />
// //                 </div>
// //             );
// //         }
// //     };

// //     const columns = [
// //         {
// //             header: "#",
// //             key: "id",
// //             render: (_, __, i) => (page - 1) * limit + i + 1
// //         },
// //         {
// //             header: "Icon",
// //             key: "icon",
// //             render: (value, row) => renderIconPreview(value, row.id),
// //         },
// //         {
// //             header: "Category Name",
// //             key: "category_name",
// //             render: (v) => (
// //                 <span className="font-medium capitalize text-gray-800">{v}</span>
// //             ),
// //         },
// //         {
// //             header: "Category Code",
// //             key: "category_code",
// //             render: (v) => (
// //                 <span className="text-gray-500 text-sm font-mono">{v}</span>
// //             ),
// //         },
// //         {
// //             header: "Description",
// //             key: "description",
// //             render: (v) => (
// //                 <span className="text-gray-500 text-sm truncate max-w-[150px] inline-block">{v || "-"}</span>
// //             ),
// //         },
// //         {
// //             header: "Display Order",
// //             key: "display_order",
// //             render: (v) => (
// //                 <span className="text-gray-500 text-sm">{v || 0}</span>
// //             ),
// //         },
// //         {
// //             header: "Trending",
// //             key: "is_trending",
// //             render: (value, row) => (
// //                 <button
// //                     onClick={() => handleTrendingToggle(row)}
// //                     className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"
// //                         }`}
// //                 >
// //                     <span
// //                         className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"
// //                             }`}
// //                     />
// //                 </button>
// //             ),
// //         },
// //         {
// //             header: "Status",
// //             key: "status",
// //             render: (status, row) => {
// //                 const isActive = getStatusValue(row);
// //                 return (
// //                     <button
// //                         onClick={() => handleStatusToggle(row)}
// //                         className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"
// //                             }`}
// //                     >
// //                         <span
// //                             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"
// //                                 }`}
// //                         />
// //                     </button>
// //                 );
// //             },
// //         },
// //         {
// //             header: "Created At",
// //             key: "createdAt",
// //             render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
// //         },
// //         {
// //             header: "Actions",
// //             key: "id",
// //             render: (id, row) => (
// //                 <div className="flex gap-1">
// //                     <button
// //                         onClick={() => openView(row)}
// //                         className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
// //                         title="View"
// //                     >
// //                         <MdVisibility size={16} />
// //                     </button>
// //                     <button
// //                         onClick={() => openEdit(row)}
// //                         className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
// //                         title="Edit"
// //                     >
// //                         <MdEdit size={16} />
// //                     </button>
// //                     <button
// //                         onClick={() => setDeleteId(id)}
// //                         className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
// //                         title="Delete"
// //                     >
// //                         <MdDelete size={16} />
// //                     </button>
// //                 </div>
// //             ),
// //         },
// //     ];

// //     const tabs = [
// //         { key: "all", label: "All", count: data.length },
// //         { key: "active", label: "Active", count: activeCount },
// //         { key: "inactive", label: "Inactive", count: inactiveCount },
// //     ];

// //     return (
// //         <div className="space-y-4">
// //             {/* Header */}
// //             <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
// //                 <div>
// //                     <h1 className="text-2xl font-bold text-gray-900">Subscription Feature Categories</h1>
// //                     <p className="text-sm text-gray-500 mt-1">Manage subscription feature categories</p>
// //                 </div>
// //                 <Button icon={MdAdd} onClick={openAdd}>
// //                     Add Category
// //                 </Button>
// //             </div>

// //             {/* Table Card */}
// //             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
// //                 {/* Top bar: search + tabs */}
// //                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
// //                     <div className="relative w-full sm:w-72">
// //                         <MdSearch
// //                             size={18}
// //                             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
// //                         />
// //                         <input
// //                             type="text"
// //                             value={search}
// //                             onChange={(e) => setSearch(e.target.value)}
// //                             placeholder="Search categories..."
// //                             className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
// //                         />
// //                     </div>

// //                     <div className="flex items-center gap-5 text-sm">
// //                         {tabs.map((tab) => (
// //                             <button
// //                                 key={tab.key}
// //                                 onClick={() => setStatusFilter(tab.key)}
// //                                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
// //                                     }`}
// //                             >
// //                                 {tab.label}
// //                                 <span
// //                                     className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
// //                                         ? "bg-blue-50 text-[#2c0eee]"
// //                                         : "bg-gray-100 text-gray-500"
// //                                         }`}
// //                                 >
// //                                     {tab.count}
// //                                 </span>
// //                             </button>
// //                         ))}
// //                     </div>
// //                 </div>

// //                 <Table
// //                     columns={columns}
// //                     data={paginatedData}
// //                     loading={loading}
// //                     emptyMessage="No subscription feature categories found"
// //                 />

// //                 {/* Footer */}
// //                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
// //                     <p className="text-xs text-gray-400">
// //                         Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
// //                         {"–"}
// //                         {Math.min(page * limit, filteredData.length)} of {filteredData.length} categories
// //                     </p>
// //                     <Pagination
// //                         page={page}
// //                         total={filteredData.length}
// //                         limit={limit}
// //                         onChange={setPage}
// //                         onLimitChange={(newLimit) => {
// //                             setLimit(newLimit);
// //                             setPage(1);
// //                         }}
// //                     />
// //                 </div>
// //             </div>

// //             {/* Form Modal */}
// //             <FormModal
// //                 isOpen={modalOpen}
// //                 onClose={() => setModalOpen(false)}
// //                 onSubmit={handleSubmit}
// //                 title={editItem ? "Edit Category" : "Add Category"}
// //                 fields={getFormFields(editItem)}
// //                 initialData={editItem ? {
// //                     category_name: editItem.category_name || "",
// //                     category_code: editItem.category_code || "",
// //                     description: editItem.description || "",
// //                     icon: editItem.icon || null,
// //                     display_order: editItem.display_order || 0,
// //                     status: editItem.is_status ? "active" : "inactive",
// //                     is_trending: editItem.is_trending || false
// //                 } : {
// //                     category_name: "",
// //                     category_code: "",
// //                     description: "",
// //                     icon: null,
// //                     display_order: 0,
// //                     status: "active",
// //                     is_trending: false
// //                 }}
// //                 validationRules={validationRules}
// //                 loading={formLoading}
// //                 submitLabel={editItem ? "Update" : "Create"}
// //                 size="lg"
// //                 existingImage={editItem?.icon ? getFullImageUrl(editItem.icon) : null}
// //             />

// //             {/* View Modal */}
// //             <ViewModal
// //                 isOpen={viewModalOpen}
// //                 onClose={() => {
// //                     setViewModalOpen(false);
// //                     setViewData(null);
// //                 }}
// //                 title="Category Details"
// //             >
// //                 {viewData && (
// //                     <div className="space-y-1">
// //                         <ViewRow label="Category Name" value={viewData.category_name} />
// //                         <ViewRow label="Category Code" value={viewData.category_code} />
// //                         <ViewRow label="Display Order" value={viewData.display_order} />
// //                         {viewData.description && (
// //                             <ViewRow label="Description" value={viewData.description} />
// //                         )}
// //                         {viewData.icon && (
// //                             <ViewRow
// //                                 label="Icon"
// //                                 value={
// //                                     <img
// //                                         src={getFullImageUrl(viewData.icon)}
// //                                         alt="Category icon"
// //                                         className="w-16 h-16 rounded-lg object-cover border border-gray-200"
// //                                         onError={(e) => {
// //                                             e.target.style.display = 'none';
// //                                         }}
// //                                     />
// //                                 }
// //                             />
// //                         )}
// //                         <ViewRow
// //                             label="Status"
// //                             value={
// //                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusValue(viewData)
// //                                     ? "bg-green-50 text-green-700"
// //                                     : "bg-gray-100 text-gray-500"
// //                                     }`}>
// //                                     <span className={`w-1.5 h-1.5 rounded-full ${getStatusValue(viewData) ? "bg-green-500" : "bg-gray-400"}`} />
// //                                     {getStatusValue(viewData) ? "Active" : "Inactive"}
// //                                 </span>
// //                             }
// //                         />
// //                         <ViewRow
// //                             label="Trending"
// //                             value={
// //                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_trending
// //                                     ? "bg-yellow-50 text-yellow-700"
// //                                     : "bg-gray-100 text-gray-500"
// //                                     }`}>
// //                                     <span className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`} />
// //                                     {viewData.is_trending ? "Trending" : "Not Trending"}
// //                                 </span>
// //                             }
// //                         />
// //                         <ViewRow label="Created At" value={formatDate(viewData.createdAt)} />
// //                         {viewData.updatedAt && (
// //                             <ViewRow label="Updated At" value={formatDate(viewData.updatedAt)} />
// //                         )}
// //                         {viewData.created_by && (
// //                             <ViewRow label="Created By" value={viewData.created_by} />
// //                         )}
// //                     </div>
// //                 )}
// //             </ViewModal>

// //             <ConfirmDialog
// //                 isOpen={!!deleteId}
// //                 onClose={() => setDeleteId(null)}
// //                 onConfirm={handleDelete}
// //                 loading={deleteLoading}
// //                 title="Delete Category"
// //                 message="Delete this category? Associated subscription features may be affected."
// //             />
// //         </div>
// //     );
// // };

// // export default SubscriptionFeatureCategories;


// import React, { useState, useEffect, useCallback } from "react";
// import {
//     MdAdd,
//     MdEdit,
//     MdDelete,
//     MdSearch,
//     MdVisibility,
//     MdInsertPhoto,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import FormModal from "../../components/common/FormModal";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow, ViewBadge, ViewTrendingBadge } from "../../components/common/ViewModal";
// import { subscriptionFeatureCategoryService } from "../../services/subscriptionFeatureCategory.service";
// import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
// import { showSuccess, showError, showInfo } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const SubscriptionFeatureCategories = () => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [viewModalOpen, setViewModalOpen] = useState(false);
//     const [viewData, setViewData] = useState(null);
//     const [editItem, setEditItem] = useState(null);
//     const [deleteId, setDeleteId] = useState(null);
//     const [formLoading, setFormLoading] = useState(false);
//     const [deleteLoading, setDeleteLoading] = useState(false);
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [imageErrors, setImageErrors] = useState({});
//     const [checkingSubFeatures, setCheckingSubFeatures] = useState({});
//     const [subscriptionFeatures, setSubscriptionFeatures] = useState([]);
//     const [userNameCache, setUserNameCache] = useState({});

//     const getUserNameCached = (userId) => {
//         if (!userId) return "-";
//         return userNameCache[userId] || `User ${userId}`;
//     };

//     // const normalizeCategory = (item) => ({
//     //     id: item.id || item._id,
//     //     category_name: item.category_name || "",
//     //     category_code: item.category_code || "",
//     //     description: item.description || "",
//     //     icon: item.icon || null,
//     //     display_order: item.display_order || 0,
//     //     is_status: item.status === 1 || item.status === true,
//     //     is_trending: item.is_trending === 1 || item.is_trending === true,
//     //     status: item.status !== undefined ? item.status : 1,
//     //     createdAt: item.created_at || item.createdAt || null,
//     //     updatedAt: item.updated_at || item.updatedAt || null,
//     //     created_by: item.created_by || null,
//     //     updated_by: item.updated_by || null,
//     //     raw: item,
//     // });

//     const normalizeCategory = (item) => ({
//         id: item.id || item._id,
//         category_name: item.category_name || "",
//         category_code: item.category_code || "",
//         description: item.description || "",
//         icon: item.icon || null,
//         display_order: item.display_order || 0,

//         is_status: item.status === 1 || item.status === true,
//         is_trending: item.is_trending === 1 || item.is_trending === true,

//         status: item.status !== undefined ? item.status : 1,

//         createdAt: item.created_at || item.createdAt || null,
//         updatedAt: item.updated_at || item.updatedAt || null,

//         // Important
//         created_by: item.created_by || null,
//         updated_by: item.updated_by || null,

//         raw: item,
//     });

//     const getStatusValue = (row) => {
//         if (row.is_status !== undefined) {
//             return row.is_status;
//         }
//         if (row.status !== undefined) {
//             return row.status === 1 || row.status === true;
//         }
//         return true;
//     };

//     // Fetch all subscription features to check if category has children
//     // const loadSubscriptionFeatures = async () => {
//     //     try {

//     //         setUserNameCache(userMap);
//     //         const r = await subscriptionFeatureService.getAll({ limit: 1000 });
//     //         const rawData = r.data?.data || r.data?.results || r.data || [];
//     //         const features = Array.isArray(rawData) ? rawData : [];
//     //         setSubscriptionFeatures(features);
//     //         return features;
//     //     } catch (error) {
//     //         console.error('Load subscription features error:', error);
//     //         return subscriptionFeatures;
//     //     }
//     // };

//     const loadSubscriptionFeatures = async () => {
//         try {
//             const r = await subscriptionFeatureService.getAll({ limit: 1000 });

//             const rawData =
//                 r.data?.data ||
//                 r.data?.results ||
//                 r.data ||
//                 [];

//             const features = Array.isArray(rawData) ? rawData : [];

//             setSubscriptionFeatures(features);

//             return features;
//         } catch (error) {
//             console.error("Load subscription features error:", error);
//             return subscriptionFeatures;
//         }
//     };

//     // Check if category has subscription features
//     const checkCategoryHasFeatures = async (categoryId) => {
//         try {
//             const features = subscriptionFeatures.length > 0 ? subscriptionFeatures : await loadSubscriptionFeatures();
//             const hasFeatures = features.some(f =>
//                 String(f.subscription_feature_categories_id) === String(categoryId)
//             );
//             return hasFeatures;
//         } catch (error) {
//             console.warn("Could not check subscription features:", error);
//             return false;
//         }
//     };

//     // Get subscription features count
//     const getFeaturesCount = (categoryId) => {
//         return subscriptionFeatures.filter(f =>
//             String(f.subscription_feature_categories_id) === String(categoryId)
//         ).length;
//     };

//     // const load = async () => {
//     //     setLoading(true);
//     //     try {
//     //         const users = await fetchUsers();
//     //         const userMap = {};
//     //         Object.keys(users).forEach(id => {
//     //             userMap[id] = users[id].name;
//     //         });
//     //         setUserNameCache(userMap);
//     //         const r = await subscriptionFeatureCategoryService.getAll({ limit: 1000 });
//     //         const rawData = r.data?.data || r.data?.results || r.data || [];
//     //         const categories = Array.isArray(rawData) ? rawData.map(normalizeCategory) : [];
//     //         const sortedCategories = categories.sort((a, b) => {
//     //             return new Date(b.createdAt) - new Date(a.createdAt);
//     //         });
//     //         setData(sortedCategories);
//     //     } catch (error) {
//     //         console.error('Load error:', error);
//     //         showError(error.message || "Failed to load subscription feature categories");
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const load = async () => {
//         setLoading(true);

//         try {
//             // Get users
//             const users = await fetchUsers();

//             // Create ID -> username map
//             const userMap = {};

//             Object.keys(users).forEach((id) => {
//                 userMap[id] = users[id].name;
//             });

//             setUserNameCache(userMap);

//             // Get categories
//             const r = await subscriptionFeatureCategoryService.getAll({
//                 limit: 1000
//             });

//             const rawData =
//                 r.data?.data ||
//                 r.data?.results ||
//                 r.data ||
//                 [];

//             const categories = Array.isArray(rawData)
//                 ? rawData.map(normalizeCategory)
//                 : [];

//             const sortedCategories = categories.sort((a, b) => {
//                 return new Date(b.createdAt) - new Date(a.createdAt);
//             });

//             setData(sortedCategories);

//         } catch (error) {
//             console.error("Load error:", error);

//             showError(
//                 error.message ||
//                 "Failed to load subscription feature categories"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         load();
//         loadSubscriptionFeatures();
//     }, []);

//     useEffect(() => {
//         setPage(1);
//     }, [search, statusFilter]);

//     const filteredData = React.useMemo(() => {
//         let result = data;
//         if (statusFilter !== "all") {
//             const isActive = statusFilter === "active";
//             result = result.filter((item) => {
//                 const itemStatus = item.is_status === true || item.status === 1 || item.status === true;
//                 return itemStatus === isActive;
//             });
//         }
//         const query = search.toLowerCase().trim();
//         if (query) {
//             result = result.filter((item) =>
//                 String(item.category_name ?? "").toLowerCase().includes(query) ||
//                 String(item.category_code ?? "").toLowerCase().includes(query) ||
//                 String(item.description ?? "").toLowerCase().includes(query)
//             );
//         }
//         return result;
//     }, [data, search, statusFilter]);

//     const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//     const activeCount = data.filter((r) => r.is_status === true || r.status === 1 || r.status === true).length;
//     const inactiveCount = data.length - activeCount;


//     const getFullImageUrl = (value) => {
//         if (!value) return null;
//         if (value.startsWith("http") || value.startsWith("data:image")) {
//             return value;
//         }
//         if (value.startsWith("/uploads/")) {
//             return `${API_BASE_URL}${value}`;
//         }
//         return value;
//     };

//     const getFormFields = (editData = null) => {
//         return [
//             {
//                 name: "category_name",
//                 label: "Category Name",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. Jobs",
//                 help: "Enter a unique name for the category"
//             },
//             // {
//             //     name: "category_code",
//             //     label: "Category Code",
//             //     type: "text",
//             //     required: true,
//             //     placeholder: "e.g. jobs",
//             //     help: "Unique identifier for the category"
//             // },
//             {
//                 name: "description",
//                 label: "Description",
//                 type: "textarea",
//                 required: false,
//                 placeholder: "Enter category description...",
//                 rows: 3,
//                 help: "Optional description for the category"
//             },
//             {
//                 name: "icon",
//                 label: "Category Icon",
//                 type: "file",
//                 required: false,
//                 accept: "image/*",
//                 maxSize: 5,
//                 help: "Upload an icon for the category (PNG, JPG, SVG) - Max 5MB",
//                 placeholder: "Click or drag to upload icon",
//                 existingImage: editData?.icon ? getFullImageUrl(editData.icon) : null
//             },
//             {
//                 name: "display_order",
//                 label: "Display Order",
//                 type: "number",
//                 required: false,
//                 min: 0,
//                 step: 1,
//                 help: "Order in which the category should be displayed"
//             },
//             {
//                 name: "status",
//                 label: "Status",
//                 type: "radio",
//                 options: [
//                     { value: "active", label: "Active" },
//                     { value: "inactive", label: "Inactive" },
//                 ],
//                 color: "text-[#2c0eee] focus:ring-[#4529f7]",
//             },
//             {
//                 name: "is_trending",
//                 label: "Mark as Trending",
//                 type: "checkbox",
//                 color: "text-yellow-500 focus:ring-yellow-500",
//                 help: "Trending categories will be highlighted in the listing",
//             },
//         ];
//     };

//     const validationRules = {
//         category_name: {
//             required: true,
//             requiredMessage: 'Category name is required',
//             minLength: 2,
//             minLengthMessage: 'Category name must be at least 2 characters',
//             maxLength: 100,
//             maxLengthMessage: 'Category name must be at most 100 characters',
//             custom: (value) => {
//                 const exists = data.some(item =>
//                     item.category_name?.toLowerCase() === value.toLowerCase() &&
//                     (!editItem || item.id !== editItem.id)
//                 );
//                 if (exists) {
//                     return 'This category name already exists';
//                 }
//                 return null;
//             }
//         },
//         category_code: {
//             required: true,
//             requiredMessage: 'Category code is required',
//             minLength: 2,
//             minLengthMessage: 'Category code must be at least 2 characters',
//             maxLength: 50,
//             maxLengthMessage: 'Category code must be at most 50 characters',
//             pattern: /^[a-z0-9_-]+$/,
//             patternMessage: 'Category code must contain only lowercase letters, numbers, underscores and hyphens',
//             custom: (value) => {
//                 const exists = data.some(item =>
//                     item.category_code?.toLowerCase() === value.toLowerCase() &&
//                     (!editItem || item.id !== editItem.id)
//                 );
//                 if (exists) {
//                     return 'This category code already exists';
//                 }
//                 return null;
//             }
//         },
//         display_order: {
//             custom: (value) => {
//                 if (value === "" || value === null || value === undefined) {
//                     return null;
//                 }

//                 const number = Number(value);

//                 if (Number.isNaN(number)) {
//                     return "Display order must be a number";
//                 }

//                 if (number < 0) {
//                     return "Display order cannot be negative";
//                 }

//                 if (!Number.isInteger(number)) {
//                     return "Display order must be a whole number";
//                 }

//                 return null;
//             }
//         }
//     };

//     const openAdd = () => {
//         setEditItem(null);
//         setModalOpen(true);
//     };

//     const openEdit = (item) => {
//         setEditItem(item);
//         setModalOpen(true);
//     };

//     const openView = (item) => {
//         setViewData(item);
//         setViewModalOpen(true);
//     };

//     const handleSubmit = async (formData) => {
//         setFormLoading(true);
//         try {
//             const submitData = {
//                 category_name: formData.category_name,
//                 category_code: formData.category_code || formData.category_name.toLowerCase().replace(/\s+/g, '-'),
//                 description: formData.description || "",
//                 display_order: formData.display_order || 0,
//                 status: formData.status === "active" ? 1 : 0,
//                 is_trending: formData.is_trending || false,
//             };

//             if (formData.iconFile instanceof File) {
//                 submitData.iconFile = formData.iconFile;
//             } else if (editItem && editItem.icon) {
//                 submitData.icon = editItem.icon;
//             }

//             if (editItem) {
//                 await subscriptionFeatureCategoryService.update(editItem.id, submitData);
//                 showSuccess("Category updated successfully");
//             } else {
//                 await subscriptionFeatureCategoryService.create(submitData);
//                 showSuccess("Category created successfully");
//             }
//             setModalOpen(false);
//             load();
//         } catch (error) {
//             console.error('Submit error:', error);
//             showError(error.message || error?.response?.data?.message || "Failed to save");
//         } finally {
//             setFormLoading(false);
//         }
//     };

//     // FIXED: Delete with sub-features check
//     const handleDelete = async () => {
//         if (!deleteId) return;

//         setDeleteLoading(true);
//         try {
//             // Double-check: Verify category has no subscription features
//             const hasFeatures = await checkCategoryHasFeatures(deleteId);

//             if (hasFeatures) {
//                 const count = getFeaturesCount(deleteId);
//                 showInfo(
//                     `Cannot delete this category because it has ${count} subscription feature${count > 1 ? 's' : ''} linked to it. Please delete the features first.`
//                 );
//                 setDeleteId(null);
//                 setDeleteLoading(false);
//                 return;
//             }

//             await subscriptionFeatureCategoryService.delete(deleteId);
//             showSuccess("Category deleted successfully");
//             load();
//             loadSubscriptionFeatures();
//         } catch (error) {
//             console.error('Delete error:', error);
//             const message = error?.response?.data?.message || error?.message || "";
//             if (/foreign\s*key|constraint|used|referenced|subscription[-_ ]?feature/i.test(message)) {
//                 showError("Cannot delete this category because it has subscription features linked to it.");
//             } else {
//                 showError(message || "Failed to delete category");
//             }
//         } finally {
//             setDeleteId(null);
//             setDeleteLoading(false);
//         }
//     };

//     // Open delete confirmation - Check subscription features before showing dialog
//     const handleDeleteClick = async (row) => {
//         const categoryId = row.id || row._id;
//         const categoryName = row.category_name || "";

//         setCheckingSubFeatures(prev => ({ ...prev, [categoryId]: true }));

//         try {
//             // Check if category has subscription features
//             const hasFeatures = await checkCategoryHasFeatures(categoryId);

//             if (hasFeatures) {
//                 const count = getFeaturesCount(categoryId);
//                 showInfo(
//                     `Cannot delete "${categoryName}" because it has ${count} subscription feature${count > 1 ? 's' : ''} linked to it. Please delete the features first.`
//                 );
//                 setCheckingSubFeatures(prev => ({ ...prev, [categoryId]: false }));
//                 return;
//             }

//             // Only set delete confirmation if NO subscription features exist
//             setDeleteId(categoryId);
//         } catch (error) {
//             console.error('Delete click error:', error);
//             showError("Failed to check subscription features. Please try again.");
//             setCheckingSubFeatures(prev => ({ ...prev, [categoryId]: false }));
//         }
//     };

//     // const handleStatusToggle = async (row) => {
//     //     const currentStatus = getStatusValue(row);
//     //     const newStatus = !currentStatus;

//     //     try {
//     //         const updateData = {
//     //             category_name: row.category_name,
//     //             category_code: row.category_code,
//     //             description: row.description || "",
//     //             display_order: row.display_order || 0,
//     //             is_trending: row.is_trending ? 1 : 0,
//     //             status: newStatus ? 1 : 0,
//     //             icon: row.icon || null,
//     //         };

//     //         console.log('Toggling status from', currentStatus, 'to', newStatus);
//     //         console.log('Update data:', updateData);

//     //         await subscriptionFeatureCategoryService.update(row.id, updateData);
//     //         showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//     //         load();
//     //     } catch (error) {
//     //         console.error('Status toggle error:', error);
//     //         showError(error.response?.data?.message || error.message || "Failed to update status");
//     //     }
//     // };

//     // const handleTrendingToggle = async (row) => {
//     //     const newValue = !row.is_trending;

//     //     try {
//     //         const updateData = {
//     //             category_name: row.category_name,
//     //             category_code: row.category_code,
//     //             description: row.description || "",
//     //             display_order: row.display_order || 0,
//     //             is_trending: newValue ? 1 : 0,
//     //             status: row.status !== undefined ? row.status : 1,
//     //             icon: row.icon || null,
//     //         };

//     //         await subscriptionFeatureCategoryService.update(row.id, updateData);
//     //         showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
//     //         load();
//     //     } catch (error) {
//     //         console.error('Trending toggle error:', error);
//     //         showError(error.response?.data?.message || error.message || "Failed to update trending");
//     //     }
//     // };


//     // In SubscriptionFeatureCategories component - Fix toggle handlers

//     const handleStatusToggle = async (row) => {
//         const currentStatus = getStatusValue(row);
//         const newStatus = !currentStatus;

//         try {
//             const updateData = {
//                 category_name: row.category_name,
//                 category_code: row.category_code,
//                 description: row.description || "",
//                 display_order: row.display_order || 0,
//                 is_trending: row.is_trending ? 1 : 0,
//                 status: newStatus ? 1 : 0,
//                 icon: row.icon || null,
//                 // ✅ The service will add updated_by automatically
//             };

//             console.log('Toggling status from', currentStatus, 'to', newStatus);
//             console.log('Update data:', updateData);

//             await subscriptionFeatureCategoryService.update(row.id, updateData);
//             showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//             load();
//         } catch (error) {
//             console.error('Status toggle error:', error);
//             showError(error.response?.data?.message || error.message || "Failed to update status");
//         }
//     };

//     const handleTrendingToggle = async (row) => {
//         const newValue = !row.is_trending;

//         try {
//             const updateData = {
//                 category_name: row.category_name,
//                 category_code: row.category_code,
//                 description: row.description || "",
//                 display_order: row.display_order || 0,
//                 is_trending: newValue ? 1 : 0,
//                 status: row.status !== undefined ? row.status : 1,
//                 icon: row.icon || null,
//                 // ✅ The service will add updated_by automatically
//             };

//             console.log('Toggling trending from', row.is_trending, 'to', newValue);
//             console.log('Update data:', updateData);

//             await subscriptionFeatureCategoryService.update(row.id, updateData);
//             showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
//             load();
//         } catch (error) {
//             console.error('Trending toggle error:', error);
//             showError(error.response?.data?.message || error.message || "Failed to update trending");
//         }
//     };


//     const handleImageError = (id) => {
//         setImageErrors((prev) => ({ ...prev, [id]: true }));
//     };

//     const renderIconPreview = (value, rowId) => {
//         if (!value) return <span className="text-gray-400 text-xs">-</span>;

//         const hasError = imageErrors[rowId];
//         const fullUrl = getFullImageUrl(value);

//         if (!hasError && fullUrl) {
//             return (
//                 <div className="flex items-center gap-2">
//                     <div className="relative group cursor-pointer">
//                         <img
//                             src={fullUrl}
//                             alt="Category icon"
//                             className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
//                             onError={() => handleImageError(rowId)}
//                         />
//                         <button
//                             onClick={() => window.open(fullUrl, '_blank')}
//                             className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//                             title="Click to view image"
//                         >
//                             <MdVisibility size={16} />
//                         </button>
//                     </div>
//                 </div>
//             );
//         } else {
//             return (
//                 <div className="w-12 h-12 rounded-lg bg-blue-50 border border-[#4529f7] flex items-center justify-center text-[#2c0eee]">
//                     <MdInsertPhoto size={20} />
//                 </div>
//             );
//         }
//     };
//     // Get display name for created by
//     const getCreatedByName = (row) => {
//         if (!row) return "-";
//         if (row.created_by) {
//             return getUserNameCached(row.created_by);
//         }
//         return "-";
//     };

//     // Get display name for updated by
//     const getUpdatedByName = (row) => {
//         if (!row) return "-";
//         if (row.updated_by) {
//             return getUserNameCached(row.updated_by);
//         }
//         return "-";
//     };

//     const columns = [
//         {
//             header: "#",
//             key: "id",
//             render: (_, __, i) => (page - 1) * limit + i + 1
//         },
//         {
//             header: "Icon",
//             key: "icon",
//             render: (value, row) => renderIconPreview(value, row.id),
//         },
//         {
//             header: "Category Name",
//             key: "category_name",
//             render: (v) => (
//                 <span className="font-medium capitalize text-gray-800">{v}</span>
//             ),
//         },

//         // {
//         //     header: "Category Code",
//         //     key: "category_code",
//         //     render: (v) => (
//         //         <span className="text-gray-500 text-sm font-mono">{v}</span>
//         //     ),
//         // },
//         // {
//         //     header: "Description",
//         //     key: "description",
//         //     render: (v) => (
//         //         <span className="text-gray-500 text-sm truncate max-w-[150px] inline-block">{v || "-"}</span>
//         //     ),
//         // },
//         // {
//         //     header: "Display Order",
//         //     key: "display_order",
//         //     render: (v) => (
//         //         <span className="text-gray-500 text-sm">{v || 0}</span>
//         //     ),
//         // },
//         {
//             header: "Trending",
//             key: "is_trending",
//             render: (value, row) => (
//                 <button
//                     onClick={() => handleTrendingToggle(row)}
//                     className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"
//                         }`}
//                 >
//                     <span
//                         className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"
//                             }`}
//                     />
//                 </button>
//             ),
//         },
//         {
//             header: "Status",
//             key: "status",
//             render: (status, row) => {
//                 const isActive = getStatusValue(row);
//                 return (
//                     <button
//                         onClick={() => handleStatusToggle(row)}
//                         className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"
//                             }`}
//                     >
//                         <span
//                             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"
//                                 }`}
//                         />
//                     </button>
//                 );
//             },
//         },
//         //  {
//         //     header: "Created By",
//         //     key: "created_by",
//         //     render: (_, row) => (
//         //         <span className="text-gray-500 text-sm font-medium">
//         //             {getCreatedByName(row)}
//         //         </span>
//         //     ),
//         // },
//         {
//             header: "Updated By",
//             key: "updated_by",
//             render: (_, row) => (
//                 <span className="text-gray-500 text-sm font-medium">
//                     {getUpdatedByName(row)}
//                 </span>
//             ),
//         },
//         {
//             header: "Actions",
//             key: "id",
//             render: (id, row) => {
//                 const childCount = getFeaturesCount(row.id);
//                 const canDelete = childCount === 0;
//                 return (
//                     <div className="flex gap-1">
//                         <button
//                             onClick={() => openView(row)}
//                             className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
//                             title="View"
//                         >
//                             <MdVisibility size={16} />
//                         </button>
//                         <button
//                             onClick={() => openEdit(row)}
//                             className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
//                             title="Edit"
//                         >
//                             <MdEdit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDeleteClick(row)}
//                             className={`p-1.5 rounded-lg transition-colors ${canDelete
//                                 ? "hover:bg-red-50 text-gray-500 hover:text-red-600"
//                                 : "text-gray-300 hover:bg-gray-50 hover:text-gray-400"
//                                 }`}
//                             title={canDelete ? "Delete" : `Cannot delete - ${childCount} subscription feature${childCount === 1 ? '' : 's'} linked`}
//                         >
//                             <MdDelete size={16} />
//                         </button>
//                     </div>
//                 );
//             },
//         },
//     ];


//     const tabs = [
//         { key: "all", label: "All", count: data.length },
//         { key: "active", label: "Active", count: activeCount },
//         { key: "inactive", label: "Inactive", count: inactiveCount },
//     ];

//     return (
//         <div className="space-y-4">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">Subscription Feature Categories</h1>
//                     <p className="text-sm text-gray-500 mt-1">Manage subscription feature categories</p>
//                 </div>
//                 <Button icon={MdAdd} onClick={openAdd}>
//                     Add Category
//                 </Button>
//             </div>

//             {/* Table Card */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 {/* Top bar: search + tabs */}
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
//                     <div className="relative w-full sm:w-72">
//                         <MdSearch
//                             size={18}
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                         />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search categories..."
//                             className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//                         />
//                     </div>

//                     <div className="flex items-center gap-5 text-sm">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab.key}
//                                 onClick={() => setStatusFilter(tab.key)}
//                                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
//                                     }`}
//                             >
//                                 {tab.label}
//                                 <span
//                                     className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
//                                         ? "bg-blue-50 text-[#2c0eee]"
//                                         : "bg-gray-100 text-gray-500"
//                                         }`}
//                                 >
//                                     {tab.count}
//                                 </span>
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 <Table
//                     columns={columns}
//                     data={paginatedData}
//                     loading={loading}
//                     emptyMessage="No subscription feature categories found"
//                 />

//                 {/* Footer */}
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//                     <p className="text-xs text-gray-400">
//                         Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//                         {"–"}
//                         {Math.min(page * limit, filteredData.length)} of {filteredData.length} categories
//                     </p>
//                     <Pagination
//                         page={page}
//                         total={filteredData.length}
//                         limit={limit}
//                         onChange={setPage}
//                         onLimitChange={(newLimit) => {
//                             setLimit(newLimit);
//                             setPage(1);
//                         }}
//                     />
//                 </div>
//             </div>

//             {/* Form Modal */}
//             <FormModal
//                 isOpen={modalOpen}
//                 onClose={() => setModalOpen(false)}
//                 onSubmit={handleSubmit}
//                 title={editItem ? "Edit Category" : "Add Category"}
//                 fields={getFormFields(editItem)}
//                 initialData={editItem ? {
//                     category_name: editItem.category_name || "",
//                     category_code: editItem.category_code || "",
//                     description: editItem.description || "",
//                     icon: editItem.icon || null,
//                     display_order: editItem.display_order || 0,
//                     status: editItem.is_status ? "active" : "inactive",
//                     is_trending: editItem.is_trending || false
//                 } : {
//                     category_name: "",
//                     category_code: "",
//                     description: "",
//                     icon: null,
//                     display_order: 0,
//                     status: "active",
//                     is_trending: false
//                 }}
//                 validationRules={validationRules}
//                 loading={formLoading}
//                 submitLabel={editItem ? "Update" : "Create"}
//                 size="lg"
//                 existingImage={editItem?.icon ? getFullImageUrl(editItem.icon) : null}
//             />

//             {/* View Modal */}
//             <ViewModal
//                 isOpen={viewModalOpen}
//                 onClose={() => {
//                     setViewModalOpen(false);
//                     setViewData(null);
//                 }}
//                 title="Category Details"
//             >
//                 {viewData && (
//                     <div className="space-y-1">
//                         <ViewRow label="Category Name" value={viewData.category_name} />
//                         <ViewRow label="Category Code" value={viewData.category_code} />
//                         <ViewRow label="Display Order" value={viewData.display_order} />
//                         {viewData.description && (
//                             <ViewRow label="Description" value={viewData.description} />
//                         )}
//                         {viewData.icon && (
//                             <ViewRow
//                                 label="Icon"
//                                 value={
//                                     <img
//                                         src={getFullImageUrl(viewData.icon)}
//                                         alt="Category icon"
//                                         className="w-16 h-16 rounded-lg object-cover border border-gray-200"
//                                         onError={(e) => {
//                                             e.target.style.display = 'none';
//                                         }}
//                                     />
//                                 }
//                             />
//                         )}
//                         <ViewRow
//                             label="Status"
//                             value={
//                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusValue(viewData)
//                                     ? "bg-green-50 text-green-700"
//                                     : "bg-gray-100 text-gray-500"
//                                     }`}>
//                                     <span className={`w-1.5 h-1.5 rounded-full ${getStatusValue(viewData) ? "bg-green-500" : "bg-gray-400"}`} />
//                                     {getStatusValue(viewData) ? "Active" : "Inactive"}
//                                 </span>
//                             }
//                         />
//                         <ViewRow
//                             label="Trending"
//                             value={
//                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_trending
//                                     ? "bg-yellow-50 text-yellow-700"
//                                     : "bg-gray-100 text-gray-500"
//                                     }`}>
//                                     <span className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`} />
//                                     {viewData.is_trending ? "Trending" : "Not Trending"}
//                                 </span>
//                             }
//                         />
//                         <ViewRow label="Created At" value={formatDate(viewData.createdAt)} />
//                         {viewData.updatedAt && (
//                             <ViewRow label="Updated At" value={formatDate(viewData.updatedAt)} />
//                         )}
//                         {viewData.created_by && (
//                             <ViewRow label="Created By" value={viewData.created_by} />
//                         )}
//                     </div>
//                 )}
//             </ViewModal>

//             <ConfirmDialog
//                 isOpen={!!deleteId}
//                 onClose={() => setDeleteId(null)}
//                 onConfirm={handleDelete}
//                 loading={deleteLoading}
//                 title="Delete Category"
//                 message="Delete this category? Associated subscription features may be affected."
//             />
//         </div>
//     );
// };

// export default SubscriptionFeatureCategories;



// pages/SubscriptionFeatureCategories.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdSearch,
    MdVisibility,
    MdInsertPhoto,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { subscriptionFeatureCategoryService } from "../../services/subscriptionFeatureCategory.service";
import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const SubscriptionFeatureCategories = () => {
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
    const [subscriptionFeatures, setSubscriptionFeatures] = useState([]);
    const [userNameCache, setUserNameCache] = useState({});

    const getUserNameCached = (userId) => {
        if (!userId) return "-";
        return userNameCache[userId] || `User ${userId}`;
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

    const normalizeCategory = (item) => ({
        id: item.id || item._id,
        category_name: item.category_name || "",
        category_code: item.category_code || "",
        description: item.description || "",
        icon: item.icon || null,
        display_order: item.display_order || 0,
        is_status: item.status === 1 || item.status === true,
        is_trending: item.is_trending === 1 || item.is_trending === true,
        status: item.status !== undefined ? item.status : 1,
        createdAt: item.created_at || item.createdAt || null,
        updatedAt: item.updated_at || item.updatedAt || null,
        created_by: item.created_by || null,
        updated_by: item.updated_by || null,
        raw: item,
    });

    const load = async () => {
        setLoading(true);

        try {
            const users = await fetchUsers();

            const userMap = {};
            Object.keys(users).forEach((id) => {
                userMap[id] = users[id].name;
            });

            setUserNameCache(userMap);

            const r = await subscriptionFeatureCategoryService.getAll({
                limit: 1000,
            });

            const rawData =
                r.data?.data ||
                r.data?.results ||
                r.data ||
                [];

            const categories = Array.isArray(rawData)
                ? rawData.map(normalizeCategory)
                : [];

            // Latest added category first
            const sortedCategories = [...categories].sort((a, b) => {
                return Number(b.id) - Number(a.id);
            });

            setData(sortedCategories);

        } catch (error) {
            console.error("Load error:", error);
            showError(
                error.message ||
                "Failed to load subscription feature categories"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadSubscriptionFeatures = async () => {
        try {
            const r = await subscriptionFeatureService.getAll({ limit: 1000 });
            const rawData = r.data?.data || r.data?.results || r.data || [];
            const features = Array.isArray(rawData) ? rawData : [];
            setSubscriptionFeatures(features);
            return features;
        } catch (error) {
            console.error('Load subscription features error:', error);
            return subscriptionFeatures;
        }
    };

    useEffect(() => {
        load();
        loadSubscriptionFeatures();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    const filteredData = React.useMemo(() => {
        let result = data;
        if (statusFilter !== "all") {
            const isActive = statusFilter === "active";
            result = result.filter((item) => {
                const itemStatus = item.is_status === true || item.status === 1 || item.status === true;
                return itemStatus === isActive;
            });
        }
        const query = search.toLowerCase().trim();
        if (query) {
            result = result.filter((item) =>
                String(item.category_name ?? "").toLowerCase().includes(query) ||
                String(item.category_code ?? "").toLowerCase().includes(query) ||
                String(item.description ?? "").toLowerCase().includes(query)
            );
        }
        return result;
    }, [data, search, statusFilter]);

    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    const activeCount = data.filter((r) => r.is_status === true || r.status === 1 || r.status === true).length;
    const inactiveCount = data.length - activeCount;

    const getFeaturesCount = (categoryId) => {
        return subscriptionFeatures.filter(f =>
            String(f.subscription_feature_categories_id) === String(categoryId)
        ).length;
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
            await subscriptionFeatureCategoryService.delete(deleteId);
            showSuccess("Category deleted successfully");
            load();
            loadSubscriptionFeatures();
        } catch (error) {
            console.error('Delete error:', error);
            const message = error?.response?.data?.message || error?.message || "";
            if (/foreign\s*key|constraint|used|referenced|subscription[-_ ]?feature/i.test(message)) {
                showError("Cannot delete this category because it has subscription features linked to it.");
            } else {
                showError(message || "Failed to delete category");
            }
        } finally {
            setDeleteId(null);
            setDeleteLoading(false);
        }
    };

    const handleDeleteClick = (row) => {
        const childCount = getFeaturesCount(row.id);
        if (childCount > 0) {
            showError(
                `Cannot delete it has subscription feature linked to it.`
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
                category_name: row.category_name,
                category_code: row.category_code,
                description: row.description || "",
                display_order: row.display_order || 0,
                is_trending: row.is_trending ? 1 : 0,
                status: newStatus ? 1 : 0,
                icon: row.icon || null,
            };

            await subscriptionFeatureCategoryService.update(row.id, updateData);
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
                category_name: row.category_name,
                category_code: row.category_code,
                description: row.description || "",
                display_order: row.display_order || 0,
                is_trending: newValue ? 1 : 0,
                status: row.status !== undefined ? row.status : 1,
                icon: row.icon || null,
            };

            await subscriptionFeatureCategoryService.update(row.id, updateData);
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
            return row.status === 1 || row.status === true;
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
                            alt="Category icon"
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
                    <MdInsertPhoto size={20} />
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
            header: "Category Name",
            key: "category_name",
            render: (v) => (
                <span className="font-medium capitalize text-gray-800">{v}</span>
            ),
        },
        {
            header: "Category Code",
            key: "category_code",
            render: (v) => (
                <span className="text-gray-500 text-sm font-mono">{v}</span>
            ),
        },
        {
            header: "Description",
            key: "description",
            render: (v) => (
                <span className="text-gray-500 text-sm truncate max-w-[150px] inline-block">{v || "-"}</span>
            ),
        },
        {
            header: "Display Order",
            key: "display_order",
            render: (v) => (
                <span className="text-gray-500 text-sm">{v || 0}</span>
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
            render: (v) => (
                <span className="text-gray-500 text-sm">{formatDate(v)}</span>
            ),
        },
        {
            header: "Actions",
            key: "id",
            render: (id, row) => {
                const childCount = getFeaturesCount(row.id);
                const canDelete = childCount === 0;
                return (
                    <div className="flex gap-1">
                        <button
                            onClick={() => navigate(`/subscription-feature-categories/view/${row.id}`, { state: { item: row } })}
                            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
                            title="View"
                        >
                            <MdVisibility size={16} />
                        </button>
                        <button
                            onClick={() => navigate(`/subscription-feature-categories/edit/${row.id}`, { state: { item: row } })}
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
                            title={canDelete ? "Delete" : `Cannot delete subscription feature linked`}
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
                    <h1 className="text-2xl font-bold text-gray-900">Subscription Feature Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage subscription feature categories</p>
                </div>
                <Button icon={MdAdd} onClick={() => navigate('/subscription-feature-categories/add')}>
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
                    emptyMessage="No subscription feature categories found"
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
                message="Delete this category? Associated subscription features may be affected."
            />
        </div>
    );
};

export default SubscriptionFeatureCategories;