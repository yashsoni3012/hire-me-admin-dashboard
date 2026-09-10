// // pages/subscriptions/InvoicesForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { ViewBadge } from '../../components/common/FormPageUtils';
// import { invoiceService } from '../../services/invoice.service';
// import companyService from '../../services/company.service';
// import { subscriptionTransactionService } from '../../services/subscriptionTransaction.service';
// import { showSuccess, showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// const InvoicesForm = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { id } = useParams();
//     const [mode, setMode] = useState('add'); // 'add' | 'edit' | 'view'
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState(null);
//     const [companies, setCompanies] = useState([]);
//     const [transactions, setTransactions] = useState([]);
//     const [loadingRefData, setLoadingRefData] = useState(false);
//     const [userNameCache, setUserNameCache] = useState({});
//     const [pageLoading, setPageLoading] = useState(false);
//     const [transactionCache, setTransactionCache] = useState({});

//     // Determine mode from URL
//     useEffect(() => {
//         const path = location.pathname;
//         if (path.includes('/view/')) {
//             setMode('view');
//         } else if (path.includes('/edit/')) {
//             setMode('edit');
//         } else {
//             setMode('add');
//         }
//     }, [location.pathname]);

//     // Fetch users for display names
//     useEffect(() => {
//         const loadUsers = async () => {
//             try {
//                 const users = await fetchUsers();
//                 const userMap = {};
//                 Object.keys(users).forEach(id => {
//                     userMap[id] = users[id].name;
//                 });
//                 setUserNameCache(userMap);
//             } catch (error) {
//                 console.error('Failed to load users:', error);
//             }
//         };
//         loadUsers();
//     }, []);

//     // Fetch reference data (companies + subscription transactions)
//     useEffect(() => {
//         const fetchReferenceData = async () => {
//             setLoadingRefData(true);
//             try {
//                 const [companiesRes, transactionsRes] = await Promise.all([
//                     companyService.getAll({ limit: 1000 }),
//                     subscriptionTransactionService.getAll({ limit: 1000 })
//                 ]);

//                 const companiesData = companiesRes.data?.data || companiesRes.data || [];
//                 const transactionsData = transactionsRes.data?.data || transactionsRes.data || [];

//                 setCompanies(Array.isArray(companiesData) ? companiesData : []);
//                 setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
//             } catch (error) {
//                 console.error("Failed to fetch reference data:", error);
//             } finally {
//                 setLoadingRefData(false);
//             }
//         };
//         fetchReferenceData();
//     }, []);

//     // Look up a transaction's full record.
//     // FIX: check the already-loaded `transactions` list first (instant, no network call,
//     // and always correct for the Add flow since that list is exactly where the dropdown
//     // options came from). Only fall back to a network call for Edit/View, where this can
//     // run before the reference-data fetch above has resolved.
//     const getTransactionData = async (transactionId) => {
//         if (!transactionId) return null;

//         const fromList = transactions.find(
//             (t) => String(t.id ?? t._id ?? t.transaction_id) === String(transactionId)
//         );
//         if (fromList) return fromList;

//         if (transactionCache[transactionId]) {
//             return transactionCache[transactionId];
//         }

//         try {
//             const transRes = await subscriptionTransactionService.getById(transactionId);
//             const transData = transRes.data?.data || transRes.data || transRes;

//             setTransactionCache(prev => ({
//                 ...prev,
//                 [transactionId]: transData,
//             }));

//             return transData;
//         } catch (error) {
//             console.warn(`Failed to fetch transaction ${transactionId}:`, error);
//             return null;
//         }
//     };

//     // Fetch data for edit/view modes
//     useEffect(() => {
//         const fetchData = async () => {
//             if ((mode === 'edit' || mode === 'view') && id) {
//                 setPageLoading(true);
//                 try {
//                     let item = location.state?.item;

//                     if (!item) {
//                         const response = await invoiceService.getById(id);
//                         item = response.data;
//                     }

//                     // Fetch transaction data if available
//                     const transactionId = item.transaction_id || item.SubscriptionTransaction?.id;
//                     let transactionData = null;
//                     if (transactionId) {
//                         transactionData = await getTransactionData(transactionId);
//                     }

//                     // Calculate subtotal from transaction
//                     let calculatedSubtotal = parseFloat(item.subtotal) || 0;
//                     let gstAmount = parseFloat(item.gst) || 0;
//                     let basePrice = 0;
//                     let discountPrice = 0;

//                     if (transactionData) {
//                         basePrice = parseFloat(transactionData.base_price) || 0;
//                         discountPrice = parseFloat(transactionData.discount_price) || 0;
//                         calculatedSubtotal = basePrice - discountPrice;
//                         gstAmount = parseFloat(transactionData.gst_amount) || 0;
//                     }

//                     // Normalize the data
//                     const normalizedData = {
//                         id: item.id || item._id,
//                         invoice_no: item.invoice_no || "",
//                         gst_number: item.gst_number || "",
//                         billing_address: item.billing_address || "",
//                         subtotal: calculatedSubtotal,
//                         gst: gstAmount,
//                         grand_total: parseFloat(item.grand_total) || 0,
//                         pdf_url: item.pdf_url || null,
//                         invoice_status: item.invoice_status || "",
//                         due_date: item.due_date || null,
//                         is_trending: item.is_trending === 1 || item.is_trending === true,
//                         is_status: item.is_status === 1 || item.is_status === true,
//                         status: item.is_status === 1 || item.is_status === true,
//                         created_by: item.created_by || null,
//                         updated_by: item.updated_by || null,
//                         created_at: item.created_at || item.createdAt || null,
//                         updated_at: item.updated_at || item.updatedAt || null,
//                         Company: item.Company || null,
//                         SubscriptionTransaction: transactionData || item.SubscriptionTransaction,
//                         company_name: item.Company?.company_name || "",
//                         company_id: item.Company?.company_id || "",
//                         company_id_raw: item.company_id || "",
//                         transaction_id: transactionData?.id || item.SubscriptionTransaction?.id || "",
//                         transaction_no: transactionData?.transaction_no || item.SubscriptionTransaction?.transaction_no || "",
//                         transaction_base_price: basePrice,
//                         transaction_discount_price: discountPrice,
//                         transaction_gst_amount: gstAmount,
//                         transaction_final_amount: parseFloat(transactionData?.final_amount) || 0,
//                         raw: item,
//                     };

//                     setData(normalizedData);
//                 } catch (error) {
//                     console.error('Fetch error:', error);
//                     showError("Failed to load invoice data");
//                     navigate('/invoices');
//                 } finally {
//                     setPageLoading(false);
//                 }
//             }
//         };
//         fetchData();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [id, mode, location.state, navigate]);

//     // Get user name with caching
//     const getUserNameCached = (userId) => {
//         if (!userId) return "-";
//         return userNameCache[userId] || `User ${userId}`;
//     };

//     // Get status value
//     const getStatusValue = (row) => {
//         if (row?.is_status !== undefined) {
//             return row.is_status;
//         }
//         if (row?.status !== undefined) {
//             return row.status === 1 || row.status === true;
//         }
//         return true;
//     };

//     // Get invoice status color
//     const getInvoiceStatusColor = (status) => {
//         const statusMap = {
//             'Paid': 'green',
//             'paid': 'green',
//             'Pending': 'yellow',
//             'pending': 'yellow',
//             'Overdue': 'red',
//             'overdue': 'red',
//             'Cancelled': 'gray',
//             'cancelled': 'gray',
//         };
//         return statusMap[status] || 'purple';
//     };

//     // Format currency helper
//     const formatCurrency = (value) => {
//         const num = parseFloat(value);
//         return isNaN(num) ? '0.00' : num.toFixed(2);
//     };

//     // Get PDF URL
//     const getPdfUrl = (pdfUrl) => {
//         if (!pdfUrl) return null;
//         if (pdfUrl.startsWith('http')) return pdfUrl;
//         return `https://apidata.hiremejobs.in${pdfUrl}`;
//     };

//     // Handle transaction selection for the form.
//     // THE CORE FIX: pull base_price / discount_price / gst_amount straight out of the
//     // `transactions` array that's already sitting in state (it's literally where the
//     // dropdown's own options came from), and derive subtotal / gst / grand_total
//     // synchronously. No extra request, nothing that can fail silently, no ID
//     // type-mismatch (select values arrive as strings, transaction.id is a number —
//     // handled with String(...) comparison below).
//     const handleTransactionSelect = (transactionId, formData, setFormData) => {
//         if (!transactionId) {
//             setFormData(prev => ({
//                 ...prev,
//                 subtotal: 0,
//                 gst: 0,
//                 grand_total: 0,
//             }));
//             return;
//         }

//         const transData = transactions.find(
//             (t) => String(t.id ?? t._id ?? t.transaction_id) === String(transactionId)
//         );

//         if (!transData) {
//             showError("Could not find data for the selected transaction");
//             return;
//         }

//         const basePrice = parseFloat(transData.base_price) || 0;
//         const discountPrice = parseFloat(transData.discount_price) || 0;
//         const gstAmount = parseFloat(transData.gst_amount) || 0;
//         const subtotal = basePrice - discountPrice;      // subtotal = base_price - discount_price
//         const grandTotal = subtotal + gstAmount;          // grand_total = subtotal + gst

//         setFormData(prev => ({
//             ...prev,
//             subtotal,
//             gst: gstAmount,                                // gst = gst_amount
//             grand_total: grandTotal,
//         }));

//         // Cache it so Edit/View can reuse it without a network round-trip
//         setTransactionCache(prev => ({
//             ...prev,
//             [transData.id]: transData,
//         }));
//     };

