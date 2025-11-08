import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { CardServico } from '../../components/card-servico/CardServico';
import { Footer } from '../../components/footer/Footer';
import "./Busca.css"; // Adicionar import do CSS

export function Busca() {
    const [searchParams] = useSearchParams();
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const termoPesquisa = searchParams.get('pesquisa');

    // Api aqui
    const servicosMock = [
        {
            "id": 8,
            "preco": 250,
            "descricao": "Proteção da pintura com camada de cristalização para maior brilho.",
            "nome": "Cristalização de Pintura"
        },
        {
            "id": 3,
            "preco": 200,
            "descricao": "Aplicação de cera técnica para proteção e brilho duradouro.",
            "nome": "Enceramento Técnico"
        },
        {
            "id": 15,
            "preco": 180,
            "descricao": "Limpeza e tratamento especializado para bancos de couro ou tecido.",
            "nome": "Higienização Bancos Couro / Tecido"
        },
        {
            "id": 13,
            "preco": 350,
            "descricao": "Limpeza profunda de todo o interior do veículo.",
            "nome": "Higienização Interna Completa"
        },
        {
            "id": 14,
            "preco": 150,
            "descricao": "Limpeza técnica do teto e das colunas internas do veículo.",
            "nome": "Higienização Teto e Colunas"
        },
        {
            "id": 2,
            "preco": 100,
            "descricao": "Lavagem detalhada com acabamento premium e proteção adicional.",
            "nome": "Lavagem Premium"
        },
        {
            "id": 1,
            "preco": 90,
            "descricao": "Lavagem completa com produtos específicos e técnicas detalhadas.",
            "nome": "Lavagem Técnica Carro"
        },
        {
            "id": 5,
            "preco": 400,
            "descricao": "Limpeza profunda do chassi e parte inferior do veículo.",
            "nome": "Limpeza Técnica de Chassi"
        },
        {
            "id": 4,
            "preco": 120,
            "descricao": "Limpeza detalhada do compartimento do motor com produtos específicos.",
            "nome": "Limpeza Técnica de Motor"
        },
        {
            "id": 16,
            "preco": 120,
            "descricao": "Eliminação de odores e bactérias por meio da aplicação de ozônio.",
            "nome": "Oxi Sanitização (Aplicação Ozônio)"
        },
        {
            "id": 7,
            "preco": 800,
            "descricao": "Polimento completo da pintura com correção de imperfeições.",
            "nome": "Polimento Técnico"
        },
        {
            "id": 6,
            "preco": 200,
            "descricao": "Polimento técnico para recuperação da transparência dos faróis.",
            "nome": "Polimento de Farol"
        },
        {
            "id": 17,
            "preco": 100,
            "descricao": "Remoção de manchas causadas por chuva ácida nos vidros.",
            "nome": "Remoção de Chuva Ácida Vidros"
        },
        {
            "id": 18,
            "preco": 50,
            "descricao": "Recuperação do brilho e aparência dos plásticos internos.",
            "nome": "Revitalização de Plásticos Internos"
        },
        {
            "id": 12,
            "preco": 150,
            "descricao": "Revestimento protetor que melhora a repelência à água no para-brisa.",
            "nome": "Vitrificação Para-brisa"
        },
        {
            "id": 10,
            "preco": 350,
            "descricao": "Aplicação de vitrificador para proteção e brilho dos plásticos.",
            "nome": "Vitrificação Plásticos"
        },
        {
            "id": 11,
            "preco": 300,
            "descricao": "Proteção do couro contra desgaste e manchas com produto vitrificador.",
            "nome": "Vitrificação de Couro"
        },
        {
            "id": 9,
            "preco": 1250,
            "descricao": "Proteção avançada da pintura com tecnologia de vitrificação.",
            "nome": "Vitrificação de Pintura"
        }
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
                servico.descricao.toLowerCase().includes(termo.toLowerCase())
            );

            setResultados(resultadosFiltrados);
            setLoading(false);
        }, 500);
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
                            Mostrando resultados para: <span className="font-semibold text-red-600">"{termoPesquisa}"</span>
                        </p>
                        <p className="busca-results-info">
                            {loading ? 'Buscando...' : `${resultados.length} resultado(s) encontrado(s)`}
                        </p>
                    </div>

                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    )}

                    {!loading && resultados.length === 0 && termoPesquisa && (
                        <div className="empty-state">
                            <i className="bi bi-search"></i>
                            <h3>Nenhum resultado encontrado</h3>
                            <p>
                                Tente buscar com outras palavras-chave ou verifique a categoria desejada.
                            </p>
                        </div>
                    )}

                    {!loading && resultados.length > 0 && (
                        <div className="servicos-grid-busca">
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