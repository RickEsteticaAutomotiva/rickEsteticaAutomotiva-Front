import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { TiposToast } from '../../../../utils/enum/TiposToast';
import { formatarPreco } from '../../../../utils';
import { veiculoService } from '../../../../services/VeiculoService';
import { servicosService } from '../../../../services/ServicosService';
import { ordemServicoService } from '../../../../services/OrdemServicoService';

const normalizarLista = (origem) => {
    if (Array.isArray(origem)) {
        return origem;
    }

    return origem?.content || origem?.data || [];
};

export function ModalCriarOrdemServico({ isOpen, onClose, onCriada }) {
    const { user } = useAuth();
    const { mostrarToast } = useToast();
    const [veiculos, setVeiculos] = useState([]);
    const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
    const [dataHoraAgendamento, setDataHoraAgendamento] = useState('');
    const [servicosSelecionados, setServicosSelecionados] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const usuarioEhGerente = (user?.roles || []).some((role) => {
        const normalizado = String(role || '').toUpperCase();
        return normalizado === 'GERENTE' || normalizado === 'ROLE_GERENTE';
    });

    useEffect(() => {
        const carregarDados = async () => {
            if (!isOpen || !user?.id) {
                return;
            }

            setCarregando(true);
            try {
                const [veiculosResultado, servicosResultado] = await Promise.allSettled([
                    usuarioEhGerente
                        ? veiculoService.buscarTodos({
                            pagina: 0,
                            tamanho: 200,
                            ordenarPor: 'id',
                            direcao: 'desc'
                        })
                        : veiculoService.buscarVeiculosPorUsuario(user.id),
                    servicosService.buscarTodos({
                        pagina: 0,
                        tamanho: 200,
                        ordenarPor: 'nome',
                        filtro: ''
                    })
                ]);

                if (veiculosResultado.status === 'fulfilled') {
                    const listaVeiculos = normalizarLista(veiculosResultado.value);
                    setVeiculos(Array.isArray(listaVeiculos) ? listaVeiculos : []);
                } else {
                    setVeiculos([]);
                    mostrarToast({
                        tipo: TiposToast.ALERTA,
                        titulo: 'Veículos indisponíveis',
                        mensagem: veiculosResultado.reason?.message || 'Não foi possível carregar os veículos.',
                        duracao: 3500
                    });
                }

                if (servicosResultado.status === 'fulfilled') {
                    const listaServicos = normalizarLista(servicosResultado.value);
                    setServicosDisponiveis(Array.isArray(listaServicos) ? listaServicos : []);
                } else {
                    setServicosDisponiveis([]);
                    mostrarToast({
                        tipo: TiposToast.ALERTA,
                        titulo: 'Serviços indisponíveis',
                        mensagem: servicosResultado.reason?.message || 'Não foi possível carregar os serviços.',
                        duracao: 3500
                    });
                }
            } catch (error) {
                mostrarToast({
                    tipo: TiposToast.ERRO,
                    titulo: 'Erro ao carregar dados',
                    mensagem: error.message || 'Não foi possível carregar veículos e serviços.',
                    duracao: 4000
                });
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [isOpen, user?.id, usuarioEhGerente, mostrarToast]);

    useEffect(() => {
        if (!isOpen) {
            setVeiculoSelecionado('');
            setDataHoraAgendamento('');
            setServicosSelecionados([]);
        }
    }, [isOpen]);

    const totalSelecionado = useMemo(() => {
        const mapaSelecionados = new Set(servicosSelecionados.map(Number));

        return servicosDisponiveis.reduce((total, servico) => {
            if (!mapaSelecionados.has(Number(servico?.id))) {
                return total;
            }

            return total + (Number(servico?.preco) || 0);
        }, 0);
    }, [servicosDisponiveis, servicosSelecionados]);

    const toggleServico = (idServico) => {
        setServicosSelecionados((prev) => {
            const idNumerico = Number(idServico);
            if (prev.some((id) => Number(id) === idNumerico)) {
                return prev.filter((id) => Number(id) !== idNumerico);
            }

            return [...prev, idNumerico];
        });
    };

    const handleCriar = async () => {
        if (!veiculoSelecionado) {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Selecione um veículo',
                mensagem: 'É necessário escolher um veículo para criar a ordem de serviço.',
                duracao: 3000
            });
            return;
        }

        if (!dataHoraAgendamento) {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Selecione data e horário',
                mensagem: 'Informe o horário do agendamento para continuar.',
                duracao: 3000
            });
            return;
        }

        if (servicosSelecionados.length === 0) {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Selecione ao menos um serviço',
                mensagem: 'A ordem precisa ter pelo menos um serviço.',
                duracao: 3000
            });
            return;
        }

        const dataConvertida = new Date(dataHoraAgendamento);
        if (Number.isNaN(dataConvertida.getTime())) {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Data inválida',
                mensagem: 'A data/hora informada não é válida.',
                duracao: 3000
            });
            return;
        }

        const dataAgendamento = dataHoraAgendamento.length === 16
            ? `${dataHoraAgendamento}:00`
            : dataHoraAgendamento;

        const payload = {
            dataAgendamento,
            servicos: servicosSelecionados.map(Number),
            precoMinimo: totalSelecionado,
            veiculo: Number(veiculoSelecionado)
        };

        setSalvando(true);
        try {
            const ordemCriada = usuarioEhGerente
                ? await ordemServicoService.criarOrdemServicoGestao(payload)
                : await ordemServicoService.criarOrdemServico(payload);
            mostrarToast({
                tipo: TiposToast.SUCESSO,
                titulo: 'Ordem criada',
                mensagem: 'A nova ordem de serviço foi criada com sucesso.',
                duracao: 3000
            });
            onCriada?.(ordemCriada);
            onClose?.();
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao criar ordem',
                mensagem: error.message || 'Não foi possível criar a ordem de serviço.',
                duracao: 4000
            });
        } finally {
            setSalvando(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end md:items-center justify-center p-3">
            <div className="bg-white w-full md:max-w-xl overflow-visible">
                <div className="bg-red-600 text-white p-4 flex items-center justify-between sticky top-0">
                    <h2 className="text-lg font-semibold">Nova ordem de serviço</h2>
                    <button onClick={onClose} className="hover:text-gray-100 transition-colors" aria-label="Fechar">
                        <X size={22} />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {carregando ? (
                        <p className="text-sm text-gray-500">Carregando dados...</p>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Veículo</label>
                                <select
                                    value={veiculoSelecionado}
                                    onChange={(e) => setVeiculoSelecionado(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Selecione um veículo</option>
                                    {veiculos.map((veiculo) => (
                                        <option key={veiculo.id} value={veiculo.id}>
                                            {[veiculo.marca, veiculo.modelo, veiculo.placa].filter(Boolean).join(' • ')}
                                        </option>
                                    ))}
                                </select>
                                {veiculos.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        {usuarioEhGerente
                                            ? 'Nenhum veículo encontrado para gestão.'
                                            : 'Nenhum veículo encontrado para o usuário logado.'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data e horário</label>
                                <input
                                    type="datetime-local"
                                    value={dataHoraAgendamento}
                                    onChange={(e) => setDataHoraAgendamento(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">Serviços</label>
                                    <span className="text-sm text-gray-500">{servicosSelecionados.length} selecionado(s)</span>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-2 space-y-2 max-h-56 overflow-y-auto">
                                    {servicosDisponiveis.length === 0 ? (
                                        <p className="text-sm text-gray-500 p-2">Nenhum serviço disponível.</p>
                                    ) : (
                                        servicosDisponiveis.map((servico) => {
                                            const selecionado = servicosSelecionados.some((id) => Number(id) === Number(servico.id));

                                            return (
                                                <button
                                                    key={servico.id}
                                                    type="button"
                                                    onClick={() => toggleServico(servico.id)}
                                                    className={`w-full text-left p-3 rounded-md border transition-colors ${
                                                        selecionado
                                                            ? 'bg-red-50 border-red-300'
                                                            : 'bg-white border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-800">{servico.nome}</span>
                                                        <span className="text-sm font-semibold text-green-700">{formatarPreco(servico.preco || 0)}</span>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                <span className="text-sm text-gray-600">Valor mínimo estimado</span>
                                <span className="text-lg font-semibold text-[#B30000]">{formatarPreco(totalSelecionado)}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-5 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleCriar}
                        disabled={salvando || carregando}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {salvando ? 'Criando ordem...' : 'Criar ordem de serviço'}
                    </button>
                </div>
            </div>
        </div>
    );
}
