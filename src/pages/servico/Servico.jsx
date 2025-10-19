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

export function Servico() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = UseAuth();
    const [servico, setServico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorito, setIsFavorito] = useState(false);
    const [quantidade, setQuantidade] = useState(1);

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
        } finally {
            setLoading(false);
        }
    };

    const verificarFavorito = async () => {
        // Colocar logica para verificar se o serviço está nos favoritos do usuário
        setIsFavorito(false);
    };

    const toggleFavorito = async () => {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        try {
            // Colocar logica para adicionar/remover serviços dos favoritos

            // Simulação
            setIsFavorito(!isFavorito);

        } catch (error) {
            console.error('Erro ao alterar favorito:', error);
        }
    };

    const adicionarAoCarrinho = () => {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        console.log(`Adicionando ${quantidade}x ${servico.nome} ao carrinho`);
    };

    const agendarServico = () => {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        // Lógica para agendar serviço
        // deve adicionar no carrinho e redirecionar para tela do carrinho

        navigate(`/carrinho`);
    };

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

            <main className='px-16 py-5'>
                <div className="">
                    <div className="servico-detalhes flex flex-col md:flex-row justify-between h-80">
                        <div className="servico-imagem w-2/4 flex-shrink-0">
                            <img src={servico.imagemUrl} alt={servico.nome} className="w-full h-full rounded-lg shadow-md" />
                        </div>
                        <div className="servico-imagem-menor flex-shrink-0 grid grid-cols-2 gap-5">
                            <img src={servico.imagemUrl} alt={servico.nome} className="w-full h-full rounded-lg shadow-md" />
                            <img src={servico.imagemUrl} alt={servico.nome} className="w-full h-full rounded-lg shadow-md" />
                            <img src={servico.imagemUrl} alt={servico.nome} className="w-full h-full rounded-lg shadow-md" />
                            <img src={servico.imagemUrl} alt={servico.nome} className="w-full h-full rounded-lg shadow-md" />
                        </div>
                    </div>
                </div>

                <div className='flex justify-between gap-5'>
                    <div className="servico-informacoes mt-8">
                        <div className='flex gap-4 justify-between items-center mb-4 border-b-2 pb-4 border-gray-200'>
                            <h1 className="text-3xl font-bold">{servico.nome}</h1>

                            <div className='flex gap-4'>
                                <div className='h-10 w-10 rounded-full bg-white flex justify-center items-center cursor-pointer shadow'>
                                    <div><i className="bi bi-share"></i></div>
                                </div>

                                <div className='h-10 w-10 rounded-full bg-white flex justify-center items-center cursor-pointer shadow' onClick={toggleFavorito}>
                                    <div><i className="bi bi-heart"></i></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="mt-4">{servico.descricao}</p>
                        </div>

                        <div className="sobre-local mt-8 flex gap-5">
                            <div className="w-90">
                                <h1 className="text-xl font-bold"><i className="bi bi-house mr-3"></i>Sobre o local</h1>
                                <p className="mt-2">Estamos localizados na Av. Corinthians, a oficina Rick Estética Automotiva é referência em cuidados automotivos, oferecendo serviços especializados que vão desde lavagens técnicas até vitrificação e revitalização completa de veículos. Nosso objetivo é proporcionar não apenas limpeza, mas também proteção, valorização e durabilidade para cada carro que passa por aqui.</p>
                            </div>

                            <img src={localImage} alt="Imagem do local" className="w-100 object-cover rounded-lg" />
                        </div>

                        <div className="como-chegar mt-15 flex gap-5">
                            <div className="w-90">
                                <h1 className="text-xl font-bold"><i className="bi bi-geo-alt mr-3"></i>Como chegar?</h1>
                                <h2 className="mt-3 text-lg font-semibold" href="#">Rick Estética Automotiva</h2>
                                <p className='mt-3'>R. Alcatifa, 81 - Jardim Brasilia (Zona Leste), São Paulo, 03583-030</p>
                            </div>

                            <div className="w-100 rounded-lg overflow-hidden">
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

                    <div className="resumo-pedido py-5 mt-8 bg-white rounded shadow-md w-1/3 h-fit">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2 px-5">
                            <h1 className="font-bold text-lg">{servico.nome}</h1>
                        </div>

                        <div className="px-5 flex flex-col gap-4">
                            <div className="flex flex-col">
                                <p className="font-semibold">A partir de:</p>
                                <p className="text-2xl font-semibold text-red-600 font-bold">R$ {servico.preco.toFixed(2)}</p>
                            </div>
                            <div className="acoes-servico flex flex-col gap-4 mt-6">
                                <button
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg mr-py-2 px-4 rounded w-full hover:bg-red-700 cursor-pointer"
                                    onClick={adicionarAoCarrinho}
                                >
                                    Adicionar ao Carrinho
                                </button>
                                <button
                                    className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-700 hover:text-white transition-colors cursor-pointer"
                                    onClick={agendarServico}
                                >
                                    Agendar Serviço
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}