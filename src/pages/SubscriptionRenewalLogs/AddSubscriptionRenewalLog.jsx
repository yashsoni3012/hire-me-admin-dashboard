// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import FormPage from "../../components/common/FormPage";
// import subscriptionRenewalLogService from "../../services/subscriptionRenewalLog.service";
// import subscriptionPlanService from "../../services/subscriptionPlan.service";
// import companyService from "../../services/company.service";
// import companySubscriptionService from "../../services/companySubscription.service";
// import { showSuccess, showError } from "../../utils/toast";

// const AddSubscriptionRenewalLog = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
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
//         // Load companies
//         const companiesRes = await companyService.getAll({ limit: 1000 });
//         const companiesData =
//           companiesRes.data?.data ||
//           companiesRes.data?.results ||
//           companiesRes.data ||
//           [];
//         const activeCompanies = companiesData.filter(
//           (company) => company.is_status === true || company.is_status === 1,
//         );
//         setCompanies(activeCompanies);

//         // Load plans
//         const plansRes = await subscriptionPlanService.getAll({ limit: 1000 });
//         const plansData =
//           plansRes.data?.data || plansRes.data?.results || plansRes.data || [];
//         const activePlans = plansData.filter((plan) => plan.is_status === true);
//         setPlans(activePlans);

//         // Load company subscriptions
//         const subRes = await companySubscriptionService.getAll({ limit: 1000 });
//         const subData =
//           subRes.data?.data || subRes.data?.results || subRes.data || [];
//         const mappedSubscriptions = subData.map((sub) => {
//           const companyName =
//             sub.Company?.company_name || sub.company_name || "Unknown Company";
//           const planName =
//             sub.SubscriptionPlan?.plan_name || sub.plan_name || "Unknown Plan";
//           return {
//             ...sub,
//             id: sub.id || sub._id,
//             company_name: companyName,
//             plan_name: planName,
//             displayLabel: `${companyName} - ${planName}`,
//           };
//         });
//         setCompanySubscriptions(mappedSubscriptions);
//         setFilteredSubscriptions(mappedSubscriptions);
//       } catch (error) {
//         console.error("Error loading data:", error);
//         showError("Failed to load required data");
//       } finally {
//         setLoadingData(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Filter subscriptions by company
//   const filterSubscriptionsByCompany = (companyId) => {
//     if (!companyId) {
//       setFilteredSubscriptions(companySubscriptions);
//       return;
//     }
//     const filtered = companySubscriptions.filter(
//       (sub) =>
//         (sub.company_id || sub.Company?.company_id) === parseInt(companyId),
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
//     const companyOptions = companies.map((company) => ({
//       value: String(company.id || company.company_id),
//       label: company.company_name || company.name || "-",
//     }));

//     const subscriptionOptions = filteredSubscriptions.map((sub) => ({
//       value: String(sub.id || sub._id),
//       label: sub.displayLabel || `${sub.company_name} - ${sub.plan_name}`,
//     }));

//     const planOptions = plans.map((plan) => ({
//       value: plan.plan_name,
//       label: `${plan.plan_name} (${plan.plan_code}) - ₹${plan.price}`,
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

//   // Initial data
//   const initialData = {
//     company_id: "",
//     company_subscription_id: "",
//     renewal_type: "",
//     old_plan: "",
//     new_plan: "",
//     old_expiry: "",
//     new_expiry: "",
//     amount: "",
//     status: "active",
//   };

//   // Handle form submission
//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       // Validate required fields
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

//       await subscriptionRenewalLogService.create(submitData);
//       showSuccess("Renewal log created successfully");

//       navigate("/subscription-renewal-logs");
//     } catch (error) {
//       console.error("Submit error:", error);
//       showError(
//         error.message ||
//           error?.response?.data?.message ||
//           "Failed to create renewal log",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadingData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">Loading data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <FormPage
//       title="Add Renewal Log"
//       mode="add"
//       fields={getFormFields()}
//       initialData={initialData}
//       validationRules={validationRules}
//       onSubmit={handleSubmit}
//       loading={loading}
//       submitLabel="Create"
//       navigateTo="/subscription-renewal-logs"
//       breadcrumb="Create a new renewal log"
//     />
//   );
// };

// export default AddSubscriptionRenewalLog;

