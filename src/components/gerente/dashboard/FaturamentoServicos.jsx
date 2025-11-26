export default function FaturamentoServicos() {
    const servicos = [
        {
            nome: "Polimento",
            categoria: "Detalhamento",
            faturamento: 2000,
            lucro: 600,
        },
        {
            nome: "Lavagem simples",
            categoria: "Lavagem",
            faturamento: 2200,
            lucro: 620,
        },
        {
            nome: "Polimento",
            categoria: "Detalhamento",
            faturamento: 2000,
            lucro: 600,
        },
        {
            nome: "Lavagem simples",
            categoria: "Lavagem",
            faturamento: 2200,
            lucro: 620,
        },
    ];

    return (
        <div className="flex justify-center bg-gray-100 ">
            <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-md">

                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Faturamento e lucro p/ serviço
                </h2>

                <div className="w-full mb-6">
                    <select className="w-full p-3 rounded-xl border border-gray-300 text-gray-700 bg-white">
                        <option>Mês</option>
                        <option>Mês</option>
                        <option>Mês</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {servicos.map((s, index) => (
                        <div key={index} className="pb-4 border-b last:border-b-0">

                            <div className="flex justify-between">
                                <p className="text-gray-900 font-medium">{s.nome}</p>
                                <p className="text-gray-900 font-medium">
                                    R${s.faturamento.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-400">{s.categoria}</p>
                                <p className="text-sm text-gray-400">R${s.lucro.toFixed(2)}</p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
