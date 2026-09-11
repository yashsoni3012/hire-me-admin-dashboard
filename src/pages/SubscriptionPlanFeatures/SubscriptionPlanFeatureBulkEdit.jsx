// pages/subscriptions/SubscriptionPlanFeatureBulkEdit.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdSave,
  MdRefresh,
  MdRemoveCircle,
  MdEdit,
  MdInfoOutline,
  MdCheckCircle,
} from "react-icons/md";
import Button from "../../components/common/Button";
import { subscriptionPlanFeatureService } from "../../services/subscriptionPlanFeature.service";
import { subscriptionPlanService } from "../../services/subscriptionPlan.service";
import { subscriptionFeatureService } from "../../services/subscriptionFeature.service";
import { showSuccess, showError } from "../../utils/toast";
import { fetchUsers } from "../../utils/getUserName";

// Robust boolean coercion
const toBool = (val, fallback = false) => {
  if (val === undefined || val === null || val === "") return fallback;
  if (val === true || val === 1 || val === "1" || val === "true") return true;
  if (val === false || val === 0 || val === "0" || val === "false") return false;
  return Boolean(val);
};

const SubscriptionPlanFeatureBulkEdit = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);
  const [planFeaturesMap, setPlanFeaturesMap] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [editableRows, setEditableRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [userNameCache, setUserNameCache] = useState({});

  // ─── Load users ─────────────────────────────────────────────────
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

  // ─── Load plans, features, plan-features ───────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingData(true);
      try {
        const [plansRes, featuresRes, planFeaturesRes] = await Promise.all([
          subscriptionPlanService.getAll({ limit: 1000 }),
          subscriptionFeatureService.getAll({ limit: 1000 }),
          subscriptionPlanFeatureService.getAll({ limit: 1000 }),
        ]);

        const plansData = plansRes.data?.data || plansRes.data || [];
        const featuresData = featuresRes.data?.data || featuresRes.data || [];
        const planFeaturesData =
          planFeaturesRes.data?.data || planFeaturesRes.data || [];

        setPlans(Array.isArray(plansData) ? plansData : []);
        setFeatures(Array.isArray(featuresData) ? featuresData : []);

        // Group plan features by plan id for quick lookup
        const map = {};
        (Array.isArray(planFeaturesData) ? planFeaturesData : []).forEach(
          (pf) => {
            const pid = pf.subscription_plan_id || pf.SubscriptionPlan?.id;
            if (!pid) return;
            if (!map[pid]) map[pid] = [];
            map[pid].push(pf);
          }
        );
        setPlanFeaturesMap(map);
      } catch (error) {
        console.error("Failed to fetch reference data:", error);
        showError("Failed to load plans or features");
      } finally {
        setLoadingData(false);
      }
    };
    fetchAll();
  }, []);

  // ─── Build editable rows when plan changes ─────────────────────
  useEffect(() => {
    if (!selectedPlanId) {
      setEditableRows([]);
      return;
    }

    const planId = parseInt(selectedPlanId);
    const existing = planFeaturesMap[planId] || [];

    const rows = existing
      .map((pf) => {
        const featureId =
          pf.subscription_features_id || pf.SubscriptionFeature?.id;
        const feature = features.find(
          (f) => (f.id || f._id) === featureId
        );

        return {
          id: pf.id || pf._id, // plan-feature row id (needed for update)
          subscription_features_id: featureId,
          subscription_plan_id: planId,
          feature_name:
            feature?.feature_name ||
            pf.SubscriptionFeature?.feature_name ||
            `Feature ${featureId}`,
          feature_key: feature?.feature_key || "",
          feature_type:
            feature?.feature_type ||
            pf.SubscriptionFeature?.feature_type ||
            "TEXT",
          default_unit: feature?.default_unit || "",
          is_unlimited: toBool(pf.is_unlimited, false),
          is_trending: toBool(pf.is_trending, false),
          is_status: toBool(pf.status ?? pf.is_status, true),
          value: pf.value ?? "",
          display_value: pf.display_value ?? "",
          originalValue: pf.value ?? "",
          originalDisplayValue: pf.display_value ?? "",
          originalUnlimited: toBool(pf.is_unlimited, false),
          originalTrending: toBool(pf.is_trending, false),
          originalStatus: toBool(pf.status ?? pf.is_status, true),
          _dirty: false,
        };
      })
      .sort((a, b) =>
        String(a.feature_name).localeCompare(String(b.feature_name))
      );

    setEditableRows(rows);
  }, [selectedPlanId, planFeaturesMap, features]);

  // ─── Handlers ───────────────────────────────────────────────────
  const updateRow = (index, patch) => {
    setEditableRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const merged = { ...row, ...patch };
        merged._dirty =
          merged.value !== merged.originalValue ||
          merged.display_value !== merged.originalDisplayValue ||
          merged.is_unlimited !== merged.originalUnlimited ||
          merged.is_trending !== merged.originalTrending ||
          merged.is_status !== merged.originalStatus;
        return merged;
      })
    );
  };

  const handleValueChange = (index, value) => updateRow(index, { value });
  const handleDisplayValueChange = (index, value) =>
    updateRow(index, { display_value: value });
  const handleUnlimitedToggle = (index) =>
    updateRow(index, { is_unlimited: !editableRows[index].is_unlimited });
  const handleTrendingToggle = (index) =>
    updateRow(index, { is_trending: !editableRows[index].is_trending });
  const handleStatusToggle = (index) =>
    updateRow(index, { is_status: !editableRows[index].is_status });

  const handleReset = () => {
    setEditableRows((prev) =>
      prev.map((row) => ({
        ...row,
        value: row.originalValue,
        display_value: row.originalDisplayValue,
        is_unlimited: row.originalUnlimited,
        is_trending: row.originalTrending,
        is_status: row.originalStatus,
        _dirty: false,
      }))
    );
    setValidationErrors({});
  };

  // ─── Validation ─────────────────────────────────────────────────
  const validateForm = () => {
    const errors = {};
    if (!selectedPlanId) {
      errors.plan = "Please select a subscription plan";
    }
    if (editableRows.length === 0) {
      errors.features = "No existing features to edit for this plan";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateForm()) {
      showError("Please fix the validation errors");
      return;
    }

    const dirtyRows = editableRows.filter((r) => r._dirty);
    if (dirtyRows.length === 0) {
      showError("No changes to update");
      return;
    }

    setSaving(true);
    try {
      // Update each dirty row individually (no bulk update endpoint assumed)
      const results = await Promise.all(
        dirtyRows.map((row) =>
          subscriptionPlanFeatureService.update(row.id, {
            subscription_plan_id: row.subscription_plan_id,
            subscription_features_id: parseInt(row.subscription_features_id),
            value: row.value || "",
            display_value: row.display_value || "",
            is_unlimited: !!row.is_unlimited,
            is_trending: !!row.is_trending,
            status: !!row.is_status,
          })
        )
      );

      const planName =
        plans.find((p) => (p.id || p._id) === parseInt(selectedPlanId))
          ?.plan_name || selectedPlanId;

      showSuccess(
        `Successfully updated ${dirtyRows.length} feature(s) for "${planName}"`
      );

      // Reset dirty flags locally to reflect saved state
      setEditableRows((prev) =>
        prev.map((row) =>
          row._dirty
            ? {
                ...row,
                originalValue: row.value,
                originalDisplayValue: row.display_value,
                originalUnlimited: row.is_unlimited,
                originalTrending: row.is_trending,
                originalStatus: row.is_status,
                _dirty: false,
              }
            : row
        )
      );

      return results;
    } catch (error) {
      console.error("Bulk update error:", error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update features"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => navigate("/subscription-plan-features");

  // ─── Derived data ──────────────────────────────────────────────
  const dirtyCount = useMemo(
    () => editableRows.filter((r) => r._dirty).length,
    [editableRows]
  );

  const getPlanName = (planId) => {
    const plan = plans.find((p) => (p.id || p._id) === parseInt(planId));
    return plan?.plan_name || "";
  };

  // ─── Value input renderer ──────────────────────────────────────
  const renderValueInput = (row, index) => {
    const featureType = (row.feature_type || "TEXT").toUpperCase();

    switch (featureType) {
      case "COUNT":
      case "DAYS":
        return (
          <input
            type="number"
            min="0"
            step="1"
            value={row.value}
            onChange={(e) => handleValueChange(index, e.target.value)}
            placeholder="Enter number"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
            disabled={saving}
          />
        );
      case "BOOLEAN":
        return (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`boolean_${row.id}`}
                value="true"
                checked={String(row.value) === "true"}
                onChange={(e) => handleValueChange(index, e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                disabled={saving}
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`boolean_${row.id}`}
                value="false"
                checked={String(row.value) === "false"}
                onChange={(e) => handleValueChange(index, e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                disabled={saving}
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`boolean_${row.id}`}
                value=""
                checked={String(row.value) === ""}
                onChange={(e) => handleValueChange(index, "")}
                className="w-4 h-4 text-slate-400 focus:ring-slate-500 border-slate-300"
                disabled={saving}
              />
              <span className="text-sm text-slate-400">None</span>
            </label>
          </div>
        );
      case "TEXT":
      default:
        return (
          <input
            type="text"
            value={row.value}
            onChange={(e) => handleValueChange(index, e.target.value)}
            placeholder="Enter value"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
            disabled={saving}
          />
        );
    }
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F5FA] pb-16">
      {/* ─── Sticky action bar ────────────────────────────────── */}
      <div className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              title="Go back"
            >
              <MdArrowBack size={19} className="text-slate-600" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 leading-tight">
                Subscription Plan Features
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                Bulk Edit Features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              icon={MdRefresh}
              onClick={handleReset}
              disabled={loadingData || saving || dirtyCount === 0}
            >
              Reset Changes
            </Button>
            <Button
              icon={MdSave}
              onClick={handleSubmit}
              loading={saving}
              disabled={
                saving ||
                !selectedPlanId ||
                editableRows.length === 0 ||
                dirtyCount === 0
              }
            >
              {saving
                ? "Saving..."
                : dirtyCount > 0
                ? `Save ${dirtyCount} Change${dirtyCount > 1 ? "s" : ""}`
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Left: Plan Selection ───────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-4">
                <MdEdit className="text-blue-600" size={18} />
                <h2 className="text-sm font-semibold text-slate-700">
                  Select Plan to Edit
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                    Subscription Plan{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none appearance-none transition-all bg-white ${
                      validationErrors.plan
                        ? "border-red-300 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                    disabled={loadingData || saving}
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option
                        key={plan.id || plan._id}
                        value={plan.id || plan._id}
                      >
                        {plan.plan_name} (₹
                        {parseFloat(plan.price || 0).toFixed(2)})
                      </option>
                    ))}
                  </select>
                  {validationErrors.plan && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.plan}
                    </p>
                  )}
                </div>

                {selectedPlanId && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Plan:</span>{" "}
                      {getPlanName(selectedPlanId)}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-medium">Total Features:</span>{" "}
                      {editableRows.length}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Modified:</span>{" "}
                      <span
                        className={
                          dirtyCount > 0
                            ? "text-amber-600 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        {dirtyCount}
                      </span>
                    </p>
                  </div>
                )}

                {selectedPlanId && editableRows.length === 0 && (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <MdRemoveCircle
                      className="mx-auto text-slate-400"
                      size={32}
                    />
                    <p className="text-slate-400 text-sm mt-2">
                      This plan has no features to edit
                    </p>
                  </div>
                )}

                {!selectedPlanId && (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <MdInfoOutline
                      className="mx-auto text-slate-400"
                      size={32}
                    />
                    <p className="text-slate-400 text-sm mt-2">
                      Select a plan to load its features
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Right: Editable Features Table ─────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {editableRows.length > 0 ? (
                <>
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">
                        Features ({editableRows.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        {dirtyCount > 0 ? (
                          <span className="text-amber-600 font-medium">
                            {dirtyCount} row{dirtyCount > 1 ? "s" : ""} modified
                          </span>
                        ) : (
                          "Edit values below. Changes are highlighted."
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      Unsaved rows highlighted in{" "}
                      <span className="text-amber-600 font-medium">amber</span>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">
                            #
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">
                            Feature
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">
                            Value
                          </th>
                          {/* <th className="text-left px-4 py-3 font-semibold text-slate-600">
                            Display Value
                          </th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600">
                            Flags
                          </th> */}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {editableRows.map((row, index) => (
                          <tr
                            key={row.id}
                            className={`transition-colors ${
                              row._dirty
                                ? "bg-amber-50/40 hover:bg-amber-50"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="px-4 py-3 text-slate-500 text-center">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="min-w-0">
                                  <span className="text-slate-800">
                                    {row.feature_name || "Unnamed Feature"}
                                  </span>
                                  {row.feature_key && (
                                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                                      {row.feature_key}
                                    </div>
                                  )}
                                </div>
                                {row._dirty && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 ring-1 ring-amber-200 flex-shrink-0">
                                    Modified
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 min-w-[200px]">
                              {renderValueInput(row, index)}
                            </td>
                            {/* <td className="px-4 py-3 min-w-[200px]">
                              <input
                                type="text"
                                value={row.display_value}
                                onChange={(e) =>
                                  handleDisplayValueChange(index, e.target.value)
                                }
                                placeholder="Display value"
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                                disabled={saving}
                              />
                            </td> */}
                           
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>Total: {editableRows.length} features</span>
                      <span className="w-px h-4 bg-slate-300" />
                      <span className="text-amber-600 font-medium">
                        {dirtyCount} modified
                      </span>
                      {dirtyCount === 0 && (
                        <>
                          <span className="w-px h-4 bg-slate-300" />
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <MdCheckCircle size={14} />
                            No changes
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button
                        variant="secondary"
                        onClick={handleBack}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        loading={saving}
                        icon={MdSave}
                        disabled={saving || dirtyCount === 0}
                      >
                        {saving
                          ? "Saving..."
                          : dirtyCount > 0
                          ? `Save ${dirtyCount} Change${
                              dirtyCount > 1 ? "s" : ""
                            }`
                          : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </>
              ) : selectedPlanId ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <MdRemoveCircle className="text-slate-400" size={36} />
                  </div>
                  <p className="text-lg font-medium text-slate-700">
                    No Features Found
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    This plan doesn't have any features assigned yet. Use Bulk
                    Add to add features.
                  </p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <MdInfoOutline className="text-slate-400" size={36} />
                  </div>
                  <p className="text-lg font-medium text-slate-700">
                    Select a Plan
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Please select a subscription plan from the left panel to
                    edit its features.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanFeatureBulkEdit;