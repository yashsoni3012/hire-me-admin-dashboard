import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdSave, MdClose } from "react-icons/md";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const VALUE_TYPE_OPTIONS = [
    { value: "string", label: "String" },
    { value: "text", label: "Text" },
    { value: "integer", label: "Integer" },
    { value: "boolean", label: "Boolean" },
    { value: "json", label: "JSON" },
    { value: "file", label: "File" },
    { value: "date", label: "Date" },
    { value: "datetime", label: "DateTime" },
];

const getFullFileUrl = (value) => {
    if (!value || typeof value !== "string") return null;
    if (value.startsWith("http") || value.startsWith("data:")) return value;
    if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
    if (value.startsWith("/")) return `${API_BASE_URL}${value}`;
    return value;
};

const isImagePath = (value) => {
    if (!value || typeof value !== "string") return false;
    return (
        /\.(jpg|jpeg|png|gif|svg|webp|avif)$/i.test(value) ||
        value.startsWith("data:image")
    );
};

/**
 * ProjectSettingFormPage
 * Same visual shell (header / card / footer) as the shared FormPage,
 * but owns the dynamic setting_value logic itself since it's specific
 * to this one entity (value_type drives what setting_value looks like).
 *
 * Props:
 *  - mode: 'add' | 'edit' | 'view'
 *  - initialData: object to prefill the form (edit/view mode). In view mode,
 *    shape should match edit mode's normalized shape (is_public: bool,
 *    status: 'active'|'inactive', setting_value: string, etc).
 *  - onSubmit(submitData, { selectedFile }): called with the fully built payload
 *  - loading: bool, disables buttons / shows spinner
 *  - title, breadcrumb, navigateTo, submitLabel: same as FormPage
 *  - onEdit: fn called when the Edit button is clicked (view mode only)
 *  - showEdit: bool, whether to show the Edit button in view mode
 *  - editLabel, cancelLabel: labels for the view-mode footer buttons
 *  - extraViewFields: array of { label, value, render? } shown after the
 *    core fields in view mode — use this for audit info (created/updated by/at)
 *    since name-lookup / date-formatting is specific to the parent page.
 */
const ProjectSettingFormPage = ({
    mode = "add",
    initialData = null,
    onSubmit,
    loading = false,
    title = "Project Setting",
    breadcrumb = null,
    navigateTo = "/project-settings",
    submitLabel = "Create",
    onEdit = null,
    showEdit = true,
    editLabel = "Edit Setting",
    cancelLabel = "Cancel",
    extraViewFields = [],
}) => {
    const navigate = useNavigate();
    const isViewMode = mode === "view";

    const emptyData = {
        setting_group: "",
        setting_key: "",
        setting_value: "",
        value_type: "string",
        description: "",
        is_public: false,
        display_order: 0,
        status: "active",
    };

    const [formData, setFormData] = useState(emptyData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [existingFileUrl, setExistingFileUrl] = useState(null);

    // ─── Sync form with initialData whenever it changes (edit mode load) ───00
    useEffect(() => {
        if (initialData) {
            setFormData({ ...emptyData, ...initialData });
            if (initialData.value_type === "file" && initialData.setting_value) {
                setExistingFileUrl(getFullFileUrl(initialData.setting_value));
            } else {
                setExistingFileUrl(null);
            }
        } else {
            setFormData(emptyData);
            setExistingFileUrl(null);
        }
        setSelectedFile(null);
        setFilePreview(null);
        setErrors({});
        setTouched({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    // ─── Generic field change ────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    // ─── Value Type change: reset setting_value + any file state ──────
    const handleValueTypeChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({
            ...prev,
            value_type: value,
            setting_value: "",
        }));
        setSelectedFile(null);
        setFilePreview(null);
        setExistingFileUrl(null);
        setErrors({});
    };

    // ─── File selection ─────────────────────────────────────────────────
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/svg+xml",
            "image/avif",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!validTypes.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                setting_value:
                    "Invalid file type. Allowed: JPG, PNG, GIF, WEBP, SVG, AVIF, PDF, DOC, DOCX",
            }));
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                setting_value: "File size must be less than 5MB",
            }));
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
        setExistingFileUrl(null);
        setFormData((prev) => ({ ...prev, setting_value: file.name }));

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }

        if (errors.setting_value)
            setErrors((prev) => ({ ...prev, setting_value: "" }));
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setExistingFileUrl(null);
        setFormData((prev) => ({ ...prev, setting_value: "" }));
        const fileInput = document.getElementById("setting-file");
        if (fileInput) fileInput.value = "";
    };

    // ─── Validation ─────────────────────────────────────────────────────
    const validateField = (name, value) => {
        switch (name) {
            case "setting_group":
                if (!value?.trim()) return "Setting group is required";
                if (!/^[a-z_]+$/.test(value.trim()))
                    return "Setting group must contain only lowercase letters and underscores";
                return "";

            case "setting_key":
                if (!value?.trim()) return "Setting key is required";
                if (!/^[a-z_]+$/.test(value.trim()))
                    return "Setting key must contain only lowercase letters and underscores";
                return "";

            case "setting_value":
                if (formData.value_type === "file") {
                    if (!selectedFile && !existingFileUrl) return "Please select a file";
                    return "";
                }
                if (!value && value !== 0) return "Setting value is required";
                if (typeof value === "string" && !value.trim())
                    return "Setting value is required";

                if (formData.value_type === "integer" && isNaN(Number(value))) {
                    return "Please enter a valid integer";
                }
                if (formData.value_type === "boolean") {
                    if (!["true", "false", "1", "0"].includes(String(value))) {
                        return "Please enter true or false";
                    }
                }
                if (formData.value_type === "json") {
                    try {
                        JSON.parse(value);
                    } catch (e) {
                        return "Please enter valid JSON";
                    }
                }
                if (formData.value_type === "date" && isNaN(Date.parse(value))) {
                    return "Please enter a valid date";
                }
                return "";

            case "display_order":
                if (value !== "" && Number(value) < 0)
                    return "Display order cannot be negative";
                return "";

            default:
                return "";
        }
    };

    const handleBlur = (name) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        ["setting_group", "setting_key", "setting_value"].forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        if (formData.display_order !== "" && Number(formData.display_order) < 0) {
            newErrors.display_order = "Display order cannot be negative";
            isValid = false;
        }

        setErrors(newErrors);
        setTouched({ setting_group: true, setting_key: true, setting_value: true });
        return isValid;
    };

    const getFieldError = (name) =>
        errors[name] && touched[name] ? errors[name] : "";

    // ─── Submit: build the type-specific payload, then hand off ─────
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const firstErrorField = document.querySelector(".field-error");
            if (firstErrorField)
                firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const base = {
            setting_group: formData.setting_group.trim().toLowerCase(),
            setting_key: formData.setting_key.trim().toLowerCase(),
            value_type: formData.value_type,
            description: (formData.description || "").trim(),
            is_public: formData.is_public ? 1 : 0,
            display_order: parseInt(formData.display_order, 10) || 0,
            status: formData.status === "active" ? 1 : 0,
        };

        let submitData;

        if (
            ["string", "text", "json", "date", "datetime"].includes(
                formData.value_type,
            )
        ) {
            submitData = { ...base, setting_value: formData.setting_value };
        } else if (formData.value_type === "integer") {
            submitData = {
                ...base,
                setting_value: parseInt(formData.setting_value, 10) || 0,
            };
        } else if (formData.value_type === "boolean") {
            const boolValue =
                formData.setting_value === "true" ||
                formData.setting_value === "1" ||
                formData.setting_value === true;
            submitData = { ...base, setting_value: boolValue ? 1 : 0 };
        } else if (formData.value_type === "file") {
            submitData = {
                ...base,
                // Keep existing path if no new file chosen (edit mode, unchanged file)
                setting_value: selectedFile ? undefined : formData.setting_value || "",
            };
        } else {
            submitData = { ...base, setting_value: formData.setting_value };
        }

        onSubmit(submitData, { selectedFile });
    };

    const handleCancel = () => navigate(navigateTo);
    const handleBack = () => navigate(navigateTo);

    const inputClasses = (name) =>
        `w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none transition-colors ${getFieldError(name)
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50"
            : "border-gray-200 bg-white hover:border-gray-300 focus:ring-2 focus:ring-[#4529f7] focus:border-transparent"
        }`;

    // ─── VIEW MODE ────────────────────────────────────────────────────
    // Read-only display, same visual language as FormPage's view mode
    // (uppercase small label, value below). Renders from `initialData`
    // directly rather than `formData`/validation, since nothing is editable.

    if (isViewMode) {
        const d = initialData || {};
        const valueType = d.value_type || "string";

        const ViewRow = ({ label, children }) => (
            <div className="mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    {label}
                </label>
                <div className="text-sm text-gray-800 py-1.5 break-all">
                    {children || "—"}
                </div>
            </div>
        );

        const renderSettingValue = () => {
            const value = d.setting_value;

            if (valueType === "file" && value) {
                const fullUrl = getFullFileUrl(value);
                return (
                    <div className="flex items-center gap-3">
                        {isImagePath(value) ? (
                            <img
                                src={fullUrl}
                                alt="File preview"
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-[#2c0eee] border border-gray-200">
                                <span className="text-2xl">📄</span>
                            </div>
                        )}
                        <div>
                            <a
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2c0eee] hover:underline text-sm"
                            >
                                📎 {String(value).split("/").pop()}
                            </a>
                            <p className="text-xs text-gray-400 mt-1 break-all">{value}</p>
                        </div>
                    </div>
                );
            }

            if (valueType === "boolean") {
                const isTrue =
                    value === true || value === "true" || value === 1 || value === "1";
                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isTrue
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${isTrue ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        {isTrue ? "True" : "False"}
                    </span>
                );
            }

            if (valueType === "json" && value) {
                let pretty = value;
                try {
                    pretty = JSON.stringify(JSON.parse(value), null, 2);
                } catch (e) {
                    // leave as-is if not valid JSON
                }
                return (
                    <pre className="text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                        {pretty}
                    </pre>
                );
            }

            return <span className="text-gray-700">{value || "—"}</span>;
        };

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header Bar */}
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
                                        {title}
                                    </h1>
                                    {breadcrumb && (
                                        <p className="text-sm text-gray-500">{breadcrumb}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-[#2c0eee] rounded-full">
                                    View Mode
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Content */}
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <ViewRow label="Setting Key">
                                <span className="font-mono text-sm text-gray-800">
                                    {d.setting_key}
                                </span>
                            </ViewRow>

                            <ViewRow label="Setting Group">
                                <span className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                    {d.setting_group}
                                </span>
                            </ViewRow>

                            <ViewRow label="Value Type">
                                <span className="uppercase text-gray-600">{valueType}</span>
                            </ViewRow>

                            <ViewRow label="Setting Value">{renderSettingValue()}</ViewRow>

                            <ViewRow label="Description">{d.description}</ViewRow>

                            <ViewRow label="Is Public">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${d.is_public
                                            ? "bg-green-50 text-green-700"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${d.is_public ? "bg-green-500" : "bg-gray-400"}`}
                                    />
                                    {d.is_public ? "Public" : "Private"}
                                </span>
                            </ViewRow>

                            {/* <ViewRow label="Display Order">{d.display_order ?? 0}</ViewRow> */}

                            <ViewRow label="Status">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${d.status === "active"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${d.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                                    />
                                    {d.status === "active" ? "Active" : "Inactive"}
                                </span>
                            </ViewRow>

                            {extraViewFields.map((f, i) => (
                                <ViewRow key={i} label={f.label}>
                                    {f.render ? f.render(f.value) : f.value}
                                </ViewRow>
                            ))}
                        </div>

                        {/* View Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between">
                            <div className="text-xs text-gray-400">
                                Viewing record details
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {cancelLabel}
                                </button>
                                {showEdit && (
                                    <button
                                        type="button"
                                        onClick={onEdit}
                                        className="px-5 py-2.5 bg-[#2c0eee] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors flex items-center gap-2"
                                    >
                                        <MdSave size={16} />
                                        {editLabel}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Bar */}
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
                                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                                {breadcrumb && (
                                    <p className="text-sm text-gray-500">{breadcrumb}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${mode === "edit"
                                        ? "bg-blue-100 text-[#2c0eee]"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {mode === "edit" ? "Editing" : "New Record"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">
                            {/* Setting Group */}
                            <div className="field-error">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                    Setting Group
                                </label>
                                <input
                                    type="text"
                                    name="setting_group"
                                    value={formData.setting_group}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("setting_group")}
                                    placeholder="e.g. general, smtp, email"
                                    className={inputClasses("setting_group")}
                                />
                                {getFieldError("setting_group") ? (
                                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <span className="text-red-500">●</span>{" "}
                                        {getFieldError("setting_group")}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-400">
                                        Use lowercase letters and underscores.
                                    </p>
                                )}
                            </div>

                            {/* Setting Key */}
                            <div className="field-error">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                    Setting Key
                                </label>
                                <input
                                    type="text"
                                    name="setting_key"
                                    value={formData.setting_key}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("setting_key")}
                                    placeholder="e.g. site_logo, smtp_host"
                                    className={inputClasses("setting_key")}
                                />
                                {getFieldError("setting_key") ? (
                                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <span className="text-red-500">●</span>{" "}
                                        {getFieldError("setting_key")}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-400">
                                        Unique identifier for this setting.
                                    </p>
                                )}
                            </div>

                            {/* Value Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                    Value Type
                                </label>
                                <select
                                    name="value_type"
                                    value={formData.value_type}
                                    onChange={handleValueTypeChange}
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent hover:border-gray-300 transition-colors"
                                >
                                    {VALUE_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-400">
                                    Select the data type of the setting value.
                                </p>
                            </div>

                            {/* ─── DYNAMIC VALUE FIELD ─── */}

                            {["string", "text"].includes(formData.value_type) && (
                                <div className="field-error">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                        Setting Value
                                    </label>
                                    {formData.value_type === "text" ? (
                                        <textarea
                                            name="setting_value"
                                            value={formData.setting_value}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur("setting_value")}
                                            rows={4}
                                            placeholder="Enter text value"
                                            className={`${inputClasses("setting_value")} resize-none`}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="setting_value"
                                            value={formData.setting_value}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur("setting_value")}
                                            placeholder="Enter string value"
                                            className={inputClasses("setting_value")}
                                        />
                                    )}
                                    {getFieldError("setting_value") ? (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="text-red-500">●</span>{" "}
                                            {getFieldError("setting_value")}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Enter the {formData.value_type} value.
                                        </p>
                                    )}
                                </div>
                            )}

                            {formData.value_type === "integer" && (
                                <div className="field-error">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                        Setting Value
                                    </label>
                                    <input
                                        type="number"
                                        name="setting_value"
                                        value={formData.setting_value}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("setting_value")}
                                        placeholder="e.g. 100"
                                        step="1"
                                        className={inputClasses("setting_value")}
                                    />
                                    {getFieldError("setting_value") ? (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="text-red-500">●</span>{" "}
                                            {getFieldError("setting_value")}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Enter an integer value.
                                        </p>
                                    )}
                                </div>
                            )}

                            {formData.value_type === "boolean" && (
                                <div className="field-error">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                        Setting Value
                                    </label>
                                    <select
                                        name="setting_value"
                                        value={formData.setting_value}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("setting_value")}
                                        className={inputClasses("setting_value")}
                                    >
                                        <option value="">Select boolean value</option>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                        <option value="1">1 (True)</option>
                                        <option value="0">0 (False)</option>
                                    </select>
                                    {getFieldError("setting_value") ? (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="text-red-500">●</span>{" "}
                                            {getFieldError("setting_value")}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Select true or false.
                                        </p>
                                    )}
                                </div>
                            )}

                            {formData.value_type === "json" && (
                                <div className="field-error">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                        Setting Value
                                    </label>
                                    <textarea
                                        name="setting_value"
                                        value={formData.setting_value}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("setting_value")}
                                        rows={4}
                                        placeholder='{"key": "value"}'
                                        className={`${inputClasses("setting_value")} resize-none font-mono`}
                                    />
                                    {getFieldError("setting_value") ? (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="text-red-500">●</span>{" "}
                                            {getFieldError("setting_value")}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Enter valid JSON.
                                        </p>
                                    )}
                                </div>
                            )}

                            {formData.value_type === "date" && (
                                <div className="field-error">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                        Setting Value
                                    </label>
                                    <input
                                        type="date"
                                        name="setting_value"
                                        value={formData.setting_value}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("setting_value")}
                                        className={inputClasses("setting_value")}
                                    />
                                    {getFieldError("setting_value") ? (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="text-red-500">●</span>{" "}
                                            {getFieldError("setting_value")}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-400">Select a date.</p>
                                    )}
                                </div>
                            )}

                            {formData.value_type === "datetime" && (
                                <div className="field-error">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                        Setting Value
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="setting_value"
                                        value={formData.setting_value}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("setting_value")}
                                        className={inputClasses("setting_value")}
                                    />
                                    {getFieldError("setting_value") ? (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="text-red-500">●</span>{" "}
                                            {getFieldError("setting_value")}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Select a date and time.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* FILE — text path input + Choose File button, side by side */}
                            {formData.value_type === "file" && (
                                <div className="field-error">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                        Setting Value
                                    </label>

                                    {/* Existing file preview (edit mode, no new file chosen yet) */}
                                    {existingFileUrl && !selectedFile && (
                                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-[#4529f7]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {isImagePath(existingFileUrl) ? (
                                                        <img
                                                            src={existingFileUrl}
                                                            alt="Current file"
                                                            className="w-14 h-14 rounded-lg object-cover border border-[#4529f7]"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center text-[#2c0eee] border border-[#4529f7]">
                                                            <span className="text-2xl">📄</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Current file
                                                    </p>
                                                    <p className="text-xs text-gray-500 break-all">
                                                        {formData.setting_value}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFile}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Remove file"
                                                >
                                                    <MdClose size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* New file preview */}
                                    {selectedFile && filePreview && (
                                        <div className="mb-3 relative inline-block">
                                            <img
                                                src={filePreview}
                                                alt="Selected file preview"
                                                className="w-20 h-20 object-cover rounded-lg border-2 border-green-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Text input (editable path) + Choose File button */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.setting_value}
                                            onChange={(e) => {
                                                setSelectedFile(null);
                                                setFilePreview(null);
                                                setExistingFileUrl(null);
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    setting_value: e.target.value,
                                                }));
                                                if (errors.setting_value)
                                                    setErrors((prev) => ({ ...prev, setting_value: "" }));
                                            }}
                                            onBlur={() => handleBlur("setting_value")}
                                            placeholder="/uploads/settings/logo.png"
                                            className={`flex-1 font-mono ${inputClasses("setting_value")}`}
                                        />
                                        <input
                                            id="setting-file"
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="setting-file"
                                            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium whitespace-nowrap"
                                        >
                                            📎 Choose File
                                        </label>
                                    </div>

                                    {selectedFile && (
                                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                                            <span>
                                                Selected:{" "}
                                                <span className="text-[#2c0eee] font-medium">
                                                    {selectedFile.name}
                                                </span>{" "}
                                                ({(selectedFile.size / 1024).toFixed(1)} KB)
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    {getFieldError("setting_value") ? (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="text-red-500">●</span>{" "}
                                            {getFieldError("setting_value")}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Pick a file to auto-fill the path, or type/edit it
                                            directly. Max 5MB.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe what this setting does..."
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent hover:border-gray-300 transition-colors resize-none"
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    Optional description for the setting.
                                </p>
                            </div>

                            {/* Is Public */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_public"
                                        checked={formData.is_public}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7]"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Is Public
                                    </span>
                                </label>
                                <p className="text-xs text-gray-400 mt-1 ml-7">
                                    Check if this setting should be exposed to the frontend.
                                </p>
                            </div>

                            {/* Display Order */}
                            <div className="field-error">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="display_order"
                                    min="0"
                                    step="1"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("display_order")}
                                    className={inputClasses("display_order")}
                                />
                                {getFieldError("display_order") ? (
                                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <span className="text-red-500">●</span>{" "}
                                        {getFieldError("display_order")}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-400">
                                        Order in which the setting should be displayed.
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="active"
                                            checked={formData.status === "active"}
                                            onChange={handleChange}
                                            className="text-[#2c0eee] border-gray-300 focus:ring-[#4529f7]"
                                        />
                                        <span className="text-sm text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="inactive"
                                            checked={formData.status === "inactive"}
                                            onChange={handleChange}
                                            className="text-[#2c0eee] border-gray-300 focus:ring-[#4529f7]"
                                        />
                                        <span className="text-sm text-gray-700">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between">
                            <div className="text-xs text-gray-400">
                                All fields are required unless marked optional
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-[#2c0eee] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={16} />
                                            {mode === "edit" ? "Update" : submitLabel}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectSettingFormPage;
