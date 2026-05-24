export function CardMedio({ valor, label, icon: Icon, iconSize = 24 }) {
    return (
        <div className="flex h-full w-full min-w-0 flex-1 justify-center rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
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