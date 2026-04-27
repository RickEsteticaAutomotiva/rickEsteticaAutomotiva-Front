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
import { formatarDataHorarioCompleto, formatarPreco, formatarHorario } from '../../../../utils';

export function ModalOrdemServico({ isOpen, agendamento, onClose, onOrdemAtualizada }) {
    const [editaServicoModal, setEditaServicoModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showAddServicoModal, setShowAddServicoModal] = useState(false);
    const [selectedServico, setSelectedServico] = useState(null);
    const [statusServico, setStatusServico] = useState(agendamento?.status);
    const [servicos, setServicos] = useState(agendamento?.servicos || []);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [savingDados, setSavingDados] = useState(false);
    const [dataAgendamentoEdicao, setDataAgendamentoEdicao] = useState('');
    const [observacoesEdicao, setObservacoesEdicao] = useState('');
    const statusRequestIdRef = useRef(0);
    const { mostrarToast } = useToast();

    const statusDescricaoPorId = {
        1: 'EM_ANALISE',
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

        const dataOriginal = agendamento?.dataAgendamentoOriginal;
        if (dataOriginal) {
            const data = new Date(dataOriginal);

            if (!Number.isNaN(data.getTime())) {
                const offsetMinutos = data.getTimezoneOffset();
                const dataLocal = new Date(data.getTime() - offsetMinutos * 60000);
                setDataAgendamentoEdicao(dataLocal.toISOString().slice(0, 16));
            } else {
                setDataAgendamentoEdicao('');
            }
        } else {
            setDataAgendamentoEdicao('');
        }

        setObservacoesEdicao(agendamento?.observacoes === 'Sem observações.' ? '' : (agendamento?.observacoes || ''));
    }, [agendamento]);

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
        const dataAgendamentoOriginal = ordem?.dataAgendamento || ordem?.dataHora || null;
        const dataConclusaoOriginal = ordem?.dtConclusao || ordem?.dataConclusao || null;
        const observacoesNormalizadas = ordem?.observacoes ?? ordem?.descricao ?? 'Sem observações.';

        return {
            id: ordem?.id,
            horario: ordem?.horario || (dataAgendamentoOriginal ? formatarHorario(dataAgendamentoOriginal) : '--:--'),
            cliente: ordem?.cliente?.nome || ordem?.cliente || '-',
            veiculo: formatarVeiculo(ordem?.veiculo),
            valor: formatarPreco(valorTotal),
            status: statusId,
            dataAgendamento: dataAgendamentoOriginal ? formatarDataHorarioCompleto(dataAgendamentoOriginal) : '-',
            dataAgendamentoOriginal,
            dataConclusao: dataConclusaoOriginal ? formatarDataHorarioCompleto(dataConclusaoOriginal) : '--/--/---- às --:--',
            observacoes: observacoesNormalizadas,
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
        const statusAnteriorNumerico = Number(statusAnterior);
        const possuiDataConclusao = !!agendamento?.dataConclusao && agendamento.dataConclusao !== '--/--/---- às --:--';
        const tentandoVoltarParaFluxoAtivo = [1, 2, 3].includes(statusNumerico);

        if ((statusAnteriorNumerico === 5 || possuiDataConclusao) && tentandoVoltarParaFluxoAtivo) {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Ordem concluída',
                mensagem: 'Esta ordem já foi concluída. Não é permitido retornar para Em análise, Em andamento ou Aguardando peças.',
                duracao: 4000
            });
            return;
        }

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

    const handleSalvarDados = async () => {
        if (!agendamento?.id) {
            return;
        }

        if (!dataAgendamentoEdicao) {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Data obrigatória',
                mensagem: 'Informe a data de agendamento para salvar as alterações.',
                duracao: 3000
            });
            return;
        }

        const dataAgendamentoFormatada = dataAgendamentoEdicao.length === 16
            ? `${dataAgendamentoEdicao}:00`
            : dataAgendamentoEdicao;

        setSavingDados(true);
        try {
            const statusAtual = Number(statusServico);
            const ordemAtualizada = await ordemServicoService.atualizarDadosGestao(agendamento.id, {
                dataAgendamento: dataAgendamentoFormatada,
                observacoes: observacoesEdicao.trim(),
                status: Number.isNaN(statusAtual) ? statusServico : statusAtual
            });

            aplicarOrdemAtualizada(ordemAtualizada);

            mostrarToast({
                tipo: TiposToast.SUCESSO,
                titulo: 'Dados atualizados',
                mensagem: 'Data e observações da ordem foram atualizadas com sucesso.',
                duracao: 3000
            });
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao salvar alterações',
                mensagem: error.message || 'Não foi possível atualizar os dados da ordem de serviço.',
                duracao: 4000
            });
        } finally {
            setSavingDados(false);
        }
    };

    const valorTotalServicos = calcularValorTotalServicos(servicos);

    const valorExibicao = valorTotalServicos > 0 ? formatarPreco(valorTotalServicos) : agendamento.valor;

    return (
        <>
            <div className="fixed inset-0 bg-black/45 bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg rounded-t-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    >

                    <div className="sticky top-0 z-10 bg-red-600 text-white p-4 flex justify-between items-center">
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
                                <option value="1">Em análise</option>
                                <option value="2">Em andamento</option>
                                <option value="3">Aguardando peças</option>
                                <option value="4">Cancelado</option>
                                <option value="5">Concluído</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Data do Agendamento</label>
                            <input
                                type="datetime-local"
                                value={dataAgendamentoEdicao}
                                onChange={(e) => setDataAgendamentoEdicao(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            />
                        </div>

                        <Label label="Data da Conclusão" value={agendamento.dataConclusao} />

                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Observações</label>
                            <textarea
                                value={observacoesEdicao}
                                onChange={(e) => setObservacoesEdicao(e.target.value)}
                                rows={4}
                                placeholder="Adicione observações da ordem de serviço"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                            />
                        </div>

                        <button
                            onClick={handleSalvarDados}
                            disabled={savingDados}
                            className="w-full py-2.5 px-4 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {savingDados ? 'Salvando alterações...' : 'Salvar alterações'}
                        </button>
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