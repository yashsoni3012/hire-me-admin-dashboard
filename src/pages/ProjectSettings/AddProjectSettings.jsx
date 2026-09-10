// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProjectSettingFormPage from "../../components/common/ProjectSettingFormPage";
// import { projectSettingService } from "../../services/projectSetting.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { useAuth } from "../../context/AuthContext";

// const AddProjectSettings = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const userId = user?.id || 1;
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (submitData, { selectedFile }) => {
//     setLoading(true);
//     try {
//       // ─── Create payload ──────────────────────────────────────────────
//       const payload = {
//         ...submitData,
//         created_by: userId,
//         updated_by: userId,
//       };

//       if (submitData.value_type === "file" && selectedFile) {
//         payload.setting_file = selectedFile;
//         delete payload.setting_value;
//       }

//       console.log("📤 Submitting payload:", {
//         ...payload,
//         setting_file: payload.setting_file
//           ? `File: ${payload.setting_file.name}`
//           : undefined,
//       });

//       await projectSettingService.create(payload);
//       showSuccess("Project setting created successfully");
//       navigate("/project-settings");
//     } catch (error) {
//       console.error("Project Setting create error:", error);
//       showError(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to create project setting",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ProjectSettingFormPage
//       mode="add"
//       onSubmit={handleSubmit}
//       loading={loading}
//       title="Add Project Setting"
//       breadcrumb="Add a new project setting"
//       navigateTo="/project-settings"
//       submitLabel="Create"
//     />
//   );
// };

// export default AddProjectSettings;

// pages/project-settings/AddProjectSettings.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdSettings,
  MdCategory,
  MdKey,
  MdDescription,
  MdCode,
  MdNumbers,
  MdToggleOn,
  MdUploadFile,
  MdPublic,
  MdLock,
  MdInfoOutline,
  MdCloudUpload,
  MdClose,
  MdPhoto,
  MdSort,
  MdCheckCircle,
  MdTextFields,
} from "react-icons/md";
import { projectSettingService } from "../../services/projectSetting.service";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";

// ─── Helpers ────────────────────────────────────────────────────
const toBool = (val, fallback = false) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false")
    return false;
  return Boolean(val);
};

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
      checked ? "bg-blue-600" : "bg-slate-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

// ─── Constants ──────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdSettings },
  { id: "value", label: "Value & Type", icon: MdCode },
  { id: "visibility", label: "Visibility", icon: MdPublic },
];

const VALUE_TYPES = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "json", label: "JSON" },
  { value: "file", label: "File" },
];

const VALUE_TYPE_LABELS = VALUE_TYPES.reduce((acc, t) => {
  acc[t.value] = t.label;
  return acc;
}, {});

const getTypeIcon = (type) => {
  switch (type) {
    case "number":
      return MdNumbers;
    case "boolean":
      return MdToggleOn;
    case "json":
      return MdCode;
    case "file":
      return MdUploadFile;
    default:
      return MdTextFields;
  }
};

