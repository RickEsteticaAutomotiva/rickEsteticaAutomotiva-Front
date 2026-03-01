import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { servicosService } from "../../../services/ServicosService";

export function InputPesquisa() {
    const [termoBusca, setTermoBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        const termoDaUrl = searchParams.get('pesquisa');
        if (termoDaUrl) {
            setTermoBusca(termoDaUrl);
        }
    }, [searchParams]);

    const buscarServicos = async (termo) => {
        if (!termo || termo.length < 3) {
            setResultados([]);
            setMostrarResultados(false);
            return;
        }

        setCarregando(true);
        setMostrarResultados(true);

        try {
            const response = await servicosService.pesquisar(termo, {
                pagina: 0,
                tamanho: 5,
                ordenarPor: 'nome'
            });
            const servicos = response?.content || response || [];
            setResultados(servicos);
        } catch {
            setResultados([]);
        } finally {
            setCarregando(false);
        }
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
        const estaNaPaginaDeBusca = location.pathname === '/busca';

        if (termoBusca.length >= 3 && (!estaNaPaginaDeBusca || termoBusca !== termoDaUrl)) {
            buscarServicos(termoBusca);
        }
    };

    return (
        <div className="relative h-full w-full md:w-[90%]" ref={searchRef}>
            <form onSubmit={handleSubmit} className="relative w-full h-10 md:h-full">
                <input
                    type="text"
                    placeholder="Buscar serviços"
                    value={termoBusca}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#B30000';
                        handleFocus();
                    }}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    className="w-full h-full rounded-lg px-5 pr-12 bg-white border border-gray-300 focus:outline-none transition-colors"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 h-full flex items-center cursor-pointer"
                >
                    <div className="border-l border-gray-300 h-2/3 mx-3"></div>
                    <i
                        className="bi bi-search text-gray-500 mr-4 transition-colors"
                        onMouseEnter={(e) => e.target.style.color = '#B30000'}
                        onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                    ></i>
                </button>
            </form>

            {mostrarResultados && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
                    {carregando ? (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                            <i className="bi bi-hourglass-split me-2"></i> Buscando...
                        </div>
                    ) : resultados.length > 0 ? (
                        resultados.map((servico) => (
                            <div
                                key={servico.id}
                                className="px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                onClick={() => handleSelectServico(servico)}
                            >
                                <div className="font-medium text-gray-900">{servico.nome}</div>
                                <div className="text-sm text-gray-500">{servico.categoriaNome}</div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                            Nenhum serviço encontrado.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}