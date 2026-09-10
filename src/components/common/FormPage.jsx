// components/common/FormPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdSave, MdEdit, MdDelete, MdClose } from "react-icons/md";
import Button from "./Button";
import { showSuccess, showError } from "../../utils/toast";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const FormPage = ({
  // Navigation
  navigateTo = "/", // Where to go back

  // Form configuration
  title = "Form",
  mode = "add", // 'add' | 'edit' | 'view'
  fields = [],
  initialData = {},
  validationRules = {},

  // CRUD operations
  onSubmit,
  onDelete,
  onView = null,
  onEdit = null,

  // Loading states
  loading = false,
  deleteLoading = false,
  viewLoading = false,

  // Labels
  submitLabel = "Save",
  editLabel = "Edit",
  deleteLabel = "Delete",
  cancelLabel = "Cancel",

  // Additional options
  showDelete = true,
  showEdit = true,
  enableEditMode = true,
  className = "",

  // Breadcrumb
  breadcrumb = null,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [isViewMode, setIsViewMode] = useState(mode === "view");
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  // const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const formRef = useRef(null);

  // Initialize form with data
  useEffect(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setFileUploads({});

    // Initialize image previews for existing images
    const previews = {};
    fields.forEach((field) => {
      if (field.type === "file" && initialData[field.name]) {
        previews[field.name] = getFullImageUrl(initialData[field.name]);
      }
    });
    setImagePreviews(previews);

    setIsViewMode(mode === "view");
    setIsEditMode(mode === "edit");
  }, [initialData, fields, mode]);

  // Helper to get full image URL
  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http") || value.startsWith("data:image")) {
      return value;
    }
    if (value.startsWith("/uploads/")) {
      return `${API_BASE_URL}${value}`;
    }
    return value;
  };

  // Validation functions
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    if (
      rules.required &&
      (!value || (typeof value === "string" && !value.trim()))
    ) {
      return rules.requiredMessage || `${name} is required`;
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return (
        rules.minLengthMessage ||
        `${name} must be at least ${rules.minLength} characters`
      );
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      return (
        rules.maxLengthMessage ||
        `${name} must be at most ${rules.maxLength} characters`
      );
    }

    if (
      rules.min &&
      value !== undefined &&
      value !== null &&
      value < rules.min
    ) {
      return rules.minMessage || `${name} must be at least ${rules.min}`;
    }

    if (
      rules.max &&
      value !== undefined &&
      value !== null &&
      value > rules.max
    ) {
      return rules.maxMessage || `${name} must be at most ${rules.max}`;
    }

    if (
      rules.email &&
      value &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ) {
      return rules.emailMessage || "Please enter a valid email address";
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.patternMessage || `${name} is invalid`;
    }

    if (rules.custom && value) {
      const customError = rules.custom(value, formData);
      if (customError) return customError;
    }

    return "";
  };

  const handleChange = (name, value) => {
    if (isViewMode) return;

    // Handle file upload
    if (value instanceof File) {
      setFileUploads((prev) => ({ ...prev, [name]: value }));

      // Create preview for image files
      if (value.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreviews((prev) => ({
            ...prev,
            [name]: event.target.result,
          }));
        };
        reader.readAsDataURL(value);
      }
    } else if (value === null) {
      setFileUploads((prev) => ({ ...prev, [name]: null }));
      setImagePreviews((prev) => ({ ...prev, [name]: null }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name) => {
    if (isViewMode) return;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const value = formData[name];
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      if (field.readonly || field.disabled) return;
      const value = formData[field.name];
      const error = validateField(field.name, value);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}),
    );
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!validateForm()) {
      const firstErrorField = document.querySelector(".field-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const submitData = { ...formData };

    // Add file uploads to form data
    Object.keys(fileUploads).forEach((key) => {
      if (fileUploads[key] instanceof File) {
        submitData[`${key}File`] = fileUploads[key];
      }
    });

    onSubmit(submitData);
  };

  const handleEditToggle = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsViewMode(false);
      setIsEditMode(true);
    }
  };

  // const handleDelete = () => {
  //     if (onDelete) {
  //         onDelete();
  //     }
  //     setShowConfirmDelete(false);
  // };

  const handleCancel = () => {
    navigate(navigateTo);
  };

  const handleBack = () => {
    navigate(navigateTo);
  };

  // Render different field types
  const renderField = (field) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const hasError = isTouched && !!error;
    const isDisabled = field.disabled || loading;
    const isReadonly = field.readonly || isViewMode;
    const isRequired = field.required && !isViewMode;

    const labelClasses = `block text-sm font-medium text-gray-700 mb-1.5 ${isRequired ? 'after:content-["*"] after:text-red-500 after:ml-0.5' : ""}`;
    const inputClasses = `w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none transition-colors ${
      hasError
        ? "border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50"
        : isDisabled || isReadonly
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-gray-200 bg-white hover:border-gray-300 focus:ring-2 focus:ring-[#4529f7] focus:border-transparent"
    }`;

    // View mode display
    if (isViewMode) {
      const displayValue = field.viewRender
        ? field.viewRender(value, formData)
        : value;
      return (
        <div key={field.name} className="mb-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            {field.label}
          </label>
          <div className="text-sm text-gray-800 py-1.5 break-all">
            {displayValue || "—"}
          </div>
        </div>
      );
    }

    // Edit/Add mode
    if (field.type === "custom") {
      return (
        <div key={field.name} className="mb-5 field-error">
          <label className={labelClasses}>{field.label}</label>
          {field.render &&
            field.render({
              value,
              onChange: (nextValue) => handleChange(field.name, nextValue),
              formData,
              error,
              hasError,
              isTouched,
              isDisabled,
              isReadonly,
              isRequired,
            })}
          {hasError && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <span className="text-red-500">●</span> {error}
            </p>
          )}
          {field.help && !hasError && (
            <p className="mt-1 text-xs text-gray-400">{field.help}</p>
          )}
        </div>
      );
    }

    switch (field.type) {
      case "file":
        return (
          <div key={field.name} className="mb-5 field-error">
            <label className={labelClasses}>{field.label}</label>

            {/* Existing file preview */}
            {imagePreviews[field.name] && !fileUploads[field.name] && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-[#4529f7]">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {imagePreviews[field.name].startsWith("data:image") ||
                    imagePreviews[field.name].match(
                      /\.(jpg|jpeg|png|gif|svg|webp)/i,
                    ) ? (
                      <img
                        src={imagePreviews[field.name]}
                        alt={field.label}
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
                    <p className="text-xs text-gray-500">
                      Will be replaced if you upload a new one
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange(field.name, null);
                      setImagePreviews((prev) => ({
                        ...prev,
                        [field.name]: null,
                      }));
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove file"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Selected file preview */}
            {fileUploads[field.name] instanceof File && (
              <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {fileUploads[field.name].type.startsWith("image/") ? (
                      <img
                        src={imagePreviews[field.name]}
                        alt={field.label}
                        className="w-14 h-14 rounded-lg object-cover border border-green-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center text-green-600 border border-green-200">
                        <span className="text-2xl">📄</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-700">
                      New file selected
                    </p>
                    <p className="text-xs text-gray-500">
                      {fileUploads[field.name].name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange(field.name, null)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* File upload input */}
            <div className="relative">
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  hasError
                    ? "border-red-300 bg-red-50 hover:bg-red-100"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    {field.accept || "Any file"} (Max {field.maxSize || 5}MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept={field.accept || "*/*"}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleChange(field.name, file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isDisabled}
                />
              </label>
            </div>

            {hasError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="text-red-500">●</span> {error}
              </p>
            )}
            {field.help && !hasError && (
              <p className="mt-1 text-xs text-gray-400">{field.help}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.name} className="mb-5">
            <label className={labelClasses}>{field.label}</label>
            <div className="flex flex-wrap items-center gap-4">
              {field.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    className={`w-4 h-4 border-gray-300 focus:ring-2 ${
                      field.color || "text-[#2c0eee] focus:ring-[#4529f7]"
                    }`}
                    disabled={isDisabled}
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="text-red-500">●</span> {error}
              </p>
            )}
            {field.help && !hasError && (
              <p className="mt-1 text-xs text-gray-400">{field.help}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className="mb-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                onBlur={() => handleBlur(field.name)}
                className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${
                  field.color || "text-[#2c0eee] focus:ring-[#4529f7]"
                }`}
                disabled={isDisabled}
              />
              <span className="text-sm font-medium text-gray-700">
                {field.label}
              </span>
            </label>
            {field.help && (
              <p className="text-xs text-gray-400 mt-1 ml-7">{field.help}</p>
            )}
            {hasError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 ml-7">
                <span className="text-red-500">●</span> {error}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="mb-5 field-error">
            <label className={labelClasses}>{field.label}</label>
            <select
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              className={inputClasses}
              disabled={isDisabled}
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="text-red-500">●</span> {error}
              </p>
            )}
            {field.help && !hasError && (
              <p className="mt-1 text-xs text-gray-400">{field.help}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="mb-5 field-error">
            <label className={labelClasses}>{field.label}</label>
            <textarea
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              rows={field.rows || 3}
              placeholder={field.placeholder}
              className={inputClasses}
              disabled={isDisabled}
            />
            {hasError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="text-red-500">●</span> {error}
              </p>
            )}
            {field.help && !hasError && (
              <p className="mt-1 text-xs text-gray-400">{field.help}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="mb-5 field-error">
            <label className={labelClasses}>{field.label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                handleChange(field.name, parseFloat(e.target.value) || "")
              }
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step || 1}
              className={inputClasses}
              disabled={isDisabled}
            />
            {hasError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="text-red-500">●</span> {error}
              </p>
            )}
            {field.help && !hasError && (
              <p className="mt-1 text-xs text-gray-400">{field.help}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="mb-5 field-error">
            <label className={labelClasses}>{field.label}</label>
            <input
              type={field.type || "text"}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              className={inputClasses}
              disabled={isDisabled}
            />
            {hasError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="text-red-500">●</span> {error}
              </p>
            )}
            {field.help && !hasError && (
              <p className="mt-1 text-xs text-gray-400">{field.help}</p>
            )}
          </div>
        );
    }
  };

  // Action buttons configuration
  const renderActions = () => {
    if (isViewMode) {
      return (
        <div className="flex flex-wrap gap-3">
          {enableEditMode && (
            <Button
              type="button"
              variant="secondary"
              icon={MdEdit}
              onClick={handleEditToggle}
              loading={viewLoading}
            >
              {editLabel}
            </Button>
          )}
          {/* {showDelete && (
                        <Button
                            type="button"
                            variant="danger"
                            icon={MdDelete}
                            onClick={() => setShowConfirmDelete(true)}
                        >
                            {deleteLabel}
                        </Button>
                    )} */}
          <Button type="button" variant="secondary" onClick={handleCancel}>
            {cancelLabel}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button type="submit" icon={MdSave} loading={loading}>
          {isEditMode ? "Update" : submitLabel}
        </Button>
      </div>
    );
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
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {breadcrumb && (
                  <p className="text-sm text-gray-500">{breadcrumb}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* {isViewMode && (
                                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-[#2c0eee] rounded-full">
                                    View Mode
                                </span>
                            )}
                            {isEditMode && (
                                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-[#2c0eee] rounded-full">
                                    Edit Mode
                                </span>
                            )}
                            {mode === 'add' && (
                                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                    New Record
                                </span>
                            )} */}{" "}
              <form ref={formRef} onSubmit={handleSubmit}>
                {renderActions()}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto  py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {fields.map((field) => renderField(field))}
            </div>

            {/* Form Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between">
              <div className="text-xs text-gray-400">
                {isViewMode
                  ? "Viewing record details"
                  : "All fields are required unless marked optional"}
              </div>
              {renderActions()}
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {/* {showConfirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirmDelete(false)} />
                    <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <MdDelete size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Record</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this record? All associated data will be permanently removed.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowConfirmDelete(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="danger"
                                onClick={handleDelete}
                                loading={deleteLoading}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )} */}
    </div>
  );
};

export default FormPage;
