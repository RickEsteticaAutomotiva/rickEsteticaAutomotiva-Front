import { X, Edit2, Trash2, Plus, Check } from 'lucide-react';
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
    const [servicosSelecionados, setServicosSelecionados] = useState([]); // Novo estado
    const [editValue, setEditValue] = useState('');

    if (!isOpen || !agendamento) return null;

    // Assumindo que agendamento.servicos é uma lista de objetos com { id, nome, valor }
    const servicos = agendamento.servicos || [];

    // Lista de serviços disponíveis para adicionar
    const servicosDisponiveis = [
        { id: 100, nome: "Lavagem Externa", valor: "R$ 30,00" },
        { id: 101, nome: "Lavagem Interna", valor: "R$ 25,00" },
        { id: 102, nome: "Enceramento", valor: "R$ 50,00" },
        { id: 103, nome: "Polimento", valor: "R$ 150,00" },
        { id: 104, nome: "Limpeza de Interior", valor: "R$ 80,00" },
        { id: 105, nome: "Higienização de Bancos", valor: "R$ 40,00" },
        { id: 106, nome: "Proteção Cera", valor: "R$ 20,00" },
        { id: 107, nome: "Aspiração Detalhada", valor: "R$ 30,00" },
        { id: 108, nome: "Limpeza de Motor", valor: "R$ 60,00" },
        { id: 109, nome: "Cera Líquida", valor: "R$ 35,00" }
    ];

    // Filtrar serviços que não estão no agendamento atual
    const servicosNaoAdicionados = servicosDisponiveis.filter(
        servicoDisponivel => !servicos.some(servico => servico.nome === servicoDisponivel.nome)
    );

    const editaServicoClick = (servico) => {
        setSelectedServico(servico);
        setEditValue(servico.valor);
        setEditaServicoModal(true);
    };

    const removeServicoClick = (servico) => {
        setSelectedServico(servico);
        setShowRemoveModal(true);
    };

    const adicionalServicoClick = () => {
        setShowAddServicoModal(true);
    };

    const btnEditaServico = () => {
        // Implementar lógica de edição aqui
        console.log('Editando serviço:', selectedServico.id, 'novo valor:', editValue);
        //fazer a atualização do valor do serviço na lista com end pont
        setEditaServicoModal(false);
        setSelectedServico(null);
        setEditValue('');
    };

    const btnRemoveServico = () => {
        // Implementar lógica de remoção aqui
        console.log('Removendo serviço:', selectedServico.id);
        setShowRemoveModal(false);
        setSelectedServico(null);
    };

    const btnAdicionalServico = (servico) => {
        setServicosSelecionados(prev => {
            const isSelected = prev.some(s => s.id === servico.id);
            if (isSelected) {
                // Remove se já estiver selecionado
                return prev.filter(s => s.id !== servico.id);
            } else {
                // Adiciona se não estiver selecionado
                return [...prev, servico];
            }
        });
    };

    const btnConfirmaAdicaoServicos = () => {
        // Implementar lógica para adicionar os serviços selecionados
        console.log('Adicionando serviços:', servicosSelecionados);
        // Aqui você faria a requisição para o backend
        
        // Limpar seleção e fechar modal
        setServicosSelecionados([]);
        setShowAddServicoModal(false);
    };

    const btnCancelaServico = () => {
        setEditaServicoModal(false);
        setShowRemoveModal(false);
        setShowAddServicoModal(false);
        setSelectedServico(null);
        setServicosSelecionados([]); // Limpar seleção
        setEditValue('');
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/45 bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg rounded-t-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    style={{
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none', /* IE and Edge */
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

                        <Label label="Status do Serviço" value={agendamento.status} />

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
                servicosNaoAdicionados={servicosNaoAdicionados}
                servicosSelecionados={servicosSelecionados}
                onServicoToggle={btnAdicionalServico}
                onConfirm={btnConfirmaAdicaoServicos}
                onCancel={btnCancelaServico}
            />

            {/* Modal de Edição */}
            <ModalEditaServico
                isOpen={editaServicoModal}
                selectedServico={selectedServico}
                editValue={editValue}
                setEditValue={setEditValue}
                onCancel={btnCancelaServico}
                onSave={btnEditaServico}
            />

            {/* Modal de Confirmação de Remoção */}
            <ModalRemoveServico
                isOpen={showRemoveModal}
                selectedServico={selectedServico}
                onCancel={btnCancelaServico}
                onConfirm={btnRemoveServico}
            />
        </>
    );
}