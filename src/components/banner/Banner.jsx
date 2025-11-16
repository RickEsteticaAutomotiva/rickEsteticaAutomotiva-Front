import './Banner.css';
import imgCarro from '../../assets/carroBanner.png';
import { smoothScrollTo } from '../../utils/scroll';

export function Banner() {
    const handleVerServicos = () => {
        const homeContent = document.querySelector('.home-content');
        if (homeContent) {
            const rect = homeContent.getBoundingClientRect();
            const offsetTop = window.pageYOffset + rect.top - 100;
            smoothScrollTo(offsetTop, 1000);
        }
    };

    return (
        <>
            <div className="hero-banner">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Estética Automotiva de <span className="text-red-600">Excelência</span>
                        </h1>
                        <p className="hero-subtitle">
                            Transforme seu veículo com nossos serviços profissionais de lavagem, enceramento e proteção.
                            Cuidado premium para seu carro.
                        </p>
                        <div className="hero-buttons">
                            <button
                                className="btn-hero-primary"
                                onClick={handleVerServicos}
                            >
                                <i className="bi bi-search mr-2"></i>
                                Ver Serviços
                            </button>
                            <a href="#contato" className="btn-hero-secondary">
                                <i className="bi bi-whatsapp mr-2"></i>
                                Falar Conosco
                            </a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-image-placeholder">
                            <img src={imgCarro} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};