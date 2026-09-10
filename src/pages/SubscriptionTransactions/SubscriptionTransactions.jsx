// // import React, { useState, useEffect } from "react";
// // import {
// //     MdAdd,
// //     MdEdit,
// //     MdDelete,
// //     MdSearch,
// //     MdVisibility,
// //     MdReceipt,
// //     MdPayment,
// // } from "react-icons/md";
// // import Table from "../../components/common/Table";
// // import Button from "../../components/common/Button";
// // import Pagination from "../../components/common/Pagination";
// // import FormModal from "../../components/common/FormModal";
// // import ConfirmDialog from "../../components/common/ConfirmDialog";
// // import ViewModal, { ViewRow, ViewBadge } from "../../components/common/ViewModal";
// // import { subscriptionTransactionService } from "../../services/subscriptionTransaction.service";
// // // import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
// // import { companyService } from "../../services/company.service";
// // // import { companySubscriptionService } from "../../services/companySubscription.service";
// // import { subscriptionPlanOfferService } from "../../services/subscriptionPlanOffer.service";
// // // import { subscriptionCouponService } from "../../services/subscriptionCoupon.service";
// // import { showSuccess, showError } from "../../utils/toast";
// // import { formatDate } from "../../utils/helpers";

// // const SubscriptionTransactions = () => {
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

// //     // Reference data
// //     const [companies, setCompanies] = useState([]);
// //     const [subscriptionPlans, setSubscriptionPlans] = useState([]);
// //     const [companySubscriptions, setCompanySubscriptions] = useState([]);
// //     const [offers, setOffers] = useState([]);
// //     const [coupons, setCoupons] = useState([]);

// //     const normalizeTransaction = (item) => ({
// //         id: item.id || item._id,
// //         base_price: parseFloat(item.base_price) || 0,
// //         discount: parseFloat(item.discount) || 0,
// //         gst: parseFloat(item.gst) || 0,
// //         final_amount: parseFloat(item.final_amount) || 0,
// //         payment_gateway: item.payment_gateway || "",
// //         payment_status: item.payment_status || "",
// //         invoice_no: item.invoice_no || "",
// //         payment_response: item.payment_response || "",
// //         payment_reference: item.payment_reference || "",
// //         gateway_order_id: item.gateway_order_id || "",
// //         is_status: item.is_status !== undefined ? item.is_status : true,
// //         status: item.is_status !== undefined ? item.is_status : true,
// //         created_by: item.created_by || "",
// //         createdAt: item.created_at || item.createdAt || null,
// //         updatedAt: item.updated_at || item.updatedAt || null,
// //         // Relations
// //         Company: item.Company || null,
// //         SubscriptionPlan: item.SubscriptionPlan || null,
// //         CompanySubscription: item.CompanySubscription || null,
// //         SubscriptionPlanOffer: item.SubscriptionPlanOffer || null,
// //         SubscriptionCoupon: item.SubscriptionCoupon || null,
// //         // Extracted fields for display
// //         company_name: item.Company?.company_name || "",
// //         plan_name: item.SubscriptionPlan?.plan_name || "",
// //         subscription_type: item.CompanySubscription?.subscription_type || "",
// //         offer_name: item.SubscriptionPlanOffer?.offer_name || "",
// //         coupon_code: item.SubscriptionCoupon?.coupon_code || "",
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

// //     // Fetch reference data
// //     const fetchReferenceData = async () => {
// //         try {
// //             const [companiesRes, plansRes, subsRes, offersRes, couponsRes] = await Promise.all([
// //                 companyService.getAll({ limit: 1000 }),
// //                 subscriptionPlanService.getAll({ limit: 1000 }),
// //                 companySubscriptionService.getAll({ limit: 1000 }),
// //                 subscriptionPlanOfferService.getAll({ limit: 1000 }),
// //                 subscriptionCouponService.getAll({ limit: 1000 })
// //             ]);

// //             setCompanies(companiesRes.data?.data || companiesRes.data || []);
// //             setSubscriptionPlans(plansRes.data?.data || plansRes.data || []);
// //             setCompanySubscriptions(subsRes.data?.data || subsRes.data || []);
// //             setOffers(offersRes.data?.data || offersRes.data || []);
// //             setCoupons(couponsRes.data?.data || couponsRes.data || []);
// //         } catch (error) {
// //             console.error("Failed to fetch reference data:", error);
// //         }
// //     };

// //     const load = async () => {
// //         setLoading(true);
// //         try {
// //             const r = await subscriptionTransactionService.getAll({ limit: 1000 });
// //             const rawData = r.data?.data || r.data?.results || r.data || [];
// //             const transactions = Array.isArray(rawData) ? rawData.map(normalizeTransaction) : [];
// //             const sortedTransactions = transactions.sort((a, b) => {
// //                 return new Date(b.createdAt) - new Date(a.createdAt);
// //             });
// //             setData(sortedTransactions);
// //         } catch (error) {
// //             console.error('Load error:', error);
// //             showError(error.message || "Failed to load subscription transactions");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         load();
// //         fetchReferenceData();
// //     }, []);

// //     useEffect(() => {
// //         setPage(1);
// //     }, [search, statusFilter]);

// //     const filteredData = React.useMemo(() => {
// //         let result = data;
// //         if (statusFilter !== "all") {
// //             const isActive = statusFilter === "active";
// //             result = result.filter((item) => {
// //                 const itemStatus = getStatusValue(item);
// //                 return itemStatus === isActive;
// //             });
// //         }
// //         const query = search.toLowerCase().trim();
// //         if (query) {
// //             result = result.filter((item) =>
// //                 String(item.invoice_no ?? "").toLowerCase().includes(query) ||
// //                 String(item.company_name ?? "").toLowerCase().includes(query) ||
// //                 String(item.plan_name ?? "").toLowerCase().includes(query) ||
// //                 String(item.payment_status ?? "").toLowerCase().includes(query) ||
// //                 String(item.payment_reference ?? "").toLowerCase().includes(query)
// //             );
// //         }
// //         return result;
// //     }, [data, search, statusFilter]);

