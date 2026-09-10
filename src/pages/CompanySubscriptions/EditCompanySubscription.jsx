// pages/company-subscriptions/EditCompanySubscription.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import FormPage from "../../components/common/FormPage";
import { companySubscriptionService } from "../../services/companySubscription.service";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import companyService from "../../services/company.service";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";

const EditCompanySubscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id || 1;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [data, setData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Load plans and companies
  useEffect(() => {
    const loadData = async () => {
      try {
        const [plansRes, companiesRes] = await Promise.all([
          subscriptionPlanService.getAll({ limit: 1000 }),
          companyService.getAll({ limit: 1000 }),
        ]);

        const plansData =
          plansRes.data?.data || plansRes.data?.results || plansRes.data || [];
        const companiesData =
          companiesRes.data?.data ||
          companiesRes.data?.results ||
          companiesRes.data ||
          [];

        const activePlans = plansData.filter((plan) => plan.is_status === true);
        const activeCompanies = companiesData.filter(
          (company) => company.is_status === true || company.is_status === 1,
        );

        setPlans(activePlans);
        setCompanies(activeCompanies);
      } catch (error) {
        console.error("Error loading data:", error);
        showError("Failed to load plans and companies");
      }
    };

    loadData();
  }, []);

  // Fetch data for edit
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setPageLoading(true);
        try {
          let item = location.state?.item;

          if (!item) {
            const response = await companySubscriptionService.getById(id);
            item = response.data;
          }

          console.log("📥 Fetched item from API:", item);

          // ─── Extract Previous/Next plan IDs from API response ──
          // let previousPlanId = "";
          // let nextPlanId = "";

          // The API returns these as direct fields:
          // "previous_subscription_id": 9,
          // "next_subscription_plan_id": 9
          // OR these could be in the response as direct fields

          // Check for direct fields
          let previousPlanId = "";
          let nextPlanId = "";

          if (item.PreviousSubscriptionPlan?.previous_subscription_id) {
            previousPlanId = String(
              item.PreviousSubscriptionPlan.previous_subscription_id,
            );
          }

          if (item.NextSubscriptionPlan?.next_subscription_plan_id) {
            nextPlanId = String(
              item.NextSubscriptionPlan.next_subscription_plan_id,
            );
          }
          console.log("✅ Extracted Previous Plan ID:", previousPlanId);
          console.log("✅ Extracted Next Plan ID:", nextPlanId);

          // Normalize the data
          const normalizedData = {
            id: item.id || item._id,
            company_id: String(
              item.company_id || item.Company?.company_id || "",
            ),
            subscription_plans_id: String(
              item.subscription_plans_id ||
                item.SubscriptionPlan?.subscription_plan_id ||
                "",
            ),
            subscription_type: item.subscription_type || "New",
            subscription_status: item.subscription_status || "pending",
            start_date: item.start_date || "",
            expiry_date: item.expiry_date || "",
            cancel_reason: item.cancel_reason || "",
            cancelled_at: item.cancelled_at || "",
            PreviousSubscriptionPlan: previousPlanId,
            NextSubscriptionPlan: nextPlanId,
            is_trial: item.is_trial || false,
            auto_renew: item.auto_renew || false,
            is_status: item.is_status ? "active" : "inactive",
          };

          console.log("📋 Normalized data for form:", normalizedData);
          setData(normalizedData);
        } catch (error) {
          console.error("Fetch error:", error);
          showError("Failed to load company subscription data");
          navigate("/company-subscriptions");
        } finally {
          setPageLoading(false);
        }
      }
    };
    fetchData();
  }, [id, location.state, navigate]);

  // Form fields configuration
  const getFormFields = () => {
    const companyOptions = companies.map((company) => ({
      value: String(company.id || company._id || company.company_id),
      label: company.name || company.company_name || `Company ${company.id}`,
    }));

    const planOptions = plans.map((plan) => ({
      value: String(plan.id || plan._id || plan.subscription_plan_id),
      label: `${plan.plan_name} - ₹${plan.price} (${plan.duration_days} days)`,
    }));

    const planSelectOptions = [{ value: "", label: "None" }, ...planOptions];

    return [
      {
        name: "company_id",
        label: "Company",
        type: "select",
        required: true,
        options: companyOptions,
        placeholder: "Select a company",
        help: "Select the company for this subscription",
      },
      {
        name: "subscription_plans_id",
        label: "Subscription Plan",
        type: "select",
        required: true,
        options: planOptions,
        placeholder: "Select a plan",
        help: "Select the subscription plan",
      },
      {
        name: "subscription_type",
        label: "Subscription Type",
        type: "select",
        required: true,
        options: [
          { value: "New", label: "New Subscription" },
          { value: "Upgrade", label: "Upgrade Plan" },
          { value: "Renew", label: "Renew Subscription" },
        ],
        placeholder: "Select subscription type",
        help: "Select the type of subscription",
      },
      {
        name: "subscription_status",
        label: "Subscription Status",
        type: "select",
        required: false,
        options: [
          { value: "active", label: "Active" },
          { value: "pending", label: "Pending" },
          { value: "expired", label: "Expired" },
          { value: "cancelled", label: "Cancelled" },
        ],
        placeholder: "Select status",
        help: "Select the current status of the subscription",
      },
      {
        name: "start_date",
        label: "Start Date",
        type: "date",
        required: false,
        help: "Select the start date of the subscription",
      },
      {
        name: "expiry_date",
        label: "Expiry Date",
        type: "date",
        required: false,
        help: "Select the expiry date of the subscription",
      },
      {
        name: "cancel_reason",
        label: "Cancel Reason",
        type: "text",
        required: false,
        placeholder: "e.g. Company closed, Plan too expensive",
        help: "Reason for cancellation (if applicable)",
      },
      {
        name: "cancelled_at",
        label: "Cancelled At",
        type: "date",
        required: false,
        help: "Date when the subscription was cancelled",
      },
      {
        name: "PreviousSubscriptionPlan",
        label: "Previous Subscription Plan",
        type: "select",
        required: false,
        options: planSelectOptions,
        placeholder: "Select previous plan",
        help: "Select the previous subscription plan (for upgrades)",
      },
      {
        name: "NextSubscriptionPlan",
        label: "Next Subscription Plan",
        type: "select",
        required: false,
        options: planSelectOptions,
        placeholder: "Select next plan",
        help: "Select the next subscription plan (for renewals)",
      },
      {
        name: "is_trial",
        label: "Is Trial",
        type: "checkbox",
        color: "text-blue-500 focus:ring-blue-500",
        help: "Check if this is a trial subscription",
      },
      {
        name: "auto_renew",
        label: "Auto Renew",
        type: "checkbox",
        color: "text-green-500 focus:ring-green-500",
        help: "Check if the subscription should auto-renew",
      },
      {
        name: "is_status",
        label: "Status",
        type: "radio",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        color: "text-blue-600 focus:ring-blue-500",
      },
    ];
  };

  // Validation rules
  const validationRules = {
    company_id: {
      required: true,
      requiredMessage: "Please select a company",
    },
    subscription_plans_id: {
      required: true,
      requiredMessage: "Please select a subscription plan",
    },
    subscription_type: {
      required: true,
      requiredMessage: "Please select a subscription type",
    },
  };

  // Initial data
  const getInitialData = () => {
    if (data) {
      return {
        company_id: data.company_id || "",
        subscription_plans_id: data.subscription_plans_id || "",
        subscription_type: data.subscription_type || "New",
        subscription_status: data.subscription_status || "pending",
        start_date: data.start_date || "",
        expiry_date: data.expiry_date || "",
        cancel_reason: data.cancel_reason || "",
        cancelled_at: data.cancelled_at || "",
        PreviousSubscriptionPlan: data.PreviousSubscriptionPlan || "",
        NextSubscriptionPlan: data.NextSubscriptionPlan || "",
        is_trial: data.is_trial || false,
        auto_renew: data.auto_renew || false,
        is_status: data.is_status || "active",
      };
    }

    return {
      company_id: "",
      subscription_plans_id: "",
      subscription_type: "New",
      subscription_status: "pending",
      start_date: "",
      expiry_date: "",
      cancel_reason: "",
      cancelled_at: "",
      PreviousSubscriptionPlan: "",
      NextSubscriptionPlan: "",
      is_trial: false,
      auto_renew: false,
      is_status: "active",
    };
  };

  // ─── Handle form submission ──────────────────────────────────
  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Validate Start Date
      if (formData.start_date) {
        const startDate = new Date(`${formData.start_date}T00:00:00`);
        if (startDate < today) {
          showError("Start date cannot be before today");
          setLoading(false);
          return;
        }
      }

      // Validate Expiry Date
      if (formData.expiry_date) {
        const expiryDate = new Date(`${formData.expiry_date}T00:00:00`);
        if (expiryDate < today) {
          showError("Expiry date cannot be before today");
          setLoading(false);
          return;
        }
      }

      // Expiry date cannot be before start date
      if (formData.start_date && formData.expiry_date) {
        const startDate = new Date(`${formData.start_date}T00:00:00`);
        const expiryDate = new Date(`${formData.expiry_date}T00:00:00`);
        if (expiryDate < startDate) {
          showError("Expiry date cannot be before start date");
          setLoading(false);
          return;
        }
      }

      // ─── Build submit data ──────────────────────────────────
      // FIX: Send the IDs directly - the service will handle the conversion
      const submitData = {
        company_id: parseInt(formData.company_id),
        subscription_plans_id: parseInt(formData.subscription_plans_id),
        subscription_type: formData.subscription_type,
        subscription_status: formData.subscription_status || "pending",
        start_date: formData.start_date || null,
        expiry_date: formData.expiry_date || null,
        cancel_reason: formData.cancel_reason || null,
        cancelled_at: formData.cancelled_at || null,
        // FIX: Send the IDs directly - service will convert to the right format
        PreviousSubscriptionPlan: formData.PreviousSubscriptionPlan || null,
        NextSubscriptionPlan: formData.NextSubscriptionPlan || null,
        is_trial: formData.is_trial || false,
        auto_renew: formData.auto_renew || false,
        is_status: formData.is_status === "active",
        updated_by: userId,
      };

      console.log("📤 Final Update Data:", JSON.stringify(submitData, null, 2));

      await companySubscriptionService.update(id, submitData);
      showSuccess("Company subscription updated successfully");
      navigate("/company-subscriptions");
    } catch (error) {
      console.error("Submit error:", error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          "Failed to update company subscription",
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <FormPage
      title="Edit Company Subscription"
      mode="edit"
      fields={getFormFields()}
      initialData={getInitialData()}
      validationRules={validationRules}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Update"
      navigateTo="/company-subscriptions"
      breadcrumb="Update company subscription details"
    />
  );
};

export default EditCompanySubscription;
