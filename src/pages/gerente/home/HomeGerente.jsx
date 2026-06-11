import { useCallback, useEffect, useState } from "react";
import { Calendar, BanknoteArrowUp, ChartNoAxesColumnIncreasing , Star, Clock } from "lucide-react";
import { CardLargo } from "../../../components/gerente/card/card-largo/CardLargo";
import { CardMedio } from "../../../components/gerente/card/card-medio/CardMedio";
import { DashboardService } from "../../../services/DashboardService";
import { formatarHorario } from "../../../utils";

export function HomeGerente(){
    const dashboardService = new DashboardService();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumo, setResumo] = useState({
        agendamentosHoje: 0,
        faturamentoEstimadoHoje: 0,
        ticketMedioEstimadoHoje: 0,
        proximoAgendamento: null,
    });

    const formatCurrency = (valor) =>
        Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const obterHoraProximoAgendamento = (agendamento) => {
        if (!agendamento) return "--:--";
        if (agendamento.hora) return agendamento.hora;

        if (agendamento.dataHora) {
            return formatarHorario(agendamento.dataHora);
        }

        return "--:--";
    };

    const fetchResumo = useCallback(async () => {
        try {
            setLoading(true);
            const response = await dashboardService.homeResumo();

            setResumo({
                agendamentosHoje: Number(response?.agendamentosHoje || 0),
                faturamentoEstimadoHoje: Number(response?.faturamentoEstimadoHoje || 0),
                ticketMedioEstimadoHoje: Number(response?.ticketMedioEstimadoHoje || 0),
                proximoAgendamento: response?.proximoAgendamento || null,
            });

            setError(null);
        } catch (err) {
            setError(err?.message || "Erro ao carregar resumo da home");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResumo();
    }, [fetchResumo]);

    if (loading) {
        return <p className="text-center py-6">Carregando...</p>;
    }

    if (error) {
        return <p className="text-center py-6 text-red-600">{error}</p>;
    }

    const proximoServico = resumo.proximoAgendamento?.servico || "Sem serviço para hoje";
    const proximoHorario = obterHoraProximoAgendamento(resumo.proximoAgendamento);
    const clienteNome = resumo.proximoAgendamento?.clienteNome || "Sem cliente";
    const veiculoDescricao = resumo.proximoAgendamento?.veiculoDescricao || "Sem veiculo";

    return(
        <>
            <div className="mt-4">
                <CardLargo text={`${resumo.agendamentosHoje} Agendamentos hoje`} icon={Calendar} />
            </div>

            <div className="flex flex-row gap-4 mb-6 items-stretch">
                <CardMedio valor={formatCurrency(resumo.faturamentoEstimadoHoje)} label="Faturamento estimado hoje" icon={BanknoteArrowUp} />
                <CardMedio valor={formatCurrency(resumo.ticketMedioEstimadoHoje)} label="Ticket medio estimado" icon={ChartNoAxesColumnIncreasing} />
            </div>

            <CardLargo text={proximoServico} icon={Star} />

            <div className="flex gap-4 mb-6">
                <CardMedio valor={proximoHorario} label="Proximo horario" icon={Clock} />
                <CardMedio valor={clienteNome} label={`Cliente - ${veiculoDescricao}`} />
            </div>
        </>
    )
}