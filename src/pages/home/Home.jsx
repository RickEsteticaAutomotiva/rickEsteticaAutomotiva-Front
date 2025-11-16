import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import { servicosService } from '../../services/ServicosService';
import { useState, useEffect } from 'react';
import "./Home.css";
import { LoadingState } from "../../components/loading-state/LoadingState";
import { Banner } from "../../components/banner/Banner";
import { CarroselServicos } from "../../components/carrosel-servicos/CarroselServicos";
import { CategoriaService } from "../../services/CategoriaService";

export function Home() {
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const categoriaService = new CategoriaService();

    useEffect(() => {
        buscarCategorias();
    }, []);

    const buscarCategorias = async () => {
        setLoading(true);
        try {
            const data = await categoriaService.buscarTodas();
            setCategorias(data || []);
        } catch (error) {
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <>
            <Header />
            <Banner />

            <div className="home-container">
                <div className="home-content">
                    {categorias.length > 0 ? (
                        <>
                            {categorias.map((categoria) => (
                                <div key={categoria.id} className="categoria-section">
                                    <CarroselServicos
                                        categoria={categoria.nome}
                                        titulo={categoria.nome}
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="empty-state">
                            <i className="bi bi-search text-6xl text-gray-300 mb-4"></i>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Nenhum serviço encontrado
                            </h3>
                            <p className="text-gray-500">
                                Não conseguimos encontrar serviços no momento. Tente novamente mais tarde.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}