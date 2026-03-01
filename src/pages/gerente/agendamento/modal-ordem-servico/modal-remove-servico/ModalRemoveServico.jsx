import { Trash2 } from 'lucide-react';
import { useToast } from '../../../../../context/ToastContext';
import { TiposToast } from '../../../../../utils/enum/TiposToast';

export function ModalRemoveServico({ 
    isOpen, 
    servico,
    ordemServicoId,
    onSuccess,
    onCancel 
}) {
    const { mostrarToast } = useToast();

    if (!isOpen || !servico) return null;

    const handleConfirm = async () => {
        try {
            // Implementar chamada ao backend quando endpoint estiver disponível:
            // await api.delete(`/ordens-servico/${ordemServicoId}/servicos/${servico.id}`);

            onSuccess();
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao remover serviço',
                mensagem: error.message || 'Não foi possível remover o serviço.',
                duracao: 4000
            });
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