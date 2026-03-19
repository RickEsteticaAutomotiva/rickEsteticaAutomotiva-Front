import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { Footer } from "../../components/footer/Footer";
import { LoadingState } from "../../components/loading-state/LoadingState";
import { ModalConfirmacao } from "../../components/modal-confirmacao/ModalConfirmacao";
import { useAuth } from "../../context/AuthContext";
import { ordemServicoService } from "../../services/OrdemServicoService";
import { veiculoService } from "../../services/VeiculoService";
import { servicosService } from "../../services/ServicosService";
import { ROUTES } from "../../constants/Routes";
import { tradutorStatus, formatarDataCompleta, formatarHorario, formatarPreco } from '../../utils/index';
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';

export function Historico() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalCancelamento, setShowModalCancelamento] = useState(false);
    const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState(null);
    const [loadingCancelamento, setLoadingCancelamento] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { mostrarToast } = useToast();

    const breadcrumbItems = [
        {
            label: 'Início',
            href: ROUTES.HOME,
            icon: 'bi bi-house'
        },
        {
            label: 'Meus Agendamentos',
            icon: 'bi bi-clock-history'
        }
    ];

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate(ROUTES.LOGIN);
            return;
        }

        buscarHistorico();
    }, [user]);

    const buscarHistorico = async () => {
        setLoading(true);
        try {
            const data = await ordemServicoService.buscarOrdemServicoPorUsuario(user.id);

            const agendamentosEnriquecidos = await Promise.all(
                data.map(async (agendamento) => {
                    try {
                        let veiculoInfo = null;
                        if (agendamento.veiculo) {
                            const veiculos = await veiculoService.buscarVeiculosPorUsuario(user.id);
                            veiculoInfo = veiculos.find(v => v.id === agendamento.veiculo);
                        }

                        let servicosInfo = [];
                        if (agendamento.servicos && agendamento.servicos.length > 0) {
                            const servicosPromises = agendamento.servicos.map(servicoId =>
                                servicosService.buscarPorId(servicoId)
                            );
                            servicosInfo = await Promise.all(servicosPromises);
                        }

                        return {
                            ...agendamento,
                            veiculo: veiculoInfo,
                            servicos: servicosInfo
                        };
                    } catch (error) {
                        return agendamento;
                    }
                })
            );

            const ordenados = agendamentosEnriquecidos.sort(
                (a, b) => new Date(b.dataAgendamento) - new Date(a.dataAgendamento)
            );
            setAgendamentos(ordenados);
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao carregar histórico',
                mensagem: 'Não foi possível buscar seus agendamentos. Tente novamente.',
                duracao: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = (agendamento) => {
        setAgendamentoParaCancelar(agendamento);
        setShowModalCancelamento(true);
    };

    const confirmarCancelamento = async () => {
        if (!agendamentoParaCancelar) return;

        setLoadingCancelamento(true);
        try {
            await ordemServicoService.atualizarStatus(agendamentoParaCancelar.id, 4);
            
            setAgendamentos(prevAgendamentos =>
                prevAgendamentos.map(agendamento =>
                    agendamento.id === agendamentoParaCancelar.id
                        ? { ...agendamento, status: 4 }
                        : agendamento
                )
            );

            setShowModalCancelamento(false);
            setAgendamentoParaCancelar(null);
            mostrarToast({
                tipo: TiposToast.SUCESSO,
                titulo: 'Agendamento cancelado',
                mensagem: 'Seu agendamento foi cancelado com sucesso.',
                duracao: 4000
            });
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao cancelar',
                mensagem: error.message || 'Não foi possível cancelar o agendamento. Tente novamente.',
                duracao: 5000
            });
        } finally {
            setLoadingCancelamento(false);
        }
    };

    const cancelarCancelamento = () => {
        setShowModalCancelamento(false);
        setAgendamentoParaCancelar(null);
    };

    const getStatusBadge = (status) => {
        const statusInfo = tradutorStatus(status.id);

        return (
            <span className={statusInfo.classe}>
                <i className={statusInfo.icon}></i>
                {statusInfo.label}
            </span>
        );
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <>
            <Header />
            <Breadcrumb items={breadcrumbItems} />

            <div className="bg-gray-50 min-h-[calc(100vh-80px)] p-4 md:p-8">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-white rounded-xl p-6 md:p-8 mb-8 shadow-md">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            <i className="bi bi-clock-history mr-3"></i>
                            Meu Histórico de Agendamentos
                        </h1>
                        <p className="text-gray-500">
                            Acompanhe todos os seus agendamentos realizados
                        </p>
                    </div>

                    {agendamentos.length === 0 ? (
                        <div className="text-center py-16">
                            <i className="bi bi-calendar-x text-6xl text-gray-300 mb-6 block"></i>
                            <h3 className="text-2xl font-semibold text-gray-600 mb-3">Nenhum agendamento encontrado</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Você ainda não realizou nenhum agendamento. Que tal agendar um serviço agora?
                            </p>
                            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 bg-[#B30000] text-white px-6 py-3 rounded-lg hover:bg-[#990000] transition-colors font-semibold">
                                <i className="bi bi-plus-circle"></i>
                                Agendar Serviço
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {agendamentos.map((agendamento) => (
                                <div key={agendamento.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    Agendamento #{agendamento.id}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {formatarDataCompleta(agendamento.dataAgendamento)} às {formatarHorario(agendamento.dataAgendamento)}
                                                </div>
                                            </div>
                                        </div>
                                        {getStatusBadge(agendamento.status)}
                                    </div>

                                    <div className="p-6">
                                        {/* Informações do Veículo */}
                                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                            <div className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                <i className="bi bi-car-front"></i>
                                                Veículo
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                {agendamento.veiculo ?
                                                    `${agendamento.veiculo.marca} ${agendamento.veiculo.modelo} - ${agendamento.veiculo.placa}` :
                                                    'Dados do veículo não disponíveis'
                                                }
                                            </div>
                                        </div>

                                        {/* Lista de Serviços */}
                                        <div className="mb-4">
                                            <div className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                                                <i className="bi bi-list-check"></i>
                                                Serviços ({agendamento.servicos?.length || 0})
                                            </div>
                                            {agendamento.servicos?.map((servico, index) => (
                                                <div key={`${servico.id}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-gray-800">{servico.nome || `Serviço ${index + 1}`}</span>
                                                    <span className="text-[#B30000] font-semibold">
                                                        {formatarPreco(servico.preco)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200 font-bold text-gray-800">
                                            <span>Total Mínimo:</span>
                                            <span>{formatarPreco(agendamento.precoMinimo)}</span>
                                        </div>

                                        {/* Observações */}
                                        {agendamento.observacoes && (
                                            <div className="mt-4">
                                                <div className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                    <i className="bi bi-chat-text"></i>
                                                    Observações
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    {agendamento.observacoes}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            {agendamento.dtConclusao && (
                                                <span>Concluído em: {formatarDataCompleta(agendamento.dtConclusao)}</span>
                                            )}
                                        </div>
                                        
                                        {agendamento.status === 1 && (
                                            <button
                                                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
                                                onClick={() => handleCancelar(agendamento)}
                                            >
                                                <i className="bi bi-x-circle mr-2"></i>
                                                Cancelar Agendamento
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {/* Modal de Cancelamento */}
            {agendamentoParaCancelar && (
                <ModalConfirmacao
                    isOpen={showModalCancelamento}
                    onClose={cancelarCancelamento}
                    onConfirm={confirmarCancelamento}
                    titulo="Cancelar Agendamento"
                    tipo="danger"
                    icone="bi bi-exclamation-triangle"
                    textoBotaoConfirmar="Sim, cancelar"
                    textoBotaoCancelar="Não cancelar"
                    loading={loadingCancelamento}
                >
                    <div style={{ textAlign: 'left' }}>
                        <p className="modal-confirmacao-mensagem">
                            Tem certeza que deseja cancelar o agendamento #{agendamentoParaCancelar.id}?
                        </p>
                        
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: '#fef2f2',
                            borderRadius: '8px',
                            border: '1px solid #fecaca'
                        }}>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#dc2626',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <i className="bi bi-exclamation-triangle"></i>
                                Esta ação não pode ser desfeita.
                            </p>
                        </div>
                    </div>
                </ModalConfirmacao>
            )}
        </>
    );
}