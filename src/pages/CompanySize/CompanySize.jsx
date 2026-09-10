import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdRefresh,
  MdPeople,
  MdPerson,
  MdUpdate,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import companyService from "../../services/company.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

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

// Helper: Extract size from name
const extractSizeFromName = (name) => {
  if (!name) return 0;

  const trimmedName = name.trim();
  const lowerName = trimmedName.toLowerCase();

  if (lowerName.includes("immediate") || lowerName.includes("0 day")) {
    return 0;
  }

  const rangeMatch = trimmedName.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (rangeMatch) {
    return parseInt(rangeMatch[2]);
  }

  const plusMatch = trimmedName.match(/(\d+)\s*\+/);
  if (plusMatch) {
    return parseInt(plusMatch[1]);
  }

  const upToMatch = trimmedName.match(/(?:up to|upto|less than|under)\s*(\d+)/i);
  if (upToMatch) {
    return parseInt(upToMatch[1]);
  }

  const moreThanMatch = trimmedName.match(/(?:more than|over|above)\s*(\d+)/i);
  if (moreThanMatch) {
    return parseInt(moreThanMatch[1]);
  }

  const numberMatch = trimmedName.match(/\d+/);
  if (numberMatch) {
    return parseInt(numberMatch[0]);
  }

  return 0;
};

