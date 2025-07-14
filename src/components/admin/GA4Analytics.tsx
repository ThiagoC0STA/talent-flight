import { useEffect, useState } from "react";
import { BarChart3, Users, Eye, Clock, TrendingDown, Activity } from "lucide-react";
import Card from "@/components/ui/Card";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import { ga4Service, GA4Data } from "@/lib/ga4";

export default function GA4Analytics() {
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGA4Data = async () => {
      try {
        setLoading(true);
        const data = await ga4Service.getAnalyticsData();
        setGa4Data(data);
      } catch (error) {
        console.error("Erro ao carregar dados do GA4:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGA4Data();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!ga4Data) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-[#011640] mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Google Analytics 4
        </h3>
        <p className="text-gray-500 text-center py-8">
          Dados do Google Analytics não disponíveis
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-[#011640] flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Google Analytics 4
      </h3>
      
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Page Views"
          value={ga4Data.pageViews.toLocaleString()}
          icon={Eye}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <AnalyticsCard
          title="Unique Users"
          value={ga4Data.uniqueUsers.toLocaleString()}
          icon={Users}
          color="bg-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <AnalyticsCard
          title="Sessions"
          value={ga4Data.sessions.toLocaleString()}
          icon={Activity}
          color="bg-purple-500"
          trend={{ value: 15, isPositive: true }}
        />
        <AnalyticsCard
          title="Bounce Rate"
          value={`${ga4Data.bounceRate.toFixed(1)}%`}
          icon={TrendingDown}
          color="bg-orange-500"
          trend={{ value: -2, isPositive: false }}
        />
        <AnalyticsCard
          title="Avg Session"
          value={`${Math.floor(ga4Data.avgSessionDuration / 60)}m ${ga4Data.avgSessionDuration % 60}s`}
          icon={Clock}
          color="bg-teal-500"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-[#011640] mb-4">Top Pages</h4>
          <div className="space-y-3">
            {ga4Data.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#0476D9] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm text-[#011640] truncate">{page.page}</span>
                </div>
                <span className="text-sm font-medium text-[#0476D9]">{page.views}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Events */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-[#011640] mb-4">Top Events</h4>
          <div className="space-y-3">
            {ga4Data.topEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#0476D9] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm text-[#011640] capitalize">{event.event.replace(/_/g, ' ')}</span>
                </div>
                <span className="text-sm font-medium text-[#0476D9]">{event.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 