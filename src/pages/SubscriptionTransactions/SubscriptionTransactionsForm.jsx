// pages/subscriptions/SubscriptionTransactionsForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { ViewBadge } from '../../components/common/FormPageUtils';
import { subscriptionTransactionService } from '../../services/subscriptionTransaction.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

const API_BASE_URL = "https://apidata.hiremejobs.in";

const SubscriptionTransactionsForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [mode, setMode] = useState('view'); // Only 'view' mode
    const [data, setData] = useState(null);
    const [userNameCache, setUserNameCache] = useState({});
    const [pageLoading, setPageLoading] = useState(false);

    // Determine mode from URL (always view)
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/view/')) {
            setMode('view');
        } else {
            setMode('view');
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

    // Fetch data for view mode
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setPageLoading(true);
                try {
                    let item = location.state?.item;

                    if (!item) {
                        const response = await subscriptionTransactionService.getById(id);
                        item = response.data;
                    }

                    // Normalize the data with proper number parsing
                    const normalizedData = {
                        // Keep EVERY field returned by API
                        ...item,

                        // Basic
                        id: item.id || item._id,

                        // Amounts
                        base_price: Number(item.base_price || 0),

                        discount_price: Number(item.discount_price || 0),
                        discount: Number(
                            item.discount_price ?? item.discount ?? 0
                        ),

                        gst_amount: Number(item.gst_amount || 0),
                        gst: Number(
                            item.gst_amount ?? item.gst ?? 0
                        ),

                        final_amount: Number(item.final_amount || 0),

                        // Payment
                        payment_gateway: item.payment_gateway || "",
                        payment_status: item.payment_status || "",
                        invoice_no: item.invoice_no || "",
                        transaction_no: item.transaction_no || "",
                        payment_response: item.payment_response || "",
                        payment_reference: item.payment_reference || "",
                        gateway_order_id: item.gateway_order_id || "",

                        // Status
                        is_status:
                            item.is_status !== undefined
                                ? item.is_status
                                : true,

                        status:
                            item.is_status !== undefined
                                ? item.is_status
                                : true,

                        // Users
                        created_by: item.created_by || "",
                        updated_by: item.updated_by || "",

                        // Dates
                        created_at:
                            item.created_at ||
                            item.createdAt ||
                            null,

                        updated_at:
                            item.updated_at ||
                            item.updatedAt ||
                            null,

                        // Keep complete nested API objects
                        Company: item.Company || null,

                        SubscriptionPlan:
                            item.SubscriptionPlan || null,

                        CompanySubscription:
                            item.CompanySubscription || null,

                        SubscriptionPlanOffer:
                            item.SubscriptionPlanOffer || null,

                        SubscriptionCoupon:
                            item.SubscriptionCoupon || null,

                        // Convenient display fields
                        company_name:
                            item.Company?.company_name || "",

                        company_id:
                            item.Company?.company_id || "",

                        plan_name:
                            item.SubscriptionPlan?.plan_name || "",

                        plan_id:
                            item.SubscriptionPlan?.subscriptionplan_id ||
                            item.SubscriptionPlan?.id ||
                            "",

                        subscription_type:
                            item.CompanySubscription?.subscription_type || "",

                        subscription_id:
                            item.CompanySubscription?.company_subscription_id ||
                            item.CompanySubscription?.id ||
                            "",

                        offer_name:
                            item.SubscriptionPlanOffer?.offer_name || "",

                        offer_id:
                            item.SubscriptionPlanOffer?.offer_id ||
                            item.SubscriptionPlanOffer?.id ||
                            "",

                        coupon_code:
                            item.SubscriptionCoupon?.coupon_code || "",

                        coupon_id:
                            item.SubscriptionCoupon?.coupon_id ||
                            item.SubscriptionCoupon?.id ||
                            "",

                        // Original complete API response
                        raw: item,
                    };

                    setData(normalizedData);
                } catch (error) {
                    console.error('Fetch error:', error);
                    showError("Failed to load subscription transaction data");
                    navigate('/subscription-transactions');
                } finally {
                    setPageLoading(false);
                }
            }
        };
        fetchData();
    }, [id, location.state, navigate]);

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

    // Get payment status badge color
    const getPaymentStatusColor = (status) => {
        const statusMap = {
            'Success': 'green',
            'success': 'green',
            'Pending': 'yellow',
            'pending': 'yellow',
            'Failed': 'red',
            'failed': 'red',
            'Refunded': 'orange',
            'refunded': 'orange',
        };
        return statusMap[status] || 'gray';
    };

    // Get created by name
    const getCreatedByName = (row) => {
        if (!row) return "-";
        if (row.created_by) {
            if (typeof row.created_by === 'object') {
                return row.created_by.name || row.created_by.username || row.created_by.email || "User";
            }
            return getUserNameCached(row.created_by);
        }
        return "System";
    };

    // Get updated by name
    const getUpdatedByName = (row) => {
        if (!row) return "-";
        if (row.updated_by) {
            return getUserNameCached(row.updated_by);
        }
        return "-";
    };

    // Helper function to safely format currency
    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    // Define fields for the form (view only)
    const getFields = () => {
        return [
            {
                name: "transaction_no",
                label: "Transaction Number",
                type: "text",
                viewRender: (value) => (
                    <span className="font-mono text-lg font-semibold text-[#2c0eee]">{value || '-'}</span>
                )
            },
            // {
            //     name: "invoice_no",
            //     label: "Invoice Number",
            //     type: "text",
            //     viewRender: (value) => (
            //         <span className="font-medium">{value || '-'}</span>
            //     )
            // },
            {
                name: "company_name",
                label: "Company",
                type: "text",
                viewRender: (value, row) => (
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{row?.Company?.company_name || '-'}</span>
                        {row?.Company?.company_id && (
                            <span className="text-xs text-gray-400">(ID: {row.Company.company_id})</span>
                        )}
                    </div>
                )
            },
            {
                name: "plan_name",
                label: "Subscription Plan",
                type: "text",
                viewRender: (value, row) => (
                    <div className="flex items-center gap-2">
                        <span>{row?.SubscriptionPlan?.plan_name || '-'}</span>
                        {row?.SubscriptionPlan?.subscriptionplan_id && (
                            <span className="text-xs text-gray-400">(ID: {row.SubscriptionPlan.subscriptionplan_id})</span>
                        )}
                    </div>
                )
            },
            {
                name: "subscription_type",
                label: "Subscription Type",
                type: "text",
                viewRender: (value, row) => (
                    <div className="flex items-center gap-2">
                        <span>{row?.CompanySubscription?.subscription_type || '-'}</span>
                        {row?.CompanySubscription?.company_subscription_id && (
                            <span className="text-xs text-gray-400">(ID: {row.CompanySubscription.company_subscription_id})</span>
                        )}
                    </div>
                )
            },
            {
                name: "base_price",
                label: "Base Price",
                type: "text",
                viewRender: (value) => (
                    <span className="font-medium">₹{formatCurrency(value)}</span>
                )
            },
            {
                name: "discount",
                label: "Discount",
                type: "text",
                viewRender: (value) => {
                    const num = parseFloat(value);
                    const formatted = isNaN(num) ? '0.00' : num.toFixed(2);
                    return (
                        <span className="font-medium text-red-500">-₹{formatted}</span>
                    );
                }
            },
            {
                name: "gst",
                label: "GST Amount",
                type: "text",
                viewRender: (value) => (
                    <span className="font-medium">₹{formatCurrency(value)}</span>
                )
            },
            {
                name: "final_amount",
                label: "Final Amount",
                type: "text",
                viewRender: (value) => (
                    <span className="font-bold text-2xl text-[#2c0eee]">₹{formatCurrency(value)}</span>
                )
            },
            {
                name: "offer_name",
                label: "Offer Applied",
                type: "text",
                viewRender: (value, row) => row?.SubscriptionPlanOffer?.offer_name || '—'
            },
            {
                name: "coupon_code",
                label: "Coupon Applied",
                type: "text",
                viewRender: (value, row) => row?.SubscriptionCoupon?.coupon_code || '—'
            },
            {
                name: "payment_gateway",
                label: "Payment Gateway",
                type: "text",
                viewRender: (value) => value || '—'
            },
            {
                name: "payment_status",
                label: "Payment Status",
                type: "text",
                viewRender: (value) => {
                    const color = getPaymentStatusColor(value);
                    return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
                            {value || "Unknown"}
                        </span>
                    );
                }
            },
            {
                name: "payment_reference",
                label: "Payment Reference",
                type: "text",
                viewRender: (value) => value || '—'
            },
            {
                name: "gateway_order_id",
                label: "Gateway Order ID",
                type: "text",
                viewRender: (value) => value || '—'
            },
            {
                name: "payment_response",
                label: "Payment Response",
                type: "textarea",
                viewRender: (value) => {
                    if (!value) return '—';
                    return (
                        <pre className="text-xs bg-gray-50 p-2 rounded border border-gray-200 max-h-24 overflow-auto">
                            {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                        </pre>
                    );
                }
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
            {
                name: "created_by",
                label: "Created By",
                type: "text",
                viewRender: (value, row) => getCreatedByName(row)
            },
            {
                name: "updated_by",
                label: "Updated By",
                type: "text",
                viewRender: (value, row) => getUpdatedByName(row)
            },
            {
                name: "created_at",
                label: "Created At",
                type: "text",
                viewRender: (value) => formatDate(value)
            },
            {
                name: "updated_at",
                label: "Updated At",
                type: "text",
                viewRender: (value) => value ? formatDate(value) : '—'
            }
        ];
    };

    // Get title
    const getTitle = () => {
        return 'Subscription Transaction Details';
    };

    // Handle loading state
    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-gray-500">Loading transaction details...</p>
                </div>
            </div>
        );
    }

    // If view mode and data not loaded, show error
    if (!data && !pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Subscription transaction not found</p>
                    <button
                        onClick={() => navigate('/subscription-transactions')}
                        className="mt-3 text-[#2c0eee] hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    // Prepare initial data
    const getInitialData = () => {
        if (data) {
            return {
                ...data,
                status: data.is_status ? "active" : "inactive",
            };
        }
        return {};
    };

    return (
        <FormPage
            title={getTitle()}
            mode="view"
            fields={getFields()}
            initialData={getInitialData()}
            navigateTo="/subscription-transactions"
            showDelete={false}
            showEdit={false}
            enableEditMode={false}
            breadcrumb="Viewing transaction details"
        />
    );
};

export default SubscriptionTransactionsForm;