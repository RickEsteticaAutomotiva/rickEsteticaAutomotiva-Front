import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import { servicosService } from '../../services/ServicosService';
import { useState, useEffect } from 'react';
import { CardServico } from "../../components/card-servico/CardServico";
import "./Home.css";
import { LoadingState } from "../../components/loading-state/LoadingState";

export function Home() {
    const [loading, setLoading] = useState(true);
    const [servicosData, setServicosData] = useState(null);
    const [servicos, setServicos] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [carregandoMais, setCarregandoMais] = useState(false);

    useEffect(() => {
        listarServicos();
    }, []);

    const listarServicos = async (pagina = 0, manterExistentes = false) => {
        if (pagina === 0) {
            setLoading(true);
        } else {
            setCarregandoMais(true);
        }

        try {
            const parametros = {
                pagina,
                tamanho: 20,
                ordenarPor: 'nome',
                filtro: ''
            };

            const data = await servicosService.buscarTodos(parametros);

            setServicosData(data);

            if (manterExistentes && pagina > 0) {
                setServicos(prev => [...prev, ...data.content]);
            } else {
                setServicos(data.content || []);
            }

            setPaginaAtual(pagina);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            setServicos([]);
        } finally {
            setLoading(false);
            setCarregandoMais(false);
        }
    };

    if (loading) {
        return (
            <LoadingState />
        );
    }

    const carregarMaisServicos = () => {
        if (servicosData && !servicosData.last && !carregandoMais) {
            listarServicos(paginaAtual + 1, true);
        }
    };

    const temMaisServicos = servicosData && !servicosData.last;

    return (
        <>
            <Header />

            <div className="home-container">
                <div className="home-content">
                    {servicos.length > 0 ? (
                        <>
                            <div className="servicos-grid">
                                {servicos.map(servico => (
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

                            {servicosData && (
                                <div className="pagination-info">
                                    <p className="pagination-text">
                                        Mostrando {servicos.length} de {servicosData.totalElements} serviços
                                    </p>
                                </div>
                            )}

                            {temMaisServicos && (
                                <div className="load-more-container">
                                    <button
                                        onClick={carregarMaisServicos}
                                        disabled={carregandoMais}
                                        className="load-more-button"
                                    >
                                        {carregandoMais ? (
                                            <>
                                                <div className="button-spinner"></div>
                                                Carregando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-plus-circle mr-2"></i>
                                                Carregar Mais Serviços
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <i className="bi bi-search text-6xl text-gray-300 mb-4"></i>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Nenhum serviço encontrado
                            </h3>
                            <p className="text-gray-500">
                                Não conseguimos encontrar serviços no momento. Tente novamente mais tarde.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}