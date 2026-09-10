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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdApartment,
  MdCategory,
  MdGroups,
  MdImage,
  MdBusiness,
  MdTrendingUp,
  MdCheckCircle,
  MdErrorOutline,
  MdCloudUpload,
  MdPerson,
  MdOpenInNew,
  MdFlag,
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

// ─── Shared small components ──────────────────────────────────
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

// ─── Status pill ──────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    icon: MdErrorOutline,
  },
  pending: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: MdCheckCircle,
  },
  blocked: {
    pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
    icon: MdCheckCircle,
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

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdApartment },
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
  const [aboutCompanyMode, setAboutCompanyMode] = useState("rich");

  // ─── Handlers ─────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAboutCompanyChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      about_company: value || "",
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
    e.preventDefault();
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

  // ─── Render helpers ──────────────────────────────────────────
  const renderImagePreview = (
    path,
    alt = "Image",
    className = "w-20 h-20 object-cover rounded-lg",
  ) => {
    if (!path) return <span className="text-slate-400 text-sm">No image</span>;
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
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading data...</p>
        </div>
      </div>
    );
  }

  const heroName = formValues.company_name?.trim() || "New Company";
  const initials = heroName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  // ─── Render tab content ──────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel required>Company name</FieldLabel>
                <input
                  type="text"
                  name="company_name"
                  value={formValues.company_name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g. Acme Corp"
                  required
                />
              </div>

              <div>
                <FieldLabel>Slug (URL identifier)</FieldLabel>
                <input
                  type="text"
                  name="slug"
                  value={formValues.slug}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
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
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <FieldLabel>Founded year</FieldLabel>
                <input
                  type="number"
                  name="founded_year"
                  value={formValues.founded_year}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <FieldLabel>GST number</FieldLabel>
                <input
                  type="text"
                  name="gst_number"
                  value={formValues.gst_number}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                  placeholder="e.g. 24ABCDE1234F1Z5"
                />
              </div>
            </div>

            <div>
              <FieldLabel>About company</FieldLabel>

              <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 w-fit shadow-sm">
                {[
                  { id: "rich", label: "Text" },
                  { id: "html", label: "HTML" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAboutCompanyMode(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      aboutCompanyMode === tab.id
                        ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-100"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {aboutCompanyMode === "rich" ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    licenseKey="gpl"
                    value={formValues.about_company || ""}
                    onEditorChange={handleAboutCompanyChange}
                    init={{
                      height: 360,
                      menubar: true,
                      statusbar: true,
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
                        "file undo redo | bold italic underline strikethrough | " +
                        "fontfamily fontsize | alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist outdent indent | link image table | " +
                        "forecolor backcolor | removeformat code | help",
                      menu: {
                        file: {
                          title: "File",
                          items: "newdocument restoredraft | preview | print ",
                        },
                        edit: {
                          title: "Edit",
                          items:
                            "undo redo | cut copy paste pastetext | selectall ",
                        },
                        view: {
                          title: "View",
                          items: "visualaid visualblocks | code | fullscreen ",
                        },
                        insert: {
                          title: "Insert",
                          items: "image link media table | hr | pagebreak ",
                        },
                        format: {
                          title: "Format",
                          items:
                            "bold italic underline strikethrough | formats | removeformat ",
                        },
                        tools: {
                          title: "Tools",
                          items: "searchreplace | spellcheckdialog ",
                        },
                        table: {
                          title: "Table",
                          items:
                            "inserttable | cell row column | advtablesort | tableprops deletetable ",
                        },
                        help: { title: "Help", items: "help " },
                      },
                      content_style:
                        "body { font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.7; } p { margin: 0 0 10px; }",
                      placeholder: "Write your company profile here...",
                      images_upload_handler: (blobInfo) =>
                        new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => resolve(reader.result);
                          reader.onerror = () => reject("Image upload failed");
                          reader.readAsDataURL(blobInfo.blob());
                        }),
                    }}
                  />
                </div>
              ) : (
                <textarea
                  value={formValues.about_company || ""}
                  onChange={(e) => handleAboutCompanyChange(e.target.value)}
                  className="w-full min-h-[220px] px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors resize-y bg-slate-50"
                  placeholder="<p>Write HTML here...</p>"
                />
              )}

              <p className="mt-2 text-xs text-slate-500">
                Use the rich text editor for formatting, or switch to HTML for
                direct source editing.
              </p>
            </div>
          </div>
        );

      case "relations":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel>Company user</FieldLabel>
              <select
                name="company_user_id"
                value={formValues.company_user_id}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
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
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
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
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
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
              <FieldLabel>Company size</FieldLabel>
              <select
                name="company_size_id"
                value={formValues.company_size_id}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
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
              <div className="flex flex-col items-start gap-3">
                <div className="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {formValues.logo ? (
                    <img
                      src={
                        formValues.logo.startsWith("blob:")
                          ? formValues.logo
                          : getImageUrl(formValues.logo)
                      }
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <MdApartment size={28} className="text-slate-300" />
                  )}
                </div>
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                  <MdCloudUpload size={16} />
                  {formValues.logo ? "Change logo" : "Upload logo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "logo")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <FieldLabel>Banner image</FieldLabel>
              <div className="flex flex-col items-start gap-3">
                <div className="w-full sm:w-64 h-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {formValues.banner_image ? (
                    <img
                      src={
                        formValues.banner_image.startsWith("blob:")
                          ? formValues.banner_image
                          : getImageUrl(formValues.banner_image)
                      }
                      alt="Banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <MdImage size={28} className="text-slate-300" />
                  )}
                </div>
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                  <MdCloudUpload size={16} />
                  {formValues.banner_image ? "Change banner" : "Upload banner"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "banner_image")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case "status":
        return (
          <div className="space-y-6 max-w-xl">
            {/* Company Status */}
            <div>
              <FieldLabel required>Company Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {["active", "inactive", "pending", "blocked"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="company_status"
                      value={status}
                      checked={formValues.company_status === status}
                      onChange={handleInputChange}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                This status is displayed publicly on the company profile.
              </p>
            </div>

            {/* Internal Status (commented out but kept for reference) */}
            {/* 
            <div>
              <FieldLabel>Internal Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {["active", "inactive"].map((status) => (
                  <label key={status} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="is_status"
                      value={status}
                      checked={formValues.is_status === status}
                      onChange={handleInputChange}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-slate-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            */}

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
                Trending companies are highlighted in search results.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/companies")}
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
                {heroName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/companies")}
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
        {/* ─── Hero ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52">
            {formValues.banner_image ? (
              <img
                src={
                  formValues.banner_image.startsWith("blob:")
                    ? formValues.banner_image
                    : getImageUrl(formValues.banner_image)
                }
                alt="Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Logo placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
                {formValues.logo ? (
                  <img
                    src={
                      formValues.logo.startsWith("blob:")
                        ? formValues.logo
                        : getImageUrl(formValues.logo)
                    }
                    alt="Logo"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
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
                  {formValues.is_trending && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-400/20 text-orange-300 ring-1 ring-orange-400/30">
                      <MdTrendingUp size={12} />
                      Trending
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <StatusPill status={formValues.company_status} />
                  <span className="text-xs text-white/70">New Company</span>
                  {formValues.website && (
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
                      <MdOpenInNew size={11} />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Industry
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.industry_id
                  ? industryOptions.find(
                      (opt) => opt.value === formValues.industry_id,
                    )?.label || "—"
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdGroups size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Size</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.company_size_id
                  ? sizeOptions.find(
                      (opt) => opt.value === formValues.company_size_id,
                    )?.label || "—"
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdTrendingUp size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Trending
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.is_trending ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdImage size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Images</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.logo ? "Logo ✓" : "No logo"}
                {formValues.banner_image ? " & Banner ✓" : ""}
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
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/companies")}
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
