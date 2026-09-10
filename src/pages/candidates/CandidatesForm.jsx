// // pages/candidates/CandidatesForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import { ViewBadge } from '../../components/common/FormPageUtils';
// import candidateService from '../../services/candidate.service';
// import { showSuccess, showError } from '../../utils/toast';
// import { formatDate } from '../../utils/helpers';
// import { fetchUsers } from '../../utils/getUserName';

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const CandidatesForm = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { id } = useParams();
//     const [mode, setMode] = useState('add'); // 'add' | 'edit' | 'view'
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState(null);
//     const [userNameCache, setUserNameCache] = useState({});
//     const [pageLoading, setPageLoading] = useState(false);

//     // Determine mode from URL
//     useEffect(() => {
//         const path = location.pathname;
//         if (path.includes('/view/')) {
//             setMode('view');
//         } else if (path.includes('/edit/')) {
//             setMode('edit');
//         } else {
//             setMode('add');
//         }
//     }, [location.pathname]);

//     // Fetch users for display names
//     useEffect(() => {
//         const loadUsers = async () => {
//             try {
//                 const users = await fetchUsers();
//                 const userMap = {};
//                 Object.keys(users).forEach(id => {
//                     userMap[id] = users[id].name;
//                 });
//                 setUserNameCache(userMap);
//             } catch (error) {
//                 console.error('Failed to load users:', error);
//             }
//         };
//         loadUsers();
//     }, []);

//     // Fetch data for edit/view modes
//     useEffect(() => {
//         const fetchData = async () => {
//             if ((mode === 'edit' || mode === 'view') && id) {
//                 setPageLoading(true);
//                 try {
//                     let item = location.state?.item;

//                     if (!item) {
//                         const response = await candidateService.getById(id);
//                         item = response.data?.data || response.data;
//                     }

//                     // Normalize the data
//                     const normalizedData = {
//                         id: item.id || item._id,
//                         first_name: item.first_name || "",
//                         last_name: item.last_name || "",
//                         email: item.email || "",
//                         mobile: item.mobile || "",
//                         profile_photo: item.profile_photo || null,
//                         status: item.status || "inactive",
//                         last_login_at: item.last_login_at || null,
//                         created_by: item.created_by || null,
//                         updated_by: item.updated_by || null,
//                         created_at: item.createdAt || item.created_at || null,
//                         updated_at: item.updatedAt || item.updated_at || null,
//                     };

//                     setData(normalizedData);
//                 } catch (error) {
//                     console.error('Fetch error:', error);
//                     showError("Failed to load candidate data");
//                     navigate('/candidates');
//                 } finally {
//                     setPageLoading(false);
//                 }
//             }
//         };
//         fetchData();
//     }, [id, mode, location.state, navigate]);

//     // Get user name with caching
//     const getUserNameCached = (userId) => {
//         if (!userId) return "-";
//         return userNameCache[userId] || `User ${userId}`;
//     };

//     // Get full image URL
//     const getFullImageUrl = (value) => {
//         if (!value) return null;
//         if (value.startsWith("http") || value.startsWith("data:image")) {
//             return value;
//         }
//         if (value.startsWith("/uploads/")) {
//             return `${API_BASE_URL}${value}`;
//         }
//         if (value.startsWith("./uploads/")) {
//             return `${API_BASE_URL}${value.substring(1)}`;
//         }
//         if (value.startsWith("/")) {
//             return `${API_BASE_URL}${value}`;
//         }
//         return value;
//     };

//     // Get status value
//     const getStatusValue = (row) => {
//         if (row?.status) {
//             return row.status === "active";
//         }
//         return true;
//     };

//     // Define fields for the form
//     const getFields = () => {
//         return [
//             {
//                 name: "first_name",
//                 label: "First Name",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. John",
//                 help: "Enter the candidate's first name",
//                 viewRender: (value) => <span className="font-medium">{value}</span>
//             },
//             {
//                 name: "last_name",
//                 label: "Last Name",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. Doe",
//                 help: "Enter the candidate's last name",
//                 viewRender: (value) => <span className="font-medium">{value}</span>
//             },
//             {
//                 name: "email",
//                 label: "Email Address",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. john@example.com",
//                 help: "Enter the candidate's email address",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "mobile",
//                 label: "Mobile Number",
//                 type: "text",
//                 required: true,
//                 placeholder: "e.g. 9876543210",
//                 help: "Enter the candidate's mobile number",
//                 viewRender: (value) => value || '—'
//             },
//             {
//                 name: "profile_photo",
//                 label: "Profile Photo",
//                 type: "file",
//                 required: false,
//                 accept: "image/*",
//                 maxSize: 5,
//                 help: "Upload a profile photo (PNG, JPG) - Max 5MB",
//                 placeholder: "Click or drag to upload photo",
//                 viewRender: (value) => {
//                     if (!value) return '—';
//                     const url = getFullImageUrl(value);
//                     return (
//                         <div className="relative group">
//                             <img
//                                 src={url}
//                                 alt="Profile photo"
//                                 className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                                 onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.parentElement.innerHTML = '<span class="text-gray-400">Invalid image</span>';
//                                 }}
//                             />
//                             <button
//                                 onClick={() => window.open(url, '_blank')}
//                                 className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white"
//                             >
//                                 <span className="text-sm">View</span>
//                             </button>
//                         </div>
//                     );
//                 }
//             },
//             {
//                 name: "status",
//                 label: "Status",
//                 type: "radio",
//                 options: [
//                     { value: "active", label: "Active" },
//                     { value: "inactive", label: "Inactive" },
//                 ],
//                 color: "text-[#2c0eee] focus:ring-[#4529f7]",
//                 viewRender: (value) => <ViewBadge active={value === 'active'} />
//             },
//             {
//                 name: "last_login_at",
//                 label: "Last Login",
//                 type: "text",
//                 disabled: true,
//                 viewRender: (value) => value ? formatDate(value) : '—'
//             },
//             {
//                 name: "created_by",
//                 label: "Created By",
//                 type: "text",
//                 disabled: true,
//                 viewRender: (value) => getUserNameCached(value)
//             },
//             {
//                 name: "updated_by",
//                 label: "Updated By",
//                 type: "text",
//                 disabled: true,
//                 viewRender: (value) => getUserNameCached(value)
//             },
//             {
//                 name: "created_at",
//                 label: "Created At",
//                 type: "text",
//                 disabled: true,
//                 viewRender: (value) => formatDate(value)
//             },
//             {
//                 name: "updated_at",
//                 label: "Updated At",
//                 type: "text",
//                 disabled: true,
//                 viewRender: (value) => value ? formatDate(value) : '—'
//             }
//         ];
//     };

//     // Helper to get current user ID
//     const getCurrentUserId = () => {
//         try {
//             const user = JSON.parse(localStorage.getItem("user") || "{}");
//             if (user.id) return parseInt(user.id);
//             const userId = localStorage.getItem("userId");
//             if (userId) return parseInt(userId);
//         } catch (e) {
//             console.warn("Could not get user ID from localStorage, using default 1");
//         }
//         return 1;
//     };

//     // Validation rules
//     const getValidationRules = (existingData) => ({
//         first_name: {
//             required: true,
//             requiredMessage: 'First name is required',
//             minLength: 2,
//             minLengthMessage: 'First name must be at least 2 characters',
//             maxLength: 50,
//             maxLengthMessage: 'First name must be at most 50 characters'
//         },
//         last_name: {
//             required: true,
//             requiredMessage: 'Last name is required',
//             minLength: 2,
//             minLengthMessage: 'Last name must be at least 2 characters',
//             maxLength: 50,
//             maxLengthMessage: 'Last name must be at most 50 characters'
//         },
//         email: {
//             required: true,
//             requiredMessage: 'Email is required',
//             email: true,
//             emailMessage: 'Please enter a valid email address',
//             custom: (value) => {
//                 // Will check in submit handler
//                 return null;
//             }
//         },
//         mobile: {
//             required: true,
//             requiredMessage: 'Mobile number is required',
//             pattern: /^[0-9]{10}$/,
//             patternMessage: 'Please enter a valid 10-digit mobile number'
//         }
//     });

//     // Submit handler for add/edit
//     const handleSubmit = async (formData) => {
//         setLoading(true);

//         try {
//             const userId = getCurrentUserId();

//             // Build payload as FormData to support file upload
//             const payload = new FormData();
//             payload.append("first_name", formData.first_name.trim());
//             payload.append("last_name", formData.last_name.trim());
//             payload.append("email", formData.email.trim());
//             payload.append("mobile", formData.mobile.trim());
//             payload.append("status", formData.status);

//             if (formData.profile_photo instanceof File) {
//                 payload.append("profile_photo", formData.profile_photo);
//             }

//             // Check for duplicate email
//             const allData = await candidateService.getAll();
//             const existingItems = allData.data?.data?.data || allData.data?.results || allData.data || [];
//             const duplicate = existingItems.some(item =>
//                 (item.email || "").toLowerCase() === formData.email.toLowerCase() &&
//                 (mode === 'add' || item.id !== id)
//             );

//             if (duplicate) {
//                 showError('This email address is already registered');
//                 setLoading(false);
//                 return;
//             }

//             if (mode === 'edit') {
//                 payload.append("updated_by", userId);
//                 await candidateService.update(id, payload);
//                 showSuccess("Candidate updated successfully");
//             } else {
//                 payload.append("created_by", userId);
//                 await candidateService.create(payload);
//                 showSuccess("Candidate created successfully");
//             }

//             navigate('/candidates');
//         } catch (error) {
//             console.error('Submit error:', error);
//             const errorMessage = error?.response?.data?.message ||
//                 error?.message ||
//                 "Failed to save";
//             showError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete handler
//     const handleDelete = async () => {
//         try {
//             await candidateService.delete(id);
//             showSuccess("Candidate deleted successfully");
//             navigate('/candidates');
//         } catch (error) {
//             console.error('Delete error:', error);
//             showError(error?.response?.data?.message || error?.message || "Failed to delete");
//             throw error;
//         }
//     };

//     // Prepare initial data
//     const getInitialData = () => {
//         if (mode === 'add') {
//             return {
//                 first_name: "",
//                 last_name: "",
//                 email: "",
//                 mobile: "",
//                 profile_photo: null,
//                 status: "active"
//             };
//         }

//         if (data) {
//             return {
//                 first_name: data.first_name || "",
//                 last_name: data.last_name || "",
//                 email: data.email || "",
//                 mobile: data.mobile || "",
//                 profile_photo: data.profile_photo || null,
//                 status: data.status || "active",
//                 last_login_at: data.last_login_at || null,
//                 created_by: data.created_by,
//                 updated_by: data.updated_by,
//                 created_at: data.created_at,
//                 updated_at: data.updated_at,
//             };
//         }

//         return {
//             first_name: "",
//             last_name: "",
//             email: "",
//             mobile: "",
//             profile_photo: null,
//             status: "active"
//         };
//     };

//     // Get title based on mode
//     const getTitle = () => {
//         if (mode === 'view') return 'Candidate Details';
//         if (mode === 'edit') return 'Edit Candidate';
//         return 'Add New Candidate';
//     };

//     // Get submit label
//     const getSubmitLabel = () => {
//         if (mode === 'edit') return 'Update Candidate';
//         return 'Create Candidate';
//     };

//     // Handle loading state
//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-3 text-gray-500">Loading candidate data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // If view/edit mode and data not loaded, show error
//     if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">Candidate not found</p>
//                     <button
//                         onClick={() => navigate('/candidates')}
//                         className="mt-3 text-[#2c0eee] hover:underline"
//                     >
//                         Go back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <FormPage
//             title={getTitle()}
//             mode={mode}
//             fields={getFields()}
//             initialData={getInitialData()}
//             validationRules={getValidationRules(data)}
//             onSubmit={handleSubmit}
//             onDelete={handleDelete}
//             navigateTo="/candidates"
//             submitLabel={getSubmitLabel()}
//             editLabel="Edit Candidate"
//             deleteLabel="Delete Candidate"
//             loading={loading}
//             showDelete={mode !== 'add'}
//             showEdit={mode === 'view'}
//             enableEditMode={mode === 'view'}
//             breadcrumb={mode === 'view' ? 'Viewing candidate details' : mode === 'edit' ? 'Updating candidate' : 'Creating new candidate'}
//             onEdit={() => navigate(`/candidates/edit/${id}`, { state: { item: data } })}
//         />
//     );
// };

// export default CandidatesForm;

// pages/candidates/CandidatesForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import { ViewBadge } from '../../components/common/FormPageUtils';
import candidateService from '../../services/candidate.service';
import { showSuccess, showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

const API_BASE_URL = "https://apidata.hiremejobs.in";

const CandidatesForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [mode, setMode] = useState('add'); // 'add' | 'edit' | 'view'
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [userNameCache, setUserNameCache] = useState({});
    const [pageLoading, setPageLoading] = useState(false);

    // Determine mode from URL
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/view/')) {
            setMode('view');
        } else if (path.includes('/edit/')) {
            setMode('edit');
        } else {
            setMode('add');
        }
    }, [location.pathname]);

    // Fetch users for display names
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await fetchUsers();
                const userMap = {};
                Object.keys(users).forEach(id => {
                    userMap[id] = users[id].name;
                });
                setUserNameCache(userMap);
            } catch (error) {
                console.error('Failed to load users:', error);
            }
        };
        loadUsers();
    }, []);

    // Fetch data for edit/view modes
    useEffect(() => {
        const fetchData = async () => {
            if ((mode === 'edit' || mode === 'view') && id) {
                setPageLoading(true);
                try {
                    let item = location.state?.item;

                    if (!item) {
                        const response = await candidateService.getById(id);
                        item = response.data?.data || response.data;
                    }

                    // Normalize the data
                    const normalizedData = {
                        id: item.id || item._id,
                        first_name: item.first_name || "",
                        last_name: item.last_name || "",
                        email: item.email || "",
                        mobile: item.mobile || "",
                        profile_photo: item.profile_photo || null,
                        status: item.status || "inactive",
                        last_login_at: item.last_login_at || null,
                        created_by: item.created_by || null,
                        updated_by: item.updated_by || null,
                        created_at: item.createdAt || item.created_at || null,
                        updated_at: item.updatedAt || item.updated_at || null,
                    };

                    setData(normalizedData);
                } catch (error) {
                    console.error('Fetch error:', error);
                    showError("Failed to load candidate data");
                    navigate('/candidates');
                } finally {
                    setPageLoading(false);
                }
            }
        };
        fetchData();
    }, [id, mode, location.state, navigate]);

    // Get user name with caching
    const getUserNameCached = (userId) => {
        if (!userId) return "-";
        return userNameCache[userId] || `User ${userId}`;
    };

    // Get full image URL
    const getFullImageUrl = (value) => {
        if (!value) return null;
        if (value.startsWith("http") || value.startsWith("data:image")) {
            return value;
        }
        if (value.startsWith("/uploads/")) {
            return `${API_BASE_URL}${value}`;
        }
        if (value.startsWith("./uploads/")) {
            return `${API_BASE_URL}${value.substring(1)}`;
        }
        if (value.startsWith("/")) {
            return `${API_BASE_URL}${value}`;
        }
        return value;
    };

    // Get status value
    const getStatusValue = (row) => {
        if (row?.status) {
            return row.status === "active";
        }
        return true;
    };

    // Define fields for the form
    const getFields = () => {
        return [
            {
                name: "first_name",
                label: "First Name",
                type: "text",
                required: true,
                placeholder: "e.g. John",
                help: "Enter the candidate's first name",
                viewRender: (value) => <span className="font-medium">{value}</span>
            },
            {
                name: "last_name",
                label: "Last Name",
                type: "text",
                required: true,
                placeholder: "e.g. Doe",
                help: "Enter the candidate's last name",
                viewRender: (value) => <span className="font-medium">{value}</span>
            },
            {
                name: "email",
                label: "Email Address",
                type: "text",
                required: true,
                placeholder: "e.g. john@example.com",
                help: "Enter the candidate's email address",
                viewRender: (value) => value || '—'
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "text",
                required: true,
                placeholder: "e.g. 9876543210",
                help: "Enter the candidate's mobile number",
                viewRender: (value) => value || '—'
            },
            {
                name: "profile_photo",
                label: "Profile Photo",
                type: "file",
                required: false,
                accept: "image/*",
                maxSize: 5,
                help: "Upload a profile photo (PNG, JPG) - Max 5MB",
                placeholder: "Click or drag to upload photo",
                viewRender: (value) => {
                    if (!value) return '—';
                    const url = getFullImageUrl(value);
                    return (
                        <div className="relative group">
                            <img
                                src={url}
                                alt="Profile photo"
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<span class="text-gray-400">Invalid image</span>';
                                }}
                            />
                            <button
                                onClick={() => window.open(url, '_blank')}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white"
                            >
                                <span className="text-sm">View</span>
                            </button>
                        </div>
                    );
                }
            },
            {
                name: "status",
                label: "Status",
                type: "radio",
                options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                ],
                color: "text-[#2c0eee] focus:ring-[#4529f7]",
                viewRender: (value) => <ViewBadge active={value === 'active'} />
            },
            {
                name: "last_login_at",
                label: "Last Login",
                type: "text",
                disabled: true,
                viewRender: (value) => value ? formatDate(value) : '—'
            },
            {
                name: "created_by",
                label: "Created By",
                type: "text",
                disabled: true,
                viewRender: (value) => getUserNameCached(value)
            },
            {
                name: "updated_by",
                label: "Updated By",
                type: "text",
                disabled: true,
                viewRender: (value) => getUserNameCached(value)
            },
            {
                name: "created_at",
                label: "Created At",
                type: "text",
                disabled: true,
                viewRender: (value) => formatDate(value)
            },
            {
                name: "updated_at",
                label: "Updated At",
                type: "text",
                disabled: true,
                viewRender: (value) => value ? formatDate(value) : '—'
            }
        ];
    };

    // Helper to get current user ID
    const getCurrentUserId = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user.id) return parseInt(user.id);
            const userId = localStorage.getItem("userId");
            if (userId) return parseInt(userId);
        } catch (e) {
            console.warn("Could not get user ID from localStorage, using default 1");
        }
        return 1;
    };

    // Validation rules
    const getValidationRules = (existingData) => ({
        first_name: {
            required: true,
            requiredMessage: 'First name is required',
            minLength: 2,
            minLengthMessage: 'First name must be at least 2 characters',
            maxLength: 50,
            maxLengthMessage: 'First name must be at most 50 characters'
        },
        last_name: {
            required: true,
            requiredMessage: 'Last name is required',
            minLength: 2,
            minLengthMessage: 'Last name must be at least 2 characters',
            maxLength: 50,
            maxLengthMessage: 'Last name must be at most 50 characters'
        },
        email: {
            required: true,
            requiredMessage: 'Email is required',
            email: true,
            emailMessage: 'Please enter a valid email address',
            custom: (value) => {
                // Will check in submit handler
                return null;
            }
        },
        mobile: {
            required: true,
            requiredMessage: 'Mobile number is required',
            pattern: /^[0-9]{10}$/,
            patternMessage: 'Please enter a valid 10-digit mobile number'
        }
    });

    // Submit handler for add/edit
    const handleSubmit = async (formData) => {
        setLoading(true);

        try {
            const userId = getCurrentUserId();

            // Build payload as FormData to support file upload
            const payload = new FormData();
            payload.append("first_name", formData.first_name.trim());
            payload.append("last_name", formData.last_name.trim());
            payload.append("email", formData.email.trim());
            payload.append("mobile", formData.mobile.trim());
            payload.append("status", formData.status);

            if (formData.profile_photo instanceof File) {
                payload.append("profile_photo", formData.profile_photo);
            }

            // Check for duplicate email
            const allData = await candidateService.getAll();
            const existingItems = allData.data?.data?.data || allData.data?.results || allData.data || [];
            const duplicate = existingItems.some(item =>
                (item.email || "").toLowerCase() === formData.email.toLowerCase() &&
                (mode === 'add' || item.id !== id)
            );

            if (duplicate) {
                showError('This email address is already registered');
                setLoading(false);
                return;
            }

            if (mode === 'edit') {
                payload.append("updated_by", userId);
                await candidateService.update(id, payload);
                showSuccess("Candidate updated successfully");
            } else {
                payload.append("created_by", userId);
                await candidateService.create(payload);
                showSuccess("Candidate created successfully");
            }

            navigate('/candidates');
        } catch (error) {
            console.error('Submit error:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                "Failed to save";
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        try {
            await candidateService.delete(id);
            showSuccess("Candidate deleted successfully");
            navigate('/candidates');
        } catch (error) {
            console.error('Delete error:', error);
            showError(error?.response?.data?.message || error?.message || "Failed to delete");
            throw error;
        }
    };

    // Prepare initial data
    const getInitialData = () => {
        if (mode === 'add') {
            return {
                first_name: "",
                last_name: "",
                email: "",
                mobile: "",
                profile_photo: null,
                status: "active"
            };
        }

        if (data) {
            return {
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                email: data.email || "",
                mobile: data.mobile || "",
                profile_photo: data.profile_photo || null,
                status: data.status || "active",
                last_login_at: data.last_login_at || null,
                created_by: data.created_by,
                updated_by: data.updated_by,
                created_at: data.created_at,
                updated_at: data.updated_at,
            };
        }

        return {
            first_name: "",
            last_name: "",
            email: "",
            mobile: "",
            profile_photo: null,
            status: "active"
        };
    };

    // Get title based on mode
    const getTitle = () => {
        if (mode === 'view') return 'Candidate Details';
        if (mode === 'edit') return 'Edit Candidate';
        return 'Add New Candidate';
    };

    // Get submit label
    const getSubmitLabel = () => {
        if (mode === 'edit') return 'Update Candidate';
        return 'Create Candidate';
    };

    // Handle loading state
    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-gray-500">Loading candidate data...</p>
                </div>
            </div>
        );
    }

    // If view/edit mode and data not loaded, show error
    if ((mode === 'view' || mode === 'edit') && !data && !pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Candidate not found</p>
                    <button
                        onClick={() => navigate('/candidates')}
                        className="mt-3 text-[#2c0eee] hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <FormPage
            title={getTitle()}
            mode={mode}
            fields={getFields()}
            initialData={getInitialData()}
            validationRules={getValidationRules(data)}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            navigateTo="/candidates"
            submitLabel={getSubmitLabel()}
            editLabel="Edit Candidate"
            deleteLabel="Delete Candidate"
            loading={loading}
            showDelete={mode !== 'add'}
            showEdit={mode === 'view'}
            enableEditMode={mode === 'view'}
            breadcrumb={mode === 'view' ? 'Viewing candidate details' : mode === 'edit' ? 'Updating candidate' : 'Creating new candidate'}
            onEdit={() => navigate(`/candidates/edit/${id}`, { state: { item: data } })}
        />
    );
};

export default CandidatesForm;