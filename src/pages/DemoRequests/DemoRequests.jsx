// pages/demo-requests/DemoRequests.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
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
  MdCheck,
  MdPersonOff,
} from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { demoRequestService } from "../../services/demoRequest.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import api from "../../services/axiosInstance"; 

// ─── Avatar helpers (theme-consistent palette, same family as status badges) ───
const AVATAR_COLORS = [
  { bg: "bg-[#4529f7]/10", text: "text-[#4529f7]" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
  { bg: "bg-cyan-100", text: "text-cyan-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
];

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (id) => {
  const key = String(id || "0");
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

// ─── Themed "Assigned To" dropdown — replaces the native <select> ───────
const AssignedToDropdown = ({ row, usersList, currentUserName, isUpdating, isOpen, onToggle, onSelect, getUserNameCached }) => {
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return usersList;
    const q = query.toLowerCase();
    return usersList.filter((u) => (u.name || "").toLowerCase().includes(q));
  }, [usersList, query]);

  const isAssigned = !!row.assigned_to;
  const avatarColor = isAssigned ? getAvatarColor(row.assigned_to) : { bg: "bg-gray-100", text: "text-gray-400" };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => onToggle(row.id)}
        disabled={isUpdating}
        className={`w-full min-w-[170px] flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg border text-sm transition-all duration-150 ${
          isUpdating ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } ${
          isAssigned
            ? "bg-[#4529f7]/[0.06] border-[#4529f7]/25 hover:border-[#4529f7]/50"
            : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white"
        } ${isOpen ? "ring-2 ring-[#4529f7]/30 border-[#4529f7]" : ""}`}
      >
        {/* <span
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold `}
        >
          {isAssigned ? getInitials(currentUserName) : <MdPersonOff size={13} />}
        </span> */}
        <span
          className={`flex-1 text-left font-medium truncate ${isAssigned ? "text-[#2c0eee]" : "text-gray-500"}`}
          title={isAssigned ? currentUserName : "Unassigned"}
        >
          {isAssigned ? currentUserName : "Unassigned"}
        </span>
        {isUpdating ? (
          <div className="w-3.5 h-3.5 border-2 border-[#4529f7] border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : (
          <svg
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isAssigned ? "text-[#4529f7]" : "text-gray-400"} ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1.5 w-64 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden left-0">
          {usersList.length > 6 && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <MdSearch size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search team members..."
                  className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4529f7]/20 focus:border-[#4529f7]/40"
                />
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto py-1">
            {/* Unassigned option */}
            <button
              type="button"
              onClick={() => onSelect(row, "")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                !isAssigned ? "bg-gray-50" : ""
              }`}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                <MdPersonOff size={14} />
              </span>
              <span className="flex-1 text-left text-gray-600">Unassigned</span>
              {!isAssigned && <MdCheck size={16} className="text-[#4529f7] flex-shrink-0" />}
            </button>

            <div className="my-1 border-t border-gray-100" />

            {filteredUsers.length === 0 ? (
              <p className="px-3 py-4 text-xs text-gray-400 text-center">No members found</p>
            ) : (
              filteredUsers.map((user) => {
                const userId = user.id || user._id;
                const userName = user.name || `User ${userId}`;
                const selected = String(row.assigned_to) === String(userId);
                const color = getAvatarColor(userId);
                return (
                  <button
                    key={userId}
                    type="button"
                    onClick={() => onSelect(row, String(userId))}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      selected ? "bg-[#4529f7]/[0.06]" : ""
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold ${color.bg} ${color.text}`}
                    >
                      {getInitials(userName)}
                    </span>
                    <span className={`flex-1 text-left truncate ${selected ? "text-[#2c0eee] font-medium" : "text-gray-700"}`}>
                      {userName}
                    </span>
                    {selected && <MdCheck size={16} className="text-[#4529f7] flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DemoRequests = () => {
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
  const [usersList, setUsersList] = useState([]);
  const [updatingAssignTo, setUpdatingAssignTo] = useState(null);
  const [openAssignRowId, setOpenAssignRowId] = useState(null);

  // ─── Close the assign-to dropdown on outside click ─────────────────
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest("[data-assign-dropdown]")) {
        setOpenAssignRowId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ─── Fetch users for dropdown ──────────────────────────────────────
  const fetchUsers = async () => {
    try {
      const response = await api.get("/user");
      const users = response.data?.data || response.data || [];
      const userMap = {};
      users.forEach((user) => {
        const userId = user.id || user._id;
        if (userId) {
          userMap[String(userId)] = user.name || `User ${userId}`;
        }
      });
      setUserNameCache(userMap);
      setUsersList(Array.isArray(users) ? users : []);
      return userMap;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {};
    }
  };

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    const userIdStr = String(userId);
    if (userNameCache[userIdStr]) {
      return userNameCache[userIdStr];
    }
    const keys = Object.keys(userNameCache);
    for (const key of keys) {
      if (String(key) === String(userId)) {
        return userNameCache[key];
      }
    }
    return `User ${userId}`;
  };

  // Normalize demo request data
  const normalizeDemoRequest = (item) => {
    return {
      id: item.id || item._id,
      name: item.name || "",
      email: item.email || "",
      mobile: item.mobile || "",
      company_name: item.company_name || "",
      designation: item.designation || "",
      company_size_id: item.company_size_id || null,
      industry_id: item.industry_id || null,
      city_id: item.city_id || null,
      job_hiring_volume: item.job_hiring_volume || null,
      hiring_frequency: item.hiring_frequency || "",
      interested_plan: item.interested_plan || "",
      preferred_demo_date: item.preferred_demo_date || null,
      preferred_demo_time: item.preferred_demo_time || "",
      message: item.message || "",
      source: item.source || "",
      status: item.status || "new",
      priority: item.priority || "medium",
      assigned_to: item.assigned_to || null,
      admin_remarks: item.admin_remarks || "",
      demo_scheduled_at: item.demo_scheduled_at || null,
      demo_completed_at: item.demo_completed_at || null,
      follow_up_at: item.follow_up_at || null,
      updated_by: item.updated_by || "",
      updated_at: item.updated_at || item.updatedAt || null,
      companySize: item.companySize || null,
      industry: item.industry || null,
      city: item.city || null,
    };
  };

  // ─── Handle Assign To change ──────────────────────────────────────
  const handleAssignToChange = async (row, newUserId) => {
    if (updatingAssignTo === row.id) return;
    setOpenAssignRowId(null);

    const userId = newUserId ? parseInt(newUserId) : null;
    const previousValue = row.assigned_to;

    // Optimistic update
    setUpdatingAssignTo(row.id);
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, assigned_to: userId } : item,
      ),
    );

    try {
      const updateData = {
        name: row.name,
        email: row.email,
        mobile: row.mobile,
        company_name: row.company_name,
        designation: row.designation || "",
        company_size_id: row.company_size_id || null,
        industry_id: row.industry_id || null,
        city_id: row.city_id || null,
        job_hiring_volume: row.job_hiring_volume || null,
        hiring_frequency: row.hiring_frequency || "",
        interested_plan: row.interested_plan || "",
        preferred_demo_date: row.preferred_demo_date || null,
        preferred_demo_time: row.preferred_demo_time || "",
        message: row.message || "",
        source: row.source || "",
        status: row.status || "new",
        priority: row.priority || "medium",
        assigned_to: userId,
        admin_remarks: row.admin_remarks || "",
        demo_scheduled_at: row.demo_scheduled_at || null,
        demo_completed_at: row.demo_completed_at || null,
        follow_up_at: row.follow_up_at || null,
      };

      await demoRequestService.update(row.id, updateData);
      showSuccess(
        `Assigned to ${userId ? getUserNameCached(userId) : "Unassigned"} successfully`,
      );
      load();
    } catch (error) {
      console.error("Assign error:", error);
      // Revert on error
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, assigned_to: previousValue } : item,
        ),
      );
      showError(error.response?.data?.message || "Failed to assign user");
    } finally {
      setUpdatingAssignTo(null);
    }
  };

  // Load demo requests
  const load = async () => {
    setLoading(true);
    try {
      const userMap = await fetchUsers();

      const r = await demoRequestService.getAll({ limit: 1000 });
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const requests = Array.isArray(rawData)
        ? rawData.map(normalizeDemoRequest)
        : [];

      const sortedRequests = requests.sort((a, b) => {
        return (
          new Date(b.updated_at || b.created_at) -
          new Date(a.updated_at || a.created_at)
        );
      });

      setData(sortedRequests);
    } catch (error) {
      console.error("Load error:", error);
      showError(error.message || "Failed to load demo requests");
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
      result = result.filter((item) => item.status === statusFilter);
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
          String(item.company_name ?? "")
            .toLowerCase()
            .includes(query) ||
          String(item.mobile ?? "")
            .toLowerCase()
            .includes(query),
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const statusCounts = useMemo(() => {
    const counts = { all: data.length };
    data.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });
    return counts;
  }, [data]);

  const getStatusBadge = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-700",
      contacted: "bg-yellow-100 text-yellow-700",
      scheduled: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      converted: "bg-green-600 text-white",
      cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
      new: "New",
      contacted: "Contacted",
      scheduled: "Scheduled",
      completed: "Completed",
      converted: "Converted",
      cancelled: "Cancelled",
    };
    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}
      >
        {labels[status] || status || "New"}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-600",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[priority] || "bg-gray-100 text-gray-700"}`}
      >
        {priority || "Medium"}
      </span>
    );
  };

  const getSourceBadge = (source) => {
    const colors = {
      Website: "bg-blue-100 text-blue-700",
      Google: "bg-red-100 text-red-700",
      LinkedIn: "bg-blue-600 text-white",
      friends: "bg-green-100 text-green-700",
      socialmedia: "bg-purple-100 text-purple-700",
      others: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors[source] || "bg-gray-100 text-gray-700"}`}
      >
        {source || "-"}
      </span>
    );
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await demoRequestService.delete(deleteId);
      showSuccess("Demo request deleted successfully");
      load();
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this request because it is being used in other records.",
        );
      } else {
        showError(message || "Failed to delete request");
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
      header: "Name / Company",
      key: "name",
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-800">{row.name}</div>
          <div className="text-xs text-gray-500">{row.company_name}</div>
          {row.designation && (
            <div className="text-xs text-gray-400 mt-0.5">
              ({row.designation})
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Contact",
      key: "email",
      render: (_, row) => (
        <div>
          <div className="text-sm text-gray-600">{row.email}</div>
          <div className="text-xs text-gray-400">{row.mobile}</div>
        </div>
      ),
    },
    {
      header: "Company Size / Industry",
      key: "companySize",
      render: (_, row) => (
        <div>
          <div className="text-sm text-gray-600">
            {row.companySize?.name || "-"}
          </div>
          <div className="text-xs text-gray-400">
            {row.industry?.name || "-"}
          </div>
        </div>
      ),
    },
    {
      header: "City",
      key: "city",
      render: (_, row) => (
        <span className="text-gray-600 text-sm">{row.city?.name || "-"}</span>
      ),
    },
    // ─── Assigned To — themed custom dropdown ──────────────────────
    {
      header: "Assigned To",
      key: "assigned_to",
      render: (_, row) => (
        <div data-assign-dropdown>
          <AssignedToDropdown
            row={row}
            usersList={usersList}
            currentUserName={row.assigned_to ? getUserNameCached(row.assigned_to) : ""}
            isUpdating={updatingAssignTo === row.id}
            isOpen={openAssignRowId === row.id}
            onToggle={(rowId) => setOpenAssignRowId((prev) => (prev === rowId ? null : rowId))}
            onSelect={(r, userId) => handleAssignToChange(r, userId)}
            getUserNameCached={getUserNameCached}
          />
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (v) => getStatusBadge(v),
    },
    {
      header: "Priority",
      key: "priority",
      render: (v) => getPriorityBadge(v),
    },
    {
      header: "Last Updated",
      key: "updated_at",
      render: (_, row) => (
        <div>
          <div className="text-sm text-gray-600">
            {row.updated_by ? getUserNameCached(row.updated_by) : "-"}
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(row.updated_at)}
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() =>
              navigate(`/demo-requests/view/${row.id}`, {
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
              navigate(`/demo-requests/edit/${row.id}`, {
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
    { key: "all", label: "All", count: statusCounts.all || 0 },
    { key: "new", label: "New", count: statusCounts.new || 0 },
    {
      key: "contacted",
      label: "Contacted",
      count: statusCounts.contacted || 0,
    },
    {
      key: "scheduled",
      label: "Scheduled",
      count: statusCounts.scheduled || 0,
    },
    {
      key: "completed",
      label: "Completed",
      count: statusCounts.completed || 0,
    },
    {
      key: "converted",
      label: "Converted",
      count: statusCounts.converted || 0,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: statusCounts.cancelled || 0,
    },
  ];

  const totalPages = Math.ceil(filteredData.length / limit);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demo Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage demo requests from potential customers
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
          <Button icon={MdAdd} onClick={() => navigate("/demo-requests/add")}>
            Add Request
          </Button>
        </div>
      </div>

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
              placeholder="Search by name, email, company..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="No demo requests found"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} requests
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
                className={`p-1 rounded-lg transition-colors ${page === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 text-gray-500"}`}
              >
                <MdChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600 px-2">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                className={`p-1 rounded-lg transition-colors ${page === totalPages || totalPages === 0 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 text-gray-500"}`}
              >
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Demo Request"
        message="Delete this demo request? This action cannot be undone."
      />
    </div>
  );
};

export default DemoRequests;