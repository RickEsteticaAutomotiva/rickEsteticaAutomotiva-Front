import { Link } from "react-router-dom";
import { UseAuth } from "../../../hooks/UseAuth";
import { useFavoritos } from "../../../context/FavoritosContext";
import { LoadingState } from "../../loading-state/LoadingState";
import { formatarPreco } from "../../../utils/index";
import { useState, useEffect } from "react";

export function FavoritosDropdown() {
    const { user } = UseAuth();
    const { favoritos, loading } = useFavoritos();
    const [menuAberto, setMenuAberto] = useState(false);

    const abrirMenu = () => {
        setMenuAberto(true);
    };

    const fecharMenu = () => {
        setMenuAberto(false);
    };

    useEffect(() => {
        if (!menuAberto) return;
        const handleClickFora = (e) => {
            const dropdown = document.querySelector('[data-favoritos-dropdown]');
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
        <div className="relative flex gap-2 h-full items-center cursor-pointer" data-favoritos-dropdown>
            <button 
                onClick={abrirMenu}
                className="flex gap-2 items-center hover:opacity-80 transition-opacity"
            >
                <span className="text-sm">Favoritos</span>
                <i className={`bi bi-chevron-down transition-transform ${menuAberto ? 'rotate-180' : ''}`}></i>
            </button>

            {menuAberto && (
                <>
                    <div 
                        className="fixed inset-0 z-[199]"
                        onClick={fecharMenu}
                    />
                    <div className="fixed top-20 left-2 right-2 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 z-[200] sm:w-96">
                        <div className="bg-white text-black rounded-lg shadow-2xl max-h-80 overflow-y-auto">
                            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 rounded-t-lg">
                                <h3 className="font-semibold text-gray-800">Meus Favoritos</h3>
                                <p className="text-sm text-gray-500">
                                    {favoritos.length} {favoritos.length === 1 ? 'serviço favoritado' : 'serviços favoritados'}
                                </p>
                            </div>

                            {loading && <LoadingState />}

                            {!loading && favoritos.length === 0 && (
                                <div className="p-6 text-center">
                                    <i className="bi bi-heart text-4xl text-gray-300 mb-3 block"></i>
                                    <p className="text-gray-500 mb-2">Nenhum serviço favoritado</p>
                                    <p className="text-sm text-gray-400">
                                        Explore nossos serviços e adicione aos seus favoritos!
                                    </p>
                                </div>
                            )}

                            {!loading && favoritos.length > 0 && (
                                <div className="divide-y divide-gray-100">
                                    {favoritos.map((servico) => (
                                        <Link
                                            key={servico.id || servico.idServico}
                                            to={`/servico/${servico.idServico}`}
                                            onClick={fecharMenu}
                                            className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
                                        >
                                            <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                {servico.imagem ? (
                                                    <img
                                                        src={servico.imagem}
                                                        alt={servico.nome}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <i className="bi bi-gear text-gray-400 text-xl"></i>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 pt-1">
                                                <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">
                                                    {servico.nome}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">A partir de</p>
                                                <p className="text-sm font-bold text-red-600">
                                                    {formatarPreco(servico.preco)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}