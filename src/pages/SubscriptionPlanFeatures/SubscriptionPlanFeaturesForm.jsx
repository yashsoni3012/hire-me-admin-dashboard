// // pages/subscriptions/SubscriptionPlanFeaturesForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { ViewBadge, ViewTrendingBadge } from '../../components/common/FormPageUtils';
// import { subscriptionPlanFeatureService } from '../../services/subscriptionPlanFeature.service';
// import { subscriptionPlanService } from '../../services/subscriptionPlan.service';
// import { subscriptionFeatureService } from '../../services/subscriptionFeature.service';
// import { showSuccess, showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';
// import { useAuth } from '../../context/AuthContext';

// const SubscriptionPlanFeaturesForm = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { id } = useParams();
//     const { user } = useAuth();
//     const userId = user?.id;

//     const [mode, setMode] = useState('add');
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState(null);
//     const [plans, setPlans] = useState([]);
//     const [features, setFeatures] = useState([]);
//     const [userNameCache, setUserNameCache] = useState({});
//     const [pageLoading, setPageLoading] = useState(false);

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

//     // Fetch dropdown data
//     useEffect(() => {
//         const fetchDropdownData = async () => {
//             try {
//                 const [plansRes, featuresRes] = await Promise.all([
//                     subscriptionPlanService.getAll({ limit: 1000 }),
//                     subscriptionFeatureService.getAll({ limit: 1000 })
//                 ]);

//                 const plansData = plansRes.data?.data || plansRes.data || [];
//                 const featuresData = featuresRes.data?.data || featuresRes.data || [];

//                 setPlans(Array.isArray(plansData) ? plansData : []);
//                 setFeatures(Array.isArray(featuresData) ? featuresData : []);
//             } catch (error) {
//                 console.error("Failed to fetch dropdown data:", error);
//             }
//         };
//         fetchDropdownData();
//     }, []);

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

//     // FIX: Helper function to normalize status properly
//     const normalizeStatus = (item) => {
//         if (!item) return true;

//         // Check various possible status fields
//         const statusValue = item.is_status !== undefined ? item.is_status : item.status;

//         if (statusValue === undefined || statusValue === null) return true;

//         // Handle string values
//         if (typeof statusValue === 'string') {
//             return statusValue.toLowerCase() === 'active' ||
//                 statusValue === '1' ||
//                 statusValue === 'true';
//         }

//         // Handle boolean/numbers
//         return statusValue === true || statusValue === 1;
//     };

//     // Fetch data for edit/view modes
//     useEffect(() => {
//         const fetchData = async () => {
//             if ((mode === 'edit' || mode === 'view') && id) {
//                 setPageLoading(true);
//                 try {
//                     let item = location.state?.item;

//                     if (!item) {
//                         const response = await subscriptionPlanFeatureService.getById(id);
//                         item = response.data;
//                     }

//                     console.log('Fetched item:', item);

//                     // Get plan name
//                     let planName = "-";
//                     if (item.SubscriptionPlan) {
//                         planName = item.SubscriptionPlan.plan_name || "-";
//                     } else if (item.plan_name) {
//                         planName = item.plan_name;
//                     } else if (item.subscription_plan_id) {
//                         const plan = plans.find(p => (p.id || p._id) === item.subscription_plan_id);
//                         planName = plan?.plan_name || "-";
//                     }

//                     // Get feature name
//                     let featureName = "-";
//                     if (item.SubscriptionFeature) {
//                         featureName = item.SubscriptionFeature.feature_name || "-";
//                     } else if (item.feature_name) {
//                         featureName = item.feature_name;
//                     } else if (item.subscription_features_id) {
//                         const feature = features.find(f => (f.id || f._id) === item.subscription_features_id);
//                         featureName = feature?.feature_name || "-";
//                     }

//                     // FIX: Normalize status properly
//                     const isActive = normalizeStatus(item);

