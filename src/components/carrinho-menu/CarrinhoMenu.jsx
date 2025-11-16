import "./CarrinhoMenu.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CarrinhoService } from "../../services/CarrinhoService";
import { ServicosService } from "../../services/ServicosService";
import { formatarPreco } from "../../utils/index";

export function CarrinhoMenu({ idUsuario, idServico }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [servicoAdicionado, setServicoAdicionado] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const carrinhoService = new CarrinhoService();
    const servicosService = new ServicosService();
    const navigate = useNavigate();

    useEffect(() => {
        if (menuAberto) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [menuAberto]);

    const verificarServicoNoCarrinho = async () => {
        try {
            const carrinho = await carrinhoService.buscarCarrinhoUsuario(idUsuario);
            return carrinho.some(item => item.idServico === idServico);
        } catch (error) {
            console.error('Erro ao verificar carrinho:', error);
            return false;
        }
    };

    const abrirMenuCarrinho = async () => {
        setCarregando(true);
        try {
            if (await verificarServicoNoCarrinho()) {
                navigate('/carrinho');
                return;
            }
            await carrinhoService.adicionarServicoCarrinho(idUsuario, idServico);
            const servicoDetalhes = await servicosService.buscarPorId(idServico);
            setServicoAdicionado(servicoDetalhes);
            
            setMenuAberto(true);
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
        } finally {
            setCarregando(false);
        }
    };

    const fecharMenuCarrinho = () => {
        setMenuAberto(false);
        setServicoAdicionado(null);
    };

    return (
        <>
            <button 
                className="bg-red-600 flex justify-center items-center text-white px-6 py-2 rounded-lg w-full hover:bg-red-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={abrirMenuCarrinho}
                disabled={carregando}
            >
                {carregando ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span>Adicionando...</span>
                    </>
                ) : (
                    <span>Adicionar ao Carrinho</span>
                )}
            </button>

            {menuAberto && (
                <div className="sidebar-overlay-right" onClick={fecharMenuCarrinho}>
                    <div className="sidebar-menu-right" onClick={(e) => e.stopPropagation()}>
                        <div className="sidebar-header-right">
                            <h2 className="text-xl font-bold text-green-600">Adicionado ao Carrinho</h2>
                            <button onClick={fecharMenuCarrinho} className="cursor-pointer text-gray-500 hover:text-gray-700">
                                <i className="bi bi-x-lg text-2xl"></i>
                            </button>
                        </div>

                        <div className="sidebar-content-right">
                            <div className="px-6">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <i className="bi bi-check-circle-fill text-3xl text-green-600"></i>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">{servicoAdicionado.nome} adicionado com sucesso!</h3>
                                    <p className="text-sm text-gray-500">O item foi adicionado ao seu carrinho</p>
                                </div>

                                {/* Informações do serviço */}
                                {servicoAdicionado && (
                                    <div className="servico-adicionado-card">
                                        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                {servicoAdicionado.imagem ? (
                                                    <img 
                                                        src={servicoAdicionado.imagem} 
                                                        alt={servicoAdicionado.nome}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <i className="bi bi-gear text-gray-400 text-xl"></i>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                                                    {servicoAdicionado.nome}
                                                </h4>
                                                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                                    {servicoAdicionado.descricao}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs text-gray-400">A partir de</span>
                                                    <span className="font-semibold text-red-600 text-sm">
                                                        {formatarPreco(servicoAdicionado.preco)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sidebar-footer">
                            <Link 
                                to="/" 
                                className="bg-gray-100 flex justify-center items-center text-gray-700 px-6 py-3 rounded-lg w-full hover:bg-gray-200 cursor-pointer transition-colors border"
                                onClick={fecharMenuCarrinho}
                            >
                                Continuar comprando
                            </Link>

                            <Link 
                                to="/carrinho" 
                                className="bg-red-600 flex justify-center items-center text-white px-6 py-3 rounded-lg w-full hover:bg-red-700 cursor-pointer transition-colors"
                                onClick={fecharMenuCarrinho}
                            >
                                Ver Carrinho
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}