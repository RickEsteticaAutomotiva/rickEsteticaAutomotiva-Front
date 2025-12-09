import CancelamentosChart from "../../../components/gerente/dashboard/CancelamentosChart";
import { DashboardMetrics } from "../../../components/gerente/dashboard/DashboardMetrics"
import FaturamentoChart from "../../../components/gerente/dashboard/FaturamentoChart";
import FaturamentoServicos from "../../../components/gerente/dashboard/FaturamentoServicos";
import FluxoDeCaixa from "../../../components/gerente/dashboard/FluxoDeCaixa";

export function Dashboard() {

    return (
        <>
            <DashboardMetrics/>
            <FaturamentoChart/>
            <FluxoDeCaixa/>
            <FaturamentoServicos/>
            <CancelamentosChart/>
        </>
    )
}