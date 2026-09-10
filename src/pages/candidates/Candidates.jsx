// // import { useState, useEffect, useMemo } from "react";
// // import Table from "../../components/common/Table";
// // import Button from "../../components/common/Button";
// // import SearchBox from "../../components/common/SearchBox";
// // import Pagination from "../../components/common/Pagination";
// // import Modal from "../../components/common/Modal";
// // import Input from "../../components/common/Input";
// // import ConfirmDialog from "../../components/common/ConfirmDialog";
// // import candidateService from "../../services/candidate.service";
// // import { showSuccess, showError } from "../../utils/toast";
// // import { MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";
// // import { formatDate } from "../../utils/helpers";

// // // Helper to get current user ID (fallback to 1 if not found)
// // const getCurrentUserId = () => {
// //   try {
// //     const user = JSON.parse(localStorage.getItem("user") || "{}");
// //     if (user.id) return parseInt(user.id);
// //     const userId = localStorage.getItem("userId");
// //     if (userId) return parseInt(userId);
// //   } catch (e) {
// //     console.warn("Could not get user ID from localStorage, using default 1");
// //   }
// //   return 1;
// // };

// // // Build full image URL from relative path (if needed)
// // const getImageUrl = (path) => {
// //   if (!path) return null;
// //   if (path.startsWith("http://") || path.startsWith("https://")) return path;
// //   const base =
// //     import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";
// //   return `${base}${path}`;
// // };

// // const Candidates = () => {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [editItem, setEditItem] = useState(null);
// //   const [deleteId, setDeleteId] = useState(null);
// //   const [formLoading, setFormLoading] = useState(false);
// //   const [deleteLoading, setDeleteLoading] = useState(false);
// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [limit, setLimit] = useState(10);
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [form, setForm] = useState({
// //     first_name: "",
// //     last_name: "",
// //     email: "",
// //     mobile: "",
// //     status: "active",
// //     profile_photo: null,
// //   });
// //   const [photoPreview, setPhotoPreview] = useState(null);

// //   // Normalize API response
// //   const normalizeCandidate = (item) => ({
// //     id: item.id,
// //     first_name: item.first_name || "",
// //     last_name: item.last_name || "",
// //     email: item.email || "",
// //     mobile: item.mobile || "",
// //     profile_photo: item.profile_photo || null,
// //     status: item.status || "inactive",
// //     last_login_at: item.last_login_at || null,
// //     created_by: item.created_by || null,
// //     updated_by: item.updated_by || null,
// //     created_at: item.createdAt || item.created_at || null,
// //     updated_at: item.updatedAt || item.updated_at || null,
// //   });

// //   const load = async () => {
// //     setLoading(true);
// //     try {
// //       const r = await candidateService.getAll();
// //       const rawData = r.data?.data.data || r.data?.results || r.data || [];
// //       const items = Array.isArray(rawData)
// //         ? rawData.map(normalizeCandidate)
// //         : [];
// //       setData(items);
// //     } catch (err) {
// //       console.error("Load error:", err);
// //       showError(err.response?.data?.message || "Failed to load candidates");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     load();
// //   }, []);
// //   useEffect(() => {
// //     setPage(1);
// //   }, [search, statusFilter]);

// //   const filteredData = useMemo(() => {
// //     let result = data;
// //     if (statusFilter !== "all") {
// //       result = result.filter((item) =>
// //         statusFilter === "active" ? item.status === "active" : item.status !== "active"
// //       );
// //     }
// //     const query = search.toLowerCase().trim();
// //     if (query) {
// //       result = result.filter((item) =>
// //         [item.first_name, item.last_name, item.email, item.mobile].some((value) =>
// //           String(value ?? "")
// //             .toLowerCase()
// //             .includes(query),
// //         ),
// //       );
// //     }
// //     return result;
// //   }, [data, search, statusFilter]);

// //   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

// //   const activeCount = data.filter((c) => c.status === "active").length;
// //   const inactiveCount = data.length - activeCount;

// //   const openAdd = () => {
// //     setEditItem(null);
// //     setForm({
// //       first_name: "",
// //       last_name: "",
// //       email: "",
// //       mobile: "",
// //       status: "active",
// //       profile_photo: null,
// //     });
// //     setPhotoPreview(null);
// //     setModalOpen(true);
// //   };

// //   const openEdit = (item) => {
// //     setEditItem(item);
// //     setForm({
// //       first_name: item.first_name,
// //       last_name: item.last_name,
// //       email: item.email,
// //       mobile: item.mobile,
// //       status: item.status,
// //       profile_photo: null,
// //     });
// //     setPhotoPreview(getImageUrl(item.profile_photo));
// //     setModalOpen(true);
// //   };

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setForm({ ...form, profile_photo: file });
// //       const reader = new FileReader();
// //       reader.onload = (event) => setPhotoPreview(event.target.result);
// //       reader.readAsDataURL(file);
// //     } else {
// //       setForm({ ...form, profile_photo: null });
// //       setPhotoPreview(editItem ? getImageUrl(editItem.profile_photo) : null);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setFormLoading(true);
// //     try {
// //       const userId = getCurrentUserId();

// //       // Build payload as FormData to support file upload
// //       const payload = new FormData();
// //       payload.append("first_name", form.first_name.trim());
// //       payload.append("last_name", form.last_name.trim());
// //       payload.append("email", form.email.trim());
// //       payload.append("mobile", form.mobile.trim());
// //       payload.append("status", form.status);

// //       if (form.profile_photo instanceof File) {
// //         payload.append("profile_photo", form.profile_photo);
// //       }

// //       if (editItem) {
// //         payload.append("updated_by", userId);
// //         await candidateService.update(editItem.id, payload);
// //         showSuccess("Candidate updated");
// //       } else {
// //         payload.append("created_by", userId);
// //         await candidateService.create(payload);
// //         showSuccess("Candidate created");
// //       }
// //       setModalOpen(false);
// //       load();
// //     } catch (err) {
// //       console.error("Submit error:", err.response?.data);
// //       const errorMsg =
// //         err.response?.data?.message || err.message || "Operation failed";
// //       showError(errorMsg);
// //     } finally {
// //       setFormLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     setDeleteLoading(true);
// //     try {
// //       await candidateService.delete(deleteId);
// //       showSuccess("Candidate deleted");
// //       load();
// //     } catch (err) {
// //       console.error("Delete error:", err);
// //       showError(err.response?.data?.message || "Failed to delete");
// //     } finally {
// //       setDeleteId(null);
// //       setDeleteLoading(false);
// //     }
// //   };

// //   // Toggle status between 'active' and 'inactive'
// //   const handleStatusToggle = async (id, currentStatus) => {
// //     const newStatus = currentStatus === "active" ? "inactive" : "active";
// //     try {
// //       await candidateService.update(id, {
// //         status: newStatus,
// //         updated_by: getCurrentUserId(),
// //       });
// //       showSuccess(`Status updated to ${newStatus}`);
// //       load();
// //     } catch (err) {
// //       console.error("Status toggle error:", err);
// //       showError(err.response?.data?.message || "Failed to update status");
// //     }
// //   };

// //   const columns = [
// //     { header: "#", key: "id", render: (_, __, i) => (page - 1) * limit + i + 1 },
// //     {
// //       header: "Photo",
// //       key: "profile_photo",
// //       render: (photo) =>
// //         photo ? (
// //           <img
// //             src={getImageUrl(photo)}
// //             alt="profile"
// //             className="w-8 h-8 object-cover rounded-full border border-gray-200"
// //             onError={(e) => {
// //               e.target.style.display = "none";
// //             }}
// //           />
// //         ) : (
// //           <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-medium">
// //             ?
// //           </div>
// //         ),
// //     },
// //     {
// //       header: "Full Name",
// //       key: "first_name",
// //       render: (_, row) => (
// //         <span className="font-medium capitalize text-gray-800">
// //           {row.first_name} {row.last_name}
// //         </span>
// //       ),
// //     },
// //     {
// //       header: "Email",
// //       key: "email",
// //       render: (v) => <span className="text-sm text-gray-500">{v}</span>,
// //     },
// //     {
// //       header: "Mobile",
// //       key: "mobile",
// //       render: (v) => <span className="text-sm text-gray-500">{v}</span>,
// //     },
// //     {
// //       header: "Status",
// //       key: "status",
// //       render: (status, row) => (
// //         <button
// //           onClick={() => handleStatusToggle(row.id, status)}
// //           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
// //             status === "active" ? "bg-[#2c0eee]" : "bg-gray-300"
// //           }`}
// //         >
// //           <span
// //             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
// //               status === "active" ? "translate-x-6" : "translate-x-1"
// //             }`}
// //           />
// //         </button>
// //       ),
// //     },
// //     {
// //       header: "Last Login",
// //       key: "last_login_at",
// //       render: (v) => (
// //         <span className="text-gray-500 text-sm">{v ? formatDate(v) : "—"}</span>
// //       ),
// //     },
// //     {
// //       header: "Actions",
// //       key: "id",
// //       render: (id, row) => (
// //         <div className="flex gap-1 justify-end">
// //           <button
// //             onClick={() => openEdit(row)}
// //             className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
// //           >
// //             <MdEdit size={16} />
// //           </button>
// //           <button
// //             onClick={() => setDeleteId(id)}
// //             className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
// //           >
// //             <MdDelete size={16} />
// //           </button>
// //         </div>
// //       ),
// //     },
// //   ];

// //   const tabs = [
// //     { key: "all", label: "All", count: data.length },
// //     { key: "active", label: "Active", count: activeCount },
// //     { key: "inactive", label: "Inactive", count: inactiveCount },
// //   ];

// //   return (
// //     <div className="space-y-4">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
// //           <p className="text-sm text-gray-500 mt-1">Manage registered candidates</p>
// //         </div>
// //         <Button icon={MdAdd} onClick={openAdd}>
// //           Add Candidate
// //         </Button>
// //       </div>

// //       {/* Table Card */}
// //       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
// //         {/* Top bar: search + tabs */}
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
// //           <div className="relative w-full sm:w-72">
// //             <MdSearch
// //               size={18}
// //               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
// //             />
// //             <input
// //               type="text"
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               placeholder="Search candidates..."
// //               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
// //             />
// //           </div>

// //           <div className="flex items-center gap-5 text-sm">
// //             {tabs.map((tab) => (
// //               <button
// //                 key={tab.key}
// //                 onClick={() => setStatusFilter(tab.key)}
// //                 className={`flex items-center gap-1.5 font-medium transition-colors ${
// //                   statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
// //                 }`}
// //               >
// //                 {tab.label}
// //                 <span
// //                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
// //                     statusFilter === tab.key
// //                       ? "bg-blue-50 text-[#2c0eee]"
// //                       : "bg-gray-100 text-gray-500"
// //                   }`}
// //                 >
// //                   {tab.count}
// //                 </span>
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         <Table
// //           columns={columns}
// //           data={paginatedData}
// //           loading={loading}
// //           emptyMessage="No candidates found"
// //         />

// //         {/* Footer */}
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
// //           <p className="text-xs text-gray-400">
// //             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
// //             {"–"}
// //             {Math.min(page * limit, filteredData.length)} of {filteredData.length} candidates
// //           </p>
// //           <Pagination
// //             page={page}
// //             total={filteredData.length}
// //             limit={limit}
// //             onChange={setPage}
// //             onLimitChange={(newLimit) => {
// //               setLimit(newLimit);
// //               setPage(1);
// //             }}
// //           />
// //         </div>
// //       </div>

// //       {/* Modal */}
// //       <Modal
// //         isOpen={modalOpen}
// //         onClose={() => setModalOpen(false)}
// //         title={editItem ? "Edit Candidate" : "Add Candidate"}
// //         size="sm"
// //       >
// //         <form
// //           onSubmit={handleSubmit}
// //           className="space-y-4"
// //           encType="multipart/form-data"
// //         >
// //           <div className="grid grid-cols-2 gap-3">
// //             <Input
// //               label="First Name"
// //               required
// //               value={form.first_name}
// //               onChange={(e) => setForm({ ...form, first_name: e.target.value })}
// //               placeholder="John"
// //             />
// //             <Input
// //               label="Last Name"
// //               required
// //               value={form.last_name}
// //               onChange={(e) => setForm({ ...form, last_name: e.target.value })}
// //               placeholder="Doe"
// //             />
// //           </div>

// //           <Input
// //             label="Email"
// //             type="email"
// //             required
// //             value={form.email}
// //             onChange={(e) => setForm({ ...form, email: e.target.value })}
// //             placeholder="john@example.com"
// //           />

// //           <Input
// //             label="Mobile"
// //             required
// //             value={form.mobile}
// //             onChange={(e) => setForm({ ...form, mobile: e.target.value })}
// //             placeholder="9876543210"
// //           />

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Profile Photo
// //             </label>
// //             <input
// //               type="file"
// //               accept="image/*"
// //               onChange={handleFileChange}
// //               className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#2c0eee] hover:file:bg-blue-100"
// //             />
// //             {photoPreview && (
// //               <div className="mt-2">
// //                 <img
// //                   src={photoPreview}
// //                   alt="Preview"
// //                   className="w-16 h-16 object-cover rounded-full border border-gray-200"
// //                 />
// //               </div>
// //             )}
// //             {editItem && editItem.profile_photo && !photoPreview && (
// //               <div className="mt-2 text-xs text-gray-500">
// //                 Current photo:{" "}
// //                 <img
// //                   src={getImageUrl(editItem.profile_photo)}
// //                   alt="current"
// //                   className="w-16 h-16 object-cover rounded-full border border-gray-200 inline-block"
// //                   onError={(e) => {
// //                     e.target.style.display = "none";
// //                   }}
// //                 />
// //               </div>
// //             )}
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Status
// //             </label>
// //             <select
// //               value={form.status}
// //               onChange={(e) => setForm({ ...form, status: e.target.value })}
// //               className="input-field"
// //             >
// //               <option value="active">Active</option>
// //               <option value="inactive">Inactive</option>
// //             </select>
// //           </div>

// //           <div className="flex gap-3">
// //             <Button
// //               type="button"
// //               variant="secondary"
// //               className="flex-1"
// //               onClick={() => setModalOpen(false)}
// //             >
// //               Cancel
// //             </Button>
// //             <Button type="submit" className="flex-1" loading={formLoading}>
// //               {editItem ? "Update" : "Create"}
// //             </Button>
// //           </div>
// //         </form>
// //       </Modal>

// //       {/* Delete Confirmation */}
// //       <ConfirmDialog
// //         isOpen={!!deleteId}
// //         onClose={() => setDeleteId(null)}
// //         onConfirm={handleDelete}
// //         loading={deleteLoading}
// //         title="Delete Candidate"
// //         message="Delete this candidate? This action cannot be undone."
// //       />
// //     </div>
// //   );
// // };

// // export default Candidates;

// import { useState, useEffect, useMemo } from "react";
// import Table from "../../components/common/Table";
// import Button from "../../components/common/Button";
// import Pagination from "../../components/common/Pagination";
// import Modal from "../../components/common/Modal";
// import Input from "../../components/common/Input";
// import ConfirmDialog from "../../components/common/ConfirmDialog";
// import candidateService from "../../services/candidate.service";
// import { showSuccess, showError } from "../../utils/toast";
// import {
//   MdAdd,
//   MdEdit,
//   MdDelete,
//   MdSearch,
//   MdVisibility,
//   MdOpenInNew,
//   MdRefresh,
// } from "react-icons/md";
// import { formatDate } from "../../utils/helpers";

// // ---------------------------------------------------------------------------
// // Config
// // ---------------------------------------------------------------------------

// // Base API used for images/files served by the app
// const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// // Full profile endpoint (as given): https://apidata.hiremejobs.in/candidate-full-profile/:id
// const FULL_PROFILE_API = `${API_BASE}/candidate-full-profile`;

// // NOTE: the sample API response only returns a bare filename for resumes
// // (e.g. "1783055608652-Mansi Aghera Resume.pdf"), not a full path.
// // Adjust this folder to match wherever your backend actually stores resumes.
// const RESUME_FOLDER = "uploads/resumes";

// // ---------------------------------------------------------------------------
// // Helpers
// // ---------------------------------------------------------------------------

// // Helper to get current user ID (fallback to 1 if not found)
// const getCurrentUserId = () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user.id) return parseInt(user.id);
//     const userId = localStorage.getItem("userId");
//     if (userId) return parseInt(userId);
//   } catch (e) {
//     console.warn("Could not get user ID from localStorage, using default 1");
//   }
//   return 1;
// };

// // Build full image URL from relative path (if needed)
// const getImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http://") || path.startsWith("https://")) return path;
//   return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
// };

// // Build full resume/file URL from a bare filename or relative path
// const getResumeUrl = (fileName) => {
//   if (!fileName) return null;
//   if (fileName.startsWith("http://") || fileName.startsWith("https://")) return fileName;
//   if (fileName.startsWith("/")) return `${API_BASE}${fileName}`;
//   return `${API_BASE}/${RESUME_FOLDER}/${encodeURIComponent(fileName)}`;
// };

// // Safely resolve a "{id, name}" lookup field, or a plain numeric id
// const getName = (val, fallbackPrefix = "ID") => {
//   if (val === null || val === undefined || val === "") return "—";
//   if (typeof val === "object") return val.name ?? `${fallbackPrefix} ${val.id}`;
//   return `${fallbackPrefix} ${val}`;
// };

// // Resolve an array of preference lookup objects (which may use "name" or
// // "role_name" as the label key, or sometimes just be plain ids) into display strings
// const getListNames = (arr) => {
//   if (!Array.isArray(arr) || arr.length === 0) return [];
//   return arr.map((item) => {
//     if (item && typeof item === "object") {
//       return item.name ?? item.role_name ?? `ID ${item.id}`;
//     }
//     return `ID ${item}`;
//   });
// };

// const formatCurrency = (val) => {
//   if (val === null || val === undefined || val === "") return "—";
//   const num = Number(val);
//   if (Number.isNaN(num)) return String(val);
//   return `₹${num.toLocaleString("en-IN")}`;
// };

// // ---------------------------------------------------------------------------
// // Small presentational building blocks
// // ---------------------------------------------------------------------------

// const Badge = ({ children, color = "gray" }) => {
//   const colors = {
//     gray: "bg-gray-100 text-gray-600",
//     purple: "bg-blue-50 text-[#2c0eee]",
//     green: "bg-green-50 text-green-600",
//     amber: "bg-amber-50 text-amber-600",
//     red: "bg-red-50 text-red-600",
//   };
//   return (
//     <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[color] || colors.gray}`}>
//       {children}
//     </span>
//   );
// };

// const EmptyState = ({ text }) => <p className="text-sm text-gray-400 italic py-1.5">{text}</p>;

// const SectionCard = ({ title, children }) => (
//   <div className="bg-white border border-gray-100 rounded-xl p-4">
//     <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
//     {children}
//   </div>
// );

// const PreferenceChipGroup = ({ label, items }) => (
//   <div>
//     <p className="text-xs text-gray-400 mb-1.5">{label}</p>
//     {items.length === 0 ? (
//       <p className="text-sm text-gray-400 italic">—</p>
//     ) : (
//       <div className="flex flex-wrap gap-1.5">
//         {items.map((name, idx) => (
//           <span
//             key={idx}
//             className="text-xs font-medium bg-blue-50 text-[#2c0eee] px-2.5 py-1 rounded-full"
//           >
//             {name}
//           </span>
//         ))}
//       </div>
//     )}
//   </div>
// );

// const DetailRow = ({ label, value }) => (
//   <div className="flex justify-between gap-3 py-1 text-sm">
//     <span className="text-gray-400">{label}</span>
//     <span className="text-gray-700 font-medium text-right">{value ?? "—"}</span>
//   </div>
// );

// // Generic renderer for sections whose schema we don't fully know yet
// // (certifications, awards, social links, projects)
// const GenericListSection = ({ title, items }) => {
//   const list = Array.isArray(items) ? items : items ? [items] : [];

//   if (list.length === 0) {
//     return (
//       <SectionCard title={title}>
//         <EmptyState text={`No ${title.toLowerCase()} added`} />
//       </SectionCard>
//     );
//   }

//   const skipKeys = [
//     "id",
//     "candidate_id",
//     "created_by",
//     "updated_by",
//     "created_at",
//     "updated_at",
//     "createdAt",
//     "updatedAt",
//   ];

//   return (
//     <SectionCard title={title}>
//       <div className="space-y-2">
//         {list.map((item, idx) => (
//           <div
//             key={item?.id ?? idx}
//             className="p-3 bg-gray-50 rounded-lg border border-gray-100 grid grid-cols-2 gap-x-4 gap-y-1"
//           >
//             {Object.entries(item || {})
//               .filter(([k]) => !skipKeys.includes(k))
//               .map(([k, v]) => (
//                 <div key={k} className="text-xs">
//                   <span className="text-gray-400 capitalize">{k.replace(/_/g, " ")}: </span>
//                   <span className="text-gray-700 font-medium">
//                     {typeof v === "object" && v !== null
//                       ? v.name ?? JSON.stringify(v)
//                       : String(v ?? "—")}
//                   </span>
//                 </div>
//               ))}
//           </div>
//         ))}
//       </div>
//     </SectionCard>
//   );
// };

// // ---------------------------------------------------------------------------
// // Candidate full profile modal
// // ---------------------------------------------------------------------------

// const CandidateProfileModal = ({ isOpen, onClose, candidateId }) => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchProfile = async () => {
//     if (!candidateId) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${FULL_PROFILE_API}/${candidateId}`);
//       if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
//       const json = await res.json();
//       if (!json.success) throw new Error(json.message || "Failed to load candidate profile");
//       setProfile(json.data);
//     } catch (err) {
//       console.error("Fetch full profile error:", err);
//       setError(err.message || "Failed to load candidate profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isOpen && candidateId) {
//       fetchProfile();
//     }
//     if (!isOpen) {
//       setProfile(null);
//       setError(null);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isOpen, candidateId]);

//   const resumes = useMemo(() => {
//     if (!profile) return [];
//     const r = profile.candidate_resumes;
//     return Array.isArray(r) ? r.filter(Boolean) : r ? [r] : [];
//   }, [profile]);

//   const candidate = profile?.candidate;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Candidate Profile" size="lg">
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-16 gap-3">
//           <div className="w-8 h-8 border-2 border-[#4529f7] border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading candidate profile...</p>
//         </div>
//       )}

//       {!loading && error && (
//         <div className="flex flex-col items-center justify-center py-16 gap-3">
//           <p className="text-sm text-red-500 text-center max-w-sm">{error}</p>
//           <button
//             onClick={fetchProfile}
//             className="flex items-center gap-1.5 px-4 py-2 bg-[#2c0eee] hover:bg-[#2c0eee] text-white text-sm font-medium rounded-lg transition-colors"
//           >
//             <MdRefresh size={16} /> Retry
//           </button>
//         </div>
//       )}

//       {!loading && !error && profile && (
//         <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
//           {/* Header */}
//           <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex-wrap">
//             {candidate?.profile_photo ? (
//               <img
//                 src={getImageUrl(candidate.profile_photo)}
//                 alt="profile"
//                 className="w-16 h-16 object-cover rounded-full border border-gray-200"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                 }}
//               />
//             ) : (
//               <div className="w-16 h-16 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-300 text-xl font-medium">
//                 {candidate?.first_name?.[0]?.toUpperCase() || "?"}
//               </div>
//             )}

//             <div className="flex-1 min-w-[180px]">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h2 className="text-lg font-bold text-gray-900 capitalize">
//                   {candidate?.first_name} {candidate?.last_name}
//                 </h2>
//                 <Badge color={candidate?.status === "active" ? "green" : "gray"}>
//                   {candidate?.status || "unknown"}
//                 </Badge>
//               </div>
//               <p className="text-sm text-gray-500 mt-0.5">{candidate?.email || "—"}</p>
//               <p className="text-sm text-gray-500">{candidate?.mobile || "—"}</p>
//               <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
//                 <span>Joined {candidate?.createdAt ? formatDate(candidate.createdAt) : "—"}</span>
//                 <span>
//                   Last login {candidate?.last_login_at ? formatDate(candidate.last_login_at) : "—"}
//                 </span>
//               </div>
//             </div>

//             <div className="text-right shrink-0">
//               <p className="text-xs text-gray-400 mb-1">Profile Completion</p>
//               <div className="flex items-center gap-2">
//                 <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-[#2c0eee] rounded-full"
//                     style={{ width: `${profile.total_completion_percentage || 0}%` }}
//                   />
//                 </div>
//                 <span className="text-xs font-semibold text-gray-600">
//                   {profile.total_completion_percentage || 0}%
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Resume */}
//           <SectionCard title="Resume">
//             {resumes.length === 0 ? (
//               <EmptyState text="No resume uploaded" />
//             ) : (
//               <div className="space-y-2">
//                 {resumes.map((resume, idx) => (
//                   <div
//                     key={resume.id ?? idx}
//                     className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 flex-wrap"
//                   >
//                     <div className="min-w-0">
//                       <p className="text-sm font-medium text-gray-800 truncate">
//                         {resume.resume_title || "Untitled Resume"}
//                       </p>
//                       <div className="flex items-center gap-2 mt-1 flex-wrap">
//                         {resume.is_primary && <Badge color="purple">Primary</Badge>}
//                         {resume.is_trending && <Badge color="amber">Trending</Badge>}
//                         <span
//                           className={`text-xs font-medium ${
//                             resume.is_status ? "text-green-600" : "text-gray-400"
//                           }`}
//                         >
//                           {resume.is_status ? "Active" : "Inactive"}
//                         </span>
//                       </div>
//                     </div>
//                     {resume.resume_file ? (
//                       <a
//                         href={getResumeUrl(resume.resume_file)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#2c0eee] hover:bg-[#2c0eee] text-white text-xs font-semibold rounded-lg transition-colors"
//                       >
//                         <MdOpenInNew size={14} />
//                         View Resume
//                       </a>
//                     ) : (
//                       <span className="text-xs text-gray-400 shrink-0">No file</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </SectionCard>

//           {/* Skills */}
//           <SectionCard title={`Skills (${(profile.candidate_skills || []).length})`}>
//             {(profile.candidate_skills || []).length === 0 ? (
//               <EmptyState text="No skills added" />
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {profile.candidate_skills.map((s) => (
//                   <span
//                     key={s.id}
//                     className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg"
//                   >
//                     <span className="font-medium text-gray-700">Skill #{s.skill_id}</span>
//                     <span className="text-gray-400">• {s.experience_months} mo</span>
//                     {s.is_trending && <Badge color="amber">Trending</Badge>}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </SectionCard>

//           {/* Education */}
//           <SectionCard title={`Education (${(profile.candidate_education || []).length})`}>
//             {(profile.candidate_education || []).length === 0 ? (
//               <EmptyState text="No education records" />
//             ) : (
//               <div className="space-y-3">
//                 {profile.candidate_education.map((edu) => (
//                   <div key={edu.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <div className="flex items-center justify-between flex-wrap gap-1">
//                       <p className="text-sm font-semibold text-gray-800">
//                         {getName(edu.education_category_id)}
//                       </p>
//                       {edu.is_trending && <Badge color="amber">Trending</Badge>}
//                     </div>
//                     <p className="text-xs text-gray-500 mt-0.5">
//                       {getName(edu.education_sub_category_id)}
//                     </p>
//                     <div className="grid grid-cols-2 gap-x-4 mt-2">
//                       <DetailRow label="College" value={edu.college_name} />
//                       <DetailRow label="Passing Year" value={edu.passing_year} />
//                       <DetailRow
//                         label="Percentage"
//                         value={edu.percentage ? `${edu.percentage}%` : "—"}
//                       />
//                       <DetailRow label="Type" value={edu.education_type} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </SectionCard>

//           {/* Experience */}
//           <SectionCard title={`Experience (${(profile.candidate_experience || []).length})`}>
//             {(profile.candidate_experience || []).length === 0 ? (
//               <EmptyState text="No experience records" />
//             ) : (
//               <div className="space-y-3">
//                 {profile.candidate_experience.map((exp) => (
//                   <div key={exp.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <div className="flex items-center justify-between flex-wrap gap-1">
//                       <p className="text-sm font-semibold text-gray-800">
//                         {exp.job_title || exp.designation} @ {exp.company_name}
//                       </p>
//                       {exp.is_current_company && <Badge color="green">Current</Badge>}
//                     </div>
//                     <div className="grid grid-cols-2 gap-x-4 mt-2">
//                       <DetailRow label="Industry" value={getName(exp.industry_id)} />
//                       <DetailRow label="Workplace" value={getName(exp.workplace_id)} />
//                       <DetailRow label="Job Type" value={getName(exp.job_types_id)} />
//                       <DetailRow label="Notice Period" value={getName(exp.notice_period_id)} />
//                       <DetailRow
//                         label="Duration"
//                         value={`${exp.start_date ? formatDate(exp.start_date) : "—"} – ${
//                           exp.is_current_company
//                             ? "Present"
//                             : exp.end_date
//                             ? formatDate(exp.end_date)
//                             : "—"
//                         }`}
//                       />
//                       <DetailRow label="Salary" value={formatCurrency(exp.salary)} />
//                     </div>
//                     {exp.job_description && (
//                       <p className="text-xs text-gray-500 mt-2 leading-relaxed border-t border-gray-100 pt-2 whitespace-pre-line">
//                         {exp.job_description}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </SectionCard>

//           {/* Preferences */}
//           <SectionCard title="Preferences">
//             {!profile.candidate_preferences ? (
//               <EmptyState text="No preferences set" />
//             ) : (
//               <div className="space-y-3">
//                 <DetailRow
//                   label="Preferred Salary"
//                   value={formatCurrency(profile.candidate_preferences.preferred_salary)}
//                 />
//                 <PreferenceChipGroup
//                   label="Preferred Roles"
//                   items={getListNames(profile.candidate_preferences.preferred_role_id)}
//                 />
//                 <PreferenceChipGroup
//                   label="Preferred Industries"
//                   items={getListNames(profile.candidate_preferences.preferred_industry_id)}
//                 />
//                 <PreferenceChipGroup
//                   label="Preferred Cities"
//                   items={getListNames(profile.candidate_preferences.preferred_city_id)}
//                 />
//                 <PreferenceChipGroup
//                   label="Preferred Workplace Types"
//                   items={getListNames(profile.candidate_preferences.preferred_workplace_type_id)}
//                 />
//               </div>
//             )}
//           </SectionCard>

//           {/* Sections with unknown/flexible schema */}
//           <GenericListSection title="Certifications" items={profile.candidate_certification} />
//           <GenericListSection title="Awards" items={profile.candidate_awards} />
//           <GenericListSection title="Social Links" items={profile.candidate_social_links} />
//           <GenericListSection title="Projects" items={profile.candidate_projects} />
//         </div>
//       )}
//     </Modal>
//   );
// };

// // ---------------------------------------------------------------------------
// // Candidates page
// // ---------------------------------------------------------------------------

// const Candidates = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     mobile: "",
//     status: "active",
//     profile_photo: null,
//   });
//   const [photoPreview, setPhotoPreview] = useState(null);

//   // View (full profile) modal state
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [viewCandidateId, setViewCandidateId] = useState(null);

//   const openView = (id) => {
//     setViewCandidateId(id);
//     setViewModalOpen(true);
//   };

//   const closeView = () => {
//     setViewModalOpen(false);
//     setViewCandidateId(null);
//   };

//   // Normalize API response
//   const normalizeCandidate = (item) => ({
//     id: item.id,
//     first_name: item.first_name || "",
//     last_name: item.last_name || "",
//     email: item.email || "",
//     mobile: item.mobile || "",
//     profile_photo: item.profile_photo || null,
//     status: item.status || "inactive",
//     last_login_at: item.last_login_at || null,
//     created_by: item.created_by || null,
//     updated_by: item.updated_by || null,
//     created_at: item.createdAt || item.created_at || null,
//     updated_at: item.updatedAt || item.updated_at || null,
//   });

//   const load = async () => {
//     setLoading(true);
//     try {
//       const r = await candidateService.getAll();
//       const rawData = r.data?.data?.data || r.data?.results || r.data || [];
//       const items = Array.isArray(rawData)
//         ? rawData.map(normalizeCandidate)
//         : [];
//       setData(items);
//     } catch (err) {
//       console.error("Load error:", err);
//       showError(err.response?.data?.message || "Failed to load candidates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);
//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter]);

//   const filteredData = useMemo(() => {
//     let result = data;
//     if (statusFilter !== "all") {
//       result = result.filter((item) =>
//         statusFilter === "active" ? item.status === "active" : item.status !== "active"
//       );
//     }
//     const query = search.toLowerCase().trim();
//     if (query) {
//       result = result.filter((item) =>
//         [item.first_name, item.last_name, item.email, item.mobile].some((value) =>
//           String(value ?? "")
//             .toLowerCase()
//             .includes(query),
//         ),
//       );
//     }
//     return result;
//   }, [data, search, statusFilter]);

//   const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

//   const activeCount = data.filter((c) => c.status === "active").length;
//   const inactiveCount = data.length - activeCount;

//   const openAdd = () => {
//     setEditItem(null);
//     setForm({
//       first_name: "",
//       last_name: "",
//       email: "",
//       mobile: "",
//       status: "active",
//       profile_photo: null,
//     });
//     setPhotoPreview(null);
//     setModalOpen(true);
//   };

//   const openEdit = (item) => {
//     setEditItem(item);
//     setForm({
//       first_name: item.first_name,
//       last_name: item.last_name,
//       email: item.email,
//       mobile: item.mobile,
//       status: item.status,
//       profile_photo: null,
//     });
//     setPhotoPreview(getImageUrl(item.profile_photo));
//     setModalOpen(true);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setForm({ ...form, profile_photo: file });
//       const reader = new FileReader();
//       reader.onload = (event) => setPhotoPreview(event.target.result);
//       reader.readAsDataURL(file);
//     } else {
//       setForm({ ...form, profile_photo: null });
//       setPhotoPreview(editItem ? getImageUrl(editItem.profile_photo) : null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormLoading(true);
//     try {
//       const userId = getCurrentUserId();

//       // Build payload as FormData to support file upload
//       const payload = new FormData();
//       payload.append("first_name", form.first_name.trim());
//       payload.append("last_name", form.last_name.trim());
//       payload.append("email", form.email.trim());
//       payload.append("mobile", form.mobile.trim());
//       payload.append("status", form.status);

//       if (form.profile_photo instanceof File) {
//         payload.append("profile_photo", form.profile_photo);
//       }

//       if (editItem) {
//         payload.append("updated_by", userId);
//         await candidateService.update(editItem.id, payload);
//         showSuccess("Candidate updated");
//       } else {
//         payload.append("created_by", userId);
//         await candidateService.create(payload);
//         showSuccess("Candidate created");
//       }
//       setModalOpen(false);
//       load();
//     } catch (err) {
//       console.error("Submit error:", err.response?.data);
//       const errorMsg =
//         err.response?.data?.message || err.message || "Operation failed";
//       showError(errorMsg);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await candidateService.delete(deleteId);
//       showSuccess("Candidate deleted");
//       load();
//     } catch (err) {
//       console.error("Delete error:", err);
//       showError(err.response?.data?.message || "Failed to delete");
//     } finally {
//       setDeleteId(null);
//       setDeleteLoading(false);
//     }
//   };

//   // Toggle status between 'active' and 'inactive'
//   const handleStatusToggle = async (id, currentStatus) => {
//     const newStatus = currentStatus === "active" ? "inactive" : "active";
//     try {
//       await candidateService.update(id, {
//         status: newStatus,
//         updated_by: getCurrentUserId(),
//       });
//       showSuccess(`Status updated to ${newStatus}`);
//       load();
//     } catch (err) {
//       console.error("Status toggle error:", err);
//       showError(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   const columns = [
//     { header: "#", key: "id", render: (_, __, i) => (page - 1) * limit + i + 1 },
//     {
//       header: "Photo",
//       key: "profile_photo",
//       render: (photo) =>
//         photo ? (
//           <img
//             src={getImageUrl(photo)}
//             alt="profile"
//             className="w-8 h-8 object-cover rounded-full border border-gray-200"
//             onError={(e) => {
//               e.target.style.display = "none";
//             }}
//           />
//         ) : (
//           <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-medium">
//             ?
//           </div>
//         ),
//     },
//     {
//       header: "Full Name",
//       key: "first_name",
//       render: (_, row) => (
//         <span className="font-medium capitalize text-gray-800">
//           {row.first_name} {row.last_name}
//         </span>
//       ),
//     },
//     {
//       header: "Email",
//       key: "email",
//       render: (v) => <span className="text-sm text-gray-500">{v}</span>,
//     },
//     {
//       header: "Mobile",
//       key: "mobile",
//       render: (v) => <span className="text-sm text-gray-500">{v}</span>,
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (status, row) => (
//         <button
//           onClick={() => handleStatusToggle(row.id, status)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             status === "active" ? "bg-[#2c0eee]" : "bg-gray-300"
//           }`}
//         >
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
//               status === "active" ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//       ),
//     },
//     {
//       header: "Last Login",
//       key: "last_login_at",
//       render: (v) => (
//         <span className="text-gray-500 text-sm">{v ? formatDate(v) : "—"}</span>
//       ),
//     },
//     {
//       header: "Actions",
//       key: "id",
//       render: (id, row) => (
//         <div className="flex gap-1 justify-end">
//           <button
//             onClick={() => openView(id)}
//             className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-[#2c0eee] rounded-lg transition-colors"
//             title="View Profile"
//           >
//             <MdVisibility size={16} />
//           </button>
//           {/* <button
//             onClick={() => openEdit(row)}
//             className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
//             title="Edit"
//           >
//             <MdEdit size={16} />
//           </button> */}
//           <button
//             onClick={() => setDeleteId(id)}
//             className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
//             title="Delete"
//           >
//             <MdDelete size={16} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const tabs = [
//     { key: "all", label: "All", count: data.length },
//     { key: "active", label: "Active", count: activeCount },
//     { key: "inactive", label: "Inactive", count: inactiveCount },
//   ];

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage registered candidates</p>
//         </div>
//         {/* <Button icon={MdAdd} onClick={openAdd}>
//           Add Candidate
//         </Button> */}
//       </div>

//       {/* Table Card */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         {/* Top bar: search + tabs */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
//           <div className="relative w-full sm:w-72">
//             <MdSearch
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search candidates..."
//               className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
//             />
//           </div>

//           <div className="flex items-center gap-5 text-sm">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setStatusFilter(tab.key)}
//                 className={`flex items-center gap-1.5 font-medium transition-colors ${
//                   statusFilter === tab.key ? "text-[#2c0eee]" : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 {tab.label}
//                 <span
//                   className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
//                     statusFilter === tab.key
//                       ? "bg-blue-50 text-[#2c0eee]"
//                       : "bg-gray-100 text-gray-500"
//                   }`}
//                 >
//                   {tab.count}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <Table
//           columns={columns}
//           data={paginatedData}
//           loading={loading}
//           emptyMessage="No candidates found"
//         />

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
//             {"–"}
//             {Math.min(page * limit, filteredData.length)} of {filteredData.length} candidates
//           </p>
//           <Pagination
//             page={page}
//             total={filteredData.length}
//             limit={limit}
//             onChange={setPage}
//             onLimitChange={(newLimit) => {
//               setLimit(newLimit);
//               setPage(1);
//             }}
//           />
//         </div>
//       </div>

//       {/* Add / Edit Modal */}
//       <Modal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         title={editItem ? "Edit Candidate" : "Add Candidate"}
//         size="sm"
//       >
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4"
//           encType="multipart/form-data"
//         >
//           <div className="grid grid-cols-2 gap-3">
//             <Input
//               label="First Name"
//               required
//               value={form.first_name}
//               onChange={(e) => setForm({ ...form, first_name: e.target.value })}
//               placeholder="John"
//             />
//             <Input
//               label="Last Name"
//               required
//               value={form.last_name}
//               onChange={(e) => setForm({ ...form, last_name: e.target.value })}
//               placeholder="Doe"
//             />
//           </div>

//           <Input
//             label="Email"
//             type="email"
//             required
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             placeholder="john@example.com"
//           />

//           <Input
//             label="Mobile"
//             required
//             value={form.mobile}
//             onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//             placeholder="9876543210"
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Profile Photo
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#2c0eee] hover:file:bg-blue-100"
//             />
//             {photoPreview && (
//               <div className="mt-2">
//                 <img
//                   src={photoPreview}
//                   alt="Preview"
//                   className="w-16 h-16 object-cover rounded-full border border-gray-200"
//                 />
//               </div>
//             )}
//             {editItem && editItem.profile_photo && !photoPreview && (
//               <div className="mt-2 text-xs text-gray-500">
//                 Current photo:{" "}
//                 <img
//                   src={getImageUrl(editItem.profile_photo)}
//                   alt="current"
//                   className="w-16 h-16 object-cover rounded-full border border-gray-200 inline-block"
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                   }}
//                 />
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value })}
//               className="input-field"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           <div className="flex gap-3">
//             <Button
//               type="button"
//               variant="secondary"
//               className="flex-1"
//               onClick={() => setModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" className="flex-1" loading={formLoading}>
//               {editItem ? "Update" : "Create"}
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Full Profile View Modal */}
//       <CandidateProfileModal
//         isOpen={viewModalOpen}
//         onClose={closeView}
//         candidateId={viewCandidateId}
//       />

//       {/* Delete Confirmation */}
//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         loading={deleteLoading}
//         title="Delete Candidate"
//         message="Delete this candidate? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default Candidates;

// pages/Candidates.jsx


import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import candidateService from "../../services/candidate.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdOpenInNew,
} from "react-icons/md";

const API_BASE_URL = "https://apidata.hiremejobs.in";

const Candidates = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userNameCache, setUserNameCache] = useState({});

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

  // Normalize candidate data
  const normalizeCandidate = (item) => ({
    id: item.id || item._id,
    first_name: item.first_name || "",
    last_name: item.last_name || "",
    email: item.email || "",
    mobile: item.mobile || "",
    profile_photo: item.profile_photo || null,
    status: String(item.status || "inactive")
      .trim()
      .toLowerCase(),
    last_login_at: item.last_login_at || null,
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    created_at: item.createdAt || item.created_at || null,
    updated_at: item.updatedAt || item.updated_at || null,
  });

  const load = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const userMap = {};
      Object.keys(users).forEach((id) => {
        userMap[id] = users[id].name;
      });
      setUserNameCache(userMap);

      const r = await candidateService.getAll();
      const rawData = r.data?.data?.data || r.data?.results || r.data || [];
      const items = Array.isArray(rawData)
        ? rawData.map(normalizeCandidate)
        : [];
      setData(items);
    } catch (err) {
      console.error("Load error:", err);
      showError(err.response?.data?.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter !== "all") {
      result = result.filter((item) =>
        statusFilter === "active"
          ? item.status === "active"
          : item.status !== "active",
      );
    }
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter((item) =>
        [item.first_name, item.last_name, item.email, item.mobile].some(
          (value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(query),
        ),
      );
    }
    return result;
  }, [data, search, statusFilter]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const activeCount = data.filter((c) => c.status === "active").length;
  const inactiveCount = data.length - activeCount;

  const getCreatedByName = (row) => {
    if (!row) return "-";
    if (row.created_by) {
      return getUserNameCached(row.created_by);
    }
    return "-";
  };

  const getUpdatedByName = (row) => {
    if (!row) return "-";
    if (row.updated_by) {
      return getUserNameCached(row.updated_by);
    }
    return "-";
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await candidateService.delete(deleteId);
      showSuccess("Candidate deleted successfully");
      load();
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id) return parseInt(user.id, 10);

      const userId = localStorage.getItem("userId");
      if (userId) return parseInt(userId, 10);
    } catch (err) {
      console.warn("Could not get user ID from localStorage");
    }

    return 1;
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const normalizedStatus = String(currentStatus || "inactive")
      .trim()
      .toLowerCase();
    const newStatus = normalizedStatus === "active" ? "inactive" : "active";

    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );

    try {
      await candidateService.update(id, {
        status: newStatus,
        updated_by: getCurrentUserId(),
      });
      showSuccess(`Status updated to ${newStatus}`);
    } catch (err) {
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: normalizedStatus } : item,
        ),
      );
      console.error("Status toggle error:", err);
      showError(err.response?.data?.message || "Failed to update status");
    }
  };

  // Navigate to view page instead of opening popup
  const openView = (item) => {
    navigate(`/candidates/view/${item.id}`, { state: { item } });
  };

  const columns = [
    {
      header: "#",
      key: "id",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    // {
    //   header: "Photo",
    //   key: "profile_photo",
    //   render: (photo) =>
    //     photo ? (
    //       <img
    //         src={getFullImageUrl(photo)}
    //         alt="profile"
    //         className="w-8 h-8 object-cover rounded-full border border-gray-200"
    //         onError={(e) => {
    //           e.target.style.display = "none";
    //         }}
    //       />
    //     ) : (
    //       <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-medium">
    //         ?
    //       </div>
    //     ),
    // },
    {
      header: "Full Name",
      key: "first_name",
      render: (_, row) => (
        <span className="font-medium capitalize text-gray-800">
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    {
      header: "Email",
      key: "email",
      render: (v) => <span className="text-sm text-gray-500">{v}</span>,
    },
    {
      header: "Mobile",
      key: "mobile",
      render: (v) => <span className="text-sm text-gray-500">{v}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (status, row) => (
        <button
          onClick={() => handleStatusToggle(row.id, status)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            status === "active" ? "bg-[#2c0eee]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow ${
              status === "active" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      header: "Last Login",
      key: "last_login_at",
      render: (v) => (
        <span className="text-gray-500 text-sm">{v ? formatDate(v) : "—"}</span>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (id, row) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => openView(row)}
            className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-[#2c0eee] rounded-lg transition-colors"
            title="View Profile"
          >
            <MdVisibility size={16} />
          </button>
          {/* Edit button - Commented out */}
          {/* <button
            onClick={() => navigate(`/candidates/edit/${row.id}`, { state: { item: row } })}
            className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
            title="Edit"
          >
            <MdEdit size={16} />
          </button> */}
          <button
            onClick={() => setDeleteId(id)}
            className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
            title="Delete"
          >
            <MdDelete size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tabs = [
    { key: "all", label: "All", count: data.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage registered candidates
          </p>
        </div>
        {/* Add button - Commented out */}
        {/* <Button icon={MdAdd} onClick={() => navigate('/candidates/add')}>
          Add Candidate
        </Button> */}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top bar: search + tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <MdSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2c0eee] transition-colors"
            />
          </div>

          <div className="flex items-center gap-5 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  statusFilter === tab.key
                    ? "text-[#2c0eee]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    statusFilter === tab.key
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

        <Table
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage="No candidates found"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * limit + 1}
            {"–"}
            {Math.min(page * limit, filteredData.length)} of{" "}
            {filteredData.length} candidates
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Candidate"
        message="Delete this candidate? This action cannot be undone."
      />
    </div>
  );
};

export default Candidates;
