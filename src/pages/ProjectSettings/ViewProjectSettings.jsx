import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ProjectSettingFormPage from '../../components/common/ProjectSettingFormPage';
import { projectSettingService } from '../../services/projectSetting.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

// Coerce various truthy/falsy representations to a real boolean
const toBool = (val, fallback = false) => {
  if (val === undefined || val === null || val === '') return fallback;
  if (val === true || val === 1 || val === '1' || val === 'true') return true;
  if (val === false || val === 0 || val === '0' || val === 'false') return false;
  return Boolean(val);
};

const ViewProjectSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNameCache, setUserNameCache] = useState({});

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return '-';
    return userNameCache[userId] || `User ${userId}`;
  };

  // ─── Fetch project setting data ────────────────────────────────────
  useEffect(() => {
    const fetchSetting = async () => {
      setLoading(true);
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((uid) => {
          userMap[uid] = users[uid].name;
        });
        setUserNameCache(userMap);

        let item = location.state?.item;

        if (!item) {
          const response = await projectSettingService.getById(id);
          item = response?.data?.data || response?.data || response;
        }

        console.log('📥 Fetched item:', item);

        if (item) {
          // Shape matches what ProjectSettingFormPage expects in view/edit mode:
          // is_public as boolean, status as 'active'/'inactive' string.
          const normalized = {
            setting_group: item.setting_group || '',
            setting_key: item.setting_key || '',
            setting_value:
              item.setting_value !== undefined && item.setting_value !== null
                ? String(item.setting_value)
                : '',
            value_type: item.value_type || 'string',
            description: item.description || '',
            is_public: toBool(item.is_public, false),
            // display_order: item.display_order ?? 0,
            status: toBool(item.status ?? item.is_status, true) ? 'active' : 'inactive',
          };

          setInitialData(normalized);
          setViewData(item);
        } else {
          showError('Project setting not found');
          navigate('/project-settings');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load project setting data');
        navigate('/project-settings');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSetting();
    }
  }, [id, location.state, navigate]);

  const handleEdit = () => {
    navigate(`/project-settings/edit/${id}`, { state: { item: viewData } });
  };

  // ─── Audit trail rows, passed in as extraViewFields ────────────────
  const extraViewFields = viewData
    ? [
        {
          label: 'Created By',
          value: viewData.createdBy?.name || getUserNameCached(viewData.created_by),
        },
        {
          label: 'Updated By',
          value: viewData.updatedBy?.name || getUserNameCached(viewData.updated_by),
        },
        {
          label: 'Created At',
          value: viewData.created_at || viewData.createdAt ? formatDate(viewData.created_at || viewData.createdAt) : '—',
        },
        {
          label: 'Updated At',
          value: viewData.updated_at || viewData.updatedAt ? formatDate(viewData.updated_at || viewData.updatedAt) : '—',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading project setting details...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <ProjectSettingFormPage
      mode="view"
      initialData={initialData}
      onEdit={handleEdit}
      navigateTo="/project-settings"
      title="Project Setting Details"
      breadcrumb={`Viewing: ${viewData?.setting_key || 'Project Setting'}`}
      showEdit={true}
      editLabel="Edit Setting"
      cancelLabel="Back to Settings"
      extraViewFields={extraViewFields}
    />
  );
};

export default ViewProjectSettings;