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
  // const labels = ["Jun","Jul", "Ago", "Set", "Out", "Nov"];
  // const labels = [];

  const labels = Array.from({ length: 7 }, (_, i) => (i + 1).toString());

  const data = {
    labels,
    datasets: [
      {
        label: "2025",
        data: [
          80, 85, 90, 95, 100, 110, 115, 120, 125, 130,
          135, 140, 145, 150, 155, 160, 165, 170, 168, 166,
          164, 162, 165, 170, 175, 178, 180, 182, 184, 185
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "2024",
        data: [  150, 148, 145, 142, 140, 138, 135, 132, 130, 128,
          130, 135, 140, 145, 150, 155, 158, 160, 162, 165,
          167, 170, 172, 174, 176, 178, 180, 178, 176, 174],
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
      y: { 
        grid: { color: "#eee" }
      },
      x: { 
        grid: { display: false },
        ticks: {
          autoSkip: false,   // ← não pular labels
          maxRotation: 0,    // ← evita que incline
          minRotation: 0,    // ← mantém horizontal
        }
      },
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
