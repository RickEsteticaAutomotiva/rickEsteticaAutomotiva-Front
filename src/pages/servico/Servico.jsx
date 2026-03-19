import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavoritos } from '../../context/FavoritosContext';
import { useCarrinho } from '../../context/CarrinhoContext';
import { ROUTES } from '../../constants/Routes';
import { Header } from '../../components/header/Header';
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { servicosService } from '../../services/ServicosService';
import { LoadingState } from '../../components/loading-state/LoadingState';
import localImage from '../../assets/local.png';
import { carrinhoService } from '../../services/CarrinhoService';
import { favoritoService } from '../../services/FavoritoService';
import { Footer } from '../../components/footer/Footer';
import { CarrinhoMenu } from '../../components/carrinho-menu/CarrinhoMenu';
import { formatarPreco } from '../../utils/index';
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';
import { InfoTooltip } from "../../components/info-tooltip/InfoTooltip";

export function Servico() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { refreshFavoritos } = useFavoritos();
    const { mostrarToast } = useToast();
    const { atualizarCarrinho } = useCarrinho();
    const [servico, setServico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorito, setIsFavorito] = useState(false);
    const [favoritos, setFavoritos] = useState([]);
    const [loadingFavorito, setLoadingFavorito] = useState(false);
    const [imagemSelecionada, setImagemSelecionada] = useState(0);
    const [zoomAtivo, setZoomAtivo] = useState(false);
    const [posicaoZoom, setPosicaoZoom] = useState({ x: 50, y: 50 });
    const imagemContainerRef = useRef(null);

    const breadcrumbItems = [
        {
            label: 'Início',
            href: ROUTES.HOME,
            icon: 'bi bi-house'
        },
        {
            label: servico?.categoriaNome ?? 'Categoria',
            href: servico?.categoriaNome ? `${ROUTES.BUSCA}?pesquisa=${servico.categoriaNome.toLowerCase()}` : ROUTES.BUSCA,
            icon: 'bi bi-list-ul'
        },
        {
            label: servico ? servico.nome : 'Serviço',
            icon: 'bi bi-briefcase'
        }
    ];

    useEffect(() => {
        buscarServico();
    }, [id]);

    useEffect(() => {
        if (user && servico) {
            verificarFavorito();
        }
    }, [user, servico]);

    const buscarServico = async () => {
        setLoading(true);
        try {
            const data = await servicosService.buscarPorId(id);
            setServico(data);
        } catch (error) {
            setError('Não foi possível carregar o serviço');
        } finally {
            setLoading(false);
        }
    };

    const verificarFavorito = async () => {
        try {
            const data = await favoritoService.buscarFavoritosUsuario(user.id);
            setFavoritos(data);

            const servicoEhFavorito = data.some(favorito =>
                favorito.idServico === parseInt(servico.id) ||
                favorito.idServico === servico.id
            );

            setIsFavorito(servicoEhFavorito);
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Favoritos indisponíveis',
                mensagem: 'Não foi possível verificar seus favoritos.',
                duracao: 3000
            });
        }
    };

    const toggleFavorito = async () => {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        if (loadingFavorito) return;

        setLoadingFavorito(true);

        try {
            if (isFavorito) {
                await favoritoService.removerItemFavorito(favoritos.find(fav =>
                    fav.idServico === parseInt(servico.id) ||
                    fav.idServico === servico.id
                ).idFavorito);
            } else {
                await favoritoService.adicionarServicoFavorito(user.id, servico.id);
            }

            setIsFavorito(!isFavorito);

            await verificarFavorito();
            await refreshFavoritos();
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao salvar favorito',
                mensagem: error.message || 'Não foi possível alterar o favorito.',
                duracao: 4000
            });
            setIsFavorito(isFavorito);
        } finally {
            setLoadingFavorito(false);
        }
    };

    const verificarServicoNoCarrinho = async () => {
        try {
            const carrinho = await carrinhoService.buscarCarrinhoUsuario(user.id);
            return carrinho.some(item => item.idServico === servico.id);
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao verificar carrinho',
                mensagem: 'Não foi possível verificar o carrinho.',
                duracao: 4000
            });
            return false;
        }
    };

    const agendarServico = async () => {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        try {
            if (await verificarServicoNoCarrinho()) {
                navigate(`/carrinho`);
                return;
            }
            
            await carrinhoService.adicionarServicoCarrinho(user.id, servico.id);
            await atualizarCarrinho();
            navigate(`/carrinho`);
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao agendar',
                mensagem: error.message || 'Não foi possível adicionar o serviço.',
                duracao: 4000
            });
        }
    };

    const IMAGENS_PLACEHOLDER = [
        'https://placehold.co/600x600/e2e8f0/94a3b8?text=Imagem+1',
        'https://placehold.co/600x600/fef9c3/ca8a04?text=Imagem+2',
        'https://placehold.co/600x600/fce7f3/db2777?text=Imagem+3',
        'https://placehold.co/600x600/dcfce7/16a34a?text=Imagem+4',
        'https://placehold.co/600x600/ede9fe/7c3aed?text=Imagem+5',
    ];

    const imagens = servico?.imagem
        ? [servico.imagem, servico.imagem, servico.imagem, servico.imagem]
        : IMAGENS_PLACEHOLDER;

    const compartilharServico = async () => {
        const url = window.location.href;
        const shareData = {
            title: servico.nome,
            text: servico.descricao ?? `Confira o serviço ${servico.nome} na Rick Estética Automotiva!`,
            url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    mostrarToast({
                        tipo: TiposToast.ERRO,
                        titulo: 'Erro ao compartilhar',
                        mensagem: 'Não foi possível compartilhar o serviço.',
                        duracao: 3000,
                    });
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                mostrarToast({
                    tipo: TiposToast.SUCESSO,
                    titulo: 'Link copiado!',
                    mensagem: 'O link do serviço foi copiado para a área de transferência.',
                    duracao: 3000,
                });
            } catch {
                mostrarToast({
                    tipo: TiposToast.ERRO,
                    titulo: 'Erro ao copiar',
                    mensagem: 'Não foi possível copiar o link.',
                    duracao: 3000,
                });
            }
        }
    };

    const handleMouseMove = useCallback((e) => {
        if (!imagemContainerRef.current) return;
        const rect = imagemContainerRef.current.getBoundingClientRect();
        const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
        const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
        setPosicaoZoom({ x, y });
    }, []);

    if (loading) {
        return (
            <LoadingState />
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <i className="bi bi-exclamation-triangle text-6xl text-gray-300 mb-4 block"></i>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Ops! Algo deu errado</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Link
                        to={ROUTES.HOME}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Voltar para início
                    </Link>
                </div>
            </div>
        );
    }

    if (!servico) {
        return null;
    }

    return (
        <>
            <Header />
            <Breadcrumb items={breadcrumbItems} />

            <main className='px-4 md:px-16 py-8'>
                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="flex gap-3 lg:w-[55%] lg:self-start lg:sticky lg:top-4">
                        {imagens.length > 0 && (
                            <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
                                {imagens.map((img, index) => (
                                    <button
                                        key={`thumb-desktop-${index}`}
                                        onClick={() => setImagemSelecionada(index)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                                            imagemSelecionada === index
                                                ? 'border-blue-500 shadow-md'
                                                : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        <img src={img} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex-1 flex flex-col gap-3">
                            <div
                                ref={imagemContainerRef}
                                className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-crosshair relative"
                                role="img"
                                aria-label={`Imagem do serviço ${servico.nome}`}
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setZoomAtivo(true)}
                                onMouseLeave={() => setZoomAtivo(false)}
                            >
                                {imagens[imagemSelecionada] ? (
                                    <img
                                        src={imagens[imagemSelecionada]}
                                        alt={servico.nome}
                                        className="w-full h-full object-cover transition-transform duration-100 ease-out select-none"
                                        style={zoomAtivo ? {
                                            transform: 'scale(2)',
                                            transformOrigin: `${posicaoZoom.x}% ${posicaoZoom.y}%`
                                        } : {}}
                                        draggable={false}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <i className="bi bi-gear text-gray-300 text-6xl"></i>
                                    </div>
                                )}

                                {zoomAtivo && imagens[imagemSelecionada] && (
                                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                                        <i className="bi bi-zoom-in mr-1"></i>Zoom ativo
                                    </div>
                                )}
                            </div>

                            {imagens.length > 0 && (
                                <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
                                    {imagens.map((img, index) => (
                                        <button
                                            key={`thumb-mobile-${index}`}
                                            onClick={() => setImagemSelecionada(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                                                imagemSelecionada === index
                                                    ? 'border-blue-500 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            <img src={img} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:w-[45%] flex flex-col gap-5 bg-white p-6 rounded-xl shadow">
                        {/* Header: category + title + actions */}
                        <div>
                            <div className="flex justify-between items-start gap-3 mt-1">
                                <h1 className="text-2xl font-bold text-gray-900 leading-snug">{servico.nome}</h1>
                                <div className="flex gap-2 flex-shrink-0 mt-1">
                                    <button
                                        className="h-9 w-9 cursor-pointer rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 transition-colors"
                                        onClick={compartilharServico}
                                        title="Compartilhar serviço"
                                    >
                                        <i className="bi bi-share text-gray-600"></i>
                                    </button>
                                    <button
                                        className={`h-9 w-9 cursor-pointer rounded-full bg-gray-100 flex justify-center items-center transition-all ${
                                            loadingFavorito ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'
                                        }`}
                                        onClick={toggleFavorito}
                                        disabled={loadingFavorito}
                                    >
                                        {loadingFavorito ? (
                                            <i className="bi bi-arrow-repeat animate-spin text-gray-500"></i>
                                        ) : isFavorito ? (
                                            <i className="bi bi-heart-fill text-red-500"></i>
                                        ) : (
                                            <i className="bi bi-heart text-gray-600"></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                A partir de:
                                <InfoTooltip message="Valor inicial estimado. O valor final pode variar conforme o tamanho do veículo e complexidade do serviço." />
                            </p>
                            <p className="text-3xl font-bold text-green-600 mt-1">{formatarPreco(servico.preco)}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <CarrinhoMenu
                                idUsuario={user ? user.id : null}
                                idServico={servico.id}
                            />
                            <button
                                className="w-full border border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                                onClick={agendarServico}
                            >
                                Agendar Serviço
                            </button>
                        </div>

                        <div className="border-t border-gray-200 pt-5">
                            <h2 className="font-bold text-lg mb-2">Descrição</h2>
                            <p className="text-gray-600 leading-relaxed">{servico.descricao}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-5">
                            <h2 className="font-bold text-lg mb-3">
                                <i className="bi bi-geo-alt mr-2"></i>Localização
                            </h2>
                            <p className="font-semibold text-gray-800">Rick Estética Automotiva</p>
                            <p className="text-gray-500 text-sm mt-1">R. Alcatifa, 81 - Jardim Brasilia (Zona Leste), São Paulo, 03583-030</p>
                            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.2486944757753!2d-46.51234178502112!3d-23.53453698467894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5f0a5c5c5c5c%3A0x1234567890abcdef!2sR.%20Alcatifa%2C%2081%20-%20Jardim%20Brasilia%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003583-030!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                                    width="100%"
                                    height="160"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Localização Rick Estética Automotiva"
                                ></iframe>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-5">
                            <h2 className="font-bold text-lg mb-3">
                                <i className="bi bi-house mr-2"></i>Sobre o local
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                            Estamos localizados na R. Alcatifa, a oficina Rick Estética Automotiva é referência em cuidados automotivos,
                            oferecendo serviços especializados que vão desde lavagens técnicas até vitrificação e revitalização completa de veículos.
                            Nosso objetivo é proporcionar não apenas limpeza, mas também proteção, valorização e durabilidade para cada carro que passa por aqui.
                            </p>
                            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                                <img src={localImage} alt="Imagem do local" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}