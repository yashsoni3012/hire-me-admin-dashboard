// // import React, { useState, useEffect, useMemo } from "react";
// // import {
// //   MdAdd,
// //   MdEdit,
// //   MdDelete,
// //   MdSearch,
// //   MdVisibility,
// //   MdChevronLeft,
// //   MdChevronRight,
// // } from "react-icons/md";
// // import Table from "../../components/common/Table";
// // import Button from "../../components/common/Button";
// // import ConfirmDialog from "../../components/common/ConfirmDialog";
// // import ViewModal, { ViewRow } from "../../components/common/ViewModal";
// // import FormModal from "../../components/common/FormModal";
// // import { subscriptionPlanFeatureService } from "../../services/subscriptionPlanFeature.service";
// // import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
// // import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
// // import { showSuccess, showError } from "../../utils/toast";
// // import { formatDate } from "../../utils/helpers";
// // import { fetchUsers } from "../../utils/getUserName";

// // // Robust boolean coercion — handles true/false, 1/0, "1"/"0", "true"/"false"
// // const toBool = (val, fallback = true) => {
// //   if (val === undefined || val === null || val === "") return fallback;
// //   if (val === true || val === 1 || val === "1" || val === "true") return true;
// //   if (val === false || val === 0 || val === "0" || val === "false") return false;
// //   return Boolean(val);
// // };

// // const SubscriptionPlanFeatures = () => {
// //   const [showBulkUpload, setShowBulkUpload] = useState(false);
// //   const [data, setData] = useState([]);
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
// //   const [userNameCache, setUserNameCache] = useState({});
// //   const [togglingId, setTogglingId] = useState(null);
// //   const [plans, setPlans] = useState([]);
// //   const [features, setFeatures] = useState([]);
// //   const [plansLoaded, setPlansLoaded] = useState(false);
// //   const [featuresLoaded, setFeaturesLoaded] = useState(false);

// //   // Get user name with caching
// //   const getUserNameCached = (userId) => {
// //     if (!userId) return "-";
// //     return userNameCache[userId] || `User ${userId}`;
// //   };

// //   // Load plans
// //   const loadPlans = async () => {
// //     try {
// //       const response = await subscriptionPlanService.getAll({ limit: 1000 });
// //       const rawData = response.data?.data || response.data?.results || response.data || [];
// //       const plansData = Array.isArray(rawData) ? rawData : [];
// //       setPlans(plansData);
// //       setPlansLoaded(true);
// //       console.log('Plans loaded:', plansData);
// //     } catch (error) {
// //       console.error("Error loading plans:", error);
// //       setPlansLoaded(true);
// //     }
// //   };

// //   // Load features
// //   const loadFeatures = async () => {
// //     try {
// //       const response = await subscriptionFeatureService.getAll({ limit: 1000 });
// //       const rawData = response.data?.data || response.data?.results || response.data || [];
// //       const featuresData = Array.isArray(rawData) ? rawData : [];
// //       setFeatures(featuresData);
// //       setFeaturesLoaded(true);
// //       console.log('Features loaded:', featuresData);
// //     } catch (error) {
// //       console.error("Error loading features:", error);
// //       setFeaturesLoaded(true);
// //     }
// //   };

// //   // Get plan name by ID
// //   const getPlanName = (planId) => {
// //     if (!planId) return "-";
// //     // Try to find by id or _id
// //     const plan = plans.find(p => (p.id || p._id) === planId);
// //     if (plan) {
// //       return plan.plan_name || "-";
// //     }
// //     // If not found, check if the plan is in the data directly
// //     return "-";
// //   };

// //   // Get feature name by ID
// //   const getFeatureName = (featureId) => {
// //     if (!featureId) return "-";
// //     // Try to find by id or _id
// //     const feature = features.find(f => (f.id || f._id) === featureId);
// //     if (feature) {
// //       return feature.feature_name || "-";
// //     }
// //     // If not found, check if the feature is in the data directly
// //     return "-";
// //   };

// //   // Normalize subscription plan feature data
// //   const normalizePlanFeature = (item) => {
// //     // Get plan name - check both direct and nested
// //     let planName = "-";
// //     if (item.SubscriptionPlan) {
// //       planName = item.SubscriptionPlan.plan_name || "-";
// //     } else if (item.plan_name) {
// //       planName = item.plan_name;
// //     } else if (item.subscription_plan_id) {
// //       // Try to find in loaded plans
// //       const plan = plans.find(p => (p.id || p._id) === item.subscription_plan_id);
// //       planName = plan?.plan_name || "-";
// //     }

// //     // Get feature name - check both direct and nested
// //     let featureName = "-";
// //     if (item.SubscriptionFeature) {
// //       featureName = item.SubscriptionFeature.feature_name || "-";
// //     } else if (item.feature_name) {
// //       featureName = item.feature_name;
// //     } else if (item.subscription_features_id) {
// //       // Try to find in loaded features
// //       const feature = features.find(f => (f.id || f._id) === item.subscription_features_id);
// //       featureName = feature?.feature_name || "-";
// //     }

// //     return {
// //       id: item.id || item._id,
// //       subscription_plan_id: item.subscription_plan_id || "",
// //       subscription_features_id: item.subscription_features_id || "",
// //       value: item.value || "",
// //       display_value: item.display_value || "",
// //       value_type: item.value_type || "integer",
// //       unit: item.unit || "",
// //       is_unlimited: toBool(item.is_unlimited, false),
// //       is_trending: toBool(item.is_trending, false),
// //       is_status: toBool(item.status, true),
// //       updated_by: item.updated_by || "",
// //       updated_at: item.updated_at || item.updatedAt || null,
// //       created_at: item.created_at || item.createdAt || null,
// //       created_by: item.created_by || "",
// //       plan_name: planName,
// //       feature_name: featureName,
// //     };
// //   };

// //   // Load subscription plan features
// //   const load = async () => {
// //     setLoading(true);
// //     try {
// //       // Fetch and cache users
// //       const users = await fetchUsers();
// //       const userMap = {};
// //       Object.keys(users).forEach(id => {
// //         userMap[id] = users[id].name;
// //       });
// //       setUserNameCache(userMap);

// //       // Load dropdown data first
// //       await Promise.all([loadPlans(), loadFeatures()]);

// //       // Fetch subscription plan features
// //       const r = await subscriptionPlanFeatureService.getAll({ limit: 1000 });
// //       console.log('Plan features response:', r);

// //       const rawData = r.data?.data || r.data?.results || r.data || [];
// //       console.log('Raw plan features:', rawData);

// //       const planFeatures = Array.isArray(rawData) ? rawData.map(normalizePlanFeature) : [];

// //       console.log('Normalized plan features:', planFeatures);

// //       // Sort by created_at descending (newest first)
// //       const sortedPlanFeatures = planFeatures.sort((a, b) => {
// //         return new Date(b.created_at) - new Date(a.created_at);
// //       });

// //       setData(sortedPlanFeatures);
// //     } catch (error) {
// //       console.error("Load error:", error);
// //       showError(error.message || "Failed to load subscription plan features");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     load();
// //   }, []);

// //   useEffect(() => {
// //     setPage(1);
// //   }, [search, statusFilter]);

// //   const filteredData = useMemo(() => {
// //     let result = data;
// //     if (statusFilter !== "all") {
// //       const isActive = statusFilter === "active";
// //       result = result.filter((item) => item.is_status === isActive);
// //     }
// //     const query = search.toLowerCase().trim();
// //     if (query) {
// //       result = result.filter((item) =>
// //         String(item.plan_name ?? "")
// //           .toLowerCase()
// //           .includes(query) ||
// //         String(item.feature_name ?? "")
// //           .toLowerCase()
// //           .includes(query) ||
// //         String(item.display_value ?? "")
// //           .toLowerCase()
// //           .includes(query)
// //       );
// //     }
// //     return result;
// //   }, [data, search, statusFilter]);

// //   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

// //   const activeCount = data.filter((r) => r.is_status === true).length;
// //   const inactiveCount = data.length - activeCount;

// //   // Get display name for created by - uses cached user names
// //   const getCreatedByName = (row) => {
// //     if (!row) return "-";
// //     if (row.created_by) {
// //       return getUserNameCached(row.created_by);
// //     }
// //     return "-";
// //   };

