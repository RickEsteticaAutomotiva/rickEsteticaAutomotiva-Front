import { Link } from "react-router-dom";
import "./CardServico.css";

export function CardServico({ id, nome, preco, imagem }) {
    return (
        <>
            <Link to={`/servico/${id}`} key={id} className="bg-white p-4 w-59 rounded shadow hover:shadow-lg transition-shadow">
            {imagem ? (
                <img src={`https://via.placeholder.com/150?text=${nome}`} alt={nome} className="mb-3 bg-amber-400 h-60 w-full rounded object-cover" />
            ) : (
                <div className="mb-3 bg-gray-200 h-60 w-full rounded flex items-center justify-center">
                    <i className="bi bi-gear text-4xl text-gray-400"></i>
                </div>
            )}
                
                <h2 className="text-lg font-semibold mb-3">{nome}</h2>

                <span className="text-gray-500">A partir de</span>
                <p className="text-2xl font-semibold">R$ {preco.toFixed(2)}</p>
            </Link>
        </>
    );
}