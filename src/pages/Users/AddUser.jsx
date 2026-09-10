import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { showSuccess, showError, showInfo } from '../../utils/toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const getToken = () => localStorage.getItem('token');

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
        showError("Failed to load roles");
      } finally {
        setLoadingRoles(false);
      }
    };
    loadRoles();
  }, []);

  // Form fields configuration - with custom password field
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
        required: true,
        placeholder: "9876543210",
        help: "Enter the user's mobile number",
      },
      {
        name: "password",
        label: "Password",
        type: "custom",
        required: true,
        placeholder: "Enter password",
        help: "Enter a strong password",
        render: (field, value, onChange) => (
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name={field.name}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                onChange(e);
              }}
              placeholder={field.placeholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12"
              required={field.required}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        )
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
        placeholder: "Click or drag to upload image"
      },
    ];
  };

  // Validation rules - Only required validations
  const validationRules = {
    name: {
      required: true,
      requiredMessage: "Name is required",
    },
    email: {
      required: true,
      requiredMessage: "Email is required",
    },
    mobile: {
      required: true,
      requiredMessage: "Mobile number is required",
    },
    password: {
      required: true,
      requiredMessage: "Password is required",
      customValidation: (value) => {
        if (!value || value.length < 1) {
          return "Password is required";
        }
        return null;
      }
    },
    role_id: {
      required: true,
      requiredMessage: "Please select a role",
    },
  };

  const initialData = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    role_id: "",
    image: null,
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const token = getToken();
      console.log('Submitting form data:', formData);

      // Build payload for /user/register endpoint
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile?.trim() || "",
        password: formData.password || password,
        role_id: parseInt(formData.role_id),
        image: null,
      };

      console.log('Sending payload to /user/register:', payload);

      const response = await fetch(`${API_BASE}/user/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ User registered successfully:', result);
        showSuccess(result.message || "User created successfully");
        navigate('/users');
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        showError(errorData.message || "Failed to create user");
      }

    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <FormPage
      title="Add User"
      mode="add"
      fields={getFormFields()}
      initialData={initialData}
      validationRules={validationRules}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Create User"
      navigateTo="/users"
      breadcrumb="Create a new user account"
    />
  );
};

export default AddUser;