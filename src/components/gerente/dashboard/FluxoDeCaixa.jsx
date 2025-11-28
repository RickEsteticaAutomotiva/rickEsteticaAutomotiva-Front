export default function FluxoDeCaixa() {
  const total = 30000;
  const lucro = 19250;
  const custo = 10750;

  return (
    <div className="flex justify-center py-6 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-md">

        {/* Título + seletor */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Fluxo de caixa</h2>

          <button className="px-4 py-1 border rounded-xl text-gray-600 flex items-center gap-1">
            Mês
            <span>▼</span>
          </button>
        </div>

        {/* Valor total */}
        <p className="text-2xl font-semibold text-gray-900">
          R${total.toLocaleString("pt-BR")},00
        </p>

        {/* Percentual */}
        <p className="text-sm text-green-600 mt-1">+2,5% vs último mês</p>

        {/* Barra de progresso */}
        <div className="w-full h-4 bg-red-200 rounded-full mt-4 relative">
          <div
            className="h-4 bg-red-700 rounded-full"
            style={{ width: `${(lucro / total) * 100}%` }}
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
              <span>({Math.round((lucro / total) * 100)}%)</span>
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
              <span>({Math.round((custo / total) * 100)}%)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
