import "./CategoriasMenu.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CategoriaService } from "../../../services/CategoriaService";

export function CategoriasMenu() {
    const [menuCategoriaAberto, setMenuCategoriaAberto] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const categoriaService = new CategoriaService();

    useEffect(() => {
        buscarCategorias();
    }, []);

    const abrirMenuCategoria = () => {
        setMenuCategoriaAberto(true);
    }

    const fecharMenuCategoria = () => {
        setMenuCategoriaAberto(false);
    }

    const buscarCategorias = async () => {
        try {
            const data = await categoriaService.buscarTodas();
            setCategorias(data);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    }

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
                            {categorias && categorias.map((categoria) => (
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