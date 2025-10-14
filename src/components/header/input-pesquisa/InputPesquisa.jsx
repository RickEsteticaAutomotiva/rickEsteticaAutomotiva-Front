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
        { id: 1, nome: "Lavagem Completa", categoria: "Lavagem", preco: 25.00 },
        { id: 2, nome: "Enceramento Automotivo", categoria: "Enceramento", preco: 80.00 },
        { id: 3, nome: "Lavagem Simples", categoria: "Lavagem", preco: 15.00 },
        { id: 4, nome: "Detalhamento Interno", categoria: "Detalhamento", preco: 120.00 },
        { id: 5, nome: "Lavagem a Seco", categoria: "Lavagem", preco: 35.00 },
        { id: 6, nome: "Pintura Automotiva", categoria: "Pintura", preco: 500.00 },
        { id: 7, nome: "Enceramento Premium", categoria: "Enceramento", preco: 150.00 },
        { id: 8, nome: "Detalhamento Completo", categoria: "Detalhamento", preco: 250.00 }
    ];

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
                    className="w-full h-full rounded-lg px-5 pr-12 bg-white border border-gray-300 focus:border-red-500 focus:outline-none"
                />
                <button 
                    type="submit"
                    className="absolute right-0 top-0 h-full flex items-center cursor-pointer"
                >
                    <div className="border-l border-gray-300 h-2/3 mx-3"></div>
                    <i className="bi bi-search text-gray-500 mr-4 hover:text-red-600 transition-colors"></i>
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
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{servico.nome}</div>
                                    <div className="text-sm text-gray-500">{servico.categoria}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {mostrarResultados && termoBusca.length >= 2 && resultados.length === 0 && (
                <div className="search-results">
                    <div className="search-result-item text-gray-500 text-center">
                        Nenhum serviço encontrado para "{termoBusca}"
                    </div>
                </div>
            )}
        </div>
    )
}