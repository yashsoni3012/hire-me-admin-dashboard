// // pages/subscriptions/SubscriptionPlanFeatures.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import {
//   MdArrowBack,
//   MdRefresh,
//   MdRemoveCircle,
//   MdCheckCircle,
//   MdCancel,
// } from "react-icons/md";
// import Button from "../../components/common/Button";
// import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
// import { subscriptionPlanFeatureService } from "../../services/subscriptionPlanFeature.service";
// import { showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// const API_BASE_URL = "https://apidata.hiremejobs.in";

// const SubscriptionPlanFeatures = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [plan, setPlan] = useState(null);
//   const [features, setFeatures] = useState([]);
//   const [userNameCache, setUserNameCache] = useState({});

//   // Fetch users for display names
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const users = await fetchUsers();
//         const userMap = {};
//         Object.keys(users).forEach((id) => {
//           userMap[id] = users[id].name;
//         });
//         setUserNameCache(userMap);
//       } catch (error) {
//         console.error("Failed to load users:", error);
//       }
//     };
//     loadUsers();
//   }, []);

//   // Fetch plan and features
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         // Get plan data
//         let planData = location.state?.item;
//         if (!planData) {
//           const planResponse = await subscriptionPlanService.getById(id);
//           planData = planResponse.data;
//         }
//         setPlan(planData);

//         // Get features
//         const featuresResponse =
//           await subscriptionPlanFeatureService.getByPlanId(id);

//         // Extract features from response
//         let featuresData = [];
//         if (Array.isArray(featuresResponse)) {
//           featuresData = featuresResponse;
//         } else if (Array.isArray(featuresResponse?.data)) {
//           featuresData = featuresResponse.data;
//         } else if (Array.isArray(featuresResponse?.results)) {
//           featuresData = featuresResponse.results;
//         } else if (Array.isArray(featuresResponse?.data?.data)) {
//           featuresData = featuresResponse.data.data;
//         } else if (Array.isArray(featuresResponse?.data?.results)) {
//           featuresData = featuresResponse.data.results;
//         }

//         setFeatures(featuresData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         showError(error.message || "Failed to load plan features");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, location.state]);

//   // Format date
//   const formatDateDisplay = (date) => {
//     if (!date) return "-";
//     return formatDate(date);
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
//     if (value.startsWith("./uploads/")) {
//       return `${API_BASE_URL}${value.substring(1)}`;
//     }
//     if (value.startsWith("/")) {
//       return `${API_BASE_URL}${value}`;
//     }
//     if (
//       !value.includes("/") &&
//       !value.includes("http") &&
//       !value.startsWith("data:")
//     ) {
//       return `${API_BASE_URL}/uploads/${value}`;
//     }
//     return value;
//   };

//   // Helper function to format feature value
//   const formatFeatureValue = (feature) => {
//     const rawValue = feature.value;
//     const featureType =
//       feature.SubscriptionFeature?.feature_type ||
//       feature.feature_type ||
//       feature.value_type ||
//       "string";
//     const isUnlimited =
//       feature.is_unlimited === true ||
//       feature.is_unlimited === 1 ||
//       feature.is_unlimited === "1";

//     if (isUnlimited) {
//       return { value: "♾️ Unlimited", isUnlimited: true };
//     }

//     if (featureType?.toUpperCase() === "BOOLEAN") {
//       if (
//         rawValue === true ||
//         rawValue === 1 ||
//         rawValue === "1" ||
//         rawValue === "true" ||
//         rawValue === "TRUE"
//       ) {
//         return { value: "✅ Yes", isUnlimited: false };
//       } else if (
//         rawValue === false ||
//         rawValue === 0 ||
//         rawValue === "0" ||
//         rawValue === "false" ||
//         rawValue === "FALSE"
//       ) {
//         return { value: "❌ No", isUnlimited: false };
//       } else {
//         return { value: rawValue || "-", isUnlimited: false };
//       }
//     }

//     if (rawValue === null || rawValue === undefined || rawValue === "") {
//       return { value: "-", isUnlimited: false };
//     }

//     return { value: String(rawValue), isUnlimited: false };
//   };

//   // Get status badge color
//   const getStatusBadge = (isActive) => {
//     return isActive
//       ? "bg-green-100 text-green-700"
//       : "bg-gray-100 text-gray-500";
//   };

//   const handleBack = () => {
//     navigate("/subscription-plans");
//   };

//   const handleRefresh = async () => {
//     setLoading(true);
//     try {
//       const featuresResponse =
//         await subscriptionPlanFeatureService.getByPlanId(id);
//       let featuresData = [];
//       if (Array.isArray(featuresResponse)) {
//         featuresData = featuresResponse;
//       } else if (Array.isArray(featuresResponse?.data)) {
//         featuresData = featuresResponse.data;
//       } else if (Array.isArray(featuresResponse?.results)) {
//         featuresData = featuresResponse.results;
//       } else if (Array.isArray(featuresResponse?.data?.data)) {
//         featuresData = featuresResponse.data.data;
//       } else if (Array.isArray(featuresResponse?.data?.results)) {
//         featuresData = featuresResponse.data.results;
//       }

//       setFeatures(featuresData);
//     } catch (error) {
//       console.error("Error refreshing features:", error);
//       showError("Failed to refresh features");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Loading state
//   if (loading && !plan) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-3 text-gray-500">Loading plan features...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleBack}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
//                 title="Go back"
//               >
//                 <MdArrowBack size={20} />
//               </button>
//               <div>
//                 <h1 className="text-xl font-semibold text-gray-900">
//                   Plan Features - {plan?.plan_name || "Loading..."}
//                 </h1>
//                 <p className="text-sm text-gray-500">
//                   {plan?.plan_code} • ₹{parseFloat(plan?.price || 0).toFixed(2)}{" "}
//                   • {plan?.duration_days || 30} days
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="px-3 py-1.5 bg-blue-50 text-[#2c0eee] rounded-full text-sm font-semibold">
//                 {features.length}{" "}
//                 {features.length === 1 ? "Feature" : "Features"}
//               </span>
//               <Button
//                 variant="secondary"
//                 icon={MdRefresh}
//                 onClick={handleRefresh}
//                 loading={loading}
//                 disabled={loading}
//               >
//                 Refresh
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Plan Info Card */}
//         {plan && (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
//             <div className="flex items-start gap-6">
//               {plan.icon && (
//                 <div className="flex-shrink-0">
//                   <img
//                     src={getFullImageUrl(plan.icon)}
//                     alt={plan.plan_name}
//                     className="w-16 h-16 rounded-lg object-cover border border-gray-200"
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                     }}
//                   />
//                 </div>
//               )}
//               <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <p className="text-xs text-gray-400">Plan Name</p>
//                   <p className="font-medium text-gray-800">{plan.plan_name}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400">Plan Code</p>
//                   <p className="font-medium text-gray-800 font-mono">
//                     {plan.plan_code}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400">Price</p>
//                   <p className="font-medium text-gray-800">
//                     ₹{parseFloat(plan.price || 0).toFixed(2)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400">Duration</p>
//                   <p className="font-medium text-gray-800">
//                     {plan.duration_days || 30} days
//                   </p>
//                 </div>
//                 {plan.badge && (
//                   <div>
//                     <p className="text-xs text-gray-400">Badge</p>
//                     <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
//                       {plan.badge}
//                     </span>
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-xs text-gray-400">Status</p>
//                   <span
//                     className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${plan.is_status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
//                   >
//                     <span
//                       className={`w-1.5 h-1.5 rounded-full ${plan.is_status ? "bg-green-500" : "bg-gray-400"}`}
//                     />
//                     {plan.is_status ? "Active" : "Inactive"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Features Table */}
//         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//           {features.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
//                 <MdRemoveCircle className="text-gray-400" size={36} />
//               </div>
//               <p className="text-lg font-medium text-gray-700">
//                 No Features Assigned
//               </p>
//               <p className="text-sm text-gray-400 mt-1">
//                 This plan doesn't have any features assigned yet.
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">
//                         #
//                       </th>
//                       <th className="text-left px-4 py-3 font-semibold text-gray-600">
//                         Feature
//                       </th>
//                       <th className="text-left px-4 py-3 font-semibold text-gray-600">
//                         Value
//                       </th>
//                       <th className="text-left px-4 py-3 font-semibold text-gray-600">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {features.map((feature, index) => {
//                       // Extract feature details
//                       const featureObj =
//                         feature.SubscriptionFeature ||
//                         feature.feature ||
//                         feature.subscription_feature ||
//                         {};

//                       const featureName =
//                         feature.display_value ||
//                         featureObj.display_value ||
//                         featureObj.feature_name ||
//                         feature.feature_name ||
//                         feature.name ||
//                         `Feature ${index + 1}`;
//                       const featureType =
//                         featureObj.feature_type ||
//                         feature.feature_type ||
//                         feature.value_type ||
//                         "string";
//                       const featureKey =
//                         featureObj.feature_key || feature.feature_key || "";

//                       // Format value
//                       const formatted = formatFeatureValue(feature);
//                       const displayValue =
//                         feature.display_value ||
//                         featureObj.display_value ||
//                         formatted.value;

//                       // Check status
//                       const isActive =
//                         feature.status === true ||
//                         feature.status === 1 ||
//                         feature.status === "1" ||
//                         feature.status === "active";

//                       return (
//                         <tr
//                           key={feature.id || index}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="px-4 py-3 text-gray-500 text-center">
//                             {index + 1}
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="text-gray-700">{featureName}</span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`font-medium ${formatted.isUnlimited ? "text-[#2c0eee]" : "text-gray-700"}`}
//                             >
//                               {String(feature.value).toLowerCase() === "true"
//                                 ? "Yes"
//                                 : String(feature.value).toLowerCase() ===
//                                     "false"
//                                   ? "No"
//                                   : displayValue}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(isActive)}`}
//                             >
//                               <span
//                                 className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
//                               />
//                               {isActive ? "Active" : "Inactive"}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Footer */}
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 bg-gray-50">
//                 <p className="text-xs text-gray-400">
//                   Showing all {features.length} features
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Last updated: {formatDateDisplay(plan?.updated_at)}
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPlanFeatures;

// pages/subscriptions/SubscriptionPlanFeatures.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  MdArrowBack,
  MdRefresh,
  MdRemoveCircle,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import Button from "../../components/common/Button";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import api from "../../services/axiosInstance";
import { showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Fetch features for a plan straight from the filtered endpoint ─────
// FIX: previously this went through subscriptionPlanFeatureService.getByPlanId(id),
// whose actual query we can't verify. Calling the endpoint directly with the
// subscription_plan_id query param guarantees we only ever get back features
// that are actually assigned to this plan.
const fetchPlanFeatures = async (planId) => {
  const response = await api.get("/subscription-plan-features", {
    params: { subscription_plan_id: planId },
  });

  const d = response?.data;
  let featuresData = [];
  if (Array.isArray(d)) featuresData = d;
  else if (Array.isArray(d?.data)) featuresData = d.data;
  else if (Array.isArray(d?.results)) featuresData = d.results;
  else if (Array.isArray(d?.data?.data)) featuresData = d.data.data;
  else if (Array.isArray(d?.data?.results)) featuresData = d.data.results;

  // Defensive filter: only keep rows that genuinely belong to this plan,
  // in case the endpoint ever returns anything extra/unrelated.
  return featuresData.filter(
    (f) => String(f.subscription_plan_id) === String(planId)
  );
};

const SubscriptionPlanFeatures = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [features, setFeatures] = useState([]);
  const [userNameCache, setUserNameCache] = useState({});

  // Fetch users for display names
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[id] = users[id].name;
        });
        setUserNameCache(userMap);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  // Fetch plan and features
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Get plan data
        let planData = location.state?.item;
        if (!planData) {
          const planResponse = await subscriptionPlanService.getById(id);
          planData = planResponse.data;
        }
        setPlan(planData);

        // Get features — filtered by subscription_plan_id
        const featuresData = await fetchPlanFeatures(id);
        setFeatures(featuresData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError(error.message || "Failed to load plan features");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, location.state]);

  // Format date
  const formatDateDisplay = (date) => {
    if (!date) return "-";
    return formatDate(date);
  };

  // Get full image URL
  const getFullImageUrl = (value) => {
    if (!value) return null;
    if (typeof value !== "string") return null;
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
    if (
      !value.includes("/") &&
      !value.includes("http") &&
      !value.startsWith("data:")
    ) {
      return `${API_BASE_URL}/uploads/${value}`;
    }
    return value;
  };

  // Helper function to format feature value
  const formatFeatureValue = (feature) => {
    const rawValue = feature.value;
    const featureType =
      feature.SubscriptionFeature?.feature_type ||
      feature.feature_type ||
      feature.value_type ||
      "string";
    const isUnlimited =
      feature.is_unlimited === true ||
      feature.is_unlimited === 1 ||
      feature.is_unlimited === "1";

    if (isUnlimited) {
      return { value: "♾️ Unlimited", isUnlimited: true };
    }

    if (featureType?.toUpperCase() === "BOOLEAN") {
      if (
        rawValue === true ||
        rawValue === 1 ||
        rawValue === "1" ||
        rawValue === "true" ||
        rawValue === "TRUE"
      ) {
        return { value: "✅ Yes", isUnlimited: false };
      } else if (
        rawValue === false ||
        rawValue === 0 ||
        rawValue === "0" ||
        rawValue === "false" ||
        rawValue === "FALSE"
      ) {
        return { value: "❌ No", isUnlimited: false };
      } else {
        return { value: rawValue || "-", isUnlimited: false };
      }
    }

    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return { value: "-", isUnlimited: false };
    }

    return { value: String(rawValue), isUnlimited: false };
  };

  // Get status badge color
  const getStatusBadge = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-500";
  };

  const handleBack = () => {
    navigate("/subscription-plans");
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const featuresData = await fetchPlanFeatures(id);
      setFeatures(featuresData);
    } catch (error) {
      console.error("Error refreshing features:", error);
      showError("Failed to refresh features");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-500">Loading plan features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                title="Go back"
              >
                <MdArrowBack size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Plan Features - {plan?.plan_name || "Loading..."}
                </h1>
                <p className="text-sm text-gray-500">
                  {plan?.plan_code} • ₹{parseFloat(plan?.price || 0).toFixed(2)}{" "}
                  • {plan?.duration_days || 30} days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-blue-50 text-[#2c0eee] rounded-full text-sm font-semibold">
                {features.length}{" "}
                {features.length === 1 ? "Feature" : "Features"}
              </span>
              <Button
                variant="secondary"
                icon={MdRefresh}
                onClick={handleRefresh}
                loading={loading}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Info Card */}
        {plan && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-start gap-6">
              {plan.icon && (
                <div className="flex-shrink-0">
                  <img
                    src={getFullImageUrl(plan.icon)}
                    alt={plan.plan_name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Plan Name</p>
                  <p className="font-medium text-gray-800">{plan.plan_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Plan Code</p>
                  <p className="font-medium text-gray-800 font-mono">
                    {plan.plan_code}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="font-medium text-gray-800">
                    ₹{parseFloat(plan.price || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="font-medium text-gray-800">
                    {plan.duration_days || 30} days
                  </p>
                </div>
                {plan.badge && (
                  <div>
                    <p className="text-xs text-gray-400">Badge</p>
                    <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${plan.is_status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${plan.is_status ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    {plan.is_status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {features.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MdRemoveCircle className="text-gray-400" size={36} />
              </div>
              <p className="text-lg font-medium text-gray-700">
                No Features Assigned
              </p>
              <p className="text-sm text-gray-400 mt-1">
                This plan doesn't have any features assigned yet.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">
                        #
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Feature
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Value
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {features.map((feature, index) => {
                      // Extract feature details
                      const featureObj =
                        feature.SubscriptionFeature ||
                        feature.feature ||
                        feature.subscription_feature ||
                        {};

                      const featureName =
                        feature.display_value ||
                        featureObj.display_value ||
                        featureObj.feature_name ||
                        feature.feature_name ||
                        feature.name ||
                        `Feature ${index + 1}`;
                      const featureType =
                        featureObj.feature_type ||
                        feature.feature_type ||
                        feature.value_type ||
                        "string";
                      const featureKey =
                        featureObj.feature_key || feature.feature_key || "";

                      // Format value
                      const formatted = formatFeatureValue(feature);
                      const displayValue =
                        feature.display_value ||
                        featureObj.display_value ||
                        formatted.value;

                      // Check status
                      const isActive =
                        feature.status === true ||
                        feature.status === 1 ||
                        feature.status === "1" ||
                        feature.status === "active";

                      return (
                        <tr
                          key={feature.id || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-500 text-center">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-700">{featureName}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-medium ${formatted.isUnlimited ? "text-[#2c0eee]" : "text-gray-700"}`}
                            >
                              {String(feature.value).toLowerCase() === "true"
                                ? "Yes"
                                : String(feature.value).toLowerCase() ===
                                    "false"
                                  ? "No"
                                  : displayValue}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(isActive)}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
                              />
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400">
                  Showing all {features.length} features
                </p>
                <p className="text-xs text-gray-400">
                  Last updated: {formatDateDisplay(plan?.updated_at)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanFeatures;