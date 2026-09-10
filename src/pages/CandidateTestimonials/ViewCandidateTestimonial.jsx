// // pages/candidate-testimonials/ViewCandidateTestimonial.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import { candidateTestimonialService } from "../../services/candidateTestimonial.service";
// import { showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";
// import { MdStar, MdStarHalf, MdStarBorder, MdImage } from "react-icons/md";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const ViewCandidateTestimonial = () => {
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

//   // Get full image URL
//   const getFullImageUrl = (value) => {
//     if (!value) return null;
//     if (typeof value !== "string") return null;
//     if (value.startsWith("http") || value.startsWith("data:image")) {
//       return value;
//     }
//     if (value.startsWith("/uploads/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     return value;
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
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((id) => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);

//         const response = await candidateTestimonialService.getById(id);
//         const data = response?.data || response;

//         if (data) {
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
//           navigate("/candidate-testimonials");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showError(error.message || "Failed to load testimonial data");
//         navigate("/candidate-testimonials");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchTestimonial();
//     }
//   }, [id, navigate]);

//   const handleEdit = () => {
//     navigate(`/candidate-testimonials/edit/${id}`);
//   };

//   // Form fields configuration - view only
//   const fields = [
//     {
//       name: "name",
//       label: "Candidate Name",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => (
//         <span className="font-medium text-gray-800">{value}</span>
//       ),
//     },
//     {
//       name: "email",
//       label: "Candidate Email",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => <span className="text-gray-600">{value}</span>,
//     },
//     {
//       name: "image",
//       label: "Candidate Image",
//       type: "text",
//       readonly: true,
//       viewRender: (value) => {
//         if (!value) return <span className="text-gray-400">No image</span>;
//         const fullUrl = getFullImageUrl(value);
//         return (
//           <div className="relative group inline-block">
//             <img
//               src={fullUrl}
//               alt="Candidate"
//               className="w-24 h-24 rounded-lg object-cover border border-gray-200 shadow-sm"
//               onError={(e) => {
//                 e.target.style.display = "none";
//                 e.target.parentElement.innerHTML =
//                   '<span class="text-gray-400">Invalid image</span>';
//               }}
//             />
//             <button
//               onClick={() => window.open(fullUrl, "_blank")}
//               className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
//               title="View full size"
//             >
//               <span className="text-xs">View</span>
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
//       title="Candidate Testimonial Details"
//       mode="view"
//       fields={fields}
//       initialData={initialData}
//       onSubmit={() => {}}
//       onEdit={handleEdit}
//       navigateTo="/candidate-testimonials"
//       breadcrumb={`Viewing: ${viewData?.name || "Testimonial"}`}
//       enableEditMode={true}
//       showEdit={true}
//       editLabel="Edit Testimonial"
//       cancelLabel="Back to Testimonials"
//     />
//   );
// };

// export default ViewCandidateTestimonial;

// pages/candidate-testimonials/ViewCandidateTestimonial.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdEdit,
  MdCancel,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdPerson,
  MdEmail,
  MdStar,
  MdStarHalf,
  MdStarBorder,
  MdImage,
  MdOpenInNew,
} from 'react-icons/md';
import { candidateTestimonialService } from '../../services/candidateTestimonial.service';
import { showError } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import { fetchUsers } from '../../utils/getUserName';

const API_BASE_URL = 'https://apidata.hiremejobs.in';

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
    icon: MdCheckCircle,
  },
  inactive: {
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
    dot: 'bg-slate-400',
    icon: MdErrorOutline,
  },
};

const StatusPill = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.inactive;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
  </label>
);

