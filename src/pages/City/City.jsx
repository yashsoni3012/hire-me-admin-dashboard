import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdInsertPhoto,
  MdRefresh,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { cityService } from "../../services/city.service";
import { stateService } from "../../services/state.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { getUserName, fetchUsers } from '../../utils/getUserName';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apidata.hiremejobs.in';

const City = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [imageErrors, setImageErrors] = useState({});
  const [userNameCache, setUserNameCache] = useState({});

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Get full image URL helper
  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http") || value.startsWith("data:image")) {
      return value;
    }
    if (value.startsWith("/uploads/")) {
      return `${API_BASE_URL}${value}`;
    }
    if (value.startsWith("uploads/")) {
      return `${API_BASE_URL}/${value}`;
    }
    return `${API_BASE_URL}/uploads/cities/${value}`;
  };

  // Normalize city data
  const normalizeCity = (item) => ({
    id: item.id || item._id,
    state_id: item.state_id || "",
    image: item.image || null,
    name: item.name || "",
    is_trending: item.is_trending || false,
    is_status: item.is_status !== undefined ? item.is_status : true,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    state_name: item.state_name || "",
    created_at: item.created_at || item.createdAt || null,
    updated_at: item.updated_at || item.updatedAt || null,
  });

  // Load cities
  const loadCities = async () => {
    setLoading(true);
    try {
      // Fetch users first to get user names
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await cityService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const cities = Array.isArray(rawData) ? rawData.map(normalizeCity) : [];
      
      // Sort by created_at descending (newest first)
      const sortedCities = cities.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      setData(sortedCities);
    } catch (error) {
      console.error('Load error:', error);
      showError(error.message || "Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredData = useMemo(() => {
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
      result = result.filter((item) =>
        String(item.name ?? "").toLowerCase().includes(query) ||
        String(item.state_name ?? "").toLowerCase().includes(query)
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
    if (row.updated_by) {
      return getUserNameCached(row.updated_by);
    }
    return "-";
  };

  // Handle image error
  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Render image preview
  const renderImagePreview = (value, rowId) => {
    if (!value) return <span className="text-gray-400 text-xs">-</span>;

    const hasError = imageErrors[rowId];
    const fullUrl = getFullImageUrl(value);

    if (!hasError && fullUrl) {
      return (
        <div className="flex items-center gap-2">
          <div className="relative group cursor-pointer">
            <img
              src={fullUrl}
              alt="City image"
              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
              onError={() => handleImageError(rowId)}
            />
            <button
              onClick={() => window.open(fullUrl, '_blank')}
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
        <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <MdInsertPhoto size={20} />
        </div>
      );
    }
  };

  // Navigation handlers
  const openAdd = () => {
    navigate('/cities/add');
  };

  const openEdit = (item) => {
    navigate(`/cities/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/cities/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await cityService.delete(deleteId);
      showSuccess("City deleted successfully");
      loadCities();
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError("Cannot delete this city because it is being used in other records.");
      } else {
        showError(message || "Failed to delete city");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (row) => {
    const currentStatus = row.is_status;
    const newStatus = !currentStatus;

    try {
      const updateData = {
        name: row.name,
        state_id: row.state_id,
        is_trending: row.is_trending || false,
        status: newStatus,
        image: row.image || null,
      };

      await cityService.update(row.id, updateData);
      showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
      loadCities();
    } catch (error) {
      console.error('Status toggle error:', error);
      showError(error.response?.data?.message || error.message || "Failed to update status");
    }
  };

  // Toggle trending
  const handleTrendingToggle = async (row) => {
    const newValue = !row.is_trending;

    try {
      const updateData = {
        name: row.name,
        state_id: row.state_id,
        is_trending: newValue,
        status: row.is_status,
        image: row.image || null,
      };

      await cityService.update(row.id, updateData);
      showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
      loadCities();
    } catch (error) {
      console.error('Trending toggle error:', error);
      showError(error.response?.data?.message || error.message || "Failed to update trending");
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1
    },
    {
      header: "Image",
      key: "image",
      render: (value, row) => renderImagePreview(value, row.id),
    },
    {
      header: "City Name",
      key: "name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    {
      header: "State",
      key: "state_name",
      render: (v) => (
        <span className="text-gray-600">{v || "-"}</span>
      ),
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (value, row) => (
        <button
          onClick={() => handleTrendingToggle(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value ? "bg-yellow-500" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      ),
    },
    {
      header: "Status",
      key: "is_status",
      render: (value, row) => {
        const isActive = value === true;
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
          <h1 className="text-2xl font-bold text-gray-900">Cities</h1>
          <p className="text-sm text-gray-500 mt-1">Manage cities for job listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={MdRefresh}
            onClick={loadCities}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={MdAdd} onClick={openAdd}>
            Add City
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
              placeholder="Search cities..."
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
          emptyMessage="No cities found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} cities
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
        title="Delete City"
        message="Delete this city? This action cannot be undone."
      />
    </div>
  );
};

export default City;