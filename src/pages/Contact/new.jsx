

// pages/Contact/ContactList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    MdSearch,
    MdVisibility,
    MdEdit,
    MdDelete,
    MdRefresh,
    MdPersonAdd,
    MdCheck,
    MdClose,
    MdArrowDropDown,
    MdCheckCircle,
} from "react-icons/md";
import { createPortal } from "react-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { contactService } from "../../services/contact.service";
import userService from "../../services/user.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";

const ContactList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [statusFilter, setStatusFilter] = useState("all");
    const [totalItems, setTotalItems] = useState(0);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    // const dropdownRefs = useRef({});
    const dropdownRefs = useRef({});

    const navigateToView = (id) => navigate(`/contact/view/${id}`);
    const navigateToEdit = (id) => navigate(`/contact/edit/${id}`);

    // Status badge colors
    const statusColors = {
        new: "bg-blue-50 text-blue-700 border-blue-200",
        in_progress: "bg-yellow-50 text-yellow-700 border-yellow-200",
        resolved: "bg-green-50 text-green-700 border-green-200",
        closed: "bg-gray-50 text-gray-700 border-gray-200",
    };

    // Priority badge colors
    const priorityColors = {
        low: "bg-gray-50 text-gray-600 border-gray-200",
        medium: "bg-blue-50 text-blue-600 border-blue-200",
        high: "bg-orange-50 text-orange-600 border-orange-200",
        urgent: "bg-red-50 text-red-600 border-red-200",
    };

    // Load users for assignment
    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await userService.getAll({ limit: 100 });
            let userList = [];
            if (response?.data?.data) {
                userList = response.data.data;
            } else if (response?.data) {
                userList = response.data;
            } else if (Array.isArray(response)) {
                userList = response;
            }
            setUsers(Array.isArray(userList) ? userList : []);
        } catch (error) {
            console.error('Load users error:', error);
            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                search: search || undefined,
                status: statusFilter !== "all" ? statusFilter : undefined,
            };

            const response = await contactService.getAll(params);
            const contacts = response.data || [];
            setData(contacts);
            setTotalItems(response.pagination?.total || 0);
        } catch (error) {
            console.error("Load error:", error);
            showError(error.message || "Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        loadUsers();
    }, [page, limit, statusFilter]);

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) {
                loadData();
            } else {
                setPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen === null) return;

            const wrapper = dropdownRefs.current[dropdownOpen];

            // Don't close when clicking the trigger button
            if (wrapper?.contains(event.target)) {
                return;
            }

            // Don't close when clicking inside the portal dropdown
            if (event.target.closest(".assignment-dropdown-portal")) {
                return;
            }

            setDropdownOpen(null);
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await contactService.delete(deleteId);
            showSuccess("Contact deleted successfully");
            loadData();
        } catch (error) {
            console.error("Delete error:", error);
            showError(error.message || "Failed to delete contact");
        } finally {
            setDeleteId(null);
            setDeleteLoading(false);
        }
    };

    const getId = (value) => {
        if (value === null || value === undefined) return null;
        return String(value);
    };

    const getUserById = (userId) => {
        if (!userId) return null;

        const normalizedId = getId(userId);

        return users.find(
            (user) =>
                getId(user.id) === normalizedId ||
                getId(user._id) === normalizedId
        );
    };

    

    const getUserColor = (userId) => {
        const colors = [
            "#4F46E5",
            "#059669",
            "#D97706",
            "#7C3AED",
            "#DC2626",
            "#2563EB",
            "#D946EF",
        ];

        if (!userId) return colors[0];

        const stringId = String(userId);

        let hash = 0;

        for (let i = 0; i < stringId.length; i++) {
            hash = stringId.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    // Handle task assignment

    // const handleAssignTask = async (contactId, userId) => {
    //     try {
    //         await contactService.assign(contactId, userId);

    //         const user = users.find(
    //             (u) => u.id === userId || u._id === userId
    //         );

    //         const userName =
    //             user?.name ||
    //             user?.username ||
    //             `Admin ${userId}`;

    //         showSuccess(
    //             `Task assigned to ${userName} successfully`
    //         );

    //         setDropdownOpen(null);
    //         loadData();
    //     } catch (error) {
    //         console.error("Assign error:", error);

    //         showError(
    //             error.message || "Failed to assign task"
    //         );
    //     }
    // };

    const handleAssignTask = async (contactId, userId) => {
        try {
            // Keep the exact API call that is already working
            await contactService.assign(contactId, userId);

            const user = getUserById(userId);

            const userName =
                user?.name ||
                user?.username ||
                user?.email ||
                `Admin ${userId}`;

            // Immediately update assigned_to in table
            setData((prevData) =>
                prevData.map((contact) =>
                    String(contact.id) === String(contactId)
                        ? {
                            ...contact,
                            assigned_to: userId,
                        }
                        : contact
                )
            );

            setDropdownOpen(null);

            showSuccess(
                `Task assigned to ${userName} successfully`
            );

            // Optional server refresh
            await loadData();

        } catch (error) {
            console.error("Assign error:", error);

            showError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to assign task"
            );
        }
    };

    // const handleUnassignTask = async (contactId) => {
    //     try {
    //         await contactService.assign(contactId, null);

    //         showSuccess("Task unassigned successfully");

    //         setDropdownOpen(null);
    //         loadData();
    //     } catch (error) {
    //         console.error("Unassign error:", error);

    //         showError(
    //             error.message || "Failed to assign task"
    //         );
    //     }
    // };


    const handleUnassignTask = async (contactId) => {
        try {
            await contactService.assign(contactId, null);

            // Immediately update UI
            setData((prevData) =>
                prevData.map((contact) =>
                    String(contact.id) === String(contactId)
                        ? {
                            ...contact,
                            assigned_to: null,
                        }
                        : contact
                )
            );

            setDropdownOpen(null);

            showSuccess("Task unassigned successfully");

            await loadData();

        } catch (error) {
            console.error("Unassign error:", error);

            showError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to unassign task"
            );
        }
    };

    const getStatusCounts = () => {
        const counts = { all: data.length };
        data.forEach(item => {
            counts[item.status] = (counts[item.status] || 0) + 1;
        });
        return counts;
    };

    const statusCounts = getStatusCounts();

    // Get user name by ID
    const getUserName = (userId) => {
        if (!userId) return 'Unassigned';
        const user = users.find(u => u.id === userId || u._id === userId);
        return user?.name || user?.username || user?.email || `Admin ${userId}`;
    };

    // Get user initials for avatar
    const getUserInitials = (userId) => {
        if (!userId) return '?';
        const user = users.find(u => u.id === userId || u._id === userId);
        if (!user) return '?';
        const name = user.name || user.username || 'User';
        return name.charAt(0).toUpperCase();
    };



    // Assignment Dropdown Component with Portal
    // const AssignmentDropdown = ({ contactId, currentAssignedTo, onAssign, onUnassign }) => {
    //     const isOpen = dropdownOpen === contactId;
    //     const wrapperRef = useRef(null);
    //     const buttonRef = useRef(null);
    //     const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    //     useEffect(() => {
    //         dropdownRefs.current[contactId] = wrapperRef.current;
    //     }, [contactId]);

    //     const updateDropdownPosition = () => {
    //         if (!buttonRef.current) return;
    //         const rect = buttonRef.current.getBoundingClientRect();
    //         setDropdownPosition({
    //             top: rect.bottom + window.scrollY + 4,
    //             left: rect.left + window.scrollX,
    //         });
    //     };

    //     useEffect(() => {
    //         if (!isOpen) return;

    //         // Update position when dropdown opens
    //         setTimeout(updateDropdownPosition, 10);

    //         // Update on scroll and resize
    //         const handleUpdate = () => updateDropdownPosition();
    //         window.addEventListener('resize', handleUpdate);
    //         window.addEventListener('scroll', handleUpdate, true);

    //         return () => {
    //             window.removeEventListener('resize', handleUpdate);
    //             window.removeEventListener('scroll', handleUpdate, true);
    //         };
    //     }, [isOpen]);

    //     const currentUser = users.find(
    //         (u) => String(u.id) === String(currentAssignedTo) ||
    //             String(u._id) === String(currentAssignedTo)
    //     );

    //     if (loadingUsers) {
    //         return (
    //             <div className="flex items-center gap-2">
    //                 <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
    //                 <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
    //             </div>
    //         );
    //     }

    //     return (
    //         <div ref={wrapperRef} className="relative inline-block">
    //             <button
    //                 ref={buttonRef}
    //                 type="button"
    //                 onClick={() => {
    //                     if (!isOpen) {
    //                         setTimeout(updateDropdownPosition, 0);
    //                     }
    //                     setDropdownOpen(isOpen ? null : contactId);
    //                 }}
    //                 className={`
    //         flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap
    //         ${currentAssignedTo
    //                         ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
    //                         : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
    //                     }
    //         ${isOpen ? "ring-2 ring-purple-300 ring-offset-2" : ""}
    //         group
    //       `}
    //             >
    //                 {currentAssignedTo ? (
    //                     <>
    //                         <div
    //                             className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
    //                             style={{ backgroundColor: getUserColor(currentAssignedTo) }}
    //                         >
    //                             {getUserInitials(currentAssignedTo)}
    //                         </div>
    //                         <span className="text-sm font-medium truncate max-w-[80px]">
    //                             {currentUser?.name || currentUser?.username || "Admin"}
    //                         </span>
    //                         <MdCheckCircle className="text-green-500 flex-shrink-0" size={14} />
    //                     </>
    //                 ) : (
    //                     <>
    //                         <MdPersonAdd className="text-gray-400 group-hover:text-purple-500 transition-colors" size={16} />
    //                         <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
    //                             Assign
    //                         </span>
    //                     </>
    //                 )}
    //                 <MdArrowDropDown
    //                     className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    //                     size={18}
    //                 />
    //             </button>

    //             {isOpen &&
    //                 createPortal(
    //                     <div
    //                         className="fixed w-64 bg-white rounded-xl border border-gray-200 shadow-2xl z-[99999] overflow-hidden animate-dropdown"
    //                         style={{
    //                             top: dropdownPosition.top,
    //                             left: dropdownPosition.left,
    //                             minWidth: '200px',
    //                         }}
    //                     >
    //                         {/* Header */}
    //                         <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
    //                             <div className="flex items-center gap-2">
    //                                 <MdPersonAdd className="text-purple-600" size={18} />
    //                                 <span className="text-sm font-semibold text-gray-700">Assign Task</span>
    //                                 <span className="text-xs text-gray-400 ml-auto">
    //                                     {users.length} users
    //                                 </span>
    //                             </div>
    //                         </div>

    //                         {/* Users List */}
    //                         <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
    //                             {users.length === 0 ? (
    //                                 <div className="px-4 py-3 text-sm text-gray-400 text-center">
    //                                     No users available
    //                                 </div>
    //                             ) : (
    //                                 users.map((user) => {
    //                                     const userId = user.id || user._id;
    //                                     const isSelected =
    //                                         String(currentAssignedTo) === String(user.id) ||
    //                                         String(currentAssignedTo) === String(user._id);

    //                                     return (
    //                                         <button
    //                                             key={userId}
    //                                             type="button"
    //                                             onClick={() => onAssign(contactId, userId)}
    //                                             className={`
    //                       w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left
    //                       ${isSelected ? "bg-purple-50" : ""}
    //                       group
    //                     `}
    //                                         >
    //                                             <div
    //                                                 className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 transition-transform group-hover:scale-105"
    //                                                 style={{ backgroundColor: getUserColor(userId) }}
    //                                             >
    //                                                 {getUserInitials(userId)}
    //                                             </div>
    //                                             <div className="flex-1 min-w-0">
    //                                                 <div className="text-sm font-medium text-gray-700 truncate">
    //                                                     {user.name || user.username || user.email || `User ${userId}`}
    //                                                 </div>
    //                                                 {user.email && (
    //                                                     <div className="text-xs text-gray-400 truncate">{user.email}</div>
    //                                                 )}
    //                                             </div>
    //                                             {isSelected && (
    //                                                 <MdCheck className="text-purple-600 flex-shrink-0" size={18} />
    //                                             )}
    //                                         </button>
    //                                     );
    //                                 })
    //                             )}
    //                         </div>

    //                         {/* Footer */}
    //                         <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2">
    //                             {currentAssignedTo ? (
    //                                 <button
    //                                     type="button"
    //                                     onClick={() => onUnassign(contactId)}
    //                                     className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 py-1.5 rounded-lg transition-colors"
    //                                 >
    //                                     <MdClose size={16} />
    //                                     <span>Remove Assignment</span>
    //                                 </button>
    //                             ) : (
    //                                 <div className="text-xs text-gray-400 text-center py-1">
    //                                     Select a user to assign this task
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </div>,
    //                     document.body
    //                 )}
    //         </div>
    //     );
    // };

    const AssignmentDropdown = ({
        contactId,
        currentAssignedTo,
        onAssign,
        onUnassign,
    }) => {
        const isOpen = dropdownOpen === contactId;

        const wrapperRef = useRef(null);
        const buttonRef = useRef(null);

        const [dropdownPosition, setDropdownPosition] = useState({
            top: 0,
            left: 0,
        });

        useEffect(() => {
            dropdownRefs.current[contactId] = wrapperRef.current;

            return () => {
                delete dropdownRefs.current[contactId];
            };
        }, [contactId]);

        const updateDropdownPosition = () => {
            if (!buttonRef.current) return;

            const rect = buttonRef.current.getBoundingClientRect();

            const dropdownWidth = 256;

            let left = rect.left;

            // Prevent dropdown from going outside right side
            if (left + dropdownWidth > window.innerWidth - 10) {
                left = window.innerWidth - dropdownWidth - 10;
            }

            // Prevent dropdown from going outside left side
            if (left < 10) {
                left = 10;
            }

            setDropdownPosition({
                top: rect.bottom + 6,
                left,
            });
        };

        useEffect(() => {
            if (!isOpen) return;

            updateDropdownPosition();

            const handlePositionUpdate = () => {
                updateDropdownPosition();
            };

            window.addEventListener("resize", handlePositionUpdate);
            window.addEventListener(
                "scroll",
                handlePositionUpdate,
                true
            );

            return () => {
                window.removeEventListener(
                    "resize",
                    handlePositionUpdate
                );

                window.removeEventListener(
                    "scroll",
                    handlePositionUpdate,
                    true
                );
            };
        }, [isOpen]);

        const currentUser = getUserById(currentAssignedTo);

        if (loadingUsers) {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
            );
        }

        return (
            <div
                ref={wrapperRef}
                className="relative inline-block"
            >
                {/* Assignment Button */}
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => {
                        setDropdownOpen(
                            isOpen ? null : contactId
                        );
                    }}
                    className={`
                    flex items-center gap-2
                    px-3 py-1.5
                    rounded-lg
                    transition-all duration-200
                    whitespace-nowrap
                    ${currentAssignedTo
                            ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                        }
                    ${isOpen
                            ? "ring-2 ring-purple-300 ring-offset-2"
                            : ""
                        }
                `}
                >
                    {currentAssignedTo ? (
                        <>
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                                style={{
                                    backgroundColor:
                                        getUserColor(
                                            currentAssignedTo
                                        ),
                                }}
                            >
                                {getUserInitials(
                                    currentAssignedTo
                                )}
                            </div>

                            <span className="text-sm font-medium truncate max-w-[80px]">
                                {currentUser?.name ||
                                    currentUser?.username ||
                                    currentUser?.email ||
                                    "Admin"}
                            </span>

                            <MdCheckCircle
                                className="text-green-500 flex-shrink-0"
                                size={14}
                            />
                        </>
                    ) : (
                        <>
                            <MdPersonAdd
                                className="text-gray-400 group-hover:text-purple-500"
                                size={16}
                            />

                            <span className="text-sm text-gray-500">
                                Assign
                            </span>
                        </>
                    )}

                    <MdArrowDropDown
                        className={`
                        transition-transform duration-200
                        ${isOpen ? "rotate-180" : ""}
                    `}
                        size={18}
                    />
                </button>

                {/* Portal Dropdown */}
                {isOpen &&
                    createPortal(
                        <div
                            className="
                            assignment-dropdown-portal
                            fixed
                            w-64
                            bg-white
                            rounded-xl
                            border border-gray-200
                            shadow-2xl
                            z-[99999]
                            overflow-hidden
                        "
                            style={{
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                            }}
                        >
                            {/* Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <MdPersonAdd
                                        className="text-purple-600"
                                        size={18}
                                    />

                                    <span className="text-sm font-semibold text-gray-700">
                                        Assign Task
                                    </span>

                                    <span className="text-xs text-gray-400 ml-auto">
                                        {users.length} users
                                    </span>
                                </div>
                            </div>

                            {/* Users */}
                            <div className="max-h-60 overflow-y-auto py-1">
                                {users.length === 0 ? (
                                    <div className="px-4 py-4 text-sm text-gray-400 text-center">
                                        No users available
                                    </div>
                                ) : (
                                    users.map((user) => {
                                        const userId =
                                            user.id ??
                                            user._id;

                                        const selected =
                                            getId(
                                                currentAssignedTo
                                            ) ===
                                            getId(userId);

                                        return (
                                            <button
                                                key={String(userId)}
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    onAssign(
                                                        contactId,
                                                        userId
                                                    );
                                                }}
                                                className={`
                                                w-full
                                                px-4 py-2.5
                                                flex items-center
                                                gap-3
                                                text-left
                                                hover:bg-gray-50
                                                transition-colors
                                                ${selected
                                                        ? "bg-purple-50"
                                                        : ""
                                                    }
                                            `}
                                            >
                                                <div
                                                    className="
                                                    w-8 h-8
                                                    rounded-full
                                                    flex items-center
                                                    justify-center
                                                    text-white
                                                    text-sm
                                                    font-medium
                                                    flex-shrink-0
                                                "
                                                    style={{
                                                        backgroundColor:
                                                            getUserColor(
                                                                userId
                                                            ),
                                                    }}
                                                >
                                                    {getUserInitials(
                                                        userId
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-700 truncate">
                                                        {user.name ||
                                                            user.username ||
                                                            user.email ||
                                                            `User ${userId}`}
                                                    </div>

                                                    {user.email && (
                                                        <div className="text-xs text-gray-400 truncate">
                                                            {user.email}
                                                        </div>
                                                    )}
                                                </div>

                                                {selected && (
                                                    <MdCheck
                                                        className="text-purple-600 flex-shrink-0"
                                                        size={18}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2">
                                {currentAssignedTo ? (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            onUnassign(
                                                contactId
                                            );
                                        }}
                                        className="
                                        w-full
                                        flex items-center
                                        justify-center
                                        gap-2
                                        text-sm
                                        text-red-600
                                        hover:text-red-700
                                        hover:bg-red-50
                                        py-1.5
                                        rounded-lg
                                        transition-colors
                                    "
                                    >
                                        <MdClose size={16} />
                                        Remove Assignment
                                    </button>
                                ) : (
                                    <div className="text-xs text-gray-400 text-center py-1">
                                        Select a user to assign this task
                                    </div>
                                )}
                            </div>
                        </div>,
                        document.body
                    )}
            </div>
        );
    };


    const columns = [
        {
            header: "#",
            key: "id",
            render: (_, __, i) => (page - 1) * limit + i + 1,
            width: "w-12",
            minWidth: "40px",
        },
        {
            header: "Name",
            key: "name",
            render: (v, row) => (
                <div>
                    <div className="font-medium text-gray-800">{v}</div>
                    <div className="text-xs text-gray-400">{row.email}</div>
                </div>
            ),
            minWidth: "150px",
        },
        {
            header: "Contact",
            key: "mobile",
            render: (v, row) => (
                <div>
                    <div className="text-sm text-gray-600">{v}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[120px]">{row.subject}</div>
                </div>
            ),
            minWidth: "150px",
        },
        {
            header: "Status",
            key: "status",
            render: (v) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[v] || statusColors.new}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${v === 'new' ? 'bg-blue-500' : v === 'in_progress' ? 'bg-yellow-500' : v === 'resolved' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    {v?.replace('_', ' ') || 'New'}
                </span>
            ),
            width: "w-28",
        },
        {
            header: "Priority",
            key: "priority",
            render: (v) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColors[v] || priorityColors.medium}`}>
                    {v || 'Medium'}
                </span>
            ),
            width: "w-24",
        },
        {
            header: "Assigned To",
            key: "assigned_to",
            render: (v, row) => (
                <AssignmentDropdown
                    contactId={row.id}
                    currentAssignedTo={v}
                    onAssign={handleAssignTask}
                    onUnassign={handleUnassignTask}
                />
            ),
            width: "w-44",
            minWidth: "140px",
        },
        {
            header: "Created",
            key: "created_at",
            render: (v) => (
                <span className="text-xs text-gray-500">{formatDate(v)}</span>
            ),
            width: "w-32",
        },
        {
            header: "Actions",
            key: "id",
            render: (id) => (
                <div className="flex gap-1">
                    <button
                        onClick={() => navigateToView(id)}
                        className="p-1.5 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                        title="View"
                    >
                        <MdVisibility size={16} />
                    </button>
                    <button
                        onClick={() => navigateToEdit(id)}
                        className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <MdEdit size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(id)}
                        className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <MdDelete size={16} />
                    </button>
                </div>
            ),
            width: "w-28",
            minWidth: "100px",
        },
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage user inquiries and support tickets</p>
                </div>
                <Button
                    variant="secondary"
                    icon={MdRefresh}
                    onClick={loadData}
                    loading={loading}
                >
                    Refresh
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="relative w-full lg:w-80">
                        <MdSearch
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, subject..."
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-colors"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-3 text-sm">
                            {["all", "new", "in_progress", "resolved", "closed"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`flex items-center gap-1 font-medium transition-colors ${statusFilter === status
                                        ? "text-purple-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {status === "all" ? "All" : status.replace("_", " ")}
                                    <span
                                        className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === status
                                            ? "bg-purple-50 text-purple-600"
                                            : "bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        {statusCounts[status] || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    emptyMessage="No contacts found"
                    maxHeight="400px"
                    showScroll={true}
                />

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-xs text-gray-400">
                        Showing {data.length === 0 ? 0 : (page - 1) * limit + 1}
                        {"–"}
                        {Math.min(page * limit, totalItems)} of {totalItems} contacts
                    </p>
                    <Pagination
                        page={page}
                        total={totalItems}
                        limit={limit}
                        onChange={setPage}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title="Delete Contact"
                message="Delete this contact inquiry? This action cannot be undone."
            />
        </div>
    );
};

export default ContactList;