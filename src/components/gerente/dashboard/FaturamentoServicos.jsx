import { useEffect, useState } from "react";
import { DashboardService } from "../../../services/DashboardService";
import { useDashboardRefresh } from "../../../pages/gerente/dashboard/DashboardRefreshContext";
import { useToast } from '../../../context/ToastContext';
import { TiposToast } from '../../../utils/enum/TiposToast';
import { InfoTooltip } from "../../info-tooltip/InfoTooltip";

const servicosInfo = 'Mês atual';

export default function FaturamentoServicos() {
  const { refreshKey } = useDashboardRefresh();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mostrarToast } = useToast();
  const dashboardService = new DashboardService();

  useEffect(() => {
    async function buscarFaturamento() {
      try {
        const response = await dashboardService.faturamentoPorServico();
        // Transformando o array de categorias em array de serviços
        const dadosPlano = response.flatMap((categoria) =>
          (categoria.servicos || []).map((s) => ({
            nome: s.servico,
            categoria: categoria.categoria,
            faturamento: s.faturamento,
          }))
        );

        // Agrupando por categoria
        const dadosAgrupados = Object.values(
          dadosPlano.reduce((acc, s) => {
            if (!acc[s.categoria]) {
              acc[s.categoria] = { categoria: s.categoria, totalCategoria: 0, servicos: [] };
            }
            acc[s.categoria].servicos.push({ nome: s.nome, faturamento: s.faturamento });
            acc[s.categoria].totalCategoria += s.faturamento;
            return acc;
          }, {})
        );

        setCategorias(dadosAgrupados);
      } catch (error) {
        mostrarToast({
          tipo: TiposToast.ERRO,
          titulo: 'Erro ao carregar faturamento',
          mensagem: 'Não foi possível buscar os dados de faturamento.',
          duracao: 4000
        });
      } finally {
        setLoading(false);
      }
    }

    buscarFaturamento();
  }, [refreshKey]);

  if (loading) {
    return <p className="text-center p-6">Carregando...</p>;
  }

  return (
    <div className="flex justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-2xl">
        <div className="mb-4 flex items-center gap-1">
          <h2 className="text-xl font-semibold text-gray-900">
            Faturamento por serviço
          </h2>
          <InfoTooltip message={servicosInfo} />
        </div>

        <div className="w-full mb-6">
          <select
            disabled
            defaultValue="ultimos-30-dias"
            className="w-full p-3 rounded-xl border border-gray-300 text-gray-700 bg-white"
          >
            <option value="ultimos-30-dias">Ultimos 30 dias</option>
          </select>
        </div>

        <div className="space-y-6">
          {categorias.map((c, idx) => (
            <div key={idx} className="pb-4 border-b last:border-b-0">
              {/* Categoria e total da categoria */}
              <div className="flex justify-between mb-2">
                <h3 className="text-gray-800 font-semibold">{c.categoria}</h3>
                <p className="text-gray-900 font-semibold">
                  R${c.totalCategoria.toFixed(2)}
                </p>
              </div>

              {/* Serviços */}
              <div className="space-y-1">
                {c.servicos.map((s, i) => (
                  <div key={i} className="flex justify-between text-gray-600">
                    <p>{s.nome}</p>
                    <p>R${s.faturamento.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