// //   // Get display name for updated by - uses cached user names
// //   const getUpdatedByName = (row) => {
// //     if (!row) return "-";
// //     if (row.updated_by) {
// //       return getUserNameCached(row.updated_by);
// //     }
// //     return "-";
// //   };

// //   // Form fields configuration
// //   const getFormFields = (editData = null) => {
// //     const planOptions = plans.map(plan => ({
// //       value: plan.id || plan._id,
// //       label: plan.plan_name || "-"
// //     }));

// //     const featureOptions = features.map(feature => ({
// //       value: feature.id || feature._id,
// //       label: feature.feature_name || "-"
// //     }));

// //     return [
// //       {
// //         name: "subscription_plan_id",
// //         label: "Subscription Plan",
// //         type: "select",
// //         required: true,
// //         options: planOptions,
// //         placeholder: "Select a plan",
// //         help: "Select the subscription plan",
// //       },
// //       {
// //         name: "subscription_features_id",
// //         label: "Feature",
// //         type: "select",
// //         required: true,
// //         options: featureOptions,
// //         placeholder: "Select a feature",
// //         help: "Select the feature to assign",
// //       },
// //       {
// //         name: "value",
// //         label: "Value",
// //         type: "text",
// //         required: false,
// //         placeholder: "e.g. 10, Unlimited, 5GB",
// //         help: "Enter the feature value",
// //       },
// //       {
// //         name: "display_value",
// //         label: "Display Value",
// //         type: "text",
// //         required: false,
// //         placeholder: "e.g. 10 Users, 5GB Storage",
// //         help: "Enter the display value shown to users",
// //       },
// //       {
// //         name: "value_type",
// //         label: "Value Type",
// //         type: "select",
// //         required: false,
// //         options: [
// //           { value: "integer", label: "Integer" },
// //           { value: "string", label: "String" },
// //           { value: "boolean", label: "Boolean" },
// //           { value: "float", label: "Float" },
// //         ],
// //         placeholder: "Select value type",
// //         help: "Select the data type of the value",
// //       },
// //       {
// //         name: "unit",
// //         label: "Unit",
// //         type: "text",
// //         required: false,
// //         placeholder: "e.g. GB, Users, MB",
// //         help: "Enter the unit of measurement",
// //       },
// //       {
// //         name: "is_unlimited",
// //         label: "Unlimited",
// //         type: "checkbox",
// //         color: "text-green-500 focus:ring-green-500",
// //         help: "Check if this feature is unlimited",
// //       },
// //       {
// //         name: "is_trending",
// //         label: "Mark as Trending",
// //         type: "checkbox",
// //         color: "text-yellow-500 focus:ring-yellow-500",
// //         help: "Trending features will be highlighted",
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
// //     ];
// //   };

// //   // Validation rules
// //   const validationRules = {
// //     subscription_plan_id: {
// //       required: true,
// //       requiredMessage: "Please select a subscription plan",
// //     },
// //     subscription_features_id: {
// //       required: true,
// //       requiredMessage: "Please select a feature",
// //     },
// //     value: {
// //       required: false,
// //       maxLength: 100,
// //       maxLengthMessage: "Value must be at most 100 characters",
// //     },
// //     display_value: {
// //       required: false,
// //       maxLength: 100,
// //       maxLengthMessage: "Display value must be at most 100 characters",
// //     },
// //     unit: {
// //       required: false,
// //       maxLength: 20,
// //       maxLengthMessage: "Unit must be at most 20 characters",
// //     },
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

// //   const handleSubmit = async (formData) => {
// //     setFormLoading(true);
// //     try {
// //       const submitData = {
// //         subscription_plan_id: parseInt(formData.subscription_plan_id),
// //         subscription_features_id: parseInt(formData.subscription_features_id),
// //         value: formData.value?.trim() || "",
// //         display_value: formData.display_value?.trim() || "",
// //         value_type: formData.value_type || "integer",
// //         unit: formData.unit?.trim() || "",
// //         is_unlimited: formData.is_unlimited || false,
// //         is_trending: formData.is_trending || false,
// //         status: formData.status === "active",
// //       };

// //       if (editItem) {
// //         await subscriptionPlanFeatureService.update(editItem.id, submitData);
// //         showSuccess("Subscription plan feature updated successfully");
// //       } else {
// //         await subscriptionPlanFeatureService.create(submitData);
// //         showSuccess("Subscription plan feature created successfully");
// //       }
// //       setModalOpen(false);
// //       load();
// //     } catch (error) {
// //       console.error("Submit error:", error);
// //       showError(
// //         error.message || error?.response?.data?.message || "Failed to save",
// //       );
// //     } finally {
// //       setFormLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     setDeleteLoading(true);
// //     try {
// //       await subscriptionPlanFeatureService.delete(deleteId);
// //       showSuccess("Subscription plan feature deleted successfully");
// //       load();
// //     } catch (error) {
// //       console.error("Delete error:", error);
// //       const message = error?.response?.data?.message || error?.message || "";
// //       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
// //         showError(
// //           "Cannot delete this feature because it is being used in other records.",
// //         );
// //       } else {
// //         showError(message || "Failed to delete feature");
// //       }
// //     } finally {
// //       setDeleteId(null);
// //       setDeleteLoading(false);
// //     }
// //   };

// //   const handleStatusToggle = async (row) => {
// //     if (togglingId === row.id) return;
// //     const currentStatus = row.is_status === true;
// //     const newStatus = !currentStatus;

// //     setTogglingId(row.id);
// //     // optimistic UI update
// //     setData((prev) =>
// //       prev.map((item) => (item.id === row.id ? { ...item, is_status: newStatus } : item)),
// //     );

// //     try {
// //       const updateData = {
// //         subscription_plan_id: row.subscription_plan_id,
// //         subscription_features_id: row.subscription_features_id,
// //         value: row.value || "",
// //         display_value: row.display_value || "",
// //         value_type: row.value_type || "integer",
// //         unit: row.unit || "",
// //         is_unlimited: row.is_unlimited || false,
// //         is_trending: row.is_trending || false,
// //         status: newStatus,
// //       };

// //       const res = await subscriptionPlanFeatureService.update(row.id, updateData);

// //       // If the API returns the updated record, trust it as the source of truth
// //       const updatedRaw = res?.data?.data || res?.data || res;
// //       if (updatedRaw && typeof updatedRaw === "object" && !Array.isArray(updatedRaw)) {
// //         let confirmed = newStatus;
// //         if (updatedRaw.status !== undefined) {
// //           confirmed = toBool(updatedRaw.status, newStatus);
// //         }
// //         setData((prev) =>
// //           prev.map((item) => (item.id === row.id ? { ...item, is_status: confirmed } : item)),
// //         );
// //       }

// //       showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
// //     } catch (error) {
// //       console.error("Status toggle error:", error);
// //       // revert optimistic update on failure
// //       setData((prev) =>
// //         prev.map((item) => (item.id === row.id ? { ...item, is_status: currentStatus } : item)),
// //       );
// //       showError(error.response?.data?.message || error.message || "Failed to update status");
// //     } finally {
// //       setTogglingId(null);
// //     }
// //   };

// //   const handleTrendingToggle = async (row) => {
// //     if (togglingId === `trend-${row.id}`) return;
// //     const currentTrending = row.is_trending === true;
// //     const newValue = !currentTrending;

// //     setTogglingId(`trend-${row.id}`);
// //     setData((prev) =>
// //       prev.map((item) => (item.id === row.id ? { ...item, is_trending: newValue } : item)),
// //     );

// //     try {
// //       const updateData = {
// //         subscription_plan_id: row.subscription_plan_id,
// //         subscription_features_id: row.subscription_features_id,
// //         value: row.value || "",
// //         display_value: row.display_value || "",
// //         value_type: row.value_type || "integer",
// //         unit: row.unit || "",
// //         is_unlimited: row.is_unlimited || false,
// //         is_trending: newValue,
// //         status: row.is_status === true,
// //       };

// //       const res = await subscriptionPlanFeatureService.update(row.id, updateData);

// //       // If the API returns the updated record, trust it as the source of truth
// //       const updatedRaw = res?.data?.data || res?.data || res;
// //       if (updatedRaw && typeof updatedRaw === "object" && !Array.isArray(updatedRaw)) {
// //         let confirmed = newValue;
// //         if (updatedRaw.is_trending !== undefined) {
// //           confirmed = toBool(updatedRaw.is_trending, newValue);
// //         }
// //         setData((prev) =>
// //           prev.map((item) => (item.id === row.id ? { ...item, is_trending: confirmed } : item)),
// //         );
// //       }

