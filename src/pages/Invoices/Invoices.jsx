// // import React, { useState, useEffect } from "react";
// // import {
// //     MdAdd,
// //     MdEdit,
// //     MdDelete,
// //     MdSearch,
// //     MdVisibility,
// //     MdPictureAsPdf,
// //     MdDownload,
// //     MdBusiness,
// //     MdReceipt,
// //     MdAttachMoney,
// //     MdLocalOffer,
// // } from "react-icons/md";
// // import Table from "../../components/common/Table";
// // import Button from "../../components/common/Button";
// // import Pagination from "../../components/common/Pagination";
// // import FormModal from "../../components/common/FormModal";
// // import ConfirmDialog from "../../components/common/ConfirmDialog";
// // import ViewModal, { ViewRow } from "../../components/common/ViewModal";
// // import { invoiceService } from "../../services/invoice.service";
// // import companyService from "../../services/company.service";
// // import { subscriptionTransactionService } from "../../services/subscriptionTransaction.service";
// // import { showSuccess, showError } from "../../utils/toast";
// // import { formatDate } from "../../utils/helpers";
// // import { fetchUsers } from "../../utils/getUserName";

// // const Invoices = () => {
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
// //     const [userNameCache, setUserNameCache] = useState({});

// //     const getUserNameCached = (userId) => {
// //         if (!userId) return "-";
// //         return userNameCache[userId] || `User ${userId}`;
// //     };

// //     // Reference data
// //     const [companies, setCompanies] = useState([]);
// //     const [transactions, setTransactions] = useState([]);
// //     const [loadingRefData, setLoadingRefData] = useState(false);

// //     const normalizeInvoice = (item) => ({
// //         id: item.id || item._id,
// //         invoice_no: item.invoice_no || "",
// //         gst_number: item.gst_number || "",
// //         billing_address: item.billing_address || "",
// //         subtotal: parseFloat(item.subtotal) || 0,
// //         gst: parseFloat(item.gst) || 0,
// //         grand_total: parseFloat(item.grand_total) || 0,
// //         pdf_url: item.pdf_url || null,
// //         invoice_status: item.invoice_status || "",
// //         due_date: item.due_date || null,
// //         is_trending: item.is_trending === 1 || item.is_trending === true,
// //         is_status: item.is_status === 1 || item.is_status === true,
// //         status: item.is_status === 1 || item.is_status === true,
// //         created_by: item.created_by || null,
// //         updated_by: item.updated_by || null,
// //         createdAt: item.created_at || item.createdAt || null,
// //         updatedAt: item.updated_at || item.updatedAt || null,
// //         Company: item.Company || null,
// //         SubscriptionTransaction: item.SubscriptionTransaction || null,
// //         company_name: item.Company?.company_name || "",
// //         company_id: item.Company?.company_id || "",
// //         transaction_id: item.SubscriptionTransaction?.transaction_id || "",
// //         transaction_invoice_no: item.SubscriptionTransaction?.invoice_no || "",
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
// //         setLoadingRefData(true);
// //         try {
// //             const [companiesRes, transactionsRes] = await Promise.all([
// //                 companyService.getAll({ limit: 1000 }),
// //                 subscriptionTransactionService.getAll({ limit: 1000 })
// //             ]);

// //             const companiesData = companiesRes.data?.data || companiesRes.data || [];
// //             const transactionsData = transactionsRes.data?.data || transactionsRes.data || [];

// //             setCompanies(Array.isArray(companiesData) ? companiesData : []);
// //             setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
// //         } catch (error) {
// //             console.error("Failed to fetch reference data:", error);
// //         } finally {
// //             setLoadingRefData(false);
// //         }
// //     };

// //     const load = async () => {
// //         setLoading(true);
// //         try {
// //             const users = await fetchUsers();
// //             const userMap = {};
// //             Object.keys(users).forEach(id => {
// //                 userMap[id] = users[id].name;
// //             });
// //             setUserNameCache(userMap);
// //             const r = await invoiceService.getAll({ limit: 1000 });
// //             const rawData = r.data?.data || r.data?.results || r.data || [];
// //             const invoices = Array.isArray(rawData) ? rawData.map(normalizeInvoice) : [];
// //             const sortedInvoices = invoices.sort((a, b) => {
// //                 return new Date(b.createdAt) - new Date(a.createdAt);
// //             });
// //             setData(sortedInvoices);
// //         } catch (error) {
// //             console.error('Load error:', error);
// //             showError(error.message || "Failed to load invoices");
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
// //                 String(item.invoice_status ?? "").toLowerCase().includes(query) ||
// //                 String(item.gst_number ?? "").toLowerCase().includes(query)
// //             );
// //         }
// //         return result;
// //     }, [data, search, statusFilter]);

// //     const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

// //     const activeCount = data.filter((r) => getStatusValue(r)).length;
// //     const inactiveCount = data.length - activeCount;

// //     const getInvoiceStatusColor = (status) => {
// //         const statusMap = {
// //             'Paid': 'green',
// //             'paid': 'green',
// //             'Pending': 'yellow',
// //             'pending': 'yellow',
// //             'Overdue': 'red',
// //             'overdue': 'red',
// //             'Cancelled': 'gray',
// //             'cancelled': 'gray',
// //         };
// //         return statusMap[status] || 'purple';
// //     };

// //     const getFormFields = (editData = null) => {
// //         const companyOptions = companies.map(c => ({
// //             value: c.id || c._id || c.company_id,
// //             label: c.company_name || `Company #${c.id}`
// //         }));

// //         const transactionOptions = transactions.map(t => ({
// //             value: t.id || t._id || t.transaction_id,
// //             label: `${t.invoice_no || `Transaction #${t.id}`} - ₹${parseFloat(t.final_amount || 0).toFixed(2)}`
// //         }));

// //         const invoiceStatusOptions = [
// //             { value: 'Paid', label: 'Paid' },
// //             { value: 'Pending', label: 'Pending' },
// //             { value: 'Overdue', label: 'Overdue' },
// //             { value: 'Cancelled', label: 'Cancelled' },
// //         ];

