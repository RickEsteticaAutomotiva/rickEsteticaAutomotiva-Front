import './Banner.css';
import imgCarro from '../../assets/carroBanner.png';

export function Banner() {
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
                                onClick={() => document.querySelector('.servicos-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <i className="bi bi-search mr-2"></i>
                                Ver Serviços
                            </button>
                            <a href="#contato" className="btn-hero-secondary">
                                <i className="bi bi-phone mr-2"></i>
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