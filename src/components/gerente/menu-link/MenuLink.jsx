import { Link, useLocation } from "react-router-dom";

export function MenuLink({ to, text, onClick, src, alt = "", styleIma = "" }) {
    const location = useLocation();
    
    return (
        <Link
            to={to}
            className={`flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors group ${
                location.pathname === to ? "bg-gray-100 text-red-700 border-r-4 border-red-700" : ""
            }`}
            onClick={onClick}
        >
             <img 
                src={src} 
                alt={alt} 
                className={`${styleIma} transition-all duration-200 ${
                    location.pathname === to 
                        ? "brightness-0 saturate-100 hue-rotate-0" 
                        : "group-hover:brightness-0 group-hover:saturate-100 group-hover:hue-rotate-0"
                } filter`}
                style={{
                    filter: location.pathname === to 
                        ? 'brightness(0) saturate(100%) invert(18%) sepia(93%) saturate(3028%) hue-rotate(355deg) brightness(101%) contrast(91%)'
                        : undefined
                }}
                onMouseEnter={(e) => {
                    if (location.pathname !== to) {
                        e.target.style.filter = 'brightness(0) saturate(100%) invert(18%) sepia(93%) saturate(3028%) hue-rotate(355deg) brightness(101%) contrast(91%)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (location.pathname !== to) {
                        e.target.style.filter = '';
                    }
                }}
             />
            <span className="font-medium">{text}</span>
        </Link>
    );
}