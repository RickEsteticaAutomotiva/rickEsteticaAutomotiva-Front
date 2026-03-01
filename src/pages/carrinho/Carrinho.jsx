import { Header } from "../../components/header/Header";
import { Link } from 'react-router-dom';
import { ROUTES } from "../../constants/Routes";
import { LoadingState } from "../../components/loading-state/LoadingState";
import { useEffect, useState } from "react";
import { carrinhoService } from "../../services/CarrinhoService";
import { Footer } from "../../components/footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { formatarPreco } from "../../utils/index";
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';

export function Carrinho() {
    const [loading, setLoading] = useState(true);
    const [carrinho, setCarrinho] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const { mostrarToast } = useToast();

    const listarServicos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await carrinhoService.buscarCarrinhoUsuario(user.id);
            setCarrinho(data);
        } catch (err) {
            setError('Não foi possível carregar o carrinho. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const removerServicoCarrinho = async (idCarrinho) => {
        try {
            await carrinhoService.removerItemCarrinho(idCarrinho);
            await listarServicos();
        } catch (err) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao remover',
                mensagem: 'Não foi possível remover o serviço. Tente novamente.',
                duracao: 4000
            });
        }
    };

    const calcularTotal = () => {
        if (!carrinho || carrinho.length === 0) return 0;
        return carrinho.reduce((total, item) => total + (item.preco || 0), 0);
    };

    useEffect(() => {
        if (!user) return;
        listarServicos();
    }, [user]);

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center py-20 flex-col gap-4">
                    <i className="bi bi-exclamation-circle text-4xl text-red-500"></i>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={listarServicos}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="flex flex-col md:flex-row px-4 md:px-16 py-10 justify-between gap-10 pb-[32%] md:pb-10">
                <div className="py-5 bg-white rounded shadow-md w-full md:w-3/5 h-fit">
                    <div className="flex flex-col items-start mb-4 border-b border-gray-300 pb-2 px-5">
                        <h1 className="font-bold text-lg">Carrinho de serviços</h1>
                        <div className="text-sm text-gray-400 w-full flex justify-between">
                            <p>Serviço</p>
                            <p>A partir de</p>
                        </div>
                    </div>

                    <div className="px-5">
                        {carrinho && carrinho.length > 0 ? (
                            <ul>
                                {carrinho.map((item, index) => (
                                    <li key={item.id ?? index} className="py-2 border-b border-gray-200 flex gap-3 items-start">
                                        {item.imagem ? (
                                            <img
                                                src="/default-service.jpg"
                                                alt={item.nome}
                                                className="h-20 w-20 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = "/default-service.jpg";
                                                }}
                                            />) : (
                                            <div className="h-25 w-25 bg-gray-200 rounded flex items-center justify-center">
                                                <i className="bi bi-gear text-4xl text-gray-400"></i>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="flex justify-between w-full">
                                                <p className="font-bold">{item.nome}</p>
                                                <p>{formatarPreco(item.preco)}</p>
                                            </div>

                                            <button
                                                onClick={() => removerServicoCarrinho(item.idCarrinho)}
                                                className="text-red-600 hover:text-red-800 cursor-pointer w-fit transition-colors"
                                            >
                                                <i className="bi bi-trash3"></i> Remover do carrinho
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <i className="bi bi-cart-x text-4xl text-gray-400 mb-4"></i>
                                <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                                <Link
                                    to={ROUTES.HOME}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                >
                                    Ver serviços disponíveis
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full h-[30%] z-[100] py-5 bg-white rounded-t-2xl shadow-2xl overflow-y-auto md:static md:w-1/3 md:h-fit md:rounded md:shadow-md">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2 px-5">
                        <h1 className="font-bold text-lg">Resumo do pedido</h1>
                    </div>

                    <div className="px-5 flex flex-col gap-4">
                        <div className="flex justify-between mb-2">
                            <p>Valor mínimo:</p>
                            <p className="font-bold">{formatarPreco(calcularTotal())}</p>
                        </div>

                        {carrinho && carrinho.length > 0 ? (
                            <Link
                                to={ROUTES.VEICULOS}
                                className="bg-red-600 font-bold text-white py-2 px-4 rounded w-full hover:bg-red-700 cursor-pointer text-center transition-colors"
                            >
                                Agendar serviço
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="bg-gray-400 font-bold text-white py-2 px-4 rounded w-full cursor-not-allowed"
                            >
                                Carrinho vazio
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}