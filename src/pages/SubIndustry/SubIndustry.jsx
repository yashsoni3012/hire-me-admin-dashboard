// // import React, { useState, useEffect, useCallback } from "react";
// // import {
// //   MdAdd,
// //   MdEdit,
// //   MdDelete,
// //   MdSearch,
// //   MdVisibility,
// //   MdInsertPhoto,
// // } from "react-icons/md";
// // import Table from "../../components/common/Table";
// // import Button from "../../components/common/Button";
// // import Pagination from "../../components/common/Pagination";
// // import FormModal from "../../components/common/FormModal";
// // import ConfirmDialog from "../../components/common/ConfirmDialog";
// // import ViewModal, { ViewRow, ViewBadge, ViewTrendingBadge } from "../../components/common/ViewModal";
// // import { subIndustryService } from "../../services/subIndustry.service";
// // import { industryService } from "../../services/industry.service";
// // import { showSuccess, showError } from "../../utils/toast";
// // import { formatDate } from "../../utils/helpers";
// // import { fetchUsers } from "../../utils/getUserName";

// // const API_BASE_URL = "https://apidata.hiremejobs.in";

// // const SubIndustry = () => {
// //   const [data, setData] = useState([]);
// //   const [parentIndustries, setParentIndustries] = useState([]);
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
// //   const [imageErrors, setImageErrors] = useState({});
// //   const [userNameCache, setUserNameCache] = useState({});
// //   const getUserNameCached = (userId) => {
// //     if (!userId) return "-";
// //     return userNameCache[userId] || `User ${userId}`;
// //   };
// //   const normalizeSubIndustry = (item) => ({
// //     id: item.id || item._id,
// //     name: item.name || "",
// //     slug: item.slug || "",
// //     icon: item.icon || null,
// //     industry_id: item.industry_id || "",
// //     Industry: item.Industry || null,
// //     parent_industry_name: item.Industry?.name || "",
// //     is_status: item.is_status !== undefined ? item.is_status : true,
// //     is_trending: item.is_trending || false,
// //     status: item.status !== undefined ? item.status : true,
// //     sort_order: item.sort_order || 0,
// //     created_by: item.created_by || null,
// //     updated_by: item.updated_by || null,
// //     createdAt: item.created_at || item.createdAt || null,
// //     updatedAt: item.updated_at || item.updatedAt || null,
// //     raw: item,
// //   });

// //   // Fetch parent industries
// //   const fetchParentIndustries = async () => {
// //     try {
// //       const r = await industryService.getAll({ limit: 1000 });
// //       const rawData = r.data?.data || r.data?.results || r.data || [];
// //       const industries = Array.isArray(rawData) ? rawData : [];
// //       setParentIndustries(industries);
// //     } catch (error) {
// //       console.error("Failed to fetch parent industries:", error);
// //     }
// //   };

// //   const load = async () => {
// //     setLoading(true);
// //     try {
// //       const users = await fetchUsers();
// //       const userMap = {};
// //       Object.keys(users).forEach(id => {
// //         userMap[id] = users[id].name;
// //       });
// //       setUserNameCache(userMap);

// //       const r = await subIndustryService.getAll({ limit: 1000 });
// //       const rawData = r.data?.data || r.data?.results || r.data || [];
// //       const subIndustries = Array.isArray(rawData) ? rawData.map(normalizeSubIndustry) : [];
// //       // Sort by created_at descending (newest first)
// //       const sortedSubIndustries = subIndustries.sort((a, b) => {
// //         return new Date(b.createdAt) - new Date(a.createdAt);
// //       });
// //       setData(sortedSubIndustries);
// //     } catch (error) {
// //       console.error('Load error:', error);
// //       showError(error.message || "Failed to load sub-industries");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     load();
// //     fetchParentIndustries();
// //   }, []);

// //   useEffect(() => {
// //     setPage(1);
// //   }, [search, statusFilter]);

// //   const filteredData = React.useMemo(() => {
// //     let result = data;
// //     if (statusFilter !== "all") {
// //       const isActive = statusFilter === "active";
// //       result = result.filter((item) => {
// //         const itemStatus = item.is_status === true || item.status === true || item.status === "active";
// //         return itemStatus === isActive;
// //       });
// //     }
// //     const query = search.toLowerCase().trim();
// //     if (query) {
// //       result = result.filter((item) =>
// //         String(item.name ?? "").toLowerCase().includes(query) ||
// //         String(item.parent_industry_name ?? "").toLowerCase().includes(query)
// //       );
// //     }
// //     return result;
// //   }, [data, search, statusFilter]);

