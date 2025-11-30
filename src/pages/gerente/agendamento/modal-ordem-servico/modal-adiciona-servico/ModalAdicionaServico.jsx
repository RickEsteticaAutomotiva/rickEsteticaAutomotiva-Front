import { Plus, Check } from 'lucide-react';

export function ModalAdicionaServico({ 
    isOpen, 
    servicosNaoAdicionados, 
    servicosSelecionados, 
    onServicoToggle, 
    onConfirm, 
    onCancel 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Adicionar Serviços</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Selecione os serviços para adicionar 
                                {servicosSelecionados.length > 0 && (
                                    <span className="text-green-600 font-medium ml-1">
                                        ({servicosSelecionados.length} selecionado{servicosSelecionados.length > 1 ? 's' : ''})
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 overflow-y-auto max-h-96">
                    {servicosNaoAdicionados.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Todos os serviços disponíveis já foram adicionados</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {servicosNaoAdicionados.map((servico) => {
                                const isSelected = servicosSelecionados.some(s => s.id === servico.id);
                                return (
                                    <div
                                        key={servico.id}
                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                            isSelected 
                                                ? 'bg-green-100 border-2 border-green-500' 
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                        }`}
                                        onClick={() => onServicoToggle(servico)}
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{servico.nome}</p>
                                            <p className="text-sm text-green-600 font-semibold">{servico.valor}</p>
                                        </div>
                                        <div className="flex items-center">
                                            {isSelected ? (
                                                <Check size={16} className="text-green-600" />
                                            ) : (
                                                <Plus size={16} className="text-green-600" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200">
                    {servicosSelecionados.length > 0 ? (
                        <div className="flex gap-2">
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                            >
                                Confirmar ({servicosSelecionados.length})
                            </button>
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onCancel}
                            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}