import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import { useState, useEffect, useRef } from 'react';
import { LoadingState } from "../../components/loading-state/LoadingState";
import { Banner } from "../../components/banner/Banner";
import { CarroselServicos } from "../../components/carrosel-servicos/CarroselServicos";
import { CategoriaService } from "../../services/CategoriaService";

// Singleton — mesma instância reutilizada em todos os renders
const categoriaService = new CategoriaService();

export function Home() {
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);
    const homeContentRef = useRef(null);

    useEffect(() => {
        buscarCategorias();
    }, []);

    const buscarCategorias = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await categoriaService.buscarTodas();
            console.log('Categorias carregadas:', data);
            setCategorias(data || []);
        } catch (err) {
            setError('Não foi possível carregar os serviços. Tente novamente.');
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center py-20 flex-col gap-4">
                    <i className="bi bi-exclamation-circle text-4xl text-red-500"></i>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={buscarCategorias}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <Banner scrollTargetRef={homeContentRef} />

            <div className="min-h-[calc(100vh-160px)] bg-gray-50 py-8">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8" ref={homeContentRef}>
                    {categorias.length > 0 ? (
                        <>
                            {categorias.map((categoria) => (
                                <div key={categoria.id} className="mb-8">
                                    <CarroselServicos
                                        categoria={categoria.nome}
                                        titulo={categoria.nome}
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <i className="bi bi-search text-6xl text-gray-300 mb-4 block"></i>
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