const CompanySize = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || 1;
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      const users = await fetchUsers();
      setUserNameCache(users);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }, []);

  // Load companies for connection check
  const loadCompanies = useCallback(async () => {
    try {
      const response = await companyService.getAll({ limit: 1000 });
      const rawData = response?.data || response?.results || (Array.isArray(response) ? response : []);
      setCompanies(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      console.error("Failed to load companies for connection check:", err);
    }
  }, []);

  // Normalize company size data
  const normalizeCompanySize = (item) => ({
    id: item.id || item._id,
    company_size_name: item.name || item.company_size_name || "",
    company_size_slug: item.slug || item.company_size_slug || "",
    is_status:
      item.is_status === true ||
      item.is_status === "true" ||
      item.is_status === 1 ||
      item.status === true ||
      item.status === "active",
    is_trending:
      item.is_trending === true ||
      item.is_trending === "true" ||
      item.is_trending === 1,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
    size: item.size || 0,
  });

  // Load company sizes
  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/company-sizes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const r = await response.json();
      const rawData = r.data || r.results || [];
      const items = Array.isArray(rawData) ? rawData.map(normalizeCompanySize) : [];
      setData(items);
    } catch (err) {
      console.error("Load error:", err);
      showError(err.message || "Failed to load company sizes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    load();
    loadCompanies();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // Auto-fallback if trending tab active but no trending items
  useEffect(() => {
    if (statusFilter === "trending" && !data.some((item) => item.is_trending === true)) {
      setStatusFilter("all");
    }
  }, [data, statusFilter]);

  // Check how many companies are linked to a specific company size
  const getConnectedCompanyCount = (companySizeId) => {
    if (!Array.isArray(companies)) return 0;
    return companies.filter((comp) => {
      const compSizeId = comp.company_size_id || comp.company_size || comp.CompanySize?.company_size_id || comp.CompanySize?.id;
      return String(compSizeId) === String(companySizeId);
    }).length;
  };

  // Get user names from cache
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId]?.name || `User ${userId}`;
  };

  const getCreatedByName = (row) => {
    if (!row) return "-";
    return row.created_by ? getUserNameCached(row.created_by) : "-";
  };

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    return row.updated_by ? getUserNameCached(row.updated_by) : "-";
  };

  // Filtering & Pagination
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
        [item.company_size_name, item.company_size_slug].some(
          (value) => String(value ?? "").toLowerCase().includes(query)
        )
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
    navigate('/company-sizes/add');
  };

  const openEdit = (item) => {
    navigate(`/company-sizes/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/company-sizes/view/${item.id}`);
  };

  const handleDeleteClick = (row) => {
    const connectedCount = getConnectedCompanyCount(row.id);
    if (connectedCount > 0) {
      showError(`Cannot delete this company size because it is linked to ${connectedCount} company record(s).`);
      return;
    }
    setDeleteId(row.id);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_BASE}/company-sizes/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP error ${response.status}`);
      }

      showSuccess("Company size deleted successfully");
      setDeleteId(null);
      load();
      loadCompanies();
    } catch (err) {
      console.error("Delete error:", err);
      const message = err?.message || "";
      if (/company|foreign\s*key|constraint|used|referenced|linked/i.test(message)) {
        showError("Cannot delete this company size because it is linked to other records.");
      } else {
        showError(message || "Failed to delete company size");
      }
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`${API_BASE}/company-sizes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_status: newStatus,
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

  // Toggle trending
  const handleTrendingToggle = async (id, currentTrending) => {
    const newTrending = !currentTrending;
    try {
      const response = await fetch(`${API_BASE}/company-sizes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_trending: newTrending,
          updated_by: currentUserId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

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
      header: "Company Size",
      key: "company_size_name",
      render: (v, row) => (
        <div>
          <span className="font-medium text-gray-800">{v}</span>
          <div className="text-xs text-gray-400">{row.company_size_slug}</div>
        </div>
      ),
    },
    {
      header: "Size",
      key: "size",
      render: (v, row) => (
        <span className="text-sm text-gray-500">
          {v || extractSizeFromName(row.company_size_name) || "—"}
        </span>
      ),
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (is_trending, row) => (
        <button
          onClick={() => handleTrendingToggle(row.id, is_trending)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${is_trending ? "bg-amber-500" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${is_trending ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      ),
    },
    {
      header: "Status",
      key: "is_status",
      render: (is_status, row) => (
        <button
          onClick={() => handleStatusToggle(row.id, is_status)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${is_status ? "bg-[#2c0eee]" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${is_status ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      ),
    },
    {
      header: "Updated By",
      key: "updated_by",
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600 text-sm font-medium">
            {getUpdatedByName(row)}
          </span>
        </div>
      ),
    },
    {
      header: "Updated At",
      key: "updated_at",
      render: (_, row) => {
        const date = row.updated_at || row.updatedAt;
        return <span className="text-gray-500 text-sm">{formatDate(date)}</span>;
      },
    },
    {
      header: "Actions",
      key: "actions",
      render: (_, row) => {
        const connectedCount = getConnectedCompanyCount(row.id);
        const canDelete = connectedCount === 0;

        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => openView(row)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="View"
            >
              <MdVisibility size={16} />
            </button>
            <button
              onClick={() => openEdit(row)}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              title="Edit"
            >
              <MdEdit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(row)}
              className={`p-1.5 rounded-lg transition-colors ${
                canDelete
                  ? "hover:bg-red-50 text-red-600"
                  : "text-gray-300 hover:bg-gray-50 hover:text-gray-400 cursor-not-allowed"
              }`}
              title={
                canDelete
                  ? "Delete"
                  : `Cannot delete: linked to ${connectedCount} company record(s)`
              }
            >
              <MdDelete size={16} />
            </button>
          </div>
        );
      },
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
          <h1 className="text-2xl font-bold text-gray-900">Company Sizes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage company sizes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={MdRefresh}
            onClick={load}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={openAdd}>
            <MdPeople className="mr-1" /> Add Company Size
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
              placeholder="Search company sizes..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key
                  ? tab.key === "trending"
                    ? "text-amber-600"
                    : "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key
                    ? tab.key === "trending"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Table columns={columns} data={paginatedData} loading={loading} emptyMessage="No company sizes found" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} company sizes
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
        title="Delete Company Size"
        message="Delete this company size? This action cannot be undone."
      />
    </div>
  );
};

export default CompanySize;