//                     // Normalize the data
//                     const normalizedData = {
//                         id: item.id || item._id,
//                         subscription_plan_id: item.subscription_plan_id || "",
//                         subscription_features_id: item.subscription_features_id || "",
//                         value: item.value || "",
//                         display_value: item.display_value || "",
//                         value_type: item.value_type || "integer",
//                         unit: item.unit || "",
//                         is_unlimited: item.is_unlimited === 1 || item.is_unlimited === true,
//                         is_trending: item.is_trending === 1 || item.is_trending === true,
//                         // FIX: Use normalized status
//                         is_status: isActive,
//                         status: isActive,
//                         created_by: item.created_by || null,
//                         updated_by: item.updated_by || null,
//                         created_at: item.created_at || item.createdAt || null,
//                         updated_at: item.updated_at || item.updatedAt || null,
//                         plan_name: planName,
//                         feature_name: featureName,
//                         raw: item,
//                     };

//                     console.log('Normalized data:', normalizedData);
//                     setData(normalizedData);
//                 } catch (error) {
//                     console.error('Fetch error:', error);
//                     showError("Failed to load subscription plan feature data");
//                     navigate('/subscription-plan-features');
//                 } finally {
//                     setPageLoading(false);
//                 }
//             }
//         };
//         fetchData();
//     }, [id, mode, location.state, navigate, plans, features]);

//     // Get user name with caching
//     const getUserNameCached = (userId) => {
//         if (!userId) return "-";
//         return userNameCache[userId] || `User ${userId}`;
//     };

//     // FIX: Get status value
//     const getStatusValue = (row) => {
//         if (!row) return true;
//         // Use normalized status from data
//         if (row.is_status !== undefined) {
//             return row.is_status === true;
//         }
//         if (row.status !== undefined) {
//             return normalizeStatus(row);
//         }
//         return true;
//     };

//     // Define fields for the form
//     const getFields = () => {
//         const planOptions = plans.map(plan => ({
//             value: plan.id || plan._id,
//             label: plan.plan_name || "-"
//         }));

//         const featureOptions = features.map(feature => ({
//             value: feature.id || feature._id,
//             label: feature.feature_name || "-"
//         }));

//         // Base fields (common for all modes)
//         const baseFields = [
//             {
//                 name: "subscription_plan_id",
//                 label: "Subscription Plan",
//                 type: "select",
//                 required: true,
//                 options: planOptions,
//                 placeholder: "Select a plan",
//                 help: "Select the subscription plan",
//                 viewRender: (value, row) => row?.plan_name || value || '—'
//             },
//             {
//                 name: "subscription_features_id",
//                 label: "Feature",
//                 type: "select",
//                 required: true,
//                 options: featureOptions,
//                 placeholder: "Select a feature",
//                 help: "Select the feature to assign",
//                 viewRender: (value, row) => row?.feature_name || value || '—'
//             },
//             {
//                 name: "value",
//                 label: "Value",
//                 type: "text",
//                 required: false,
//                 placeholder: "e.g. 10, Unlimited, 5GB",
//                 help: "Enter the feature value",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "display_value",
//                 label: "Display Value",
//                 type: "text",
//                 required: false,
//                 placeholder: "e.g. 10 Users, 5GB Storage",
//                 help: "Enter the display value shown to users",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "is_unlimited",
//                 label: "Unlimited",
//                 type: "checkbox",
//                 color: "text-green-500 focus:ring-green-500",
//                 help: "Check if this feature is unlimited",
//                 viewRender: (value) => (
//                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-green-500" : "bg-gray-400"}`} />
//                         {value ? "Unlimited" : "Limited"}
//                     </span>
//                 )
//             },
//             {
//                 name: "is_trending",
//                 label: "Mark as Trending",
//                 type: "checkbox",
//                 color: "text-yellow-500 focus:ring-yellow-500",
//                 help: "Trending features will be highlighted",
//                 viewRender: (value) => <ViewTrendingBadge isTrending={value} />
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
//                 viewRender: (value, row) => {
//                     const isActive = getStatusValue(row);
//                     return <ViewBadge active={isActive} />;
//                 }
//             }
//         ];

//         if (mode === 'view') {
//             const auditFields = [
//                 {
//                     name: "created_by",
//                     label: "Created By",
//                     type: "text",
//                     disabled: true,
//                     viewRender: (value) => {
//                         const name = getUserNameCached(value);
//                         return name !== "-" ? name : "System";
//                     }
//                 },
//                 {
//                     name: "updated_by",
//                     label: "Updated By",
//                     type: "text",
//                     disabled: true,
//                     viewRender: (value) => {
//                         if (!value) return '—';
//                         const name = getUserNameCached(value);
//                         return name !== "-" ? name : "System";
//                     }
//                 },
//                 {
//                     label: "Created At",
//                     name: "created_at",
//                     viewRender: (value) => {
//                         if (!value) return "—";

//                         const date = new Date(value);

//                         if (Number.isNaN(date.getTime())) return "—";

//                         return formatDate(date);
//                     }
//                 },
//                 {
//                     label: "Updated At",
//                     name: "updated_at",
//                     viewRender: (value) => {
//                         if (!value) return "—";

//                         const date = new Date(value);

//                         if (Number.isNaN(date.getTime())) return "—";

//                         return formatDate(date);
//                     }
//                 },
//             ];

//             return [...baseFields, ...auditFields];
//         }

//         return baseFields;
//     };

//     // Validation rules
//     const getValidationRules = (existingData) => ({
//         subscription_plan_id: {
//             required: true,
//             requiredMessage: 'Please select a subscription plan'
//         },
//         subscription_features_id: {
//             required: true,
//             requiredMessage: 'Please select a feature'
//         },
//         value: {
//             required: false,
//             maxLength: 100,
//             maxLengthMessage: 'Value must be at most 100 characters'
//         },
//         display_value: {
//             required: false,
//             maxLength: 100,
//             maxLengthMessage: 'Display value must be at most 100 characters'
//         }
//     });

//     // Submit handler
//     const handleSubmit = async (formData) => {
//         setLoading(true);

//         try {
//             const submitData = {
//                 subscription_plan_id: parseInt(formData.subscription_plan_id),
//                 subscription_features_id: parseInt(formData.subscription_features_id),
//                 value: formData.value?.trim() || "",
//                 display_value: formData.display_value?.trim() || "",
//                 is_unlimited: formData.is_unlimited || false,
//                 is_trending: formData.is_trending || false,
//                 status: formData.status === "active",
//             };

//             if (mode === 'edit') {
//                 submitData.updated_by = userId;
//             } else {
//                 submitData.created_by = userId;
//                 submitData.updated_by = userId;
//             }

//             if (mode === 'edit') {
//                 await subscriptionPlanFeatureService.update(id, submitData);
//                 showSuccess("Subscription plan feature updated successfully");
//             } else {
//                 await subscriptionPlanFeatureService.create(submitData);
//                 showSuccess("Subscription plan feature created successfully");
//             }

//             navigate('/subscription-plan-features');
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
//             await subscriptionPlanFeatureService.delete(id);
//             showSuccess("Subscription plan feature deleted successfully");
//             navigate('/subscription-plan-features');
//         } catch (error) {
//             console.error('Delete error:', error);
//             const message = error?.response?.data?.message || error?.message || "";
//             if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//                 showError("Cannot delete this feature because it is being used in other records.");
//             } else {
//                 showError(message || "Failed to delete feature");
//             }
//             throw error;
//         }
//     };

//     // Prepare initial data
//     const getInitialData = () => {
//         if (mode === 'add') {
//             return {
//                 subscription_plan_id: "",
//                 subscription_features_id: "",
//                 value: "",
//                 display_value: "",
//                 is_unlimited: false,
//                 is_trending: false,
//                 status: "active"
//             };
//         }

//         if (data) {
//             // FIX: Use getStatusValue to determine the correct status
//             const isActive = getStatusValue(data);

