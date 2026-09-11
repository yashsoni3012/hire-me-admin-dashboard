// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { MdArrowBack, MdSave, MdCancel } from "react-icons/md";
// import companyService from "../../services/company.service";
// import subIndustryService from "../../services/subIndustry.service";
// import { useAuth } from "../../context/AuthContext";
// import { showSuccess, showError } from "../../utils/toast";
// import { Editor } from "@tinymce/tinymce-react";

// const API_BASE =
//   import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// // Helper: build full image URL (only used for previews)
// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http://") || path.startsWith("https://")) return path;
//   return `${API_BASE}${path}`;
// };

// const AddCompany = () => {
//   const navigate = useNavigate();
//   const { user, token } = useAuth();
//   const userId = user?.id || 1;
//   const [loading, setLoading] = useState(false);

//   // ─── Dropdown data states ────────────────────────────────────
//   const [companyUsers, setCompanyUsers] = useState([]);
//   const [companySizes, setCompanySizes] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [subIndustries, setSubIndustries] = useState([]);
//   const [loadingData, setLoadingData] = useState(true);

//   const extractList = (response) => {
//     let value = response;
//     for (let depth = 0; depth < 4 && value; depth += 1) {
//       if (Array.isArray(value)) return value;
//       value = value.data || value.results || value.items;
//     }
//     return [];
//   };

//   // ─── Load dropdown data ──────────────────────────────────────
//   useEffect(() => {
//     const loadDropdownData = async () => {
//       try {
//         const [usersRes, sizesRes, industriesRes, subIndustriesRes] =
//           await Promise.all([
//             companyService.getCompanyUsers(),
//             companyService.getCompanySizes(),
//             companyService.getIndustries(),
//             subIndustryService.getAll(),
//           ]);

//         setCompanyUsers(extractList(usersRes));
//         setCompanySizes(extractList(sizesRes));
//         setIndustries(extractList(industriesRes));
//         setSubIndustries(extractList(subIndustriesRes));
//       } catch (err) {
//         console.error("Error loading dropdown data:", err);
//         showError("Failed to load dropdown data");
//       } finally {
//         setLoadingData(false);
//       }
//     };
//     loadDropdownData();
//   }, []);

//   // ─── Form state ──────────────────────────────────────────────
//   const [formValues, setFormValues] = useState({
//     company_name: "",
//     slug: "",
//     website: "",
//     founded_year: "",
//     about_company: "",
//     gst_number: "",
//     company_user_id: "",
//     industry_id: "",
//     sub_industry_id: "",
//     company_size_id: "",
//     logo: null,
//     banner_image: null,
//     company_status: "active",
//     is_status: "active", // internal status (commented out in UI but kept)
//     is_trending: false,
//   });

//   const [fileLogo, setFileLogo] = useState(null);
//   const [fileBanner, setFileBanner] = useState(null);