// //     const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

// //     const activeCount = data.filter((r) => getStatusValue(r)).length;
// //     const inactiveCount = data.length - activeCount;

// //     // Get payment status badge color
// //     const getPaymentStatusColor = (status) => {
// //         const statusMap = {
// //             'Success': 'green',
// //             'success': 'green',
// //             'Pending': 'yellow',
// //             'pending': 'yellow',
// //             'Failed': 'red',
// //             'failed': 'red',
// //             'Refunded': 'orange',
// //             'refunded': 'orange',
// //         };
// //         return statusMap[status] || 'gray';
// //     };

// //     const getFormFields = (editData = null) => {
// //         const companyOptions = companies.map(c => ({
// //             value: c.id || c._id,
// //             label: c.company_name || ""
// //         }));

// //         const planOptions = subscriptionPlans.map(p => ({
// //             value: p.id || p._id,
// //             label: p.plan_name || ""
// //         }));

// //         const subscriptionOptions = companySubscriptions.map(s => ({
// //             value: s.id || s._id,
// //             label: s.subscription_type || `Subscription #${s.id}`
// //         }));

// //         const offerOptions = offers.map(o => ({
// //             value: o.id || o._id,
// //             label: o.offer_name || `Offer #${o.id}`
// //         }));

// //         const couponOptions = coupons.map(c => ({
// //             value: c.id || c._id,
// //             label: c.coupon_code || `Coupon #${c.id}`
// //         }));

// //         const paymentGatewayOptions = [
// //             { value: 'Razorpay', label: 'Razorpay' },
// //             { value: 'Stripe', label: 'Stripe' },
// //             { value: 'PayPal', label: 'PayPal' },
// //             { value: 'Cash', label: 'Cash' },
// //             { value: 'Bank Transfer', label: 'Bank Transfer' },
// //         ];

// //         const paymentStatusOptions = [
// //             { value: 'Success', label: 'Success' },
// //             { value: 'Pending', label: 'Pending' },
// //             { value: 'Failed', label: 'Failed' },
// //             { value: 'Refunded', label: 'Refunded' },
// //         ];

// //         return [
// //             {
// //                 name: "company_id",
// //                 label: "Company",
// //                 type: "select",
// //                 required: true,
// //                 options: companyOptions,
// //                 placeholder: "Select company",
// //                 help: "Select the company making the payment"
// //             },
// //             {
// //                 name: "subscription_plan_id",
// //                 label: "Subscription Plan",
// //                 type: "select",
// //                 required: true,
// //                 options: planOptions,
// //                 placeholder: "Select plan",
// //                 help: "Select the subscription plan"
// //             },
// //             {
// //                 name: "company_subscription_id",
// //                 label: "Company Subscription",
// //                 type: "select",
// //                 required: true,
// //                 options: subscriptionOptions,
// //                 placeholder: "Select subscription",
// //                 help: "Select the company subscription"
// //             },
// //             {
// //                 name: "offer_id",
// //                 label: "Offer (Optional)",
// //                 type: "select",
// //                 required: false,
// //                 options: [{ value: "", label: "No Offer" }, ...offerOptions],
// //                 placeholder: "Select offer",
// //                 help: "Select an applied offer if any"
// //             },
// //             {
// //                 name: "coupon_id",
// //                 label: "Coupon (Optional)",
// //                 type: "select",
// //                 required: false,
// //                 options: [{ value: "", label: "No Coupon" }, ...couponOptions],
// //                 placeholder: "Select coupon",
// //                 help: "Select an applied coupon if any"
// //             },
// //             {
// //                 name: "base_price",
// //                 label: "Base Price",
// //                 type: "number",
// //                 required: true,
// //                 min: 0,
// //                 step: "0.01",
// //                 help: "Original price before any discounts"
// //             },
// //             {
// //                 name: "discount",
// //                 label: "Discount Amount",
// //                 type: "number",
// //                 required: true,
// //                 min: 0,
// //                 step: "0.01",
// //                 help: "Total discount applied"
// //             },
// //             {
// //                 name: "gst",
// //                 label: "GST Amount",
// //                 type: "number",
// //                 required: true,
// //                 min: 0,
// //                 step: "0.01",
// //                 help: "GST amount applied"
// //             },
// //             {
// //                 name: "final_amount",
// //                 label: "Final Amount",
// //                 type: "number",
// //                 required: true,
// //                 min: 0,
// //                 step: "0.01",
// //                 help: "Final amount after all adjustments"
// //             },
// //             {
// //                 name: "payment_gateway",
// //                 label: "Payment Gateway",
// //                 type: "select",
// //                 required: true,
// //                 options: paymentGatewayOptions,
// //                 placeholder: "Select payment gateway"
// //             },
// //             {
// //                 name: "payment_status",
// //                 label: "Payment Status",
// //                 type: "select",
// //                 required: true,
// //                 options: paymentStatusOptions,
// //                 placeholder: "Select payment status"
// //             },
// //             {
// //                 name: "invoice_no",
// //                 label: "Invoice Number",
// //                 type: "text",
// //                 required: true,
// //                 placeholder: "e.g. INV-20260713-001",
// //                 help: "Unique invoice number"
// //             },
// //             {
// //                 name: "payment_reference",
// //                 label: "Payment Reference",
// //                 type: "text",
// //                 required: false,
// //                 placeholder: "e.g. pay_QwErTy123456",
// //                 help: "Payment gateway reference ID"
// //             },
// //             {
// //                 name: "gateway_order_id",
// //                 label: "Gateway Order ID",
// //                 type: "text",
// //                 required: false,
// //                 placeholder: "e.g. order_QwErTy123456",
// //                 help: "Order ID from payment gateway"
// //             },
// //             {
// //                 name: "payment_response",
// //                 label: "Payment Response",
// //                 type: "textarea",
// //                 required: false,
// //                 placeholder: "Payment response details...",
// //                 rows: 3,
// //                 help: "Raw payment response from gateway"
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
// //         ];
// //     };

