import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import ChartCard from "../../components/dashboard/ChartCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import {
  fetchDashboardStats,
  fetchRecentActivities,
} from "../../controllers/dashboard.controller";
import {
  MdPeople,
  MdWork,
  MdArticle,
  MdBusiness,
  MdPersonAdd,
  MdPostAdd,
  MdPerson,
  MdBusinessCenter,
  MdGroup,
  MdDashboard,
} from "react-icons/md";
import axios from "axios";

// Mock data for charts and activities (keep as fallbacks)
const mockChartData = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 85 },
  { name: "Mar", value: 62 },
  { name: "Apr", value: 110 },
  { name: "May", value: 95 },
  { name: "Jun", value: 145 },
  { name: "Jul", value: 130 },
  { name: "Aug", value: 160 },
];
const mockJobData = [
  { name: "IT", value: 120 },
  { name: "Finance", value: 80 },
  { name: "Marketing", value: 60 },
  { name: "Design", value: 45 },
  { name: "Sales", value: 90 },
];
const mockActivities = [
  {
    user: "Sam Shah",
    message: "New user registered: john@example.com",
    created_at: new Date(Date.now() - 300000),
  },
  {
    user: "Admin",
    message: 'Job post "Senior Dev at TechCorp" approved',
    created_at: new Date(Date.now() - 900000),
  },
  {
    user: "Moderator",
    message: 'Blog "Top 10 Career Tips" published',
    created_at: new Date(Date.now() - 1800000),
  },
  {
    user: "System",
    message: "Daily backup completed successfully",
    created_at: new Date(Date.now() - 3600000),
  },
];

const Dashboard = () => {
  // Stats state
  const [stats, setStats] = useState({
    total_active_candidates: 0,
    total_active_jobs: 0,
    total_active_companies: 0,
    total_search_count: 0,
  });

  const [chartData, setChartData] = useState(mockChartData);
  const [candidateChartData, setCandidateChartData] = useState(mockChartData);
  const [jobData, setJobData] = useState(mockJobData);
  const [activities, setActivities] = useState(mockActivities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all APIs in parallel
        const [dashboardRes, usersRes, candidatesRes, jobsRes] =
          await Promise.all([
            axios.get("https://apidata.hiremejobs.in/admin-dashboard/"),
            axios.get("https://apidata.hiremejobs.in/user/"),
            axios.get("https://apidata.hiremejobs.in/candidate/"),
            axios.get("https://apidata.hiremejobs.in/jobs/"),
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

        // 2. Process User Data for Line Chart (Registrations over time)
        if (usersRes.data?.success && usersRes.data.data) {
          const users = usersRes.data.data;
          // Group users by month (using createdAt)
          const monthlyCounts = users.reduce((acc, user) => {
            if (user.createdAt) {
              const month = new Date(user.createdAt).toLocaleString("default", {
                month: "short",
              });
              acc[month] = (acc[month] || 0) + 1;
            }
            return acc;
          }, {});

          // Convert to chart format and sort by month
          const monthOrder = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const formattedData = monthOrder.map((month) => ({
            name: month,
            value: monthlyCounts[month] || 0,
          }));

          setChartData(formattedData);
        }

        // 3. Process Candidate Data for Line Chart (Registrations over time)
        if (candidatesRes.data?.success && candidatesRes.data.data) {
          const candidates =
            candidatesRes.data.data.data || candidatesRes.data.data;
          // Group candidates by month (using createdAt)
          const monthlyCounts = candidates.reduce((acc, candidate) => {
            if (candidate.createdAt) {
              const month = new Date(candidate.createdAt).toLocaleString(
                "default",
                {
                  month: "short",
                },
              );
              acc[month] = (acc[month] || 0) + 1;
            }
            return acc;
          }, {});

          // Convert to chart format and sort by month
          const monthOrder = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const formattedData = monthOrder.map((month) => ({
            name: month,
            value: monthlyCounts[month] || 0,
          }));

          setCandidateChartData(formattedData);
        }

        // 4. Process Job Data for Bar Chart (Jobs by Industry)
        if (jobsRes.data?.success && jobsRes.data.data) {
          const jobs = jobsRes.data.data;
          // Count jobs by industry name
          const industryCounts = jobs.reduce((acc, job) => {
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

          // Convert to chart format and sort by count (descending)
          let formattedData = Object.entries(industryCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

          // Ensure at least 4 categories are shown
          if (formattedData.length < 4) {
            // If we have less than 4 categories, add dummy data to fill
            const fillerCategories = [
              { name: "Others", value: 0 },
              { name: "Education", value: 0 },
              { name: "Healthcare", value: 0 },
              { name: "Retail", value: 0 },
            ];

            const fillerToAdd = fillerCategories.slice(
              0,
              4 - formattedData.length,
            );
            formattedData = [...formattedData, ...fillerToAdd];
          } else {
            // Show top 10 industries
            formattedData = formattedData.slice(0, 10);
          }

          if (formattedData.length > 0) {
            setJobData(formattedData);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Remove change percentage - return null or 0
  const getChange = () => null;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Loading Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>

        {/* Charts Loading Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-[#2c0eee] text-white rounded-lg hover:bg-[#250bc4] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats - Enhanced with better UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Active Candidates"
          value={stats.total_active_candidates}
          icon={MdPeople}
          color="purple"
          onClick={() => navigate("/candidates")}
          // change={null} // No change displayed
        />
        <StatsCard
          title="Active Jobs"
          value={stats.total_active_jobs}
          icon={MdWork}
          color="green"
          onClick={() => navigate("/jobs")}
          // change={null}
        />
        <StatsCard
          title="Active Companies"
          value={stats.total_active_companies}
          icon={MdBusiness}
          color="orange"
          onClick={() => navigate("/companies")}
          // change={null}
        />
        <StatsCard
          title="Total Searches"
          value={stats.total_search_count}
          icon={MdArticle}
          color="blue"
          // change={null}
        />
      </div>

      {/* Charts with Dynamic Data - User Registrations and Jobs by Industry side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="User Registrations"
          data={chartData}
          type="line"
          color="#2C0EEE"
        />
        <ChartCard
          title="Jobs by Industry"
          data={jobData}
          type="bar"
          color="#2C0EEE"
        />
      </div>

      {/* Candidate Registrations - Full width below */}
      <div className="grid grid-cols-1 gap-4">
        <ChartCard
          title="Candidate Registrations"
          data={candidateChartData}
          type="line"
          color="#2C0EEE"
        />
      </div>

      {/* Quick Actions - Enhanced with 6 actions */}
      {/* <div className="grid grid-cols-1 gap-4"> */}
      {/* <div className="w-full">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                {
                  label: "Add User",
                  icon: MdPersonAdd,
                  path: "/users/add",
                  color: "bg-blue-50 text-[#2c0eee] hover:bg-blue-100",
                },
                {
                  label: "Post Job",
                  icon: MdPostAdd,
                  path: "/jobs/add",
                  color: "bg-green-50 text-green-700 hover:bg-green-100",
                },
                {
                  label: "Candidates",
                  icon: MdPerson,
                  path: "/candidates",
                  color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
                },
                {
                  label: "Companies",
                  icon: MdBusinessCenter,
                  path: "/companies",
                  color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
                },
                {
                  label: "Users",
                  icon: MdGroup,
                  path: "/users",
                  color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
                },
              ].map((a) => (
                <a
                  key={a.label}
                  href={a.path}
                  className={`${a.color} rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center justify-center`}
                >
                  <div className="text-3xl mb-2">
                    {a.icon({ className: "w-8 h-8" })}
                  </div>
                  <p className="text-sm font-medium">{a.label}</p>
                </a>
              ))}
            </div>
          </div>
        </div> */}
      {/* <RecentActivity activities={activities} /> */}
      {/* </div> */}
    </div>
  );
};

export default Dashboard;
