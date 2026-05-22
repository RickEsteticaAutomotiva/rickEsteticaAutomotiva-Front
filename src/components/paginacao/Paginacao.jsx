export function Paginacao({
    paginaAtual,
    totalPaginas,
    onMudarPagina
}) {
    const gerarPaginas = () => {
        const paginas = [];
        const paginasAoRedor = 1;
        const primeiraPagina = 0;
        const ultimaPagina = totalPaginas - 1;

        if (totalPaginas <= 7) {
            for (let i = 0; i < totalPaginas; i++) {
                paginas.push(i);
            }
            return paginas;
        }

        paginas.push(primeiraPagina);

        const inicioMiolo = Math.max(primeiraPagina + 1, paginaAtual - paginasAoRedor);
        const fimMiolo = Math.min(ultimaPagina - 1, paginaAtual + paginasAoRedor);

        if (inicioMiolo > primeiraPagina + 1) {
            paginas.push('...esquerda');
        }

        for (let i = inicioMiolo; i <= fimMiolo; i++) {
            paginas.push(i);
        }

        if (fimMiolo < ultimaPagina - 1) {
            paginas.push('...direita');
        }

        paginas.push(ultimaPagina);

        return paginas;
    };

    const mudarPaginaSegura = (paginaDestino) => {
        const paginaLimitada = Math.max(0, Math.min(totalPaginas - 1, paginaDestino));
        if (paginaLimitada !== paginaAtual) {
            onMudarPagina(paginaLimitada);
        }
    };

    const paginas = gerarPaginas();
    const temProxima = paginaAtual < totalPaginas - 1;
    const temAnterior = paginaAtual > 0;

    return (
        <div className="flex w-full items-center justify-center gap-2 mt-12 mb-8">
            <button
                onClick={() => mudarPaginaSegura(paginaAtual - 1)}
                disabled={!temAnterior}
                aria-label="Anterior"
                title="Anterior"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-medium transition-colors ${temAnterior
                        ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
            >
                <i className="bi bi-chevron-left" aria-hidden="true"></i>
            </button>

            <div className="flex min-w-0 flex-nowrap items-center justify-center gap-1 overflow-visible">
                {paginas.map((numero) => (
                    typeof numero === 'string' ? (
                        <span key={numero} className="shrink-0 px-1 text-gray-400 select-none">
                            ...
                        </span>
                    ) : (
                        <button
                            key={numero}
                            onClick={() => mudarPaginaSegura(numero)}
                            className={`h-9 w-9 shrink-0 rounded-lg font-semibold transition-colors sm:h-10 sm:w-10 ${numero === paginaAtual
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-700 hover:bg-red-50 border border-gray-200'
                                }`}
                        >
                            {numero + 1}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => mudarPaginaSegura(paginaAtual + 1)}
                disabled={!temProxima}
                aria-label="Próximo"
                title="Próximo"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-medium transition-colors ${temProxima
                        ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
            >
                <i className="bi bi-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
    );
}
