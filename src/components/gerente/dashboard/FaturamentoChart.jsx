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

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function FaturamentoChart() {
  const labels = ["Jun","Jul", "Ago", "Set", "Out", "Nov"];

  const data = {
    labels,
    datasets: [
      {
        label: "2025",
        data: [80, 120, 90, 140, 160, 180],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "2024",
        data: [70, 100, 85, 110, 130, 150],
        borderColor: "rgb(99, 132, 255)",
        backgroundColor: "rgba(99, 132, 255, 0.2)",
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: "#eee" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
      <h2 className="text-xl font-semibold mb-4">Faturamento</h2>

      <div className="h-64 sm:h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
