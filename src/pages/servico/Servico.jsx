import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UseAuth } from '../../hooks/UseAuth';
import { ROUTES } from '../../constants/routes';
import { Header } from '../../components/header/Header';
import { servicosService } from '../../services/ServicosService';
import './Servico.css';

export function Servico() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = UseAuth();
    const [servico, setServico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorito, setIsFavorito] = useState(false);
    const [quantidade, setQuantidade] = useState(1);

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
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            </div>
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
            <div className="container mx-auto px-4 py-8">
                <nav className="mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link to={ROUTES.HOME} className="hover:text-red-600">Home</Link>
                        <i className="bi bi-chevron-right"></i>
                        {/*<Link to={`${ROUTES.BUSCA}?pesquisa=${servico.categoria.toLowerCase()}`} className="hover:text-red-600">
                            {servico.categoria}
                        </Link>*/}
                        <i className="bi bi-chevron-right"></i>
                        <span className="text-gray-700">{servico.nome}</span>
                    </div>
                </nav>

                <div className="">
                    <h1>{servico.nome}</h1>
                    <h1>{servico.categoria}</h1>
                    <h1>{servico.preco}</h1>
                </div>
            </div>
        </>
    );
}