import imgCarro from '../../assets/carroBanner.png';
import { smoothScrollTo } from '../../utils/scroll';

export function Banner({ scrollTargetRef }) {
    const handleVerServicos = () => {
        const target = scrollTargetRef?.current;
        if (target) {
            const rect = target.getBoundingClientRect();
            const offsetTop = window.scrollY + rect.top - 100;
            smoothScrollTo(offsetTop, 1000);
        }
    };

    return (
        <div className="hero-banner bg-gradient-to-br from-[#5C0000] via-[#B30000] to-[#8B0000] py-12 md:py-16 relative overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">

                {/* Texto */}
                <div className="text-white text-center md:text-left animate-[fade-in-left_1s_ease-out]">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 md:mb-6">
                        Estética Automotiva de{' '}
                        <span className="text-red-300">Excelência</span>
                    </h1>
                    <p className="text-base sm:text-lg leading-relaxed mb-6 md:mb-8 opacity-90">
                        Transforme seu veículo com nossos serviços profissionais de lavagem, enceramento e proteção.
                        Cuidado premium para seu carro.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <button
                            className="flex items-center bg-white text-[#B30000] px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            onClick={handleVerServicos}
                        >
                            <i className="bi bi-search mr-2"></i>
                            Ver Serviços
                        </button>
                        <a
                            href="https://wa.me/5511966594782"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center bg-transparent text-white border-2 border-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold no-underline transition-all hover:bg-white hover:text-[#B30000] hover:-translate-y-0.5"
                        >
                            <i className="bi bi-whatsapp mr-2"></i>
                            Falar Conosco
                        </a>
                    </div>
                </div>

                {/* Imagem */}
                <div className="flex justify-center items-center animate-[fade-in-right_1s_ease-out] order-first md:order-last">
                    <img src={imgCarro} alt="Carro" className="w-full max-w-md md:max-w-full h-auto" />
                </div>
            </div>
        </div>
    );
}