// //     const validationRules = {
// //         company_id: {
// //             required: true,
// //             requiredMessage: 'Please select a company'
// //         },
// //         subscription_plan_id: {
// //             required: true,
// //             requiredMessage: 'Please select a subscription plan'
// //         },
// //         company_subscription_id: {
// //             required: true,
// //             requiredMessage: 'Please select a company subscription'
// //         },
// //         base_price: {
// //             required: true,
// //             requiredMessage: 'Base price is required',
// //             min: 0,
// //             minMessage: 'Base price must be greater than or equal to 0'
// //         },
// //         discount: {
// //             required: true,
// //             requiredMessage: 'Discount is required',
// //             min: 0,
// //             minMessage: 'Discount must be greater than or equal to 0'
// //         },
// //         gst: {
// //             required: true,
// //             requiredMessage: 'GST is required',
// //             min: 0,
// //             minMessage: 'GST must be greater than or equal to 0'
// //         },
// //         final_amount: {
// //             required: true,
// //             requiredMessage: 'Final amount is required',
// //             min: 0,
// //             minMessage: 'Final amount must be greater than or equal to 0'
// //         },
// //         payment_gateway: {
// //             required: true,
// //             requiredMessage: 'Please select a payment gateway'
// //         },
// //         payment_status: {
// //             required: true,
// //             requiredMessage: 'Please select a payment status'
// //         },
// //         invoice_no: {
// //             required: true,
// //             requiredMessage: 'Invoice number is required'
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

// //     const handleSubmit = async (formData) => {
// //         setFormLoading(true);
// //         try {
// //             const submitData = {
// //                 company_id: parseInt(formData.company_id),
// //                 subscription_plan_id: parseInt(formData.subscription_plan_id),
// //                 company_subscription_id: parseInt(formData.company_subscription_id),
// //                 offer_id: formData.offer_id ? parseInt(formData.offer_id) : null,
// //                 coupon_id: formData.coupon_id ? parseInt(formData.coupon_id) : null,
// //                 base_price: parseFloat(formData.base_price) || 0,
// //                 discount: parseFloat(formData.discount) || 0,
// //                 gst: parseFloat(formData.gst) || 0,
// //                 final_amount: parseFloat(formData.final_amount) || 0,
// //                 payment_gateway: formData.payment_gateway,
// //                 payment_status: formData.payment_status,
// //                 invoice_no: formData.invoice_no,
// //                 payment_reference: formData.payment_reference || "",
// //                 gateway_order_id: formData.gateway_order_id || "",
// //                 payment_response: formData.payment_response || "",
// //                 status: formData.status === "active" ? 1 : 0
// //             };

// //             if (editItem) {
// //                 await subscriptionTransactionService.update(editItem.id, submitData);
// //                 showSuccess("Transaction updated successfully");
// //             } else {
// //                 await subscriptionTransactionService.create(submitData);
// //                 showSuccess("Transaction created successfully");
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
// //             await subscriptionTransactionService.delete(deleteId);
// //             showSuccess("Transaction deleted successfully");
// //             load();
// //         } catch (error) {
// //             console.error('Delete error:', error);
// //             showError(error.message || "Failed to delete transaction");
// //         } finally {
// //             setDeleteId(null);
// //             setDeleteLoading(false);
// //         }
// //     };

// //     const handleStatusToggle = async (row) => {
// //         const currentStatus = getStatusValue(row);
// //         const newStatus = !currentStatus;

// //         try {
// //             await subscriptionTransactionService.update(row.id, {
// //                 status: newStatus ? 1 : 0
// //             });
// //             showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
// //             load();
// //         } catch (error) {
// //             console.error('Status toggle error:', error);
// //             showError(error.response?.data?.message || error.message || "Failed to update status");
// //         }
// //     };

// //     const getCreatedByName = (row) => {
// //         if (!row) return "-";
// //         if (row.created_by) {
// //             if (typeof row.created_by === 'object') {
// //                 return row.created_by.name || row.created_by.username || row.created_by.email || "User";
// //             }
// //             return row.created_by;
// //         }
// //         return "System";
// //     };

