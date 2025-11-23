export function CardMedio({ valor, label, src = "", alt = "", styleIma = "" }) {
    return (
        <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center gap-4">
                <span className="text-2xl font-semibold text-gray-800 flex gap-2 items-center justify-center">
                    {src && <img src={src} alt={alt} className={styleIma} />} {valor}
                </span>
                <span className="block text-base font-medium text-gray-500">{label}</span>
            </div>
        </div>
    );
}