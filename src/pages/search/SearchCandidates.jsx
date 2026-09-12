// pages/search/SearchCandidates.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { MdSearch, MdRefresh, MdVisibility, MdDelete } from "react-icons/md";
import candidateSearchService from "../../services/candidateSearch.service";
import { showSuccess, showError } from "../../utils/toast";

// ─── Parse API date "DD/MM/YYYY, HH:MM:SS am/pm" ──────────────────
const parseApiDate = (dateString) => {
  if (!dateString) return null;
  const match = dateString.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i,
  );
  if (match) {
    let [_, day, month, year, hours, minutes, seconds, ampm] = match;
    hours = parseInt(hours);
    if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hours,
      parseInt(minutes),
      parseInt(seconds),
    );
  }
  const d = new Date(dateString);
  return !isNaN(d) ? d : null;
};

const formatDate = (dateString) => {
  const d = parseApiDate(dateString);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  const d = parseApiDate(dateString);
  if (!d) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const extractSearchList = (body) => {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== "object") return [];
  if (Array.isArray(body.data?.data)) return body.data.data;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.results)) return body.results;
  if (Array.isArray(body.logs)) return body.logs;
  return [];
};

const extractSearchPagination = (body) => {
  if (!body || typeof body !== "object") return null;
  if (body.data?.pagination) return body.data.pagination;
  if (body.pagination) return body.pagination;
  if (body.meta?.pagination) return body.meta.pagination;
  if (body.meta) return body.meta;
  return null;
};

const SearchCandidates = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState(null);

  // ─── NEW: delete state ─────────────────────────────────────
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const normalizeLog = (item) => ({
    id: item.id,
    search_keyword: item.search_keyword || "",
    result_count: item.result_count ?? 0,
    search_type: item.search_type || "normal",
    created_at: item.created_at || null,
    company_name: item.company?.company_name || "—",
    company_logo: item.company?.logo || null,
    searched_by: item.companyUser?.full_name || "—",
    searched_by_email: item.companyUser?.email || "",
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const PER_PAGE = 20;

      const firstResponse = await candidateSearchService.getAll({
        page: 1,
        limit: PER_PAGE,
      });
      const firstBody = firstResponse?.data;

      let allRaw = extractSearchList(firstBody);
      const pagination = extractSearchPagination(firstBody);

      const total = Number(
        pagination?.total ??
          pagination?.totalItems ??
          firstBody?.count ??
          allRaw.length,
      );

      const serverTotalPages = Number(
        pagination?.totalPages || pagination?.total_pages || 0,
      );

      let nextLink = pagination?.links?.next || pagination?.next || null;
      let currentPage = 2;
      let totalPages = serverTotalPages;

      if (!totalPages && nextLink) {
        totalPages = 999;
      }

      while (currentPage <= totalPages) {
        const response = await candidateSearchService.getAll({
          page: currentPage,
          limit: PER_PAGE,
        });
        const body = response?.data;
        const pageRaw = extractSearchList(body);
        const pagePagination = extractSearchPagination(body);

        if (pageRaw.length === 0) break;
        allRaw.push(...pageRaw);

        nextLink = pagePagination?.links?.next || pagePagination?.next || null;
        const pageTotalPages = Number(
          pagePagination?.totalPages || pagePagination?.total_pages || 0,
        );

        if (pageTotalPages) totalPages = pageTotalPages;
        else if (!nextLink) break;

        currentPage++;
        if (currentPage > 500) break;
      }

      const uniqueRaw = Array.from(
        new Map(allRaw.map((item) => [String(item?.id), item])).values(),
      );

      setLogs(uniqueRaw.map(normalizeLog));
    } catch (err) {
      console.error("Load search logs error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load search logs";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return logs;

    return logs.filter((item) =>
      [item.search_keyword, item.company_name, item.searched_by].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [logs, search]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const openView = (row) => {
    navigate(`/search-candidates/view/${row.id}`, { state: { item: row } });
  };

  // ─── NEW: Delete handler ───────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await candidateSearchService.delete(deleteId);
      showSuccess("Search log deleted successfully");
      setLogs((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (err) {
      console.error("Delete error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete search log";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this search log because it is being used in other records.",
        );
      } else {
        showError(message);
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Search Keyword",
      key: "search_keyword",
      render: (v) => (
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#2C0EEE] flex-shrink-0">
            <MdSearch size={14} />
          </span>
          <span className="font-medium text-gray-800">{v || "-"}</span>
        </div>
      ),
    },
    {
      header: "Company",
      key: "company_name",
      render: (v) => (
        <span className="text-gray-700 font-medium">{v || "—"}</span>
      ),
    },
    {
      header: "Searched By",
      key: "searched_by",
      render: (v, row) => (
        <div className="flex flex-col">
          <span className="text-gray-700 text-sm font-medium">{v || "—"}</span>
          {row.searched_by_email && (
            <span className="text-xs text-gray-400">
              {row.searched_by_email}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Date",
      key: "created_at",
      render: (v) => (
        <div className="flex flex-col">
          <span className="text-gray-600 text-sm">{formatDate(v)}</span>
          <span className="text-xs text-gray-400">{formatTime(v)}</span>
        </div>
      ),
    },
    // ─── Actions column ────────────────────────────────────────
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-[#2C0EEE] rounded-lg transition-colors"
            title="View Details"
          >
            <MdVisibility size={16} />
          </button>
          {/* NEW: Delete button */}
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
            title="Delete"
          >
            <MdDelete size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (error && logs.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Search Candidates
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View candidate searches made by companies
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={load}
            className="mt-4 px-4 py-2 bg-[#2C0EEE] text-white rounded-lg hover:bg-[#250bc4] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Search Candidates
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View candidate searches made by companies
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-[#2C0EEE] border border-[#2C0EEE] rounded-lg hover:bg-[#2C0EEE] hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <MdRefresh size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-80">
            <MdSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, company or user..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2C0EEE] transition-colors"
            />
          </div>
          <span className="text-xs text-gray-400">
            {filteredData.length} of {logs.length} records
          </span>
        </div>

        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="No candidate searches found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} searches
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

      {/* ─── Delete Confirmation ───────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Search Log"
        message="Delete this search log? This action cannot be undone."
      />
    </div>
  );
};

export default SearchCandidates;
