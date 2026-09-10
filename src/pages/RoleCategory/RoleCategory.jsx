import React, { useState, useEffect, useCallback } from "react";
import { MdAdd, MdEdit, MdDelete, MdCategory } from "react-icons/md";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import SearchBox from "../../components/common/SearchBox";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SwitchButton from "../../components/common/SwitchButton";
import { roleCategoryService } from "../../services/roleCategory.service";
import { showSuccess, showError } from "../../utils/toast";
import AddRoleCategory from "./AddRoleCategory";

const RoleCategory = () => {
  const [roleCategories, setRoleCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchRoleCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, search: search || undefined };
      const response = await roleCategoryService.getAll(params);
      const data = response.data || response.results || [];
      setRoleCategories(data);
      setTotal(response.total || response.count || data.length || 0);
    } catch (error) {
      showError(error.message || "Failed to fetch role categories");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchRoleCategories();
  }, [fetchRoleCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchRoleCategories();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!selectedId) return;
    setDeleteLoading(true);
    try {
      await roleCategoryService.delete(selectedId);
      showSuccess("Role category deleted successfully");
      setShowDeleteConfirm(false);
      setSelectedId(null);
      setSelectedName("");
      await fetchRoleCategories();
    } catch (error) {
      showError(error.message || "Failed to delete role category");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditData(row);
    setShowAddModal(true);
  };

  const handleAddNew = () => {
    setEditData(null);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditData(null);
  };

  const handleFormSuccess = () => {
    setShowAddModal(false);
    setEditData(null);
    fetchRoleCategories();
  };

  // Trending Toggle
  const handleTrendingToggle = async (row, newValue) => {
    if (toggleLoading) return;
    setToggleLoading(true);

    try {
      const updateData = {
        name: row.name,
        is_trending: newValue,
        status: getStatusValue(row), // Send boolean
      };

      console.log("Updating trending with data:", updateData);

      const id = row.id || row._id;
      await roleCategoryService.update(id, updateData);

      showSuccess(`Trending ${newValue ? "enabled" : "disabled"}`);
      await fetchRoleCategories();
    } catch (error) {
      console.error("Trending toggle error:", error);
      showError(error.message || "Failed to update trending");
    } finally {
      setToggleLoading(false);
    }
  };

  // Status Toggle
  const handleStatusToggle = async (row, newValue) => {
    if (toggleLoading) return;
    setToggleLoading(true);

    try {
      const updateData = {
        name: row.name,
        is_trending: row.is_trending || false,
        status: newValue, // Send boolean directly
      };

      console.log("Updating status with data:", updateData);

      const id = row.id || row._id;
      await roleCategoryService.update(id, updateData);

      showSuccess(`Status ${newValue ? "activated" : "deactivated"}`);
      await fetchRoleCategories();
    } catch (error) {
      console.error("Status toggle error:", error);
      showError(error.message || "Failed to update status");
    } finally {
      setToggleLoading(false);
    }
  };

  // Get status value (boolean) from row
  const getStatusValue = (row) => {
    if (row.is_status !== undefined && row.is_status !== null) {
      return row.is_status;
    }
    if (row.status !== undefined && row.status !== null) {
      // If status is a string, convert to boolean
      if (typeof row.status === "string") {
        return row.status === "active";
      }
      // If status is already boolean
      return row.status;
    }
    return true; // Default to active
  };

  // Get trending value from row
  const getTrendingValue = (row) => {
    if (row.is_trending !== undefined && row.is_trending !== null) {
      return row.is_trending;
    }
    return false; // Default to not trending
  };

  const columns = [
    {
      key: "sno",
      header: "S.No",
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    { key: "name", header: "Role Category Name" },
    {
      key: "is_trending",
      header: "Trending",
      render: (value, row) => (
        <SwitchButton
          value={getTrendingValue(row)}
          type="trending"
          size="sm"
          disabled={toggleLoading}
          onToggle={(newValue) => handleTrendingToggle(row, newValue)}
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value, row) => (
        <SwitchButton
          value={getStatusValue(row)}
          type="status"
          size="sm"
          disabled={toggleLoading}
          onToggle={(newValue) => handleStatusToggle(row, newValue)}
        />
      ),
    },
    {
      key: "created_at",
      header: "Created At",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-[#2c0eee] transition-colors"
            title="Edit"
            disabled={toggleLoading}
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => {
              setSelectedId(row.id || row._id);
              setSelectedName(row.name || "");
              setShowDeleteConfirm(true);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
            disabled={toggleLoading}
          >
            <MdDelete size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job Role Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage role categories for job listings
          </p>
        </div>
        <Button
          variant="primary"
          icon={MdAdd}
          onClick={handleAddNew}
          disabled={toggleLoading}
        >
          Add Role Category
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search role categories..."
        />
        <div className="text-sm text-gray-500">
          Total: {total} role categories
        </div>
      </div>

      <Table
        columns={columns}
        data={roleCategories}
        loading={loading}
        emptyMessage="No role categories found"
      />

      {total > limit && (
        <Pagination
          page={page}
          total={total}
          limit={limit}
          onChange={setPage}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedId(null);
          setSelectedName("");
        }}
        onConfirm={handleDelete}
        title="Delete Role Category"
        message={`Are you sure you want to delete "${selectedName}"?`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />

      {showAddModal && (
        <AddRoleCategory
          isOpen={showAddModal}
          onClose={handleModalClose}
          onSuccess={handleFormSuccess}
          editData={editData}
        />
      )}
    </div>
  );
};

export default RoleCategory;
