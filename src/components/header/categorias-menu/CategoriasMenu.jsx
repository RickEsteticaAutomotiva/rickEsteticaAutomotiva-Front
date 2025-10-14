import "./CategoriasMenu.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export function CategoriasMenu() {
    const [menuCategoriaAberto, setMenuCategoriaAberto] = useState(false);

    const abrirMenuCategoria = () => {
        setMenuCategoriaAberto(true);
    }

    const fecharMenuCategoria = () => {
        setMenuCategoriaAberto(false);
    }

    // Lista de categorias (temporária)
    const categorias = [
        { id: 1, nome: "Lavagem" },
        { id: 2, nome: "Enceramento" },
        { id: 3, nome: "Detalhamento" },
        { id: 4, nome: "Pintura" },
        { id: 5, nome: "Mecânica" },
        { id: 6, nome: "Pneus" },
        { id: 7, nome: "Insulfilm" },
        { id: 8, nome: "Som e Acessórios" }
    ];

    return (
        <>
            <div className="text-white flex gap-2 cursor-pointer" onClick={abrirMenuCategoria}>
                <i className="bi bi-grid ml-3"></i>
                <span>Categorias</span>
            </div>

            {menuCategoriaAberto && (
                <div className="sidebar-overlay" onClick={fecharMenuCategoria}>
                    <div className="sidebar-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="sidebar-header">
                            <h2 className="text-xl font-bold text-red-600">Categorias</h2>
                            <button onClick={fecharMenuCategoria} className="cursor-pointer text-gray-500 hover:text-gray-700">
                                <i className="bi bi-x-lg text-2xl"></i>
                            </button>
                        </div>

                        <div className="sidebar-content">
                            {categorias.map((categoria) => (
                                <Link
                                    key={categoria.id}
                                    to={`/busca?pesquisa=${categoria.nome}`}
                                    className="categoria-item"
                                    onClick={fecharMenuCategoria}
                                >

                                    <span>{categoria.nome}</span>
                                    <i className="bi bi-chevron-right text-gray-400"></i>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}