import React, { useState, useEffect, useRef } from "react";
import { MdCategory, MdTrendingUp } from "react-icons/md";
import Modal from "../../components/common/Modal";
import Form from "../../components/common/Form";
import Input from "../../components/common/Input";
import { roleCategoryService } from "../../services/roleCategory.service";
import { showSuccess, showError } from "../../utils/toast";

const AddRoleCategory = ({ isOpen, onClose, onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    is_trending: false,
    status: true,
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef();

  const isEdit = !!editData;

  // Populate form data when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        is_trending: editData.is_trending || false,
        status: editData.status !== undefined ? editData.status : true,
      });
    } else {
      setFormData({
        name: "",
        is_trending: false,
        status: true,
      });
    }
    setErrors({});
  }, [editData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Role category name is required";
    }
    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        is_trending: formData.is_trending,
        status: formData.status,
      };

      console.log("Submitting role category data:", submitData);

      if (isEdit) {
        const id = editData.id || editData._id;
        if (!id) {
          throw new Error("No ID found for update");
        }
        await roleCategoryService.update(id, submitData);
        showSuccess("Role category updated successfully");
      } else {
        await roleCategoryService.create(submitData);
        showSuccess("Role category created successfully");
      }
      onSuccess();
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error.message ||
        `Failed to ${isEdit ? "update" : "create"} role category`;
      showError(errorMessage);
      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Role Category" : "Add New Role Category"}
      size="md"
    >
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        submitLabel={isEdit ? "Update" : "Create"}
        cancelLabel="Cancel"
        icon={MdCategory}
        title={isEdit ? "Edit Role Category" : "Add New Role Category"}
        subtitle={
          isEdit
            ? "Update role category information"
            : "Fill in the details to create a new role category"
        }
        isEdit={isEdit}
        showCancel={true}
      >
        <div className="space-y-4">
          <Input
            label="Role Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter role category name"
            required
            error={errors.name}
            disabled={loading}
          />

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="is_trending"
                checked={formData.is_trending}
                onChange={handleChange}
                className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7]"
                disabled={loading}
              />
              <MdTrendingUp
                className={
                  formData.is_trending ? "text-green-600" : "text-gray-400"
                }
              />
              Trending
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="w-4 h-4 text-[#2c0eee] border-gray-300 rounded focus:ring-[#4529f7]"
                disabled={loading}
              />
              Active
            </label>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddRoleCategory;