const ReadOnlyValue = ({ children }) => (
  <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
    {children || '—'}
  </div>
);

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: MdInfo },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const ViewCandidateTestimonial = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [testimonialData, setTestimonialData] = useState(null);
  const [userNameCache, setUserNameCache] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return '—';
    const key = String(userId);
    return userNameCache[key] || `User ${userId}`;
  };

  // Get full image URL
  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (typeof value !== 'string') return null;
    if (value.startsWith('http') || value.startsWith('data:image')) return value;
    if (value.startsWith('/uploads/')) return `${API_BASE_URL}${value}`;
    return value;
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const totalStars = 5;

    for (let i = 1; i <= totalStars; i++) {
      if (i <= fullStars) {
        stars.push(<MdStar key={i} className="text-yellow-400 inline" size={20} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<MdStarHalf key={i} className="text-yellow-400 inline" size={20} />);
      } else {
        stars.push(<MdStarBorder key={i} className="text-slate-300 inline" size={20} />);
      }
    }
    return stars;
  };

  // ─── Fetch testimonial data ─────────────────────────────────
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

        const response = await candidateTestimonialService.getById(id);
        const data = response?.data || response;

        if (data) {
          setTestimonialData({
            id: data.id,
            name: data.name || '',
            email: data.email || '',
            image: data.image || null,
            rating: data.rating || 0,
            description: data.description || '',
            status: data.is_status ? 'active' : 'inactive',
            created_by: data.created_by || null,
            updated_by: data.updated_by || null,
            created_at: data.created_at || data.createdAt || null,
            updated_at: data.updated_at || data.updatedAt || null,
          });
        } else {
          showError('Testimonial not found');
          navigate('/candidate-testimonials');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || 'Failed to load testimonial data');
        navigate('/candidate-testimonials');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTestimonial();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/candidate-testimonials/edit/${id}`);
  };

  const handleBack = () => navigate('/candidate-testimonials');

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading testimonial details...</p>
        </div>
      </div>
    );
  }

  if (!testimonialData) {
    return null;
  }

  // ─── Compute hero data ────────────────────────────────────
  const candidateName = testimonialData.name || 'Testimonial';
  const email = testimonialData.email || '';
  const rating = parseFloat(testimonialData.rating) || 0;
  const description = testimonialData.description || '';
  const status = testimonialData.status || 'inactive';
  const imageUrl = getFullImageUrl(testimonialData.image);
  const createdDate = testimonialData.created_at
    ? formatDate(testimonialData.created_at)
    : '—';
  const updatedDate = testimonialData.updated_at
    ? formatDate(testimonialData.updated_at)
    : '—';

  const initials = candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Render tab content ──────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Candidate Name</FieldLabel>
                <ReadOnlyValue>
                  <span className="font-medium text-lg">{candidateName}</span>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Candidate Email</FieldLabel>
                <ReadOnlyValue>
                  <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                    {email || '—'}
                  </a>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Rating</FieldLabel>
                <ReadOnlyValue>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(rating)}
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      ({rating})
                    </span>
                  </div>
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <ReadOnlyValue>
                  <StatusPill status={status} />
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>ID</FieldLabel>
                <ReadOnlyValue>#{testimonialData.id}</ReadOnlyValue>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Candidate Image</FieldLabel>
                <ReadOnlyValue>
                  {imageUrl ? (
                    <div className="relative group inline-block">
                      <img
                        src={imageUrl}
                        alt="Candidate"
                        className="w-24 h-24 rounded-lg object-cover border border-slate-200 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white"
                        title="View full size"
                      >
                        <MdOpenInNew size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400">No image</span>
                  )}
                </ReadOnlyValue>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Testimonial</FieldLabel>
                <div className="text-sm text-slate-700 leading-relaxed italic whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {description ? `"${description}"` : '—'}
                </div>
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdHistory size={16} />
                  Audit Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <FieldLabel>Created By</FieldLabel>
                  <ReadOnlyValue>
                    {testimonialData.created_by
                      ? getUserNameCached(testimonialData.created_by)
                      : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Created At</FieldLabel>
                  <ReadOnlyValue>{createdDate}</ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated By</FieldLabel>
                  <ReadOnlyValue>
                    {testimonialData.updated_by
                      ? getUserNameCached(testimonialData.updated_by)
                      : '—'}
                  </ReadOnlyValue>
                </div>
                <div>
                  <FieldLabel>Last Updated At</FieldLabel>
                  <ReadOnlyValue>{updatedDate}</ReadOnlyValue>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ──────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar (light) ───────────────────────── */}
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
              <p className="text-[11px] text-slate-400 leading-tight">Candidate Testimonials</p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {candidateName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
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
        {/* ─── Hero (fixed dark gradient) ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 shadow-xl flex-shrink-0 border border-white/10">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Candidate"
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {initials || <MdPerson size={24} />}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {candidateName}
                  </h1>
                  <StatusPill status={status} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {email && (
                    <span className="text-xs text-white/70 flex items-center gap-1">
                      <MdEmail size={12} /> {email}
                    </span>
                  )}
                  {rating > 0 && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <MdStar size={12} /> {rating} stars
                      </span>
                    </>
                  )}
                  <span className="text-xs text-white/70">•</span>
                  <span className="text-xs text-white/70">ID: #{testimonialData.id}</span>
                  {testimonialData.created_at && (
                    <>
                      <span className="text-xs text-white/70">•</span>
                      <span className="text-xs text-white/70">Created: {createdDate}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip (light) ────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdInfo size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Status</p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdStar size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Rating</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {rating}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdImage size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Photo</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {imageUrl ? 'Uploaded' : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdPerson size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Created By</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {testimonialData.created_by
                  ? getUserNameCached(testimonialData.created_by)
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs (light theme) ───────────────────────────────── */}
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
                    active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="view-candidate-testimonial-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
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

export default ViewCandidateTestimonial;