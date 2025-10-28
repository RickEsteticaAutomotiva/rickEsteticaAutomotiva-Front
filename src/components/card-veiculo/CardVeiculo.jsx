import './CardVeiculo.css';

export function CardVeiculo({ veiculo, compact = false }) {
  return (
    <div className={`card-veiculo ${compact ? 'compact' : ''}`}>
      <div className="veiculo-icon">
        <i className="bi bi-car-front"></i>
      </div>
      <div className="veiculo-info">
        <h4 className="veiculo-nome">
          {veiculo.marca} {veiculo.modelo}
        </h4>
        <div className="veiculo-detalhes">
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