//             const initialData = {
//                 subscription_plan_id: data.subscription_plan_id || "",
//                 subscription_features_id: data.subscription_features_id || "",
//                 value: data.value || "",
//                 display_value: data.display_value || "",
//                 is_unlimited: data.is_unlimited || false,
//                 is_trending: data.is_trending || false,
//                 // FIX: Set status based on normalized value
//                 status: isActive ? "active" : "inactive",
//                 plan_name: data.plan_name || "",
//                 feature_name: data.feature_name || "",
//             };

//             if (mode === 'view') {
//                 initialData.created_by = data.created_by;
//                 initialData.updated_by = data.updated_by;
//                 initialData.created_at = data.created_at;
//                 initialData.updated_at = data.updated_at;
//             }

//             console.log('Initial data for form:', initialData);
//             return initialData;
//         }

//         return {
//             subscription_plan_id: "",
//             subscription_features_id: "",
//             value: "",
//             display_value: "",
//             is_unlimited: false,
//             is_trending: false,
//             status: "active"
//         };
//     };

//     // Get title based on mode
//     const getTitle = () => {
//         if (mode === 'view') return 'Subscription Plan Feature Details';
//         if (mode === 'edit') return 'Edit Subscription Plan Feature';
//         return 'Add New Subscription Plan Feature';
//     };

//     // Get submit label
//     const getSubmitLabel = () => {
//         if (mode === 'edit') return 'Update Feature';
//         return 'Create Feature';
//     };

//     // Handle loading state
//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-3 text-gray-500">Loading feature data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // If view/edit mode and data not loaded, show error
//     if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Subscription plan feature not found</p>
//                     <button
//                         onClick={() => navigate('/subscription-plan-features')}
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
//             navigateTo="/subscription-plan-features"
//             submitLabel={getSubmitLabel()}
//             editLabel="Edit Feature"
//             deleteLabel="Delete Feature"
//             loading={loading}
//             showDelete={mode !== 'add'}
//             showEdit={mode === 'view'}
//             enableEditMode={mode === 'view'}
//             breadcrumb={mode === 'view' ? 'Viewing feature details' : mode === 'edit' ? 'Updating feature' : 'Creating new feature'}
//             onEdit={() => navigate(`/subscription-plan-features/edit/${id}`, { state: { item: data } })}
//         />
//     );
// };

// export default SubscriptionPlanFeaturesForm;

// pages/subscriptions/SubscriptionPlanFeaturesForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MdArrowBack,
    MdSave,
    MdCancel,
    MdDelete,
    MdWarning,
    MdClose,
    MdApartment,
    MdCategory,
    MdAttachMoney,
    MdDescription,
    MdImage,
    MdHistory,
    MdCheckCircle,
    MdErrorOutline,
    MdPauseCircle,
    MdBlock,
    MdCloudUpload,
    MdOpenInNew,
    MdTrendingUp,
    MdStar,
    MdInfo,
    MdAssignment,
} from 'react-icons/md';
import { subscriptionPlanFeatureService } from '../../services/subscriptionPlanFeature.service';
import { subscriptionPlanService } from '../../services/subscriptionPlan.service';
import { subscriptionFeatureService } from '../../services/subscriptionFeature.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';
import { useAuth } from '../../context/AuthContext';
import { ViewBadge, ViewTrendingBadge } from '../../components/common/FormPageUtils';

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
    active: {
        pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        dot: "bg-emerald-500",
        icon: MdCheckCircle,
        heroDot: "bg-emerald-400",
    },
    inactive: {
        pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
        dot: "bg-slate-400",
        icon: MdErrorOutline,
        heroDot: "bg-slate-400",
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

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children, required }) => (
    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
);

const ReadOnlyValue = ({ children }) => (
    <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
        {children || "—"}
    </div>
);

const Toggle = ({ checked, onChange, name, disabled }) => (
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
        <input
            type="checkbox"
            name={name}
            checked={checked || false}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
    </label>
);

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
    { id: "overview", label: "Overview", icon: MdAssignment },
    { id: "status", label: "Status & Activity", icon: MdInfo },
];