// //   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

// //   const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
// //   const inactiveCount = data.length - activeCount;

// //   // Get full image URL helper
// //   const getFullImageUrl = (value) => {
// //     if (!value) return null;
// //     if (value.startsWith("http") || value.startsWith("data:image")) {
// //       return value;
// //     }
// //     if (value.startsWith("/uploads/")) {
// //       return `${API_BASE_URL}${value}`;
// //     }
// //     return value;
// //   };

// //   // Form fields configuration
// //   const getFormFields = (editData = null) => {
// //     const industryOptions = parentIndustries.map(ind => ({
// //       value: ind.id || ind._id,
// //       label: ind.name || ""
// //     }));

// //     return [
// //       {
// //         name: "name",
// //         label: "Sub-Industry Name",
// //         type: "text",
// //         required: true,
// //         placeholder: "e.g. Web Development",
// //         help: "Enter a unique name for the sub-industry"
// //       },
// //       {
// //         name: "industry_id",
// //         label: "Parent Industry",
// //         type: "select",
// //         required: true,
// //         options: industryOptions,
// //         placeholder: "Select parent industry",
// //         help: "Select the parent industry"
// //       },
// //       {
// //         name: "icon",
// //         label: "Sub-Industry Icon",
// //         type: "file",
// //         required: false,
// //         accept: "image/*",
// //         maxSize: 5,
// //         help: "Upload an icon for the sub-industry (PNG, JPG, SVG) - Max 5MB",
// //         placeholder: "Click or drag to upload icon",
// //         existingImage: editData?.icon ? getFullImageUrl(editData.icon) : null
// //       },
// //       {
// //         name: "sort_order",
// //         label: "Sort Order",
// //         type: "number",
// //         required: false,
// //         min: 0,
// //         help: "Optional sort order for display"
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
// //         help: "Trending sub-industries will be highlighted in the listing",
// //       },
// //     ];
// //   };

// //   // Validation rules
// //   const validationRules = {
// //     name: {
// //       required: true,
// //       requiredMessage: 'Sub-industry name is required',
// //       minLength: 2,
// //       minLengthMessage: 'Sub-industry name must be at least 2 characters',
// //       maxLength: 50,
// //       maxLengthMessage: 'Sub-industry name must be at most 50 characters',
// //       custom: (value) => {
// //         const exists = data.some(item =>
// //           item.name.toLowerCase() === value.toLowerCase() &&
// //           (!editItem || item.id !== editItem.id)
// //         );
// //         if (exists) {
// //           return 'This sub-industry name already exists';
// //         }
// //         return null;
// //       }
// //     },
// //     industry_id: {
// //       required: true,
// //       requiredMessage: 'Please select a parent industry'
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

// //   // const handleSubmit = async (formData) => {
// //   //   setFormLoading(true);
// //   //   try {
// //   //     // Validate that industry_id is selected
// //   //     if (!formData.industry_id || formData.industry_id === '') {
// //   //       showError('Please select a parent industry');
// //   //       setFormLoading(false);
// //   //       return;
// //   //     }

// //   //     const submitData = {
// //   //       name: formData.name,
// //   //       industry_id: parseInt(formData.industry_id),
// //   //       is_status: formData.status === "active",
// //   //       is_trending: formData.is_trending || false,
// //   //       sort_order: formData.sort_order || 0,
// //   //     };

// //   //     if (formData.iconFile instanceof File) {
// //   //       submitData.iconFile = formData.iconFile;
// //   //     } else if (editItem && editItem.icon) {
// //   //       submitData.icon = editItem.icon;
// //   //     }

// //   //     if (editItem) {
// //   //       await subIndustryService.update(editItem.id, submitData);
// //   //       showSuccess("Sub-industry updated successfully");
// //   //     } else {
// //   //       await subIndustryService.create(submitData);
// //   //       showSuccess("Sub-industry created successfully");
// //   //     }
// //   //     setModalOpen(false);
// //   //     load();
// //   //   } catch (error) {
// //   //     console.error('Submit error:', error);
// //   //     const errorMessage = error?.message || error?.response?.data?.message || "Failed to save";
// //   //     showError(errorMessage);
// //   //   } finally {
// //   //     setFormLoading(false);
// //   //   }
// //   // };

// //   const handleSubmit = async (formData) => {
// //     setFormLoading(true);

// //     try {
// //       // Validate industry
// //       if (!formData.industry_id || formData.industry_id === '') {
// //         showError('Please select a parent industry');
// //         setFormLoading(false);
// //         return;
// //       }

// //       // Validate sort order
// //       const sortOrder =
// //         formData.sort_order === "" ||
// //           formData.sort_order === null ||
// //           formData.sort_order === undefined
// //           ? 0
// //           : Number(formData.sort_order);

// //       if (sortOrder < 0) {
// //         showError("Sort order cannot be negative");
// //         setFormLoading(false);
// //         return;
// //       }

// //       const submitData = {
// //         name: formData.name,
// //         industry_id: parseInt(formData.industry_id),
// //         is_status: formData.status === "active",
// //         is_trending: formData.is_trending || false,
// //         sort_order: sortOrder,
// //       };

// //       if (formData.iconFile instanceof File) {
// //         submitData.iconFile = formData.iconFile;
// //       } else if (editItem && editItem.icon) {
// //         submitData.icon = editItem.icon;
// //       }

// //       if (editItem) {
// //         await subIndustryService.update(editItem.id, submitData);
// //         showSuccess("Sub-industry updated successfully");
// //       } else {
// //         await subIndustryService.create(submitData);
// //         showSuccess("Sub-industry created successfully");
// //       }

// //       setModalOpen(false);
// //       load();

// //     } catch (error) {
// //       console.error('Submit error:', error);

// //       const errorMessage =
// //         error?.message ||
// //         error?.response?.data?.message ||
// //         "Failed to save";

// //       showError(errorMessage);

// //     } finally {
// //       setFormLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     setDeleteLoading(true);
// //     try {
// //       await subIndustryService.delete(deleteId);
// //       showSuccess("Sub-industry deleted successfully");
// //       load();
// //     } catch (error) {
// //       console.error('Delete error:', error);
// //       showError(error.message || "Failed to delete");
// //     } finally {
// //       setDeleteId(null);
// //       setDeleteLoading(false);
// //     }
// //   };

// //   // FIXED: Status toggle - works both ways
// //   const handleStatusToggle = async (row) => {
// //     const currentStatus = getStatusValue(row);
// //     const newStatus = !currentStatus;

// //     try {
// //       const updateData = {
// //         name: row.name,
// //         industry_id: row.industry_id,
// //         is_trending: row.is_trending || false,
// //         is_status: newStatus,
// //         status: newStatus, // Add both fields for API compatibility
// //         sort_order: row.sort_order || 0,
// //         icon: row.icon || null,
// //       };

// //       console.log('Toggling status from', currentStatus, 'to', newStatus);
// //       console.log('Update data:', updateData);

// //       await subIndustryService.update(row.id, updateData);
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
// //         industry_id: row.industry_id,
// //         is_trending: newValue,
// //         is_status: row.is_status !== undefined ? row.is_status : row.status,
// //         status: row.is_status !== undefined ? row.is_status : row.status,
// //         sort_order: row.sort_order || 0,
// //         icon: row.icon || null,
// //       };

// //       await subIndustryService.update(row.id, updateData);
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
// //     if (row.status !== undefined) {
// //       return row.status;
// //     }
// //     return true;
// //   };

// //   const handleImageError = (id) => {
// //     setImageErrors((prev) => ({ ...prev, [id]: true }));
// //   };

// //   const renderIconPreview = (value, rowId) => {
// //     if (!value) return <span className="text-gray-400 text-xs">-</span>;

// //     const hasError = imageErrors[rowId];
// //     const fullUrl = getFullImageUrl(value);

// //     if (!hasError && fullUrl) {
// //       return (
// //         <div className="flex items-center gap-2">
// //           <div className="relative group cursor-pointer">
// //             <img
// //               src={fullUrl}
// //               alt="Sub-industry icon"
// //               className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
// //               onError={() => handleImageError(rowId)}
// //             />
// //             <button
// //               onClick={() => window.open(fullUrl, '_blank')}
// //               className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
// //               title="Click to view image"
// //             >
// //               <MdVisibility size={16} />
// //             </button>
// //           </div>
// //         </div>
// //       );
// //     } else {
// //       return (
// //         <div className="w-12 h-12 rounded-lg bg-blue-50 border border-[#4529f7] flex items-center justify-center text-[#2c0eee]">
// //           <MdInsertPhoto size={20} />
// //         </div>
// //       );
// //     }
// //   };

// //   // Get display name for created by
// //   const getCreatedByName = (row) => {
// //     if (!row) return "-";
// //     if (row.created_by) {
// //       return getUserNameCached(row.created_by);
// //     }
// //     return "-";
// //   };

// //   // Get display name for updated by
// //   const getUpdatedByName = (row) => {
// //     if (!row) return "-";
// //     if (row.updated_by) {
// //       return getUserNameCached(row.updated_by);
// //     }
// //     return "-";
// //   };

// //   const columns = [
// //     {
// //       header: "#",
// //       key: "id",
// //       render: (_, __, i) => (page - 1) * limit + i + 1
// //     },
// //     {
// //       header: "Icon",
// //       key: "icon",
// //       render: (value, row) => renderIconPreview(value, row.id),
// //     },
// //     {
// //       header: "Sub-Industry Name",
// //       key: "name",
// //       render: (v) => (
// //         <span className="font-medium capitalize text-gray-800">{v}</span>
// //       ),
// //     },
// //     {
// //       header: "Parent Industry",
// //       key: "parent_industry_name",
// //       render: (v) => (
// //         <span className="text-gray-600">{v || "-"}</span>
// //       ),
// //     },
// //     {
// //       header: "Sort Order",
// //       key: "sort_order",
// //       render: (v) => (
// //         <span className="text-gray-500 text-sm">{v || 0}</span>
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
// //     // {
// //     //   header: "Created By",
// //     //   key: "created_by",
// //     //   render: (_, row) => (
// //     //     <span className="text-gray-500 text-sm font-medium">
// //     //       {getCreatedByName(row)}
// //     //     </span>
// //     //   ),
// //     // },
// //     {
// //       header: "Updated By",
// //       key: "updated_by",
// //       render: (_, row) => (
// //         <span className="text-gray-500 text-sm font-medium">
// //           {getUpdatedByName(row)}
// //         </span>
// //       ),
// //     },
// //     // {
// //     //   header: "Created At",
// //     //   key: "createdAt",
// //     //   render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
// //     // },
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
// //             onClick={() => setDeleteId(id)}
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
// //           <h1 className="text-2xl font-bold text-gray-900">Sub-Industries</h1>
// //           <p className="text-sm text-gray-500 mt-1">Manage sub-industry categories</p>
// //         </div>
// //         <Button icon={MdAdd} onClick={openAdd}>
// //           Add Sub-Industry
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
// //               placeholder="Search sub-industries..."
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
// //           emptyMessage="No sub-industries found"
// //         />

// //         {/* Footer */}
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
// //           <p className="text-xs text-gray-400">
// //             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
// //             {"–"}
// //             {Math.min(page * limit, filteredData.length)} of {filteredData.length} sub-industries
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

// //       {/* Form Modal - Passing editItem for image preview */}
// //       <FormModal
// //         isOpen={modalOpen}
// //         onClose={() => setModalOpen(false)}
// //         onSubmit={handleSubmit}
// //         title={editItem ? "Edit Sub-Industry" : "Add Sub-Industry"}
// //         fields={getFormFields(editItem)}
// //         initialData={editItem ? {
// //           name: editItem.name || "",
// //           industry_id: editItem.industry_id || (editItem.Industry?.id) || "",
// //           icon: editItem.icon || null,
// //           sort_order: editItem.sort_order || 0,
// //           status: editItem.is_status !== undefined ? (editItem.is_status ? "active" : "inactive") : "active",
// //           is_trending: editItem.is_trending || false
// //         } : {
// //           name: "",
// //           industry_id: "",
// //           icon: null,
// //           sort_order: 0,
// //           status: "active",
// //           is_trending: false
// //         }}
// //         validationRules={validationRules}
// //         loading={formLoading}
// //         submitLabel={editItem ? "Update" : "Create"}
// //         size="lg"
// //         existingImage={editItem?.icon ? getFullImageUrl(editItem.icon) : null}
// //       />

// //       {/* View Modal */}
// //       <ViewModal
// //         isOpen={viewModalOpen}
// //         onClose={() => {
// //           setViewModalOpen(false);
// //           setViewData(null);
// //         }}
// //         title="Sub-Industry Details"
// //       >
// //         {viewData && (
// //           <div className="space-y-1">
// //             <ViewRow label="Sub-Industry Name" value={viewData.name} />
// //             <ViewRow label="Parent Industry" value={viewData.parent_industry_name || "-"} />
// //             <ViewRow label="Sort Order" value={viewData.sort_order || 0} />
// //             {viewData.icon && (
// //               <ViewRow
// //                 label="Icon"
// //                 value={
// //                   <img
// //                     src={getFullImageUrl(viewData.icon)}
// //                     alt="Sub-industry icon"
// //                     className="w-16 h-16 rounded-lg object-cover border border-gray-200"
// //                     onError={(e) => {
// //                       e.target.style.display = 'none';
// //                     }}
// //                   />
// //                 }
// //               />
// //             )}
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
// //           </div>
// //         )}
// //       </ViewModal>

// //       <ConfirmDialog
// //         isOpen={!!deleteId}
// //         onClose={() => setDeleteId(null)}
// //         onConfirm={handleDelete}
// //         loading={deleteLoading}
// //         title="Delete Sub-Industry"
// //         message="Delete this sub-industry? This action cannot be undone."
// //       />
// //     </div>
// //   );
// // };

// // export default SubIndustry;


// import React, { useState, useEffect, useCallback } from "react";
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
// import ViewModal, { ViewRow, ViewBadge, ViewTrendingBadge } from "../../components/common/ViewModal";
// import { subIndustryService } from "../../services/subIndustry.service";
// import { industryService } from "../../services/industry.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const SubIndustry = () => {
//   const [data, setData] = useState([]);
//   const [parentIndustries, setParentIndustries] = useState([]);
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
//   const [userNameCache, setUserNameCache] = useState({});
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };
//   const normalizeSubIndustry = (item) => ({
//     id: item.id || item._id,
//     name: item.name || "",
//     slug: item.slug || "",
//     icon: item.icon || null,
//     industry_id: item.industry_id || "",
//     Industry: item.Industry || null,
//     parent_industry_name: item.Industry?.name || "",
//     is_status: item.is_status !== undefined ? item.is_status : true,
//     is_trending: item.is_trending || false,
//     status: item.status !== undefined ? item.status : true,
//     sort_order: item.sort_order || 0,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     createdAt: item.created_at || item.createdAt || null,
//     updatedAt: item.updated_at || item.updatedAt || null,
//     raw: item,
//   });

//   // Fetch parent industries
//   const fetchParentIndustries = async () => {
//     try {
//       const r = await industryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const industries = Array.isArray(rawData) ? rawData : [];
//       setParentIndustries(industries);
//     } catch (error) {
//       console.error("Failed to fetch parent industries:", error);
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

//       const r = await subIndustryService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const subIndustries = Array.isArray(rawData) ? rawData.map(normalizeSubIndustry) : [];
//       // Sort by created_at descending (newest first)
//       const sortedSubIndustries = subIndustries.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setData(sortedSubIndustries);
//     } catch (error) {
//       console.error('Load error:', error);
//       showError(error.message || "Failed to load sub-industries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     fetchParentIndustries();
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
//         String(item.parent_industry_name ?? "").toLowerCase().includes(query)
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
//   const inactiveCount = data.length - activeCount;

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

//   // Form fields configuration
//   const getFormFields = (editData = null) => {
//     const industryOptions = parentIndustries.map(ind => ({
//       value: ind.id || ind._id,
//       label: ind.name || ""
//     }));

//     return [
//       {
//         name: "name",
//         label: "Sub-Industry Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Web Development",
//         help: "Enter a unique name for the sub-industry"
//       },
//       {
//         name: "industry_id",
//         label: "Parent Industry",
//         type: "select",
//         required: true,
//         options: industryOptions,
//         placeholder: "Select parent industry",
//         help: "Select the parent industry"
//       },
//       {
//         name: "icon",
//         label: "Sub-Industry Icon",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload an icon for the sub-industry (PNG, JPG, SVG) - Max 5MB",
//         placeholder: "Click or drag to upload icon",
//         existingImage: editData?.icon ? getFullImageUrl(editData.icon) : null
//       },
//       {
//         name: "sort_order",
//         label: "Sort Order",
//         type: "number",
//         required: false,
//         min: 0,
//         help: "Optional sort order for display"
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
//         help: "Trending sub-industries will be highlighted in the listing",
//       },
//     ];
//   };

