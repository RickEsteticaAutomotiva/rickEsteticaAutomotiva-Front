import { useEffect, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { DashboardService } from "../../../services/DashboardService";
import { useDashboardRefresh } from "../../../pages/gerente/dashboard/DashboardRefreshContext";

const dashboardService = new DashboardService();

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function FaturamentoChart() {
  const { refreshKey } = useDashboardRefresh();

  const [state, setState] = useState({
    labels: [],
    valores: [],
    ano: "",
  });

  const [error, setError] = useState(null);

  const getDataRegistro = (item) => item?.data ?? item?.dia ?? item?.dataFaturamento ?? null;

  const fetchData = useCallback(async () => {
    try {
      const response = await dashboardService.faturamentoPeriodo();
      const registros = Array.isArray(response) ? response : [];

      const registrosValidos = registros
        .map((item) => ({
          ...item,
          dataRegistro: getDataRegistro(item),
        }))
        .filter((item) => typeof item.dataRegistro === "string" && item.dataRegistro.includes("-"));

      registrosValidos.sort((a, b) => new Date(a.dataRegistro) - new Date(b.dataRegistro));

      const ano = registrosValidos.length > 0
        ? String(registrosValidos[0].dataRegistro).split("-")[0]
        : "";

      const labels = registrosValidos.map((item) => {
        const [, m, d] = String(item.dataRegistro).split("-");
        return `${d}/${m}`;
      });

      const valores = registrosValidos.map((item) => item.faturamentoDiario ?? 0);

      setState({ labels, valores, ano });
      setError(null);

    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Atualiza quando refreshKey muda
  useEffect(() => {
    fetchData();
  }, [refreshKey, fetchData]);

  if (error) return <p>Erro ao carregar gráfico: {error}</p>;

  const data = {
    labels: state.labels,
    datasets: [
      {
        label: state.ano || "Faturamento",
        data: state.valores,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: { grid: { color: "#eee" } },
      x: {
        grid: { display: false },
        ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
      <h2 className="text-xl font-semibold mb-4">Faturamento Diário</h2>

      <div className="h-64 sm:h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
