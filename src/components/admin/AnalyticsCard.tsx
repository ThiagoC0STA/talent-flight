import { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function AnalyticsCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: AnalyticsCardProps) {
  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${color} flex-shrink-0 ml-3`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
 