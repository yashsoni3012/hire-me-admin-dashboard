// import { useState, useEffect, useMemo } from "react";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import SearchBox from "../../components/common/SearchBox";
// import Pagination from "../../components/common/Pagination";
// import Modal from "../../components/common/Modal";
// import Input from "../../components/common/Input";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import jobTypeService from "../../services/jobType.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
// import { formatDate } from "../../utils/helpers";

// // Helper to get current user ID (fallback to 1 if not found)
// const getCurrentUserId = () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user.id) return parseInt(user.id);
//     const userId = localStorage.getItem("userId");
//     if (userId) return parseInt(userId);
//   } catch (e) {
//     console.warn("Could not get user ID from localStorage, using default 1");
//   }
//   return 1; // fallback
// };

// const JobTypes = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [form, setForm] = useState({
//     name: "",
//     status: true,
//     is_trending: false,
//   });

//   // Normalize API response
//   const normalizeJobType = (item) => ({
//     id: item.id,
//     name: item.name || "",
//     status: item.status === true || item.status === "true" || item.status === 1,
//     is_trending:
//       item.is_trending === true ||
//       item.is_trending === "true" ||
//       item.is_trending === 1,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     created_at: item.created_at || null,
//     updated_at: item.updated_at || null,
//   });

//   const load = async () => {
//     setLoading(true);
//     try {
//       const r = await jobTypeService.getAll();
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const jobTypes = Array.isArray(rawData)
//         ? rawData.map(normalizeJobType)
//         : [];
//       setData(jobTypes);
//     } catch (err) {
//       console.error("Load error:", err);
//       showError(err.response?.data?.message || "Failed to load job types");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);
//   useEffect(() => {
//     setPage(1);
//   }, [search]);

//   const filteredData = useMemo(() => {
//     const query = search.toLowerCase().trim();
//     if (!query) return data;
//     return data.filter((item) =>
//       String(item.name ?? "")
//         .toLowerCase()
//         .includes(query),
//     );
//   }, [data, search]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const openAdd = () => {
//     setEditItem(null);
//     setForm({ name: "", status: true, is_trending: false });
//     setModalOpen(true);
//   };

//   const openEdit = (item) => {
//     setEditItem(item);
//     setForm({
//       name: item.name,
//       status: item.status,
//       is_trending: item.is_trending,
//     });
//     setModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormLoading(true);
//     try {
//       const userId = getCurrentUserId();
//       const payload = {
//         name: form.name.trim(),
//         status: form.status,
//         is_trending: form.is_trending,
//       };

//       if (editItem) {
//         // For update, include updated_by
//         payload.updated_by = userId;
//         await jobTypeService.update(editItem.id, payload);
//         showSuccess("Job type updated");
//       } else {
//         // For create, include created_by
//         payload.created_by = userId;
//         await jobTypeService.create(payload);
//         showSuccess("Job type created");
//       }
//       setModalOpen(false);
//       load();
//     } catch (err) {
//       console.error("Submit error:", err.response?.data);
//       const errorMsg =
//         err.response?.data?.message || err.message || "Operation failed";
//       showError(errorMsg);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await jobTypeService.delete(deleteId);
//       showSuccess("Job type deleted");
//       load();
//     } catch (err) {
//       console.error("Delete error:", err);
//       showError(err.response?.data?.message || "Failed to delete");
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   // Toggle status – include updated_by
//   const handleStatusToggle = async (id, currentStatus) => {
//     const newStatus = !currentStatus;
//     try {
//       await jobTypeService.update(id, {
//         status: newStatus,
//         updated_by: getCurrentUserId(),
//       });
//       showSuccess(`Status updated to ${newStatus ? "active" : "inactive"}`);
//       load();
//     } catch (err) {
//       console.error("Status toggle error:", err);
//       showError(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   // Toggle trending – include updated_by
//   const handleTrendingToggle = async (id, currentTrending) => {
//     const newTrending = !currentTrending;
//     try {
//       await jobTypeService.update(id, {
//         is_trending: newTrending,
//         updated_by: getCurrentUserId(),
//       });
//       showSuccess(`Trending updated to ${newTrending ? "Yes" : "No"}`);
//       load();
//     } catch (err) {
//       console.error("Trending toggle error:", err);
//       showError(err.response?.data?.message || "Failed to update trending");
//     }
//   };

//   const columns = [
//     { header: "#", key: "id", render: (_, __, i) => i + 1 },
//     {
//       header: "Job Type",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
//           {v}
//         </span>
//       ),
//     },
//     {
//       header: "Trending",
//       key: "is_trending",
//       render: (is_trending, row) => (
//         <button
//           onClick={() => handleTrendingToggle(row.id, is_trending)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             is_trending ? "bg-yellow-500" : "bg-gray-300"
//           }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
//               is_trending ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (status, row) => (
//         <button
//           onClick={() => handleStatusToggle(row.id, status)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             status ? "bg-green-500" : "bg-gray-300"
//           }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
//               status ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Created",
//       key: "created_at",
//       render: (v) => formatDate(v),
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1">
//           <button
//             onClick={() => openEdit(row)}
//             className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg"
//           >
//             <MdEdit size={16} />
//           </button>
//           <button
//             onClick={() => setDeleteId(id)}
//             className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
//           >
//             <MdDelete size={16} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//           <h2 className="text-xl font-bold text-gray-900">Job Types</h2>
//           <div className="sm:ml-3">
//             <SearchBox
//               value={search}
//               onChange={setSearch}
//               placeholder="Search job types..."
//             />
//           </div>
//         </div>
//         <Button icon={MdAdd} onClick={openAdd}>
//           Add Job Type
//         </Button>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
//         <Table columns={columns} data={paginatedData} loading={loading} />
//         <Pagination
//           page={page}
//           total={filteredData.length}
//           limit={limit}
//           onChange={setPage}
//         />
//       </div>

