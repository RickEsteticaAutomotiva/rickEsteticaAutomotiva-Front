import { Link, useLocation } from "react-router-dom";

export function MenuLink({ to, text, onClick, icon: Icon, iconSize = 20 }) {
    const location = useLocation();
    
    return (
        <Link
            to={to}
            className={`flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors group ${
                location.pathname === to ? "bg-gray-100 text-red-700 border-r-4 border-red-700" : ""
            }`}
            onClick={onClick}
        >
            <Icon 
                size={iconSize}
                className={`transition-colors ${
                    location.pathname === to 
                        ? "text-red-700" 
                        : "text-gray-700 group-hover:text-red-700"
                }`}
            />
            <span className="font-medium">{text}</span>
        </Link>
    );
}