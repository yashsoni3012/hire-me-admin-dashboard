import { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import SearchBox from "../../components/common/SearchBox";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import categoryService from "../../services/category.service";
import { showSuccess, showError } from "../../utils/toast";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import useSearch from "../../hooks/useSearch";
import usePagination from "../../hooks/usePagination";
import { formatDate } from "../../utils/helpers";

const Category = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
  });
  const { query, setQuery, debouncedQuery } = useSearch();
  const { page, limit, goToPage, setLimit, reset } = usePagination();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll({
        search: debouncedQuery,
        page,
        page_size: limit,
      });
      setData(res.data.results || res.data);
      setTotal(res.data.count || 0);
    } catch {
      showError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedQuery, page, limit]);
  useEffect(() => {
    reset();
  }, [debouncedQuery]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", description: "", is_active: true });
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
      is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editItem) {
        await categoryService.update(editItem.id, form);
        showSuccess("Updated successfully");
      } else {
        await categoryService.create(form);
        showSuccess("Created successfully");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showError(err.response?.data?.name?.[0] || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await categoryService.delete(deleteId);
      showSuccess("Deleted successfully");
      loadData();
    } catch {
      showError("Failed to delete");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // Counts for tab badges
  const activeCount = data.filter((d) => d.is_active === true).length;
  const inactiveCount = data.filter((d) => d.is_active === false).length;

  // Filter data by status tab
  const filteredData =
    statusFilter === "active"
      ? data.filter((d) => d.is_active === true)
      : statusFilter === "inactive"
      ? data.filter((d) => d.is_active === false)
      : data;

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Name",
      key: "name",
      render: (v) => <span className="font-medium text-gray-800">{v}</span>,
    },
    {
      header: "Description",
      key: "description",
      render: (v) => <span className="text-gray-500 text-sm">{v || "-"}</span>,
    },
    {
      header: "Status",
      key: "is_active",
      render: (v) => (
        <span className={v ? "badge-active" : "badge-inactive"}>
          {v ? "Active" : "Inactive"}
        </span>
      ),
    },
    { header: "Created", key: "created_at", render: (v) => formatDate(v) },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => setDeleteId(id)}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
          >
            <MdDelete size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tabBase =
    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors";
  const tabActive = `${tabBase} bg-white text-gray-800 shadow`;
  const tabInactive = `${tabBase} text-gray-500 hover:text-gray-700`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage job categories</p>
        </div>
        <Button icon={MdAdd} onClick={openAdd}>
          Add Category
        </Button>
      </div>

      {/* Search + Total */}
      <div className="flex items-center justify-between gap-4">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search categories..."
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">
          Total: {total} items
        </span>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full w-fit">
        <button
          className={statusFilter === "all" ? tabActive : tabInactive}
          onClick={() => setStatusFilter("all")}
        >
          All {data.length}
        </button>
        <button
          className={statusFilter === "active" ? tabActive : tabInactive}
          onClick={() => setStatusFilter("active")}
        >
          Active {activeCount}
        </button>
        <button
          className={statusFilter === "inactive" ? tabActive : tabInactive}
          onClick={() => setStatusFilter("inactive")}
        >
          Inactive {inactiveCount}
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} data={filteredData} loading={loading} />
        <Pagination
          page={page}
          total={total}
          limit={limit}
          onChange={goToPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
          }}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit" : "Add"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            required
            placeholder="Enter name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-field resize-none"
              rows={3}
              placeholder="Optional description"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <div className="flex gap-3 pt-2">
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
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
      />
    </div>
  );
};

export default Category;
