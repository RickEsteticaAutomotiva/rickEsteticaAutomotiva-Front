import { useState, useEffect } from 'react';
import { Label } from '../label/Label';
import { useToast } from '../../../../../context/ToastContext';
import { TiposToast } from '../../../../../utils/enum/TiposToast';
import { ordemServicoService } from '../../../../../services/OrdemServicoService';
import { formatarPreco } from '../../../../../utils';

export function ModalEditaServico({ 
    isOpen, 
    servico,
    ordemServicoId,
    servicosAtuais = [],
    onOptimisticUpdate,
    onRollback,
    onSuccess,
    onCancel 
}) {
    const [editValue, setEditValue] = useState('');
    const [salvando, setSalvando] = useState(false);
    const { mostrarToast } = useToast();

    useEffect(() => {
        if (servico) {
            const valorOriginal = typeof servico.preco === 'number'
                ? servico.preco
                : (servico.valorAplicado ?? servico.valor ?? 0);

            if (typeof valorOriginal === 'number') {
                setEditValue(formatarPreco(valorOriginal));
            } else {
                setEditValue(valorOriginal);
            }
        }
    }, [servico]);

    if (!isOpen || !servico) return null;

    const parseValorMoeda = (valor) => {
        if (typeof valor === 'number') {
            return valor;
        }

        if (!valor) {
            return 0;
        }

        const numero = Number(
            String(valor)
                .replace('R$', '')
                .replace(/\s/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
        );

        return Number.isNaN(numero) ? Number.NaN : numero;
    };

    const handleSave = async () => {
        let snapshotServicos = [];

        try {
            if (!ordemServicoId) {
                throw new Error('Ordem de serviço inválida para editar serviço.');
            }

            const servicoId = servico?.idServico ?? servico?.servico?.id ?? servico?.id;

            if (!servicoId) {
                throw new Error('Serviço inválido para edição.');
            }

            const valorAplicado = parseValorMoeda(editValue);
            if (Number.isNaN(valorAplicado) || valorAplicado < 0) {
                throw new Error('Informe um valor válido para o serviço.');
            }

            snapshotServicos = servicosAtuais.map((item) => ({ ...item }));
            const servicosAtualizados = servicosAtuais.map((item) => {
                const itemId = item?.idServico ?? item?.servico?.id ?? item?.id;

                if (itemId !== servicoId) {
                    return item;
                }

                return {
                    ...item,
                    preco: valorAplicado,
                    valorAplicado,
                    valor: formatarPreco(valorAplicado)
                };
            });

            setSalvando(true);
            onOptimisticUpdate?.(servicosAtualizados);

            const ordemAtualizada = await ordemServicoService.atualizarServicoDaOrdem(ordemServicoId, servicoId, {
                valorAplicado
            });

            setEditValue('');
            mostrarToast({
                tipo: TiposToast.SUCESSO,
                titulo: 'Serviço atualizado',
                mensagem: 'Valor do serviço atualizado com sucesso.',
                duracao: 3000
            });
            onSuccess(ordemAtualizada);
        } catch (error) {
            onRollback?.(snapshotServicos);
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao editar serviço',
                mensagem: error.message || 'Não foi possível editar o serviço.',
                duracao: 4000
            });
        } finally {
            setSalvando(false);
        }
    };

    const handleCancel = () => {
        setEditValue('');
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Editar Valor do Serviço</h3>
                
                <div className="mb-4">
                    <Label label="Serviço" value={servico.nome} className="mb-3" />
                    
                    <label className="text-sm text-gray-500 mb-1 block">Novo Valor</label>
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="R$ 0,00"
                    />
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={salvando}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {salvando ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
}