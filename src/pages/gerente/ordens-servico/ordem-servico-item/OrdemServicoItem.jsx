import { Search } from 'lucide-react';

export function OrdemServicoItem({ ordem, onItemClick }) {
    const normalizarDescricaoStatus = (descricao) => {
        if (!descricao) return null;

        return descricao
            .toString()
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());
    };

    const obterStatusVisual = (statusId, statusDescricao) => {
        const estilos = {
            1: 'bg-slate-100 text-slate-700',
            2: 'bg-blue-100 text-blue-700',
            3: 'bg-amber-100 text-amber-700',
            4: 'bg-rose-100 text-rose-700',
            5: 'bg-emerald-100 text-emerald-700'
        };

        const labelsPorId = {
            1: 'Em análise',
            2: 'Em andamento',
            3: 'Aguardando peças',
            4: 'Cancelado',
            5: 'Concluído'
        };

        return {
            classe: estilos[statusId] || 'bg-gray-100 text-gray-600',
            label: normalizarDescricaoStatus(statusDescricao) || labelsPorId[statusId] || 'Status'
        };
    };

    const statusVisual = obterStatusVisual(ordem?.status, ordem?.statusDescricao);

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{ordem.titulo || `OS #${ordem.id || '-'}`}</h3>
                    <p className="text-sm text-gray-500 truncate">{ordem.tipo} • {ordem.cliente}</p>
                    <span className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${statusVisual.classe}`}>
                        {statusVisual.label}
                    </span>
                </div>
                <button 
                    onClick={() => onItemClick && onItemClick(ordem)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <Search size={16} className="text-gray-600" />
                </button>
            </div>
        </div>
    );
}