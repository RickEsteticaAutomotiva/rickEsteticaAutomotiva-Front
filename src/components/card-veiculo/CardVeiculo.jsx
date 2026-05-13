export function CardVeiculo({ veiculo, compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? 'p-2' : 'p-4'}`}>
      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl text-gray-500 flex-shrink-0">
        <i className="bi bi-car-front text-lg"></i>
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-gray-800 truncate">
          {veiculo.marca} {veiculo.modelo}
        </h4>
        <div className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
          <span>{veiculo.ano}</span>
          <span>•</span>
          <span>{veiculo.cor}</span>
          <span>•</span>
          <span>{veiculo.placa}</span>
        </div>
      </div>
    </div>
  );
}