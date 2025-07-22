"use client";

import { useState, useEffect } from "react";
import {
  getAllAlerts,
  deactivateAlert,
  getAlertStats,
} from "@/lib/jobAlerts";
import Button from "@/components/ui/Button";
import { JobAlert } from "@/lib/jobAlerts";

export default function JobAlertsManager() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [alertsData, statsData] = await Promise.all([
        getAllAlerts(),
        getAlertStats(),
      ]);

      setAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (alertId: string) => {
    setDeactivating(alertId);
    try {
      await deactivateAlert(alertId);
      // Atualiza o alert localmente
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_active: false }
          : alert
      ));
      await loadData(); // Recarregar stats
    } catch (error) {
      console.error("Error deactivating alert:", error);
    } finally {
      setDeactivating(null);
    }
  };

  if (loading) {
    return (
              <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Total Alerts
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalAlerts}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Active Alerts
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.activeAlerts}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Notifications Sent
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalNotifications}
            </p>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Job Alerts ({alerts.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {alerts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No alerts found.
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            {alert.user_email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {alert.user_email}
                        </p>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              alert.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {alert.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        {alert.technologies &&
                          alert.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {alert.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        <p className="text-xs text-gray-500 mt-1">
                          Created:{" "}
                          {new Date(alert.created_at!).toLocaleDateString(
                            "en-US"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {alert.is_active ? (
                    <Button
                      onClick={() => handleDeactivate(alert.id!)}
                      disabled={deactivating === alert.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                    >
                      {deactivating === alert.id
                        ? "Deactivating..."
                        : "Deactivate"}
                    </Button>
                    ) : (
                      <span className="text-xs text-gray-500 px-3 py-1">
                        Deactivated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
 