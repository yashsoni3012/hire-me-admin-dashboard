// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import StatsCard from "../../components/dashboard/StatsCard";
// import ChartCard from "../../components/dashboard/ChartCard";
// import RecentActivity from "../../components/dashboard/RecentActivity";
// import {
//   fetchDashboardStats,
//   fetchRecentActivities,
// } from "../../controllers/dashboard.controller";
// import {
//   MdPeople,
//   MdWork,
//   MdArticle,
//   MdBusiness,
//   MdPersonAdd,
//   MdPostAdd,
//   MdPerson,
//   MdBusinessCenter,
//   MdGroup,
//   MdDashboard,
// } from "react-icons/md";
// import axios from "axios";

// // Mock data for charts and activities (keep as fallbacks)
// const mockChartData = [
//   { name: "Jan", value: 40 },
//   { name: "Feb", value: 85 },
//   { name: "Mar", value: 62 },
//   { name: "Apr", value: 110 },
//   { name: "May", value: 95 },
//   { name: "Jun", value: 145 },
//   { name: "Jul", value: 130 },
//   { name: "Aug", value: 160 },
// ];
// const mockJobData = [
//   { name: "IT", value: 120 },
//   { name: "Finance", value: 80 },
//   { name: "Marketing", value: 60 },
//   { name: "Design", value: 45 },
//   { name: "Sales", value: 90 },
// ];
// const mockActivities = [
//   {
//     user: "Sam Shah",
//     message: "New user registered: john@example.com",
//     created_at: new Date(Date.now() - 300000),
//   },
//   {
//     user: "Admin",
//     message: 'Job post "Senior Dev at TechCorp" approved',
//     created_at: new Date(Date.now() - 900000),
//   },
//   {
//     user: "Moderator",
//     message: 'Blog "Top 10 Career Tips" published',
//     created_at: new Date(Date.now() - 1800000),
//   },
//   {
//     user: "System",
//     message: "Daily backup completed successfully",
//     created_at: new Date(Date.now() - 3600000),
//   },
// ];

// const Dashboard = () => {
//   // Stats state
//   const [stats, setStats] = useState({
//     total_active_candidates: 0,
//     total_active_jobs: 0,
//     total_active_companies: 0,
//     total_search_count: 0,
//   });

//   const [chartData, setChartData] = useState(mockChartData);
//   const [candidateChartData, setCandidateChartData] = useState(mockChartData);
//   const [jobData, setJobData] = useState(mockJobData);
//   const [activities, setActivities] = useState(mockActivities);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch all APIs in parallel
//         const [dashboardRes, usersRes, candidatesRes, jobsRes] =
//           await Promise.all([
//             axios.get("https://apidata.hiremejobs.in/admin-dashboard/"),
//             axios.get("https://apidata.hiremejobs.in/user/"),
//             axios.get("https://apidata.hiremejobs.in/candidate/"),
//             axios.get("https://apidata.hiremejobs.in/jobs/"),
//           ]);

//         // 1. Process Dashboard Stats
//         if (dashboardRes.data?.success) {
//           const data = dashboardRes.data.data;
//           setStats({
//             total_active_candidates: data.total_active_candidates || 0,
//             total_active_jobs: data.total_active_jobs || 0,
//             total_active_companies: data.total_active_companies || 0,
//             total_search_count: data.total_search_count || 0,
//           });
//         }

//         // 2. Process User Data for Line Chart (Registrations over time)
//         if (usersRes.data?.success && usersRes.data.data) {
//           const users = usersRes.data.data;
//           // Group users by month (using createdAt)
//           const monthlyCounts = users.reduce((acc, user) => {
//             if (user.createdAt) {
//               const month = new Date(user.createdAt).toLocaleString("default", {
//                 month: "short",
//               });
//               acc[month] = (acc[month] || 0) + 1;
//             }
//             return acc;
//           }, {});

//           // Convert to chart format and sort by month
//           const monthOrder = [
//             "Jan",
//             "Feb",
//             "Mar",
//             "Apr",
//             "May",
//             "Jun",
//             "Jul",
//             "Aug",
//             "Sep",
//             "Oct",
//             "Nov",
//             "Dec",
//           ];

//           const formattedData = monthOrder.map((month) => ({
//             name: month,
//             value: monthlyCounts[month] || 0,
//           }));

//           setChartData(formattedData);
//         }

