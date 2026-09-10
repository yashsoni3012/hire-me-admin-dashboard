// import React, { useState, useEffect, useRef } from "react";
// import { MdCategory, MdTrendingUp, MdClose } from "react-icons/md";
// import Modal from "../../components/common/Modal";
// import Input from "../../components/common/Input";
// import Button from "../../components/common/Button";
// import { functionRoleCategoryService } from "../../services/functionRoleCategory.service";
// import { showSuccess, showError } from "../../utils/toast";

// const AddFunctionRoleCategory = ({ isOpen, onClose, onSuccess, editData }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     is_trending: false,
//     status: true,
//   });
//   const [errors, setErrors] = useState({});
//   const formRef = useRef();

//   const isEdit = !!editData;

//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         name: editData.name || "",
//         is_trending: editData.is_trending || false,
//         status: editData.status !== undefined ? editData.status : true,
//       });
//     } else {
//       setFormData({
//         name: "",
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
//       newErrors.name = "Category name is required";
//     }
//     if (formData.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
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
//         is_trending: formData.is_trending === true,
//         status: formData.status === true,
//       };

//       console.log("Submitting function role category data:", submitData);

//       if (isEdit) {
//         const id = editData.id || editData._id;
//         if (!id) {
//           throw new Error("No ID found for update");
//         }
//         await functionRoleCategoryService.update(id, submitData);
//         showSuccess("Function role category updated successfully");
//       } else {
//         await functionRoleCategoryService.create(submitData);
//         showSuccess("Function role category created successfully");
//       }
//       onSuccess();
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error.message ||
//         `Failed to ${isEdit ? "update" : "create"} function role category`;
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
//           ? "Edit Function Role Category"
//           : "Add New Function Role Category"
//       }
//       size="md"
//     >
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#2c0eee] flex items-center justify-center text-white shadow-lg shadow-[#4529f7]">
//               <MdCategory size={22} />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">
//                 {isEdit
//                   ? "Edit Function Role Category"
//                   : "Add New Function Role Category"}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {isEdit
//                   ? "Update function role category information"
//                   : "Fill in the details to create a new function role category"}
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
//               label="Category Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter category name"
//               required
//               error={errors.name}
//               disabled={loading}
//             />

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

// export default AddFunctionRoleCategory;
