// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FormPage from '../../components/common/FormPage';
// import subscriptionRenewalLogService from '../../services/subscriptionRenewalLog.service';
// import subscriptionPlanService from '../../services/subscriptionPlan.service';
// import companyService from '../../services/company.service';
// import companySubscriptionService from '../../services/companySubscription.service';
// import { showSuccess, showError } from '../../utils/toast';

// const EditSubscriptionRenewalLog = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [initialData, setInitialData] = useState(null);
//   const [editItem, setEditItem] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [loadingData, setLoadingData] = useState(true);
//   const [companies, setCompanies] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [companySubscriptions, setCompanySubscriptions] = useState([]);
//   const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedSubscription, setSelectedSubscription] = useState("");

//   // Load all dropdown data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [companiesRes, plansRes, subRes] = await Promise.all([
//           companyService.getAll({ limit: 1000 }),
//           subscriptionPlanService.getAll({ limit: 1000 }),
//           companySubscriptionService.getAll({ limit: 1000 })
//         ]);

//         const companiesData = companiesRes.data?.data || companiesRes.data?.results || companiesRes.data || [];
//         const activeCompanies = companiesData.filter(company => 
//           company.is_status === true || company.is_status === 1
//         );
//         setCompanies(activeCompanies);

//         const plansData = plansRes.data?.data || plansRes.data?.results || plansRes.data || [];
//         const activePlans = plansData.filter(plan => plan.is_status === true);
//         setPlans(activePlans);

//         const subData = subRes.data?.data || subRes.data?.results || subRes.data || [];
//         const mappedSubscriptions = subData.map(sub => {
//           const companyName = sub.Company?.company_name || sub.company_name || "Unknown Company";
//           const planName = sub.SubscriptionPlan?.plan_name || sub.plan_name || "Unknown Plan";
//           return {
//             ...sub,
//             id: sub.id || sub._id,
//             company_name: companyName,
//             plan_name: planName,
//             displayLabel: `${companyName} - ${planName}`
//           };
//         });
//         setCompanySubscriptions(mappedSubscriptions);
//         setFilteredSubscriptions(mappedSubscriptions);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setLoadingData(false);
//       }
//     };
 
//     loadData();
//   }, []);

//   // Fetch renewal log data
//   useEffect(() => {
//     const fetchRenewalLog = async () => {
//       setFetchLoading(true);
//       try {
//         const response = await subscriptionRenewalLogService.getById(id);
//         const data = response?.data || response;
        
//         if (data) {
//           // Find the subscription to get company_id
//           const subscription = companySubscriptions.find(
//             sub => (sub.id || sub._id) === data.company_subscription_id
//           );
          
//           if (subscription) {
//             const companyId = subscription.company_id || subscription.Company?.company_id;
//             setSelectedCompany(companyId?.toString() || "");
//             filterSubscriptionsByCompany(companyId);
//           }

