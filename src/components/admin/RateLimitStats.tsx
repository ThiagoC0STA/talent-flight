"use client";

import { useState, useEffect } from "react";
import { getRateLimitStats } from "@/lib/jobAlerts";
import { Clock, Mail, Users, AlertTriangle } from "lucide-react";

interface RateLimitStats {
  rateLimitedAlerts: number;
  totalActiveAlerts: number;
  emailsLast24h: number;
  rateLimitPercentage: string;
}

export default function RateLimitStats() {
  const [stats, setStats] = useState<RateLimitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getRateLimitStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching rate limit stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p>Unable to load rate limit statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rate Limiting Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Rate Limited</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.rateLimitedAlerts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-green-600 font-medium">Active Alerts</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.totalActiveAlerts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Emails (24h)</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.emailsLast24h}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            <div>
              <p className="text-sm text-orange-600 font-medium">Rate Limit %</p>
              <p className="text-2xl font-bold text-orange-900">
                {stats.rateLimitPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Rate Limiting:</strong> Users receive maximum 1 email per hour to prevent spam. 
          Currently {stats.rateLimitedAlerts} out of {stats.totalActiveAlerts} alerts are rate limited.
        </p>
      </div>
    </div>
  );
} 