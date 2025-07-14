"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  BarChart3,
  Activity,
  Target,
  Zap,
} from "lucide-react";

interface GA4Data {
  pageViews: number;
  uniqueUsers: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  eventCount: number;
  topPages: Array<{ page: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
}

interface TrafficData {
  date: string;
  screenPageViews: number;
  activeUsers: number;
}

interface DevicesData {
  deviceCategory: string;
  screenPageViews: number;
  activeUsers: number;
}

interface CountriesData {
  country: string;
  screenPageViews: number;
  activeUsers: number;
}

interface PagesData {
  pagePath: string;
  screenPageViews: number;
  avgSessionDuration: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function GA4Analytics() {
  const [overviewData, setOverviewData] = useState<GA4Data | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [devicesData, setDevicesData] = useState<DevicesData[]>([]);
  const [countriesData, setCountriesData] = useState<CountriesData[]>([]);
  const [pagesData, setPagesData] = useState<PagesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const overviewResponse = await fetch("/api/ga4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: "overview" }),
      });

      if (!overviewResponse.ok) {
        const errorData = await overviewResponse.json();
        setError(errorData.message || "Error fetching GA4 data");
        return;
      }

      const overview = await overviewResponse.json();
      setOverviewData(overview);

      const trafficResponse = await fetch("/api/ga4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: "traffic" }),
      });

      if (trafficResponse.ok) {
        const traffic = await trafficResponse.json();
        setTrafficData(traffic);
      }

      const devicesResponse = await fetch("/api/ga4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: "devices" }),
      });

      if (devicesResponse.ok) {
        const devices = await devicesResponse.json();
        setDevicesData(devices);
      }

      const countriesResponse = await fetch("/api/ga4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: "countries" }),
      });

      if (countriesResponse.ok) {
        const countries = await countriesResponse.json();
        setCountriesData(countries);
      }

      const pagesResponse = await fetch("/api/ga4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: "pages" }),
      });

      if (pagesResponse.ok) {
        const pages = await pagesResponse.json();
        setPagesData(pages);
      }
    } catch (err) {
      console.error("Erro ao obter dados do GA4:", err);
      setError("API connection error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#0476D9] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#011640] text-base sm:text-lg font-semibold animate-pulse">
            Loading GA4 data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-red-800">
              Configuration Error
            </h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "traffic", name: "Traffic", icon: TrendingUp },
    { id: "devices", name: "Devices", icon: Smartphone },
    { id: "countries", name: "Countries", icon: Globe },
    { id: "pages", name: "Pages", icon: Monitor },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF1] shadow-sm overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#0476D9] to-[#0366C4] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Google Analytics 4
              </h2>
              <p className="text-white/80 text-xs sm:text-sm">
                Real-time data from your website
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-xs sm:text-sm font-medium">Real Data</span>
          </div>
        </div>
      </div>

      {/* Modern tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-1 p-2 sm:p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-white text-[#0476D9] shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {activeTab === "overview" && overviewData && (
          <div className="space-y-6 sm:space-y-8">
            {/* Main metrics with awesome design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">
                    {overviewData.pageViews.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-medium text-blue-800">
                  Page Views
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  +12% vs last month
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 border border-green-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {overviewData.uniqueUsers.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-medium text-green-800">
                  Unique Users
                </div>
                <div className="text-xs text-green-600 mt-1">
                  +8% vs last month
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 sm:p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">
                    {overviewData.sessions.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-medium text-purple-800">
                  Sessions
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  +15% vs last month
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 sm:p-6 border border-orange-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">
                    {overviewData.bounceRate.toFixed(1)}%
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-medium text-orange-800">
                  Bounce Rate
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  -5% vs last month
                </div>
              </div>
            </div>

            {/* Charts with modern design */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-lg flex items-center justify-center">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
                    Most Visited Pages
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <BarChart data={overviewData.topPages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF1" />
                    <XAxis dataKey="page" stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                    <YAxis stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5EAF1",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="views" fill="#0476D9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-lg flex items-center justify-center">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
                    Most Common Events
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <PieChart>
                    <Pie
                      data={overviewData.topEvents}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ event, percent }) =>
                        `${event} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {overviewData.topEvents.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5EAF1",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "traffic" && trafficData.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
                Traffic Evolution (30 days)
              </h3>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
              <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF1" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                  <YAxis stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5EAF1",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="screenPageViews"
                    stackId="1"
                    stroke="#0476D9"
                    fill="#0476D9"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "devices" && devicesData.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-lg flex items-center justify-center">
                <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
                Traffic by Device
              </h3>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
              <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                <BarChart data={devicesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF1" />
                  <XAxis
                    dataKey="deviceCategory"
                    stroke="#6B7280"
                    fontSize={10}
                    className="sm:text-xs"
                  />
                  <YAxis stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5EAF1",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="screenPageViews"
                    fill="#0476D9"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="activeUsers"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "countries" && countriesData.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-lg flex items-center justify-center">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
                Traffic by Country
              </h3>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
              <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                <BarChart data={countriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF1" />
                  <XAxis dataKey="country" stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                  <YAxis stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5EAF1",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="screenPageViews"
                    fill="#0476D9"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="activeUsers"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "pages" && pagesData.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-lg flex items-center justify-center">
                <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
                Page Performance
              </h3>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
              <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                <BarChart data={pagesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF1" />
                  <XAxis dataKey="pagePath" stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                  <YAxis stroke="#6B7280" fontSize={10} className="sm:text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5EAF1",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="screenPageViews"
                    fill="#0476D9"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="avgSessionDuration"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Show message when no data available */}
        {activeTab !== "overview" &&
          ((activeTab === "traffic" && trafficData.length === 0) ||
            (activeTab === "devices" && devicesData.length === 0) ||
            (activeTab === "countries" && countriesData.length === 0) ||
            (activeTab === "pages" && pagesData.length === 0)) && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No data available
              </h3>
              <p className="text-gray-500 text-sm">
                This data will appear once you have traffic on your website.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
