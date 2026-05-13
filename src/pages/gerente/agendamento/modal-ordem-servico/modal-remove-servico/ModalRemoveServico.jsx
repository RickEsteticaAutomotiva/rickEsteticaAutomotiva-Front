import { useState } from 'react';
import { useToast } from '../../../../../context/ToastContext';
import { TiposToast } from '../../../../../utils/enum/TiposToast';
import { ordemServicoService } from '../../../../../services/OrdemServicoService';

export function ModalRemoveServico({ 
    isOpen, 
    servico,
    ordemServicoId,
    servicosAtuais = [],
    onOptimisticUpdate,
    onRollback,
    onSuccess,
    onCancel 
}) {
    const [removendo, setRemovendo] = useState(false);
    const { mostrarToast } = useToast();

    if (!isOpen || !servico) return null;

    const handleConfirm = async () => {
        let snapshotServicos = [];

        try {
            if (!ordemServicoId) {
                throw new Error('Ordem de serviço inválida para remover serviço.');
            }

            const servicoId = servico?.idServico ?? servico?.servico?.id ?? servico?.id;
            if (!servicoId) {
                throw new Error('Serviço inválido para remoção.');
            }

            snapshotServicos = servicosAtuais.map((item) => ({ ...item }));
            const servicosAtualizados = servicosAtuais.filter((item) => {
                const itemId = item?.idServico ?? item?.servico?.id ?? item?.id;
                return itemId !== servicoId;
            });

            setRemovendo(true);
            onOptimisticUpdate?.(servicosAtualizados);
            const ordemAtualizada = await ordemServicoService.removerServicoDaOrdem(ordemServicoId, servicoId);

            mostrarToast({
                tipo: TiposToast.SUCESSO,
                titulo: 'Serviço removido',
                mensagem: 'Serviço removido da ordem com sucesso.',
                duracao: 3000
            });
            onSuccess(ordemAtualizada);
        } catch (error) {
            onRollback?.(snapshotServicos);
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao remover serviço',
                mensagem: error.message || 'Não foi possível remover o serviço.',
                duracao: 4000
            });
        } finally {
            setRemovendo(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
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
                        disabled={removendo}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        {removendo ? 'Removendo...' : 'Remover'}
                    </button>
                </div>
            </div>
        </div>
    );
}