// // pages/subscriptions/SubscriptionFeaturesForm.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import {
//   ViewBadge,
//   ViewTrendingBadge,
// } from "../../components/common/FormPageUtils";
// import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
// import { subscriptionFeatureCategoryService } from "../../services/subscriptionFeatureCategory.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";
// import { useAuth } from "../../context/AuthContext";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const SubscriptionFeaturesForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const { user } = useAuth();
//   const userId = user?.id;

//   const [mode, setMode] = useState("add");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [parentCategories, setParentCategories] = useState([]);
//   const [userNameCache, setUserNameCache] = useState({});
//   const [pageLoading, setPageLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [iconRemoved, setIconRemoved] = useState(false);

//   // Determine mode from URL
//   useEffect(() => {
//     const path = location.pathname;
//     if (path.includes("/view/")) {
//       setMode("view");
//     } else if (path.includes("/edit/")) {
//       setMode("edit");
//     } else {
//       setMode("add");
//     }
//   }, [location.pathname]);

//   // Fetch parent categories
//   useEffect(() => {
//     const fetchParentCategories = async () => {
//       try {
//         const r = await subscriptionFeatureCategoryService.getAll({
//           limit: 1000,
//         });
//         const rawData = r.data?.data || r.data?.results || r.data || [];
//         const categories = Array.isArray(rawData) ? rawData : [];
//         setParentCategories(categories);
//       } catch (error) {
//         console.error("Failed to fetch parent categories:", error);
//       }
//     };
//     fetchParentCategories();
//   }, []);

//   // Fetch users for display names
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((id) => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);
//       } catch (error) {
//         console.error("Failed to load users:", error);
//       }
//     };
//     loadUsers();
//   }, []);

//   // Fetch data for edit/view modes
//   useEffect(() => {
//     const fetchData = async () => {
//       if ((mode === "edit" || mode === "view") && id) {
//         setPageLoading(true);
//         try {
//           let item = location.state?.item;

//           if (!item) {
//             const response = await subscriptionFeatureService.getById(id);
//             item = response.data;
//           }

//           console.log("Fetched item from API:", item);

//           // Normalize the data
//           const normalizedData = {
//             id: item.id || item._id,
//             feature_name: item.feature_name || "",
//             feature_key: item.feature_key || "",
//             feature_type: item.feature_type || "TEXT",
//             description: item.description || "",
//             // FIX: Store the icon path as-is from API
//             icon: item.icon || null,
//             subscription_feature_categories_id:
//               item.subscription_feature_categories_id || "",
//             Category: item.Category || null,
//             parent_category_name: item.Category?.category_name || "",
//             default_unit: item.default_unit || "",
//             default_value: item.default_value || "",
//             options_json: item.options_json || null,
//             is_usage_track: item.is_usage_track || "no",
//             is_required: item.is_required !== undefined ? item.is_required : 1,
//             is_display: item.is_display !== undefined ? item.is_display : 1,
//             display_order: item.display_order || 0,
//             is_status: normalizeStatus(item),
//             is_trending: item.is_trending || false,
//             status: normalizeStatus(item),
//             created_at: item.created_at || item.createdAt || null,
//             updated_at: item.updated_at || item.updatedAt || null,
//             created_by: item.created_by || null,
//             updated_by: item.updated_by || null,
//           };

//           setData(normalizedData);

//           // Set image preview if icon exists
//           if (item.icon) {
//             // FIX: Use the icon path directly - it already has /uploads/
//             setImagePreview(getFullImageUrl(item.icon));
//           }

//           setIconRemoved(false);
//         } catch (error) {
//           console.error("Fetch error:", error);
//           showError("Failed to load subscription feature data");
//           navigate("/subscription-features");
//         } finally {
//           setPageLoading(false);
//         }
//       }
//     };
//     fetchData();
//   }, [id, mode, location.state, navigate]);

//   // Helper function to normalize status
//   const normalizeStatus = (item) => {
//     if (!item) return true;
//     const statusValue =
//       item.is_status !== undefined ? item.is_status : item.status;
//     if (statusValue === undefined || statusValue === null) return true;
//     if (typeof statusValue === "string") {
//       return (
//         statusValue.toLowerCase() === "active" ||
//         statusValue === "1" ||
//         statusValue === "true"
//       );
//     }
//     return statusValue === true || statusValue === 1;
//   };

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // FIX: Get full image URL - only add /uploads/ if not already present
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (typeof value !== "string") return null;

//     // If it's already a full URL or base64, return as-is
//     if (value.startsWith("http") || value.startsWith("data:image")) {
//       return value;
//     }

//     // If it already starts with /uploads/, don't add it again
//     if (value.startsWith("/uploads/")) {
//       return `${API_BASE_URL}${value}`;
//     }

//     // If it's just the filename (no /uploads/ prefix), add it
//     if (value.startsWith("uploads/")) {
//       return `${API_BASE_URL}/${value}`;
//     }

