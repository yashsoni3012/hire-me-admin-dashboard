// import React, { useState, useEffect, useRef } from "react";
// import { MdWork, MdTrendingUp, MdClose } from "react-icons/md";
// import Modal from "../../components/common/Modal";
// import Input from "../../components/common/Input";
// import Button from "../../components/common/Button";
// import { functionRolesService } from "../../services/functionRoles.service";
// import { functionRoleCategoryService } from "../../services/functionRoleCategory.service";
// import { showSuccess, showError } from "../../utils/toast";

// const AddFunctionRoles = ({ isOpen, onClose, onSuccess, editData }) => {
//   const [loading, setLoading] = useState(false);
//   const [roleCategories, setRoleCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     roles_category_id: "",
//     is_trending: false,
//     status: true,
//   });
//   const [errors, setErrors] = useState({});
//   const formRef = useRef();

//   const isEdit = !!editData;

//   // Fetch role categories for dropdown
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoadingCategories(true);
//       try {
//         const response = await functionRoleCategoryService.getAll({ limit: 100 });
//         const categoryList = response.data || response.results || [];

//         // Filter only active categories (status === true or is_status === true)
//         const activeCategories = categoryList.filter(
//           (category) =>
//             category.status === true ||
//             category.status === "active" ||
//             category.status === 1 ||
//             category.is_status === true ||
//             category.is_status === "active" ||
//             category.is_status === 1
//         );

//         setRoleCategories(activeCategories);
//         console.log("Fetched active role categories:", activeCategories);
//       } catch (error) {
//         showError("Failed to load role categories");
//         console.error("Error fetching role categories:", error);
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
//       let categoryId = "";

//       if (editData.roles_category_id) {
//         categoryId = editData.roles_category_id;
//       } else if (editData.functionRoleCategory && editData.functionRoleCategory.id) {
//         categoryId = editData.functionRoleCategory.id;
//       }

//       setFormData({
//         name: editData.name || "",
//         roles_category_id: categoryId,
//         is_trending: editData.is_trending || false,
//         status: editData.status !== undefined ? editData.status : true,
//       });
//     } else {
//       setFormData({
//         name: "",
//         roles_category_id: "",
//         is_trending: false,
//         status: true,
//       });
//     }
//     setErrors({});
//   }, [editData]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFormData((prev) => ({ ...prev, [name]: val }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = "Function role name is required";
//     }
//     if (formData.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }
//     if (!formData.roles_category_id) {
//       newErrors.roles_category_id = "Please select a parent role category";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const submitData = {
//         name: formData.name.trim(),
//         roles_category_id: parseInt(formData.roles_category_id),
//         is_trending: formData.is_trending === true,
//         status: formData.status === true,
//       };

//       console.log("Submitting function role data:", submitData);

//       if (isEdit) {
//         const id = editData.id || editData._id;
//         if (!id) {
//           throw new Error("No ID found for update");
//         }
//         await functionRolesService.update(id, submitData);
//         showSuccess("Function role updated successfully");
//       } else {
//         await functionRolesService.create(submitData);
//         showSuccess("Function role created successfully");
//       }
//       onSuccess();
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error.message || `Failed to ${isEdit ? "update" : "create"} function role`;
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
//       title={isEdit ? "Edit Function Role" : "Add New Function Role"}
//       size="md"
//     >
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#2c0eee] flex items-center justify-center text-white shadow-lg shadow-[#4529f7]">
//               <MdWork size={22} />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">
//                 {isEdit ? "Edit Function Role" : "Add New Function Role"}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {isEdit
//                   ? "Update function role information"
//                   : "Fill in the details to create a new function role"}
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

//         <form ref={formRef} onSubmit={handleSubmit} className="p-6">
//           <div className="space-y-6">
//             <Input
//               label="Function Role Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter function role name"
//               required
//               error={errors.name}
//               disabled={loading}
//             />

//             <div className="space-y-1">
//               <label className="block text-sm font-medium text-gray-700">
//                 Parent Role Category <span className="text-red-500 ml-1">*</span>
//               </label>
//               <select
//                 name="roles_category_id"
//                 value={formData.roles_category_id}
//                 onChange={handleChange}
//                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent ${errors.roles_category_id
//                     ? "border-red-400 bg-red-50"
//                     : "border-gray-300 bg-white"
//                   }`}
//                 disabled={loading || loadingCategories}
//               >
//                 <option value="">Select a role category</option>
//                 {roleCategories.map((category) => (
//                   <option key={category.id || category._id} value={category.id || category._id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.roles_category_id && (
//                 <p className="text-xs text-red-500">{errors.roles_category_id}</p>
//               )}
//               {loadingCategories && (
//                 <p className="text-xs text-gray-500">Loading categories...</p>
//               )}
//             </div>

//             <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 pt-4">
//               <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="is_trending"
//                   checked={formData.is_trending === true}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 cursor-pointer"
//                   disabled={loading}
//                 />
//                 <MdTrendingUp
//                   className={
//                     formData.is_trending ? "text-yellow-600" : "text-gray-400"
//                   }
//                 />
//                 Trending
//               </label>

//               <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="status"
//                   checked={formData.status === true}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
//                   disabled={loading}
//                 />
//                 Active
//               </label>
//             </div>

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

// export default AddFunctionRoles;