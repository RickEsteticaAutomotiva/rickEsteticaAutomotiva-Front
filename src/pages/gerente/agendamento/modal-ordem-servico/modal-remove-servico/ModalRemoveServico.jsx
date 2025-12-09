import { Trash2 } from 'lucide-react';

export function ModalRemoveServico({ 
    isOpen, 
    servico,
    ordemServicoId,
    onSuccess,
    onCancel 
}) {
    if (!isOpen || !servico) return null;

    const handleConfirm = async () => {
        try {
            // Implementar chamada ao backend
            console.log('Removendo serviço:', servico.id, 'da ordem:', ordemServicoId);
            
            // Exemplo de requisição:
            // await api.delete(`/ordens-servico/${ordemServicoId}/servicos/${servico.id}`);

            // Notificar sucesso
            onSuccess();
        } catch (error) {
            console.error('Erro ao remover serviço:', error);
            // Aqui você pode adicionar tratamento de erro (toast, alert, etc)
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Remover Serviço</h3>
                
                <p className="text-gray-600 mb-6">
                    Tem certeza que deseja remover o serviço <span className="font-semibold">{servico.nome}</span>?
                </p>

                <div className="flex space-x-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Remover
                    </button>
                </div>
            </div>
        </div>
    );
}