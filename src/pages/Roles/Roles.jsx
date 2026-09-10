import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import roleService from "../../services/role.service";
import { showSuccess, showError } from "../../utils/toast";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh, MdVisibility } from "react-icons/md";
import { formatDate } from "../../utils/helpers";

const Roles = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

  // Normalize status from API
  const normalizeStatus = (status) => {
    if (
      status === true ||
      String(status).toLowerCase() === "active" ||
      String(status).toLowerCase() === "1"
    ) {
      return "active";
    }

    return "inactive";
  };

  const normalizeRole = (item) => ({
    id: item.id,
    role_name: item.role_name || "",
    status: normalizeStatus(item.status),
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
  });

  const load = async () => {
    setLoading(true);
    try {
      const r = await roleService.getAll();
      console.log('Roles response:', r);

      // Handle different response structures
      const rawData = r?.data?.data || r?.data || r?.results || r || [];
      const roles = Array.isArray(rawData) ? rawData.map(normalizeRole) : [];
      setData(roles);
    } catch (err) {
      console.error("Load error:", err);
      showError(err.message || "Failed to load roles");
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
      result = result.filter((item) =>
        statusFilter === "active" ? item.status === "active" : item.status !== "active"
      );
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        String(item.role_name ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((r) => r.status === "active").length;
  const inactiveCount = data.length - activeCount;

  // Navigation handlers
  const openAdd = () => {
    navigate('/roles/add');
  };

  const openEdit = (item) => {
    navigate(`/roles/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/roles/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await roleService.delete(deleteId);
      showSuccess("Role deleted successfully");
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.message || "Failed to delete role");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "active"
        ? "inactive"
        : "active";

    try {
      setLoading(true);

      console.log("Changing role status:", {
        id,
        currentStatus,
        newStatus,
      });

      await roleService.updateStatus(id, newStatus);

      // Update table immediately
      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
              ...item,
              status: newStatus,
            }
            : item
        )
      );

      showSuccess(
        `Role ${newStatus === "active"
          ? "activated"
          : "deactivated"
        } successfully`
      );
    } catch (error) {
      console.error("Status toggle error:", error);

      showError(
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update role status"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Role Name",
      key: "role_name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    // {
    //   header: "Status",
    //   key: "status",
    //   render: (status, row) => {
    //     const isActive = status === "active";
    //     return (
    //       <button
    //         onClick={() => handleStatusToggle(row.id, status)}
    //         className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-[#2c0eee]" : "bg-gray-300"
    //           }`}
    //       >
    //         <span
    //           className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive ? "translate-x-6" : "translate-x-1"
    //             }`}
    //         />
    //       </button>
    //     );
    //   },
    // },
    {
      header: "Status",
      key: "status",
      render: (status, row) => {
        const isActive = status === "active";

        return (
          <button
            type="button"
            onClick={() =>
              handleStatusToggle(row.id, status)
            }
            disabled={loading}
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${isActive
                ? "bg-[#2c0eee]"
                : "bg-gray-300"
              } ${loading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
              }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${isActive
                  ? "translate-x-6"
                  : "translate-x-1"
                }`}
            />
          </button>
        );
      },
    },
    {
      header: "Updated At",
      key: "updatedAt",
      render: (v) => <span className="text-gray-500 text-sm">{v ? formatDate(v) : "—"}</span>,
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user roles and permissions</p>
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
            Add Role
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
              placeholder="Search roles..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
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
          emptyMessage="No roles found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} roles
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
        title="Delete Role"
        message="Delete this role? Users assigned to it may lose access."
      />
    </div>
  );
};

export default Roles;