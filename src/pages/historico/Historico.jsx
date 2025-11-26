import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { Footer } from "../../components/footer/Footer";
import { LoadingState } from "../../components/loading-state/LoadingState";
import { UseAuth } from "../../hooks/UseAuth";
import { OrdemServicoService } from "../../services/OrdemServicoService";
import { VeiculoService } from "../../services/VeiculoService";
import { servicosService } from "../../services/ServicosService";
import { ROUTES } from "../../constants/Routes";
import { tradutorStatus, formatarDataCompleta, formatarHorario, formatarPreco } from '../../utils/index';
import "./Historico.css";

export function Historico() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = UseAuth();
    const navigate = useNavigate();
    const ordemServicoService = new OrdemServicoService();
    const veiculoService = new VeiculoService();

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

            setAgendamentos(agendamentosEnriquecidos);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusInfo = tradutorStatus(status);

        return (
            <span className={`status-badge ${statusInfo.classe}`}>
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

            <div className="historico-container">
                <div className="historico-content">
                    <div className="historico-header">
                        <h1 className="historico-title">
                            <i className="bi bi-clock-history mr-3"></i>
                            Meu Histórico de Agendamentos
                        </h1>
                        <p className="historico-subtitle">
                            Acompanhe todos os seus agendamentos realizados
                        </p>
                    </div>

                    {agendamentos.length === 0 ? (
                        <div className="empty-state">
                            <i className="bi bi-calendar-x empty-icon"></i>
                            <h3 className="empty-title">Nenhum agendamento encontrado</h3>
                            <p className="empty-description">
                                Você ainda não realizou nenhum agendamento. Que tal agendar um serviço agora?
                            </p>
                            <Link to={ROUTES.HOME} className="btn-primary btn-agendar">
                                <i className="bi bi-plus-circle mr-2"></i>
                                Agendar Serviço
                            </Link>
                        </div>
                    ) : (
                        <div className="agendamentos-grid">
                            {agendamentos.map((agendamento) => (
                                <div key={agendamento.id} className="agendamento-card">
                                    <div className="agendamento-header">
                                        <div className="agendamento-info">
                                            <div>
                                                <div className="agendamento-id">
                                                    Agendamento #{agendamento.id}
                                                </div>
                                                <div className="agendamento-data">
                                                    {formatarDataCompleta(agendamento.dataAgendamento)} às {formatarHorario(agendamento.dataAgendamento)}
                                                </div>
                                            </div>
                                        </div>
                                        {getStatusBadge(agendamento.status)}
                                    </div>

                                    <div className="agendamento-body">
                                        {/* Informações do Veículo */}
                                        <div className="veiculo-info">
                                            <div className="veiculo-title">
                                                <i className="bi bi-car-front"></i>
                                                Veículo
                                            </div>
                                            <div className="veiculo-detalhes">
                                                {agendamento.veiculo ?
                                                    `${agendamento.veiculo.marca} ${agendamento.veiculo.modelo} - ${agendamento.veiculo.ano} | ${agendamento.veiculo.cor} | ${agendamento.veiculo.placa}` :
                                                    'Dados do veículo não disponíveis'
                                                }
                                            </div>
                                        </div>

                                        {/* Lista de Serviços */}
                                        <div className="servicos-lista">
                                            <div className="servicos-title">
                                                <i className="bi bi-list-check"></i>
                                                Serviços ({agendamento.servicos?.length || 0})
                                            </div>
                                            {agendamento.servicos?.map((servico, index) => (
                                                <div key={servico.id || index} className="servico-item">
                                                    <span className="servico-nome">{servico.nome || `Serviço ${index + 1}`}</span>
                                                    <span className="servico-preco">
                                                        {formatarPreco(servico.preco)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="total-value">
                                            <span>Total Mínimo:</span>
                                            <span>{formatarPreco(agendamento.precoMinimo)}</span>
                                        </div>

                                        {/* Observações */}
                                        {agendamento.observacoes && (
                                            <div className="observacoes">
                                                <div className="observacoes-title">
                                                    <i className="bi bi-chat-text"></i>
                                                    Observações
                                                </div>
                                                <div className="observacoes-texto">
                                                    {agendamento.observacoes}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="agendamento-footer">
                                        <div className="footer-info">
                                            {agendamento.dtConclusao && (
                                                <span>Concluído em: {formatarDataCompleta(agendamento.dtConclusao)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}