// //         return [
// //             {
// //                 name: "company_id",
// //                 label: "Company",
// //                 type: "select",
// //                 required: true,
// //                 options: companyOptions,
// //                 placeholder: loadingRefData ? "Loading companies..." : "Select company",
// //                 help: "Select the company this invoice belongs to",
// //                 disabled: loadingRefData
// //             },
// //             {
// //                 name: "transaction_id",
// //                 label: "Transaction (Optional)",
// //                 type: "select",
// //                 required: false,
// //                 options: [{ value: "", label: "No Transaction" }, ...transactionOptions],
// //                 placeholder: "Select transaction",
// //                 help: "Select the associated transaction if any"
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
// //                 name: "gst_number",
// //                 label: "GST Number",
// //                 type: "text",
// //                 required: false,
// //                 placeholder: "e.g. 24ABCDE1234F1Z5",
// //                 help: "GST number of the company"
// //             },
// //             {
// //                 name: "billing_address",
// //                 label: "Billing Address",
// //                 type: "textarea",
// //                 required: true,
// //                 placeholder: "Enter billing address...",
// //                 rows: 3,
// //                 help: "Complete billing address"
// //             },
// //             {
// //                 name: "subtotal",
// //                 label: "Subtotal (₹)",
// //                 type: "number",
// //                 required: true,
// //                 min: 0,
// //                 step: "0.01",
// //                 help: "Amount before GST"
// //             },
// //             {
// //                 name: "gst",
// //                 label: "GST Amount (₹)",
// //                 type: "number",
// //                 required: true,
// //                 min: 0,
// //                 step: "0.01",
// //                 help: "GST amount applied"
// //             },
// //             {
// //                 name: "grand_total",
// //                 label: "Grand Total (₹)",
// //                 type: "number",
// //                 required: true,
// //                 min: 0,
// //                 step: "0.01",
// //                 help: "Final total after GST"
// //             },
// //             {
// //                 name: "invoice_status",
// //                 label: "Invoice Status",
// //                 type: "select",
// //                 required: true,
// //                 options: invoiceStatusOptions,
// //                 placeholder: "Select status",
// //                 help: "Current status of the invoice"
// //             },
// //             {
// //                 name: "due_date",
// //                 label: "Due Date",
// //                 type: "date",
// //                 required: true,
// //                 help: "Payment due date"
// //             },
// //             // FIX: Use a different name for the file input
// //             {
// //                 name: "pdf_file",
// //                 label: "PDF Document",
// //                 type: "file",
// //                 required: false,
// //                 accept: ".pdf",
// //                 maxSize: 10,
// //                 help: "Upload PDF invoice file (Max 10MB)",
// //                 placeholder: "Click or drag to upload PDF",
// //                 existingFile: editData?.pdf_url ? invoiceService.getPdfUrl(editData.pdf_url) : null
// //             },
// //             {
// //                 name: "is_trending",
// //                 label: "Mark as Trending",
// //                 type: "checkbox",
// //                 color: "text-yellow-500 focus:ring-yellow-500",
// //                 help: "Highlight this invoice as trending"
// //             },
// //             {
// //                 name: "is_status",
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
// //         invoice_no: {
// //             required: true,
// //             requiredMessage: 'Invoice number is required',
// //             custom: (value) => {
// //                 const exists = data.some(item =>
// //                     item.invoice_no?.toLowerCase() === value.toLowerCase() &&
// //                     (!editItem || item.id !== editItem.id)
// //                 );
// //                 if (exists) {
// //                     return 'This invoice number already exists';
// //                 }
// //                 return null;
// //             }
// //         },
// //         billing_address: {
// //             required: true,
// //             requiredMessage: 'Billing address is required',
// //             minLength: 5,
// //             minLengthMessage: 'Address must be at least 5 characters'
// //         },
// //         subtotal: {
// //             required: true,
// //             requiredMessage: 'Subtotal is required',
// //             min: 0,
// //             minMessage: 'Subtotal must be greater than or equal to 0'
// //         },
// //         gst: {
// //             required: true,
// //             requiredMessage: 'GST amount is required',
// //             min: 0,
// //             minMessage: 'GST must be greater than or equal to 0'
// //         },
// //         grand_total: {
// //             required: true,
// //             requiredMessage: 'Grand total is required',
// //             min: 0,
// //             minMessage: 'Grand total must be greater than or equal to 0'
// //         },
// //         invoice_status: {
// //             required: true,
// //             requiredMessage: 'Please select an invoice status'
// //         },
// //         due_date: {
// //             required: true,
// //             requiredMessage: 'Due date is required',
// //             custom: (value) => {
// //                 if (value) {
// //                     const today = new Date();
// //                     today.setHours(0, 0, 0, 0);
// //                     const dueDate = new Date(value);
// //                     if (dueDate < today) {
// //                         return 'Due date cannot be in the past';
// //                     }
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

// //     // FIXED: handleSubmit with proper PDF handling
// //     const handleSubmit = async (formData) => {
// //         setFormLoading(true);
// //         try {
// //             const submitData = {
// //                 company_id: parseInt(formData.company_id),
// //                 transaction_id: formData.transaction_id ? parseInt(formData.transaction_id) : null,
// //                 invoice_no: formData.invoice_no,
// //                 gst_number: formData.gst_number || "",
// //                 billing_address: formData.billing_address,
// //                 subtotal: parseFloat(formData.subtotal) || 0,
// //                 gst: parseFloat(formData.gst) || 0,
// //                 grand_total: parseFloat(formData.grand_total) || 0,
// //                 invoice_status: formData.invoice_status,
// //                 due_date: formData.due_date,
// //                 is_trending: formData.is_trending || false,
// //                 is_status: formData.is_status === "active" ? 1 : 0,
// //             };

// //             // FIX: Check if pdf_file exists and is a File
// //             if (formData.pdf_file && formData.pdf_file instanceof File) {
// //                 console.log('PDF File detected:', formData.pdf_file.name);
// //                 submitData.pdf_url = formData.pdf_file; // Use pdf_url for the service
// //             } else if (editItem && editItem.pdf_url) {
// //                 // Keep existing PDF URL if no new file
// //                 submitData.pdf_url = editItem.pdf_url;
// //             }

// //             console.log('Submitting data:', submitData);

// //             if (editItem) {
// //                 await invoiceService.update(editItem.id, submitData);
// //                 showSuccess("Invoice updated successfully");
// //             } else {
// //                 await invoiceService.create(submitData);
// //                 showSuccess("Invoice created successfully");
// //             }
// //             setModalOpen(false);
// //             load();
// //         } catch (error) {
// //             console.error('Submit error:', error);
// //             const errorMessage = error?.response?.data?.message || error?.message || "Failed to save";
// //             showError(errorMessage);
// //         } finally {
// //             setFormLoading(false);
// //         }
// //     };

// //     const handleDelete = async () => {
// //         setDeleteLoading(true);
// //         try {
// //             await invoiceService.delete(deleteId);
// //             showSuccess("Invoice deleted successfully");
// //             load();
// //         } catch (error) {
// //             console.error('Delete error:', error);
// //             showError(error.message || "Failed to delete invoice");
// //         } finally {
// //             setDeleteId(null);
// //             setDeleteLoading(false);
// //         }
// //     };

// //     const handleStatusToggle = async (row) => {
// //         const currentStatus = getStatusValue(row);
// //         const newStatus = !currentStatus;

// //         try {
// //             await invoiceService.update(row.id, {
// //                 is_status: newStatus ? 1 : 0
// //             });
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
// //             await invoiceService.update(row.id, {
// //                 is_trending: newValue ? 1 : 0
// //             });
// //             showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
// //             load();
// //         } catch (error) {
// //             console.error('Trending toggle error:', error);
// //             showError(error.response?.data?.message || error.message || "Failed to update trending");
// //         }
// //     };

// //     const getCreatedByName = (row) => {
// //         if (!row) return "-";
// //         if (row.created_by) {
// //             return getUserNameCached(row.created_by);
// //         }
// //         return "-";
// //     };

// //     const getUpdatedByName = (row) => {
// //         if (!row) return "-";
// //         if (row.updated_by) {
// //             return getUserNameCached(row.updated_by);
// //         }
// //         return "-";
// //     };

