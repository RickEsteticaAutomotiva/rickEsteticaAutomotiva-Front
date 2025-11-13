import { Link } from "react-router-dom";
import { PerfilDropdown } from "./perfil-dropdown/PerfilDropdown";
import { CategoriasMenu } from "./categorias-menu/CategoriasMenu";
import { InputPesquisa } from "./input-pesquisa/InputPesquisa";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/Routes";

import "./Header.css";
import logo from "../../assets/rick_logo.png";
import { FavoritosDropdown } from "./favoritos-dropdown/FavoritosDropdown";

export function Header() {
    const { isAuthenticated } = UseAuth();

    const habilitaPesquisa = () => {
        if (window.location.pathname === ROUTES.LOGIN || window.location.pathname === ROUTES.CADASTRAR || window.location.pathname === ROUTES.VEICULOS) {
            return false;
        }
        return true;
    }

    return (
        <>
            <header className="w-full h-20 py-3.5 px-16 flex justify-between shadow" style={{backgroundColor: '#B30000'}}>
                <Link className="cursor-pointer" to={ROUTES.HOME}>
                    <img src={logo} alt="Rick Logo" className="h-full" />
                </Link>

                {habilitaPesquisa() && (
                    <div className="flex h-full items-center gap-3">
                        <InputPesquisa />

                        <CategoriasMenu />
                    </div>
                )}

                <div className="flex h-full gap-7 items-center text-white">
                    {!isAuthenticated() && (
                        <div className="flex gap-5 h-full items-center">
                            <Link className="cursor-pointer" to={ROUTES.CADASTRAR}>Cadastrar</Link>
                            <span className="border h-2/3 border-white"></span>
                            <Link className="cursor-pointer" to={ROUTES.LOGIN}>Entrar</Link>
                        </div>
                    )}

                    {isAuthenticated() && <PerfilDropdown />}

                    {isAuthenticated() && habilitaPesquisa() && <FavoritosDropdown />}

                    {habilitaPesquisa() && (<Link className="cursor-pointer" to={isAuthenticated() ? ROUTES.CARRINHO : ROUTES.LOGIN}>
                        <i className="bi bi-cart3"></i>
                    </Link>)}
                </div>
            </header>
        </>
    );
}