export function CardLargo({ text, src = "", alt = "", styleIma = "" }) {
    return (
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <img src={src} alt={alt} className={styleIma} />
                </div>
                <span className="text-2xl font-semibold text-gray-800">{text}</span>
            </div>
        </div>
    );
}