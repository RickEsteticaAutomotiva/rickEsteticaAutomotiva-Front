import { Plus } from 'lucide-react';

export function OrdemServicoItem({ ordem, onItemClick }) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-800">{ordem.tipo}</h3>
                    <p className="text-sm text-gray-500">{ordem.cliente}</p>
                </div>
                <button 
                    onClick={() => onItemClick && onItemClick(ordem)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <Plus size={16} className="text-gray-600" />
                </button>
            </div>
        </div>
    );
}