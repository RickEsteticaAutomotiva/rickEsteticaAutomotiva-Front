import { Trash2 } from 'lucide-react';

export function ModalRemoveServico({ 
    isOpen, 
    selectedServico, 
    onCancel, 
    onConfirm 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Remover Serviço</h3>
                    <p className="text-gray-600 mb-4">
                        Tem certeza que deseja remover o serviço "{selectedServico?.nome}"?
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Remover
                    </button>
                </div>
            </div>
        </div>
    );
}