import { ChevronDown, Search, Plus, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { OrdemServicoItem } from './ordem-servico-item/OrdemServicoItem';
import { ModalOrdemServico } from '../agendamento/modal-ordem-servico/ModalOrdemServico';
import { DropdownButton } from '../../../components/gerente/dropdown-button/DropdownButton';
import { ModalFiltro } from './modal-filtro/ModalFiltro';



export function OrdensServico() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState({ id: 3, valor: 'Mês' });
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [modalFiltroAberto, setModalFiltroAberto] = useState(false);
    const [modalAbertoOrdem, setModalAbertoOrdem] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState([]);
    const [filtrosAplicados, setFiltrosAplicados] = useState({});
    
    const periodos = [
        { id: 1, valor: 'Dia' },
        { id: 2, valor: 'Semana' },
        { id: 3, valor: 'Mês' },
        { id: 4, valor: 'Ano' }
    ];
    
    const abrirModal = (ordem) => {
        console.log('Item clicado:', ordem);
        setOrdemSelecionada(ordem);
        setModalAbertoOrdem(true);
    };

    const fecharModal = () => {
        setModalAbertoOrdem(false);
        setOrdemSelecionada([]);
    };

    const handleAplicarFiltros = (filtros) => {
        console.log('Filtros aplicados:', filtros);
        setFiltrosAplicados(filtros);
        // Aqui você pode fazer a requisição à API com os filtros
    };

    const contarFiltrosAtivos = () => {
        return Object.values(filtrosAplicados).filter(valor => valor !== '').length;
    };

    const ordensServico = [
        { tipo: 'Polimento', cliente: 'Guilherme Serafim' },
        { tipo: 'Lavagem simples', cliente: 'Marcelo Henrique' },
        { tipo: 'Polimento', cliente: 'Samuel Beiarmino' },
        { tipo: 'Lavagem simples', cliente: 'Moisés Henry' },
        { tipo: 'Polimento', cliente: 'Guilherme Serafim' },
        { tipo: 'Lavagem simples', cliente: 'Marcelo Henrique' },
        { tipo: 'Polimento', cliente: 'Samuel Beiarmino' }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-2 ps-4">
                <span className="text-sm font-medium">Período</span>
                <div className="relative">
                   <DropdownButton
                        valorSelecionado={periodoSelecionado}
                        setValorSelecionado={setPeriodoSelecionado}
                        dropdownAberto={dropdownAberto}
                        setDropdownAberto={setDropdownAberto}
                        valores={periodos}                
                    />
                </div>
            </div>

            <div 
                className="flex items-center justify-between mb-4 bg-white rounded-2xl p-4 cursor-pointer"
                onClick={() => setModalFiltroAberto(true)}
            >
                <span className="text-sm">Filtros ({contarFiltrosAtivos()})</span>
                <button>
                    <Search size={20} />
                </button>
            </div>
        
            <div className="pt-4 space-y-3">
                {ordensServico.map((ordem, index) => (
                    <OrdemServicoItem
                        key={index} 
                        ordem={ordem} 
                        onItemClick={abrirModal} 
                    />
                ))}
            </div>

            {/* Botão Nova Ordem */}
            <div className="sticky bottom-4 mt-8 left-4 right-4 z-10">
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow-lg">
                    Nova ordem de serviço
                </button>
            </div>

            {/* Modal de Filtro */}
            <ModalFiltro
                isOpen={modalFiltroAberto}
                onClose={() => setModalFiltroAberto(false)}
                onAplicarFiltros={handleAplicarFiltros}        
            />
        </div>
    );
}