// pages/subscription-renewal-logs/AddSubscriptionRenewalLog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdInfo,
  MdHistory,
  MdCheckCircle,
  MdErrorOutline,
  MdBusiness,
  MdAutorenew,
  MdAttachMoney,
  MdDateRange,
  MdSwapHoriz,
} from 'react-icons/md';
import subscriptionRenewalLogService from '../../services/subscriptionRenewalLog.service';
import subscriptionPlanService from '../../services/subscriptionPlan.service';
import companyService from '../../services/company.service';
import companySubscriptionService from '../../services/companySubscription.service';
import { showSuccess, showError } from '../../utils/toast';

// ─── Status styles ─────────────────────────────────────────────
const STATUS_STYLES = {
  active: {
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    icon: MdCheckCircle,
  },
  inactive: {
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
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

const RenewalTypeBadge = ({ type }) => {
  if (!type) return null;
  const colors = {
    upgrade: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    downgrade: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    renew: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    extension: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    cancel: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  };
  const cls = colors[type.toLowerCase()] || 'bg-slate-100 text-slate-500 ring-1 ring-slate-200';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      <MdSwapHoriz size={12} />
      {type.charAt(0).toUpperCase() + type.slice(1)}
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
  { id: 'overview', label: 'Overview', icon: MdBusiness },
  { id: 'plans', label: 'Plans', icon: MdAutorenew },
  { id: 'dates', label: 'Dates & Amount', icon: MdAttachMoney },
  { id: 'status', label: 'Status', icon: MdInfo },
  { id: 'activity', label: 'Activity', icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const AddSubscriptionRenewalLog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Dropdown data
  const [companies, setCompanies] = useState([]);
  const [plans, setPlans] = useState([]);
  const [companySubscriptions, setCompanySubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('');

  // ─── Form state ──────────────────────────────────────────────
  const [formValues, setFormValues] = useState({
    company_id: '',
    company_subscription_id: '',
    renewal_type: '',
    old_plan: '',
    new_plan: '',
    old_expiry: '',
    new_expiry: '',
    amount: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ─── Load dropdown data ──────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const companiesRes = await companyService.getAll({ limit: 1000 });
        const companiesData =
          companiesRes.data?.data ||
          companiesRes.data?.results ||
          companiesRes.data ||
          [];
        const activeCompanies = companiesData.filter(
          (company) => company.is_status === true || company.is_status === 1,
        );
        setCompanies(activeCompanies);

        const plansRes = await subscriptionPlanService.getAll({ limit: 1000 });
        const plansData =
          plansRes.data?.data || plansRes.data?.results || plansRes.data || [];
        const activePlans = plansData.filter((plan) => plan.is_status === true);
        setPlans(activePlans);

        const subRes = await companySubscriptionService.getAll({ limit: 1000 });
        const subData =
          subRes.data?.data || subRes.data?.results || subRes.data || [];
        const mappedSubscriptions = subData.map((sub) => {
          const companyName =
            sub.Company?.company_name || sub.company_name || 'Unknown Company';
          const planName =
            sub.SubscriptionPlan?.plan_name || sub.plan_name || 'Unknown Plan';
          return {
            ...sub,
            id: sub.id || sub._id,
            company_name: companyName,
            plan_name: planName,
            displayLabel: `${companyName} - ${planName}`,
          };
        });
        setCompanySubscriptions(mappedSubscriptions);
        setFilteredSubscriptions(mappedSubscriptions);
      } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load required data');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // ─── Filter subscriptions by company ───────────────────────
  const filterSubscriptionsByCompany = (companyId) => {
    if (!companyId) {
      setFilteredSubscriptions(companySubscriptions);
      return;
    }
    const filtered = companySubscriptions.filter(
      (sub) =>
        (sub.company_id || sub.Company?.company_id) === parseInt(companyId),
    );
    setFilteredSubscriptions(filtered);
  };

  // ─── Handlers ──────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setSelectedSubscription('');
    filterSubscriptionsByCompany(companyId);
    setFormValues((prev) => ({
      ...prev,
      company_id: companyId,
      company_subscription_id: '',
    }));
    setTouched((prev) => ({ ...prev, company_id: true, company_subscription_id: true }));
    if (errors.company_id) {
      setErrors((prev) => ({ ...prev, company_id: '' }));
    }
  };

  const handleSubscriptionChange = (e) => {
    const val = e.target.value;
    setSelectedSubscription(val);
    setFormValues((prev) => ({ ...prev, company_subscription_id: val }));
    setTouched((prev) => ({ ...prev, company_subscription_id: true }));
    if (errors.company_subscription_id) {
      setErrors((prev) => ({ ...prev, company_subscription_id: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // ─── Options ───────────────────────────────────────────────
  const companyOptions = companies.map((company) => ({
    value: String(company.id || company.company_id),
    label: company.company_name || company.name || '-',
  }));

  const subscriptionOptions = filteredSubscriptions.map((sub) => ({
    value: String(sub.id || sub._id),
    label: sub.displayLabel || `${sub.company_name} - ${sub.plan_name}`,
  }));

  const planOptions = plans.map((plan) => ({
    value: plan.plan_name,
    label: `${plan.plan_name} (${plan.plan_code}) - ₹${plan.price}`,
  }));

  const renewalTypeOptions = [
    { value: 'upgrade', label: 'Upgrade' },
    { value: 'downgrade', label: 'Downgrade' },
    { value: 'renew', label: 'Renew' },
    { value: 'extension', label: 'Extension' },
    { value: 'cancel', label: 'Cancel' },
  ];

  // ─── Validation ────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case 'company_id':
        if (!value) return 'Please select a company';
        return null;
      case 'company_subscription_id':
        if (!value) return 'Please select a company subscription';
        return null;
      case 'renewal_type':
        if (!value) return 'Please select a renewal type';
        return null;
      case 'old_plan':
        if (!value) return 'Please select an old plan';
        return null;
      case 'new_plan':
        if (!value) return 'Please select a new plan';
        return null;
      case 'amount': {
        if (value === '' || value === null || value === undefined) {
          return 'Amount is required';
        }
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          return 'Please enter a valid amount';
        }
        return null;
      }
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ['company_id', 'company_subscription_id', 'renewal_type', 'old_plan', 'new_plan', 'amount'].forEach((field) => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    const allTouched = {};
    Object.keys(formValues).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  // ─── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      showError('Please fix validation errors');
      return;
    }

    setLoading(true);
    try {
      // Extra validation checks
      if (!formValues.company_subscription_id) {
        showError('Please select a company subscription');
        setLoading(false);
        return;
      }
      if (!formValues.renewal_type) {
        showError('Please select a renewal type');
        setLoading(false);
        return;
      }
      if (!formValues.old_plan) {
        showError('Please select an old plan');
        setLoading(false);
        return;
      }
      if (!formValues.new_plan) {
        showError('Please select a new plan');
        setLoading(false);
        return;
      }
      if (!formValues.amount || parseFloat(formValues.amount) <= 0) {
        showError('Please enter a valid amount');
        setLoading(false);
        return;
      }

      const submitData = {
        company_subscription_id: parseInt(formValues.company_subscription_id),
        renewal_type: formValues.renewal_type.toLowerCase(),
        old_plan: formValues.old_plan,
        new_plan: formValues.new_plan,
        old_expiry: formValues.old_expiry || null,
        new_expiry: formValues.new_expiry || null,
        amount: parseFloat(formValues.amount).toFixed(2),
        status: formValues.status === 'active',
      };

      await subscriptionRenewalLogService.create(submitData);
      showSuccess('Renewal log created successfully');
      navigate('/subscription-renewal-logs');
    } catch (error) {
      console.error('Submit error:', error);
      showError(
        error.message ||
          error?.response?.data?.message ||
          'Failed to create renewal log',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/subscription-renewal-logs');

  // ─── Loading state ─────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading data...</p>
        </div>
      </div>
    );
  }

  // ─── Compute hero data ────────────────────────────────────
  const selectedCompanyName =
    companyOptions.find((o) => o.value === formValues.company_id)?.label ||
    'New Renewal Log';
  const selectedSubscriptionLabel =
    subscriptionOptions.find(
      (o) => o.value === formValues.company_subscription_id,
    )?.label || '';
  const renewalType = formValues.renewal_type || '';
  const amount = formValues.amount ? Number(formValues.amount).toLocaleString('en-IN') : '0';
  const status = formValues.status || 'active';

  const initials = selectedCompanyName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  // ─── Render tab content ────────────────────────────────────
  const renderTabContent = () => {
    const commonClass = (name) =>
      `w-full px-3.5 py-2.5 border ${
        touched[name] && errors[name] ? 'border-red-500' : 'border-slate-300'
      } rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors bg-white`;

    const renderSelect = (name, label, options, placeholder, help, required) => {
      const error = touched[name] && errors[name];
      return (
        <div key={name} className="mb-4">
          <FieldLabel required={required}>{label}</FieldLabel>
          <select
            name={name}
            value={formValues[name]}
            onChange={name === 'company_id' ? handleCompanyChange : name === 'company_subscription_id' ? handleSubscriptionChange : handleInputChange}
            onBlur={handleBlur}
            className={commonClass(name)}
            disabled={name === 'company_subscription_id' && !formValues.company_id}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {help && !error && <p className="mt-1 text-xs text-slate-400">{help}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    };

    const renderInput = (name, label, type, placeholder, help, required, opts = {}) => {
      const error = touched[name] && errors[name];
      return (
        <div key={name} className="mb-4">
          <FieldLabel required={required}>{label}</FieldLabel>
          <input
            type={type}
            name={name}
            value={formValues[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={commonClass(name)}
            {...opts}
          />
          {help && !error && <p className="mt-1 text-xs text-slate-400">{help}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    };

    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              {renderSelect(
                'company_id',
                'Company',
                companyOptions,
                'Select a company',
                'Select the company',
                true,
              )}
            </div>
            <div className="sm:col-span-2">
              {renderSelect(
                'company_subscription_id',
                'Company Subscription',
                subscriptionOptions,
                formValues.company_id
                  ? 'Select a subscription'
                  : 'Select a company first',
                'Select the company subscription',
                true,
              )}
            </div>
            <div className="sm:col-span-2">
              {renderSelect(
                'renewal_type',
                'Renewal Type',
                renewalTypeOptions,
                'Select renewal type',
                'Select the type of renewal',
                true,
              )}
            </div>
          </div>
        );

      case 'plans':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {renderSelect(
                'old_plan',
                'Old Plan',
                planOptions,
                'Select old plan',
                'Select the old plan name',
                true,
              )}
            </div>
            <div>
              {renderSelect(
                'new_plan',
                'New Plan',
                planOptions,
                'Select new plan',
                'Select the new plan name',
                true,
              )}
            </div>
          </div>
        );

      case 'dates':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {renderInput(
                'old_expiry',
                'Old Expiry Date',
                'date',
                '',
                'Select the old expiry date',
                false,
              )}
            </div>
            <div>
              {renderInput(
                'new_expiry',
                'New Expiry Date',
                'date',
                '',
                'Select the new expiry date',
                false,
              )}
            </div>
            <div>
              {renderInput(
                'amount',
                'Amount (₹)',
                'number',
                'e.g. 499.00',
                'Enter the renewal amount',
                true,
                { step: '0.01', min: 0 },
              )}
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="space-y-6 max-w-xl">
            <div>
              <FieldLabel required>Status</FieldLabel>
              <div className="flex flex-wrap gap-6 pt-1">
                {['active', 'inactive'].map((s) => (
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
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdInfo size={16} />
                  No Activity Yet
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500">
                  This renewal log hasn't been created yet. Once created, activity details will appear here.
                </p>
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
      {/* ─── Sticky action bar ───────────────────────────────── */}
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
                Subscription Renewal Logs
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Add New Renewal Log
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
              {loading ? 'Creating...' : 'Create Renewal Log'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── Hero (fixed dark gradient) ─────────────────── */}
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
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {initials || <MdAutorenew size={24} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                    {selectedCompanyName}
                  </h1>
                  <StatusPill status={status} />
                  {renewalType && <RenewalTypeBadge type={renewalType} />}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {selectedSubscriptionLabel && (
                    <>
                      <span className="text-xs text-white/70">
                        {selectedSubscriptionLabel}
                      </span>
                      <span className="text-xs text-white/70">•</span>
                    </>
                  )}
                  <span className="text-xs text-white/70">₹{amount}</span>
                  <span className="text-xs text-white/50">• New Renewal Log</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ─────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdBusiness size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Company</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {selectedCompanyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAutorenew size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Renewal Type
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                {renewalType || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Amount</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                ₹{amount}
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
                {formValues.new_expiry || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────── */}
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
                      layoutId="add-renewal-log-tab-underline"
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
                <form onSubmit={handleSubmit}>
                  {renderTabContent()}
                  {activeTab !== 'activity' && (
                    <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 px-4 rounded-lg transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 shadow-sm shadow-blue-600/20"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                            Creating...
                          </span>
                        ) : (
                          'Create Renewal Log'
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only cancel button */}
        <button
          type="button"
          onClick={handleBack}
          className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
        >
          <MdCancel size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddSubscriptionRenewalLog;