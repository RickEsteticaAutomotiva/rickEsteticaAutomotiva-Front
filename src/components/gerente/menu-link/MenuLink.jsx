import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export function MenuLink({ to, text, onClick, icon: Icon, iconSize = 20 }) {
    const location = useLocation();
    const ativo = location.pathname === to;
    
    return (
        <Link
            to={to}
            className={`flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-[#B30000] transition-colors group ${
                ativo ? "bg-red-50 text-[#B30000] border-r-4 border-[#B30000]" : ""
            }`}
            onClick={onClick}
        >
            <Icon 
                size={iconSize}
                className={`transition-colors ${
                    ativo
                        ? "text-[#B30000]"
                        : "text-gray-700 group-hover:text-[#B30000]"
                }`}
            />
            <span className="font-medium">{text}</span>
        </Link>
    );
}

MenuLink.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.elementType.isRequired,
    iconSize: PropTypes.number
};