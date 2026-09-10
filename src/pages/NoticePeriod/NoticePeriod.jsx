import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdRefresh,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import noticePeriodService from "../../services/noticePeriod.service";
import { showSuccess, showError } from "../../utils/toast";
import { fetchUsers } from "../../utils/getUserName";

// Helper: Get current user from localStorage
const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  } catch {
    return null;
  }
};

// Format date - "17/08/2026, 12:12:37 pm" → "13 Aug 2026"
const formatDate = (date) => {
  if (!date) return null;
  
  // If date is already in the format from API (DD/MM/YYYY, HH:MM:SS am/pm)
  if (typeof date === "string" && date.includes(",")) {
    const parts = date.split(", ");
    if (parts.length === 2) {
      const datePart = parts[0]; // "17/08/2026"
      const dayMonthYear = datePart.split("/");
      if (dayMonthYear.length === 3) {
        const day = parseInt(dayMonthYear[0]);
        const month = parseInt(dayMonthYear[1]) - 1; // Month is 0-indexed
        const year = parseInt(dayMonthYear[2]);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        }
      }
    }
  }
  
  // Try parsing as date object
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const NoticePeriod = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || 1;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});

  const loadUsers = useCallback(async () => {
    try {
      const users = await fetchUsers();
      console.log('Users fetched for notice periods:', users);
      setUserNameCache(users);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }, []);

  const normalizeNoticePeriod = (item) => ({
    id: item.id || item._id,
    name: item.name || "",
    days: item.days || 0,
    is_status: item.status === true || item.status === "true" || item.status === 1,
    is_trending: item.is_trending === true || item.is_trending === "true" || item.is_trending === 1,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    created_at: item.created_at || item.createdAt || null,
    updated_at: item.updated_at || item.updatedAt || null,
  });

  const load = async () => {
    setLoading(true);
    try {
      const response = await noticePeriodService.getAll();
      console.log('Notice periods response:', response);
      
      const rawData = response?.data || response?.results || response || [];
      const items = Array.isArray(rawData) ? rawData.map(normalizeNoticePeriod) : [];
      setData(items);
    } catch (err) {
      console.error("Load error:", err);
      showError(err.message || "Failed to load notice periods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const getUserNameCached = (userId) => {
    if (!userId) return null;
    const key = String(userId);
    const user = userNameCache[key];
    console.log(`Looking up user ${key}:`, user);
    return user?.name || `User ${userId}`;
  };

  const getCreatedByName = (row) => {
    if (!row) return "-";
    if (row.created_by === null) return "System";
    return row.created_by ? getUserNameCached(row.created_by) : "-";
  };

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    return row.updated_by ? getUserNameCached(row.updated_by) : "-";
  };

  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter === "active") {
      result = result.filter((item) => item.is_status === true);
    } else if (statusFilter === "inactive") {
      result = result.filter((item) => item.is_status !== true);
    } else if (statusFilter === "trending") {
      result = result.filter((item) => item.is_trending === true);
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        String(item.name ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((c) => c.is_status === true).length;
  const inactiveCount = data.length - activeCount;
  const trendingCount = data.filter((c) => c.is_trending === true).length;
  const hasTrending = trendingCount > 0;

  // Navigation handlers
  const openAdd = () => {
    navigate('/notice-periods/add');
  };

  const openEdit = (item) => {
    navigate(`/notice-periods/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/notice-periods/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await noticePeriodService.delete(deleteId);
      showSuccess("Notice period deleted successfully");
      setDeleteId(null);
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.message || "Failed to delete notice period");
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

// Toggle status - Send all required fields for PUT
const handleStatusToggle = async (id, currentStatus) => {
  const newStatus = !currentStatus;
  // Find the current item to get all its data
  const currentItem = data.find(item => item.id === id);
  if (!currentItem) {
    showError("Item not found");
    return;
  }
  
  try {
    // Send all fields for PUT request
    await noticePeriodService.update(id, {
      name: currentItem.name,
      days: currentItem.days,
      is_trending: currentItem.is_trending,
      status: newStatus,
      updated_by: currentUserId,
    });
    showSuccess(`Status ${newStatus ? "activated" : "deactivated"}`);
    load();
  } catch (err) {
    console.error("Status toggle error:", err);
    showError(err.message || "Failed to update status");
  }
};

// Toggle trending - Send all required fields for PUT
const handleTrendingToggle = async (id, currentTrending) => {
  const newTrending = !currentTrending;
  const currentItem = data.find(item => item.id === id);
  if (!currentItem) {
    showError("Item not found");
    return;
  }
  
  try {
    await noticePeriodService.update(id, {
      name: currentItem.name,
      days: currentItem.days,
      is_trending: newTrending,
      status: currentItem.is_status,
      updated_by: currentUserId,
    });
    showSuccess(`Trending ${newTrending ? "enabled" : "disabled"}`);
    load();
  } catch (err) {
    console.error("Trending toggle error:", err);
    showError(err.message || "Failed to update trending");
  }
};

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Notice Period",
      key: "name",
      render: (v) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      header: "Days",
      key: "days",
      render: (v) => <span className="text-sm text-gray-500">{v || 0}</span>,
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (is_trending, row) => (
        <button
          onClick={() => handleTrendingToggle(row.id, is_trending)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${is_trending ? "bg-amber-500" : "bg-gray-300"}`}
        >
          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${is_trending ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      ),
    },
    {
      header: "Status",
      key: "is_status",
      render: (is_status, row) => (
        <button
          onClick={() => handleStatusToggle(row.id, is_status)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${is_status ? "bg-[#2c0eee]" : "bg-gray-300"}`}
        >
          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${is_status ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      ),
    },
    {
      header: "Updated By",
      key: "updated_by",
      render: (_, row) => {
        const name = getUpdatedByName(row);
        return <span className="text-gray-600 text-sm font-medium">{name}</span>;
      },
    },
    {
      header: "Updated At",
      key: "updated_at",
      render: (_, row) => {
        const dateValue = row.updated_at || row.updatedAt;
        const formatted = formatDate(dateValue);
        return <span className="text-gray-500 text-sm">{formatted || "—"}</span>;
      },
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            title="View"
          >
            <MdVisibility size={16} />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="Edit"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => setDeleteId(id)}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
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
    ...(hasTrending ? [{ key: "trending", label: "Trending", count: trendingCount }] : []),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Periods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage notice periods</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={MdRefresh} onClick={load} loading={loading}>
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={openAdd}>
            Add Notice Period
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notice periods..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? tab.key === "trending" ? "text-amber-600" : "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key ? tab.key === "trending" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Table columns={columns} data={paginatedData} loading={loading} emptyMessage="No notice periods found" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} notice periods
          </p>
          <Pagination
            page={page}
            total={filteredData.length}
            limit={limit}
            onChange={setPage}
            onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
          />
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Notice Period"
        message="Delete this notice period? This action cannot be undone."
      />
    </div>
  );
};

export default NoticePeriod;