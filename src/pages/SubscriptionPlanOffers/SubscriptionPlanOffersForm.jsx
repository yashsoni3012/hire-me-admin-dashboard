// import React, { useEffect, useState } from "react";
// import {
//     useNavigate,
//     useLocation,
//     useParams,
// } from "react-router-dom";

// import FormPage from "../../components/common/FormPage";
// import { ViewBadge } from "../../components/common/FormPageUtils";

// import { subscriptionPlanOfferService } from "../../services/subscriptionPlanOffer.service";
// import { subscriptionPlanService } from "../../services/subscriptionPlan.service";

// import { showSuccess, showError } from "../../utils/toast";
// import { formatDate } from "../../utils/helpers";
// import { fetchUsers } from "../../utils/getUserName";

// import { useAuth } from "../../context/AuthContext";


// const SubscriptionPlanOffersForm = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { id } = useParams();

//     const { user } = useAuth();
//     const userId = user?.id;

//     const [mode, setMode] = useState("add");

//     const [loading, setLoading] = useState(false);
//     const [pageLoading, setPageLoading] = useState(false);

//     const [data, setData] = useState(null);

//     const [subscriptionPlans, setSubscriptionPlans] = useState([]);
//     const [loadingPlans, setLoadingPlans] = useState(false);

//     const [userNameCache, setUserNameCache] = useState({});

//     const normalizePlanIds = (value) => {
//         if (value === null || value === undefined || value === "") {
//             return [];
//         }

//         let values = [];

//         // Array
//         if (Array.isArray(value)) {
//             values = value;
//         }

//         // String JSON array:
//         // "[1,2,3]"
//         else if (
//             typeof value === "string" &&
//             value.trim().startsWith("[")
//         ) {
//             try {
//                 const parsed = JSON.parse(value);

//                 if (Array.isArray(parsed)) {
//                     values = parsed;
//                 } else {
//                     values = [parsed];
//                 }
//             } catch {
//                 values = [value];
//             }
//         }

//         // Comma separated:
//         // "1,2,3"
//         else if (
//             typeof value === "string" &&
//             value.includes(",")
//         ) {
//             values = value.split(",");
//         }

//         // Single value
//         else {
//             values = [value];
//         }

//         return [
//             ...new Set(
//                 values
//                     .map((item) => {
//                         if (
//                             item &&
//                             typeof item === "object"
//                         ) {
//                             return (
//                                 item.subscription_plan_id ??
//                                 item.id ??
//                                 item._id
//                             );
//                         }

//                         return item;
//                     })
//                     .map(Number)
//                     .filter(
//                         (value) =>
//                             Number.isInteger(value) &&
//                             value > 0
//                     )
//             ),
//         ];
//     };
//     const getSubscriptionPlanIds = (item) => {
//         if (!item) {
//             return [];
//         }

//         // Try all possible API formats.
//         const value =
//             item.subscription_plan_id ??
//             item.subscription_plan_ids ??
//             item.subscription_plan ??
//             item.SubscriptionPlan?.id ??
//             item.SubscriptionPlan?._id ??
//             null;

//         return normalizePlanIds(value);
//     };

//     const normalizeBoolean = (value) => {
//         return (
//             value === true ||
//             value === 1 ||
//             value === "1" ||
//             value === "true"
//         );
//     };


//     const extractApiData = (response) => {
//         const result =
//             response?.data?.data ??
//             response?.data?.result ??
//             response?.data?.results ??
//             response?.data ??
//             response;

//         return result;
//     };


//     const formatCurrency = (value) => {
//         const number = Number(value);

//         if (!Number.isFinite(number)) {
//             return "0.00";
//         }

//         return number.toFixed(2);
//     };

//     const getUserNameCached = (userIdValue) => {
//         if (
//             userIdValue === null ||
//             userIdValue === undefined ||
//             userIdValue === ""
//         ) {
//             return "-";
//         }

//         return (
//             userNameCache[userIdValue] ||
//             `User ${userIdValue}`
//         );
//     };


//     const getStatusValue = (row) => {
//         if (!row) {
//             return true;
//         }

//         return normalizeBoolean(
//             row.is_status ??
//             row.status
//         );
//     };

//     useEffect(() => {
//         const path = location.pathname;

//         if (path.includes("/view/")) {
//             setMode("view");
//         } else if (path.includes("/edit/")) {
//             setMode("edit");
//         } else {
//             setMode("add");
//         }
//     }, [location.pathname]);

//     useEffect(() => {
//         let mounted = true;

//         const loadPlans = async () => {
//             setLoadingPlans(true);

//             try {
//                 const response =
//                     await subscriptionPlanService.getAll({
//                         limit: 1000,
//                     });

//                 const rawData =
//                     response?.data?.data ??
//                     response?.data?.results ??
//                     response?.data ??
//                     [];

//                 const plans = Array.isArray(rawData)
//                     ? rawData
//                     : [];

//                 if (mounted) {
//                     setSubscriptionPlans(plans);
//                 }
//             } catch (error) {
//                 console.error(
//                     "Failed to fetch subscription plans:",
//                     error
//                 );

//                 if (mounted) {
//                     setSubscriptionPlans([]);
//                 }
//             } finally {
//                 if (mounted) {
//                     setLoadingPlans(false);
//                 }
//             }
//         };

//         loadPlans();

//         return () => {
//             mounted = false;
//         };
//     }, []);


//     useEffect(() => {
//         let mounted = true;

//         const loadUsers = async () => {
//             try {
//                 const users = await fetchUsers();

//                 if (!users || typeof users !== "object") {
//                     return;
//                 }

//                 const userMap = {};

//                 Object.keys(users).forEach((key) => {
//                     userMap[key] =
//                         users[key]?.name ||
//                         users[key]?.username ||
//                         `User ${key}`;
//                 });

//                 if (mounted) {
//                     setUserNameCache(userMap);
//                 }
//             } catch (error) {
//                 console.error(
//                     "Failed to load users:",
//                     error
//                 );
//             }
//         };

//         loadUsers();

//         return () => {
//             mounted = false;
//         };
//     }, []);
//     useEffect(() => {
//         let mounted = true;

//         const fetchOffer = async () => {
//             if (
//                 (mode !== "edit" && mode !== "view") ||
//                 !id
//             ) {
//                 return;
//             }

//             setPageLoading(true);

//             try {
//                 let item = location.state?.item;

//                 if (!item) {
//                     const response =
//                         await subscriptionPlanOfferService.getById(
//                             id
//                         );

//                     item = extractApiData(response);
//                 }

//                 /**
//                  * If API returns:
//                  *
//                  * {
//                  *   success: true,
//                  *   data: {...}
//                  * }
//                  *
//                  * extractApiData handles it.
//                  */

//                 if (
//                     !item ||
//                     typeof item !== "object" ||
//                     Array.isArray(item)
//                 ) {
//                     throw new Error(
//                         "Invalid subscription plan offer response"
//                     );
//                 }

//                 const subscriptionPlanIds =
//                     getSubscriptionPlanIds(item);

//                 const normalizedData = {
//                     id:
//                         item.id ??
//                         item._id ??
//                         id,

//                     subscription_plan_id:
//                         subscriptionPlanIds,

//                     offer_name:
//                         item.offer_name ?? "",

//                     offer_type:
//                         item.offer_type ?? "",

//                     offer_value:
//                         Number.isFinite(
//                             Number(item.offer_value)
//                         )
//                             ? Number(item.offer_value)
//                             : 0,

//                     start_date:
//                         item.start_date ??
//                         null,

//                     end_date:
//                         item.end_date ??
//                         null,

//                     coupon_required:
//                         normalizeBoolean(
//                             item.coupon_required
//                         ),

//                     status:
//                         normalizeBoolean(
//                             item.status
//                         ),

//                     is_status:
//                         normalizeBoolean(
//                             item.status
//                         ),

//                     created_by:
//                         item.created_by ??
//                         null,

//                     updated_by:
//                         item.updated_by ??
//                         null,

//                     created_at:
//                         item.created_at ??
//                         item.createdAt ??
//                         null,

//                     updated_at:
//                         item.updated_at ??
//                         item.updatedAt ??
//                         null,

//                     SubscriptionPlan:
//                         item.SubscriptionPlan ??
//                         null,

//                     plan_name:
//                         item.SubscriptionPlan?.plan_name ??
//                         "",

//                     plan_code:
//                         item.SubscriptionPlan?.plan_code ??
//                         "",

//                     plan_price:
//                         item.SubscriptionPlan?.price ??
//                         0,

//                     raw: item,
//                 };


//                 if (mounted) {
//                     setData(normalizedData);
//                 }

//             } catch (error) {
//                 console.error(
//                     "Fetch subscription plan offer error:",
//                     error
//                 );

//                 if (mounted) {
//                     showError(
//                         error?.response?.data?.message ||
//                         error?.message ||
//                         "Failed to load subscription plan offer data"
//                     );

//                     navigate(
//                         "/subscription-plan-offers"
//                     );
//                 }
//             } finally {
//                 if (mounted) {
//                     setPageLoading(false);
//                 }
//             }
//         };

//         fetchOffer();

//         return () => {
//             mounted = false;
//         };
//     }, [
//         id,
//         mode,
//         location.state,
//         navigate,
//     ]);


//     const getFields = () => {
//         const planOptions = subscriptionPlans
//             .map((plan) => {
//                 const planId = Number(
//                     plan.id ??
//                     plan._id ??
//                     plan.subscription_plan_id
//                 );

//                 if (
//                     !Number.isInteger(planId) ||
//                     planId <= 0
//                 ) {
//                     return null;
//                 }

//                 return {
//                     value: planId,
//                     label: `${plan.plan_name ?? "Unnamed Plan"} (₹${formatCurrency(
//                         plan.price ?? 0
//                     )})`,
//                 };
//             })
//             .filter(Boolean);


//         const offerTypeOptions = [
//             {
//                 value: "percentage",
//                 label: "Percentage (%)",
//             },
//             {
//                 value: "fixed",
//                 label: "Fixed Amount (₹)",
//             },
//             {
//                 value: "free_trial",
//                 label: "Free Trial",
//             },
//         ];


//         const baseFields = [{
//             name: "subscription_plan_id",
//             label: "Subscription Plan",
//             type: "select",
//             multiple: true,
//             required: true,

//             options: planOptions,

//             placeholder: loadingPlans
//                 ? "Loading plans..."
//                 : "Select subscription plan(s)",

//             help:
//                 "Select one or more subscription plans",

//             viewRender: (value) => {
//                 const ids =
//                     normalizePlanIds(value);

//                 if (ids.length === 0) {
//                     return "—";
//                 }

//                 const names = ids.map(
//                     (planId) => {
//                         const plan =
//                             subscriptionPlans.find(
//                                 (p) =>
//                                     Number(
//                                         p.id ??
//                                         p._id ??
//                                         p.subscription_plan_id
//                                     ) === planId
//                             );

//                         return (
//                             plan?.plan_name ||
//                             `Plan ${planId}`
//                         );
//                     }
//                 );

//                 return names.join(", ");
//             },
//         },


//         {
//             name: "offer_name",
//             label: "Offer Name",
//             type: "text",
//             required: true,
//             placeholder:
//                 "e.g. Summer Sale 2026",
//             help:
//                 "Enter a descriptive name for the offer",

//             viewRender: (value) => (
//                 <span className="font-medium text-lg">
//                     {value || "—"}
//                 </span>
//             ),
//         },


//         {
//             name: "offer_type",
//             label: "Offer Type",
//             type: "select",
//             required: true,
//             options: offerTypeOptions,
//             placeholder:
//                 "Select offer type",

//             viewRender: (value) => (
//                 <span className="capitalize">
//                     {value || "—"}
//                 </span>
//             ),
//         },


//         {
//             name: "offer_value",
//             label: "Offer Value",
//             type: "number",
//             required: true,
//             min: 0,
//             max: 9999999,
//             step: "0.01",
//             placeholder:
//                 "Enter offer value",

//             help:
//                 "Percentage: 0–100 | Fixed amount: maximum ₹9,999,999",

//             viewRender: (value, row) => {
//                 const number = Number(value);

//                 const formatted =
//                     Number.isFinite(number)
//                         ? number.toFixed(2)
//                         : "0.00";

//                 if (
//                     row?.offer_type ===
//                     "percentage"
//                 ) {
//                     return (
//                         <span className="font-semibold text-[#2c0eee] text-lg">
//                             {formatted}%
//                         </span>
//                     );
//                 }

//                 return (
//                     <span className="font-semibold text-[#2c0eee] text-lg">
//                         ₹{formatted}
//                     </span>
//                 );
//             },
//         },


//         {
//             name: "start_date",
//             label: "Start Date",
//             type: "date",
//             required: true,
//             help:
//                 "When the offer starts",

//             viewRender: (value) =>
//                 value
//                     ? formatDate(value)
//                     : "—",
//         },


//         {
//             name: "end_date",
//             label: "End Date",
//             type: "date",
//             required: true,
//             help:
//                 "When the offer ends",

//             viewRender: (value) =>
//                 value
//                     ? formatDate(value)
//                     : "—",
//         },


//         {
//             name: "coupon_required",
//             label: "Coupon Required",
//             type: "checkbox",

//             color:
//                 "text-[#2c0eee] focus:ring-[#4529f7]",

//             help:
//                 "Check if a coupon code is required to apply this offer",

//             viewRender: (value) => (
//                 <span
//                     className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value
//                         ? "bg-blue-50 text-[#2c0eee]"
//                         : "bg-gray-50 text-gray-500"
//                         }`}
//                 >
//                     {value ? "Yes" : "No"}
//                 </span>
//             ),
//         },


//         {
//             name: "status",
//             label: "Status",
//             type: "radio",

//             options: [
//                 {
//                     value: "active",
//                     label: "Active",
//                 },
//                 {
//                     value: "inactive",
//                     label: "Inactive",
//                 },
//             ],

//             color:
//                 "text-[#2c0eee] focus:ring-[#4529f7]",

//             viewRender: () => (
//                 <ViewBadge
//                     active={getStatusValue(data)}
//                 />
//             ),
//         },
//         ];

//         if (mode === "view") {
//             return [
//                 ...baseFields,

//                 {
//                     name: "created_by",
//                     label: "Created By",
//                     type: "text",
//                     disabled: true,

//                     viewRender: (value) => {
//                         const name =
//                             getUserNameCached(value);

//                         return name !== "-"
//                             ? name
//                             : "System";
//                     },
//                 },

//                 {
//                     name: "updated_by",
//                     label: "Updated By",
//                     type: "text",
//                     disabled: true,

//                     viewRender: (value) => {
//                         if (
//                             value === null ||
//                             value === undefined ||
//                             value === ""
//                         ) {
//                             return "—";
//                         }

//                         const name =
//                             getUserNameCached(value);

//                         return name !== "-"
//                             ? name
//                             : "System";
//                     },
//                 },

//                 {
//                     name: "created_at",
//                     label: "Created At",
//                     type: "text",
//                     disabled: true,

//                     viewRender: (value) =>
//                         value
//                             ? formatDate(value)
//                             : "—",
//                 },

//                 {
//                     name: "updated_at",
//                     label: "Updated At",
//                     type: "text",
//                     disabled: true,

//                     viewRender: (value) =>
//                         value
//                             ? formatDate(value)
//                             : "—",
//                 },
//             ];
//         }


//         return baseFields;
//     };

//     const normalizeDateOnly = (value) => {
//         if (!value) {
//             return "";
//         }

//         if (
//             typeof value === "string" &&
//             /^\d{4}-\d{2}-\d{2}$/.test(value)
//         ) {
//             return value;
//         }

//         const date = new Date(value);

//         if (Number.isNaN(date.getTime())) {
//             return "";
//         }

//         const year = date.getFullYear();
//         const month = String(
//             date.getMonth() + 1
//         ).padStart(2, "0");
//         const day = String(
//             date.getDate()
//         ).padStart(2, "0");

//         return `${year}-${month}-${day}`;
//     };

//     const getValidationRules = () => ({
//         subscription_plan_id: {
//             required: true,

//             requiredMessage:
//                 "Please select at least one subscription plan",

//             custom: (value) => {
//                 const ids =
//                     normalizePlanIds(value);

//                 if (ids.length === 0) {
//                     return "Please select at least one subscription plan";
//                 }

//                 return null;
//             },
//         },


//         offer_name: {
//             required: true,

//             requiredMessage:
//                 "Offer name is required",

//             minLength: 3,

//             minLengthMessage:
//                 "Offer name must be at least 3 characters",

//             maxLength: 100,

//             maxLengthMessage:
//                 "Offer name must be at most 100 characters",
//         },


//         offer_type: {
//             required: true,

//             requiredMessage:
//                 "Please select an offer type",
//         },


//         offer_value: {
//             required: true,

//             requiredMessage:
//                 "Offer value is required",

//             custom: (value, formData) => {
//                 if (
//                     value === "" ||
//                     value === null ||
//                     value === undefined
//                 ) {
//                     return "Offer value is required";
//                 }

//                 const numericValue =
//                     Number(value);

//                 if (
//                     !Number.isFinite(
//                         numericValue
//                     )
//                 ) {
//                     return "Please enter a valid number";
//                 }

//                 if (numericValue < 0) {
//                     return "Offer value cannot be negative";
//                 }


//                 if (
//                     formData?.offer_type ===
//                     "percentage"
//                 ) {
//                     if (numericValue > 100) {
//                         return "Percentage offer value must be between 0 and 100";
//                     }
//                 }


//                 if (
//                     formData?.offer_type ===
//                     "fixed"
//                 ) {
//                     if (
//                         numericValue >
//                         9999999
//                     ) {
//                         return "Fixed amount cannot exceed ₹9,999,999";
//                     }
//                 }


//                 if (
//                     formData?.offer_type ===
//                     "free_trial"
//                 ) {
//                     if (
//                         numericValue >
//                         9999999
//                     ) {
//                         return "Free trial value cannot exceed 9,999,999";
//                     }

//                     if (
//                         !Number.isInteger(
//                             numericValue
//                         )
//                     ) {
//                         return "Free trial value must be a whole number";
//                     }
//                 }


//                 return null;
//             },
//         },



//         start_date: {
//             required: true,

//             requiredMessage:
//                 "Start date is required",

//             custom: (value, formData) => {
//                 if (!value) {
//                     return "Start date is required";
//                 }

//                 const currentDate = normalizeDateOnly(value);

//                 if (!currentDate) {
//                     return "Please enter a valid start date";
//                 }

//                 /*
//                  * =====================================================
//                  * EDIT MODE
//                  * =====================================================
//                  *
//                  * If user has NOT changed the original start date,
//                  * allow it even if it is already in the past.
//                  */
//                 if (mode === "edit" && data) {
//                     const originalStartDate =
//                         normalizeDateOnly(
//                             data.start_date
//                         );

//                     if (
//                         originalStartDate &&
//                         currentDate === originalStartDate
//                     ) {
//                         return null;
//                     }
//                 }

//                 /*
//                  * =====================================================
//                  * NEW / CHANGED DATE
//                  * =====================================================
//                  *
//                  * If the date is new or changed, it cannot be
//                  * in the past.
//                  */
//                 const today = new Date();

//                 const todayString = [
//                     today.getFullYear(),
//                     String(
//                         today.getMonth() + 1
//                     ).padStart(2, "0"),
//                     String(
//                         today.getDate()
//                     ).padStart(2, "0"),
//                 ].join("-");

//                 if (currentDate < todayString) {
//                     return "Start date cannot be in the past";
//                 }

//                 return null;
//             },
//         },

//         end_date: {
//             required: true,

//             requiredMessage:
//                 "End date is required",

//             custom: (value, formData) => {
//                 if (!value) {
//                     return "End date is required";
//                 }

//                 const currentEndDate =
//                     normalizeDateOnly(value);

//                 if (!currentEndDate) {
//                     return "Please enter a valid end date";
//                 }

//                 /*
//                  * =====================================================
//                  * CHECK ORIGINAL END DATE
//                  * =====================================================
//                  *
//                  * If edit mode and user did not change the original
//                  * end date, don't show a past-date validation.
//                  */
//                 let originalEndDate = "";

//                 if (mode === "edit" && data) {
//                     originalEndDate =
//                         normalizeDateOnly(
//                             data.end_date
//                         );

//                     if (
//                         originalEndDate &&
//                         currentEndDate === originalEndDate
//                     ) {
//                         /*
//                          * Still check relationship with start date.
//                          */
//                         if (formData?.start_date) {
//                             const startDate =
//                                 normalizeDateOnly(
//                                     formData.start_date
//                                 );

//                             if (
//                                 startDate &&
//                                 currentEndDate < startDate
//                             ) {
//                                 return "End date must be after start date";
//                             }
//                         }

//                         return null;
//                     }
//                 }

//                 /*
//                  * =====================================================
//                  * CHANGED END DATE
//                  * =====================================================
//                  */

//                 if (formData?.start_date) {
//                     const startDate =
//                         normalizeDateOnly(
//                             formData.start_date
//                         );

//                     if (
//                         startDate &&
//                         currentEndDate < startDate
//                     ) {
//                         return "End date must be after start date";
//                     }
//                 }

//                 return null;
//             },
//         },
//     });


//     /* ====================================================
//        SUBMIT
//     ==================================================== */

//     const handleSubmit = async (formData) => {
//         setLoading(true);

//         try {
//             /* ====================================================
//                PLAN IDS
//             ==================================================== */

//             const selectedPlanIds = normalizePlanIds(
//                 formData?.subscription_plan_id
//             );

//             if (selectedPlanIds.length === 0) {
//                 showError(
//                     "Please select at least one subscription plan"
//                 );
//                 return;
//             }

//             // IMPORTANT:
//             // POST  -> [6]
//             // PATCH -> 6
//             const subscriptionPlanId =
//                 mode === "edit"
//                     ? Number(selectedPlanIds[0])
//                     : selectedPlanIds;

//             if (
//                 mode === "edit" &&
//                 !Number.isInteger(subscriptionPlanId)
//             ) {
//                 showError("Please select a valid subscription plan");
//                 return;
//             }

//             /* ====================================================
//                EDIT VALIDATION
//                Backend expects only ONE plan ID during edit
//             ==================================================== */

//             if (
//                 mode === "edit" &&
//                 selectedPlanIds.length > 1
//             ) {
//                 showError(
//                     "Please select only one subscription plan while editing"
//                 );
//                 return;
//             }

//             /* ====================================================
//                OFFER TYPE
//             ==================================================== */

//             const offerType = String(
//                 formData?.offer_type ?? ""
//             )
//                 .trim()
//                 .toLowerCase();

//             if (!offerType) {
//                 showError(
//                     "Please select an offer type"
//                 );
//                 return;
//             }

//             /* ====================================================
//                OFFER VALUE
//             ==================================================== */

//             const offerValue = Number(
//                 formData?.offer_value
//             );

//             if (!Number.isFinite(offerValue)) {
//                 showError(
//                     "Please enter a valid offer value"
//                 );
//                 return;
//             }

//             if (offerValue < 0) {
//                 showError(
//                     "Offer value cannot be negative"
//                 );
//                 return;
//             }

//             if (
//                 offerType === "percentage" &&
//                 offerValue > 100
//             ) {
//                 showError(
//                     "Percentage offer value must be between 0 and 100"
//                 );
//                 return;
//             }

//             if (
//                 offerType === "free_trial" &&
//                 !Number.isInteger(offerValue)
//             ) {
//                 showError(
//                     "Free trial value must be a whole number"
//                 );
//                 return;
//             }

//             /* ====================================================
//                DATES
//             ==================================================== */

//             if (!formData?.start_date) {
//                 showError(
//                     "Start date is required"
//                 );
//                 return;
//             }

//             if (!formData?.end_date) {
//                 showError(
//                     "End date is required"
//                 );
//                 return;
//             }

//             /* ====================================================
//                DATE COMPARISON
//             ==================================================== */

//             const startDate = new Date(
//                 `${formData.start_date}T00:00:00`
//             );

//             const endDate = new Date(
//                 `${formData.end_date}T00:00:00`
//             );

//             if (
//                 Number.isNaN(startDate.getTime()) ||
//                 Number.isNaN(endDate.getTime())
//             ) {
//                 showError(
//                     "Please enter valid dates"
//                 );
//                 return;
//             }

//             if (endDate < startDate) {
//                 showError(
//                     "End date must be after start date"
//                 );
//                 return;
//             }

//             /* ====================================================
//                BOOLEAN
//             ==================================================== */

//             const couponRequired =
//                 formData.coupon_required === true ||
//                 formData.coupon_required === 1 ||
//                 formData.coupon_required === "1" ||
//                 formData.coupon_required === "true";

//             /* ====================================================
//                API PAYLOAD
               
//                CREATE:
//                subscription_plan_id: [3]
    
//                EDIT:
//                subscription_plan_id: "3"
//             ==================================================== */

//             const submitData = {
//                 subscription_plan_id:
//                     mode === "edit"
//                         ? Number(selectedPlanIds[0])
//                         : selectedPlanIds,

//                 offer_name: String(
//                     formData.offer_name ?? ""
//                 ).trim(),

//                 offer_type: offerType,

//                 offer_value: offerValue.toFixed(2),

//                 start_date: formData.start_date,

//                 end_date: formData.end_date,

//                 coupon_required: couponRequired,
//                 created_by: mode === "add" ? userId : undefined,
//                 updated_by: userId,
//             };

//             /* ====================================================
//                DEBUG
//             ==================================================== */

//             console.log(
//                 `${mode === "edit" ? "UPDATE" : "CREATE"} OFFER PAYLOAD:`,
//                 JSON.stringify(
//                     submitData,
//                     null,
//                     2
//                 )
//             );

//             /* ====================================================
//                EDIT
//             ==================================================== */

//             if (mode === "edit") {
//                 await subscriptionPlanOfferService.update(
//                     id,
//                     submitData
//                 );

//                 showSuccess(
//                     "Offer updated successfully"
//                 );
//             }

//             /* ====================================================
//                CREATE
//             ==================================================== */

//             else {
//                 await subscriptionPlanOfferService.create(
//                     submitData
//                 );

//                 showSuccess(
//                     "Offer created successfully"
//                 );
//             }

//             /* ====================================================
//                REDIRECT
//             ==================================================== */

//             navigate(
//                 "/subscription-plan-offers"
//             );

//         } catch (error) {
//             console.error(
//                 "Subscription offer submit error:",
//                 error
//             );

//             const message =
//                 error?.response?.data?.message ||
//                 error?.response?.data?.error ||
//                 error?.message ||
//                 "Failed to save subscription plan offer";

//             showError(message);

//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async () => {
//         try {
//             await subscriptionPlanOfferService.delete(
//                 id
//             );

//             showSuccess(
//                 "Offer deleted successfully"
//             );

//             navigate(
//                 "/subscription-plan-offers"
//             );

//         } catch (error) {
//             console.error(
//                 "Delete error:",
//                 error
//             );

//             const message =
//                 error?.response?.data?.message ||
//                 error?.response?.data?.error ||
//                 error?.message ||
//                 "";

//             if (
//                 /foreign\s*key|constraint|used|referenced/i.test(
//                     message
//                 )
//             ) {
//                 showError(
//                     "Cannot delete this offer because it is being used in other records."
//                 );
//             } else {
//                 showError(
//                     message ||
//                     "Failed to delete offer"
//                 );
//             }

//             throw error;
//         }
//     };

//     const getInitialData = () => {
//         if (mode === "add") {
//             return {
//                 subscription_plan_id: [],

//                 offer_name: "",

//                 offer_type: "",

//                 offer_value: 0,

//                 start_date: "",

//                 end_date: "",

//                 coupon_required: false,

//                 status: "active",
//             };
//         }
//         const normalizeFormDate = (value) => {
//             if (!value) {
//                 return "";
//             }

//             if (
//                 typeof value === "string" &&
//                 /^\d{4}-\d{2}-\d{2}$/.test(value)
//             ) {
//                 return value;
//             }

//             const date = new Date(value);

//             if (
//                 Number.isNaN(
//                     date.getTime()
//                 )
//             ) {
//                 return "";
//             }

//             const year =
//                 date.getFullYear();

//             const month =
//                 String(
//                     date.getMonth() + 1
//                 ).padStart(2, "0");

//             const day =
//                 String(
//                     date.getDate()
//                 ).padStart(2, "0");

//             return `${year}-${month}-${day}`;
//         };

//         if (data) {
//             const planIds =
//                 normalizePlanIds(
//                     data.subscription_plan_id
//                 );

//             const initialData = {
//                 subscription_plan_id:
//                     planIds,

//                 offer_name:
//                     data.offer_name ?? "",

//                 offer_type:
//                     data.offer_type ?? "",

//                 offer_value:
//                     data.offer_value ?? 0,

//                 start_date:
//                     normalizeFormDate(
//                         data.start_date
//                     ),

//                 end_date:
//                     normalizeFormDate(
//                         data.end_date
//                     ),

//                 coupon_required:
//                     normalizeBoolean(
//                         data.coupon_required
//                     ),

//                 status:
//                     getStatusValue(data)
//                         ? "active"
//                         : "inactive",
//             };


//             if (mode === "view") {
//                 initialData.created_by =
//                     data.created_by ?? null;

//                 initialData.updated_by =
//                     data.updated_by ?? null;

//                 initialData.created_at =
//                     data.created_at ?? null;

//                 initialData.updated_at =
//                     data.updated_at ?? null;
//             }

//             return initialData;
//         }


//         return {
//             subscription_plan_id: [],

//             offer_name: "",

//             offer_type: "",

//             offer_value: 0,

//             start_date: "",

//             end_date: "",

//             coupon_required: false,

//             status: "active",
//         };
//     };


//     const getTitle = () => {
//         if (mode === "view") {
//             return "Subscription Plan Offer Details";
//         }

//         if (mode === "edit") {
//             return "Edit Subscription Plan Offer";
//         }

//         return "Add New Subscription Plan Offer";
//     };

//     const getSubmitLabel = () => {
//         return mode === "edit"
//             ? "Update Offer"
//             : "Create Offer";
//     };

//     if (pageLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-[#2c0eee] border-t-transparent rounded-full animate-spin mx-auto" />

//                     <p className="mt-3 text-gray-500">
//                         Loading offer data...
//                     </p>
//                 </div>
//             </div>
//         );
//     }
//     if (
//         (mode === "view" ||
//             mode === "edit") &&
//         !data &&
//         !pageLoading
//     ) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-500">
//                         Subscription plan offer not found
//                     </p>

//                     <button
//                         type="button"
//                         onClick={() =>
//                             navigate(
//                                 "/subscription-plan-offers"
//                             )
//                         }
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

//             validationRules={
//                 getValidationRules()
//             }

//             onSubmit={handleSubmit}

//             onDelete={handleDelete}

//             navigateTo="/subscription-plan-offers"

//             submitLabel={getSubmitLabel()}

//             editLabel="Edit Offer"

//             deleteLabel="Delete Offer"

//             loading={loading}

//             showDelete={mode !== "add"}

//             showEdit={mode === "view"}

//             enableEditMode={
//                 mode === "view"
//             }

//             breadcrumb={
//                 mode === "view"
//                     ? "Viewing offer details"
//                     : mode === "edit"
//                         ? "Updating offer"
//                         : "Creating new offer"
//             }

//             onEdit={() =>
//                 navigate(
//                     `/subscription-plan-offers/edit/${id}`,
//                     {
//                         state: {
//                             item: data,
//                         },
//                     }
//                 )
//             }
//         />
//     );
// };

// export default SubscriptionPlanOffersForm;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdArrowBack,
    MdSave,
    MdCancel,
    MdDelete,
    MdWarning,
    MdClose,
    MdApartment,
    MdCategory,
    MdAttachMoney,
    MdDescription,
    MdImage,
    MdHistory,
    MdCheckCircle,
    MdErrorOutline,
    MdPauseCircle,
    MdBlock,
    MdCloudUpload,
    MdOpenInNew,
    MdTrendingUp,
    MdStar,
    MdInfo,
    MdAssignment,
    MdDateRange,
} from "react-icons/md";

import { subscriptionPlanOfferService } from "../../services/subscriptionPlanOffer.service";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import { showSuccess, showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { fetchUsers } from "../../utils/getUserName";
import { useAuth } from "../../context/AuthContext";
import { ViewBadge } from "../../components/common/FormPageUtils";

// ─── Helper: Normalize status ──────────────────────────────
const normalizeBoolean = (value) => {
    return value === true || value === 1 || value === "1" || value === "true";
};

const normalizePlanIds = (value) => {
    if (value === null || value === undefined || value === "") return [];

    let values = [];
    if (Array.isArray(value)) {
        values = value;
    } else if (typeof value === "string" && value.trim().startsWith("[")) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) values = parsed;
            else values = [parsed];
        } catch {
            values = [value];
        }
    } else if (typeof value === "string" && value.includes(",")) {
        values = value.split(",");
    } else {
        values = [value];
    }

    return [
        ...new Set(
            values
                .map((item) => {
                    if (item && typeof item === "object") {
                        return item.subscription_plan_id ?? item.id ?? item._id;
                    }
                    return item;
                })
                .map(Number)
                .filter((val) => Number.isInteger(val) && val > 0)
        ),
    ];
};

const formatCurrency = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "0.00";
    return number.toFixed(2);
};

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
    active: {
        pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        dot: "bg-emerald-500",
        icon: MdCheckCircle,
        heroDot: "bg-emerald-400",
    },
    inactive: {
        pill: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
        dot: "bg-slate-400",
        icon: MdErrorOutline,
        heroDot: "bg-slate-400",
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
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
        </span>
    );
};

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children, required }) => (
    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
);

const ReadOnlyValue = ({ children }) => (
    <div className="text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
        {children || "—"}
    </div>
);

const Toggle = ({ checked, onChange, name, disabled }) => (
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
        <input
            type="checkbox"
            name={name}
            checked={checked || false}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5" />
    </label>
);

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
    { id: "overview", label: "Overview", icon: MdAssignment },
    { id: "status", label: "Status & Activity", icon: MdInfo },
];

// ─── Main Component ──────────────────────────────────────────
const SubscriptionPlanOffersForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    const userId = user?.id;

    const [mode, setMode] = useState("add");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [data, setData] = useState(null);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [userNameCache, setUserNameCache] = useState({});
    const [activeTab, setActiveTab] = useState("overview");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ─── Form state ──────────────────────────────────────────────
    const [formValues, setFormValues] = useState({});

    // ─── Determine mode from URL ──────────────────────────────
    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/view/")) setMode("view");
        else if (path.includes("/edit/")) setMode("edit");
        else setMode("add");
    }, [location.pathname]);

    // ─── Load subscription plans ──────────────────────────────
    useEffect(() => {
        let mounted = true;
        const loadPlans = async () => {
            setLoadingPlans(true);
            try {
                const response = await subscriptionPlanService.getAll({ limit: 1000 });
                const rawData = response?.data?.data ?? response?.data?.results ?? response?.data ?? [];
                const plans = Array.isArray(rawData) ? rawData : [];
                if (mounted) setSubscriptionPlans(plans);
            } catch (error) {
                console.error("Failed to fetch subscription plans:", error);
                if (mounted) setSubscriptionPlans([]);
            } finally {
                if (mounted) setLoadingPlans(false);
            }
        };
        loadPlans();
        return () => { mounted = false; };
    }, []);

    // ─── Load users for audit ──────────────────────────────────
    useEffect(() => {
        let mounted = true;
        const loadUsers = async () => {
            try {
                const users = await fetchUsers();
                if (!users || typeof users !== "object") return;
                const userMap = {};
                Object.keys(users).forEach((key) => {
                    userMap[key] = users[key]?.name || users[key]?.username || `User ${key}`;
                });
                if (mounted) setUserNameCache(userMap);
            } catch (error) {
                console.error("Failed to load users:", error);
            }
        };
        loadUsers();
        return () => { mounted = false; };
    }, []);

    // ─── Fetch offer data for edit/view ──────────────────────
    useEffect(() => {
        let mounted = true;
        const fetchOffer = async () => {
            if ((mode !== "edit" && mode !== "view") || !id) return;
            setPageLoading(true);
            try {
                let item = location.state?.item;
                if (!item) {
                    const response = await subscriptionPlanOfferService.getById(id);
                    item = response?.data?.data ?? response?.data ?? response;
                }
                if (!item || typeof item !== "object" || Array.isArray(item)) {
                    throw new Error("Invalid subscription plan offer response");
                }

                const planIds = normalizePlanIds(
                    item.subscription_plan_id ??
                    item.subscription_plan_ids ??
                    item.subscription_plan ??
                    item.SubscriptionPlan?.id ??
                    item.SubscriptionPlan?._id ??
                    null
                );

                const normalizedData = {
                    id: item.id ?? item._id ?? id,
                    subscription_plan_id: planIds,
                    offer_name: item.offer_name ?? "",
                    offer_type: String(item.offer_type ?? ""), // force string
                    offer_value: Number.isFinite(Number(item.offer_value)) ? Number(item.offer_value) : 0,
                    start_date: item.start_date ?? null,
                    end_date: item.end_date ?? null,
                    coupon_required: normalizeBoolean(item.coupon_required),
                    status: normalizeBoolean(item.status ?? item.is_status),
                    is_status: normalizeBoolean(item.status ?? item.is_status),
                    created_by: item.created_by ?? null,
                    updated_by: item.updated_by ?? null,
                    created_at: item.created_at ?? item.createdAt ?? null,
                    updated_at: item.updated_at ?? item.updatedAt ?? null,
                    plan_name: item.SubscriptionPlan?.plan_name ?? "",
                    plan_code: item.SubscriptionPlan?.plan_code ?? "",
                    plan_price: item.SubscriptionPlan?.price ?? 0,
                    raw: item,
                };

                if (mounted) setData(normalizedData);
            } catch (error) {
                console.error("Fetch subscription plan offer error:", error);
                if (mounted) {
                    showError(error?.response?.data?.message || error?.message || "Failed to load offer data");
                    navigate("/subscription-plan-offers");
                }
            } finally {
                if (mounted) setPageLoading(false);
            }
        };
        fetchOffer();
        return () => { mounted = false; };
    }, [id, mode, location.state, navigate]);

    // ─── Get user name with caching ──────────────────────────
    const getUserNameCached = (userIdValue) => {
        if (userIdValue === null || userIdValue === undefined || userIdValue === "") return "—";
        return userNameCache[userIdValue] || `User ${userIdValue}`;
    };

    const getStatusValue = (row) => {
        if (!row) return true;
        return normalizeBoolean(row.is_status ?? row.status);
    };

    // ─── Initialize form values when data changes ────────────
    useEffect(() => {
        const initial = getInitialData();
        setFormValues(initial);
    }, [data, mode]);

    // ─── Handlers ──────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormValues((prev) => ({ ...prev, [name]: checked }));
        } else if (name === "subscription_plan_id") {
            // Only this field stores as an array (to keep API compatibility)
            const numericValue = value ? Number(value) : null;
            setFormValues((prev) => ({
                ...prev,
                [name]: numericValue !== null && !isNaN(numericValue) && numericValue > 0 ? [numericValue] : [],
            }));
        } else {
            // All other fields (including offer_type) store as plain values
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ─── Validation ────────────────────────────────────────────
    const validate = () => {
        const planIds = normalizePlanIds(formValues.subscription_plan_id);
        if (planIds.length === 0) {
            showError("Please select a subscription plan");
            return false;
        }
        if (mode === "edit" && planIds.length > 1) {
            showError("Please select only one subscription plan while editing");
            return false;
        }
        if (!formValues.offer_name?.trim()) {
            showError("Offer name is required");
            return false;
        }
        if (!formValues.offer_type) {
            showError("Please select an offer type");
            return false;
        }
        const offerValue = Number(formValues.offer_value);
        if (!Number.isFinite(offerValue) || offerValue < 0) {
            showError("Please enter a valid offer value");
            return false;
        }
        if (formValues.offer_type === "percentage" && offerValue > 100) {
            showError("Percentage offer value must be between 0 and 100");
            return false;
        }
        if (formValues.offer_type === "free_trial" && !Number.isInteger(offerValue)) {
            showError("Free trial value must be a whole number");
            return false;
        }
        if (!formValues.start_date) {
            showError("Start date is required");
            return false;
        }
        if (!formValues.end_date) {
            showError("End date is required");
            return false;
        }
        const start = new Date(formValues.start_date);
        const end = new Date(formValues.end_date);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            showError("Please enter valid dates");
            return false;
        }
        if (end < start) {
            showError("End date must be after start date");
            return false;
        }
        return true;
    };

    // ─── Submit ────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const selectedPlanIds = normalizePlanIds(formValues.subscription_plan_id);
            const subscriptionPlanId = mode === "edit" ? Number(selectedPlanIds[0]) : selectedPlanIds;

            const submitData = {
                subscription_plan_id: subscriptionPlanId,
                offer_name: formValues.offer_name.trim(),
                offer_type: formValues.offer_type,
                offer_value: Number(formValues.offer_value).toFixed(2),
                start_date: formValues.start_date,
                end_date: formValues.end_date,
                coupon_required: normalizeBoolean(formValues.coupon_required),
                updated_by: userId,
            };

            if (mode === "add") {
                submitData.created_by = userId;
                await subscriptionPlanOfferService.create(submitData);
                showSuccess("Offer created successfully");
            } else {
                await subscriptionPlanOfferService.update(id, submitData);
                showSuccess("Offer updated successfully");
            }

            navigate("/subscription-plan-offers");
        } catch (error) {
            console.error("Submit error:", error);
            const message = error?.response?.data?.message || error?.message || "Failed to save offer";
            showError(message);
        } finally {
            setLoading(false);
        }
    };

    // ─── Delete ────────────────────────────────────────────────
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await subscriptionPlanOfferService.delete(id);
            showSuccess("Offer deleted successfully");
            navigate("/subscription-plan-offers");
        } catch (error) {
            console.error("Delete error:", error);
            const message = error?.response?.data?.message || error?.message || "";
            if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
                showError("Cannot delete this offer because it is being used in other records.");
            } else {
                showError(message || "Failed to delete offer");
            }
            throw error;
        } finally {
            setDeleteLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    // ─── Helpers for initial data ────────────────────────────
    const normalizeDateOnly = (value) => {
        if (!value) return "";
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getInitialData = () => {
        if (mode === "add") {
            return {
                subscription_plan_id: [],
                offer_name: "",
                offer_type: "",
                offer_value: 0,
                start_date: "",
                end_date: "",
                coupon_required: false,
                status: "active",
            };
        }

        if (data) {
            const planIds = normalizePlanIds(data.subscription_plan_id);
            const initialData = {
                subscription_plan_id: planIds,
                offer_name: data.offer_name ?? "",
                offer_type: String(data.offer_type ?? ""), // force string
                offer_value: data.offer_value ?? 0,
                start_date: normalizeDateOnly(data.start_date),
                end_date: normalizeDateOnly(data.end_date),
                coupon_required: normalizeBoolean(data.coupon_required),
                status: getStatusValue(data) ? "active" : "inactive",
            };

            if (mode === "view") {
                initialData.created_by = data.created_by ?? null;
                initialData.updated_by = data.updated_by ?? null;
                initialData.created_at = data.created_at ?? null;
                initialData.updated_at = data.updated_at ?? null;
            }

            return initialData;
        }

        return {
            subscription_plan_id: [],
            offer_name: "",
            offer_type: "",
            offer_value: 0,
            start_date: "",
            end_date: "",
            coupon_required: false,
            status: "active",
        };
    };

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    // ─── Compute hero data ────────────────────────────────────
    const offerName = formValues.offer_name?.trim() || "New Offer";
    const offerTypeStr = String(formValues.offer_type || "");
    const offerTypeDisplay = offerTypeStr
        ? offerTypeStr.charAt(0).toUpperCase() + offerTypeStr.slice(1)
        : "—";

    const offerValueDisplay = (() => {
        const val = Number(formValues.offer_value);
        if (!Number.isFinite(val)) return "—";
        if (offerTypeStr === "percentage") return `${val.toFixed(2)}%`;
        return `₹${val.toFixed(2)}`;
    })();

    const dateRangeDisplay = (() => {
        if (formValues.start_date && formValues.end_date) {
            return `${formatDate(formValues.start_date)} – ${formatDate(formValues.end_date)}`;
        }
        return "—";
    })();
    const planNamesDisplay = (() => {
        const ids = normalizePlanIds(formValues.subscription_plan_id);
        if (ids.length === 0) return "—";
        return ids
            .map((planId) => {
                const plan = subscriptionPlans.find(
                    (p) => Number(p.id ?? p._id ?? p.subscription_plan_id) === planId
                );
                return plan?.plan_name || `Plan ${planId}`;
            })
            .join(", ");
    })();
    const statusValue = formValues.status || "active";
    const couponRequired = normalizeBoolean(formValues.coupon_required);

    const initials = offerName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    // ─── Render tab content ──────────────────────────────────
    const renderTabContent = () => {
        const planOptions = subscriptionPlans
            .map((plan) => {
                const planId = Number(plan.id ?? plan._id ?? plan.subscription_plan_id);
                if (!Number.isInteger(planId) || planId <= 0) return null;
                return {
                    value: planId,
                    label: `${plan.plan_name ?? "Unnamed Plan"} (₹${formatCurrency(plan.price ?? 0)})`,
                };
            })
            .filter(Boolean);

        const offerTypeOptions = [
            { value: "percentage", label: "Percentage (%)" },
            { value: "fixed", label: "Fixed Amount (₹)" },
            { value: "free_trial", label: "Free Trial" },
        ];

        switch (activeTab) {
            case "overview":
                return (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* ─── Subscription Plan (single select) ────── */}
                            <div className={isAddMode ? "sm:col-span-2" : ""}>
                                <FieldLabel required>Subscription Plan</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{planNamesDisplay}</ReadOnlyValue>
                                ) : (
                                    <select
                                        name="subscription_plan_id"
                                        value={
                                            formValues.subscription_plan_id &&
                                            Array.isArray(formValues.subscription_plan_id) &&
                                            formValues.subscription_plan_id.length > 0
                                                ? formValues.subscription_plan_id[0]
                                                : ""
                                        }
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                        disabled={loadingPlans}
                                    >
                                        <option value="">Select a plan</option>
                                        {planOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {!isViewMode && (
                                    <p className="mt-1 text-xs text-slate-400">
                                        {isAddMode ? "Select one plan for this offer" : "Select the plan you want to update"}
                                    </p>
                                )}
                            </div>

                            {/* ─── Offer Name ────────────────────────────── */}
                            <div>
                                <FieldLabel required>Offer Name</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{formValues.offer_name || "—"}</ReadOnlyValue>
                                ) : (
                                    <input
                                        type="text"
                                        name="offer_name"
                                        value={formValues.offer_name || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                        placeholder="e.g. Summer Sale 2026"
                                    />
                                )}
                            </div>

                            {/* ─── Offer Type ────────────────────────────── */}
                            <div>
                                <FieldLabel required>Offer Type</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{offerTypeDisplay}</ReadOnlyValue>
                                ) : (
                                    <select
                                        name="offer_type"
                                        value={formValues.offer_type || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                    >
                                        <option value="">Select offer type</option>
                                        {offerTypeOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* ─── Offer Value ───────────────────────────── */}
                            <div>
                                <FieldLabel required>Offer Value</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{offerValueDisplay}</ReadOnlyValue>
                                ) : (
                                    <input
                                        type="number"
                                        name="offer_value"
                                        value={formValues.offer_value || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                        placeholder="Enter offer value"
                                        min="0"
                                        step="0.01"
                                    />
                                )}
                            </div>

                            {/* ─── Start Date ────────────────────────────── */}
                            <div>
                                <FieldLabel required>Start Date</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{formValues.start_date ? formatDate(formValues.start_date) : "—"}</ReadOnlyValue>
                                ) : (
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formValues.start_date || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                    />
                                )}
                            </div>

                            {/* ─── End Date ──────────────────────────────── */}
                            <div>
                                <FieldLabel required>End Date</FieldLabel>
                                {isViewMode ? (
                                    <ReadOnlyValue>{formValues.end_date ? formatDate(formValues.end_date) : "—"}</ReadOnlyValue>
                                ) : (
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formValues.end_date || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                                    />
                                )}
                            </div>
                        </div>

                        {/* ─── Coupon Required ───────────────────────────── */}
                        <div className="border-t border-slate-200 pt-5">
                            <FieldLabel>Coupon Required</FieldLabel>
                            {isViewMode ? (
                                <ReadOnlyValue>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                            couponRequired ? "bg-blue-50 text-[#2c0eee]" : "bg-slate-50 text-slate-500"
                                        }`}
                                    >
                                        {couponRequired ? "Yes" : "No"}
                                    </span>
                                </ReadOnlyValue>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Toggle
                                        name="coupon_required"
                                        checked={formValues.coupon_required}
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-sm text-slate-600">
                                        {formValues.coupon_required ? "Coupon required" : "No coupon needed"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case "status":
                return (
                    <div className="space-y-6 max-w-xl">
                        <div>
                            <FieldLabel required>Status</FieldLabel>
                            {isViewMode ? (
                                <ReadOnlyValue>
                                    <StatusPill status={statusValue} />
                                </ReadOnlyValue>
                            ) : (
                                <div className="flex flex-wrap gap-6 pt-1">
                                    {["active", "inactive"].map((s) => (
                                        <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value={s}
                                                checked={formValues.status === s}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                                            />
                                            <span className="text-sm text-slate-700 capitalize">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {(mode === "view" || mode === "edit") && (
                            <div className="border-t border-slate-200 pt-5 space-y-5">
                                <div>
                                    <FieldLabel>Created By</FieldLabel>
                                    <ReadOnlyValue>{getUserNameCached(data?.created_by)}</ReadOnlyValue>
                                </div>
                                <div>
                                    <FieldLabel>Created At</FieldLabel>
                                    <ReadOnlyValue>{data?.created_at ? formatDate(data.created_at) : "—"}</ReadOnlyValue>
                                </div>
                                <div>
                                    <FieldLabel>Last Updated By</FieldLabel>
                                    <ReadOnlyValue>{getUserNameCached(data?.updated_by)}</ReadOnlyValue>
                                </div>
                                <div>
                                    <FieldLabel>Last Updated At</FieldLabel>
                                    <ReadOnlyValue>{data?.updated_at ? formatDate(data.updated_at) : "—"}</ReadOnlyValue>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // ─── Loading state ─────────────────────────────────────────
    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Loading offer data...</p>
                </div>
            </div>
        );
    }

    if ((mode === "view" || mode === "edit") && !data && !pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
                <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
                    <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Offer not found</p>
                    <button
                        onClick={() => navigate("/subscription-plan-offers")}
                        className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <MdArrowBack size={16} />
                        Back to offers
                    </button>
                </div>
            </div>
        );
    }

    // ─── Main render ──────────────────────────────────────────
    return (
        <div className="min-h-screen pb-16">
            {/* ─── Sticky action bar ─────────────────────────────────── */}
            <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate("/subscription-plan-offers")}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                            aria-label="Back"
                        >
                            <MdArrowBack size={19} className="text-slate-600" />
                        </button>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 leading-tight">Plan Offers</p>
                            <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                                {offerName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isViewMode ? (
                            <>
                                {mode !== "add" && (
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                        aria-label="Delete offer"
                                        title="Delete offer"
                                    >
                                        <MdDelete size={19} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/subscription-plan-offers/edit/${id}`, {
                                            state: { item: data },
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
                                >
                                    <MdSave size={16} />
                                    Edit Offer
                                </button>
                            </>
                        ) : (
                            <>
                                {mode !== "add" && (
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                        aria-label="Delete offer"
                                        title="Delete offer"
                                    >
                                        <MdDelete size={19} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => navigate("/subscription-plan-offers")}
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                                >
                                    <MdCancel size={16} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <MdSave size={16} />
                                    )}
                                    {loading ? "Saving..." : isEditMode ? "Update Offer" : "Create Offer"}
                                </button>
                            </>
                        )}
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
                    <div className="relative h-44 sm:h-52">
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            {/* Icon placeholder */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                    {initials || <MdAssignment size={22} />}
                                </div>
                            </div>

                            {/* Name + chips */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                                        {offerName}
                                    </h1>
                                    {couponRequired && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-400/20 text-blue-300 ring-1 ring-blue-400/30">
                                            Coupon Required
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                    <StatusPill status={statusValue} />
                                    <span className="text-xs text-white/70">Type: {offerTypeDisplay}</span>
                                    <span className="text-xs text-white/70">• {offerValueDisplay}</span>
                                    <span className="text-xs text-white/70">• {dateRangeDisplay}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Quick stat strip ──────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
                        <MdApartment size={16} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 leading-tight">Plan(s)</p>
                            <p className="text-sm font-semibold text-slate-700 truncate">{planNamesDisplay}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
                        <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 leading-tight">Type</p>
                            <p className="text-sm font-semibold text-slate-700 truncate">{offerTypeDisplay}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
                        <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 leading-tight">Value</p>
                            <p className="text-sm font-semibold text-slate-700 truncate">{offerValueDisplay}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
                        <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-slate-500 leading-tight">Date Range</p>
                            <p className="text-sm font-semibold text-slate-700 truncate">{dateRangeDisplay}</p>
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
                                        active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                    {active && (
                                        <motion.span
                                            layoutId="offer-tab-underline"
                                            className="absolute left-2 right-2 -bottom-px h-0.5 bg-blue-600 rounded-full"
                                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
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

                {/* Mobile-only cancel button */}
                {!isViewMode && (
                    <button
                        type="button"
                        onClick={() => navigate("/subscription-plan-offers")}
                        className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                    >
                        <MdCancel size={16} />
                        Cancel
                    </button>
                )}
            </div>

            {/* ─── Delete confirmation modal ──────────────────────────── */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
                        onClick={() => !deleteLoading && setIsDeleteModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 8 }}
                            transition={{ duration: 0.18 }}
                            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-full bg-red-50">
                                        <MdWarning size={18} className="text-red-500" />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-800">Delete Offer?</h3>
                                </div>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                                    disabled={deleteLoading}
                                >
                                    <MdClose size={18} />
                                </button>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-sm text-slate-600">
                                    This will permanently remove <span className="font-medium text-slate-800">{offerName}</span> and its data. This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-slate-100">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={deleteLoading}
                                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Keep offer
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
                                >
                                    {deleteLoading && (
                                        <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                                    )}
                                    {deleteLoading ? "Deleting..." : "Delete offer"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriptionPlanOffersForm;