// pages/FunctionRoleCategory.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
} from "react-icons/md";

import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { functionRoleCategoryService } from "../../services/functionRoleCategory.service";
import { functionRolesService } from "../../services/functionRoles.service";

import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const FunctionRoleCategory = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [statusFilter, setStatusFilter] = useState("all");

  const [functionRoles, setFunctionRoles] = useState([]);
  const [userNameCache, setUserNameCache] = useState({});

  // ============================================================
  // USER NAME
  // ============================================================

  const getUserNameCached = (userId) => {
    if (!userId) return "-";

    return userNameCache[userId] || `User ${userId}`;
  };

  // ============================================================
  // NORMALIZE CATEGORY
  // ============================================================

  const normalizeCategory = (item) => {
    const status =
      item.status !== undefined && item.status !== null
        ? item.status
        : item.is_status !== undefined && item.is_status !== null
          ? item.is_status
          : true;

    return {
      id: item.id || item._id,

      name: item.name || "",

      status: status,

      is_status: status === true || status === "active",

      is_trending:
        item.is_trending !== undefined
          ? Boolean(item.is_trending)
          : false,

      // Keep both formats available
      createdAt:
        item.created_at ||
        item.createdAt ||
        null,

      updatedAt:
        item.updated_at ||
        item.updatedAt ||
        null,

      created_by:
        item.created_by ||
        item.createdBy ||
        null,

      updated_by:
        item.updated_by ||
        item.updatedBy ||
        null,

      raw: item,
    };
  };

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  const load = async () => {
    setLoading(true);

    try {
      // ----------------------------------------
      // Fetch users
      // ----------------------------------------

      const users = await fetchUsers();

      const userMap = {};

      if (users && typeof users === "object") {
        Object.keys(users).forEach((id) => {
          userMap[id] = users[id]?.name || `User ${id}`;
        });
      }

      setUserNameCache(userMap);

      // ----------------------------------------
      // Fetch categories
      // ----------------------------------------

      const response =
        await functionRoleCategoryService.getAll({
          limit: 1000,
        });

      const rawData =
        response?.data?.data ||
        response?.data?.results ||
        response?.data ||
        [];

      const categories = Array.isArray(rawData)
        ? rawData.map(normalizeCategory)
        : [];

      // ========================================================
      // SORT NEWEST FIRST
      // ========================================================
      //
      // IMPORTANT:
      // normalizeCategory() creates `createdAt`.
      // Therefore use `createdAt` here, NOT `created_at`.
      //
      // Newest created record will appear first.
      // ========================================================

      const sortedCategories = [...categories].sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateB - dateA;
      });

      setData(sortedCategories);
    } catch (error) {
      console.error("Load error:", error);

      showError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load function role categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD FUNCTION ROLES
  // ============================================================

  const loadFunctionRoles = async () => {
    try {
      const response =
        await functionRolesService.getAll({
          limit: 1000,
        });

      const rawData =
        response?.data?.data ||
        response?.data?.results ||
        response?.data ||
        [];

      const roles = Array.isArray(rawData)
        ? rawData
        : [];

      setFunctionRoles(roles);

      return roles;
    } catch (error) {
      console.error(
        "Load function roles error:",
        error
      );

      return functionRoles;
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    load();
    loadFunctionRoles();
  }, []);

  // ============================================================
  // RESET PAGE WHEN SEARCH/FILTER CHANGES
  // ============================================================

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // ============================================================
  // FILTER DATA
  // ============================================================

  const filteredData = React.useMemo(() => {
    let result = [...data];

    // ----------------------------------------
    // Status filter
    // ----------------------------------------

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";

      result = result.filter((item) => {
        const itemStatus =
          item.is_status === true ||
          item.status === true ||
          item.status === "active";

        return itemStatus === isActive;
      });
    }

    // ----------------------------------------
    // Search
    // ----------------------------------------

    const query = search
      .toLowerCase()
      .trim();

    if (query) {
      result = result.filter((item) =>
        String(item.name ?? "")
          .toLowerCase()
          .includes(query)
      );
    }

    return result;
  }, [data, search, statusFilter]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const paginatedData = filteredData.slice(
    (page - 1) * limit,
    page * limit
  );

  // ============================================================
  // COUNTS
  // ============================================================

  const activeCount = data.filter((item) => {
    return (
      item.is_status === true ||
      item.status === true ||
      item.status === "active"
    );
  }).length;

  const inactiveCount =
    data.length - activeCount;

  // ============================================================
  // FUNCTION ROLE COUNT
  // ============================================================

  const getFunctionRolesCount = (categoryId) => {
    return functionRoles.filter((role) => {
      const parentId =
        role.roles_category_id ||
        role.functionRoleCategory?.id;

      return (
        String(parentId) ===
        String(categoryId)
      );
    }).length;
  };

  // ============================================================
  // CREATED BY
  // ============================================================

  const getCreatedByName = (row) => {
    if (!row) return "-";

    if (row.created_by) {
      return getUserNameCached(
        row.created_by
      );
    }

    return "-";
  };

  // ============================================================
  // UPDATED BY
  // ============================================================

  const getUpdatedByName = (row) => {
    if (!row) return "-";

    if (row.updated_by) {
      return getUserNameCached(
        row.updated_by
      );
    }

    return "-";
  };

  // ============================================================
  // DELETE CLICK
  // ============================================================

  const handleDeleteClick = (row) => {
    const childCount =
      getFunctionRolesCount(row.id);

    if (childCount > 0) {
      showError(
        `Cannot delete it has function role linked to it.`
      );

      return;
    }

    setDeleteId(row.id);
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);

    try {
      await functionRoleCategoryService.delete(
        deleteId
      );

      showSuccess(
        "Category deleted successfully"
      );

      await load();
      await loadFunctionRoles();
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "";

      if (
        /function[-_ ]?role|child|foreign\s*key|constraint/i.test(
          message
        )
      ) {
        showError(
          "Cannot delete this category because it has function roles linked to it."
        );
      } else {
        showError(
          message ||
          "Failed to delete category"
        );
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  // ============================================================
  // GET STATUS
  // ============================================================

  const getStatusValue = (row) => {
    if (
      row?.is_status !== undefined &&
      row?.is_status !== null
    ) {
      return row.is_status;
    }

    if (
      row?.status !== undefined &&
      row?.status !== null
    ) {
      return (
        row.status === true ||
        row.status === "active"
      );
    }

    return true;
  };

  // ============================================================
  // STATUS TOGGLE
  // ============================================================

  const handleStatusToggle = async (row) => {
    const currentStatus =
      getStatusValue(row);

    const newStatus =
      !currentStatus;

    try {
      const updateData = {
        name: row.name,

        is_trending:
          row.is_trending || false,

        status: newStatus,

        is_status: newStatus,
      };

      await functionRoleCategoryService.update(
        row.id,
        updateData
      );

      showSuccess(
        `Status ${newStatus
          ? "activated"
          : "deactivated"
        } successfully`
      );

      await load();
    } catch (error) {
      console.error(
        "Status toggle error:",
        error
      );

      showError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update status"
      );
    }
  };

  // ============================================================
  // TRENDING TOGGLE
  // ============================================================

  const handleTrendingToggle = async (
    row
  ) => {
    const newValue =
      !row.is_trending;

    const currentStatus =
      getStatusValue(row);

    try {
      const updateData = {
        name: row.name,

        is_trending: newValue,

        status: currentStatus,

        is_status: currentStatus,
      };

      await functionRoleCategoryService.update(
        row.id,
        updateData
      );

      showSuccess(
        `Trending ${newValue
          ? "enabled"
          : "disabled"
        } successfully`
      );

      await load();
    } catch (error) {
      console.error(
        "Trending toggle error:",
        error
      );

      showError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update trending"
      );
    }
  };

  // ============================================================
  // TABLE COLUMNS
  // ============================================================

  const columns = [
    {
      header: "#",
      key: "id",

      render: (_, __, i) =>
        (page - 1) * limit + i + 1,
    },

    // ----------------------------------------------------------
    // CATEGORY NAME
    // ----------------------------------------------------------

    {
      header: "Category Name",
      key: "name",

      render: (value) => (
        <span className="font-medium capitalize text-gray-800">
          {value}
        </span>
      ),
    },

    // ----------------------------------------------------------
    // TRENDING
    // ----------------------------------------------------------

    {
      header: "Trending",
      key: "is_trending",

      render: (value, row) => (
        <button
          type="button"
          onClick={() =>
            handleTrendingToggle(row)
          }
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${value
            ? "bg-yellow-500"
            : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${value
              ? "translate-x-6"
              : "translate-x-1"
              }`}
          />
        </button>
      ),
    },

    // ----------------------------------------------------------
    // STATUS
    // ----------------------------------------------------------

    {
      header: "Status",
      key: "status",

      render: (_, row) => {
        const isActive =
          getStatusValue(row);

        return (
          <button
            type="button"
            onClick={() =>
              handleStatusToggle(row)
            }
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive
              ? "bg-[#2c0eee]"
              : "bg-gray-300"
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

    // ----------------------------------------------------------
    // UPDATED BY
    // ----------------------------------------------------------

    {
      header: "Updated By",
      key: "updated_by",

      render: (_, row) => (
        <span className="text-gray-500 text-sm font-medium">
          {getUpdatedByName(row)}
        </span>
      ),
    },

    // ----------------------------------------------------------
    // UPDATED AT
    // ----------------------------------------------------------
    //
    // IMPORTANT:
    // normalized object uses `updatedAt`,
    // therefore use updatedAt here.
    // ----------------------------------------------------------

    {
      header: "Updated At",
      key: "updatedAt",

      render: (_, row) => (
        <span className="text-gray-500 text-sm">
          {row?.updatedAt
            ? formatDate(row.updatedAt)
            : "-"}
        </span>
      ),
    },

    // ----------------------------------------------------------
    // ACTIONS
    // ----------------------------------------------------------

    {
      header: "Actions",
      key: "id",

      render: (id, row) => {
        const childCount =
          getFunctionRolesCount(
            row.id
          );

        const canDelete =
          childCount === 0;

        return (
          <div className="flex gap-1">
            {/* VIEW */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/function-role-categories/view/${row.id}`,
                  {
                    state: {
                      item: row,
                    },
                  }
                )
              }
              className="p-1.5 hover:bg-blue-50 text-[#2c0eee] rounded-lg transition-colors"
              title="View"
            >
              <MdVisibility size={16} />
            </button>

            {/* EDIT */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/function-role-categories/edit/${row.id}`,
                  {
                    state: {
                      item: row,
                    },
                  }
                )
              }
              className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
              title="Edit"
            >
              <MdEdit size={16} />
            </button>

            {/* DELETE */}
            <button
              type="button"
              onClick={() =>
                handleDeleteClick(row)
              }
              className={`p-1.5 rounded-lg transition-colors ${canDelete
                ? "hover:bg-red-50 text-red-600"
                : "text-gray-300 hover:bg-gray-50 hover:text-gray-400 cursor-not-allowed"
                }`}
              title={
                canDelete
                  ? "Delete"
                  : `Cannot delete function role linked`
              }
            >
              <MdDelete size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  // ============================================================
  // TABS
  // ============================================================

  const tabs = [
    {
      key: "all",
      label: "All",
      count: data.length,
    },
    {
      key: "active",
      label: "Active",
      count: activeCount,
    },
    {
      key: "inactive",
      label: "Inactive",
      count: inactiveCount,
    },
  ];

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-4">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Function Role Categories
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage function role categories for job listings
          </p>
        </div>

        <Button
          icon={MdAdd}
          onClick={() =>
            navigate(
              "/function-role-categories/add"
            )
          }
        >
          Add Category
        </Button>
      </div>

      {/* ======================================================
          TABLE CARD
      ====================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* ====================================================
            SEARCH + TABS
        ==================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">

          {/* SEARCH */}

          <div className="relative w-full sm:w-72">
            <MdSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search categories..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
            />
          </div>

          {/* TABS */}

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    tab.key
                  )
                }
                className={`flex items-center gap-1.5 font-medium transition-colors ${statusFilter ===
                  tab.key
                  ? "text-[#2c0eee]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}

                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter ===
                    tab.key
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

        {/* ====================================================
            TABLE
        ==================================================== */}

        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="No categories found"
        />

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">

          <p className="text-xs text-gray-400">
            Showing{" "}
            {filteredData.length === 0
              ? 0
              : (page - 1) *
              limit +
              1}
            {"–"}
            {Math.min(
              page * limit,
              filteredData.length
            )}{" "}
            of {filteredData.length}{" "}
            categories
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

      {/* ======================================================
          CONFIRM DELETE
      ====================================================== */}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() =>
          setDeleteId(null)
        }
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Category"
        message="Delete this category? Associated function roles may be affected."
      />
    </div>
  );
};

export default FunctionRoleCategory;