import { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import SearchBox from "../../components/common/SearchBox";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import blogService from "../../services/blog.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate, truncate, getStatusColor } from "../../utils/helpers";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import useSearch from "../../hooks/useSearch";
import usePagination from "../../hooks/usePagination";

const Blogs = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "draft",
    tags: "",
  });
  const { query, setQuery, debouncedQuery } = useSearch();
  const { page, limit, goToPage, setLimit, reset } = usePagination();

  const load = async () => {
    setLoading(true);
    try {
      const r = await blogService.getAll({
        search: debouncedQuery,
        page,
        page_size: limit,
      });
      setData(r.data.results || r.data);
      setTotal(r.data.count || 0);
    } catch {
      showError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [debouncedQuery, page, limit]);
  useEffect(() => {
    reset();
  }, [debouncedQuery]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: "", content: "", status: "draft", tags: "" });
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item, tags: item.tags?.join(",") || "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (editItem) {
        await blogService.update(editItem.id, payload);
        showSuccess("Blog updated");
      } else {
        await blogService.create(payload);
        showSuccess("Blog created");
      }
      setModalOpen(false);
      load();
    } catch {
      showError("Failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await blogService.delete(deleteId);
      showSuccess("Blog deleted");
      load();
    } catch {
      showError("Failed");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // Counts for tab badges
  const publishedCount = data.filter((d) => d.status === "published").length;
  const draftCount = data.filter((d) => d.status === "draft").length;

  // Filter data by status tab
  const filteredData =
    statusFilter === "published"
      ? data.filter((d) => d.status === "published")
      : statusFilter === "draft"
      ? data.filter((d) => d.status === "draft")
      : data;

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      header: "Title",
      key: "title",
      render: (v) => (
        <span className="font-medium text-gray-800">{truncate(v, 50)}</span>
      ),
    },
    { header: "Author", key: "author" },
    {
      header: "Status",
      key: "status",
      render: (v) => (
        <span
          className={getStatusColor(v === "published" ? "active" : "draft")}
        >
          {v}
        </span>
      ),
    },
    { header: "Published", key: "published_at", render: (v) => formatDate(v) },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1">
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
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage blog posts</p>
        </div>
        <Button icon={MdAdd} onClick={openAdd}>
          Write Blog
        </Button>
      </div>

      {/* Search + Total */}
      <div className="flex items-center justify-between gap-4">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search blogs..."
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
          className={statusFilter === "published" ? tabActive : tabInactive}
          onClick={() => setStatusFilter("published")}
        >
          Published {publishedCount}
        </button>
        <button
          className={statusFilter === "draft" ? tabActive : tabInactive}
          onClick={() => setStatusFilter("draft")}
        >
          Draft {draftCount}
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
        title={editItem ? "Edit Blog" : "Write New Blog"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Blog title"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input-field resize-none"
              rows={8}
              placeholder="Write your blog content here..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <Input
              label="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="react, python, jobs"
            />
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
              {editItem ? "Update" : "Publish"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Blog"
        message="Delete this blog post permanently?"
      />
    </div>
  );
};

export default Blogs;
