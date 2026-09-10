// src/pages/SubscriptionPlans/AddSubscriptionPlan.jsx
import React, { useState, useEffect, useRef } from "react";
import { MdClose, MdUpload, MdImage } from "react-icons/md";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import { showSuccess, showError } from "../../utils/toast";

const AddSubscriptionPlan = ({ isOpen, onClose, onSuccess, editData }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        plan_name: "",
        plan_code: "",
        description: "",
        plan_type: "fixed",
        duration_days: 30,
        price: "",
        gst_percentage: 18,
        display_order: 1,
        badge: "",
        is_popular: false,
        is_display_in_front: true,
        is_free_trial: false,
        trial_days: 7,
        button_text: "Get Started",
        button_color: "#FFFFFF",
        background_color: "#2563EB",
        is_status: true,
    });

    // Read-only fields from API response
    const [apiData, setApiData] = useState({
        subscription_plan_offer_id: null,
        offer_type: "",
        offer_value: 0,
        discount_amount: 0,
        discounted_price: 0,
        gst_amount: 0,
        final_price: 0,
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({
        plan_name: false,
        plan_code: false,
        price: false,
    });
    const formRef = useRef();

    const isEdit = !!editData;

    // Populate form data when editing
    useEffect(() => {
        if (editData) {
            const statusValue =
                editData.is_status !== undefined
                    ? editData.is_status
                    : editData.status !== undefined
                        ? editData.status
                        : true;

            setFormData({
                plan_name: editData.plan_name || "",
                plan_code: editData.plan_code || "",
                description: editData.description || "",
                plan_type: editData.plan_type || "fixed",
                duration_days: editData.duration_days || 30,
                price: editData.price || "",
                gst_percentage: editData.gst_percentage || 18,
                display_order: editData.display_order || 1,
                badge: editData.badge || "",
                is_popular: editData.is_popular || false,
                is_display_in_front: editData.is_display_in_front !== undefined && editData.is_display_in_front !== null ? editData.is_display_in_front : true,
                is_free_trial: editData.is_free_trial || false,
                trial_days: editData.trial_days || 7,
                button_text: editData.button_text || "Get Started",
                button_color: editData.button_color || "#FFFFFF",
                background_color: editData.background_color || "#2563EB",
                is_status: statusValue === true || statusValue === 1 || statusValue === "active",
            });

            // Set API response data (read-only fields)
            setApiData({
                subscription_plan_offer_id: editData.subscription_plan_offer_id || null,
                offer_type: editData.offer_type || "",
                offer_value: editData.offer_value || 0,
                discount_amount: editData.discount_amount || 0,
                discounted_price: editData.discounted_price || 0,
                gst_amount: editData.gst_amount || 0,
                final_price: editData.final_price || 0,
            });

            // Set image preview if icon exists
            if (editData.icon && editData.icon !== null && editData.icon !== 'null') {
                const iconUrl = editData.icon.startsWith('http')
                    ? editData.icon
                    : `https://apidata.hiremejobs.in${editData.icon}`;
                setImagePreview(iconUrl);
            }
        } else {
            setFormData({
                plan_name: "",
                plan_code: "",
                description: "",
                plan_type: "fixed",
                duration_days: 30,
                price: "",
                gst_percentage: 18,
                display_order: 1,
                badge: "",
                is_popular: false,
                is_display_in_front: true,
                is_free_trial: false,
                trial_days: 7,
                button_text: "Get Started",
                button_color: "#FFFFFF",
                background_color: "#2563EB",
                is_status: true,
            });
            // Reset API data for new plan
            setApiData({
                subscription_plan_offer_id: null,
                offer_type: "",
                offer_value: 0,
                discount_amount: 0,
                discounted_price: 0,
                gst_amount: 0,
                final_price: 0,
            });
            setImagePreview(null);
            setImageFile(null);
        }
        setErrors({});
        setTouched({ plan_name: false, plan_code: false, price: false });
    }, [editData, isOpen]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setTouched((prev) => ({ ...prev, [name]: true }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Handle file upload - Preview only
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
            if (!validTypes.includes(file.type)) {
                showError('Please upload a valid image file (JPEG, PNG, GIF, WEBP, AVIF)');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showError('Image size must be less than 5MB');
                return;
            }

            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            if (errors.icon) {
                setErrors((prev) => ({ ...prev, icon: "" }));
            }
        }
    };

    // Remove uploaded image
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handle field blur for validation
    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.plan_name.trim()) {
            newErrors.plan_name = "Plan name is required";
        } else if (formData.plan_name.length < 2) {
            newErrors.plan_name = "Name must be at least 2 characters";
        } else if (formData.plan_name.length > 50) {
            newErrors.plan_name = "Name must be less than 50 characters";
        }

        if (!formData.plan_code.trim()) {
            newErrors.plan_code = "Plan code is required";
        } else if (formData.plan_code.length < 2) {
            newErrors.plan_code = "Code must be at least 2 characters";
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        if (formData.duration_days && parseInt(formData.duration_days) < 1) {
            newErrors.duration_days = "Duration must be at least 1 day";
        }

        setErrors(newErrors);
        setTouched({
            plan_name: true,
            plan_code: true,
            price: true
        });
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const submitData = {
                plan_name: formData.plan_name.trim(),
                plan_code: formData.plan_code.trim(),
                description: formData.description ? formData.description.trim() : "",
                plan_type: formData.plan_type || "fixed",
                duration_days: parseInt(formData.duration_days) || 30,
                price: parseFloat(formData.price) || 0,
                gst_percentage: parseFloat(formData.gst_percentage) || 18,
                display_order: parseInt(formData.display_order) || 1,
                badge: formData.badge || "",
                is_popular: formData.is_popular === true,
                is_display_in_front: formData.is_display_in_front === true,
                is_free_trial: formData.is_free_trial === true,
                trial_days: formData.is_free_trial ? (parseInt(formData.trial_days) || 7) : 0,
                button_text: formData.button_text || "Get Started",
                button_color: formData.button_color || "#FFFFFF",
                background_color: formData.background_color || "#2563EB",
                is_status: formData.is_status === true,
            };

            console.log('Submitting data:', submitData);

            if (isEdit) {
                const id = editData.id || editData._id;
                if (!id) {
                    throw new Error("No ID found for update");
                }
                await subscriptionPlanService.update(id, submitData);
                showSuccess("Subscription plan updated successfully");
            } else {
                await subscriptionPlanService.create(submitData);
                showSuccess("Subscription plan created successfully");
            }

            onSuccess();
        } catch (error) {
            console.error("Submit error:", error);
            const errorMessage = error.message || `Failed to ${isEdit ? "update" : "create"} subscription plan`;
            showError(errorMessage);

            // Show more detailed error if available
            if (error.errors) {
                console.error('Validation errors:', error.errors);
                setErrors(error.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const showFieldError = (fieldName) => {
        return errors[fieldName] && touched[fieldName];
    };

    // Status checkbox change
    const handleStatusCheckboxChange = (statusValue) => {
        setFormData((prev) => ({
            ...prev,
            is_status: statusValue === "active",
        }));
    };

    // Format currency helper
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '-';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Subscription Plan" : "Add New Subscription Plan"}
            size="lg"
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <form ref={formRef} onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="Plan Name *"
                                    name="plan_name"
                                    value={formData.plan_name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("plan_name")}
                                    placeholder="e.g., Standard, Premium"
                                    required
                                    error={showFieldError("plan_name") ? errors.plan_name : ""}
                                    disabled={loading}
                                    maxLength={50}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Input
                                    label="Plan Code *"
                                    name="plan_code"
                                    value={formData.plan_code}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("plan_code")}
                                    placeholder="e.g., STANDARD, PREMIUM"
                                    required
                                    error={showFieldError("plan_code") ? errors.plan_code : ""}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Input
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the plan benefits"
                                disabled={loading}
                                textarea
                                rows={3}
                            />
                        </div>

                        {/* Pricing & Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Input
                                    label="Price *"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("price")}
                                    placeholder="499"
                                    required
                                    error={showFieldError("price") ? errors.price : ""}
                                    disabled={loading}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div>
                                <Input
                                    label="Duration (Days)"
                                    name="duration_days"
                                    type="number"
                                    value={formData.duration_days}
                                    onChange={handleChange}
                                    placeholder="30"
                                    disabled={loading}
                                    min="1"
                                />
                            </div>
                            <div>
                                <Input
                                    label="GST Percentage"
                                    name="gst_percentage"
                                    type="number"
                                    value={formData.gst_percentage}
                                    onChange={handleChange}
                                    placeholder="18"
                                    disabled={loading}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Plan Type & Display Order */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Plan Type
                                </label>
                                <select
                                    name="plan_type"
                                    value={formData.plan_type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent bg-white"
                                    disabled={loading}
                                >
                                    <option value="fixed">Fixed</option>
                                    <option value="recurring">Recurring</option>
                                    <option value="one-time">One Time</option>
                                </select>
                            </div>
                            <div>
                                <Input
                                    label="Display Order"
                                    name="display_order"
                                    type="number"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    placeholder="1"
                                    disabled={loading}
                                    min="1"
                                />
                            </div>
                        </div>

                        {/* Badge & Button Text */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="Badge"
                                    name="badge"
                                    value={formData.badge}
                                    onChange={handleChange}
                                    placeholder="e.g., Most Popular, Best Value"
                                    disabled={loading}
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    Displayed as a label on the plan card
                                </p>
                            </div>
                            <div>
                                <Input
                                    label="Button Text"
                                    name="button_text"
                                    value={formData.button_text}
                                    onChange={handleChange}
                                    placeholder="Get Started"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Button Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="button_color"
                                        value={formData.button_color}
                                        onChange={handleChange}
                                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                                        disabled={loading}
                                    />
                                    <Input
                                        name="button_color"
                                        value={formData.button_color}
                                        onChange={handleChange}
                                        placeholder="#FFFFFF"
                                        disabled={loading}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Background Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="background_color"
                                        value={formData.background_color}
                                        onChange={handleChange}
                                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                                        disabled={loading}
                                    />
                                    <Input
                                        name="background_color"
                                        value={formData.background_color}
                                        onChange={handleChange}
                                        placeholder="#2563EB"
                                        disabled={loading}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Trial Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_free_trial"
                                        checked={formData.is_free_trial}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
                                        disabled={loading}
                                    />
                                    <span>Free Trial Available</span>
                                </label>
                            </div>
                            {formData.is_free_trial && (
                                <div>
                                    <Input
                                        label="Trial Days"
                                        name="trial_days"
                                        type="number"
                                        value={formData.trial_days}
                                        onChange={handleChange}
                                        placeholder="7"
                                        disabled={loading}
                                        min="1"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Popular & Display Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_popular"
                                    checked={formData.is_popular}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
                                    disabled={loading}
                                />
                                <span>Mark as Popular</span>
                            </label>
                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_display_in_front"
                                    checked={formData.is_display_in_front}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
                                    disabled={loading}
                                />
                                <span>Display on Frontend</span>
                            </label>
                        </div>

                        {/* Offer Information - Read-only (Only shown when editing) */}
                        {isEdit && (
                            <div className="border-t border-gray-200 pt-4 mt-2">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    Offer & Pricing Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {apiData.subscription_plan_offer_id && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Offer ID</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                #{apiData.subscription_plan_offer_id}
                                            </p>
                                        </div>
                                    )}
                                    {apiData.offer_type && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Offer Type</p>
                                            <p className="text-sm font-medium text-gray-800 capitalize">
                                                {apiData.offer_type}
                                            </p>
                                        </div>
                                    )}
                                    {apiData.offer_value > 0 && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Offer Value</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {formatCurrency(apiData.offer_value)}
                                            </p>
                                        </div>
                                    )}
                                    {apiData.discount_amount > 0 && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Discount Amount</p>
                                            <p className="text-sm font-medium text-green-600">
                                                -{formatCurrency(apiData.discount_amount)}
                                            </p>
                                        </div>
                                    )}
                                    {apiData.discounted_price > 0 && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">Discounted Price</p>
                                            <p className="text-sm font-medium text-blue-600">
                                                {formatCurrency(apiData.discounted_price)}
                                            </p>
                                        </div>
                                    )}
                                    {apiData.gst_amount > 0 && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500">GST Amount</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {formatCurrency(apiData.gst_amount)}
                                            </p>
                                        </div>
                                    )}
                                    {apiData.final_price > 0 && (
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <p className="text-xs text-blue-600">Final Price</p>
                                            <p className="text-sm font-bold text-blue-700">
                                                {formatCurrency(apiData.final_price)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-gray-400">
                                    ⚠️ These fields are read-only and calculated based on the plan's pricing and offers.
                                </p>
                            </div>
                        )}

                        {/* Image Upload - Preview Only */}
                        <div className="border-t border-gray-100 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan Icon / Image (Preview Only)
                            </label>
                            <div className="flex items-start gap-4">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Plan icon preview"
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Remove image"
                                        >
                                            <MdClose size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <MdImage size={24} className="text-gray-400" />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="icon-upload"
                                            disabled={loading}
                                        />
                                        <label
                                            htmlFor="icon-upload"
                                            className="px-4 py-2 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <MdUpload size={18} />
                                            Choose Image
                                        </label>
                                        <span className="text-xs text-gray-400">
                                            JPEG, PNG, GIF, WEBP, AVIF (Max 5MB)
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-amber-500">
                                        ⚠️ Image preview only. Images are not uploaded to the server.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="pt-2 border-t border-gray-100 ">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Status
                            </label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="status_active"
                                        checked={formData.is_status === true}
                                        onChange={() => handleStatusCheckboxChange("active")}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                        disabled={loading}
                                    />
                                    <span className="text-green-600 font-medium">Active</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="status_inactive"
                                        checked={formData.is_status === false}
                                        onChange={() => handleStatusCheckboxChange("inactive")}
                                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                                        disabled={loading}
                                    />
                                    <span className="text-red-600 font-medium">Inactive</span>
                                </label>
                            </div>
                            <p className="mt-1.5 text-sm text-gray-400">
                                Select one option to set the plan status
                            </p>
                        </div>

                        {/* Error Summary */}
                        {Object.keys(errors).length > 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 font-medium">
                                    Please fix the following errors:
                                </p>
                                <ul className="mt-1 text-xs text-red-500 list-disc list-inside">
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 border-t border-gray-100 mt-4">
                            <Button type="submit" loading={loading} variant="primary">
                                {loading ? "Saving..." : isEdit ? "Update Plan" : "Create Plan"}
                            </Button>
                            <Button variant="secondary" type="button" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddSubscriptionPlan;