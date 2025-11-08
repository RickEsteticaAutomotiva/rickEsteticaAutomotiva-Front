import { Link } from "react-router-dom";
import { useState } from "react";
import { PerfilDropdown } from "./perfil-dropdown/PerfilDropdown";
import { CategoriasMenu } from "./categorias-menu/CategoriasMenu";
import { InputPesquisa } from "./input-pesquisa/InputPesquisa";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/routes";

import "./Header.css";
import logo from "../../assets/rick_logo.png";
import { FavoritosDropdown } from "./favoritos-dropdown/FavoritosDropdown";

export function Header() {
    const { isAuthenticated } = UseAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const habilitaPesquisa = () => {
        if (window.location.pathname === ROUTES.LOGIN || window.location.pathname === ROUTES.CADASTRAR || window.location.pathname === ROUTES.VEICULOS) {
            return false;
        }
        return true;
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    }

    return (
        <>
            <header className="header-container">
                {/* Desktop Header */}
                <div className="header-desktop">
                    <Link className="logo-link" to={ROUTES.HOME}>
                        <img src={logo} alt="Rick Logo" className="logo-img" />
                    </Link>

                    {habilitaPesquisa() && (
                        <div className="search-section">
                            <InputPesquisa />
                            <CategoriasMenu />
                        </div>
                    )}

                    <div className="actions-section">
                        {!isAuthenticated() && (
                            <div className="auth-links">
                                <Link className="auth-link" to={ROUTES.CADASTRAR}>Cadastrar</Link>
                                <span className="divider"></span>
                                <Link className="auth-link" to={ROUTES.LOGIN}>Entrar</Link>
                            </div>
                        )}

                        {isAuthenticated() && <PerfilDropdown />}

                        {isAuthenticated() && habilitaPesquisa() && <FavoritosDropdown />}

                        {habilitaPesquisa() && (
                            <Link className="cart-link" to={isAuthenticated() ? ROUTES.CARRINHO : ROUTES.LOGIN}>
                                <i className="bi bi-cart3"></i>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="header-mobile">
                    <div className="mobile-header-top">
                        <Link className="logo-link" to={ROUTES.HOME} onClick={closeMobileMenu}>
                            <img src={logo} alt="Rick Logo" className="logo-img" />
                        </Link>

                        <div className="mobile-actions">
                            {isAuthenticated() && habilitaPesquisa() && <FavoritosDropdown />}
                            
                            {habilitaPesquisa() && (
                                <Link className="cart-link" to={isAuthenticated() ? ROUTES.CARRINHO : ROUTES.LOGIN}>
                                    <i className="bi bi-cart3"></i>
                                </Link>
                            )}

                            <button 
                                className="mobile-menu-btn"
                                onClick={toggleMobileMenu}
                                aria-label="Menu"
                            >
                                <i className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {habilitaPesquisa() && (
                        <div className="mobile-search">
                            <InputPesquisa />
                        </div>
                    )}

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
                            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                                <div className="mobile-menu-header">
                                    <h3>Menu</h3>
                                    <button 
                                        className="mobile-menu-close"
                                        onClick={closeMobileMenu}
                                        aria-label="Fechar menu"
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>

                                <div className="mobile-menu-content">
                                    {habilitaPesquisa() && (
                                        <div className="mobile-menu-section">
                                            <CategoriasMenu />
                                        </div>
                                    )}

                                    <div className="mobile-menu-section">
                                        {isAuthenticated() ? (
                                            <PerfilDropdown />
                                        ) : (
                                            <div className="mobile-auth-links">
                                                <Link 
                                                    className="mobile-auth-link" 
                                                    to={ROUTES.CADASTRAR}
                                                    onClick={closeMobileMenu}
                                                >
                                                    <i className="bi bi-person-plus"></i>
                                                    Cadastrar
                                                </Link>
                                                <Link 
                                                    className="mobile-auth-link" 
                                                    to={ROUTES.LOGIN}
                                                    onClick={closeMobileMenu}
                                                >
                                                    <i className="bi bi-box-arrow-in-right"></i>
                                                    Entrar
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}