//   // ─── Handlers ─────────────────────────────────────────────────
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (field === "logo") {
//         setFileLogo(file);
//         setFormValues((prev) => ({ ...prev, logo: URL.createObjectURL(file) }));
//       } else if (field === "banner_image") {
//         setFileBanner(file);
//         setFormValues((prev) => ({
//           ...prev,
//           banner_image: URL.createObjectURL(file),
//         }));
//       }
//     }
//   };

//   // ─── Dropdown options ────────────────────────────────────────
//   const userOptions = companyUsers.map((u) => ({
//     value: String(u.id || u.user_id || u.company_user_id),
//     label:
//       u.email || u.company_user_email || `User ${u.id || u.company_user_id}`,
//   }));

//   const industryOptions = industries.map((ind) => ({
//     value: String(ind.id || ind.industry_id),
//     label:
//       ind.name || ind.industry_name || `Industry ${ind.id || ind.industry_id}`,
//   }));

//   const subIndustryOptions = subIndustries.map((sub) => ({
//     value: String(sub.id || sub.sub_industry_id),
//     label:
//       sub.name ||
//       sub.sub_industry_name ||
//       `Sub-industry ${sub.id || sub.sub_industry_id}`,
//   }));

//   const sizeOptions = companySizes.map((s) => ({
//     value: String(s.id || s.company_size_id),
//     label: s.name || s.company_size_name || `Size ${s.id || s.company_size_id}`,
//   }));

//   // ─── Validation ──────────────────────────────────────────────
//   const validate = () => {
//     if (!formValues.company_name?.trim()) {
//       showError("Company name is required");
//       return false;
//     }
//     if (formValues.company_name.trim().length < 2) {
//       showError("Company name must be at least 2 characters");
//       return false;
//     }
//     if (formValues.company_name.trim().length > 100) {
//       showError("Company name must be at most 100 characters");
//       return false;
//     }
//     if (
//       formValues.website &&
//       !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
//         formValues.website,
//       )
//     ) {
//       showError("Please enter a valid URL");
//       return false;
//     }
//     if (formValues.founded_year) {
//       const year = parseInt(formValues.founded_year);
//       if (year < 1900 || year > new Date().getFullYear()) {
//         showError(
//           `Founded year must be between 1900 and ${new Date().getFullYear()}`,
//         );
//         return false;
//       }
//     }
//     return true;
//   };

//   // ─── Submit ──────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const payload = new FormData();
//       payload.append("company_name", formValues.company_name.trim());
//       payload.append(
//         "slug",
//         formValues.slug.trim() ||
//           formValues.company_name.trim().toLowerCase().replace(/\s+/g, "-"),
//       );
//       payload.append("website", formValues.website?.trim() || "");
//       payload.append("founded_year", formValues.founded_year || "");
//       payload.append("about_company", formValues.about_company?.trim() || "");
//       payload.append("gst_number", formValues.gst_number?.trim() || "");
//       payload.append("company_status", formValues.company_status);
//       payload.append(
//         "is_status",
//         formValues.is_status === "active" ? "true" : "false",
//       );
//       payload.append("is_trending", formValues.is_trending ? "true" : "false");
//       payload.append("created_by", userId);
//       payload.append("updated_by", userId);

//       if (formValues.company_user_id) {
//         payload.append("company_user_id", formValues.company_user_id);
//       }
//       if (formValues.company_size_id) {
//         payload.append("company_size_id", formValues.company_size_id);
//       }
//       if (formValues.industry_id) {
//         payload.append("industry_id", formValues.industry_id);
//       }
//       if (formValues.sub_industry_id) {
//         payload.append("sub_industry_id", formValues.sub_industry_id);
//       }

//       if (fileLogo instanceof File) {
//         payload.append("logo", fileLogo);
//       }
//       if (fileBanner instanceof File) {
//         payload.append("banner_image", fileBanner);
//       }

//       const response = await fetch(`${API_BASE}/companies`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: payload,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || `HTTP error ${response.status}`);
//       }

//       showSuccess("Company created successfully");
//       navigate("/companies");
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(error.message || "Failed to create company");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Render helpers ──────────────────────────────────────────
//   const renderImagePreview = (
//     path,
//     alt = "Image",
//     className = "w-24 h-24 object-cover rounded-lg",
//   ) => {
//     if (!path) return <span className="text-gray-400">No image selected</span>;
//     return (
//       <div className="relative group inline-block">
//         <img
//           src={path.startsWith("blob:") ? path : getImageUrl(path)}
//           alt={alt}
//           className={`${className} border border-gray-200 shadow-sm`}
//           onError={(e) => {
//             e.target.style.display = "none";
//           }}
//         />
//       </div>
//     );
//   };

//   // ─── Loading state ───────────────────────────────────────────
//   if (loadingData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading data...</p>
//         </div>
//       </div>
//     );
//   }

//   // ─── Main render ──────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 animate-fadeIn">
//       <div className="max-w-7xl mx-auto">
//         {/* ─── Header ─────────────────────────────────────────────── */}
//         <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate("/companies")}
//               className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
//               aria-label="Back"
//             >
//               <MdArrowBack size={20} className="text-gray-600" />
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Add Company</h1>
//               <p className="text-sm text-gray-500">
//                 Create a new company record
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={() => navigate("/companies")}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-sm transition-colors"
//             >
//               <MdCancel size={18} />
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
//             >
//               <MdSave size={18} />
//               {loading ? "Creating..." : "Create Company"}
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* ─── Two‑column grid ─────────────────────────────────────── */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* ─── Left Column ──────────────────────────────────────── */}
//             <div className="space-y-6">
//               {/* Basic Information */}
//               <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//                   <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                     Basic Information
//                   </h2>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   {/* Company Name */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Company Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="company_name"
//                       value={formValues.company_name}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       placeholder="e.g. Acme Corp"
//                       required
//                     />
//                   </div>