// //     const columns = [
// //         {
// //             header: "#",
// //             key: "id",
// //             render: (_, __, i) => (page - 1) * limit + i + 1
// //         },
// //         {
// //             header: "Invoice",
// //             key: "invoice_no",
// //             render: (v) => (
// //                 <span className="font-medium text-gray-800">{v}</span>
// //             ),
// //         },
// //         {
// //             header: "Company",
// //             key: "company_name",
// //             render: (v) => (
// //                 <span className="text-gray-700">{v || "-"}</span>
// //             ),
// //         },
// //         {
// //             header: "Plan",
// //             key: "plan_name",
// //             render: (v) => (
// //                 <span className="text-gray-600">{v || "-"}</span>
// //             ),
// //         },
// //         {
// //             header: "Amount",
// //             key: "final_amount",
// //             render: (v, row) => (
// //                 <div>
// //                     <span className="font-semibold text-gray-800">₹{v?.toFixed(2)}</span>
// //                     <span className="text-xs text-gray-400 ml-1">(Base: ₹{row.base_price?.toFixed(2)})</span>
// //                 </div>
// //             ),
// //         },
// //         {
// //             header: "Gateway",
// //             key: "payment_gateway",
// //             render: (v) => (
// //                 <span className="text-gray-600">{v || "-"}</span>
// //             ),
// //         },
// //         {
// //             header: "Payment Status",
// //             key: "payment_status",
// //             render: (v) => {
// //                 const color = getPaymentStatusColor(v);
// //                 return (
// //                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}>
// //                         <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
// //                         {v || "Unknown"}
// //                     </span>
// //                 );
// //             },
// //         },
// //         {
// //             header: "Status",
// //             key: "status",
// //             render: (status, row) => {
// //                 const isActive = getStatusValue(row);
// //                 return (
// //                     <button
// //                         onClick={() => handleStatusToggle(row)}
// //                         className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"}`}
// //                     >
// //                         <span
// //                             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"}`}
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
// //                     <h1 className="text-2xl font-bold text-gray-900">Subscription Transactions</h1>
// //                     <p className="text-sm text-gray-500 mt-1">Manage payment transactions for subscriptions</p>
// //                 </div>
// //                 <Button icon={MdAdd} onClick={openAdd}>
// //                     Add Transaction
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
// //                             placeholder="Search transactions..."
// //                             className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
// //                         />
// //                     </div>

// //                     <div className="flex items-center gap-5 text-sm">
// //                         {tabs.map((tab) => (
// //                             <button
// //                                 key={tab.key}
// //                                 onClick={() => setStatusFilter(tab.key)}
// //                                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"}`}
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
// //                     emptyMessage="No subscription transactions found"
// //                 />

// //                 {/* Footer */}
// //                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
// //                     <p className="text-xs text-gray-400">
// //                         Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
// //                         {"–"}
// //                         {Math.min(page * limit, filteredData.length)} of {filteredData.length} transactions
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
// //                 title={editItem ? "Edit Transaction" : "Add Transaction"}
// //                 fields={getFormFields(editItem)}
// //                 initialData={editItem ? {
// //                     company_id: editItem.Company?.id || "",
// //                     subscription_plan_id: editItem.SubscriptionPlan?.id || "",
// //                     company_subscription_id: editItem.CompanySubscription?.id || "",
// //                     offer_id: editItem.SubscriptionPlanOffer?.id || "",
// //                     coupon_id: editItem.SubscriptionCoupon?.id || "",
// //                     base_price: editItem.base_price || 0,
// //                     discount: editItem.discount || 0,
// //                     gst: editItem.gst || 0,
// //                     final_amount: editItem.final_amount || 0,
// //                     payment_gateway: editItem.payment_gateway || "",
// //                     payment_status: editItem.payment_status || "",
// //                     invoice_no: editItem.invoice_no || "",
// //                     payment_reference: editItem.payment_reference || "",
// //                     gateway_order_id: editItem.gateway_order_id || "",
// //                     payment_response: editItem.payment_response || "",
// //                     status: getStatusValue(editItem) ? "active" : "inactive"
// //                 } : {
// //                     company_id: "",
// //                     subscription_plan_id: "",
// //                     company_subscription_id: "",
// //                     offer_id: "",
// //                     coupon_id: "",
// //                     base_price: 0,
// //                     discount: 0,
// //                     gst: 0,
// //                     final_amount: 0,
// //                     payment_gateway: "",
// //                     payment_status: "",
// //                     invoice_no: "",
// //                     payment_reference: "",
// //                     gateway_order_id: "",
// //                     payment_response: "",
// //                     status: "active"
// //                 }}
// //                 validationRules={validationRules}
// //                 loading={formLoading}
// //                 submitLabel={editItem ? "Update" : "Create"}
// //                 size="lg"
// //             />

// //             {/* View Modal */}
// //             <ViewModal
// //                 isOpen={viewModalOpen}
// //                 onClose={() => {
// //                     setViewModalOpen(false);
// //                     setViewData(null);
// //                 }}
// //                 title="Transaction Details"
// //             >
// //                 {viewData && (
// //                     <div className="space-y-1">
// //                         <ViewRow label="Invoice Number" value={viewData.invoice_no} />
// //                         <ViewRow label="Company" value={viewData.company_name || "-"} />
// //                         <ViewRow label="Plan" value={viewData.plan_name || "-"} />
// //                         <ViewRow label="Subscription Type" value={viewData.subscription_type || "-"} />
// //                         {viewData.offer_name && (
// //                             <ViewRow label="Offer Applied" value={viewData.offer_name} />
// //                         )}
// //                         {viewData.coupon_code && (
// //                             <ViewRow label="Coupon Applied" value={viewData.coupon_code} />
// //                         )}
// //                         <ViewRow
// //                             label="Base Price"
// //                             value={`₹${viewData.base_price?.toFixed(2)}`}
// //                         />
// //                         <ViewRow
// //                             label="Discount"
// //                             value={`-₹${viewData.discount?.toFixed(2)}`}
// //                         />
// //                         <ViewRow
// //                             label="GST"
// //                             value={`₹${viewData.gst?.toFixed(2)}`}
// //                         />
// //                         <ViewRow
// //                             label="Final Amount"
// //                             value={
// //                                 <span className="font-bold text-lg text-[#2c0eee]">
// //                                     ₹{viewData.final_amount?.toFixed(2)}
// //                                 </span>
// //                             }
// //                         />
// //                         <ViewRow label="Payment Gateway" value={viewData.payment_gateway} />
// //                         <ViewRow
// //                             label="Payment Status"
// //                             value={
// //                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${getPaymentStatusColor(viewData.payment_status)}-50 text-${getPaymentStatusColor(viewData.payment_status)}-700`}>
// //                                     <span className={`w-1.5 h-1.5 rounded-full bg-${getPaymentStatusColor(viewData.payment_status)}-500`} />
// //                                     {viewData.payment_status}
// //                                 </span>
// //                             }
// //                         />
// //                         {viewData.payment_reference && (
// //                             <ViewRow label="Payment Reference" value={viewData.payment_reference} />
// //                         )}
// //                         {viewData.gateway_order_id && (
// //                             <ViewRow label="Gateway Order ID" value={viewData.gateway_order_id} />
// //                         )}
// //                         {viewData.payment_response && (
// //                             <ViewRow label="Payment Response" value={viewData.payment_response} />
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
// //                         <ViewRow label="Created At" value={formatDate(viewData.createdAt)} />
// //                         {viewData.updatedAt && (
// //                             <ViewRow label="Updated At" value={formatDate(viewData.updatedAt)} />
// //                         )}
// //                         <ViewRow label="Created By" value={getCreatedByName(viewData)} />
// //                     </div>
// //                 )}
// //             </ViewModal>

