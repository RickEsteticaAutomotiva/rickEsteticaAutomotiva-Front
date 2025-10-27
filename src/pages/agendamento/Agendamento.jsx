import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { Calendario } from "../../components/calendario/Calendario";
import { ModalConfirmacao } from "../../components/modal-confirmacao/ModalConfirmacao";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/routes";
import { CarrinhoService } from '../../services/CarrinhoService';
import "./Agendamento.css";
import { Footer } from '../../components/footer/Footer';
import { OrdemServico } from '../../services/OrdemServico';

export function Agendamento() {
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [horarioSelecionado, setHorarioSelecionado] = useState(null);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
    const [servicosCarrinho, setServicosCarrinho] = useState([]);
    const [showModalConfirmacao, setShowModalConfirmacao] = useState(false);
    const [loadingConfirmacao, setLoadingConfirmacao] = useState(false);
    const carrinhoService = new CarrinhoService();
    const navigate = useNavigate();
    const ordenServico = new OrdemServico();
    const { isAuthenticated } = UseAuth();

    const user = JSON.parse(sessionStorage.getItem('userData'));

    const smoothScrollTo = (targetPosition, duration = 800) => {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    const breadcrumbItems = [
        { label: 'Início', href: ROUTES.HOME, icon: 'bi bi-house' },
        { label: 'Carrinho', href: ROUTES.CARRINHO, icon: 'bi bi-cart3' },
        { label: 'Veículos', href: ROUTES.VEICULOS, icon: 'bi bi-car-front' },
        { label: 'Agendamento', icon: 'bi bi-calendar3' }
    ];

    useEffect(() => {
        // Verificar autenticação
        // if (!isAuthenticated()) {
        //     navigate(ROUTES.LOGIN);
        //     return;
        // }

        const veiculo = JSON.parse(sessionStorage.getItem('veiculoSelecionado') || 'null');
        buscarServicosCarrinho();

        if (!veiculo) {
            navigate(ROUTES.VEICULOS);
            return;
        }

        setVeiculoSelecionado(veiculo);
    }, []);

    const buscarServicosCarrinho = async () => {
        const servicos = await carrinhoService.buscarCarrinhoUsuario(user.id);
        setServicosCarrinho(servicos);
        console.log('Serviços no carrinho:', servicos);
    };

    const handleDateSelect = (date) => {
        setDataSelecionada(date);
        setHorarioSelecionado(null); // Reset horário quando mudar data

        // Scroll suave para horários após selecionar data
        setTimeout(() => {
            const horariosSection = document.querySelector('.horarios-container');
            if (horariosSection) {
                const rect = horariosSection.getBoundingClientRect();
                const offsetTop = window.pageYOffset + rect.top - 120;
                smoothScrollTo(offsetTop, 1000);
            }
        }, 400);
    };

    const handleTimeSelect = (time) => {
        setHorarioSelecionado(time);
    };

    const formatarData = (data) => {
        return data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calcularTotal = () => {
        return servicosCarrinho.reduce((total, servico) => total + servico.preco, 0);
    };

    const abrirModalConfirmacao = () => {
        if (!dataSelecionada || !horarioSelecionado) {
            alert('Por favor, selecione uma data e horário');
            return;
        }
        setShowModalConfirmacao(true);
    };

    const confirmarAgendamento = async () => {
        setLoadingConfirmacao(true);

        const [horas, minutos] = horarioSelecionado.split(':');
        
        const ano = dataSelecionada.getFullYear();
        const mes = String(dataSelecionada.getMonth() + 1).padStart(2, '0');
        const dia = String(dataSelecionada.getDate()).padStart(2, '0');
        const horasFormatadas = String(horas).padStart(2, '0');
        const minutosFormatados = String(minutos).padStart(2, '0');
        
        const dataISO = `${ano}-${mes}-${dia}T${horasFormatadas}:${minutosFormatados}:00.000Z`;

        try {
            const agendamento = {
                // id: 0,
                dataAgendamento: dataISO,
                servicos: servicosCarrinho.map(servico => servico.idServico),
                precoMinimo: calcularTotal(),
                veiculo: veiculoSelecionado.id,
                // status: 0,
                // observacoes: "",
                // dtConclusao: null,
                // motivo: 0
            };

            // Simular chamada da API
            await ordenServico.criarOrdemServico(agendamento);

            console.log('Agendamento confirmado:', agendamento);

            // Limpar carrinho após confirmação
            // await carrinhoService.limparCarrinho(user.id);

            setShowModalConfirmacao(false);
            alert('Agendamento confirmado com sucesso!');
            navigate(ROUTES.HOME);

        } catch (error) {
            console.error('Erro ao confirmar agendamento:', error);
            alert('Erro ao confirmar agendamento. Tente novamente.');
        } finally {
            setLoadingConfirmacao(false);
        }
    };

    const cancelarConfirmacao = () => {
        setShowModalConfirmacao(false);
    };

    if (!veiculoSelecionado) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-96">
                    <div className="text-center">
                        <i className="bi bi-car-front text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-600">Carregando dados do agendamento...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <Breadcrumb items={breadcrumbItems} />

            <div className="agendamento-container">
                <div className="agendamento-content">
                    {/* Calendário */}
                    <div className="agendamento-main">
                        <div className="agendamento-header">
                            <h1 className="agendamento-title">Escolha a data e horário</h1>
                            <p className="agendamento-subtitle">
                                Selecione quando deseja receber o serviço
                            </p>
                        </div>

                        <div className="calendario-wrapper">
                            <Calendario
                                onDateSelect={handleDateSelect}
                                onTimeSelect={handleTimeSelect}
                                selectedDate={dataSelecionada}
                                selectedTime={horarioSelecionado}
                            />
                        </div>
                    </div>

                    {/* Resumo do Pedido */}
                    <div className="resumo-pedido">
                        <div className="resumo-header">
                            <h2 className="resumo-title">Resumo do agendamento</h2>
                        </div>

                        <div className="resumo-content">
                            {/* Veículo */}
                            <div className="veiculo-selecionado">
                                <div className="veiculo-info">
                                    <h4>
                                        <i className="bi bi-car-front mr-2"></i>
                                        {veiculoSelecionado.marca} {veiculoSelecionado.modelo}
                                    </h4>
                                    <div className="veiculo-detalhes">
                                        <span>{veiculoSelecionado.ano}</span>
                                        <span>•</span>
                                        <span>{veiculoSelecionado.cor}</span>
                                        <span>•</span>
                                        <span>{veiculoSelecionado.placa}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Data e Horário */}
                            {dataSelecionada && horarioSelecionado && (
                                <div className="agendamento-info">
                                    <h4>
                                        <i className="bi bi-calendar-check mr-2"></i>
                                        Data e Horário
                                    </h4>
                                    <p className="font-medium">
                                        {formatarData(dataSelecionada)} às {horarioSelecionado}
                                    </p>
                                </div>
                            )}

                            {/* Serviços */}
                            <div className="servicos-lista">
                                <h4 className="font-semibold mb-3 text-gray-800">Serviços</h4>
                                {servicosCarrinho && servicosCarrinho.map(servico => (
                                    <div key={servico.id} className="servico-item">
                                        <span className="servico-nome">{servico.nome}</span>
                                        <span className="servico-preco">R$ {servico.preco.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="total-agendamento">
                                <div className="servico-nome">Valor mínimo:</div>
                                <div className="servico-preco text-2xl">
                                    R$ {calcularTotal().toFixed(2).replace('.', ',')}
                                </div>
                            </div>
                        </div>

                        <div className="resumo-footer">
                            <button
                                className="btn-confirmar"
                                onClick={abrirModalConfirmacao}
                                disabled={!dataSelecionada || !horarioSelecionado}
                            >
                                Confirmar Agendamento
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Modal de Confirmação */}
            <ModalConfirmacao
                isOpen={showModalConfirmacao}
                onClose={cancelarConfirmacao}
                onConfirm={confirmarAgendamento}
                titulo="Confirmar Agendamento"
                tipo="success"
                icone="bi bi-calendar-check"
                textoBotaoConfirmar="Confirmar"
                textoBotaoCancelar="Cancelar"
                loading={loadingConfirmacao}
            >
                <div style={{ textAlign: 'left' }}>
                    <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <h4 style={{
                            margin: '0 0 0.5rem 0',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>
                            <i className="bi bi-car-front" style={{ marginRight: '0.5rem' }}></i>
                            Veículo
                        </h4>
                        <p style={{
                            margin: '0',
                            color: '#475569',
                            fontSize: '0.875rem'
                        }}>
                            {veiculoSelecionado.marca} {veiculoSelecionado.modelo} - {veiculoSelecionado.ano}
                        </p>
                    </div>

                    {dataSelecionada && horarioSelecionado && (
                        <div style={{
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <h4 style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#0c4a6e'
                            }}>
                                <i className="bi bi-calendar-check" style={{ marginRight: '0.5rem' }}></i>
                                Data e Horário
                            </h4>
                            <p style={{
                                margin: '0',
                                color: '#0369a1',
                                fontSize: '0.875rem'
                            }}>
                                {formatarData(dataSelecionada)} às {horarioSelecionado}
                            </p>
                        </div>
                    )}

                    <div style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <h4 style={{
                            margin: '0 0 0.75rem 0',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#14532d'
                        }}>
                            <i className="bi bi-list-check" style={{ marginRight: '0.5rem' }}></i>
                            Serviços ({servicosCarrinho.length})
                        </h4>

                        {servicosCarrinho.map((servico, index) => (
                            <div key={servico.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.875rem',
                                color: '#166534',
                                paddingBottom: index < servicosCarrinho.length - 1 ? '0.5rem' : '0',
                                marginBottom: index < servicosCarrinho.length - 1 ? '0.5rem' : '0',
                                borderBottom: index < servicosCarrinho.length - 1 ? '1px solid #dcfce7' : 'none'
                            }}>
                                <span>{servico.nome}</span>
                                <span style={{ fontWeight: '600' }}>
                                    R$ {servico.preco.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        ))}

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '0.75rem',
                            paddingTop: '0.75rem',
                            borderTop: '2px solid #16a34a',
                            fontSize: '1rem',
                            fontWeight: '700',
                            color: '#14532d'
                        }}>
                            <span>Total Mínimo:</span>
                            <span>R$ {calcularTotal().toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>

                    <p style={{
                        marginTop: '1rem',
                        fontSize: '0.875rem',
                        color: '#64748b',
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}>
                        Tem certeza que deseja confirmar este agendamento?
                    </p>
                </div>
            </ModalConfirmacao>
        </>
    );
}