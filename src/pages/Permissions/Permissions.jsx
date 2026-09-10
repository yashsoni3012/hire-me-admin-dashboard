import { useState, useEffect, useMemo } from "react";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import SearchBox from "../../components/common/SearchBox";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import permissionService from "../../services/permission.service";
import { showSuccess, showError } from "../../utils/toast";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

const Permissions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [form, setForm] = useState({
    name: "",
    codename: "",
    content_type: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const r = await permissionService.getAll();
      setData(r.data.results || r.data);
    } catch {
      showError("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [search]);

  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return data;
    return data.filter((item) =>
      [item.name, item.codename, item.content_type].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [data, search]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editItem) {
        await permissionService.update(editItem.id, form);
        showSuccess("Updated");
      } else {
        await permissionService.create(form);
        showSuccess("Created");
      }
      setModalOpen(false);
      load();
    } catch {
      showError("Failed");
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { header: "#", key: "id", render: (_, __, i) => (page - 1) * limit + i + 1 },
    {
      header: "Permission Name",
      key: "name",
      render: (v) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      header: "Codename",
      key: "codename",
      render: (v) => (
        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-[#2c0eee]">{v}</code>
      ),
    },
    { header: "Module", key: "content_type" },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            onClick={() => {
              setEditItem(row);
              setForm({ name: row.name, codename: row.codename, content_type: row.content_type });
              setModalOpen(true);
            }}
            className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
          >
            <MdEdit size={16} />
          </button>
          <button className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
            <MdDelete size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system permissions</p>
        </div>
        <Button
          icon={MdAdd}
          onClick={() => {
            setEditItem(null);
            setForm({ name: "", codename: "", content_type: "" });
            setModalOpen(true);
          }}
        >
          Add Permission
        </Button>
      </div>

      {/* Search + Total */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <SearchBox value={search} onChange={setSearch} placeholder="Search permissions..." />
        <div className="text-sm text-gray-500 whitespace-nowrap">Total: {data.length} permissions</div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} data={paginatedData} loading={loading} emptyMessage="No permissions found" />
        <Pagination
          page={page}
          total={filteredData.length}
          limit={limit}
          onChange={setPage}
          onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Permission" : "Add Permission"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Permission Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Codename"
            required
            value={form.codename}
            onChange={(e) => setForm({ ...form, codename: e.target.value })}
            placeholder="e.g. user.create"
          />
          <Input
            label="Module / Content Type"
            value={form.content_type}
            onChange={(e) => setForm({ ...form, content_type: e.target.value })}
          />
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={formLoading}>
              {editItem ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Permissions;
