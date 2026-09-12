import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  MdArrowBack,
  MdSearch,
  MdBusiness,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWork,
  MdSchool,
  MdAttachMoney,
  MdCalendarToday,
  MdCategory,
  MdFilterList,
  MdHistory,
  MdErrorOutline,
  MdOpenInNew,
  MdSort,
  MdApartment,
  MdEventAvailable,
  MdBadge,
} from "react-icons/md";
import { formatDate } from "../../utils/helpers";

const API_BASE_URL = "https://apidata.hiremejobs.in";

// ─── Helpers ──────────────────────────────────────────────────
const getFullImageUrl = (path) => {
  if (!path) return null;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:image")
  )
    return path;
  if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
  if (path.startsWith("./uploads/"))
    return `${API_BASE_URL}${path.substring(1)}`;
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path}`;
};

// The search-log API returns created_at already pre-formatted
// (e.g. "12/09/2026, 11:07:22 am") rather than raw ISO — so display
// it as-is, and only fall back to formatDate() for real ISO strings.
const displayDate = (raw) => {
  if (!raw) return "—";
  if (typeof raw === "string" && raw.includes("/") && raw.includes(","))
    return raw;
  try {
    const formatted = formatDate ? formatDate(raw) : null;
    return formatted || raw;
  } catch {
    return raw;
  }
};

// ─── Generic paginated fetch-all — matches the confirmed API shape:
// { success, pagination: { total, page, limit, totalPages }, data: [...] }
const fetchAllPaginated = async (url, limit = 100) => {
  const firstPage = await axios.get(url, { params: { page: 1, limit } });
  const firstBody = firstPage.data;
  let allItems = Array.isArray(firstBody?.data) ? firstBody.data : [];

  const totalPages = firstBody?.pagination?.totalPages || 1;
  if (totalPages <= 1) return allItems;

  const requests = [];
  for (let page = 2; page <= totalPages; page++) {
    requests.push(axios.get(url, { params: { page, limit } }));
  }
  const results = await Promise.all(requests);
  results.forEach((res) => {
    const pageItems = Array.isArray(res.data?.data) ? res.data.data : [];
    allItems = allItems.concat(pageItems);
  });

  return allItems;
};

// Builds an id -> record map from a list, trying common name fields
const buildLookupMap = (list, nameFields = ["name"]) => {
  const map = {};
  (list || []).forEach((item) => {
    if (item?.id === undefined || item?.id === null) return;
    let label = null;
    for (const field of nameFields) {
      if (item[field]) {
        label = item[field];
        break;
      }
    }
    map[item.id] = { ...item, __label: label || `#${item.id}` };
  });
  return map;
};

// ─── Fetch a single search log by id ──────────────────────────
// Tries a direct /candidate-search-logs/:id endpoint first; falls
// back to scanning the full paginated list if that route 404s.
const fetchSearchLogById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/candidate-search-logs/${id}`);
    const body = res.data;
    if (body?.success) {
      const record = Array.isArray(body.data) ? body.data[0] : body.data;
      if (record) return record;
    }
  } catch (err) {
    // fall through to list scan
  }

  const allLogs = await fetchAllPaginated(
    `${API_BASE_URL}/candidate-search-logs`,
  );
  return allLogs.find((log) => String(log.id) === String(id)) || null;
};

// ─── Shared small pieces ─────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
    {children}
  </label>
);

const EMPTY_VALUE = "-";

const ReadOnlyValue = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-2 text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
    {Icon && <Icon size={14} className="text-slate-400 flex-shrink-0" />}
    <span className="truncate">{children ?? "—"}</span>
  </div>
);

const SearchTypeBadge = ({ type }) => {
  const isAdvanced = type === "advanced";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
        isAdvanced
          ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
          : "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
      }`}
    >
      <MdFilterList size={13} />
      {type ? type.charAt(0).toUpperCase() + type.slice(1) : "Normal"} Search
    </span>
  );
};

