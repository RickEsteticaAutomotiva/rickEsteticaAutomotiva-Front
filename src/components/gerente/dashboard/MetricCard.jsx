import { ArrowUp, ArrowDown } from "lucide-react";

export function MetricCard({ title, value, percent, trend }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>

      <div className="mt-2 flex items-center gap-2 justify-between">
        <p className="text-lg font-bold text-gray-900">{value}</p>

        <span className="text-sm text-gray-600 flex items-center">
          {percent}%
          {trend === "up" ? (
            <ArrowUp size={14} className="text-green-500" />
          ) : (
            <ArrowDown size={14} className="text-red-500" />
          )}
        </span>
      </div>
    </div>
  );
}
