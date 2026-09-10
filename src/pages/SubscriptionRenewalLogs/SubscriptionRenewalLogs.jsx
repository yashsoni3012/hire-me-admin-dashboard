import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdRefresh,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import subscriptionRenewalLogService from "../../services/subscriptionRenewalLog.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const SubscriptionRenewalLogs = () => {
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

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Normalize renewal log data
  const normalizeRenewalLog = (item) => {
    const subscription = item.companySubscription || {};
    const company = subscription.Company || {};
    const plan = subscription.SubscriptionPlan || {};
    const previousPlan = subscription.PreviousSubscriptionPlan || {};
    const nextPlan = subscription.NextSubscriptionPlan || {};

    return {
      id: item.id || item._id,
      company_subscription_id: item.company_subscription_id || "",
      renewal_type: item.renewal_type || "",
      old_plan: item.old_plan || previousPlan.plan_name || "-",
      new_plan: item.new_plan || nextPlan.plan_name || plan.plan_name || "-",
      old_expiry: item.old_expiry || null,
      new_expiry: item.new_expiry || null,
      amount: item.amount || "0.00",
      status: item.status === true,
      created_by: item.created_by || "",
      updated_by: item.updated_by || "",
      created_at: item.created_at || null,
      updated_at: item.updated_at || null,
      company_name: company.company_name || "-",
      plan_name: plan.plan_name || "-",
      company_id: subscription.company_id || company.company_id || "",
    };
  };

  // Load renewal logs
  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const response = await subscriptionRenewalLogService.getAll({ limit: 1000 });
      const rawData = response.data?.data || response.data?.results || response.data || [];
      const renewalLogs = Array.isArray(rawData) ? rawData.map(normalizeRenewalLog) : [];

      const sortedLogs = renewalLogs.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setData(sortedLogs);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load renewal logs");
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
      result = result.filter((item) => item.status === isActive);
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        String(item.company_name ?? "").toLowerCase().includes(query) ||
        String(item.renewal_type ?? "").toLowerCase().includes(query) ||
        String(item.old_plan ?? "").toLowerCase().includes(query) ||
        String(item.new_plan ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.status === true).length;
  const inactiveCount = data.length - activeCount;

  // Get display name for updated by
  const getUpdatedByName = (row) => {
    if (!row) return "-";
    return row.updated_by ? getUserNameCached(row.updated_by) : "-";
  };

  // Navigation handlers
  const openAdd = () => {
    navigate('/subscription-renewal-logs/add');
  };

  const openEdit = (item) => {
    navigate(`/subscription-renewal-logs/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/subscription-renewal-logs/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionRenewalLogService.delete(deleteId);
      showSuccess("Renewal log deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError("Cannot delete this log because it is being used in other records.");
      } else {
        showError(message || "Failed to delete log");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.status === true;
    const newStatus = !currentStatus;

    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
    );

    try {
      const updateData = {
        company_subscription_id: row.company_subscription_id,
        renewal_type: row.renewal_type,
        old_plan: row.old_plan,
        new_plan: row.new_plan,
        old_expiry: row.old_expiry,
        new_expiry: row.new_expiry,
        amount: row.amount,
        status: newStatus,
      };

      await subscriptionRenewalLogService.update(row.id, updateData);
      showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Status toggle error:", error);
      setData((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, status: currentStatus } : item))
      );
      showError(error.response?.data?.message || error.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Company",
      key: "company_name",
      render: (v) => (
        <span className="font-medium text-gray-800">{v || "-"}</span>
      ),
    },
    {
      header: "Renewal Type",
      key: "renewal_type",
      render: (v) => {
        const colorMap = {
          upgrade: "bg-blue-100 text-blue-700",
          downgrade: "bg-orange-100 text-orange-700",
          renew: "bg-green-100 text-green-700",
          extension: "bg-blue-100 text-blue-700",
          cancel: "bg-red-100 text-red-700",
        };
        const displayNames = {
          upgrade: "Upgrade",
          downgrade: "Downgrade",
          renew: "Renew",
          extension: "Extension",
          cancel: "Cancel",
        };
        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[v?.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
            {displayNames[v?.toLowerCase()] || v || "-"}
          </span>
        );
      },
    },
    {
      header: "Plan Change",
      key: "plan_change",
      render: (_, row) => (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">{row.old_plan || "-"}</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-gray-800">{row.new_plan || "-"}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      key: "amount",
      render: (v) => (
        <span className="font-medium text-gray-900">₹{parseFloat(v || 0).toFixed(2)}</span>
      ),
    },
    {
      header: "Expiry Change",
      key: "expiry_change",
      render: (_, row) => (
        <div className="text-xs">
          <div className="text-gray-500">{formatDate(row.old_expiry)}</div>
          <div className="text-gray-400">↓</div>
          <div className="text-gray-700">{formatDate(row.new_expiry)}</div>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (value, row) => {
        const isActive = row.status === true;
        return (
          <button
            onClick={() => handleStatusToggle(row)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"}`}
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
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => openEdit(row)}
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
          <h1 className="text-2xl font-bold text-gray-900">Subscription Renewal Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage subscription renewal history and logs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={MdRefresh}
            onClick={load}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={openAdd}>
            Add Renewal Log
          </Button>
        </div>
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
              placeholder="Search by company, plan, or type..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
                    ? "bg-blue-50 text-blue-600"
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
          emptyMessage="No renewal logs found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} logs
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
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
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
                className={`p-1 rounded-lg transition-colors ${page === 1
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
                className={`p-1 rounded-lg transition-colors ${page === totalPages || totalPages === 0
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Renewal Log"
        message="Delete this subscription renewal log? This action cannot be undone."
      />
    </div>
  );
};

export default SubscriptionRenewalLogs;