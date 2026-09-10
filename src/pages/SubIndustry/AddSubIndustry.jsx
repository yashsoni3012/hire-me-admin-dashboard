// import React, { useState, useEffect, useRef } from "react";
// import { 
//   MdCategory, 
//   MdTrendingUp, 
//   MdInsertPhoto, 
//   MdDelete, 
//   MdCloudUpload, 
//   MdClose,
//   MdVisibility
// } from "react-icons/md";
// import Modal from "../../components/common/Modal";
// import Input from "../../components/common/Input";
// import Button from "../../components/common/Button";
// import { subIndustryService } from "../../services/subIndustry.service";
// import { industryService } from "../../services/industry.service";
// import { showSuccess, showError } from "../../utils/toast";

// // API Base URL
// const API_BASE_URL = 'https://apidata.hiremejobs.in';

// const AddSubIndustry = ({ isOpen, onClose, onSuccess, editData }) => {
//   const [loading, setLoading] = useState(false);
//   const [industries, setIndustries] = useState([]);
//   const [loadingIndustries, setLoadingIndustries] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     industry_id: "",
//     is_trending: false,
//     icon: "",
//     is_status: true,
//     sort_order: 0,
//   });
//   const [errors, setErrors] = useState({});
//   const [iconPreview, setIconPreview] = useState("");
//   const [iconFile, setIconFile] = useState(null);
//   const [iconUploading, setIconUploading] = useState(false);
//   const [iconDragOver, setIconDragOver] = useState(false);
//   const formRef = useRef();

//   const isEdit = !!editData;

