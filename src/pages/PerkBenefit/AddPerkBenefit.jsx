// import React, { useState, useEffect, useRef } from "react";
// import { MdCardGiftcard, MdTrendingUp } from "react-icons/md";
// import Modal from "../../components/common/Modal";
// import Form from "../../components/common/Form";
// import Input from "../../components/common/Input";
// import { perkBenefitService } from "../../services/perkBenefit.service";
// import { perkBenefitCategoryService } from "../../services/perkBenefitCategory.service";
// import { showSuccess, showError } from "../../utils/toast";

// const AddPerkBenefit = ({ isOpen, onClose, onSuccess, editData }) => {
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     category_id: "",
//     is_trending: false,
//     is_status: true,
//   });
//   const [errors, setErrors] = useState({});
//   const formRef = useRef();

//   const isEdit = !!editData;

//   // Fetch perk benefit categories for dropdown
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoadingCategories(true);
//       try {
//         const response = await perkBenefitCategoryService.getAll({
//           limit: 100,
//         });
//         const categoryList = response.data || response.results || [];

//         // Filter only active categories (is_status === true)
//         const activeCategories = categoryList.filter(
//           (category) => category.is_status === true || category.is_status === "active" || category.is_status === 1
//         );

//         setCategories(activeCategories);
//         console.log("Fetched active categories:", activeCategories);
//       } catch (error) {
//         showError("Failed to load perk benefit categories");
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
//     console.log("Edit data received:", editData);

//     if (editData) {
//       // Get category_id from various possible locations
//       let categoryId = "";

//       if (editData.category_id) {
//         categoryId = editData.category_id;
//       } else if (editData.category && editData.category.id) {
//         categoryId = editData.category.id;
//       } else if (
//         editData.perks_benefits_category &&
//         editData.perks_benefits_category.id
//       ) {
//         categoryId = editData.perks_benefits_category.id;
//         console.log(
//           "Found category in perks_benefits_category:",
//           editData.perks_benefits_category,
//         );
//       } else if (
//         editData.perk_benefit_category &&
//         editData.perk_benefit_category.id
//       ) {
//         categoryId = editData.perk_benefit_category.id;
//       } else if (
//         editData.perkBenefitsCategory &&
//         editData.perkBenefitsCategory.id
//       ) {
//         categoryId = editData.perkBenefitsCategory.id;
//       } else if (editData.categoryId) {
//         categoryId = editData.categoryId;
//       }

//       // Handle is_status - convert to boolean
//       let statusValue = true;

//       // Check if is_status exists (primary)
//       if (editData.is_status !== undefined && editData.is_status !== null) {
//         if (typeof editData.is_status === "boolean") {
//           statusValue = editData.is_status;
//         } else if (typeof editData.is_status === "string") {
//           statusValue =
//             editData.is_status === "active" ||
//             editData.is_status === "true" ||
//             editData.is_status === "1";
//         } else if (typeof editData.is_status === "number") {
//           statusValue = editData.is_status === 1;
//         }
//       }
//       // Fallback to status
//       else if (editData.status !== undefined && editData.status !== null) {
//         if (typeof editData.status === "boolean") {
//           statusValue = editData.status;
//         } else if (typeof editData.status === "string") {
//           statusValue =
//             editData.status === "active" ||
//             editData.status === "true" ||
//             editData.status === "1";
//         } else if (typeof editData.status === "number") {
//           statusValue = editData.status === 1;
//         }
//       }

//       console.log("Extracted category_id:", categoryId);
//       console.log("Extracted is_status:", statusValue);

//       setFormData({
//         name: editData.name || "",
//         category_id: categoryId,
//         is_trending: editData.is_trending || false,
//         is_status: statusValue,
//       });
//     } else {
//       setFormData({
//         name: "",
//         category_id: "",
//         is_trending: false,
//         is_status: true,
//       });
//     }
//     setErrors({});
//   }, [editData]);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     console.log(`Field ${name} changed:`, { type, value, checked });

//     if (type === "checkbox") {
//       setFormData((prev) => {
//         const newData = { ...prev, [name]: checked };
//         console.log("New form data:", newData);
//         return newData;
//       });
//     } else {
//       setFormData((prev) => {
//         const newData = { ...prev, [name]: value };
//         console.log("New form data:", newData);
//         return newData;
//       });
//     }

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = "Perk benefit name is required";
//     }
//     if (formData.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }
//     if (!formData.category_id) {
//       newErrors.category_id = "Please select a perk benefit category";
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
//         category_id: parseInt(formData.category_id),
//         is_trending: formData.is_trending === true,
//         is_status: formData.is_status === true,
//       };

//       console.log("Submitting perk benefit data:", submitData);

//       if (isEdit) {
//         const id = editData.id || editData._id;
//         if (!id) {
//           throw new Error("No ID found for update");
//         }
//         await perkBenefitService.update(id, submitData);
//         showSuccess("Perk benefit updated successfully");
//       } else {
//         await perkBenefitService.create(submitData);
//         showSuccess("Perk benefit created successfully");
//       }
//       onSuccess();
//     } catch (error) {
//       console.error("Submit error:", error);
//       const errorMessage =
//         error.message ||
//         `Failed to ${isEdit ? "update" : "create"} perk benefit`;
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
//       title={isEdit ? "Edit Perk Benefit" : "Add New Perk Benefit"}
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
//         title={isEdit ? "Edit Perk Benefit" : "Add New Perk Benefit"}
//         subtitle={
//           isEdit
//             ? "Update perk benefit information"
//             : "Fill in the details to create a new perk benefit"
//         }
//         isEdit={isEdit}
//         showCancel={true}
//       >
//         <div className="space-y-4">
//           <Input
//             label="Perk Benefit Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter perk benefit name"
//             required
//             error={errors.name}
//             disabled={loading}
//           />

//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Perk Benefit Category <span className="text-red-500 ml-1">*</span>
//             </label>
//             <select
//               name="category_id"
//               value={formData.category_id || ""}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent ${errors.category_id
//                   ? "border-red-400 bg-red-50"
//                   : "border-gray-300 bg-white"
//                 }`}
//               disabled={loading || loadingCategories}
//             >
//               <option value="">Select a category</option>
//               {categories.map((category) => {
//                 const categoryId = category.id || category._id;
//                 return (
//                   <option key={categoryId} value={categoryId}>
//                     {category.name}
//                   </option>
//                 );
//               })}
//             </select>
//             {errors.category_id && (
//               <p className="text-xs text-red-500">{errors.category_id}</p>
//             )}
//             {loadingCategories && (
//               <p className="text-xs text-gray-500">Loading categories...</p>
//             )}
//           </div>

//           <div className="flex flex-wrap items-center gap-4">
//             <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="is_trending"
//                 checked={formData.is_trending === true}
//                 onChange={handleChange}
//                 className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
//                 disabled={loading}
//               />
//               <MdTrendingUp
//                 className={
//                   formData.is_trending ? "text-green-600" : "text-gray-400"
//                 }
//               />
//               Trending
//             </label>

//             <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="is_status"
//                 checked={formData.is_status === true}
//                 onChange={handleChange}
//                 className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7] cursor-pointer"
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

// export default AddPerkBenefit;