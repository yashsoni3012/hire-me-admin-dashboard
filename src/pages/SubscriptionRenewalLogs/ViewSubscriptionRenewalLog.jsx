import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormPage from "../../components/common/FormPage";
import subscriptionRenewalLogService from "../../services/subscriptionRenewalLog.service";
import companyService from "../../services/company.service";
import { showError } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import { getUserName, fetchUsers } from "../../utils/getUserName";

const ViewSubscriptionRenewalLog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNameCache, setUserNameCache] = useState({});

  // Get user name with caching
  const getUserNameCached = (userId) => {
    if (!userId) return "-";
    return userNameCache[userId] || `User ${userId}`;
  };

  // Fetch renewal log data
  useEffect(() => {
    const fetchRenewalLog = async () => {
      setLoading(true);
      try {
        // Fetch users for name mapping
        const users = await fetchUsers();
        const userMap = {};
        Object.keys(users).forEach((id) => {
          userMap[id] = users[id].name;
        });
        setUserNameCache(userMap);

        // Fetch renewal log by ID
        const response = await subscriptionRenewalLogService.getById(id);
        const data = response?.data || response;

        console.log("📥 Fetched renewal log data:", data);

        if (data) {
          // ─── Extract company name from nested object ──────────────────
          let companyName = "-";
          if (data.companySubscription?.Company?.company_name) {
            companyName = data.companySubscription.Company.company_name;
          } else if (data.company_name) {
            companyName = data.company_name;
          }

          // ─── Extract plan names from nested object ──────────────────
          let oldPlanName = data.old_plan || "-";
          let newPlanName = data.new_plan || "-";

          // If old_plan/new_plan are objects with plan_name
          if (data.old_plan && typeof data.old_plan === "object") {
            oldPlanName = data.old_plan.plan_name || "-";
          }
          if (data.new_plan && typeof data.new_plan === "object") {
            newPlanName = data.new_plan.plan_name || "-";
          }

          // ─── Build form data ──────────────────────────────────────────
          const formData = {
            company_name: companyName,
            renewal_type: data.renewal_type || "-",
            old_plan: oldPlanName,
            new_plan: newPlanName,
            old_expiry: data.old_expiry || null,
            new_expiry: data.new_expiry || null,
            amount: data.amount || "0.00",
            status:
              data.status === true || data.status === 1 ? "active" : "inactive",
            created_by: data.created_by || "-",
            updated_by: data.updated_by || "-",
            created_at: data.created_at || null,
            updated_at: data.updated_at || null,
          };

          console.log("📋 Form data:", formData);
          setInitialData(formData);
          setViewData(data);
        } else {
          showError("Renewal log not found");
          navigate("/subscription-renewal-logs");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showError(error.message || "Failed to load renewal log data");
        navigate("/subscription-renewal-logs");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRenewalLog();
    }
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/subscription-renewal-logs/edit/${id}`);
  };

  // Form fields configuration - view only
  const fields = [
    {
      name: "company_name",
      label: "Company",
      type: "text",
      readonly: true,
      viewRender: (value) => (
        <span className="font-medium text-gray-800">{value}</span>
      ),
    },
    {
      name: "renewal_type",
      label: "Renewal Type",
      type: "text",
      readonly: true,
      viewRender: (value) => {
        const colorMap = {
          upgrade: "bg-blue-100 text-blue-700",
          downgrade: "bg-orange-100 text-orange-700",
          renew: "bg-green-100 text-green-700",
          extension: "bg-purple-100 text-purple-700",
          cancel: "bg-red-100 text-red-700",
        };
        const displayNames = {
          upgrade: "Upgrade",
          downgrade: "Downgrade",
          renew: "Renew",
          extension: "Extension",
          cancel: "Cancel",
        };
        const type = value?.toLowerCase() || "";
        return (
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}
          >
            {displayNames[type] || value || "-"}
          </span>
        );
      },
    },
    {
      name: "old_plan",
      label: "Old Plan",
      type: "text",
      readonly: true,
      viewRender: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      name: "new_plan",
      label: "New Plan",
      type: "text",
      readonly: true,
      viewRender: (value) => (
        <span className="font-medium text-[#2c0eee]">{value}</span>
      ),
    },
    {
      name: "plan_change",
      label: "Plan Change",
      type: "text",
      readonly: true,
      viewRender: (_, formData) => (
        <div className="flex items-center gap-3">
          <span className="text-gray-600">{formData?.old_plan || "-"}</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-[#2c0eee]">
            {formData?.new_plan || "-"}
          </span>
        </div>
      ),
    },
    {
      name: "amount",
      label: "Amount",
      type: "text",
      readonly: true,
      viewRender: (value) => (
        <span className="font-semibold text-gray-900 text-lg">
          ₹{parseFloat(value || 0).toFixed(2)}
        </span>
      ),
    },
    {
      name: "expiry_change",
      label: "Expiry Change",
      type: "text",
      readonly: true,
      viewRender: (_, formData) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">
              Old: {formatDate(formData?.old_expiry)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">↓</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#2c0eee] text-sm font-medium">
              New: {formatDate(formData?.new_expiry)}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "status",
      label: "Status",
      type: "text",
      readonly: true,
      viewRender: (value) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            value === "active"
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${value === "active" ? "bg-green-500" : "bg-gray-400"}`}
          />
          {value === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "created_by",
      label: "Created By",
      type: "text",
      readonly: true,
      viewRender: (value) => {
        const name = getUserNameCached(value);
        return <span className="text-gray-600">{name}</span>;
      },
    },
    {
      name: "updated_by",
      label: "Updated By",
      type: "text",
      readonly: true,
      viewRender: (value) => {
        const name = getUserNameCached(value);
        return <span className="text-gray-600">{name}</span>;
      },
    },
    {
      name: "created_at",
      label: "Created At",
      type: "text",
      readonly: true,
      viewRender: (value) => (value ? formatDate(value) : "—"),
    },
    {
      name: "updated_at",
      label: "Updated At",
      type: "text",
      readonly: true,
      viewRender: (value) => (value ? formatDate(value) : "—"),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">
            Loading renewal log details...
          </p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <FormPage
      title="Renewal Log Details"
      mode="view"
      fields={fields}
      initialData={initialData}
      onSubmit={() => {}}
      onEdit={handleEdit}
      navigateTo="/subscription-renewal-logs"
      breadcrumb={`Viewing: ${viewData?.renewal_type || "Renewal Log"}`}
      enableEditMode={true}
      showEdit={true}
      editLabel="Edit Log"
      cancelLabel="Back to Logs"
    />
  );
};

export default ViewSubscriptionRenewalLog;
