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
import { companySubscriptionService } from "../../services/companySubscription.service";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import companyService from "../../services/company.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

// Robust boolean coercion
const toBool = (val, fallback = true) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false") return false;
  return Boolean(val);
};

const CompanySubscriptions = () => {
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

  // Normalize company subscription data
  const normalizeCompanySubscription = (item) => {
    return { 
      id: item.id || item._id,
      company_id: item.company_id || item.Company?.company_id || "",
      company_name: item.Company?.company_name || item.company_name || "-",
      subscription_plans_id: item.subscription_plans_id || item.SubscriptionPlan?.subscription_plan_id || "",
      plan_name: item.SubscriptionPlan?.plan_name || item.plan_name || "-",
      subscription_type: item.subscription_type || "New",
      start_date: item.start_date || null,
      expiry_date: item.expiry_date || item.end_date || null,
      is_trial: toBool(item.is_trial, false),
      auto_renew: toBool(item.auto_renew, false),
      is_status: toBool(item.is_status, true),
      updated_by: item.updated_by || "",
      updated_at: item.updated_at || item.updatedAt || null,
      created_at: item.created_at || item.createdAt || null,
      created_by: item.created_by || "",
    };
  };

  // Load company subscriptions
  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await companySubscriptionService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];

      const subscriptions = Array.isArray(rawData)
        ? rawData.map(normalizeCompanySubscription)
        : [];

      const sortedSubscriptions = subscriptions.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setData(sortedSubscriptions);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load company subscriptions");
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
          String(item.plan_name ?? "").toLowerCase().includes(query) ||
          String(item.company_name ?? "").toLowerCase().includes(query) ||
          String(item.subscription_type ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.is_status === true).length;
  const inactiveCount = data.length - activeCount;

  // Get display name for updated by
  const getUpdatedByName = (row) => {
    if (!row) return "-";
    return row.updated_by ? getUserNameCached(row.updated_by) : "-";
  };

  // Navigation handlers
  const openAdd = () => {
    navigate('/company-subscriptions/add');
  };

  const openEdit = (item) => {
    navigate(`/company-subscriptions/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/company-subscriptions/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await companySubscriptionService.delete(deleteId);
      showSuccess("Company subscription deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError("Cannot delete this subscription because it is being used in other records.");
      } else {
        showError(message || "Failed to delete subscription");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.is_status === true;
    const newStatus = !currentStatus;

    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, is_status: newStatus } : item
      )
    );

    try {
      const updateData = {
        company_id: parseInt(row.company_id),
        subscription_plans_id: parseInt(row.subscription_plans_id || row.subscription_id),
        subscription_type: row.subscription_type || "New",
        start_date: row.start_date || null,
        expiry_date: row.expiry_date || row.end_date || null,
        is_trial: row.is_trial || false,
        auto_renew: row.auto_renew || false,
        is_status: newStatus,
      };

      await companySubscriptionService.update(row.id, updateData);
      showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Status toggle error:", error);
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, is_status: currentStatus } : item
        )
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
      render: (v) => <span className="font-medium text-gray-800">{v || "-"}</span>,
    },
    {
      header: "Plan Name",
      key: "plan_name",
      render: (v) => <span className="font-medium text-gray-800">{v || "-"}</span>,
    },
    {
      header: "Type",
      key: "subscription_type",
      render: (v) => (
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            v === "Upgrade"
              ? "bg-blue-100 text-blue-700"
              : v === "Renew"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
          }`}
        >
          {v || "New"}
        </span>
      ),
    },
    {
      header: "Start Date",
      key: "start_date",
      render: (v) => <span className="text-gray-600 text-sm">{formatDate(v)}</span>,
    },
    {
      header: "Expiry Date",
      key: "expiry_date",
      render: (v) => <span className="text-gray-600 text-sm">{formatDate(v)}</span>,
    },
    {
      header: "Trial",
      key: "is_trial",
      render: (v) => (
        <span className={`text-sm font-medium ${v ? "text-blue-600" : "text-gray-400"}`}>
          {v ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "is_status",
      render: (value, row) => {
        const isActive = row.is_status === true;
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
      render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
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
          {/* Edit action button hidden for now
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
            title="Edit"
          >
            <MdEdit size={16} />
          </button>
          */}
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
          <h1 className="text-2xl font-bold text-gray-900">Company Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage company subscriptions to plans
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
          {/* Add Subscription button hidden for now
          <Button icon={MdAdd} onClick={openAdd}>
            Add Subscription
          </Button>
          */}
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
              placeholder="Search by company or plan..."
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
          emptyMessage="No company subscriptions found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} subscriptions
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
        title="Delete Company Subscription"
        message="Delete this company subscription? This action cannot be undone."
      />
    </div>
  );
};

export default CompanySubscriptions;