// ─── Main Component ─────────────────────────────────────────────
const AddProjectSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || 1;

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    setting_group: "",
    setting_key: "",
    setting_value: "",
    value_type: "string",
    description: "",
    is_public: false,
    display_order: 0,
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // File handling (only relevant when value_type === "file")
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleValueTypeChange = (e) => {
    const newType = e.target.value;
    setFormValues((prev) => {
      let newValue = prev.setting_value;

      if (newType === "boolean") {
        newValue = toBool(prev.setting_value) ? "true" : "false";
      } else if (prev.value_type === "boolean" && newType !== "boolean") {
        newValue = "";
      }

      if (newType !== "file") {
        // Clear staged file state when leaving the File type
        setSelectedFile(null);
        setFilePreview(null);
      }

      return { ...prev, value_type: newType, setting_value: newValue };
    });

    if (errors.value_type) setErrors((prev) => ({ ...prev, value_type: "" }));
    if (errors.setting_value)
      setErrors((prev) => ({ ...prev, setting_value: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be less than 5MB");
      return;
    }
    setSelectedFile(file);
    setFilePreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null
    );
    if (errors.setting_value)
      setErrors((prev) => ({ ...prev, setting_value: "" }));
    // Reset so choosing the same file again re-triggers onChange
    e.target.value = "";
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.setting_group?.trim()) {
      newErrors.setting_group = "Setting group is required";
    } else if (formValues.setting_group.trim().length < 2) {
      newErrors.setting_group = "Group must be at least 2 characters";
    }

    if (!formValues.setting_key?.trim()) {
      newErrors.setting_key = "Setting key is required";
    } else if (!/^[a-zA-Z0-9_\-.]+$/.test(formValues.setting_key.trim())) {
      newErrors.setting_key =
        "Key may only contain letters, numbers, underscores, dashes and dots";
    }

    if (!formValues.value_type) {
      newErrors.value_type = "Please select a value type";
    }

    // Value validation depends on type
    if (formValues.value_type === "file") {
      if (!selectedFile) {
        newErrors.setting_value = "Please upload a file";
      }
    } else if (formValues.value_type === "string") {
      if (!formValues.setting_value?.trim()) {
        newErrors.setting_value = "Value is required";
      }
    } else if (formValues.value_type === "number") {
      if (
        formValues.setting_value === "" ||
        formValues.setting_value === null ||
        formValues.setting_value === undefined
      ) {
        newErrors.setting_value = "Value is required";
      } else if (Number.isNaN(Number(formValues.setting_value))) {
        newErrors.setting_value = "Please enter a valid number";
      }
    } else if (formValues.value_type === "json") {
      if (!formValues.setting_value?.trim()) {
        newErrors.setting_value = "Value is required";
      } else {
        try {
          JSON.parse(formValues.setting_value);
        } catch {
          newErrors.setting_value = "Please enter valid JSON";
        }
      }
    }

    const orderNum = Number(formValues.display_order);
    if (formValues.display_order === "" || Number.isNaN(orderNum)) {
      newErrors.display_order = "Please enter a valid display order";
    } else if (orderNum < 0) {
      newErrors.display_order = "Display order cannot be negative";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.setting_group || newErrors.setting_key) {
        setActiveTab("overview");
      } else if (
        newErrors.value_type ||
        newErrors.setting_value ||
        newErrors.display_order
      ) {
        setActiveTab("value");
      }
      showError(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        setting_group: formValues.setting_group.trim(),
        setting_key: formValues.setting_key.trim(),
        setting_value: formValues.setting_value,
        value_type: formValues.value_type,
        description: formValues.description?.trim() || "",
        is_public: !!formValues.is_public,
        display_order: Number(formValues.display_order) || 0,
        status: formValues.status,
      };

      // ─── Create payload ──────────────────────────────────────
      const payload = {
        ...submitData,
        created_by: userId,
        updated_by: userId,
      };

      if (submitData.value_type === "file" && selectedFile) {
        payload.setting_file = selectedFile;
        delete payload.setting_value;
      }

      console.log("📤 Submitting payload:", {
        ...payload,
        setting_file: payload.setting_file
          ? `File: ${payload.setting_file.name}`
          : undefined,
      });

      await projectSettingService.create(payload);
      showSuccess("Project setting created successfully");
      navigate("/project-settings");
    } catch (error) {
      console.error("Project Setting create error:", error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create project setting"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Hero helpers ────────────────────────────────────────────
  const heroKey = formValues.setting_key?.trim() || "New Setting";
  const heroGroup = formValues.setting_group?.trim() || "—";
  const TypeIcon = getTypeIcon(formValues.value_type);
  const typeLabel =
    VALUE_TYPE_LABELS[formValues.value_type] || formValues.value_type;
  const statusLabel = formValues.status === "active" ? "Active" : "Inactive";
  const displayedFile = filePreview;

  // ─── Render Value input (dynamic by type) ────────────────────
  const renderValueInput = () => {
    const { value_type, setting_value } = formValues;

    // ── Boolean ──
    if (value_type === "boolean") {
      return (
        <div className="relative">
          <MdToggleOn
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
          <select
            name="setting_value"
            value={setting_value}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
              errors.setting_value
                ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            } bg-white`}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      );
    }

    // ── JSON ──
    if (value_type === "json") {
      return (
        <textarea
          name="setting_value"
          value={setting_value}
          onChange={handleInputChange}
          rows={6}
          spellCheck={false}
          className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono focus:outline-none transition-all ${
            errors.setting_value
              ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          } bg-white`}
          placeholder='{"key": "value"}'
        />
      );
    }

    // ── Number ──
    if (value_type === "number") {
      return (
        <div className="relative">
          <MdNumbers
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="number"
            name="setting_value"
            value={setting_value}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
              errors.setting_value
                ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            } bg-white`}
            placeholder="0"
          />
        </div>
      );
    }

    // ── File ──
    if (value_type === "file") {
      return (
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {displayedFile ? (
              <img
                src={displayedFile}
                alt="File preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : selectedFile ? (
              <MdUploadFile size={28} className="text-slate-400" />
            ) : (
              <MdPhoto size={28} className="text-slate-300" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
              <MdCloudUpload size={16} />
              {selectedFile ? "Change file" : "Upload file"}
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <button
                type="button"
                onClick={handleFileRemove}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
              >
                <MdClose size={14} />
                Remove file
              </button>
            )}
            {selectedFile && (
              <p className="text-xs text-slate-600 truncate max-w-[260px]">
                {selectedFile.name}
              </p>
            )}
            <p className="text-xs text-slate-500">Max 5MB.</p>
          </div>
        </div>
      );
    }

    // ── Default: string ──
    return (
      <div className="relative">
        <MdTextFields
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          name="setting_value"
          value={setting_value}
          onChange={handleInputChange}
          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
            errors.setting_value
              ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          } bg-white`}
          placeholder="Enter value"
        />
      </div>
    );
  };

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Setting Group */}
              <div>
                <FieldLabel required>Setting Group</FieldLabel>
                <div className="relative">
                  <MdCategory
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="setting_group"
                    value={formValues.setting_group}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.setting_group
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="general"
                  />
                </div>
                {errors.setting_group ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.setting_group}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Logical group this setting belongs to.
                  </p>
                )}
              </div>

              {/* Setting Key */}
              <div>
                <FieldLabel required>Setting Key</FieldLabel>
                <div className="relative">
                  <MdKey
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="setting_key"
                    value={formValues.setting_key}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.setting_key
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                    placeholder="site_name"
                  />
                </div>
                {errors.setting_key ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.setting_key}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Unique key used to reference this setting in code.
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <div className="relative">
                  <MdDescription
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    placeholder="Short description of what this setting controls..."
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Optional. Helps other admins understand the purpose.
                </p>
              </div>
            </div>
          </div>
        );

      case "value":
        return (
          <div className="space-y-5 max-w-3xl">
            {/* Value Type */}
            <div>
              <FieldLabel required>Value Type</FieldLabel>
              <div className="relative">
                <MdCode
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <select
                  name="value_type"
                  value={formValues.value_type}
                  onChange={handleValueTypeChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                    errors.value_type
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  } bg-white`}
                >
                  {VALUE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.value_type ? (
                <p className="text-xs text-red-500 mt-1">
                  {errors.value_type}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5">
                  Determines how the setting value is stored and validated.
                </p>
              )}
            </div>

            {/* Setting Value */}
            <div>
              <FieldLabel required>Setting Value</FieldLabel>
              {renderValueInput()}
              {errors.setting_value ? (
                <p className="text-xs text-red-500 mt-1">
                  {errors.setting_value}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5">
                  {formValues.value_type === "file"
                    ? "Upload a file to store the path for this setting."
                    : formValues.value_type === "json"
                    ? "Value must be valid JSON."
                    : "Value stored for this setting."}
                </p>
              )}
            </div>

            {/* Display Order */}
            <div className="max-w-xs">
              <FieldLabel>Display Order</FieldLabel>
              <div className="relative">
                <MdSort
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  name="display_order"
                  value={formValues.display_order}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.display_order
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  } bg-white`}
                  placeholder="0"
                />
              </div>
              {errors.display_order ? (
                <p className="text-xs text-red-500 mt-1">
                  {errors.display_order}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5">
                  Lower numbers appear first in listings.
                </p>
              )}
            </div>
          </div>
        );

      case "visibility":
        return (
          <div className="space-y-5 max-w-2xl">
            {/* is_public */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    formValues.is_public
                      ? "bg-blue-50 text-blue-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {formValues.is_public ? (
                    <MdPublic size={18} />
                  ) : (
                    <MdLock size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    Public Setting
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Make this setting visible to public APIs and clients.
                  </p>
                </div>
              </div>
              <Toggle
                checked={!!formValues.is_public}
                onChange={(v) =>
                  setFormValues((prev) => ({ ...prev, is_public: v }))
                }
              />
            </div>

            {/* Status */}
            <div>
              <FieldLabel required>Status</FieldLabel>
              <div className="relative">
                <MdCheckCircle
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <select
                  name="status"
                  value={formValues.status}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Inactive settings are ignored by the application but kept in
                the database.
              </p>
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
              onClick={() => navigate("/project-settings")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Project Settings · New
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroKey}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/project-settings")}
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
              {loading ? "Creating..." : "Create Setting"}
            </button>
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
              {/* Type icon block */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                  <TypeIcon size={32} />
                </div>
              </div>

              {/* Key + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-mono truncate max-w-full">
                    {heroKey}
                  </h1>
                  {formValues.value_type && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-400/20 text-indigo-200 ring-1 ring-indigo-400/30">
                      <MdCode size={12} />
                      {typeLabel}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${
                      formValues.status === "active"
                        ? "bg-emerald-400/20 text-emerald-200 ring-emerald-400/30"
                        : "bg-slate-400/20 text-slate-200 ring-slate-400/30"
                    }`}
                  >
                    <MdCheckCircle size={12} />
                    {statusLabel}
                  </span>
                  {formValues.is_public && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-400/20 text-blue-200 ring-1 ring-blue-400/30">
                      <MdPublic size={12} />
                      Public
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/70 font-mono">
                    {heroGroup}
                  </span>
                  {formValues.display_order !== "" && (
                    <span className="text-xs text-white/50">
                      • Order {formValues.display_order}
                    </span>
                  )}
                  <span className="text-xs text-white/50">New Setting</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Group</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.setting_group || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCode size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Type</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {typeLabel || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdSort size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Display Order
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.display_order === "" ||
                formValues.display_order === null ||
                formValues.display_order === undefined
                  ? "—"
                  : formValues.display_order}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            {formValues.is_public ? (
              <MdPublic size={16} className="text-slate-400 flex-shrink-0" />
            ) : (
              <MdLock size={16} className="text-slate-400 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Visibility
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_public ? "Public" : "Private"}
              </p>
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
                    active
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="add-project-setting-tab-underline"
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

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/project-settings")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddProjectSettings;