    // import api from './axiosInstance';
    // import { storage } from '../utils/storage';

    // const BASE_URL = '/invoices';

    // // Helper function to get current user ID
    // const getCurrentUserId = () => {
    //     try {
    //         const userStr = localStorage.getItem('user');
    //         if (userStr) {
    //             const user = JSON.parse(userStr);
    //             return user?.id || null;
    //         }
    //         const user = storage.getUser();
    //         return user?.id || user?.userId || user?._id || null;
    //     } catch (error) {
    //         console.error('Error getting user ID:', error);
    //         return null;
    //     }
    // };

    // export const invoiceService = {
    //     // Get all invoices with pagination and search
    //     getAll: async (params = {}) => {
    //         try {
    //             const response = await api.get(BASE_URL, { params });
    //             return response.data;
    //         } catch (error) {
    //             throw error.response?.data || error.message;
    //         }
    //     },

    //     // Get single invoice by ID
    //     getById: async (id) => {
    //         try {
    //             const response = await api.get(`${BASE_URL}/${id}`);
    //             return response.data;
    //         } catch (error) {
    //             if (error.response?.status === 404) {
    //                 return null;
    //             }
    //             throw error.response?.data || error.message;
    //         }
    //     },

    //     // Create new invoice
    //     create: async (data) => {
    //         try {
    //             const userId = getCurrentUserId();

    //             // Convert status to integer (0 or 1)
    //             let statusValue = 1;
    //             if (data.is_status === 'inactive' || data.is_status === false || data.is_status === 0) {
    //                 statusValue = 0;
    //             } else if (data.is_status === 'active' || data.is_status === true || data.is_status === 1) {
    //                 statusValue = 1;
    //             }

    //             // Convert is_trending to integer (0 or 1)
    //             let trendingValue = 0;
    //             if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
    //                 trendingValue = 1;
    //             }

    //             // FIX: Ensure invoice_status is a valid string value
    //             const validInvoiceStatuses = ['Paid', 'Pending', 'Overdue', 'Cancelled'];
    //             let invoiceStatus = data.invoice_status || 'Pending';
    //             invoiceStatus = invoiceStatus.trim();
    //             invoiceStatus = invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1).toLowerCase();

    //             if (!validInvoiceStatuses.includes(invoiceStatus)) {
    //                 console.warn(`Invalid invoice_status "${invoiceStatus}", defaulting to "Pending"`);
    //                 invoiceStatus = 'Pending';
    //             }

    //             const submitData = {
    //                 company_id: parseInt(data.company_id) || 0,
    //                 transaction_id: data.transaction_id ? parseInt(data.transaction_id) : null,
    //                 invoice_no: data.invoice_no ? data.invoice_no.trim() : '',
    //                 gst_number: data.gst_number ? data.gst_number.trim() : '',
    //                 billing_address: data.billing_address ? data.billing_address.trim() : '',
    //                 subtotal: parseFloat(data.subtotal) || 0,
    //                 gst: parseFloat(data.gst) || 0,
    //                 grand_total: parseFloat(data.grand_total) || 0,
    //                 invoice_status: invoiceStatus,
    //                 due_date: data.due_date || '',
    //                 is_trending: trendingValue,
    //                 is_status: statusValue,
    //                 created_by: userId || 1,
    //                 updated_by: userId || 1
    //             };

    //             // Handle PDF file upload
    //             if (data.pdf_url instanceof File) {
    //                 console.log('Uploading PDF file...');
    //                 const formData = new FormData();
    //                 Object.keys(submitData).forEach(key => {
    //                     if (submitData[key] !== null && submitData[key] !== undefined) {
    //                         formData.append(key, submitData[key]);
    //                     }
    //                 });
    //                 formData.append('pdf', data.pdf_url);

    //                 const response = await api.post(BASE_URL, formData, {
    //                     headers: { 'Content-Type': 'multipart/form-data' }
    //                 });
    //                 return response.data;
    //             }

    //             console.log('Creating invoice with data:', submitData);
    //             const response = await api.post(BASE_URL, submitData);
    //             return response.data;
    //         } catch (error) {
    //             console.error('Create error:', error.response?.data);
    //             throw error.response?.data || error.message;
    //         }
    //     },

    //     // FIXED: Update invoice - Only send fields that are provided
    //     update: async (id, data) => {
    //         try {
    //             const userId = getCurrentUserId();

    //             // Build submitData with only the fields that are provided
    //             const submitData = {};

    //             // Only add fields if they exist in the data object
    //             if (data.company_id !== undefined) {
    //                 submitData.company_id = parseInt(data.company_id);
    //             }

    //             // FIX: Handle transaction_id - only send if explicitly provided, not null
    //             if (data.transaction_id !== undefined) {
    //                 submitData.transaction_id = data.transaction_id ? parseInt(data.transaction_id) : null;
    //             }

    //             if (data.invoice_no !== undefined) {
    //                 submitData.invoice_no = data.invoice_no ? data.invoice_no.trim() : '';
    //             }

    //             if (data.gst_number !== undefined) {
    //                 submitData.gst_number = data.gst_number ? data.gst_number.trim() : '';
    //             }

    //             if (data.billing_address !== undefined) {
    //                 submitData.billing_address = data.billing_address ? data.billing_address.trim() : '';
    //             }

    //             if (data.subtotal !== undefined) {
    //                 submitData.subtotal = parseFloat(data.subtotal) || 0;
    //             }

    //             if (data.gst !== undefined) {
    //                 submitData.gst = parseFloat(data.gst) || 0;
    //             }

    //             if (data.grand_total !== undefined) {
    //                 submitData.grand_total = parseFloat(data.grand_total) || 0;
    //             }

    //             if (data.invoice_status !== undefined) {
    //                 const validInvoiceStatuses = ['Paid', 'Pending', 'Overdue', 'Cancelled'];
    //                 let invoiceStatus = data.invoice_status || 'Pending';
    //                 invoiceStatus = invoiceStatus.trim();
    //                 invoiceStatus = invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1).toLowerCase();

    //                 if (!validInvoiceStatuses.includes(invoiceStatus)) {
    //                     invoiceStatus = 'Pending';
    //                 }
    //                 submitData.invoice_status = invoiceStatus;
    //             }

    //             if (data.due_date !== undefined) {
    //                 submitData.due_date = data.due_date || '';
    //             }

    //             // FIX: Handle is_trending - convert to integer
    //             if (data.is_trending !== undefined) {
    //                 submitData.is_trending = data.is_trending ? 1 : 0;
    //             }

    //             // FIX: Handle is_status - convert to integer
    //             if (data.is_status !== undefined) {
    //                 let statusValue = 1;
    //                 if (data.is_status === 'inactive' || data.is_status === false || data.is_status === 0) {
    //                     statusValue = 0;
    //                 } else if (data.is_status === 'active' || data.is_status === true || data.is_status === 1) {
    //                     statusValue = 1;
    //                 }
    //                 submitData.is_status = statusValue;
    //             }

    //             // Always update updated_by
    //             submitData.updated_by = userId || 1;

    //             // Handle PDF file upload
    //             if (data.pdf_url instanceof File) {
    //                 console.log('Uploading PDF file...');
    //                 const formData = new FormData();
    //                 Object.keys(submitData).forEach(key => {
    //                     if (submitData[key] !== null && submitData[key] !== undefined) {
    //                         formData.append(key, submitData[key]);
    //                     }
    //                 });
    //                 formData.append('pdf', data.pdf_url);

    //                 try {
    //                     const response = await api.put(`${BASE_URL}/${id}`, formData, {
    //                         headers: { 'Content-Type': 'multipart/form-data' }
    //                     });
    //                     return response.data;
    //                 } catch (putError) {
    //                     if (putError.response?.status === 404 || putError.response?.status === 405) {
    //                         const response = await api.patch(`${BASE_URL}/${id}`, formData, {
    //                             headers: { 'Content-Type': 'multipart/form-data' }
    //                         });
    //                         return response.data;
    //                     }
    //                     throw putError;
    //                 }
    //             }

    //             console.log('Updating invoice with data:', submitData);

    //             try {
    //                 const response = await api.put(`${BASE_URL}/${id}`, submitData);
    //                 return response.data;
    //             } catch (putError) {
    //                 console.log('PUT failed, trying PATCH...');
    //                 if (putError.response?.status === 404 || putError.response?.status === 405) {
    //                     const response = await api.patch(`${BASE_URL}/${id}`, submitData);
    //                     return response.data;
    //                 }
    //                 throw putError;
    //             }
    //         } catch (error) {
    //             console.error('Update error:', error);
    //             throw error.response?.data || error.message;
    //         }
    //     },

    //     // Delete invoice
    //     delete: async (id) => {
    //         try {
    //             const response = await api.delete(`${BASE_URL}/${id}`);
    //             return response.data;
    //         } catch (error) {
    //             if (error.response?.status === 404) {
    //                 return { success: true, message: 'Item already deleted' };
    //             }
    //             throw error.response?.data || error.message;
    //         }
    //     },

    //     // Bulk delete invoices
    //     deleteMany: async (ids) => {
    //         try {
    //             const response = await api.delete(BASE_URL, { data: { ids } });
    //             return response.data;
    //         } catch (error) {
    //             throw error.response?.data || error.message;
    //         }
    //     },

    //     // Search invoices
    //     search: async (query) => {
    //         try {
    //             const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
    //             return response.data;
    //         } catch (error) {
    //             throw error.response?.data || error.message;
    //         }
    //     },

    //     // Get PDF download URL
    //     getPdfUrl: (pdfPath) => {
    //         if (!pdfPath) return null;
    //         const API_BASE_URL = 'https://apidata.hiremejobs.in';
    //         if (pdfPath.startsWith('http')) {
    //             return pdfPath;
    //         }
    //         if (pdfPath.startsWith('/uploads/')) {
    //             return `${API_BASE_URL}${pdfPath}`;
    //         }
    //         return pdfPath;
    //     }
    // };

    // export default invoiceService;



    import api from './axiosInstance';
    import { storage } from '../utils/storage';

    const BASE_URL = '/invoices';

    // Helper function to get current user ID
    const getCurrentUserId = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return user?.id || null;
            }
            const user = storage.getUser();
            return user?.id || user?.userId || user?._id || null;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    };

    export const invoiceService = {
        // Get all invoices with pagination and search
        getAll: async (params = {}) => {
            try {
                const response = await api.get(BASE_URL, { params });
                return response.data;
            } catch (error) {
                throw error.response?.data || error.message;
            }
        },

        // Get single invoice by ID
        getById: async (id) => {
            try {
                const response = await api.get(`${BASE_URL}/${id}`);
                return response.data;
            } catch (error) {
                if (error.response?.status === 404) {
                    return null;
                }
                throw error.response?.data || error.message;
            }
        },

        // Create new invoice
        create: async (data) => {
            try {
                const userId = getCurrentUserId();

                let statusValue = 1;
                if (data.is_status === 'inactive' || data.is_status === false || data.is_status === 0) {
                    statusValue = 0;
                } else if (data.is_status === 'active' || data.is_status === true || data.is_status === 1) {
                    statusValue = 1;
                }

                let trendingValue = 0;
                if (data.is_trending === true || data.is_trending === 1 || data.is_trending === 'true') {
                    trendingValue = 1;
                }

                const validInvoiceStatuses = ['Paid', 'Pending', 'Overdue', 'Cancelled'];
                let invoiceStatus = data.invoice_status || 'Pending';
                invoiceStatus = invoiceStatus.trim();
                invoiceStatus = invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1).toLowerCase();

                if (!validInvoiceStatuses.includes(invoiceStatus)) {
                    invoiceStatus = 'Pending';
                }

                // Check if we have a PDF file
                const haspdf_url = data.pdf_url instanceof File;

                if (haspdf_url) {
                    console.log('Creating invoice with PDF file:', data.pdf_url.name);
                    const formData = new FormData();

                    // Append all fields
                    formData.append('company_id', parseInt(data.company_id) || 0);
                    formData.append('transaction_id', data.transaction_id ? parseInt(data.transaction_id) : '');
                    formData.append('invoice_no', data.invoice_no ? data.invoice_no.trim() : '');
                    formData.append('gst_number', data.gst_number ? data.gst_number.trim() : '');
                    formData.append('billing_address', data.billing_address ? data.billing_address.trim() : '');
                    formData.append('subtotal', parseFloat(data.subtotal) || 0);
                    formData.append('gst', parseFloat(data.gst) || 0);
                    formData.append('grand_total', parseFloat(data.grand_total) || 0);
                    formData.append('invoice_status', invoiceStatus);
                    formData.append('due_date', data.due_date || '');
                    formData.append('is_trending', trendingValue);
                    formData.append('is_status', statusValue);
                    formData.append('created_by', userId || 1);
                    formData.append('updated_by', userId || 1);
                    // FIX: Use 'pdf_url' as the field name for file upload
                    formData.append('pdf_url', data.pdf_url);

                    const response = await api.post(BASE_URL, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    return response.data;
                }

                // No PDF file
                const submitData = {
                    company_id: parseInt(data.company_id) || 0,
                    transaction_id: data.transaction_id ? parseInt(data.transaction_id) : null,
                    invoice_no: data.invoice_no ? data.invoice_no.trim() : '',
                    gst_number: data.gst_number ? data.gst_number.trim() : '',
                    billing_address: data.billing_address ? data.billing_address.trim() : '',
                    subtotal: parseFloat(data.subtotal) || 0,
                    gst: parseFloat(data.gst) || 0,
                    grand_total: parseFloat(data.grand_total) || 0,
                    invoice_status: invoiceStatus,
                    due_date: data.due_date || '',
                    is_trending: trendingValue,
                    is_status: statusValue,
                    created_by: userId || 1,
                };

                console.log('Creating invoice without PDF:', submitData);
                const response = await api.post(BASE_URL, submitData);
                return response.data;
            } catch (error) {
                console.error('Create error:', error.response?.data);
                throw error.response?.data || error.message;
            }
        },

        // Update invoice with proper PDF support
        update: async (id, data) => {
            try {
                const userId = getCurrentUserId();

                // Check if this is a status or trending toggle
                const isStatusOnly = Object.keys(data).length <= 2 && data.is_status !== undefined;
                const isTrendingOnly = Object.keys(data).length <= 2 && data.is_trending !== undefined;
                const haspdf_url = data.pdf_url instanceof File;

                // For status/trending toggles without PDF - use PATCH
                if ((isStatusOnly || isTrendingOnly) && !haspdf_url) {
                    const submitData = {};
                    if (data.is_status !== undefined) {
                        submitData.is_status = data.is_status ? 1 : 0;
                    }
                    if (data.is_trending !== undefined) {
                        submitData.is_trending = data.is_trending ? 1 : 0;
                    }
                    submitData.updated_by = userId || 1;

                    console.log('Toggle update data:', submitData);

                    try {
                        const response = await api.patch(`${BASE_URL}/${id}`, submitData);
                        return response.data;
                    } catch (patchError) {
                        console.log('PATCH failed, trying PUT...');
                        const response = await api.put(`${BASE_URL}/${id}`, submitData);
                        return response.data;
                    }
                }

                // For updates with PDF file
                if (haspdf_url) {
                    console.log('Updating invoice with PDF file:', data.pdf_url.name);
                    const formData = new FormData();

                    // Add all fields that are provided
                    if (data.company_id !== undefined) {
                        formData.append('company_id', parseInt(data.company_id));
                    }
                    if (data.transaction_id !== undefined) {
                        formData.append('transaction_id', data.transaction_id ? parseInt(data.transaction_id) : '');
                    }
                    if (data.invoice_no !== undefined) {
                        formData.append('invoice_no', data.invoice_no.trim());
                    }
                    if (data.gst_number !== undefined) {
                        formData.append('gst_number', data.gst_number.trim());
                    }
                    if (data.billing_address !== undefined) {
                        formData.append('billing_address', data.billing_address.trim());
                    }
                    if (data.subtotal !== undefined) {
                        formData.append('subtotal', parseFloat(data.subtotal) || 0);
                    }
                    if (data.gst !== undefined) {
                        formData.append('gst', parseFloat(data.gst) || 0);
                    }
                    if (data.grand_total !== undefined) {
                        formData.append('grand_total', parseFloat(data.grand_total) || 0);
                    }
                    if (data.invoice_status !== undefined) {
                        const validInvoiceStatuses = ['Paid', 'Pending', 'Overdue', 'Cancelled'];
                        let invoiceStatus = data.invoice_status || 'Pending';
                        invoiceStatus = invoiceStatus.trim();
                        invoiceStatus = invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1).toLowerCase();
                        if (!validInvoiceStatuses.includes(invoiceStatus)) {
                            invoiceStatus = 'Pending';
                        }
                        formData.append('invoice_status', invoiceStatus);
                    }
                    if (data.due_date !== undefined) {
                        formData.append('due_date', data.due_date || '');
                    }
                    if (data.is_trending !== undefined) {
                        formData.append('is_trending', data.is_trending ? 1 : 0);
                    }
                    if (data.is_status !== undefined) {
                        let statusValue = 1;
                        if (data.is_status === 'inactive' || data.is_status === false || data.is_status === 0) {
                            statusValue = 0;
                        } else if (data.is_status === 'active' || data.is_status === true || data.is_status === 1) {
                            statusValue = 1;
                        }
                        formData.append('is_status', statusValue);
                    }
                    formData.append('updated_by', userId || 1);
                    // FIX: Use 'pdf_url' as the field name for file upload
                    formData.append('pdf_url', data.pdf_url);

                    // If we have an existing PDF URL to keep (when updating other fields)
                    if (data.existing_pdf_url && typeof data.existing_pdf_url === 'string') {
                        formData.append('existing_pdf_url', data.existing_pdf_url);
                    }

                    try {
                        const response = await api.put(`${BASE_URL}/${id}`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        return response.data;
                    } catch (putError) {
                        console.log('PUT with FormData failed, trying PATCH...');
                        const response = await api.patch(`${BASE_URL}/${id}`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        return response.data;
                    }
                }

                // For updates without PDF file - use regular JSON
                const submitData = {};
                if (data.company_id !== undefined) {
                    submitData.company_id = parseInt(data.company_id);
                }
                if (data.transaction_id !== undefined) {
                    submitData.transaction_id = data.transaction_id ? parseInt(data.transaction_id) : null;
                }
                if (data.invoice_no !== undefined) {
                    submitData.invoice_no = data.invoice_no.trim();
                }
                if (data.gst_number !== undefined) {
                    submitData.gst_number = data.gst_number.trim();
                }
                if (data.billing_address !== undefined) {
                    submitData.billing_address = data.billing_address.trim();
                }
                if (data.subtotal !== undefined) {
                    submitData.subtotal = parseFloat(data.subtotal) || 0;
                }
                if (data.gst !== undefined) {
                    submitData.gst = parseFloat(data.gst) || 0;
                }
                if (data.grand_total !== undefined) {
                    submitData.grand_total = parseFloat(data.grand_total) || 0;
                }
                if (data.invoice_status !== undefined) {
                    const validInvoiceStatuses = ['Paid', 'Pending', 'Overdue', 'Cancelled'];
                    let invoiceStatus = data.invoice_status || 'Pending';
                    invoiceStatus = invoiceStatus.trim();
                    invoiceStatus = invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1).toLowerCase();
                    if (!validInvoiceStatuses.includes(invoiceStatus)) {
                        invoiceStatus = 'Pending';
                    }
                    submitData.invoice_status = invoiceStatus;
                }
                if (data.due_date !== undefined) {
                    submitData.due_date = data.due_date || '';
                }
                if (data.is_trending !== undefined) {
                    submitData.is_trending = data.is_trending ? 1 : 0;
                }
                if (data.is_status !== undefined) {
                    let statusValue = 1;
                    if (data.is_status === 'inactive' || data.is_status === false || data.is_status === 0) {
                        statusValue = 0;
                    } else if (data.is_status === 'active' || data.is_status === true || data.is_status === 1) {
                        statusValue = 1;
                    }
                    submitData.is_status = statusValue;
                }
                submitData.updated_by = userId || 1;

                // If we have an existing PDF URL to keep
                if (data.pdf_url && typeof data.pdf_url === 'string') {
                    submitData.pdf_url = data.pdf_url;
                }

                console.log('Updating invoice without PDF:', submitData);

                try {
                    const response = await api.put(`${BASE_URL}/${id}`, submitData);
                    return response.data;
                } catch (putError) {
                    console.log('PUT failed, trying PATCH...');
                    const response = await api.patch(`${BASE_URL}/${id}`, submitData);
                    return response.data;
                }
            } catch (error) {
                console.error('Update error:', error);
                throw error.response?.data || error.message;
            }
        },

        // Delete invoice
        delete: async (id) => {
            try {
                const response = await api.delete(`${BASE_URL}/${id}`);
                return response.data;
            } catch (error) {
                if (error.response?.status === 404) {
                    return { success: true, message: 'Item already deleted' };
                }
                throw error.response?.data || error.message;
            }
        },

        // Bulk delete invoices
        deleteMany: async (ids) => {
            try {
                const response = await api.delete(BASE_URL, { data: { ids } });
                return response.data;
            } catch (error) {
                throw error.response?.data || error.message;
            }
        },

        // Search invoices
        search: async (query) => {
            try {
                const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
                return response.data;
            } catch (error) {
                throw error.response?.data || error.message;
            }
        },

        // Get PDF download URL
        getPdfUrl: (pdfPath) => {
            if (!pdfPath) return null;
            const API_BASE_URL = 'https://apidata.hiremejobs.in';
            if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) {
                return pdfPath;
            }
            if (pdfPath.startsWith('/uploads/')) {
                return `${API_BASE_URL}${pdfPath}`;
            }
            if (pdfPath.startsWith('uploads/')) {
                return `${API_BASE_URL}/${pdfPath}`;
            }
            return `${API_BASE_URL}/uploads/invoices/${pdfPath}`;
        }
    };

    export default invoiceService;