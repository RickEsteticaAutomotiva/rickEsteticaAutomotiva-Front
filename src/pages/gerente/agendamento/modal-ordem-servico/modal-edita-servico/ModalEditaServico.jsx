import { useState, useEffect } from 'react';
import { Label } from '../label/Label';

export function ModalEditaServico({ 
    isOpen, 
    servico,
    ordemServicoId,
    onSuccess,
    onCancel 
}) {
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        if (servico) {
            setEditValue(servico.valor);
        }
    }, [servico]);

    if (!isOpen || !servico) return null;

    const handleSave = async () => {
        try {
            // Implementar chamada ao backend
            console.log('Editando serviço:', servico.id, 'ordem:', ordemServicoId, 'novo valor:', editValue);
            
            // Exemplo de requisição:
            // await api.put(`/ordens-servico/${ordemServicoId}/servicos/${servico.id}`, {
            //     valor: editValue
            // });

            // Limpar e notificar sucesso
            setEditValue('');
            onSuccess();
        } catch (error) {
            console.error('Erro ao editar serviço:', error);
            // Aqui você pode adicionar tratamento de erro (toast, alert, etc)
        }
    };

    const handleCancel = () => {
        setEditValue('');
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
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
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}