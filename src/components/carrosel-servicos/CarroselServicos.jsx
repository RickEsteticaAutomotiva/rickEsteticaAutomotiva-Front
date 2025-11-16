import { useState, useEffect } from 'react';
import { CardServico } from '../card-servico/CardServico';
import { servicosService } from '../../services/ServicosService';
import './CarroselServicos.css';

export function CarroselServicos({ categoria, titulo }) {
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);

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
            setServicos(servicosArray);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
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
            <div className="carrossel-container">
                <h2 className="carrossel-titulo">{titulo}</h2>
                <div className="carrossel-loading">
                    <div className="spinner"></div>
                    <p>Carregando serviços...</p>
                </div>
            </div>
        );
    }

    if (!servicos) {
        return (
            <div className="carrossel-container">
                <h2 className="carrossel-titulo">{titulo}</h2>
                <div className="carrossel-empty">
                    <p>Nenhum serviço encontrado nesta categoria</p>
                </div>
            </div>
        );
    }

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex + itemsPerView < servicos.length;

    return (
        <div className="carrossel-container">
            <div className="carrossel-header">
                <h2 className="carrossel-titulo">{titulo}</h2>
                <div className="carrossel-controls">
                    <button 
                        className={`carrossel-btn carrossel-btn-prev ${!canGoPrev ? 'disabled' : ''}`}
                        onClick={prevSlide}
                        disabled={!canGoPrev}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button 
                        className={`carrossel-btn carrossel-btn-next ${!canGoNext ? 'disabled' : ''}`}
                        onClick={nextSlide}
                        disabled={!canGoNext}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="carrossel-wrapper">
                <div 
                    className="carrossel-track"
                    style={{
                        transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                    }}
                >
                    {servicos.map((servico) => (
                        <div 
                            key={servico.id} 
                            className="carrossel-item"
                            style={{ 
                                width: `${100 / itemsPerView}%`,
                                minWidth: `${100 / itemsPerView}%`
                            }}
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