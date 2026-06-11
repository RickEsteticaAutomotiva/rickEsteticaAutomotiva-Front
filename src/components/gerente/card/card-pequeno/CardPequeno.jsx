export function CardPequeno({ texto, label, icon: Icon, iconSize = 24 }) {
    return (
        <div className="flex flex-col justify-center items-center w-full">
            <span className="text-center text-lg md:text-xl font-semibold text-gray-800 flex gap-2 items-center justify-center whitespace-normal break-words md:whitespace-nowrap">
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