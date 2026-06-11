export function CardMedio({ valor, label, icon: Icon, iconSize = 24 }) {
    return (
        <div className="flex-1 flex justify-center bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center gap-4">
                <div className="text-xl font-semibold text-gray-800 flex gap-2 justify-center items-center">
                    {Icon && (
                        <Icon 
                            size={iconSize} 
                            className="text-gray-700"
                        />
                    )}
                    {valor}
                </div>
                <span className="text-base font-medium text-gray-500">{label}</span>
            </div>
        </div>
    );
}