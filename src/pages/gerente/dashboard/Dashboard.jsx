import CancelamentosChart from "../../../components/gerente/dashboard/CancelamentosChart";
import { DashboardMetrics } from "../../../components/gerente/dashboard/DashboardMetrics"
import FaturamentoChart from "../../../components/gerente/dashboard/FaturamentoChart";
import FaturamentoServicos from "../../../components/gerente/dashboard/FaturamentoServicos";
import FluxoDeCaixa from "../../../components/gerente/dashboard/FluxoDeCaixa";
import DashboardRefreshProvider from"./DashboardRefreshContext"
export function Dashboard() {

    return (
        <DashboardRefreshProvider> 
            <DashboardMetrics/>
            <FaturamentoChart/>
            <FluxoDeCaixa/>
            <FaturamentoServicos/>
            <CancelamentosChart/>
        </DashboardRefreshProvider>    
    );
}