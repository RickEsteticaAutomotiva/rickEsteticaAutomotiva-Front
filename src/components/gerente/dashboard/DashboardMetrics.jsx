import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { DashboardService } from "../../../services/DashboardService";

const dashboardService = new DashboardService();

export function DashboardMetrics() {
  const [data, setData] = useState({
    faturamento: 0,
    faturamentoPercent: 0,
    faturamentoTrend: "up",
    agendamentos: 0,
    agendamentosPercent: 0,
    agendamentosTrend: "up",
    servicosPercent: 0,
    servicosVariação: 0,
    servicosTrend: "up",
    ticketMedio: 0,
    ticketPercent: 0,
    ticketTrend: "up",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [
          faturamentoRes,
          totalOrdensRes,
          servicosConcluidosRes,
          ticketMedioRes
        ] = await Promise.all([
          dashboardService.faturamento(),
          dashboardService.totalOrdens(),
          dashboardService.servicosConcluidos(),
          dashboardService.ticketMedio()
        ]);
        console.log(ticketMedioRes)

        setData({
          faturamento: faturamentoRes.faturamentoAtual || 0,
          faturamentoPercent: faturamentoRes.variacaoPercentual || 0,
          faturamentoTrend: faturamentoRes.variacaoPercentual >= 0 ? "up" : "down",

          agendamentos: totalOrdensRes.totalOrdens || 0,
          agendamentosPercent: totalOrdensRes.variacaoPercentual || 0,
          agendamentosTrend: totalOrdensRes.variacaoPercentual >= 0 ? "up" : "down",

          servicosConcluidos: servicosConcluidosRes.totalOrdensConcluidas || 0,
          servicosVariação: servicosConcluidosRes.variacaoPercentual || 0,
          servicosTrend: servicosConcluidosRes.variacaoPercentual >= 0 ? "up" : "down",

          ticketMedio: ticketMedioRes.totalTicketMedioMesAtual || 0,
          ticketPercent: ticketMedioRes.variacaoPercentual || 0,
          ticketTrend: ticketMedioRes.variacaoPercentual >= 0 ? "up" : "down",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Carregando KPIs...</p>;
  if (error) return <p>Erro ao carregar KPIs: {error}</p>;

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
        title="Serv. Concluídos"
        value={`${data.servicosConcluidos}`}
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
