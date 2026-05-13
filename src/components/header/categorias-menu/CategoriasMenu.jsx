import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { categoriaService } from "../../../services/CategoriaService";
import { useToast } from '../../../context/ToastContext';
import { TiposToast } from '../../../utils/enum/TiposToast';

export function CategoriasMenu() {
    const [menuCategoriaAberto, setMenuCategoriaAberto] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const { mostrarToast } = useToast();

    useEffect(() => {
        buscarCategorias();
    }, []);

    const abrirMenuCategoria = () => {
        setMenuCategoriaAberto(true);
        document.body.classList.add('no-scroll');
    };

    const fecharMenuCategoria = () => {
        setMenuCategoriaAberto(false);
        document.body.classList.remove('no-scroll');
    };

    const buscarCategorias = async () => {
        try {
            const data = await categoriaService.buscarTodas();
            setCategorias(data);
        } catch {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Menu indisponível',
                mensagem: 'Não foi possível carregar as categorias.',
                duracao: 3000
            });
        }
    };

    return (
        <>
            <div
                className="text-white flex items-center gap-2 cursor-pointer select-none flex-shrink-0"
                onClick={abrirMenuCategoria}
            >
                <i className="bi bi-grid ml-3"></i>
                <span className="hidden sm:inline">Categorias</span>
            </div>

            {menuCategoriaAberto && (
                <div
                    className="fixed inset-0 w-screen h-screen bg-black/50 z-[1000] flex justify-start items-stretch"
                    onClick={fecharMenuCategoria}
                >
                    <div
                        className="w-[90%] sm:w-80 h-screen bg-white shadow-[2px_0_10px_rgba(0,0,0,0.1)] flex flex-col animate-[slide-in-left_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-red-600">Categorias</h2>
                            <button
                                onClick={fecharMenuCategoria}
                                className="cursor-pointer text-gray-500 hover:text-gray-700 p-1"
                            >
                                <i className="bi bi-x-lg text-2xl"></i>
                            </button>
                        </div>

                        <div className="flex-1 py-4 overflow-y-auto">
                            {categorias && categorias.map((categoria) => (
                                <Link
                                    key={categoria.id}
                                    to={`/busca?pesquisa=${categoria.nome}`}
                                    className="flex items-center justify-between px-6 py-4 text-gray-700 no-underline transition-colors hover:bg-gray-50 gap-4 font-medium"
                                    onClick={fecharMenuCategoria}
                                >
                                    <span className="flex-1">{categoria.nome}</span>
                                    <i className="bi bi-chevron-right text-gray-400 text-sm"></i>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}