//   // Get full image URL
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (value.startsWith('http') || value.startsWith('data:image')) {
//       return value;
//     }
//     if (value.startsWith('/uploads/')) {
//       return `${API_BASE_URL}${value}`;
//     }
//     return value;
//   };

//   // Fetch industries for dropdown
//   useEffect(() => {
//     const fetchIndustries = async () => {
//       setLoadingIndustries(true);
//       try {
//         const response = await industryService.getAll({ limit: 100 });
//         const industryList = response.data || response.results || [];
//         setIndustries(industryList);
//       } catch (error) {
//         showError("Failed to load industries");
//         console.error("Error fetching industries:", error);
//       } finally {
//         setLoadingIndustries(false);
//       }
//     };
//     if (isOpen) {
//       fetchIndustries();
//     }
//   }, [isOpen]);

//   // Populate form data when editing
//   useEffect(() => {
//     if (editData) {
//       const industryId = editData.Industry?.id || editData.industry_id || "";
      
//       console.log("Edit data received:", editData);
//       console.log("Icon path:", editData.icon);
      
//       setFormData({
//         name: editData.name || "",
//         industry_id: industryId,
//         is_trending: editData.is_trending || false,
//         icon: editData.icon || "",
//         is_status: editData.is_status !== undefined ? editData.is_status : true,
//         sort_order: editData.sort_order || 0,
//       });
      
//       if (editData.icon) {
//         const fullIconUrl = getFullImageUrl(editData.icon);
//         setIconPreview(fullIconUrl);
//         console.log("Icon preview URL:", fullIconUrl);
//       } else {
//         setIconPreview("");
//       }
      
//       setIconFile(null);
//     } else {
//       setFormData({
//         name: "",
//         industry_id: "",
//         is_trending: false,
//         icon: "",
//         is_status: true,
//         sort_order: 0,
//       });
//       setIconPreview("");
//       setIconFile(null);
//     }
//     setErrors({});
//   }, [editData]);

//   // Handle file upload for icon
//   const handleIconUpload = (e) => {
//     const files = e.target.files ? Array.from(e.target.files) : e;
//     const file = files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       showError("Please upload an image file for icon");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       showError("File size must be less than 5MB");
//       return;
//     }

//     setIconUploading(true);
//     try {
//       const previewUrl = URL.createObjectURL(file);
//       setIconPreview(previewUrl);
//       setIconFile(file);
//       setFormData((prev) => ({ ...prev, icon: file.name }));
//       showSuccess(`Icon "${file.name}" uploaded successfully`);
//     } catch (error) {
//       console.error("Icon upload error:", error);
//       showError("Failed to upload icon");
//     } finally {
//       setIconUploading(false);
//       setIconDragOver(false);
//     }
//   };

//   // Remove icon
//   const removeIcon = () => {
//     setIconPreview("");
//     setIconFile(null);
//     setFormData((prev) => ({ ...prev, icon: "" }));
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFormData((prev) => ({ ...prev, [name]: val }));
    
//     if (name === "icon" && !iconFile) {
//       setIconPreview(value);
//     }
    
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = "Sub-industry name is required";
//     }
//     if (formData.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }
//     if (!formData.industry_id) {
//       newErrors.industry_id = "Please select a parent industry";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const submitData = {
//         name: formData.name.trim(),
//         industry_id: parseInt(formData.industry_id),
//         is_trending: formData.is_trending,
//         is_status: formData.is_status,
//         sort_order: parseInt(formData.sort_order) || 0,
//       };

//       if (formData.icon && formData.icon.trim() !== '' && formData.icon !== 'null') {
//         submitData.icon = formData.icon.trim();
//       } else {
//         submitData.icon = null;
//       }

//       if (iconFile) {
//         submitData.iconFile = iconFile;
//       }

//       console.log("Submitting data:", submitData);

//       if (isEdit) {
//         const id = editData.id || editData._id;
//         if (!id) {
//           throw new Error("No ID found for update");
//         }
//         await subIndustryService.update(id, submitData);
//         showSuccess("Sub-industry updated successfully");
//       } else {
//         await subIndustryService.create(submitData);
//         showSuccess("Sub-industry created successfully");
//       }
//       onSuccess();
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error.message ||
//         `Failed to ${isEdit ? "update" : "create"} sub-industry`;
//       showError(errorMessage);
//       if (error.errors) {
//         setErrors(error.errors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if value is an image URL
//   const isImageUrl = (value) => {
//     return (
//       value &&
//       (value.startsWith("http") ||
//         value.startsWith("data:image") ||
//         value.startsWith("/uploads/") ||
//         value.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp|ico|jfif)$/i))
//     );
//   };

//   // Render icon upload section
//   const renderIconUpload = () => {
//     if (iconPreview) {
//       return (
//         <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-[#2c0eee] hover:border-[#2c0eee] transition-all">
//           <div className="relative flex-shrink-0 group">
//             {isImageUrl(iconPreview) ? (
//               <img
//                 src={iconPreview}
//                 alt="Icon preview"
//                 className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-sm"
//                 onError={(e) => {
//                   console.error("Failed to load icon preview:", iconPreview);
//                   e.target.src =
//                     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='40' y='40' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
//                 }}
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center text-[#2c0eee]">
//                 <MdInsertPhoto size={32} />
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="text-sm font-medium text-gray-800 truncate">
//               {iconFile ? iconFile.name : formData.icon || "Icon"}
//             </div>
//             {iconFile && (
//               <div className="text-xs text-gray-400 mt-0.5">
//                 {(iconFile.size / 1024).toFixed(1)} KB • {iconFile.type}
//               </div>
//             )}
//             {!iconFile && formData.icon && (
//               <div className="text-xs text-gray-400 mt-0.5">
//                 Existing file: {formData.icon}
//               </div>
//             )}
//             <div className="text-xs text-gray-400 mt-1">
//               Click change to upload a different icon
//             </div>
//           </div>
//           <div className="flex gap-2 flex-shrink-0">
//             <label
//               className="px-3 py-1.5 text-sm text-[#2c0eee] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
//             >
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleIconUpload}
//                 className="hidden"
//                 disabled={loading}
//               />
//               Change
//             </label>
//             <button
//               type="button"
//               onClick={removeIcon}
//               className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//               disabled={loading}
//             >
//               <MdDelete size={18} />
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div
//         className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
//           iconDragOver
//             ? "border-[#2c0eee] bg-blue-50"
//             : "border-gray-300 bg-blue-50/50 hover:border-[#2c0eee]"
//         } ${loading || iconUploading ? "opacity-50 pointer-events-none" : ""}`}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setIconDragOver(true);
//         }}
//         onDragLeave={() => setIconDragOver(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           const files = Array.from(e.dataTransfer.files);
//           handleIconUpload({ target: { files } });
//         }}
//       >
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleIconUpload}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           disabled={loading}
//         />
//         <div className="flex flex-col items-center">
//           <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#2c0eee] mb-3">
//             <MdCloudUpload size={28} />
//           </div>
//           <p className="text-sm font-medium text-[#2c0eee]">
//             {iconDragOver
//               ? "Drop icon here"
//               : iconUploading
//               ? "Uploading icon..."
//               : "Upload Icon"}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             {iconUploading ? "Please wait..." : "Drag & drop or click to browse"}
//           </p>
//           <div className="flex gap-4 mt-2 text-xs text-gray-400">
//             <span>PNG, JPG, SVG, JFIF</span>
//             <span>•</span>
//             <span>Max 5MB</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={isEdit ? "Edit Sub-Industry" : "Add New Sub-Industry"}
//       size="lg"
//     >
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#2c0eee] flex items-center justify-center text-white shadow-lg shadow-[#4529f7]">
//               <MdCategory size={22} />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">
//                 {isEdit ? "Edit Sub-Industry" : "Add New Sub-Industry"}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {isEdit
//                   ? "Update sub-industry information"
//                   : "Fill in the details to create a new sub-industry"}
//               </p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
//           >
//             <MdClose size={20} />
//           </button>
//         </div>

