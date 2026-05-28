import { InfoTooltip } from '../../info-tooltip/InfoTooltip';

export function MetricCard({ title, value, percent, trend, infoMessage }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
        <h3>{title}</h3>
        {infoMessage ? <InfoTooltip message={infoMessage} /> : null}
      </div>

      <div className="mt-2 flex items-center gap-2 justify-between">
        <p className="text-lg font-bold text-gray-900">{value}</p>

        {/*
        <span className="text-sm text-gray-600 flex items-center">
          {percent}%
          {trend === "up" ? (
            <ArrowUp size={14} className="text-green-500" />
          ) : (
            <ArrowDown size={14} className="text-red-500" />
          )}
        </span>
        */}
      </div>
    </div>
  );
}
