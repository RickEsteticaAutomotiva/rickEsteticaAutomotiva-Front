import "./MenuGerente.css";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, BarChart3, Calendar, FileText, LogOut, User } from "lucide-react";
import { MenuLink } from "../../components/gerente/menu-link/MenuLink";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/Routes";
import logo from "../../assets/rick_logo.png";

export function MenuGerente() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = UseAuth();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
    };

    const getPageTitle = () => {
        switch (location.pathname) {
            case ROUTES.GERENTE.HOME:
                return "Home";
            case `${ROUTES.GERENTE.HOME}/${ROUTES.GERENTE.DASHBOARD}`:
                return "Dashboard";
            case `${ROUTES.GERENTE.HOME}/${ROUTES.GERENTE.AGENDAMENTO}`:
                return "Agendamentos";
            case `${ROUTES.GERENTE.HOME}/${ROUTES.GERENTE.ORDENS_SERVICO}`:
                return "Ordens de Serviço";
            case `${ROUTES.GERENTE.HOME}/${ROUTES.GERENTE.PERFIL}`:
                return "Meu Perfil";
            default:
                return "Home";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
           <header className="w-full bg-[#B30000] shadow text-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
            <button
                className="flex flex-col gap-1 p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Abrir menu"
                onClick={toggleMenu}
            >
                <span className="w-5 h-0.5 bg-white block"></span>
                <span className="w-5 h-0.5 bg-white block"></span>
                <span className="w-5 h-0.5 bg-white block"></span>
            </button>
            <div className="flex items-center gap-3 min-w-0">
                <img src={logo} alt="Rick Logo" className="h-8 md:h-9 object-contain" />
                <h1 className="text-lg md:text-xl font-semibold truncate">{getPageTitle()}</h1>
            </div>
            <div className="w-8"></div>
        </div>
                
                {location.pathname === ROUTES.GERENTE.HOME && (
                    <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-5">
                        <p className="text-sm md:text-base text-white/90">Bem-vindo, <span className="font-semibold">{user?.nome || 'Gerente'}</span>.</p>
                    </div>
                )}
            </header>

            <div className={`fixed top-0 left-0 w-full max-w-sm h-full bg-white shadow-xl transition-transform duration-300 z-60 ${menuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
                }`}>
                <div className="bg-[#B30000] text-white px-5 py-4 flex items-center justify-between">
                    <img src={logo} alt="Rick Logo" className="h-8 object-contain" />
                    <span className="text-xl font-semibold">Menu</span>
                    <button
                        className="text-white text-3xl w-8 h-8 flex items-center justify-center font-light rounded hover:bg-white/10 transition-colors"
                        onClick={toggleMenu}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <nav className="py-6">
                <MenuLink
                    to="/gerente" 
                    text="Home"
                    onClick={toggleMenu}
                    icon={Home}
                />

                <MenuLink
                    to="/gerente/dashboard" 
                    text="Dashboard"
                    onClick={toggleMenu}
                    icon={BarChart3}
                />
                
                <MenuLink 
                    to="/gerente/agendamento" 
                    text="Agendamentos"
                    onClick={toggleMenu}
                    icon={Calendar}
                />
                
                <MenuLink 
                    to="/gerente/ordens-servico" 
                    text="Ordens de Serviço"
                    onClick={toggleMenu}
                    icon={FileText}
                />

                <MenuLink
                    to="/gerente/perfil"
                    text="Meu Perfil"
                    onClick={toggleMenu}
                    icon={User}
                />

                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors group"
                >
                    <LogOut size={20} className="text-gray-700 group-hover:text-red-700 transition-colors" />
                    <span className="font-medium">Sair</span>
                </button>
                </nav>
            </div>

            {menuOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-50 bg-black/40" 
                    onClick={toggleMenu}
                    aria-label="Fechar menu"
                ></button>
            )}
            <main className="relative z-10 px-4 py-6 md:px-8 md:py-8"> 
                <div className="max-w-[1200px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}