// ─── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Search Criteria", icon: MdSearch },
  { id: "company", label: "Company & Recruiter", icon: MdBusiness },
  { id: "activity", label: "Activity", icon: MdHistory },
];

// ─── Main Component ──────────────────────────────────────────
const ViewSearchCandidate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchLog, setSearchLog] = useState(null);
  const [lookups, setLookups] = useState({
    cities: {},
    noticePeriods: {},
    workplaceTypes: {},
    industries: {},
    subIndustries: {},
    functionRoles: {},
    educationCategories: {},
    educationSubCategories: {},
    users: {},
    companies: {},
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [
          log,
          cities,
          noticePeriodsList,
          workplaceTypesList,
          industriesList,
          subIndustriesList,
          functionRolesList,
          educationCategoriesList,
          educationSubCategoriesList,
          usersList,
          companiesList,
        ] = await Promise.all([
          fetchSearchLogById(id),
          fetchAllPaginated(`${API_BASE_URL}/cities`).catch(() => []),
          fetchAllPaginated(`${API_BASE_URL}/notice-periods`).catch(() => []),
          fetchAllPaginated(`${API_BASE_URL}/workplace-types`).catch(() => []),
          fetchAllPaginated(`${API_BASE_URL}/industry`).catch(() => []),
          fetchAllPaginated(`${API_BASE_URL}/sub-industry`).catch(() => []),
          fetchAllPaginated(`${API_BASE_URL}/function-roles`).catch(() => []),
          fetchAllPaginated(`${API_BASE_URL}/education-category`).catch(
            () => [],
          ),
          fetchAllPaginated(`${API_BASE_URL}/education-sub-category`).catch(
            () => [],
          ),
          fetchAllPaginated(`${API_BASE_URL}/user`).catch(() => []),
          fetchAllPaginated(`${API_BASE_URL}/companies`).catch(() => []),
        ]);

        if (!log) {
          setSearchLog(null);
          return;
        }

        setSearchLog(log);
        setLookups({
          cities: buildLookupMap(cities, ["name", "city_name"]),
          noticePeriods: buildLookupMap(noticePeriodsList, ["name"]),
          workplaceTypes: buildLookupMap(workplaceTypesList, ["name"]),
          industries: buildLookupMap(industriesList, ["name", "industry_name"]),
          subIndustries: buildLookupMap(subIndustriesList, [
            "name",
            "sub_industry_name",
          ]),
          functionRoles: buildLookupMap(functionRolesList, [
            "name",
            "role_name",
          ]),
          educationCategories: buildLookupMap(educationCategoriesList, [
            "name",
          ]),
          educationSubCategories: buildLookupMap(educationSubCategoriesList, [
            "name",
          ]),
          users: buildLookupMap(usersList, ["full_name", "name", "email"]),
          companies: buildLookupMap(companiesList, ["company_name", "name"]),
        });
      } catch (err) {
        console.error("Failed to load search log:", err);
        setSearchLog(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleBack = () => navigate("/search-candidates");

  // ─── Resolve a relation: prefer the nested object from the API,
  // fall back to the lookup map keyed by its *_id field. ──────────
  const resolveRelation = (
    nestedObj,
    idValue,
    lookupMap,
    labelField = "__label",
  ) => {
    if (
      nestedObj &&
      (nestedObj.name || nestedObj.company_name || nestedObj.full_name)
    ) {
      return nestedObj.name || nestedObj.company_name || nestedObj.full_name;
    }
    if (idValue !== null && idValue !== undefined && lookupMap[idValue]) {
      return lookupMap[idValue][labelField];
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading search details...</p>
        </div>
      </div>
    );
  }

  if (!searchLog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5FA]">
        <div className="text-center bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12">
          <MdErrorOutline size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Search log not found</p>
          <button
            onClick={handleBack}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MdArrowBack size={16} />
            Back to search history
          </button>
        </div>
      </div>
    );
  }

  const {
    id: logId,
    search_keyword,
    city_id,
    experience_min,
    experience_max,
    salary_min,
    salary_max,
    notice_period_id,
    employment_type_id,
    workplace_type_id,
    filters_json,
    industry_id,
    sub_industry_id,
    function_role_id,
    education_category_id,
    education_sub_category_id,
    sort_by,
    result_count,
    search_type,
    created_at,
    company,
    companyUser,
    city,
    noticePeriod,
    workplaceType,
    industry,
    subIndustry,
    functionRole,
    educationCategory,
    educationSubCategory,
  } = searchLog;

  const cityName = resolveRelation(city, city_id, lookups.cities);
  const noticePeriodName = resolveRelation(
    noticePeriod,
    notice_period_id,
    lookups.noticePeriods,
  );
  const workplaceTypeName = resolveRelation(
    workplaceType,
    workplace_type_id,
    lookups.workplaceTypes,
  );
  const industryName = resolveRelation(
    industry,
    industry_id,
    lookups.industries,
  );
  const subIndustryName = resolveRelation(
    subIndustry,
    sub_industry_id,
    lookups.subIndustries,
  );
  const functionRoleName = resolveRelation(
    functionRole,
    function_role_id,
    lookups.functionRoles,
  );
  const educationCategoryName = resolveRelation(
    educationCategory,
    education_category_id,
    lookups.educationCategories,
  );
  const educationSubCategoryName = resolveRelation(
    educationSubCategory,
    education_sub_category_id,
    lookups.educationSubCategories,
  );

  const resolvedCompany = company || lookups.companies[searchLog.company_id];
  const resolvedRecruiter =
    companyUser || lookups.users[searchLog.company_user_id];

  const companyName = resolvedCompany?.company_name || "—";
  const companyLogo = getFullImageUrl(resolvedCompany?.logo);

  const experienceRange =
    experience_min || experience_max
      ? `${experience_min ?? 0} - ${experience_max ?? EMPTY_VALUE} yrs`
      : EMPTY_VALUE;

  const salaryRange =
    salary_min || salary_max
      ? `₹${Number(salary_min ?? 0).toLocaleString()} - ₹${
          salary_max ? Number(salary_max).toLocaleString() : EMPTY_VALUE
        }`
      : EMPTY_VALUE;

  // ─── Render tab content ──────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <FieldLabel>Search Keyword</FieldLabel>
              <ReadOnlyValue icon={MdSearch}>
                {search_keyword || "—"}
              </ReadOnlyValue>
            </div>

            <div>
              <FieldLabel>Search Filters</FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-lg border border-slate-200 p-4">
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    City
                  </span>
                  <p className="text-sm text-slate-700">
                    {cityName || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Experience
                  </span>
                  <p className="text-sm text-slate-700">
                    {experienceRange || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Expected Salary
                  </span>
                  <p className="text-sm text-slate-700">
                    {salaryRange || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Notice Period
                  </span>
                  <p className="text-sm text-slate-700">
                    {noticePeriodName || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Workplace Type
                  </span>
                  <p className="text-sm text-slate-700">
                    {workplaceTypeName || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Industry
                  </span>
                  <p className="text-sm text-slate-700">
                    {industryName || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Sub Industry
                  </span>
                  <p className="text-sm text-slate-700">
                    {subIndustryName || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Function Role
                  </span>
                  <p className="text-sm text-slate-700">
                    {functionRoleName || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Education Category
                  </span>
                  <p className="text-sm text-slate-700">
                    {educationCategoryName || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Education Sub Category
                  </span>
                  <p className="text-sm text-slate-700">
                    {educationSubCategoryName || EMPTY_VALUE}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Sorted By
                  </span>
                  <p className="text-sm text-slate-700">
                    {sort_by || "Default"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Results Found
                  </span>
                  <p className="text-sm text-slate-700">{result_count ?? 0}</p>
                </div>
              </div>
            </div>

            {filters_json && (
              <div>
                <FieldLabel>Additional Filters (raw)</FieldLabel>
                <pre className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
                  {typeof filters_json === "string"
                    ? filters_json
                    : JSON.stringify(filters_json, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );

      case "company": {
        const hasWebsite = Boolean(resolvedCompany && resolvedCompany.website);
        const hasStatus = Boolean(
          resolvedCompany && resolvedCompany.company_status,
        );
        const hasCompletion = Boolean(
          resolvedCompany && resolvedCompany.profile_completion_percentage,
        );

        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MdBusiness size={18} className="text-blue-600" />
                Company
              </h3>
              <div className="flex items-start gap-4 bg-slate-50 rounded-lg border border-slate-200 p-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MdApartment size={22} className="text-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{companyName}</p>

                  {hasWebsite ? (
                    <a
                      href={resolvedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
                    >
                      <span>{resolvedCompany.website}</span>
                      <MdOpenInNew size={12} />
                    </a>
                  ) : null}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {hasStatus ? (
                      <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 capitalize">
                        {resolvedCompany.company_status}
                      </span>
                    ) : null}

                    {hasCompletion ? (
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                        {resolvedCompany.profile_completion_percentage}%
                        complete
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MdPerson size={18} className="text-blue-600" />
                Recruiter
              </h3>
              {resolvedRecruiter ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      Name
                    </span>
                    <p className="text-sm text-slate-700">
                      {resolvedRecruiter.full_name || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      Designation
                    </span>
                    <p className="text-sm text-slate-700">
                      {resolvedRecruiter.designation || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      Email
                    </span>
                    <p className="text-sm text-slate-700 flex items-center gap-1">
                      <MdEmail size={13} className="text-slate-400" />
                      <span>{resolvedRecruiter.email || "—"}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      Mobile
                    </span>
                    <p className="text-sm text-slate-700 flex items-center gap-1">
                      <MdPhone size={13} className="text-slate-400" />
                      <span>{resolvedRecruiter.mobile || "—"}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  No recruiter info available.
                </p>
              )}
            </div>
          </div>
        );
      }

      case "activity":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Search ID</FieldLabel>
                <ReadOnlyValue icon={MdBadge}>#{logId}</ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Search Type</FieldLabel>
                <div className="py-2">
                  <SearchTypeBadge type={search_type} />
                </div>
              </div>
              <div>
                <FieldLabel>Result Count</FieldLabel>
                <ReadOnlyValue icon={MdCategory}>
                  {result_count ?? 0} candidates
                </ReadOnlyValue>
              </div>
              <div>
                <FieldLabel>Searched On</FieldLabel>
                <ReadOnlyValue icon={MdCalendarToday}>
                  {displayDate(created_at)}
                </ReadOnlyValue>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* ─── Sticky action bar ─────────────────────────────────── */}
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
                Search History
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight max-w-[45vw]">
                "{search_keyword || "Untitled search"}"
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              Back
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
          <div className="relative h-40 sm:h-44 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-7 pb-5 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <MdSearch size={26} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">
                  "{search_keyword || "Untitled search"}"
                </h1>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <SearchTypeBadge type={search_type} />
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdBusiness size={12} /> {companyName}
                  </span>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <MdCalendarToday size={12} /> {displayDate(created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Quick stat strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdCategory size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Results
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {result_count ?? 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdLocationOn size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">City</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {cityName || EMPTY_VALUE}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdWork size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">
                Experience
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {experienceRange || EMPTY_VALUE}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/80 backdrop-blur-sm px-3.5 py-2.5 border border-slate-200 shadow-sm">
            <MdAttachMoney size={16} className="text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 leading-tight">Salary</p>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {salaryRange || EMPTY_VALUE}
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
                      layoutId="search-view-tab-underline"
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
      </div>
    </div>
  );
};

export default ViewSearchCandidate;
