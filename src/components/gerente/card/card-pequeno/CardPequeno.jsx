export function CardPequeno({texto, label, src = "", alt = "", styleIma = ""}) {

    return (
        <div className="flex flex-col justify-center items-center">
                            <span className="text-2xl font-semibold text-gray-800 flex gap-2 items-center justify-center">
                    {src && <img src={src} alt={alt} className={styleIma} />} {texto}
                </span>
            <span className="text-base font-medium text-gray-300">{label}</span>
        </div>
    );
}