import { Link } from "react-router-dom";
import "./CardServico.css";
import { formatarPreco } from "../../utils/index";

export function CardServico({ id, nome, preco, imagem }) {
    return (
        <div className="card-servico">
            <Link to={`/servico/${id}`} className="card-servico-link">
                {imagem ? (
                    <img 
                        src={imagem} 
                        alt={nome} 
                        className="card-servico-imagem"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="card-servico-imagem-placeholder">
                        <i className="bi bi-gear"></i>
                    </div>
                )}
                
                <div className="card-servico-content">
                    <h2 className="card-servico-titulo">{nome}</h2>
                    
                    <div>
                        <span className="card-servico-preco-label">A partir de</span>
                        <p className="card-servico-preco">{formatarPreco(preco)}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}