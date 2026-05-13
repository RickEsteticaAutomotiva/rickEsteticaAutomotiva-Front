import { Link } from "react-router-dom";
import { formatarPreco } from "../../utils/index";

export function CardServico({ id, nome, preco, imagem }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all flex flex-col h-full w-full hover:-translate-y-1 hover:shadow-md">
            <Link to={`/servico/${id}`} className="no-underline text-inherit flex flex-col h-full p-4">
                {imagem ? (
                    <img
                        src={imagem}
                        alt={nome}
                        className="w-full h-48 sm:h-44 object-cover bg-gray-100 rounded-xl"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className={`w-full h-48 sm:h-44 bg-gray-200 items-center justify-center rounded-xl ${
                        imagem ? 'hidden' : 'flex'
                    }`}
                >
                    <i className="bi bi-gear text-5xl text-gray-400"></i>
                </div>

                <div className="flex-1 flex flex-col mt-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 leading-snug line-clamp-2">
                        {nome}
                    </h2>

                    <div className="mt-auto">
                        <span className="text-sm text-gray-500 mb-1 block">A partir de</span>
                        <p className="text-2xl font-bold text-gray-800 m-0">{formatarPreco(preco)}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}