// ─── Main Component ──────────────────────────────────────────
const SubscriptionPlanFeaturesForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    const userId = user?.id;

    const [mode, setMode] = useState('add');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [plans, setPlans] = useState([]);
    const [features, setFeatures] = useState([]);
    const [userNameCache, setUserNameCache] = useState({});
    const [pageLoading, setPageLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    // Fetch dropdown data
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [plansRes, featuresRes] = await Promise.all([
                    subscriptionPlanService.getAll({ limit: 1000 }),
                    subscriptionFeatureService.getAll({ limit: 1000 })
                ]);

                const plansData = plansRes.data?.data || plansRes.data || [];
                const featuresData = featuresRes.data?.data || featuresRes.data || [];

                setPlans(Array.isArray(plansData) ? plansData : []);
                setFeatures(Array.isArray(featuresData) ? featuresData : []);
            } catch (error) {
                console.error("Failed to fetch dropdown data:", error);
            }
        };
        fetchDropdownData();
    }, []);

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

    // Helper function to normalize status properly
    const normalizeStatus = (item) => {
        if (!item) return true;
        const statusValue = item.is_status !== undefined ? item.is_status : item.status;
        if (statusValue === undefined || statusValue === null) return true;
        if (typeof statusValue === 'string') {
            return statusValue.toLowerCase() === 'active' ||
                statusValue === '1' ||
                statusValue === 'true';
        }
        return statusValue === true || statusValue === 1;
    };

    // Fetch data for edit/view modes
    useEffect(() => {
        const fetchData = async () => {
            if ((mode === 'edit' || mode === 'view') && id) {
                setPageLoading(true);
                try {
                    let item = location.state?.item;

                    if (!item) {
                        const response = await subscriptionPlanFeatureService.getById(id);
                        item = response.data;
                    }

                    // Get plan name
                    let planName = "-";
                    if (item.SubscriptionPlan) {
                        planName = item.SubscriptionPlan.plan_name || "-";
                    } else if (item.plan_name) {
                        planName = item.plan_name;
                    } else if (item.subscription_plan_id) {
                        const plan = plans.find(p => (p.id || p._id) === item.subscription_plan_id);
                        planName = plan?.plan_name || "-";
                    }

                    // Get feature name
                    let featureName = "-";
                    if (item.SubscriptionFeature) {
                        featureName = item.SubscriptionFeature.feature_name || "-";
                    } else if (item.feature_name) {
                        featureName = item.feature_name;
                    } else if (item.subscription_features_id) {
                        const feature = features.find(f => (f.id || f._id) === item.subscription_features_id);
                        featureName = feature?.feature_name || "-";
                    }

                    const isActive = normalizeStatus(item);

                    const normalizedData = {
                        id: item.id || item._id,
                        subscription_plan_id: item.subscription_plan_id || "",
                        subscription_features_id: item.subscription_features_id || "",
                        value: item.value || "",
                        display_value: item.display_value || "",
                        value_type: item.value_type || "integer",
                        unit: item.unit || "",
                        is_unlimited: item.is_unlimited === 1 || item.is_unlimited === true,
                        is_trending: item.is_trending === 1 || item.is_trending === true,
                        is_status: isActive,
                        status: isActive,
                        created_by: item.created_by || null,
                        updated_by: item.updated_by || null,
                        created_at: item.created_at || item.createdAt || null,
                        updated_at: item.updated_at || item.updatedAt || null,
                        plan_name: planName,
                        feature_name: featureName,
                        raw: item,
                    };

                    setData(normalizedData);
                } catch (error) {
                    console.error('Fetch error:', error);
                    showError("Failed to load subscription plan feature data");
                    navigate('/subscription-plan-features');
                } finally {
                    setPageLoading(false);
                }
            }
        };
        fetchData();
    }, [id, mode, location.state, navigate, plans, features]);

    // Get user name with caching
    const getUserNameCached = (userId) => {
        if (!userId) return "—";
        return userNameCache[userId] || `User ${userId}`;
    };

    // Get status value
    const getStatusValue = (row) => {
        if (!row) return true;
        if (row.is_status !== undefined) {
            return row.is_status === true;
        }
        if (row.status !== undefined) {
            return normalizeStatus(row);
        }
        return true;
    };

    // ─── Form state ──────────────────────────────────────────────
    const [formValues, setFormValues] = useState({});

    // Initialize form values when data changes
    useEffect(() => {
        const initial = getInitialData();
        setFormValues(initial);
    }, [data, mode]);

    // ─── Handlers ─────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ─── Validation ──────────────────────────────────────────────
    const validate = () => {
        if (!formValues.subscription_plan_id) {
            showError("Please select a subscription plan");
            return false;
        }
        if (!formValues.subscription_features_id) {
            showError("Please select a feature");
            return false;
        }
        return true;
    };

    // ─── Submit ──────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const submitData = {
                subscription_plan_id: parseInt(formValues.subscription_plan_id),
                subscription_features_id: parseInt(formValues.subscription_features_id),
                value: formValues.value?.trim() || "",
                display_value: formValues.display_value?.trim() || "",
                is_unlimited: formValues.is_unlimited || false,
                is_trending: formValues.is_trending || false,
                status: formValues.status === "active",
            };

            if (mode === 'edit') {
                submitData.updated_by = userId;
            } else {
                submitData.created_by = userId;
                submitData.updated_by = userId;
            }

            if (mode === 'edit') {
                await subscriptionPlanFeatureService.update(id, submitData);
                showSuccess("Subscription plan feature updated successfully");
            } else {
                await subscriptionPlanFeatureService.create(submitData);
                showSuccess("Subscription plan feature created successfully");
            }

            navigate('/subscription-plan-features');
        } catch (error) {
            console.error('Submit error:', error);
            const errorMessage = error?.message ||
                error?.response?.data?.message ||
                "Failed to save";
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ─── Delete ──────────────────────────────────────────────────
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await subscriptionPlanFeatureService.delete(id);
            showSuccess("Subscription plan feature deleted successfully");
            navigate('/subscription-plan-features');
        } catch (error) {
            console.error('Delete error:', error);
            const message = error?.response?.data?.message || error?.message || "";
            if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
                showError("Cannot delete this feature because it is being used in other records.");
            } else {
                showError(message || "Failed to delete feature");
            }
            throw error;
        } finally {
            setDeleteLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    // ─── Helpers for initial data ──────────────────────────────
    const getInitialData = () => {
        if (mode === 'add') {
            return {
                subscription_plan_id: "",
                subscription_features_id: "",
                value: "",
                display_value: "",
                is_unlimited: false,
                is_trending: false,
                status: "active"
            };
        }

        if (data) {
            const isActive = getStatusValue(data);
            const initialData = {
                subscription_plan_id: data.subscription_plan_id || "",
                subscription_features_id: data.subscription_features_id || "",
                value: data.value || "",
                display_value: data.display_value || "",
                is_unlimited: data.is_unlimited || false,
                is_trending: data.is_trending || false,
                status: isActive ? "active" : "inactive",
                plan_name: data.plan_name || "",
                feature_name: data.feature_name || "",
            };

            if (mode === 'view') {
                initialData.created_by = data.created_by;
                initialData.updated_by = data.updated_by;
                initialData.created_at = data.created_at;
                initialData.updated_at = data.updated_at;
            }

            return initialData;
        }

        return {
            subscription_plan_id: "",
            subscription_features_id: "",
            value: "",
            display_value: "",
            is_unlimited: false,
            is_trending: false,
            status: "active"
        };
    };

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    const featureName = formValues.feature_name || formValues.subscription_features_id || "New Feature";
    const planNameDisplay = formValues.plan_name || formValues.subscription_plan_id || "—";
    const valueDisplay = formValues.value || "—";
    const statusValue = formValues.status || "active";
    const isUnlimited = formValues.is_unlimited || false;
    const isTrending = formValues.is_trending || false;

    // ─── Render tab content ──────────────────────────────────────
    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel required>Subscription Plan</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{planNameDisplay}</ReadOnlyValue>
                                ) : (
                                    <select
                                        name="subscription_plan_id"
                                        value={formValues.subscription_plan_id || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                    >
                                        <option value="">Select a plan</option>
                                        {plans.map(plan => (
                                            <option key={plan.id || plan._id} value={plan.id || plan._id}>
                                                {plan.plan_name || "-"}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <FieldLabel required>Feature</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{featureName}</ReadOnlyValue>
                                ) : (
                                    <select
                                        name="subscription_features_id"
                                        value={formValues.subscription_features_id || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                    >
                                        <option value="">Select a feature</option>
                                        {features.map(feature => (
                                            <option key={feature.id || feature._id} value={feature.id || feature._id}>
                                                {feature.feature_name || "-"}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <FieldLabel>Value</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{valueDisplay}</ReadOnlyValue>
                                ) : (
                                    <input
                                        type="text"
                                        name="value"
                                        value={formValues.value || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                        placeholder="e.g. 10, Unlimited, 5GB"
                                    />
                                )}
                            </div>

                            <div>
                                <FieldLabel>Display Value</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{formValues.display_value || "—"}</ReadOnlyValue>
                                ) : (
                                    <input
                                        type="text"
                                        name="display_value"
                                        value={formValues.display_value || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                        placeholder="e.g. 10 Users, 5GB Storage"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-5 space-y-4">
                            <div>
                                <FieldLabel>Unlimited</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isUnlimited ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${isUnlimited ? "bg-green-500" : "bg-slate-400"}`} />
                                            {isUnlimited ? "Unlimited" : "Limited"}
                                        </span>
                                    </ReadOnlyValue>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Toggle
                                            name="is_unlimited"
                                            checked={formValues.is_unlimited}
                                            onChange={handleInputChange}
                                        />
                                        <span className="text-sm text-slate-600">
                                            {formValues.is_unlimited ? "Unlimited" : "Limited"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <FieldLabel>Mark as Trending</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>
                                        {isTrending ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                Trending
                                            </span>
                                        ) : (
                                            "Not Trending"
                                        )}
                                    </ReadOnlyValue>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Toggle
                                            name="is_trending"
                                            checked={formValues.is_trending}
                                            onChange={handleInputChange}
                                        />
                                        <span className="text-sm text-slate-600">
                                            {formValues.is_trending ? "Marked as trending" : "Not trending"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case "status":
                return (
                    <div className="space-y-6 max-w-xl">
                        <div>
                            <FieldLabel required>Status</FieldLabel>
                            {isViewMode ? (
                                <ReadOnlyValue>
                                    <StatusPill status={statusValue} />
                                </ReadOnlyValue>
                            ) : (
                                <div className="flex flex-wrap gap-6 pt-1">
                                    {["active", "inactive"].map((s) => (
                                        <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value={s}
                                                checked={formValues.status === s}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                                            />
                                            <span className="text-sm text-slate-700 capitalize">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {(mode === "view" || mode === "edit") && (
                            <div className="border-t border-slate-200 pt-5 space-y-5">
                                <div>
                                    <FieldLabel>Created By</FieldLabel>
                                    <ReadOnlyValue>{getUserNameCached(data?.created_by)}</ReadOnlyValue>
                                </div>
                                <div>
                                    <FieldLabel>Created At</FieldLabel>
                                    <ReadOnlyValue>{data?.created_at ? formatDate(data.created_at) : "—"}</ReadOnlyValue>
                                </div>
                                <div>
                                    <FieldLabel>Last Updated By</FieldLabel>
                                    <ReadOnlyValue>{getUserNameCached(data?.updated_by)}</ReadOnlyValue>
                                </div>
                                <div>
                                    <FieldLabel>Last Updated At</FieldLabel>
                                    <ReadOnlyValue>{data?.updated_at ? formatDate(data.updated_at) : "—"}</ReadOnlyValue>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // ─── Loading state ───────────────────────────────────────────
    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Loading feature data...</p>
                </div>
            </div>
        );
    }

    if ((mode === "view" || mode === "edit") && !data && !pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
                <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
                    <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Feature not found</p>
                    <button
                        onClick={() => navigate('/subscription-plan-features')}
                        className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <MdArrowBack size={16} />
                        Back to features
                    </button>
                </div>
            </div>
        );
    }

    const heroName = featureName;
    const initials = heroName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    return (
        <div className="min-h-screen pb-16">
            {/* ─── Sticky action bar ─────────────────────────────────── */}
            <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate('/subscription-plan-features')}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                            aria-label="Back"
                        >
                            <MdArrowBack size={19} className="text-slate-600" />
                        </button>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 leading-tight">Plan Features</p>
                            <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                                {heroName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isViewMode ? (
                            <>
                                {mode !== "add" && (
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                        aria-label="Delete feature"
                                        title="Delete feature"
                                    >
                                        <MdDelete size={19} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/subscription-plan-features/edit/${id}`, {
                                            state: { item: data },
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
                                >
                                    <MdSave size={16} />
                                    Edit Feature
                                </button>
                            </>
                        ) : (
                            <>
                                {mode !== "add" && (
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                        aria-label="Delete feature"
                                        title="Delete feature"
                                    >
                                        <MdDelete size={19} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => navigate('/subscription-plan-features')}
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                                >
                                    <MdCancel size={16} />
                                    Cancel
                                </button>
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
                                    {loading ? "Saving..." : isEditMode ? "Update Feature" : "Create Feature"}
                                </button>
                            </>
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
                    <div className="relative h-44 sm:h-52">
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            {/* Icon placeholder */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                    {initials || <MdAssignment size={22} />}
                                </div>
                            </div>

                            {/* Name + chips */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                                        {heroName}
                                    </h1>
                                    {isTrending && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                                            <MdTrendingUp size={12} />
                                            Trending
                                        </span>
                                    )}
                                    {isUnlimited && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-400/20 text-green-300 ring-1 ring-green-400/30">
                                            Unlimited
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                    <StatusPill status={statusValue} />
                                    <span className="text-xs text-white/70">Plan: {planNameDisplay}</span>
                                    <span className="text-xs text-white/70">• Value: {valueDisplay}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Quick stat strip ──────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
                        <MdApartment size={16} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 leading-tight">Plan</p>
                            <p className="text-sm font-semibold text-slate-700 truncate">{planNameDisplay}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
                        <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 leading-tight">Feature</p>
                            <p className="text-sm font-semibold text-slate-700 truncate">{featureName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
                        <MdDescription size={16} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 leading-tight">Value</p>
                            <p className="text-sm font-semibold text-slate-700 truncate">{valueDisplay}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
                        <MdInfo size={16} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 leading-tight">Status</p>
                            <p className="text-sm font-semibold text-slate-700 truncate capitalize">{statusValue}</p>
                        </div>
                    </div>
                </div>

                {/* ─── Tabs ───────────────────────────────────────────────── */}
                <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-slate-200 px-2">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                                        active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                    {active && (
                                        <motion.span
                                            layoutId="feature-tab-underline"
                                            className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
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

                {/* Mobile-only cancel button */}
                {!isViewMode && (
                    <button
                        type="button"
                        onClick={() => navigate('/subscription-plan-features')}
                        className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                    >
                        <MdCancel size={16} />
                        Cancel
                    </button>
                )}
            </div>

            {/* ─── Delete confirmation modal ──────────────────────────── */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
                        onClick={() => !deleteLoading && setIsDeleteModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 8 }}
                            transition={{ duration: 0.18 }}
                            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-full bg-red-50">
                                        <MdWarning size={18} className="text-red-500" />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-800">Delete Feature?</h3>
                                </div>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                                    disabled={deleteLoading}
                                >
                                    <MdClose size={18} />
                                </button>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-sm text-slate-600">
                                    This will permanently remove <span className="font-medium text-slate-800">{heroName}</span> and its data. This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-slate-100">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={deleteLoading}
                                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Keep feature
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
                                >
                                    {deleteLoading && (
                                        <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                                    )}
                                    {deleteLoading ? "Deleting..." : "Delete feature"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriptionPlanFeaturesForm;