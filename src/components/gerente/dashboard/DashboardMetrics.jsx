import { useEffect, useState, useCallback } from "react";
import { MetricCard } from "./MetricCard";
import { DashboardService } from "../../../services/DashboardService";
import { useDashboardRefresh } from "../../../pages/gerente/dashboard/DashboardRefreshContext";

const dashboardService = new DashboardService();

export function DashboardMetrics() {
  const { refreshKey } = useDashboardRefresh();

  const [faturamento, setFaturamento] = useState({ v: 0, p: 0, t: "up" });
  const [agendamentos, setAgendamentos] = useState({ v: 0, p: 0, t: "up" });
  const [servicos, setServicos] = useState({ v: 0, p: 0, t: "up" });
  const [ticket, setTicket] = useState({ v: 0, p: 0, t: "up" });

  const [error, setError] = useState(null);

  // 🔥 UseCallback para evitar recriações desnecessárias
  const fetchData = useCallback(async () => {
    try {
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

      setFaturamento({
        v: faturamentoRes.faturamentoAtual || 0,
        p: faturamentoRes.variacaoPercentual || 0,
        t: faturamentoRes.variacaoPercentual >= 0 ? "up" : "down"
      });

      setAgendamentos({
        v: totalOrdensRes.totalOrdens || 0,
        p: totalOrdensRes.variacaoPercentual || 0,
        t: totalOrdensRes.variacaoPercentual >= 0 ? "up" : "down"
      });

      setServicos({
        v: servicosConcluidosRes.totalOrdensConcluidas || 0,
        p: servicosConcluidosRes.variacaoPercentual || 0,
        t: servicosConcluidosRes.variacaoPercentual >= 0 ? "up" : "down"
      });

      setTicket({
        v: ticketMedioRes.totalTicketMedioMesAtual || 0,
        p: ticketMedioRes.variacaoPercentual || 0,
        t: ticketMedioRes.variacaoPercentual >= 0 ? "up" : "down"
      });

    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 🔥 Atualiza quando refreshKey muda (manual)
  useEffect(() => {
    fetchData();
  }, [refreshKey, fetchData]);

  if (error) return <p>Erro ao carregar KPIs: {error}</p>;

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      <MetricCard
        title="Faturamento"
        value={`R$${faturamento.v}`}
        percent={faturamento.p}
        trend={faturamento.t}
      />

      <MetricCard
        title="Agendamentos"
        value={agendamentos.v}
        percent={agendamentos.p}
        trend={agendamentos.t}
      />

      <MetricCard
        title="Serv. Concluídos"
        value={servicos.v}
        percent={servicos.p}
        trend={servicos.t}
      />

      <MetricCard
        title="Ticket Médio"
        value={`R$${ticket.v}`}
        percent={ticket.p}
        trend={ticket.t}
      />
    </div>
  );
}