//       <Modal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         title={editItem ? "Edit Job Type" : "Add Job Type"}
//         size="sm"
//       >
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             label="Job Type Name"
//             required
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             placeholder="e.g. Full Time"
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               value={form.status ? "active" : "inactive"}
//               onChange={(e) =>
//                 setForm({ ...form, status: e.target.value === "active" })
//               }
//               className="input-field"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Trending
//             </label>
//             <select
//               value={form.is_trending ? "yes" : "no"}
//               onChange={(e) =>
//                 setForm({ ...form, is_trending: e.target.value === "yes" })
//               }
//               className="input-field"
//             >
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>
//           </div>

//           <div className="flex gap-3">
//             <Button
//               type="button"
//               variant="secondary"
//               className="flex-1"
//               onClick={() => setModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" className="flex-1" loading={formLoading}>
//               {editItem ? "Update" : "Create"}
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Job Type"
//         message="Delete this job type? It may affect associated job listings."
//       />
//     </div>
//   );
// };

// export default JobTypes;

import { useState, useEffect, useMemo } from "react";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import SearchBox from "../../components/common/SearchBox";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import jobTypeService from "../../services/jobType.service";
import { showSuccess, showError } from "../../utils/toast";
import { MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";
import { formatDate } from "../../utils/helpers";

// Helper to get current user ID (fallback to 1 if not found)
const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) return parseInt(user.id);
    const userId = localStorage.getItem("userId");
    if (userId) return parseInt(userId);
  } catch (e) {
    console.warn("Could not get user ID from localStorage, using default 1");
  }
  return 1; // fallback
};

const JobTypes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    name: "",
    status: true,
    is_trending: false,
  });

  // Normalize API response
  const normalizeJobType = (item) => ({
    id: item.id,
    name: item.name || "",
    status: item.status === true || item.status === "true" || item.status === 1,
    is_trending:
      item.is_trending === true ||
      item.is_trending === "true" ||
      item.is_trending === 1,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
  });

  const load = async () => {
    setLoading(true);
    try {
      const r = await jobTypeService.getAll();
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const jobTypes = Array.isArray(rawData)
        ? rawData.map(normalizeJobType)
        : [];
      setData(jobTypes);
    } catch (err) {
      console.error("Load error:", err);
      showError(err.response?.data?.message || "Failed to load job types");
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
        String(item.name ?? "")
          .toLowerCase()
          .includes(query),
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((j) => j.status === true).length;
  const inactiveCount = data.length - activeCount;

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", status: true, is_trending: false });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      status: item.status,
      is_trending: item.is_trending,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const userId = getCurrentUserId();
      const payload = {
        name: form.name.trim(),
        status: form.status,
        is_trending: form.is_trending,
      };

      if (editItem) {
        // For update, include updated_by
        payload.updated_by = userId;
        await jobTypeService.update(editItem.id, payload);
        showSuccess("Job type updated");
      } else {
        // For create, include created_by
        payload.created_by = userId;
        await jobTypeService.create(payload);
        showSuccess("Job type created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      console.error("Submit error:", err.response?.data);
      const errorMsg =
        err.response?.data?.message || err.message || "Operation failed";
      showError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await jobTypeService.delete(deleteId);
      showSuccess("Job type deleted");
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // Toggle status – include updated_by
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await jobTypeService.update(id, {
        status: newStatus,
        updated_by: getCurrentUserId(),
      });
      showSuccess(`Status updated to ${newStatus ? "active" : "inactive"}`);
      load();
    } catch (err) {
      console.error("Status toggle error:", err);
      showError(err.response?.data?.message || "Failed to update status");
    }
  };

  // Toggle trending – include updated_by
  const handleTrendingToggle = async (id, currentTrending) => {
    const newTrending = !currentTrending;
    try {
      await jobTypeService.update(id, {
        is_trending: newTrending,
        updated_by: getCurrentUserId(),
      });
      showSuccess(`Trending updated to ${newTrending ? "Yes" : "No"}`);
      load();
    } catch (err) {
      console.error("Trending toggle error:", err);
      showError(err.response?.data?.message || "Failed to update trending");
    }
  };

  const columns = [
    { header: "#", key: "id", render: (_, __, i) => (page - 1) * limit + i + 1 },
    {
      header: "Job Type",
      key: "name",
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
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            is_trending ? "bg-amber-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
              is_trending ? "translate-x-6" : "translate-x-1"
            }`}
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
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            status ? "bg-[#2c0eee]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
              status ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      header: "Created At",
      key: "created_at",
      render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => setDeleteId(id)}
            className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
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
          <h1 className="text-2xl font-bold text-gray-900">Job Types</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job type categories</p>
        </div>
        <Button icon={MdAdd} onClick={openAdd}>
          Add Job Type
        </Button>
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
              placeholder="Search job types..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
                      ? "bg-blue-50 text-[#2c0eee]"
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
          emptyMessage="No job types found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} job types
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Job Type" : "Add Job Type"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Job Type Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Full Time"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status ? "active" : "inactive"}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value === "active" })
              }
              className="input-field"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trending
            </label>
            <select
              value={form.is_trending ? "yes" : "no"}
              onChange={(e) =>
                setForm({ ...form, is_trending: e.target.value === "yes" })
              }
              className="input-field"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={formLoading}>
              {editItem ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Job Type"
        message="Delete this job type? It may affect associated job listings."
      />
    </div>
  );
};

export default JobTypes;