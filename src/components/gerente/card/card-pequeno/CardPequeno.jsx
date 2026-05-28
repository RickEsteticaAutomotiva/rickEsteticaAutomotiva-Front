export function CardPequeno({ texto, label, icon: Icon, iconSize = 24 }) {
    return (
        <div className="flex flex-col justify-center items-center">
            <span className="text-xl font-semibold text-gray-800 flex gap-2 items-center justify-center whitespace-nowrap">
                {Icon && (
                    <Icon 
                        size={iconSize} 
                        className="text-gray-700"
                    />
                )}
                {texto}
            </span>
            <span className="text-base font-medium text-gray-300">{label}</span>
        </div>
    );
}