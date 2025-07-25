import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react";
import Card from "@/components/ui/Card";
import { Job } from "@/types/job";

interface AnalyticsChartsProps {
  jobs: Job[];
}

export default function AnalyticsCharts({ jobs }: AnalyticsChartsProps) {
  const [chartData, setChartData] = useState({
    jobsByMonth: [] as { month: string; count: number }[],
    jobsByCategory: [] as { category: string; count: number }[],
    jobsByType: [] as { type: string; count: number }[],
    remoteVsOnsite: { remote: 0, onsite: 0 },
  });

  useEffect(() => {
    if (jobs.length === 0) return;

    // Jobs by month (last 6 months)
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(
        date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      );
    }

    const jobsByMonth = months.map((month) => {
      const count = jobs.filter((job) => {
        const jobDate = new Date(job.createdAt);
        const jobMonth = jobDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        return jobMonth === month;
      }).length;
      return { month, count };
    });

    // Jobs by category
    const categoryCount = jobs.reduce((acc, job) => {
      acc[job.category] = (acc[job.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const jobsByCategory = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Jobs by type
    const typeCount = jobs.reduce((acc, job) => {
      acc[job.type] = (acc[job.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const jobsByType = Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Remote vs Onsite
    const remoteCount = jobs.filter((job) => job.isRemote).length;
    const onsiteCount = jobs.length - remoteCount;

    setChartData({
      jobsByMonth,
      jobsByCategory,
      jobsByType,
      remoteVsOnsite: { remote: remoteCount, onsite: onsiteCount },
    });
  }, [jobs]);

  const maxCount = Math.max(...chartData.jobsByMonth.map((d) => d.count), 1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Jobs by Month */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9]" />
          <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
            Jobs by Month
          </h3>
        </div>
        <div className="flex items-end gap-1 sm:gap-2 h-24 sm:h-32">
          {chartData.jobsByMonth.map((data, index) => (
            <div
              key={`${data.month}-${index}`}
              className="flex-1 flex flex-col items-center"
            >
              <div
                className="w-full bg-gradient-to-t from-[#0476D9] to-[#0487D9] rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${(data.count / maxCount) * 100}%` }}
              />
              <span className="text-xs text-gray-600 mt-1 sm:mt-2 text-center">
                {data.month}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-3 sm:mt-4">
          <span className="text-xs sm:text-sm text-gray-500">
            Total: {jobs.length} jobs
          </span>
        </div>
      </Card>

      {/* Jobs by Category */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9]" />
          <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
            Jobs by Category
          </h3>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {chartData.jobsByCategory.map((data) => (
            <div key={data.category} className="flex items-center gap-2 sm:gap-3">
              <div className="w-16 sm:w-24 text-xs sm:text-sm font-medium text-gray-700 capitalize truncate">
                {data.category}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className="bg-gradient-to-r from-[#0476D9] to-[#0487D9] h-2 sm:h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (data.count /
                        Math.max(
                          ...chartData.jobsByCategory.map((d) => d.count)
                        )) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="w-6 sm:w-8 text-xs sm:text-sm font-semibold text-gray-900">
                {data.count}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Remote vs Onsite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9]" />
            <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
              Remote vs Onsite
            </h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${
                    (chartData.remoteVsOnsite.remote / jobs.length) * 251
                  } 251`}
                  className="text-[#0476D9]"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center ml-1 mb-1 sm:-ml-6 sm:-mb-6">
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="text-lg sm:text-2xl font-bold text-[#011640]">
                    {Math.round(
                      (chartData.remoteVsOnsite.remote / jobs.length) * 100
                    )}
                    %
                  </div>
                  <div className="text-xs text-gray-600">Remote</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#0476D9] rounded-full"></div>
              <span>Remote: {chartData.remoteVsOnsite.remote}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></div>
              <span>Onsite: {chartData.remoteVsOnsite.onsite}</span>
            </div>
          </div>
        </Card>

        {/* Jobs by Type */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9]" />
            <h3 className="text-base sm:text-lg font-semibold text-[#011640]">
              Jobs by Type
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {chartData.jobsByType.map((data) => (
              <div key={data.type} className="flex items-center gap-2 sm:gap-3">
                <div className="w-16 sm:w-20 text-xs sm:text-sm font-medium text-gray-700 capitalize truncate">
                  {data.type}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-gradient-to-r from-[#0476D9] to-[#0487D9] h-2 sm:h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (data.count /
                          Math.max(
                            ...chartData.jobsByType.map((d) => d.count)
                          )) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="w-6 sm:w-8 text-xs sm:text-sm font-semibold text-gray-900">
                  {data.count}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
