import { Link } from "react-router-dom";
import "./CardServico.css";

export function CardServico({ id, nome, preco, imagem }) {
    return (
        <Link to={`/servico/${id}`} className="card-servico">
            {imagem ? (
                <img 
                    src={`https://via.placeholder.com/150?text=${nome}`} 
                    alt={nome} 
                    className="card-imagem" 
                />
            ) : (
                <div className="card-placeholder">
                    <i className="bi bi-gear text-4xl text-gray-400"></i>
                </div>
            )}
            
            <h2 className="card-titulo">{nome}</h2>
            <span className="card-preco-label">A partir de</span>
            <p className="card-preco">R$ {preco.toFixed(2).replace('.', ',')}</p>
        </Link>
    );
}