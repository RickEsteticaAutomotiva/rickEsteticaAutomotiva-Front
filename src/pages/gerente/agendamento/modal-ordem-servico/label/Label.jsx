export function Label({ label, value, className = "" }) {
    return (
        <div className={className}>
            <label className="text-sm text-gray-500">{label}</label>
            <p className="font-medium">{value}</p>
        </div>
    );
}