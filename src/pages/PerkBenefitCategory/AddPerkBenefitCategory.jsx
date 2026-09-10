// import React, { useState, useEffect, useRef } from "react";
// import { MdCardGiftcard, MdTrendingUp } from "react-icons/md";
// import Modal from "../../components/common/Modal";
// import Form from "../../components/common/Form";
// import Input from "../../components/common/Input";
// import { perkBenefitCategoryService } from "../../services/perkBenefitCategory.service";
// import { showSuccess, showError } from "../../utils/toast";

// const AddPerkBenefitCategory = ({ isOpen, onClose, onSuccess, editData }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     is_trending: false,
//     is_status: true,
//   });
//   const [errors, setErrors] = useState({});
//   const formRef = useRef();

//   const isEdit = !!editData;

//   // Populate form data when editing
//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         name: editData.name || "",
//         is_trending: editData.is_trending || false,
//         is_status: editData.is_status !== undefined ? editData.is_status : true,
//       });
//     } else {
//       setFormData({
//         name: "",
//         is_trending: false,
//         is_status: true,
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
//       newErrors.name = "Category name is required";
//     }
//     if (formData.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
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
//         is_trending: formData.is_trending,
//         is_status: formData.is_status,
//       };

//       console.log("Submitting perk benefit category data:", submitData);

//       if (isEdit) {
//         const id = editData.id || editData._id;
//         if (!id) {
//           throw new Error("No ID found for update");
//         }
//         await perkBenefitCategoryService.update(id, submitData);
//         showSuccess("Perk benefit category updated successfully");
//       } else {
//         await perkBenefitCategoryService.create(submitData);
//         showSuccess("Perk benefit category created successfully");
//       }
//       onSuccess();
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error.message ||
//         `Failed to ${isEdit ? "update" : "create"} perk benefit category`;
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
//         isEdit ? "Edit Perk Benefit Category" : "Add New Perk Benefit Category"
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
//         icon={MdCardGiftcard}
//         title={
//           isEdit
//             ? "Edit Perk Benefit Category"
//             : "Add New Perk Benefit Category"
//         }
//         subtitle={
//           isEdit
//             ? "Update perk benefit category information"
//             : "Fill in the details to create a new perk benefit category"
//         }
//         isEdit={isEdit}
//         showCancel={true}
//       >
//         <div className="space-y-4">
//           <Input
//             label="Category Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter perk benefit category name"
//             required
//             error={errors.name}
//             disabled={loading}
//           />

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
//                 name="is_status"
//                 checked={formData.is_status}
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

// export default AddPerkBenefitCategory;
