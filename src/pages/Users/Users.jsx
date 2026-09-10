import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import userService from "../../services/user.service";
import { showSuccess, showError } from "../../utils/toast";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdRefresh,
  MdPerson,
  MdEmail,
  MdPhone,
} from "react-icons/md";
import { formatDate } from "../../utils/helpers";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

// A record only counts as "updated" if updatedAt is meaningfully later
// than createdAt. Most backends set updatedAt = createdAt on insert, so
// without this check every row falsely shows an "Updated At" value.
const wasActuallyUpdated = (createdAt, updatedAt) => {
  if (!createdAt || !updatedAt) return false;
  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(created) || Number.isNaN(updated)) return false;
  // Allow a small tolerance (2s) for clock/precision drift on insert
  return updated - created > 2000;
};

const Badge = ({ children, color = "gray" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-600",
    purple: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Users page
// ---------------------------------------------------------------------------

const Users = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

  // Load roles
  const loadRoles = async () => {
    try {
      const response = await userService.getRoles();
      const roleData = response.data?.data || response.data || [];
      setRoles(Array.isArray(roleData) ? roleData : []);
    } catch (err) {
      console.error("Load roles error:", err);
    }
  };

  // Normalize API response
  const normalizeUser = (item) => ({
    id: item.id,
    name: item.name || "",
    email: item.email || "",
    mobile: item.mobile || null,
    role_id: item.role_id || null,
    image: item.image || null,
    status: item.status || "inactive",
    reset_token: item.reset_token || null,
    reset_token_expiry: item.reset_token_expiry || null,
    otp: item.otp || null,
    otp_expiry: item.otp_expiry || null,
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
  });

  const load = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      const rawData = response.data?.data?.data || response.data?.data || response.data || [];
      const items = Array.isArray(rawData) ? rawData.map(normalizeUser) : [];
      setData(items);
    } catch (err) {
      console.error("Load error:", err);
      showError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadRoles();
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
      result = result.filter((item) =>
        [item.name, item.email, item.mobile].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        )
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const getRoleName = (roleId) => {
    if (!roles || !roleId) return "User";
    const role = roles.find(r => r.id === roleId);
    return role ? role.role_name : `Role #${roleId}`;
  };

  const activeCount = data.filter((u) => u.status === "active").length;
  const inactiveCount = data.filter((u) => u.status === "inactive").length;

  // Navigation handlers
  const openAdd = () => {
    navigate('/users/add');
  };

  const openEdit = (item) => {
    navigate(`/users/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/users/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await userService.delete(deleteId);
      showSuccess("User deleted successfully");
      await load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.response?.data?.message || "Failed to delete user");
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
      header: "Photo",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={getImageUrl(image)}
            alt="profile"
            className="w-8 h-8 object-cover rounded-full border border-gray-200"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-medium">
            <MdPerson size={16} />
          </div>
        ),
    },
    {
      header: "Name",
      key: "name",
      render: (_, row) => (
        <span className="font-medium text-gray-800">
          {row.name || "Unnamed"}
        </span>
      ),
    },
    {
      header: "Email",
      key: "email",
      render: (v) => (
        <div className="flex items-center gap-1">
          <MdEmail className="text-gray-400" size={14} />
          <span className="text-sm text-gray-500">{v}</span>
        </div>
      ),
    },
    {
      header: "Mobile",
      key: "mobile",
      render: (v) => (
        <span className="text-sm text-gray-500">{v || "—"}</span>
      ),
    },
    {
      header: "Updated At",
      key: "updatedAt",
      // Only show a value if the record was genuinely edited after creation.
      render: (v, row) => {
        const updated = wasActuallyUpdated(row.createdAt, row.updatedAt);
        return (
          <span className="text-gray-500 text-sm">
            {updated ? formatDate(row.updatedAt) : "—"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="View Profile"
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system users</p>
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
            Add User
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top bar: search on left, tabs on right */}
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
              placeholder="Search users..."
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
          emptyMessage="No users found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} users
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete User"
        message="Delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default Users;