//     // Default: add /uploads/
//     return `${API_BASE_URL}/uploads/${value}`;
//   };

//   // Parse options_json for display
//   const parseOptions = (optionsJson) => {
//     if (!optionsJson) return null;
//     try {
//       return typeof optionsJson === "string"
//         ? JSON.parse(optionsJson)
//         : optionsJson;
//     } catch {
//       return null;
//     }
//   };

//   // Get status value
//   const getStatusValue = (row) => {
//     if (!row) return true;
//     if (row.is_status !== undefined) {
//       return row.is_status === true;
//     }
//     if (row.status !== undefined) {
//       return normalizeStatus(row);
//     }
//     return true;
//   };

//   // Handle file selection
//   const handleFileChange = (file) => {
//     if (file) {
//       const validTypes = [
//         "image/jpeg",
//         "image/png",
//         "image/gif",
//         "image/webp",
//         "image/avif",
//         "image/svg+xml",
//       ];
//       if (!validTypes.includes(file.type)) {
//         showError("Please upload a valid image file");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         showError("Image size must be less than 5MB");
//         return;
//       }

//       setSelectedFile(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Remove selected file
//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setImagePreview(null);
//     setIconRemoved(true);
//   };

//   // Define fields for the form
//   const getFields = () => {
//     const categoryOptions = parentCategories.map((cat) => ({
//       value: cat.id || cat._id,
//       label: cat.category_name || "",
//     }));

//     // Base fields
//     const baseFields = [
//       {
//         name: "feature_name",
//         label: "Feature Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Job Postings",
//         help: "Enter a unique name for the feature",
//         viewRender: (value) => (
//           <span className="font-medium text-lg">{value}</span>
//         ),
//       },
//       {
//         name: "feature_key",
//         label: "Feature Key",
//         type: "text",
//         required: true,
//         placeholder: "e.g. job_post_limit",
//         help: "Unique identifier for the feature (lowercase and underscores only)",
//         viewRender: (value) => <span className="font-mono">{value}</span>,
//       },
//       {
//         name: "feature_type",
//         label: "Feature Type",
//         type: "select",
//         required: true,
//         options: [
//           { value: "COUNT", label: "Count" },
//           { value: "BOOLEAN", label: "Boolean" },
//           { value: "DAYS", label: "Days" },
//           { value: "TEXT", label: "Text" },
//         ],
//         help: "Select the type of feature",
//         viewRender: (value) => (
//           <span className="capitalize">{value || "-"}</span>
//         ),
//       },
//       {
//         name: "subscription_feature_categories_id",
//         label: "Parent Category",
//         type: "select",
//         required: true,
//         options: categoryOptions,
//         placeholder: "Select parent category",
//         help: "Select the parent subscription feature category",
//         viewRender: (value, row) => row?.parent_category_name || value || "—",
//       },
//       {
//         name: "description",
//         label: "Description",
//         type: "textarea",
//         required: false,
//         placeholder: "Enter feature description...",
//         rows: 3,
//         help: "Optional description for the feature",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "icon",
//         label: "Feature Icon",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload an icon for the feature (PNG, JPG, SVG) - Max 5MB",
//         placeholder: "Click or drag to upload icon",
//         viewRender: (value) => {
//           if (!value) return "—";
//           const url = getFullImageUrl(value);
//           return (
//             <div className="relative group">
//               <img
//                 src={url}
//                 alt="Feature icon"
//                 className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                   e.target.parentElement.innerHTML =
//                     '<span class="text-gray-400">Invalid image</span>';
//                 }}
//               />
//               <button
//                 onClick={() => window.open(url, "_blank")}
//                 className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//               >
//                 <span className="text-sm">View</span>
//               </button>
//             </div>
//           );
//         },
//       },
//       {
//         name: "default_unit",
//         label: "Default Unit",
//         type: "text",
//         required: false,
//         placeholder: "e.g. Jobs, Days, Profiles, Credits",
//         help: "Default unit of measurement for this feature",
//         viewRender: (value) => value || "—",
//       },
//       {
//         name: "options_json",
//         label: "Options (JSON)",
//         type: "textarea",
//         required: false,
//         placeholder: '{"options": ["Option 1", "Option 2", "Option 3"]}',
//         rows: 3,
//         help: "JSON object for dropdown options (if applicable)",
//         viewRender: (value) => {
//           if (!value) return "—";
//           const parsed =
//             typeof value === "string" ? parseOptions(value) : value;
//           return (
//             <pre className="text-xs bg-gray-50 p-2 rounded border border-gray-200 max-h-24 overflow-auto">
//               {typeof parsed === "string"
//                 ? parsed
//                 : JSON.stringify(parsed, null, 2)}
//             </pre>
//           );
//         },
//       },
//       {
//         name: "is_usage_track",
//         label: "Track Usage",
//         type: "select",
//         required: true,
//         options: [
//           { value: "yes", label: "Yes" },
//           { value: "no", label: "No" },
//         ],
//         help: "Enable if this feature usage should be tracked",
//         viewRender: (value) => (
//           <span
//             className={`text-sm font-medium ${value === "yes" ? "text-green-600" : "text-gray-400"}`}
//           >
//             {value === "yes" ? "Yes" : "No"}
//           </span>
//         ),
//       },
//       {
//         name: "is_required",
//         label: "Required",
//         type: "checkbox",
//         color: "text-red-500 focus:ring-red-500",
//         help: "Check if this feature is required when creating a plan",
//         viewRender: (value) => (
//           <span
//             className={`text-sm ${value ? "text-red-500" : "text-gray-400"}`}
//           >
//             {value ? "Yes" : "No"}
//           </span>
//         ),
//       },
//       {
//         name: "is_display",
//         label: "Show on Pricing Page",
//         type: "checkbox",
//         color: "text-[#4529f7] focus:ring-[#4529f7]",
//         help: "Check to show this feature on the pricing page",
//         viewRender: (value) => (
//           <span
//             className={`text-sm ${value ? "text-[#4529f7]" : "text-gray-400"}`}
//           >
//             {value ? "Yes" : "No"}
//           </span>
//         ),
//       },
//       {
//         name: "display_order",
//         label: "Display Order",
//         type: "number",
//         required: false,
//         min: 0,
//         step: 1,
//         help: "Order in which the feature should be displayed",
//         viewRender: (value) => value || 0,
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
//         viewRender: () => {
//           const isActive = getStatusValue(data);
//           return <ViewBadge active={isActive} />;
//         },
//       },
//       {
//         name: "is_trending",
//         label: "Mark as Trending",
//         type: "checkbox",
//         color: "text-yellow-500 focus:ring-yellow-500",
//         help: "Trending features will be highlighted in the listing",
//         viewRender: (value) => <ViewTrendingBadge isTrending={value} />,
//       },
//     ];