//     // Define fields for the form
//     const getFields = () => {
//         const companyOptions = companies.map(c => ({
//             value: c.id || c._id || c.company_id,
//             label: c.company_name || `Company #${c.id}`
//         }));

//         const transactionOptions = transactions.map(t => ({
//             value: t.id || t._id || t.transaction_id,
//             label: `${t.transaction_no || `Transaction #${t.id}`} - ₹${formatCurrency(t.final_amount || 0)}`
//         }));

//         const invoiceStatusOptions = [
//             { value: 'Paid', label: 'Paid' },
//             { value: 'Pending', label: 'Pending' },
//             { value: 'Overdue', label: 'Overdue' },
//             { value: 'Cancelled', label: 'Cancelled' },
//         ];

//         const baseFields = [
//             {
//                 name: "company_id",
//                 label: "Company",
//                 type: "select",
//                 required: true,
//                 options: companyOptions,
//                 placeholder: loadingRefData ? "Loading companies..." : "Select company",
//                 help: "Select the company this invoice belongs to",
//                 disabled: loadingRefData,
//                 viewRender: (value, row) => row?.Company?.company_name || value || '—'
//             },
//             {
//                 name: "transaction_id",
//                 label: "Transaction",
//                 type: "select",
//                 required: true,
//                 options: [{ value: "", label: "Select Transaction" }, ...transactionOptions],
//                 placeholder: loadingRefData ? "Loading transactions..." : "Select transaction",
//                 help: "Select a transaction to auto-calculate subtotal (Base Price - Discount) and GST",
//                 disabled: loadingRefData,
//                 onChange: (value, formData, setFormData) => {
//                     handleTransactionSelect(value, formData, setFormData);
//                 },
//                 viewRender: (value, row) => row?.transaction_no || value || '—'
//             },
//             {
//                 name: "invoice_no",
//                 label: "Invoice Number",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. INV-20260713-001",
//                 help: "Unique invoice number",
//                 viewRender: (value) => <span className="font-medium text-lg">{value}</span>
//             },
//             {
//                 name: "gst_number",
//                 label: "GST Number",
//                 type: "text",
//                 required: false,
//                 placeholder: "e.g. 24ABCDE1234F1Z5",
//                 help: "GST number of the company",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "billing_address",
//                 label: "Billing Address",
//                 type: "textarea",
//                 required: true,
//                 placeholder: "Enter billing address...",
//                 rows: 3,
//                 help: "Complete billing address",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "invoice_status",
//                 label: "Invoice Status",
//                 type: "select",
//                 required: true,
//                 options: invoiceStatusOptions,
//                 placeholder: "Select status",
//                 help: "Current status of the invoice",
//                 viewRender: (value) => {
//                     const color = getInvoiceStatusColor(value);
//                     return (
//                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}>
//                             <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
//                             {value || "Unknown"}
//                         </span>
//                     );
//                 }
//             },
//             {
//                 name: "due_date",
//                 label: "Due Date",
//                 type: "date",
//                 required: true,
//                 help: "Payment due date",
//                 viewRender: (value) => {
//                     if (!value) return '—';
//                     const dueDate = new Date(value);
//                     const today = new Date();
//                     const isOverdue = dueDate < today;
//                     return (
//                         <span className={isOverdue ? "text-red-500" : "text-gray-700"}>
//                             {formatDate(value)}
//                             {isOverdue && <span className="ml-1 text-xs text-red-500">(Overdue)</span>}
//                         </span>
//                     );
//                 }
//             },
//             {
//                 name: "subtotal",
//                 label: "Subtotal (₹)",
//                 type: "number",
//                 required: true,
//                 min: 0,
//                 step: "0.01",
//                 help: "Auto-calculated from transaction (Base Price - Discount)",
//                 disabled: true,
//                 className: "bg-gray-100 cursor-not-allowed",
//                 viewRender: (value) => <span className="font-medium">₹{formatCurrency(value)}</span>
//             },
//             {
//                 name: "gst",
//                 label: "GST Amount (₹)",
//                 type: "number",
//                 required: true,
//                 min: 0,
//                 step: "0.01",
//                 help: "Auto-filled from transaction",
//                 disabled: true,
//                 className: "bg-gray-100 cursor-not-allowed",
//                 viewRender: (value) => <span className="font-medium">₹{formatCurrency(value)}</span>
//             },
//             {
//                 name: "grand_total",
//                 label: "Grand Total (₹)",
//                 type: "number",
//                 required: true,
//                 min: 0,
//                 step: "0.01",
//                 help: "Subtotal + GST (Auto-calculated)",
//                 disabled: true,
//                 className: "bg-gray-100 cursor-not-allowed",
//                 viewRender: (value) => <span className="font-bold text-2xl text-[#2c0eee]">₹{formatCurrency(value)}</span>
//             },
//             {
//                 name: "pdf_file",
//                 label: "PDF Document",
//                 type: "file",
//                 required: false,
//                 accept: ".pdf",
//                 maxSize: 10,
//                 help: "Upload PDF invoice file (Max 10MB)",
//                 placeholder: "Click or drag to upload PDF",
//                 viewRender: (value, row) => {
//                     if (!row?.pdf_url) return '—';
//                     return (
//                         <div className="flex items-center gap-3">
//                             <span className="text-sm text-gray-600">PDF available</span>
//                             <button
//                                 onClick={() => window.open(getPdfUrl(row.pdf_url), '_blank')}
//                                 className="px-3 py-1 bg-[#2c0eee] text-white rounded-lg text-sm hover:bg-[#2c0eee] transition-colors"
//                             >
//                                 Download PDF
//                             </button>
//                         </div>
//                     );
//                 }
//             },
//             {
//                 name: "is_trending",
//                 label: "Mark as Trending",
//                 type: "checkbox",
//                 color: "text-yellow-500 focus:ring-yellow-500",
//                 help: "Highlight this invoice as trending",
//                 viewRender: (value) => (
//                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-yellow-500" : "bg-gray-400"}`} />
//                         {value ? "Trending" : "Not Trending"}
//                     </span>
//                 )
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
//                 viewRender: () => {
//                     const isActive =
//                         data?.is_status === true ||
//                         data?.is_status === 1 ||
//                         data?.is_status === "1" ||
//                         data?.is_status === "true";

//                     return <ViewBadge active={isActive} />;
//                 }
//             },
//         ];

//         // For view mode, add transaction details breakdown
//         if (mode === 'view') {
//             return [
//                 ...baseFields.slice(0, 6), // Up to due_date
//                 {
//                     name: "amount_breakdown",
//                     label: "Amount Breakdown",
//                     type: "text",
//                     viewRender: (value, row) => {
//                         const hasTransaction = row?.transaction_base_price > 0;
//                         return (
//                             <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                                 {hasTransaction && (
//                                     <>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">Base Price</p>
//                                             <p className="font-semibold text-gray-700">₹{formatCurrency(row.transaction_base_price)}</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">Discount</p>
//                                             <p className="font-semibold text-red-500">-₹{formatCurrency(row.transaction_discount_price)}</p>
//                                         </div>
//                                         <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                             <p className="text-xs text-gray-400">Subtotal</p>
//                                             <p className="font-semibold text-[#2c0eee]">₹{formatCurrency(row.subtotal)}</p>
//                                             <p className="text-xs text-gray-400 mt-1">= Base Price - Discount</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">GST</p>
//                                             <p className="font-semibold text-gray-700">₹{formatCurrency(row.gst)}</p>
//                                         </div>
//                                         <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                             <p className="text-xs text-gray-400">Grand Total</p>
//                                             <p className="font-bold text-[#2c0eee]">₹{formatCurrency(row.grand_total)}</p>
//                                             <p className="text-xs text-gray-400 mt-1">= Subtotal + GST</p>
//                                         </div>
//                                     </>
//                                 )}
//                                 {!hasTransaction && (
//                                     <>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">Subtotal</p>
//                                             <p className="font-semibold text-gray-700">₹{formatCurrency(row.subtotal)}</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">GST</p>
//                                             <p className="font-semibold text-gray-700">₹{formatCurrency(row.gst)}</p>
//                                         </div>
//                                         <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                             <p className="text-xs text-gray-400">Grand Total</p>
//                                             <p className="font-bold text-[#2c0eee]">₹{formatCurrency(row.grand_total)}</p>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         );
//                     }
//                 },
//                 ...baseFields.slice(6) // Rest of the fields
//             ];
//         }

//         return baseFields;
//     };

//     // Validation rules
//     const getValidationRules = (existingData) => ({
//         company_id: {
//             required: true,
//             requiredMessage: 'Please select a company'
//         },
//         transaction_id: {
//             required: true,
//             requiredMessage: 'Please select a transaction'
//         },
//         invoice_no: {
//             required: true,
//             requiredMessage: 'Invoice number is required'
//         },
//         billing_address: {
//             required: true,
//             requiredMessage: 'Billing address is required',
//             minLength: 5,
//             minLengthMessage: 'Address must be at least 5 characters'
//         },
//         invoice_status: {
//             required: true,
//             requiredMessage: 'Please select an invoice status'
//         },
//         due_date: {
//             required: true,
//             requiredMessage: 'Due date is required',
//             custom: (value) => {
//                 if (value) {
//                     const today = new Date();
//                     today.setHours(0, 0, 0, 0);
//                     const dueDate = new Date(value);
//                     if (dueDate < today) {
//                         return 'Due date cannot be in the past';
//                     }
//                 }
//                 return null;
//             }
//         }
//     });

//     // Submit handler for add/edit
//     const handleSubmit = async (formData) => {
//         setLoading(true);

//         try {
//             const submitData = {
//                 company_id: parseInt(formData.company_id),
//                 transaction_id: formData.transaction_id ? parseInt(formData.transaction_id) : null,
//                 invoice_no: formData.invoice_no,
//                 gst_number: formData.gst_number || "",
//                 billing_address: formData.billing_address,
//                 subtotal: parseFloat(formData.subtotal) || 0,
//                 gst: parseFloat(formData.gst) || 0,
//                 grand_total: parseFloat(formData.grand_total) || 0,
//                 invoice_status: formData.invoice_status,
//                 due_date: formData.due_date,
//                 is_trending: formData.is_trending || false,
//                 is_status: formData.status === "active" ? 1 : 0,
//             };

//             if (formData.pdf_file && formData.pdf_file instanceof File) {
//                 submitData.pdf_url = formData.pdf_file;
//             } else if (mode === 'edit' && data?.pdf_url) {
//                 submitData.pdf_url = data.pdf_url;
//             }

//             // Check for duplicate invoice number
//             const allData = await invoiceService.getAll({ limit: 1000 });
//             const existingItems = allData.data?.data || allData.data?.results || allData.data || [];
//             const duplicate = existingItems.some(item =>
//                 (item.invoice_no || "").toLowerCase() === formData.invoice_no.toLowerCase() &&
//                 (mode === 'add' || item.id !== id)
//             );

//             // if (duplicate) {
//             //     showError('This invoice number already exists');
//             //     setLoading(false);
//             //     return;
//             // }

//             if (mode === 'edit') {
//                 await invoiceService.update(id, submitData);
//                 showSuccess("Invoice updated successfully");
//             } else {
//                 await invoiceService.create(submitData);
//                 showSuccess("Invoice created successfully");
//             }

//             navigate('/invoices');
//         } catch (error) {
//             console.error('Submit error:', error);
//             const errorMessage = error?.message ||
//                 error?.response?.data?.message ||
//                 "Failed to save";
//             showError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete handler
//     const handleDelete = async () => {
//         try {
//             await invoiceService.delete(id);
//             showSuccess("Invoice deleted successfully");
//             navigate('/invoices');
//         } catch (error) {
//             console.error('Delete error:', error);
//             showError(error?.response?.data?.message || error?.message || "Failed to delete invoice");
//             throw error;
//         }
//     };

//     // Prepare initial data
//     const getInitialData = () => {
//         if (mode === 'add') {
//             return {
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
//                 status: "active"
//             };
//         }

//         if (data) {
//             return {
//                 company_id: data.company_id_raw || data.Company?.id || "",
//                 transaction_id: data.transaction_id || "",
//                 invoice_no: data.invoice_no || "",
//                 gst_number: data.gst_number || "",
//                 billing_address: data.billing_address || "",
//                 subtotal: data.subtotal || 0,
//                 gst: data.gst || 0,
//                 grand_total: data.grand_total || 0,
//                 invoice_status: data.invoice_status || "",
//                 due_date: data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : "",
//                 is_trending: data.is_trending || false,
//                 status: getStatusValue(data) ? "active" : "inactive",
//                 pdf_url: data.pdf_url || null,
//                 // For view mode
//                 transaction_base_price: data.transaction_base_price,
//                 transaction_discount_price: data.transaction_discount_price,
//                 transaction_gst_amount: data.transaction_gst_amount,
//                 transaction_no: data.transaction_no,
//                 Company: data.Company,
//                 transaction_id_raw: data.transaction_id,
//             };
//         }

//         return {
//             company_id: "",
//             transaction_id: "",
//             invoice_no: "",
//             gst_number: "",
//             billing_address: "",
//             subtotal: 0,
//             gst: 0,
//             grand_total: 0,
//             invoice_status: "",
//             due_date: "",
//             is_trending: false,
//             status: "active"
//         };
//     };

//     // Get title based on mode
//     const getTitle = () => {
//         if (mode === 'view') return 'Invoice Details';
//         if (mode === 'edit') return 'Edit Invoice';
//         return 'Add New Invoice';
//     };

//     // Get submit label
//     const getSubmitLabel = () => {
//         if (mode === 'edit') return 'Update Invoice';
//         return 'Create Invoice';
//     };

//     // Handle loading state
//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-3 text-gray-500">Loading invoice data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // If view/edit mode and data not loaded, show error
//     if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Invoice not found</p>
//                     <button
//                         onClick={() => navigate('/invoices')}
//                         className="mt-3 text-[#2c0eee] hover:underline"
//                     >
//                         Go back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <FormPage
//             title={getTitle()}
//             mode={mode}
//             fields={getFields()}
//             initialData={getInitialData()}
//             validationRules={getValidationRules(data)}
//             onSubmit={handleSubmit}
//             onDelete={handleDelete}
//             navigateTo="/invoices"
//             submitLabel={getSubmitLabel()}
//             editLabel="Edit Invoice"
//             deleteLabel="Delete Invoice"
//             loading={loading}
//             showDelete={mode !== 'add'}
//             showEdit={mode === 'view'}
//             enableEditMode={mode === 'view'}
//             breadcrumb={mode === 'view' ? 'Viewing invoice details' : mode === 'edit' ? 'Updating invoice' : 'Creating new invoice'}
//             onEdit={() => navigate(`/invoices/edit/${id}`, { state: { item: data } })}
//         />
//     );
// };

// export default InvoicesForm;




// // pages/subscriptions/InvoicesForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { ViewBadge } from '../../components/common/FormPageUtils';
// import { invoiceService } from '../../services/invoice.service';
// import companyService from '../../services/company.service';
// import { subscriptionTransactionService } from '../../services/subscriptionTransaction.service';
// import { showSuccess, showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// const InvoicesForm = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { id } = useParams();
//     const [mode, setMode] = useState('add');
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState(null);
//     const [companies, setCompanies] = useState([]);
//     const [transactions, setTransactions] = useState([]);
//     const [loadingRefData, setLoadingRefData] = useState(false);
//     const [userNameCache, setUserNameCache] = useState({});
//     const [pageLoading, setPageLoading] = useState(false);
//     const [transactionCache, setTransactionCache] = useState({});

//     // Determine mode from URL
//     useEffect(() => {
//         const path = location.pathname;
//         if (path.includes('/view/')) {
//             setMode('view');
//         } else if (path.includes('/edit/')) {
//             setMode('edit');
//         } else {
//             setMode('add');
//         }
//     }, [location.pathname]);

//     // Fetch users for display names
//     useEffect(() => {
//         const loadUsers = async () => {
//             try {
//                 const users = await fetchUsers();
//                 const userMap = {};
//                 Object.keys(users).forEach(id => {
//                     userMap[id] = users[id].name;
//                 });
//                 setUserNameCache(userMap);
//             } catch (error) {
//                 console.error('Failed to load users:', error);
//             }
//         };
//         loadUsers();
//     }, []);

//     // Fetch reference data (companies and transactions)
//     useEffect(() => {
//         const fetchReferenceData = async () => {
//             setLoadingRefData(true);
//             try {
//                 const [companiesRes, transactionsRes] = await Promise.all([
//                     companyService.getAll({ limit: 1000 }),
//                     subscriptionTransactionService.getAll({ limit: 1000 })
//                 ]);

//                 // Extract data from response
//                 const companiesData = companiesRes.data?.data || companiesRes.data || [];
//                 const transactionsData = transactionsRes.data?.data || transactionsRes.data || [];

//                 console.log('Companies loaded:', companiesData.length);
//                 console.log('Transactions loaded:', transactionsData.length);

//                 setCompanies(Array.isArray(companiesData) ? companiesData : []);
//                 setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
//             } catch (error) {
//                 console.error("Failed to fetch reference data:", error);
//                 showError("Failed to load companies or transactions");
//             } finally {
//                 setLoadingRefData(false);
//             }
//         };
//         fetchReferenceData();
//     }, []);

//     // Get transaction data from cache or fetch
//     const getTransactionData = async (transactionId) => {
//         if (!transactionId) return null;

//         if ( transactionCache[transactionId]) {
//             return transactionCache[transactionId];
//         }

//         try {
//             const response = await subscriptionTransactionService.getById(transactionId);
//             // Extract data from response - handle different response structures
//             const transData = response.data?.data || response.data || response;

//             console.log('Fetched transaction data:', transData);

//             setTransactionCache(prev => ({
//                 ...prev,
//                 [transactionId]: transData,
//             }));

//             return transData;
//         } catch (error) {
//             console.warn(`Failed to fetch transaction ${transactionId}:`, error);
//             return null;
//         }
//     };

//     // Fetch data for edit/view modes
//     useEffect(() => {
//         const fetchData = async () => {
//             if ((mode === 'edit' || mode === 'view') && id) {
//                 setPageLoading(true);
//                 try {
//                     let item = location.state?.item;

//                     if (!item) {
//                         const response = await invoiceService.getById(id);
//                         // Extract data from response
//                         item = response.data?.data || response.data || response;
//                     }

//                     console.log('Invoice data loaded:', item);

//                     // Get transaction ID from various possible locations
//                     let transactionId = null;
//                     if (item.transaction_id) {
//                         transactionId = item.transaction_id;
//                     } else if (item.SubscriptionTransaction?.id) {
//                         transactionId = item.SubscriptionTransaction.id;
//                     } else if (item.SubscriptionTransaction?.transaction_id) {
//                         transactionId = item.SubscriptionTransaction.transaction_id;
//                     }

//                     let transactionData = null;
//                     let basePrice = 0;
//                     let discountPrice = 0;
//                     let gstAmount = 0;
//                     let calculatedSubtotal = 0;

