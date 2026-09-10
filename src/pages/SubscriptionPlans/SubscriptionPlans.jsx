// pages/SubscriptionPlans.jsx
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
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

// Base URL for images
const API_BASE_URL = "https://apidata.hiremejobs.in";

// Robust boolean coercion
const toBool = (val, fallback = true) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false")
    return false;
  return Boolean(val);
};

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});
  const [togglingId, setTogglingId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Get full image URL
  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (typeof value !== "string") return null;

    if (value.startsWith("http") || value.startsWith("data:image")) {
      return value;
    }
    if (value.startsWith("/uploads/")) {
      return `${API_BASE_URL}${value}`;
    }
    if (value.startsWith("./uploads/")) {
      return `${API_BASE_URL}${value.substring(1)}`;
    }
    if (value.startsWith("/")) {
      return `${API_BASE_URL}${value}`;
    }
    if (
      !value.includes("/") &&
      !value.includes("http") &&
      !value.startsWith("data:")
    ) {
      return `${API_BASE_URL}/uploads/${value}`;
    }
    return value;
  };

  // Normalize subscription plan data
  const normalizeSubscriptionPlan = (item) => {
    return {
      id: item.id || item._id,
      plan_name: item.plan_name || "",
      plan_code: item.plan_code || "",
      description: item.description || "",
      plan_type: item.plan_type || "fixed",
      duration_days: item.duration_days || 30,
      price: item.price || 0,
      gst_percentage: item.gst_percentage || 18,
      display_order: item.display_order || 1,
      badge: item.badge || "",
      is_popular: toBool(item.is_popular, false),
      is_display_in_front: toBool(item.is_display_in_front, true),
      is_free_trial: toBool(item.is_free_trial, false),
      trial_days: item.trial_days || 7,
      button_text: item.button_text || "Get Started",
      button_color: item.button_color || "#FFFFFF",
      background_color: item.background_color || "#2463EB",
      icon: item.icon || null,
      is_status: toBool(item.is_status, true),
      updated_by: item.updated_by || "",
      updated_at: item.updated_at || item.updatedAt || null,
      created_at: item.created_at || item.createdAt || null,
      created_by: item.created_by || "",
    };
  };

  // Load subscription plans
  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach((id) => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await subscriptionPlanService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const plans = Array.isArray(rawData)
        ? rawData.map(normalizeSubscriptionPlan)
        : [];

      const sortedPlans = plans.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setData(sortedPlans);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load subscription plans");
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

  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((item) => item.is_status === isActive);
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (item) =>
          String(item.plan_name ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.plan_code ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.description ?? "")
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

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const renderIconPreview = (value, row) => {
    const rowId = row.id || row._id;
    const planName = row.plan_name || "Plan";

    if (!value) {
      const firstLetter = planName.charAt(0).toUpperCase();
      const colors = [
        "#2563EB",
        "#7C3AED",
        "#DC2626",
        "#059669",
        "#D97706",
        "#6B7280",
      ];
      const colorIndex = (rowId || 0) % colors.length;

      return (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: colors[colorIndex] }}
        >
          {firstLetter}
        </div>
      );
    }

    if (imageErrors[rowId]) {
      const firstLetter = planName.charAt(0).toUpperCase();
      return (
        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
          {firstLetter}
        </div>
      );
    }

    const fullUrl = getFullImageUrl(value);

    if (!fullUrl) {
      const firstLetter = planName.charAt(0).toUpperCase();
      return (
        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
          {firstLetter}
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <div className="relative group cursor-pointer">
          <img
            src={fullUrl}
            alt={planName}
            className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            onError={() => handleImageError(rowId)}
            loading="lazy"
          />
        </div>
      </div>
    );
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionPlanService.delete(deleteId);
      showSuccess("Subscription plan deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this plan because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete plan");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // ─── FIX: Status Toggle Handler ──────────────────────────────────────
  // ─── FIX: Status Toggle Handler ──────────────────────────────────────
  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;

    const currentStatus = row.is_status === true;
    const newStatus = !currentStatus;

    // Set loading state
    setTogglingId(row.id);

    // Optimistic update
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, is_status: newStatus } : item,
      ),
    );

    try {
      // ─── Build update data with ALL fields ──────────────────────
      const updateData = {
        plan_name: row.plan_name || "",
        plan_code: row.plan_code || "",
        description: row.description || "",
        plan_type: row.plan_type || "fixed",
        duration_days: parseInt(row.duration_days) || 30,
        price: parseFloat(row.price) || 0,
        gst_percentage: parseFloat(row.gst_percentage) || 18,
        display_order: parseInt(row.display_order) || 1,
        badge: row.badge || "",
        is_popular: row.is_popular || false,
        is_display_in_front:
          row.is_display_in_front !== undefined
            ? row.is_display_in_front
            : true,
        is_free_trial: row.is_free_trial || false,
        trial_days: row.is_free_trial ? parseInt(row.trial_days) || 7 : 0,
        button_text: row.button_text || "Get Started",
        button_color: row.button_color || "#FFFFFF",
        background_color: row.background_color || "#2463EB",
        // ─── FIX: service reads data.status, not data.is_status ──────
        status: newStatus,
        icon: row.icon || null,
      };

      console.log("📤 Status toggle update data:", updateData);

      // ─── Call API ──────────────────────────────────────────────────
      const response = await subscriptionPlanService.update(row.id, updateData);
      console.log("✅ Status toggle response:", response);

      // ─── Verify the update from response ──────────────────────────
      // If response contains the updated data, use it to confirm
      if (response?.data?.is_status !== undefined) {
        const confirmedStatus = response.data.is_status === true;
        if (confirmedStatus !== newStatus) {
          setData((prev) =>
            prev.map((item) =>
              item.id === row.id
                ? { ...item, is_status: confirmedStatus }
                : item,
            ),
          );
        }
      }

      showSuccess(
        `Status ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("❌ Status toggle error:", error);

      // Revert optimistic update
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, is_status: currentStatus } : item,
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

  const handleViewFeatures = (plan) => {
    navigate(`/subscription-plans/features/${plan.id}`, {
      state: { item: plan },
    });
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
      render: (value, row) => renderIconPreview(value, row),
    },
    {
      header: "Plan Name",
      key: "plan_name",
      render: (v, row) => (
        <div>
          <span className="font-medium text-gray-800">{v}</span>
          {row.badge && (
            <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-medium">
              {row.badge}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Code",
      key: "plan_code",
      render: (v) => (
        <span className="text-gray-600 text-sm font-mono">{v}</span>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (v) => (
        <span className="font-semibold text-gray-900">
          ₹{parseFloat(v || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Duration",
      key: "duration_days",
      render: (v) => (
        <span className="text-gray-600 text-sm">{v || 30} days</span>
      ),
    },
    {
      header: "Status",
      key: "is_status",
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
      header: "Features",
      key: "id",
      render: (id, row) => (
        <button
          onClick={() => handleViewFeatures(row)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2c0eee] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          title="View subscription features"
        >
          <MdVisibility size={15} />
          View Features
        </button>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() =>
              navigate(`/subscription-plans/view/${row.id}`, {
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
              navigate(`/subscription-plans/edit/${row.id}`, {
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
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Plans
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage subscription plans for your application
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
            onClick={() => navigate("/subscription-plans/add")}
          >
            Add Plan
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
              placeholder="Search plans..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
            />
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
          emptyMessage="No subscription plans found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} plans
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
        title="Delete Subscription Plan"
        message="Delete this subscription plan? This action cannot be undone."
      />
    </div>
  );
};

export default SubscriptionPlans;