//     if (mode === "view") {
//       const auditFields = [
//         {
//           name: "created_by",
//           label: "Created By",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => {
//             const name = getUserNameCached(value);
//             return name !== "-" ? name : "System";
//           },
//         },
//         {
//           name: "updated_by",
//           label: "Updated By",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => {
//             if (!value) return "—";
//             const name = getUserNameCached(value);
//             return name !== "-" ? name : "System";
//           },
//         },
//         {
//           name: "created_at",
//           label: "Created At",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => (value ? formatDate(value) : "—"),
//         },
//         {
//           name: "updated_at",
//           label: "Updated At",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => (value ? formatDate(value) : "—"),
//         },
//       ];

//       return [...baseFields, ...auditFields];
//     }

//     return baseFields;
//   };

//   // Validation rules
//   const getValidationRules = (existingData) => ({
//     feature_name: {
//       required: true,
//       requiredMessage: "Feature name is required",
//       minLength: 2,
//       minLengthMessage: "Feature name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Feature name must be at most 100 characters",
//     },
//     feature_key: {
//       required: true,
//       requiredMessage: "Feature key is required",
//       minLength: 2,
//       minLengthMessage: "Feature key must be at least 2 characters",
//       maxLength: 50,
//       maxLengthMessage: "Feature key must be at most 50 characters",
//       pattern: /^[a-z_]+$/,
//       patternMessage:
//         "Feature key must contain only lowercase letters and underscores",
//     },
//     feature_type: {
//       required: true,
//       requiredMessage: "Please select a feature type",
//     },
//     subscription_feature_categories_id: {
//       required: true,
//       requiredMessage: "Please select a parent category",
//     },
//     is_usage_track: {
//       required: true,
//       requiredMessage: "Please select usage track option",
//     },
//     display_order: {
//       custom: (value) => {
//         if (value === "" || value === null || value === undefined) {
//           return null;
//         }
//         const number = Number(value);
//         if (Number.isNaN(number)) {
//           return "Display order must be a number";
//         }
//         if (number < 0) {
//           return "Display order cannot be negative";
//         }
//         if (!Number.isInteger(number)) {
//           return "Display order must be a whole number";
//         }
//         return null;
//       },
//     },
//   });

//   // Submit handler
//   const handleSubmit = async (formData) => {
//     setLoading(true);

//     try {
//       if (
//         !formData.subscription_feature_categories_id ||
//         formData.subscription_feature_categories_id === ""
//       ) {
//         showError("Please select a parent category");
//         setLoading(false);
//         return;
//       }

//       let optionsJson = null;
//       if (formData.options_json) {
//         try {
//           optionsJson =
//             typeof formData.options_json === "string"
//               ? JSON.parse(formData.options_json)
//               : formData.options_json;
//         } catch (e) {
//           showError("Invalid JSON format for Options");
//           setLoading(false);
//           return;
//         }
//       }

