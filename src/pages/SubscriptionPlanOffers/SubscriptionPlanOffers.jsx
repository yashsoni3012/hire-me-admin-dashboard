// import React, { useState, useEffect } from "react";
// import {
//     MdAdd,
//     MdEdit,
//     MdDelete,
//     MdSearch,
//     MdVisibility,
//     MdLocalOffer,
//     MdPercent,
//     MdAttachMoney,
//     MdCalendarToday,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import FormModal from "../../components/common/FormModal";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow, ViewBadge } from "../../components/common/ViewModal";
// import { subscriptionPlanOfferService } from "../../services/subscriptionPlanOffer.service";
// import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
// import { showSuccess, showError, showInfo } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const SubscriptionPlanOffers = () => {
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
//     const [userNameCache, setUserNameCache] = useState({});

//     const getUserNameCached = (userId) => {
//         if (!userId) return "-";
//         return userNameCache[userId] || `User ${userId}`;
//     };

//     // Reference data
//     const [subscriptionPlans, setSubscriptionPlans] = useState([]);
//     const [loadingPlans, setLoadingPlans] = useState(false);

//     const normalizeOffer = (item) => ({
//         id: item.id || item._id,
//         subscription_plan_id: item.subscription_plan_id || "",
//         offer_name: item.offer_name || "",
//         offer_type: item.offer_type || "",
//         offer_value: parseFloat(item.offer_value) || 0,
//         start_date: item.start_date || null,
//         end_date: item.end_date || null,
//         coupon_required: item.coupon_required === 1 || item.coupon_required === true,
//         status: item.status === 1 || item.status === true,
//         is_status: item.status === 1 || item.status === true,
//         created_by: item.created_by || null,
//         updated_by: item.updated_by || null,
//         createdAt: item.created_at || item.createdAt || null,
//         updatedAt: item.updated_at || item.updatedAt || null,
//         // Relations
//         SubscriptionPlan: item.SubscriptionPlan || null,
//         plan_name: item.SubscriptionPlan?.plan_name || "",
//         plan_code: item.SubscriptionPlan?.plan_code || "",
//         plan_price: item.SubscriptionPlan?.price || 0,
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

//     // Fetch subscription plans
//     const fetchSubscriptionPlans = async () => {
//         setLoadingPlans(true);
//         try {
//             const r = await subscriptionPlanService.getAll({ limit: 1000 });
//             const rawData = r.data?.data || r.data?.results || r.data || [];
//             const plans = Array.isArray(rawData) ? rawData : [];
//             setSubscriptionPlans(plans);
//         } catch (error) {
//             console.error("Failed to fetch subscription plans:", error);
//             showError("Failed to load subscription plans");
//         } finally {
//             setLoadingPlans(false);
//         }
//     };

//     const load = async () => {
//         setLoading(true);
//         try {
//             const users = await fetchUsers();
//             const userMap = {};
//             Object.keys(users).forEach(id => {
//                 userMap[id] = users[id].name;
//             });
//             setUserNameCache(userMap);
//             const r = await subscriptionPlanOfferService.getAll({ limit: 1000 });
//             const rawData = r.data?.data || r.data?.results || r.data || [];
//             const offers = Array.isArray(rawData) ? rawData.map(normalizeOffer) : [];
//             const sortedOffers = offers.sort((a, b) => {
//                 return new Date(b.createdAt) - new Date(a.createdAt);
//             });
//             setData(sortedOffers);
//         } catch (error) {
//             console.error('Load error:', error);
//             showError(error.message || "Failed to load subscription plan offers");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         load();
//         fetchSubscriptionPlans();
//     }, []);

//     useEffect(() => {
//         setPage(1);
//     }, [search, statusFilter]);

//     const filteredData = React.useMemo(() => {
//         let result = data;
//         if (statusFilter !== "all") {
//             const isActive = statusFilter === "active";
//             result = result.filter((item) => {
//                 const itemStatus = getStatusValue(item);
//                 return itemStatus === isActive;
//             });
//         }
//         const query = search.toLowerCase().trim();
//         if (query) {
//             result = result.filter((item) =>
//                 String(item.offer_name ?? "").toLowerCase().includes(query) ||
//                 String(item.plan_name ?? "").toLowerCase().includes(query) ||
//                 String(item.offer_type ?? "").toLowerCase().includes(query) ||
//                 String(item.offer_value ?? "").toString().includes(query)
//             );
//         }
//         return result;
//     }, [data, search, statusFilter]);

