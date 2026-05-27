import { Link, useNavigate } from "react-router-dom";
import { UseAuth } from "../../../hooks/UseAuth";
import { ROUTES } from "../../../constants/Routes";
import { useState, useEffect } from "react";

export function PerfilDropdown() {
    const navigate = useNavigate();
    const { user, logout: authLogout } = UseAuth();
    const [menuAberto, setMenuAberto] = useState(false);

    const handleLogout = () => {
        authLogout();
        navigate("/");
    };

    const handleVeiculos = () => {
        navigate(ROUTES.VEICULOS, { state: { fromHeader: true } });
        fecharMenu();
    };

    const abrirMenu = () => {
        setMenuAberto(true);
    };

    const fecharMenu = () => {
        setMenuAberto(false);
    };

    useEffect(() => {
        if (!menuAberto) return;
        const handleClickFora = (e) => {
            const dropdown = document.querySelector('[data-perfil-dropdown]');
            if (dropdown && !dropdown.contains(e.target)) {
                fecharMenu();
            }
        };
        document.addEventListener('click', handleClickFora);
        return () => document.removeEventListener('click', handleClickFora);
    }, [menuAberto]);

    useEffect(() => {
        if (!menuAberto) return;
        const handleScroll = () => {
            fecharMenu();
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [menuAberto]);

    if (!user) return null;

    return (
        <div className="relative flex gap-2 h-full items-center cursor-pointer" data-perfil-dropdown>
            <button 
                onClick={abrirMenu}
                className="flex gap-2 items-center hover:opacity-80 transition-opacity max-w-[120px]"
            >
                <span className="truncate text-sm">{user.nome}</span>
                <i className={`bi bi-chevron-down text-sm transition-transform ${menuAberto ? 'rotate-180' : ''}`}></i>
            </button>

            {menuAberto && (
                <>
                    <div 
                        className="fixed inset-0 z-[199]"
                        onClick={fecharMenu}
                    />
                    <div className="absolute top-full right-0 pt-2 min-w-48 z-[200]">
                        <div className="bg-white text-black rounded-lg shadow-lg">
                            <Link 
                                to={ROUTES.PERFIL} 
                                onClick={fecharMenu}
                                className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg font-medium text-gray-800 text-sm"
                            >
                                <i className="bi bi-person mr-2"></i>
                                Meu Perfil
                            </Link>
                            <button 
                                onClick={handleVeiculos} 
                                className="w-full text-left block px-4 py-2 hover:bg-gray-100 font-medium text-gray-800 text-sm cursor-pointer"
                            >
                                <i className="bi bi-car-front mr-2"></i>
                                Meus Veículos
                            </button>
                            <Link 
                                to={ROUTES.HISTORICO} 
                                onClick={fecharMenu}
                                className="block px-4 py-2 hover:bg-gray-100 font-medium text-gray-800 text-sm"
                            >
                                <i className="bi bi-clock-history mr-2"></i>
                                Meus Agendamentos
                            </Link>
                            <hr className="my-1 border-gray-200" />
                            <button 
                                onClick={handleLogout} 
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg text-red-600 font-medium text-sm cursor-pointer"
                            >
                                <i className="bi bi-box-arrow-right mr-2"></i>
                                Sair
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}