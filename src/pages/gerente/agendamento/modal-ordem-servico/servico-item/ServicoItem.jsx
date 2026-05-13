import { Edit2, Trash2 } from 'lucide-react';

export function ServicoItem({ servico, onEdit, onRemove }) {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <p className="font-medium text-sm">{servico.nome}</p>
                <p className="text-sm text-green-600 font-semibold">{servico.valor}</p>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => onEdit(servico)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                    title="Editar valor"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={() => onRemove(servico)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    title="Remover serviço"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}