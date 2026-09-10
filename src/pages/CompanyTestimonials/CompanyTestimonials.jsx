// pages/CompanyTestimonials.jsx
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
  MdStar,
  MdStarHalf,
  MdStarBorder,
  MdImage,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { companyTestimonialService } from "../../services/companyTestimonial.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const CompanyTestimonials = () => {
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

    // Handle if backend sends an object like { url: "..." }
    if (typeof value === "object") {
      value = value.url || value.path || value.image || null;
      if (!value) return null;
    }

    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:image")
    ) {
      return trimmed;
    }

    // Normalize: ensure a single leading slash, then prefix with API base
    const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${API_BASE_URL}${normalizedPath}`;
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const totalStars = 5;

    for (let i = 1; i <= totalStars; i++) {
      if (i <= fullStars) {
        stars.push(
          <MdStar key={i} className="text-yellow-400 inline" size={16} />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <MdStarHalf key={i} className="text-yellow-400 inline" size={16} />,
        );
      } else {
        stars.push(
          <MdStarBorder key={i} className="text-gray-300 inline" size={16} />,
        );
      }
    }
    return stars;
  };

  // Handle image error
  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Render image preview
  const renderImagePreview = (value, row) => {
    const rowId = row.id || row._id;

    if (!value) {
      return (
        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
          <MdImage className="text-gray-400" size={20} />
        </div>
      );
    }

    if (imageErrors[rowId]) {
      return (
        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
          <MdImage className="text-gray-400" size={20} />
        </div>
      );
    }

    const fullUrl = getFullImageUrl(value);

    if (!fullUrl) {
      return (
        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
          <MdImage className="text-gray-400" size={20} />
        </div>
      );
    }

    return (
      <div className="relative group cursor-pointer">
        <img
          src={fullUrl}
          alt={row.name || "Testimonial"}
          className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          onError={() => handleImageError(rowId)}
          loading="lazy"
        />
      </div>
    );
  };

  // Normalize testimonial data
  const normalizeTestimonial = (item) => {
    return {
      id: item.id || item._id,
      name: item.name || "",
      email: item.email || "",
      description: item.description || "",
      rating: item.rating || 0,
      image: item.image || null,
      is_status: item.is_status === true || item.is_status === 1,
      updated_by: item.updated_by || "",
      updated_at: item.updated_at || item.updatedAt || null,
      created_at: item.created_at || item.createdAt || null,
      created_by: item.created_by || "",
    };
  };

  // Load testimonials
  const load = async () => {
    setLoading(true);
    try {
      // Fetch users for names
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach((id) => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await companyTestimonialService.getAll({ limit: 1000 });
      console.log("📥 API Response:", r);

      // Extract data from response
      let rawData = [];
      if (r?.data?.data) {
        rawData = r.data.data;
      } else if (r?.data) {
        rawData = r.data;
      } else if (Array.isArray(r)) {
        rawData = r;
      }

      const testimonials = Array.isArray(rawData)
        ? rawData.map(normalizeTestimonial)
        : [];

      const sortedTestimonials = testimonials.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setData(sortedTestimonials);
      console.log(
        `📊 Loaded ${sortedTestimonials.length} company testimonials`,
      );
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load company testimonials");
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
          String(item.name ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.email ?? "")
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

  // Get display name for updated by
  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by) {
      return getUserNameCached(row.updated_by);
    }
    return "-";
  };

  // Navigation handlers
  const openAdd = () => {
    navigate("/company-testimonials/add");
  };

  const openEdit = (item) => {
    navigate(`/company-testimonials/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/company-testimonials/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await companyTestimonialService.delete(deleteId);
      showSuccess("Testimonial deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this testimonial because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete testimonial");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // FIXED: Status toggle with proper error handling
  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.is_status === true;
    const newStatus = !currentStatus;

    // Optimistically update UI
    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, is_status: newStatus } : item,
      ),
    );

    try {
      const updateData = {
        name: row.name,
        email: row.email,
        description: row.description,
        rating: row.rating,
        image: row.image || null,
        is_status: newStatus, // Send boolean value
      };

      console.log(`🔄 Toggling status for ID ${row.id} to ${newStatus}`);
      await companyTestimonialService.update(row.id, updateData);
      showSuccess(
        `Status ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Status toggle error:", error);
      // Revert on error
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

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Image",
      key: "image",
      render: (value, row) => renderImagePreview(value, row),
    },
    {
      header: "Name",
      key: "name",
      render: (v) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      header: "Email",
      key: "email",
      render: (v) => <span className="text-gray-600 text-sm">{v}</span>,
    },
    {
      header: "Rating",
      key: "rating",
      render: (v) => (
        <div className="flex items-center gap-1">
          {renderStars(parseFloat(v))}
          <span className="text-sm text-gray-500 ml-1">({v})</span>
        </div>
      ),
    },
    {
      header: "Testimonial",
      key: "description",
      render: (v) => {
        const desc = v || "";
        return (
          <div className="max-w-xs" title={desc}>
            <span className="text-gray-600 text-sm">
              {desc.length > 50 ? desc.substring(0, 50) + "..." : desc || "-"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      key: "is_status",
      render: (value, row) => {
        const isActive = row.is_status === true;
        return (
          <button
            onClick={() => handleStatusToggle(row)}
            disabled={togglingId === row.id}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
              isActive ? "bg-[#2c0eee]" : "bg-gray-300"
            } ${togglingId === row.id ? "opacity-50 cursor-not-allowed" : ""}`}
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
          <h1 className="text-2xl font-bold text-gray-900">
            Company Testimonials
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage testimonials from company clients
          </p>
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
            Add Testimonial
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
              placeholder="Search testimonials..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
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
          emptyMessage="No company testimonials found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} testimonials
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Testimonial"
        message="Delete this testimonial? This action cannot be undone."
      />
    </div>
  );
};

export default CompanyTestimonials;
