import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import userService from '../../services/user.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// A record only counts as "updated" if updatedAt is meaningfully later
// than createdAt. Most backends set updatedAt = createdAt on insert, so
// without this check the view page falsely shows an "Updated At" value.
const wasActuallyUpdated = (createdAt, updatedAt) => {
  if (!createdAt || !updatedAt) return false;
  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(created) || Number.isNaN(updated)) return false;
  return updated - created > 2000; // 2s tolerance for insert-time drift
};

const ViewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Fetch a single role's name by its ID.
  // Tries a direct /role/:id endpoint first, falls back to fetching the
  // full role list and matching client-side.
  const fetchRoleName = async (roleId) => {
    if (!roleId) return "No Role";

    try {
      const res = await axios.get(`${API_BASE}/role/${roleId}`);
      const role = res.data?.data || res.data;
      if (role?.role_name || role?.name) {
        return role.role_name || role.name;
      }
    } catch (err) {
      // Single-role endpoint may not exist or may 404 — fall back below.
    }

    try {
      const res = await axios.get(`${API_BASE}/role`);
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      const numericId = typeof roleId === 'string' ? parseInt(roleId, 10) : roleId;
      const match = list.find((r) => {
        const rId = typeof r.id === 'string' ? parseInt(r.id, 10) : r.id;
        return rId === numericId;
      });

      return match?.role_name || match?.name || `Role ${roleId}`;
    } catch (err) {
      return `Role ${roleId}`;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await userService.getById(id);
        const result = response?.data || response;
        const data = result?.data || result;

        if (data && data.id) {
          const roleName = await fetchRoleName(data.role_id);

          // Only show updatedAt if the record was genuinely edited
          const updated = wasActuallyUpdated(data.createdAt, data.updatedAt)
            ? data.updatedAt
            : null;

          const formData = {
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || null,
            image: data.image || null,
            role_name: roleName,
            role_id: data.role_id,
            status: data.status || "inactive",
            created_at: data.createdAt || null,
            updated_at: updated,
            reset_token: data.reset_token ? "Set" : "Not Set",
            otp: data.otp ? "Set" : "Not Set",
          };

          setInitialData(formData);
          setViewData(data);
        } else {
          showError("User not found");
          navigate('/users');
        }
      } catch (error) {
        showError(error.message || "Failed to load user data");
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      readonly: true,
      viewRender: (value) => (
        <span className="font-medium text-gray-800">{value}</span>
      ),
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      readonly: true,
      viewRender: (value) => (
        <span className="text-gray-600">{value}</span>
      ),
    },
    {
      name: "mobile",
      label: "Mobile",
      type: "text",
      readonly: true,
      viewRender: (value) => value || "—",
    },
    {
      name: "image",
      label: "Profile Image",
      type: "file",
      readonly: true,
      viewRender: (value) => {
        if (!value) return <span className="text-gray-400">No image</span>;
        const fullUrl = getImageUrl(value);
        return (
          <div className="relative group inline-block">
            <img
              src={fullUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <button
              onClick={() => window.open(fullUrl, '_blank')}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white"
              title="Click to view image"
            >
              <span className="text-xs">View</span>
            </button>
          </div>
        );
      },
    },
    {
      name: "role_name",
      label: "Role",
      type: "text",
      readonly: true,
      viewRender: (value) => (
        <span className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {value || "User"}
        </span>
      ),
    },
    // {
    //   name: "status",
    //   label: "Status",
    //   type: "text",
    //   readonly: true,
    //   viewRender: (value) => (
    //     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
    //       value === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
    //     }`}>
    //       <span className={`w-1.5 h-1.5 rounded-full ${value === "active" ? "bg-green-500" : "bg-gray-400"}`} />
    //       {value === "active" ? "Active" : "Inactive"}
    //     </span>
    //   ),
    // },
    {
      name: "created_at",
      label: "Created At",
      type: "text",
      readonly: true,
      viewRender: (value) => value ? formatDate(value) : "—",
    },
    {
      name: "updated_at",
      label: "Updated At",
      type: "text",
      readonly: true,
      // updated_at is already null unless it was a genuine edit
      viewRender: (value) => value ? formatDate(value) : "—",
    },
    // {
    //   name: "reset_token",
    //   label: "Reset Token",
    //   type: "text",
    //   readonly: true,
    //   viewRender: (value) => (
    //     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
    //       value === "Set" ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-500"
    //     }`}>
    //       <span className={`w-1.5 h-1.5 rounded-full ${value === "Set" ? "bg-yellow-500" : "bg-gray-400"}`} />
    //       {value}
    //     </span>
    //   ),
    // },
    // {
    //   name: "otp",
    //   label: "OTP",
    //   type: "text",
    //   readonly: true,
    //   viewRender: (value) => (
    //     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
    //       value === "Set" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"
    //     }`}>
    //       <span className={`w-1.5 h-1.5 rounded-full ${value === "Set" ? "bg-blue-500" : "bg-gray-400"}`} />
    //       {value}
    //     </span>
    //   ),
    // },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <FormPage
      title="User Details"
      mode="view"
      fields={fields}
      initialData={initialData}
      onSubmit={() => {}}
      onEdit={handleEdit}
      navigateTo="/users"
      breadcrumb={`Viewing: ${viewData?.name || 'User'}`}
      enableEditMode={true}
      showEdit={true}
      editLabel="Edit User"
      cancelLabel="Back to Users"
    />
  );
};

export default ViewUser;