//         // 3. Process Candidate Data for Line Chart (Registrations over time)
//         if (candidatesRes.data?.success && candidatesRes.data.data) {
//           const candidates =
//             candidatesRes.data.data.data || candidatesRes.data.data;
//           // Group candidates by month (using createdAt)
//           const monthlyCounts = candidates.reduce((acc, candidate) => {
//             if (candidate.createdAt) {
//               const month = new Date(candidate.createdAt).toLocaleString(
//                 "default",
//                 {
//                   month: "short",
//                 },
//               );
//               acc[month] = (acc[month] || 0) + 1;
//             }
//             return acc;
//           }, {});

//           // Convert to chart format and sort by month
//           const monthOrder = [
//             "Jan",
//             "Feb",
//             "Mar",
//             "Apr",
//             "May",
//             "Jun",
//             "Jul",
//             "Aug",
//             "Sep",
//             "Oct",
//             "Nov",
//             "Dec",
//           ];

//           const formattedData = monthOrder.map((month) => ({
//             name: month,
//             value: monthlyCounts[month] || 0,
//           }));

//           setCandidateChartData(formattedData);
//         }

//         // 4. Process Job Data for Bar Chart (Jobs by Industry)
//         if (jobsRes.data?.success && jobsRes.data.data) {
//           const jobs = jobsRes.data.data;
//           // Count jobs by industry name
//           const industryCounts = jobs.reduce((acc, job) => {
//             if (job.JobIndustries && job.JobIndustries.length > 0) {
//               job.JobIndustries.forEach((jobIndustry) => {
//                 if (jobIndustry.SubIndustry?.Industry?.name) {
//                   const industryName = jobIndustry.SubIndustry.Industry.name;
//                   acc[industryName] = (acc[industryName] || 0) + 1;
//                 }
//               });
//             }
//             return acc;
//           }, {});

//           // Convert to chart format and sort by count (descending)
//           let formattedData = Object.entries(industryCounts)
//             .map(([name, value]) => ({ name, value }))
//             .sort((a, b) => b.value - a.value);

//           // Ensure at least 4 categories are shown
//           if (formattedData.length < 4) {
//             // If we have less than 4 categories, add dummy data to fill
//             const fillerCategories = [
//               { name: "Others", value: 0 },
//               { name: "Education", value: 0 },
//               { name: "Healthcare", value: 0 },
//               { name: "Retail", value: 0 },
//             ];

//             const fillerToAdd = fillerCategories.slice(
//               0,
//               4 - formattedData.length,
//             );
//             formattedData = [...formattedData, ...fillerToAdd];
//           } else {
//             // Show top 10 industries
//             formattedData = formattedData.slice(0, 10);
//           }

//           if (formattedData.length > 0) {
//             setJobData(formattedData);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError("Failed to load dashboard data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   // Remove change percentage - return null or 0
//   const getChange = () => null;

//   // Loading state
//   if (loading) {
//     return (
//       <div className="space-y-6">
//         {/* Stats Loading Skeleton */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div
//               key={i}
//               className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse"
//             >
//               <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
//               <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
//               <div className="h-3 bg-gray-200 rounded w-1/3"></div>
//             </div>
//           ))}
//         </div>

//         {/* Charts Loading Skeleton */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
//             <div className="h-48 bg-gray-200 rounded"></div>
//           </div>
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
//             <div className="h-48 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
//             <div className="h-48 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-3 px-4 py-2 bg-[#2c0eee] text-white rounded-lg hover:bg-[#250bc4] transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Stats - Enhanced with better UI */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         <StatsCard
//           title="Active Candidates"
//           value={stats.total_active_candidates}
//           icon={MdPeople}
//           color="purple"
//           onClick={() => navigate("/candidates")}
//           // change={null} // No change displayed
//         />
//         <StatsCard
//           title="Active Jobs"
//           value={stats.total_active_jobs}
//           icon={MdWork}
//           color="green"
//           onClick={() => navigate("/jobs")}
//           // change={null}
//         />
//         <StatsCard
//           title="Active Companies"
//           value={stats.total_active_companies}
//           icon={MdBusiness}
//           color="orange"
//           onClick={() => navigate("/companies")}
//           // change={null}
//         />
//         <StatsCard
//           title="Total Searches"
//           value={stats.total_search_count}
//           icon={MdArticle}
//           color="blue"
//           // change={null}
//         />
//       </div>

