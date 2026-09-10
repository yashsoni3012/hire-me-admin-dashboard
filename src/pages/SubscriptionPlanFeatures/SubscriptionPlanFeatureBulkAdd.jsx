// pages/subscriptions/SubscriptionPlanFeatureBulkAdd.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdArrowBack,
    MdSave,
    MdRefresh,
    MdCheckCircle,
    MdCancel,
    MdRemoveCircle,
} from 'react-icons/md';
import Button from '../../components/common/Button';
import { subscriptionPlanFeatureService } from '../../services/subscriptionPlanFeature.service';
import { subscriptionPlanService } from '../../services/subscriptionPlan.service';
import { subscriptionFeatureService } from '../../services/subscriptionFeature.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

const SubscriptionPlanFeatureBulkAdd = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [features, setFeatures] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [userNameCache, setUserNameCache] = useState({});

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

    // Fetch plans and features
    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
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
                console.error("Failed to fetch data:", error);
                showError("Failed to load required data");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    // Auto-select ALL active features when plan is selected
    useEffect(() => {
        if (selectedPlanId && features.length > 0) {
            const activeFeatures = features.filter(f => {
                const isActive = f.status === true || f.is_status === true || f.status === 1 || f.is_status === 1;
                return isActive;
            });

            const allFeatures = activeFeatures.map((feature, index) => ({
                id: Date.now() + index,
                subscription_features_id: feature.id || feature._id,
                value: "",
                feature_name: feature.feature_name || feature.name || "",
                feature_key: feature.feature_key || feature.key || "",
                feature_type: feature.feature_type || "TEXT",
                default_unit: feature.default_unit || "",
                default_value: feature.default_value || "",
                is_required: feature.is_required || false,
                _featureData: feature,
            }));

            setSelectedFeatures(allFeatures);
        } else {
            setSelectedFeatures([]);
        }
    }, [selectedPlanId, features]);

    // Get feature type badge color
    const getTypeBadgeColor = (type) => {
        const typeMap = {
            'COUNT': 'bg-blue-100 text-[#2c0eee]',
            'BOOLEAN': 'bg-blue-100 text-blue-700',
            'DAYS': 'bg-green-100 text-green-700',
            'TEXT': 'bg-gray-100 text-gray-700',
        };
        return typeMap[type?.toUpperCase()] || 'bg-gray-100 text-gray-700';
    };

    // Render input based on feature type
    const renderInput = (feature, index) => {
        const featureType = feature.feature_type?.toUpperCase() || "TEXT";
        const value = feature.value || "";

        switch (featureType) {
            case "COUNT":
            case "DAYS":
                return (
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={value}
                        onChange={(e) => updateFeatureValue(index, e.target.value)}
                        placeholder="Enter number"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent transition-colors"
                        disabled={saving}
                    />
                );

            case "BOOLEAN":
                return (
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`boolean_${feature.id}`}
                                value="true"
                                checked={value === "true"}
                                onChange={(e) => updateFeatureValue(index, e.target.value)}
                                className="w-4 h-4 text-[#2c0eee] focus:ring-[#4529f7] border-gray-300"
                                disabled={saving}
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`boolean_${feature.id}`}
                                value="false"
                                checked={value === "false"}
                                onChange={(e) => updateFeatureValue(index, e.target.value)}
                                className="w-4 h-4 text-[#2c0eee] focus:ring-[#4529f7] border-gray-300"
                                disabled={saving}
                            />
                            <span className="text-sm text-gray-700">No</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`boolean_${feature.id}`}
                                value=""
                                checked={value === ""}
                                onChange={(e) => updateFeatureValue(index, e.target.value)}
                                className="w-4 h-4 text-gray-400 focus:ring-gray-500 border-gray-300"
                                disabled={saving}
                            />
                            <span className="text-sm text-gray-400">None</span>
                        </label>
                    </div>
                );

            case "TEXT":
            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => updateFeatureValue(index, e.target.value)}
                        placeholder="Enter value"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent transition-colors"
                        disabled={saving}
                    />
                );
        }
    };

    // Update feature value
    const updateFeatureValue = (index, value) => {
        const newFeatures = [...selectedFeatures];
        newFeatures[index].value = value;
        setSelectedFeatures(newFeatures);
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!selectedPlanId) {
            errors.plan = "Please select a subscription plan";
        }
        if (selectedFeatures.length === 0) {
            errors.features = "No active features available for this plan";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle submit
    const handleSubmit = async () => {
        if (!validateForm()) {
            showError("Please fix the validation errors");
            return;
        }

        // Check if any required features are missing values
        const missingRequired = selectedFeatures.filter(f => f.is_required && !f.value);
        if (missingRequired.length > 0) {
            const names = missingRequired.map(f => f.feature_name).join(', ');
            showError(`Please enter values for required features: ${names}`);
            return;
        }

        setSaving(true);
        try {
            const selectedPlan = plans.find(p => (p.id || p._id) === parseInt(selectedPlanId));
            if (!selectedPlan) {
                showError("The selected subscription plan does not exist.");
                setSaving(false);
                return;
            }

            // Prepare features data
            const featuresData = selectedFeatures.map((f) => ({
                subscription_features_id: parseInt(f.subscription_features_id),
                value: f.value || null,
                display_value: f.feature_name || null,
                is_unlimited: false,
                is_trending: false,
                status: true,
            }));

            const submitData = {
                subscription_plan_id: parseInt(selectedPlanId),
                features: featuresData,
            };

            console.log("Bulk upload data:", JSON.stringify(submitData, null, 2));

            const response = await subscriptionPlanFeatureService.createBulk(submitData);
            console.log("Bulk upload response:", response);

            const planName = selectedPlan.plan_name || selectedPlanId;
            showSuccess(`Successfully added ${selectedFeatures.length} feature(s) to "${planName}"`);

            // Navigate back to the list
            navigate('/subscription-plan-features');
        } catch (error) {
            console.error("Bulk upload error:", error);
            showError(error?.message || "Failed to add features");
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/subscription-plan-features');
    };

    // Count features with values
    const filledCount = selectedFeatures.filter(f => f.value).length;

    // Get plan name
    const getPlanName = (planId) => {
        const plan = plans.find(p => (p.id || p._id) === parseInt(planId));
        return plan?.plan_name || "";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                                title="Go back"
                            >
                                <MdArrowBack size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Bulk Add Features to Plan
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Add multiple features to a subscription plan at once
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="secondary"
                                icon={MdRefresh}
                                onClick={() => {
                                    setSelectedFeatures([]);
                                    setSelectedPlanId("");
                                }}
                                disabled={loadingData || saving}
                            >
                                Reset
                            </Button>
                            <Button
                                icon={MdSave}
                                onClick={handleSubmit}
                                loading={saving}
                                disabled={saving || selectedFeatures.length === 0 || !selectedPlanId}
                            >
                                {saving ? "Adding..." : "Add Features"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:grid-cols-3 gap-6">
                    {/* Left Side - Plan Selection */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
                            <h2 className="text-sm font-semibold text-gray-700 mb-4">Select Plan</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subscription Plan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedPlanId}
                                        onChange={(e) => setSelectedPlanId(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${validationErrors.plan
                                                ? "border-red-500 focus:ring-red-500/20"
                                                : "border-gray-200 focus:ring-[#4529f7] focus:border-transparent"
                                            }`}
                                        disabled={loadingData || saving}
                                    >
                                        <option value="">Select a plan</option>
                                        {plans.map((plan) => (
                                            <option key={plan.id || plan._id} value={plan.id || plan._id}>
                                                {plan.plan_name} (${parseFloat(plan.price || 0).toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.plan && (
                                        <p className="mt-1 text-xs text-red-500">{validationErrors.plan}</p>
                                    )}
                                </div>

                                {selectedPlanId && (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Selected Plan:</span> {getPlanName(selectedPlanId)}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium">Total Features:</span> {selectedFeatures.length}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Filled:</span> {filledCount}
                                        </p>
                                    </div>
                                )}

                                {selectedFeatures.length === 0 && selectedPlanId && (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <MdRemoveCircle className="mx-auto text-gray-400" size={32} />
                                        <p className="text-gray-400 text-sm mt-2">No active features available</p>
                                    </div>
                                )}

                                {!selectedPlanId && (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-gray-400 text-sm">Select a plan to load features</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Features List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {selectedFeatures.length > 0 ? (
                                <>
                                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700">
                                                Features ({selectedFeatures.length})
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                {filledCount} of {selectedFeatures.length} filled
                                                {filledCount === selectedFeatures.length && (
                                                    <span className="ml-2 text-green-600">✓ All filled</span>
                                                )}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            Required fields marked with <span className="text-red-500">*</span>
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">#</th>
                                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Feature</th>
                                                    {/* <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th> */}
                                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {selectedFeatures.map((feature, index) => (
                                                    <tr key={feature.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 text-gray-500 text-center">{index + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <div>
                                                                <span className="text-gray-800">
                                                                    {feature.feature_name || "Unnamed Feature"}
                                                                    {/* {feature.is_required && (
                                                                        <span className="text-red-500 ml-1">*</span>
                                                                    )} */}
                                                                </span>
                                                                {/* <div className="text-xs text-gray-400 mt-0.5">
                                                                    {feature.feature_key || "N/A"}
                                                                </div> */}
                                                            </div>
                                                        </td>
                                                        {/* <td className="px-4 py-3">
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadgeColor(feature.feature_type)}`}>
                                                                {feature.feature_type || 'TEXT'}
                                                            </span>
                                                            {feature.default_unit && (
                                                                <span className="text-xs text-gray-400 ml-1">({feature.default_unit})</span>
                                                            )}
                                                        </td> */}
                                                        <td className="px-4 py-3 min-w-[200px]">
                                                            {renderInput(feature, index)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>Total: {selectedFeatures.length} features</span>
                                            <span className="w-px h-4 bg-gray-300" />
                                            <span className="text-green-600">{filledCount} filled</span>
                                            {filledCount !== selectedFeatures.length && (
                                                <>
                                                    <span className="w-px h-4 bg-gray-300" />
                                                    <span className="text-red-500">{selectedFeatures.length - filledCount} pending</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="secondary"
                                                onClick={handleBack}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSubmit}
                                                loading={saving}
                                                icon={MdSave}
                                                disabled={saving || selectedFeatures.length === 0 || !selectedPlanId}
                                            >
                                                {saving ? "Adding..." : "Add Features"}
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : selectedPlanId ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <MdRemoveCircle className="text-gray-400" size={36} />
                                    </div>
                                    <p className="text-lg font-medium text-gray-700">No Features Available</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        This plan doesn't have any active features to assign.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <MdRemoveCircle className="text-gray-400" size={36} />
                                    </div>
                                    <p className="text-lg font-medium text-gray-700">Select a Plan</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Please select a subscription plan from the left panel.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlanFeatureBulkAdd;