import { X, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Label } from './label/Label';
import { ServicoItem } from './servico-item/ServicoItem';
import { ModalEditaServico } from './modal-edita-servico/ModalEditaServico';
import { ModalRemoveServico } from './modal-remove-servico/ModalRemoveServico';
import { ModalAdicionaServico } from './modal-adiciona-servico/ModalAdicionaServico';
import { ordemServicoService } from '../../../../services/OrdemServicoService';
import { useToast } from '../../../../context/ToastContext';
import { TiposToast } from '../../../../utils/enum/TiposToast';
import { formatarPreco, formatarHorario, formatarDataHorario } from '../../../../utils';

export function ModalOrdemServico({ isOpen, agendamento, onClose, onOrdemAtualizada }) {
    const [editaServicoModal, setEditaServicoModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showAddServicoModal, setShowAddServicoModal] = useState(false);
    const [selectedServico, setSelectedServico] = useState(null);
    const [statusServico, setStatusServico] = useState(agendamento?.status);
    const [servicos, setServicos] = useState(agendamento?.servicos || []);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const statusRequestIdRef = useRef(0);
    const { mostrarToast } = useToast();

    const statusDescricaoPorId = {
        1: 'AGUARDANDO',
        2: 'EM_ANDAMENTO',
        3: 'AGUARDANDO_PECAS',
        4: 'CANCELADO',
        5: 'CONCLUIDO'
    };

    const extrairStatusId = (status) => {
        if (typeof status === 'object' && status !== null) {
            return status.id;
        }

        return status;
    };

    useEffect(() => {
        setStatusServico(extrairStatusId(agendamento?.status));
        setServicos(agendamento?.servicos || []);
    }, [agendamento]);

    useEffect(() => {
        if (!isOpen) return;

        const overflowBodyOriginal = document.body.style.overflow;
        const overflowHtmlOriginal = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowBodyOriginal;
            document.documentElement.style.overflow = overflowHtmlOriginal;
        };
    }, [isOpen]);

    if (!isOpen || !agendamento) return null;

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

    const normalizarServicos = (listaServicos = []) => {
        return listaServicos.map((servico) => {
            if (typeof servico === 'number') {
                return {
                    id: servico,
                    nome: `Serviço #${servico}`,
                    preco: 0,
                    valor: formatarPreco(0)
                };
            }

            const id = servico?.idServico ?? servico?.servico?.id ?? servico?.id;
            const preco = servico?.valorAplicado ?? servico?.preco ?? servico?.precoBase ?? 0;
            const nome = servico?.nome ?? servico?.servico?.nome ?? (id ? `Serviço #${id}` : 'Serviço');

            return {
                id: id ?? null,
                nome,
                preco,
                valor: formatarPreco(preco)
            };
        });
    };

    const formatarVeiculo = (veiculo) => {
        if (!veiculo) return '-';
        if (typeof veiculo === 'string') return veiculo;

        const campos = [veiculo.marca, veiculo.modelo].filter(Boolean);
        return campos.length > 0 ? campos.join(' ') : (veiculo.placa || '-');
    };

    const normalizarAgendamento = (ordem) => {
        const servicosNormalizados = normalizarServicos(ordem?.servicos || []);
        const statusId = extrairStatusId(ordem?.status);
        const valorTotal = ordem?.valorTotal ?? ordem?.precoMinimo ?? servicosNormalizados.reduce(
            (total, servico) => total + (servico.preco || 0),
            0
        );

        return {
            id: ordem?.id,
            horario: ordem?.horario || (ordem?.dataAgendamento ? formatarHorario(ordem.dataAgendamento) : '--:--'),
            cliente: ordem?.cliente?.nome || ordem?.cliente || '-',
            veiculo: formatarVeiculo(ordem?.veiculo),
            valor: formatarPreco(valorTotal),
            status: statusId,
            dataAgendamento: ordem?.dataAgendamento || '-',
            dataConclusao: ordem?.dtConclusao || ordem?.dataConclusao || '--/--/---- - --:--',
            observacoes: ordem?.observacoes || 'Sem observações.',
            servicos: servicosNormalizados
        };
    };

    const calcularValorTotalServicos = (listaServicos = []) => {
        return listaServicos.reduce((total, servico) => {
            if (typeof servico.preco === 'number') {
                return total + servico.preco;
            }

            if (typeof servico.valor === 'string') {
                const valorNormalizado = servico.valor
                    .replace('R$', '')
                    .replace(/\s/g, '')
                    .replace('.', '')
                    .replace(',', '.');

                const numero = Number(valorNormalizado);
                return Number.isNaN(numero) ? total : total + numero;
            }

            return total;
        }, 0);
    };

    const aplicarAtualizacaoLocalServicos = (servicosAtualizados = []) => {
        setServicos(servicosAtualizados);

        const valorTotal = calcularValorTotalServicos(servicosAtualizados);
        onOrdemAtualizada?.({
            ...agendamento,
            id: agendamento.id,
            servicos: servicosAtualizados,
            valor: formatarPreco(valorTotal),
            tipo: servicosAtualizados[0]?.nome || agendamento.tipo
        });
    };

    const aplicarOrdemAtualizada = (ordemAtualizada) => {
        if (!ordemAtualizada) return;

        const agendamentoNormalizado = normalizarAgendamento(ordemAtualizada);
        setStatusServico(agendamentoNormalizado.status);
        setServicos(agendamentoNormalizado.servicos);
        onOrdemAtualizada?.(agendamentoNormalizado);
    };

    const handleServicoEditado = (ordemAtualizada) => {
        setEditaServicoModal(false);
        setSelectedServico(null);
        aplicarOrdemAtualizada(ordemAtualizada);
    };

    const handleServicosAdicionados = (ordemAtualizada) => {
        setShowAddServicoModal(false);
        aplicarOrdemAtualizada(ordemAtualizada);
    };

    const handleServicoRemovido = (ordemAtualizada) => {
        setShowRemoveModal(false);
        setSelectedServico(null);
        aplicarOrdemAtualizada(ordemAtualizada);
    };

    const handleStatusChange = async (novoStatus) => {
        const statusAnterior = statusServico;
        const statusNumerico = Number(novoStatus);
        const requestId = statusRequestIdRef.current + 1;
        statusRequestIdRef.current = requestId;
        const statusDescricaoAtualizada = statusDescricaoPorId[statusNumerico] || null;
        const statusDescricaoAnterior = agendamento?.statusDescricao || null;

        setStatusServico(statusNumerico);
        onOrdemAtualizada?.({
            ...agendamento,
            status: statusNumerico,
            statusDescricao: statusDescricaoAtualizada
        });
        setLoadingStatus(true);

        try {
            await ordemServicoService.atualizarStatusGestao(agendamento.id, statusNumerico);

            mostrarToast({
                tipo: TiposToast.SUCESSO,
                titulo: 'Status atualizado',
                mensagem: 'O status da ordem de serviço foi atualizado com sucesso.',
                duracao: 3000
            });
        } catch (error) {
            if (statusRequestIdRef.current !== requestId) {
                return;
            }

            setStatusServico(statusAnterior);
            onOrdemAtualizada?.({
                ...agendamento,
                status: statusAnterior,
                statusDescricao: statusDescricaoAnterior
            });
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao atualizar status',
                mensagem: error.message || 'Não foi possível atualizar o status da ordem de serviço.',
                duracao: 4000
            });
        } finally {
            if (statusRequestIdRef.current === requestId) {
                setLoadingStatus(false);
            }
        }
    };

    const valorTotalServicos = calcularValorTotalServicos(servicos);

    const valorExibicao = valorTotalServicos > 0 ? formatarPreco(valorTotalServicos) : agendamento.valor;

    const formatarDataParaExibicao = (data, fallback = '-') => {
        if (!data) return fallback;

        const dataConvertida = new Date(data);
        if (Number.isNaN(dataConvertida.getTime())) {
            return data;
        }

        return formatarDataHorario(data);
    };

    const dataAgendamentoFormatada = formatarDataParaExibicao(agendamento.dataAgendamento);
    const dataConclusaoFormatada = formatarDataParaExibicao(agendamento.dataConclusao, '--/--/---- - --:--');

    return (
        <>
            <div className="fixed inset-0 bg-black/45 bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    >

                    <div className="sticky top-0 z-20 bg-red-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-sm">
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
                                {servicos.map((servico, index) => (
                                    <ServicoItem 
                                        key={`${servico.id}-${index}`}
                                        servico={servico}
                                        onEdit={editaServicoClick}
                                        onRemove={removeServicoClick}
                                    />
                                ))}
                            </div>
                        </div>

                        <Label label="Valor total do Serviço" value={valorExibicao} />

                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Status do Serviço</label>
                            <select
                                value={statusServico}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={loadingStatus}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            >
                                <option value="1">Aguardando</option>
                                <option value="2">Em andamento</option>
                                <option value="3">Aguardando peças</option>
                                <option value="4">Cancelado</option>
                                <option value="5">Concluído</option>
                            </select>
                        </div>

                        <Label label="Data do Agendamento" value={dataAgendamentoFormatada} />

                        <Label label="Data da Conclusão" value={dataConclusaoFormatada} />

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
                onOptimisticUpdate={aplicarAtualizacaoLocalServicos}
                onRollback={aplicarAtualizacaoLocalServicos}
                onSuccess={handleServicosAdicionados}
                onCancel={btnCancelaServico}
            />

            {/* Modal de Edição */}
            <ModalEditaServico
                isOpen={editaServicoModal}
                servico={selectedServico}
                ordemServicoId={agendamento.id}
                servicosAtuais={servicos}
                onOptimisticUpdate={aplicarAtualizacaoLocalServicos}
                onRollback={aplicarAtualizacaoLocalServicos}
                onSuccess={handleServicoEditado}
                onCancel={btnCancelaServico}
            />

            {/* Modal de Confirmação de Remoção */}
            <ModalRemoveServico
                isOpen={showRemoveModal}
                servico={selectedServico}
                ordemServicoId={agendamento.id}
                servicosAtuais={servicos}
                onOptimisticUpdate={aplicarAtualizacaoLocalServicos}
                onRollback={aplicarAtualizacaoLocalServicos}
                onSuccess={handleServicoRemovido}
                onCancel={btnCancelaServico}
            />
        </>
    );
}