//       {/* Charts with Dynamic Data - User Registrations and Jobs by Industry side by side */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <ChartCard
//           title="User Registrations"
//           data={chartData}
//           type="line"
//           color="#2C0EEE"
//         />
//         <ChartCard
//           title="Jobs by Industry"
//           data={jobData}
//           type="bar"
//           color="#2C0EEE"
//         />
//       </div>

//       {/* Candidate Registrations - Full width below */}
//       <div className="grid grid-cols-1 gap-4">
//         <ChartCard
//           title="Candidate Registrations"
//           data={candidateChartData}
//           type="line"
//           color="#2C0EEE"
//         />
//       </div>

//       {/* Quick Actions - Enhanced with 6 actions */}
//       {/* <div className="grid grid-cols-1 gap-4"> */}
//       {/* <div className="w-full">
//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
//             <h3 className="text-base font-semibold text-gray-900 mb-4">
//               Quick Actions
//             </h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
//               {[
//                 {
//                   label: "Add User",
//                   icon: MdPersonAdd,
//                   path: "/users/add",
//                   color: "bg-blue-50 text-[#2c0eee] hover:bg-blue-100",
//                 },
//                 {
//                   label: "Post Job",
//                   icon: MdPostAdd,
//                   path: "/jobs/add",
//                   color: "bg-green-50 text-green-700 hover:bg-green-100",
//                 },
//                 {
//                   label: "Candidates",
//                   icon: MdPerson,
//                   path: "/candidates",
//                   color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
//                 },
//                 {
//                   label: "Companies",
//                   icon: MdBusinessCenter,
//                   path: "/companies",
//                   color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
//                 },
//                 {
//                   label: "Users",
//                   icon: MdGroup,
//                   path: "/users",
//                   color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
//                 },
//               ].map((a) => (
//                 <a
//                   key={a.label}
//                   href={a.path}
//                   className={`${a.color} rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center justify-center`}
//                 >
//                   <div className="text-3xl mb-2">
//                     {a.icon({ className: "w-8 h-8" })}
//                   </div>
//                   <p className="text-sm font-medium">{a.label}</p>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div> */}
//       {/* <RecentActivity activities={activities} /> */}
//       {/* </div> */}
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import ChartCard from "../../components/dashboard/ChartCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import {
  MdPeople,
  MdWork,
  MdBusiness,
  MdPendingActions,
  MdRefresh,
  MdShowChart,
  MdBarChart,
  MdApartment,
  MdWorkOutline,
  MdArrowForward,
  MdMoreVert,
  MdPerson,
  MdLogout,
  MdSettings,
  MdDashboard,
  MdSearch,
} from "react-icons/md";
import axios from "axios";
import { formatDate, getInitials } from "../../utils/helpers";

// ─── Brand theme ───────────────────────────────────────────────
const BRAND_BLUE = "#2C0EEE";
const BRAND_RED = "#F61D25";

// ─── Avatar with initials, colored by string hash ────────────────
const AVATAR_COLORS = [
  "bg-blue-50 text-[#2C0EEE]",
  "bg-emerald-50 text-emerald-600",
  "bg-orange-50 text-orange-500",
  "bg-purple-50 text-purple-600",
  "bg-pink-50 text-pink-600",
  "bg-cyan-50 text-cyan-600",
];

const colorForString = (str = "") => {
  const hash = str.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const Avatar = ({ name }) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${colorForString(
      name || "?",
    )}`}
  >
    {getInitials ? getInitials(name) : (name || "?").charAt(0).toUpperCase()}
  </div>
);

// ─── Rolling N-month bucket, e.g. "Apr 2026" … "Sep 2026" ────────
const groupByLastMonths = (items, dateField, monthsCount = 6) => {
  const now = new Date();
  const buckets = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      name: d.toLocaleString("default", { month: "short", year: "numeric" }),
      value: 0,
    });
  }

  (items || []).forEach((item) => {
    const raw = item?.[dateField];
    if (!raw) return;

    const d = new Date(raw);
    if (isNaN(d)) return;

    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.value += 1;
  });

  return buckets.map(({ name, value }) => ({ name, value }));
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

// ─── Get user from localStorage ─────────────────────────────────
const getLoggedInUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// ─── Get user display name ──────────────────────────────────────
const getUserDisplayName = () => {
  const user = getLoggedInUser();
  if (!user) return "Admin";
  return user.name || user.full_name || user.username || user.email || "Admin";
};

// ─── Get user initials ──────────────────────────────────────────
const getUserInitials = () => {
  const name = getUserDisplayName();
  return name.charAt(0).toUpperCase();
};

// ─── Get user email ─────────────────────────────────────────────
const getUserEmail = () => {
  const user = getLoggedInUser();
  if (!user) return "";
  return user.email || "";
};

const Dashboard = () => {
  // Stats state
  const [stats, setStats] = useState({
    total_active_candidates: 0,
    total_active_jobs: 0,
    total_active_companies: 0,
    total_search_count: 0,
  });

  const [candidateChartData, setCandidateChartData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [jobsByMonthData, setJobsByMonthData] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [pendingCompaniesTotal, setPendingCompaniesTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const rangeLabel = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const fmt = (d) =>
      d.toLocaleString("default", { month: "short", year: "numeric" });
    return `${fmt(start)} – ${fmt(now)}`;
  }, [lastUpdated]);

  // ─── Get logged in user info ──────────────────────────────────
  const loggedInUser = useMemo(() => getLoggedInUser(), []);
  const displayName = useMemo(() => getUserDisplayName(), [loggedInUser]);
  const userInitials = useMemo(() => getUserInitials(), [displayName]);
  const userEmail = useMemo(() => getUserEmail(), [loggedInUser]);

  // ─── Helper: Process job industry data (top 5, no filler noise) ──
  const processJobIndustryData = (jobs) => {
    const industryCounts = (jobs || []).reduce((acc, job) => {
      if (job.JobIndustries && job.JobIndustries.length > 0) {
        job.JobIndustries.forEach((jobIndustry) => {
          if (jobIndustry.SubIndustry?.Industry?.name) {
            const industryName = jobIndustry.SubIndustry.Industry.name;
            acc[industryName] = (acc[industryName] || 0) + 1;
          }
        });
      }
      return acc;
    }, {});

    return Object.entries(industryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // ─── Fetch all data ────────────────────────────────────────────
  const fetchAllData = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const [dashboardRes, candidatesRes, jobsRes, companiesRes] =
        await Promise.all([
          axios.get("https://apidata.hiremejobs.in/admin-dashboard/"),
          axios.get("https://apidata.hiremejobs.in/candidate/"),
          axios.get("https://apidata.hiremejobs.in/jobs/"),
          axios.get("https://apidata.hiremejobs.in/companies/"),
        ]);

      // 1. Process Dashboard Stats
      if (dashboardRes.data?.success) {
        const data = dashboardRes.data.data;
        setStats({
          total_active_candidates: data.total_active_candidates || 0,
          total_active_jobs: data.total_active_jobs || 0,
          total_active_companies: data.total_active_companies || 0,
          total_search_count: data.total_search_count || 0,
        });
      }

      // 2. Process Candidate Data (rolling last 6 months)
      if (candidatesRes.data?.success && candidatesRes.data.data) {
        const candidates =
          candidatesRes.data.data.data || candidatesRes.data.data;
        setCandidateChartData(groupByLastMonths(candidates, "createdAt", 6));
      }

      // 3. Process Job Data
      if (jobsRes.data?.success && jobsRes.data.data) {
        const jobs = jobsRes.data.data;

        setJobData(processJobIndustryData(jobs));
        setJobsByMonthData(groupByLastMonths(jobs, "created_at", 6));

        const recent = jobs
          .filter((job) => job.created_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentJobs(recent);
      }

      // 4. Process Companies Data - PENDING COMPANIES
      if (companiesRes.data?.success && companiesRes.data.data) {
        const companies = companiesRes.data.data;
        const allPending = companies.filter(
          (company) => company.company_status?.toLowerCase() === "pending",
        );
        setPendingCompaniesTotal(allPending.length);

        const pendingCompanies = allPending
          .filter((company) => company.created_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentCompanies(pendingCompanies);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ─── Close dropdown on outside click ──────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // ─── Logout handler ────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ─── Get status badge ──────────────────────────────────────────
  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-700",
      published: "bg-emerald-50 text-emerald-700",
      pending: "bg-amber-50 text-amber-700",
      inactive: "bg-gray-100 text-gray-600",
      blocked: "bg-red-50 text-[#F61D25]",
      draft: "bg-blue-50 text-[#2C0EEE]",
    };
    const dotColor = {
      active: "bg-emerald-500",
      published: "bg-emerald-500",
      pending: "bg-amber-500",
      inactive: "bg-gray-400",
      blocked: "bg-[#F61D25]",
      draft: "bg-[#2C0EEE]",
    };

    const key = status?.toLowerCase() || "pending";
    const color = styles[key] || styles.pending;
    const dot = dotColor[key] || dotColor.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
      </span>
    );
  };

  // ─── Get industry name ─────────────────────────────────────────
  const getIndustryName = (company) => {
    if (company.Industries && company.Industries.length > 0) {
      return company.Industries[0]?.industry_name || "N/A";
    }
    return "N/A";
  };

  // ─── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse"
            >
              <div className="h-9 w-9 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-3.5 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-7 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse min-w-0"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex gap-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-[#F61D25] font-medium">{error}</p>
        <button
          onClick={() => fetchAllData()}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#2C0EEE] text-white rounded-lg hover:bg-[#250bc4] transition-colors"
        >
          <MdRefresh size={18} />
          Retry
        </button>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ─── Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Active Candidates"
          value={stats.total_active_candidates}
          icon={MdPeople}
          color="purple"
          featured
          footer="Total registered candidates"
          onClick={() => navigate("/candidates")}
        />
        <StatsCard
          title="Active Jobs"
          value={stats.total_active_jobs}
          icon={MdWork}
          color="green"
          featured
          footer="Currently published jobs"
          onClick={() => navigate("/jobs")}
        />
        <StatsCard
          title="Active Companies"
          value={stats.total_active_companies}
          icon={MdBusiness}
          color="blue"
          featured
          footer="Total active companies"
          onClick={() => navigate("/companies")}
        />
        <StatsCard
          title="Total Search Count"
          value={stats.total_search_count}
          icon={MdSearch}
          color="red"
          featured
          footer="Total searches performed"
        />
      </div>

      {/* ─── Charts ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Jobs Created"
          subtitle="Monthly job creation trend"
          icon={MdShowChart}
          rangeLabel={rangeLabel}
          data={jobsByMonthData}
          type="donut"
          color={BRAND_BLUE}
        />
        <ChartCard
          title="Jobs by Industry"
          subtitle="Total jobs posted per industry"
          icon={MdBarChart}
          data={jobData}
          type="bar"
          multiColor
        />
        <ChartCard
          title="Candidates"
          subtitle="Monthly candidate registrations"
          icon={MdPeople}
          rangeLabel={rangeLabel}
          data={candidateChartData}
          type="line"
          color="#2C0EEE"
        />
      </div>

      {/* ─── Tables ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Companies */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#2C0EEE] flex-shrink-0">
                <MdApartment size={16} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Recent Companies
                </h3>
                <p className="text-xs text-gray-400">
                  Latest pending registrations
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      No pending companies found
                    </td>
                  </tr>
                ) : (
                  recentCompanies.map((company, idx) => (
                    <tr
                      key={company.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/companies/view/${company.id}`)}
                    >
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800 truncate max-w-[130px] block">
                          {company.company_name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 truncate max-w-[110px]">
                        {getIndustryName(company)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(company.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(company.company_status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <MdMoreVert size={16} className="text-gray-300" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {recentCompanies.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => navigate("/companies")}
                className="w-full py-2.5 rounded-md text-sm font-semibold text-white flex items-center justify-center gap-1.5 transition-colors duration-200"
                style={{ backgroundColor: "#2C0EEE" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#250bc4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2C0EEE";
                }}
              >
                View All <MdArrowForward size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#2C0EEE] flex-shrink-0">
                <MdWorkOutline size={16} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Recent Jobs
                </h3>
                <p className="text-xs text-gray-400">
                  Latest jobs posted on the platform
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  recentJobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/jobs/view/${job.id}`)}
                    >
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800 truncate max-w-[150px] block">
                          {job.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 truncate max-w-[110px]">
                        {job.Company?.company_name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(job.job_status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <MdMoreVert size={16} className="text-gray-300" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {recentJobs.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => navigate("/jobs")}
                className="w-full py-2.5 rounded-md text-sm font-semibold text-white flex items-center justify-center gap-1.5 transition-colors duration-200"
                style={{ backgroundColor: "#2C0EEE" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#250bc4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2C0EEE";
                }}
              >
                View All <MdArrowForward size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;