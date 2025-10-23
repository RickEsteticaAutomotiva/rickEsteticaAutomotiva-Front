import "./PerfilDropdown.css";
import { Link, useNavigate } from "react-router-dom";
import { UseAuth } from "../../../hooks/UseAuth";
import { ROUTES } from "../../../constants/routes";

export function PerfilDropdown() {
    const navigate = useNavigate();
    const { user, logout: authLogout } = UseAuth();

    const handleLogout = () => {
        authLogout();
        navigate("/");
    }

    if (!user) return null;

    return (
        <div className="dropdown relative flex gap-2 h-full items-center cursor-pointer">
            <span>{user.nome}</span>
            <i className="bi bi-chevron-down"></i>

            <div className="dropdown-menu absolute top-full right-0 mt-2 bg-white text-black rounded-lg shadow-lg min-w-48 z-50">
                <Link to={ROUTES.PERFIL} className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg font-medium text-gray-800 text-sm">
                    <i className="bi bi-person mr-2"></i>
                    Meu Perfil
                </Link>
                <Link to={ROUTES.VEICULOS} className="block px-4 py-2 hover:bg-gray-100 font-medium text-gray-800 text-sm">
                    <i className="bi bi-car-front mr-2"></i>
                    Meus Veículos
                </Link>
                <hr className="my-1 border-gray-200" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg text-red-600 font-medium text-sm">
                    <i className="bi bi-box-arrow-right mr-2"></i>
                    Sair
                </button>
            </div>
        </div>
    );
}