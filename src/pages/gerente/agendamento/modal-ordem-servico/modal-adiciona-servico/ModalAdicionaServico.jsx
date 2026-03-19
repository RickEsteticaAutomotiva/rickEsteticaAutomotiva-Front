import { Plus, Check } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '../../../../../context/ToastContext';
import { TiposToast } from '../../../../../utils/enum/TiposToast';
import { servicosService } from '../../../../../services/ServicosService';
import { ordemServicoService } from '../../../../../services/OrdemServicoService';
import { formatarPreco } from '../../../../../utils';

export function ModalAdicionaServico({ 
    isOpen, 
    ordemServicoId,
    servicosAtuais,
    onOptimisticUpdate,
    onRollback,
    onSuccess, 
    onCancel 
}) {
    const [servicosSelecionados, setServicosSelecionados] = useState([]);
    const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
    const [loadingServicos, setLoadingServicos] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const { mostrarToast } = useToast();

    useEffect(() => {
        const carregarServicos = async () => {
            if (!isOpen) return;

            setLoadingServicos(true);
            try {
                const response = await servicosService.buscarTodos({
                    pagina: 0,
                    tamanho: 100,
                    ordenarPor: 'nome',
                    filtro: ''
                });

                console.log('[ModalAdicionaServico] Response:', response);

                const lista = response?.content || response?.data || response || [];
                const listaArray = Array.isArray(lista) ? lista : [];

                const servicosNormalizados = listaArray.map((servico) => ({
                    id: servico?.id,
                    nome: servico?.nome,
                    valor: formatarPreco(servico?.preco || 0),
                    preco: servico?.preco || 0
                })).filter((servico) => servico?.id);

                console.log('[ModalAdicionaServico] Servços normalizados:', servicosNormalizados);

                setServicosDisponiveis(servicosNormalizados);
            } catch (error) {
                console.error('[ModalAdicionaServico] Erro ao carregar:', error);
                mostrarToast({
                    tipo: TiposToast.ERRO,
                    titulo: 'Erro ao carregar serviços',
                    mensagem: error.message || 'Não foi possível carregar a lista de serviços.',
                    duracao: 4000
                });
                setServicosDisponiveis([]);
            } finally {
                setLoadingServicos(false);
            }
        };

        carregarServicos();
    }, [isOpen, mostrarToast]);

    const servicosNaoAdicionados = useMemo(
        () => {
            const idsAtuais = new Set(
                (servicosAtuais || []).map((s) => s?.idServico ?? s?.servico?.id ?? s?.id)
            );
            return servicosDisponiveis.filter(
                (servicoDisponivel) => !idsAtuais.has(servicoDisponivel?.id)
            );
        },
        [servicosAtuais, servicosDisponiveis]
    );

    if (!isOpen) return null;

    const handleServicoToggle = (servico) => {
        setServicosSelecionados(prev => {
            const isSelected = prev.some(s => s.id === servico.id);
            if (isSelected) {
                return prev.filter(s => s.id !== servico.id);
            } else {
                return [...prev, servico];
            }
        });
    };

    const handleConfirm = async () => {
        let snapshotServicos = [];

        try {
            if (!ordemServicoId) {
                throw new Error('Ordem de serviço inválida para adicionar serviços.');
            }

            if (servicosSelecionados.length === 0) {
                return;
            }

            snapshotServicos = (servicosAtuais || []).map((item) => ({ ...item }));

            const servicosSelecionadosNormalizados = servicosSelecionados.map((servico) => ({
                id: servico.id,
                nome: servico.nome,
                preco: servico.preco,
                valor: formatarPreco(servico.preco)
            }));

            const idsAtuais = new Set(snapshotServicos.map((item) => item?.idServico ?? item?.servico?.id ?? item?.id));
            const novosServicos = servicosSelecionadosNormalizados.filter((item) => !idsAtuais.has(item.id));
            const servicosAtualizados = [...snapshotServicos, ...novosServicos];

            setSalvando(true);
            onOptimisticUpdate?.(servicosAtualizados);

            const ordemAtualizada = await ordemServicoService.adicionarServicos(ordemServicoId, servicosSelecionados);

            // Limpar seleção e notificar sucesso
            setServicosSelecionados([]);
            mostrarToast({
                tipo: TiposToast.SUCESSO,
                titulo: 'Serviços adicionados',
                mensagem: `${servicosSelecionados.length} serviço(s) adicionado(s) ao agendamento.`,
                duracao: 4000
            });
            onSuccess(ordemAtualizada);
        } catch (error) {
            onRollback?.(snapshotServicos);
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao adicionar serviços',
                mensagem: error.message || 'Não foi possível adicionar os serviços.',
                duracao: 4000
            });
        } finally {
            setSalvando(false);
        }
    };

    const handleCancel = () => {
        setServicosSelecionados([]);
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
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
                    {loadingServicos ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Carregando serviços...</p>
                        </div>
                    ) : servicosNaoAdicionados.length === 0 ? (
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
                                        onClick={() => handleServicoToggle(servico)}
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
                                onClick={handleConfirm}
                                disabled={salvando}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                            >
                                {salvando ? 'Salvando...' : `Confirmar (${servicosSelecionados.length})`}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleCancel}
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