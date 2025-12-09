import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { CardServico } from '../../components/card-servico/CardServico';
import { Footer } from '../../components/footer/Footer';
import { ROUTES } from '../../constants/Routes';
import { servicosService } from '../../services/ServicosService';
import './Busca.css';

export function Busca() {
    const [searchParams] = useSearchParams();
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const termoPesquisa = searchParams.get('pesquisa');

    useEffect(() => {
        if (termoPesquisa) {
            buscarServicos(termoPesquisa);
        }
    }, [termoPesquisa]);

    const buscarServicos = async (termo) => {
        setLoading(true);
        setError(null);

        try {
            const response = await servicosService.pesquisar(termo, {
                pagina: 0,
                tamanho: 50,
                ordenarPor: 'nome'
            });

            const servicos = response?.content || response || [];
            setResultados(servicos);
        } catch (error) {
            setError('Erro ao buscar serviços');
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="busca-container">
                <div className="busca-content">
                    <div className="busca-header">
                        <h1 className="busca-title">
                            Resultados da busca
                        </h1>
                        <p className="busca-subtitle">
                            Mostrando resultados para: <span className="termo-destaque">"{termoPesquisa}"</span>
                        </p>
                    </div>

                    {loading && (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p className="loading-text">Buscando serviços...</p>
                        </div>
                    )}

                    {error && (
                        <div className="empty-state">
                            <i className="bi bi-exclamation-triangle empty-icon"></i>
                            <h3 className="empty-title">Erro ao buscar serviços</h3>
                            <p className="empty-description">{error}</p>
                            <Link to={ROUTES.HOME} className="btn-voltar">
                                <i className="bi bi-arrow-left me-2"></i>
                                Voltar para início
                            </Link>
                        </div>
                    )}

                    {!loading && !error && resultados.length === 0 && (
                        <div className="empty-state">
                            <i className="bi bi-search empty-icon"></i>
                            <h3 className="empty-title">Nenhum serviço encontrado</h3>
                            <p className="empty-description">
                                Não encontramos serviços que correspondam à sua busca "{termoPesquisa}".
                                Tente outros termos ou explore nossos serviços disponíveis.
                            </p>
                            <Link to={ROUTES.HOME} className="btn-voltar">
                                <i className="bi bi-arrow-left me-2"></i>
                                Voltar para início
                            </Link>
                        </div>
                    )}

                    {!loading && !error && resultados.length > 0 && (
                        <div className="servicos-grid">
                            {resultados.map((servico) => (
                                <CardServico
                                    key={servico.id}
                                    id={servico.id}
                                    nome={servico.nome}
                                    preco={servico.preco}
                                    descricao={servico.descricao}
                                    imagem={servico.imagem}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}