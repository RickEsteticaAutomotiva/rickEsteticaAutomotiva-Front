import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UseAuth } from '../../hooks/UseAuth';
import { ROUTES } from '../../constants/routes';
import { Header } from '../../components/header/Header';
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { servicosService } from '../../services/ServicosService';
import './Servico.css';
import { LoadingState } from '../../components/loading-state/LoadingState';
import localImage from '../../assets/local.png';
import { CarrinhoService } from '../../services/CarrinhoService';
import { FavoritoService } from '../../services/FavoritoService';
import { Footer } from '../../components/footer/Footer';

export function Servico() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = UseAuth();
    const [servico, setServico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorito, setIsFavorito] = useState(false);
    const [favoritos, setFavoritos] = useState([]);
    const [loadingFavorito, setLoadingFavorito] = useState(false);
    const carrinhoService = new CarrinhoService();
    const favoritoService = new FavoritoService();

    const breadcrumbItems = [
        {
            label: 'Início',
            href: ROUTES.HOME,
            icon: 'bi bi-house'
        },
        {
            label: servico ? servico.nome : 'Categoria',
            href: servico ? `${ROUTES.BUSCA}?pesquisa=${servico.nome.toLowerCase()}` : "Categoria",
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
            console.error('Erro ao buscar serviço:', error);
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
            console.error('Erro ao verificar favoritos:', error);
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
        } catch (error) {
            console.error('Erro ao alterar favorito:', error);
            setIsFavorito(isFavorito);
        } finally {
            setLoadingFavorito(false);
        }
    };

    const adicionarAoCarrinho = async () => {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        try {
            await carrinhoService.adicionarServicoCarrinho(user.id, servico.id);
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    };

    const agendarServico = async () => {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        try {
            await carrinhoService.adicionarServicoCarrinho(user.id, servico.id);
            navigate(`/carrinho`);
        } catch (error) {
            console.error('Erro ao agendar serviço:', error);
        }
    };

    if (loading) {
        return (
            <LoadingState />
        );
    }

    if (error) {
        return (
            <div className="servico-error-container">
                <div className="servico-error-content">
                    <i className="bi bi-exclamation-triangle servico-error-icon"></i>
                    <h2 className="servico-error-title">Ops! Algo deu errado</h2>
                    <p className="servico-error-message">{error}</p>
                    <Link
                        to={ROUTES.HOME}
                        className="servico-error-button"
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

            <main className='servico-main'>
                <div className="servico-container">
                    <div className="servico-detalhes">
                        <div className="servico-imagem-principal">
                            {servico.imagem ? (
                                <img src={servico.imagem} alt={servico.nome} className="servico-imagem-img" />
                            ) : (
                                <i className="bi bi-gear servico-imagem-placeholder"></i>
                            )}
                        </div>
                        <div className="servico-galeria">
                            <div className='servico-galeria-item'>
                                {servico.imagem ? (
                                    <img src={servico.imagemUrl} alt={servico.nome} className="servico-galeria-img" />
                                ) : (
                                    <i className="bi bi-gear servico-galeria-placeholder"></i>
                                )}
                            </div>
                            <div className='servico-galeria-item'>
                                {servico.imagem ? (
                                    <img src={servico.imagemUrl} alt={servico.nome} className="servico-galeria-img" />
                                ) : (
                                    <i className="bi bi-gear servico-galeria-placeholder"></i>
                                )}
                            </div>
                            <div className='servico-galeria-item'>
                                {servico.imagem ? (
                                    <img src={servico.imagemUrl} alt={servico.nome} className="servico-galeria-img" />
                                ) : (
                                    <i className="bi bi-gear servico-galeria-placeholder"></i>
                                )}
                            </div>
                            <div className='servico-galeria-item'>
                                {servico.imagem ? (
                                    <img src={servico.imagemUrl} alt={servico.nome} className="servico-galeria-img" />
                                ) : (
                                    <i className="bi bi-gear servico-galeria-placeholder"></i>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='servico-content'>
                    <div className="servico-informacoes">
                        <div className='servico-header'>
                            <h1 className="servico-titulo">{servico.nome}</h1>

                            <div className='servico-acoes-rapidas'>
                                <div className='servico-acao-item'>
                                    <i className="bi bi-share"></i>
                                </div>

                                <div
                                    className={`servico-acao-item servico-favorito-btn ${loadingFavorito ? 'loading' : ''}`}
                                    onClick={toggleFavorito}
                                    disabled={loadingFavorito}
                                >
                                    {loadingFavorito ? (
                                        <i className="bi bi-arrow-repeat animate-spin"></i>
                                    ) : isFavorito ? (
                                        <i className="bi bi-heart-fill servico-favorito-ativo"></i>
                                    ) : (
                                        <i className="bi bi-heart"></i>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="servico-descricao">
                            <p>{servico.descricao}</p>
                        </div>

                        <div className="sobre-local">
                            <div className="sobre-local-texto">
                                <h2 className="sobre-local-titulo">
                                    <i className="bi bi-house"></i>
                                    Sobre o local
                                </h2>
                                <p className="sobre-local-descricao">
                                    Estamos localizados na R. Alcatifa, a oficina Rick Estética Automotiva é referência em cuidados automotivos, oferecendo serviços especializados que vão desde lavagens técnicas até vitrificação e revitalização completa de veículos. Nosso objetivo é proporcionar não apenas limpeza, mas também proteção, valorização e durabilidade para cada carro que passa por aqui.
                                </p>
                            </div>

                            <div className="sobre-local-imagem">
                                <img src={localImage} alt="Imagem do local" />
                            </div>
                        </div>

                        <div className="como-chegar">
                            <div className="como-chegar-texto">
                                <h2 className="como-chegar-titulo">
                                    <i className="bi bi-geo-alt"></i>
                                    Como chegar?
                                </h2>
                                <h3 className="como-chegar-nome">Rick Estética Automotiva</h3>
                                <p className='como-chegar-endereco'>R. Alcatifa, 81 - Jardim Brasilia (Zona Leste), São Paulo, 03583-030</p>
                            </div>

                            <div className="como-chegar-mapa">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.2486944757753!2d-46.51234178502112!3d-23.53453698467894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5f0a5c5c5c5c%3A0x1234567890abcdef!2sR.%20Alcatifa%2C%2081%20-%20Jardim%20Brasilia%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003583-030!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Localização Rick Estética Automotiva"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    <div className="resumo-pedido">
                        <div className="resumo-pedido-header">
                            <h2 className="resumo-pedido-titulo">{servico.nome}</h2>
                        </div>

                        <div className="resumo-pedido-content">
                            <div className="resumo-preco">
                                <p className="resumo-preco-label">A partir de:</p>
                                <p className="resumo-preco-valor">R$ {servico.preco.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div className="resumo-acoes">
                                <button
                                    className="btn-adicionar-carrinho"
                                    onClick={adicionarAoCarrinho}
                                >
                                    Adicionar ao Carrinho
                                </button>
                                <button
                                    className="btn-agendar-servico"
                                    onClick={agendarServico}
                                >
                                    Agendar Serviço
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}