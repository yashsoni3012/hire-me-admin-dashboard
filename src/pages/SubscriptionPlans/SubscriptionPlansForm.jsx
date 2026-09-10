// // pages/subscriptions/SubscriptionPlansForm.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import { ViewBadge } from "../../components/common/FormPageUtils";
// import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const SubscriptionPlansForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const [mode, setMode] = useState("add");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [userNameCache, setUserNameCache] = useState({});
//   const [pageLoading, setPageLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

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
//             const response = await subscriptionPlanService.getById(id);
//             item = response.data?.data || response.data;
//           }

//           // Normalize the data
//           const normalizedData = {
//             id: item.id || item._id,
//             plan_name: item.plan_name || "",
//             plan_code: item.plan_code || "",
//             description: item.description || "",
//             plan_type: item.plan_type || "fixed",
//             duration_days: item.duration_days || 30,
//             price: item.price || 0,
//             gst_percentage: item.gst_percentage || 18,
//             display_order: item.display_order || 1,
//             badge: item.badge || "",
//             is_popular: item.is_popular || false,
//             is_display_in_front:
//               item.is_display_in_front !== undefined
//                 ? item.is_display_in_front
//                 : true,
//             is_free_trial: item.is_free_trial || false,
//             trial_days: item.trial_days || 7,
//             button_text: item.button_text || "Get Started",
//             button_color: item.button_color || "#FFFFFF",
//             background_color: item.background_color || "#2463EB",
//             icon: item.icon || null,
//             is_status: normalizeStatus(item),
//             created_by: item.created_by || "",
//             updated_by: item.updated_by || "",
//             created_at: item.created_at || item.createdAt || null,
//             updated_at: item.updated_at || item.updatedAt || null,
//           };

//           setData(normalizedData);

//           // Set image preview if icon exists
//           if (item.icon) {
//             const iconUrl = getFullImageUrl(item.icon);
//             setImagePreview(iconUrl);
//           }
//         } catch (error) {
//           console.error("Fetch error:", error);
//           showError("Failed to load subscription plan data");
//           navigate("/subscription-plans");
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

//   // Get full image URL
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (typeof value !== "string") return null;

//     if (value.startsWith("http") || value.startsWith("data:image")) {
//       return value;
//     }
//     if (value.startsWith("/uploads/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     if (value.startsWith("./uploads/")) {
//       return `${API_BASE_URL}${value.substring(1)}`;
//     }
//     if (value.startsWith("/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     if (
//       !value.includes("/") &&
//       !value.includes("http") &&
//       !value.startsWith("data:")
//     ) {
//       return `${API_BASE_URL}/uploads/${value}`;
//     }
//     return value;
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

//   // ─── FIX: Handle file selection - UPDATE preview only ─────────────
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
//         showError(
//           "Please upload a valid image file (JPEG, PNG, GIF, WEBP, AVIF, SVG)",
//         );
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         showError("Image size must be less than 5MB");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // ─── FIX: Handle remove file ──────────────────────────────────────
//   const handleRemoveFile = (setFormData) => {
//     setImagePreview(null);
//     setFormData((prev) => ({
//       ...prev,
//       imageFile: null,
//       icon: null,
//     }));
//     // Reset file input
//     const fileInput = document.getElementById("icon-upload");
//     if (fileInput) {
//       fileInput.value = "";
//     }
//   };

//   // ─── FIX: Custom icon field render ───────────────────────────────
//   const renderIconField = (field, formData, setFormData) => {
//     const isViewMode = mode === "view";
//     const hasExistingIcon = formData.icon && typeof formData.icon === "string";
//     const hasNewFile = formData.imageFile instanceof File;
//     const previewUrl = hasNewFile
//       ? URL.createObjectURL(formData.imageFile)
//       : imagePreview;

//     return (
//       <div className="space-y-3">
//         <div className="flex items-center gap-4">
//           {previewUrl ? (
//             <div className="relative">
//               <img
//                 src={previewUrl}
//                 alt="Plan icon preview"
//                 className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
//               />
//               {!isViewMode && (
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveFile(setFormData)}
//                   className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
//               <svg
//                 className="w-8 h-8 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//             </div>
//           )}

//           {!isViewMode && (
//             <div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     handleFileChange(file);
//                     // ─── FIX: Store file in formData for FormPage ──
//                     setFormData((prev) => ({
//                       ...prev,
//                       imageFile: file,
//                     }));
//                   }
//                 }}
//                 className="hidden"
//                 id="icon-upload"
//               />
//               <label
//                 htmlFor="icon-upload"
//                 className="px-4 py-2 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium inline-flex items-center gap-2"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
//                   />
//                 </svg>
//                 Choose Image
//               </label>
//               <p className="mt-1 text-xs text-gray-400">
//                 JPEG, PNG, GIF, WEBP, AVIF, SVG (Max 5MB)
//               </p>
//               {hasExistingIcon && !previewUrl && (
//                 <p className="mt-1 text-xs text-blue-500">
//                   Current image: {formData.icon}
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ─── FIX: View render for icon ────────────────────────────────────
//   const viewIconRender = (value) => {
//     if (!value) return "—";
//     const url = getFullImageUrl(value);
//     return (
//       <div className="relative group">
//         <img
//           src={url}
//           alt="Plan icon"
//           className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//           onError={(e) => {
//             e.target.style.display = "none";
//             e.target.parentElement.innerHTML =
//               '<span class="text-gray-400">Invalid image</span>';
//           }}
//         />
//         <button
//           onClick={() => window.open(url, "_blank")}
//           className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//         >
//           <span className="text-sm">View</span>
//         </button>
//       </div>
//     );
//   };

//   // ─── FIX: Define fields with proper icon handling ────────────────
//   const getFields = () => {
//     const planTypeOptions = [
//       { value: "fixed", label: "Fixed" },
//       { value: "recurring", label: "Recurring" },
//       { value: "custom", label: "Custom" },
//     ];

//     const baseFields = [
//       {
//         name: "plan_name",
//         label: "Plan Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Basic, Pro, Enterprise",
//         help: "Enter the plan name",
//         viewRender: (value) => (
//           <span className="font-medium text-lg">{value}</span>
//         ),
//       },
//       {
//         name: "plan_code",
//         label: "Plan Code",
//         type: "text",
//         required: true,
//         placeholder: "e.g. BASIC, PRO, ENT",
//         help: "Enter a unique plan code",
//         viewRender: (value) => <span className="font-mono">{value}</span>,
//       },
//       {
//         name: "description",
//         label: "Description",
//         type: "textarea",
//         required: false,
//         placeholder: "Describe the plan features...",
//         help: "Enter the plan description",
//         rows: 3,
//         viewRender: (value) => value || "—",
//       },
//       // ─── FIX: Icon field with proper file handling ──────────────
//       {
//         name: "icon",
//         label: "Plan Icon",
//         type: "file",
//         required: false,
//         accept: "image/*",
//         maxSize: 5,
//         help: "Upload a plan icon (JPEG, PNG, GIF, WEBP, AVIF, SVG) - Max 5MB",
//         // ─── FIX: Use custom render function ──────────────────────
//         render: renderIconField,
//         viewRender: viewIconRender,
//       },
//       {
//         name: "plan_type",
//         label: "Plan Type",
//         type: "select",
//         required: true,
//         options: planTypeOptions,
//         placeholder: "Select plan type",
//         help: "Select the type of plan",
//         viewRender: (value) => (
//           <span className="capitalize">{value || "-"}</span>
//         ),
//       },
//       {
//         name: "price",
//         label: "Price",
//         type: "number",
//         required: true,
//         placeholder: "e.g. 99.99",
//         help: "Enter the plan price",
//         min: 0,
//         step: 0.01,
//         viewRender: (value) => `₹${parseFloat(value || 0).toFixed(2)}`,
//       },
//       {
//         name: "duration_days",
//         label: "Duration (Days)",
//         type: "number",
//         required: true,
//         placeholder: "e.g. 30",
//         help: "Enter the plan duration in days",
//         min: 1,
//         step: 1,
//         viewRender: (value) => `${value || 30} days`,
//       },
//       {
//         name: "gst_percentage",
//         label: "GST Percentage",
//         type: "number",
//         required: false,
//         placeholder: "e.g. 18",
//         help: "Enter the GST percentage",
//         min: 0,
//         max: 100,
//         step: 0.01,
//         viewRender: (value) => `${value || 18}%`,
//       },
//       {
//         name: "badge",
//         label: "Badge Text",
//         type: "text",
//         required: false,
//         placeholder: "e.g. Popular, Best Value",
//         help: "Enter a badge to highlight the plan",
//         viewRender: (value) => {
//           if (!value) return "—";
//           return (
//             <span className="inline-flex items-center px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
//               {value}
//             </span>
//           );
//         },
//       },
//       {
//         name: "display_order",
//         label: "Display Order",
//         type: "number",
//         required: false,
//         placeholder: "e.g. 1",
//         help: "Enter the display order",
//         min: 1,
//         step: 1,
//         viewRender: (value) => value || 1,
//       },
//       {
//         name: "is_popular",
//         label: "Mark as Popular",
//         type: "checkbox",
//         color: "text-yellow-500 focus:ring-yellow-500",
//         help: "Popular plans will be highlighted",
//         viewRender: (value) => (
//           <span
//             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//               value
//                 ? "bg-yellow-50 text-yellow-700"
//                 : "bg-gray-100 text-gray-500"
//             }`}
//           >
//             <span
//               className={`w-1.5 h-1.5 rounded-full ${value ? "bg-yellow-500" : "bg-gray-400"}`}
//             />
//             {value ? "Popular" : "Not Popular"}
//           </span>
//         ),
//       },
//       {
//         name: "is_display_in_front",
//         label: "Display on Frontend",
//         type: "checkbox",
//         color: "text-green-500 focus:ring-green-500",
//         help: "Show this plan on the frontend",
//         viewRender: (value) => (
//           <span
//             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//               value ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
//             }`}
//           >
//             <span
//               className={`w-1.5 h-1.5 rounded-full ${value ? "bg-green-500" : "bg-gray-400"}`}
//             />
//             {value ? "Display" : "Hidden"}
//           </span>
//         ),
//       },
//       {
//         name: "is_free_trial",
//         label: "Enable Free Trial",
//         type: "checkbox",
//         color: "text-[#4529f7] focus:ring-[#4529f7]",
//         help: "Allow free trial for this plan",
//         viewRender: (value, row) => {
//           if (!value) return "No";
//           return (
//             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
//               Yes ({row?.trial_days || 7} days)
//             </span>
//           );
//         },
//       },
//       {
//         name: "trial_days",
//         label: "Trial Days",
//         type: "number",
//         required: false,
//         placeholder: "e.g. 7",
//         help: "Enter the free trial duration in days",
//         min: 1,
//         step: 1,
//         condition: (formValues) => formValues.is_free_trial === true,
//         viewRender: (value, row) =>
//           row?.is_free_trial ? `${value || 7} days` : "—",
//       },
//       {
//         name: "button_text",
//         label: "Button Text",
//         type: "text",
//         required: false,
//         placeholder: "e.g. Get Started",
//         help: "Enter the button text",
//         viewRender: (value) => value || "Get Started",
//       },
//       {
//         name: "button_color",
//         label: "Button Color",
//         type: "color",
//         required: false,
//         help: "Select the button color",
//         viewRender: (value) => {
//           if (!value) return "—";
//           return (
//             <div className="flex items-center gap-2">
//               <div
//                 className="w-6 h-6 rounded border border-gray-200"
//                 style={{ backgroundColor: value }}
//               />
//               <span>{value}</span>
//             </div>
//           );
//         },
//       },
//       {
//         name: "background_color",
//         label: "Background Color",
//         type: "color",
//         required: false,
//         help: "Select the background color",
//         viewRender: (value) => {
//           if (!value) return "—";
//           return (
//             <div className="flex items-center gap-2">
//               <div
//                 className="w-6 h-6 rounded border border-gray-200"
//                 style={{ backgroundColor: value }}
//               />
//               <span>{value}</span>
//             </div>
//           );
//         },
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
//         viewRender: (value, row) => {
//           const isActive = getStatusValue(row);
//           return <ViewBadge active={isActive} />;
//         },
//       },
//     ];

//     // Only add audit fields in view mode
//     if (mode === "view") {
//       const auditFields = [
//         {
//           name: "created_by",
//           label: "Created By",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => getUserNameCached(value),
//         },
//         {
//           name: "updated_by",
//           label: "Updated By",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => getUserNameCached(value),
//         },
//         {
//           name: "created_at",
//           label: "Created At",
//           type: "text",
//           disabled: true,
//           viewRender: (value) => formatDate(value),
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

//   // ─── FIX: Validation rules ────────────────────────────────────────
//   const getValidationRules = (existingData) => ({
//     plan_name: {
//       required: true,
//       requiredMessage: "Plan name is required",
//       minLength: 2,
//       minLengthMessage: "Plan name must be at least 2 characters",
//       maxLength: 100,
//       maxLengthMessage: "Plan name must be at most 100 characters",
//     },
//     plan_code: {
//       required: true,
//       requiredMessage: "Plan code is required",
//       minLength: 2,
//       minLengthMessage: "Plan code must be at least 2 characters",
//       maxLength: 20,
//       maxLengthMessage: "Plan code must be at most 20 characters",
//       pattern: /^[A-Za-z0-9_\-]+$/,
//       patternMessage:
//         "Plan code can only contain letters, numbers, underscores and hyphens",
//     },
//     price: {
//       required: true,
//       requiredMessage: "Price is required",
//       min: 0,
//       minMessage: "Price must be greater than or equal to 0",
//     },
//     duration_days: {
//       required: true,
//       requiredMessage: "Duration is required",
//       min: 1,
//       minMessage: "Duration must be at least 1 day",
//     },
//     plan_type: {
//       required: true,
//       requiredMessage: "Please select a plan type",
//     },
//     trial_days: {
//       required: false,
//       min: 1,
//       minMessage: "Trial days must be at least 1",
//       custom: (value, formData) => {
//         if (formData?.is_free_trial) {
//           const num = Number(value);
//           if (!value || value === "" || isNaN(num) || num < 1) {
//             return "Trial days is required when free trial is enabled";
//           }
//         }
//         return null;
//       },
//     },
//   });

//   // ─── FIX: Submit handler - Read imageFile from FormPage ──────────
//   const handleSubmit = async (formData) => {
//     setLoading(true);

//     try {
//       const submitData = {
//         plan_name: formData.plan_name.trim(),
//         plan_code: formData.plan_code.trim().toUpperCase(),
//         description: formData.description?.trim() || "",
//         plan_type: formData.plan_type || "fixed",
//         duration_days: parseInt(formData.duration_days) || 30,
//         price: parseFloat(formData.price) || 0,
//         gst_percentage: parseFloat(formData.gst_percentage) || 18,
//         display_order: parseInt(formData.display_order) || 1,
//         badge: formData.badge?.trim() || "",
//         is_popular: formData.is_popular || false,
//         is_display_in_front:
//           formData.is_display_in_front !== undefined
//             ? formData.is_display_in_front
//             : true,
//         is_free_trial: formData.is_free_trial || false,
//         trial_days: formData.is_free_trial
//           ? parseInt(formData.trial_days) || 7
//           : 0,
//         button_text: formData.button_text?.trim() || "Get Started",
//         button_color: formData.button_color || "#FFFFFF",
//         background_color: formData.background_color || "#2463EB",
//         status: formData.status === "active",
//       };

//       // ─── FIX: FormPage sends the file as `${fieldName}File`. Since our
//       // file field is named "icon", FormPage produces `formData.iconFile`
//       // (not `imageFile`) — check the key FormPage actually sets.
//       if (formData.iconFile instanceof File) {
//         submitData.iconFile = formData.iconFile;
//         console.log("📸 New image file from FormPage:", formData.iconFile.name);
//       } else if (mode === "edit" && data?.icon) {
//         // No new file selected — keep existing icon
//         submitData.icon = data.icon;
//       }

//       console.log("📤 Submitting data:", submitData);

//       if (mode === "edit") {
//         await subscriptionPlanService.update(id, submitData);
//         showSuccess("Subscription plan updated successfully");
//       } else {
//         await subscriptionPlanService.create(submitData);
//         showSuccess("Subscription plan created successfully");
//       }

//       navigate("/subscription-plans");
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
//       await subscriptionPlanService.delete(id);
//       showSuccess("Subscription plan deleted successfully");
//       navigate("/subscription-plans");
//     } catch (error) {
//       console.error("Delete error:", error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError(
//           "Cannot delete this plan because it is being used in other records.",
//         );
//       } else {
//         showError(message || "Failed to delete plan");
//       }
//       throw error;
//     }
//   };

//   // Prepare initial data
//   const getInitialData = () => {
//     if (mode === "add") {
//       return {
//         plan_name: "",
//         plan_code: "",
//         description: "",
//         icon: null,
//         plan_type: "fixed",
//         price: "",
//         duration_days: 30,
//         gst_percentage: 18,
//         badge: "",
//         display_order: 1,
//         is_popular: false,
//         is_display_in_front: true,
//         is_free_trial: false,
//         trial_days: 7,
//         button_text: "Get Started",
//         button_color: "#FFFFFF",
//         background_color: "#2463EB",
//         status: "active",
//       };
//     }

//     if (data) {
//       const initialData = {
//         plan_name: data.plan_name || "",
//         plan_code: data.plan_code || "",
//         description: data.description || "",
//         icon: data.icon || null,
//         plan_type: data.plan_type || "fixed",
//         price: data.price?.toString() || "",
//         duration_days: data.duration_days || 30,
//         gst_percentage: data.gst_percentage || 18,
//         badge: data.badge || "",
//         display_order: data.display_order || 1,
//         is_popular: data.is_popular || false,
//         is_display_in_front:
//           data.is_display_in_front !== undefined
//             ? data.is_display_in_front
//             : true,
//         is_free_trial: data.is_free_trial || false,
//         trial_days: data.trial_days || 7,
//         button_text: data.button_text || "Get Started",
//         button_color: data.button_color || "#FFFFFF",
//         background_color: data.background_color || "#2463EB",
//         status: getStatusValue(data) ? "active" : "inactive",
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
//       plan_name: "",
//       plan_code: "",
//       description: "",
//       icon: null,
//       plan_type: "fixed",
//       price: "",
//       duration_days: 30,
//       gst_percentage: 18,
//       badge: "",
//       display_order: 1,
//       is_popular: false,
//       is_display_in_front: true,
//       is_free_trial: false,
//       trial_days: 7,
//       button_text: "Get Started",
//       button_color: "#FFFFFF",
//       background_color: "#2463EB",
//       status: "active",
//     };
//   };

//   // Get title based on mode
//   const getTitle = () => {
//     if (mode === "view") return "Subscription Plan Details";
//     if (mode === "edit") return "Edit Subscription Plan";
//     return "Add New Subscription Plan";
//   };

//   // Get submit label
//   const getSubmitLabel = () => {
//     if (mode === "edit") return "Update Plan";
//     return "Create Plan";
//   };

//   // Handle loading state
//   if (pageLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-3 text-gray-500">Loading plan data...</p>
//         </div>
//       </div>
//     );
//   }

//   // If view/edit mode and data not loaded, show error
//   if ((mode === "view" || mode === "edit") && !data && !pageLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500">Subscription plan not found</p>
//           <button
//             onClick={() => navigate("/subscription-plans")}
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
//       navigateTo="/subscription-plans"
//       submitLabel={getSubmitLabel()}
//       editLabel="Edit Plan"
//       deleteLabel="Delete Plan"
//       loading={loading}
//       showDelete={mode !== "add"}
//       showEdit={mode === "view"}
//       enableEditMode={mode === "view"}
//       breadcrumb={
//         mode === "view"
//           ? "Viewing plan details"
//           : mode === "edit"
//             ? "Updating plan"
//             : "Creating new plan"
//       }
//       onEdit={() =>
//         navigate(`/subscription-plans/edit/${id}`, { state: { item: data } })
//       }
//     />
//   );
// };

// export default SubscriptionPlansForm;

// pages/subscriptions/SubscriptionPlansForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/md";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import { ViewBadge } from "../../components/common/FormPageUtils";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Helper: Get full image URL ──────────────────────────────
const getFullImageUrl = (value) => {
  if (!value) return null;
  if (typeof value !== "string") return null;
  if (value.startsWith("http") || value.startsWith("data:image")) return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("./uploads/")) return `${API_BASE_URL}${value.substring(1)}`;
  if (value.startsWith("/")) return `${API_BASE_URL}${value}`;
  if (!value.includes("/") && !value.includes("http") && !value.startsWith("data:")) {
    return `${API_BASE_URL}/uploads/${value}`;
  }
  return value;
};

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
  { id: "overview", label: "Overview", icon: MdApartment },
  { id: "pricing", label: "Pricing & Trial", icon: MdAttachMoney },
  { id: "display", label: "Display & Branding", icon: MdCategory },
  { id: "status", label: "Status & Activity", icon: MdInfo },
];

// ─── Main Component ──────────────────────────────────────────
const SubscriptionPlansForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Determine mode from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/view/")) {
      setMode("view");
    } else if (path.includes("/edit/")) {
      setMode("edit");
    } else {
      setMode("add");
    }
  }, [location.pathname]);

  // Fetch users for display names
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[id] = users[id].name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  // Fetch data for edit/view modes
  useEffect(() => {
    const fetchData = async () => {
      if ((mode === "edit" || mode === "view") && id) {
        setPageLoading(true);
        try {
          let item = location.state?.item;

          if (!item) {
            const response = await subscriptionPlanService.getById(id);
            item = response.data?.data || response.data;
          }

          // Normalize the data
          const normalizedData = {
            id: item.id || item._id,
            plan_name: item.plan_name || "",
            plan_code: item.plan_code || "",
            description: item.description || "",
            plan_type: item.plan_type || "fixed",
            duration_days: item.duration_days || 30,
            price: item.price || 0,
            gst_percentage: item.gst_percentage || 18,
            display_order: item.display_order || 1,
            badge: item.badge || "",
            is_popular: item.is_popular || false,
            is_display_in_front:
              item.is_display_in_front !== undefined
                ? item.is_display_in_front
                : true,
            is_free_trial: item.is_free_trial || false,
            trial_days: item.trial_days || 7,
            button_text: item.button_text || "Get Started",
            button_color: item.button_color || "#FFFFFF",
            background_color: item.background_color || "#2463EB",
            icon: item.icon || null,
            is_status: normalizeStatus(item),
            created_by: item.created_by || "",
            updated_by: item.updated_by || "",
            created_at: item.created_at || item.createdAt || null,
            updated_at: item.updated_at || item.updatedAt || null,
          };

          setData(normalizedData);

          // Set image preview if icon exists
          if (item.icon) {
            const iconUrl = getFullImageUrl(item.icon);
            setImagePreview(iconUrl);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          showError("Failed to load subscription plan data");
          navigate("/subscription-plans");
        } finally {
          setPageLoading(false);
        }
      }
    };
    fetchData();
  }, [id, mode, location.state, navigate]);

  // Helper function to normalize status
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
  const [fileIcon, setFileIcon] = useState(null);

  // Initialize form values when data changes
  useEffect(() => {
    const initial = getInitialData();
    setFormValues(initial);
    if (initial.icon) {
      setImagePreview(getFullImageUrl(initial.icon));
    }
  }, [data, mode]);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (file) => {
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/avif",
        "image/svg+xml",
      ];
      if (!validTypes.includes(file.type)) {
        showError(
          "Please upload a valid image file (JPEG, PNG, GIF, WEBP, AVIF, SVG)",
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showError("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFileIcon(file);
      setFormValues((prev) => ({
        ...prev,
        icon: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveIcon = () => {
    setImagePreview(null);
    setFileIcon(null);
    setFormValues((prev) => ({
      ...prev,
      icon: null,
    }));
    const fileInput = document.getElementById("icon-upload");
    if (fileInput) fileInput.value = "";
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    if (!formValues.plan_name?.trim()) {
      showError("Plan name is required");
      return false;
    }
    if (formValues.plan_name.trim().length < 2) {
      showError("Plan name must be at least 2 characters");
      return false;
    }
    if (!formValues.plan_code?.trim()) {
      showError("Plan code is required");
      return false;
    }
    if (!/^[A-Za-z0-9_\-]+$/.test(formValues.plan_code)) {
      showError("Plan code can only contain letters, numbers, underscores and hyphens");
      return false;
    }
    if (!formValues.price || isNaN(parseFloat(formValues.price)) || parseFloat(formValues.price) < 0) {
      showError("Price must be a valid number greater than or equal to 0");
      return false;
    }
    if (!formValues.duration_days || parseInt(formValues.duration_days) < 1) {
      showError("Duration must be at least 1 day");
      return false;
    }
    if (formValues.is_free_trial) {
      const trial = parseInt(formValues.trial_days);
      if (!formValues.trial_days || isNaN(trial) || trial < 1) {
        showError("Trial days is required when free trial is enabled");
        return false;
      }
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
        plan_name: formValues.plan_name.trim(),
        plan_code: formValues.plan_code.trim().toUpperCase(),
        description: formValues.description?.trim() || "",
        plan_type: formValues.plan_type || "fixed",
        duration_days: parseInt(formValues.duration_days) || 30,
        price: parseFloat(formValues.price) || 0,
        gst_percentage: parseFloat(formValues.gst_percentage) || 18,
        display_order: parseInt(formValues.display_order) || 1,
        badge: formValues.badge?.trim() || "",
        is_popular: formValues.is_popular || false,
        is_display_in_front:
          formValues.is_display_in_front !== undefined
            ? formValues.is_display_in_front
            : true,
        is_free_trial: formValues.is_free_trial || false,
        trial_days: formValues.is_free_trial
          ? parseInt(formValues.trial_days) || 7
          : 0,
        button_text: formValues.button_text?.trim() || "Get Started",
        button_color: formValues.button_color || "#FFFFFF",
        background_color: formValues.background_color || "#2463EB",
        is_status: formValues.status === "active",
      };

      // Handle icon
      if (fileIcon instanceof File) {
        submitData.iconFile = fileIcon;
      } else if (mode === "edit" && data?.icon) {
        submitData.icon = data.icon;
      }

      console.log("📤 Submitting data:", submitData);

      if (mode === "edit") {
        await subscriptionPlanService.update(id, submitData);
        showSuccess("Subscription plan updated successfully");
      } else {
        await subscriptionPlanService.create(submitData);
        showSuccess("Subscription plan created successfully");
      }

      navigate("/subscription-plans");
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
      await subscriptionPlanService.delete(id);
      showSuccess("Subscription plan deleted successfully");
      navigate("/subscription-plans");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this plan because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete plan");
      }
      throw error;
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  // ─── Helpers for initial data ──────────────────────────────
  const getInitialData = () => {
    if (mode === "add") {
      return {
        plan_name: "",
        plan_code: "",
        description: "",
        icon: null,
        plan_type: "fixed",
        price: "",
        duration_days: 30,
        gst_percentage: 18,
        badge: "",
        display_order: 1,
        is_popular: false,
        is_display_in_front: true,
        is_free_trial: false,
        trial_days: 7,
        button_text: "Get Started",
        button_color: "#FFFFFF",
        background_color: "#2463EB",
        status: "active",
      };
    }

    if (data) {
      const initialData = {
        plan_name: data.plan_name || "",
        plan_code: data.plan_code || "",
        description: data.description || "",
        icon: data.icon || null,
        plan_type: data.plan_type || "fixed",
        price: data.price?.toString() || "",
        duration_days: data.duration_days || 30,
        gst_percentage: data.gst_percentage || 18,
        badge: data.badge || "",
        display_order: data.display_order || 1,
        is_popular: data.is_popular || false,
        is_display_in_front:
          data.is_display_in_front !== undefined
            ? data.is_display_in_front
            : true,
        is_free_trial: data.is_free_trial || false,
        trial_days: data.trial_days || 7,
        button_text: data.button_text || "Get Started",
        button_color: data.button_color || "#FFFFFF",
        background_color: data.background_color || "#2463EB",
        status: getStatusValue(data) ? "active" : "inactive",
      };

      if (mode === "view") {
        initialData.created_by = data.created_by;
        initialData.updated_by = data.updated_by;
        initialData.created_at = data.created_at;
        initialData.updated_at = data.updated_at;
      }

      return initialData;
    }

    return {};
  };

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  const planName = formValues.plan_name?.trim() || "New Plan";
  const planCode = formValues.plan_code || "";
  const priceDisplay = formValues.price ? `₹${parseFloat(formValues.price).toFixed(2)}` : "—";
  const durationDisplay = formValues.duration_days ? `${formValues.duration_days} days` : "—";
  const statusValue = formValues.status || "active";
  const isPopular = formValues.is_popular || false;
  const badgeText = formValues.badge || "";

  // ─── Render tab content ──────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel required>Plan Name</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>{formValues.plan_name || "—"}</ReadOnlyValue>
                ) : (
                  <input
                    type="text"
                    name="plan_name"
                    value={formValues.plan_name || ""}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    placeholder="e.g. Basic, Pro, Enterprise"
                  />
                )}
              </div>

              <div>
                <FieldLabel required>Plan Code</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>{formValues.plan_code || "—"}</ReadOnlyValue>
                ) : (
                  <input
                    type="text"
                    name="plan_code"
                    value={formValues.plan_code || ""}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    placeholder="e.g. BASIC, PRO"
                  />
                )}
              </div>

              <div>
                <FieldLabel>Badge Text</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>
                    {formValues.badge ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                        {formValues.badge}
                      </span>
                    ) : (
                      "—"
                    )}
                  </ReadOnlyValue>
                ) : (
                  <input
                    type="text"
                    name="badge"
                    value={formValues.badge || ""}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    placeholder="e.g. Popular, Best Value"
                  />
                )}
              </div>
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              {isViewMode ? (
                <ReadOnlyValue>{formValues.description || "—"}</ReadOnlyValue>
              ) : (
                <textarea
                  name="description"
                  value={formValues.description || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors resize-y"
                  placeholder="Describe the plan features..."
                />
              )}
            </div>

            <div>
              <FieldLabel>Plan Icon</FieldLabel>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Plan icon"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-slate-200 shadow-sm"
                    />
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={handleRemoveIcon}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <MdClose size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <MdImage size={28} className="text-slate-400" />
                  </div>
                )}
                {!isViewMode && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                      className="hidden"
                      id="icon-upload"
                    />
                    <label
                      htmlFor="icon-upload"
                      className="px-4 py-2 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium inline-flex items-center gap-2"
                    >
                      <MdCloudUpload size={16} />
                      Choose Image
                    </label>
                    <p className="mt-1 text-xs text-slate-400">
                      JPEG, PNG, GIF, WEBP, AVIF, SVG (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel required>Price (₹)</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>{priceDisplay}</ReadOnlyValue>
                ) : (
                  <input
                    type="number"
                    name="price"
                    value={formValues.price || ""}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    placeholder="e.g. 99.99"
                    min="0"
                    step="0.01"
                  />
                )}
              </div>

              <div>
                <FieldLabel required>Duration (Days)</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>{durationDisplay}</ReadOnlyValue>
                ) : (
                  <input
                    type="number"
                    name="duration_days"
                    value={formValues.duration_days || ""}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    placeholder="e.g. 30"
                    min="1"
                    step="1"
                  />
                )}
              </div>

              <div>
                <FieldLabel>GST Percentage</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>{formValues.gst_percentage ? `${formValues.gst_percentage}%` : "—"}</ReadOnlyValue>
                ) : (
                  <input
                    type="number"
                    name="gst_percentage"
                    value={formValues.gst_percentage || ""}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    placeholder="e.g. 18"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                )}
              </div>

              <div>
                <FieldLabel>Plan Type</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>
                    <span className="capitalize">{formValues.plan_type || "fixed"}</span>
                  </ReadOnlyValue>
                ) : (
                  <select
                    name="plan_type"
                    value={formValues.plan_type || "fixed"}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="recurring">Recurring</option>
                    <option value="custom">Custom</option>
                  </select>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <div className="flex items-center gap-3">
                {isViewMode ? (
                  <ReadOnlyValue>
                    {formValues.is_free_trial ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        Yes ({formValues.trial_days || 7} days)
                      </span>
                    ) : (
                      "No"
                    )}
                  </ReadOnlyValue>
                ) : (
                  <>
                    <Toggle
                      name="is_free_trial"
                      checked={formValues.is_free_trial}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-slate-600">
                      {formValues.is_free_trial ? "Enabled" : "Disabled"}
                    </span>
                  </>
                )}
              </div>
              {formValues.is_free_trial && (
                <div className="mt-3">
                  <FieldLabel required={formValues.is_free_trial}>Trial Days</FieldLabel>
                  {isViewMode ? (
                    <ReadOnlyValue>{formValues.trial_days || 7} days</ReadOnlyValue>
                  ) : (
                    <input
                      type="number"
                      name="trial_days"
                      value={formValues.trial_days || ""}
                      onChange={handleInputChange}
                      className="w-full max-w-xs px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                      placeholder="e.g. 7"
                      min="1"
                      step="1"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "display":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Button Text</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>{formValues.button_text || "Get Started"}</ReadOnlyValue>
                ) : (
                  <input
                    type="text"
                    name="button_text"
                    value={formValues.button_text || ""}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    placeholder="e.g. Get Started"
                  />
                )}
              </div>

              <div>
                <FieldLabel>Display Order</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>{formValues.display_order || 1}</ReadOnlyValue>
                ) : (
                  <input
                    type="number"
                    name="display_order"
                    value={formValues.display_order || ""}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    placeholder="e.g. 1"
                    min="1"
                    step="1"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Button Color</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>
                    {formValues.button_color ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-slate-200"
                          style={{ backgroundColor: formValues.button_color }}
                        />
                        <span>{formValues.button_color}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </ReadOnlyValue>
                ) : (
                  <input
                    type="color"
                    name="button_color"
                    value={formValues.button_color || "#FFFFFF"}
                    onChange={handleInputChange}
                    className="w-full h-10 px-2 py-1 border border-slate-300 rounded-lg cursor-pointer"
                  />
                )}
              </div>

              <div>
                <FieldLabel>Background Color</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>
                    {formValues.background_color ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-slate-200"
                          style={{ backgroundColor: formValues.background_color }}
                        />
                        <span>{formValues.background_color}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </ReadOnlyValue>
                ) : (
                  <input
                    type="color"
                    name="background_color"
                    value={formValues.background_color || "#2463EB"}
                    onChange={handleInputChange}
                    className="w-full h-10 px-2 py-1 border border-slate-300 rounded-lg cursor-pointer"
                  />
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5 space-y-4">
              <div>
                <FieldLabel>Mark as Popular</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        formValues.is_popular
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${formValues.is_popular ? "bg-yellow-500" : "bg-slate-400"}`}
                      />
                      {formValues.is_popular ? "Popular" : "Not Popular"}
                    </span>
                  </ReadOnlyValue>
                ) : (
                  <div className="flex items-center gap-3">
                    <Toggle
                      name="is_popular"
                      checked={formValues.is_popular}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-slate-600">
                      {formValues.is_popular ? "Marked as popular" : "Not popular"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <FieldLabel>Display on Frontend</FieldLabel>
                {isViewMode ? (
                  <ReadOnlyValue>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        formValues.is_display_in_front
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${formValues.is_display_in_front ? "bg-green-500" : "bg-slate-400"}`}
                      />
                      {formValues.is_display_in_front ? "Display" : "Hidden"}
                    </span>
                  </ReadOnlyValue>
                ) : (
                  <div className="flex items-center gap-3">
                    <Toggle
                      name="is_display_in_front"
                      checked={formValues.is_display_in_front}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-slate-600">
                      {formValues.is_display_in_front ? "Visible on frontend" : "Hidden on frontend"}
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
          <p className="text-sm text-slate-400">Loading plan data...</p>
        </div>
      </div>
    );
  }

  if ((mode === "view" || mode === "edit") && !data && !pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
          <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Plan not found</p>
          <button
            onClick={() => navigate("/subscription-plans")}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MdArrowBack size={16} />
            Back to plans
          </button>
        </div>
      </div>
    );
  }

  const heroName = planName;
  const initials = planName
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
              onClick={() => navigate("/subscription-plans")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">Subscription Plans</p>
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
                    aria-label="Delete plan"
                    title="Delete plan"
                  >
                    <MdDelete size={19} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/subscription-plans/edit/${id}`, {
                      state: { item: data },
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
                >
                  <MdSave size={16} />
                  Edit Plan
                </button>
              </>
            ) : (
              <>
                {mode !== "add" && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete plan"
                    title="Delete plan"
                  >
                    <MdDelete size={19} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate("/subscription-plans")}
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
                  {loading ? "Saving..." : isEditMode ? "Update Plan" : "Create Plan"}
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
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Plan icon"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdApartment size={22} />}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {heroName}
                  </h1>
                  {badgeText && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-400/20 text-yellow-300 ring-1 ring-yellow-400/30">
                      <MdStar size={12} />
                      {badgeText}
                    </span>
                  )}
                  {isPopular && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdTrendingUp size={12} />
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <StatusPill status={statusValue} />
                  <span className="text-xs text-white/70">Code: {planCode || "—"}</span>
                  <span className="text-xs text-white/70">• {priceDisplay}</span>
                  <span className="text-xs text-white/70">• {durationDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Price</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{priceDisplay}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdInfo size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Duration</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{durationDisplay}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Type</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">{formValues.plan_type || "fixed"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdStar size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Trial</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_free_trial ? `${formValues.trial_days || 7} days` : "No"}
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
                    active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="subscription-tab-underline"
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
            onClick={() => navigate("/subscription-plans")}
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
                  <h3 className="text-base font-semibold text-slate-800">Delete Plan?</h3>
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
                  Keep plan
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deleteLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  {deleteLoading ? "Deleting..." : "Delete plan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionPlansForm;