// import api from './axiosInstance';
// import { storage } from '../utils/storage';

// const BASE_URL = '/subscription-plan-offers';

// // Helper function to get current user ID
// const getCurrentUserId = () => {
//     try {
//         const userStr = localStorage.getItem('user');
//         if (userStr) {
//             const user = JSON.parse(userStr);
//             return user?.id || null;
//         }
//         const user = storage.getUser();
//         return user?.id || user?.userId || user?._id || null;
//     } catch (error) {
//         console.error('Error getting user ID:', error);
//         return null;
//     }
// };

// export const subscriptionPlanOfferService = {
//     // Get all subscription plan offers with pagination and search
//     getAll: async (params = {}) => {
//         try {
//             const response = await api.get(BASE_URL, { params });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Get single subscription plan offer by ID
//     getById: async (id) => {
//         try {
//             const response = await api.get(`${BASE_URL}/${id}`);
//             return response.data;
//         } catch (error) {
//             if (error.response?.status === 404) {
//                 return null;
//             }
//             throw error.response?.data || error.message;
//         }
//     },

//     // Create new subscription plan offer
//     create: async (data) => {
//         try {
//             const userId = getCurrentUserId();

//             // Convert status to integer (0 or 1)
//             let statusValue = 1;
//             if (data.status === 'inactive' || data.status === false || data.status === 0) {
//                 statusValue = 0;
//             } else if (data.status === 'active' || data.status === true || data.status === 1) {
//                 statusValue = 1;
//             }

//             // Convert coupon_required to integer (0 or 1)
//             let couponRequiredValue = 0;
//             if (data.coupon_required === true || data.coupon_required === 1 || data.coupon_required === 'true') {
//                 couponRequiredValue = 1;
//             }

//             // FIX: Ensure offer_type is a valid string value
//             // The database expects specific values - use lowercase and trim
//             const validOfferTypes = ['percentage', 'fixed', 'free_trial'];
//             let offerType = data.offer_type ? data.offer_type.toLowerCase().trim() : 'percentage';

//             // If the value is not in the valid list, default to 'percentage'
//             if (!validOfferTypes.includes(offerType)) {
//                 console.warn(`Invalid offer_type "${offerType}", defaulting to "percentage"`);
//                 offerType = 'percentage';
//             }

//             // FIX: Ensure offer_value is a valid number with proper format
//             let offerValue = parseFloat(data.offer_value) || 0;

//             // For percentage, ensure it's between 0-100
//             if (offerType === 'percentage' && offerValue > 100) {
//                 offerValue = 100;
//                 console.warn('Percentage value capped at 100%');
//             }

//             // FIX: Ensure dates are in correct format (YYYY-MM-DD)
//             let startDate = data.start_date || '';
//             let endDate = data.end_date || '';

//             // If dates are provided, ensure they are in YYYY-MM-DD format
//             if (startDate) {
//                 // If it's a Date object or has time, convert to YYYY-MM-DD
//                 try {
//                     const dateObj = new Date(startDate);
//                     if (!isNaN(dateObj.getTime())) {
//                         startDate = dateObj.toISOString().split('T')[0];
//                     }
//                 } catch (e) {
//                     console.warn('Invalid start date:', startDate);
//                 }
//             }

//             if (endDate) {
//                 try {
//                     const dateObj = new Date(endDate);
//                     if (!isNaN(dateObj.getTime())) {
//                         endDate = dateObj.toISOString().split('T')[0];
//                     }
//                 } catch (e) {
//                     console.warn('Invalid end date:', endDate);
//                 }
//             }

//             const submitData = {
//                 subscription_plan_id: parseInt(data.subscription_plan_id) || 0,
//                 offer_name: data.offer_name ? data.offer_name.trim() : '',
//                 offer_type: offerType,
//                 offer_value: offerValue,
//                 start_date: startDate,
//                 end_date: endDate,
//                 coupon_required: couponRequiredValue,
//                 status: statusValue,
//                 created_by: userId || 1,
//                 updated_by: userId || 1
//             };

//             console.log('Creating offer with data:', submitData);

//             const response = await api.post(BASE_URL, submitData);
//             return response.data;
//         } catch (error) {
//             console.error('Create error:', error.response?.data);

//             // Try with minimal data if validation fails
//             if (error.response?.status === 400) {
//                 try {
//                     console.log('Trying with minimal data...');
//                     const minimalData = {
//                         subscription_plan_id: parseInt(data.subscription_plan_id) || 0,
//                         offer_name: data.offer_name ? data.offer_name.trim() : 'Offer',
//                         offer_type: 'percentage',
//                         offer_value: 0,
//                         start_date: new Date().toISOString().split('T')[0],
//                         end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//                         status: 1,
//                         created_by: getCurrentUserId() || 1
//                     };
//                     const response = await api.post(BASE_URL, minimalData);
//                     return response.data;
//                 } catch (minimalError) {
//                     console.error('Minimal create also failed:', minimalError.response?.data);
//                     throw error.response?.data || error.message;
//                 }
//             }

//             throw error.response?.data || error.message;
//         }
//     },

//     // Update subscription plan offer
//     update: async (id, data) => {
//         try {
//             const userId = getCurrentUserId();

//             // Convert status to integer (0 or 1)
//             let statusValue = 1;
//             if (data.status === 'inactive' || data.status === false || data.status === 0) {
//                 statusValue = 0;
//             } else if (data.status === 'active' || data.status === true || data.status === 1) {
//                 statusValue = 1;
//             }

//             // Convert coupon_required to integer (0 or 1)
//             let couponRequiredValue = 0;
//             if (data.coupon_required === true || data.coupon_required === 1 || data.coupon_required === 'true') {
//                 couponRequiredValue = 1;
//             }

//             // FIX: Ensure offer_type is a valid string value
//             const validOfferTypes = ['percentage', 'fixed', 'free_trial'];
//             let offerType = data.offer_type ? data.offer_type.toLowerCase().trim() : undefined;

//             if (offerType && !validOfferTypes.includes(offerType)) {
//                 console.warn(`Invalid offer_type "${offerType}", defaulting to "percentage"`);
//                 offerType = 'percentage';
//             }

//             // FIX: Ensure offer_value is a valid number
//             let offerValue = data.offer_value !== undefined ? parseFloat(data.offer_value) : undefined;

//             if (offerValue !== undefined && offerType === 'percentage' && offerValue > 100) {
//                 offerValue = 100;
//                 console.warn('Percentage value capped at 100%');
//             }

//             // FIX: Ensure dates are in correct format
//             let startDate = data.start_date || undefined;
//             let endDate = data.end_date || undefined;

//             if (startDate) {
//                 try {
//                     const dateObj = new Date(startDate);
//                     if (!isNaN(dateObj.getTime())) {
//                         startDate = dateObj.toISOString().split('T')[0];
//                     }
//                 } catch (e) {
//                     console.warn('Invalid start date:', startDate);
//                 }
//             }

//             if (endDate) {
//                 try {
//                     const dateObj = new Date(endDate);
//                     if (!isNaN(dateObj.getTime())) {
//                         endDate = dateObj.toISOString().split('T')[0];
//                     }
//                 } catch (e) {
//                     console.warn('Invalid end date:', endDate);
//                 }
//             }

//             const submitData = {
//                 subscription_plan_id: data.subscription_plan_id ? parseInt(data.subscription_plan_id) : undefined,
//                 offer_name: data.offer_name ? data.offer_name.trim() : undefined,
//                 offer_type: offerType,
//                 offer_value: offerValue,
//                 start_date: startDate,
//                 end_date: endDate,
//                 coupon_required: couponRequiredValue,
//                 status: statusValue,
//                 updated_by: userId || 1
//             };

//             // Remove undefined values
//             Object.keys(submitData).forEach(key => {
//                 if (submitData[key] === undefined) {
//                     delete submitData[key];
//                 }
//             });

//             console.log('Updating offer with data:', submitData);

//             try {
//                 const response = await api.put(`${BASE_URL}/${id}`, submitData);
//                 return response.data;
//             } catch (putError) {
//                 console.log('PUT failed, trying PATCH...');
//                 if (putError.response?.status === 404 || putError.response?.status === 405) {
//                     const response = await api.patch(`${BASE_URL}/${id}`, submitData);
//                     return response.data;
//                 }
//                 throw putError;
//             }
//         } catch (error) {
//             console.error('Update error:', error);
//             throw error.response?.data || error.message;
//         }
//     },

