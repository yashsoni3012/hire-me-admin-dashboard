// import React, { useState, useEffect, useRef } from "react";
// import {
//   MdCategory,
//   MdTrendingUp,
//   MdInsertPhoto,
//   MdImage,
//   MdDelete,
//   MdCloudUpload,
//   MdClose,
//   MdVisibility,
// } from "react-icons/md";
// import Modal from "../../components/common/Modal";
// import Input from "../../components/common/Input";
// import Button from "../../components/common/Button";
// import { jobCategoryService } from "../../services/jobCategory.service";
// import { showSuccess, showError } from "../../utils/toast";

// // API Base URL
// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const AddJobCategory = ({ isOpen, onClose, onSuccess, editData }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     category_name: "",
//     is_trending: false,
//     icon: "",
//     image: "",
//     is_status: true,
//   });
//   const [errors, setErrors] = useState({});
//   const [iconPreview, setIconPreview] = useState("");
//   const [imagePreview, setImagePreview] = useState("");
//   const [iconFile, setIconFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [iconUploading, setIconUploading] = useState(false);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [iconDragOver, setIconDragOver] = useState(false);
//   const [imageDragOver, setImageDragOver] = useState(false);
//   const [showIconPreview, setShowIconPreview] = useState(false);
//   const [showImagePreview, setShowImagePreview] = useState(false);
//   const formRef = useRef();

//   const isEdit = !!editData;

