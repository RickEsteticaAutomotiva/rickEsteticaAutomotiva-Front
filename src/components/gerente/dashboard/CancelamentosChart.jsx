import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CancelamentosChart() {
  const data = {
    labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
    datasets: [
      {
        data: [12, 10, 8, 15, 20],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)"
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold text-center mb-6">
        Motivos de cancelamentos
      </h2>

      <div className="h-72 sm:h-80">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
