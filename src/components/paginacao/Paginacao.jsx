export function Paginacao({
    paginaAtual,
    totalPaginas,
    onMudarPagina
}) {
    const gerarPaginas = () => {
        const paginas = [];
        const maxPaginasVisiveis = 7;
        let inicio = Math.max(0, paginaAtual - 3);
        let fim = Math.min(totalPaginas - 1, inicio + maxPaginasVisiveis - 1);

        if (fim - inicio < maxPaginasVisiveis - 1) {
            inicio = Math.max(0, fim - maxPaginasVisiveis + 1);
        }

        for (let i = inicio; i <= fim; i++) {
            paginas.push(i);
        }

        return paginas;
    };

    const paginas = gerarPaginas();
    const temProxima = paginaAtual < totalPaginas - 1;
    const temAnterior = paginaAtual > 0;

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <button
                onClick={() => onMudarPagina(paginaAtual - 1)}
                disabled={!temAnterior}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${temAnterior
                        ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
            >
                <i className="bi bi-chevron-left"></i>
                Anterior
            </button>

            <div className="flex items-center gap-1">
                {paginas.map((numero) => (
                    <button
                        key={numero}
                        onClick={() => onMudarPagina(numero)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${numero === paginaAtual
                                ? 'bg-red-600 text-white'
                                : 'text-gray-700 hover:bg-red-50 border border-gray-200'
                            }`}
                    >
                        {numero + 1}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onMudarPagina(paginaAtual + 1)}
                disabled={!temProxima}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${temProxima
                        ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
            >
                Seguinte
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
}
