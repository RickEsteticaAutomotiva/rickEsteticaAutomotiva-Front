import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { carrinhoService } from "../../services/CarrinhoService";
import { servicosService } from "../../services/ServicosService";
import { CardServico } from '../../components/card-servico/CardServico';
import { useToast } from '../../context/ToastContext';
import { useCarrinho } from '../../context/CarrinhoContext';
import { TiposToast } from '../../utils/enum/TiposToast';
import { ROUTES } from '../../constants/Routes';

export function CarrinhoMenu({ idUsuario, idServico }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [servicoAdicionado, setServicoAdicionado] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const { mostrarToast } = useToast();
    const { atualizarCarrinho } = useCarrinho();

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
        } catch {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao verificar carrinho',
                mensagem: 'Não foi possível verificar o carrinho.',
                duracao: 3000
            });
            return false;
        }
    };

    const abrirMenuCarrinho = async () => {
        setCarregando(true);
        try {
            if (await verificarServicoNoCarrinho()) {
                mostrarToast({
                    tipo: TiposToast.ALERTA,
                    titulo: 'Serviço já no carrinho',
                    mensagem: 'Este serviço já foi adicionado ao seu carrinho.',
                    duracao: 4000
                });
                return;
            }
            await carrinhoService.adicionarServicoCarrinho(idUsuario, idServico);
            const servicoDetalhes = await servicosService.buscarPorId(idServico);
            setServicoAdicionado(servicoDetalhes);
            await atualizarCarrinho();
            setMenuAberto(true);
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao adicionar',
                mensagem: error.message || 'Não foi possível adicionar o serviço ao carrinho.',
                duracao: 4000
            });
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
                <div
                    className="fixed inset-0 w-screen h-screen bg-black/50 z-[10000] flex justify-end items-stretch"
                    onClick={fecharMenuCarrinho}
                >
                    <div
                        className="w-full max-w-[400px] h-screen bg-white shadow-[-2px_0_15px_rgba(0,0,0,0.1)] flex flex-col animate-[slide-in-right_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-green-600">Adicionado ao Carrinho</h2>
                            <button onClick={fecharMenuCarrinho} className="cursor-pointer text-gray-500 hover:text-gray-700">
                                <i className="bi bi-x-lg text-2xl"></i>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 py-6 overflow-y-auto">
                            <div className="px-6 flex flex-col items-center">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <i className="bi bi-check-circle-fill text-3xl text-green-600"></i>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">{servicoAdicionado.nome} adicionado com sucesso!</h3>
                                    <p className="text-sm text-gray-500">O item foi adicionado ao seu carrinho</p>
                                </div>

                                {servicoAdicionado && (
                                    <CardServico
                                        id={servicoAdicionado.id}
                                        nome={servicoAdicionado.nome}
                                        preco={servicoAdicionado.preco}
                                        categoria={servicoAdicionado.categoria}
                                        imagem={servicoAdicionado.imagem}
                                        descricao={servicoAdicionado.descricao}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col gap-3">
                            <Link
                                to={ROUTES.HOME}
                                className="flex-1 flex justify-center items-center bg-white text-gray-500 border-2 border-gray-200 px-6 py-3.5 rounded-lg font-semibold cursor-pointer transition-all hover:border-gray-300 hover:bg-gray-50 no-underline"
                                onClick={fecharMenuCarrinho}
                            >
                                Continuar comprando
                            </Link>

                            <Link
                                to={ROUTES.CARRINHO}
                                className="bg-red-600 flex justify-center items-center text-white px-6 py-3.5 rounded-lg w-full hover:bg-red-700 cursor-pointer transition-colors no-underline font-semibold"
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