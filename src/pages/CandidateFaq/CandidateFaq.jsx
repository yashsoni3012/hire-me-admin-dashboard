// pages/CandidateFaq.jsx
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
import { candidateFaqService } from "../../services/candidateFaq.service";
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

const CandidateFaq = () => {
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

  // Normalize FAQ data
  const normalizeFaq = (item) => {
    return {
      id: item.id || item._id,
      question: item.question || "",
      answer: item.answer || "",
      order: item.order || 0,
      is_trending: toBool(item.is_trending, false),
      is_status: toBool(item.is_status, true),
      updated_by: item.updated_by || "",
      updated_at: item.updated_at || item.updatedAt || null,
      created_at: item.created_at || item.createdAt || null,
      created_by: item.created_by || "",
    };
  };

  // Load FAQs
  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await candidateFaqService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const faqs = Array.isArray(rawData) ? rawData.map(normalizeFaq) : [];

      
      const sortedFaqs = faqs.sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        // If same order, sort alphabetically by question (case-insensitive)
        const questionA = (a.question || '').toLowerCase();
        const questionB = (b.question || '').toLowerCase();
        return questionA.localeCompare(questionB);
      });

      setData(sortedFaqs);
      console.log(`📊 Loaded ${sortedFaqs.length} Candidate FAQs`);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load FAQs");
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
      result = result.filter((item) =>
        String(item.question ?? "")
          .toLowerCase()
          .includes(query) ||
        String(item.answer ?? "")
          .toLowerCase()
          .includes(query)
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
    navigate('/candidate-faq/add');
  };

  const openEdit = (item) => {
    navigate(`/candidate-faq/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/candidate-faq/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await candidateFaqService.delete(deleteId);
      showSuccess("FAQ deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError("Cannot delete this FAQ because it is being used in other records.");
      } else {
        showError(message || "Failed to delete FAQ");
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // ─── Toggle status with auto-refresh ──────────────────────────
  const handleStatusToggle = async (row) => {
    if (togglingId === row.id) return;
    const currentStatus = row.is_status === true;
    const newStatus = !currentStatus;

    setTogglingId(row.id);
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, is_status: newStatus } : item)),
    );

    try {
      const updateData = {
        question: row.question,
        answer: row.answer,
        order: row.order,
        is_trending: row.is_trending === true,
        is_status: newStatus,
      };

      await candidateFaqService.update(row.id, updateData);
      showSuccess(`Status ${newStatus ? "activated" : "deactivated"} successfully`);
      
      // ─── Auto-refresh after toggle ──────────────────────────────
      await load();
    } catch (error) {
      console.error("Status toggle error:", error);
      setData((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, is_status: currentStatus } : item)),
      );
      showError(error.response?.data?.message || error.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Toggle trending with auto-refresh ─────────────────────────
  const handleTrendingToggle = async (row) => {
    if (togglingId === `trend-${row.id}`) return;
    const currentTrending = row.is_trending === true;
    const newValue = !currentTrending;

    setTogglingId(`trend-${row.id}`);
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, is_trending: newValue } : item)),
    );

    try {
      const updateData = {
        question: row.question,
        answer: row.answer,
        order: row.order,
        is_trending: newValue,
        is_status: row.is_status === true,
      };

      await candidateFaqService.update(row.id, updateData);
      showSuccess(`Trending ${newValue ? "enabled" : "disabled"} successfully`);
      
      // ─── Auto-refresh after toggle ───────────────
      await load();
    } catch (error) {
      console.error("Trending toggle error:", error);
      setData((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, is_trending: currentTrending } : item)),
      );
      showError(error.response?.data?.message || error.message || "Failed to update trending");
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      width: "50px",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Question",
      key: "question",
      width: "250px",
      render: (v) => (
        <div className="max-w-xs" title={v}>
          <span className="font-medium text-gray-800 line-clamp-2">
            {v.length > 60 ? v.substring(0, 60) + '...' : v}
          </span>
        </div>
      ),
    },
    // {
    //   header: "Answer",
    //   key: "answer",
    //   width: "300px",
    //   render: (v) => {
    //     const answer = v || '';
    //     return (
    //       <div className="max-w-sm" title={answer}>
    //         <span className="text-gray-600 text-sm line-clamp-2">
    //           {answer.length > 70 ? answer.substring(0, 70) + '...' : answer || '-'}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      header: "Trending",
      key: "is_trending",
      width: "100px",
      align: "center",
      render: (value, row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleTrendingToggle(row)}
            disabled={togglingId === `trend-${row.id}`}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${row.is_trending === true ? "bg-yellow-500" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${row.is_trending === true ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      ),
    },
    {
      header: "Status",
      key: "is_status",
      width: "100px",
      align: "center",
      render: (value, row) => {
        const isActive = row.is_status === true;
        return (
          <div className="flex justify-center">
            <button
              onClick={() => handleStatusToggle(row)}
              disabled={togglingId === row.id}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        );
      },
    },
    {
      header: "Updated By",
      key: "updated_by",
      width: "120px",
      render: (_, row) => (
        <span className="text-gray-500 text-sm font-medium">
          {getUpdatedByName(row)}
        </span>
      ),
    },
    {
      header: "Updated At",
      key: "updated_at",
      width: "120px",
      render: (v) => (
        <span className="text-gray-500 text-sm whitespace-nowrap">
          {formatDate(v)}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "id",
      width: "120px",
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
          <h1 className="text-2xl font-bold text-gray-900">Candidate FAQs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage frequently asked questions for candidates
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
            Add FAQ
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
              placeholder="Search FAQs..."
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
          emptyMessage="No FAQs found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} FAQs
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
        title="Delete FAQ"
        message="Delete this FAQ? This action cannot be undone."
      />
    </div>
  );
};

export default CandidateFaq;