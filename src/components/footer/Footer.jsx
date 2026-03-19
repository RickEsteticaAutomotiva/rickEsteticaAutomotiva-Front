import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/Routes";
import logo from "../../assets/rick_logo.png";

export function Footer() {
    const anoAtual = new Date().getFullYear();
    const location = useLocation();

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const habilitaTudo = () => {
        if (location.pathname === ROUTES.VEICULOS || location.pathname === ROUTES.AGENDAMENTO || location.pathname === ROUTES.PERFIL) {
            return false;
        }
        return true;
    };

    const linkClass = "flex items-center text-gray-300 no-underline transition-all text-sm hover:text-[#B30000] hover:translate-x-1";
    const socialClass = "flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full text-white no-underline transition-all text-lg hover:bg-[#B30000] hover:-translate-y-0.5 hover:shadow-lg";
    const contactIconClass = "text-[#B30000] text-xl flex-shrink-0 mt-0.5";

    return (
        <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white relative mt-auto">
            <div className="max-w-screen-xl mx-auto relative">

                {/* Botão voltar ao topo */}
                <button
                    onClick={scrollToTop}
                    className="absolute -top-6 right-4 md:right-8 w-[50px] h-[50px] bg-[#B30000] text-white border-none rounded-full cursor-pointer transition-all shadow-lg flex items-center justify-center text-xl hover:bg-[#990000] hover:-translate-y-0.5"
                    aria-label="Voltar ao topo"
                >
                    <i className="bi bi-arrow-up"></i>
                </button>

                {habilitaTudo() && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-8 md:gap-12 px-4 md:px-8 pt-12 pb-8">

                        {/* Coluna 1 — Logo + descrição */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <img src={logo} alt="Rick Estética Automotiva" className="h-[60px] w-auto" />
                            </div>
                            <p className="text-gray-300 leading-relaxed mb-8 text-sm">
                                Especialistas em estética automotiva com anos de experiência.
                                Oferecemos serviços de qualidade premium para manter seu veículo sempre impecável.
                            </p>
                            <div className="flex gap-3">
                                <a href="https://instagram.com/rick_estetica_automotiva" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialClass}>
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a href="https://wa.me/5511966594782" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={socialClass}>
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            </div>
                        </div>

                        {/* Coluna 2 — Serviços */}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-[#B30000] pb-2 w-fit">Nossos Serviços</h3>
                            <ul className="list-none m-0 p-0 flex flex-col gap-3">
                                {[
                                    { label: 'Lavagem', icon: 'bi-droplet', query: 'lavagem' },
                                    { label: 'Polimentos', icon: 'bi-brush', query: 'polimentos' },
                                    { label: 'Higienização', icon: 'bi-shield-check', query: 'higienizacao' },
                                    { label: 'Vitrificação', icon: 'bi-gem', query: 'vitrificacao' },
                                    { label: 'Proteções', icon: 'bi-shield-fill', query: 'protecao' },
                                ].map(({ label, icon, query }) => (
                                    <li key={query}>
                                        <Link to={`${ROUTES.BUSCA}?pesquisa=${query}`} onClick={scrollToTop} className={linkClass}>
                                            <i className={`bi ${icon} mr-2`}></i>{label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Coluna 3 — Contato */}
                        <div className="flex flex-col lg:col-span-1">
                            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-[#B30000] pb-2 w-fit">Contato</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { icon: 'bi-geo-alt', label: 'Endereço', content: <p>R. Alcatifa, 81<br />São Paulo, SP - 03583-030</p> },
                                    { icon: 'bi-telephone', label: 'Telefone', content: <p><a href="tel:+55 11 96659-4782" className="text-gray-300 hover:text-[#B30000]">(11) 96659-4782</a></p> },
                                    { icon: 'bi-clock', label: 'Horário', content: <p>Seg-Sex: 8h30 às 17h30<br />Sáb: 9h às 13h</p> },
                                ].map(({ icon, label, content }) => (
                                    <div key={label} className="flex gap-4 items-start">
                                        <i className={`bi ${icon} ${contactIconClass}`}></i>
                                        <div className="text-sm text-gray-300">
                                            <strong className="text-white">{label}:</strong>
                                            {content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rodapé inferior */}
                <div className="border-t border-gray-700 py-4 md:py-6 px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 text-center">
                        <p>© {anoAtual} Rick Estética Automotiva. Todos os direitos reservados.</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Link to="/politica-privacidade" className="text-gray-400 hover:text-[#B30000] no-underline">Política de Privacidade</Link>
                            <span>|</span>
                            <Link to="/termos-uso" className="text-gray-400 hover:text-[#B30000] no-underline">Termos de Uso</Link>
                            <span>|</span>
                            <Link to="/cookies" className="text-gray-400 hover:text-[#B30000] no-underline">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}