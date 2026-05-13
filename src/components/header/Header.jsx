import { Link, useLocation } from "react-router-dom";
import { PerfilDropdown } from "./perfil-dropdown/PerfilDropdown";
import { CategoriasMenu } from "./categorias-menu/CategoriasMenu";
import { InputPesquisa } from "./input-pesquisa/InputPesquisa";
import { useAuth } from "../../context/AuthContext";
import { useCarrinho } from "../../context/CarrinhoContext";
import { ROUTES } from "../../constants/Routes";
import logo from "../../assets/rick_logo.png";
import { FavoritosDropdown } from "./favoritos-dropdown/FavoritosDropdown";

export function Header() {
    const { isAuthenticated } = useAuth();
    const { quantidadeItens } = useCarrinho();
    const location = useLocation();

    const showSearch = location.pathname !== ROUTES.LOGIN
        && location.pathname !== ROUTES.CADASTRAR
        && location.pathname !== ROUTES.VEICULOS;

    const autenticado = isAuthenticated();

    return (
        <header className="w-full bg-[#B30000] shadow
            flex flex-col items-center gap-3 py-6 px-8
            md:flex-row md:justify-between md:h-20 md:py-3.5 md:px-16 md:gap-0">

            <Link className="cursor-pointer h-10 md:h-full flex-shrink-0" to={ROUTES.HOME}>
                <img src={logo} alt="Rick Logo" className="h-full" />
            </Link>

            {showSearch && (
                <div className="flex w-full md:w-auto md:h-full items-center gap-3 justify-center">
                    <InputPesquisa />
                    <CategoriasMenu />
                </div>
            )}

            <div className="flex gap-7 items-center text-white">
                {!autenticado && (
                    <div className="flex gap-5 items-center">
                        <Link className="cursor-pointer hover:underline" to={ROUTES.CADASTRAR}>Cadastrar</Link>
                        <span className="border h-4 border-white"></span>
                        <Link className="cursor-pointer hover:underline" to={ROUTES.LOGIN}>Entrar</Link>
                    </div>
                )}

                {autenticado && <PerfilDropdown />}
                {autenticado && showSearch && <FavoritosDropdown />}

                {showSearch && (
                    <Link className="cursor-pointer relative" aria-label="Ver carrinho" to={autenticado ? ROUTES.CARRINHO : ROUTES.LOGIN}>
                        <i className="bi bi-cart3" aria-hidden="true"></i>
                        {autenticado && quantidadeItens > 0 && (
                            <span className="absolute -top-1 -right-2 bg-white text-[#B30000] text-[10px] font-bold leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                                {quantidadeItens > 99 ? '99+' : quantidadeItens}
                            </span>
                        )}
                    </Link>
                )}
            </div>
        </header>
    );
}