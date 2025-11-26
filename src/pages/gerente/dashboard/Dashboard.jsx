import CancelamentosChart from "../../../components/gerente/dashboard/CancelamentosChart";
import { DashboardMetrics } from "../../../components/gerente/dashboard/DashboardMetrics"
import FaturamentoChart from "../../../components/gerente/dashboard/FaturamentoChart";
import FaturamentoServicos from "../../../components/gerente/dashboard/FaturamentoServicos";
import FluxoDeCaixa from "../../../components/gerente/dashboard/FluxoDeCaixa";

export function Dashboard() {
        const data = {
        faturamento: 5000,
        faturamentoPercent: 11,
        faturamentoTrend: "up",

        agendamentos: 25,
        agendamentosPercent: 11,
        agendamentosTrend: "up",

        servicosPercent: 20,
        servicosVariação: 11,
        servicosTrend: "up",

        ticketMedio: 120,
        ticketPercent: 11,
        ticketTrend: "down",
        };

    return (
        <>
            <DashboardMetrics data={data} />
            <FaturamentoChart/>
            <FluxoDeCaixa/>
            <FaturamentoServicos/>
            <CancelamentosChart/>
        </>
    )
}