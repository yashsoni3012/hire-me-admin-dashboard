import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdInsertPhoto,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
import { subscriptionFeatureCategoryService } from "../../services/subscriptionFeatureCategory.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const SubscriptionFeatures = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [imageErrors, setImageErrors] = useState({});
  const [userNameCache, setUserNameCache] = useState({});

  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http") || value.startsWith("data:image")) {
      return value;
    }
    if (value.startsWith("/uploads/")) {
      return `${API_BASE_URL}${value}`;
    }
    return value;
  };

  // FIX: Normalize feature with proper icon handling
  const normalizeFeature = (item) => {
    // Ensure icon is properly preserved
    let iconValue = null;
    if (
      item.icon !== undefined &&
      item.icon !== null &&
      item.icon !== "null" &&
      item.icon !== ""
    ) {
      iconValue = item.icon;
    }

    return {
      id: item.id || item._id,
      feature_name: item.feature_name || "",
      feature_key: item.feature_key || "",
      feature_type: item.feature_type || "TEXT",
      description: item.description || "",
      icon: iconValue,
      subscription_feature_categories_id:
        item.subscription_feature_categories_id || "",
      Category: item.Category || null,
      parent_category_name: item.Category?.category_name || "",
      default_unit: item.default_unit || "",
      default_value: item.default_value || "",
      options_json: item.options_json || null,
      is_usage_track: item.is_usage_track || "no",
      is_required: item.is_required !== undefined ? item.is_required : 1,
      is_display: item.is_display !== undefined ? item.is_display : 1,
      display_order: item.display_order || 0,
      is_status: normalizeStatus(item),
      is_trending: item.is_trending || false,
      status: normalizeStatus(item),
      createdAt: item.created_at || item.createdAt || null,
      updatedAt: item.updated_at || item.updatedAt || null,
      created_by: item.created_by || null,
      updated_by: item.updated_by || null,
      raw: item,
    };
  };

  // FIX: Helper to normalize status
  const normalizeStatus = (item) => {
    if (!item) return true;
    const statusValue =
      item.is_status !== undefined ? item.is_status : item.status;
    if (statusValue === undefined || statusValue === null) return true;
    if (typeof statusValue === "string") {
      return (
        statusValue.toLowerCase() === "active" ||
        statusValue === "1" ||
        statusValue === "true"
      );
    }
    return statusValue === true || statusValue === 1;
  };

  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach((id) => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await subscriptionFeatureService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const features = Array.isArray(rawData)
        ? rawData.map(normalizeFeature)
        : [];
      const sortedFeatures = features.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedFeatures);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load subscription features");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredData = React.useMemo(() => {
    let result = data;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((item) => {
        const itemStatus = item.is_status === true;
        return itemStatus === isActive;
      });
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (item) =>
          String(item.feature_name ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.feature_key ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.parent_category_name ?? "")
            .toLowerCase()
            .includes(query),
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.is_status === true).length;
  const inactiveCount = data.length - activeCount;

  const getCreatedByName = (row) => {
    if (!row) return "-";
    if (row.created_by) {
      return getUserNameCached(row.created_by);
    }
    return "-";
  };

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by) {
      return getUserNameCached(row.updated_by);
    }
    return "-";
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionFeatureService.delete(deleteId);
      showSuccess("Feature deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this feature because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete feature");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (row) => {
    const currentStatus = getStatusValue(row);
    const newStatus = !currentStatus;

    try {
      const updateData = {
        feature_name: row.feature_name,
        feature_key: row.feature_key,
        feature_type: row.feature_type,
        description: row.description || "",
        subscription_feature_categories_id:
          row.subscription_feature_categories_id,
        default_unit: row.default_unit || "",
        default_value: row.default_value || "",
        options_json: row.options_json,
        is_usage_track: row.is_usage_track || "no",
        is_required: row.is_required,
        is_display: row.is_display,
        display_order: row.display_order || 0,
        is_trending: row.is_trending || false,
        status: newStatus,
        is_status: newStatus,
        // FIX: Use the icon path as-is from the row data
        icon: row.icon || null,
      };

      console.log("Status toggle update data:", updateData);

      await subscriptionFeatureService.update(row.id, updateData);
      showSuccess(
        `Status ${newStatus ? "activated" : "deactivated"} successfully`,
      );
      load();
    } catch (error) {
      console.error("Status toggle error:", error);
      showError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status",
      );
    }
  };

  const handleTrendingToggle = async (row) => {
    const newValue = !row.is_trending;

    try {
      // FIX: Preserve icon properly
      const updateData = {
        feature_name: row.feature_name,
        feature_key: row.feature_key,
        feature_type: row.feature_type,
        description: row.description || "",
        subscription_feature_categories_id:
          row.subscription_feature_categories_id,
        default_unit: row.default_unit || "",
        default_value: row.default_value || "",
        options_json: row.options_json,
        is_usage_track: row.is_usage_track || "no",
        is_required: row.is_required,
        is_display: row.is_display,
        display_order: row.display_order || 0,
        is_trending: newValue,
        status: getStatusValue(row),
        is_status: getStatusValue(row),
        // FIX: Preserve icon - don't send null if it exists
        icon: row.icon || null,
      };

      // Only include icon if it exists
      if (row.icon) {
        updateData.icon = row.icon;
      }

      console.log("Trending toggle update data:", updateData);

      await subscriptionFeatureService.update(row.id, updateData);
      showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
      load();
    } catch (error) {
      console.error("Trending toggle error:", error);
      showError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update trending",
      );
    }
  };

  const getStatusValue = (row) => {
    if (!row) return true;
    if (row.is_status !== undefined) {
      return row.is_status === true;
    }
    if (row.status !== undefined) {
      return normalizeStatus(row);
    }
    return true;
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const renderIconPreview = (value, rowId) => {
    if (!value) return <span className="text-gray-400 text-xs">-</span>;

    const hasError = imageErrors[rowId];
    const fullUrl = getFullImageUrl(value);

    if (!hasError && fullUrl) {
      return (
        <div className="flex items-center gap-2">
          <div className="relative group cursor-pointer">
            <img
              src={fullUrl}
              alt="Feature icon"
              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
              onError={() => handleImageError(rowId)}
            />
            <button
              onClick={() => window.open(fullUrl, "_blank")}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
              title="Click to view image"
            >
              <MdVisibility size={16} />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-lg bg-blue-50 border border-[#4529f7] flex items-center justify-center text-[#2c0eee]">
          <MdInsertPhoto size={20} />
        </div>
      );
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Icon",
      key: "icon",
      render: (value, row) => renderIconPreview(value, row.id),
    },
    // ─── MOVED: Category column FIRST after Icon ──────────────────
    {
      header: "Category",
      key: "parent_category_name",
      render: (v) => <span className="text-gray-600">{v || "-"}</span>,
    },
    {
      header: "Feature Name",
      key: "feature_name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    {
      header: "Feature Key",
      key: "feature_key",
      render: (v) => (
        <span className="text-gray-500 text-sm font-mono">{v}</span>
      ),
    },
    {
      header: "Type",
      key: "feature_type",
      render: (v) => (
        <span className="capitalize text-gray-600">{v || "-"}</span>
      ),
    },
    {
      header: "Unit",
      key: "default_unit",
      render: (v) => <span className="text-gray-500 text-sm">{v || "-"}</span>,
    },
    {
      header: "Usage Track",
      key: "is_usage_track",
      render: (v) => (
        <span
          className={`text-sm font-medium ${v === "yes" ? "text-green-600" : "text-gray-400"}`}
        >
          {v === "yes" ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Required",
      key: "is_required",
      render: (v) => (
        <span className={`text-sm ${v ? "text-red-500" : "text-gray-400"}`}>
          {v ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Display",
      key: "is_display",
      render: (v) => (
        <span className={`text-sm ${v ? "text-[#4529f7]" : "text-gray-400"}`}>
          {v ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (value, row) => (
        <button
          onClick={() => handleTrendingToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            value ? "bg-yellow-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (status, row) => {
        const isActive = getStatusValue(row);
        return (
          <button
            onClick={() => handleStatusToggle(row)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
              isActive ? "bg-[#2c0eee]" : "bg-gray-300"
            }`}
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
          {row.updated_by ? getUpdatedByName(row) : "-"}
        </span>
      ),
    },
    {
      header: "Updated At",
      key: "updatedAt",
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {value ? formatDate(value) : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() =>
              navigate(`/subscription-features/view/${row.id}`, {
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
              navigate(`/subscription-features/edit/${row.id}`, {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Features
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage subscription features for job listings
          </p>
        </div>
        <Button
          icon={MdAdd}
          onClick={() => navigate("/subscription-features/add")}
        >
          Add Feature
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top bar: search + tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <MdSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search features..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key
                    ? "text-[#2c0eee]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
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
          emptyMessage="No subscription features found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} features
          </p>
          <Pagination
            page={page}
            total={filteredData.length}
            limit={limit}
            onChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Feature"
        message="Delete this feature? This action cannot be undone."
      />
    </div>
  );
};

export default SubscriptionFeatures;
