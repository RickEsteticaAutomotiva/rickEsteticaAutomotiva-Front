import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const CardCategoria = ({ categoria, onEditar, onExcluir }) => {
    if (!categoria || !categoria.id) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="bg-gradient-to-r from-[#B30000] to-[#8B0000] h-20 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold text-center px-4 truncate">
                    {categoria.nome}
                </h3>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">

                <div className="flex gap-3">
                    <button
                        onClick={() => onEditar(categoria)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition-colors cursor-pointer"
                        aria-label={`Editar categoria ${categoria.nome}`}
                    >
                        <Edit2 size={16} />
                        <span>Editar</span>
                    </button>

                    <button
                        onClick={() => onExcluir(categoria)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg transition-colors cursor-pointer"
                        aria-label={`Excluir categoria ${categoria.nome}`}
                    >
                        <Trash2 size={16} />
                        <span>Excluir</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardCategoria;