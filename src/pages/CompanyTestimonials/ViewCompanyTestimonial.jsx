// // pages/ViewCompanyTestimonial.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import { companyTestimonialService } from "../../services/companyTestimonial.service";
// import { showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";
// import { MdStar, MdStarHalf, MdStarBorder, MdImage } from "react-icons/md";

// // IMPORTANT: Use the correct API base URL
// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const ViewCompanyTestimonial = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [initialData, setInitialData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userNameCache, setUserNameCache] = useState({});

//   // Get user name with caching
//   const getUserNameCached = (userId) => {
//     if (!userId) return "-";
//     return userNameCache[userId] || `User ${userId}`;
//   };

//   // Get full image URL - FIXED for proper image fetching
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (typeof value !== "string") return null;

//     // If it's already a full URL, return as is
//     if (value.startsWith("http://") || value.startsWith("https://")) {
//       return value;
//     }

//     // If it's a data URL (base64), return as is
//     if (value.startsWith("data:image")) {
//       return value;
//     }

//     // If it starts with /uploads/, prepend the base URL
//     if (value.startsWith("/uploads/")) {
//       return `${API_BASE_URL}${value}`;
//     }

//     // If it doesn't start with /uploads/ but is a path
//     if (value.startsWith("/")) {
//       return `${API_BASE_URL}${value}`;
//     }

//     // If it doesn't start with /, add /uploads/ and base URL
//     return `${API_BASE_URL}/uploads/${value}`;
//   };

//   // Render star rating
//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
//     const totalStars = 5;

//     for (let i = 1; i <= totalStars; i++) {
//       if (i <= fullStars) {
//         stars.push(
//           <MdStar key={i} className="text-yellow-400 inline" size={20} />,
//         );
//       } else if (i === fullStars + 1 && hasHalfStar) {
//         stars.push(
//           <MdStarHalf key={i} className="text-yellow-400 inline" size={20} />,
//         );
//       } else {
//         stars.push(
//           <MdStarBorder key={i} className="text-gray-300 inline" size={20} />,
//         );
//       }
//     }
//     return stars;
//   };

//   // Fetch testimonial data
//   useEffect(() => {
//     const fetchTestimonial = async () => {
//       setLoading(true);
//       try {
//         // Fetch users for names
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((id) => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);

//         const response = await companyTestimonialService.getById(id);
//         const data = response?.data || response;

//         if (data && data.id) {
//           const formData = {
//             name: data.name || "",
//             email: data.email || "",
//             image: data.image || null,
//             rating: data.rating || 0,
//             description: data.description || "",
//             status: data.is_status ? "active" : "inactive",
//             created_by: data.created_by || "-",
//             updated_by: data.updated_by || "-",
//             created_at: data.created_at || data.createdAt || null,
//             updated_at: data.updated_at || data.updatedAt || null,
//           };
//           setInitialData(formData);
//           setViewData(data);
//         } else {
//           showError("Testimonial not found");
//           navigate("/company-testimonials");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load testimonial data");
//         navigate("/company-testimonials");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchTestimonial();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/company-testimonials/edit/${id}`);
//   };

//   // Form fields configuration - view only with image
//   const fields = [
//     {
//       name: "name",
//       label: "Company Name",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "email",
//       label: "Company Email",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <span className="text-gray-600">{value}</span>,
//     },
//     {
//       name: "image",
//       label: "Company Image",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         if (!value) {
//           return (
//             <div className="flex flex-col items-start gap-2">
//               <div className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
//                 <MdImage className="text-gray-400" size={32} />
//               </div>
//               <span className="text-sm text-gray-400">No image</span>
//             </div>
//           );
//         }

//         const fullUrl = getFullImageUrl(value);

//         if (!fullUrl) {
//           return (
//             <div className="flex flex-col items-start gap-2">
//               <div className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
//                 <MdImage className="text-gray-400" size={32} />
//               </div>
//               <span className="text-sm text-red-400">Invalid image path</span>
//             </div>
//           );
//         }

