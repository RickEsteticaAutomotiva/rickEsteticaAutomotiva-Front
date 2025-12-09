import { useEffect, useState } from "react";
import { DashboardService } from "../../../services/DashboardService";


export default function FluxoDeCaixa({ mes = 12, ano = 2025 }) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dashboardService = new DashboardService();


  // Função para buscar dados
  const fetchFluxoCaixa = async () => {
    try {
      setLoading(true);
        const caixa = await dashboardService.fluxoCaixa();
      setDados(caixa); // assumindo que os dados estão em response.data
    } catch (err) {
      setError(err.message || "Erro ao buscar fluxo de caixa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFluxoCaixa();
  }, [mes, ano]);

  if (loading) return <p className="text-center py-6">Carregando...</p>;
  if (error) return <p className="text-center py-6 text-red-600">{error}</p>;

  const total = dados?.total || 0;
  const lucro = dados?.lucro || 0;
  const custo = dados?.custo || 0;

  const pctLucro = dados?.percentualLucro || 0;
  const pctCusto = dados?.percentualCusto || 0;

  return (
    <div className="flex justify-center py-6 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-2xl">

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Fluxo de caixa</h2>
        </div>

        {/* Valor total */}
        <p className="text-2xl font-semibold text-gray-900">
          R${total.toLocaleString("pt-BR")},00
        </p>

        {/* Percentual */}
        <p className={`text-sm mt-1 ${pctLucro >= 0 ? "text-green-600" : "text-red-600"}`}>
          {pctLucro >= 0 ? `+${pctLucro}%` : `${pctLucro}%`} vs último mês
        </p>

        {/* Barra de progresso */}
        <div className="w-full h-4 bg-red-200 rounded-full mt-4 relative">
          <div
            className="h-4 bg-red-700 rounded-full"
            style={{ width: `${pctLucro}%` }}
          ></div>
        </div>

        {/* Lista: lucro / custo */}
        <div className="mt-6 space-y-4">
          {/* Lucro */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-700"></div>
              <span className="text-gray-800">Lucro</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <span>R${lucro.toLocaleString("pt-BR")},00</span>
              <span>({pctLucro}%)</span>
            </div>
          </div>

          {/* Custo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-300"></div>
              <span className="text-gray-800">Custo</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <span>R${custo.toLocaleString("pt-BR")},00</span>
              <span>({pctCusto}%)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