//         {/* Form Body */}
//         <form ref={formRef} onSubmit={handleSubmit} className="p-6">
//           <div className="space-y-6">
//             {/* Sub-Industry Name */}
//             <Input
//               label="Sub-Industry Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter sub-industry name"
//               required
//               error={errors.name}
//               disabled={loading}
//             />

//             {/* Parent Industry Dropdown */}
//             <div className="space-y-1">
//               <label className="block text-sm font-medium text-gray-700">
//                 Parent Industry <span className="text-red-500 ml-1">*</span>
//               </label>
//               <select
//                 name="industry_id"
//                 value={formData.industry_id}
//                 onChange={handleChange}
//                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent ${
//                   errors.industry_id
//                     ? "border-red-400 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={loading || loadingIndustries}
//               >
//                 <option value="">Select an industry</option>
//                 {industries.map((industry) => (
//                   <option
//                     key={industry.id || industry._id}
//                     value={industry.id || industry._id}
//                   >
//                     {industry.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.industry_id && (
//                 <p className="text-xs text-red-500">{errors.industry_id}</p>
//               )}
//               {loadingIndustries && (
//                 <p className="text-xs text-gray-500">Loading industries...</p>
//               )}
//             </div>

//             {/* Icon Upload */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Icon
//               </label>
//               {renderIconUpload()}
//             </div>

//             {/* Checkboxes and Sort Order */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex flex-wrap items-center gap-4">
//                 <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="is_trending"
//                     checked={formData.is_trending === true}
//                     onChange={handleChange}
//                     className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
//                     disabled={loading}
//                   />
//                   <MdTrendingUp
//                     className={
//                       formData.is_trending ? "text-green-600" : "text-gray-400"
//                     }
//                   />
//                   Trending
//                 </label>

//                 <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="is_status"
//                     checked={formData.is_status === true}
//                     onChange={handleChange}
//                     className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
//                     disabled={loading}
//                   />
//                   Active
//                 </label>
//               </div>

//               <Input
//                 label="Sort Order"
//                 name="sort_order"
//                 type="number"
//                 value={formData.sort_order}
//                 onChange={handleChange}
//                 placeholder="Enter sort order"
//                 disabled={loading}
//               />
//             </div>

//             {/* Actions */}
//             <div className="flex gap-4 pt-4 border-t border-gray-100 mt-4">
//               <Button type="submit" loading={loading} variant="primary">
//                 {loading ? "Saving..." : isEdit ? "Update" : "Create"}
//               </Button>
//               <Button variant="secondary" type="button" onClick={onClose}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default AddSubIndustry;