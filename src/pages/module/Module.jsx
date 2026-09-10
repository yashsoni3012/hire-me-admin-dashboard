// import { useState, useEffect, useMemo } from "react";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import SearchBox from "../../components/common/SearchBox";
// import Pagination from "../../components/common/Pagination";
// import Modal from "../../components/common/Modal";
// import Input from "../../components/common/Input";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import moduleService from "../../services/module.service";
// import { showSuccess, showError } from "../../utils/toast";
// import { MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";
// import { formatDate } from "../../utils/helpers";

// const Modules = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [form, setForm] = useState({
//     name: "",
//     status: "active",
//   });

//   const normalizeModule = (item) => ({
//     id: item.id,
//     name: item.name || "",
//     status: item.status || "active",
//     createdAt: item.createdAt || null,
//     updatedAt: item.updatedAt || null,
//     raw: item,
//   });

//   const load = async () => {
//     setLoading(true);
//     try {
//       const r = await moduleService.getAll();
//       const rawData = r.data?.data || r.data?.results || r.data || [];
//       const modules = Array.isArray(rawData)
//         ? rawData.map(normalizeModule)
//         : [];
//       setData(modules);
//     } catch {
//       showError("Failed to load modules");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);
//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   const filteredData = useMemo(() => {
//     let result = data;
//     if (statusFilter !== "all") {
//       result = result.filter((item) =>
//         statusFilter === "active" ? item.status === "active" : item.status !== "active"
//       );
//     }
//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter((item) =>
//         String(item.name ?? "")
//           .toLowerCase()
//           .includes(query),
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((m) => m.status === "active").length;
//   const inactiveCount = data.length - activeCount;

//   const openAdd = () => {
//     setEditItem(null);
//     setForm({ name: "", status: "active" });
//     setModalOpen(true);
//   };

//   const openEdit = (item) => {
//     setEditItem(item);
//     setForm({
//       name: item.name,
//       status: item.status || "active",
//     });
//     setModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormLoading(true);
//     try {
//       const payload = {
//         name: form.name,
//         status: form.status,
//       };
//       if (editItem) {
//         await moduleService.update(editItem.id, payload);
//         showSuccess("Module updated");
//       } else {
//         await moduleService.create(payload);
//         showSuccess("Module created");
//       }
//       setModalOpen(false);
//       load();
//     } catch {
//       showError("Operation failed");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await moduleService.delete(deleteId);
//       showSuccess("Module deleted");
//       load();
//     } catch {
//       showError("Failed to delete");
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   const handleStatusToggle = async (id, currentStatus) => {
//     const newStatus = currentStatus === "active" ? "inactive" : "active";
//     try {
//       await moduleService.update(id, { status: newStatus });
//       showSuccess(`Status updated to ${newStatus}`);
//       load();
//     } catch {
//       showError("Failed to update status");
//     }
//   };

//   const columns = [
//     { header: "#", key: "id", render: (_, __, i) => (page - 1) * limit + i + 1 },
//     {
//       header: "Module Name",
//       key: "name",
//       render: (v) => (
//         <span className="font-medium capitalize text-gray-800">{v}</span>
//       ),
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (status, row) => {
//         const isActive = status === "active";
//         return (
//           <button
//             onClick={() => handleStatusToggle(row.id, status)}
//             className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//               isActive ? "bg-[#2c0eee]" : "bg-gray-300"
//             }`}
//           >
//             <span
//               className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
//                 isActive ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>
//         );
//       },
//     },
//     {
//       header: "Created At",
//       key: "createdAt",
//       render: (v) => <span className="text-gray-500 text-sm">{formatDate(v)}</span>,
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1 justify-end">
//           <button
//             onClick={() => openEdit(row)}
//             className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
//           >
//             <MdEdit size={16} />
//           </button>
//           <button
//             onClick={() => setDeleteId(id)}
//             className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
//           >
//             <MdDelete size={16} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const tabs = [
//     { key: "all", label: "All", count: data.length },
//     { key: "active", label: "Active", count: activeCount },
//     { key: "inactive", label: "Inactive", count: inactiveCount },
//   ];

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage application modules</p>
//         </div>
//         <Button icon={MdAdd} onClick={openAdd}>
//           Add Module
//         </Button>
//       </div>

//       {/* Table Card */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         {/* Top bar: search + tabs */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
//           <div className="relative w-full sm:w-72">
//             <MdSearch
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search modules..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-5 text-sm">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${
//                   statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 {tab.label}
//                 <span
//                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
//                     statusFilter === tab.key
//                       ? "bg-blue-50 text-[#2c0eee]"
//                       : "bg-gray-100 text-gray-500"
//                   }`}
//                 >
//                   {tab.count}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <Table
//           columns={columns}
//           data={paginatedData}
//           loading={loading}
//           emptyMessage="No modules found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of {filteredData.length} modules
//           </p>
//           <Pagination
//             page={page}
//             total={filteredData.length}
//             limit={limit}
//             onChange={setPage}
//             onLimitChange={(newLimit) => {
//               setLimit(newLimit);
//               setPage(1);
//             }}
//           />
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       <Modal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         title={editItem ? "Edit Module" : "Add Module"}
//         size="sm"
//       >
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             label="Module Name"
//             required
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             placeholder="e.g. dashboard"
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value })}
//               className="input-field"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
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

