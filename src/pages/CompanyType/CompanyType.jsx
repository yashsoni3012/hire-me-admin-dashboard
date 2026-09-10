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
import { showSuccess, showError } from "../../utils/toast";
import { fetchUsers } from "../../utils/getUserName";

// FIX: point directly at the live API you gave, with env override still supported
const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// Helper: Get current user from localStorage
const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  } catch {
    return null;
  }
};

// Format date - "17/08/2026, 12:12:37 pm" → "17 Aug 2026"
const formatDate = (date) => {
  if (!date) return null;

  if (typeof date === "string" && date.includes(",")) {
    const parts = date.split(", ");
    if (parts.length === 2) {
      const datePart = parts[0];
      const dayMonthYear = datePart.split("/");
      if (dayMonthYear.length === 3) {
        const day = parseInt(dayMonthYear[0]);
        const month = parseInt(dayMonthYear[1]) - 1;
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

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const CompanyType = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || 1;
  const token = localStorage.getItem("token");

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
      setUserNameCache(users || {});
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }, []);

  // FIX: robust boolean coercion for status (API sends real boolean `false`)
  const normalizeCompanyType = (item) => ({
    id: item.id ?? item._id,
    name: item.name || "",
    is_status:
      item.status === true ||
      item.status === "true" ||
      item.status === 1 ||
      item.status === "1",
    created_by: item.created_by ?? null,
    updated_by: item.updated_by ?? null,
    created_at: item.created_at || item.createdAt || null,
    updated_at: item.updated_at || item.updatedAt || null,
  });

  // FIX: build headers conditionally, defend against multiple response shapes,
  // and surface real errors instead of failing silently
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/company-types`, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const r = await response.json();

      // Handle: { data: [...] } | { data: { data: [...] } } | { results: [...] } | [...]
      let rawData = r?.data ?? r?.results ?? r;
      if (rawData && !Array.isArray(rawData) && Array.isArray(rawData.data)) {
        rawData = rawData.data;
      }

      const items = Array.isArray(rawData) ? rawData.map(normalizeCompanyType) : [];
      setData(items);

      if (!Array.isArray(rawData)) {
        console.warn("Unexpected company-types response shape:", r);
      }
    } catch (err) {
      console.error("Load error:", err);
      showError(err.message || "Failed to load company types");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const getUserNameCached = (userId) => {
    if (!userId) return null;
    const key = String(userId);
    return userNameCache[key]?.name || `User ${userId}`;
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

  const openAdd = () => {
    navigate("/company-types/add");
  };

  const openEdit = (item) => {
    navigate(`/company-types/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/company-types/view/${item.id}`);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/company-types/${deleteId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        let errorMsg = `HTTP error ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) errorMsg = errorData.message;
          else if (errorData.error) errorMsg = errorData.error;
        } catch (_) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      showSuccess("Company type deleted successfully");
      setDeleteId(null);
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.message || "Failed to delete company type");
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/company-types/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          status: newStatus,
          updated_by: currentUserId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      showSuccess(`Status ${newStatus ? "activated" : "deactivated"}`);
      load();
    } catch (err) {
      console.error("Status toggle error:", err);
      showError(err.message || "Failed to update status");
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Company Type",
      key: "name",
      render: (v) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      header: "Status",
      key: "is_status",
      render: (is_status, row) => (
        <button
          onClick={() => handleStatusToggle(row.id, is_status)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            is_status ? "bg-[#2c0eee]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
              is_status ? "translate-x-6" : "translate-x-1"
            }`}
          />
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
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Types</h1>
          <p className="text-sm text-gray-500 mt-1">Manage company type categories</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={MdRefresh} onClick={load} loading={loading}>
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={openAdd}>
            Add Company Type
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company types..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Table columns={columns} data={paginatedData} loading={loading} emptyMessage="No company types found" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} company types
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

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Company Type"
        message="Delete this company type? This action cannot be undone."
      />
    </div>
  );
};

export default CompanyType;