//       const submitData = {
//         feature_name: formData.feature_name.trim(),
//         feature_key: formData.feature_key.trim(),
//         feature_type: formData.feature_type || "TEXT",
//         subscription_feature_categories_id: parseInt(
//           formData.subscription_feature_categories_id,
//         ),
//         description: formData.description?.trim() || "",
//         default_unit: formData.default_unit || "",
//         default_value: formData.default_value || "",
//         options_json: optionsJson,
//         is_usage_track: formData.is_usage_track || "no",
//         is_required: formData.is_required ? 1 : 0,
//         is_display:
//           formData.is_display !== undefined ? (formData.is_display ? 1 : 0) : 1,
//         display_order: parseInt(formData.display_order) || 0,
//         status: formData.status === "active",
//         is_trending: formData.is_trending || false,
//       };

//       // FIX: Icon handling - don't add /uploads/ prefix
//       if (formData.iconFile instanceof File) {
//         submitData.iconFile = formData.iconFile;
//       } else if (formData.icon === null) {
//         submitData.icon = null; // user removed the existing icon
//       } else if (data?.icon) {
//         submitData.icon = data.icon; // unchanged
//       }

//       console.log("Submitting data:", {
//         ...submitData,
//         iconFile: submitData.iconFile ? "[File]" : undefined,
//         icon: submitData.icon,
//       });

//       if (mode === "edit") {
//         submitData.updated_by = userId;
//         await subscriptionFeatureService.update(id, submitData);
//         showSuccess("Feature updated successfully");
//       } else {
//         submitData.created_by = userId;
//         submitData.updated_by = userId;
//         await subscriptionFeatureService.create(submitData);
//         showSuccess("Feature created successfully");
//       }

//       navigate("/subscription-features");
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error?.message || error?.response?.data?.message || "Failed to save";
//       showError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete handler
//   const handleDelete = async () => {
//     try {
//       await subscriptionFeatureService.delete(id);
//       showSuccess("Feature deleted successfully");
//       navigate("/subscription-features");
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
//       throw error;
//     }
//   };

//   // Prepare initial data
//   const getInitialData = () => {
//     if (mode === "add") {
//       return {
//         feature_name: "",
//         feature_key: "",
//         feature_type: "TEXT",
//         subscription_feature_categories_id: "",
//         description: "",
//         icon: null,
//         default_unit: "",
//         default_value: "",
//         options_json: "",
//         is_usage_track: "no",
//         is_required: false,
//         is_display: true,
//         display_order: 0,
//         status: "active",
//         is_trending: false,
//       };
//     }

//     if (data) {
//       const initialData = {
//         feature_name: data.feature_name || "",
//         feature_key: data.feature_key || "",
//         feature_type: data.feature_type || "TEXT",
//         subscription_feature_categories_id:
//           data.subscription_feature_categories_id || data.Category?.id || "",
//         description: data.description || "",
//         // FIX: Use the icon path as-is from API
//         icon: data.icon || null,
//         default_unit: data.default_unit || "",
//         default_value: data.default_value || "",
//         options_json: data.options_json
//           ? JSON.stringify(data.options_json, null, 2)
//           : "",
//         is_usage_track: data.is_usage_track || "no",
//         is_required: data.is_required || false,
//         is_display: data.is_display !== undefined ? data.is_display : true,
//         display_order: data.display_order || 0,
//         status: getStatusValue(data) ? "active" : "inactive",
//         is_trending: data.is_trending || false,
//         parent_category_name: data.parent_category_name || "",
//       };

//       if (mode === "view") {
//         initialData.created_by = data.created_by;
//         initialData.updated_by = data.updated_by;
//         initialData.created_at = data.created_at;
//         initialData.updated_at = data.updated_at;
//       }

//       return initialData;
//     }

//     return {
//       feature_name: "",
//       feature_key: "",
//       feature_type: "TEXT",
//       subscription_feature_categories_id: "",
//       description: "",
//       icon: null,
//       default_unit: "",
//       default_value: "",
//       options_json: "",
//       is_usage_track: "no",
//       is_required: false,
//       is_display: true,
//       display_order: 0,
//       status: "active",
//       is_trending: false,
//     };
//   };

//   // Get title based on mode
//   const getTitle = () => {
//     if (mode === "view") return "Subscription Feature Details";
//     if (mode === "edit") return "Edit Subscription Feature";
//     return "Add New Subscription Feature";
//   };

//   // Get submit label
//   const getSubmitLabel = () => {
//     if (mode === "edit") return "Update Feature";
//     return "Create Feature";
//   };

//   // Handle loading state
//   if (pageLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-3 text-gray-500">Loading feature data...</p>
//         </div>
//       </div>
//     );
//   }

