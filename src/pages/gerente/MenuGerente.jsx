import "./MenuGerente.css";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, BarChart3, Calendar, FileText, LogOut, User, Wrench, Tags } from "lucide-react";
import { MenuLink } from "../../components/gerente/menu-link/MenuLink";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/Routes";

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
            case `${ROUTES.GERENTE.HOME}/${ROUTES.GERENTE.SERVICOS}`:
                return "Serviços";
            case `${ROUTES.GERENTE.HOME}/${ROUTES.GERENTE.CATEGORIAS}`:
                return "Categorias";
            case `${ROUTES.GERENTE.HOME}/${ROUTES.GERENTE.PERFIL}`:
                return "Perfil";
            default:
                return "Home";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-red-700 text-white sticky pb-8">
                <div className="px-5 py-4 flex items-center justify-between">
                    <button
                        className="flex flex-col gap-1 p-1"
                        aria-label="Abrir menu"
                        onClick={toggleMenu}
                    >
                        <span className="w-5 h-0.5 bg-white block"></span>
                        <span className="w-5 h-0.5 bg-white block"></span>
                        <span className="w-5 h-0.5 bg-white block"></span>
                    </button>
                    <h1 className="text-2xl font-semibold absolute left-1/2 transform -translate-x-1/2 text-center max-w-xs truncate">{getPageTitle()}</h1>
                    <div className="w-8"></div>
                </div>

                {location.pathname === ROUTES.GERENTE.HOME && (
                    <div className="flex justify-center px-5 pb-6">
                        <h2 className="text-3xl font-semibold">Bem vindo, {user?.nome || 'Gerente'}!</h2>
                    </div>
                )}
            </header>

            <div className={`fixed top-0 left-0 w-full h-full bg-white shadow-xl transition-transform duration-300 z-60 ${menuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
                }`}>
                <div className="bg-red-700 text-white px-5 py-4 flex items-center justify-between">
                    <img src="/icon-rick-logo.svg" alt="Logo do Rick" />
                    <span className="text-2xl font-semibold">Menu</span>
                    <button
                        className="text-white text-3xl w-8 h-8 flex items-center justify-center font-light"
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
                        to="/gerente/servicos"
                        text="Gerenciar Serviços"
                        onClick={toggleMenu}
                        icon={Wrench}
                    />

                    <MenuLink
                        to="/gerente/categorias"
                        text="Gerenciar Categorias"
                        onClick={toggleMenu}
                        icon={Tags}
                    />

                    <MenuLink
                        to="/gerente/perfil"
                        text="Perfil"
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