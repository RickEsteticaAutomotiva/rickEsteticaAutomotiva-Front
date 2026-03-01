import { X, Plus } from 'lucide-react';
import { useState } from 'react';
import { Label } from './label/Label';
import { ServicoItem } from './servico-item/ServicoItem';
import { ModalEditaServico } from './modal-edita-servico/ModalEditaServico';
import { ModalRemoveServico } from './modal-remove-servico/ModalRemoveServico';
import { ModalAdicionaServico } from './modal-adiciona-servico/ModalAdicionaServico';

export function ModalOrdemServico({ isOpen, agendamento, onClose }) {
    const [editaServicoModal, setEditaServicoModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showAddServicoModal, setShowAddServicoModal] = useState(false);
    const [selectedServico, setSelectedServico] = useState(null);
    const [statusServico, setStatusServico] = useState(agendamento?.status);

    if (!isOpen || !agendamento) return null;

    const servicos = agendamento.servicos || [];

    const editaServicoClick = (servico) => {
        setSelectedServico(servico);
        setEditaServicoModal(true);
    };

    const removeServicoClick = (servico) => {
        setSelectedServico(servico);
        setShowRemoveModal(true);
    };

    const adicionalServicoClick = () => {
        setShowAddServicoModal(true);
    };

    const btnCancelaServico = () => {
        setEditaServicoModal(false);
        setShowRemoveModal(false);
        setShowAddServicoModal(false);
        setSelectedServico(null);
    };

    const handleServicoEditado = () => {
        setEditaServicoModal(false);
        setSelectedServico(null);
        // Aqui você pode recarregar os dados do agendamento se necessário
    };

    const handleServicosAdicionados = () => {
        setShowAddServicoModal(false);
        // Aqui você pode recarregar os dados do agendamento se necessário
    };

    const handleServicoRemovido = () => {
        setShowRemoveModal(false);
        setSelectedServico(null);
        // Aqui você pode recarregar os dados do agendamento se necessário
    };

    const handleStatusChange = async (novoStatus) => {
        setStatusServico(novoStatus);
        // Aqui você pode fazer a chamada à API para atualizar o status
        // try {
        //     await api.put(`/agendamentos/${agendamento.id}/status`, { status: novoStatus });
        // } catch (error) {
        //     console.error('Erro ao atualizar status:', error);
        // }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/45 bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg rounded-t-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    >

                    <div className="bg-red-600 text-white p-4 rounded-b-2xl flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Ordem de serviço</h2>
                        <button 
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        <Label label="Cliente" value={agendamento.cliente} />

                        <Label label="Carro" value={agendamento.veiculo} />

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm text-gray-500">Serviços</label>
                                <button
                                    onClick={adicionalServicoClick}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    title="Adicionar serviço"
                                >
                                    <Plus size={14} />
                                    Adicionar
                                </button>
                            </div>
                            <div className="space-y-2">
                                {servicos.map((servico) => (
                                    <ServicoItem 
                                        key={servico.id}
                                        servico={servico}
                                        onEdit={editaServicoClick}
                                        onRemove={removeServicoClick}
                                    />
                                ))}
                            </div>
                        </div>

                        <Label label="Valor total do Serviço" value={agendamento.valor} />

                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Status do Serviço</label>
                            <select
                                value={statusServico}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            >
                                <option value="1">Análise</option>
                                <option value="2">Agenda Confirmada</option>
                                <option value="3">Em Execução</option>
                                <option value="4">Cancelado</option>
                                <option value="5">Concluído</option>
                            </select>
                        </div>

                        <Label label="Data do Agendamento" value={agendamento.dataAgendamento} />

                        <Label label="Data da Conclusão" value={agendamento.dataConclusao} />

                        <div>
                            <label className="text-sm text-gray-500">Observações</label>
                            <p className="font-medium text-sm leading-relaxed">
                                {agendamento.observacoes}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Adição de Serviço */}
            <ModalAdicionaServico
                isOpen={showAddServicoModal}
                ordemServicoId={agendamento.id}
                servicosAtuais={servicos}
                onSuccess={handleServicosAdicionados}
                onCancel={btnCancelaServico}
            />

            {/* Modal de Edição */}
            <ModalEditaServico
                isOpen={editaServicoModal}
                servico={selectedServico}
                ordemServicoId={agendamento.id}
                onSuccess={handleServicoEditado}
                onCancel={btnCancelaServico}
            />

            {/* Modal de Confirmação de Remoção */}
            <ModalRemoveServico
                isOpen={showRemoveModal}
                servico={selectedServico}
                ordemServicoId={agendamento.id}
                onSuccess={handleServicoRemovido}
                onCancel={btnCancelaServico}
            />
        </>
    );
}