// //     const handleDownloadPdf = (row) => {
// //         if (!row.pdf_url) {
// //             showError("No PDF file available");
// //             return;
// //         }
// //         const pdfUrl = invoiceService.getPdfUrl(row.pdf_url);
// //         if (pdfUrl) {
// //             window.open(pdfUrl, '_blank');
// //         } else {
// //             showError("Invalid PDF URL");
// //         }
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
// //             render: (v, row) => (
// //                 <div>
// //                     <span className="font-medium text-gray-800">{v}</span>
// //                     <div className="flex items-center gap-1 mt-0.5">
// //                         <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-${getInvoiceStatusColor(row.invoice_status)}-50 text-${getInvoiceStatusColor(row.invoice_status)}-700`}>
// //                             {row.invoice_status || "Unknown"}
// //                         </span>
// //                         {row.pdf_url && (
// //                             <button
// //                                 onClick={() => handleDownloadPdf(row)}
// //                                 className="text-[#4529f7] hover:text-[#2c0eee]"
// //                                 title="Download PDF"
// //                             >
// //                                 <MdPictureAsPdf size={14} />
// //                             </button>
// //                         )}
// //                     </div>
// //                 </div>
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
// //             header: "Amount",
// //             key: "grand_total",
// //             render: (v, row) => (
// //                 <div>
// //                     <span className="font-semibold text-gray-800">₹{v?.toFixed(2)}</span>
// //                     <span className="text-xs text-gray-400 ml-1">
// //                         (Subtotal: ₹{row.subtotal?.toFixed(2)})
// //                     </span>
// //                 </div>
// //             ),
// //         },
// //         {
// //             header: "GST",
// //             key: "gst",
// //             render: (v) => (
// //                 <span className="text-gray-600">₹{v?.toFixed(2)}</span>
// //             ),
// //         },
// //         {
// //             header: "Due Date",
// //             key: "due_date",
// //             render: (v) => {
// //                 const dueDate = new Date(v);
// //                 const today = new Date();
// //                 const isOverdue = dueDate < today;
// //                 return (
// //                     <span className={`text-sm ${isOverdue ? "text-red-500" : "text-gray-500"}`}>
// //                         {formatDate(v)}
// //                         {isOverdue && <span className="ml-1 text-xs text-red-500">(Overdue)</span>}
// //                     </span>
// //                 );
// //             },
// //         },
// //         {
// //             header: "Trending",
// //             key: "is_trending",
// //             render: (value, row) => (
// //                 <button
// //                     onClick={() => handleTrendingToggle(row)}
// //                     className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"}`}
// //                 >
// //                     <span
// //                         className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"}`}
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
// //             header: "Created By",
// //             key: "created_by",
// //             render: (_, row) => (
// //                 <span className="text-gray-500 text-sm font-medium">
// //                     {getCreatedByName(row)}
// //                 </span>
// //             ),
// //         },
// //         {
// //             header: "Updated By",
// //             key: "updated_by",
// //             render: (_, row) => (
// //                 <span className="text-gray-500 text-sm font-medium">
// //                     {getUpdatedByName(row)}
// //                 </span>
// //             ),
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
// //                     <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
// //                     <p className="text-sm text-gray-500 mt-1">Manage all invoices</p>
// //                 </div>
// //                 <Button icon={MdAdd} onClick={openAdd}>
// //                     Add Invoice
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
// //                             placeholder="Search invoices..."
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
// //                     emptyMessage="No invoices found"
// //                 />

// //                 {/* Footer */}
// //                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
// //                     <p className="text-xs text-gray-400">
// //                         Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
// //                         {"–"}
// //                         {Math.min(page * limit, filteredData.length)} of {filteredData.length} invoices
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
// //                 title={editItem ? "Edit Invoice" : "Add Invoice"}
// //                 fields={getFormFields(editItem)}
// //                 initialData={editItem ? {
// //                     company_id: editItem.company_id || "",
// //                     transaction_id: editItem.transaction_id || "",
// //                     invoice_no: editItem.invoice_no || "",
// //                     gst_number: editItem.gst_number || "",
// //                     billing_address: editItem.billing_address || "",
// //                     subtotal: editItem.subtotal || 0,
// //                     gst: editItem.gst || 0,
// //                     grand_total: editItem.grand_total || 0,
// //                     invoice_status: editItem.invoice_status || "",
// //                     due_date: editItem.due_date ? new Date(editItem.due_date).toISOString().split('T')[0] : "",
// //                     is_trending: editItem.is_trending || false,
// //                     is_status: getStatusValue(editItem) ? "active" : "inactive"
// //                 } : {
// //                     company_id: "",
// //                     transaction_id: "",
// //                     invoice_no: "",
// //                     gst_number: "",
// //                     billing_address: "",
// //                     subtotal: 0,
// //                     gst: 0,
// //                     grand_total: 0,
// //                     invoice_status: "",
// //                     due_date: "",
// //                     is_trending: false,
// //                     is_status: "active"
// //                 }}
// //                 validationRules={validationRules}
// //                 loading={formLoading}
// //                 submitLabel={editItem ? "Update" : "Create"}
// //                 size="lg"
// //                 existingFile={editItem?.pdf_url ? invoiceService.getPdfUrl(editItem.pdf_url) : null}
// //             />

// //             {/* View Modal */}
// //             <ViewModal
// //                 isOpen={viewModalOpen}
// //                 onClose={() => {
// //                     setViewModalOpen(false);
// //                     setViewData(null);
// //                 }}
// //                 title="Invoice Details"
// //                 size="lg"
// //             >
// //                 {viewData && (
// //                     <div className="space-y-4">
// //                         {/* Header with Invoice */}
// //                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
// //                             <div>
// //                                 <span className="text-xs text-gray-400">Invoice Number</span>
// //                                 <p className="font-bold text-lg text-gray-800">{viewData.invoice_no}</p>
// //                             </div>
// //                             <div className="text-right">
// //                                 <span className="text-xs text-gray-400">Grand Total</span>
// //                                 <p className="font-bold text-2xl text-[#2c0eee]">₹{viewData.grand_total?.toFixed(2)}</p>
// //                             </div>
// //                         </div>

// //                         {/* Company & Status */}
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                             <div className="space-y-3">
// //                                 <ViewRow
// //                                     label="Company"
// //                                     value={
// //                                         <div className="flex items-center gap-2">
// //                                             <MdBusiness className="text-gray-400" />
// //                                             <span className="font-medium">{viewData.company_name || "-"}</span>
// //                                         </div>
// //                                     }
// //                                 />
// //                                 <ViewRow label="GST Number" value={viewData.gst_number || "-"} />
// //                                 <ViewRow label="Billing Address" value={viewData.billing_address || "-"} />
// //                             </div>
// //                             <div className="space-y-3">
// //                                 <ViewRow
// //                                     label="Invoice Status"
// //                                     value={
// //                                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${getInvoiceStatusColor(viewData.invoice_status)}-50 text-${getInvoiceStatusColor(viewData.invoice_status)}-700`}>
// //                                             <span className={`w-1.5 h-1.5 rounded-full bg-${getInvoiceStatusColor(viewData.invoice_status)}-500`} />
// //                                             {viewData.invoice_status || "Unknown"}
// //                                         </span>
// //                                     }
// //                                 />
// //                                 <ViewRow label="Due Date" value={formatDate(viewData.due_date)} />
// //                                 {viewData.transaction_id && (
// //                                     <ViewRow label="Transaction ID" value={`#${viewData.transaction_id}`} />
// //                                 )}
// //                             </div>
// //                         </div>

// //                         {/* Amount Breakdown */}
// //                         <div className="border-t border-gray-100 pt-4">
// //                             <h4 className="text-sm font-medium text-gray-700 mb-3">Amount Breakdown</h4>
// //                             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //                                 <div className="bg-gray-50 p-3 rounded-lg text-center">
// //                                     <p className="text-xs text-gray-400">Subtotal</p>
// //                                     <p className="font-semibold text-gray-700">₹{viewData.subtotal?.toFixed(2)}</p>
// //                                 </div>
// //                                 <div className="bg-gray-50 p-3 rounded-lg text-center">
// //                                     <p className="text-xs text-gray-400">GST</p>
// //                                     <p className="font-semibold text-gray-700">₹{viewData.gst?.toFixed(2)}</p>
// //                                 </div>
// //                                 <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
// //                                     <p className="text-xs text-gray-400">Grand Total</p>
// //                                     <p className="font-bold text-[#2c0eee]">₹{viewData.grand_total?.toFixed(2)}</p>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* PDF Download */}
// //                         {viewData.pdf_url && (
// //                             <div className="border-t border-gray-100 pt-4">
// //                                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
// //                                     <MdPictureAsPdf size={24} className="text-red-500" />
// //                                     <div className="flex-1">
// //                                         <p className="text-sm font-medium text-gray-700">PDF Document</p>
// //                                         <p className="text-xs text-gray-500">Click to view or download</p>
// //                                     </div>
// //                                     <button
// //                                         onClick={() => handleDownloadPdf(viewData)}
// //                                         className="flex items-center gap-1 px-3 py-1.5 bg-[#2c0eee] text-white rounded-lg text-sm hover:bg-[#2c0eee] transition-colors"
// //                                     >
// //                                         <MdDownload size={16} />
// //                                         Download PDF
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         )}

// //                         {/* Trending & Status */}
// //                         <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
// //                             <ViewRow
// //                                 label="Trending"
// //                                 value={
// //                                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_trending
// //                                         ? "bg-yellow-50 text-yellow-700"
// //                                         : "bg-gray-100 text-gray-500"
// //                                         }`}>
// //                                         <span className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`} />
// //                                         {viewData.is_trending ? "Trending" : "Not Trending"}
// //                                     </span>
// //                                 }
// //                             />
// //                             <ViewRow
// //                                 label="Status"
// //                                 value={
// //                                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusValue(viewData)
// //                                         ? "bg-green-50 text-green-700"
// //                                         : "bg-gray-100 text-gray-500"
// //                                         }`}>
// //                                         <span className={`w-1.5 h-1.5 rounded-full ${getStatusValue(viewData) ? "bg-green-500" : "bg-gray-400"}`} />
// //                                         {getStatusValue(viewData) ? "Active" : "Inactive"}
// //                                     </span>
// //                                 }
// //                             />
// //                         </div>

// //                         {/* Footer */}
// //                         <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
// //                             <ViewRow label="Created At" value={formatDate(viewData.createdAt)} />
// //                             {viewData.updatedAt && (
// //                                 <ViewRow label="Updated At" value={formatDate(viewData.updatedAt)} />
// //                             )}
// //                             <ViewRow label="Created By" value={getCreatedByName(viewData)} />
// //                         </div>
// //                     </div>
// //                 )}
// //             </ViewModal>

// //             <ConfirmDialog
// //                 isOpen={!!deleteId}
// //                 onClose={() => setDeleteId(null)}
// //                 onConfirm={handleDelete}
// //                 loading={deleteLoading}
// //                 title="Delete Invoice"
// //                 message="Delete this invoice? This action cannot be undone."
// //             />
// //         </div>
// //     );
// // };

// // export default Invoices;

// import React, { useState, useEffect } from "react";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdPictureAsPdf,
//   MdDownload,
//   MdBusiness,
//   MdReceipt,
//   MdAttachMoney,
//   MdLocalOffer,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import FormModal from "../../components/common/FormModal";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow } from "../../components/common/ViewModal";
// import { invoiceService } from "../../services/invoice.service";
// import companyService from "../../services/company.service";
// import { subscriptionTransactionService } from "../../services/subscriptionTransaction.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const Invoices = () => {
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
//   const [userNameCache, setUserNameCache] = useState({});
//   const [transactionCache, setTransactionCache] = useState({});
//   // State for transaction details in form
//   const [selectedTransactionData, setSelectedTransactionData] = useState(null);

//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // Reference data
//   const [companies, setCompanies] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [loadingRefData, setLoadingRefData] = useState(false);

//   // Get transaction data from cache or fetch
//   const getTransactionData = async (transactionId) => {
//     if (!transactionId) return null;

//     // Check cache first
//     if (transactionCache[transactionId]) {
//       return transactionCache[transactionId];
//     }

//     try {
//       const transRes =
//         await subscriptionTransactionService.getById(transactionId);
//       const transData = transRes.data?.data || transRes.data || transRes;

//       // Cache the transaction data
//       setTransactionCache((prev) => ({
//         ...prev,
//         [transactionId]: transData,
//       }));

//       return transData;
//     } catch (error) {
//       console.warn(`Failed to fetch transaction ${transactionId}:`, error);
//       return null;
//     }
//   };

//   const normalizeInvoice = (item, transactionData = null) => {
//     // Calculate subtotal as (base_price - discount_price) from transaction
//     let calculatedSubtotal = parseFloat(item.subtotal) || 0;
//     let gstAmount = parseFloat(item.gst) || 0;
//     let basePrice = 0;
//     let discountPrice = 0;

//     if (transactionData) {
//       basePrice = parseFloat(transactionData.base_price) || 0;
//       discountPrice = parseFloat(transactionData.discount_price) || 0;
//       calculatedSubtotal = basePrice - discountPrice;
//       gstAmount = parseFloat(transactionData.gst_amount) || 0;
//     }

//     return {
//       id: item.id || item._id,
//       invoice_no: item.invoice_no || "",
//       gst_number: item.gst_number || "",
//       billing_address: item.billing_address || "",
//       subtotal: calculatedSubtotal,
//       gst: gstAmount,
//       grand_total: parseFloat(item.grand_total) || 0,
//       pdf_url: item.pdf_url || null,
//       invoice_status: item.invoice_status || "",
//       due_date: item.due_date || null,
//       is_trending: item.is_trending === 1 || item.is_trending === true,
//       is_status: item.is_status === 1 || item.is_status === true,
//       status: item.is_status === 1 || item.is_status === true,
//       created_by: item.created_by || null,
//       updated_by: item.updated_by || null,
//       createdAt: item.created_at || item.createdAt || null,
//       updatedAt: item.updated_at || item.updatedAt || null,
//       Company: item.Company || null,
//       SubscriptionTransaction: transactionData || item.SubscriptionTransaction,
//       company_name: item.Company?.company_name || "",
//       company_id: item.Company?.company_id || "",
//       transaction_id:
//         transactionData?.id || item.SubscriptionTransaction?.id || "",
//       transaction_no:
//         transactionData?.transaction_no ||
//         item.SubscriptionTransaction?.transaction_no ||
//         "",
//       // Store transaction data for display
//       transaction_base_price: basePrice,
//       transaction_discount_price: discountPrice,
//       transaction_gst_amount: gstAmount,
//       transaction_final_amount: parseFloat(transactionData?.final_amount) || 0,
//       raw: item,
//     };
//   };

//   const getStatusValue = (row) => {
//     if (row.is_status !== undefined) {
//       return row.is_status;
//     }
//     if (row.status !== undefined) {
//       return row.status === 1 || row.status === true;
//     }
//     return true;
//   };

//   // Fetch reference data
//   const fetchReferenceData = async () => {
//     setLoadingRefData(true);
//     try {
//       const [companiesRes, transactionsRes] = await Promise.all([
//         companyService.getAll({ limit: 1000 }),
//         subscriptionTransactionService.getAll({ limit: 1000 }),
//       ]);

//       const companiesData = companiesRes.data?.data || companiesRes.data || [];
//       const transactionsData =
//         transactionsRes.data?.data || transactionsRes.data || [];

//       setCompanies(Array.isArray(companiesData) ? companiesData : []);
//       setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
//     } catch (error) {
//       console.error("Failed to fetch reference data:", error);
//     } finally {
//       setLoadingRefData(false);
//     }
//   };

//   const load = async () => {
//     setLoading(true);
//     try {
//       // Fetch users
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach((id) => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);

//       // Fetch invoices
//       const r = await invoiceService.getAll({ limit: 1000 });
//       const rawData = r.data?.data || r.data?.results || r.data || [];

//       // Fetch transaction details for each invoice
//       const invoicesWithTransactions = await Promise.all(
//         Array.isArray(rawData)
//           ? rawData.map(async (item) => {
//               // Get transaction ID from invoice
//               const transactionId =
//                 item.transaction_id || item.SubscriptionTransaction?.id;

//               if (transactionId) {
//                 const transData = await getTransactionData(transactionId);
//                 return {
//                   ...item,
//                   _transactionData: transData,
//                 };
//               }
//               return item;
//             })
//           : [],
//       );

//       const invoices = invoicesWithTransactions.map((item) =>
//         normalizeInvoice(item, item._transactionData),
//       );

//       const sortedInvoices = invoices.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setData(sortedInvoices);
//     } catch (error) {
//       console.error("Load error:", error);
//       showError(error.message || "Failed to load invoices");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     fetchReferenceData();
//   }, []);

//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   // Reset selected transaction data when modal closes
//   useEffect(() => {
//     if (!modalOpen) {
//       setSelectedTransactionData(null);
//     }
//   }, [modalOpen]);

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
//           String(item.invoice_status ?? "")
//             .toLowerCase()
//             .includes(query) ||
//           String(item.gst_number ?? "")
//             .toLowerCase()
//             .includes(query),
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => getStatusValue(r)).length;
//   const inactiveCount = data.length - activeCount;

//   const getInvoiceStatusColor = (status) => {
//     const statusMap = {
//       Paid: "green",
//       paid: "green",
//       Pending: "yellow",
//       pending: "yellow",
//       Overdue: "red",
//       overdue: "red",
//       Cancelled: "gray",
//       cancelled: "gray",
//     };
//     return statusMap[status] || "purple";
//   };

//   // NEW: Handle transaction selection and auto-calculate subtotal
//   const handleTransactionSelect = async (
//     transactionId,
//     formData,
//     setFormData,
//   ) => {
//     if (!transactionId) {
//       setSelectedTransactionData(null);
//       // Reset subtotal and gst when no transaction selected
//       setFormData((prev) => ({
//         ...prev,
//         subtotal: 0,
//         gst: 0,
//         grand_total: 0,
//       }));
//       return;
//     }

//     try {
//       const transData = await getTransactionData(transactionId);
//       if (transData) {
//         const basePrice = parseFloat(transData.base_price) || 0;
//         const discountPrice = parseFloat(transData.discount_price) || 0;
//         const gstAmount = parseFloat(transData.gst_amount) || 0;
//         const subtotal = basePrice - discountPrice;
//         const grandTotal = subtotal + gstAmount;

//         setSelectedTransactionData(transData);

//         // Auto-fill form fields
//         setFormData((prev) => ({
//           ...prev,
//           subtotal: subtotal,
//           gst: gstAmount,
//           grand_total: grandTotal,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching transaction data:", error);
//       showError("Failed to fetch transaction details");
//     }
//   };

//   const getFormFields = (editData = null) => {
//     const companyOptions = companies.map((c) => ({
//       value: c.id || c._id || c.company_id,
//       label: c.company_name || `Company #${c.id}`,
//     }));

//     const transactionOptions = transactions.map((t) => ({
//       value: t.id || t._id || t.transaction_id,
//       label: `${t.transaction_no || `Transaction #${t.id}`} - ₹${parseFloat(t.final_amount || 0).toFixed(2)}`,
//     }));

//     const invoiceStatusOptions = [
//       { value: "Paid", label: "Paid" },
//       { value: "Pending", label: "Pending" },
//       { value: "Overdue", label: "Overdue" },
//       { value: "Cancelled", label: "Cancelled" },
//     ];

