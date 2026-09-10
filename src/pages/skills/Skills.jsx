import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import skillsService from "../../services/skills.service";
import { showSuccess, showError } from "../../utils/toast";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh, MdVisibility } from "react-icons/md";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from '../../utils/getUserName';

const Skills = () => {
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

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    // Convert to string for lookup
    const key = String(userId);
    console.log(`Looking up user ${key}:`, userNameCache[key]);
    return userNameCache[key] || `User ${userId}`;
  };

  // Get display name for updated by
  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by) {
      const name = getUserNameCached(row.updated_by);
      console.log(`Row updated_by: ${row.updated_by}, Name: ${name}`);
      return name;
    }
    return "-";
  };

  // Normalize API response
  const normalizeSkill = (item) => ({
    id: item.id,
    skill_name: item.skill_name || "",
    status: item.status === true || item.status === "true" || item.status === 1,
    is_trending: item.is_trending === true || item.is_trending === "true" || item.is_trending === 1,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
  });

  const load = async () => {
    setLoading(true);
    try {
      // Fetch users first to get user names
      const users = await fetchUsers();
      console.log('Users fetched:', users);
      
      const userMap = {};
      Object.keys(users).forEach(id => {
        userMap[id] = users[id].name;
      });
      console.log('User map created:', userMap);
      setUserNameCache(userMap);

      const r = await skillsService.getAll();
      console.log('Skills response:', r);
      
      const rawData = r?.data?.data || r?.data || r?.results || r || [];
      const skills = Array.isArray(rawData) ? rawData.map(normalizeSkill) : [];
      console.log('Normalized skills:', skills);
      setData(skills);
    } catch (err) {
      console.error("Load error:", err);
      showError(err.message || "Failed to load skills");
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
        statusFilter === "active" ? item.status === true : item.status !== true
      );
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        String(item.skill_name ?? "").toLowerCase().includes(query)
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((s) => s.status === true).length;
  const inactiveCount = data.length - activeCount;

  // Navigation handlers
  const openAdd = () => {
    navigate('/skills/add');
  };

  const openEdit = (item) => {
    navigate(`/skills/edit/${item.id}`);
  };

  const openView = (item) => {
    navigate(`/skills/view/${item.id}`);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await skillsService.delete(deleteId);
      showSuccess("Skill deleted successfully");
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.message || "Failed to delete skill");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // Toggle status
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await skillsService.update(id, { status: newStatus });
      showSuccess(`Status updated to ${newStatus ? "active" : "inactive"}`);
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
      await skillsService.update(id, { is_trending: newTrending });
      showSuccess(`Trending updated to ${newTrending ? "Yes" : "No"}`);
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
      header: "Skill Name",
      key: "skill_name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    {
      header: "Trending",
      key: "is_trending",
      render: (is_trending, row) => (
        <button
          onClick={() => handleTrendingToggle(row.id, is_trending)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${is_trending ? "bg-amber-500" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${is_trending ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (status, row) => (
        <button
          onClick={() => handleStatusToggle(row.id, status)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${status ? "bg-[#2c0eee]" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${status ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      ),
    },
    {
      header: "Updated By",
      key: "updated_by",
      render: (_, row) => {
        const name = getUpdatedByName(row);
        return (
          <span className="text-gray-700 text-sm font-medium">
            {name}
          </span>
        );
      },
    },
    {
      header: "Updated At",
      key: "updated_at",
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
          <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
          <p className="text-sm text-gray-500 mt-1">Manage skills used across job listings</p>
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
            Add Skill
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
              placeholder="Search skills..."
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
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === tab.key ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}
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
          emptyMessage="No skills found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} skills
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
        title="Delete Skill"
        message="Delete this skill? It may affect associated data."
      />
    </div>
  );
};

export default Skills;