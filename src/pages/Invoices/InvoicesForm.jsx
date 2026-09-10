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

//         if (transactionCache[transactionId]) {
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

//         // For view mode, add the additional fields
//         if (mode === 'view') {
//             // Create view-only fields for amounts
//             const viewOnlyFields = [
//                 {
//                     name: "subtotal_display",
//                     label: "Subtotal (₹)",
//                     type: "text",
//                     viewRender: (value, row) => <span className="font-medium">₹{formatCurrency(row.subtotal || 0)}</span>
//                 },
//                 {
//                     name: "gst_display",
//                     label: "GST Amount (₹)",
//                     type: "text",
//                     viewRender: (value, row) => <span className="font-medium">₹{formatCurrency(row.gst || 0)}</span>
//                 },
//                 {
//                     name: "grand_total_display",
//                     label: "Grand Total (₹)",
//                     type: "text",
//                     viewRender: (value, row) => <span className="font-bold text-2xl text-[#2c0eee]">₹{formatCurrency(row.grand_total || 0)}</span>
//                 },
//                 {
//                     name: "created_by_display",
//                     label: "Created By",
//                     type: "text",
//                     viewRender: (value, row) => getUserNameCached(row.created_by)
//                 },
//                 {
//                     name: "created_at_display",
//                     label: "Created At",
//                     type: "text",
//                     viewRender: (value, row) => row.created_at ? formatDate(row.created_at) : '—'
//                 },
//                 {
//                     name: "updated_by_display",
//                     label: "Updated By",
//                     type: "text",
//                     viewRender: (value, row) => getUserNameCached(row.updated_by)
//                 },
//                 {
//                     name: "updated_at_display",
//                     label: "Updated At",
//                     type: "text",
//                     viewRender: (value, row) => row.updated_at ? formatDate(row.updated_at) : '—'
//                 }
//             ];

//             // Insert the view-only fields before the status field (or at the end)
//             const statusIndex = baseFields.findIndex(field => field.name === 'status');

//             // Create a copy of baseFields without the status field for now
//             let fieldsWithoutStatus = baseFields.filter(field => field.name !== 'status');

//             // Insert view-only fields
//             if (statusIndex !== -1) {
//                 // Insert before the status field
//                 fieldsWithoutStatus.splice(statusIndex, 0, ...viewOnlyFields);
//             } else {
//                 // Append at the end
//                 fieldsWithoutStatus = [...fieldsWithoutStatus, ...viewOnlyFields];
//             }

//             // Add status field back at the end
//             const statusField = baseFields.find(field => field.name === 'status');
//             if (statusField) {
//                 fieldsWithoutStatus.push(statusField);
//             }

//             // Add amount breakdown section
//             const amountBreakdownField = {
//                 name: "amount_breakdown",
//                 label: "Amount Breakdown",
//                 type: "text",
//                 viewRender: (value, row) => {
//                     const hasTransaction = row?.transaction_base_price > 0 || row?.transaction_base_price !== undefined;
//                     return (
//                         <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                             {hasTransaction && (
//                                 <>
//                                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                         <p className="text-xs text-gray-400">Base Price</p>
//                                         <p className="font-semibold text-gray-700">₹{formatCurrency(row.transaction_base_price || 0)}</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                         <p className="text-xs text-gray-400">Discount</p>
//                                         <p className="font-semibold text-red-500">-₹{formatCurrency(row.transaction_discount_price || 0)}</p>
//                                     </div>
//                                     <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                         <p className="text-xs text-gray-400">Subtotal</p>
//                                         <p className="font-semibold text-[#2c0eee]">₹{formatCurrency(row.subtotal || 0)}</p>
//                                         <p className="text-xs text-gray-400 mt-1">= Base Price - Discount</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                         <p className="text-xs text-gray-400">GST</p>
//                                         <p className="font-semibold text-gray-700">₹{formatCurrency(row.gst || 0)}</p>
//                                     </div>
//                                     <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                         <p className="text-xs text-gray-400">Grand Total</p>
//                                         <p className="font-bold text-[#2c0eee]">₹{formatCurrency(row.grand_total || 0)}</p>
//                                         <p className="text-xs text-gray-400 mt-1">= Subtotal + GST</p>
//                                     </div>
//                                 </>
//                             )}
//                             {!hasTransaction && (
//                                 <>
//                                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                         <p className="text-xs text-gray-400">Subtotal</p>
//                                         <p className="font-semibold text-gray-700">₹{formatCurrency(row.subtotal || 0)}</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                                         <p className="text-xs text-gray-400">GST</p>
//                                         <p className="font-semibold text-gray-700">₹{formatCurrency(row.gst || 0)}</p>
//                                     </div>
//                                     <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
//                                         <p className="text-xs text-gray-400">Grand Total</p>
//                                         <p className="font-bold text-[#2c0eee]">₹{formatCurrency(row.grand_total || 0)}</p>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     );
//                 }
//             };

