import { useState, useEffect } from 'react';
import { CardServico } from '../card-servico/CardServico';
import { servicosService } from '../../services/ServicosService';
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';

export function CarroselServicos({ categoria, titulo }) {
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const { mostrarToast } = useToast();

    useEffect(() => {
        buscarServicosPorCategoria();
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [categoria]);

    const handleResize = () => {
        const width = window.innerWidth;
        if (width < 640) {
            setItemsPerView(1);
        } else if (width < 768) {
            setItemsPerView(2);
        } else if (width < 1024) {
            setItemsPerView(3);
        } else {
            setItemsPerView(4);
        }
    };

    const buscarServicosPorCategoria = async () => {
        setLoading(true);
        try {
            const data = await servicosService.buscarPorCategoria(categoria);
            const servicosArray = data?.content || [];
            console.log(`Serviços categoria ${categoria}:`, servicosArray);
            setServicos(servicosArray);
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao carregar serviços',
                mensagem: 'Não foi possível carregar os serviços. Tente recarregar a página.',
                duracao: 4000
            });
            setServicos([]);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setCurrentIndex(prev => {
            const maxIndex = servicos.length - itemsPerView;
            return Math.min(prev + 1, maxIndex);
        });
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const goToSlide = (index) => {
        const maxIndex = servicos.length - itemsPerView;
        setCurrentIndex(Math.min(index, maxIndex));
    };

    if (loading) {
        return (
            <div className="w-full my-8 px-2 sm:px-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">{titulo}</h2>
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin mb-4" />
                    <p>Carregando serviços...</p>
                </div>
            </div>
        );
    }

    if (!servicos) {
        return (
            <div className="w-full my-8 px-2 sm:px-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">{titulo}</h2>
                <div className="text-center py-12 text-gray-500">
                    <p>Nenhum serviço encontrado nesta categoria</p>
                </div>
            </div>
        );
    }

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex + itemsPerView < servicos.length;

    return (
        <div className="w-full my-8 px-2 sm:px-4">
            {/* Header com título e botões */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 m-0">{titulo}</h2>
                <div className="flex gap-2">
                    <button
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-red-600 bg-white text-red-600 flex items-center justify-center cursor-pointer transition-all text-lg hover:bg-red-600 hover:text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-red-600 disabled:hover:scale-100`}
                        onClick={prevSlide}
                        disabled={!canGoPrev}
                        aria-label="Anterior"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-red-600 bg-white text-red-600 flex items-center justify-center cursor-pointer transition-all text-lg hover:bg-red-600 hover:text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-red-600 disabled:hover:scale-100`}
                        onClick={nextSlide}
                        disabled={!canGoNext}
                        aria-label="Próximo"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            {/* Carrossel */}
            <div className="relative overflow-hidden rounded-xl py-4">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }}
                >
                    {servicos.map((servico) => (
                        <div
                            key={servico.id}
                            className="flex-shrink-0 px-1 sm:px-2"
                            style={{ width: `${100 / itemsPerView}%`, minWidth: `${100 / itemsPerView}%` }}
                        >
                            <CardServico
                                id={servico.id}
                                nome={servico.nome}
                                preco={servico.preco}
                                categoria={servico.categoria}
                                imagem={servico.imagem}
                                descricao={servico.descricao}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}