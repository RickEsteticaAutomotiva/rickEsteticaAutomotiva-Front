import { Header } from "../../components/header/Header";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from "../../constants/routes";
import { LoadingState } from "../../components/loading-state/LoadingState";
import { useState } from "react";

export function Carrinho() {
    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 300);

    if (loading) {
        return (
            <LoadingState />
        );
    }

    return (
        <>
            <Header />

            <div className="flex px-16 py-10 justify-between gap-10">
                <div className="carrinho py-5 bg-white rounded shadow-md w-3/5 h-fit">
                    <div className="flex flex-col items-start mb-4 border-b border-gray-300 pb-2 px-5">
                        <h1 className="font-bold text-lg">Carrinho de serviços</h1>
                        <div className="text-sm text-gray-400 w-full flex justify-between">
                            <p>Serviço</p>
                            <p>A partir de</p>
                        </div>
                    </div>

                    <div className="carrinho-itens px-5">
                        <ul>
                            <li className="py-2 border-b border-gray-200 flex gap-3 items-start">
                                <img src="" alt="" className="h-20 w-20" />

                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex justify-between w-full">
                                        <p className="font-bold">Serviço 1</p>
                                        <p>R$ 100,00</p>
                                    </div>

                                    <button className="text-red-600 hover:text-red-800 cursor-pointer w-fit"><i class="bi bi-trash3"></i> Remover do carrinho</button>
                                </div>
                            </li>

                            <li className="py-2 border-b border-gray-200 flex gap-3 items-start">
                                <img src="" alt="" className="h-20 w-20" />

                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex justify-between w-full">
                                        <p className="font-bold">Serviço 2</p>
                                        <p>R$ 70,00</p>
                                    </div>

                                    <button className="text-red-600 hover:text-red-800 cursor-pointer w-fit"><i class="bi bi-trash3"></i> Remover do carrinho</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="resumo-pedido py-5 bg-white rounded shadow-md w-1/3 h-fit">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2 px-5">
                        <h1 className="font-bold text-lg">Resumo do pedido</h1>
                    </div>

                    <div className="px-5 flex flex-col gap-4">
                        <div className="flex justify-between mb-2">
                            <p>Valor mínimo:</p>
                            <p className="font-bold">R$ 300,00</p>
                        </div>
                        <Link to={ROUTES.VEICULOS} className="bg-red-600 font-bold text-white py-2 px-4 rounded w-full hover:bg-red-700 cursor-pointer text-center">Agendar serviço</Link>
                    </div>
                </div>
            </div>
        </>
    );
}