// //             <ConfirmDialog
// //                 isOpen={!!deleteId}
// //                 onClose={() => setDeleteId(null)}
// //                 onConfirm={handleDelete}
// //                 loading={deleteLoading}
// //                 title="Delete Transaction"
// //                 message="Delete this transaction? This action cannot be undone."
// //             />
// //         </div>
// //     );
// // };

// // export default SubscriptionTransactions;

// import React, { useState, useEffect } from "react";
// import {
//   MdSearch,
//   MdVisibility,
//   MdReceipt,
//   MdPayment,
//   MdBusiness,
//   MdLocalOffer,
//   MdConfirmationNumber,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Pagination from "../../components/common/Pagination";
// import ViewModal, { ViewRow } from "../../components/common/ViewModal";
// import { subscriptionTransactionService } from "../../services/subscriptionTransaction.service";
// import { showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";

// const SubscriptionTransactions = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");

//   const normalizeTransaction = (item) => ({
//     id: item.id || item._id,
//     base_price: parseFloat(item.base_price) || 0,
//     discount: parseFloat(item.discount) || 0,
//     gst: parseFloat(item.gst) || 0,
//     final_amount: parseFloat(item.final_amount) || 0,
//     payment_gateway: item.payment_gateway || "",
//     payment_status: item.payment_status || "",
//     invoice_no: item.invoice_no || "",
//     payment_response: item.payment_response || "",
//     payment_reference: item.payment_reference || "",
//     gateway_order_id: item.gateway_order_id || "",
//     is_status: item.is_status !== undefined ? item.is_status : true,
//     status: item.is_status !== undefined ? item.is_status : true,
//     created_by: item.created_by || "",
//     createdAt: item.created_at || item.createdAt || null,
//     updatedAt: item.updated_at || item.updatedAt || null,
//     transaction_no: item.transaction_no || "", // FIX: Added transaction_no
//     discount_price: parseFloat(item.discount_price) || 0, // FIX: Changed from discount to discount_price
//     gst_amount: parseFloat(item.gst_amount) || 0, // FIX: Changed from gst to gst_amount
//     // Relations
//     Company: item.Company || null,
//     SubscriptionPlan: item.SubscriptionPlan || null,
//     CompanySubscription: item.CompanySubscription || null,
//     SubscriptionPlanOffer: item.SubscriptionPlanOffer || null,
//     SubscriptionCoupon: item.SubscriptionCoupon || null,
//     // Extracted fields for display
//     company_name: item.Company?.company_name || "",
//     company_id: item.Company?.company_id || "",
//     plan_name: item.SubscriptionPlan?.plan_name || "",
//     plan_id: item.SubscriptionPlan?.subscriptionplan_id || "",
//     subscription_type: item.CompanySubscription?.subscription_type || "",
//     subscription_id: item.CompanySubscription?.company_subscription_id || "",
//     offer_name: item.SubscriptionPlanOffer?.offer_name || "",
//     offer_id: item.SubscriptionPlanOffer?.offer_id || "",
//     coupon_code: item.SubscriptionCoupon?.coupon_code || "",
//     coupon_id: item.SubscriptionCoupon?.coupon_id || "",
//     raw: item,
//   });

//   const getStatusValue = (row) => {
//     if (row.is_status !== undefined) {
//       return row.is_status;
//     }
//     if (row.status !== undefined) {
//       return row.status === 1 || row.status === true;
//     }
//     return true;
//   };

//   const load = async () => {
//     setLoading(true);
//     try {
//       const r = await subscriptionTransactionService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const transactions = Array.isArray(rawData)
//         ? rawData.map(normalizeTransaction)
//         : [];
//       const sortedTransactions = transactions.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setData(sortedTransactions);
//     } catch (error) {
//       console.error("Load error:", error);
//       showError(error.message || "Failed to load subscription transactions");
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
//         const itemStatus = getStatusValue(item);
//         return itemStatus === isActive;
//       });
//     }
//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter(
//         (item) =>
//           String(item.invoice_no ?? "")
//             .toLowerCase()
//             .includes(query) ||
//           String(item.company_name ?? "")
//             .toLowerCase()
//             .includes(query) ||
//           String(item.plan_name ?? "")
//             .toLowerCase()
//             .includes(query) ||
//           String(item.payment_status ?? "")
//             .toLowerCase()
//             .includes(query) ||
//           String(item.payment_reference ?? "")
//             .toLowerCase()
//             .includes(query) ||
//           String(item.payment_gateway ?? "")
//             .toLowerCase()
//             .includes(query),
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => getStatusValue(r)).length;
//   const inactiveCount = data.length - activeCount;

