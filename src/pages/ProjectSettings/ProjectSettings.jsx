import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
  MdRefresh,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { projectSettingService } from "../../services/projectSetting.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://hire-me-jobs.onrender.com";

const ProjectSettings = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});
  const [togglingId, setTogglingId] = useState(null);

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Normalize project setting data
  const normalizeSetting = (item) => {
    return {
      id: item.id || item._id,
      setting_group: item.setting_group || "",
      setting_key: item.setting_key || "",
      setting_value: item.setting_value || "",
      value_type: item.value_type || "string",
      description: item.description || "",
      is_public: item.is_public === 1 || item.is_public === true,
      display_order: item.display_order || 0,
      status: item.status === 1 || item.status === true,
      created_by: item.created_by || "",
      updated_by: item.updated_by || "",
      created_at: item.created_at || item.createdAt || null,
      updated_at: item.updated_at || item.updatedAt || null,
      createdBy: item.createdBy || null,
      updatedBy: item.updatedBy || null,
    };
  };

  // Load project settings
  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach((id) => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await projectSettingService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const settings = Array.isArray(rawData)
        ? rawData.map(normalizeSetting)
        : [];

      // ─── FIX: Sort by created_at (newest first) ──────────────────────
      const sortedSettings = settings.sort((a, b) => {
        // Parse dates for comparison
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA; // Newest first
      });

      setData(sortedSettings);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load project settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, groupFilter]);

  // Get unique groups for filter
  const groups = useMemo(() => {
    const groupSet = new Set(
      data.map((item) => item.setting_group).filter(Boolean),
    );
    return ["all", ...Array.from(groupSet)];
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data;

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((item) => item.status === isActive);
    }

    if (groupFilter !== "all") {
      result = result.filter((item) => item.setting_group === groupFilter);
    }

    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (item) =>
          String(item.setting_key ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.setting_group ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.description ?? "")
            .toLowerCase()
            .includes(query),
      );
    }
    return result;
  }, [data, search, statusFilter, groupFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.status === true).length;
  const inactiveCount = data.length - activeCount;

  const getCreatedByName = (row) => {
    if (!row) return "-";
    if (row.createdBy?.name) return row.createdBy.name;
    if (row.created_by) return getUserNameCached(row.created_by);
    return "-";
  };

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updatedBy?.name) return row.updatedBy.name;
    if (row.updated_by) return getUserNameCached(row.updated_by);
    return "-";
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await projectSettingService.delete(deleteId);
      showSuccess("Project setting deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this setting because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete setting");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.status === true;
    const newStatus = !currentStatus;

    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, status: newStatus } : item,
      ),
    );

    try {
      const updateData = {
        setting_group: row.setting_group,
        setting_key: row.setting_key,
        setting_value: row.setting_value,
        value_type: row.value_type || "string",
        description: row.description || "",
        is_public: row.is_public ? 1 : 0,
        display_order: row.display_order || 0,
        status: newStatus,
      };

      await projectSettingService.update(row.id, updateData);
      showSuccess(
        `Status ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Status toggle error:", error);
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: currentStatus } : item,
        ),
      );
      showError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status",
      );
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Get full image URL ─────────────────────────────────────────────
  const getFullFileUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http") || value.startsWith("data:")) {
      return value;
    }
    if (value.startsWith("/uploads/")) {
      return `${API_BASE_URL}${value}`;
    }
    return value;
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Setting Key",
      key: "setting_key",
      render: (v) => (
        <span className="font-medium text-gray-800 font-mono text-sm">{v}</span>
      ),
    },
    {
      header: "Group",
      key: "setting_group",
      render: (v) => (
        <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {v}
        </span>
      ),
    },
    {
      header: "Type",
      key: "value_type",
      render: (v) => (
        <span className="text-gray-500 text-sm uppercase">{v}</span>
      ),
    },
  {
  header: "Value",
  key: "setting_value",
  render: (v, row) => {
    if (row.value_type === "file" && v) {
      // Get the full filename from path
      const fullFileName = v.split("/").pop();
      
      // Remove timestamp prefix (numbers followed by hyphen)
      // Example: "1787400762739-ganesh.jpg" -> "ganesh.jpg"
      const cleanFileName = fullFileName.replace(/^\d+-/, "");
      
      return (
        <a
          href={getFullFileUrl(v)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2c0eee] text-sm inline-block hover:underline"
          title={v}
        >
           {cleanFileName}
        </a>
      );
    }
    return <span className="text-gray-700">{v || "-"}</span>;
  },
},
    {
      header: "Public",
      key: "is_public",
      render: (v) => (
        <span className={`text-sm ${v ? "text-green-600" : "text-gray-400"}`}>
          {v ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (value, row) => {
        const isActive = value === true;
        const isLoading = togglingId === row.id;
        return (
          <button
            onClick={() => handleStatusToggle(row)}
            disabled={isLoading}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
              isLoading ? "opacity-50 cursor-wait" : ""
            } ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        );
      },
    },
    {
      header: "Updated By",
      key: "updated_by",
      render: (_, row) => (
        <span className="text-gray-500 text-sm font-medium">
          {getUpdatedByName(row)}
        </span>
      ),
    },
    {
      header: "Updated At",
      key: "updated_at",
      render: (v) => (
        <span className="text-gray-500 text-sm">{formatDate(v)}</span>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() =>
              navigate(`/project-settings/view/${row.id}`, {
                state: { item: row },
              })
            }
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() =>
              navigate(`/project-settings/edit/${row.id}`, {
                state: { item: row },
              })
            }
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
            title="Edit"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => setDeleteId(id)}
            className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
            title="Delete"
          >
            <MdDelete size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tabs = [
    { key: "all", label: "All", count: data.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
  ];

  const totalPages = Math.ceil(filteredData.length / limit);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage application settings and configurations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={MdRefresh}
            onClick={load}
            loading={loading}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            icon={MdAdd}
            onClick={() => navigate("/project-settings/add")}
          >
            Add Setting
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <MdSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search settings..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
                      ? "bg-blue-50 text-[#2c0eee]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="No project settings found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} settings
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee]"
              >
                {[5, 10, 15, 20, 25, 50, 100].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`p-1 rounded-lg transition-colors ${
                  page === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <MdChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600 px-2">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                className={`p-1 rounded-lg transition-colors ${
                  page === totalPages || totalPages === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Project Setting"
        message="Delete this project setting? This action cannot be undone."
      />
    </div>
  );
};

export default ProjectSettings;