// //       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
// //     } catch (error) {
// //       console.error("Trending toggle error:", error);
// //       setData((prev) =>
// //         prev.map((item) => (item.id === row.id ? { ...item, is_trending: currentTrending } : item)),
// //       );
// //       showError(error.response?.data?.message || error.message || "Failed to update trending");
// //     } finally {
// //       setTogglingId(null);
// //     }
// //   };

// //   const columns = [
// //     {
// //       header: "#",
// //       key: "id",
// //       render: (_, __, i) => (page - 1) * limit + i + 1,
// //     },
// //     {
// //       header: "Plan Name",
// //       key: "plan_name",
// //       render: (v) => (
// //         <span className="font-medium text-gray-800">{v || "-"}</span>
// //       ),
// //     },
// //     {
// //       header: "Feature Name",
// //       key: "feature_name",
// //       render: (v) => (
// //         <span className="font-medium text-gray-800">{v || "-"}</span>
// //       ),
// //     },
// //     {
// //       header: "Display Value",
// //       key: "display_value",
// //       render: (v, row) => {
// //         if (row.is_unlimited) {
// //           return <span className="text-green-600 font-medium">Unlimited</span>;
// //         }
// //         return <span className="text-gray-800">{v || row.value || "-"}</span>;
// //       },
// //     },
// //     {
// //       header: "Unit",
// //       key: "unit",
// //       render: (v) => (
// //         <span className="text-gray-600 text-sm">{v || "-"}</span>
// //       ),
// //     },
// //     {
// //       header: "Trending",
// //       key: "is_trending",
// //       render: (value, row) => (
// //         <button
// //           onClick={() => handleTrendingToggle(row)}
// //           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${row.is_trending === true ? "bg-yellow-500" : "bg-gray-300"}`}
// //         >
// //           <span
// //             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${row.is_trending === true ? "translate-x-6" : "translate-x-1"}`}
// //           />
// //         </button>
// //       ),
// //     },
// //     {
// //       header: "Status",
// //       key: "is_status",
// //       render: (value, row) => {
// //         const isActive = row.is_status === true;
// //         return (
// //           <button
// //             onClick={() => handleStatusToggle(row)}
// //             className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"}`}
// //           >
// //             <span
// //               className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"}`}
// //             />
// //           </button>
// //         );
// //       },
// //     },
// //     {
// //       header: "Updated By",
// //       key: "updated_by",
// //       render: (_, row) => (
// //         <span className="text-gray-500 text-sm font-medium">
// //           {getUpdatedByName(row)}
// //         </span>
// //       ),
// //     },
// //     {
// //       header: "Updated At",
// //       key: "updated_at",
// //       render: (v) => (
// //         <span className="text-gray-500 text-sm">{formatDate(v)}</span>
// //       ),
// //     },
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

// //   const totalPages = Math.ceil(filteredData.length / limit);

// //   return (
// //     <div className="space-y-4">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Subscription Plan Features</h1>
// //           <p className="text-sm text-gray-500 mt-1">
// //             Manage features assigned to subscription plans
// //           </p>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           <Button icon={MdAdd} onClick={openAdd}>
// //             Add Feature to Plan
// //           </Button>
// //         </div>
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
// //               placeholder="Search by plan or feature..."
// //               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
// //             />
// //           </div>

// //           <div className="flex items-center gap-5 text-sm">
// //             {tabs.map((tab) => (
// //               <button
// //                 key={tab.key}
// //                 onClick={() => setStatusFilter(tab.key)}
// //                 className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"}`}
// //               >
// //                 {tab.label}
// //                 <span
// //                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
// //                     statusFilter === tab.key
// //                       ? "bg-blue-50 text-[#2c0eee]"
// //                       : "bg-gray-100 text-gray-500"
// //                   }`}
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
// //           emptyMessage="No subscription plan features found"
// //         />

// //         {/* Footer */}
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
// //           <p className="text-xs text-gray-400">
// //             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
// //             {"–"}
// //             {Math.min(page * limit, filteredData.length)} of{" "}
// //             {filteredData.length} features
// //           </p>
// //           <div className="flex items-center gap-3">
// //             <div className="flex items-center gap-2">
// //               <span className="text-xs text-gray-400">Rows:</span>
// //               <select
// //                 value={limit}
// //                 onChange={(e) => {
// //                   setLimit(Number(e.target.value));
// //                   setPage(1);
// //                 }}
// //                 className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
// //               >
// //                 {[5, 10, 15, 20, 25, 50, 100].map((option) => (
// //                   <option key={option} value={option}>
// //                     {option}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div className="flex items-center gap-1">
// //               <button
// //                 onClick={() => setPage(page - 1)}
// //                 disabled={page === 1}
// //                 className={`p-1 rounded-lg transition-colors ${
// //                   page === 1
// //                     ? "text-gray-300 cursor-not-allowed"
// //                     : "hover:bg-gray-100 text-gray-500"
// //                 }`}
// //               >
// //                 <MdChevronLeft size={18} />
// //               </button>
// //               <span className="text-sm text-gray-600 px-2">
// //                 Page {page} of {totalPages || 1}
// //               </span>
// //               <button
// //                 onClick={() => setPage(page + 1)}
// //                 disabled={page === totalPages || totalPages === 0}
// //                 className={`p-1 rounded-lg transition-colors ${
// //                   page === totalPages || totalPages === 0
// //                     ? "text-gray-300 cursor-not-allowed"
// //                     : "hover:bg-gray-100 text-gray-500"
// //                 }`}
// //               >
// //                 <MdChevronRight size={18} />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Form Modal */}
// //       <FormModal
// //         isOpen={modalOpen}
// //         onClose={() => setModalOpen(false)}
// //         onSubmit={handleSubmit}
// //         title={editItem ? "Edit Plan Feature" : "Add Feature to Plan"}
// //         fields={getFormFields(editItem)}
// //         initialData={
// //           editItem
// //             ? {
// //                 subscription_plan_id: editItem.subscription_plan_id || "",
// //                 subscription_features_id: editItem.subscription_features_id || "",
// //                 value: editItem.value || "",
// //                 display_value: editItem.display_value || "",
// //                 value_type: editItem.value_type || "integer",
// //                 unit: editItem.unit || "",
// //                 is_unlimited: editItem.is_unlimited || false,
// //                 is_trending: editItem.is_trending || false,
// //                 status: editItem.is_status ? "active" : "inactive",
// //               }
// //             : {
// //                 subscription_plan_id: "",
// //                 subscription_features_id: "",
// //                 value: "",
// //                 display_value: "",
// //                 value_type: "integer",
// //                 unit: "",
// //                 is_unlimited: false,
// //                 is_trending: false,
// //                 status: "active",
// //               }
// //         }
// //         validationRules={validationRules}
// //         loading={formLoading}
// //         submitLabel={editItem ? "Update" : "Create"}
// //         size="lg"
// //       />

// //       {/* View Modal */}
// //       <ViewModal
// //         isOpen={viewModalOpen}
// //         onClose={() => {
// //           setViewModalOpen(false);
// //           setViewData(null);
// //         }}
// //         title="Plan Feature Details"
// //       >
// //         {viewData && (
// //           <div className="space-y-1">
// //             <ViewRow label="Plan Name" value={viewData.plan_name || "-"} />
// //             <ViewRow label="Feature Name" value={viewData.feature_name || "-"} />
// //             <ViewRow label="Value" value={viewData.value || "-"} />
// //             <ViewRow label="Display Value" value={viewData.display_value || "-"} />
// //             <ViewRow label="Value Type" value={viewData.value_type || "-"} />
// //             <ViewRow label="Unit" value={viewData.unit || "-"} />
// //             <ViewRow
// //               label="Unlimited"
// //               value={viewData.is_unlimited ? "Yes" : "No"}
// //             />
// //             <ViewRow
// //               label="Trending"
// //               value={
// //                 <span
// //                   className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
// //                     viewData.is_trending
// //                       ? "bg-yellow-50 text-yellow-700"
// //                       : "bg-gray-100 text-gray-500"
// //                   }`}
// //                 >
// //                   <span
// //                     className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`}
// //                   />
// //                   {viewData.is_trending ? "Trending" : "Not Trending"}
// //                 </span>
// //               }
// //             />
// //             <ViewRow
// //               label="Status"
// //               value={
// //                 <span
// //                   className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
// //                     viewData.is_status
// //                       ? "bg-green-50 text-green-700"
// //                       : "bg-gray-100 text-gray-500"
// //                   }`}
// //                 >
// //                   <span
// //                     className={`w-1.5 h-1.5 rounded-full ${viewData.is_status ? "bg-green-500" : "bg-gray-400"}`}
// //                   />
// //                   {viewData.is_status ? "Active" : "Inactive"}
// //                 </span>
// //               }
// //             />
// //             <ViewRow 
// //               label="Created By" 
// //               value={getCreatedByName(viewData)} 
// //             />
// //             <ViewRow 
// //               label="Updated By" 
// //               value={getUpdatedByName(viewData)} 
// //             />
// //             <ViewRow
// //               label="Created At"
// //               value={formatDate(viewData.created_at)}
// //             />
// //             <ViewRow
// //               label="Updated At"
// //               value={formatDate(viewData.updated_at)}
// //             />
// //           </div>
// //         )}
// //       </ViewModal>