//     return [
//       {
//         name: "company_id",
//         label: "Company",
//         type: "select",
//         required: true,
//         options: companyOptions,
//         placeholder: loadingRefData ? "Loading companies..." : "Select company",
//         help: "Select the company this invoice belongs to",
//         disabled: loadingRefData,
//       },
//       {
//         name: "transaction_id",
//         label: "Transaction",
//         type: "select",
//         required: true,
//         options: [
//           { value: "", label: "Select Transaction" },
//           ...transactionOptions,
//         ],
//         placeholder: "Select transaction",
//         help: "Select a transaction to auto-calculate subtotal (Base Price - Discount)",
//         onChange: (value, formData, setFormData) => {
//           handleTransactionSelect(value, formData, setFormData);
//         },
//       },
//       {
//         name: "invoice_no",
//         label: "Invoice Number",
//         type: "text",
//         required: true,
//         placeholder: "e.g. INV-20260713-001",
//         help: "Unique invoice number",
//       },
//       {
//         name: "gst_number",
//         label: "GST Number",
//         type: "text",
//         required: false,
//         placeholder: "e.g. 24ABCDE1234F1Z5",
//         help: "GST number of the company",
//       },
//       {
//         name: "billing_address",
//         label: "Billing Address",
//         type: "textarea",
//         required: true,
//         placeholder: "Enter billing address...",
//         rows: 3,
//         help: "Complete billing address",
//       },
//     //   {
//     //     name: "subtotal",
//     //     label: "Subtotal (₹)",
//     //     type: "number",
//     //     required: true,
//     //     min: 0,
//     //     step: "0.01",
//     //     help: "Auto-calculated from transaction (Base Price - Discount)",
//     //     disabled: true,
//     //     className: "bg-gray-100 cursor-not-allowed",
//     //   },
//     //   {
//     //     name: "gst",
//     //     label: "GST Amount (₹)",
//     //     type: "number",
//     //     required: true,
//     //     min: 0,
//     //     step: "0.01",
//     //     help: "Auto-filled from transaction",
//     //     disabled: true,
//     //     className: "bg-gray-100 cursor-not-allowed",
//     //   },
//     //   {
//     //     name: "grand_total",
//     //     label: "Grand Total (₹)",
//     //     type: "number",
//     //     required: true,
//     //     min: 0,
//     //     step: "0.01",
//     //     help: "Subtotal + GST (Auto-calculated)",
//     //     disabled: true,
//     //     className: "bg-gray-100 cursor-not-allowed",
//     //   },
//       {
//         name: "invoice_status",
//         label: "Invoice Status",
//         type: "select",
//         required: true,
//         options: invoiceStatusOptions,
//         placeholder: "Select status",
//         help: "Current status of the invoice",
//       },
//       {
//         name: "due_date",
//         label: "Due Date",
//         type: "date",
//         required: true,
//         help: "Payment due date",
//       },
//       {
//         name: "pdf_file",
//         label: "PDF Document",
//         type: "file",
//         required: false,
//         accept: ".pdf",
//         maxSize: 10,
//         help: "Upload PDF invoice file (Max 10MB)",
//         placeholder: "Click or drag to upload PDF",
//         existingFile: editData?.pdf_url
//           ? invoiceService.getPdfUrl(editData.pdf_url)
//           : null,
//       },
//       {
//         name: "is_trending",
//         label: "Mark as Trending",
//         type: "checkbox",
//         color: "text-yellow-500 focus:ring-yellow-500",
//         help: "Highlight this invoice as trending",
//       },
//       {
//         name: "is_status",
//         label: "Status",
//         type: "radio",
//         options: [
//           { value: "active", label: "Active" },
//           { value: "inactive", label: "Inactive" },
//         ],
//         color: "text-[#2c0eee] focus:ring-[#4529f7]",
//       },
//     ];
//   };

//   const validationRules = {
//     company_id: {
//       required: true,
//       requiredMessage: "Please select a company",
//     },
//     transaction_id: {
//       required: true,
//       requiredMessage: "Please select a transaction",
//     },
//     invoice_no: {
//       required: true,
//       requiredMessage: "Invoice number is required",
//       custom: (value) => {
//         const exists = data.some(
//           (item) =>
//             item.invoice_no?.toLowerCase() === value.toLowerCase() &&
//             (!editItem || item.id !== editItem.id),
//         );
//         if (exists) {
//           return "This invoice number already exists";
//         }
//         return null;
//       },
//     },
//     billing_address: {
//       required: true,
//       requiredMessage: "Billing address is required",
//       minLength: 5,
//       minLengthMessage: "Address must be at least 5 characters",
//     },
//     subtotal: {
//       required: true,
//       requiredMessage: "Subtotal is required",
//       min: 0,
//       minMessage: "Subtotal must be greater than or equal to 0",
//     },
//     gst: {
//       required: true,
//       requiredMessage: "GST amount is required",
//       min: 0,
//       minMessage: "GST must be greater than or equal to 0",
//     },
//     grand_total: {
//       required: true,
//       requiredMessage: "Grand total is required",
//       min: 0,
//       minMessage: "Grand total must be greater than or equal to 0",
//     },
//     invoice_status: {
//       required: true,
//       requiredMessage: "Please select an invoice status",
//     },
//     due_date: {
//       required: true,
//       requiredMessage: "Due date is required",
//       custom: (value) => {
//         if (value) {
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
//           const dueDate = new Date(value);
//           if (dueDate < today) {
//             return "Due date cannot be in the past";
//           }
//         }
//         return null;
//       },
//     },
//   };

//   const openAdd = () => {
//     setEditItem(null);
//     setSelectedTransactionData(null);
//     setModalOpen(true);
//   };

//   const openEdit = (item) => {
//     setEditItem(item);
//     setSelectedTransactionData(null);
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
//         company_id: parseInt(formData.company_id),
//         transaction_id: formData.transaction_id
//           ? parseInt(formData.transaction_id)
//           : null,
//         invoice_no: formData.invoice_no,
//         gst_number: formData.gst_number || "",
//         billing_address: formData.billing_address,
//         subtotal: parseFloat(formData.subtotal) || 0,
//         gst: parseFloat(formData.gst) || 0,
//         grand_total: parseFloat(formData.grand_total) || 0,
//         invoice_status: formData.invoice_status,
//         due_date: formData.due_date,
//         is_trending: formData.is_trending || false,
//         is_status: formData.is_status === "active" ? 1 : 0,
//       };

//       if (formData.pdf_file && formData.pdf_file instanceof File) {
//         console.log("PDF File detected:", formData.pdf_file.name);
//         submitData.pdf_url = formData.pdf_file;
//       } else if (editItem && editItem.pdf_url) {
//         submitData.pdf_url = editItem.pdf_url;
//       }

//       console.log("Submitting data:", submitData);

//       if (editItem) {
//         await invoiceService.update(editItem.id, submitData);
//         showSuccess("Invoice updated successfully");
//       } else {
//         await invoiceService.create(submitData);
//         showSuccess("Invoice created successfully");
//       }
//       setModalOpen(false);
//       load();
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error?.response?.data?.message || error?.message || "Failed to save";
//       showError(errorMessage);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await invoiceService.delete(deleteId);
//       showSuccess("Invoice deleted successfully");
//       load();
//     } catch (error) {
//       console.error("Delete error:", error);
//       showError(error.message || "Failed to delete invoice");
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   const handleStatusToggle = async (row) => {
//     const currentStatus = getStatusValue(row);
//     const newStatus = !currentStatus;

//     try {
//       await invoiceService.update(row.id, {
//         is_status: newStatus ? 1 : 0,
//       });
//       showSuccess(
//         `Status ${newStatus ? "activated" : "deactivated"} successfully`,
//       );
//       load();
//     } catch (error) {
//       console.error("Status toggle error:", error);
//       showError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update status",
//       );
//     }
//   };

//   const handleTrendingToggle = async (row) => {
//     const newValue = !row.is_trending;

//     try {
//       await invoiceService.update(row.id, {
//         is_trending: newValue ? 1 : 0,
//       });
//       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
//       load();
//     } catch (error) {
//       console.error("Trending toggle error:", error);
//       showError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update trending",
//       );
//     }
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

//   const handleDownloadPdf = (row) => {
//     if (!row.pdf_url) {
//       showError("No PDF file available");
//       return;
//     }
//     const pdfUrl = invoiceService.getPdfUrl(row.pdf_url);
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank");
//     } else {
//       showError("Invalid PDF URL");
//     }
//   };

//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1,
//     },
//     {
//       header: "Invoice",
//       key: "invoice_no",
//       render: (v, row) => (
//         <div>
//           <span className="font-medium text-gray-800">{v}</span>
//           <div className="flex items-center gap-1 mt-0.5">
//             <span
//               className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-${getInvoiceStatusColor(row.invoice_status)}-50 text-${getInvoiceStatusColor(row.invoice_status)}-700`}
//             >
//               {row.invoice_status || "Unknown"}
//             </span>
//             {row.pdf_url && (
//               <button
//                 onClick={() => handleDownloadPdf(row)}
//                 className="text-[#4529f7] hover:text-[#2c0eee]"
//                 title="Download PDF"
//               >
//                 <MdPictureAsPdf size={14} />
//               </button>
//             )}
//           </div>
//         </div>
//       ),
//     },
//     {
//       header: "Company",
//       key: "company_name",
//       render: (v) => <span className="text-gray-700">{v || "-"}</span>,
//     },
//     {
//       header: "Transaction No",
//       key: "transaction_no",
//       render: (v) => <span className="text-gray-500 text-sm">{v || "-"}</span>,
//     },
//     {
//       header: "Amount",
//       key: "grand_total",
//       render: (v, row) => (
//         <div>
//           <span className="font-semibold text-gray-800">₹{v?.toFixed(2)}</span>
//           <span className="text-xs text-gray-400 ml-1">
//             (Subtotal: ₹{row.subtotal?.toFixed(2)})
//           </span>
//         </div>
//       ),
//     },
//     {
//       header: "GST",
//       key: "gst",
//       render: (v) => <span className="text-gray-600">₹{v?.toFixed(2)}</span>,
//     },
//     {
//       header: "Due Date",
//       key: "due_date",
//       render: (v) => {
//         const dueDate = new Date(v);
//         const today = new Date();
//         const isOverdue = dueDate < today;
//         return (
//           <span
//             className={`text-sm ${isOverdue ? "text-red-500" : "text-gray-500"}`}
//           >
//             {formatDate(v)}
//             {isOverdue && (
//               <span className="ml-1 text-xs text-red-500">(Overdue)</span>
//             )}
//           </span>
//         );
//       },
//     },
//     {
//       header: "Trending",
//       key: "is_trending",
//       render: (value, row) => (
//         <button
//           onClick={() => handleTrendingToggle(row)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"}`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"}`}
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
//           <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage all invoices</p>
//         </div>
//         <Button icon={MdAdd} onClick={openAdd}>
//           Add Invoice
//         </Button>
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
//               placeholder="Search invoices..."
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
//           emptyMessage="No invoices found"
//         />

//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of{" "}
//             {filteredData.length} invoices
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

//       {/* Form Modal */}
//       <FormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         title={editItem ? "Edit Invoice" : "Add Invoice"}
//         fields={getFormFields(editItem)}
//         initialData={
//           editItem
//             ? {
//                 company_id: editItem.company_id || "",
//                 transaction_id: editItem.transaction_id || "",
//                 invoice_no: editItem.invoice_no || "",
//                 gst_number: editItem.gst_number || "",
//                 billing_address: editItem.billing_address || "",
//                 // subtotal: editItem.subtotal || 0,
//                 // gst: editItem.gst || 0,
//                 // grand_total: editItem.grand_total || 0,
//                 invoice_status: editItem.invoice_status || "",
//                 due_date: editItem.due_date
//                   ? new Date(editItem.due_date).toISOString().split("T")[0]
//                   : "",
//                 is_trending: editItem.is_trending || false,
//                 is_status: getStatusValue(editItem) ? "active" : "inactive",
//               }
//             : {
//                 company_id: "",
//                 transaction_id: "",
//                 invoice_no: "",
//                 gst_number: "",
//                 billing_address: "",
//                 subtotal: 0,
//                 gst: 0,
//                 grand_total: 0,
//                 invoice_status: "",
//                 due_date: "",
//                 is_trending: false,
//                 is_status: "active",
//               }
//         }
//         validationRules={validationRules}
//         loading={formLoading}
//         submitLabel={editItem ? "Update" : "Create"}
//         size="lg"
//         existingFile={
//           editItem?.pdf_url ? invoiceService.getPdfUrl(editItem.pdf_url) : null
//         }
//       />

//       {/* View Modal */}
//       <ViewModal
//         isOpen={viewModalOpen}
//         onClose={() => {
//           setViewModalOpen(false);
//           setViewData(null);
//         }}
//         title="Invoice Details"
//         size="lg"
//       >
//         {viewData && (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
//               <div>
//                 <span className="text-xs text-gray-400">Invoice Number</span>
//                 <p className="font-bold text-lg text-gray-800">
//                   {viewData.invoice_no}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <span className="text-xs text-gray-400">Grand Total</span>
//                 <p className="font-bold text-2xl text-[#2c0eee]">
//                   ₹{viewData.grand_total?.toFixed(2)}
//                 </p>
//               </div>
//             </div>

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
//                 <ViewRow
//                   label="GST Number"
//                   value={viewData.gst_number || "-"}
//                 />
//                 <ViewRow
//                   label="Billing Address"
//                   value={viewData.billing_address || "-"}
//                 />
//               </div>
//               <div className="space-y-3">
//                 <ViewRow
//                   label="Invoice Status"
//                   value={
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${getInvoiceStatusColor(viewData.invoice_status)}-50 text-${getInvoiceStatusColor(viewData.invoice_status)}-700`}
//                     >
//                       <span
//                         className={`w-1.5 h-1.5 rounded-full bg-${getInvoiceStatusColor(viewData.invoice_status)}-500`}
//                       />
//                       {viewData.invoice_status || "Unknown"}
//                     </span>
//                   }
//                 />
//                 <ViewRow
//                   label="Transaction No"
//                   value={viewData.transaction_no || "-"}
//                 />
//                 <ViewRow
//                   label="Due Date"
//                   value={formatDate(viewData.due_date)}
//                 />
//               </div>
//             </div>

//             {/* Amount Breakdown */}
//             <div className="border-t border-gray-100 pt-4">
//               <h4 className="text-sm font-medium text-gray-700 mb-3">
//                 Amount Breakdown
//               </h4>
//               {viewData.transaction_base_price > 0 && (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
//                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                       <p className="text-xs text-gray-400">Base Price</p>
//                       <p className="font-semibold text-gray-700">
//                         ₹{viewData.transaction_base_price?.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                       <p className="text-xs text-gray-400">Discount</p>
//                       <p className="font-semibold text-red-500">
//                         -₹{viewData.transaction_discount_price?.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                       <p className="text-xs text-gray-400">Subtotal</p>
//                       <p className="font-semibold text-[#2c0eee]">
//                         ₹{viewData.subtotal?.toFixed(2)}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         = Base Price - Discount
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                       <p className="text-xs text-gray-400">GST</p>
//                       <p className="font-semibold text-gray-700">
//                         ₹{viewData.gst?.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                       <p className="text-xs text-gray-400">Grand Total</p>
//                       <p className="font-bold text-[#2c0eee]">
//                         ₹{viewData.grand_total?.toFixed(2)}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         = Subtotal + GST
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               )}
//               {!viewData.transaction_base_price && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <div className="bg-gray-50 p-3 rounded-lg text-center">
//                     <p className="text-xs text-gray-400">Subtotal</p>
//                     <p className="font-semibold text-gray-700">
//                       ₹{viewData.subtotal?.toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="bg-gray-50 p-3 rounded-lg text-center">
//                     <p className="text-xs text-gray-400">GST</p>
//                     <p className="font-semibold text-gray-700">
//                       ₹{viewData.gst?.toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                     <p className="text-xs text-gray-400">Grand Total</p>
//                     <p className="font-bold text-[#2c0eee]">
//                       ₹{viewData.grand_total?.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* PDF Download */}
//             {viewData.pdf_url && (
//               <div className="border-t border-gray-100 pt-4">
//                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
//                   <MdPictureAsPdf size={24} className="text-red-500" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-700">
//                       PDF Document
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Click to view or download
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleDownloadPdf(viewData)}
//                     className="flex items-center gap-1 px-3 py-1.5 bg-[#2c0eee] text-white rounded-lg text-sm hover:bg-[#2c0eee] transition-colors"
//                   >
//                     <MdDownload size={16} />
//                     Download PDF
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
//               <ViewRow
//                 label="Trending"
//                 value={
//                   <span
//                     className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//                       viewData.is_trending
//                         ? "bg-yellow-50 text-yellow-700"
//                         : "bg-gray-100 text-gray-500"
//                     }`}
//                   >
//                     <span
//                       className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`}
//                     />
//                     {viewData.is_trending ? "Trending" : "Not Trending"}
//                   </span>
//                 }
//               />
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
//             </div>
//           </div>
//         )}
//       </ViewModal>

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Invoice"
//         message="Delete this invoice? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default Invoices;




// pages/Invoices.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdPictureAsPdf,
  MdBusiness,
  MdReceipt,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { invoiceService } from "../../services/invoice.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const Invoices = () => {
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

  const normalizeInvoice = (item) => ({
    id: item.id || item._id,
    invoice_no: item.invoice_no || "",
    gst_number: item.gst_number || "",
    billing_address: item.billing_address || "",
    subtotal: parseFloat(item.subtotal) || 0,
    gst: parseFloat(item.gst) || 0,
    grand_total: parseFloat(item.grand_total) || 0,
    pdf_url: item.pdf_url || null,
    invoice_status: item.invoice_status || "",
    due_date: item.due_date || null,
    is_trending: item.is_trending === 1 || item.is_trending === true,
    is_status: item.is_status === 1 || item.is_status === true,
    status: item.is_status === 1 || item.is_status === true,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    createdAt: item.created_at || item.createdAt || null,
    updatedAt: item.updated_at || item.updatedAt || null,
    Company: item.Company || null,
    company_name: item.Company?.company_name || "",
    company_id: item.Company?.company_id || "",
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

      const r = await invoiceService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const invoices = Array.isArray(rawData) ? rawData.map(normalizeInvoice) : [];
      const sortedInvoices = invoices.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedInvoices);
    } catch (error) {
      console.error('Load error:', error);
      showError(error.message || "Failed to load invoices");
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
      result = result.filter((item) =>
        String(item.invoice_no ?? "").toLowerCase().includes(query) ||
        String(item.company_name ?? "").toLowerCase().includes(query) ||
        String(item.invoice_status ?? "").toLowerCase().includes(query) ||
        String(item.gst_number ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => getStatusValue(r)).length;
  const inactiveCount = data.length - activeCount;

  const getInvoiceStatusColor = (status) => {
    const statusMap = {
      'Paid': 'green',
      'paid': 'green',
      'Pending': 'yellow',
      'pending': 'yellow',
      'Overdue': 'red',
      'overdue': 'red',
      'Cancelled': 'gray',
      'cancelled': 'gray',
    };
    return statusMap[status] || 'purple';
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
      await invoiceService.delete(deleteId);
      showSuccess("Invoice deleted successfully");
      load();
    } catch (error) {
      console.error('Delete error:', error);
      showError(error.message || "Failed to delete invoice");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    const currentStatus = getStatusValue(row);
    const newStatus = !currentStatus;

    try {
      await invoiceService.update(row.id, {
        is_status: newStatus ? 1 : 0
      });
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
      await invoiceService.update(row.id, {
        is_trending: newValue ? 1 : 0
      });
      showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
      load();
    } catch (error) {
      console.error('Trending toggle error:', error);
      showError(error.response?.data?.message || error.message || "Failed to update trending");
    }
  };

  const handleDownloadPdf = (row) => {
    if (!row.pdf_url) {
      showError("No PDF file available");
      return;
    }
    const pdfUrl = row.pdf_url.startsWith('http') ? row.pdf_url : `https://apidata.hiremejobs.in${row.pdf_url}`;
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      showError("Invalid PDF URL");
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1
    },
    {
      header: "Invoice",
      key: "invoice_no",
      render: (v, row) => (
        <div>
          <span className="font-medium text-gray-800">{v}</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-${getInvoiceStatusColor(row.invoice_status)}-50 text-${getInvoiceStatusColor(row.invoice_status)}-700`}>
              {row.invoice_status || "Unknown"}
            </span>
            {row.pdf_url && (
              <button
                onClick={() => handleDownloadPdf(row)}
                className="text-[#4529f7] hover:text-[#2c0eee]"
                title="Download PDF"
              >
                <MdPictureAsPdf size={14} />
              </button>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Company",
      key: "company_name",
      render: (v, row) => (
        <div className="flex items-center gap-1">
          <MdBusiness size={14} className="text-gray-400" />
          <span className="text-gray-700">{v || "-"}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      key: "grand_total",
      render: (v, row) => (
        <div>
          <span className="font-semibold text-gray-800">₹{v?.toFixed(2)}</span>
          <span className="text-xs text-gray-400 ml-1">
            (Subtotal: ₹{row.subtotal?.toFixed(2)})
          </span>
        </div>
      ),
    },
    {
      header: "GST",
      key: "gst",
      render: (v) => (
        <span className="text-gray-600">₹{v?.toFixed(2)}</span>
      ),
    },
    {
      header: "Due Date",
      key: "due_date",
      render: (v) => {
        const dueDate = new Date(v);
        const today = new Date();
        const isOverdue = dueDate < today;
        return (
          <span className={`text-sm ${isOverdue ? "text-red-500" : "text-gray-500"}`}>
            {formatDate(v)}
            {isOverdue && <span className="ml-1 text-xs text-red-500">(Overdue)</span>}
          </span>
        );
      },
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (value, row) => (
        <button
          onClick={() => handleTrendingToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"}`}
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
        <span className="text-gray-500 text-sm font-medium">
          {getUpdatedByName(row)}
        </span>
      ),
    },
    {
      header: "Update At",
      key: "updatedAt",
      render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() => navigate(`/invoices/view/${row.id}`, { state: { item: row } })}
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => navigate(`/invoices/edit/${row.id}`, { state: { item: row } })}
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
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all invoices</p>
        </div>
        <Button icon={MdAdd} onClick={() => navigate('/invoices/add')}>
          Add Invoice
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
              placeholder="Search invoices..."
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
          emptyMessage="No invoices found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} invoices
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
        title="Delete Invoice"
        message="Delete this invoice? This action cannot be undone."
      />
    </div>
  );
};

export default Invoices;