//             // Insert amount breakdown after billing_address or at a specific position
//             const billingAddressIndex = fieldsWithoutStatus.findIndex(field => field.name === 'billing_address');
//             if (billingAddressIndex !== -1) {
//                 fieldsWithoutStatus.splice(billingAddressIndex + 1, 0, amountBreakdownField);
//             } else {
//                 // Insert near the beginning
//                 fieldsWithoutStatus.splice(2, 0, amountBreakdownField);
//             }

//             return fieldsWithoutStatus;
//         }

//         // For add/edit mode, return base fields without the display-only fields
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
//                 // Additional view mode fields
//                 created_by: data.created_by,
//                 created_at: data.created_at,
//                 updated_by: data.updated_by,
//                 updated_at: data.updated_at,
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
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdEdit,
  MdReceipt,
  MdBusiness,
  MdSwapHoriz,
  MdAttachMoney,
  MdFlag,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
  MdPerson,
  MdDateRange,
  MdPictureAsPdf,
  MdCloudUpload,
  MdClose,
  MdDescription,
  MdCalculate,
  MdEventNote,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { invoiceService } from "../../services/invoice.service";
import companyService from "../../services/company.service";
import { subscriptionTransactionService } from "../../services/subscriptionTransaction.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

// ─── Status pill ────────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    icon: MdErrorOutline,
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.inactive;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ─── Invoice status pill ────────────────────────────────────────
const INVOICE_STATUS_STYLES = {
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Overdue: "bg-red-50 text-red-700 ring-1 ring-red-200",
  overdue: "bg-red-50 text-red-700 ring-1 ring-red-200",
  Cancelled: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  cancelled: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

const InvoiceStatusPill = ({ status }) => {
  if (!status) return null;
  const style = INVOICE_STATUS_STYLES[status] || "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      <MdReceipt size={13} />
      {status}
    </span>
  );
};

// ─── Helpers ────────────────────────────────────────────────────
const formatCurrency = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

const formatINR = (value) => {
  if (value === null || value === undefined || value === "") return "₹0.00";
  const num = Number(value);
  if (isNaN(num)) return "₹0.00";
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getPdfUrl = (pdfUrl) => {
  if (!pdfUrl) return null;
  if (pdfUrl.startsWith("http")) return pdfUrl;
  if (pdfUrl.startsWith("/")) return `${API_BASE_URL}${pdfUrl}`;
  return `${API_BASE_URL}/uploads/invoices/${pdfUrl}`;
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdInfoOutline },
  { id: "amounts", label: "Amounts", icon: MdCalculate },
  { id: "status", label: "Status & File", icon: MdFlag },
  { id: "metadata", label: "Activity", icon: MdPerson },
];

// ─── Main Component ─────────────────────────────────────────────
const InvoicesForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Dropdown data
  const [companies, setCompanies] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingRefData, setLoadingRefData] = useState(false);
  const [userNameCache, setUserNameCache] = useState({});
  const [transactionCache, setTransactionCache] = useState({});

  // PDF file handling
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfRemoved, setPdfRemoved] = useState(false);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
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
    status: "active",
    pdf_url: null,
    created_by: null,
    updated_by: null,
    created_at: null,
    updated_at: null,
    transaction_no: "",
    transaction_base_price: 0,
    transaction_discount_price: 0,
    transaction_gst_amount: 0,
  });

  const [errors, setErrors] = useState({});

  // ─── Determine mode ──────────────────────────────────────────
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/view/")) setMode("view");
    else if (path.includes("/edit/")) setMode("edit");
    else setMode("add");
  }, [location.pathname]);

  useEffect(() => {
    setActiveTab("overview");
  }, [mode, id]);

  // ─── Load users ──────────────────────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((uid) => {
          userMap[uid] = users[uid].name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  // ─── Load reference data ─────────────────────────────────────
  useEffect(() => {
    const fetchReferenceData = async () => {
      setLoadingRefData(true);
      try {
        const [companiesRes, transactionsRes] = await Promise.all([
          companyService.getAll({ limit: 1000 }),
          subscriptionTransactionService.getAll({ limit: 1000 }),
        ]);

        const companiesData =
          companiesRes.data?.data || companiesRes.data || [];
        const transactionsData =
          transactionsRes.data?.data || transactionsRes.data || [];

        setCompanies(Array.isArray(companiesData) ? companiesData : []);
        setTransactions(
          Array.isArray(transactionsData) ? transactionsData : []
        );
      } catch (error) {
        console.error("Failed to fetch reference data:", error);
        showError("Failed to load companies or transactions");
      } finally {
        setLoadingRefData(false);
      }
    };
    fetchReferenceData();
  }, []);

  // ─── Transaction data helper ─────────────────────────────────
  const getTransactionData = async (transactionId) => {
    if (!transactionId) return null;
    if (transactionCache[transactionId]) return transactionCache[transactionId];

    try {
      const response = await subscriptionTransactionService.getById(
        transactionId
      );
      const transData = response.data?.data || response.data || response;
      setTransactionCache((prev) => ({ ...prev, [transactionId]: transData }));
      return transData;
    } catch (error) {
      console.warn(`Failed to fetch transaction ${transactionId}:`, error);
      return null;
    }
  };

  // ─── Fetch invoice data ──────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if ((mode === "edit" || mode === "view") && id) {
        setFetchLoading(true);
        try {
          let item = location.state?.item;
          if (!item) {
            const response = await invoiceService.getById(id);
            item = response.data?.data || response.data || response;
          }

          let transactionId = null;
          if (item.transaction_id) transactionId = item.transaction_id;
          else if (item.SubscriptionTransaction?.id)
            transactionId = item.SubscriptionTransaction.id;
          else if (item.SubscriptionTransaction?.transaction_id)
            transactionId = item.SubscriptionTransaction.transaction_id;

          let transactionData = null;
          let basePrice = 0;
          let discountPrice = 0;
          let gstAmount = 0;
          let calculatedSubtotal = 0;

          if (transactionId) {
            transactionData = await getTransactionData(transactionId);
            if (transactionData) {
              basePrice = parseFloat(transactionData.base_price) || 0;
              discountPrice = parseFloat(transactionData.discount_price) || 0;
              gstAmount = parseFloat(transactionData.gst_amount) || 0;
              calculatedSubtotal = basePrice - discountPrice;
            }
          }

          if (!transactionData) {
            calculatedSubtotal = parseFloat(item.subtotal) || 0;
            gstAmount = parseFloat(item.gst) || 0;
          }

          let companyId = null;
          if (item.company_id) companyId = item.company_id;
          else if (item.Company?.company_id) companyId = item.Company.company_id;
          else if (item.Company?.id) companyId = item.Company.id;

          setFormValues({
            company_id: companyId ? String(companyId) : "",
            transaction_id: transactionId ? String(transactionId) : "",
            invoice_no: item.invoice_no || "",
            gst_number: item.gst_number || "",
            billing_address: item.billing_address || "",
            subtotal: calculatedSubtotal,
            gst: gstAmount,
            grand_total: calculatedSubtotal + gstAmount,
            invoice_status: item.invoice_status || "",
            due_date: item.due_date
              ? new Date(item.due_date).toISOString().split("T")[0]
              : "",
            is_trending:
              item.is_trending === 1 || item.is_trending === true,
            status:
              item.is_status === 1 || item.is_status === true
                ? "active"
                : "inactive",
            pdf_url: item.pdf_url || null,
            created_by: item.created_by || null,
            updated_by: item.updated_by || null,
            created_at: item.created_at || item.createdAt || null,
            updated_at: item.updated_at || item.updatedAt || null,
            transaction_no:
              transactionData?.transaction_no ||
              item.SubscriptionTransaction?.transaction_no ||
              "",
            transaction_base_price: basePrice,
            transaction_discount_price: discountPrice,
            transaction_gst_amount: gstAmount,
          });

          if (item.pdf_url) setExistingPdfUrl(getPdfUrl(item.pdf_url));

          setData({ ...item, transaction_id: transactionId });
        } catch (error) {
          console.error("Fetch error:", error);
          showError("Failed to load invoice data");
          navigate("/invoices");
        } finally {
          setFetchLoading(false);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mode, location.state, navigate]);

  // ─── User name helper ────────────────────────────────────────
  const getUserNameCached = (userId) => {
    if (!userId) return "—";
    return userNameCache[userId] || `User ${userId}`;
  };

  // ─── Transaction amount calculation ──────────────────────────
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
    const subtotal = Math.max(0, basePrice - discountPrice);
    const grandTotal = subtotal + gstAmount;
    return { basePrice, discountPrice, gstAmount, subtotal, grandTotal };
  };

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTransactionSelect = async (e) => {
    const transactionId = e.target.value;
    setFormValues((prev) => ({ ...prev, transaction_id: transactionId }));

    if (!transactionId) {
      setFormValues((prev) => ({
        ...prev,
        subtotal: 0,
        gst: 0,
        grand_total: 0,
      }));
      return;
    }

    try {
      let transData = await getTransactionData(transactionId);
      if (!transData) {
        transData = transactions.find(
          (t) =>
            String(t.id || t._id || t.transaction_id) === String(transactionId)
        );
      }
      if (!transData) {
        showError("Selected transaction details could not be found");
        return;
      }
      const amounts = calculateTransactionAmounts(transData);
      setFormValues((prev) => ({
        ...prev,
        subtotal: amounts.subtotal,
        gst: amounts.gstAmount,
        grand_total: amounts.grandTotal,
        transaction_no: transData.transaction_no || "",
        transaction_base_price: amounts.basePrice,
        transaction_discount_price: amounts.discountPrice,
        transaction_gst_amount: amounts.gstAmount,
      }));
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      showError("Failed to fetch transaction details");
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      showError("Please upload a PDF file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showError("PDF size must be less than 10MB");
      return;
    }
    setPdfFile(file);
    setPdfRemoved(false);
  };

  const handlePdfRemove = () => {
    setPdfFile(null);
    setPdfRemoved(true);
    setExistingPdfUrl(null);
    setFormValues((prev) => ({ ...prev, pdf_url: null }));
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.company_id)
      newErrors.company_id = "Please select a company";
    if (!formValues.transaction_id)
      newErrors.transaction_id = "Please select a transaction";
    if (!formValues.invoice_no?.trim())
      newErrors.invoice_no = "Invoice number is required";
    if (!formValues.billing_address?.trim())
      newErrors.billing_address = "Billing address is required";
    else if (formValues.billing_address.trim().length < 5)
      newErrors.billing_address = "Address must be at least 5 characters";
    if (!formValues.invoice_status)
      newErrors.invoice_status = "Please select an invoice status";
    if (!formValues.due_date) {
      newErrors.due_date = "Due date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(formValues.due_date);
      if (dueDate < today) newErrors.due_date = "Due date cannot be in the past";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (
        newErrors.company_id ||
        newErrors.transaction_id ||
        newErrors.invoice_no ||
        newErrors.billing_address
      ) {
        setActiveTab("overview");
      } else if (newErrors.invoice_status || newErrors.due_date) {
        setActiveTab("status");
      }
      showError(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") return;
    if (!validate()) return;

    setLoading(true);
    try {
      const transactionId = formValues.transaction_id
        ? parseInt(formValues.transaction_id)
        : null;

      let transactionData = await getTransactionData(transactionId);
      if (!transactionData) {
        transactionData = transactions.find(
          (t) =>
            String(t.id || t._id || t.transaction_id) === String(transactionId)
        );
      }
      if (!transactionData) {
        throw new Error("Selected subscription transaction was not found");
      }

      const amounts = calculateTransactionAmounts(transactionData);

      const submitData = {
        company_id: parseInt(formValues.company_id),
        transaction_id: transactionId,
        invoice_no: formValues.invoice_no,
        gst_number: formValues.gst_number || "",
        billing_address: formValues.billing_address,
        subtotal: Number(amounts.subtotal.toFixed(2)),
        gst: Number(amounts.gstAmount.toFixed(2)),
        grand_total: Number(amounts.grandTotal.toFixed(2)),
        invoice_status: formValues.invoice_status,
        due_date: formValues.due_date,
        is_trending: formValues.is_trending || false,
        is_status: formValues.status === "active" ? 1 : 0,
      };

      if (pdfFile instanceof File) {
        submitData.pdf_url = pdfFile;
      } else if (mode === "edit" && pdfRemoved) {
        submitData.pdf_url = null;
      } else if (mode === "edit" && data?.pdf_url) {
        submitData.pdf_url = data.pdf_url;
      }

      if (mode === "edit") {
        await invoiceService.update(id, submitData);
        showSuccess("Invoice updated successfully");
      } else {
        await invoiceService.create(submitData);
        showSuccess("Invoice created successfully");
      }
      navigate("/invoices");
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : "Failed to save");
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await invoiceService.delete(id);
      showSuccess("Invoice deleted successfully");
      setShowDeleteDialog(false);
      navigate("/invoices");
    } catch (error) {
      console.error("Delete error:", error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete invoice"
      );
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Company options ─────────────────────────────────────────
  const companyOptions = companies.map((c) => ({
    value: String(c.id || c._id || c.company_id),
    label: c.company_name || `Company #${c.id}`,
  }));

  const transactionOptions = transactions.map((t) => {
    const tid = t.id || t._id || t.transaction_id;
    const transactionNo = t.transaction_no || `TXN-${tid}`;
    const amount = formatCurrency(t.final_amount || 0);
    return { value: String(tid), label: `${transactionNo} - ₹${amount}` };
  });

  const invoiceStatusOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Overdue", label: "Overdue" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // ─── Loading state ───────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading invoice data...</p>
        </div>
      </div>
    );
  }

  if ((mode === "view" || mode === "edit") && !data && !fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center">
          <p className="text-slate-500">Invoice not found</p>
          <button
            onClick={() => navigate("/invoices")}
            className="mt-3 text-blue-600 hover:underline text-sm font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroInvoiceNo = formValues.invoice_no?.trim() || "New Invoice";
  const heroCompany =
    formValues.company_id
      ? companyOptions.find((o) => o.value === formValues.company_id)?.label ||
        ""
      : "";
  const initials = "INV";
  const isViewMode = mode === "view";

  const isOverdue =
    formValues.due_date &&
    new Date(formValues.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Company */}
              <div>
                <FieldLabel required>Company</FieldLabel>
                <div className="relative">
                  <MdBusiness
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="company_id"
                    value={formValues.company_id}
                    onChange={handleInputChange}
                    disabled={isViewMode || loadingRefData}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.company_id
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                  >
                    <option value="">
                      {loadingRefData
                        ? "Loading companies..."
                        : "Select company"}
                    </option>
                    {companyOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.company_id && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.company_id}
                  </p>
                )}
              </div>

              {/* Transaction */}
              <div>
                <FieldLabel required>Transaction</FieldLabel>
                <div className="relative">
                  <MdSwapHoriz
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="transaction_id"
                    value={formValues.transaction_id}
                    onChange={handleTransactionSelect}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.transaction_id
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                  >
                    <option value="">Select transaction</option>
                    {transactionOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.transaction_id ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.transaction_id}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Selecting a transaction auto-calculates Subtotal (Base −
                    Discount).
                  </p>
                )}
              </div>

              {/* Invoice No */}
              <div className="sm:col-span-2">
                <FieldLabel required>Invoice Number</FieldLabel>
                <div className="relative">
                  <MdReceipt
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="invoice_no"
                    value={formValues.invoice_no}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.invoice_no
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="e.g. INV-20260713-001"
                  />
                </div>
                {errors.invoice_no && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.invoice_no}
                  </p>
                )}
              </div>

              {/* GST Number */}
              <div className="sm:col-span-2">
                <FieldLabel>GST Number</FieldLabel>
                <input
                  type="text"
                  name="gst_number"
                  value={formValues.gst_number}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="e.g. 24ABCDE1234F1Z5"
                />
              </div>

              {/* Billing Address */}
              <div className="sm:col-span-2">
                <FieldLabel required>Billing Address</FieldLabel>
                <div className="relative">
                  <MdDescription
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />
                  <textarea
                    name="billing_address"
                    value={formValues.billing_address}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all resize-y ${
                      errors.billing_address
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="Enter billing address..."
                  />
                </div>
                {errors.billing_address && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.billing_address}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "amounts":
        return (
          <div className="space-y-6">
            {/* Amount Breakdown */}
            <div>
              <FieldLabel>Amount Breakdown</FieldLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
                <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Base Price
                  </p>
                  <p className="font-semibold text-slate-700">
                    {formatINR(formValues.transaction_base_price || 0)}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Discount
                  </p>
                  <p className="font-semibold text-red-500">
                    -{formatINR(formValues.transaction_discount_price || 0)}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Subtotal
                  </p>
                  <p className="font-semibold text-blue-600">
                    {formatINR(formValues.subtotal || 0)}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    = Base − Discount
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    GST
                  </p>
                  <p className="font-semibold text-slate-700">
                    {formatINR(formValues.gst || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-slate-100">
              <FieldLabel>Grand Total</FieldLabel>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <MdAttachMoney className="text-blue-600" size={22} />
                <span className="text-2xl font-bold text-blue-700">
                  {formatINR(formValues.grand_total || 0)}
                </span>
                <span className="text-xs text-slate-500 ml-auto">
                  = Subtotal + GST
                </span>
              </div>
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-2xl">
            {/* Invoice Status */}
            <div>
              <FieldLabel required>Invoice Status</FieldLabel>
              <div className="relative">
                <MdReceipt
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <select
                  name="invoice_status"
                  value={formValues.invoice_status}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                    errors.invoice_status
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                >
                  <option value="">Select status</option>
                  {invoiceStatusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.invoice_status && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.invoice_status}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <FieldLabel required>Due Date</FieldLabel>
              <div className="relative">
                <MdEventNote
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="date"
                  name="due_date"
                  value={formValues.due_date}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.due_date
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                />
              </div>
              {errors.due_date ? (
                <p className="text-xs text-red-500 mt-1">{errors.due_date}</p>
              ) : isOverdue ? (
                <p className="text-xs text-red-500 mt-1.5 font-medium">
                  This invoice is overdue
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5">
                  Payment due date.
                </p>
              )}
            </div>

            {/* PDF */}
            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>PDF Document</FieldLabel>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-full sm:w-40 h-24 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden flex-shrink-0">
                  {pdfFile || existingPdfUrl ? (
                    <>
                      <MdPictureAsPdf size={28} className="text-red-500" />
                      <p className="text-xs text-slate-600 mt-1 truncate max-w-full px-2">
                        {pdfFile?.name || "Invoice PDF"}
                      </p>
                    </>
                  ) : (
                    <MdPictureAsPdf size={28} className="text-slate-300" />
                  )}
                </div>
                {!isViewMode && (
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                      <MdCloudUpload size={16} />
                      {pdfFile || existingPdfUrl ? "Change PDF" : "Upload PDF"}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfFileChange}
                        className="hidden"
                      />
                    </label>
                    {(pdfFile || existingPdfUrl) && (
                      <button
                        type="button"
                        onClick={handlePdfRemove}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                      >
                        <MdClose size={14} />
                        Remove PDF
                      </button>
                    )}
                    <p className="text-xs text-slate-500">Max 10MB, PDF only</p>
                  </div>
                )}
                {isViewMode && existingPdfUrl && (
                  <a
                    href={existingPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <MdPictureAsPdf size={16} />
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        );

      case "metadata":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Created By</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={getUserNameCached(formValues.created_by)}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated By</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={getUserNameCached(formValues.updated_by)}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Created At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      formValues.created_at
                        ? formatDate(formValues.created_at)
                        : "—"
                    }
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      formValues.updated_at
                        ? formatDate(formValues.updated_at)
                        : "—"
                    }
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/invoices")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Invoices ·{" "}
                {mode === "view"
                  ? "View"
                  : mode === "edit"
                  ? "Edit"
                  : "New"}
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroInvoiceNo}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/invoices")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdCancel size={16} />
              {mode === "view" ? "Back" : "Cancel"}
            </button>

            {mode === "view" ? (
              <button
                type="button"
                onClick={() =>
                  navigate(`/invoices/edit/${id}`, { state: { item: data } })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
              >
                <MdEdit size={16} />
                Edit Invoice
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdSave size={16} />
                )}
                {loading
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update Invoice"
                  : "Create Invoice"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroInvoiceNo}
                  </h1>
                  <StatusPill status={formValues.status} />
                  {formValues.invoice_status && (
                    <InvoiceStatusPill status={formValues.invoice_status} />
                  )}
                  {formValues.is_trending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdTrendingUp size={12} />
                      Trending
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {heroCompany && (
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MdBusiness size={11} />
                      {heroCompany}
                    </span>
                  )}
                  {formValues.transaction_no && (
                    <span className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded-full font-mono">
                      {formValues.transaction_no}
                    </span>
                  )}
                  {mode !== "add" && (
                    <span className="text-xs text-white/70">ID: #{id}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdReceipt size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Invoice Status
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.invoice_status || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Grand Total
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formatINR(formValues.grand_total || 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdEventNote size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Due Date
              </p>
              <p
                className={`text-sm font-semibold truncate ${
                  isOverdue ? "text-red-600" : "text-slate-700"
                }`}
              >
                {formValues.due_date ? formatDate(formValues.due_date) : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPictureAsPdf size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">PDF</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {pdfFile || existingPdfUrl ? "Available" : "None"}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ───────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-200 px-2">
            {TABS.filter(
              (tab) => mode === "view" || tab.id !== "metadata"
            ).map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="invoice-form-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Actions ────────────────────────────────────────────── */}
        {mode !== "add" && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdDelete size={16} />
                  Delete Invoice
                </button>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={() => navigate("/invoices")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdCancel size={16} />
                  {mode === "view" ? "Back" : "Cancel"}
                </button>

                {mode === "view" ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/invoices/edit/${id}`, { state: { item: data } })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors w-full sm:w-auto"
                  >
                    <MdEdit size={16} />
                    Edit Invoice
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
                  >
                    {loading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdSave size={16} />
                    )}
                    {loading ? "Saving..." : "Update Invoice"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          {mode === "view" ? "Back" : "Cancel"}
        </button>
      </div>

      {/* ─── Delete Confirmation Dialog ─────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Invoice"
        message="Delete this invoice? This action cannot be undone."
      />
    </div>
  );
};

export default InvoicesForm;