import "./MenuGerente.css";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, BarChart3, Calendar, FileText } from "lucide-react";
import { MenuLink } from "../../components/gerente/menu-link/MenuLink";

export function MenuGerente() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const getPageTitle = () => {
        switch (location.pathname) {
            case "/gerente":
                return "Home";
            case "/gerente/dashboard":
                return "Dashboard";
            case "/gerente/agendamento":
                return "Agendamentos";
            case "/gerente/ordens-servico":
                return "Ordens de Serviço";
            default:
                return "Home";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
           <header className="bg-red-700 text-white sticky rounded-b-3xl pb-8">
        <div className="px-5 py-4 flex items-center justify-between">
            <button
                className="flex flex-col gap-1 p-1"
                onClick={toggleMenu}
            >
                <span className="w-5 h-0.5 bg-white block"></span>
                <span className="w-5 h-0.5 bg-white block"></span>
                <span className="w-5 h-0.5 bg-white block"></span>
            </button>
            <h1 className="text-2xl font-semibold absolute left-1/2 transform -translate-x-1/2 text-center max-w-xs truncate">{getPageTitle()}</h1>
            <div className="w-8"></div> 
        </div>
                
                {location.pathname === "/gerente" && (
                    <div className="flex justify-center px-5 pb-6">
                        <h2 className="text-3xl font-semibold">Bem vindo, Henrique!</h2>
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
                </nav>
            </div>

            {menuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-50" 
                    onClick={toggleMenu}
                ></div>
            )}
            <main className="relative min-h-screen z-10 -mt-10 px-6"> 
                <Outlet />
            </main>
        </div>
    );
}