//   // If view/edit mode and data not loaded, show error
//   if ((mode === "view" || mode === "edit") && !data && !pageLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500">Subscription feature not found</p>
//           <button
//             onClick={() => navigate("/subscription-features")}
//             className="mt-3 text-[#2c0eee] hover:underline"
//           >
//             Go back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <FormPage
//       title={getTitle()}
//       mode={mode}
//       fields={getFields()}
//       initialData={getInitialData()}
//       validationRules={getValidationRules(data)}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       navigateTo="/subscription-features"
//       submitLabel={getSubmitLabel()}
//       editLabel="Edit Feature"
//       deleteLabel="Delete Feature"
//       loading={loading}
//       showDelete={mode !== "add"}
//       showEdit={mode === "view"}
//       enableEditMode={mode === "view"}
//       breadcrumb={
//         mode === "view"
//           ? "Viewing feature details"
//           : mode === "edit"
//             ? "Updating feature"
//             : "Creating new feature"
//       }
//       onEdit={() =>
//         navigate(`/subscription-features/edit/${id}`, { state: { item: data } })
//       }
//     />
//   );
// };

// export default SubscriptionFeaturesForm;


// pages/subscriptions/SubscriptionFeaturesForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdEdit,
  MdExtension,
  MdVpnKey,
  MdCategory,
  MdImage,
  MdCloudUpload,
  MdClose,
  MdFlag,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
  MdPerson,
  MdDateRange,
  MdSettings,
  MdPhoto,
  MdCode,
  MdDescription,
  MdSort,
  MdFlashOn,
  MdVisibility,
  MdWarning,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
import { subscriptionFeatureCategoryService } from "../../services/subscriptionFeatureCategory.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const Toggle = ({ checked, onChange, name }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked || false}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
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