//     const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//     const activeCount = data.filter((r) => getStatusValue(r)).length;
//     const inactiveCount = data.length - activeCount;

//     const getFormFields = (editData = null) => {
//         const planOptions = subscriptionPlans.map(p => ({
//             value: p.id || p._id,
//             label: `${p.plan_name} (₹${parseFloat(p.price || 0).toFixed(2)})`
//         }));

//         const offerTypeOptions = [
//             { value: 'percentage', label: 'Percentage (%)' },
//             { value: 'fixed', label: 'Fixed Amount (₹)' },
//             { value: 'free_trial', label: 'Free Trial' },
//         ];

//         return [
//             {
//                 name: "subscription_plan_id",
//                 label: "Subscription Plan",
//                 type: "select",
//                 required: true,
//                 options: planOptions,
//                 placeholder: loadingPlans ? "Loading plans..." : "Select plan",
//                 help: "Select the subscription plan this offer applies to",
//                 disabled: loadingPlans
//             },
//             {
//                 name: "offer_name",
//                 label: "Offer Name",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. Summer Sale 2024",
//                 help: "Enter a descriptive name for the offer"
//             },
//             {
//                 name: "offer_type",
//                 label: "Offer Type",
//                 type: "select",
//                 required: true,
//                 options: offerTypeOptions,
//                 placeholder: "Select offer type",
//                 help: "Select the type of discount"
//             },
//             {
//                 name: "offer_value",
//                 label: "Offer Value",
//                 type: "number",
//                 required: true,
//                 min: 0,
//                 step: "0.01",
//                 help: "Enter the discount value (percentage or fixed amount)"
//             },
//             {
//                 name: "start_date",
//                 label: "Start Date",
//                 type: "date",
//                 required: true,
//                 help: "When the offer starts"
//             },
//             {
//                 name: "end_date",
//                 label: "End Date",
//                 type: "date",
//                 required: true,
//                 help: "When the offer ends"
//             },
//             {
//                 name: "coupon_required",
//                 label: "Coupon Required",
//                 type: "checkbox",
//                 color: "text-[#2c0eee] focus:ring-[#4529f7]",
//                 help: "Check if a coupon code is required to apply this offer"
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
//         ];
//     };

//     const validationRules = {
//         subscription_plan_id: {
//             required: true,
//             requiredMessage: 'Please select a subscription plan'
//         },
//         offer_name: {
//             required: true,
//             requiredMessage: 'Offer name is required',
//             minLength: 3,
//             minLengthMessage: 'Offer name must be at least 3 characters',
//             maxLength: 100,
//             maxLengthMessage: 'Offer name must be at most 100 characters'
//         },
//         offer_type: {
//             required: true,
//             requiredMessage: 'Please select an offer type'
//         },
//         offer_value: {
//             required: true,
//             requiredMessage: 'Offer value is required',
//             min: 0.01,
//             minMessage: 'Offer value must be greater than 0'
//         },
//         start_date: {
//             required: true,
//             requiredMessage: 'Start date is required',
//             custom: (value) => {
//                 if (value) {
//                     const today = new Date();
//                     today.setHours(0, 0, 0, 0);
//                     const startDate = new Date(value);
//                     if (startDate < today) {
//                         return 'Start date cannot be in the past';
//                     }
//                 }
//                 return null;
//             }
//         },
//         end_date: {
//             required: true,
//             requiredMessage: 'End date is required',
//             custom: (value, formData) => {
//                 if (value && formData.start_date) {
//                     const startDate = new Date(formData.start_date);
//                     const endDate = new Date(value);
//                     if (endDate < startDate) {
//                         return 'End date must be after start date';
//                     }
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
//                 subscription_plan_id: parseInt(formData.subscription_plan_id),
//                 offer_name: formData.offer_name,
//                 offer_type: formData.offer_type,
//                 offer_value: parseFloat(formData.offer_value) || 0,
//                 start_date: formData.start_date,
//                 end_date: formData.end_date,
//                 coupon_required: formData.coupon_required || false,
//                 status: formData.status === "active" ? 1 : 0
//             };

//             if (editItem) {
//                 await subscriptionPlanOfferService.update(editItem.id, submitData);
//                 showSuccess("Offer updated successfully");
//             } else {
//                 await subscriptionPlanOfferService.create(submitData);
//                 showSuccess("Offer created successfully");
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

//     const handleDelete = async () => {
//         setDeleteLoading(true);
//         try {
//             await subscriptionPlanOfferService.delete(deleteId);
//             showSuccess("Offer deleted successfully");
//             load();
//         } catch (error) {
//             console.error('Delete error:', error);
//             const message = error?.response?.data?.message || error?.message || "";
//             if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//                 showError("Cannot delete this offer because it is being used in other records.");
//             } else {
//                 showError(message || "Failed to delete offer");
//             }
//         } finally {
//             setDeleteId(null);
//             setDeleteLoading(false);
//         }
//     };

//     const handleStatusToggle = async (row) => {
//         const currentStatus = getStatusValue(row);
//         const newStatus = !currentStatus;

//         try {
//             await subscriptionPlanOfferService.update(row.id, {
//                 status: newStatus ? 1 : 0
//             });
//             showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//             load();
//         } catch (error) {
//             console.error('Status toggle error:', error);
//             showError(error.response?.data?.message || error.message || "Failed to update status");
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

//     const isOfferActive = (row) => {
//         if (!row.start_date || !row.end_date) return false;
//         const now = new Date();
//         const start = new Date(row.start_date);
//         const end = new Date(row.end_date);
//         return now >= start && now <= end;
//     };

//     const getOfferTypeIcon = (type) => {
//         switch (type) {
//             case 'percentage':
//                 return <MdPercent className="text-[#4529f7]" />;
//             case 'fixed':
//                 return <MdAttachMoney className="text-green-500" />;
//             case 'free_trial':
//                 return <MdCalendarToday className="text-orange-500" />;
//             default:
//                 return <MdLocalOffer className="text-gray-500" />;
//         }
//     };

//     const columns = [
//         {
//             header: "#",
//             key: "id",
//             render: (_, __, i) => (page - 1) * limit + i + 1
//         },
//         {
//             header: "Offer Name",
//             key: "offer_name",
//             render: (v) => (
//                 <span className="font-medium text-gray-800">{v}</span>
//             ),
//         },
//         {
//             header: "Plan",
//             key: "plan_name",
//             render: (v, row) => (
//                 <div>
//                     <span className="text-gray-700">{v || "-"}</span>
//                     {row.plan_price > 0 && (
//                         <span className="text-xs text-gray-400 ml-1">
//                             (₹{parseFloat(row.plan_price).toFixed(2)})
//                         </span>
//                     )}
//                 </div>
//             ),
//         },
//         {
//             header: "Type",
//             key: "offer_type",
//             render: (v, row) => (
//                 <span className="inline-flex items-center gap-1.5 capitalize text-gray-600">
//                     {getOfferTypeIcon(v)}
//                     {v || "-"}
//                 </span>
//             ),
//         },
//         {
//             header: "Value",
//             key: "offer_value",
//             render: (v, row) => (
//                 <span className="font-semibold text-[#2c0eee]">
//                     {row.offer_type === 'percentage' ? `${v}%` : `₹${v?.toFixed(2)}`}
//                 </span>
//             ),
//         },
//         {
//             header: "Period",
//             key: "start_date",
//             render: (_, row) => (
//                 <div className="text-sm">
//                     <span className="text-gray-500">{formatDate(row.start_date)}</span>
//                     <span className="text-gray-300 mx-1">→</span>
//                     <span className="text-gray-500">{formatDate(row.end_date)}</span>
//                 </div>
//             ),
//         },
//         {
//             header: "Status",
//             key: "status",
//             render: (status, row) => {
//                 const isActive = getStatusValue(row);
//                 const isCurrentlyActive = isOfferActive(row);
//                 return (
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => handleStatusToggle(row)}
//                             className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"}`}
//                         >
//                             <span
//                                 className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"}`}
//                             />
//                         </button>
//                         {isCurrentlyActive && (
//                             <span className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
//                                 Live
//                             </span>
//                         )}
//                     </div>
//                 );
//             },
//         },
//         {
//             header: "Created By",
//             key: "created_by",
//             render: (_, row) => (
//                 <span className="text-gray-500 text-sm font-medium">
//                     {getCreatedByName(row)}
//                 </span>
//             ),
//         },
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
//             header: "Created At",
//             key: "createdAt",
//             render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
//         },
//         {
//             header: "Actions",
//             key: "id",
//             render: (id, row) => (
//                 <div className="flex gap-1">
//                     <button
//                         onClick={() => openView(row)}
//                         className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
//                         title="View"
//                     >
//                         <MdVisibility size={16} />
//                     </button>
//                     <button
//                         onClick={() => openEdit(row)}
//                         className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
//                         title="Edit"
//                     >
//                         <MdEdit size={16} />
//                     </button>
//                     <button
//                         onClick={() => setDeleteId(id)}
//                         className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
//                         title="Delete"
//                     >
//                         <MdDelete size={16} />
//                     </button>
//                 </div>
//             ),
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
//                     <h1 className="text-2xl font-bold text-gray-900">Subscription Plan Offers</h1>
//                     <p className="text-sm text-gray-500 mt-1">Manage offers and discounts for subscription plans</p>
//                 </div>
//                 <Button icon={MdAdd} onClick={openAdd}>
//                     Add Offer
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
//                             placeholder="Search offers..."
//                             className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//                         />
//                     </div>

