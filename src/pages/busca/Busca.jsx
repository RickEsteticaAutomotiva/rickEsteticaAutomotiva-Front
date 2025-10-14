import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from "../../components/header/Header";

export function Busca() {
    const [searchParams] = useSearchParams();
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const termoPesquisa = searchParams.get('pesquisa');

    // Api aqui
    const servicosMock = [
        { id: 1, nome: "Lavagem Completa", categoria: "Lavagem", preco: 25.00, descricao: "Lavagem completa externa e interna" },
        { id: 2, nome: "Enceramento Automotivo", categoria: "Enceramento", preco: 80.00, descricao: "Enceramento profissional" },
        { id: 3, nome: "Lavagem Simples", categoria: "Lavagem", preco: 15.00, descricao: "Lavagem externa básica" },
        { id: 4, nome: "Detalhamento Interno", categoria: "Detalhamento", preco: 120.00, descricao: "Limpeza detalhada do interior" },
        { id: 5, nome: "Lavagem a Seco", categoria: "Lavagem", preco: 35.00, descricao: "Lavagem sem uso de água" },
        { id: 6, nome: "Pintura Automotiva", categoria: "Pintura", preco: 500.00, descricao: "Pintura completa do veículo" },
        { id: 7, nome: "Enceramento Premium", categoria: "Enceramento", preco: 150.00, descricao: "Enceramento com produtos premium" },
        { id: 8, nome: "Detalhamento Completo", categoria: "Detalhamento", preco: 250.00, descricao: "Detalhamento interno e externo" }
    ];

    useEffect(() => {
        if (termoPesquisa) {
            buscarServicos(termoPesquisa);
        }
    }, [termoPesquisa]);

    const buscarServicos = async (termo) => {
        setLoading(true);

        setTimeout(() => {
            const resultadosFiltrados = servicosMock.filter(servico =>
                servico.nome.toLowerCase().includes(termo.toLowerCase()) ||
                servico.categoria.toLowerCase().includes(termo.toLowerCase()) ||
                servico.descricao.toLowerCase().includes(termo.toLowerCase())
            );

            setResultados(resultadosFiltrados);
            setLoading(false);
        }, 500);
    };

    return (
        <>
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Resultados da busca
                    </h1>
                    <p className="text-gray-600">
                        Mostrando resultados para: <span className="font-semibold text-red-600">"{termoPesquisa}"</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {loading ? 'Buscando...' : `${resultados.length} resultado(s) encontrado(s)`}
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                )}

                {!loading && resultados.length === 0 && termoPesquisa && (
                    <div className="text-center py-12">
                        <i className="bi bi-search text-6xl text-gray-300 mb-4 block"></i>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Nenhum resultado encontrado
                        </h3>
                        <p className="text-gray-500">
                            Tente buscar com outras palavras-chave ou verifique a categoria desejada.
                        </p>
                    </div>
                )}

                {!loading && resultados.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resultados.map((servico) => (
                            <div key={servico.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800">{servico.nome}</h3>
                                    <span className="text-xl font-bold text-red-600">
                                        R$ {servico.preco.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{servico.categoria}</p>
                                <p className="text-gray-600 mb-4">{servico.descricao}</p>
                                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                    Agendar Serviço
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}