import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { CardServico } from '../../components/card-servico/CardServico';
import { Footer } from '../../components/footer/Footer';
import { Paginacao } from '../../components/paginacao/Paginacao';
import { ROUTES } from '../../constants/Routes';
import { servicosService } from '../../services/ServicosService';

export function Busca() {
    const [searchParams] = useSearchParams();
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const termoPesquisa = searchParams.get('pesquisa');
    const TAMANHO_PAGINA = 16;

    useEffect(() => {
        if (termoPesquisa) {
            buscarServicos(termoPesquisa, 0);
        }
    }, [termoPesquisa]);

    const buscarServicos = async (termo, pagina = 0) => {
        setLoading(true);
        setError(null);
        setPaginaAtual(pagina);

        try {
            const response = await servicosService.pesquisar(termo, {
                pagina,
                tamanho: TAMANHO_PAGINA,
                ordenarPor: 'nome'
            });

            setResultados(response.content || []);
            setTotalPaginas(response.totalPages || 0);
        } catch (error) {
            setError('Erro ao buscar serviços');
            setResultados([]);
            setTotalPaginas(0);
        } finally {
            setLoading(false);
        }
    };

    const handleMudarPagina = (novaPagina) => {
        buscarServicos(termoPesquisa, novaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header />

            <div className="min-h-[calc(100vh-160px)] bg-gray-50 py-8">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Resultados da busca
                        </h1>
                        <p className="text-gray-500">
                            Mostrando {resultados.length} resultados para: <span className="font-semibold text-red-600">"{termoPesquisa}"</span>
                        </p>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500">Buscando serviços...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <i className="bi bi-exclamation-triangle text-6xl text-gray-300 mb-6 block"></i>
                            <h3 className="text-2xl font-semibold text-gray-600 mb-3">Erro ao buscar serviços</h3>
                            <p className="text-gray-500 mb-6">{error}</p>
                            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                                <i className="bi bi-arrow-left"></i>
                                Voltar para início
                            </Link>
                        </div>
                    )}

                    {!loading && !error && resultados.length === 0 && (
                        <div className="text-center py-16">
                            <i className="bi bi-search text-6xl text-gray-300 mb-6 block"></i>
                            <h3 className="text-2xl font-semibold text-gray-600 mb-3">Nenhum serviço encontrado</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Não encontramos serviços que correspondam à sua busca "{termoPesquisa}".
                                Tente outros termos ou explore nossos serviços disponíveis.
                            </p>
                            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                                <i className="bi bi-arrow-left"></i>
                                Voltar para início
                            </Link>
                        </div>
                    )}

                    {!loading && !error && resultados.length > 0 && (
                        <>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8 mb-8">
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
                            {totalPaginas > 1 && (
                                <Paginacao 
                                    paginaAtual={paginaAtual}
                                    totalPaginas={totalPaginas}
                                    onMudarPagina={handleMudarPagina}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}