//         return (
//           <div className="relative group inline-block">
//             <img
//               src={fullUrl}
//               alt="Company"
//               className="w-24 h-24 rounded-lg object-cover border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//               onError={(e) => {
//                 console.error("❌ Image failed to load:", fullUrl);
//                 e.target.style.display = "none";
//                 e.target.parentElement.innerHTML = `
//                   <div class="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
//                     <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
//                     </svg>
//                   </div>
//                   <span class="text-sm text-red-400 mt-1">Failed to load</span>
//                 `;
//               }}
//               loading="lazy"
//             />
//             <button
//               onClick={() => window.open(fullUrl, "_blank")}
//               className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//               title="View full size"
//             >
//               <span className="text-xs font-medium">View</span>
//             </button>
//           </div>
//         );
//       },
//     },
//     {
//       name: "rating",
//       label: "Rating",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const rating = parseFloat(value);
//         return (
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-1">{renderStars(rating)}</div>
//             <span className="text-sm font-medium text-gray-600">
//               ({rating})
//             </span>
//           </div>
//         );
//       },
//     },
//     {
//       name: "description",
//       label: "Testimonial",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-w-2xl">
//           <p className="text-gray-700 italic leading-relaxed">"{value}"</p>
//         </div>
//       ),
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span
//           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
//             value === "active"
//               ? "bg-green-50 text-green-700"
//               : "bg-gray-100 text-gray-500"
//           }`}
//         >
//           <span
//             className={`w-1.5 h-1.5 rounded-full ${
//               value === "active" ? "bg-green-500" : "bg-gray-400"
//             }`}
//           />
//           {value === "active" ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//     {
//       name: "created_by",
//       label: "Created By",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const name = getUserNameCached(value);
//         return <span className="text-gray-600">{name}</span>;
//       },
//     },
//     {
//       name: "updated_by",
//       label: "Updated By",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         const name = getUserNameCached(value);
//         return <span className="text-gray-600">{name}</span>;
//       },
//     },
//     {
//       name: "created_at",
//       label: "Created At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (value ? formatDate(value) : "—"),
//     },
//     {
//       name: "updated_at",
//       label: "Updated At",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (value ? formatDate(value) : "—"),
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">
//             Loading testimonial details...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Company Testimonial Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/company-testimonials"
//       breadcrumb={`Viewing: ${viewData?.name || "Testimonial"}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Testimonial"
//       cancelLabel="Back to Testimonials"
//     />
//   );
// };

// export default ViewCompanyTestimonial;

// pages/ViewCompanyTestimonial.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdStar,
  MdStarHalf,
  MdStarBorder,
  MdImage,
  MdPerson,
  MdEmail,
  MdFlag,
  MdInfoOutline,
  MdCheckCircle,
  MdErrorOutline,
  MdDateRange,
  MdRateReview,
} from "react-icons/md";
import { companyTestimonialService } from "../../services/companyTestimonial.service";
import { showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

// IMPORTANT: Use the correct API base URL
const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
  </label>
);

// ─── Status pill ────────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: MdCheckCircle,
  },
  inactive: {
    pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    icon: MdErrorOutline,
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.inactive;
  const Icon = style.icon;
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {label}
    </span>
  );
};

// ─── Star rating render ─────────────────────────────────────────
const renderStars = (rating, size = 20) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= fullStars) {
      stars.push(
        <MdStar key={i} className="text-yellow-400 inline" size={size} />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <MdStarHalf key={i} className="text-yellow-400 inline" size={size} />
      );
    } else {
      stars.push(
        <MdStarBorder key={i} className="text-slate-300 inline" size={size} />
      );
    }
  }
  return stars;
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdInfoOutline },
  { id: "metadata", label: "Metadata", icon: MdDateRange },
];

