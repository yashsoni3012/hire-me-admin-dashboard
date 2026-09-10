// pages/project-settings/EditProjectSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ProjectSettingFormPage from "../../components/common/ProjectSettingFormPage";
import { projectSettingService } from "../../services/projectSetting.service";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";

// Coerce various truthy/falsy representations to a real boolean
const toBool = (val, fallback = false) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false") return false;
  return Boolean(val);
};

const EditProjectSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id || 1;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  // ─── Fetch existing setting ─────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setPageLoading(true);
      try {
        let item = location.state?.item;

        if (!item) {
          const response = await projectSettingService.getById(id);
          item = response?.data?.data || response?.data || response;
        }

        if (!item) {
          showError("Project setting not found");
          navigate("/project-settings");
          return;
        }

        const normalized = {
          setting_group: item.setting_group || "",
          setting_key: item.setting_key || "",
          setting_value:
            item.setting_value !== undefined && item.setting_value !== null
              ? String(item.setting_value)
              : "",
          value_type: item.value_type || "string",
          description: item.description || "",
          is_public: toBool(item.is_public, false),
          display_order: item.display_order ?? 0,
          status: toBool(item.status ?? item.is_status, true) ? "active" : "inactive",
        };

        // boolean values may come back as 1/0 or true/false — normalize to "true"/"false" string for the select
        if (normalized.value_type === "boolean") {
          normalized.setting_value = toBool(item.setting_value) ? "true" : "false";
        }

        setInitialData(normalized);
      } catch (error) {
        console.error("Fetch error:", error);
        showError("Failed to load project setting data");
        navigate("/project-settings");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id, location.state, navigate]);

  const handleSubmit = async (submitData, { selectedFile }) => {
    setLoading(true);
    try {
      const payload = {
        ...submitData,
        updated_by: userId,
      };

      // If value_type is file and a new file was chosen, send it.
      // If no new file was chosen, submitData.setting_value already
      // carries forward the existing path (see ProjectSettingFormPage).
      if (submitData.value_type === "file" && selectedFile) {
        payload.setting_file = selectedFile;
      }

      console.log("📤 Updating:", payload);
      await projectSettingService.update(id, payload);
      showSuccess("Project setting updated successfully");
      navigate("/project-settings");
    } catch (error) {
      console.error("Project Setting update error:", error);
      showError(
        error?.response?.data?.message || error?.message || "Failed to update project setting"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading setting data...</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectSettingFormPage
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={loading}
      title="Edit Project Setting"
      breadcrumb="Update this project setting"
      navigateTo="/project-settings"
      submitLabel="Update"
    />
  );
};

export default EditProjectSettings;