//                     <div className="flex items-center gap-5 text-sm">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab.key}
//                                 onClick={() => setStatusFilter(tab.key)}
//                                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"}`}
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
//                     emptyMessage="No subscription plan offers found"
//                 />

//                 {/* Footer */}
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//                     <p className="text-xs text-gray-400">
//                         Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//                         {"–"}
//                         {Math.min(page * limit, filteredData.length)} of {filteredData.length} offers
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
//                 title={editItem ? "Edit Offer" : "Add Offer"}
//                 fields={getFormFields(editItem)}
//                 initialData={editItem ? {
//                     subscription_plan_id: editItem.subscription_plan_id || "",
//                     offer_name: editItem.offer_name || "",
//                     offer_type: editItem.offer_type || "",
//                     offer_value: editItem.offer_value || 0,
//                     start_date: editItem.start_date ? new Date(editItem.start_date).toISOString().split('T')[0] : "",
//                     end_date: editItem.end_date ? new Date(editItem.end_date).toISOString().split('T')[0] : "",
//                     coupon_required: editItem.coupon_required || false,
//                     status: getStatusValue(editItem) ? "active" : "inactive"
//                 } : {
//                     subscription_plan_id: "",
//                     offer_name: "",
//                     offer_type: "",
//                     offer_value: 0,
//                     start_date: "",
//                     end_date: "",
//                     coupon_required: false,
//                     status: "active"
//                 }}
//                 validationRules={validationRules}
//                 loading={formLoading}
//                 submitLabel={editItem ? "Update" : "Create"}
//                 size="lg"
//             />

//             {/* View Modal */}
//             <ViewModal
//                 isOpen={viewModalOpen}
//                 onClose={() => {
//                     setViewModalOpen(false);
//                     setViewData(null);
//                 }}
//                 title="Offer Details"
//             >
//                 {viewData && (
//                     <div className="space-y-1">
//                         <ViewRow label="Offer Name" value={viewData.offer_name} />
//                         <ViewRow
//                             label="Plan"
//                             value={
//                                 <div>
//                                     <span>{viewData.plan_name || "-"}</span>
//                                     {viewData.plan_price > 0 && (
//                                         <span className="text-xs text-gray-400 ml-1">
//                                             (₹{parseFloat(viewData.plan_price).toFixed(2)})
//                                         </span>
//                                     )}
//                                 </div>
//                             }
//                         />
//                         <ViewRow label="Offer Type" value={viewData.offer_type || "-"} />
//                         <ViewRow
//                             label="Offer Value"
//                             value={
//                                 <span className="font-semibold text-[#2c0eee]">
//                                     {viewData.offer_type === 'percentage' ? `${viewData.offer_value}%` : `₹${viewData.offer_value?.toFixed(2)}`}
//                                 </span>
//                             }
//                         />
//                         <ViewRow
//                             label="Valid Period"
//                             value={`${formatDate(viewData.start_date)} → ${formatDate(viewData.end_date)}`}
//                         />
//                         <ViewRow
//                             label="Currently Active"
//                             value={
//                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isOfferActive(viewData) ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
//                                     <span className={`w-1.5 h-1.5 rounded-full ${isOfferActive(viewData) ? "bg-green-500" : "bg-gray-400"}`} />
//                                     {isOfferActive(viewData) ? "Active" : "Expired/Not Started"}
//                                 </span>
//                             }
//                         />
//                         <ViewRow
//                             label="Coupon Required"
//                             value={
//                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.coupon_required ? "bg-blue-50 text-[#2c0eee]" : "bg-gray-50 text-gray-500"}`}>
//                                     {viewData.coupon_required ? "Yes" : "No"}
//                                 </span>
//                             }
//                         />
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
//                         <ViewRow label="Created At" value={formatDate(viewData.createdAt)} />
//                         {viewData.updatedAt && (
//                             <ViewRow label="Updated At" value={formatDate(viewData.updatedAt)} />
//                         )}
//                         <ViewRow label="Created By" value={getCreatedByName(viewData)} />
//                     </div>
//                 )}
//             </ViewModal>

