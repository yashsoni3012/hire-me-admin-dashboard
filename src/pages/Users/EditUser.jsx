import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { showSuccess, showError } from '../../utils/toast';

// Use the correct API base URL
const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Get full image URL helper
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Helper: read a fetch Response body safely, whether it's JSON or plain text.
  // Returns { raw, json } so callers can inspect whichever is useful.
  const readResponseBody = async (response) => {
    const raw = await response.text();
    let json = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch (e) {
      // Not JSON — that's fine, caller falls back to raw text.
    }
    return { raw, json };
  };

  // Load roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE}/role`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const result = await response.json();
        const roleData = result.data || result || [];
        setRoles(Array.isArray(roleData) ? roleData : []);
      } catch (err) {
        console.error("Load roles error:", err);
      } finally {
        setLoadingRoles(false);
      }
    };
    loadRoles();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setFetchLoading(true);
      try {
        const token = getToken();

        const response = await fetch(`${API_BASE}/user/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error(`HTTP error ${response.status}`);
        }

        const result = await response.json();
        const data = result.data || result;

        if (data && data.id) {
          const formData = {
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            role_id: data.role_id || "",
            image: data.image || null,
          };
          setInitialData(formData);
          setEditItem(data);
        } else {
          console.error('No data or missing ID:', data);
          showError("User not found");
          navigate('/users');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || "Failed to load user data");
        navigate('/users');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate]);

  // Form fields configuration
  const getFormFields = () => {
    const roleOptions = roles.map(role => ({
      value: role.id,
      label: role.role_name || role.name || `Role ${role.id}`
    }));

    return [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "John Doe",
        help: "Enter the user's full name",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "john@example.com",
        help: "Enter the user's email address",
      },
      {
        name: "mobile",
        label: "Mobile",
        type: "text",
        required: false,
        placeholder: "9876543210",
        help: "Enter the user's mobile number",
      },
      {
        name: "role_id",
        label: "Role",
        type: "select",
        required: true,
        options: roleOptions,
        placeholder: "Select Role",
        help: "Select the user's role",
      },
      {
        name: "image",
        label: "Profile Image",
        type: "file",
        required: false,
        accept: "image/*",
        maxSize: 5,
        help: "Upload a profile image (PNG, JPG) - Max 5MB",
        placeholder: "Click or drag to upload image",
        existingImage: editItem?.image ? getImageUrl(editItem.image) : null
      },
    ];
  };

  // Validation rules
  const validationRules = {
    name: {
      required: true,
      requiredMessage: "Name is required",
      minLength: 2,
      minLengthMessage: "Name must be at least 2 characters",
      maxLength: 100,
      maxLengthMessage: "Name must be at most 100 characters",
    },
    email: {
      required: true,
      requiredMessage: "Email is required",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: "Please enter a valid email address",
    },
    role_id: {
      required: true,
      requiredMessage: "Please select a role",
    },
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const token = getToken();

      // Validate role_id parses to a real number before sending —
      // catches a bad/empty select value early instead of round-tripping
      // to the server for a 500.
      const roleIdNum = parseInt(formData.role_id, 10);
      if (Number.isNaN(roleIdNum)) {
        showError("Please select a valid role");
        setLoading(false);
        return;
      }

      const formPayload = new FormData();
      formPayload.append("name", formData.name.trim());
      formPayload.append("email", formData.email.trim());
      formPayload.append("mobile", formData.mobile?.trim() || "");
      formPayload.append("role_id", String(roleIdNum));

      if (formData.imageFile instanceof File) {
        formPayload.append("image", formData.imageFile);
      }

      console.log('Submitting update for user ID:', id);
      console.log('Payload:', Object.fromEntries(formPayload));

      // NOTE: Do NOT set 'Content-Type' manually when sending FormData —
      // the browser sets it automatically with the correct multipart boundary.
      const response = await fetch(`${API_BASE}/user/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formPayload,
      });

      const { raw, json } = await readResponseBody(response);

      if (!response.ok) {
        // Log everything the server sent back so the real cause is visible —
        // this is what was missing before (error.response doesn't exist on
        // fetch errors, only on axios errors).
        console.error('Update failed. Status:', response.status);
        console.error('Update failed. Raw body:', raw);
        console.error('Update failed. Parsed body:', json);

        // Try to surface the most specific message the API gives us.
        // Many validation libs (Joi/Zod/express-validator) return an
        // `errors` array with per-field details — show those if present.
        let errorMessage = json?.message || json?.error || raw || `HTTP error ${response.status}`;
        if (Array.isArray(json?.errors) && json.errors.length > 0) {
          const details = json.errors
            .map((e) => e.message || e.msg || JSON.stringify(e))
            .join('; ');
          errorMessage = `${errorMessage}: ${details}`;
        }

        throw new Error(errorMessage);
      }

      console.log('Update response:', json);
      showSuccess("User updated successfully");
      navigate('/users');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const { raw, json } = await readResponseBody(response);
        console.error('Delete failed:', response.status, raw);
        throw new Error(json?.message || `HTTP error ${response.status}`);
      }

      showSuccess("User deleted successfully");
      navigate('/users');
    } catch (error) {
      console.error('Delete error:', error);
      showError(error.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (fetchLoading || loadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <FormPage
      title="Edit User"
      mode="edit"
      fields={getFormFields()}
      initialData={initialData}
      validationRules={validationRules}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      deleteLoading={deleteLoading}
      submitLabel="Update"
      navigateTo="/users"
      breadcrumb={`Editing: ${editItem?.name || 'User'}`}
      showEdit={false}
    />
  );
};

export default EditUser;