//       {/* Delete Confirmation */}
//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Module"
//         message="Delete this module? It may affect permissions assigned to it."
//       />
//     </div>
//   );
// };

// export default Modules;

import { useState, useEffect, useMemo } from "react";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import moduleService from "../../services/module.service";
import { showSuccess, showError } from "../../utils/toast";
import { MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";
import { formatDate } from "../../utils/helpers";

const Modules = () => {
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
    status: "active",
  });

  const normalizeModule = (item) => ({
    id: item.id,
    name: item.name || "",
    status: item.status || "active",
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
    raw: item,
  });

  const load = async () => {
    setLoading(true);
    try {
      const r = await moduleService.getAll();
      const rawData = r.data?.data || r.data?.results || r.data || [];
      const modules = Array.isArray(rawData)
        ? rawData.map(normalizeModule)
        : [];
      setData(modules);
    } catch {
      showError("Failed to load modules");
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
        String(item.name ?? "")
          .toLowerCase()
          .includes(query),
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((m) => m.status === "active").length;
  const inactiveCount = data.length - activeCount;

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", status: "active" });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      status: item.status || "active",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        name: form.name,
        status: form.status,
      };
      if (editItem) {
        await moduleService.update(editItem.id, payload);
        showSuccess("Module updated");
      } else {
        await moduleService.create(payload);
        showSuccess("Module created");
      }
      setModalOpen(false);
      load();
    } catch {
      showError("Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await moduleService.delete(deleteId);
      showSuccess("Module deleted");
      load();
    } catch {
      showError("Failed to delete");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await moduleService.update(id, { status: newStatus });
      showSuccess(`Status updated to ${newStatus}`);
      load();
    } catch {
      showError("Failed to update status");
    }
  };

  const columns = [
    { header: "#", key: "id", render: (_, __, i) => (page - 1) * limit + i + 1 },
    {
      header: "Module Name",
      key: "name",
      render: (v) => (
        <span className="font-medium capitalize text-gray-800">{v}</span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (status, row) => {
        const isActive = status === "active";
        return (
          <button
            onClick={() => handleStatusToggle(row.id, status)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
              isActive ? "bg-[#2c0eee]" : "bg-gray-300"
            }`}
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
      header: "Created At",
      key: "createdAt",
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
          <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
          <p className="text-sm text-gray-500 mt-1">Manage application modules</p>
        </div>
        <Button icon={MdAdd} onClick={openAdd}>
          Add Module
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
              placeholder="Search modules..."
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
          emptyMessage="No modules found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of {filteredData.length} modules
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

      {/* Modal with Radio Buttons for Status */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Module" : "Add Module"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Module Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. dashboard"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={form.status === "active"}
                  onChange={() => setForm({ ...form, status: "active" })}
                  className="w-4 h-4 text-[#2c0eee] border-gray-300 focus:ring-[#4529f7]"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={form.status === "inactive"}
                  onChange={() => setForm({ ...form, status: "inactive" })}
                  className="w-4 h-4 text-[#2c0eee] border-gray-300 focus:ring-[#4529f7]"
                />
                <span className="text-sm text-gray-700">Inactive</span>
              </label>
            </div>
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Module"
        message="Delete this module? It may affect permissions assigned to it."
      />
    </div>
  );
};

export default Modules;