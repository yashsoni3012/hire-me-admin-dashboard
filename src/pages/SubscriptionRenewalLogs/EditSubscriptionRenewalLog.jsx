import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPage from '../../components/common/FormPage';
import subscriptionRenewalLogService from '../../services/subscriptionRenewalLog.service';
import subscriptionPlanService from '../../services/subscriptionPlan.service';
import companyService from '../../services/company.service';
import companySubscriptionService from '../../services/companySubscription.service';
import { showSuccess, showError } from '../../utils/toast';

const EditSubscriptionRenewalLog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [plans, setPlans] = useState([]);
  const [companySubscriptions, setCompanySubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState("");

  // Load all dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [companiesRes, plansRes, subRes] = await Promise.all([
          companyService.getAll({ limit: 1000 }),
          subscriptionPlanService.getAll({ limit: 1000 }),
          companySubscriptionService.getAll({ limit: 1000 })
        ]);

        const companiesData = companiesRes.data?.data || companiesRes.data?.results || companiesRes.data || [];
        const activeCompanies = companiesData.filter(company => 
          company.is_status === true || company.is_status === 1
        );
        setCompanies(activeCompanies);

        const plansData = plansRes.data?.data || plansRes.data?.results || plansRes.data || [];
        const activePlans = plansData.filter(plan => plan.is_status === true);
        setPlans(activePlans);

        const subData = subRes.data?.data || subRes.data?.results || subRes.data || [];
        const mappedSubscriptions = subData.map(sub => {
          const companyName = sub.Company?.company_name || sub.company_name || "Unknown Company";
          const planName = sub.SubscriptionPlan?.plan_name || sub.plan_name || "Unknown Plan";
          return {
            ...sub,
            id: sub.id || sub._id,
            company_name: companyName,
            plan_name: planName,
            displayLabel: `${companyName} - ${planName}`
          };
        });
        setCompanySubscriptions(mappedSubscriptions);
        setFilteredSubscriptions(mappedSubscriptions);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };
 
    loadData();
  }, []);

  // Fetch renewal log data
  useEffect(() => {
    const fetchRenewalLog = async () => {
      setFetchLoading(true);
      try {
        const response = await subscriptionRenewalLogService.getById(id);
        const data = response?.data || response;
        
        if (data) {
          // Find the subscription to get company_id
          const subscription = companySubscriptions.find(
            sub => (sub.id || sub._id) === data.company_subscription_id
          );
          
          if (subscription) {
            const companyId = subscription.company_id || subscription.Company?.company_id;
            setSelectedCompany(companyId?.toString() || "");
            filterSubscriptionsByCompany(companyId);
          }

          const formData = {
            company_id: selectedCompany || subscription?.company_id?.toString() || "",
            company_subscription_id: data.company_subscription_id || "",
            renewal_type: data.renewal_type || "",
            old_plan: data.old_plan || "",
            new_plan: data.new_plan || "",
            old_expiry: data.old_expiry || "",
            new_expiry: data.new_expiry || "",
            amount: data.amount || "",
            status: data.status ? "active" : "inactive",
          };
          setInitialData(formData);
          setEditItem(data);
        } else {
          showError("Renewal log not found");
          navigate('/subscription-renewal-logs');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message || "Failed to load renewal log data");
        navigate('/subscription-renewal-logs');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id && companySubscriptions.length > 0) {
      fetchRenewalLog();
    }
  }, [id, navigate, companySubscriptions]);

  // Filter subscriptions by company
  const filterSubscriptionsByCompany = (companyId) => {
    if (!companyId) {
      setFilteredSubscriptions(companySubscriptions);
      return;
    }
    const filtered = companySubscriptions.filter(
      sub => (sub.company_id || sub.Company?.company_id) === parseInt(companyId)
    );
    setFilteredSubscriptions(filtered);
  };

  // Handle company change
  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setSelectedSubscription("");
    filterSubscriptionsByCompany(companyId);
  };

  // Handle subscription change
  const handleSubscriptionChange = (e) => {
    setSelectedSubscription(e.target.value);
  };

  // Form fields configuration
  const getFormFields = () => {
    const companyOptions = companies.map(company => ({
      value: String(company.id || company.company_id),
      label: company.company_name || company.name || "-"
    }));

    const subscriptionOptions = filteredSubscriptions.map(sub => ({
      value: String(sub.id || sub._id),
      label: sub.displayLabel || `${sub.company_name} - ${sub.plan_name}`
    }));

    const planOptions = plans.map(plan => ({
      value: plan.plan_name,
      label: `${plan.plan_name} (${plan.plan_code}) - ₹${plan.price}`
    }));

    const renewalTypeOptions = [
      { value: "upgrade", label: "Upgrade" },
      { value: "downgrade", label: "Downgrade" },
      { value: "renew", label: "Renew" },
      { value: "extension", label: "Extension" },
      { value: "cancel", label: "Cancel" },
    ];

    return [
      {
        name: "company_id",
        label: "Company",
        type: "select",
        required: true,
        options: companyOptions,
        placeholder: "Select a company",
        help: "Select the company",
        onChange: handleCompanyChange,
      },
      {
        name: "company_subscription_id",
        label: "Company Subscription",
        type: "select",
        required: true,
        options: subscriptionOptions,
        placeholder: "Select a subscription",
        help: "Select the company subscription",
        dependsOn: "company_id",
        onChange: handleSubscriptionChange,
      },
      {
        name: "renewal_type",
        label: "Renewal Type",
        type: "select",
        required: true,
        options: renewalTypeOptions,
        placeholder: "Select renewal type",
        help: "Select the type of renewal",
      },
      {
        name: "old_plan",
        label: "Old Plan",
        type: "select",
        required: true,
        options: planOptions,
        placeholder: "Select old plan",
        help: "Select the old plan name",
      },
      {
        name: "new_plan",
        label: "New Plan",
        type: "select",
        required: true,
        options: planOptions,
        placeholder: "Select new plan",
        help: "Select the new plan name",
      },
      {
        name: "old_expiry",
        label: "Old Expiry Date",
        type: "date",
        required: false,
        help: "Select the old expiry date",
      },
      {
        name: "new_expiry",
        label: "New Expiry Date",
        type: "date",
        required: false,
        help: "Select the new expiry date",
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        required: true,
        placeholder: "e.g. 499.00",
        help: "Enter the renewal amount",
        step: "0.01",
        min: 0,
      },
      {
        name: "status",
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
    company_subscription_id: {
      required: true,
      requiredMessage: "Please select a company subscription",
    },
    renewal_type: {
      required: true,
      requiredMessage: "Please select a renewal type",
    },
    old_plan: {
      required: true,
      requiredMessage: "Please select an old plan",
    },
    new_plan: {
      required: true,
      requiredMessage: "Please select a new plan",
    },
    amount: {
      required: true,
      requiredMessage: "Amount is required",
      min: 0,
      minMessage: "Amount must be greater than or equal to 0",
      custom: (value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          return "Please enter a valid amount";
        }
        return null;
      },
    },
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (!formData.company_subscription_id) {
        showError("Please select a company subscription");
        setLoading(false);
        return;
      }

      if (!formData.renewal_type) {
        showError("Please select a renewal type");
        setLoading(false);
        return;
      }

      if (!formData.old_plan) {
        showError("Please select an old plan");
        setLoading(false);
        return;
      }

      if (!formData.new_plan) {
        showError("Please select a new plan");
        setLoading(false);
        return;
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        showError("Please enter a valid amount");
        setLoading(false);
        return;
      }

      const submitData = {
        company_subscription_id: parseInt(formData.company_subscription_id),
        renewal_type: formData.renewal_type.toLowerCase(),
        old_plan: formData.old_plan,
        new_plan: formData.new_plan,
        old_expiry: formData.old_expiry || null,
        new_expiry: formData.new_expiry || null,
        amount: parseFloat(formData.amount).toFixed(2),
        status: formData.status === "active",
      };

      await subscriptionRenewalLogService.update(id, submitData);
      showSuccess("Renewal log updated successfully");
      
      navigate('/subscription-renewal-logs');
    } catch (error) {
      console.error('Submit error:', error);
      showError(error.message || error?.response?.data?.message || "Failed to update renewal log");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await subscriptionRenewalLogService.delete(id);
      showSuccess("Renewal log deleted successfully");
      
      navigate('/subscription-renewal-logs');
    } catch (error) {
      console.error('Delete error:', error);
      const message = error?.response?.data?.message || error?.message || "";
      if (/foreign\s*key|constraint|used|referenced/i.test(message)) {
        showError("Cannot delete this log because it is being used in other records.");
      } else {
        showError(message || "Failed to delete log");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  if (fetchLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading renewal log data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <FormPage
      title="Edit Renewal Log"
      mode="edit"
      fields={getFormFields()}
      initialData={initialData}
      validationRules={validationRules}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      loading={loading}
      deleteLoading={deleteLoading}
      submitLabel="Update"
      navigateTo="/subscription-renewal-logs"
      breadcrumb={`Editing: ${editItem?.renewal_type || 'Renewal Log'}`}
      showEdit={false}
    />
  );
};

export default EditSubscriptionRenewalLog;