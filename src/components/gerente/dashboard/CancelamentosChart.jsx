import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { DashboardService } from "../../../services/DashboardService";
import { useDashboardRefresh } from "../../../pages/gerente/dashboard/DashboardRefreshContext";
import { useToast } from '../../../context/ToastContext';
import { TiposToast } from '../../../utils/enum/TiposToast';
import { InfoTooltip } from "../../info-tooltip/InfoTooltip";

const cancelamentosInfo = 'Mês atual';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const formatTipo = (tipo) => {
  if (typeof tipo !== "string" || !tipo.trim()) {
    return "Nao informado";
  }

  return tipo
    .toLowerCase()
    .split('_')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');
};

export default function CancelamentosChart() {
  const dashboardService = new DashboardService();
  const { mostrarToast } = useToast();

  // ⬇ pega o sinal global de atualização
  const { refreshKey } = useDashboardRefresh();

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchCancelamentos = async () => {
      try {
        const cancelamentos = await dashboardService.buscarCancelamentos();

        const colors = [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
          "rgb(199, 199, 199)",
          "rgb(255, 99, 71)",
          "rgb(60, 179, 113)",
          "rgb(255, 215, 0)"
        ];

        setChartData({
          labels: cancelamentos.map(c => formatTipo(c.tipo)),
          datasets: [
            {
              data: cancelamentos.map(c => c.quantidade),
              backgroundColor: colors.slice(0, cancelamentos.length),
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        mostrarToast({
          tipo: TiposToast.ERRO,
          titulo: 'Erro ao carregar cancelamentos',
          mensagem: 'Não foi possível buscar os dados de cancelamentos.',
          duracao: 4000
        });
      }
    };

    fetchCancelamentos();
  }, [refreshKey]); 
  // ⬆ toda vez que refreshKey mudar → o gráfico atualiza

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data
            .reduce((a, b) => a + b, 0);
          return `${((value / total) * 100).toFixed(1)}%`;
        },
        font: { weight: "bold", size: 14 },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
      <div className="mb-6 flex items-center justify-center gap-1">
        <h2 className="text-xl font-semibold text-center">
          Motivos de cancelamentos
        </h2>
        <InfoTooltip message={cancelamentosInfo} />
      </div>

      <div className="h-72 sm:h-80">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
