// import React, { useState, useEffect, useRef } from "react";
// import { MdSchool, MdTrendingUp } from "react-icons/md";
// import Modal from "../../components/common/Modal";
// import Form from "../../components/common/Form";
// import Input from "../../components/common/Input";
// import { educationSubCategoryService } from "../../services/educationSubCategory.service";
// import { educationCategoryService } from "../../services/educationCategory.service";
// import { showSuccess, showError } from "../../utils/toast";

// const AddEducationSubCategory = ({ isOpen, onClose, onSuccess, editData }) => {
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     education_id: "",
//     is_trending: false,
//     status: true,
//   });
//   const [errors, setErrors] = useState({});
//   const formRef = useRef();

//   const isEdit = !!editData;

//   // Fetch education categories for dropdown
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoadingCategories(true);
//       try {
//         const response = await educationCategoryService.getAll({ limit: 100 });
//         const categoryList = response.data || response.results || [];
//         setCategories(categoryList);
//       } catch (error) {
//         showError("Failed to load education categories");
//         console.error("Error fetching categories:", error);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     if (isOpen) {
//       fetchCategories();
//     }
//   }, [isOpen]);

//   // Populate form data when editing
//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         name: editData.name || "",
//         education_id: editData.education_id || "",
//         is_trending: editData.is_trending || false,
//         status: editData.status !== undefined ? editData.status : true,
//       });
//     } else {
//       setFormData({
//         name: "",
//         education_id: "",
//         is_trending: false,
//         status: true,
//       });
//     }
//     setErrors({});
//   }, [editData]);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFormData((prev) => ({ ...prev, [name]: val }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = "Sub-category name is required";
//     }
//     if (formData.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }
//     if (!formData.education_id) {
//       newErrors.education_id = "Please select a parent education category";
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
//         education_id: parseInt(formData.education_id),
//         is_trending: formData.is_trending,
//         status: formData.status,
//       };

//       console.log("Submitting education sub-category data:", submitData);

//       if (isEdit) {
//         const id = editData.id || editData._id;
//         if (!id) {
//           throw new Error("No ID found for update");
//         }
//         await educationSubCategoryService.update(id, submitData);
//         showSuccess("Education sub-category updated successfully");
//       } else {
//         await educationSubCategoryService.create(submitData);
//         showSuccess("Education sub-category created successfully");
//       }
//       onSuccess();
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error.message ||
//         `Failed to ${isEdit ? "update" : "create"} education sub-category`;
//       showError(errorMessage);
//       if (error.errors) {
//         setErrors(error.errors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={
//         isEdit
//           ? "Edit Education Sub-Category"
//           : "Add New Education Sub-Category"
//       }
//       size="md"
//     >
//       <Form
//         ref={formRef}
//         onSubmit={handleSubmit}
//         onCancel={onClose}
//         loading={loading}
//         submitLabel={isEdit ? "Update" : "Create"}
//         cancelLabel="Cancel"
//         icon={MdSchool}
//         title={
//           isEdit
//             ? "Edit Education Sub-Category"
//             : "Add New Education Sub-Category"
//         }
//         subtitle={
//           isEdit
//             ? "Update education sub-category information"
//             : "Fill in the details to create a new education sub-category"
//         }
//         isEdit={isEdit}
//         showCancel={true}
//       >
//         <div className="space-y-4">
//           <Input
//             label="Sub-Category Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter sub-category name"
//             required
//             error={errors.name}
//             disabled={loading}
//           />

//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Parent Education Category{" "}
//               <span className="text-red-500 ml-1">*</span>
//             </label>
//             <select
//               name="education_id"
//               value={formData.education_id}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent ${
//                 errors.education_id
//                   ? "border-red-400 bg-red-50"
//                   : "border-gray-300 bg-white"
//               }`}
//               disabled={loading || loadingCategories}
//             >
//               <option value="">Select an education category</option>
//               {categories.map((category) => (
//                 <option
//                   key={category.id || category._id}
//                   value={category.id || category._id}
//                 >
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//             {errors.education_id && (
//               <p className="text-xs text-red-500">{errors.education_id}</p>
//             )}
//           </div>

//           <div className="flex flex-wrap items-center gap-4">
//             <label className="flex items-center gap-2 text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 name="is_trending"
//                 checked={formData.is_trending}
//                 onChange={handleChange}
//                 className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7]"
//                 disabled={loading}
//               />
//               <MdTrendingUp
//                 className={
//                   formData.is_trending ? "text-green-600" : "text-gray-400"
//                 }
//               />
//               Trending
//             </label>

//             <label className="flex items-center gap-2 text-sm text-gray-700">
//               <input
//                 type="checkbox"
//                 name="status"
//                 checked={formData.status}
//                 onChange={handleChange}
//                 className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7]"
//                 disabled={loading}
//               />
//               Active
//             </label>
//           </div>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default AddEducationSubCategory;