//   // Validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       requiredMessage: 'Sub-industry name is required',
//       minLength: 2,
//       minLengthMessage: 'Sub-industry name must be at least 2 characters',
//       maxLength: 50,
//       maxLengthMessage: 'Sub-industry name must be at most 50 characters',
//       custom: (value) => {
//         const exists = data.some(item =>
//           item.name.toLowerCase() === value.toLowerCase() &&
//           (!editItem || item.id !== editItem.id)
//         );
//         if (exists) {
//           return 'This sub-industry name already exists';
//         }
//         return null;
//       }
//     },
//     industry_id: {
//       required: true,
//       requiredMessage: 'Please select a parent industry'
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
//       // Validate industry
//       if (!formData.industry_id || formData.industry_id === '') {
//         showError('Please select a parent industry');
//         setFormLoading(false);
//         return;
//       }

//       // Validate sort order
//       const sortOrder =
//         formData.sort_order === "" ||
//           formData.sort_order === null ||
//           formData.sort_order === undefined
//           ? 0
//           : Number(formData.sort_order);

//       if (sortOrder < 0) {
//         showError("Sort order cannot be negative");
//         setFormLoading(false);
//         return;
//       }

//       const submitData = {
//         name: formData.name,
//         industry_id: parseInt(formData.industry_id),
//         is_status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//         sort_order: sortOrder,
//       };

//       if (formData.iconFile instanceof File) {
//         submitData.iconFile = formData.iconFile;
//       } else if (editItem && editItem.icon) {
//         submitData.icon = editItem.icon;
//       }

//       if (editItem) {
//         await subIndustryService.update(editItem.id, submitData);
//         showSuccess("Sub-industry updated successfully");
//       } else {
//         await subIndustryService.create(submitData);
//         showSuccess("Sub-industry created successfully");
//       }

//       setModalOpen(false);
//       load();

//     } catch (error) {
//       console.error('Submit error:', error);

//       const errorMessage =
//         error?.message ||
//         error?.response?.data?.message ||
//         "Failed to save";

//       showError(errorMessage);

//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await subIndustryService.delete(deleteId);
//       showSuccess("Sub-industry deleted successfully");
//       load();
//     } catch (error) {
//       console.error('Delete error:', error);
//       showError(error.message || "Failed to delete");
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   // FIXED: Status toggle - works both ways
//   const handleStatusToggle = async (row) => {
//     const currentStatus = getStatusValue(row);
//     const newStatus = !currentStatus;

//     try {
//       const updateData = {
//         name: row.name,
//         industry_id: row.industry_id,
//         is_trending: row.is_trending || false,
//         is_status: newStatus,
//         status: newStatus, // Add both fields for API compatibility
//         sort_order: row.sort_order || 0,
//         icon: row.icon || null,
//       };

//       console.log('Toggling status from', currentStatus, 'to', newStatus);
//       console.log('Update data:', updateData);

//       await subIndustryService.update(row.id, updateData);
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
//         industry_id: row.industry_id,
//         is_trending: newValue,
//         is_status: row.is_status !== undefined ? row.is_status : row.status,
//         status: row.is_status !== undefined ? row.is_status : row.status,
//         sort_order: row.sort_order || 0,
//         icon: row.icon || null,
//       };

//       await subIndustryService.update(row.id, updateData);
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
//               alt="Sub-industry icon"
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
//       header: "Sub-Industry Name",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-gray-800">{v}</span>
//       ),
//     },
//     {
//       header: "Parent Industry",
//       key: "parent_industry_name",
//       render: (v) => (
//         <span className="text-gray-600">{v || "-"}</span>
//       ),
//     },
//     {
//       header: "Sort Order",
//       key: "sort_order",
//       render: (v) => (
//         <span className="text-gray-500 text-sm">{v || 0}</span>
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
//     // {
//     //   header: "Created At",
//     //   key: "createdAt",
//     //   render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
//     // },
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
//           <h1 className="text-2xl font-bold text-gray-900">Sub-Industries</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage sub-industry categories</p>
//         </div>
//         <Button icon={MdAdd} onClick={openAdd}>
//           Add Sub-Industry
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
//               placeholder="Search sub-industries..."
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
//           emptyMessage="No sub-industries found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of {filteredData.length} sub-industries
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

//       {/* Form Modal - Passing editItem for image preview */}
//       <FormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         title={editItem ? "Edit Sub-Industry" : "Add Sub-Industry"}
//         fields={getFormFields(editItem)}
//         initialData={editItem ? {
//           name: editItem.name || "",
//           industry_id: editItem.industry_id || (editItem.Industry?.id) || "",
//           icon: editItem.icon || null,
//           sort_order: editItem.sort_order || 0,
//           status: editItem.is_status !== undefined ? (editItem.is_status ? "active" : "inactive") : "active",
//           is_trending: editItem.is_trending || false
//         } : {
//           name: "",
//           industry_id: "",
//           icon: null,
//           sort_order: 0,
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
//         title="Sub-Industry Details"
//       >
//         {viewData && (
//           <div className="space-y-1">
//             <ViewRow label="Sub-Industry Name" value={viewData.name} />
//             <ViewRow label="Parent Industry" value={viewData.parent_industry_name || "-"} />
//             <ViewRow label="Sort Order" value={viewData.sort_order || 0} />
//             {viewData.icon && (
//               <ViewRow
//                 label="Icon"
//                 value={
//                   <img
//                     src={getFullImageUrl(viewData.icon)}
//                     alt="Sub-industry icon"
//                     className="w-16 h-16 rounded-lg object-cover border border-gray-200"
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
//         title="Delete Sub-Industry"
//         message="Delete this sub-industry? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default SubIndustry;


// pages/SubIndustry.jsx
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
import { subIndustryService } from "../../services/subIndustry.service";
import { industryService } from "../../services/industry.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const SubIndustry = () => {
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
  const [userNameCache, setUserNameCache] = useState({});
  const { user } = useAuth();
  const userId = user?.id;
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  const normalizeSubIndustry = (item) => ({
    id: item.id || item._id,
    name: item.name || "",
    slug: item.slug || "",
    icon: item.icon || null,
    // industry_id: item.Industry.id || "",
    // Industry: item.Industry || null,
    // parent_industry_name: item.Industry?.name || "",
    // ✅ Correct industry ID from API
    industry_id:
      item.industry_id ??
      item.Industry?.id ??
      "",

    // ✅ Correct parent industry
    Industry: item.Industry || null,

    parent_industry_name:
      item.Industry?.name ||
      item.industry_name ||
      "",

    is_status: item.is_status !== undefined ? item.is_status : true,
    is_trending: item.is_trending || false,
    status: item.status !== undefined ? item.status : true,
    sort_order: item.sort_order || 0,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    createdAt: item.created_at || item.createdAt || null,
    updatedAt: item.updated_at || item.updatedAt || null,
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

      const r = await subIndustryService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const subIndustries = Array.isArray(rawData) ? rawData.map(normalizeSubIndustry) : [];
      const sortedSubIndustries = subIndustries.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedSubIndustries);
    } catch (error) {
      console.error('Load error:', error);
      showError(error.message || "Failed to load sub-industries");
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
        String(item.parent_industry_name ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.is_status === true || r.status === true || r.status === "active").length;
  const inactiveCount = data.length - activeCount;

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

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subIndustryService.delete(deleteId);
      showSuccess("Sub-industry deleted successfully");
      load();
    } catch (error) {
      console.error('Delete error:', error);
      showError(error.message || "Failed to delete");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // const handleStatusToggle = async (row) => {
  //   const currentStatus = getStatusValue(row);
  //   const newStatus = !currentStatus;

  //   try {
  //     const updateData = {
  //       name: row.name,
  //       industry_id: row.industry_id,
  //       is_trending: row.is_trending || false,
  //       is_status: newStatus,
  //       status: newStatus,
  //       sort_order: row.sort_order || 0,
  //       icon: row.icon || null,
  //     };

  //     await subIndustryService.update(row.id, updateData);
  //     showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
  //     load();
  //   } catch (error) {
  //     console.error('Status toggle error:', error);
  //     showError(error.response?.data?.message || error.message || "Failed to update status");
  //   }
  // };

  const handleStatusToggle = async (row) => {
    const currentStatus = getStatusValue(row);
    const newStatus = !currentStatus;

    const industryId = Number(row.industry_id);

    console.log("STATUS TOGGLE ROW:", row);
    console.log("INDUSTRY ID:", industryId);

    if (!industryId || Number.isNaN(industryId)) {
      showError("Parent industry is missing");
      return;
    }

    try {
      const updateData = {
        name: row.name,
        industry_id: industryId,
        is_status: newStatus,
        is_trending: row.is_trending === true,
        sort_order: Number(row.sort_order) || 0,
      };

      console.log("STATUS UPDATE PAYLOAD:", updateData);

      await subIndustryService.update(row.id, updateData);

      showSuccess(
        `Status ${newStatus ? "activated" : "deactivated"} successfully`
      );

      await load();
    } catch (error) {
      console.error("Status toggle error:", error);
      console.error("API ERROR:", error?.response?.data);

      showError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update status"
      );
    }
  };

  // const handleTrendingToggle = async (row) => {
  //   const newValue = !row.is_trending;

  //   try {
  //     const updateData = {
  //       name: row.name,
  //       industry_id: row.industry_id,
  //       is_trending: newValue,
  //       is_status: row.is_status !== undefined ? row.is_status : row.status,
  //       status: row.is_status !== undefined ? row.is_status : row.status,
  //       sort_order: row.sort_order || 0,
  //       icon: row.icon || null,
  //     };

  //     await subIndustryService.update(row.id, updateData);
  //     showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
  //     load();
  //   } catch (error) {
  //     console.error('Trending toggle error:', error);
  //     showError(error.response?.data?.message || error.message || "Failed to update trending");
  //   }
  // };

  const handleTrendingToggle = async (row) => {
    const newTrending = !row.is_trending;

    const industryId = Number(row.industry_id);

    console.log("TRENDING TOGGLE ROW:", row);
    console.log("INDUSTRY ID:", industryId);

    if (!industryId || Number.isNaN(industryId)) {
      showError("Parent industry is missing");
      return;
    }

    try {
      const updateData = {
        name: row.name,
        industry_id: industryId,
        is_status: getStatusValue(row),
        is_trending: newTrending,
        sort_order: Number(row.sort_order) || 0,
      };

      console.log("TRENDING UPDATE PAYLOAD:", updateData);

      await subIndustryService.update(row.id, updateData);

      showSuccess(
        `Trending ${newTrending ? "enabled" : "disabled"} successfully`
      );

      await load();
    } catch (error) {
      console.error("Trending toggle error:", error);
      console.error("API ERROR:", error?.response?.data);

      showError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update trending"
      );
    }
  };

  const getBooleanValue = (value) => {
    return (
      value === true ||
      value === 1 ||
      value === "1" ||
      value === "true" ||
      value === "active"
    );
  };

  const getStatusValue = (row) => {
    if (row?.is_status !== undefined && row?.is_status !== null) {
      return getBooleanValue(row.is_status);
    }

    return getBooleanValue(row?.status);
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
              alt="Sub-industry icon"
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

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by) {
      return getUserNameCached(row.updated_by);
    }
    return "-";
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
      header: "Sub-Industry Name",
      key: "name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    {
      header: "Parent Industry",
      key: "parent_industry_name",
      render: (v) => (
        <span className="text-gray-600">{v || "-"}</span>
      ),
    },
    {
      header: "Sort Order",
      key: "sort_order",
      render: (v) => (
        <span className="text-gray-500 text-sm">{v || 0}</span>
      ),
    },
    // {
    //   header: "Trending",
    //   key: "is_trending",
    //   render: (value, row) => (
    //     <button
    //       onClick={() => handleTrendingToggle(row)}
    //       className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"
    //         }`}
    //     >
    //       <span
    //         className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"
    //           }`}
    //       />
    //     </button>
    //   ),
    // },
    // {
    //   header: "Status",
    //   key: "status",
    //   render: (status, row) => {
    //     const isActive = getStatusValue(row);
    //     return (
    //       <button
    //         onClick={() => handleStatusToggle(row)}
    //         className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"
    //           }`}
    //       >
    //         <span
    //           className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"
    //             }`}
    //         />
    //       </button>
    //     );
    //   },
    // },
    {
      header: "Trending",
      key: "is_trending",
      render: (value, row) => {
        const isTrending = getBooleanValue(row?.is_trending);

        return (
          <button
            onClick={() => handleTrendingToggle(row)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isTrending ? "bg-yellow-500" : "bg-gray-300"
              }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isTrending ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
        );
      },
    },
    {
      header: "Status",
      key: "is_status",
      render: (_, row) => {
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
            onClick={() => navigate(`/subindustries/view/${id}`, { state: { item: row } })}
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => navigate(`/subindustries/edit/${id}`, { state: { item: row } })}
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
          <h1 className="text-2xl font-bold text-gray-900">Sub-Industries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage sub-industry categories</p>
        </div>
        <Button icon={MdAdd} onClick={() => navigate('/subindustries/add')}>
          Add Sub-Industry
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
              placeholder="Search sub-industries..."
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
          emptyMessage="No sub-industries found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} sub-industries
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
        title="Delete Sub-Industry"
        message="Delete this sub-industry? This action cannot be undone."
      />
    </div>
  );
};

export default SubIndustry;