//                     if (transactionId) {
//                         transactionData = await getTransactionData(transactionId);

//                         if (transactionData) {
//                             // Extract values from transaction
//                             basePrice = parseFloat(transactionData.base_price) || 0;
//                             discountPrice = parseFloat(transactionData.discount_price) || 0;
//                             gstAmount = parseFloat(transactionData.gst_amount) || 0;
//                             calculatedSubtotal = basePrice - discountPrice;

//                             console.log('Transaction data loaded:', { basePrice, discountPrice, gstAmount, calculatedSubtotal });
//                         }
//                     }

//                     // If no transaction data, use invoice's own values
//                     if (!transactionData) {
//                         calculatedSubtotal = parseFloat(item.subtotal) || 0;
//                         gstAmount = parseFloat(item.gst) || 0;
//                     }

//                     // Get company ID from various possible locations
//                     let companyId = null;
//                     if (item.company_id) {
//                         companyId = item.company_id;
//                     } else if (item.Company?.company_id) {
//                         companyId = item.Company.company_id;
//                     } else if (item.Company?.id) {
//                         companyId = item.Company.id;
//                     }

//                     // Normalize the data
//                     const normalizedData = {
//                         id: item.id || item._id,
//                         invoice_no: item.invoice_no || "",
//                         gst_number: item.gst_number || "",
//                         billing_address: item.billing_address || "",
//                         subtotal: calculatedSubtotal,
//                         gst: gstAmount,
//                         grand_total: calculatedSubtotal + gstAmount,
//                         pdf_url: item.pdf_url || null,
//                         invoice_status: item.invoice_status || "",
//                         due_date: item.due_date || null,
//                         is_trending: item.is_trending === 1 || item.is_trending === true,
//                         is_status: item.is_status === 1 || item.is_status === true,
//                         status: item.is_status === 1 || item.is_status === true,
//                         created_by: item.created_by || null,
//                         updated_by: item.updated_by || null,
//                         created_at: item.created_at || item.createdAt || null,
//                         updated_at: item.updated_at || item.updatedAt || null,
//                         Company: item.Company || null,
//                         SubscriptionTransaction: transactionData || item.SubscriptionTransaction,
//                         company_name: item.Company?.company_name || "",
//                         company_id: companyId,
//                         transaction_id: transactionId,
//                         transaction_no: transactionData?.transaction_no || item.SubscriptionTransaction?.transaction_no || "",
//                         transaction_base_price: basePrice,
//                         transaction_discount_price: discountPrice,
//                         transaction_gst_amount: gstAmount,
//                         transaction_final_amount: parseFloat(transactionData?.final_amount) || 0,
//                         raw: item,
//                     };

//                     console.log('Normalized data:', normalizedData);
//                     setData(normalizedData);
//                 } catch (error) {
//                     console.error('Fetch error:', error);
//                     showError("Failed to load invoice data");
//                     navigate('/invoices');
//                 } finally {
//                     setPageLoading(false);
//                 }
//             }
//         };
//         fetchData();
//     }, [id, mode, location.state, navigate]);

//     // Get user name with caching
//     const getUserNameCached = (userId) => {
//         if (!userId) return "-";
//         return userNameCache[userId] || `User ${userId}`;
//     };

//     // Get status value
//     const getStatusValue = (row) => {
//         if (row?.is_status !== undefined) {
//             return row.is_status;
//         }
//         if (row?.status !== undefined) {
//             return row.status === 1 || row.status === true;
//         }
//         return true;
//     };

//     // Get invoice status color
//     const getInvoiceStatusColor = (status) => {
//         const statusMap = {
//             'Paid': 'green',
//             'paid': 'green',
//             'Pending': 'yellow',
//             'pending': 'yellow',
//             'Overdue': 'red',
//             'overdue': 'red',
//             'Cancelled': 'gray',
//             'cancelled': 'gray',
//         };
//         return statusMap[status] || 'purple';
//     };

//     // Format currency helper
//     const formatCurrency = (value) => {
//         const num = parseFloat(value);
//         return isNaN(num) ? '0.00' : num.toFixed(2);
//     };

//     // Get PDF URL
//     const getPdfUrl = (pdfUrl) => {
//         if (!pdfUrl) return null;
//         if (pdfUrl.startsWith('http')) return pdfUrl;
//         if (pdfUrl.startsWith('/')) {
//             return `https://apidata.hiremejobs.in${pdfUrl}`;
//         }
//         return `https://apidata.hiremejobs.in/uploads/invoices/${pdfUrl}`;
//     };

//     // Calculate invoice amounts from the selected Subscription Transaction
//     const calculateTransactionAmounts = (transaction) => {
//         if (!transaction) {
//             return {
//                 basePrice: 0,
//                 discountPrice: 0,
//                 gstAmount: 0,
//                 subtotal: 0,
//                 grandTotal: 0,
//             };
//         }

//         const basePrice = parseFloat(transaction.base_price) || 0;
//         const discountPrice = parseFloat(transaction.discount_price) || 0;
//         const gstAmount = parseFloat(transaction.gst_amount) || 0;

//         // Required business calculation:
//         // subtotal = base_price - discount_price
//         // gst = gst_amount
//         // grand_total = subtotal + gst
//         const subtotal = Math.max(0, basePrice - discountPrice);
//         const grandTotal = subtotal + gstAmount;

//         return {
//             basePrice,
//             discountPrice,
//             gstAmount,
//             subtotal,
//             grandTotal,
//         };
//     };

//     // Handle transaction selection for form
//     const handleTransactionSelect = async (transactionId, formData, setFormData) => {
//         console.log('Transaction selected:', transactionId);

//         if (!transactionId) {
//             setFormData(prev => ({
//                 ...prev,
//                 subtotal: 0,
//                 gst: 0,
//                 grand_total: 0,
//             }));
//             return;
//         }

//         try {
//             // Fetch the parent transaction from the API so the values are always
//             // taken from the latest Subscription Transaction record.
//             let transData = await getTransactionData(transactionId);

//             // Fallback to the loaded transaction list if the detail request did not return data.
//             if (!transData) {
//                 transData = transactions.find(
//                     t => String(t.id || t._id || t.transaction_id) === String(transactionId)
//                 );
//             }

//             if (!transData) {
//                 showError('Selected transaction details could not be found');
//                 return;
//             }

//             const amounts = calculateTransactionAmounts(transData);

//             console.log('Transaction amounts:', amounts);

//             setFormData(prev => ({
//                 ...prev,
//                 subtotal: amounts.subtotal.toFixed(2),
//                 gst: amounts.gstAmount.toFixed(2),
//                 grand_total: amounts.grandTotal.toFixed(2),
//             }));
//         } catch (error) {
//             console.error('Error fetching transaction details:', error);
//             showError('Failed to fetch transaction details');
//         }
//     };

//     // Define fields for the form
//     const getFields = () => {
//         // Map companies to options
//         const companyOptions = companies.map(c => ({
//             value: c.id || c._id || c.company_id,
//             label: c.company_name || `Company #${c.id}`
//         }));

//         // Map transactions to options
//         const transactionOptions = transactions.map(t => {
//             const id = t.id || t._id || t.transaction_id;
//             const transactionNo = t.transaction_no || `TXN-${id}`;
//             const amount = formatCurrency(t.final_amount || 0);
//             return {
//                 value: id,
//                 label: `${transactionNo} - ₹${amount}`
//             };
//         });

//         const invoiceStatusOptions = [
//             { value: 'Paid', label: 'Paid' },
//             { value: 'Pending', label: 'Pending' },
//             { value: 'Overdue', label: 'Overdue' },
//             { value: 'Cancelled', label: 'Cancelled' },
//         ];