//   // Get payment status badge color
//   const getPaymentStatusColor = (status) => {
//     const statusMap = {
//       Success: "green",
//       success: "green",
//       Pending: "yellow",
//       pending: "yellow",
//       Failed: "red",
//       failed: "red",
//       Refunded: "orange",
//       refunded: "orange",
//     };
//     return statusMap[status] || "gray";
//   };

//   const openView = (item) => {
//     setViewData(item);
//     setViewModalOpen(true);
//   };

//   const getCreatedByName = (row) => {
//     if (!row) return "-";
//     if (row.created_by) {
//       if (typeof row.created_by === "object") {
//         return (
//           row.created_by.name ||
//           row.created_by.username ||
//           row.created_by.email ||
//           "User"
//         );
//       }
//       return row.created_by;
//     }
//     return "System";
//   };

//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1,
//     },
//     {
//       header: "Transaction No",
//       key: "transaction_no",
//       render: (v) => (
//         <span className="font-medium text-gray-800 flex items-center gap-1">
//           <MdReceipt size={14} className="text-[#4529f7]" />
//           {v || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Company",
//       key: "company_name",
//       render: (_, row) => (
//         <span className="text-gray-700">
//           {row.Company?.company_name || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Plan",
//       key: "plan_name",
//       render: (_, row) => (
//         <span className="text-gray-600">
//           {row.SubscriptionPlan?.plan_name || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Amount",
//       key: "final_amount",
//       render: (v, row) => (
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-800">₹{v?.toFixed(2)}</span>
//           <span className="text-xs text-gray-400">
//             (Base: ₹{row.base_price?.toFixed(2)})
//           </span>
//         </div>
//       ),
//     },
//     {
//       header: "Discount",
//       key: "discount_price",
//       render: (v) => {
//         const value = Number(v || 0);
//         return (
//           <span className="text-green-600 font-medium">
//             {value ? `-₹${value.toFixed(2)}` : "₹0.00"}
//           </span>
//         );
//       },
//     },
//     {
//       header: "GST",
//       key: "gst_amount",
//       render: (v) => {
//         const value = Number(v || 0);
//         return <span className="text-gray-600">₹{value.toFixed(2)}</span>;
//       },
//     },
//     {
//       header: "Gateway",
//       key: "payment_gateway",
//       render: (v) => <span className="text-gray-600">{v || "-"}</span>,
//     },
//     {
//       header: "Payment Status",
//       key: "payment_status",
//       render: (v) => {
//         const color = getPaymentStatusColor(v);
//         return (
//           <span
//             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}
//           >
//             <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
//             {v || "Unknown"}
//           </span>
//         );
//       },
//     },
//     {
//       header: "Subscription",
//       key: "subscription_type",
//       render: (_, row) => (
//         <span className="text-gray-600">
//           {row.CompanySubscription?.subscription_type || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Offer",
//       key: "offer_name",
//       render: (_, row) => (
//         <span className="text-gray-600">
//           {row.SubscriptionPlanOffer?.offer_name || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Coupon",
//       key: "coupon_code",
//       render: (_, row) => (
//         <span className="text-gray-600">
//           {row.SubscriptionCoupon?.coupon_code || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (_, row) => {
//         const isActive = getStatusValue(row);
//         return (
//           <span
//             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
//           >
//             <span
//               className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
//             />
//             {isActive ? "Active" : "Inactive"}
//           </span>
//         );
//       },
//     },
//     {
//       header: "Created At",
//       key: "createdAt",
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
//             className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
//             title="View Details"
//           >
//             <MdVisibility size={16} />
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
//           <h1 className="text-2xl font-bold text-gray-900">
//             Subscription Transactions
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             View payment transactions for subscriptions
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
//             Total: {data.length} transactions
//           </span>
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
//               placeholder="Search transactions..."
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
//                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
//                     statusFilter === tab.key
//                       ? "bg-blue-50 text-[#2c0eee]"
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
//           emptyMessage="No subscription transactions found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of{" "}
//             {filteredData.length} transactions
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

//       {/* View Modal */}
//       <ViewModal
//         isOpen={viewModalOpen}
//         onClose={() => {
//           setViewModalOpen(false);
//           setViewData(null);
//         }}
//         title="Transaction Details"
//         size="lg"
//       >
//         {viewData && (
//           <div className="space-y-4">
//             {/* Header with Invoice */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
//               <div>
//                 <span className="text-xs text-gray-400">Invoice Number</span>
//                 <p className="font-bold text-lg text-gray-800">
//                   {viewData.invoice_no}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <span className="text-xs text-gray-400">Final Amount</span>
//                 <p className="font-bold text-2xl text-[#2c0eee]">
//                   ₹{viewData.final_amount?.toFixed(2)}
//                 </p>
//               </div>
//             </div>

