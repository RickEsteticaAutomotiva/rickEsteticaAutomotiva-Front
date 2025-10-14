import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import { servicosService } from '../../services/ServicosService';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { CardServico } from "../../components/card-servico/CardServico";
import "./Home.css";

export function Home() {
    const [loading, setLoading] = useState(true);
    const [servicos, setServicos] = useState(null);

    useEffect(() => {
        listarServicos();
    }, []);

    const listarServicos = async () => {
        setLoading(true);
        try {
            const data = await servicosService.buscarTodos();
            setServicos(data);
        } catch (error) {
            console.error('Erro ao buscar serviço:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />

            <div style={{ height: 'fit-content', padding: '2rem 0' }} className="flex flex-col justify-center items-center">
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-red-600" role="status">
                            <span className="sr-only">Carregando...</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {servicos && servicos.map(servico => (
                            <CardServico
                                key={servico.id}
                                id={servico.id}
                                nome={servico.nome}
                                preco={servico.preco}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}