//         const baseFields = [
//             {
//                 name: "company_id",
//                 label: "Company",
//                 type: "select",
//                 required: true,
//                 options: companyOptions,
//                 placeholder: loadingRefData ? "Loading companies..." : "Select company",
//                 help: "Select the company this invoice belongs to",
//                 disabled: loadingRefData,
//                 viewRender: (value, row) => row?.Company?.company_name || value || '—'
//             },
//             {
//                 name: "transaction_id",
//                 label: "Transaction",
//                 type: "select",
//                 required: true,
//                 options: [{ value: "", label: "Select Transaction" }, ...transactionOptions],
//                 placeholder: "Select transaction",
//                 help: "Select a transaction to auto-calculate subtotal (Base Price - Discount)",
//                 onChange: (value, formData, setFormData) => {
//                     handleTransactionSelect(value, formData, setFormData);
//                 },
//                 viewRender: (value, row) => row?.transaction_no || row?.SubscriptionTransaction?.transaction_no || value || '—'
//             },
//             {
//                 name: "invoice_no",
//                 label: "Invoice Number",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. INV-20260713-001",
//                 help: "Unique invoice number",
//                 viewRender: (value) => <span className="font-medium text-lg">{value}</span>
//             },
//             {
//                 name: "gst_number",
//                 label: "GST Number",
//                 type: "text",
//                 required: false,
//                 placeholder: "e.g. 24ABCDE1234F1Z5",
//                 help: "GST number of the company",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "billing_address",
//                 label: "Billing Address",
//                 type: "textarea",
//                 required: true,
//                 placeholder: "Enter billing address...",
//                 rows: 3,
//                 help: "Complete billing address",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "invoice_status",
//                 label: "Invoice Status",
//                 type: "select",
//                 required: true,
//                 options: invoiceStatusOptions,
//                 placeholder: "Select status",
//                 help: "Current status of the invoice",
//                 viewRender: (value) => {
//                     const color = getInvoiceStatusColor(value);
//                     return (
//                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}>
//                             <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
//                             {value || "Unknown"}
//                         </span>
//                     );
//                 }
//             },
//             {
//                 name: "due_date",
//                 label: "Due Date",
//                 type: "date",
//                 required: true,
//                 help: "Payment due date",
//                 viewRender: (value) => {
//                     if (!value) return '—';
//                     const dueDate = new Date(value);
//                     const today = new Date();
//                     const isOverdue = dueDate < today;
//                     return (
//                         <span className={isOverdue ? "text-red-500" : "text-gray-700"}>
//                             {formatDate(value)}
//                             {isOverdue && <span className="ml-1 text-xs text-red-500">(Overdue)</span>}
//                         </span>
//                     );
//                 }
//             },
//             {
//                 name: "subtotal",
//                 label: "Subtotal (₹)",
//                 type: "number",
//                 required: true,
//                 min: 0,
//                 step: "0.01",
//                 help: "Auto-calculated from transaction (Base Price - Discount)",
//                 disabled: true,
//                 className: "bg-gray-100 cursor-not-allowed",
//                 viewRender: (value) => <span className="font-medium">₹{formatCurrency(value)}</span>
//             },
//             {
//                 name: "gst",
//                 label: "GST Amount (₹)",
//                 type: "number",
//                 required: true,
//                 min: 0,
//                 step: "0.01",
//                 help: "Auto-filled from transaction",
//                 disabled: true,
//                 className: "bg-gray-100 cursor-not-allowed",
//                 viewRender: (value) => <span className="font-medium">₹{formatCurrency(value)}</span>
//             },
//             {
//                 name: "grand_total",
//                 label: "Grand Total (₹)",
//                 type: "number",
//                 required: true,
//                 min: 0,
//                 step: "0.01",
//                 help: "Subtotal + GST (Auto-calculated)",
//                 disabled: true,
//                 className: "bg-gray-100 cursor-not-allowed",
//                 viewRender: (value) => <span className="font-bold text-2xl text-[#2c0eee]">₹{formatCurrency(value)}</span>
//             },
//             {
//                 name: "pdf_file",
//                 label: "PDF Document",
//                 type: "file",
//                 required: false,
//                 accept: ".pdf",
//                 maxSize: 10,
//                 help: "Upload PDF invoice file (Max 10MB)",
//                 placeholder: "Click or drag to upload PDF",
//                 viewRender: (value, row) => {
//                     if (!row?.pdf_url) return '—';
//                     return (
//                         <div className="flex items-center gap-3">
//                             <span className="text-sm text-gray-600">PDF available</span>
//                             <button
//                                 onClick={() => window.open(getPdfUrl(row.pdf_url), '_blank')}
//                                 className="px-3 py-1 bg-[#2c0eee] text-white rounded-lg text-sm hover:bg-[#2c0eee] transition-colors"
//                             >
//                                 Download PDF
//                             </button>
//                         </div>
//                     );
//                 }
//             },
//             {
//                 name: "is_trending",
//                 label: "Mark as Trending",
//                 type: "checkbox",
//                 color: "text-yellow-500 focus:ring-yellow-500",
//                 help: "Highlight this invoice as trending",
//                 viewRender: (value) => (
//                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-yellow-500" : "bg-gray-400"}`} />
//                         {value ? "Trending" : "Not Trending"}
//                     </span>
//                 )
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
//                 viewRender: () => {
//                     const isActive =
//                         data?.is_status === true ||
//                         data?.is_status === 1 ||
//                         data?.is_status === "1" ||
//                         data?.is_status === "true";

//                     return <ViewBadge active={isActive} />;
//                 }
//             },
//         ];

//         // For view mode, add transaction details breakdown
//         if (mode === 'view') {
//             return [
//                 ...baseFields.slice(0, 6), // Up to due_date
//                 {
//                     name: "amount_breakdown",
//                     label: "Amount Breakdown",
//                     type: "text",
//                     viewRender: (value, row) => {
//                         const hasTransaction = row?.transaction_base_price > 0 || row?.transaction_base_price !== undefined;
//                         return (
//                             <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                                 {hasTransaction && (
//                                     <>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">Base Price</p>
//                                             <p className="font-semibold text-gray-700">₹{formatCurrency(row.transaction_base_price || 0)}</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">Discount</p>
//                                             <p className="font-semibold text-red-500">-₹{formatCurrency(row.transaction_discount_price || 0)}</p>
//                                         </div>
//                                         <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                             <p className="text-xs text-gray-400">Subtotal</p>
//                                             <p className="font-semibold text-[#2c0eee]">₹{formatCurrency(row.subtotal || 0)}</p>
//                                             <p className="text-xs text-gray-400 mt-1">= Base Price - Discount</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">GST</p>
//                                             <p className="font-semibold text-gray-700">₹{formatCurrency(row.gst || 0)}</p>
//                                         </div>
//                                         <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                             <p className="text-xs text-gray-400">Grand Total</p>
//                                             <p className="font-bold text-[#2c0eee]">₹{formatCurrency(row.grand_total || 0)}</p>
//                                             <p className="text-xs text-gray-400 mt-1">= Subtotal + GST</p>
//                                         </div>
//                                     </>
//                                 )}
//                                 {!hasTransaction && (
//                                     <>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">Subtotal</p>
//                                             <p className="font-semibold text-gray-700">₹{formatCurrency(row.subtotal || 0)}</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                             <p className="text-xs text-gray-400">GST</p>
//                                             <p className="font-semibold text-gray-700">₹{formatCurrency(row.gst || 0)}</p>
//                                         </div>
//                                         <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                             <p className="text-xs text-gray-400">Grand Total</p>
//                                             <p className="font-bold text-[#2c0eee]">₹{formatCurrency(row.grand_total || 0)}</p>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         );
//                     }
//                 },
//                 ...baseFields.slice(6) // Rest of the fields
//             ];
//         }

//         return baseFields;
//     };

//     // Validation rules
//     const getValidationRules = (existingData) => ({
//         company_id: {
//             required: true,
//             requiredMessage: 'Please select a company'
//         },
//         transaction_id: {
//             required: true,
//             requiredMessage: 'Please select a transaction'
//         },
//         invoice_no: {
//             required: true,
//             requiredMessage: 'Invoice number is required',
//         },
//         billing_address: {
//             required: true,
//             requiredMessage: 'Billing address is required',
//             minLength: 5,
//             minLengthMessage: 'Address must be at least 5 characters'
//         },
//         invoice_status: {
//             required: true,
//             requiredMessage: 'Please select an invoice status'
//         },
//         due_date: {
//             required: true,
//             requiredMessage: 'Due date is required',
//             custom: (value) => {
//                 if (value) {
//                     const today = new Date();
//                     today.setHours(0, 0, 0, 0);
//                     const dueDate = new Date(value);
//                     if (dueDate < today) {
//                         return 'Due date cannot be in the past';
//                     }
//                 }
//                 return null;
//             }
//         }
//     });

//     // Submit handler for add/edit
//     const handleSubmit = async (formData) => {
//         setLoading(true);

//         try {
//             const transactionId = formData.transaction_id
//                 ? parseInt(formData.transaction_id)
//                 : null;

//             if (!transactionId) {
//                 showError('Please select a transaction');
//                 return;
//             }

//             // IMPORTANT: Fetch the parent transaction again immediately before
//             // POST/PUT. This guarantees that invoice amounts come from the latest
//             // Subscription Transaction API data, not from editable form values.
//             let transactionData = await getTransactionData(transactionId, true);

//             if (!transactionData) {
//                 transactionData = transactions.find(
//                     t => String(t.id || t._id || t.transaction_id) === String(transactionId)
//                 );
//             }

//             if (!transactionData) {
//                 throw new Error('Selected subscription transaction was not found');
//             }

//             const amounts = calculateTransactionAmounts(transactionData);

//             console.log('Final invoice calculation from parent transaction:', {
//                 transaction_id: transactionId,
//                 base_price: amounts.basePrice,
//                 discount_price: amounts.discountPrice,
//                 gst_amount: amounts.gstAmount,
//                 subtotal: amounts.subtotal,
//                 grand_total: amounts.grandTotal,
//             });

//             const submitData = {
//                 company_id: parseInt(formData.company_id),
//                 transaction_id: transactionId,
//                 invoice_no: formData.invoice_no,
//                 gst_number: formData.gst_number || '',
//                 billing_address: formData.billing_address,

//                 // NEVER take these 3 values from formData.
//                 // They are calculated from Subscription Transaction.
//                 subtotal: Number(amounts.subtotal.toFixed(2)),
//                 gst: Number(amounts.gstAmount.toFixed(2)),
//                 grand_total: Number(amounts.grandTotal.toFixed(2)),

//                 invoice_status: formData.invoice_status,
//                 due_date: formData.due_date,
//                 is_trending: formData.is_trending || false,
//                 is_status: formData.status === 'active' ? 1 : 0,
//             };

//             if (formData.pdf_file && formData.pdf_file instanceof File) {
//                 submitData.pdf_url = formData.pdf_file;
//             } else if (mode === 'edit' && data?.pdf_url) {
//                 submitData.pdf_url = data.pdf_url;
//             }

//             console.log('Submitting invoice data:', submitData);

//             if (mode === 'edit') {
//                 await invoiceService.update(id, submitData);
//                 showSuccess('Invoice updated successfully');
//             } else {
//                 await invoiceService.create(submitData);
//                 showSuccess('Invoice created successfully');
//             }