//             <ConfirmDialog
//                 isOpen={!!deleteId}
//                 onClose={() => setDeleteId(null)}
//                 onConfirm={handleDelete}
//                 loading={deleteLoading}
//                 title="Delete Offer"
//                 message="Delete this offer? This action cannot be undone."
//             />
//         </div>
//     );
// };

// export default SubscriptionPlanOffers;

// pages/SubscriptionPlanOffers.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdLocalOffer,
  MdPercent,
  MdAttachMoney,
  MdCalendarToday,
  MdPerson,
  MdUpdate,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { subscriptionPlanOfferService } from "../../services/subscriptionPlanOffer.service";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const SubscriptionPlanOffers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;
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
    if (userId === null || userId === undefined || userId === "") return "-";
    const key = String(userId);
    return userNameCache[key] || userNameCache[userId] || `User ${userId}`;
  };

  const normalizeOffer = (item) => ({
    id: item.id || item._id,
    subscription_plan_id:
      item.subscription_plan_id ?? item.SubscriptionPlan?.id ?? "",
    offer_name: item.offer_name || "",
    offer_type: item.offer_type || "",
    offer_value: parseFloat(item.offer_value) || 0,
    start_date: item.start_date || null,
    end_date: item.end_date || null,
    coupon_required:
      item.coupon_required === 1 || item.coupon_required === true,
    status: item.status === 1 || item.status === true,
    is_status: item.status === 1 || item.status === true,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    // Handle both date formats - from API it comes as string "13/08/2026, 10:46:49 am"
    createdAt: item.created_at || item.createdAt || null,
    updatedAt: item.updated_at || item.updatedAt || null,
    // Store raw dates for display
    created_at_raw: item.created_at || null,
    updated_at_raw: item.updated_at || null,
    SubscriptionPlan: item.SubscriptionPlan || null,
    plan_name: item.SubscriptionPlan?.plan_name || "",
    plan_code: item.SubscriptionPlan?.plan_code || "",
    plan_price: item.SubscriptionPlan?.price || 0,
    raw: item,
  });

  const getStatusValue = (row) => {
    if (row.is_status !== undefined) {
      return row.is_status;
    }
    if (row.status !== undefined) {
      return row.status === 1 || row.status === true;
    }
    return true;
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

      const r = await subscriptionPlanOfferService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const offers = Array.isArray(rawData) ? rawData.map(normalizeOffer) : [];
      const sortedOffers = offers.sort((a, b) => {
        // Handle both date formats for sorting
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
      setData(sortedOffers);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load subscription plan offers");
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
        const itemStatus = getStatusValue(item);
        return itemStatus === isActive;
      });
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (item) =>
          String(item.offer_name ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.plan_name ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.offer_type ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.offer_value ?? "")
            .toString()
            .includes(query),
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => getStatusValue(r)).length;
  const inactiveCount = data.length - activeCount;

  // Get display name for created by
  const getCreatedByName = (row) => {
    if (!row) return "-";
    const userIdValue = row.created_by ?? row.updated_by ?? null;
    return userIdValue !== null &&
      userIdValue !== undefined &&
      userIdValue !== ""
      ? getUserNameCached(userIdValue)
      : "-";
  };

  // Get display name for updated by
  const getUpdatedByName = (row) => {
    if (!row) return "-";
    const userIdValue = row.updated_by ?? row.created_by ?? null;
    return userIdValue !== null &&
      userIdValue !== undefined &&
      userIdValue !== ""
      ? getUserNameCached(userIdValue)
      : "-";
  };

  // Format date for display - handles both date formats
  // const formatDateDisplay = (date) => {
  //     if (!date) return "-";
  //     // If it's already a string like "13/08/2026, 10:46:49 am", return as is
  //     if (typeof date === 'string' && date.includes('/')) {
  //         return date;
  //     }
  //     // Otherwise use the formatDate helper
  //     return formatDate(date);
  // };

  const formatDateDisplay = (date) => {
    if (!date) return "-";

    // API format: "13/08/2026, 10:46:49 am"
    if (typeof date === "string" && date.includes("/")) {
      return date.split(",")[0].trim();
    }

    // For normal date values, show date only
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB");
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionPlanOfferService.delete(deleteId);
      showSuccess("Offer deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this offer because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete offer");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    const currentStatus = getStatusValue(row);
    const newStatus = !currentStatus;

    // Validate required values
    if (!row?.id) {
      showError("Offer ID is missing");
      return;
    }

    if (!row?.subscription_plan_id) {
      showError("Subscription plan ID is missing");
      return;
    }

    if (!userId) {
      showError("User ID is missing. Please login again.");
      return;
    }

    try {
      const payload = {
        subscription_plan_id: Number(row.subscription_plan_id),
        status: newStatus ? 1 : 0,
        updated_by: Number(userId),
      };

      console.log("STATUS TOGGLE PAYLOAD:", payload);

      await subscriptionPlanOfferService.update(row.id, payload);

      showSuccess(
        `Status ${newStatus ? "activated" : "deactivated"} successfully`,
      );

      await load();
    } catch (error) {
      console.error("Status toggle error:", error);

      console.error("STATUS API RESPONSE:", error?.response?.data);

      showError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update status",
      );
    }
  };

  const isOfferActive = (row) => {
    if (!row.start_date || !row.end_date) return false;
    const now = new Date();
    const start = new Date(row.start_date);
    const end = new Date(row.end_date);
    return now >= start && now <= end;
  };

  const getOfferTypeIcon = (type) => {
    switch (type) {
      case "percentage":
        return <MdPercent className="text-[#4529f7]" />;
      case "fixed":
        return <MdAttachMoney className="text-green-500" />;
      case "free_trial":
        return <MdCalendarToday className="text-orange-500" />;
      default:
        return <MdLocalOffer className="text-gray-500" />;
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Offer Name",
      key: "offer_name",
      render: (v) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      header: "Plan",
      key: "plan_name",
      render: (v, row) => (
        <div>
          <span className="text-gray-700">{v || "-"}</span>
          {row.plan_price > 0 && (
            <span className="text-xs text-gray-400 ml-1">
              (₹{parseFloat(row.plan_price).toFixed(2)})
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Type",
      key: "offer_type",
      render: (v, row) => (
        <span className="inline-flex items-center gap-1.5 capitalize text-gray-600">
          {getOfferTypeIcon(v)}
          {v || "-"}
        </span>
      ),
    },
    {
      header: "Value",
      key: "offer_value",
      render: (v, row) => {
        const num = parseFloat(v);
        const formatted = isNaN(num) ? "0.00" : num.toFixed(2);
        return (
          <span className="font-semibold text-[#2c0eee]">
            {row.offer_type === "percentage"
              ? `${formatted}%`
              : `₹${formatted}`}
          </span>
        );
      },
    },
    {
      header: "Period",
      key: "start_date",
      render: (_, row) => (
        <div className="text-sm">
          <span className="text-gray-500">{formatDate(row.start_date)}</span>
          <span className="text-gray-300 mx-1">→</span>
          <span className="text-gray-500">{formatDate(row.end_date)}</span>
        </div>
      ),
    },
    {
      header: "Coupon Required",
      key: "coupon_required",
      render: (v) => (
        <span
          className={`text-sm font-medium ${v ? "text-[#2c0eee]" : "text-gray-400"}`}
        >
          {v ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Live",
      key: "is_live",
      render: (_, row) => {
        const isActive = getStatusValue(row);
        const isCurrentlyActive = isOfferActive(row);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isCurrentlyActive && isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isCurrentlyActive && isActive ? "bg-green-500" : "bg-gray-400"}`}
            />
            {isCurrentlyActive && isActive ? "Live" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      render: (status, row) => {
        const isActive = getStatusValue(row);
        return (
          <button
            onClick={() => handleStatusToggle(row)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"}`}
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
          {/* <MdUpdate size={14} className="text-gray-400" /> */}
          <span className="text-gray-600 text-sm font-medium">
            {row.updated_by ? getUpdatedByName(row) : "-"}
          </span>
        </div>
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
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() =>
              navigate(`/subscription-plan-offers/view/${row.id}`, {
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
              navigate(`/subscription-plan-offers/edit/${row.id}`, {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Plan Offers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage offers and discounts for subscription plans
          </p>
        </div>
        <Button
          icon={MdAdd}
          onClick={() => navigate("/subscription-plan-offers/add")}
        >
          Add Offer
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
              placeholder="Search offers..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"}`}
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
          emptyMessage="No subscription plan offers found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} offers
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
        title="Delete Offer"
        message="Delete this offer? This action cannot be undone."
      />
    </div>
  );
};

export default SubscriptionPlanOffers;