// //       <ConfirmDialog
// //         isOpen={!!deleteId}
// //         onClose={() => setDeleteId(null)}
// //         onConfirm={handleDelete}
// //         loading={deleteLoading}
// //         title="Delete Plan Feature"
// //         message="Delete this subscription plan feature? This action cannot be undone."
// //       />
// //     </div>
// //   );
// // };

// // export default SubscriptionPlanFeatures;


// import React, { useState, useEffect, useMemo } from "react";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdChevronLeft,
//   MdChevronRight,
//   MdUpload,
//   MdClose,
//   MdAdd as MdAddIcon,
//   MdDelete as MdDeleteIcon,
//   MdPerson,
//   MdUpdate,
// } from "react-icons/md";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import ViewModal, { ViewRow } from "../../components/common/ViewModal";
// import FormModal from "../../components/common/FormModal";
// import { subscriptionPlanFeatureService } from "../../services/subscriptionPlanFeature.service";
// import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
// import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
// import { showSuccess, showError, showInfo } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// // Robust boolean coercion
// const toBool = (val, fallback = true) => {
//   if (val === undefined || val === null || val === "") return fallback;
//   if (val === true || val === 1 || val === "1" || val === "true") return true;
//   if (val === false || val === 0 || val === "0" || val === "false") return false;
//   return Boolean(val);
// };

// // BulkUploadModal Component - Dynamic Inputs Based on Feature Type
// const BulkUploadModal = ({ isOpen, onClose, onSuccess, plans, features }) => {
//   const [selectedPlanId, setSelectedPlanId] = useState("");
//   const [selectedFeatures, setSelectedFeatures] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // Reset state when modal opens/closes
//   useEffect(() => {
//     if (isOpen) {
//       setSelectedPlanId("");
//       setSelectedFeatures([]);
//       setValidationErrors({});
//     }
//   }, [isOpen]);

//   // Auto-select ALL active features when plan is selected
//   useEffect(() => {
//     if (selectedPlanId && features.length > 0) {
//       // Filter only active features (status === true or is_status === true)
//       const activeFeatures = features.filter(f => {
//         const isActive = f.status === true || f.is_status === true || f.status === 1 || f.is_status === 1;
//         return isActive;
//       });

//       console.log("Active features from API:", activeFeatures);

//       const allFeatures = activeFeatures.map((feature, index) => ({
//         id: Date.now() + index,
//         subscription_features_id: feature.id || feature._id,
//         value: "",
//         feature_name: feature.feature_name || feature.name || "",
//         feature_key: feature.feature_key || feature.key || "",
//         feature_type: feature.feature_type || "TEXT",
//         default_unit: feature.default_unit || "",
//         default_value: feature.default_value || "",
//         is_required: feature.is_required || false,
//         _featureData: feature,
//       }));

//       setSelectedFeatures(allFeatures);
//       console.log(`✅ Auto-selected ${allFeatures.length} active features`);
//       console.log("Selected features with names:", allFeatures);
//     }
//   }, [selectedPlanId, features]);

//   // Update feature value
//   const updateFeatureValue = (index, value) => {
//     const newFeatures = [...selectedFeatures];
//     newFeatures[index].value = value;
//     setSelectedFeatures(newFeatures);
//   };

//   // Render input based on feature type
//   const renderInput = (feature, index) => {
//     const featureType = feature.feature_type?.toUpperCase() || "TEXT";
//     const value = feature.value || "";

//     switch (featureType) {
//       case "COUNT":
//       case "DAYS":
//         return (
//           <input
//             type="number"
//             min="0"
//             step="1"
//             value={value}
//             onChange={(e) => updateFeatureValue(index, e.target.value)}
//             placeholder="Enter number"
//             className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent"
//             disabled={loading}
//           />
//         );

//       case "BOOLEAN":
//         return (
//           <div className="flex items-center gap-3">
//             <label className="flex items-center gap-1.5 cursor-pointer">
//               <input
//                 type="radio"
//                 name={`boolean_${feature.id}`}
//                 value="true"
//                 checked={value === "true"}
//                 onChange={(e) => updateFeatureValue(index, e.target.value)}
//                 className="w-3.5 h-3.5 text-[#2c0eee] focus:ring-[#4529f7] border-gray-300"
//                 disabled={loading}
//               />
//               <span className="text-sm text-gray-700">Yes</span>
//             </label>
//             <label className="flex items-center gap-1.5 cursor-pointer">
//               <input
//                 type="radio"
//                 name={`boolean_${feature.id}`}
//                 value="false"
//                 checked={value === "false"}
//                 onChange={(e) => updateFeatureValue(index, e.target.value)}
//                 className="w-3.5 h-3.5 text-[#2c0eee] focus:ring-[#4529f7] border-gray-300"
//                 disabled={loading}
//               />
//               <span className="text-sm text-gray-700">No</span>
//             </label>
//             <label className="flex items-center gap-1.5 cursor-pointer">
//               <input
//                 type="radio"
//                 name={`boolean_${feature.id}`}
//                 value=""
//                 checked={value === ""}
//                 onChange={(e) => updateFeatureValue(index, e.target.value)}
//                 className="w-3.5 h-3.5 text-gray-400 focus:ring-gray-500 border-gray-300"
//                 disabled={loading}
//               />
//               <span className="text-sm text-gray-400">None</span>
//             </label>
//           </div>
//         );

//       case "TEXT":
//       default:
//         return (
//           <input
//             type="text"
//             value={value}
//             onChange={(e) => updateFeatureValue(index, e.target.value)}
//             placeholder="Enter value"
//             className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent"
//             disabled={loading}
//           />
//         );
//     }
//   };

//   // Get feature type badge color
//   const getTypeBadgeColor = (type) => {
//     const typeMap = {
//       'COUNT': 'bg-blue-100 text-[#2c0eee]',
//       'BOOLEAN': 'bg-blue-100 text-[#2c0eee]',
//       'DAYS': 'bg-green-100 text-green-700',
//       'TEXT': 'bg-gray-100 text-gray-700',
//     };
//     return typeMap[type?.toUpperCase()] || 'bg-gray-100 text-gray-700';
//   };

//   // Validate form
//   const validateForm = () => {
//     const errors = {};
//     if (!selectedPlanId) {
//       errors.plan = "Please select a subscription plan";
//     }
//     if (selectedFeatures.length === 0) {
//       errors.features = "No active features available for this plan";
//     }
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle submit
//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       showError("Please fix the validation errors");
//       return;
//     }

//     // Check if any required features are missing values
//     const missingRequired = selectedFeatures.filter(f => f.is_required && !f.value);
//     if (missingRequired.length > 0) {
//       const names = missingRequired.map(f => f.feature_name).join(', ');
//       showError(`Please enter values for required features: ${names}`);
//       return;
//     }

//     setLoading(true);
//     try {
//       const selectedPlan = plans.find(p => (p.id || p._id) === parseInt(selectedPlanId));
//       if (!selectedPlan) {
//         showError("The selected subscription plan does not exist.");
//         setLoading(false);
//         return;
//       }

//       // Prepare features data
//       const featuresData = selectedFeatures.map((f) => ({
//         subscription_features_id: parseInt(f.subscription_features_id),
//         value: f.value || null,
//         display_value: f.feature_name || null,
//         is_unlimited: false,
//         is_trending: false,
//         status: true,
//       }));