// ─── Full image URL helper ──────────────────────────────────────
const getFullImageUrl = (value) => {
  if (!value) return null;
  if (typeof value !== "string") return null;
  if (
    value.startsWith("http") ||
    value.startsWith("data:image") ||
    value.startsWith("blob:")
  )
    return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_BASE_URL}/${value}`;
  return `${API_BASE_URL}/uploads/${value}`;
};

// ─── Main Component ─────────────────────────────────────────────
const SubscriptionFeaturesForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id;

  const [mode, setMode] = useState("add"); // add | edit | view
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [data, setData] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    feature_name: "",
    feature_key: "",
    feature_type: "TEXT",
    subscription_feature_categories_id: "",
    description: "",
    icon: "",
    default_unit: "",
    default_value: "",
    options_json: "",
    is_usage_track: "no",
    is_required: false,
    is_display: true,
    display_order: 0,
    status: "active",
    is_trending: false,
    parent_category_name: "",
    created_by: null,
    updated_by: null,
    created_at: null,
    updated_at: null,
  });

  // File handling
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconRemoved, setIconRemoved] = useState(false);

  const [errors, setErrors] = useState({});

  // ─── Normalize status helper ─────────────────────────────────
  const normalizeStatus = (item) => {
    if (!item) return true;
    const statusValue =
      item.is_status !== undefined ? item.is_status : item.status;
    if (statusValue === undefined || statusValue === null) return true;
    if (typeof statusValue === "string") {
      return (
        statusValue.toLowerCase() === "active" ||
        statusValue === "1" ||
        statusValue === "true"
      );
    }
    return statusValue === true || statusValue === 1;
  };

  // ─── Determine mode from URL ─────────────────────────────────
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/view/")) setMode("view");
    else if (path.includes("/edit/")) setMode("edit");
    else setMode("add");
  }, [location.pathname]);

  // Reset UI on mode/id change
  useEffect(() => {
    setActiveTab("overview");
  }, [mode, id]);

  // ─── Fetch parent categories ─────────────────────────────────
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const r = await subscriptionFeatureCategoryService.getAll({
          limit: 1000,
        });
        const rawData = r.data?.data || r.data?.results || r.data || [];
        const categories = Array.isArray(rawData) ? rawData : [];
        setParentCategories(categories);
      } catch (error) {
        console.error("Failed to fetch parent categories:", error);
      }
    };
    fetchParentCategories();
  }, []);

  // ─── Fetch users ──────────────────────────────────────────────
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

  // ─── Fetch data for edit/view ────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if ((mode === "edit" || mode === "view") && id) {
        setFetchLoading(true);
        try {
          let item = location.state?.item;
          if (!item) {
            const response = await subscriptionFeatureService.getById(id);
            item = response.data;
          }

          if (!item) throw new Error("Feature not found");

          setFormValues({
            feature_name: item.feature_name || "",
            feature_key: item.feature_key || "",
            feature_type: item.feature_type || "TEXT",
            subscription_feature_categories_id:
              item.subscription_feature_categories_id ||
              item.Category?.id ||
              "",
            description: item.description || "",
            icon: item.icon || "",
            default_unit: item.default_unit || "",
            default_value: item.default_value || "",
            options_json: item.options_json
              ? JSON.stringify(item.options_json, null, 2)
              : "",
            is_usage_track: item.is_usage_track || "no",
            is_required: item.is_required !== undefined ? item.is_required : 1,
            is_display: item.is_display !== undefined ? item.is_display : 1,
            display_order: item.display_order || 0,
            status: normalizeStatus(item) ? "active" : "inactive",
            is_trending: item.is_trending || false,
            parent_category_name: item.Category?.category_name || "",
            created_by: item.created_by || null,
            updated_by: item.updated_by || null,
            created_at: item.created_at || item.createdAt || null,
            updated_at: item.updated_at || item.updatedAt || null,
          });

          if (item.icon) setIconPreview(getFullImageUrl(item.icon));

          setData(item);
        } catch (error) {
          console.error("Fetch error:", error);
          showError("Failed to load subscription feature data");
          navigate("/subscription-features");
        } finally {
          setFetchLoading(false);
        }
      }
    };
    fetchData();
  }, [id, mode, location.state, navigate]);

  // ─── User name helper ────────────────────────────────────────
  const getUserNameCached = (uid) => {
    if (!uid) return "—";
    if (user?.id && Number(user.id) === Number(uid)) return "You";
    return userNameCache[uid] || `User ${uid}`;
  };

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleIconFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      showError("Please upload a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("Image size must be less than 5MB");
      return;
    }

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
    setIconRemoved(false);
  };

  const handleIconRemove = () => {
    setIconFile(null);
    setIconPreview(null);
    setIconRemoved(true);
    setFormValues((prev) => ({ ...prev, icon: "" }));
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.feature_name?.trim()) {
      newErrors.feature_name = "Feature name is required";
    } else if (formValues.feature_name.trim().length < 2) {
      newErrors.feature_name = "Feature name must be at least 2 characters";
    } else if (formValues.feature_name.trim().length > 100) {
      newErrors.feature_name = "Feature name must be at most 100 characters";
    }

    if (!formValues.feature_key?.trim()) {
      newErrors.feature_key = "Feature key is required";
    } else if (formValues.feature_key.trim().length < 2) {
      newErrors.feature_key = "Feature key must be at least 2 characters";
    } else if (formValues.feature_key.trim().length > 50) {
      newErrors.feature_key = "Feature key must be at most 50 characters";
    } else if (!/^[a-z_]+$/.test(formValues.feature_key.trim())) {
      newErrors.feature_key =
        "Feature key must contain only lowercase letters and underscores";
    }

    if (!formValues.feature_type) {
      newErrors.feature_type = "Please select a feature type";
    }

    if (!formValues.subscription_feature_categories_id) {
      newErrors.subscription_feature_categories_id =
        "Please select a parent category";
    }

    if (!formValues.is_usage_track) {
      newErrors.is_usage_track = "Please select usage track option";
    }

    if (formValues.options_json && formValues.options_json.trim()) {
      try {
        const parsed =
          typeof formValues.options_json === "string"
            ? JSON.parse(formValues.options_json)
            : formValues.options_json;
      } catch (e) {
        newErrors.options_json = "Invalid JSON format for Options";
      }
    }

    if (formValues.display_order !== "" && formValues.display_order !== null) {
      const num = Number(formValues.display_order);
      if (Number.isNaN(num)) {
        newErrors.display_order = "Display order must be a number";
      } else if (num < 0) {
        newErrors.display_order = "Display order cannot be negative";
      } else if (!Number.isInteger(num)) {
        newErrors.display_order = "Display order must be a whole number";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Switch to relevant tab
      if (
        newErrors.feature_name ||
        newErrors.feature_key ||
        newErrors.feature_type ||
        newErrors.subscription_feature_categories_id
      ) {
        setActiveTab("overview");
      } else if (
        newErrors.display_order ||
        newErrors.options_json ||
        newErrors.is_usage_track
      ) {
        setActiveTab("configuration");
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
      let optionsJson = null;
      if (formValues.options_json) {
        try {
          optionsJson =
            typeof formValues.options_json === "string"
              ? JSON.parse(formValues.options_json)
              : formValues.options_json;
        } catch {
          showError("Invalid JSON format for Options");
          setLoading(false);
          return;
        }
      }

      const submitData = {
        feature_name: formValues.feature_name.trim(),
        feature_key: formValues.feature_key.trim(),
        feature_type: formValues.feature_type || "TEXT",
        subscription_feature_categories_id: parseInt(
          formValues.subscription_feature_categories_id
        ),
        description: formValues.description?.trim() || "",
        default_unit: formValues.default_unit || "",
        default_value: formValues.default_value || "",
        options_json: optionsJson,
        is_usage_track: formValues.is_usage_track || "no",
        is_required: formValues.is_required ? 1 : 0,
        is_display:
          formValues.is_display !== undefined
            ? formValues.is_display
              ? 1
              : 0
            : 1,
        display_order: parseInt(formValues.display_order) || 0,
        status: formValues.status === "active",
        is_trending: formValues.is_trending || false,
      };

      // Icon handling
      if (iconFile instanceof File) {
        submitData.iconFile = iconFile;
      } else if (iconRemoved) {
        submitData.icon = null;
      } else if (data?.icon) {
        submitData.icon = data.icon;
      }

      if (mode === "edit") {
        submitData.updated_by = userId;
        await subscriptionFeatureService.update(id, submitData);
        showSuccess("Feature updated successfully");
      } else {
        submitData.created_by = userId;
        submitData.updated_by = userId;
        await subscriptionFeatureService.create(submitData);
        showSuccess("Feature created successfully");
      }

      navigate("/subscription-features");
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error?.message || error?.response?.data?.message || "Failed to save";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionFeatureService.delete(id);
      showSuccess("Feature deleted successfully");
      setShowDeleteDialog(false);
      navigate("/subscription-features");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this feature because it is being used in other records."
        );
      } else {
        showError(message || "Failed to delete feature");
      }
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Tabs ────────────────────────────────────────────────────
  const TABS = (() => {
    const base = [
      { id: "overview", label: "Overview", icon: MdInfoOutline },
      { id: "configuration", label: "Configuration", icon: MdSettings },
      { id: "media", label: "Media", icon: MdImage },
      { id: "status", label: "Status & Flags", icon: MdFlag },
    ];
    if (mode === "view") {
      base.push({ id: "metadata", label: "Metadata", icon: MdPerson });
    }
    return base;
  })();

  // ─── Loading states ──────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading feature data...</p>
        </div>
      </div>
    );
  }

  if ((mode === "view" || mode === "edit") && !data && !fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center">
          <p className="text-slate-500">Subscription feature not found</p>
          <button
            onClick={() => navigate("/subscription-features")}
            className="mt-3 text-blue-600 hover:underline text-sm font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // ─── Hero helpers ────────────────────────────────────────────
  const heroName = formValues.feature_name?.trim() || "New Feature";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const isViewMode = mode === "view";

  // ─── Category options ────────────────────────────────────────
  const categoryOptions = parentCategories.map((cat) => ({
    value: String(cat.id || cat._id),
    label: cat.category_name || "",
  }));

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Feature Name */}
              <div>
                <FieldLabel required>Feature Name</FieldLabel>
                <div className="relative">
                  <MdExtension
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="feature_name"
                    value={formValues.feature_name}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.feature_name
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="e.g. Job Postings"
                  />
                </div>
                {errors.feature_name ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.feature_name}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Enter a unique name for the feature.
                  </p>
                )}
              </div>

              {/* Feature Key */}
              <div>
                <FieldLabel required>Feature Key</FieldLabel>
                <div className="relative">
                  <MdVpnKey
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="feature_key"
                    value={formValues.feature_key}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all font-mono ${
                      errors.feature_key
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="e.g. job_post_limit"
                  />
                </div>
                {errors.feature_key ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.feature_key}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Lowercase letters and underscores only.
                  </p>
                )}
              </div>

              {/* Feature Type */}
              <div>
                <FieldLabel required>Feature Type</FieldLabel>
                <div className="relative">
                  <MdExtension
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="feature_type"
                    value={formValues.feature_type}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.feature_type
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                  >
                    <option value="COUNT">Count</option>
                    <option value="BOOLEAN">Boolean</option>
                    <option value="DAYS">Days</option>
                    <option value="TEXT">Text</option>
                  </select>
                </div>
                {errors.feature_type && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.feature_type}
                  </p>
                )}
              </div>

              {/* Parent Category */}
              <div>
                <FieldLabel required>Parent Category</FieldLabel>
                <div className="relative">
                  <MdCategory
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="subscription_feature_categories_id"
                    value={formValues.subscription_feature_categories_id}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.subscription_feature_categories_id
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                  >
                    <option value="">Select parent category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.subscription_feature_categories_id && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.subscription_feature_categories_id}
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
                    disabled={isViewMode}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y ${
                      isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                    }`}
                    placeholder="Enter feature description..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "configuration":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Default Unit */}
              <div>
                <FieldLabel>Default Unit</FieldLabel>
                <input
                  type="text"
                  name="default_unit"
                  value={formValues.default_unit}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="e.g. Jobs, Days, Profiles, Credits"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Default unit of measurement for this feature.
                </p>
              </div>

              {/* Display Order */}
              <div>
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
                    disabled={isViewMode}
                    min="0"
                    step="1"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                      errors.display_order
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder="0"
                  />
                </div>
                {errors.display_order ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.display_order}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Order in which the feature should be displayed.
                  </p>
                )}
              </div>

              {/* Track Usage */}
              <div>
                <FieldLabel required>Track Usage</FieldLabel>
                <div className="relative">
                  <MdFlashOn
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="is_usage_track"
                    value={formValues.is_usage_track}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.is_usage_track
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Enable if this feature usage should be tracked.
                </p>
              </div>

              {/* Options JSON */}
              <div className="sm:col-span-2">
                <FieldLabel>Options (JSON)</FieldLabel>
                <div className="relative">
                  <MdCode
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />
                  <textarea
                    name="options_json"
                    value={formValues.options_json}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    rows={4}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y ${
                      errors.options_json
                        ? "border-red-300"
                        : "border-slate-300"
                    } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                    placeholder='{"options": ["Option 1", "Option 2", "Option 3"]}'
                  />
                </div>
                {errors.options_json ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.options_json}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Optional JSON object for dropdown options.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-5">
            <div>
              <FieldLabel>Feature Icon</FieldLabel>
              <div className="flex flex-col items-start gap-3">
                <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Icon"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <MdPhoto size={28} className="text-slate-300" />
                  )}
                </div>
                {!isViewMode && (
                  <>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                      <MdCloudUpload size={16} />
                      {iconPreview ? "Change icon" : "Upload icon"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconFileChange}
                        className="hidden"
                      />
                    </label>
                    {iconPreview && (
                      <button
                        type="button"
                        onClick={handleIconRemove}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                      >
                        <MdClose size={14} />
                        Remove icon
                      </button>
                    )}
                    <p className="text-xs text-slate-500">
                      PNG, JPG, GIF, WEBP, AVIF, SVG – Max 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-xl">
            {/* Status */}
            <div>
              <FieldLabel required>Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {["active", "inactive"].map((status) => (
                  <label
                    key={status}
                    className={`flex items-center gap-2.5 ${
                      isViewMode ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formValues.status === status}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Active features are visible on the pricing page.
              </p>
            </div>

            {/* Required */}
            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Required</FieldLabel>
              <div className="flex items-center gap-3 pt-0.5">
                <Toggle
                  name="is_required"
                  checked={formValues.is_required}
                  onChange={handleInputChange}
                />
                <span className="text-sm text-slate-600">
                  {formValues.is_required
                    ? "Required when creating a plan"
                    : "Not required"}
                </span>
              </div>
            </div>

            {/* Show on Pricing Page */}
            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Show on Pricing Page</FieldLabel>
              <div className="flex items-center gap-3 pt-0.5">
                <Toggle
                  name="is_display"
                  checked={formValues.is_display}
                  onChange={handleInputChange}
                />
                <span className="text-sm text-slate-600">
                  {formValues.is_display
                    ? "Visible on pricing page"
                    : "Hidden from pricing page"}
                </span>
              </div>
            </div>

            {/* Trending */}
            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Trending</FieldLabel>
              <div className="flex items-center gap-3 pt-0.5">
                <Toggle
                  name="is_trending"
                  checked={formValues.is_trending}
                  onChange={handleInputChange}
                />
                <span className="text-sm text-slate-600">
                  {formValues.is_trending
                    ? "Marked as trending"
                    : "Not trending"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Trending features are highlighted in the listing.
              </p>
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
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
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
              onClick={() => navigate("/subscription-features")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Subscription Features
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/subscription-features")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdCancel size={16} />
              {mode === "view" ? "Back" : "Cancel"}
            </button>

            {mode === "view" ? (
              <button
                type="button"
                onClick={() =>
                  navigate(`/subscription-features/edit/${id}`, {
                    state: { item: data },
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
              >
                <MdEdit size={16} />
                Edit Feature
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
                  ? "Update Feature"
                  : "Create Feature"}
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
              {/* Icon / avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt={heroName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdExtension size={24} />}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  <StatusPill status={formValues.status} />
                  {formValues.is_trending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdTrendingUp size={12} />
                      Trending
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {formValues.feature_key && (
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full font-mono">
                      {formValues.feature_key}
                    </span>
                  )}
                  {formValues.parent_category_name && (
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MdCategory size={11} />
                      {formValues.parent_category_name}
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
            <MdExtension size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Type</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {formValues.feature_type || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdFlashOn size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Track Usage
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {formValues.is_usage_track}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdVisibility size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Show on Pricing
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_display ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdWarning size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Required
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_required ? "Yes" : "No"}
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
                      layoutId="sub-feature-tab-underline"
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
                  Delete Feature
                </button>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={() => navigate("/subscription-features")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                >
                  <MdCancel size={16} />
                  {mode === "view" ? "Back" : "Cancel"}
                </button>

                {mode === "view" ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/subscription-features/edit/${id}`, {
                        state: { item: data },
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors w-full sm:w-auto"
                  >
                    <MdEdit size={16} />
                    Edit Feature
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
                    {loading ? "Saving..." : "Update Feature"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/subscription-features")}
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
        title="Delete Subscription Feature"
        message="Delete this feature? This action cannot be undone."
      />
    </div>
  );
};

export default SubscriptionFeaturesForm;