//             navigate('/invoices');
//         } catch (error) {
//             console.error('Submit error:', error);
//             const errorMessage =
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 (typeof error === 'string' ? error : 'Failed to save');
//             showError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete handler
//     const handleDelete = async () => {
//         try {
//             await invoiceService.delete(id);
//             showSuccess("Invoice deleted successfully");
//             navigate('/invoices');
//         } catch (error) {
//             console.error('Delete error:', error);
//             showError(error?.response?.data?.message || error?.message || "Failed to delete invoice");
//             throw error;
//         }
//     };

//     // Prepare initial data
//     const getInitialData = () => {
//         if (mode === 'add') {
//             return {
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
//                 status: "active"
//             };
//         }

//         if (data) {
//             return {
//                 company_id: data.company_id || data.Company?.id || "",
//                 transaction_id: data.transaction_id || "",
//                 invoice_no: data.invoice_no || "",
//                 gst_number: data.gst_number || "",
//                 billing_address: data.billing_address || "",
//                 subtotal: data.subtotal || 0,
//                 gst: data.gst || 0,
//                 grand_total: data.grand_total || 0,
//                 invoice_status: data.invoice_status || "",
//                 due_date: data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : "",
//                 is_trending: data.is_trending || false,
//                 status: getStatusValue(data) ? "active" : "inactive",
//                 pdf_url: data.pdf_url || null,
//                 // For view mode
//                 transaction_base_price: data.transaction_base_price,
//                 transaction_discount_price: data.transaction_discount_price,
//                 transaction_gst_amount: data.transaction_gst_amount,
//                 transaction_no: data.transaction_no,
//                 Company: data.Company,
//                 transaction_id_raw: data.transaction_id,
//             };
//         }

//         return {
//             company_id: "",
//             transaction_id: "",
//             invoice_no: "",
//             gst_number: "",
//             billing_address: "",
//             subtotal: 0,
//             gst: 0,
//             grand_total: 0,
//             invoice_status: "",
//             due_date: "",
//             is_trending: false,
//             status: "active"
//         };
//     };

//     // Get title based on mode
//     const getTitle = () => {
//         if (mode === 'view') return 'Invoice Details';
//         if (mode === 'edit') return 'Edit Invoice';
//         return 'Add New Invoice';
//     };

//     // Get submit label
//     const getSubmitLabel = () => {
//         if (mode === 'edit') return 'Update Invoice';
//         return 'Create Invoice';
//     };

//     // Handle loading state
//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-3 text-gray-500">Loading invoice data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // If view/edit mode and data not loaded, show error
//     if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Invoice not found</p>
//                     <button
//                         onClick={() => navigate('/invoices')}
//                         className="mt-3 text-[#2c0eee] hover:underline"
//                     >
//                         Go back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <FormPage
//             title={getTitle()}
//             mode={mode}
//             fields={getFields()}
//             initialData={getInitialData()}
//             validationRules={getValidationRules(data)}
//             onSubmit={handleSubmit}
//             onDelete={handleDelete}
//             navigateTo="/invoices"
//             submitLabel={getSubmitLabel()}
//             editLabel="Edit Invoice"
//             deleteLabel="Delete Invoice"
//             loading={loading}
//             showDelete={mode !== 'add'}
//             showEdit={mode === 'view'}
//             enableEditMode={mode === 'view'}
//             breadcrumb={mode === 'view' ? 'Viewing invoice details' : mode === 'edit' ? 'Updating invoice' : 'Creating new invoice'}
//             onEdit={() => navigate(`/invoices/edit/${id}`, { state: { item: data } })}
//         />
//     );
// };

// export default InvoicesForm;






// pages/subscriptions/InvoicesForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { ViewBadge } from '../../components/common/FormPageUtils';
import { invoiceService } from '../../services/invoice.service';
import companyService from '../../services/company.service';
import { subscriptionTransactionService } from '../../services/subscriptionTransaction.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

const InvoicesForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [mode, setMode] = useState('add');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loadingRefData, setLoadingRefData] = useState(false);
    const [userNameCache, setUserNameCache] = useState({});
    const [pageLoading, setPageLoading] = useState(false);
    const [transactionCache, setTransactionCache] = useState({});

    // Determine mode from URL
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/view/')) {
            setMode('view');
        } else if (path.includes('/edit/')) {
            setMode('edit');
        } else {
            setMode('add');
        }
    }, [location.pathname]);

    // Fetch users for display names
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await fetchUsers();
                const userMap = {};
                Object.keys(users).forEach(id => {
                    userMap[id] = users[id].name;
                });
                setUserNameCache(userMap);
            } catch (error) {
                console.error('Failed to load users:', error);
            }
        };
        loadUsers();
    }, []);

    // Fetch reference data (companies and transactions)
    useEffect(() => {
        const fetchReferenceData = async () => {
            setLoadingRefData(true);
            try {
                const [companiesRes, transactionsRes] = await Promise.all([
                    companyService.getAll({ limit: 1000 }),
                    subscriptionTransactionService.getAll({ limit: 1000 })
                ]);

                // Extract data from response
                const companiesData = companiesRes.data?.data || companiesRes.data || [];
                const transactionsData = transactionsRes.data?.data || transactionsRes.data || [];

                console.log('Companies loaded:', companiesData.length);
                console.log('Transactions loaded:', transactionsData.length);

                setCompanies(Array.isArray(companiesData) ? companiesData : []);
                setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
            } catch (error) {
                console.error("Failed to fetch reference data:", error);
                showError("Failed to load companies or transactions");
            } finally {
                setLoadingRefData(false);
            }
        };
        fetchReferenceData();
    }, []);

    // Get transaction data from cache or fetch
    const getTransactionData = async (transactionId) => {
        if (!transactionId) return null;

        if (transactionCache[transactionId]) {
            return transactionCache[transactionId];
        }

        try {
            const response = await subscriptionTransactionService.getById(transactionId);
            // Extract data from response - handle different response structures
            const transData = response.data?.data || response.data || response;

            console.log('Fetched transaction data:', transData);

            setTransactionCache(prev => ({
                ...prev,
                [transactionId]: transData,
            }));

            return transData;
        } catch (error) {
            console.warn(`Failed to fetch transaction ${transactionId}:`, error);
            return null;
        }
    };

    // Fetch data for edit/view modes
    useEffect(() => {
        const fetchData = async () => {
            if ((mode === 'edit' || mode === 'view') && id) {
                setPageLoading(true);
                try {
                    let item = location.state?.item;

                    if (!item) {
                        const response = await invoiceService.getById(id);
                        // Extract data from response
                        item = response.data?.data || response.data || response;
                    }

                    console.log('Invoice data loaded:', item);

                    // Get transaction ID from various possible locations
                    let transactionId = null;
                    if (item.transaction_id) {
                        transactionId = item.transaction_id;
                    } else if (item.SubscriptionTransaction?.id) {
                        transactionId = item.SubscriptionTransaction.id;
                    } else if (item.SubscriptionTransaction?.transaction_id) {
                        transactionId = item.SubscriptionTransaction.transaction_id;
                    }

                    let transactionData = null;
                    let basePrice = 0;
                    let discountPrice = 0;
                    let gstAmount = 0;
                    let calculatedSubtotal = 0;

                    if (transactionId) {
                        transactionData = await getTransactionData(transactionId);

                        if (transactionData) {
                            // Extract values from transaction
                            basePrice = parseFloat(transactionData.base_price) || 0;
                            discountPrice = parseFloat(transactionData.discount_price) || 0;
                            gstAmount = parseFloat(transactionData.gst_amount) || 0;
                            calculatedSubtotal = basePrice - discountPrice;

                            console.log('Transaction data loaded:', { basePrice, discountPrice, gstAmount, calculatedSubtotal });
                        }
                    }

                    // If no transaction data, use invoice's own values
                    if (!transactionData) {
                        calculatedSubtotal = parseFloat(item.subtotal) || 0;
                        gstAmount = parseFloat(item.gst) || 0;
                    }

                    // Get company ID from various possible locations
                    let companyId = null;
                    if (item.company_id) {
                        companyId = item.company_id;
                    } else if (item.Company?.company_id) {
                        companyId = item.Company.company_id;
                    } else if (item.Company?.id) {
                        companyId = item.Company.id;
                    }

                    // Normalize the data
                    const normalizedData = {
                        id: item.id || item._id,
                        invoice_no: item.invoice_no || "",
                        gst_number: item.gst_number || "",
                        billing_address: item.billing_address || "",
                        subtotal: calculatedSubtotal,
                        gst: gstAmount,
                        grand_total: calculatedSubtotal + gstAmount,
                        pdf_url: item.pdf_url || null,
                        invoice_status: item.invoice_status || "",
                        due_date: item.due_date || null,
                        is_trending: item.is_trending === 1 || item.is_trending === true,
                        is_status: item.is_status === 1 || item.is_status === true,
                        status: item.is_status === 1 || item.is_status === true,
                        created_by: item.created_by || null,
                        updated_by: item.updated_by || null,
                        created_at: item.created_at || item.createdAt || null,
                        updated_at: item.updated_at || item.updatedAt || null,
                        Company: item.Company || null,
                        SubscriptionTransaction: transactionData || item.SubscriptionTransaction,
                        company_name: item.Company?.company_name || "",
                        company_id: companyId,
                        transaction_id: transactionId,
                        transaction_no: transactionData?.transaction_no || item.SubscriptionTransaction?.transaction_no || "",
                        transaction_base_price: basePrice,
                        transaction_discount_price: discountPrice,
                        transaction_gst_amount: gstAmount,
                        transaction_final_amount: parseFloat(transactionData?.final_amount) || 0,
                        raw: item,
                    };

                    console.log('Normalized data:', normalizedData);
                    setData(normalizedData);
                } catch (error) {
                    console.error('Fetch error:', error);
                    showError("Failed to load invoice data");
                    navigate('/invoices');
                } finally {
                    setPageLoading(false);
                }
            }
        };
        fetchData();
    }, [id, mode, location.state, navigate]);

    // Get user name with caching
    const getUserNameCached = (userId) => {
        if (!userId) return "-";
        return userNameCache[userId] || `User ${userId}`;
    };

    // Get status value
    const getStatusValue = (row) => {
        if (row?.is_status !== undefined) {
            return row.is_status;
        }
        if (row?.status !== undefined) {
            return row.status === 1 || row.status === true;
        }
        return true;
    };

    // Get invoice status color
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

    // Format currency helper
    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    // Get PDF URL
    const getPdfUrl = (pdfUrl) => {
        if (!pdfUrl) return null;
        if (pdfUrl.startsWith('http')) return pdfUrl;
        if (pdfUrl.startsWith('/')) {
            return `https://apidata.hiremejobs.in${pdfUrl}`;
        }
        return `https://apidata.hiremejobs.in/uploads/invoices/${pdfUrl}`;
    };

    // Calculate invoice amounts from the selected Subscription Transaction
    const calculateTransactionAmounts = (transaction) => {
        if (!transaction) {
            return {
                basePrice: 0,
                discountPrice: 0,
                gstAmount: 0,
                subtotal: 0,
                grandTotal: 0,
            };
        }

        const basePrice = parseFloat(transaction.base_price) || 0;
        const discountPrice = parseFloat(transaction.discount_price) || 0;
        const gstAmount = parseFloat(transaction.gst_amount) || 0;

        // Required business calculation:
        // subtotal = base_price - discount_price
        // gst = gst_amount
        // grand_total = subtotal + gst
        const subtotal = Math.max(0, basePrice - discountPrice);
        const grandTotal = subtotal + gstAmount;

        return {
            basePrice,
            discountPrice,
            gstAmount,
            subtotal,
            grandTotal,
        };
    };

    // Handle transaction selection for form
    const handleTransactionSelect = async (transactionId, formData, setFormData) => {
        console.log('Transaction selected:', transactionId);

        if (!transactionId) {
            setFormData(prev => ({
                ...prev,
                subtotal: 0,
                gst: 0,
                grand_total: 0,
            }));
            return;
        }

        try {
            // Fetch the parent transaction from the API so the values are always
            // taken from the latest Subscription Transaction record.
            let transData = await getTransactionData(transactionId);

            // Fallback to the loaded transaction list if the detail request did not return data.
            if (!transData) {
                transData = transactions.find(
                    t => String(t.id || t._id || t.transaction_id) === String(transactionId)
                );
            }

            if (!transData) {
                showError('Selected transaction details could not be found');
                return;
            }

            const amounts = calculateTransactionAmounts(transData);

            console.log('Transaction amounts:', amounts);

            setFormData(prev => ({
                ...prev,
                subtotal: amounts.subtotal.toFixed(2),
                gst: amounts.gstAmount.toFixed(2),
                grand_total: amounts.grandTotal.toFixed(2),
            }));
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            showError('Failed to fetch transaction details');
        }
    };

    // Define fields for the form
    const getFields = () => {
        // Map companies to options
        const companyOptions = companies.map(c => ({
            value: c.id || c._id || c.company_id,
            label: c.company_name || `Company #${c.id}`
        }));

        // Map transactions to options
        const transactionOptions = transactions.map(t => {
            const id = t.id || t._id || t.transaction_id;
            const transactionNo = t.transaction_no || `TXN-${id}`;
            const amount = formatCurrency(t.final_amount || 0);
            return {
                value: id,
                label: `${transactionNo} - ₹${amount}`
            };
        });

        const invoiceStatusOptions = [
            { value: 'Paid', label: 'Paid' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Overdue', label: 'Overdue' },
            { value: 'Cancelled', label: 'Cancelled' },
        ];

        const baseFields = [
            {
                name: "company_id",
                label: "Company",
                type: "select",
                required: true,
                options: companyOptions,
                placeholder: loadingRefData ? "Loading companies..." : "Select company",
                help: "Select the company this invoice belongs to",
                disabled: loadingRefData,
                viewRender: (value, row) => row?.Company?.company_name || value || '—'
            },
            {
                name: "transaction_id",
                label: "Transaction",
                type: "select",
                required: true,
                options: [{ value: "", label: "Select Transaction" }, ...transactionOptions],
                placeholder: "Select transaction",
                help: "Select a transaction to auto-calculate subtotal (Base Price - Discount)",
                onChange: (value, formData, setFormData) => {
                    handleTransactionSelect(value, formData, setFormData);
                },
                viewRender: (value, row) => row?.transaction_no || row?.SubscriptionTransaction?.transaction_no || value || '—'
            },
            {
                name: "invoice_no",
                label: "Invoice Number",
                type: "text",
                required: true,
                placeholder: "e.g. INV-20260713-001",
                help: "Unique invoice number",
                viewRender: (value) => <span className="font-medium text-lg">{value}</span>
            },
            {
                name: "gst_number",
                label: "GST Number",
                type: "text",
                required: false,
                placeholder: "e.g. 24ABCDE1234F1Z5",
                help: "GST number of the company",
                viewRender: (value) => value || '—'
            },
            {
                name: "billing_address",
                label: "Billing Address",
                type: "textarea",
                required: true,
                placeholder: "Enter billing address...",
                rows: 3,
                help: "Complete billing address",
                viewRender: (value) => value || '—'
            },
            {
                name: "invoice_status",
                label: "Invoice Status",
                type: "select",
                required: true,
                options: invoiceStatusOptions,
                placeholder: "Select status",
                help: "Current status of the invoice",
                viewRender: (value) => {
                    const color = getInvoiceStatusColor(value);
                    return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
                            {value || "Unknown"}
                        </span>
                    );
                }
            },
            {
                name: "due_date",
                label: "Due Date",
                type: "date",
                required: true,
                help: "Payment due date",
                viewRender: (value) => {
                    if (!value) return '—';
                    const dueDate = new Date(value);
                    const today = new Date();
                    const isOverdue = dueDate < today;
                    return (
                        <span className={isOverdue ? "text-red-500" : "text-gray-700"}>
                            {formatDate(value)}
                            {isOverdue && <span className="ml-1 text-xs text-red-500">(Overdue)</span>}
                        </span>
                    );
                }
            },
            {
                name: "pdf_file",
                label: "PDF Document",
                type: "file",
                required: false,
                accept: ".pdf",
                maxSize: 10,
                help: "Upload PDF invoice file (Max 10MB)",
                placeholder: "Click or drag to upload PDF",
                viewRender: (value, row) => {
                    if (!row?.pdf_url) return '—';
                    return (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">PDF available</span>
                            <button
                                onClick={() => window.open(getPdfUrl(row.pdf_url), '_blank')}
                                className="px-3 py-1 bg-[#2c0eee] text-white rounded-lg text-sm hover:bg-[#2c0eee] transition-colors"
                            >
                                Download PDF
                            </button>
                        </div>
                    );
                }
            },
            {
                name: "is_trending",
                label: "Mark as Trending",
                type: "checkbox",
                color: "text-yellow-500 focus:ring-yellow-500",
                help: "Highlight this invoice as trending",
                viewRender: (value) => (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-yellow-500" : "bg-gray-400"}`} />
                        {value ? "Trending" : "Not Trending"}
                    </span>
                )
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
                viewRender: () => {
                    const isActive =
                        data?.is_status === true ||
                        data?.is_status === 1 ||
                        data?.is_status === "1" ||
                        data?.is_status === "true";

                    return <ViewBadge active={isActive} />;
                }
            },
        ];

        // For view mode, add the additional fields
        if (mode === 'view') {
            // Create view-only fields for amounts
            const viewOnlyFields = [
                {
                    name: "subtotal_display",
                    label: "Subtotal (₹)",
                    type: "text",
                    viewRender: (value, row) => <span className="font-medium">₹{formatCurrency(row.subtotal || 0)}</span>
                },
                {
                    name: "gst_display",
                    label: "GST Amount (₹)",
                    type: "text",
                    viewRender: (value, row) => <span className="font-medium">₹{formatCurrency(row.gst || 0)}</span>
                },
                {
                    name: "grand_total_display",
                    label: "Grand Total (₹)",
                    type: "text",
                    viewRender: (value, row) => <span className="font-bold text-2xl text-[#2c0eee]">₹{formatCurrency(row.grand_total || 0)}</span>
                },
                {
                    name: "created_by_display",
                    label: "Created By",
                    type: "text",
                    viewRender: (value, row) => getUserNameCached(row.created_by)
                },
                {
                    name: "created_at_display",
                    label: "Created At",
                    type: "text",
                    viewRender: (value, row) => row.created_at ? formatDate(row.created_at) : '—'
                },
                {
                    name: "updated_by_display",
                    label: "Updated By",
                    type: "text",
                    viewRender: (value, row) => getUserNameCached(row.updated_by)
                },
                {
                    name: "updated_at_display",
                    label: "Updated At",
                    type: "text",
                    viewRender: (value, row) => row.updated_at ? formatDate(row.updated_at) : '—'
                }
            ];

            // Insert the view-only fields before the status field (or at the end)
            const statusIndex = baseFields.findIndex(field => field.name === 'status');

            // Create a copy of baseFields without the status field for now
            let fieldsWithoutStatus = baseFields.filter(field => field.name !== 'status');

            // Insert view-only fields
            if (statusIndex !== -1) {
                // Insert before the status field
                fieldsWithoutStatus.splice(statusIndex, 0, ...viewOnlyFields);
            } else {
                // Append at the end
                fieldsWithoutStatus = [...fieldsWithoutStatus, ...viewOnlyFields];
            }

            // Add status field back at the end
            const statusField = baseFields.find(field => field.name === 'status');
            if (statusField) {
                fieldsWithoutStatus.push(statusField);
            }

            // Add amount breakdown section
            const amountBreakdownField = {
                name: "amount_breakdown",
                label: "Amount Breakdown",
                type: "text",
                viewRender: (value, row) => {
                    const hasTransaction = row?.transaction_base_price > 0 || row?.transaction_base_price !== undefined;
                    return (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {hasTransaction && (
                                <>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-400">Base Price</p>
                                        <p className="font-semibold text-gray-700">₹{formatCurrency(row.transaction_base_price || 0)}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-400">Discount</p>
                                        <p className="font-semibold text-red-500">-₹{formatCurrency(row.transaction_discount_price || 0)}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                                        <p className="text-xs text-gray-400">Subtotal</p>
                                        <p className="font-semibold text-[#2c0eee]">₹{formatCurrency(row.subtotal || 0)}</p>
                                        <p className="text-xs text-gray-400 mt-1">= Base Price - Discount</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-400">GST</p>
                                        <p className="font-semibold text-gray-700">₹{formatCurrency(row.gst || 0)}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                                        <p className="text-xs text-gray-400">Grand Total</p>
                                        <p className="font-bold text-[#2c0eee]">₹{formatCurrency(row.grand_total || 0)}</p>
                                        <p className="text-xs text-gray-400 mt-1">= Subtotal + GST</p>
                                    </div>
                                </>
                            )}
                            {!hasTransaction && (
                                <>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-400">Subtotal</p>
                                        <p className="font-semibold text-gray-700">₹{formatCurrency(row.subtotal || 0)}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-400">GST</p>
                                        <p className="font-semibold text-gray-700">₹{formatCurrency(row.gst || 0)}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                                        <p className="text-xs text-gray-400">Grand Total</p>
                                        <p className="font-bold text-[#2c0eee]">₹{formatCurrency(row.grand_total || 0)}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                }
            };

            // Insert amount breakdown after billing_address or at a specific position
            const billingAddressIndex = fieldsWithoutStatus.findIndex(field => field.name === 'billing_address');
            if (billingAddressIndex !== -1) {
                fieldsWithoutStatus.splice(billingAddressIndex + 1, 0, amountBreakdownField);
            } else {
                // Insert near the beginning
                fieldsWithoutStatus.splice(2, 0, amountBreakdownField);
            }

            return fieldsWithoutStatus;
        }

        // For add/edit mode, return base fields without the display-only fields
        return baseFields;
    };

    // Validation rules
    const getValidationRules = (existingData) => ({
        company_id: {
            required: true,
            requiredMessage: 'Please select a company'
        },
        transaction_id: {
            required: true,
            requiredMessage: 'Please select a transaction'
        },
        invoice_no: {
            required: true,
            requiredMessage: 'Invoice number is required',
        },
        billing_address: {
            required: true,
            requiredMessage: 'Billing address is required',
            minLength: 5,
            minLengthMessage: 'Address must be at least 5 characters'
        },
        invoice_status: {
            required: true,
            requiredMessage: 'Please select an invoice status'
        },
        due_date: {
            required: true,
            requiredMessage: 'Due date is required',
            custom: (value) => {
                if (value) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dueDate = new Date(value);
                    if (dueDate < today) {
                        return 'Due date cannot be in the past';
                    }
                }
                return null;
            }
        }
    });

    // Submit handler for add/edit
    const handleSubmit = async (formData) => {
        setLoading(true);

        try {
            const transactionId = formData.transaction_id
                ? parseInt(formData.transaction_id)
                : null;

            if (!transactionId) {
                showError('Please select a transaction');
                return;
            }

            // IMPORTANT: Fetch the parent transaction again immediately before
            // POST/PUT. This guarantees that invoice amounts come from the latest
            // Subscription Transaction API data, not from editable form values.
            let transactionData = await getTransactionData(transactionId, true);

            if (!transactionData) {
                transactionData = transactions.find(
                    t => String(t.id || t._id || t.transaction_id) === String(transactionId)
                );
            }

            if (!transactionData) {
                throw new Error('Selected subscription transaction was not found');
            }

            const amounts = calculateTransactionAmounts(transactionData);

            console.log('Final invoice calculation from parent transaction:', {
                transaction_id: transactionId,
                base_price: amounts.basePrice,
                discount_price: amounts.discountPrice,
                gst_amount: amounts.gstAmount,
                subtotal: amounts.subtotal,
                grand_total: amounts.grandTotal,
            });

            const submitData = {
                company_id: parseInt(formData.company_id),
                transaction_id: transactionId,
                invoice_no: formData.invoice_no,
                gst_number: formData.gst_number || '',
                billing_address: formData.billing_address,

                // NEVER take these 3 values from formData.
                // They are calculated from Subscription Transaction.
                subtotal: Number(amounts.subtotal.toFixed(2)),
                gst: Number(amounts.gstAmount.toFixed(2)),
                grand_total: Number(amounts.grandTotal.toFixed(2)),

                invoice_status: formData.invoice_status,
                due_date: formData.due_date,
                is_trending: formData.is_trending || false,
                is_status: formData.status === 'active' ? 1 : 0,
            };

            if (formData.pdf_file && formData.pdf_file instanceof File) {
                submitData.pdf_url = formData.pdf_file;
            } else if (mode === 'edit' && data?.pdf_url) {
                submitData.pdf_url = data.pdf_url;
            }

            console.log('Submitting invoice data:', submitData);

            if (mode === 'edit') {
                await invoiceService.update(id, submitData);
                showSuccess('Invoice updated successfully');
            } else {
                await invoiceService.create(submitData);
                showSuccess('Invoice created successfully');
            }

            navigate('/invoices');
        } catch (error) {
            console.error('Submit error:', error);
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                (typeof error === 'string' ? error : 'Failed to save');
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        try {
            await invoiceService.delete(id);
            showSuccess("Invoice deleted successfully");
            navigate('/invoices');
        } catch (error) {
            console.error('Delete error:', error);
            showError(error?.response?.data?.message || error?.message || "Failed to delete invoice");
            throw error;
        }
    };

    // Prepare initial data
    const getInitialData = () => {
        if (mode === 'add') {
            return {
                company_id: "",
                transaction_id: "",
                invoice_no: "",
                gst_number: "",
                billing_address: "",
                subtotal: 0,
                gst: 0,
                grand_total: 0,
                invoice_status: "",
                due_date: "",
                is_trending: false,
                status: "active"
            };
        }

        if (data) {
            return {
                company_id: data.company_id || data.Company?.id || "",
                transaction_id: data.transaction_id || "",
                invoice_no: data.invoice_no || "",
                gst_number: data.gst_number || "",
                billing_address: data.billing_address || "",
                subtotal: data.subtotal || 0,
                gst: data.gst || 0,
                grand_total: data.grand_total || 0,
                invoice_status: data.invoice_status || "",
                due_date: data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : "",
                is_trending: data.is_trending || false,
                status: getStatusValue(data) ? "active" : "inactive",
                pdf_url: data.pdf_url || null,
                // For view mode
                transaction_base_price: data.transaction_base_price,
                transaction_discount_price: data.transaction_discount_price,
                transaction_gst_amount: data.transaction_gst_amount,
                transaction_no: data.transaction_no,
                Company: data.Company,
                transaction_id_raw: data.transaction_id,
                // Additional view mode fields
                created_by: data.created_by,
                created_at: data.created_at,
                updated_by: data.updated_by,
                updated_at: data.updated_at,
            };
        }

        return {
            company_id: "",
            transaction_id: "",
            invoice_no: "",
            gst_number: "",
            billing_address: "",
            subtotal: 0,
            gst: 0,
            grand_total: 0,
            invoice_status: "",
            due_date: "",
            is_trending: false,
            status: "active"
        };
    };

    // Get title based on mode
    const getTitle = () => {
        if (mode === 'view') return 'Invoice Details';
        if (mode === 'edit') return 'Edit Invoice';
        return 'Add New Invoice';
    };

    // Get submit label
    const getSubmitLabel = () => {
        if (mode === 'edit') return 'Update Invoice';
        return 'Create Invoice';
    };

    // Handle loading state
    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-gray-500">Loading invoice data...</p>
                </div>
            </div>
        );
    }

    // If view/edit mode and data not loaded, show error
    if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Invoice not found</p>
                    <button
                        onClick={() => navigate('/invoices')}
                        className="mt-3 text-[#2c0eee] hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <FormPage
            title={getTitle()}
            mode={mode}
            fields={getFields()}
            initialData={getInitialData()}
            validationRules={getValidationRules(data)}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            navigateTo="/invoices"
            submitLabel={getSubmitLabel()}
            editLabel="Edit Invoice"
            deleteLabel="Delete Invoice"
            loading={loading}
            showDelete={mode !== 'add'}
            showEdit={mode === 'view'}
            enableEditMode={mode === 'view'}
            breadcrumb={mode === 'view' ? 'Viewing invoice details' : mode === 'edit' ? 'Updating invoice' : 'Creating new invoice'}
            onEdit={() => navigate(`/invoices/edit/${id}`, { state: { item: data } })}
        />
    );
};

export default InvoicesForm;