//       const submitData = {
//         subscription_plan_id: parseInt(selectedPlanId),
//         features: featuresData,
//       };

//       console.log("Bulk upload data:", JSON.stringify(submitData, null, 2));

//       const response = await subscriptionPlanFeatureService.createBulk(submitData);
//       console.log("Bulk upload response:", response);

//       const planName = selectedPlan.plan_name || selectedPlanId;
//       showSuccess(
//         `Successfully added ${selectedFeatures.length} feature(s) to "${planName}"`
//       );
//       if (onSuccess) onSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Bulk upload error:", error);
//       showError(error?.message || "Failed to add features");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   // Count features with values
//   const filledCount = selectedFeatures.filter(f => f.value).length;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">
//               Add Features to Plan
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Select a plan and enter values for active features
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             disabled={loading}
//           >
//             <MdClose size={24} className="text-gray-500" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {/* Select Plan */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Select Plan <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={selectedPlanId}
//               onChange={(e) => setSelectedPlanId(e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${validationErrors.plan
//                   ? "border-red-500 focus:ring-red-500/20"
//                   : "border-gray-200 focus:ring-[#4529f7] focus:border-transparent"
//                 }`}
//               disabled={loading}
//             >
//               <option value="">Select a plan</option>
//               {plans.map((plan) => (
//                 <option key={plan.id || plan._id} value={plan.id || plan._id}>
//                   {plan.plan_name}
//                 </option>
//               ))}
//             </select>
//             {validationErrors.plan && (
//               <p className="mt-1 text-xs text-red-500">{validationErrors.plan}</p>
//             )}
//           </div>

//           {/* Features List */}
//           {selectedFeatures.length > 0 && (
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-sm font-medium text-gray-700">
//                   Features ({selectedFeatures.length})
//                 </h3>
//                 <span className="text-xs text-gray-400">
//                   {filledCount} of {selectedFeatures.length} filled
//                 </span>
//               </div>

//               <div className="border border-gray-200 rounded-lg overflow-hidden">
//                 {/* Header */}
//                 <div className="grid grid-cols-12 gap-2 bg-gray-50 px-3 py-2 border-b border-gray-200">
//                   <div className="col-span-5 text-xs font-medium text-gray-600">Feature Name</div>
//                   <div className="col-span-3 text-xs font-medium text-gray-600">Type</div>
//                   <div className="col-span-4 text-xs font-medium text-gray-600">Value</div>
//                 </div>

//                 {/* Rows */}
//                 <div className="divide-y divide-gray-100">
//                   {selectedFeatures.map((feature, index) => (
//                     <div
//                       key={feature.id}
//                       className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-gray-50 transition-colors"
//                     >
//                       {/* Feature Name */}
//                       <div className="col-span-5">
//                         <div className="text-sm text-gray-800 truncate">
//                           {feature.feature_name || "Unnamed Feature"}
//                           {feature.is_required && (
//                             <span className="text-red-500 ml-1">*</span>
//                           )}
//                         </div>
//                         <div className="text-xs text-gray-400 truncate">
//                           {feature.feature_key || "N/A"}
//                         </div>
//                       </div>

//                       {/* Feature Type */}
//                       <div className="col-span-3">
//                         <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadgeColor(feature.feature_type)}`}>
//                           {feature.feature_type || 'TEXT'}
//                         </span>
//                         {feature.default_unit && (
//                           <span className="text-xs text-gray-400 ml-1">({feature.default_unit})</span>
//                         )}
//                       </div>

//                       {/* Value Input */}
//                       <div className="col-span-4">
//                         {renderInput(feature, index)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {selectedFeatures.length === 0 && selectedPlanId && (
//             <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
//               <p className="text-gray-400 text-sm">No active features available for this plan</p>
//             </div>
//           )}

//           {selectedFeatures.length === 0 && !selectedPlanId && (
//             <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
//               <p className="text-gray-400 text-sm">Select a plan to load features</p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
//           <Button variant="secondary" onClick={onClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             loading={loading}
//             icon={MdUpload}
//             disabled={loading || selectedFeatures.length === 0}
//           >
//             {loading ? "Adding..." : "Add Features"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SubscriptionPlanFeatures = () => {
//   const [showBulkUpload, setShowBulkUpload] = useState(false);
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
//   const [togglingId, setTogglingId] = useState(null);
//   const [plans, setPlans] = useState([]);
//   const [features, setFeatures] = useState([]);
//   const [plansLoaded, setPlansLoaded] = useState(false);
//   const [featuresLoaded, setFeaturesLoaded] = useState(false);

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // Load plans
//   const loadPlans = async () => {
//     try {
//       const response = await subscriptionPlanService.getAll({ limit: 1000 });
//       const rawData = response.data?.data || response.data?.results || response.data || [];
//       const plansData = Array.isArray(rawData) ? rawData : [];
//       setPlans(plansData);
//       setPlansLoaded(true);
//       console.log('Plans loaded:', plansData);
//     } catch (error) {
//       console.error("Error loading plans:", error);
//       setPlansLoaded(true);
//     }
//   };

//   // Load features
//   const loadFeatures = async () => {
//     try {
//       const response = await subscriptionFeatureService.getAll({ limit: 1000 });
//       const rawData = response.data?.data || response.data?.results || response.data || [];
//       const featuresData = Array.isArray(rawData) ? rawData : [];
//       setFeatures(featuresData);
//       setFeaturesLoaded(true);
//       console.log('Features loaded:', featuresData);
//     } catch (error) {
//       console.error("Error loading features:", error);
//       setFeaturesLoaded(true);
//     }
//   };

//   // Get plan name by ID
//   const getPlanName = (planId) => {
//     if (!planId) return "-";
//     const plan = plans.find(p => (p.id || p._id) === planId);
//     return plan?.plan_name || "-";
//   };

//   // Get feature name by ID
//   const getFeatureName = (featureId) => {
//     if (!featureId) return "-";
//     const feature = features.find(f => (f.id || f._id) === featureId);
//     return feature?.feature_name || "-";
//   };

//   // FIXED: Normalize subscription plan feature data - with better feature_name and plan_name extraction
//   const normalizePlanFeature = (item) => {
//     // Get plan name - check multiple sources
//     let planName = "-";
//     if (item.SubscriptionPlan) {
//       planName = item.SubscriptionPlan.plan_name || "-";
//     } else if (item.plan_name) {
//       planName = item.plan_name;
//     } else if (item.subscription_plan_id) {
//       const plan = plans.find(p => (p.id || p._id) === item.subscription_plan_id);
//       planName = plan?.plan_name || "-";
//     }

//     // Get feature name - check multiple sources
//     let featureName = "-";
//     if (item.SubscriptionFeature) {
//       featureName = item.SubscriptionFeature.feature_name || "-";
//     } else if (item.feature_name) {
//       featureName = item.feature_name;
//     } else if (item.subscription_features_id) {
//       const feature = features.find(f => (f.id || f._id) === item.subscription_features_id);
//       featureName = feature?.feature_name || "-";
//     }

//     // If still not found, try to find by subscription_features_id in loaded features
//     if (featureName === "-" && item.subscription_features_id) {
//       const foundFeature = features.find(f => (f.id || f._id) === item.subscription_features_id);
//       if (foundFeature) {
//         featureName = foundFeature.feature_name || "-";
//       }
//     }

//     return {
//       id: item.id || item._id,
//       subscription_plan_id: item.subscription_plan_id || "",
//       subscription_features_id: item.subscription_features_id || "",
//       value: item.value || "",
//       display_value: item.display_value || "",
//       is_unlimited: toBool(item.is_unlimited, false),
//       is_trending: toBool(item.is_trending, false),
//       is_status: toBool(item.status, true),
//       updated_by: item.updated_by || "",
//       updated_at: item.updated_at || item.updatedAt || null,
//       created_at: item.created_at || item.createdAt || null,
//       created_by: item.created_by || "",
//       plan_name: planName,
//       feature_name: featureName,
//     };
//   };

//   // Load subscription plan features
//   const load = async () => {
//     setLoading(true);
//     try {
//       // Fetch and cache users
//       const users = await fetchUsers();
//       const userMap = {};
//       Object.keys(users).forEach(id => {
//         userMap[id] = users[id].name;
//       });
//       setUserNameCache(userMap);

//       // Load dropdown data first
//       await Promise.all([loadPlans(), loadFeatures()]);

//       // Fetch subscription plan features
//       const r = await subscriptionPlanFeatureService.getAll({ limit: 1000 });
//       console.log('Plan features response:', r);

//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       console.log('Raw plan features:', JSON.stringify(rawData, null, 2));

//       const planFeatures = Array.isArray(rawData) ? rawData.map(normalizePlanFeature) : [];

//       console.log('Normalized plan features:', JSON.stringify(planFeatures, null, 2));

//       // Sort by created_at descending (newest first)
//       const sortedPlanFeatures = planFeatures.sort((a, b) => {
//         return new Date(b.created_at) - new Date(a.created_at);
//       });

//       setData(sortedPlanFeatures);
//     } catch (error) {
//       console.error("Load error:", error);
//       showError(error.message || "Failed to load subscription plan features");
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

//   const filteredData = useMemo(() => {
//     let result = data;
//     if (statusFilter !== "all") {
//       const isActive = statusFilter === "active";
//       result = result.filter((item) => item.is_status === isActive);
//     }
//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter((item) =>
//         String(item.plan_name ?? "")
//           .toLowerCase()
//           .includes(query) ||
//         String(item.feature_name ?? "")
//           .toLowerCase()
//           .includes(query) ||
//         String(item.display_value ?? "")
//           .toLowerCase()
//           .includes(query)
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((r) => r.is_status === true).length;
//   const inactiveCount = data.length - activeCount;

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

//   // Form fields configuration - removed unit and value_type
//   const getFormFields = (editData = null) => {
//     const planOptions = plans.map(plan => ({
//       value: plan.id || plan._id,
//       label: plan.plan_name || "-"
//     }));

//     const featureOptions = features.map(feature => ({
//       value: feature.id || feature._id,
//       label: feature.feature_name || "-"
//     }));

//     return [
//       {
//         name: "subscription_plan_id",
//         label: "Subscription Plan",
//         type: "select",
//         required: true,
//         options: planOptions,
//         placeholder: "Select a plan",
//         help: "Select the subscription plan",
//       },
//       {
//         name: "subscription_features_id",
//         label: "Feature",
//         type: "select",
//         required: true,
//         options: featureOptions,
//         placeholder: "Select a feature",
//         help: "Select the feature to assign",
//       },
//       {
//         name: "value",
//         label: "Value",
//         type: "text",
//         required: false,
//         placeholder: "e.g. 10, Unlimited, 5GB",
//         help: "Enter the feature value",
//       },
//       {
//         name: "display_value",
//         label: "Display Value",
//         type: "text",
//         required: false,
//         placeholder: "e.g. 10 Users, 5GB Storage",
//         help: "Enter the display value shown to users",
//       },
//       {
//         name: "is_unlimited",
//         label: "Unlimited",
//         type: "checkbox",
//         color: "text-green-500 focus:ring-green-500",
//         help: "Check if this feature is unlimited",
//       },
//       {
//         name: "is_trending",
//         label: "Mark as Trending",
//         type: "checkbox",
//         color: "text-yellow-500 focus:ring-yellow-500",
//         help: "Trending features will be highlighted",
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
//     ];
//   };

//   // Validation rules - removed unit and value_type
//   const validationRules = {
//     subscription_plan_id: {
//       required: true,
//       requiredMessage: "Please select a subscription plan",
//     },
//     subscription_features_id: {
//       required: true,
//       requiredMessage: "Please select a feature",
//     },
//     value: {
//       required: false,
//       maxLength: 100,
//       maxLengthMessage: "Value must be at most 100 characters",
//     },
//     display_value: {
//       required: false,
//       maxLength: 100,
//       maxLengthMessage: "Display value must be at most 100 characters",
//     },
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
//       const submitData = {
//         subscription_plan_id: parseInt(formData.subscription_plan_id),
//         subscription_features_id: parseInt(formData.subscription_features_id),
//         value: formData.value?.trim() || "",
//         display_value: formData.display_value?.trim() || "",
//         is_unlimited: formData.is_unlimited || false,
//         is_trending: formData.is_trending || false,
//         status: formData.status === "active",
//       };

//       if (editItem) {
//         await subscriptionPlanFeatureService.update(editItem.id, submitData);
//         showSuccess("Subscription plan feature updated successfully");
//       } else {
//         await subscriptionPlanFeatureService.create(submitData);
//         showSuccess("Subscription plan feature created successfully");
//       }
//       setModalOpen(false);
//       load();
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(
//         error.message || error?.response?.data?.message || "Failed to save",
//       );
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await subscriptionPlanFeatureService.delete(deleteId);
//       showSuccess("Subscription plan feature deleted successfully");
//       load();
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError(
//           "Cannot delete this feature because it is being used in other records.",
//         );
//       } else {
//         showError(message || "Failed to delete feature");
//       }
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   const handleStatusToggle = async (row) => {
//     if (togglingId === row.id) return;
//     const currentStatus = row.is_status === true;
//     const newStatus = !currentStatus;

//     setTogglingId(row.id);
//     setData((prev) =>
//       prev.map((item) => (item.id === row.id ? { ...item, is_status: newStatus } : item)),
//     );

//     try {
//       const updateData = {
//         subscription_plan_id: row.subscription_plan_id,
//         subscription_features_id: row.subscription_features_id,
//         value: row.value || "",
//         display_value: row.display_value || "",
//         is_unlimited: row.is_unlimited || false,
//         is_trending: row.is_trending || false,
//         status: newStatus,
//       };

//       const res = await subscriptionPlanFeatureService.update(row.id, updateData);

//       const updatedRaw = res?.data?.data || res?.data || res;
//       if (updatedRaw && typeof updatedRaw === "object" && !Array.isArray(updatedRaw)) {
//         let confirmed = newStatus;
//         if (updatedRaw.status !== undefined) {
//           confirmed = toBool(updatedRaw.status, newStatus);
//         }
//         setData((prev) =>
//           prev.map((item) => (item.id === row.id ? { ...item, is_status: confirmed } : item)),
//         );
//       }

//       showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
//     } catch (error) {
//       console.error("Status toggle error:", error);
//       setData((prev) =>
//         prev.map((item) => (item.id === row.id ? { ...item, is_status: currentStatus } : item)),
//       );
//       showError(error.response?.data?.message || error.message || "Failed to update status");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const handleTrendingToggle = async (row) => {
//     if (togglingId === `trend-${row.id}`) return;
//     const currentTrending = row.is_trending === true;
//     const newValue = !currentTrending;

//     setTogglingId(`trend-${row.id}`);
//     setData((prev) =>
//       prev.map((item) => (item.id === row.id ? { ...item, is_trending: newValue } : item)),
//     );

//     try {
//       const updateData = {
//         subscription_plan_id: row.subscription_plan_id,
//         subscription_features_id: row.subscription_features_id,
//         value: row.value || "",
//         display_value: row.display_value || "",
//         is_unlimited: row.is_unlimited || false,
//         is_trending: newValue,
//         status: row.is_status === true,
//       };

//       const res = await subscriptionPlanFeatureService.update(row.id, updateData);

//       const updatedRaw = res?.data?.data || res?.data || res;
//       if (updatedRaw && typeof updatedRaw === "object" && !Array.isArray(updatedRaw)) {
//         let confirmed = newValue;
//         if (updatedRaw.is_trending !== undefined) {
//           confirmed = toBool(updatedRaw.is_trending, newValue);
//         }
//         setData((prev) =>
//           prev.map((item) => (item.id === row.id ? { ...item, is_trending: confirmed } : item)),
//         );
//       }

//       showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
//     } catch (error) {
//       console.error("Trending toggle error:", error);
//       setData((prev) =>
//         prev.map((item) => (item.id === row.id ? { ...item, is_trending: currentTrending } : item)),
//       );
//       showError(error.response?.data?.message || error.message || "Failed to update trending");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const columns = [
//     {
//       header: "#",
//       key: "id",
//       render: (_, __, i) => (page - 1) * limit + i + 1,
//     },
//     {
//       header: "Plan Name",
//       key: "plan_name",
//       render: (v) => (
//         <span className="font-medium text-gray-800">{v || "-"}</span>
//       ),
//     },
//     // {
//     //   header: "Feature Name",
//     //   key: "feature_name",
//     //   render: (v) => (
//     //     <span className="font-medium text-gray-800">{v || "-"}</span>
//     //   ),
//     // },
//     {
//       header: "Feature Name",
//       key: "display_value",
//       render: (v, row) => {
//         if (row.is_unlimited) {
//           return <span className="text-green-600 font-medium">Unlimited</span>;
//         }
//         return <span className="text-gray-800">{v || row.value || "-"}</span>;
//       },
//     },
//     {
//       header: "Trending",
//       key: "is_trending",
//       render: (value, row) => (
//         <button
//           onClick={() => handleTrendingToggle(row)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${row.is_trending === true ? "bg-yellow-500" : "bg-gray-300"}`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${row.is_trending === true ? "translate-x-6" : "translate-x-1"}`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Status",
//       key: "is_status",
//       render: (value, row) => {
//         const isActive = row.is_status === true;
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

//     // Updated By Column
//     {
//       header: "Updated By",
//       key: "updated_by",
//       render: (_, row) => (
//         <div className="flex items-center gap-1.5">
//           <span className="text-gray-600 text-sm font-medium">
//             {row.updated_by ? getUpdatedByName(row) : getCreatedByName(row)}
//           </span>
//         </div>
//       ),
//     },
//     {
//       header: "Updated At",
//       key: "updated_at",
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

//   const totalPages = Math.ceil(filteredData.length / limit);

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Subscription Plan Features</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage features assigned to subscription plans
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button icon={MdAdd} onClick={openAdd}>
//             Add Feature to Plan
//           </Button>
//           <Button
//             variant="secondary"
//             icon={MdUpload}
//             onClick={() => setShowBulkUpload(true)}
//           >
//             Bulk Upload
//           </Button>
//         </div>
//       </div>

//       {/* Bulk Upload Modal */}
//       <BulkUploadModal
//         isOpen={showBulkUpload}
//         onClose={() => setShowBulkUpload(false)}
//         onSuccess={load}
//         plans={plans}
//         features={features}
//       />

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
//               placeholder="Search by plan or feature..."
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
//           emptyMessage="No subscription plan features found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of{" "}
//             {filteredData.length} features
//           </p>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-400">Rows:</span>
//               <select
//                 value={limit}
//                 onChange={(e) => {
//                   setLimit(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
//               >
//                 {[5, 10, 15, 20, 25, 50, 100].map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setPage(page - 1)}
//                 disabled={page === 1}
//                 className={`p-1 rounded-lg transition-colors ${page === 1
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "hover:bg-gray-100 text-gray-500"
//                   }`}
//               >
//                 <MdChevronLeft size={18} />
//               </button>
//               <span className="text-sm text-gray-600 px-2">
//                 Page {page} of {totalPages || 1}
//               </span>
//               <button
//                 onClick={() => setPage(page + 1)}
//                 disabled={page === totalPages || totalPages === 0}
//                 className={`p-1 rounded-lg transition-colors ${page === totalPages || totalPages === 0
//                   ? "text-gray-300 cursor-not-allowed"
//                   : "hover:bg-gray-100 text-gray-500"
//                   }`}
//               >
//                 <MdChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Form Modal */}
//       <FormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         title={editItem ? "Edit Plan Feature" : "Add Feature to Plan"}
//         fields={getFormFields(editItem)}
//         initialData={
//           editItem
//             ? {
//               subscription_plan_id: editItem.subscription_plan_id || "",
//               subscription_features_id: editItem.subscription_features_id || "",
//               value: editItem.value || "",
//               display_value: editItem.display_value || "",
//               is_unlimited: editItem.is_unlimited || false,
//               is_trending: editItem.is_trending || false,
//               status: editItem.is_status ? "active" : "inactive",
//             }
//             : {
//               subscription_plan_id: "",
//               subscription_features_id: "",
//               value: "",
//               display_value: "",
//               is_unlimited: false,
//               is_trending: false,
//               status: "active",
//             }
//         }
//         validationRules={validationRules}
//         loading={formLoading}
//         submitLabel={editItem ? "Update" : "Create"}
//         size="lg"
//       />

//       {/* View Modal */}
//       <ViewModal
//         isOpen={viewModalOpen}
//         onClose={() => {
//           setViewModalOpen(false);
//           setViewData(null);
//         }}
//         title="Plan Feature Details"
//       >
//         {viewData && (
//           <div className="space-y-1">
//             <ViewRow label="Plan Name" value={viewData.plan_name || "-"} />
//             <ViewRow label="Feature Name" value={viewData.feature_name || "-"} />
//             <ViewRow label="Value" value={viewData.value || "-"} />
//             <ViewRow label="Display Value" value={viewData.display_value || "-"} />
//             <ViewRow
//               label="Unlimited"
//               value={viewData.is_unlimited ? "Yes" : "No"}
//             />
//             <ViewRow
//               label="Trending"
//               value={
//                 <span
//                   className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_trending
//                     ? "bg-yellow-50 text-yellow-700"
//                     : "bg-gray-100 text-gray-500"
//                     }`}
//                 >
//                   <span
//                     className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`}
//                   />
//                   {viewData.is_trending ? "Trending" : "Not Trending"}
//                 </span>
//               }
//             />
//             <ViewRow
//               label="Status"
//               value={
//                 <span
//                   className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_status
//                     ? "bg-green-50 text-green-700"
//                     : "bg-gray-100 text-gray-500"
//                     }`}
//                 >
//                   <span
//                     className={`w-1.5 h-1.5 rounded-full ${viewData.is_status ? "bg-green-500" : "bg-gray-400"}`}
//                   />
//                   {viewData.is_status ? "Active" : "Inactive"}
//                 </span>
//               }
//             />
//             <ViewRow
//               label="Created By"
//               value={
//                 <div className="flex items-center gap-1.5">
//                   <MdPerson size={14} className="text-gray-400" />
//                   {getCreatedByName(viewData)}
//                 </div>
//               }
//             />
//             <ViewRow
//               label="Updated By"
//               value={
//                 <div className="flex items-center gap-1.5">
//                   <MdUpdate size={14} className="text-gray-400" />
//                   {viewData.updated_by ? getUpdatedByName(viewData) : getCreatedByName(viewData)}
//                 </div>
//               }
//             />
//             <ViewRow
//               label="Created At"
//               value={formatDate(viewData.created_at)}
//             />
//             <ViewRow
//               label="Updated At"
//               value={formatDate(viewData.updated_at)}
//             />
//           </div>
//         )}
//       </ViewModal>

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Plan Feature"
//         message="Delete this subscription plan feature? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default SubscriptionPlanFeatures;


// pages/SubscriptionPlanFeatures.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
  MdUpload,
  MdPerson,
  MdUpdate,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ViewModal, { ViewRow } from "../../components/common/ViewModal";
import { subscriptionPlanFeatureService } from "../../services/subscriptionPlanFeature.service";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

// Robust boolean coercion
const toBool = (val, fallback = true) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false") return false;
  return Boolean(val);
};

const SubscriptionPlanFeatures = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});
  const [togglingId, setTogglingId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Load plans
  const loadPlans = async () => {
    try {
      const response = await subscriptionPlanService.getAll({ limit: 1000 });
      const rawData = response.data?.data || response.data?.results || response.data || [];
      const plansData = Array.isArray(rawData) ? rawData : [];
      setPlans(plansData);
    } catch (error) {
      console.error("Error loading plans:", error);
    }
  };

  // Load features
  const loadFeatures = async () => {
    try {
      const response = await subscriptionFeatureService.getAll({ limit: 1000 });
      const rawData = response.data?.data || response.data?.results || response.data || [];
      const featuresData = Array.isArray(rawData) ? rawData : [];
      setFeatures(featuresData);
    } catch (error) {
      console.error("Error loading features:", error);
    }
  };

  // Normalize subscription plan feature data
  const normalizePlanFeature = (item) => {
    // let planName = "-";
    // if (item.SubscriptionPlan) {
    //   planName = item.SubscriptionPlan.plan_name || "-";
    // } else if (item.plan_name) {
    //   planName = item.plan_name;
    // } else if (item.subscription_plan_id) {
    //   const plan = plans.find(p => (p.id || p._id) === item.subscription_plan_id);
    //   planName = plan?.plan_name || "-";
    // }

    // let featureName = "-";
    // if (item.SubscriptionFeature) {
    //   featureName = item.SubscriptionFeature.feature_name || "-";
    // } else if (item.feature_name) {
    //   featureName = item.feature_name;
    // } else if (item.subscription_features_id) {
    //   const feature = features.find(f => (f.id || f._id) === item.subscription_features_id);
    //   featureName = feature?.feature_name || "-";
    // }

    let planName = "-";

    if (item.SubscriptionPlan?.plan_name) {
      planName = item.SubscriptionPlan.plan_name;
    } else if (item.plan_name) {
      planName = item.plan_name;
    } else if (item.subscription_plan_id) {
      const plan = plans.find(
        (p) => (p.id || p._id) === item.subscription_plan_id
      );

      planName = plan?.plan_name || "-";
    }

    // Feature name
    let featureName = "-";

    // Get feature name from:
    // SubscriptionPlan -> PlanFeatures -> SubscriptionFeature
    const planFeature = item.SubscriptionPlan?.PlanFeatures?.find(
      (feature) =>
        (feature.subscription_features_id || feature.SubscriptionFeature?.id) ===
        item.subscription_features_id
    );

    if (planFeature?.SubscriptionFeature?.feature_name) {
      featureName = planFeature.SubscriptionFeature.feature_name;
    } else if (item.feature_name) {
      featureName = item.feature_name;
    } else if (item.subscription_features_id) {
      const feature = features.find(
        (f) => (f.id || f._id) === item.subscription_features_id
      );

      featureName = feature?.feature_name || "-";
    }

    return {
      id: item.id || item._id,
      subscription_plan_id: item.subscription_plan_id || "",
      subscription_features_id: item.subscription_features_id || "",
      value: item.value || "",
      display_value: item.display_value || "",
      is_unlimited: toBool(item.is_unlimited, false),
      is_trending: toBool(item.is_trending, false),
      is_status: toBool(item.status, true),
      updated_by: item.updated_by || "",
      updated_at: item.updated_at || item.updatedAt || null,
      created_at: item.created_at || item.createdAt || null,
      created_by: item.created_by || "",
      plan_name: planName,
      feature_name: featureName,
    };
  };

  // Load subscription plan features
  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      await Promise.all([loadPlans(), loadFeatures()]);

      const r = await subscriptionPlanFeatureService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const planFeatures = Array.isArray(rawData) ? rawData.map(normalizePlanFeature) : [];

      const sortedPlanFeatures = planFeatures.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setData(sortedPlanFeatures);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load subscription plan features");
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

  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((item) => item.is_status === isActive);
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        String(item.plan_name ?? "").toLowerCase().includes(query) ||
        String(item.feature_name ?? "").toLowerCase().includes(query) ||
        String(item.display_value ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.is_status === true).length;
  const inactiveCount = data.length - activeCount;

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

  const openView = (item) => {
    setViewData(item);
    setViewModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionPlanFeatureService.delete(deleteId);
      showSuccess("Subscription plan feature deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError("Cannot delete this feature because it is being used in other records.");
      } else {
        showError(message || "Failed to delete feature");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.is_status === true;
    const newStatus = !currentStatus;

    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, is_status: newStatus } : item)),
    );

    try {
      const updateData = {
        subscription_plan_id: row.subscription_plan_id,
        subscription_features_id: row.subscription_features_id,
        value: row.value || "",
        display_value: row.display_value || "",
        is_unlimited: row.is_unlimited || false,
        is_trending: row.is_trending || false,
        status: newStatus,
      };

      await subscriptionPlanFeatureService.update(row.id, updateData);
      showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Status toggle error:", error);
      setData((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, is_status: currentStatus } : item)),
      );
      showError(error.response?.data?.message || error.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleTrendingToggle = async (row) => {
    if (togglingId === `trend-${row.id}`) return;
    const currentTrending = row.is_trending === true;
    const newValue = !currentTrending;

    setTogglingId(`trend-${row.id}`);
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, is_trending: newValue } : item)),
    );

    try {
      const updateData = {
        subscription_plan_id: row.subscription_plan_id,
        subscription_features_id: row.subscription_features_id,
        value: row.value || "",
        display_value: row.display_value || "",
        is_unlimited: row.is_unlimited || false,
        is_trending: newValue,
        status: row.is_status === true,
      };

      await subscriptionPlanFeatureService.update(row.id, updateData);
      showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
    } catch (error) {
      console.error("Trending toggle error:", error);
      setData((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, is_trending: currentTrending } : item)),
      );
      showError(error.response?.data?.message || error.message || "Failed to update trending");
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Plan Name",
      key: "plan_name",
      render: (v) => (
        <span className="font-medium text-gray-800">{v || "-"}</span>
      ),
    },
    {
      header: "Feature Name",
      key: "feature_name",
      render: (v) => (
        <span className="font-medium text-gray-800">{v || "-"}</span>
      ),
    },
    {
      header: "Display Value",
      key: "display_value",
      render: (v, row) => {
        if (row.is_unlimited) {
          return <span className="text-green-600 font-medium">♾️ Unlimited</span>;
        }
        return <span className="text-gray-800">{v || row.value || "-"}</span>;
      },
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (value, row) => (
        <button
          onClick={() => handleTrendingToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${row.is_trending === true ? "bg-yellow-500" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${row.is_trending === true ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      ),
    },
    {
      header: "Status",
      key: "is_status",
      render: (value, row) => {
        const isActive = row.is_status === true;
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
          <span className="text-gray-600 text-sm font-medium">
            {row.updated_by ? getUpdatedByName(row) : getCreatedByName(row)}
          </span>
        </div>
      ),
    },
    // {
    //   header: "Updated At",
    //   key: "updated_at",
    //   // type: "text",
    //   // disabled: true,
    //   render: (value) => value ? formatDate(value) : "—"
    // },
      {
        header: "Updated At",
        key: "updated_at",
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
            onClick={() => navigate(`/subscription-plan-features/view/${row.id}`, { state: { item: row } })}
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => navigate(`/subscription-plan-features/edit/${row.id}`, { state: { item: row } })}
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

  const totalPages = Math.ceil(filteredData.length / limit);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plan Features</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage features assigned to subscription plans
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={MdUpload}
            onClick={() => navigate('/subscription-plan-features/bulk-add')}
          >
            Bulk Upload
          </Button>
          <Button icon={MdAdd} onClick={() => navigate('/subscription-plan-features/add')}>
            Add Feature
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
              placeholder="Search by plan or feature..."
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
          emptyMessage="No subscription plan features found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} features
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
              >
                {[5, 10, 15, 20, 25, 50, 100].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`p-1 rounded-lg transition-colors ${page === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-500"
                  }`}
              >
                <MdChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600 px-2">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                className={`p-1 rounded-lg transition-colors ${page === totalPages || totalPages === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-500"
                  }`}
              >
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewData(null);
        }}
        title="Plan Feature Details"
      >
        {viewData && (
          <div className="space-y-1">
            <ViewRow label="Plan Name" value={viewData.plan_name || "-"} />
            <ViewRow label="Feature Name" value={viewData.feature_name || "-"} />
            <ViewRow label="Value" value={viewData.value || "-"} />
            <ViewRow label="Display Value" value={viewData.display_value || "-"} />
            <ViewRow
              label="Unlimited"
              value={viewData.is_unlimited ? "Yes" : "No"}
            />
            <ViewRow
              label="Trending"
              value={
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_trending
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-gray-100 text-gray-500"
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${viewData.is_trending ? "bg-yellow-500" : "bg-gray-400"}`}
                  />
                  {viewData.is_trending ? "Trending" : "Not Trending"}
                </span>
              }
            />
            <ViewRow
              label="Status"
              value={
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewData.is_status
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${viewData.is_status ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  {viewData.is_status ? "Active" : "Inactive"}
                </span>
              }
            />
            <ViewRow
              label="Created By"
              value={
                <div className="flex items-center gap-1.5">
                  <MdPerson size={14} className="text-gray-400" />
                  {getCreatedByName(viewData)}
                </div>
              }
            />
            <ViewRow
              label="Updated By"
              value={
                <div className="flex items-center gap-1.5">
                  <MdUpdate size={14} className="text-gray-400" />
                  {viewData.updated_by ? getUpdatedByName(viewData) : getCreatedByName(viewData)}
                </div>
              }
            />
            <ViewRow
              label="Created At"
              value={formatDate(viewData.created_at)}
            />
            <ViewRow
              label="Updated At"
              value={formatDate(viewData.updated_at)}
            />
          </div>
        )}
      </ViewModal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Plan Feature"
        message="Delete this subscription plan feature? This action cannot be undone."
      />
    </div>
  );
};

export default SubscriptionPlanFeatures;