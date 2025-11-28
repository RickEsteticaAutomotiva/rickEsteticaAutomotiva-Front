import { MetricCard } from "./MetricCard";

export function DashboardMetrics({ data }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      <MetricCard
        title="Faturamento"
        value={`R$${data.faturamento}`}
        percent={data.faturamentoPercent}
        trend={data.faturamentoTrend}
      />

      <MetricCard
        title="Agendamentos"
        value={data.agendamentos}
        percent={data.agendamentosPercent}
        trend={data.agendamentosTrend}
      />

      <MetricCard
        title="% Serv. Concluídos"
        value={`${data.servicosPercent}%`}
        percent={data.servicosVariação}
        trend={data.servicosTrend}
      />

      <MetricCard
        title="Ticket Médio"
        value={`R$${data.ticketMedio}`}
        percent={data.ticketPercent}
        trend={data.ticketTrend}
      />
    </div>
  );
}