//             {/* Company & Plan Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-3">
//                 <ViewRow
//                   label="Company"
//                   value={
//                     <div className="flex items-center gap-2">
//                       <MdBusiness className="text-gray-400" />
//                       <span className="font-medium">
//                         {viewData.company_name || "-"}
//                       </span>
//                     </div>
//                   }
//                 />
//                 <ViewRow label="Plan" value={viewData.plan_name || "-"} />
//                 <ViewRow
//                   label="Subscription Type"
//                   value={viewData.subscription_type || "-"}
//                 />
//               </div>
//               <div className="space-y-3">
//                 <ViewRow
//                   label="Payment Gateway"
//                   value={viewData.payment_gateway || "-"}
//                 />
//                 <ViewRow
//                   label="Payment Status"
//                   value={
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${getPaymentStatusColor(viewData.payment_status)}-50 text-${getPaymentStatusColor(viewData.payment_status)}-700`}
//                     >
//                       <span
//                         className={`w-1.5 h-1.5 rounded-full bg-${getPaymentStatusColor(viewData.payment_status)}-500`}
//                       />
//                       {viewData.payment_status || "Unknown"}
//                     </span>
//                   }
//                 />
//                 {viewData.payment_reference && (
//                   <ViewRow
//                     label="Payment Reference"
//                     value={viewData.payment_reference}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Amount Breakdown */}
//             <div className="border-t border-gray-100 pt-4">
//               <h4 className="text-sm font-medium text-gray-700 mb-3">
//                 Amount Breakdown
//               </h4>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 <div className="bg-gray-50 p-3 rounded-lg text-center">
//                   <p className="text-xs text-gray-400">Base Price</p>
//                   <p className="font-semibold text-gray-700">
//                     ₹{viewData.base_price?.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg text-center">
//                   <p className="text-xs text-gray-400">Discount</p>
//                   <p className="font-semibold text-red-500">
//                     -₹{viewData.discount?.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg text-center">
//                   <p className="text-xs text-gray-400">GST</p>
//                   <p className="font-semibold text-gray-700">
//                     ₹{viewData.gst?.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                   <p className="text-xs text-gray-400">Final Amount</p>
//                   <p className="font-bold text-[#2c0eee]">
//                     ₹{viewData.final_amount?.toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Offers & Coupons */}
//             {(viewData.offer_name || viewData.coupon_code) && (
//               <div className="border-t border-gray-100 pt-4">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">
//                   Applied Offers & Coupons
//                 </h4>
//                 <div className="flex flex-wrap gap-3">
//                   {viewData.offer_name && (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm border border-orange-200">
//                       <MdLocalOffer size={14} />
//                       {viewData.offer_name}
//                     </span>
//                   )}
//                   {viewData.coupon_code && (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2c0eee] rounded-lg text-sm border border-[#4529f7]">
//                       <MdConfirmationNumber size={14} />
//                       {viewData.coupon_code}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Gateway Details */}
//             {(viewData.gateway_order_id || viewData.payment_response) && (
//               <div className="border-t border-gray-100 pt-4">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">
//                   Gateway Details
//                 </h4>
//                 <div className="space-y-2">
//                   {viewData.gateway_order_id && (
//                     <ViewRow
//                       label="Gateway Order ID"
//                       value={viewData.gateway_order_id}
//                     />
//                   )}
//                   {viewData.payment_response && (
//                     <ViewRow
//                       label="Payment Response"
//                       value={
//                         <pre className="text-xs bg-gray-50 p-2 rounded border border-gray-200 max-h-24 overflow-auto">
//                           {typeof viewData.payment_response === "string"
//                             ? viewData.payment_response
//                             : JSON.stringify(
//                                 viewData.payment_response,
//                                 null,
//                                 2,
//                               )}
//                         </pre>
//                       }
//                     />
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Footer Info */}
//             <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
//               <ViewRow
//                 label="Created At"
//                 value={formatDate(viewData.createdAt)}
//               />
//               {viewData.updatedAt && (
//                 <ViewRow
//                   label="Updated At"
//                   value={formatDate(viewData.updatedAt)}
//                 />
//               )}
//               <ViewRow label="Created By" value={getCreatedByName(viewData)} />
//               <ViewRow
//                 label="Status"
//                 value={
//                   <span
//                     className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//                       getStatusValue(viewData)
//                         ? "bg-green-50 text-green-700"
//                         : "bg-gray-100 text-gray-500"
//                     }`}
//                   >
//                     <span
//                       className={`w-1.5 h-1.5 rounded-full ${getStatusValue(viewData) ? "bg-green-500" : "bg-gray-400"}`}
//                     />
//                     {getStatusValue(viewData) ? "Active" : "Inactive"}
//                   </span>
//                 }
//               />
//             </div>
//           </div>
//         )}
//       </ViewModal>
//     </div>
//   );
// };

// export default SubscriptionTransactions;




// pages/SubscriptionTransactions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdVisibility,
  MdReceipt,
  MdBusiness,
  MdLocalOffer,
  MdConfirmationNumber,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import { subscriptionTransactionService } from "../../services/subscriptionTransaction.service";
import { showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const SubscriptionTransactions = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});

  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  const normalizeTransaction = (item) => ({
    // Basic
    id: item.id || item._id,

    // Amounts
    base_price: Number(item.base_price || 0),
    discount_price: Number(item.discount_price || 0),
    gst_amount: Number(item.gst_amount || 0),
    final_amount: Number(item.final_amount || 0),

    // Payment
    payment_gateway: item.payment_gateway || "",
    payment_status: item.payment_status || "",
    payment_response: item.payment_response || "",
    payment_reference: item.payment_reference || "",
    gateway_order_id: item.gateway_order_id || "",
    transaction_no: item.transaction_no || "",

    // Status
    is_status:
      item.is_status !== undefined
        ? item.is_status
        : true,

    status:
      item.is_status !== undefined
        ? item.is_status
        : true,

    is_trending:
      item.is_trending !== undefined
        ? item.is_trending
        : false,

    // Users
    created_by: item.created_by || "",
    updated_by: item.updated_by || "",

    // Dates
    createdAt: item.created_at || item.createdAt || null,
    updatedAt: item.updated_at || item.updatedAt || null,

    // Relations - keep COMPLETE API objects
    Company: item.Company || null,

    SubscriptionPlan: item.SubscriptionPlan || null,

    CompanySubscription: item.CompanySubscription || null,

    SubscriptionPlanOffer:
      item.SubscriptionPlanOffer || null,

    SubscriptionCoupon:
      item.SubscriptionCoupon || null,

    // Company
    company_id:
      item.Company?.company_id || "",

    company_name:
      item.Company?.company_name || "",

    // Subscription Plan
    plan_id:
      item.SubscriptionPlan?.subscriptionplan_id ||
      item.SubscriptionPlan?.id ||
      "",

    plan_name:
      item.SubscriptionPlan?.plan_name || "",

    // Company Subscription
    subscription_id:
      item.CompanySubscription?.company_subscription_id ||
      item.CompanySubscription?.id ||
      "",

    subscription_type:
      item.CompanySubscription?.subscription_type || "",

    // Offer
    offer_id:
      item.SubscriptionPlanOffer?.offer_id ||
      item.SubscriptionPlanOffer?.id ||
      "",

    offer_name:
      item.SubscriptionPlanOffer?.offer_name || "",

    // Coupon
    coupon_id:
      item.SubscriptionCoupon?.coupon_id ||
      item.SubscriptionCoupon?.id ||
      "",

    coupon_code:
      item.SubscriptionCoupon?.coupon_code || "",

    // Keep original API response
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
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await subscriptionTransactionService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const transactions = Array.isArray(rawData)
        ? rawData.map(normalizeTransaction)
        : [];
      const sortedTransactions = transactions.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedTransactions);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load subscription transactions");
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
          String(item.invoice_no ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.transaction_no ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.company_name ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.plan_name ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.payment_status ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.payment_reference ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.payment_gateway ?? "")
            .toLowerCase()
            .includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => getStatusValue(r)).length;
  const inactiveCount = data.length - activeCount;

  // Get payment status badge color
  const getPaymentStatusColor = (status) => {
    const statusMap = {
      Success: "green",
      success: "green",
      Pending: "yellow",
      pending: "yellow",
      Failed: "red",
      failed: "red",
      Refunded: "orange",
      refunded: "orange",
    };
    return statusMap[status] || "gray";
  };

  const openView = (item) => {
    navigate(`/subscription-transactions/view/${item.id}`, { state: { item } });
  };

  const getCreatedByName = (row) => {
    if (!row) return "-";
    if (row.created_by) {
      if (typeof row.created_by === "object") {
        return (
          row.created_by.name ||
          row.created_by.username ||
          row.created_by.email ||
          "User"
        );
      }
      return getUserNameCached(row.created_by);
    }
    return "System";
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Transaction No",
      key: "transaction_no",
      render: (v) => (
        <span className="font-medium text-gray-800 flex items-center gap-1">
          <MdReceipt size={14} className="text-[#4529f7]" />
          {v || "-"}
        </span>
      ),
    },
    // {
    //   header: "Invoice",
    //   key: "invoice_no",
    //   render: (v) => (
    //     <span className="text-gray-600">{v || "-"}</span>
    //   ),
    // },
    {
      header: "Company",
      key: "company_name",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <MdBusiness size={14} className="text-gray-400" />
          <span className="text-gray-700">{row.Company?.company_name || "-"}</span>
        </div>
      ),
    },
    {
      header: "Plan",
      key: "plan_name",
      render: (_, row) => (
        <span className="text-gray-600">{row.SubscriptionPlan?.plan_name || "-"}</span>
      ),
    },
    {
      header: "Amount",
      key: "final_amount",
      render: (v, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">₹{v?.toFixed(2)}</span>
          <span className="text-xs text-gray-400">
            (Base: ₹{row.base_price?.toFixed(2)})
          </span>
        </div>
      ),
    },
    {
      header: "Discount",
      key: "discount",
      render: (v) => {
        const value = Number(v || 0);
        return (
          <span className="text-green-600 font-medium">
            {value ? `-₹${value.toFixed(2)}` : "₹0.00"}
          </span>
        );
      },
    },
    {
      header: "GST",
      key: "gst",
      render: (v) => {
        const value = Number(v || 0);
        return <span className="text-gray-600">₹{value.toFixed(2)}</span>;
      },
    },
    {
      header: "Gateway",
      key: "payment_gateway",
      render: (v) => <span className="text-gray-600">{v || "-"}</span>,
    },
    {
      header: "Payment Status",
      key: "payment_status",
      render: (v) => {
        const color = getPaymentStatusColor(v);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
            {v || "Unknown"}
          </span>
        );
      },
    },
    {
      header: "Offer",
      key: "offer_name",
      render: (_, row) => (
        <span className="text-gray-600 flex items-center gap-1">
          {row.SubscriptionPlanOffer?.offer_name && (
            <MdLocalOffer size={14} className="text-orange-500" />
          )}
          {row.SubscriptionPlanOffer?.offer_name || "-"}
        </span>
      ),
    },
    {
      header: "Coupon",
      key: "coupon_code",
      render: (_, row) => (
        <span className="text-gray-600 flex items-center gap-1">
          {row.SubscriptionCoupon?.coupon_code && (
            <MdConfirmationNumber size={14} className="text-blue-500" />
          )}
          {row.SubscriptionCoupon?.coupon_code || "-"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (_, row) => {
        const isActive = getStatusValue(row);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (v) => (
        <span className="text-gray-500 text-sm">{formatDate(v)}</span>
      ),
    },
//     {
//   header: "Updated At",
//   key: "updatedAt",
//   render: (v) => (
//     <span className="text-gray-500 text-sm">
//       {v || "-"}
//     </span>
//   ),
// },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
            title="View Details"
          >
            <MdVisibility size={16} />
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
            Subscription Transactions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View payment transactions for subscriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
            Total: {data.length} transactions
          </span>
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
              placeholder="Search transactions..."
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
          emptyMessage="No subscription transactions found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} transactions
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
    </div>
  );
};

export default SubscriptionTransactions;