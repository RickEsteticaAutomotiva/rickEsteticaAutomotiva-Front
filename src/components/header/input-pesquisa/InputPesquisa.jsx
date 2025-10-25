import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./InputPesquisa.css";

export function InputPesquisa() {
    const [termoBusca, setTermoBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const servicosMock = [
        {
            "id": 8,
            "categoria": "Polimentos e Proteções",
            "descricao": "Proteção da pintura com camada de cristalização para maior brilho.",
            "nome": "Cristalização de Pintura"
        },
        {
            "id": 3,
            "categoria": "Polimentos e Proteções",
            "descricao": "Aplicação de cera técnica para proteção e brilho duradouro.",
            "nome": "Enceramento Técnico"
        },
        {
            "id": 15,
            "categoria": "Higienizações",
            "descricao": "Limpeza e tratamento especializado para bancos de couro ou tecido.",
            "nome": "Higienização Bancos Couro / Tecido"
        },
        {
            "id": 13,
            "categoria": "Higienizações",
            "descricao": "Limpeza profunda de todo o interior do veículo.",
            "nome": "Higienização Interna Completa"
        },
        {
            "id": 14,
            "categoria": "Higienizações",
            "descricao": "Limpeza técnica do teto e das colunas internas do veículo.",
            "nome": "Higienização Teto e Colunas"
        },
        {
            "id": 2,
            "categoria": "Lavagem",
            "descricao": "Lavagem detalhada com acabamento premium e proteção adicional.",
            "nome": "Lavagem Premium"
        },
        {
            "id": 1,
            "categoria": "Lavagem",
            "descricao": "Lavagem completa com produtos específicos e técnicas detalhadas.",
            "nome": "Lavagem Técnica Carro"
        },
        {
            "id": 5,
            "categoria": "Lavagem",
            "descricao": "Limpeza profunda do chassi e parte inferior do veículo.",
            "nome": "Limpeza Técnica de Chassi"
        },
        {
            "id": 4,
            "categoria": "Lavagem",
            "descricao": "Limpeza detalhada do compartimento do motor com produtos específicos.",
            "nome": "Limpeza Técnica de Motor"
        },
        {
            "id": 16,
            "categoria": "Higienizações",
            "descricao": "Eliminação de odores e bactérias por meio da aplicação de ozônio.",
            "nome": "Oxi Sanitização (Aplicação Ozônio)"
        },
        {
            "id": 7,
            "categoria": "Polimentos e Proteções",
            "descricao": "Polimento completo da pintura com correção de imperfeições.",
            "nome": "Polimento Técnico"
        },
        {
            "id": 6,
            "categoria": "Polimentos e Proteções",
            "descricao": "Polimento técnico para recuperação da transparência dos faróis.",
            "nome": "Polimento de Farol"
        },
        {
            "id": 17,
            "categoria": "Higienizações",
            "descricao": "Remoção de manchas causadas por chuva ácida nos vidros.",
            "nome": "Remoção de Chuva Ácida Vidros"
        },
        {
            "id": 18,
            "categoria": "Higienizações",
            "descricao": "Recuperação do brilho e aparência dos plásticos internos.",
            "nome": "Revitalização de Plásticos Internos"
        },
        {
            "id": 12,
            "categoria": "Higienizações",
            "descricao": "Revestimento protetor que melhora a repelência à água no para-brisa.",
            "nome": "Vitrificação Para-brisa"
        },
        {
            "id": 10,
            "categoria": "Vitrificações",
            "descricao": "Aplicação de vitrificador para proteção e brilho dos plásticos.",
            "nome": "Vitrificação Plásticos"
        },
        {
            "id": 11,
            "categoria": "Vitrificações",
            "descricao": "Proteção do couro contra desgaste e manchas com produto vitrificador.",
            "nome": "Vitrificação de Couro"
        },
        {
            "id": 9,
            "categoria": "Vitrificações",
            "descricao": "Proteção avançada da pintura com tecnologia de vitrificação.",
            "nome": "Vitrificação de Pintura"
        }
    ]

    useEffect(() => {
        const termoDaUrl = searchParams.get('pesquisa');
        if (termoDaUrl) {
            setTermoBusca(termoDaUrl);
        }
    }, [searchParams]);

    const buscarServicos = (termo) => {
        if (!termo || termo.length < 2) {
            setResultados([]);
            setMostrarResultados(false);
            return;
        }

        const resultadosFiltrados = servicosMock.filter(servico =>
            servico.nome.toLowerCase().includes(termo.toLowerCase()) ||
            servico.categoria.toLowerCase().includes(termo.toLowerCase())
        );

        setResultados(resultadosFiltrados);
        setMostrarResultados(true);
    };

    useEffect(() => {
        const termoDaUrl = searchParams.get('pesquisa');

        if (termoBusca && termoBusca !== termoDaUrl) {
            const timeoutId = setTimeout(() => {
                buscarServicos(termoBusca);
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [termoBusca, searchParams]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setMostrarResultados(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        setTermoBusca(e.target.value);
    };

    const handleSelectServico = (servico) => {
        setTermoBusca(servico.nome);
        setMostrarResultados(false);
        navigate(`/busca?pesquisa=${encodeURIComponent(servico.nome)}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (termoBusca.trim()) {
            setMostrarResultados(false);
            navigate(`/busca?pesquisa=${encodeURIComponent(termoBusca)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }

        if (e.key === 'Escape') {
            setMostrarResultados(false);
        }
    };

    const handleFocus = () => {
        const termoDaUrl = searchParams.get('pesquisa');
        const estaNaPaginaDeBusca = window.location.pathname === '/busca';

        if (termoBusca.length >= 2 && (!estaNaPaginaDeBusca || termoBusca !== termoDaUrl)) {
            buscarServicos(termoBusca);
        }
    };

    return (
        <div className="search-container h-full" ref={searchRef}>
            <form onSubmit={handleSubmit} className="relative w-sm h-full">
                <input
                    type="text"
                    placeholder="Buscar serviços"
                    value={termoBusca}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    className="w-full h-full rounded-lg px-5 pr-12 bg-white border border-gray-300 focus:outline-none"
                    style={{'--focus-border-color': '#B30000'}}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#B30000';
                        handleFocus();
                    }}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 h-full flex items-center cursor-pointer"
                >
                    <div className="border-l border-gray-300 h-2/3 mx-3"></div>
                    <i className="bi bi-search text-gray-500 mr-4 transition-colors" 
                       style={{'--hover-color': '#B30000'}}
                       onMouseEnter={(e) => e.target.style.color = '#B30000'}
                       onMouseLeave={(e) => e.target.style.color = '#6b7280'}></i>
                </button>
            </form>

            {mostrarResultados && resultados.length > 0 && (
                <div className="search-results">
                    {resultados.map((servico) => (
                        <div
                            key={servico.id}
                            className="search-result-item"
                            onClick={() => handleSelectServico(servico)}
                        >
                            <div className="font-medium text-gray-900">{servico.nome}</div>
                            <div className="text-sm text-gray-500">{servico.categoria}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}