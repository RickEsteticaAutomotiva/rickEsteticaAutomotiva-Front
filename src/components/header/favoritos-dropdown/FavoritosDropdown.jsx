import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UseAuth } from "../../../hooks/UseAuth";
import "./FavoritosDropdown.css";
import { FavoritoService } from "../../../services/FavoritoService";
import { LoadingState } from "../../loading-state/LoadingState";
import { formatarPreco } from "../../../utils/index";

export function FavoritosDropdown() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, getToken } = UseAuth();
    const favoritoService = new FavoritoService();

    useEffect(() => {
        if (user) {
            buscarFavoritos();
        }
    }, [user]);

    const buscarFavoritos = async () => {
        try {
            const data = await favoritoService.buscarFavoritosUsuario(user.id);
            setFavoritos(data);
        } catch (error) {
            console.error('Erro ao buscar favoritos:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="dropdown relative flex gap-2 h-full items-center cursor-pointer">
            <div className="relative flex gap-2">
                <span>Favoritos</span>
                <i className="bi bi-chevron-down"></i>
            </div>

            <div className="dropdown-menu dropdown-menu-favorito absolute top-full right-0 mt-2 bg-white text-black rounded-lg shadow-lg min-w-80 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
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
                    <div className="py-2">
                        {favoritos.map((servico) => (
                            <div key={servico.id} className="favorito-item">
                                <Link
                                    to={`/servico/${servico.idServico}`}
                                    className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                                        {servico.imagem ? (
                                            <img
                                                src={servico.imagem}
                                                alt={servico.nome}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <i className="bi bi-gear text-gray-400"></i>
                                        )}
                                    </div>

                                    <div className="flex-1 w-fit">
                                        <h4 className="font-medium text-gray-800 text-sm">
                                            {servico.nome}
                                        </h4>
                                        <p className="text-xs text-gray-500">A partir de</p>
                                        <p className="text-sm font-semibold text-red-600">
                                            {formatarPreco(servico.preco)}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}