//     // Delete subscription plan offer
//     delete: async (id) => {
//         try {
//             const response = await api.delete(`${BASE_URL}/${id}`);
//             return response.data;
//         } catch (error) {
//             if (error.response?.status === 404) {
//                 return { success: true, message: 'Item already deleted' };
//             }
//             throw error.response?.data || error.message;
//         }
//     },

//     // Bulk delete subscription plan offers
//     deleteMany: async (ids) => {
//         try {
//             const response = await api.delete(BASE_URL, { data: { ids } });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Search subscription plan offers
//     search: async (query) => {
//         try {
//             const response = await api.get(`${BASE_URL}/search`, { params: { q: query } });
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Get offers by plan ID
//     getByPlanId: async (planId) => {
//         try {
//             const response = await api.get(`${BASE_URL}/plan/${planId}`);
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     },

//     // Get active offers
//     getActiveOffers: async () => {
//         try {
//             const response = await api.get(`${BASE_URL}/active`);
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || error.message;
//         }
//     }
// };

// export default subscriptionPlanOfferService;


// services/subscriptionPlanOffer.service.js
import api from "./axiosInstance";
import { storage } from "../utils/storage";

const BASE_URL = "/subscription-plan-offers";

const getCurrentUserId = () => {
    try {
        const userStr = localStorage.getItem("user");

        if (userStr) {
            const user = JSON.parse(userStr);

            return (
                user?.id ??
                user?.userId ??
                user?._id ??
                null
            );
        }

        const user = storage.getUser();

        return (
            user?.id ??
            user?.userId ??
            user?._id ??
            null
        );
    } catch (error) {
        console.error(
            "Error getting current user ID:",
            error
        );

        return null;
    }
};


const normalizePlanIds = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return [];
    }

    let values = [];

    /* -----------------------------------------------
       Array
    ------------------------------------------------ */

    if (Array.isArray(value)) {
        values = value;
    }

    /* -----------------------------------------------
       JSON array string
    ------------------------------------------------ */

    else if (
        typeof value === "string" &&
        value.trim().startsWith("[")
    ) {
        try {
            const parsed = JSON.parse(value);

            values = Array.isArray(parsed)
                ? parsed
                : [parsed];
        } catch {
            values = [value];
        }
    }

    /* -----------------------------------------------
       Comma separated string
    ------------------------------------------------ */

    else if (
        typeof value === "string" &&
        value.includes(",")
    ) {
        values = value.split(",");
    }

    /* -----------------------------------------------
       Single value
    ------------------------------------------------ */

    else {
        values = [value];
    }

    const ids = values
        .map((item) => {
            if (
                item &&
                typeof item === "object"
            ) {
                return (
                    item.subscription_plan_id ??
                    item.id ??
                    item._id
                );
            }

            return item;
        })
        .map((item) => Number(item))
        .filter(
            (item) =>
                Number.isInteger(item) &&
                item > 0
        );

    return [...new Set(ids)];
};

const normalizeSinglePlanId = (value) => {
    let planId = value;

    /* -----------------------------------------------
       If array comes from form
       [3] -> 3
    ------------------------------------------------ */

    if (Array.isArray(planId)) {
        planId = planId[0];
    }

    /* -----------------------------------------------
       If JSON array string comes
       "[3]" -> 3
    ------------------------------------------------ */

    if (
        typeof planId === "string" &&
        planId.trim().startsWith("[")
    ) {
        try {
            const parsed = JSON.parse(planId);

            if (Array.isArray(parsed)) {
                planId = parsed[0];
            } else {
                planId = parsed;
            }
        } catch {
            // Keep original value
        }
    }

    /* -----------------------------------------------
       Object
    ------------------------------------------------ */

    if (
        planId &&
        typeof planId === "object"
    ) {
        planId =
            planId.subscription_plan_id ??
            planId.id ??
            planId._id;
    }

    const numberId = Number(planId);

    if (
        !Number.isInteger(numberId) ||
        numberId <= 0
    ) {
        return null;
    }

    return numberId;
};

const normalizeBoolean = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value === 1;
    }

    if (typeof value === "string") {
        const normalized =
            value.trim().toLowerCase();

        if (
            normalized === "true" ||
            normalized === "1" ||
            normalized === "yes"
        ) {
            return true;
        }

        if (
            normalized === "false" ||
            normalized === "0" ||
            normalized === "no"
        ) {
            return false;
        }
    }

    return false;
};

const normalizeDate = (value) => {
    if (!value) {
        return "";
    }

    /* Already YYYY-MM-DD */
    if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return value;
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const normalizeOfferValue = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0.00";
    }

    return number.toFixed(2);
};


const getErrorMessage = (
    error,
    fallback = "Something went wrong"
) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        fallback
    );
};


const buildCreatePayload = (data) => {
    const subscriptionPlanIds =
        normalizePlanIds(
            data?.subscription_plan_id
        );

    const offerName =
        String(
            data?.offer_name ?? ""
        ).trim();

    const offerType =
        String(
            data?.offer_type ?? ""
        )
            .trim()
            .toLowerCase();

    const offerValue =
        normalizeOfferValue(
            data?.offer_value
        );

    const startDate =
        normalizeDate(
            data?.start_date
        );

    const endDate =
        normalizeDate(
            data?.end_date
        );

    const couponRequired =
        normalizeBoolean(
            data?.coupon_required
        );

    return {
        subscription_plan_id:
            subscriptionPlanIds,

        offer_name:
            offerName,

        offer_type:
            offerType,

        offer_value:
            offerValue,

        start_date:
            startDate,

        end_date:
            endDate,

        coupon_required:
            couponRequired,
    };
};


const buildUpdatePayload = (data) => {
    const planId =
        normalizeSinglePlanId(
            data?.subscription_plan_id
        );

    if (!planId) {
        throw new Error(
            "A valid subscription plan ID is required"
        );
    }

    const payload = {
        subscription_plan_id:
            planId,
    };

    if (
        data?.offer_name !== undefined
    ) {
        payload.offer_name =
            String(
                data.offer_name
            ).trim();
    }

    if (
        data?.offer_type !== undefined
    ) {
        payload.offer_type =
            String(
                data.offer_type
            )
                .trim()
                .toLowerCase();
    }

    if (
        data?.offer_value !== undefined
    ) {
        payload.offer_value =
            normalizeOfferValue(
                data.offer_value
            );
    }

    if (
        data?.start_date !== undefined
    ) {
        payload.start_date =
            normalizeDate(
                data.start_date
            );
    }

    if (
        data?.end_date !== undefined
    ) {
        payload.end_date =
            normalizeDate(
                data.end_date
            );
    }

    if (
        data?.coupon_required !== undefined
    ) {
        payload.coupon_required =
            normalizeBoolean(
                data.coupon_required
            );
    }

    if (data?.status !== undefined) {
        payload.status = normalizeBoolean(
            data.status
        );
    }

    if (data?.updated_by !== undefined) {
        payload.updated_by = Number(data.updated_by);
    }

    return payload;

    return payload;
};


export const subscriptionPlanOfferService = {

    getAll: async (params = {}) => {
        try {
            const response =
                await api.get(
                    BASE_URL,
                    { params }
                );

            return response.data;
        } catch (error) {
            console.error(
                "Get all offers error:",
                error
            );

            throw error;
        }
    },

    getById: async (id) => {
        try {
            if (!id) {
                throw new Error(
                    "Offer ID is required"
                );
            }

            const response =
                await api.get(
                    `${BASE_URL}/${id}`
                );

            return response.data;
        } catch (error) {
            console.error(
                "Get offer by ID error:",
                error
            );

            if (
                error?.response?.status ===
                404
            ) {
                return null;
            }

            throw error;
        }
    },

    create: async (data) => {
        try {
            const payload =
                buildCreatePayload(
                    data
                );

            /* Validation */

            if (
                payload
                    .subscription_plan_id
                    .length === 0
            ) {
                throw new Error(
                    "At least one subscription plan is required"
                );
            }

            if (!payload.offer_name) {
                throw new Error(
                    "Offer name is required"
                );
            }

            if (!payload.offer_type) {
                throw new Error(
                    "Offer type is required"
                );
            }

            if (!payload.start_date) {
                throw new Error(
                    "Start date is required"
                );
            }

            if (!payload.end_date) {
                throw new Error(
                    "End date is required"
                );
            }

            console.log(
                "CREATE SUBSCRIPTION OFFER PAYLOAD:",
                JSON.stringify(
                    payload,
                    null,
                    2
                )
            );

            const response =
                await api.post(
                    BASE_URL,
                    payload
                );

            return response.data;

        } catch (error) {
            console.error(
                "Create subscription plan offer error:",
                error
            );

            console.error(
                "CREATE API RESPONSE:",
                error?.response?.data
            );

            throw error;
        }
    },


    update: async (id, data) => {
        try {
            if (!id) {
                throw new Error(
                    "Subscription plan offer ID is required"
                );
            }

            /* -----------------------------------------------
               BUILD UPDATE PAYLOAD
            ------------------------------------------------ */

            const updatePayload =
                buildUpdatePayload(
                    data
                );

            /* -----------------------------------------------
               LOG RAW DATA
            ------------------------------------------------ */

            console.log(
                "RAW UPDATE DATA:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

            console.log(
                "FINAL UPDATE PAYLOAD:",
                JSON.stringify(
                    updatePayload,
                    null,
                    2
                )
            );

            console.log(
                "UPDATE URL:",
                `${BASE_URL}/${id}`
            );

            /* -----------------------------------------------
               PATCH REQUEST
            ------------------------------------------------ */

            const response =
                await api.patch(
                    `${BASE_URL}/${id}`,
                    updatePayload
                );

            return response.data;

        } catch (error) {
            console.error(
                "Update subscription plan offer error:",
                error
            );

            console.error(
                "UPDATE API STATUS:",
                error?.response?.status
            );

            console.error(
                "UPDATE API RESPONSE:",
                error?.response?.data
            );

            throw error;
        }
    },

    delete: async (id) => {
        try {
            if (!id) {
                throw new Error(
                    "Offer ID is required"
                );
            }

            const response =
                await api.delete(
                    `${BASE_URL}/${id}`
                );

            return response.data;

        } catch (error) {
            console.error(
                "Delete subscription plan offer error:",
                error
            );

            throw error;
        }
    },

    deleteMany: async (ids) => {
        try {
            const normalizedIds =
                normalizePlanIds(ids);

            if (
                normalizedIds.length === 0
            ) {
                throw new Error(
                    "At least one offer ID is required"
                );
            }

            const response =
                await api.delete(
                    BASE_URL,
                    {
                        data: {
                            ids:
                                normalizedIds,
                        },
                    }
                );

            return response.data;

        } catch (error) {
            console.error(
                "Delete many offers error:",
                error
            );

            throw error;
        }
    },

    search: async (query) => {
        try {
            const response =
                await api.get(
                    `${BASE_URL}/search`,
                    {
                        params: {
                            q: query,
                        },
                    }
                );

            return response.data;

        } catch (error) {
            console.error(
                "Search offers error:",
                error
            );

            throw error;
        }
    },

    getByPlanId: async (planId) => {
        try {
            const normalizedPlanId =
                normalizeSinglePlanId(
                    planId
                );

            if (!normalizedPlanId) {
                throw new Error(
                    "Plan ID is required"
                );
            }

            const response =
                await api.get(
                    `${BASE_URL}/plan/${normalizedPlanId}`
                );

            return response.data;

        } catch (error) {
            console.error(
                "Get offers by plan ID error:",
                error
            );

            throw error;
        }
    },


    getActiveOffers: async () => {
        try {
            const response =
                await api.get(
                    `${BASE_URL}/active`
                );

            return response.data;

        } catch (error) {
            console.error(
                "Get active offers error:",
                error
            );

            throw error;
        }
    },


    normalizePlanIds,
    normalizeSinglePlanId,
    normalizeBoolean,
    normalizeDate,
    normalizeOfferValue,
    getCurrentUserId,
    getErrorMessage,
};

export default subscriptionPlanOfferService;