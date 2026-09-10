import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectSettingFormPage from "../../components/common/ProjectSettingFormPage";
import { projectSettingService } from "../../services/projectSetting.service";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";

const AddProjectSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || 1;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (submitData, { selectedFile }) => {
    setLoading(true);
    try {
      // ─── Create payload ──────────────────────────────────────────────
      const payload = {
        ...submitData,
        created_by: userId,
        updated_by: userId,
      };

      if (submitData.value_type === "file" && selectedFile) {
        payload.setting_file = selectedFile;
        delete payload.setting_value;
      }

      console.log("📤 Submitting payload:", {
        ...payload,
        setting_file: payload.setting_file
          ? `File: ${payload.setting_file.name}`
          : undefined,
      });

      await projectSettingService.create(payload);
      showSuccess("Project setting created successfully");
      navigate("/project-settings");
    } catch (error) {
      console.error("Project Setting create error:", error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create project setting",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectSettingFormPage
      mode="add"
      onSubmit={handleSubmit}
      loading={loading}
      title="Add Project Setting"
      breadcrumb="Add a new project setting"
      navigateTo="/project-settings"
      submitLabel="Create"
    />
  );
};

export default AddProjectSettings;