//   // Get full image URL
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (value.startsWith("http") || value.startsWith("data:image")) {
//       return value;
//     }
//     if (value.startsWith("/uploads/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     return value;
//   };

//   // Populate form data when editing
//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         category_name: editData.category_name || "",
//         is_trending: editData.is_trending || false,
//         icon: editData.icon || "",
//         image: editData.image || "",
//         is_status: editData.is_status !== undefined ? editData.is_status : true,
//       });
//       // Set previews from existing data
//       if (editData.icon) {
//         setIconPreview(getFullImageUrl(editData.icon));
//       }
//       if (editData.image) {
//         setImagePreview(getFullImageUrl(editData.image));
//       }
//       setIconFile(null);
//       setImageFile(null);
//     } else {
//       setFormData({
//         category_name: "",
//         is_trending: false,
//         icon: "",
//         image: "",
//         is_status: true,
//       });
//       setIconPreview("");
//       setImagePreview("");
//       setIconFile(null);
//       setImageFile(null);
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

//   // Handle file upload for image
//   const handleImageUpload = (e) => {
//     const files = e.target.files ? Array.from(e.target.files) : e;
//     const file = files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       showError("Please upload an image file for image");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       showError("File size must be less than 5MB");
//       return;
//     }

//     setImageUploading(true);
//     try {
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//       setImageFile(file);
//       setFormData((prev) => ({ ...prev, image: file.name }));
//       showSuccess(`Image "${file.name}" uploaded successfully`);
//     } catch (error) {
//       console.error("Image upload error:", error);
//       showError("Failed to upload image");
//     } finally {
//       setImageUploading(false);
//       setImageDragOver(false);
//     }
//   };

//   // Remove icon
//   const removeIcon = () => {
//     setIconPreview("");
//     setIconFile(null);
//     setFormData((prev) => ({ ...prev, icon: "" }));
//   };

//   // Remove image
//   const removeImage = () => {
//     setImagePreview("");
//     setImageFile(null);
//     setFormData((prev) => ({ ...prev, image: "" }));
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (name === "icon" && !iconFile) {
//         setIconPreview(value);
//       }
//       if (name === "image" && !imageFile) {
//         setImagePreview(value);
//       }
//     }

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.category_name.trim()) {
//       newErrors.category_name = "Category name is required";
//     }
//     if (formData.category_name.length < 2) {
//       newErrors.category_name = "Name must be at least 2 characters";
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
//         category_name: formData.category_name.trim(),
//         is_trending: formData.is_trending === true,
//         is_status: formData.is_status === true,
//       };

//       if (
//         formData.icon &&
//         formData.icon.trim() !== "" &&
//         formData.icon !== "null"
//       ) {
//         submitData.icon = formData.icon.trim();
//       }

//       if (
//         formData.image &&
//         formData.image.trim() !== "" &&
//         formData.image !== "null"
//       ) {
//         submitData.image = formData.image.trim();
//       }

//       if (iconFile) {
//         submitData.iconFile = iconFile;
//       }
//       if (imageFile) {
//         submitData.imageFile = imageFile;
//       }

//       console.log("Submitting job category data:", submitData);

//       if (isEdit) {
//         const id = editData.id || editData._id;
//         if (!id) {
//           throw new Error("No ID found for update");
//         }
//         await jobCategoryService.update(id, submitData);
//         showSuccess("Job category updated successfully");
//       } else {
//         await jobCategoryService.create(submitData);
//         showSuccess("Job category created successfully");
//       }
//       onSuccess();
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error.message ||
//         `Failed to ${isEdit ? "update" : "create"} job category`;
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

//   // Render upload section
//   const renderUploadSection = (type) => {
//     const isIcon = type === "icon";
//     const preview = isIcon ? iconPreview : imagePreview;
//     const file = isIcon ? iconFile : imageFile;
//     const uploading = isIcon ? iconUploading : imageUploading;
//     const dragOver = isIcon ? iconDragOver : imageDragOver;
//     const setDragOver = isIcon ? setIconDragOver : setImageDragOver;
//     const handleUpload = isIcon ? handleIconUpload : handleImageUpload;
//     const handleRemove = isIcon ? removeIcon : removeImage;
//     const label = isIcon ? "Icon" : "Image";
//     const IconComponent = isIcon ? MdInsertPhoto : MdImage;
//     const colors = isIcon
//       ? {
//           border: "border-[#2c0eee]",
//           bg: "bg-blue-50",
//           text: "text-[#2c0eee]",
//           hover: "hover:border-[#2c0eee]",
//           lightBg: "bg-blue-50/50",
//         }
//       : {
//           border: "border-green-300",
//           bg: "bg-green-50",
//           text: "text-green-600",
//           hover: "hover:border-green-400",
//           lightBg: "bg-green-50/50",
//         };

//     if (preview) {
//       return (
//         <div
//           className={`flex items-center gap-4 p-4 ${colors.bg} rounded-xl border ${colors.border} ${colors.hover} transition-all`}
//         >
//           <div className="relative flex-shrink-0">
//             {isImageUrl(preview) ? (
//               <img
//                 src={preview}
//                 alt={`${label} preview`}
//                 className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-sm"
//                 onError={(e) => {
//                   e.target.src =
//                     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='40' y='40' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
//                 }}
//               />
//             ) : (
//               <div
//                 className={`w-20 h-20 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text}`}
//               >
//                 <IconComponent size={32} />
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="text-sm font-medium text-gray-800 truncate">
//               {file ? file.name : formData[type] || label}
//             </div>
//             {file && (
//               <div className="text-xs text-gray-400 mt-0.5">
//                 {(file.size / 1024).toFixed(1)} KB • {file.type}
//               </div>
//             )}
//             <div className="text-xs text-gray-400 mt-1">
//               Click change to upload a different {label.toLowerCase()}
//             </div>
//           </div>
//           <div className="flex gap-2 flex-shrink-0">
//             <label
//               className={`px-3 py-1.5 text-sm ${colors.text} ${colors.bg} hover:${colors.bg} rounded-lg transition-colors cursor-pointer`}
//             >
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleUpload}
//                 className="hidden"
//                 disabled={loading}
//               />
//               Change
//             </label>
//             <button
//               type="button"
//               onClick={handleRemove}
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
//           dragOver
//             ? `${colors.border} ${colors.bg}`
//             : `border-gray-300 ${colors.lightBg} ${colors.hover}`
//         } ${loading || uploading ? "opacity-50 pointer-events-none" : ""}`}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragOver(true);
//         }}
//         onDragLeave={() => setDragOver(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           const files = Array.from(e.dataTransfer.files);
//           handleUpload({ target: { files } });
//         }}
//       >
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleUpload}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           disabled={loading}
//         />
//         <div className="flex flex-col items-center">
//           <div
//             className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} mb-3`}
//           >
//             <MdCloudUpload size={28} />
//           </div>
//           <p className={`text-sm font-medium ${colors.text}`}>
//             {dragOver
//               ? `Drop ${label.toLowerCase()} here`
//               : uploading
//                 ? `Uploading ${label}...`
//                 : `Upload ${label}`}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             {uploading ? "Please wait..." : `Drag & drop or click to browse`}
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
//       title={isEdit ? "Edit Job Category" : "Add New Job Category"}
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
//                 {isEdit ? `Edit Job Category` : `Add New Job Category`}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {isEdit
//                   ? "Update job category information"
//                   : "Fill in the details to create a new job category"}
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
//             {/* Category Name */}
//             <Input
//               label="Category Name"
//               name="category_name"
//               value={formData.category_name}
//               onChange={handleChange}
//               placeholder="Enter job category name"
//               required
//               error={errors.category_name}
//               disabled={loading}
//             />

//             {/* Two Column Layout for Icon and Image */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Icon Upload */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Icon
//                 </label>
//                 {renderUploadSection("icon")}
//               </div>

//               {/* Image Upload */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Image
//                 </label>
//                 {renderUploadSection("image")}
//               </div>
//             </div>

//             {/* Checkboxes */}
//             <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 pt-4">
//               <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="is_trending"
//                   checked={formData.is_trending === true}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
//                   disabled={loading}
//                 />
//                 <MdTrendingUp
//                   className={
//                     formData.is_trending ? "text-green-600" : "text-gray-400"
//                   }
//                 />
//                 Trending
//               </label>

//               <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="is_status"
//                   checked={formData.is_status === true}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
//                   disabled={loading}
//                 />
//                 Active
//               </label>
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

// export default AddJobCategory;