//           const formData = {
//             company_id: selectedCompany || subscription?.company_id?.toString() || "",
//             company_subscription_id: data.company_subscription_id || "",
//             renewal_type: data.renewal_type || "",
//             old_plan: data.old_plan || "",
//             new_plan: data.new_plan || "",
//             old_expiry: data.old_expiry || "",
//             new_expiry: data.new_expiry || "",
//             amount: data.amount || "",
//             status: data.status ? "active" : "inactive",
//           };
//           setInitialData(formData);
//           setEditItem(data);
//         } else {
//           showError("Renewal log not found");
//           navigate('/subscription-renewal-logs');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         showError(error.message || "Failed to load renewal log data");
//         navigate('/subscription-renewal-logs');
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     if (id && companySubscriptions.length > 0) {
//       fetchRenewalLog();
//     }
//   }, [id, navigate, companySubscriptions]);

//   // Filter subscriptions by company
//   const filterSubscriptionsByCompany = (companyId) => {
//     if (!companyId) {
//       setFilteredSubscriptions(companySubscriptions);
//       return;
//     }
//     const filtered = companySubscriptions.filter(
//       sub => (sub.company_id || sub.Company?.company_id) === parseInt(companyId)
//     );
//     setFilteredSubscriptions(filtered);
//   };

//   // Handle company change
//   const handleCompanyChange = (e) => {
//     const companyId = e.target.value;
//     setSelectedCompany(companyId);
//     setSelectedSubscription("");
//     filterSubscriptionsByCompany(companyId);
//   };

//   // Handle subscription change
//   const handleSubscriptionChange = (e) => {
//     setSelectedSubscription(e.target.value);
//   };

//   // Form fields configuration
//   const getFormFields = () => {
//     const companyOptions = companies.map(company => ({
//       value: String(company.id || company.company_id),
//       label: company.company_name || company.name || "-"
//     }));

//     const subscriptionOptions = filteredSubscriptions.map(sub => ({
//       value: String(sub.id || sub._id),
//       label: sub.displayLabel || `${sub.company_name} - ${sub.plan_name}`
//     }));

//     const planOptions = plans.map(plan => ({
//       value: plan.plan_name,
//       label: `${plan.plan_name} (${plan.plan_code}) - ₹${plan.price}`
//     }));

//     const renewalTypeOptions = [
//       { value: "upgrade", label: "Upgrade" },
//       { value: "downgrade", label: "Downgrade" },
//       { value: "renew", label: "Renew" },
//       { value: "extension", label: "Extension" },
//       { value: "cancel", label: "Cancel" },
//     ];

//     return [
//       {
//         name: "company_id",
//         label: "Company",
//         type: "select",
//         required: true,
//         options: companyOptions,
//         placeholder: "Select a company",
//         help: "Select the company",
//         onChange: handleCompanyChange,
//       },
//       {
//         name: "company_subscription_id",
//         label: "Company Subscription",
//         type: "select",
//         required: true,
//         options: subscriptionOptions,
//         placeholder: "Select a subscription",
//         help: "Select the company subscription",
//         dependsOn: "company_id",
//         onChange: handleSubscriptionChange,
//       },
//       {
//         name: "renewal_type",
//         label: "Renewal Type",
//         type: "select",
//         required: true,
//         options: renewalTypeOptions,
//         placeholder: "Select renewal type",
//         help: "Select the type of renewal",
//       },
//       {
//         name: "old_plan",
//         label: "Old Plan",
//         type: "select",
//         required: true,
//         options: planOptions,
//         placeholder: "Select old plan",
//         help: "Select the old plan name",
//       },
//       {
//         name: "new_plan",
//         label: "New Plan",
//         type: "select",
//         required: true,
//         options: planOptions,
//         placeholder: "Select new plan",
//         help: "Select the new plan name",
//       },
//       {
//         name: "old_expiry",
//         label: "Old Expiry Date",
//         type: "date",
//         required: false,
//         help: "Select the old expiry date",
//       },
//       {
//         name: "new_expiry",
//         label: "New Expiry Date",
//         type: "date",
//         required: false,
//         help: "Select the new expiry date",
//       },
//       {
//         name: "amount",
//         label: "Amount",
//         type: "number",
//         required: true,
//         placeholder: "e.g. 499.00",
//         help: "Enter the renewal amount",
//         step: "0.01",
//         min: 0,
//       },
//       {
//         name: "status",
//         label: "Status",
//         type: "radio",
//         options: [
//           { value: "active", label: "Active" },
//           { value: "inactive", label: "Inactive" },
//         ],
//         color: "text-blue-600 focus:ring-blue-500",
//       },
//     ];
//   };

//   // Validation rules
//   const validationRules = {
//     company_id: {
//       required: true,
//       requiredMessage: "Please select a company",
//     },
//     company_subscription_id: {
//       required: true,
//       requiredMessage: "Please select a company subscription",
//     },
//     renewal_type: {
//       required: true,
//       requiredMessage: "Please select a renewal type",
//     },
//     old_plan: {
//       required: true,
//       requiredMessage: "Please select an old plan",
//     },
//     new_plan: {
//       required: true,
//       requiredMessage: "Please select a new plan",
//     },
//     amount: {
//       required: true,
//       requiredMessage: "Amount is required",
//       min: 0,
//       minMessage: "Amount must be greater than or equal to 0",
//       custom: (value) => {
//         const numValue = parseFloat(value);
//         if (isNaN(numValue) || numValue < 0) {
//           return "Please enter a valid amount";
//         }
//         return null;
//       },
//     },
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       if (!formData.company_subscription_id) {
//         showError("Please select a company subscription");
//         setLoading(false);
//         return;
//       }

//       if (!formData.renewal_type) {
//         showError("Please select a renewal type");
//         setLoading(false);
//         return;
//       }

//       if (!formData.old_plan) {
//         showError("Please select an old plan");
//         setLoading(false);
//         return;
//       }

//       if (!formData.new_plan) {
//         showError("Please select a new plan");
//         setLoading(false);
//         return;
//       }

//       if (!formData.amount || parseFloat(formData.amount) <= 0) {
//         showError("Please enter a valid amount");
//         setLoading(false);
//         return;
//       }

//       const submitData = {
//         company_subscription_id: parseInt(formData.company_subscription_id),
//         renewal_type: formData.renewal_type.toLowerCase(),
//         old_plan: formData.old_plan,
//         new_plan: formData.new_plan,
//         old_expiry: formData.old_expiry || null,
//         new_expiry: formData.new_expiry || null,
//         amount: parseFloat(formData.amount).toFixed(2),
//         status: formData.status === "active",
//       };

//       await subscriptionRenewalLogService.update(id, submitData);
//       showSuccess("Renewal log updated successfully");
      
//       navigate('/subscription-renewal-logs');
//     } catch (error) {
//       console.error('Submit error:', error);
//       showError(error.message || error?.response?.data?.message || "Failed to update renewal log");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       await subscriptionRenewalLogService.delete(id);
//       showSuccess("Renewal log deleted successfully");
      
//       navigate('/subscription-renewal-logs');
//     } catch (error) {
//       console.error('Delete error:', error);
//       const message = error?.response?.data?.message || error?.message || "";
//       if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
//         showError("Cannot delete this log because it is being used in other records.");
//       } else {
//         showError(message || "Failed to delete log");
//       }
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   if (fetchLoading || loadingData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading renewal log data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!initialData) {
//     return null;
//   }

//   return (
//     <FormPage
//       title="Edit Renewal Log"
//       mode="edit"
//       fields={getFormFields()}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       onDelete={handleDelete}
//       loading={loading}
//       deleteLoading={deleteLoading}
//       submitLabel="Update"
//       navigateTo="/subscription-renewal-logs"
//       breadcrumb={`Editing: ${editItem?.renewal_type || 'Renewal Log'}`}
//       showEdit={false}
//     />
//   );
// };

// export default EditSubscriptionRenewalLog;

// pages/subscription-renewal-logs/EditSubscriptionRenewalLog.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdDelete,
  MdBusiness,
  MdAutorenew,
  MdAssignment,
  MdFlag,
  MdCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
  MdAttachMoney,
  MdDateRange,
  MdTrendingUp,
  MdSwapHoriz,
  MdCategory,
  MdFilterList,
} from "react-icons/md";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import subscriptionRenewalLogService from "../../services/subscriptionRenewalLog.service";
import subscriptionPlanService from "../../services/subscriptionPlan.service";
import companyService from "../../services/company.service";
import companySubscriptionService from "../../services/companySubscription.service";
import { showSuccess, showError } from "../../utils/toast";

// ─── Shared components ──────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
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
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.pill}`}
    >
      <Icon size={13} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// ─── Renewal type pill ──────────────────────────────────────────
const RENEWAL_TYPE_STYLES = {
  upgrade: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  downgrade: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  renew: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  extension: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  cancel: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const RenewalTypePill = ({ type }) => {
  if (!type) return null;
  const style = RENEWAL_TYPE_STYLES[type.toLowerCase()] || RENEWAL_TYPE_STYLES.renew;
  const label = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      <MdAutorenew size={13} />
      {label}
    </span>
  );
};

// ─── Format INR helper ──────────────────────────────────────────
const formatINR = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `₹${num.toLocaleString("en-IN")}`;
};

// ─── Format date helper ─────────────────────────────────────────
const formatDateShort = (value) => {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: MdInfoOutline },
  { id: "plans", label: "Plans & Dates", icon: MdSwapHoriz },
  { id: "payment", label: "Payment & Status", icon: MdAttachMoney },
];

// ─── Main Component ─────────────────────────────────────────────
const EditSubscriptionRenewalLog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Dropdown data
  const [companies, setCompanies] = useState([]);
  const [plans, setPlans] = useState([]);
  const [companySubscriptions, setCompanySubscriptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form state
  const [formValues, setFormValues] = useState({
    company_id: "",
    company_subscription_id: "",
    renewal_type: "",
    old_plan: "",
    new_plan: "",
    old_expiry: "",
    new_expiry: "",
    amount: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // ─── Load dropdown data ──────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [companiesRes, plansRes, subRes] = await Promise.all([
          companyService.getAll({ limit: 1000 }),
          subscriptionPlanService.getAll({ limit: 1000 }),
          companySubscriptionService.getAll({ limit: 1000 }),
        ]);

        const companiesData =
          companiesRes.data?.data ||
          companiesRes.data?.results ||
          companiesRes.data ||
          [];
        const activeCompanies = companiesData.filter(
          (c) => c.is_status === true || c.is_status === 1
        );
        setCompanies(activeCompanies);

        const plansData =
          plansRes.data?.data ||
          plansRes.data?.results ||
          plansRes.data ||
          [];
        const activePlans = plansData.filter((p) => p.is_status === true);
        setPlans(activePlans);

        const subData =
          subRes.data?.data || subRes.data?.results || subRes.data || [];
        const mapped = subData.map((sub) => {
          const companyName =
            sub.Company?.company_name || sub.company_name || "Unknown Company";
          const planName =
            sub.SubscriptionPlan?.plan_name || sub.plan_name || "Unknown Plan";
          return {
            ...sub,
            id: sub.id || sub._id,
            company_name: companyName,
            plan_name: planName,
            displayLabel: `${companyName} - ${planName}`,
          };
        });
        setCompanySubscriptions(mapped);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // ─── Fetch renewal log ───────────────────────────────────────
  useEffect(() => {
    const fetchRenewalLog = async () => {
      setFetchLoading(true);
      try {
        const response = await subscriptionRenewalLogService.getById(id);
        const data = response?.data || response;

        if (data) {
          const subscription = companySubscriptions.find(
            (sub) => (sub.id || sub._id) === data.company_subscription_id
          );

          let companyId = "";
          if (subscription) {
            companyId = (
              subscription.company_id ||
              subscription.Company?.company_id ||
              ""
            ).toString();
          }

          setFormValues({
            company_id: companyId,
            company_subscription_id: data.company_subscription_id
              ? String(data.company_subscription_id)
              : "",
            renewal_type: data.renewal_type || "",
            old_plan: data.old_plan || "",
            new_plan: data.new_plan || "",
            old_expiry: data.old_expiry || "",
            new_expiry: data.new_expiry || "",
            amount: data.amount || "",
            status: data.status ? "active" : "inactive",
          });
          setEditItem(data);
        } else {
          showError("Renewal log not found");
          navigate("/subscription-renewal-logs");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load renewal log data");
        navigate("/subscription-renewal-logs");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id && companySubscriptions.length > 0) {
      fetchRenewalLog();
    }
  }, [id, navigate, companySubscriptions]);

  // ─── Filtered subscriptions ──────────────────────────────────
  const filteredSubscriptions = useMemo(() => {
    if (!formValues.company_id) return companySubscriptions;
    return companySubscriptions.filter(
      (sub) =>
        (
          sub.company_id ||
          sub.Company?.company_id ||
          ""
        ).toString() === formValues.company_id.toString()
    );
  }, [companySubscriptions, formValues.company_id]);

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setFormValues((prev) => ({
      ...prev,
      company_id: companyId,
      company_subscription_id: "",
    }));
    if (errors.company_id)
      setErrors((prev) => ({ ...prev, company_id: "" }));
  };

  // ─── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formValues.company_id) {
      newErrors.company_id = "Please select a company";
    }
    if (!formValues.company_subscription_id) {
      newErrors.company_subscription_id = "Please select a company subscription";
    }
    if (!formValues.renewal_type) {
      newErrors.renewal_type = "Please select a renewal type";
    }
    if (!formValues.old_plan) {
      newErrors.old_plan = "Please select an old plan";
    }
    if (!formValues.new_plan) {
      newErrors.new_plan = "Please select a new plan";
    }

    const amountNum = parseFloat(formValues.amount);
    if (
      formValues.amount === "" ||
      formValues.amount === null ||
      formValues.amount === undefined
    ) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amountNum)) {
      newErrors.amount = "Please enter a valid amount";
    } else if (amountNum <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (
        newErrors.company_id ||
        newErrors.company_subscription_id ||
        newErrors.renewal_type
      ) {
        setActiveTab("overview");
      } else if (newErrors.old_plan || newErrors.new_plan) {
        setActiveTab("plans");
      } else {
        setActiveTab("payment");
      }
      showError(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        company_subscription_id: parseInt(formValues.company_subscription_id),
        renewal_type: formValues.renewal_type.toLowerCase(),
        old_plan: formValues.old_plan,
        new_plan: formValues.new_plan,
        old_expiry: formValues.old_expiry || null,
        new_expiry: formValues.new_expiry || null,
        amount: parseFloat(formValues.amount).toFixed(2),
        status: formValues.status === "active",
      };

      await subscriptionRenewalLogService.update(id, submitData);
      showSuccess("Renewal log updated successfully");
      navigate("/subscription-renewal-logs");
    } catch (error) {
      console.error("Submit error:", error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          "Failed to update renewal log"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionRenewalLogService.delete(id);
      showSuccess("Renewal log deleted successfully");
      setShowDeleteDialog(false);
      navigate("/subscription-renewal-logs");
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError(
          "Cannot delete this log because it is being used in other records."
        );
      } else {
        showError(message || "Failed to delete log");
      }
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Options ─────────────────────────────────────────────────
  const companyOptions = companies.map((c) => ({
    value: String(c.id || c.company_id),
    label: c.company_name || c.name || "-",
  }));

  const subscriptionOptions = filteredSubscriptions.map((sub) => ({
    value: String(sub.id || sub._id),
    label: sub.displayLabel || `${sub.company_name} - ${sub.plan_name}`,
  }));

  const planOptions = plans.map((p) => ({
    value: p.plan_name,
    label: `${p.plan_name} (${p.plan_code}) - ₹${p.price}`,
  }));

  const renewalTypeOptions = [
    { value: "upgrade", label: "Upgrade" },
    { value: "downgrade", label: "Downgrade" },
    { value: "renew", label: "Renew" },
    { value: "extension", label: "Extension" },
    { value: "cancel", label: "Cancel" },
  ];

  // ─── Loading state ───────────────────────────────────────────
  if (fetchLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">
            Loading renewal log data...
          </p>
        </div>
      </div>
    );
  }

  if (!editItem) return null;

  // ─── Hero helpers ────────────────────────────────────────────
  const heroCompany =
    companyOptions.find((o) => o.value === formValues.company_id)?.label ||
    "Renewal Log";
  const renewalType = formValues.renewal_type
    ? formValues.renewal_type.charAt(0).toUpperCase() +
      formValues.renewal_type.slice(1)
    : "Renewal";
  const initials = (heroCompany || "RL")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const amountDisplay = formatINR(formValues.amount);
  const selectedSubscriptionLabel =
    subscriptionOptions.find(
      (o) => o.value === formValues.company_subscription_id
    )?.label || "—";

  // ─── Render Tab Content ─────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Company */}
              <div>
                <FieldLabel required>Company</FieldLabel>
                <div className="relative">
                  <MdBusiness
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="company_id"
                    value={formValues.company_id}
                    onChange={handleCompanyChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.company_id
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                  >
                    <option value="">Select a company</option>
                    {companyOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.company_id ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.company_id}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Select the company for this renewal.
                  </p>
                )}
              </div>

              {/* Company Subscription */}
              <div>
                <FieldLabel required>Company Subscription</FieldLabel>
                <div className="relative">
                  <MdAutorenew
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="company_subscription_id"
                    value={formValues.company_subscription_id}
                    onChange={handleInputChange}
                    disabled={!formValues.company_id}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.company_subscription_id
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } ${
                      !formValues.company_id
                        ? "bg-slate-50 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  >
                    <option value="">
                      {formValues.company_id
                        ? "Select a subscription"
                        : "Select a company first"}
                    </option>
                    {subscriptionOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.company_subscription_id ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.company_subscription_id}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Filtered by the selected company.
                  </p>
                )}
              </div>

              {/* Renewal Type */}
              <div className="sm:col-span-2">
                <FieldLabel required>Renewal Type</FieldLabel>
                <div className="relative">
                  <MdSwapHoriz
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="renewal_type"
                    value={formValues.renewal_type}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.renewal_type
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                  >
                    <option value="">Select renewal type</option>
                    {renewalTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.renewal_type ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.renewal_type}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    The type of renewal being performed.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "plans":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Old Plan */}
              <div>
                <FieldLabel required>Old Plan</FieldLabel>
                <div className="relative">
                  <MdCategory
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="old_plan"
                    value={formValues.old_plan}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.old_plan
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                  >
                    <option value="">Select old plan</option>
                    {planOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.old_plan && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.old_plan}
                  </p>
                )}
              </div>

              {/* New Plan */}
              <div>
                <FieldLabel required>New Plan</FieldLabel>
                <div className="relative">
                  <MdCategory
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="new_plan"
                    value={formValues.new_plan}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all ${
                      errors.new_plan
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    } bg-white`}
                  >
                    <option value="">Select new plan</option>
                    {planOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.new_plan && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.new_plan}
                  </p>
                )}
              </div>

              {/* Old Expiry */}
              <div>
                <FieldLabel>Old Expiry Date</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="date"
                    name="old_expiry"
                    value={formValues.old_expiry}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
              </div>

              {/* New Expiry */}
              <div>
                <FieldLabel>New Expiry Date</FieldLabel>
                <div className="relative">
                  <MdDateRange
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="date"
                    name="new_expiry"
                    value={formValues.new_expiry}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6 max-w-xl">
            {/* Amount */}
            <div>
              <FieldLabel required>Amount</FieldLabel>
              <div className="relative">
                <MdAttachMoney
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  name="amount"
                  value={formValues.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.amount
                      ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  } bg-white`}
                  placeholder="e.g. 499.00"
                />
              </div>
              {errors.amount ? (
                <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5">
                  Formatted: <span className="font-semibold">{amountDisplay}</span>
                </p>
              )}
            </div>

            {/* Status */}
            <div className="pt-2 border-t border-slate-100">
              <FieldLabel required>Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {["active", "inactive"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formValues.status === status}
                      onChange={handleInputChange}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Active renewal logs are visible in the listing.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 bg-[#F4F5FA]">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/subscription-renewal-logs")}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Renewal Logs · Edit
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                {heroCompany}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/subscription-renewal-logs")}
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
              {loading ? "Updating..." : "Update Log"}
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
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdAutorenew size={24} />}
                </div>
              </div>

              {/* Name + chips */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {renewalType} Renewal
                  </h1>
                  <StatusPill status={formValues.status} />
                  <RenewalTypePill type={formValues.renewal_type} />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MdBusiness size={11} />
                    {heroCompany}
                  </span>
                  <span className="text-xs text-white/70">ID: #{id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Company
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {heroCompany || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Amount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {amountDisplay}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdSwapHoriz size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Plan Change
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.old_plan && formValues.new_plan
                  ? `${formValues.old_plan} → ${formValues.new_plan}`
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdDateRange size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                New Expiry
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {formValues.new_expiry
                  ? formatDateShort(formValues.new_expiry)
                  : "—"}
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
                      layoutId="edit-renewal-log-tab-underline"
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

        {/* ─── Actions ────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
            >
              <MdDelete size={16} />
              Delete Renewal Log
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/subscription-renewal-logs")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
              >
                <MdCancel size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdSave size={16} />
                )}
                {loading ? "Updating..." : "Update Log"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={() => navigate("/subscription-renewal-logs")}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>

      {/* ─── Delete Confirmation Dialog ─────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Renewal Log"
        message="Delete this renewal log? This action cannot be undone."
      />
    </div>
  );
};

export default EditSubscriptionRenewalLog;