//                   {/* Slug */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Slug (URL identifier)
//                     </label>
//                     <input
//                       type="text"
//                       name="slug"
//                       value={formValues.slug}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       placeholder="auto-generated if empty"
//                     />
//                   </div>

//                   {/* Website */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Website
//                     </label>
//                     <input
//                       type="url"
//                       name="website"
//                       value={formValues.website}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       placeholder="https://example.com"
//                     />
//                   </div>

//                   {/* Founded Year */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Founded Year
//                     </label>
//                     <input
//                       type="number"
//                       name="founded_year"
//                       value={formValues.founded_year}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       placeholder="2020"
//                       min="1900"
//                       max={new Date().getFullYear()}
//                     />
//                   </div>

//                   {/* About Company */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       About Company
//                     </label>
//                     <div className="mt-1">
//                       <Editor
//                         tinymceScriptSrc="/tinymce/tinymce.min.js"
//                         licenseKey="gpl"
//                         value={formValues.about_company || ""}
//                         onEditorChange={(content) =>
//                           setFormValues((prev) => ({
//                             ...prev,
//                             about_company: content,
//                           }))
//                         }
//                         init={{
//                           height: 300,
//                           menubar: false,
//                           plugins: [
//                             "advlist",
//                             "autolink",
//                             "lists",
//                             "link",
//                             "image",
//                             "charmap",
//                             "preview",
//                             "anchor",
//                             "searchreplace",
//                             "visualblocks",
//                             "code",
//                             "fullscreen",
//                             "insertdatetime",
//                             "media",
//                             "table",
//                             "help",
//                             "wordcount",
//                           ],
//                           toolbar:
//                             "undo redo | blocks | bold italic underline forecolor | " +
//                             "alignleft aligncenter alignright alignjustify | " +
//                             "bullist numlist outdent indent | link image table | " +
//                             "removeformat code | help",
//                           content_style:
//                             "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//                           image_advtab: true,
//                           images_upload_handler: (blobInfo) =>
//                             new Promise((resolve, reject) => {
//                               const reader = new FileReader();
//                               reader.onload = () => resolve(reader.result);
//                               reader.onerror = () =>
//                                 reject("Image upload failed");
//                               reader.readAsDataURL(blobInfo.blob());
//                             }),
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {/* GST Number */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       GST Number
//                     </label>
//                     <input
//                       type="text"
//                       name="gst_number"
//                       value={formValues.gst_number}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       placeholder="e.g. 24ABCDE1234F1Z5"
//                     />
//                   </div>
//                 </div>
//               </section>

//               {/* Relations */}
//               <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//                   <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                     Relations
//                   </h2>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   {/* Company User */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Company User
//                     </label>
//                     <select
//                       name="company_user_id"
//                       value={formValues.company_user_id}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       disabled={loadingData}
//                     >
//                       <option value="">
//                         {loadingData ? "Loading..." : "Select a user"}
//                       </option>
//                       {userOptions.map((opt) => (
//                         <option key={opt.value} value={opt.value}>
//                           {opt.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Industry */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Industry
//                     </label>
//                     <select
//                       name="industry_id"
//                       value={formValues.industry_id}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       disabled={loadingData}
//                     >
//                       <option value="">
//                         {loadingData ? "Loading..." : "Select an industry"}
//                       </option>
//                       {industryOptions.map((opt) => (
//                         <option key={opt.value} value={opt.value}>
//                           {opt.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Sub‑industry */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Sub‑industry
//                     </label>
//                     <select
//                       name="sub_industry_id"
//                       value={formValues.sub_industry_id}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       disabled={loadingData}
//                     >
//                       <option value="">
//                         {loadingData ? "Loading..." : "Select a sub-industry"}
//                       </option>
//                       {subIndustryOptions.map((opt) => (
//                         <option key={opt.value} value={opt.value}>
//                           {opt.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Company Size */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Company Size
//                     </label>
//                     <select
//                       name="company_size_id"
//                       value={formValues.company_size_id}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
//                       disabled={loadingData}
//                     >
//                       <option value="">
//                         {loadingData ? "Loading..." : "Select a size"}
//                       </option>
//                       {sizeOptions.map((opt) => (
//                         <option key={opt.value} value={opt.value}>
//                           {opt.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </section>
//             </div>

//             {/* ─── Right Column ──────────────────────────────────────── */}
//             <div className="space-y-6">
//               {/* Status & Flags */}
//               <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//                   <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                     Status & Flags
//                   </h2>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   {/* Company Status */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Company Status
//                     </label>
//                     <div className="mt-1 flex gap-4">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="company_status"
//                           value="active"
//                           checked={formValues.company_status === "active"}
//                           onChange={handleInputChange}
//                           className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">Active</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="company_status"
//                           value="inactive"
//                           checked={formValues.company_status === "inactive"}
//                           onChange={handleInputChange}
//                           className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">Inactive</span>
//                       </label>
//                     </div>
//                   </div>

//                   {/* Internal Status (commented out) */}
//                   {/*
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Internal Status
//                     </label>
//                     <div className="mt-1 flex gap-4">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="is_status"
//                           value="active"
//                           checked={formValues.is_status === "active"}
//                           onChange={handleInputChange}
//                           className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">Active</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="is_status"
//                           value="inactive"
//                           checked={formValues.is_status === "inactive"}
//                           onChange={handleInputChange}
//                           className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">Inactive</span>
//                       </label>
//                     </div>
//                   </div>
//                   */}

//                   {/* Trending */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Trending
//                     </label>
//                     <div className="mt-1 flex items-center gap-3">
//                       <input
//                         type="checkbox"
//                         name="is_trending"
//                         checked={formValues.is_trending}
//                         onChange={handleInputChange}
//                         className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
//                       />
//                       <span className="text-sm text-gray-600">
//                         {formValues.is_trending ? "Trending" : "Not Trending"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Images (Logo & Banner) */}
//               <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//                   <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                     Images
//                   </h2>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   {/* Logo */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Logo
//                     </label>
//                     <div className="mt-1 flex items-center gap-4">
//                       {formValues.logo ? (
//                         renderImagePreview(
//                           formValues.logo,
//                           "Logo",
//                           "w-20 h-20 object-cover rounded-lg",
//                         )
//                       ) : (
//                         <span className="text-gray-400">No logo selected</span>
//                       )}
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileChange(e, "logo")}
//                         className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                       />
//                     </div>
//                   </div>
//                   {/* Banner */}
//                   <div>
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Banner Image
//                     </label>
//                     <div className="mt-1 flex items-center gap-4">
//                       {formValues.banner_image ? (
//                         renderImagePreview(
//                           formValues.banner_image,
//                           "Banner",
//                           "w-48 h-24 object-cover rounded-lg",
//                         )
//                       ) : (
//                         <span className="text-gray-400">
//                           No banner selected
//                         </span>
//                       )}
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileChange(e, "banner_image")}
//                         className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </section>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCompany;

// pages/companies/AddCompany.jsx


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdInfo,
  MdBusiness,
  MdCategory,
  MdImage,
  MdFlag,
  MdCloudUpload,
  MdPerson,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdLink,
  MdOpenInNew,
} from "react-icons/md";
import companyService from "../../services/company.service";
import subIndustryService from "../../services/subIndustry.service";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../utils/toast";
import { Editor } from "@tinymce/tinymce-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// Helper: build full image URL (only used for previews)
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path}`;
};

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    icon: MdCheckCircle,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    icon: MdErrorOutline,
  },
  pending: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    icon: MdErrorOutline,
  },
  blocked: {
    pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-500",
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

const TrendingBadge = ({ trending }) => {
  if (!trending) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
      <MdTrendingUp size={12} />
      Trending
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

const RichTextEditorField = ({ value, onChange, height = 280 }) => {
  const [editorMode, setEditorMode] = useState("text");

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        {["text", "html"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setEditorMode(mode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              editorMode === mode
                ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {mode === "text" ? "Text" : "HTML"}
          </button>
        ))}
      </div>

      {editorMode === "text" ? (
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          value={value || ""}
          onEditorChange={(content) => onChange(content)}
          init={{
            height,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic underline forecolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | link image table | " +
              "removeformat code | help",
            content_style:
              "body { font-family:'Inter',sans-serif; font-size:14px }",
            image_advtab: true,
            images_upload_handler: (blobInfo) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject("Image upload failed");
                reader.readAsDataURL(blobInfo.blob());
              }),
          }}
        />
      ) : (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          className="w-full min-h-[280px] resize-y bg-slate-950 text-slate-100 p-3 font-mono text-xs leading-6 outline-none"
        />
      )}
    </div>
  );
};

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdBusiness },
  { id: "relations", label: "Relations", icon: MdCategory },
  { id: "media", label: "Media", icon: MdImage },
  { id: "status", label: "Status & Flags", icon: MdFlag },
];

// ─── Main Component ──────────────────────────────────────────
const AddCompany = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const userId = user?.id || 1;
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // ─── Dropdown data states ────────────────────────────────────
  const [companyUsers, setCompanyUsers] = useState([]);
  const [companySizes, setCompanySizes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [subIndustries, setSubIndustries] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const extractList = (response) => {
    let value = response;
    for (let depth = 0; depth < 4 && value; depth += 1) {
      if (Array.isArray(value)) return value;
      value = value.data || value.results || value.items;
    }
    return [];
  };

  // ─── Load dropdown data ──────────────────────────────────────
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [usersRes, sizesRes, industriesRes, subIndustriesRes] =
          await Promise.all([
            companyService.getCompanyUsers(),
            companyService.getCompanySizes(),
            companyService.getIndustries(),
            subIndustryService.getAll(),
          ]);

        setCompanyUsers(extractList(usersRes));
        setCompanySizes(extractList(sizesRes));
        setIndustries(extractList(industriesRes));
        setSubIndustries(extractList(subIndustriesRes));
      } catch (err) {
        console.error("Error loading dropdown data:", err);
        showError("Failed to load dropdown data");
      } finally {
        setLoadingData(false);
      }
    };
    loadDropdownData();
  }, []);

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    company_name: "",
    slug: "",
    website: "",
    founded_year: "",
    about_company: "",
    gst_number: "",
    company_user_id: "",
    industry_id: "",
    sub_industry_id: "",
    company_size_id: "",
    logo: null,
    banner_image: null,
    company_status: "active",
    is_status: "active",
    is_trending: false,
  });

  const [fileLogo, setFileLogo] = useState(null);
  const [fileBanner, setFileBanner] = useState(null);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (field === "logo") {
        setFileLogo(file);
        setFormValues((prev) => ({ ...prev, logo: URL.createObjectURL(file) }));
      } else if (field === "banner_image") {
        setFileBanner(file);
        setFormValues((prev) => ({
          ...prev,
          banner_image: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleRemoveLogo = () => {
    setFileLogo(null);
    setFormValues((prev) => ({ ...prev, logo: null }));
    const el = document.getElementById("logo-upload");
    if (el) el.value = "";
  };

  const handleRemoveBanner = () => {
    setFileBanner(null);
    setFormValues((prev) => ({ ...prev, banner_image: null }));
    const el = document.getElementById("banner-upload");
    if (el) el.value = "";
  };

  // ─── Dropdown options ────────────────────────────────────────
  const userOptions = companyUsers.map((u) => ({
    value: String(u.id || u.user_id || u.company_user_id),
    label:
      u.email || u.company_user_email || `User ${u.id || u.company_user_id}`,
  }));

  const industryOptions = industries.map((ind) => ({
    value: String(ind.id || ind.industry_id),
    label:
      ind.name || ind.industry_name || `Industry ${ind.id || ind.industry_id}`,
  }));

  const subIndustryOptions = subIndustries.map((sub) => ({
    value: String(sub.id || sub.sub_industry_id),
    label:
      sub.name ||
      sub.sub_industry_name ||
      `Sub-industry ${sub.id || sub.sub_industry_id}`,
  }));

  const sizeOptions = companySizes.map((s) => ({
    value: String(s.id || s.company_size_id),
    label: s.name || s.company_size_name || `Size ${s.id || s.company_size_id}`,
  }));

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    if (!formValues.company_name?.trim()) {
      showError("Company name is required");
      return false;
    }
    if (formValues.company_name.trim().length < 2) {
      showError("Company name must be at least 2 characters");
      return false;
    }
    if (formValues.company_name.trim().length > 100) {
      showError("Company name must be at most 100 characters");
      return false;
    }
    if (
      formValues.website &&
      !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
        formValues.website,
      )
    ) {
      showError("Please enter a valid URL");
      return false;
    }
    if (formValues.founded_year) {
      const year = parseInt(formValues.founded_year);
      if (year < 1900 || year > new Date().getFullYear()) {
        showError(
          `Founded year must be between 1900 and ${new Date().getFullYear()}`,
        );
        return false;
      }
    }
    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("company_name", formValues.company_name.trim());
      payload.append(
        "slug",
        formValues.slug.trim() ||
          formValues.company_name.trim().toLowerCase().replace(/\s+/g, "-"),
      );
      payload.append("website", formValues.website?.trim() || "");
      payload.append("founded_year", formValues.founded_year || "");
      payload.append("about_company", formValues.about_company?.trim() || "");
      payload.append("gst_number", formValues.gst_number?.trim() || "");
      payload.append("company_status", formValues.company_status);
      payload.append(
        "is_status",
        formValues.is_status === "active" ? "true" : "false",
      );
      payload.append("is_trending", formValues.is_trending ? "true" : "false");
      payload.append("created_by", userId);
      payload.append("updated_by", userId);

      if (formValues.company_user_id) {
        payload.append("company_user_id", formValues.company_user_id);
      }
      if (formValues.company_size_id) {
        payload.append("company_size_id", formValues.company_size_id);
      }
      if (formValues.industry_id) {
        payload.append("industry_id", formValues.industry_id);
      }
      if (formValues.sub_industry_id) {
        payload.append("sub_industry_id", formValues.sub_industry_id);
      }

      if (fileLogo instanceof File) {
        payload.append("logo", fileLogo);
      }
      if (fileBanner instanceof File) {
        payload.append("banner_image", fileBanner);
      }

      const response = await fetch(`${API_BASE}/companies`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error ${response.status}`);
      }

      showSuccess("Company created successfully");
      navigate("/companies");
    } catch (error) {
      console.error("Submit error:", error);
      showError(error.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/companies");

  // ─── Render helpers ──────────────────────────────────────────
  const renderImagePreview = (
    path,
    alt = "Image",
    className = "w-20 h-20 object-cover rounded-lg",
  ) => {
    if (!path) return null;
    return (
      <div className="relative group inline-block">
        <img
          src={path.startsWith("blob:") ? path : getImageUrl(path)}
          alt={alt}
          className={`${className} border border-slate-200 shadow-sm`}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    );
  };

  // ─── Loading state ───────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading data...</p>
        </div>
      </div>
    );
  }

  // ─── Compute hero data ────────────────────────────────────
  const companyName = formValues.company_name?.trim() || "New Company";
  const companyStatus = formValues.company_status || "active";
  const isTrending = formValues.is_trending || false;

  const initials = companyName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  // ─── Render tab content ────────────────────────────────────
  const renderTabContent = () => {
    const commonClass =
      "w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white";

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel required>Company Name</FieldLabel>
                <input
                  type="text"
                  name="company_name"
                  value={formValues.company_name}
                  onChange={handleInputChange}
                  className={commonClass}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <FieldLabel>Slug (URL identifier)</FieldLabel>
                <input
                  type="text"
                  name="slug"
                  value={formValues.slug}
                  onChange={handleInputChange}
                  className={commonClass}
                  placeholder="auto-generated if empty"
                />
              </div>
              <div>
                <FieldLabel>Website</FieldLabel>
                <input
                  type="url"
                  name="website"
                  value={formValues.website}
                  onChange={handleInputChange}
                  className={commonClass}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <FieldLabel>Founded Year</FieldLabel>
                <input
                  type="number"
                  name="founded_year"
                  value={formValues.founded_year}
                  onChange={handleInputChange}
                  className={commonClass}
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <FieldLabel>GST Number</FieldLabel>
                <input
                  type="text"
                  name="gst_number"
                  value={formValues.gst_number}
                  onChange={handleInputChange}
                  className={commonClass}
                  placeholder="e.g. 24ABCDE1234F1Z5"
                />
              </div>
            </div>

            <div>
              <FieldLabel>About Company</FieldLabel>
              <RichTextEditorField
                value={formValues.about_company || ""}
                onChange={(content) =>
                  setFormValues((prev) => ({
                    ...prev,
                    about_company: content,
                  }))
                }
              />
            </div>
          </div>
        );

      case "relations":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel>Company User</FieldLabel>
              <select
                name="company_user_id"
                value={formValues.company_user_id}
                onChange={handleInputChange}
                className={commonClass}
                disabled={loadingData}
              >
                <option value="">
                  {loadingData ? "Loading..." : "Select a user"}
                </option>
                {userOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Industry</FieldLabel>
              <select
                name="industry_id"
                value={formValues.industry_id}
                onChange={handleInputChange}
                className={commonClass}
                disabled={loadingData}
              >
                <option value="">
                  {loadingData ? "Loading..." : "Select an industry"}
                </option>
                {industryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Sub‑industry</FieldLabel>
              <select
                name="sub_industry_id"
                value={formValues.sub_industry_id}
                onChange={handleInputChange}
                className={commonClass}
                disabled={loadingData}
              >
                <option value="">
                  {loadingData ? "Loading..." : "Select a sub-industry"}
                </option>
                {subIndustryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Company Size</FieldLabel>
              <select
                name="company_size_id"
                value={formValues.company_size_id}
                onChange={handleInputChange}
                className={commonClass}
                disabled={loadingData}
              >
                <option value="">
                  {loadingData ? "Loading..." : "Select a size"}
                </option>
                {sizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case "media":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <FieldLabel>Logo</FieldLabel>
              <div className="flex items-start gap-4">
                {formValues.logo ? (
                  <div className="relative group">
                    {renderImagePreview(
                      formValues.logo,
                      "Logo",
                      "w-20 h-20 object-cover rounded-lg",
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
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
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <MdImage size={26} className="text-slate-400" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "logo")}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium inline-flex items-center gap-2"
                  >
                    <MdCloudUpload size={16} />
                    {formValues.logo ? "Change Logo" : "Choose Logo"}
                  </label>
                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG, SVG (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <FieldLabel>Banner Image</FieldLabel>
              <div className="flex items-start gap-4">
                {formValues.banner_image ? (
                  <div className="relative group">
                    {renderImagePreview(
                      formValues.banner_image,
                      "Banner",
                      "w-40 h-20 object-cover rounded-lg",
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
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
                ) : (
                  <div className="w-40 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <MdImage size={26} className="text-slate-400" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "banner_image")}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="px-4 py-2 bg-blue-50 text-[#2c0eee] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium inline-flex items-center gap-2"
                  >
                    <MdCloudUpload size={16} />
                    {formValues.banner_image
                      ? "Change Banner"
                      : "Choose Banner"}
                  </label>
                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG (Max 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-xl">
            <div>
              <FieldLabel required>Company Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {["active", "inactive", "pending", "blocked"].map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="company_status"
                      value={s}
                      checked={formValues.company_status === s}
                      onChange={handleInputChange}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {s}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                This status is displayed publicly on the company profile.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <FieldLabel>Trending</FieldLabel>
              <div className="flex items-center gap-3 pt-0.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_trending"
                    checked={formValues.is_trending}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
                </label>
                <span className="text-sm text-slate-600">
                  {formValues.is_trending
                    ? "Marked as trending"
                    : "Not trending"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Trending companies are highlighted in search results.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ──────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ───────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Companies
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Add New Company
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
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
              {loading ? "Creating..." : "Create Company"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero (fixed dark gradient) ─────────────────── */}
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                {formValues.logo ? (
                  <img
                    src={
                      formValues.logo.startsWith("blob:")
                        ? formValues.logo
                        : getImageUrl(formValues.logo)
                    }
                    alt="Logo"
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdBusiness size={24} />}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {companyName}
                  </h1>
                  <StatusPill status={companyStatus} />
                  {isTrending && <TrendingBadge trending={true} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {formValues.website ? (
                    <a
                      href={
                        formValues.website.startsWith("http")
                          ? formValues.website
                          : `https://${formValues.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
                    >
                      <MdLink size={12} /> Website
                    </a>
                  ) : (
                    <span className="text-xs text-white/50">New Company</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ─────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdFlag size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {companyStatus}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Industry
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {industryOptions.find((o) => o.value === formValues.industry_id)
                  ?.label || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Company User
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {userOptions.find((o) => o.value === formValues.company_user_id)
                  ?.label || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdImage size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Media</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.logo ? "Logo ✓" : "No logo"}
                {formValues.banner_image ? " & Banner ✓" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────── */}
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
                      layoutId="add-company-tab-underline"
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
                <form onSubmit={handleSubmit}>
                  {renderTabContent()}

                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 px-4 rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 shadow-sm shadow-blue-600/20"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </span>
                      ) : (
                        "Create Company"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={handleBack}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddCompany;