// ─── Main Component ──────────────────────────────────────────────
const ViewCompanyTestimonial = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [testimonialData, setTestimonialData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "—";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Get full image URL
  const getFullImageUrl = (value) => {
    if (!value || typeof value !== "string") return null;

    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    if (value.startsWith("data:image")) return value;
    if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
    if (value.startsWith("/")) return `${API_BASE_URL}${value}`;
    return `${API_BASE_URL}/uploads/${value}`;
  };

  // ─── Fetch testimonial data ──────────────────────────────────
  useEffect(() => {
    const fetchTestimonial = async () => {
      setLoading(true);
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users || {}).forEach((uid) => {
          userMap[uid] = users[uid]?.name ?? users[uid];
        });
        setUserNameCache(userMap);

        const response = await companyTestimonialService.getById(id);
        const data = response?.data || response;

        if (data && (data.id || data.name)) {
          setTestimonialData({
            id: data.id,
            name: data.name || "",
            email: data.email || "",
            image: data.image || null,
            rating: parseFloat(data.rating) || 0,
            description: data.description || "",
            status: data.is_status ? "active" : "inactive",
            created_by: data.created_by ?? null,
            updated_by: data.updated_by ?? null,
            created_at: data.created_at || data.createdAt || null,
            updated_at: data.updated_at || data.updatedAt || null,
          });
        } else {
          showError("Testimonial not found");
          navigate("/company-testimonials");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load testimonial data");
        navigate("/company-testimonials");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTestimonial();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/company-testimonials/edit/${id}`);
  };

  const handleBack = () => navigate("/company-testimonials");

  // ─── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">
            Loading testimonial details...
          </p>
        </div>
      </div>
    );
  }

  if (!testimonialData) {
    return null;
  }

  // ─── Hero helpers ──────────────────────────────────────────────
  const companyName = testimonialData.name || "Testimonial";
  const initials = companyName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const imageUrl = getFullImageUrl(testimonialData.image);
  const createdDate = testimonialData.created_at
    ? formatDate(testimonialData.created_at)
    : "—";
  const updatedDate = testimonialData.updated_at
    ? formatDate(testimonialData.updated_at)
    : "—";

  // ─── Render tab content ──────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Company Name */}
              <div>
                <FieldLabel>Company Name</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={companyName}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <FieldLabel>Company Email</FieldLabel>
                <div className="relative">
                  <MdEmail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={testimonialData.email || "—"}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <FieldLabel>Status</FieldLabel>
                <div className="pt-1.5">
                  <StatusPill status={testimonialData.status} />
                </div>
              </div>

              {/* Rating */}
              <div>
                <FieldLabel>Rating</FieldLabel>
                <div className="flex items-center gap-2 pt-1.5">
                  <div className="flex items-center gap-1">
                    {renderStars(testimonialData.rating, 20)}
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    ({testimonialData.rating || 0})
                  </span>
                </div>
              </div>

              {/* Company Image */}
              <div className="sm:col-span-2">
                <FieldLabel>Company Image</FieldLabel>
                {imageUrl ? (
                  <div className="relative group inline-block">
                    <img
                      src={imageUrl}
                      alt="Company"
                      className="w-28 h-28 rounded-xl object-cover border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      onError={(e) => {
                        console.error("Image failed:", imageUrl);
                        e.target.style.display = "none";
                      }}
                      loading="lazy"
                    />
                    <button
                      onClick={() => window.open(imageUrl, "_blank")}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-medium"
                      title="View full size"
                    >
                      View
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-2">
                    <div className="w-28 h-28 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <MdImage className="text-slate-400" size={32} />
                    </div>
                    <span className="text-sm text-slate-400">No image</span>
                  </div>
                )}
              </div>

              {/* Testimonial Description */}
              <div className="sm:col-span-2">
                <FieldLabel>Testimonial</FieldLabel>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-slate-700 italic leading-relaxed text-sm">
                    "{testimonialData.description || "No description"}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "metadata":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Created By</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      testimonialData.created_by
                        ? getUserNameCached(testimonialData.created_by)
                        : "—"
                    }
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated By</FieldLabel>
                <div className="relative">
                  <MdPerson
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={
                      testimonialData.updated_by
                        ? getUserNameCached(testimonialData.updated_by)
                        : "—"
                    }
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Created At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={createdDate}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Updated At</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={updatedDate}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Company Testimonials
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <MdCancel size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
            >
              <MdEdit size={16} />
              Edit Testimonial
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5"
        >
          <div className="relative h-44 sm:h-52 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={companyName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdRateReview size={24} />}
                  </div>
                )}
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {companyName}
                  </h1>
                  <StatusPill status={testimonialData.status} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-0.5">
                    {renderStars(testimonialData.rating, 14)}
                  </div>
                  <span className="text-xs text-white/80">
                    {testimonialData.rating} / 5
                  </span>
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">
                    ID: #{testimonialData.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdFlag size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {testimonialData.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdStar size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Rating</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {testimonialData.rating} / 5
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Created By
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {testimonialData.created_by
                  ? getUserNameCached(testimonialData.created_by)
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Last Updated
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {updatedDate}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ───────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-200 px-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="view-testimonial-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only back button */}
        <button
          type="button"
          onClick={handleBack}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Back to Testimonials
        </button>
      </div>
    </div>
  );
};

export default ViewCompanyTestimonial;