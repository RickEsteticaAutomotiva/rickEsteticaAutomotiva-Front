export function CardLargo({ text, icon: Icon, iconSize = 24 }) {
    return (
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Icon 
                        size={iconSize} 
                        className="text-gray-700"
                    />
                </div>
                <span className="text-xl font-semibold text-gray-800 text-center">{text}</span>
            </div>
        </div>
    );
}