import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "./Footer.css";
import logo from "../../assets/rick_logo.png";

export function Footer() {
    const anoAtual = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const habilitaTudo = () => {
        if (window.location.pathname === ROUTES.VEICULOS || window.location.pathname === ROUTES.AGENDAMENTO || window.location.pathname === ROUTES.PERFIL) {
            return false;
        }
        return true;
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                {habilitaTudo() && (
                    <div className="footer-content">
                        <div className="footer-column">
                            <div className="footer-logo">
                                <img src={logo} alt="Rick Estética Automotiva" />
                            </div>
                            <p className="footer-description">
                                Especialistas em estética automotiva com anos de experiência.
                                Oferecemos serviços de qualidade premium para manter seu veículo sempre impecável.
                            </p>

                        </div>

                        <div className="footer-column">
                            <h3 className="footer-title">Redes Sociais</h3>
                            <div className="social-links">
                                <a href="https://instagram.com/rickestética" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a href="https://facebook.com/rickestética" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            </div>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-title">Nossos Serviços</h3>
                            <ul className="footer-links">
                                <li>
                                    <Link to="/busca?pesquisa=lavagem" onClick={scrollToTop}>
                                        <i className="bi bi-droplet mr-2"></i>
                                        Lavagem
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/busca?pesquisa=polimentos" onClick={scrollToTop}>
                                        <i className="bi bi-brush mr-2"></i>
                                        Polimentos
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/busca?pesquisa=higienizacao" onClick={scrollToTop}>
                                        <i className="bi bi-shield-check mr-2"></i>
                                        Higienização
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/busca?pesquisa=vitrificacao" onClick={scrollToTop}>
                                        <i className="bi bi-gem mr-2"></i>
                                        Vitrificação
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/busca?pesquisa=protecao" onClick={scrollToTop}>
                                        <i className="bi bi-shield-fill mr-2"></i>
                                        Proteções
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-title">Contato</h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <i className="bi bi-geo-alt"></i>
                                    <div>
                                        <strong>Endereço:</strong>
                                        <p>R. Alcatifa, 81<br />São Paulo, SP - 03583-030</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <i className="bi bi-telephone"></i>
                                    <div>
                                        <strong>Telefone:</strong>
                                        <p>
                                            <a href="tel:+5511999999999">(11) 99999-9999</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <i className="bi bi-envelope"></i>
                                    <div>
                                        <strong>E-mail:</strong>
                                        <p>
                                            <a href="mailto:contato@rickestetica.com.br">contato@rickestetica.com.br</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <i className="bi bi-clock"></i>
                                    <div>
                                        <strong>Horário:</strong>
                                        <p>Seg-Sex: 8h30 às 17h30<br />Sáb: 9h às 13h</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Seção inferior */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <div className="copyright">
                            <p>&copy; {anoAtual} Rick Estética Automotiva. Todos os direitos reservados.</p>
                        </div>
                        <div className="legal-links">
                            <Link to="/politica-privacidade">Política de Privacidade</Link>
                            <span className="separator">|</span>
                            <Link to="/termos-uso">Termos de Uso</Link>
                            <span className="separator">|</span>
                            <Link to="/cookies">Cookies</Link>
                        </div>
                        {/* <div className="payment-methods">
                            <span>Formas de pagamento:</span>
                            <div className="payment-icons">
                                <i className="bi bi-credit-card" title="Cartão de Crédito"></i>
                                <i className="bi bi-credit-card-2-back" title="Cartão de Débito"></i>
                                <i className="bi bi-cash" title="Dinheiro"></i>
                                <i className="bi bi-qr-code" title="PIX"></i>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}